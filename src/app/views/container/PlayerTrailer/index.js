/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import React from "react";
import BaseContainer from "core/BaseContainer/";
import {connect} from "react-redux";
import {isMobile, isIOS, isSafari} from "react-device-detect";
import CircularProgressbar from "react-circular-progressbar";
import Swiper from "core/components/Swiper";
import ImageThumbnail from "app/views/components/ImageThumbnail";
import {
  PLAYER_PROGRESS_UPDATE_INTERVAL,
  PLAYER_REWIND_DURATION,
  LOGIN,
  PLAYER_QUALITY_HD_MIN_VALUE,
  RTL,
  AR_CODE,
  PLAYER,
  EPISODE,
  MOVIE,
  SERIES,
  UPDATE_WATCHING_INTERVAL,
  IMAGE_DIMENSIONS,
  PLAYER_LANDSCAPE_MIN_WIDTH,
  SHARE_PLAYER_ACTION,
  VIDEO_ADS_CATEGORY,
  VIDEO_ADS_ACTION,
  CONFIG_AD_PROPERTY,
  SHARE_CATEGORY,
  VIDEO_CATEGORY,
  VIDEO_COMPLETED_ACTION,
  VIDEO_START_EPISODE_ACTION,
  VIDEO_START_MOVIE_ACTION,
  PLAY_VIDEO_ACTION,
  PAUSE_VIDEO_ACTION,
  VIDEO_STOP_ACTION,
  VIDEO_COMPLETED_PERCENTAGE,
  WATCHED_DURATION_CATEGORY,
  WATCHED_PERIOD_ACTION,
  PLAYER_CONTROL_CATEGORY,
  BIT_RATE_ACTION,
  FULL_SCREEN_ACTION,
  RELATED_SELECT_ACTION,
  ADD_PLAYLIST_CATEGORY,
  RESUME_PATH_COOKIE_NAME,
  COOKIES_TIMEOUT_NOT_REMEMBER,
  MY_PLAYLIST_TOAST_ID,
  COOKIE_USER_TOKEN,
  VIDEO_TRAILERS_CATEGORY,
  VIDEO_TRAILER_STARTED,
  VIDEO_TRAILER_COMPLETED,
  FORWARD,
  BACKWARD,
  VIDEO_TRAILER_PLAY,
  VIDEO_TRAILER_PAUSE,
  VIDEO_TRAILER_STOP
} from "app/AppConfig/constants";
import VideoSpinner from "core/components/VideoSpinner";
import VideoPlayer from "core/components/VideoPlayer";
import {toast} from "core/components/Toaster/";
import {
  ENABLE_VIDEO_ADVERTISEMENT,
  ENABLE_CUSTOM_CONTROLS,
  ENABLE_MUTED_AUTOPLAY
} from "app/AppConfig/features";
import * as actionTypes from "app/store/action/";
import {
  getCookie,
  getServerCookie,
  setCookie,
  getDirection,
  capitalizeFirstLetter,
  getAdType,
  fnConstructContentURL,
  fnNavTo,
  getNavigationPathForPremiumContent,
  fnConstructTranslatedTitle,
  isUserSubscribed,
  showToast
} from "app/utility/common";
import oResourceBundle from "app/i18n/";
import * as common from "app/utility/common";
import withTracker from "core/GoogleAnalytics/";
import Logger from "core/Logger";
import fallbackEn from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import fallbackAr from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import playlistHover from "app/resources/assets/video-player/playlist_button_hover.svg";
import playlistRemoveHover from "app/resources/assets/video-player/playlist_button_remove_hover.svg";
import fullscreenHover from "app/resources/assets/video-player/fullscreen_button_mobile_hover.svg";
import pauseHover from "app/resources/assets/video-player/pause_button_hover.svg";
import shareHover from "app/resources/assets/video-player/share_button_hover.svg";
import facebook from "app/resources/assets/video-content/fb.svg";
import twitter from "app/resources/assets/video-content/twitter.svg";
import {sendEvents} from "core/GoogleAnalytics/";

import "./index.scss";

// TODO find a way to not use zplayer here
class PlayerTrailer extends BaseContainer {
  MODULE_NAME = "Player";

  constructor(props) {
    super(props);
    this.disableAutoplay =
      !this.props.oPageContent && !this.props.oVideoDetailContent;
    Logger.log(this.MODULE_NAME, "disableAutoplay: " + this.disableAutoplay);
    let autoplay;
    if (this.disableAutoplay) {
      if (ENABLE_MUTED_AUTOPLAY) {
        autoplay = "muted";
      } else {
        autoplay = false;
      }
    } else {
      autoplay = true;
    }
    this.forcePlayed = false;

    this.state = {
      paused: isIOS ? true : false,
      muted: false,
      autoplay: autoplay,
      fullScreen: false,
      qualityLevels: null,
      currentQualityLevel: -1,
      showQuality: false,
      showSharePopup: false,
      currentCarouselIndex: 0,
      showPlayerCarousel: false,
      translatedTitle: false,
      errorOccurred: false,
      showSpinner: true,
      adInProgress: false,
      disableAutoplay: this.disableAutoplay,
      geoBlock: false,
      showNextEpisodeCounter: false,
      nextEpisodeCounter: 0,
      playerReady: false,
      videoEnded: false,
      seriesInfo: null,
      showPlayIcon: isIOS ? true : false,
      showSubscriptionBanner: false,
      videocurrentTime:"",
      season_number:null,
      trailer_number:null,
      orientation:
        window.innerWidth > window.innerHeight &&
        window.innerWidth > PLAYER_LANDSCAPE_MIN_WIDTH
          ? 90
          : 0
    };
    this.subscriptionBannerShown = false;
    this.areControlsDragging = false;
    this.props.fnUpdatePlayerScreenState(true);
    this.playIconTimer = -1;
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
    this.checkedSubscription = false;
  }

  /**
   * Update only when previous props are different to current props.
   * Without this player will start playing previous content
   * @param {Object} nextProps
   * @param {Object} nextState
   */
  // shouldComponentUpdate(nextProps, nextState) {
  //   Logger.log(this.MODULE_NAME, 'nextProps: ' + nextProps.match.params.id)
  //   if (this.props.match.params.id !== nextProps.match.params.id) {
  //     Logger.log(this.MODULE_NAME, 'updating')
  //     // return true
  //   }
  //   Logger.log(this.MODULE_NAME, 'not  updating')
  //   return true
  // }

  componentDidUpdate(prevProps) {

    window.localStorage.setItem("tvideo",`${this.state.season_number}:${this.state.trailer_number}`)

    //Check if user is subscribed or not
    // if (!this.checkedSubscription && this.props.isMENARegion !== undefined) {
    //   this.checkedSubscription = true;
    //   isUserSubscribed().then(isUserSubscribed => {
    //     if (isUserSubscribed || this.props.sResumePagePath) {
    //       this.checkContent(prevProps);
    //     } else {
    //       this.bCheckSubscription = true;
    //       const sNextPath = getNavigationPathForPremiumContent(
    //         this.props.isMENARegion ? "AVOD" : "SVOD",
    //         this.props.digitalRights == 3 ? 3 : 1,
    //         this.props.locale,
    //         this.props.location.pathname
    //       );
    //       sNextPath.then(sPath => {
    //         if (sPath) {
    //           this.props.fnUpdateResumePagePath(this.props.location.pathname);
    //           fnNavTo.call(this, sPath, true);
    //         }
    //       });
    //     }
    //   });
    // } else {
    //   this.checkContent(prevProps);
    // }
  }

  /**
   * Component Name - Player
   * Executes when component mounted to DOM.
   */
  componentDidMount() {

    let trailerNum = window.localStorage.getItem("tvideo")

    if(trailerNum){
      let [season_number,trailer_number] = trailerNum.split(":")

      this.setState({
        season_number,
        trailer_number
      })
    }


    Logger.log(this.MODULE_NAME, "componentDidMount");
    this.playistAPIfired = false;
    var country = this.props.sCountryCode == ""? "AE":this.props.sCountryCode ;
    if (country) {
      this.setState({
        geoBlock: false
      });
      this.subscriptionBannerShown = false;
      this.props.fnFetchTrailerVideoUrlDetails(
        this.props.locale,
        this.props.match.params.trailerid,
        this.props.match.params.id,
        this.props.match.params.type,
        country,
        this.videoInfoReceived.bind(this)
      );
    }
    this.props.fnGetuserPlaylistData();
    this.updateWindowDimensions();
    document.addEventListener("fullscreenchange", this.onFullscreenChange);
    window.addEventListener("resize", this.updateWindowDimensions);
    this.bCheckSubscription = false;
  }

