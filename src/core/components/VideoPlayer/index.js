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
import {connect} from "react-redux";
import ClampLines from "react-clamp-lines";
import * as actionTypes from "app/store/action/";
import PlayerControls from "core/components/PlayerControls/";
import {
  PLAYER_CONTROLS_DURATION,
  DEFAULT_VOLUME,
  COOKIES_TIMEOUT_NOT_REMEMBER
} from "app/AppConfig/constants";
import {
  exitFullscreen,
  enterFullScreen,
  setCookie,
  getCookie,
  getAdType
} from "app/utility/common";
import "./videojs/video";
import Logger from "core/Logger";
import PopUp from "core/components/PopUp";
import facebook from "app/resources/assets/video-content/fb.svg";
import twitter from "app/resources/assets/video-content/twitter.svg";
import Button from "core/components/Button";
import {FacebookShareButton, TwitterShareButton} from "react-share";
import QualitySelector from "core/components/QualitySelector";
import oResourceBundle from "app/i18n/";
import {isMobile, isIOS} from "react-device-detect";

import "react-circular-progressbar/dist/styles.css";
import "./index.scss";

class VideoPlayer extends React.Component {
  MODULE_NAME = "VideoPlayer";

  constructor(props) {
    super(props);
    this.player = window.zplayer;
    this.state = {
      paused: true,
      muted: false,
      duration: 1,
      progress: 0,
      loading: true,
      volume: 1,
      bufferedDuration: 0,
      currentTime: 0,
      fullScreen: false,
      adPaused: false,
      adInProgress: false,
      isLiveTv:false
    };
    this.listener = {
      playPauseClick: this.onPlayPauseClick.bind(this),
      rewindClick: this.onRewindClick.bind(this),
      muteClick: this.onMuteClick.bind(this),
      volumeBarClick: this.onVolumeBarClick.bind(this),
      progressBarClick: this.onProgressBarClick.bind(this)
    };
    this.controlsTimer = null;
    this.areControlsDragging = false;
    this.volumeBeforeMute = DEFAULT_VOLUME;
    this.startTime = this.props.startTime;
    this.updateLiveTvQuality = this.updateLiveTvQuality.bind(this);
  }

  componentDidMount() {
    const playerConfig = this.createPlayerConfig(this.props.videoInfo.urlInfo);
    if(this.props.videoInfo && this.props.videoInfo.urlInfo &&this.props.videoInfo.urlInfo.url_video.includes('weyyak-live.')){
            this.setState({isLiveTv:true})
    
    }
    this.player.setup(playerConfig, this.onPlayerReady.bind(this));
    if (getCookie("muted") === "true") {
      // for UI
      this.mute();
    }
    this.volumeResetOnUserInteraction = false;
  }

  // destroy player on unmount
  componentWillUnmount() {
    clearTimeout(this.forcePlayTimer);
    this.cancelControlsTimer();
    this.destroyPlayer();
  }

