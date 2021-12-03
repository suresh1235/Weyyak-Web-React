// import React from 'react';
// import BaseContainer from 'core/BaseContainer/';
import staricon from "../../../resources/assets/starpath.svg";
import addicon from "../../../resources/assets/plus-detail.png";
import shareicon from "../../../resources/assets/share-icon-path.svg";
import thumb1 from "../../../resources/assets/thumb-card1.png";
import trailercardimg from "../../../resources/assets/trailerthumb1.jpg";
import selectdroparrow from "../../../resources/assets/listarow.svg";
import bannerimg from "../../../resources/assets/TV_website.png";
import bannermblscreen from "../../../resources/assets/bannermblscreen.jpg";

import React from "react";
import BaseContainer from "core/BaseContainer/";
import { connect } from "react-redux";
import * as actionTypes from "app/store/action/";
import * as constants from "app/AppConfig/constants";
import { getDirection, capitalizeFirstLetter } from "app/utility/common";
import * as common from "app/utility/common";
import { Link } from "react-router-dom";
import { ENABLE_BANNER_ADVERTISEMENT } from "app/AppConfig/features";
import Slider from "core/components/Swiper";
import ImageThumbnail from "app/views/components/ImageThumbnail";
import BucketItem from "app/views/components/BucketItem";
import Spinner from "core/components/Spinner";
import VideoOverview from "app/views/components/VideoOverview";
import EpisodesMobileContainer from "app/views/components/EpisodesMobileContainer";
import EpisodeItem from "app/views/components/EpisodeItem";
import oResourceBundle from "app/i18n/";
import fallbackEn from "app/resources/assets/thumbnail/placeholder_carousel_ar_250.png";
import fallbackAr from "app/resources/assets/thumbnail/placeholder_carousel_ar_250.png";
import fallbackPosterAr from "app/resources/assets/thumbnail/placeholderA_slider_ar.png";
import Logger from "core/Logger";
import { isMobile,deviceType } from "react-device-detect";
import withTracker from "core/GoogleAnalytics/";
import {
  fnConstructContentURL,
  fnNavTo,
  getNavigationPathForPremiumContent,
} from "app/utility/common";
import "./index.scss";

import "./index.scss";

