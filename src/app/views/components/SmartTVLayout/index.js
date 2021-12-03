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
import { Link, Route } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actionTypes from "app/store/action/";
import ImageThumbnail from "app/views/components/ImageThumbnail";
import Slider from "core/components/Swiper";
import ImageCarousel from "app/views/components/ImageCarousel";
import {
  ADD_TRIAL_BANNER,
  ENABLE_SERIES_PLAYBUTTON_TO_PLAYER
} from "app/AppConfig/features";
import * as CONSTANTS from "app/AppConfig/constants";
import fallbackEn from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import fallbackAr from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import oResourceBundle from "app/i18n/";
import * as common from "app/utility/common";
import Logger from "core/Logger";

import "./index.scss";

const MODULE_NAME = "SmartTvLayout";
class SmartTvLayout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobileView: window.innerWidth < CONSTANTS.MOBILE_VIEW_THRESHOLD,
      mobileCarousel: [],
      desktopCarouselLeft: [],
      desktopCarouselRight: []
    };
    const carouselUpdates = this.setPlaylistData(true);
    this.state.mobileCarousel = carouselUpdates.mobileCarousel;
    this.state.desktopCarouselLeft = carouselUpdates.desktopCarouselLeft;
    this.state.desktopCarouselRight = carouselUpdates.desktopCarouselRight;
  }

  /**
   * Component Name - SmartTvLayout
   * It executes after component mounted
   * @param null
   * @returns { undefined }
   */
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentDidUpdate(prevProps, prevState) {
    Logger.log(MODULE_NAME, "componentDidUpdate");
    if (
      prevState.mobileView !== this.state.mobileView ||
      prevProps.isUserSubscribed !== this.props.isUserSubscribed
    ) {
      this.setPlaylistData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  setPlaylistData(fromConstructor) {
    Logger.log(MODULE_NAME, "setPlaylistData");
    let mobileCarousel = [];
    let desktopCarouselLeft = [];
    let desktopCarouselRight = [];
    const items = this.props.playListData;
    if (ADD_TRIAL_BANNER && !this.props.isUserSubscribed) {
      if (items) {
        if (this.state.mobileView) {
          const trialBanner = common.getTrialBannerData(
            CONSTANTS.TRIAL_BANNER_LANDSCAPE,
            this.props.isMENARegion,
            this.props.locale
          );
          if (items[0] && items[0].content) {
            mobileCarousel = [...items[0].content];
            mobileCarousel.unshift(trialBanner);
          }
        } else {
          const trialBanner = common.getTrialBannerData(
            CONSTANTS.TRIAL_BANNER_SQUARE,
            this.props.isMENARegion,
            this.props.locale
          );
          if (items[1] && items[1].content) {
            desktopCarouselRight = [...items[1].content];
            desktopCarouselRight.unshift(trialBanner);
          }
          if (items[2] && items[2].content) {
            desktopCarouselLeft = [...items[2].content];
          }
        }
      }
    } else {
      mobileCarousel = items[0].content;
      desktopCarouselLeft = items[2].content;
      desktopCarouselRight = items[1].content;
    }
    if (ADD_TRIAL_BANNER  && !this.checkContestBanner(desktopCarouselRight)) {
      if (items) {
        if (this.state.mobileView) {
          const contestBanner = common.getTrialBannerData(CONSTANTS.CONTEST_BANNER_LANDSCAPE, this.props.isMENARegion, this.props.locale);
          mobileCarousel.unshift(contestBanner);
        } else {
          const contestBanner = common.getTrialBannerData(CONSTANTS.CONTEST_BANNER_SQUARE, this.props.isMENARegion,this.props.locale);
          desktopCarouselRight.unshift(contestBanner);
          if (items[2] && items[2].content) {
            desktopCarouselLeft = [...items[2].content];
          }
        }
      }
    }
    if (fromConstructor) {
      // this.setState({
      //   mobileCarousel: mobileCarousel,
      //   desktopCarouselLeft: desktopCarouselLeft,
      //   desktopCarouselRight: desktopCarouselRight
      // })
      // this.state.mobileCarousel = mobileCarousel;
      // this.state.desktopCarouselLeft = desktopCarouselLeft;
      // this.state.desktopCarouselRight = desktopCarouselRight;
      return {
        mobileCarousel: mobileCarousel,
        desktopCarouselLeft: desktopCarouselLeft,
        desktopCarouselRight: desktopCarouselRight
      }
    } else {
      this.setState({
        mobileCarousel: mobileCarousel,
        desktopCarouselLeft: desktopCarouselLeft,
        desktopCarouselRight: desktopCarouselRight
      });
    }
  }

  checkContestBanner(desktopCarouselRight){
    let exists = false; 
 
    desktopCarouselRight.forEach(item=>{
        if(item.id ==  CONSTANTS.CONTEST_BANNER_CONTENT_TYPE){
          exists = true;
        }
    })
    return exists;
  }

  /**
   * get image thumbnail url from given url
   * @param {Array} aThumbnailPlaylists - list of thumbnails
   * @param {Number} itemIndex - item index to be fetched
   * @param {String} locale - Current local
   * @param {String} sURL - URL
   * @returns {Component} - Thumbnail component
   */
  getThumbnailLink(aThumbnailPlaylists, itemIndex, locale) {
    return (
      <Link
        aria-label={aThumbnailPlaylists[itemIndex].title}
        to={`/${locale}${common.fnConstructContentURL(
          aThumbnailPlaylists[itemIndex].content_type,
          aThumbnailPlaylists[itemIndex]
        )}`}
        key={aThumbnailPlaylists.id}
        tabIndex="0"
      >
        <Route
          render={({history}) => (
            <ImageThumbnail
              displayPremiumTag={false} //TODO
              premium_type={this.props.isMENARegion ? "AVOD" : "SVOD"}
              // rights_type={this.props.digitalRights == 3? 3 : 1}
              premiumText={oResourceBundle.premium}
              id={aThumbnailPlaylists[itemIndex].id}
              alt={aThumbnailPlaylists[itemIndex].title}
              type={aThumbnailPlaylists[itemIndex].content_type}
              fallback={locale === CONSTANTS.AR_CODE ? fallbackAr : fallbackEn}
              className="carousel-item"
              friendlyUrl={aThumbnailPlaylists[itemIndex].title.replace(
                / +/g,
                "-"
              )}
              imageSrc={`${aThumbnailPlaylists[itemIndex].imagery.thumbnail}${
                CONSTANTS.IMAGE_DIMENSIONS
              }`}
              showPlayIcon={true}
              showPlayIcononHover={true}
              onPlayButtonClick={this.onPlayButtonClick.bind(this, history)}
            />
          )}
        />
      </Link>
    );
  }
  /**
   * Handler for windo scroll
   * @param {Object} oEvent - event handler
   * @returns {undefined}
   */
  handleScroll(oEvent) {
    if (window.pageYOffset === 0 && this.refs["grid-arrow"]) {
      this.refs["grid-arrow"].classList.remove("hidden");
    } else if (this.refs["grid-arrow"]) {
      this.refs["grid-arrow"].classList.add("hidden");
    }
  }

  updateWindowDimensions() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobileView: window.innerWidth < CONSTANTS.MOBILE_VIEW_THRESHOLD
    });
  }

  /**
   * Component Name - SmartTvLayout
   * get the element offset relative to the document
   * @param {Object} - HTML element
   * @returns { Object } - returns top and left offset
   */
  getOffsetTop(elem) {
    const box = elem.getBoundingClientRect();
    const body = document.body;
    const docEl = document.documentElement;

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft =
      window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    const clientTop = docEl.clientTop || body.clientTop || 0;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;

    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  }

  /**
   * Component Name - SmartTvLayout
   * Scroll to element on click arrow
   * @param null
   * @returns {undefined}
   */
  onGridArrowClick() {
    if (this.refs["grid-arrow-focus"]) {
      const item = this.refs["grid-arrow-focus"];
      //TODO jquery animate should be changed to native js animation
      if (item) {
        window
          .$("html, body")
          .stop()
          .animate(
            {
              scrollTop: this.getOffsetTop(item).top
            },
            600
          );
      }
    }
  }

  /**
   * Thumbnail play button click handler.
   * @param {Object} event
   * @param {Object} oSelectedBtnProps
   */
  onPlayButtonClick(history, event, oSelectedBtnProps) {
    if (!oSelectedBtnProps) {
      oSelectedBtnProps = {
        value: JSON.parse(event.target.parentElement.value)
      };
    }
    let next =
      oSelectedBtnProps.value.type === "series"
        ? `/${this.props.locale}/${oSelectedBtnProps.value.type}/${
            oSelectedBtnProps.value.id
          }/${oSelectedBtnProps.value.friendlyUrl}`
        : `/${this.props.locale}/${CONSTANTS.PLAYER}/${
            oSelectedBtnProps.value.type
          }/${oSelectedBtnProps.value.id}/${
            oSelectedBtnProps.value.friendlyUrl
              ? oSelectedBtnProps.value.friendlyUrl
              : ""
          }`;
    if (
      ENABLE_SERIES_PLAYBUTTON_TO_PLAYER &&
      oSelectedBtnProps.value.type === "series"
    ) {
      this.props.fnFetchBucketSelectedItemContent(
        this.props.locale,
        oSelectedBtnProps.value.id,
        oSelectedBtnProps.value.type,
        this.props.sCountryCode,
        "",
        firstEpisode => {
          firstEpisode.content_type = CONSTANTS.EPISODE;
          next = `/${this.props.locale}/${
            CONSTANTS.PLAYER
          }${common.fnConstructContentURL(CONSTANTS.EPISODE, firstEpisode)}`;
          //history.push(next);
          this.fnNavToSubcriptionPath(oSelectedBtnProps, next);
        }
      );
    } else {
      //history.push(next);
      this.fnNavToSubcriptionPath(oSelectedBtnProps, next);
    }
    // Stop the Link handler to restrict route change
    // event.preventDefault();
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
      const sNextPath = common.getNavigationPathForPremiumContent(
        oSelectedBtnProps.value.premium_type,
        oSelectedBtnProps.value.rights_type,
        this.props.locale,
        sVideoPath
      );
      sNextPath.then(sPath => {
        if (sPath) {
          common.setCookie(
            CONSTANTS.RESUME_PATH_COOKIE_NAME,
            sVideoPath,
            CONSTANTS.COOKIES_TIMEOUT_NOT_REMEMBER
          );
          const videoObject = {
            premiumType: oSelectedBtnProps.value.premium_type,
            rightsType: oSelectedBtnProps.value.rights_type,
            locale: this.props.locale,
            videoPath: sVideoPath
          };
          common.setCookie(
            CONSTANTS.COOKIE_VIDEO_RESUME_OBJECT,
            JSON.stringify(videoObject),
            CONSTANTS.COOKIES_TIMEOUT_NOT_REMEMBER
          );
          this.props.fnUpdateResumePagePath(sVideoPath);
          common.fnNavTo.call(this, sPath);
        }
      });
    }
  }

  /**
   * Component Name - SmartTvLayout
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    const dir = common.getDirection(this.props.locale);
    const rtl = dir === CONSTANTS.RTL ? true : false;
    const aThumbnailPlaylists = this.props.playListData[0].content;
    const mobileCarouselLength = ADD_TRIAL_BANNER ? 4 : 3;
    return (
      <React.Fragment>
        {this.state.mobileView ? (
          <section className="featured-cover-container">
            <div className="featured-cover layout-a show-featured calculate-with-width">
              <div className="first-row">
                <div className="featured-custom-cover-carousel" role="toolbar">
                  <ImageCarousel
                    history={this.props.history}
                    isMENARegion={this.props.isMENARegion}
                    locale={this.props.locale}
                    items={this.state.mobileCarousel.slice(
                      0,
                      mobileCarouselLength
                    )}
                    imageType={"mobile_img"}
                    showfallPosterImage={true}
                    onPlayButtonClick={this.onPlayButtonClick.bind(this)}
                  />
                </div>
              </div>
              <div className="featured-custom-cover-mobile">
                <Route
                  render={({ history }) => (
                    <Slider
                      rtl={rtl}
                      dots={false}
                      isCarousel={false}
                      slidesToScroll={1}
                      expand={true}
                      onPlayButtonClick={this.onPlayButtonClick.bind(
                        this,
                        history
                      )}
                    >
                      {this.props.playListData[2].content.map((ele, i) => {
                            const digitalRights = (ele.content_type==='movie')? ele.movies[0].digitalRighttype:ele.seasons[0].digitalRighttype;
                            
                        return (
                          <Link
                            to={`/${
                              this.props.locale
                            }${common.fnConstructContentURL(
                              ele.content_type,
                              ele
                            )}`}
                            key={ele.id}
                            aria-label={ele.title}
                          >
                            <ImageThumbnail
                              displayPremiumTag={false} //TODO
                              premium_type={
                                this.props.isMENARegion ? "AVOD" : "SVOD"
                              }
                              // rights_type={this.props.digitalRights == 3? 3:1}
                              premiumText={oResourceBundle.premium}
                              id={ele.id}
                              alt={ele.title}
                              type={ele.content_type}
                              fallback={
                                this.props.locale === CONSTANTS.AR_CODE
                                  ? fallbackAr
                                  : fallbackEn
                              }
                              className="carousel-item"
                              friendlyUrl={ele.title.replace(/ +/g, "-")}
                              imageSrc={`${ele.imagery.thumbnail}${
                                CONSTANTS.IMAGE_DIMENSIONS
                              }`}
                              showPlayIcon={true}
                              showPlayIcononHover={true}
                              onPlayButtonClick={this.onPlayButtonClick.bind(
                                this,
                                history
                              )}
                              digitalRights={digitalRights}
                            />
                          </Link>
                        );
                      })}
                    </Slider>
                  )}
                />
              </div>
              <div className="grid-arrow" />
            </div>
          </section>
        ) : (
          <section className="featured-grid-container">
            <div className="featured-grid show-featured">
              <div className="first-column">
                <div style={{ display: "flex" }}>
                  <div className="featured-item desk1Img">
                    {this.getThumbnailLink(
                      aThumbnailPlaylists,
                      0,
                      this.props.locale
                    )}
                  </div>
                  <div className="featured-item desk2Img">
                    {this.getThumbnailLink(
                      aThumbnailPlaylists,
                      1,
                      this.props.locale
                    )}
                  </div>
                </div>
                <div className="featured-grid-carousel-container">
                  <ImageCarousel
                    history={this.props.history}
                    isMENARegion={this.props.isMENARegion}
                    locale={this.props.locale}
                    items={this.state.desktopCarouselLeft}
                    onPlayButtonClick={this.onPlayButtonClick.bind(this)}
                  />
                </div>
              </div>
              <div className="second-column">
                <div className="featured-item desk3Img">
                  {this.getThumbnailLink(
                    aThumbnailPlaylists,
                    2,
                    this.props.locale
                  )}
                </div>
                <div className="featured-item desk4Img">
                  {this.getThumbnailLink(
                    aThumbnailPlaylists,
                    3,
                    this.props.locale
                  )}
                </div>
                <div className="featured-item desk5Img">
                  {this.getThumbnailLink(
                    aThumbnailPlaylists,
                    4,
                    this.props.locale
                  )}
                </div>
              </div>
              <div className="third-column">
                <div className="featured-grid-carousel-container">
                  <ImageCarousel
                    history={this.props.history}
                    isMENARegion={this.props.isMENARegion}
                    locale={this.props.locale}
                    items={this.state.desktopCarouselRight}
                    onPlayButtonClick={this.onPlayButtonClick.bind(this)}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <div className="featured-item desk7Img">
                    {this.getThumbnailLink(
                      aThumbnailPlaylists,
                      5,
                      this.props.locale
                    )}
                  </div>
                  <div className="featured-item desk8Img">
                    {this.getThumbnailLink(
                      aThumbnailPlaylists,
                      6,
                      this.props.locale
                    )}
                  </div>
                </div>
              </div>
              <div ref="grid-arrow" className="grid-arrow">
                <div role="button" className="arrow-container" tabIndex="0">
                  <span
                    className="grid-arrowImg"
                    ref="grid-arrow-focus"
                    onClick={this.onGridArrowClick.bind(this)}
                  >
                    {" "}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </React.Fragment>
    );
  }
}

/**
 * Component - SmartTvLayout
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    sCountryCode: state.sCountryCode,
    isMENARegion: state.isMENARegion,
    isUserSubscribed: state.bIsUserSubscribed
  };
};
/**
 * method that maps state to props.
 * Component - SmartTvLayout
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  //dispatch action to redux store
  return {
    fnFetchBucketSelectedItemContent: (
      sLanguageCode,
      sVedeoId,
      sVideoType,
      sCountry,
      sBucketTitle,
      fnSuccess
    ) => {
      dispatch(
        actionTypes.fnFetchBucketSelectedItemContent(
          sLanguageCode,
          sVedeoId,
          sVideoType,
          sCountry,
          sBucketTitle,
          fnSuccess
        )
      );
    },
    fnUpdateResumePagePath: sPath => {
      dispatch(actionTypes.fnUpdateResumePagePath(sPath));
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SmartTvLayout)
);