  /**
   * Component Name - Player
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.videoInfo.urlInfo !== undefined &&
      this.props.videoInfo.urlInfo !== prevProps.videoInfo.urlInfo
    ) {
      this.removeMediaListeners();
      this.cancelControlsTimer();
      this.setState({
        paused: false,
        duration: 1,
        progress: 0,
        loading: true,
        bufferedDuration: 0,
        currentTime: 0
      });

      this.destroyPlayer();
      if (!document.getElementById("zplayerContainer")) {
        const element = document.createElement("div");
        element.id = "zplayerContainer";
        document.getElementById("vjs-container").appendChild(element);
      }
      setTimeout(() => this.initPlayer(), 0);
    }
  }

  initPlayer() {
    Logger.log(this.MODULE_NAME, "initPlayer");
    const playerConfig = this.createPlayerConfig(this.props.videoInfo.urlInfo);
    this.player.setup(playerConfig, this.onPlayerReady.bind(this));
  }

  reInitPlayer(src) {
    const mediaSorceObject = {
      primary: {
        src: src,
        type: "application/x-mpegURL"
      }
    };
    this.player.setMedia(mediaSorceObject);
  }

  destroyPlayer() {
    Logger.log(this.MODULE_NAME, "destroyPlayer");
    if (this.player) {
      this.player.dispose();
      this.removeMediaListeners();
    }
  }

  onPlayerReady() {
    Logger.log(this.MODULE_NAME, "onPlayerReady");
    this.addMediaListeners();
    this.fireListener(this.props.onPlayerReady);
  }

  adManagerLoaded() {
    Logger.log(this.MODULE_NAME, "adManagerLoaded");
    Logger.log(
      this.MODULE_NAME,
      "hasPostroll: " + this.player.adManager.hasPostroll
    );
    if (this.player && window.google) {
      this.player.adManager.ima.addEventListener(
        window.google.ima.AdEvent.Type.STARTED,
        this.onAdStarted.bind(this)
      );
      this.player.adManager.ima.addEventListener(
        window.google.ima.AdEvent.Type.PAUSED,
        e => {
          Logger.log(this.MODULE_NAME, "PAUSED");
          this.setState({
            adPaused: true
          });
          this.fireListener(this.props.onAdPaused, e);
        }
      );
      this.player.adManager.ima.addEventListener(
        window.google.ima.AdEvent.Type.RESUMED,
        e => {
          Logger.log(this.MODULE_NAME, "RESUMED");
          this.setState({
            adPaused: false
          });
          this.fireListener(this.props.onAdResumed, e);
        }
      );
      this.player.adManager.ima.addEventListener(
        window.google.ima.AdEvent.Type.CLICK,
        () => {
          Logger.log(this.MODULE_NAME, "CLICK");
          this.player.adManager.ima.pauseAd();
        }
      );
      this.player.adManager.ima.addEventListener(
        window.google.ima.AdEvent.Type.COMPLETE,
        e => {
          Logger.log(
            this.MODULE_NAME,
            "COMPLETE: duration " + this.player.duration()
          );
          this.onAdComplete(e, this.player);
          this.startControlsTimer(e);
          this.setState({
            adInProgress: false,
            adPaused: false,
            duration: this.player.duration()
          });
        }
      );
      this.player.adManager.ima.addEventListener(
        window.google.ima.AdEvent.Type.SKIPPED,
        e => {
          Logger.log(
            this.MODULE_NAME,
            "SKIPPED: duration " + this.player.duration()
          );
          this.onAdComplete(e, this.player);
          this.startControlsTimer(e);
          this.setState({
            adInProgress: false,
            adPaused: false,
            duration: this.player.duration()
          });
        }
      );
      this.player.adManager.ima.addEventListener(
        window.google.ima.AdEvent.Type.AD_PROGRESS,
        e => {
          this.fireListener(this.props.onAdProgress, e);
        }
      );
    }
  }

  onAdLog(data) {
    Logger.log(this.MODULE_NAME, "onAdLog:" + data.data.AdError);
  }

  resumeAd(e) {
    Logger.log(this.MODULE_NAME, "resumeAd");
    if (this.player) {
      this.player.adManager.ima.resumeAd();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  addMediaListeners() {
    if (this.player) {
      this.player.on("loadeddata", this.onLoadedData.bind(this));
      this.player.on("canplaythrough", this.onCanPlayThrough.bind(this));
      this.player.on("canplay", this.onCanPlay.bind(this));
      this.player.on("firstFrameLoaded", this.onFirstFrameLoaded.bind(this));
      this.player.on("timeupdate", this.onTimeUpdate.bind(this));
      this.player.on("pause", this.onPause.bind(this));
      this.player.on("play", this.onPlay.bind(this));
      this.player.on("ended", this.onEnded.bind(this));
      this.player.on("seeking", this.onSeeking.bind(this));
      this.player.on("error", this.onError.bind(this));
      this.player.on("stalled", this.onStalled.bind(this));
      this.player.on("waiting", this.onWaiting.bind(this));
      this.player.on("useractive", this.props.onUserActive.bind(this));
      this.player.on("userinactive", this.props.onUserInactive.bind(this));
      this.player.on("admanagerloaded", this.adManagerLoaded.bind(this));
      this.player.on("adslog", this.onAdLog.bind(this));
    }
  }

  removeMediaListeners() {
    if (this.player) {
      this.player.off("loadeddata", this.props.onLoadedData);
      this.player.off("canplaythrough", this.onCanPlayThrough);
      this.player.off("canplay", this.onCanPlay);
      this.player.off("firstFrameLoaded", this.onFirstFrameLoaded);
      this.player.off("timeupdate", this.onTimeUpdate);
      this.player.off("pause", this.onPause);
      this.player.off("play", this.onPlay);
      this.player.off("ended", this.onEnded);
      this.player.off("seeking", this.onSeeking);
      this.player.off("error", this.onError);
      this.player.off("error", this.onStalled);
      this.player.off("waiting", this.onWaiting);
      this.player.off("useractive", this.props.onUserActive);
      this.player.off("userinactive", this.props.onUserInactive);
      this.player.off("admanagerloaded", this.adManagerLoaded);
      this.player.off("adslog", this.onAdLog);
    }
  }

  windowError(error) {
    Logger.log(this.MODULE_NAME, "windowError: " + error.message);
  }

  /**
   *
   * @param {String} url of video to playback
   */
  createPlayerConfig(urlInfo) {
    Logger.log(this.MODULE_NAME, "createPlayerConfig:" + urlInfo.url_video);
    Logger.log(this.MODULE_NAME, "autoplay:" + this.props.autoplay);
    // var playerSegsPerm = encodeURIComponent('&permutive=' + JSON.parse(localStorage._pdfps || '[]').slice(0,250).join(','));
    const config = {
      playerId: "zplayer",
      mediaObject: {
        primary: {
          src: urlInfo.url_video,
          // src: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
          type: "application/x-mpegURL"
        },
        loopPlayback: false,
        loopPlaylist: false
      },
      // vtt: urlInfo.url_trickplay,
      playsinline: true, //to disable iphone controls
      autoplay:
        this.props.autoplay !== undefined ? this.props.autoplay : "play",
      controls: this.props.ENABLE_CUSTOM_CONTROLS ? false : true,
      html5: {
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        hls: {
          overrideNative: true
        }
      },
      skin: "video-js"
      // disableCustomPlaybackForIOS10Plus: true
    };

    if (this.props.ENABLE_VIDEO_ADVERTISEMENT && this.props.adUrl) {
      Logger.log(this.MODULE_NAME, "enabled ads:" + this.props.adUrl);
      var playerSegsPerm = encodeURIComponent('&permutive=' + JSON.parse(localStorage._pdfps || '[]').slice(0,250).join(','));
      config.adTagUrl = this.props.adUrl;
      config.adTagUrl = config.adTagUrl.replace(/(cust_params[^&]+)/, '$1' + playerSegsPerm);
      
    }
    return config;
  }

