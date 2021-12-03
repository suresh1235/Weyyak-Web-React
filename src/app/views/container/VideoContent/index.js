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
import { isMobile } from "react-device-detect";
import withTracker from "core/GoogleAnalytics/";
import {
  fnConstructContentURL,
  fnNavTo,
  getNavigationPathForPremiumContent
} from "app/utility/common";
import "./index.scss";

class VideoContent extends BaseContainer {
  MODULE_NAME = "VideoContent";
  /**
   * Component Name - VideoContent
   * Executes when component mounted to DOM.
   */
  constructor(props){
    super(props);
    this.state={
      'digiRigts':''
    }
  }
  componentDidMount() {
   
    Logger.log(this.MODULE_NAME, "componentDidMount -- VideoContent");
    this.bAdSignalDataSent = false;
    const { langcode, type, id } = this.props.match.params;
    this.fnSuccess();

    if (
      !this.props.oVideoDetailContent ||
      this.props.oVideoDetailContent.data.id !== Number(id)
    ) {
      //Reset the data first
      this.props.fnResetVideoItemContent();
      let countryCode = (this.props.sCountryCode)?this.props.sCountryCode:localStorage.getItem('country');      
      this.props.fnFetchSelectedVideoItemContent(
        langcode,
        id,
        type,
        countryCode,
        this.fnSuccess.bind(this)
      );
    }
  }
  /**
   * Component Name - VideoContent
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    Logger.log(this.MODULE_NAME, "componentDidUpdate");
    
    
    const { langcode, type, id } = this.props.match.params;
    if (
      prevProps.locale !== this.props.locale ||
      prevProps.match.params.id !== this.props.match.params.id ||
      langcode !== prevProps.match.params.langcode
    ) {
      this.props.fnFetchSelectedVideoItemContent(
        langcode,
        id,
        type,
        this.props.sCountryCode,
        this.fnSuccess.bind(this)
      );
      this.bAdSignalDataSent = false;
    } else if (this.props.loginDetails !== prevProps.loginDetails) {
      this.props.fnFetchSelectedVideoItemContent(
        langcode,
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
  fnSuccess = () => {
    //scroll to top
    this.fnScrollToTop();
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

  
  time_convert(num)
  { 
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
    const next = oSelectedBtnProps.value.type === "series"  
        ? `/${this.props.locale}/${constants.PLAYER}/${
             constants.EPISODE
             }/${firstEpisodeId}/${oSelectedBtnProps.value.friendlyUrl}` : " ";
    //this.props.history.push(next);
    this.fnNavToSubcriptionPath(oSelectedBtnProps, next);
    //Stop the Link handler to restrict route change
    // evt.preventDefault();
    evt.stopPropagation();
  }

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
      sNextPath.then(sPath => {
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
  onThumbnailLinkItemClick(premium_type,rights_type, sPathToContent,live_type, event) {
    const sNextPath = getNavigationPathForPremiumContent(
      premium_type,
      rights_type,
      this.props.locale,
      sPathToContent,
      live_type,
    );
    sNextPath.then(sPath => {
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
  render() {
    Logger.log(this.MODULE_NAME, this.showBackdrop !== false);
    const { type, id } = this.props.match.params;
    const dir = getDirection(this.props.locale);
    const rtl = dir === constants.RTL ? true : false;
    const selectedContentEpisodes =
      this.props.oVideoDetailContent &&
      this.props.oVideoDetailContent.data.seasons
        ? this.props.oVideoDetailContent.data.seasons[0].episodes
        : null;
    let oMetaTags;
    let bucketTitle = "";
    if (this.props.oVideoDetailContent) {
      const {
        //This would be changed to seo_title
        //As wrong data is coming from the field binded with title
        title,        
        translated_title,
        imagery: { thumbnail }
        } = this.props.oVideoDetailContent.data;
     let seo_description=((this.props.oVideoDetailContent && this.props.oVideoDetailContent.data && this.props.oVideoDetailContent.data.seasons && this.props.oVideoDetailContent.data.seasons.length > 0)?this.props.oVideoDetailContent.data.seasons[0].seo_description:this.props.oVideoDetailContent.data.seo_description);
    let seo_title =((this.props.oVideoDetailContent && this.props.oVideoDetailContent.data && this.props.oVideoDetailContent.data.seasons && this.props.oVideoDetailContent.data.seasons.length > 0)?this.props.oVideoDetailContent.data.seasons[0].seo_title:this.props.oVideoDetailContent.data.seo_title);



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
        `${seo_description} | ${title} ${
          oResourceBundle.on
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

    const fallbackPosterImage =
      this.props.locale === constants.AR_CODE
        ? fallbackPosterAr
        : fallbackPosterAr;
    const firstEpisodeItem =
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

    const sPathToContent =
      type === constants.SERIES
        ? `/${this.props.locale}/${constants.PLAYER}/${
            constants.EPISODE
          }/${firstEpisodeItem && firstEpisodeItem.id}/${firstItemTitle}`
        : `/${this.props.locale}/${constants.PLAYER}/${
            constants.MOVIE
          }/${id}/${firstItemTitle}`;

    const premium_type = this.props.isMENARegion ? "AVOD" : "SVOD";
    let live_type = '';
    if(this.props.oVideoDetailContent && this.props.oVideoDetailContent.data){
      live_type = (this.props.oVideoDetailContent.data.content_type);
    }
    
    //const rights_type = this.props.digitalRights == 3 ? 3 : 1;
    let rights_type = '';
    if(this.props.oVideoDetailContent && this.props.oVideoDetailContent.data){
      rights_type = (this.props.oVideoDetailContent.data && this.props.oVideoDetailContent.data.movies && this.props.oVideoDetailContent.data.movies[0] && this.props.oVideoDetailContent.data.movies[0].digitalRighttype)?this.props.oVideoDetailContent.data.movies[0].digitalRighttype:(this.props.oVideoDetailContent.data.seasons[0].digitalRighttype)   ;
    }
    return this.props.oVideoDetailContent ? (
      <div className="details-container">
        {oMetaTags}
        <div className="details">
          <div className="movie-details">
            <div className="movie-image-mobile">
              <Link
                className="router-link"
                to={sPathToContent}
                onClick={this.onThumbnailLinkItemClick.bind(
                  this,
                  premium_type,
                  rights_type,
                  sPathToContent,
                  live_type,
                )}
              >
                <ImageThumbnail
                  displayPremiumTag={false}
                  premium_type={premium_type}
                  rights_type={rights_type}
                  live_type={live_type}
                  premiumText={oResourceBundle.premium}
                  id={id}
                  type={type}
                  friendlyUrl={firstItemTitle}
                  fallback={fallbackPosterImage}
                  className="video-details-thumbnail-item"
                  imageSrc={
                    this.props.oVideoDetailContent.data.imagery.mobile_img
                  }
                  showPlayIcon={true}
                  showPlayIcononHover={false}
                  onPlayButtonClick={this.onOverviewPlayButtonClick.bind(this)}
                />
              </Link>
            </div>
            <div className="movie-image-big-screens">
              <Link
                className="router-link"
                to={sPathToContent}
                onClick={this.onThumbnailLinkItemClick.bind(
                  this,
                  premium_type,
                  rights_type,
                  sPathToContent,
                  live_type,
                )}
              >
                <ImageThumbnail
                  displayPremiumTag={false}
                  premium_type={premium_type}
                  rights_type={rights_type}
                  premiumText={oResourceBundle.premium}
                  id={id}
                  type={type}
                  friendlyUrl={firstItemTitle}
                  fallback={
                    this.props.locale === constants.AR_CODE
                      ? fallbackAr
                      : fallbackEn
                  }
                  className="video-details-thumbnail-item"
                  imageSrc={`${
                    this.props.oVideoDetailContent.data.imagery.thumbnail
                  }${constants.IMAGE_DIMENSIONS}`}
                  showPlayIcon={true}
                  showPlayIcononHover={false}
                  onPlayButtonClick={this.onOverviewPlayButtonClick.bind(this)}
                />
              </Link>
            </div>
            <div className="movie-info">
              <VideoOverview
                data={this.props.oVideoDetailContent.data}
                type={type}
                hidePlayIcon={true}
              />
            </div>
          </div>
          {ENABLE_BANNER_ADVERTISEMENT && (
            <div
              id={constants.AD_CONTAINER_ID_PREFIX}
              className={
                isMobile
                  ? constants.AD_CLASS_MOBILE
                  : constants.AD_CLASS_DESKTOP
              }
              ref="bucket-ad-container"
            />
          )}
          <div>
            {this.props.aRelatedVideosWithType ? (
              ""
              // <BucketItem
              //   locale={this.props.locale}
              //   title={oResourceBundle.related_movies}
              //   items={this.props.aRelatedVideosWithType}
              //   rebuildOnUpdate={true}
              // />
            ) : (
              <div className="episodes-slider">
                <div className="series-divider">
                  <div />
                </div>
                <EpisodesMobileContainer>
                  {selectedContentEpisodes &&
                    selectedContentEpisodes.map((ele, i) => {
                      ele.content_type = constants.EPISODE;
                      const sPlayerPath = `/${this.props.locale}/${
                        constants.PLAYER
                      }${fnConstructContentURL(ele.content_type, ele)}`;
                      return (
                        <div className="episode-container" key={ele.id}>
                          {i !== 0 &&
                            i % constants.NUMBER_OF_EPISODES_PER_AD === 0 &&
                            ENABLE_BANNER_ADVERTISEMENT && (
                              <div
                                id={constants.AD_CONTAINER_ID_PREFIX}
                                className={
                                  isMobile
                                    ? constants.AD_CLASS_MOBILE
                                    : constants.AD_CLASS_DESKTOP
                                }
                              />
                            )}
                          <Link
                            className="router-link"
                            to={sPlayerPath}
                            onClick={this.onThumbnailLinkItemClick.bind(
                              this,
                              premium_type,
                              rights_type,
                              sPlayerPath,
                              live_type
                            )}
                          >
                            <EpisodeItem
                              locale={this.props.locale}
                              id={ele.id}
                              type={type}
                              className="carousel-item"
                              imageSrc={`${ele.imagery.thumbnail}${
                                constants.IMAGE_DIMENSIONS
                              }`}
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
                              durationValue = {this.time_convert(ele.length)}
                              descriptionText={ele.synopsis}
                              title={ele.title}
                            />
                          </Link>
                        </div>
                      );
                    })}
                </EpisodesMobileContainer>
              {this.props.match.params.type == "series"?
                <Slider
                  bucketTitle={bucketTitle}
                  rtl={rtl}
                  dots={true}
                  ref={slider => (this.slider = slider)}
                  loopAdditionalSlides={0}
                  className="videoinfo-slider"
                  rebuildOnUpdate={true}
                  shouldSwiperUpdate={true}
                  shouldGrouptoOne={false}
                >
                  {selectedContentEpisodes &&
                    selectedContentEpisodes.map(ele => {
                      const sPathToPlayer = `/${this.props.locale}/${
                        constants.PLAYER
                      }${fnConstructContentURL(ele.content_type, ele)}`;
                      return (
                        <Link
                          className="router-link"
                          to={sPathToPlayer}
                          key={ele.id}
                          tabIndex="0"
                          onClick={this.onThumbnailLinkItemClick.bind(
                            this,
                            premium_type,
                            rights_type,
                            sPathToPlayer,
                            live_type
                          )}
                        >
                          <ImageThumbnail
                            id={ele.id}
                            type={ele.content_type}
                            className="carousel-item"
                            imageSrc={`${ele.imagery.thumbnail}${
                              constants.IMAGE_DIMENSIONS
                            }`}
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
                            durationValue = {this.time_convert(ele.length)}

                          />
                        </Link>
                      );
                    })}
                </Slider>:""}
                {/* <div
                  onClick={this.handleLeftClick.bind(this)}
                  className="left-arrow"
                />
                <div
                  onClick={this.handleRightClick.bind(this)}
                  className="right-arrow"
                /> */}
              </div>
            )}
            {this.props.aRelatedVideos ? (
              <BucketItem
                locale={this.props.locale}
                title={oResourceBundle.related_content}
                items={this.props.aRelatedVideos}
                rebuildOnUpdate={true}
              />
            ) : null}
          </div>
        </div>
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
const mapStateToProps = state => {
  return {
    locale: state.locale,
    videoDetailLoading: state.videoDetailLoading,
    oVideoDetailContent: state.oVideoDetailContent,
    aRelatedVideos: state.aRelatedVideos,
    aRelatedVideosWithType: state.aRelatedVideosWithType,
    loginDetails: state.loginDetails,
    sCountryCode: state.sCountryCode,
    isMENARegion: state.isMENARegion,
    isPremium: state.isPremium,
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
          aUserPlayList: []
        })
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
  )(VideoContent)
);