var bannerimgsrc = {
  backgroundImage: "url(" + bannerimg + ")",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

class VideoContent extends BaseContainer {
  constructor(props) {
    super(props);
    this.dropDown = React.createRef();
    this.state = {
      video: "",
      episodecards: true,
      trailerCards: false,
      season: 0,
      ContentTrailer: "",
      contentType: this.props.match.params.type,
      contentID: this.props.match.params.id,
      continueData: null,
      countryCode: this.props.sCountryCode ? this.props.sCountryCode : localStorage.getItem("country"),
      dropdownValue: 1,
      showDropdownMenu: false
    };
    this.handleShowDropdown = this.handleShowDropdown.bind(this)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
  }



  handleShowDropdown = (e) => {
    this.setState({
        showDropdownMenu: !this.state.showDropdownMenu
      })
  }

  componentDidMount() {
    // common.loadBannerAds();
    
    this.bAdSignalDataSent = false;
    const { type, id } = this.props.match.params;

    let countryCode = this.props.sCountryCode
      ? this.props.sCountryCode
      : localStorage.getItem("country");

    // this.fnSuccess();
    this.fnScrollToTop();

    if (type == "movie") {
      this.setState({
        episodecards: false,
        trailerCards: true,
      });
    }

    this.setState({
      ContentTrailer: this.props.TrailerVideos
    })


    // if (
    //   !this.props.oVideoDetailContent ||
    //   this.props.oVideoDetailContent.data.id !== Number(id)
    // ) {
      //Reset the data first
      this.props.fnResetVideoItemContent();
      this.props.fnFetchSelectedVideoItemContent(
        this.props.locale,
        id,
        type,
        this.state.countryCode,
        this.fnSuccess.bind(this)
      )
    // }

    document.addEventListener("mousedown", this.handleClickOutside);

  }

  episodeview = () => {
    this.setState({
      trailerCards: false,
      episodecards: true,
    });
  };

  trailersview = () => {
    this.setState({
      episodecards: false,
      trailerCards: true,
    });
  };

  componentWillReceiveProps(props) {

    if (props && props.TrailerVideos) {
      this.setState({
        ContentTrailer: props.TrailerVideos
      })
    }
    let selectedContentEpisodes =
      this.props.oVideoDetailContent &&
        this.props.oVideoDetailContent.data.seasons && this.props.oVideoDetailContent.data.seasons.length > 0
        ? this.props.oVideoDetailContent.data.seasons[this.state.season].episodes
        : null;

    if (selectedContentEpisodes) {
      this.setState({
        trailerCards: false,
        episodecards: true,
      });
    } else if (props && props.TrailerVideos && props.TrailerVideos.length > 0) {
      this.setState({
        trailerCards: true,
        episodecards: false,
      });
    }

  }

  /**
   * Component Name - VideoContent
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    setTimeout(common.loadBannerAds(),5000)
    // common.loadBannerAds();
    Logger.log(this.MODULE_NAME, "componentDidUpdate");

    const { langcode, type, id } = this.props.match.params;

    if (
      prevProps.locale !== this.props.locale ||
      prevProps.match.params.id !== this.props.match.params.id ||
      langcode !== prevProps.match.params.langcode
    ) {
      this.props.fnFetchSelectedVideoItemContent(
        this.props.locale,
        id,
        type,
        this.props.sCountryCode,
        this.fnSuccess.bind(this)
      );
      this.bAdSignalDataSent = false;

      this.props.fnFetchTrailerForVideos(
        this.props.locale,
        id,
        type,
        this.state.countryCode,
        this.fnTrailersSuccess
      );
    } else if (this.props.loginDetails !== prevProps.loginDetails) {
      this.props.fnFetchSelectedVideoItemContent(
        this.props.locale,
        id,
        type,
        this.props.sCountryCode,
        this.fnSuccess
      );
    }

    //Send signal for ads
    if (
      this.refs["bucket-ad-container"] &&
      !this.bAdSignalDataSent &&
      this.props.oVideoDetailContent
    ) {
      this.setSignalData(
        this.props.oVideoDetailContent.data,
        this.props.match.params.type,
        this.props.locale,
        this.props.sCountryCode,
        common.getUserId(),
        common.uuidv4(),
        this.props.bPageViewSent
      );
      this.props.fnPageViewSent();
      this.bAdSignalDataSent = true;
    }
  }
  /**
   * Used to focus top of the page
   * @param {undefined}
   */
  fnSuccess = (response) => {

    const { langcode, type, id } = this.props.match.params;

    this.setState({
      continueData: response[1].data.data
    })

    if (this.state.contentType == 'series') {
      this.props.fnFetchTrailerForVideos(
        this.props.locale,
        response[0].data.data.seasons[0].id,
        type,
        this.state.countryCode,
        this.fnTrailersSuccess
      );

    } else if (this.state.contentType == 'movie') {

      this.props.fnFetchTrailerForVideos(
        this.props.locale,
        id,
        type,
        this.state.countryCode,
        this.fnTrailersSuccess
      );
    }



    //scroll to top
    this.fnScrollToTop();
  };

  fnTrailersSuccess = (res) => {
    this.setState({
      ContentTrailer: res,
    });
  };

  /**
   * Slide next button click handler
   * @param {object} event - event object
   */
  handleRightClick() {
    Logger.log(this.MODULE_NAME, "handleRightClick");
    this.slider.slideNext();
  }
  /**
   * Slide previous button click handler
   * @param {object} event - event object
   */
  handleLeftClick() {
    Logger.log(this.MODULE_NAME, "handleLeftClick");
    this.slider.slidePrev();
  }

  time_convert(num) {
    const hours = Math.floor(num / 60);
    const minutes = num % 60;
    return `${hours}:${minutes}`;
  }
  /**
   * Component - VideoContent
   * Overview image play button click handler
   * @param {Object} evt - Event Object
   * @param {Object} oSelectedBtnProps - Selected button properties
   * @returns {undefined}
   */
  onOverviewPlayButtonClick(evt, oSelectedBtnProps) {
    const firstEpisodeId = !this.props.aRelatedVideosWithType
      ? this.props.oVideoDetailContent.data.seasons[0].episodes[0].id
      : "";
    // const next =
    //   oSelectedBtnProps.value.type === "series"
    //     ? `/${this.props.locale}/${constants.PLAYER}/${
    //         constants.EPISODE
    //       }/${firstEpisodeId}/${oSelectedBtnProps.value.friendlyUrl}`
    //     : `/${this.props.locale}/${constants.PLAYER}/${
    //         oSelectedBtnProps.value.type
    //       }/${oSelectedBtnProps.value.id}/${
    //         oSelectedBtnProps.value.friendlyUrl
    //           ? oSelectedBtnProps.value.friendlyUrl
    //           : ""
    //       }`;
    const next =
      oSelectedBtnProps.value.type === "series"
        ? `/${this.props.locale}/${constants.PLAYER}/${constants.EPISODE}/${firstEpisodeId}/${oSelectedBtnProps.value.friendlyUrl}`
        : " ";
    //this.props.history.push(next);
    this.fnNavToSubcriptionPath(oSelectedBtnProps, next);
    //Stop the Link handler to restrict route change
    // evt.preventDefault();
    evt.stopPropagation();
  }

  onClickTrialer(evt, item, SelectedVideoData) {

    window.localStorage.setItem("tvideo",`${this.state.season}:${item.trailer_number}`)

    fnNavTo.call(
      this,
      `/${this.props.locale}/${constants.PLAYER}/${SelectedVideoData.content_type}/${SelectedVideoData.id}/${SelectedVideoData.title}/${constants.TRAILER}/${item.video_id}`
    );
    evt.stopPropagation();
  }

  componentWillUnmount() {
    common.unloadBannerAds();
    this.props.fnUnmountTrailers()
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.dropDown.current &&
      !this.dropDown.current.contains(event.target)
    ) {
      this.setState({
        showDropdownMenu: false,
      });
    }
  };

  /**
   * Navigate to path based on subscription.
   * @param {Object} oSelectedBtnProps
   * @param {string} sVideoPath
   * @returns {undefined}
   */
  fnNavToSubcriptionPath(oSelectedBtnProps, sVideoPath) {
    //Check if the content is premium or not
    if (
      oSelectedBtnProps &&
      oSelectedBtnProps.value &&
      oSelectedBtnProps.value.premium_type &&
      oSelectedBtnProps.value.rights_type
    ) {
      const sNextPath = getNavigationPathForPremiumContent(
        oSelectedBtnProps.value.premium_type,
        oSelectedBtnProps.value.rights_type,
        this.props.locale,
        sVideoPath
      );
      sNextPath.then((sPath) => {
        if (sNextPath) {
          this.props.fnUpdateResumePagePath(sVideoPath);
          fnNavTo.call(this, sPath);
        }
      });
    }
  }
  /**
   * Component Name - VideoContent
   * Should proceed for the component render or not
   */
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  /**
   * Component Name - VideoContent
   * change Translated title
   * @param {String} sValue - value
   * @returns {undefined}
   */
  fnSetTranslatedTitle(sValue) {
    this.sTranslatedTitle = sValue;
    window.sTranslatedTitle = sValue.replace(/ +/g, "-");
  }
  /**
   * Component Name - VideoContent
   * get Translated title
   * @param {null}
   * @returns {String}
   */
  fnGetTranslatedTitle() {
    return this.sTranslatedTitle
      ? this.sTranslatedTitle.replace(/ +/g, "-")
      : "";
  }
  /**
   * thumbnail Link click handler
   * @param {object} event - event object
   */
  onThumbnailLinkItemClick(
    premium_type,
    rights_type,
    sPathToContent,
    live_type,
    event
  ) {

    const sNextPath = getNavigationPathForPremiumContent(
      premium_type,
      rights_type,
      this.props.locale,
      sPathToContent,
      live_type
    );
    sNextPath.then((sPath) => {
      if (sNextPath) {
        this.props.fnUpdateResumePagePath(sPathToContent);
        fnNavTo.call(this, sPath);
      }
    });

    //Stop the Link handler to restrict route change
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  /**
   * Component - VideoContent
   * Executes when component updated after props or state change
   * @param null
   * @returns {Object}
   */

   handleDropdownChange = (event) => {
    this.setState({
      dropdownValue: event.target.id,
      season: event.target.value
    })

    this.props.fnFetchTrailerForVideos(
      this.props.locale,
      this.props.oVideoDetailContent.data.seasons[event.target.value].id,
      this.state.contentType,
      this.state.countryCode,
      this.fnTrailersSuccess
    );
  }


  render() {

    Logger.log(this.MODULE_NAME, this.showBackdrop !== false);
    const season = this.state.season;
    const { type, id } = this.props.match.params;
    const dir = getDirection(this.props.locale);
    const rtl = dir === constants.RTL ? true : false;
    const selectedContentEpisodes =
      this.props.oVideoDetailContent &&
        this.props.oVideoDetailContent.data.seasons && this.props.oVideoDetailContent.data.seasons.length > 0
        ? this.props.oVideoDetailContent.data.seasons[season].episodes
        : null;
    let oMetaTags;
    let bucketTitle = "";
    if (this.props.oVideoDetailContent) {
      const {
        //This would be changed to seo_title
        //As wrong data is coming from the field binded with title
        title,
        translated_title,
        imagery: { thumbnail },
      } = this.props.oVideoDetailContent.data;
      let seo_description =
        this.props.oVideoDetailContent &&
          this.props.oVideoDetailContent.data &&
          this.props.oVideoDetailContent.data.seasons &&
          this.props.oVideoDetailContent.data.seasons.length > 0
          ? this.props.oVideoDetailContent.data.seasons[0].seo_description
          : this.props.oVideoDetailContent.data.seo_description;
      let seo_title =
        this.props.oVideoDetailContent &&
          this.props.oVideoDetailContent.data &&
          this.props.oVideoDetailContent.data.seasons &&
          this.props.oVideoDetailContent.data.seasons.length > 0
          ? this.props.oVideoDetailContent.data.seasons[0].seo_title
          : this.props.oVideoDetailContent.data.seo_title;

    
      // const {
      //   //This would be changed to seo_title
      //   //As wrong data is coming from the field binded with title
      //   title,
      //   seo_description,
      //   translated_title,
      //   imagery: { thumbnail }
      // } = this.props.oVideoDetailContent.data;
      bucketTitle = title;
      const oMetaObject = this.fnConstructMetaTags(
        `${seo_title} ${oResourceBundle.on} ${capitalizeFirstLetter(
          oResourceBundle.weyyak
        )}`,
        window.location.href,
        `${seo_description} | ${title} ${oResourceBundle.on
        } ${capitalizeFirstLetter(oResourceBundle.weyyak)}`,
        thumbnail
      );
      oMetaTags = this.fnUpdateMetaTags(oMetaObject);
      //Update the translated title
      this.fnSetTranslatedTitle(translated_title);
    } else {
      const title =
        capitalizeFirstLetter(oResourceBundle.weyyak) +
        " - " +
        this.props.match.params.name;
      const oMetaObject = this.fnConstructMetaTags(
        capitalizeFirstLetter(title),
        window.location.href
      );
      oMetaTags = this.fnUpdateMetaTags(oMetaObject);
    }
    let GoogleAdsContainer = constants.AD_CONTAINER_ID_PREFIX;
    if(isMobile) {
      GoogleAdsContainer = constants.AD_MOBILE_CONTAINER_ID_PREFIX;
    }

    const fallbackPosterImage =
      this.props.locale === constants.AR_CODE
        ? fallbackPosterAr
        : fallbackPosterAr;
    let firstEpisodeItem =
      selectedContentEpisodes &&
      selectedContentEpisodes.length > 0 &&
      selectedContentEpisodes[0];
    const firstItemTitle = (firstEpisodeItem
      ? firstEpisodeItem.title +
      (firstEpisodeItem.episode_number
        ? `-${oResourceBundle.episode}-${firstEpisodeItem.episode_number}`
        : "")
      : this.props.oVideoDetailContent
        ? this.props.oVideoDetailContent.data.title
        : ""
    ).replace(/ +/g, "-");

    // const sPathToContent =
    //   type === constants.SERIES
    //     ? `/${this.props.locale}/${constants.PLAYER}/${
    //         constants.EPISODE
    //       }/${firstEpisodeItem && firstEpisodeItem.id}/${firstItemTitle}`
    //     : `/${this.props.locale}/${constants.PLAYER}/${constants.MOVIE}/${id}/${firstItemTitle}`;

    let EpisodeID = firstEpisodeItem && firstEpisodeItem.id
    let EpisodeTile = firstItemTitle
    let EpisodeURLContent = `/${this.props.locale}/${constants.PLAYER}/${constants.EPISODE}/${EpisodeID}/${EpisodeTile}`

    if (this.state.continueData && this.state.continueData.content.contentType == "Episode") {
      EpisodeID = this.state.continueData.content.id
      if (selectedContentEpisodes && selectedContentEpisodes.length > 0) {
        let LastWatchedItem = selectedContentEpisodes.filter(ele => ele.id == EpisodeID)
        if (LastWatchedItem && LastWatchedItem[0]) {
          let { title, episode_number } = LastWatchedItem[0]
          EpisodeTile = (title + (episode_number ? `-${oResourceBundle.episode}-${episode_number}` : "")
          ).replace(/ +/g, "-")
        }
      }

      if (this.state.continueData.content.digitalRightsType == 3 && !this.props.isUserSubscribed) {
        EpisodeURLContent = `/${this.props.locale}/${constants.SUBSCRIPTION_TO_WATCH}`
      }
    }

    const sPathToContent =
      type === constants.SERIES
        ? ( this.state.continueData && this.state.continueData.content.digitalRightsType == 3 && !this.props.isUserSubscribed ?
           `/${this.props.locale}/${constants.SUBSCRIPTION_TO_WATCH}` :
           `/${this.props.locale}/${constants.PLAYER}/${constants.EPISODE}/${EpisodeID}/${EpisodeTile}`) :
        type === constants.PLAY ? `/${this.props.locale}/${constants.PLAYER}/${constants.PLAY}/${id}/${firstItemTitle}` :
          type === constants.PROGRAM ? `/${this.props.locale}/${constants.PLAYER}/${constants.PROGRAM}/${id}/${firstItemTitle}` :
            type === constants.LIVETV ? `/${this.props.locale}/${constants.PLAYER}/${constants.LIVETV}/${id}/${firstItemTitle}` :
              `/${this.props.locale}/${constants.PLAYER}/${constants.MOVIE}/${id}/${firstItemTitle}`;

    // `/${this.props.locale}/${constants.PLAYER}/${constants.MOVIE}/${id}/${firstItemTitle}`

    const premium_type = this.props.isMENARegion ? "AVOD" : "SVOD";
    let live_type = "";
    if (this.props.oVideoDetailContent && this.props.oVideoDetailContent.data) {
      live_type = this.props.oVideoDetailContent.data.content_type;
    }

    //const rights_type = this.props.digitalRights == 3 ? 3 : 1;
    let rights_type = "";
    if (this.props.oVideoDetailContent && this.props.oVideoDetailContent.data) {
      rights_type =
        this.props.oVideoDetailContent.data &&
          this.props.oVideoDetailContent.data.movies &&
          this.props.oVideoDetailContent.data.movies[0] &&
          this.props.oVideoDetailContent.data.movies[0].digitalRighttype
          ? this.props.oVideoDetailContent.data.movies[0].digitalRighttype
          : this.props.oVideoDetailContent.data.seasons[0].digitalRighttype;
    }

    let details = [];
    if (this.props.oVideoDetailContent) {
      details = this.props.oVideoDetailContent.data;
    }

    let disableTrialer = false;
    let disableEpisodes = false;


    if (this.state.ContentTrailer) {
      disableTrialer = this.state.ContentTrailer.length > 0;
    }
    if (selectedContentEpisodes) {
      disableEpisodes = selectedContentEpisodes.length > 0;
    }


    return this.props.oVideoDetailContent ? (
      <div className="details-container" >
        {oMetaTags}
        <section style={{ borderRadius: "6px", paddingTop: "0px" }}>
          <VideoOverview
            data={this.props.oVideoDetailContent.data}
            type={type}
            hidePlayIcon={false}
            premium_type={premium_type}
            rights_type={rights_type}
            live_type={live_type}
            premiumText={oResourceBundle.premium}
            videoId={id}
            sPathToContent={sPathToContent}
            onPlayButtonClick={this.onThumbnailLinkItemClick.bind(this)}
          // onPlayButtonClick={this.onOverviewPlayButtonClick.bind(this)}
          />
        </section>
        { ENABLE_BANNER_ADVERTISEMENT && (
          <div
            id={GoogleAdsContainer}
            // className={
            //   isMobile ? constants.AD_CLASS_MOBILE : constants.AD_CLASS_DESKTOP
            // }
            className={isMobile ?  "ad-class-desktop" : "ad-class-mobile"}
            ref="bucket-ad-container"
          >{common.loadBannerAds()}</div>
        )}

        <section>
          <div className="thumbscroll-block">

            <div className="scroll-pills">
              {this.props.match.params.type === "movie" ? (
                this.state.ContentTrailer &&
                this.state.ContentTrailer.length > 0 && (
                  <ul>
                    <li>
                      <div
                        className={
                          this.state.trailerCards
                            ? "active link-item"
                            : "active link-item"
                        }
                        onClick={this.trailersview}
                      >
                        {oResourceBundle.trailers}
                      </div>
                    </li>
                  </ul>
                )
              ) : (
                <ul>
                  {selectedContentEpisodes && (
                    <li>
                      <div
                        className={
                          this.state.episodecards
                            ? "active link-item"
                            : "link-item"
                        }
                        onClick={this.episodeview}
                      >
                        {oResourceBundle.episodes}
                      </div>
                    </li>
                  )}
                  {disableTrialer && (
                    <li>
                      <div
                        className={
                          this.state.trailerCards
                            ? "active link-item"
                            : "link-item"
                        }
                        onClick={this.trailersview}
                      >
                        {oResourceBundle.trailers}
                      </div>
                    </li>
                  )}
                </ul>
              )}

              {this.props.match.params.type === "series" && (

                <div className="dropdown" >
                  <input type="checkbox" value="toggle" name="toggle" className="dropdown__toggle" id="toggle" />
                  <label htmlFor="toggle" className={`dropdown__selected  ${this.state.showDropdownMenu && 'dropdown__selected-borders'} `} onClick={this.handleShowDropdown}>{oResourceBundle.season} {this.state.dropdownValue} <span className="arrow"></span></label>

                  {
                    this.state.showDropdownMenu && (
                      <div className="dropdown__menu" ref={this.dropDown}>
                        {this.props.oVideoDetailContent.data.seasons &&
                          this.props.oVideoDetailContent.data.seasons.map(
                            (item, index) => {
                              return (
                                <div className="dropdown__menu-listItem">
                                  <input type="radio"
                                    value={index}
                                    checked={this.state.dropdownValue === item.season_number}
                                    onClick={this.handleShowDropdown}
                                    id={item.season_number}
                                    onChange={this.handleDropdownChange} />
                                  <label htmlFor={item.season_number}
                                   className="dropdown__menu-label" >{oResourceBundle.season} {item.season_number}</label>
                                </div>
                              );
                            }
                          )}
                      </div>)
                  }
                </div>
              )}
            </div>

            <div className="thumbdata-block">
              {this.state.episodecards ? (
                <div className="episodes-slider">
                  <div className="series-divider">
                    <div />
                  </div>
                  {this.props.match.params.type == "series" || this.props.match.params.type == "program" ? (
                    <EpisodesMobileContainer>
                      {selectedContentEpisodes &&
                        selectedContentEpisodes.map((ele, i) => {
                          ele.content_type = constants.EPISODE;
                          let sPlayerPath = `/${this.props.locale}/${constants.PLAYER
                            }${fnConstructContentURL(ele.content_type, ele)}`;

                          if (ele.digitalRighttype == 3 && !this.props.isUserSubscribed) {
                            sPlayerPath = `/${this.props.locale}/${constants.SUBSCRIPTION_TO_WATCH}`;
                          }
                          return (
                            <div className="episode-container" key={ele.id}>
                              {/* {i !== 0 &&
                                i % constants.NUMBER_OF_EPISODES_PER_AD === 0 &&
                                ENABLE_BANNER_ADVERTISEMENT && (
                                  <div
                                    id={constants.AD_CONTAINER_ID_PREFIX}
                                    // className={
                                    //   isMobile
                                    //     ? constants.AD_CLASS_MOBILE
                                    //     : constants.AD_CLASS_DESKTOP
                                    // }
                                    className={isMobile ?  "ad-class-desktop" : "ad-class-mobile"}
                                  />
                                )} */}
                              <Link
                                className="router-link"
                                to={sPlayerPath}
                                onClick={this.onThumbnailLinkItemClick.bind(
                                  this,
                                  premium_type,
                                  // rights_type,
                                  ele.digitalRighttype,
                                  sPlayerPath,
                                  live_type
                                )}
                              >
                                <EpisodeItem
                                  locale={this.props.locale}
                                  id={ele.id}
                                  type={type}
                                  className="carousel-item"
                                  imageSrc={`${ele.imagery.thumbnail}${constants.IMAGE_DIMENSIONS}`}
                                  fallback={
                                    this.props.locale === constants.AR_CODE
                                      ? fallbackAr
                                      : fallbackEn
                                  }
                                  showPlayIcon={false}
                                  onImageDescText={
                                    ele.episode_number
                                      ? ele.episode_number.toString()
                                      : ""
                                  }
                                  showOnImageDesc={true}
                                  showDuration={false}
                                  // durationValue={"--:--"}
                                  durationValue={this.time_convert(ele.length)}
                                  descriptionText={ele.synopsis}
                                  title={ele.title}
                                />
                              </Link>
                            </div>
                          );
                        })}
                    </EpisodesMobileContainer>
                  ) : (
                    ""
                  )}

                  {this.props.match.params.type == "series" || this.props.match.params.type == "program" ? (
                    <Slider
                      bucketTitle={bucketTitle}
                      rtl={rtl}
                      dots={true}
                      ref={(slider) => (this.slider = slider)}
                      loopAdditionalSlides={0}
                      className="videoinfo-slider"
                      rebuildOnUpdate={true}
                      shouldSwiperUpdate={true}
                      shouldGrouptoOne={false}
                      ComponentUsedIn="EpisodeSlider"
                    >
                      {selectedContentEpisodes &&
                        selectedContentEpisodes.map((ele) => {
                          let sPathToPlayer = `/${this.props.locale}/${constants.PLAYER
                            }${fnConstructContentURL(ele.content_type, ele)}`;

                          if (ele.digitalRighttype == 3 && !this.props.isUserSubscribed) {
                            sPathToPlayer = `/${this.props.locale}/${constants.SUBSCRIPTION_TO_WATCH}`;
                          }

                          return (
                            <Link
                              className="router-link"
                              to={sPathToPlayer}
                              key={ele.id}
                              tabIndex="0"
                              onClick={this.onThumbnailLinkItemClick.bind(
                                this,
                                premium_type,
                                // rights_type,
                                ele.digitalRighttype,
                                sPathToPlayer,
                                live_type
                              )}
                            >
                              <ImageThumbnail
                                id={ele.id}
                                type={ele.content_type}
                                className="indithumb-card"
                                imageSrc={`${ele.imagery.thumbnail}${constants.IMAGE_DIMENSIONS}`}
                                fallback={
                                  this.props.locale === constants.AR_CODE
                                    ? fallbackAr
                                    : fallbackEn
                                }
                                descriptionText={
                                  ele.synopsis.substring(0, 75) +
                                  (ele.synopsis.substring(0, 75).length === 75
                                    ? "..."
                                    : "")
                                }
                                title={ele.title}
                                showDescription={true}
                                showOnImageDesc={true}
                                onImageDescText={
                                  ele.episode_number
                                    ? ele.episode_number.toString()
                                    : ""
                                }
                                showPlayIcon={true}
                                showPlayIcononHover={true}
                                animateOnHover={true}
                                showDuration={true}
                                // durationValue={"--:--"}
                                durationValue={this.time_convert(ele.length)}
                              />
                            </Link>
                          );
                        })}
                    </Slider>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              {!isMobile || deviceType == "tablet" ? (
                <div className="trailer-slider">

                  {this.state.trailerCards ? (
                    // ""
                    <Slider
                      bucketTitle={bucketTitle}
                      rtl={rtl}
                      dots={false}
                      ref={(slider) => (this.slider = slider)}
                      loopAdditionalSlides={0}
                      className="videoinfo-slider"
                      rebuildOnUpdate={true}
                      shouldSwiperUpdate={true}
                      shouldGrouptoOne={false}
                    >
                      {this.state.ContentTrailer &&
                        this.state.ContentTrailer.map((ele, index) => {
                          let currentVideoData = this.props.oVideoDetailContent
                            .data;
                          const sPathToPlayer = `/${this.props.locale}/${constants.PLAYER}/${currentVideoData.content_type}/${currentVideoData.id}/${currentVideoData.title}/${constants.TRAILER}/${ele.video_id}`;
                          return (
                            <Link
                              className="router-link"
                              to={sPathToPlayer}
                              key={index}
                              tabIndex="0"
                              onClick={(event) =>window.localStorage.setItem("tvideo",`${parseInt(this.state.season) + 1}:${index + 1}`)}
                            >
                              <ImageThumbnail
                                id={index}
                                type={'trailer'}
                                className="indithumb-card-trailer"
                                imageSrc={`${ele.imagery.trailerPosterImage}`}
                                //  imageSrc={`${ele.imagery.trailerPosterImage}${constants.IMAGE_DIMENSIONS}`}
                                fallback={
                                  this.props.locale === constants.AR_CODE
                                    ? fallbackAr
                                    : fallbackEn
                                }
                                descriptionText={
                                  ele.title.substring(0, 75) +
                                  (ele.title.substring(0, 75).length === 75
                                    ? "..."
                                    : "")
                                }
                                title={ele.title}
                                showDescription={true}
                                showOnImageDesc={true}
                                onImageDescText={index + 1}
                                showPlayIcon={true}
                                showPlayIcononHover={true}
                                animateOnHover={true}
                                showDuration={true}
                                isTrailer={true}
                                // durationValue={"--:--"}
                                durationValue={this.time_convert(ele.length)}
                              />
                            </Link>
                          );
                        })}
                    </Slider>
                  ) : (
                    ""
                  )}
                </div>)
                :
                <>
                  {this.state.trailerCards && this.state.ContentTrailer &&
                    this.state.ContentTrailer.map((ele, index) => {
                      let currentVideoData = this.props.oVideoDetailContent
                        .data;
                      const sPathToPlayer = `/${this.props.locale}/${constants.PLAYER}/${currentVideoData.content_type}/${currentVideoData.id}/${currentVideoData.title}/${constants.TRAILER}/${ele.video_id}`;
                      return (
                        <React.Fragment>
                          <div
                            className="indithumb-card indithumb-card1"
                            onClick={(e) =>
                              this.onClickTrialer(
                                e,
                                ele,
                                this.props.oVideoDetailContent.data
                              )
                            }
                          >
                            <div className="thumb-media">
                              <div className="thumb-img-src">
                                <img
                                  src={ele.imagery.trailerPosterImage}
                                  alt=""
                                />
                              </div>
                              <div className="thumb-img-data">
                                <div className="count">{index + 1}</div>
                                <div className="duration ">
                                  {this.time_convert(ele.length)}
                                </div>
                              </div>
                            </div>
                            <p>{ele.title.substring(0, 75) +
                              (ele.title.substring(0, 75).length === 75
                                ? "..."
                                : "")}</p>
                          </div>
                        </React.Fragment>
                      );
                    })}
                </>
              }
            </div>
          </div>
          {this.props.aRelatedVideos && this.props.aRelatedVideos.length > 0 ? (
            <BucketItem
              locale={this.props.locale}
              title={oResourceBundle.related_content}
              items={this.props.aRelatedVideos}
              rebuildOnUpdate={true}
            />
          ) : null}

        </section>
        {this.props.videoDetailLoading ? <Spinner /> : null}
      </div>
    ) : (
      <div>
        {oMetaTags}
        <Spinner />
      </div>
    );
  }
}

/**
 * Component - VideoContent
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = (state) => {
  return {
    locale: state.locale,
    videoDetailLoading: state.videoDetailLoading,
    oVideoDetailContent: state.oVideoDetailContent,
    aRelatedVideos: state.aRelatedVideos,
    TrailerVideos: state.TrailerVideos,
    aRelatedVideosWithType: state.aRelatedVideosWithType,
    loginDetails: state.loginDetails,
    sCountryCode: state.sCountryCode,
    isMENARegion: state.isMENARegion,
    isPremium: state.isPremium,
    bPageViewSent: state.bPageViewSent,
    isUserSubscribed: state.bIsUserSubscribed
  };
};
/**
 * method that maps state to props.
 * Component - HomeScreen
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = (dispatch) => {
  //dispatch action to redux store
  return {
    fnFetchSelectedVideoItemContent: (
      sLanguageCode,
      sVedeoId,
      sVideoType,
      sCountry,
      fnSuccess
    ) => {
      dispatch(
        actionTypes.fnFetchSelectedVideoItemContent(
          sLanguageCode,
          sVedeoId,
          sVideoType,
          sCountry,
          fnSuccess
        )
      );
    },
    fnResetVideoItemContent: () => {
      dispatch(
        actionTypes.updateSelectedVideoItemContent({
          oVideoContent: null,
          aRelatedVideos: null,
          aRelatedVideosWithType: null,
          aUserPlayList: [],
        })
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
    fnUnmountTrailers: () => {
      dispatch(actionTypes.fnUnmountTrailers());
    },
    fnUpdateResumePagePath: (sPath) => {
      dispatch(actionTypes.fnUpdateResumePagePath(sPath));
    },
    fnPageViewSent: () => {
      dispatch(actionTypes.fnPageViewSent());
    },
  };
};

export default withTracker(
  connect(mapStateToProps, mapDispatchToProps)(VideoContent)
);

// export default VideoContent;