  /**
   * destroy player on unmount
   */
  componentWillUnmount() {
    Logger.log(this.MODULE_NAME, "componentWillUnmount");
    const {id, name, type} = this.props.match.params;
    this.updateWatchingProgress(true);
    this.cancelWatchingTimer();
    clearInterval(this.nextEpisodeTimer);
    this.props.fnUpdatePlayerScreenState(false);
    this.props.fnResetVideoUrlDetails();
    document.removeEventListener("fullscreenchange", this.onFullscreenChange);
    window.removeEventListener("resize", this.updateWindowDimensions);


    window.localStorage.removeItem("tvideo")

    sendEvents(
      VIDEO_TRAILERS_CATEGORY,
      VIDEO_TRAILER_STOP,
      this.fnlabelname(this.props.videoInfo)
    );

    //Send analytics event
    // if (this.props.videoInfo && this.props.videoInfo.videoInfo) {
    //   const {
    //     episode_number,
    //     season_number,
    //     title
    //   } = this.props.videoInfo.videoInfo.data.data;
    //   if (type !== EPISODE) {
    //     sendEvents(
    //       WATCHED_DURATION_CATEGORY,
    //       WATCHED_PERIOD_ACTION,
    //       name ? name : id,
    //       this.videoPlayedDuration
    //     );
    //   } else {
    //     sendEvents(
    //       WATCHED_DURATION_CATEGORY,
    //       WATCHED_PERIOD_ACTION,
    //       `${title ? title : id} | ${
    //         oResourceBundle.season
    //       } ${season_number} | ${oResourceBundle.episode} ${episode_number}`,
    //       this.videoPlayedDuration
    //     );
    //   }
    // }

  }

  fnlabelname(props){

    const {id, name, type} = this.props.match.params;
    const {
      title,
      seasons
    } = props.videoInfo.data.data;

    let LableName = ""
     if(type == "movie" || type == "play"){
      LableName = name ? `${name} | ${oResourceBundle.trailers} ${this.state.trailer_number}` : id
     } else{
      LableName = `${title ? title : id} | ${oResourceBundle.season} ${this.state.season_number} | ${oResourceBundle.trailers} ${this.state.trailer_number} ` 
     }

       return LableName
  }


  checkContent(prevProps) {
    const {type} = this.props.match.params;
    const prevId = prevProps.match.params.id;
    const prevName = prevProps.match.params.name;
    if (this.props.locale !== prevProps.locale) {
      this.setState({
        showSharePopup: false,
        showPlayerCarousel: false,
        showQuality: false,
        translatedTitle: !this.state.translatedTitle
      });
      let title = "";
      if (this.props.videoInfo) {
        if (this.state.translatedTitle) {
          title = this.props.videoInfo.videoInfo.data.data.title;
        } else {
          title = this.props.videoInfo.videoInfo.data.data.translated_title
            ? this.props.videoInfo.videoInfo.data.data.translated_title
            : this.props.videoInfo.videoInfo.data.data.title;
        }

        const data = JSON.parse(
          JSON.stringify(this.props.videoInfo.videoInfo.data.data)
        );
        data.title = title;
        if (this.getContentType(this.props.videoInfo.videoInfo) === MOVIE) {
          data.content_type = MOVIE;
        } else if (
          this.getContentType(this.props.videoInfo.videoInfo) === EPISODE
        ) {
          data.content_type = EPISODE;
        }
      }

      // this.fetchCarouselData();

      if (this.swiper) {
        this.swiper.reset();
      }
    }
    if (
      this.props.match.params.id !== prevProps.match.params.id ||
      this.props.sCountryCode !== prevProps.sCountryCode
    ) {
      Logger.log(this.MODULE_NAME, "updating");
      this.setState({
        geoBlock: false
      });
      this.setState({
        playerReady: false,
        showSpinner: true,
        videoEnded: false,
        nextEpisodeCounter: 0,
        showNextEpisodeCounter: false
      });
      clearTimeout(this.nextEpisodeTimer);
      if (isIOS) {
        this.setState({
          showPlayIcon: true,
          paused: true
        });
      }
      this.subscriptionBannerShown = false;
      this.props.fnFetchTrailerVideoUrlDetails(
        this.props.locale,
        this.props.match.params.trailerid,
        this.props.match.params.id,
        this.props.match.params.type,
        this.props.sCountryCode,
        this.videoInfoReceived.bind(this)
      );
      if (this.swiper) {
        this.swiper.reset();
      }
      //Send analytics event
      // if (this.props.match.params.id !== prevProps.match.params.id) {
      //   const {
      //     episode_number,
      //     season_number,
      //     title
      //   } = prevProps.videoInfo.videoInfo.data.data;
      //   if (type !== EPISODE) {
      //     sendEvents(
      //       WATCHED_DURATION_CATEGORY,
      //       WATCHED_PERIOD_ACTION,
      //       prevName ? prevName : prevId,
      //       this.videoPlayedDuration
      //     );
      //   } else {
      //     sendEvents(
      //       WATCHED_DURATION_CATEGORY,
      //       WATCHED_PERIOD_ACTION,
      //       `${title ? title : prevId} | ${
      //         oResourceBundle.season
      //       } ${season_number} | ${oResourceBundle.episode} ${episode_number}`,
      //       this.videoPlayedDuration
      //     );
      //   }
      // }
    }
  }

  bigPlayIconClick() {
    Logger.log(this.MODULE_NAME, "bigPlayIconClick");
    this.setState({
      showSpinner: true,
      showPlayIcon: false
    });
  }
  /**
   * called when player is ready
   */
  onPlayerReady() {
    Logger.log(this.MODULE_NAME, "onPlayerReady: " + (isIOS || isSafari));
    // if (isIOS || isSafari) {
    //   this.setState({
    //     showSpinner: false
    //   });
    // }
    this.isPlayerLoading = true;
  }

  onCanPlayThrough() {
    Logger.log(this.MODULE_NAME, "onCanPlayThrough");
    this.setState({
      errorOccurred: false,
      showSpinner: false
    });
  }

  onFirstFrameLoaded() {
    Logger.log(this.MODULE_NAME, "onFirstFrameLoaded");
    const {id, type} = this.props.match.params;
    this.bVideoCompleted = false;
    this.setState({
      playerReady: true
    });
    //Send analytics event

    const {
      episode_number,
      season_number,
      title
    } = this.props.videoInfo.videoInfo.data.data;

    sendEvents(
      VIDEO_TRAILERS_CATEGORY,
      VIDEO_TRAILER_STARTED,
      this.fnlabelname(this.props.videoInfo)
    );

    // if (type === EPISODE) {
    //   sendEvents(
    //     VIDEO_CATEGORY,
    //     VIDEO_START_EPISODE_ACTION,
    //     `${title ? title : id} | ${oResourceBundle.season} ${season_number} | ${
    //       oResourceBundle.episode
    //     } ${episode_number}`
    //   );
    // } else {
    //   sendEvents(VIDEO_CATEGORY, VIDEO_START_MOVIE_ACTION, title ? title : id);
    // }

    this.setState({
      showSpinner: false
    });
    if (!this.state.adInProgress) {
      this.setState({
        showControls: true
      });
    }
  }

  updateVideoPlayedDuration(videoPlayedDuration) {
    this.videoPlayedDuration = videoPlayedDuration;
  }