  startControlsTimer() {
    this.cancelControlsTimer();
    this.controlsTimer = setTimeout(() => {
      this.player.trigger("userinactive");
    }, PLAYER_CONTROLS_DURATION);
  }

  cancelControlsTimer() {
    clearTimeout(this.controlsTimer);
  }

  checkStartTime() {
    Logger.log(this.MODULE_NAME, "checkStartTime:" + this.startTime);
    if (this.startTime) {
      this.fireListener(this.props.updateVideoPlayedDuration, this.startTime);
      this.onWaiting();
      this.player.seek(this.startTime);
      this.startTime = 0;
    }
  }

  onFirstFrameLoaded() {
    
    Logger.log(
      this.MODULE_NAME,
      "onFirstFrameLoaded: " + this.state.adInProgress
    );
    if (!this.state.adInProgress) {
      if (this.props.autoplay) {
        this.player
          .play()
          .then(() => {
            Logger.log(this.MODULE_NAME, "Autoplay success");
          })
          .catch(() => {
            Logger.log(this.MODULE_NAME, "Error during autoplay");
            if (!this.state.adInProgress) {
              if (this.player) {
                this.player.pause();
              }
              this.fireListener(this.props.onAutoplayError);
            }
          });
      } else {
        if (!this.state.adInProgress) {
          this.setState({
            paused: true
          });
          this.fireListener(this.props.onAutoplayError);
        }
      }
      this.setState({
        duration: this.player.duration()
      });
      this.props.fnUpdatePlayerQuality(this.player.getQualityLevels());
      this.startControlsTimer();
      this.fireListener(this.props.onFirstFrameLoaded);
      if(this.state.isLiveTv && !isMobile)
        this.updateLiveTvQuality();
    }

    if (getCookie("muted") === "true") {
      // for player
      this.mute();
    }
  }