  onTimeUpdate(time) {
    Logger.log(this.MODULE_NAME, "onTimeUpdate " + this.state.videoEnded);
    if (!this.state.videoEnded) {
      const {currentTime, duration} = time.target.player.cache_;
      const {id, type} = this.props.match.params;
      // Logger.log(this.MODULE_NAME, 'onTimeUpdate: ' + (currentTime / duration * 100));
      // Holds the watched video duration
      this.videoPlayedDuration = currentTime;
      clearTimeout(this.playIconTimer);

      // clearTimeout(this.nextEpisodeTimer);
      this.setState({
        paused: false,
        showSpinner: false,
        showPlayIcon: false,
        nextEpisodeCounter: 0,
        showNextEpisodeCounter: false
      });

      //Calculate % duration
      if (
        (currentTime / duration) * 100 > VIDEO_COMPLETED_PERCENTAGE &&
        !this.bVideoCompleted
      ) {
        const {
          episode_number,
          season_number,
          title
        } = this.props.videoInfo.videoInfo.data.data;
        //Send analytics event
        sendEvents(
          VIDEO_TRAILERS_CATEGORY,
          VIDEO_TRAILER_COMPLETED,
          this.fnlabelname(this.props.videoInfo)
        );


        // if (type === EPISODE) {
        //   sendEvents(
        //     VIDEO_CATEGORY,
        //     VIDEO_COMPLETED_ACTION,
        //     `${title ? title : id} | ${
        //       oResourceBundle.season
        //     } ${season_number} | ${oResourceBundle.episode} ${episode_number}`
        //   );
        // } else {
        //   sendEvents(
        //     VIDEO_CATEGORY,
        //     VIDEO_COMPLETED_ACTION,
        //     title ? title : id
        //   );
        // }

        this.bVideoCompleted = true;
      }

      this.setState({
        videocurrentTime:currentTime
      })

    }
  }

  onLoadedData() {
    Logger.log(this.MODULE_NAME, "onLoadedData");
  }

  onUserActive() {
    Logger.log(this.MODULE_NAME, "onUserActive");
    if (!this.state.adInProgress && this.state.playerReady) {
      this.setState({
        showControls: true
      });
    }
  }

  onUserInactive() {
    Logger.log(this.MODULE_NAME, "onUserInactive");
    if (
      !this.mouseOnControls &&
      !this.state.paused &&
      this.state.playerReady &&
      !this.areControlsDragging
    ) {
      this.setState({
        showControls: false,
        showQuality: false,
        showPlayerCarousel: false,
        showSharePopup: false
      });
    }
  }

  onPause() {
    Logger.log(this.MODULE_NAME, "onPause");
    const {id, type} = this.props.match.params;
    if (this.state.showNextEpisodeCounter) {
      return;
    }
    //Send analytics event
    const {
      episode_number,
      season_number,
      title
    } = this.props.videoInfo.videoInfo.data.data;

    sendEvents(
      VIDEO_TRAILERS_CATEGORY,
       VIDEO_TRAILER_PAUSE,
       this.fnlabelname(this.props.videoInfo)
     );



    // if (type !== EPISODE) {
    //   sendEvents(
    //     VIDEO_CATEGORY,
    //     `${PAUSE_VIDEO_ACTION}${type}`,
    //     title ? title : id
    //   );
    // } else {
    //   sendEvents(
    //     VIDEO_CATEGORY,
    //     `${PAUSE_VIDEO_ACTION}${type}`,
    //     `${title ? title : id} | ${oResourceBundle.season} ${season_number} | ${
    //       oResourceBundle.episode
    //     } ${episode_number}`
    //   );
    // }
    this.cancelWatchingTimer();
    this.setState({
      paused: true,
      showSpinner: false
    });
  }

  onPlay() {
    Logger.log(this.MODULE_NAME, "onPlay");
    const {type, id} = this.props.match.params;

    if (this.state.showNextEpisodeCounter) {
      return;
    }

    this.setState({
      paused: false
    });

    sendEvents(
      VIDEO_TRAILERS_CATEGORY,
      VIDEO_TRAILER_PLAY,
      this.fnlabelname(this.props.videoInfo)
    );


    if (!this.isPlayerLoading) {
      //Send analytics event
      const {
        episode_number,
        season_number,
        title
      } = this.props.videoInfo.videoInfo.data.data;
      if (!this.forcePlayed) {
        this.forcePlayed = false;
        // if (type !== EPISODE) {
        //   sendEvents(
        //     VIDEO_CATEGORY,
        //     `${PLAY_VIDEO_ACTION}${type}`,
        //     title ? title : id
        //   );
        // } else {
        //   sendEvents(
        //     VIDEO_CATEGORY,
        //     `${PLAY_VIDEO_ACTION}${type}`,
        //     `${title ? title : id} | ${
        //       oResourceBundle.season
        //     } ${season_number} | ${oResourceBundle.episode} ${episode_number}`
        //   );
        // }
      }
    }
    this.startWatchingTimer();
    this.isPlayerLoading = false;
  }

  onStalled() {
    Logger.log(this.MODULE_NAME, "onStalled");
    this.setState({
      showSpinner: false
    });
    if (!this.state.paused) {
      this.setState({
        paused: true
      });
    }

    // this.playIconTimer = setTimeout(
    //   () =>
    //     this.setState({
    //       showPlayIcon: true
    //     }),
    //   200
    // );
  }

  onAutoplayError() {
    Logger.log(this.MODULE_NAME, "onAutoplayError");
    if (!ENABLE_MUTED_AUTOPLAY) {
      this.setState({
        showPlayIcon: true,
        paused: true,
        // forcePlayed : true
      });
      this.onForcePlay();
    }
  }

  userInteracted() {
    Logger.log(this.MODULE_NAME, "userInteracted");
    this.setState({
      showPlayIcon: false,
      loading: true
    });
  }

  onAdStarted(event) {
    Logger.log(this.MODULE_NAME, "onAdStarted");
    clearTimeout(this.playIconTimer);
    this.setState({
      adInProgress: true,
      showControls: false,
      showPlayIcon: false,
      showSpinner: false
    });
    if (
      event &&
      event.A &&
      event.A.g &&
      event.A.g.adPodInfo &&
      event.A.g.adPodInfo.adPosition &&
      event.A.g.adPodInfo.podIndex !== undefined
    ) {
      // podIndex = > preroll
      // adPosition => current ad of total ads of each
      // sendEvents(
      //   VIDEO_ADS_CATEGORY,
      //   VIDEO_ADS_ACTION,
      //   getAdType(event.A.g.adPodInfo.podIndex) +
      //     " | " +
      //     event.A.g.adPodInfo.adPosition
      // );
    }
  }

  onAdPaused() {
    Logger.log(this.MODULE_NAME, "onAdPaused");
    this.setState({
      showSpinner: false,
      showPlayIcon: true
    });
  }

  onAdResumed() {
    Logger.log(this.MODULE_NAME, "onAdResumed");
    clearTimeout(this.playIconTimer);
    this.setState({
      showPlayIcon: false
    });
  }

  onAdProgress() {
    clearTimeout(this.playIconTimer);
    this.setState({
      showPlayIcon: false
    });
  }

  onAdComplete(event) {
    Logger.log(this.MODULE_NAME, "onAdComplete");

    clearTimeout(this.playIconTimer);
    if (
      event &&
      event.A &&
      event.A.g &&
      event.A.g.adPodInfo &&
      event.A.g.adPodInfo.podIndex !== undefined &&
      event.A.g.adPodInfo.adPosition === event.A.g.adPodInfo.totalAds
    ) {
      this.setState({
        adInProgress: false,
        showPlayIcon: false,
        showControls: true,
        loading: true
      });
    }
  }

  onEnded() {
    Logger.log(this.MODULE_NAME, "onEnded");
    const {id, type} = this.props.match.params;
    this.cancelWatchingTimer();
    if (
      this.getContentType(this.props.videoInfo.videoInfo) === EPISODE &&
      this.props.relatedVideos
    ) {
      // Note that episode number starts from 1
      this.nextEpisode = this.props.relatedVideos[
        this.props.videoInfo.videoInfo.data.data.episode_number
      ];
      if (this.nextEpisode) {
        this.startNextEpisodeCounter();
      }
    }
    this.setState({
      showSpinner: false,
      videoEnded: true,
      paused: true
    });
    this.updateWatchingProgress(true);

    //Send analytics event
    const {
      episode_number,
      season_number,
      title
    } = this.props.videoInfo.videoInfo.data.data;
    // if (type !== EPISODE) {
    //   sendEvents(VIDEO_CATEGORY, VIDEO_STOP_ACTION, title ? title : id);
    // } else {
    //   sendEvents(
    //     VIDEO_CATEGORY,
    //     VIDEO_STOP_ACTION,
    //     `${title ? title : id} | ${oResourceBundle.season} ${season_number} | ${
    //       oResourceBundle.episode
    //     } ${episode_number}`
    //   );
    // }
  }

  onWaiting() {
    Logger.log(this.MODULE_NAME, "onWaiting");
    setTimeout(() => {
      this.setState({
        showSpinner: true
      });
    }, 300);
  }

  onError() {
    Logger.log(this.MODULE_NAME, "onError");
    this.cancelWatchingTimer();
    this.setState({
      errorOccurred: true,
      showControls: true,
      showSpinner: false
    });
  }

  onFullscreenChange() {
    Logger.log(
      this.MODULE_NAME,
      "onFullscreenChange: " + this.state.fullScreen
    );
    this.setState({
      fullScreen: !this.state.fullScreen
    });
  }

  onForcePlay() {
    this.forcePlayed = true;
  }

  updateWindowDimensions() {
    const orientation = window.innerWidth > window.innerHeight ? 90 : 0;
    if (this.state.orientation !== orientation && isMobile) {
      this.setState({
        showSharePopup: false,
        showPlayerCarousel: false
      });
    }
    this.setState({
      orientation:
        window.innerWidth > window.innerHeight &&
        window.innerWidth > PLAYER_LANDSCAPE_MIN_WIDTH
          ? 90
          : 0
    });
  }

  onProgressBarClick(event,progress) {

    const { type, id } = this.props.match.params;
    const {
      episode_number,
      season_number,
      title,
      content_type
    } = this.props.videoInfo.videoInfo.data.data;


    this.updateWatchingProgress(true, Math.floor(progress));
    if (this.state.showQuality) {
      this.setState({
        showQuality: false
      });
    }
    if (this.state.showPlayerCarousel) {
      this.setState({
        showPlayerCarousel: false
      });
    }
    if (this.state.showSharePopup) {
      this.setState({
        showSharePopup: false
      });
    }

    sendEvents(
      VIDEO_TRAILERS_CATEGORY,
      this.state.videocurrentTime < progress ? FORWARD : BACKWARD,
      this.fnlabelname(this.props.videoInfo)
    );

  }

  togglePlayerCarousel() {
    Logger.log(
      this.MODULE_NAME,
      "togglePlayerCarousel: " + this.state.showPlayerCarousel
    );
    this.setState({
      showPlayerCarousel: !this.state.showPlayerCarousel,
      showQuality: false,
      showSharePopup: false
    });
  }

  onPlayPauseClick(oEvent) {
    Logger.log(this.MODULE_NAME, "onPlayPauseClick");
    this.setState({
      showPlayerCarousel: false,
      showQuality: false,
      showSharePopup: false
    });
  }

  onToggleFullScreen(fullscreen) {
    Logger.log(this.MODULE_NAME, "onToggleFullScreen: " + fullscreen);
    this.setState({
      showPlayerCarousel: false,
      showQuality: false,
      showSharePopup: false
    });

    //Send analytics event
    if (fullscreen) {
      const {type, id} = this.props.match.params;
      const {
        episode_number,
        season_number,
        title
      } = this.props.videoInfo.videoInfo.data.data;
      // if (type !== EPISODE) {
      //   sendEvents(
      //     PLAYER_CONTROL_CATEGORY,
      //     `${FULL_SCREEN_ACTION}`,
      //     title ? title : id
      //   );
      // } else {
      //   sendEvents(
      //     PLAYER_CONTROL_CATEGORY,
      //     `${FULL_SCREEN_ACTION}`,
      //     `${title ? title : id} | ${
      //       oResourceBundle.season
      //     } ${season_number} | ${oResourceBundle.episode} ${episode_number}`
      //   );
      // }
    }
  }