  onLoadedData() {
    Logger.log(
      this.MODULE_NAME,
      "onLoadedData: duration" + this.player.duration()
    );
    if (
      this.state.duration !== this.player.duration() &&
      !this.state.adInProgress
    ) {
      this.setState({
        duration: this.player.duration()
      });
    }
    this.checkStartTime();
    this.fireListener(this.props.onLoadedData);
  }

  onCanPlayThrough() {
    Logger.log(this.MODULE_NAME, "onCanPlayThrough");
    this.props.fnUpdateVideoPlaybackState(VIDEO_PLAYBACK_STATE.PLAYING);
    this.fireListener(this.props.onCanPlayThrough);
  }

  onCanPlay() {
    Logger.log(this.MODULE_NAME, "onCanPlay");
    this.checkStartTime();
    this.fireListener(this.props.onCanPlay);
  }

  onPause() {
    Logger.log(this.MODULE_NAME, "onPause");
    this.setState({
      paused: true
    });
    this.fireListener(this.props.onPause);
  }

  onPlay() {
    Logger.log(this.MODULE_NAME, "onPlay");
    this.setState({
      paused: false
    });
    if (this.props.showNextEpisodeCounter) {
      this.player.pause();
      return;
    }
    this.fireListener(this.props.onPlay);
  }

  onEnded(event) {
    Logger.log(this.MODULE_NAME, "onEnded");
    if (this.player) {
      Logger.log(
        this.MODULE_NAME,
        "hasPostroll: " +
          this.player.adManager.hasPostroll +
          ", paused: " +
          this.player.paused()
      );
      Logger.log(this.MODULE_NAME, "adInProgress: " + this.state.adInProgress);
      const currentTime = this.player.currentTime();
      const duration = this.player.duration();
      if (
        !this.player.adManager.hasPostroll &&
        (duration > 0 && currentTime >= duration) &&
        !this.state.adInProgress
      ) {
        Logger.log(this.MODULE_NAME, "force pausing onEnded");
        this.player.pause();
        this.setState({
          paused: true
        });
        this.fireListener(this.props.onEnded);
      } else {
        this.checkForcePlay();
      }
    }
  }

  onError() {
    Logger.log(this.MODULE_NAME, "onError");
    this.fireListener(this.props.onError);
  }

  onTimeUpdate(event) {
    // Logger.log(
    //   this.MODULE_NAME,
    //   "onTimeUpdate: duration " + this.player.duration()
    // );
    if (!this.props.showNextEpisodeCounter) {
      this.fireListener(this.props.onTimeUpdate, event);
      if (!this.state.adInProgress) {
        if (
          isNaN(this.state.duration) ||
          this.state.duration !== this.player.duration()
        ) {
          this.setState({
            duration: this.player.duration()
          });
        }
        this.setState({
          bufferedDuration: event.target.player.bufferedPercent(),
          currentTime: this.player.currentTime(),
          progress: (this.player.currentTime() / this.state.duration) * 100,
          paused: false
        });
        this.props.fnUpdateVideoPlaybackState(VIDEO_PLAYBACK_STATE.PLAYING);
      }
    }
  }

  onStalled() {
    Logger.log(this.MODULE_NAME, "onStalled");
    this.setState({
      paused: true
    });
    this.fireListener(this.props.onStalled);
  }

  onWaiting() {
    Logger.log(this.MODULE_NAME, "onWaiting");
    this.props.fnUpdateVideoPlaybackState(VIDEO_PLAYBACK_STATE.BUFFERING);
    this.fireListener(this.props.onWaiting);
    if (navigator.onLine === false) {
      this.fireListener(this.props.onError);
      this.player.pause();
    }
  }

  onSeeking() {
    Logger.log(this.MODULE_NAME, "onSeeking");
    if (navigator.onLine === false) {
      this.fireListener(this.props.onError);
      this.player.pause();
    } else {
      this.props.fnUpdateVideoPlaybackState(VIDEO_PLAYBACK_STATE.BUFFERING);
    }
  }