  onShareButtonClick(e) {
    Logger.log(this.MODULE_NAME, "onShareButtonClick");
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: document.title,
          url: window.location.href
        })
        .then(() => {
          Logger.log(this.MODULE_NAME, "Successful share");
        })
        .catch(error => {
          Logger.error(this.MODULE_NAME, "Error sharing" + error);
        });
    } else {
      this.setState({
        showPlayerCarousel: false,
        showQuality: false,
        showSharePopup: !this.state.showSharePopup
      });
    }
    e.preventDefault();
    e.stopPropagation();
  }

  onQualityClick() {
    Logger.log(this.MODULE_NAME, "onQualityClick");
    this.setState({
      showPlayerCarousel: false,
      showQuality: !this.state.showQuality,
      showSharePopup: false
    });
  }

  onBackClick() {
    Logger.log(this.MODULE_NAME, "onBackClick");
    this.setState({
      showPlayerCarousel: false,
      showQuality: false,
      showSharePopup: false,
      showNextEpisodeCounter: false
    });
    clearTimeout(this.nextEpisodeTimer);
    this.props.history.goBack();
  }

  onVideoContainerClick(e) {
    Logger.log(
      this.MODULE_NAME,
      "onVideoContainerClick: " + e.target.className
    );
    if (!this.state.adInProgress) {
      this.setState({
        showControls: true
      });
    }
    if (
      e.target.className === "player-controls" ||
      e.target.className === "player-controls-container"
    ) {
      if (this.state.showQuality) {
        this.setState({
          showQuality: false
        });
      }
      if (this.state.showPlayerCarousel) {
        this.setState({
          showPlayerCarousel: false
        });
      }
      if (this.state.showSharePopup) {
        this.setState({
          showSharePopup: false
        });
      }
    }
  }

  onMouseOverControls() {
    this.mouseOnControls = true;
  }

  onMouseOutControls() {
    this.mouseOnControls = false;
  }

  onPlayButtonClick(event) {
    Logger.log(this.MODULE_NAME, "onPlayButtonClick");
    if (!isIOS) {
      this.disableAutoplay = false;
      this.setState({
        autoplay: true
      });
    }
    const data = JSON.parse(event.target.parentElement.value);
    data.title = data.itemTitle;
    data.episode_number = data.episodeNumber;
    let next;
    this.setState({
      showPlayerCarousel: false
    });
    if (this.swiper) {
      this.swiper.swiper.destroy();
    }
    // window.zplayer.pause();

    // this.updateWatchingProgress();
    let url;
    if (this.getContentType(this.props.videoInfo.videoInfo) === MOVIE) {
      data.content_type = MOVIE;
      url = fnConstructContentURL(MOVIE, data);
      next = `/${this.props.locale}/${PLAYER}${url}`;
      this.props.history.push(next);
    } else if (
      this.getContentType(this.props.videoInfo.videoInfo) === EPISODE
    ) {
      data.content_type = EPISODE;
      url = fnConstructContentURL(EPISODE, data);
      next = `/${this.props.locale}/${PLAYER}${url}`;
      this.props.history.push(next);
    }

    //Send analytics event
    const {type, id} = this.props.match.params;
    const oNextItem = this.props.relatedVideos.filter(
      ele => ele.id === data.id
    )[0];

    const {
      season_number,
      episode_number,
      title
    } = this.props.videoInfo.videoInfo.data.data;
    // if (type !== EPISODE) {
    //   sendEvents(
    //     PLAYER_CONTROL_CATEGORY,
    //     `${RELATED_SELECT_ACTION}`,
    //     `${title ? title : id} | ${oNextItem.title}`
    //   );
    // } else {
    //   sendEvents(
    //     PLAYER_CONTROL_CATEGORY,
    //     `${RELATED_SELECT_ACTION}`,
    //     `${title ? title : id} | ${oResourceBundle.season} ${season_number} | ${
    //       oResourceBundle.episode
    //     } ${episode_number} | ${oNextItem.title} | ${oResourceBundle.episode} ${
    //       oNextItem.episode_number
    //     }`
    //   );
    // }
  }

  isInPlaylist(id) {
    return this.props.userPlayList.some(ele => ele.content.id === id);
  }

  getId() {
    return this.props.videoInfo.videoInfo.data.data.series_id
      ? this.props.videoInfo.videoInfo.data.data.series_id
      : this.props.videoInfo.videoInfo.data.data.id;
  }

  getContentType(videoInfo) {
    return videoInfo.data.data.series_id ? EPISODE : videoInfo.data.data.content_type;
  }

  seriesOrMovie(videoInfo) {
    // return videoInfo.data.data.series_id ? SERIES : MOVIE;
    return videoInfo.data.data.content_type
  }

  onAddRemovePlaylist() {
    Logger.log(this.MODULE_NAME, "onAddRemovePlaylist");
    const {locale} = this.props;
    const itemId = this.getId();
    Logger.log(this.MODULE_NAME, "itemId: " + itemId);
    const itemTitle = this.props.videoInfo.videoInfo.data.data.title;

    this.setState({
      showPlayerCarousel: false,
      showQuality: false,
      showSharePopup: false
    });
    //check if the item is already in the playlist or not
    if (this.props.userPlayList) {
      const isItemExists = this.isInPlaylist(itemId);
      const oUserToken = JSON.parse(getServerCookie(COOKIE_USER_TOKEN));

      if (oUserToken) {
        if (!this.playistAPIfired) {
          this.playistAPIfired = true;
          if (isItemExists) {
            //if true delete from playlist
            Logger.log(this.MODULE_NAME, "Remove");
            this.props.fnRemoveItemFromPlayList(
              locale,
              itemId,
              this.seriesOrMovie(this.props.videoInfo.videoInfo),
              {},
              this.unauthorizedHandler.bind(this),
              () => {
                showToast(
                  MY_PLAYLIST_TOAST_ID,
                  oResourceBundle.removed_from_playlist1 +
                    itemTitle +
                    oResourceBundle.removed_from_playlist2,
                  toast.POSITION.BOTTOM_CENTER
                );
                this.playistAPIfired = false;
              },
              () => {
                showToast(
                  MY_PLAYLIST_TOAST_ID,
                  oResourceBundle.something_went_wrong,
                  toast.POSITION.BOTTOM_CENTER
                );
                this.playistAPIfired = false;
              }
            );
          } else {
            //add to playlist
            Logger.log(this.MODULE_NAME, "Add");
            this.props.fnAddItemToPlayList(
              locale,
              itemId,
              this.seriesOrMovie(this.props.videoInfo.videoInfo),
              itemTitle || "title",
              {},
              this.unauthorizedHandler.bind(this),
              () => {
                showToast(
                  MY_PLAYLIST_TOAST_ID,
                  oResourceBundle.added_to_playlist1 +
                    itemTitle +
                    oResourceBundle.added_to_playlist2,
                  toast.POSITION.BOTTOM_CENTER
                );
                this.playistAPIfired = false;
              },
              () => {
                showToast(
                  MY_PLAYLIST_TOAST_ID,
                  oResourceBundle.something_went_wrong,
                  toast.POSITION.BOTTOM_CENTER
                );
                this.playistAPIfired = false;
              }
            );
            //Send analytics event
            const {type} = this.props.match.params;
            const {
              episode_number,
              season_number
            } = this.props.videoInfo.videoInfo.data.data;
            //Send analytics event
            // if (type !== EPISODE) {
            //   sendEvents(
            //     ADD_PLAYLIST_CATEGORY,
            //     type,
            //     `${itemTitle ? itemTitle : itemId}`
            //   );
            // } else {
            //   sendEvents(
            //     ADD_PLAYLIST_CATEGORY,
            //     type,
            //     `${itemTitle ? itemTitle : itemId} | ${
            //       oResourceBundle.season
            //     } ${season_number} | ${
            //       oResourceBundle.episode
            //     } ${episode_number}`
            //   );
            // }
          }
        }
      } else {
        const index = window.location.href.indexOf("/" + this.props.locale);
        const currentPath = window.location.href.substring(index);
        setCookie(
          RESUME_PATH_COOKIE_NAME,
          currentPath,
          COOKIES_TIMEOUT_NOT_REMEMBER
        );
        this.unauthorizedHandler();
      }
    }
  }

  unauthorizedHandler() {
    this.props.history.push(`/${this.props.locale}/${LOGIN}`);
  }

  /**
   * Fires related video content request on receiving videoinfo
   * @param {Object} data
   */
  videoInfoReceived(data) {
    Logger.log(this.MODULE_NAME, "videoInfoReceived");
    if (data && data.videoInfo) {
      if (data.videoInfo.data.data.geoblock) {
        this.setState({
          geoBlock: true,
          errorOccurred: true
        });
        return;
      }
      const reverseLocale = this.props.locale === "en" ? "ar" : "en";
      data.videoInfo.data.data[this.props.locale + "title"] =
        data.videoInfo.data.data.title;
      data.videoInfo.data.data[reverseLocale + "title"] =
        data.videoInfo.data.data.translated_title;

      // if(this.props.videoInfo.data.data.geoblock
      // this.fetchCarouselData(data);
    }
  }

  sendSignalData(data) {
    const episodeNumber = data.episode_number;
    const type = episodeNumber !== undefined ? "episode" : MOVIE;
    this.setSignalData(data, type, this.props.locale, this.props.sCountryCode, common.getUserId(), common.uuidv4(), this.props.bPageViewSent);
    this.props.fnPageViewSent();
  }

  fetchCarouselData(data) {
    if ((data && data.videoInfo) || this.props.videoInfo) {
      const contentType = this.getContentType(
        data ? data.videoInfo : this.props.videoInfo.videoInfo
      );
      if (MOVIE === contentType) {
        this.props.fnFetchRelatedVideos(
          this.props.locale,
          data
            ? data.videoInfo.data.data.id
            : this.props.videoInfo.videoInfo.data.data.id,
          contentType,
          data
            ? data.videoInfo.data.data.genres
            : this.props.videoInfo.videoInfo.data.data.genres,
          this.props.sCountryCode
        );
        this.sendSignalData(
          data
            ? data.videoInfo.data.data
            : this.props.videoInfo.videoInfo.data.data
        );
      } else if (EPISODE === contentType) {
        this.props.fnFetchSeriesEpisodes(
          this.props.locale,
          data
            ? data.videoInfo.data.data.series_id
            : this.props.videoInfo.videoInfo.data.data.series_id,
          this.props.sCountryCode,
          this.seriesMetadataRecieved.bind(this)
        );
      }
    }
  }

  seriesMetadataRecieved(data) {
    if (this.props.videoInfo) {
      this.props.videoInfo.videoInfo.data.data.genres = data.genres;
      this.props.videoInfo.videoInfo.data.data.cast = data.cast;
      this.props.videoInfo.videoInfo.data.data.title = data.title;
      this.sendSignalData(this.props.videoInfo.videoInfo.data.data);
    } else {
      this.setState({
        seriesInfo: {
          genre: data.genres,
          cast: data.cast,
          title: data.title
        }
      });
    }
  }

  onMuteClick() {
    this.setState({
      showSharePopup: false,
      showPlayerCarousel: false,
      showQuality: false
    });
  }

  onVolumeBarClick() {
    this.setState({
      showSharePopup: false,
      showPlayerCarousel: false,
      showQuality: false
    });
  }

  onNextButtonClick() {
    Logger.log(this.MODULE_NAME, "onNextButtonClick");
    if (this.swiper) {
      this.setState({
        currentCarouselIndex: this.swiper.swiper.realIndex
      });
    }
  }

  onPreviousButtonClick() {
    Logger.log(this.MODULE_NAME, "onPreviousButtonClick");
    if (this.swiper) {
      this.setState({
        currentCarouselIndex: this.swiper.swiper.realIndex
      });
    }
  }

  /**
   * Component Name - Player
   * Twitter share button clicked
   * @param {null}
   * @returns {undefined}
   */
  onTwitterShareButtonClick() {
    const {id, type} = this.props.match.params;
    const {
      episode_number,
      season_number,
      title
    } = this.props.videoInfo.videoInfo.data.data;
    //Send analytics event
    // if (type === EPISODE) {
    //   sendEvents(
    //     SHARE_CATEGORY,
    //     SHARE_PLAYER_ACTION,
    //     `${title ? title : id} | ${oResourceBundle.season} ${season_number} | ${
    //       oResourceBundle.episode
    //     } ${episode_number}`
    //   );
    // } else {
    //   sendEvents(SHARE_CATEGORY, SHARE_PLAYER_ACTION, title ? title : id);
    // }
    this.setState({
      showSharePopup: false
    });
  }

  /**
   * Component Name - Player
   * Twitter share button clicked
   * @param {null}
   * @returns {undefined}
   */
  onFBShareButtonClick() {
    const {id, type} = this.props.match.params;
    const {
      episode_number,
      season_number,
      title
    } = this.props.videoInfo.videoInfo.data.data;
    //Send analytics event
    // if (type === EPISODE) {
    //   sendEvents(
    //     SHARE_CATEGORY,
    //     SHARE_PLAYER_ACTION,
    //     `${title ? title : id} | ${oResourceBundle.season} ${season_number} | ${
    //       oResourceBundle.episode
    //     } ${episode_number}`
    //   );
    // } else {
    //   sendEvents(SHARE_CATEGORY, SHARE_PLAYER_ACTION, title ? title : id);
    // }
    this.setState({
      showSharePopup: false
    });
  }

  setControlsDragging(value) {
    Logger.log(this.MODULE_NAME, "setControlsDragging: " + value);
    this.areControlsDragging = value;
  }

  onQualityChanged(index) {
    Logger.log(this.MODULE_NAME, "onQualityChanged: " + index);
    this.setState({
      currentQualityLevel: index,
      showQuality: false
    });

    const sSelectedBitRate =
      index > -1
        ? `${this.props.qualityLevels[0].height}p`
        : oResourceBundle.auto;
    const {id, type} = this.props.match.params;
    const {
      episode_number,
      season_number,
      title
    } = this.props.videoInfo.videoInfo.data.data;
    //Send analytics event
    // if (type === EPISODE) {
    //   sendEvents(
    //     PLAYER_CONTROL_CATEGORY,
    //     BIT_RATE_ACTION,
    //     `${title ? title : id} | ${oResourceBundle.season} ${season_number} | ${
    //       oResourceBundle.episode
    //     } ${episode_number} | ${sSelectedBitRate}`
    //   );
    // } else {
    //   sendEvents(
    //     PLAYER_CONTROL_CATEGORY,
    //     BIT_RATE_ACTION,
    //     `${title ? title : id} | ${sSelectedBitRate}`
    //   );
    // }
  }

  relatedVideosTouch(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  startNextEpisodeCounter() {
    Logger.log(this.MODULE_NAME, "startNextEpisodeCounter");
    this.setState({
      showNextEpisodeCounter: true
    });
    this.nextEpisodeTimer = setInterval(() => {
      this.setState({
        nextEpisodeCounter: this.state.nextEpisodeCounter + 3
      });
      Logger.log(
        this.MODULE_NAME,
        "nextEpisodeTimer:" + this.state.nextEpisodeCounter
      );
      if (this.state.nextEpisodeCounter >= 100) {
        this.startNextEpisode(true);
      }
    }, 200);
  }

  startNextEpisode(fromTimer) {
    Logger.log(this.MODULE_NAME, "startNextEpisode");
    if (!fromTimer && !isIOS) {
      this.setState({
        showPlayIcon: false,
        disableAutoplay: false
      });
    }
    if (!isIOS) {
      this.setState({
        autoplay: true
      });
    }
    clearInterval(this.nextEpisodeTimer);
    this.setState({
      showNextEpisodeCounter: false
    });
    const next = `/${this.props.locale}/${PLAYER}/${EPISODE}/${
      this.nextEpisode.id
    }/`;
    this.props.history.push(next);
  }

  startWatchingTimer() {
    this.cancelWatchingTimer();
    this.updateWatchingProgress();
  }

  cancelWatchingTimer() {
    clearInterval(this.addToWatchingTimer);
  }

  updateWatchingProgress(sendOnly,time) {
    this.cancelWatchingTimer();
    const authToken = getServerCookie(COOKIE_USER_TOKEN);
    if (authToken && this.props.videoInfo) {
      const refreshToken = JSON.parse(authToken).refreshToken;
      const id = this.props.videoInfo.videoInfo.data.data.id;
      const title = this.props.videoInfo.videoInfo.data.data.title;
      const contentType = this.getContentType(this.props.videoInfo.videoInfo);
      const duration = this.props.videoInfo.videoInfo.data.data.length;
      const genres = this.props.videoInfo.videoInfo.data.data.genres;
      // let lastWatchPosition = this.videoPlayedDuration
      //   ? Math.floor(this.videoPlayedDuration)
      //   : 0;
      let lastWatchPosition =
      time !== undefined
        ? time
        : this.videoPlayedDuration
          ? Math.floor(this.videoPlayedDuration)
          : 0;
      const watchSessionId = refreshToken + "_" + new Date().getTime();
      if (sendOnly) {
        // this.props.fnAddUserWatching(
        //   id,
        //   title,
        //   contentType,
        //   duration,
        //   genres,
        //   lastWatchPosition,
        //   watchSessionId
        // );
      } else {
        this.addToWatchingTimer = setInterval(() => {
          let lastWatchPosition = this.videoPlayedDuration
            ? Math.floor(this.videoPlayedDuration)
            : 0;
          // this.props.fnAddUserWatching(
          //   id,
          //   title,
          //   contentType,
          //   duration,
          //   genres,
          //   lastWatchPosition,
          //   watchSessionId
          // );
        }, UPDATE_WATCHING_INTERVAL);
      }
    }
  }
  onSubscriptionBackClick() {
      this.setState({
        showSubscriptionBanner: false
      });
    }
  
    onContinueBtnClick() {
      this.setState({
        showSubscriptionBanner: false
      });
  }

  /**
   * Component - Player
   * render method
   * @param null
   * @return {Object}
   */
  render() {
    let episodeNumber;
    const dir = getDirection(this.props.locale);
    const rtl = dir === RTL ? true : false;
    let startTime = 0;
    let oMetaTags, oMetaObject;

    if (
      this.props.oUserResumablesObject &&
      this.props.videoInfo &&
      this.props.oUserResumablesObject[
        this.props.videoInfo.videoInfo.data.data.id
      ]
    ) {
      startTime = this.props.oUserResumablesObject[
        this.props.videoInfo.videoInfo.data.data.id
      ].userData.viewActivity.resumeWatchPosition;
    }
    if (this.props.videoInfo) {
      const reverseLocale = this.props.locale === "en" ? "ar" : "en";
      window.sTranslatedTitle = fnConstructTranslatedTitle(
        this.getContentType(this.props.videoInfo.videoInfo),
        this.props.videoInfo.videoInfo.data.data,
        this.props.locale,
        reverseLocale
      );

      episodeNumber = this.props.videoInfo.videoInfo.data.data.episode_number;

      const {
        title,
        seo_description,
        imagery: {thumbnail}
      } = this.props.videoInfo.videoInfo.data.data;

      if (this.props.match.params.type === MOVIE) {
        oMetaObject = this.fnConstructMetaTags(
          `${title} ${oResourceBundle.on} ${capitalizeFirstLetter(
            oResourceBundle.weyyak
          )}`,
          window.location.href,
          `${seo_description} | ${title} ${
            oResourceBundle.on
          } ${capitalizeFirstLetter(oResourceBundle.weyyak)}`,
          thumbnail
        );
      } else {
        const {
          episode_number,
          season_number
        } = this.props.videoInfo.videoInfo.data.data;
        oMetaObject = this.fnConstructMetaTags(
          `${title} ${oResourceBundle.episode} ${episode_number} | ${
            oResourceBundle.season
          } ${season_number}`,
          window.location.href,
          `${seo_description} | ${
            oResourceBundle.episode
          } ${episode_number} ${title}  ${
            oResourceBundle.season
          } ${season_number}`,
          thumbnail
        );
      }

      oMetaTags = this.fnUpdateMetaTags(oMetaObject);
    } else {
      const oMetaObject = this.fnConstructMetaTags(
        capitalizeFirstLetter(oResourceBundle.weyyak) +
          " - " +
          this.props.match.params.name,
        window.location.href
      );
      oMetaTags = this.fnUpdateMetaTags(oMetaObject);
    }

    let currentQuality = oResourceBundle.auto;
    if (
      this.props.qualityLevels &&
      this.state.currentQualityLevel < this.props.qualityLevels.length &&
      this.state.currentQualityLevel >= 0
    ) {
      currentQuality =
        this.props.qualityLevels[this.state.currentQualityLevel].height + "p";
    }

    let title = "";
    if (this.props.videoInfo) {
      if (this.state.translatedTitle) {
        title = this.props.videoInfo.videoInfo.data.data.translated_title;
      } else {
        title = this.props.videoInfo.videoInfo.data.data.title;
      }
    }
    // Logger.log(
    //   this.MODULE_NAME,
    //   this.props.videoPlaybackState + ", " + this.props.loading
    // );

    let adUrl = "";
    if (
      this.props.oVideoDetailContent &&
      this.props.oVideoDetailContent.data &&
      this.props.videoInfo &&
      this.props.platformConfig &&
      this.props.platformConfig.default &&
      this.props.platformConfig.default["1.0"] &&
      this.props.platformConfig.default["1.0"][
        CONFIG_AD_PROPERTY[this.props.locale]
      ]
    ) {
      const videoUrl = this.props.platformConfig.default["1.0"][
        CONFIG_AD_PROPERTY[this.props.locale]
      ];
      const content_type = (this.props.oVideoDetailContent.data.content_type);
      if (videoUrl && content_type !== "LiveTV") {
        adUrl = videoUrl.replace(
          "VIDEO_ID",
          this.props.videoInfo.videoInfo.data.data.id
        );
      }
    }
    let live_type = '';
    if(this.props.oVideoDetailContent && this.props.oVideoDetailContent.data){
      live_type = (this.props.oVideoDetailContent.data.content_type);
    }
    if (this.props.isUserSubscribed || (live_type === "LiveTV" && this.props.isMENARegion)) 
    {
      adUrl = "";
      Logger.log(this.MODULE_NAME, "no ads for subscriber");
    }
    return (
      <div
        onClick={this.onVideoContainerClick.bind(this)}
        // onTouchStart={isIOS ? this.onVideoContainerClick.bind(this) : null}
        id="video-container"
        className={
          "video-container" +
          (this.state.fullScreen ? " fullscreen" : "") +
          (this.state.errorOccurred ? " error-occurred" : "") +
          (this.state.orientation === 0 ? " portrait" : " landscape") +
          (isMobile ? " mobile" : " desktop")
        }
        ref={node => (this.videoRef = node)}
      >
        {this.props.videoInfo && oMetaTags}
        {this.state.showSpinner &&
          !this.state.errorOccurred &&
          !this.state.showNextEpisodeCounter && <VideoSpinner />}
        {this.state.showNextEpisodeCounter && (
          <div>
            <div className="next-episode-text">
              {oResourceBundle.next_episode}
            </div>
            <CircularProgressbar
              percentage={this.state.nextEpisodeCounter}
              strokeWidth={5}
              styles={{
                path: {
                  stroke: "#fff"
                },
                trail: {stroke: "transparent"}
              }}
            />
            <div
              className="start-now"
              onClick={this.startNextEpisode.bind(this)}
            >
              {oResourceBundle.start_now}
            </div>
          </div>
        )}
        {
          <div>
            <div
              className="preload"
              style={{
                background: "url(" + playlistHover + ")"
              }}
            />
            <div
              className="preload"
              style={{
                background: "url(" + facebook + ")"
              }}
            />
            <div
              className="preload"
              style={{
                background: "url(" + twitter + ")"
              }}
            />
            <div
              className="preload"
              style={{
                background: "url(" + playlistRemoveHover + ")"
              }}
            />
            <div
              className="preload"
              style={{
                background: "url(" + fullscreenHover + ")"
              }}
            />
            <div
              className="preload"
              style={{
                background: "url(" + pauseHover + ")"
              }}
            />
            <div
              className="preload"
              style={{
                background: "url(" + shareHover + ")"
              }}
            />
          </div>
        }
        {this.state.errorOccurred && (
          <div className="player-error">
            <span>
              {this.state.geoBlock
                ? oResourceBundle.geo_block
                : oResourceBundle.error_loading_video}
            </span>
          </div>
        )}

        {this.props.videoInfo &&
        this.props.videoInfo.urlInfo &&
        !this.state.geoBlock ? (
          <VideoPlayer
            videoRef={this.videoRef}
            showNextEpisodeCounter={this.state.showNextEpisodeCounter}
            enableAutoplayFeature={ENABLE_MUTED_AUTOPLAY}
            updateVideoPlayedDuration={this.updateVideoPlayedDuration.bind(
              this
            )}
            userInteracted={this.userInteracted.bind(this)}
            bigPlayIconClick={this.bigPlayIconClick.bind(this)}
            playerReady={this.state.playerReady}
            autoplay={this.state.autoplay}
            onAutoplayError={this.onAutoplayError.bind(this)}
            onPlayPauseClick={this.onPlayPauseClick.bind(this)}
            onVolumeBarClick={this.onVolumeBarClick.bind(this)}
            onForcePlay={this.onForcePlay.bind(this)}
            onMuteClick={this.onMuteClick.bind(this)}
            onShareButtonClick={this.onShareButtonClick.bind(this)}
            onTwitterShareButtonClick={this.onTwitterShareButtonClick.bind(
              this
            )}
            onFBShareButtonClick={this.onFBShareButtonClick.bind(this)}
            onAddRemovePlaylist={this.onAddRemovePlaylist.bind(this)}
            togglePlayerCarousel={this.togglePlayerCarousel.bind(this)}
            showPlayerCarousel={this.state.showPlayerCarousel}
            currentQuality={currentQuality}
            episodeNumber={episodeNumber}
            title={title}
            params={this.props.match.params}
            startTime={startTime}
            isTrailer={true}
            qualityLevels={this.props.qualityLevels}
            onToggleFullScreen={this.onToggleFullScreen.bind(this)}
            showQuality={this.state.showQuality}
            onQualityClick={this.onQualityClick.bind(this)}
            showSharePopup={this.state.showSharePopup}
            onLoadedData={this.onLoadedData.bind(this)}
            onCanPlayThrough={this.onCanPlayThrough.bind(this)}
            onFirstFrameLoaded={this.onFirstFrameLoaded.bind(this)}
            onProgressBarClick={this.onProgressBarClick.bind(this)}
            onQualityChanged={this.onQualityChanged.bind(this)}
            onTimeUpdate={this.onTimeUpdate.bind(this)}
            onPause={this.onPause.bind(this)}
            isInPlaylist={this.isInPlaylist(this.getId())}
            onPlayerReady={this.onPlayerReady.bind(this)}
            onPlay={this.onPlay.bind(this)}
            onEnded={this.onEnded.bind(this)}
            onError={this.onError.bind(this)}
            onStalled={this.onStalled.bind(this)}
            onWaiting={this.onWaiting.bind(this)}
            onAdStarted={this.onAdStarted.bind(this)}
            onAdComplete={this.onAdComplete.bind(this)}
            onAdPaused={this.onAdPaused.bind(this)}
            onAdResumed={this.onAdResumed.bind(this)}
            onAdProgress={this.onAdProgress.bind(this)}
            onUserActive={this.onUserActive.bind(this)}
            onUserInactive={this.onUserInactive.bind(this)}
            onMouseOverControls={this.onMouseOverControls.bind(this)}
            onMouseOutControls={this.onMouseOutControls.bind(this)}
            videoInfo={this.props.videoInfo}
            hdValue={PLAYER_QUALITY_HD_MIN_VALUE}
            showControls={this.state.showControls}
            showPlayIcon={this.state.showPlayIcon}
            setControlsDragging={this.setControlsDragging.bind(this)}
            adUrl={""}
            // adUrl={adUrl}
            // adUrl={'http://192.168.1.196:3000/ads/sample_vmap.xml'}
            // adUrl={'https://s3.ap-south-1.amazonaws.com/z5xml/web_vmap.xml'}
            // sample vpaid
            // adUrl={'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dnonlinearvpaid2js&correlator='}
            // skippable ad
            // adUrl={
            //   "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator="
            // }
            // pre mid post
            // adUrl={
            //   "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator="
            // }
            // preroll
            // adUrl={
            //   "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator="
            // }
            // postroll
            // adUrl={
            //   "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpostonly&cmsid=496&vid=short_onecue&correlator="
            // }
            // pre multiple midroll post
            // adUrl={
            //   "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostpodbumper&cmsid=496&vid=short_onecue&correlator="
            // }
            PLAYER_REWIND_DURATION={PLAYER_REWIND_DURATION}
            PLAYER_PROGRESS_UPDATE_INTERVAL={PLAYER_PROGRESS_UPDATE_INTERVAL}
            ENABLE_VIDEO_ADVERTISEMENT={
              this.props.isUserSubscribed ? false : ENABLE_VIDEO_ADVERTISEMENT
            }
            ENABLE_CUSTOM_CONTROLS={ENABLE_CUSTOM_CONTROLS}
          />
        ) : null}
        {this.props.relatedVideos && (
          <div
            // onTouchStart={this.relatedVideosTouch.bind(this)}
            className={
              "related-videos-container" +
              (this.state.showPlayerCarousel ? "" : " gone")
            }
            onClick={e => {
              e.stopPropagation();
            }}
            onMouseOver={this.onMouseOverControls.bind(this)}
            onMouseOut={this.onMouseOutControls.bind(this)}
          >
            {!isMobile && (
              <div className="carousel-heading">
                {episodeNumber
                  ? oResourceBundle.episodes
                  : oResourceBundle.watch_more}
              </div>
            )}
            <div className="carousel-info-wrapper">
              <Swiper
                rtl={rtl}
                updateSelective={true}
                ref={swiper => (this.swiper = swiper)}
                slidesPerView={isMobile && this.state.orientation === 0 ? 3 : 5}
                slidesToScroll={1}
                enableSwipeScroll={true}
                bucketTitle={
                  episodeNumber
                    ? oResourceBundle.episodes
                    : oResourceBundle.watch_more
                }
                speed={100}
                allowTouchMove={false}
                rebuildOnUpdate={true}
                shouldSwiperUpdate={true}
                onNextButtonClick={this.onNextButtonClick.bind(this)}
                onPreviousButtonClick={this.onPreviousButtonClick.bind(this)}
                onPlayButtonClick={this.onPlayButtonClick.bind(this)}
                enablePlayButtonClick={true}
                shouldGrouptoOne={true}
              >
                {this.props.relatedVideos.map((ele, index) => {
                  return (
                    <div key={ele.id + "" + index}>
                      <ImageThumbnail
                        id={ele.id}
                        type={ele.content_type}
                        title={ele.title}
                        friendlyUrl={ele.friendly_url}
                        episodeNumber={ele.episode_number}
                        className="carousel-item"
                        imageSrc={`${ele.imagery==null?"":ele.imagery.thumbnail}${IMAGE_DIMENSIONS}`}
                        fallback={
                          this.props.locale === AR_CODE
                            ? fallbackAr
                            : fallbackEn
                        }
                        descriptionHeading={ele.title}
                        showPlayIcon={true}
                        showPlayIcononHover={true}
                        showOnImageDesc={true}
                        onImageDescText={
                          ele.episode_number
                            ? ele.episode_number.toString()
                            : (index + 1).toString()
                        }
                        showDuration={true}
                        durationValue={"--:--"}
                      />
                    </div>
                  );
                })}
              </Swiper>
              <div className="player-carousel-info">
                <div className="player-carousel-info-header">
                  {this.props.relatedVideos[this.state.currentCarouselIndex] &&
                    this.props.relatedVideos[this.state.currentCarouselIndex]
                      .title}
                </div>
                <div className="player-carousel-info-text">
                  {this.props.relatedVideos[this.state.currentCarouselIndex] &&
                    this.props.relatedVideos[this.state.currentCarouselIndex]
                      .synopsis}
                </div>
              </div>
            </div>
          </div>
        )}

        {(this.state.showControls || this.state.geoBlock) && (
          <div
            className="back-button-container"
            onClick={this.onBackClick.bind(this)}
          >
            <div className="back-button-image" />
            <div className="back-button-text">{oResourceBundle.back}</div>
          </div>
        )}
        {
          // <div className="logo" />
        }
      </div>
    );
  }
}