  onAdComplete(event) {
    Logger.log(this.MODULE_NAME, "onAdComplete");
    this.setState({
      isVpaid: false
    });
    if (
      event &&
      event.A &&
      event.A.g &&
      event.A.g.adPodInfo &&
      event.A.g.adPodInfo.podIndex !== undefined &&
      "postroll" !== getAdType(event.A.g.adPodInfo.podIndex)
    ) {
      const currentTime = this.player.currentTime();
      const duration = this.player.duration();
      if (
        ((duration > 0 && currentTime <= duration) || isIOS) &&
        event.A.g.adPodInfo.adPosition === event.A.g.adPodInfo.totalAds
      ) {
        this.checkForcePlay();
      }
      if (event.A.g.adPodInfo.adPosition === event.A.g.adPodInfo.totalAds) {
        this.checkStartTime();
      }
    }
    this.fireListener(this.props.onAdComplete, event, this.player);
    // this.checkForcePlay();
    this.player.play();
  }

  checkForcePlay() {
    Logger.log(this.MODULE_NAME, "checkForcePlay");
    clearTimeout(this.forcePlayTimer);
    this.forcePlayTimer = setTimeout(() => {
      if (this.player.paused()) {
        Logger.log(this.MODULE_NAME, "force play after ad complete");
        this.fireListener(this.props.onForcePlay);
        this.player.play();
      }
    }, 1000);
  }

  onAdStarted(event) {
    Logger.log(this.MODULE_NAME, "onAdStarted");
    if (
      event &&
      event.A &&
      event.A.g &&
      event.A.g.apiFramework &&
      "VPAID" === event.A.g.apiFramework
    ) {
      Logger.log(this.MODULE_NAME, "vpaid");
      this.setState({
        isVpaid: true
      });
    } else {
      Logger.log(this.MODULE_NAME, "not vpaid");
      this.setState({
        isVpaid: false
      });
    }
    this.setState({
      adInProgress: true
    });
    this.fireListener(this.props.onAdStarted, event);
  }

  onPlayPauseClick(e) {
    Logger.log(this.MODULE_NAME, "onPlayPauseClick");
    this.togglePlayback();
    this.fireListener(this.props.onPlayPauseClick, e);
    e.preventDefault();
    e.stopPropagation();
  }

  onRewindClick(e) {
    Logger.log(this.MODULE_NAME, "onRewindClick");
    let seekTime =
      this.player.currentTime() - this.props.PLAYER_REWIND_DURATION;
    if (seekTime < 0) {
      seekTime = 0;
    }
    this.player.seek(seekTime);
    this.fireListener(this.props.onRewindClick, e);
  }

  mute() {
    Logger.log(this.MODULE_NAME, "mute");
    if (this.state.volume) {
      this.volumeBeforeMute = this.state.volume;
    }
    this.player.volume(0);
    this.setState({
      muted: true,
      volume: 0
    });
    setCookie("muted", true, COOKIES_TIMEOUT_NOT_REMEMBER);
  }

  unmute() {
    Logger.log(this.MODULE_NAME, "unmute");
    this.player.volume(this.volumeBeforeMute);
    this.setState({
      muted: false,
      volume: this.volumeBeforeMute
    });
    setCookie("muted", false, COOKIES_TIMEOUT_NOT_REMEMBER);
  }

  onMuteClick(e) {
    Logger.log(this.MODULE_NAME, "onMuteClick");
    this.fireListener(this.props.onMuteClick, e);
    if (this.state.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  onVolumeBarClick(event, percentage) {
    Logger.log(this.MODULE_NAME, "onVolumeBarClick:" + percentage);
    this.fireListener(this.props.onVolumeBarClick, event);
    this.setState({
      volume: percentage / 100
    });
    if (percentage >= 0 && percentage <= 100) {
      this.player.volume(percentage / 100);
    }
    if (percentage === 0) {
      setCookie("muted", true, COOKIES_TIMEOUT_NOT_REMEMBER);
      this.setState({
        muted: true
      });
    } else {
      setCookie("muted", false, COOKIES_TIMEOUT_NOT_REMEMBER);
      this.setState({
        muted: false
      });
    }
  }

  onProgressBarClick(event, percentage) {
    Logger.log(this.MODULE_NAME, "onProgressBarClick: " + percentage);
    const progress = (percentage * this.state.duration) / 100;
    Logger.log(this.MODULE_NAME, "progress: " + progress);
    if (progress >= 0 && progress <= this.state.duration) {
      this.player.seek(progress);
      this.onWaiting();
    }
    this.setState({
      progress: percentage
    });
    this.fireListener(this.props.onProgressBarClick, event, progress);
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Component Name - Player
   * Share button click handler
   * @param null
   * @returns {undefined}
   */
  onShareButtonClick(e) {
    Logger.log(this.MODULE_NAME, "onShareButtonClick");
    this.fireListener(this.props.onShareButtonClick, e);
  }

  onAddRemovePlaylist() {
    Logger.log(this.MODULE_NAME, "onAddRemovePlaylist");
    this.fireListener(this.props.onAddRemovePlaylist);
  }

  updateLiveTvQuality() {
   // console.log('Quality '+index)
    //Logger.log(this.MODULE_NAME, "onQualityChanged: " + index);
    // if (index >= this.props.qualityLevels.length) {
    //   index = -1;
    // }
    this.player.setCurrentQuality(this.props.qualityLevels.length-1);
    this.setState({
      currentQualityLevel: this.props.qualityLevels.length-1
    });
    //this.fireListener(this.props.onQualityChanged, index);
  }

  onQualityChanged(index) {
    Logger.log(this.MODULE_NAME, "onQualityChanged: " + index);
    if (index >= this.props.qualityLevels.length) {
      index = -1;
    }
    this.player.setCurrentQuality(index);
    this.setState({
      currentQualityLevel: index
    });
    this.fireListener(this.props.onQualityChanged, index);
  }

  setControlsDragging(value) {
    Logger.log(this.MODULE_NAME, "setControlsDragging: " + value);
    if (!value) {
      setTimeout(() => {
        this.areControlsDragging = value;
        this.startControlsTimer();
      }, 50);
    } else {
      this.areControlsDragging = value;
    }
    this.fireListener(this.props.setControlsDragging, value);
  }

  playerClick() {
    Logger.log(this.MODULE_NAME, "playerClick");
    if (
      !this.areControlsDragging &&
      !isIOS &&
      !this.props.showNextEpisodeCounter
    ) {
      this.togglePlayback();
    }
  }

  playerContainerClick(event) {
    Logger.log(this.MODULE_NAME, "playerContainerClick");

    if (
      event.target.className === "vjs-tech" ||
      event.target.className.includes("ima-ad-container") ||
      (isIOS && event.target.className === "player-controls-container")
    ) {
      if (this.props.playerReady && !this.props.showNextEpisodeCounter) {
        this.togglePlayback();      }
    }

    if (!this.state.adInProgress) {
      this.player.trigger("useractive");
      this.startControlsTimer();

      Logger.log(this.MODULE_NAME, "target: " + event.target.className);
    } else {
      Logger.log(this.MODULE_NAME, "Ad in progress");
    }
  }

  togglePlayerCarousel() {
    Logger.log(this.MODULE_NAME, "togglePlayerCarousel");
    this.fireListener(this.props.togglePlayerCarousel);
  }

  onTouchStart() {
    // Logger.log(this.MODULE_NAME, "onTouchStart");
    // this.togglePlayback()
    // this.player.trigger('useractive')
    // this.startControlsTimer()
    // if (this.state.showQuality) {
    //   this.setState({
    //     showQuality: false
    //   })
    // }
  }

  onMouseMove() {
    if (this.player.isPlayerCreated) {
      this.player.trigger("useractive");
    }
    this.startControlsTimer();
  }

  onMouseOverControls() {
    this.fireListener(this.props.onMouseOverControls);
  }

  onMouseOutControls() {
    this.fireListener(this.props.onMouseOutControls);
  }

  togglePlayback() {
    Logger.log(this.MODULE_NAME, "togglePlayback: " + this.player.paused());
    if (this.player.isPlayerCreated) {
      if (this.player.paused()) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  }

  onToggleFullScreen(hacked) {
    Logger.log(
      this.MODULE_NAME,
      "onToggleFullScreen: " +
        this.state.fullScreen +
        ", " +
        this.player.adManager.playerInterface.player.isFullscreen()
    );
    let fullscreen = false;
    if (
      !this.state.fullScreen ||
      (isIOS && !this.player.adManager.playerInterface.player.isFullscreen())
    ) {
      fullscreen = true;
      if (!enterFullScreen(document.getElementById("video-container"))) {
        this.player.requestFullscreen();
      }
    } else {
      fullscreen = false;
      if (!exitFullscreen()) {
        this.player.exitFullscreen();
      }
    }
    this.setState({
      fullScreen: !this.state.fullScreen
    });
    this.fireListener(this.props.onToggleFullScreen, fullscreen);
  }

  onFBShareButtonClick() {
    this.player.pause();
    this.fireListener(this.props.onFBShareButtonClick);
  }

  onTwitterShareButtonClick() {
    this.player.pause();
    this.fireListener(this.props.onTwitterShareButtonClick);
  }

  bigPlayIconClick() {
    Logger.log(this.MODULE_NAME, "onToggleFbigPlayIconClickullScreen: ");
    if (this.state.adPaused) {
      this.player.adManager.ima.resumeAd();
    } else if (this.player) {
      this.fireListener(this.props.bigPlayIconClick);
      this.player.play();
    }
  }

  fireListener(listener) {
    const normalArray = Array.from(arguments);
    normalArray.shift();
    if (listener && typeof listener === "function") {
      listener(...normalArray);
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div
        id="vjs-container"
        className={this.state.isVpaid ? "vpaid" : ""}
        onClick={!isMobile ? this.playerContainerClick.bind(this) : null}
        onTouchStart={this.playerContainerClick.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
      >
        <div
          className={
            "adPauseClickConsumer " + (this.state.adPaused ? "" : " gone")
          }
          onClick={this.resumeAd.bind(this)}
          // onTouchStart={isIOS ? this.resumeAd.bind(this) : null}
        />
        <div id="zplayerContainer" data-vjs-player />
        {this.props.ENABLE_CUSTOM_CONTROLS &&
          (
            <div className="player-controls-container">
              <PlayerControls
                showHours={this.state.duration > 60 * 60}
                setControlsDragging={this.setControlsDragging.bind(this)}
                playerClick={this.playerClick.bind(this)}
                // onTouchStart={this.onTouchStart.bind(this)}
                onMouseOver={this.onMouseOverControls.bind(this)}
                onMouseOut={this.onMouseOutControls.bind(this)}
                currentTime={this.state.currentTime}
                listener={this.listener}
                paused={this.state.paused}
                muted={this.state.muted}
                volume={this.state.volume * 100}
                progress={this.state.progress}
                duration={this.state.duration}
                bufferedDuration={this.state.bufferedDuration}
                autoplay={true}
              />
              <div className="playback-details" aria-label={this.props.title}>
                {this.props.episodeNumber !== undefined && (
                  <div className="episode-number">
                    {this.props.episodeNumber}
                  </div>
                )}
                {this.props.episodeNumber !== undefined &&
                  this.props.title !== "" && (
                    <div className="number-name-divider" />
                  )}
                <ClampLines
                  text={this.props.title + " "}
                  lines={2}
                  ellipsis="..."
                  className="episode-name"
                  moreText=""
                  lessText=""
                  innerElement="p"
                />
              </div>
              <div className="custom-controls-container">
                <div
                  className="custom-controls"
                  onMouseOver={this.onMouseOverControls.bind(this)}
                  onMouseOut={this.onMouseOutControls.bind(this)}
                >
                  {false && (
                    <div
                      className={
                        "share-button-container" +
                        (this.props.showSharePopup ? " open" : "")
                      }
                      onClick={this.onShareButtonClick.bind(this)}
                      // onTouchStart={
                      //   isIOS && !this.props.showSharePopup? this.onShareButtonClick.bind(this) : null
                      // }
                      tabIndex="0"
                      aria-label="Share"
                    >
                      <div className="share-text">{oResourceBundle.share}</div>
                      <div className="share-button custom-controls-button" />
                      <PopUp
                        ref="share-popup"
                        show={this.props.showSharePopup}
                        // onMouseOut={this.onPopupMouseOut.bind(this)}
                        // onMouseOver={this.onPopUpMouseOver.bind(this)}
                      >
                        <FacebookShareButton url={window.location.href}>
                          <Button
                            className="fb-share-bn"
                            icon={facebook}
                            showIconAfter={true}
                            onClick={this.onFBShareButtonClick.bind(this)}
                            // onTouchStart={
                            //   isIOS ? this.onFBShareButtonClick.bind(this) : null
                            // }
                          />
                        </FacebookShareButton>
                        <div className="icon-separator" />
                        <TwitterShareButton url={window.location.href}>
                          <Button
                            className="twitter-share-bn"
                            icon={twitter}
                            showIconAfter={true}
                            onClick={this.onTwitterShareButtonClick.bind(this)}
                            // onTouchStart={
                            //   isIOS
                            //     ? this.onTwitterShareButtonClick.bind(this)
                            //     : null
                            // }
                          />
                        </TwitterShareButton>
                      </PopUp>
                    </div>
                  )}
                  <div
                    className="playlist-button-container"
                    onClick={this.onAddRemovePlaylist.bind(this)}
                    // onTouchStart={
                    //   isIOS ? this.onAddRemovePlaylist.bind(this) : null
                    // }
                    tabIndex="0"
                    aria-label="playlist"
                  >
                  {this.props.videoInfo.videoInfo.data.data.video_id !== "LIVE_drama"?
                    <div className="playlist-text">
                      {oResourceBundle.playlist}
                    </div>:""}
                    {this.props.videoInfo.videoInfo.data.data.video_id !== "LIVE_drama"?
                    <div
                      className={
                        "playlist-button custom-controls-button " +
                        (this.props.isInPlaylist ? " inplaylist" : "")
                      }
                    />:""}
                  </div>
                  {this.props.qualityLevels &&
                    this.props.qualityLevels.length > 0 && (
                      <div
                        className={
                          "quality-button custom-controls-button" +
                          (this.props.showQuality ? " show" : "")
                        }
                        onClick={this.props.onQualityClick}
                        // onTouchStart={isIOS ? this.props.onQualityClick : null}
                        tabIndex="0"
                        aria-label="quality"
                      >
                        <div className="quality-text">
                          {this.props.currentQuality}
                        </div>                       
                        {this.props.showQuality && (
                          <QualitySelector
                            onMouseOver={this.onMouseOverControls.bind(this)}
                            onMouseOut={this.onMouseOutControls.bind(this)}
                            currentQualityLevel={this.state.currentQualityLevel}
                            onQualityChanged={this.onQualityChanged.bind(this)}
                            className="quality-selector-container"
                            addAuto={true}
                            appendProgressive={true}
                            appendHD={true}
                            hdValue={this.props.hdValue}
                            qualityLevels={ (this.state.isLiveTv)? (this.props.qualityLevels
                              .map(quality => {
                                return quality.height;
                              })
                              .sort((a, b) => a - b)): (this.props.qualityLevels
                                .map(quality => {
                                  return quality.height;
                                })
                                .sort((a, b) => a - b).reverse())
                             // .reverse()
                            }
                          />
                        )}
                      </div>
                    )}
                  <div
                    className="more-episodes-button-container"
                    onClick={this.togglePlayerCarousel.bind(this)}
                    // onTouchStart={
                    //   isIOS ? this.togglePlayerCarousel.bind(this) : null
                    // }
                    tabIndex="0"
                    aria-label={oResourceBundle.watch_more}
                  >
                    <div
                      className={
                        "more-episodes-button custom-controls-button" +
                        (this.props.showPlayerCarousel ? " show" : "")
                      }
                    />
                  </div>
                  <div
                    className="fullscreen-button-container"
                    onClick={this.onToggleFullScreen.bind(this)}
                    // onTouchStart={
                    //   isIOS ? this.onToggleFullScreen.bind(this) : null
                    // }
                    tabIndex="0"
                    aria-label="full screen"
                  >
                    <div className="fullscreen-button custom-controls-button" />
                  </div>
                </div>
              </div>
            </div>
          )}
        {this.props.showPlayIcon && (
          <div
            className="play-icon"
            onClick={this.bigPlayIconClick.bind(this)}
            // onTouchStart={isIOS ? this.bigPlayIconClick.bind(this) : null}
          />
        )}
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
    loading: state.loading,
    videoInfo: state.videoInfo,
    videoDetail:state.oVideoDetailContent,
    pageContent:state.oPageContent,
    videoPlaying: state.videoPlaying,
    videoPlaybackState: state.videoPlaybackState
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
    fnUpdateVideoPlaybackState: playing => {
      dispatch(actionTypes.fnUpdateVideoPlaybackState(playing));
    },
    fnUpdatePlayerQuality: qualityLevels => {
      dispatch(actionTypes.fnUpdatePlayerQuality(qualityLevels));
    }
  };
};

export const VIDEO_PLAYBACK_STATE = {
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  BUFFERING: "BUFFERING"
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoPlayer);