/**
 * Component - Player
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {

    return {
    locale: state.locale,
    platformConfig: state.platformConfig,
    TrailerVideos: state.TrailerVideos,
    videoInfo: state.videoInfo,
    videoPlaybackState: state.videoPlaybackState,
    qualityLevels: state.qualityLevels,
    userPlayList: state.aUserPlayList,
    oUserResumablesObject: state.oUserResumablesObject,
    relatedVideos: state.relatedVideos,
    sCountryCode: state.sCountryCode,
    oPageContent: state.oPageContent,
    oVideoDetailContent: state.oVideoDetailContent,
    isMENARegion: state.isMENARegion,
    sResumePagePath: state.sResumePagePath,
    isUserSubscribed: state.bIsUserSubscribed,
    bPageViewSent: state.bPageViewSent
  };
};

/**
 * method that maps state to props.
 * Component - HomeScreen
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  //dispatch action to redux store
  return {
    fnFetchTrailerVideoUrlDetails: (
      sLanguageCode,
      trailerid,
      sVideoId,
      sVideoType,
      countryCode,
      fnSuccess
    ) => {
      dispatch(
        actionTypes.fnFetchTrailerVideoUrlDetails(
          sLanguageCode,
          trailerid,
          sVideoId,
          sVideoType,
          countryCode,
          fnSuccess
        )
      );
    },
    fnResetVideoUrlDetails: () => {
      dispatch(actionTypes.fnResetVideoUrlDetails());
    },
    fnUpdatePlayerScreenState: playerScreenVisible => {
      dispatch(actionTypes.fnUpdatePlayerScreenState(playerScreenVisible));
    },
    fnGetuserPlaylistData: () => {
      dispatch(actionTypes.fnGetUserPlayListData());
    },
    fnAddItemToPlayList: (
      sLanguageCode,
      sItemId,
      sItemType,
      sTitle,
      sTarget,
      unauthorizedHandler,
      fnSuccess,
      fnFailure
    ) => {
      dispatch(
        actionTypes.fnAddItemToPlayList(
          sLanguageCode,
          sItemId,
          sItemType,
          sTitle,
          sTarget,
          unauthorizedHandler,
          fnSuccess,
          fnFailure
        )
      );
    },
    fnRemoveItemFromPlayList: (
      sLanguageCode,
      sItemId,
      sItemType,
      sTarget,
      unauthorizedHandler,
      fnSuccess,
      fnFailure
    ) => {
      dispatch(
        actionTypes.fnRemoveItemFromPlayList(
          sLanguageCode,
          sItemId,
          sItemType,
          sTarget,
          unauthorizedHandler,
          fnSuccess,
          fnFailure
        )
      );
    },
    fnFetchRelatedVideos: (
      sLanguageCode,
      sVideoId,
      sVideoType,
      genre,
      sCountryCode
    ) => {
      dispatch(
        actionTypes.fnFetchRelatedVideos(
          sLanguageCode,
          sVideoId,
          sVideoType,
          genre,
          sCountryCode
        )
      );
    },
    fnFetchSeriesEpisodes: (
      sLanguageCode,
      seriesId,
      sCountryCode,
      fnSuccess
    ) => {
      dispatch(
        actionTypes.fnFetchSeriesEpisodes(
          sLanguageCode,
          seriesId,
          sCountryCode,
          fnSuccess
        )
      );
    },
    fnAddUserWatching: (
      id,
      title,
      contentType,
      duration,
      genres,
      lastWatchPosition,
      watchSessionId
    ) => {
      dispatch(
        actionTypes.fnAddUserWatching(
          id,
          title,
          contentType,
          duration,
          genres,
          lastWatchPosition,
          watchSessionId
        )
      );
    },
    fnFetchTrailerForVideos: (
      sLanguageCode,
      sVideoId,
      sVideoType,
      sCountry,
      fnTrailersSuccess
    ) => {
      dispatch(
        actionTypes.fnFetchTrailerForVideos(
          sLanguageCode,
          sVideoId,
          sVideoType,
          sCountry,
          fnTrailersSuccess
        )
      );
    },

    fnUpdateResumePagePath: sPath => {
      dispatch(actionTypes.fnUpdateResumePagePath(sPath));
    },
    fnPageViewSent: () => {
      dispatch(actionTypes.fnPageViewSent());
    }
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PlayerTrailer)
);
