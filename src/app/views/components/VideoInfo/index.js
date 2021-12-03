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
import { connect } from "react-redux";
import * as actionTypes from "app/store/action/";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
//import Slider from 'core/components/Slider';
import Slider from "core/components/Swiper";
import ImageThumbnail from "app/views/components/ImageThumbnail";
import Image from "core/components/Image";
import SegmentedButton from "core/components/SegmentedButton";
import VideoOverview from "app/views/components/VideoOverview";
import oResourceBundle from "app/i18n/";
import * as constants from "app/AppConfig/constants";
import { getDirection } from "app/utility/common";
import fallbackEn from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import fallbackAr from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import Logger from "core/Logger";
import {
  fnConstructContentURL,
  getNavigationPathForPremiumContent,
  fnNavTo
} from "app/utility/common";
import "./index.scss";

class VideoInfo extends React.Component {
  MODULE_NAME = "VideoInfo";
  /**
   * Component Name - VideoInfo
   * Executes when component mounted to DOM.
   * @param null
   */
  constructor(props) {
    super(props);
    this.state = {
      selectedSegmentButton:
        this.props.type === constants.SERIES
          ? constants.EPISODES
          : constants.OVERVIEW
    };
  }
  /**
   * Component Name - VideoInfo
   * Should proceed for the component render or not
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props === nextProps &&
      nextState.selectedSegmentButton === this.state.selectedSegmentButton
    ) {
      return false;
    }
    return true;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps !== prevState.prevProps) {
      return {
        selectedSegmentButton:
          nextProps.type === constants.SERIES
            ? constants.EPISODES
            : constants.OVERVIEW,
        prevProps: nextProps
      };
    }
    // Return null to indicate no change to state.
    return {
      prevProps: nextProps
    };
  }

  /**
   * Component Name - VideoInfo
   * Executes when component mounted to DOM.
   * @param null
   */
  componentDidMount() {
    Logger.log(this.MODULE_NAME, "componentDidMount -- VideoInfo");
    this.props.fnFetchBucketSelectedItemContent(
      this.props.locale,
      this.props.videoId,
      this.props.type,
      this.props.sCountryCode,
      this.props.bucketTitle
    );
  }
  /**
   * Component Name - VideoInfo
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    const oBucketContent = this.props.oBucketVideoInfo;
    let oSelectedVideoContent = null;
    if (oBucketContent) {
      oSelectedVideoContent = oBucketContent[this.props.bucketTitle];
    }
    if (
      oSelectedVideoContent &&
      oSelectedVideoContent.data.id !== this.props.videoId
    ) {
      //While changing item set the backdrop to null
      oSelectedVideoContent.data.id = this.props.videoId;
      oSelectedVideoContent.data.imagery.backdrop = "";
      this.props.fnResetBucketSelectedItemData(
        oSelectedVideoContent,
        this.props.bucketTitle
      );
      //Get new item data
      this.props.fnFetchBucketSelectedItemContent(
        this.props.locale,
        this.props.videoId,
        this.props.type,
        this.props.sCountryCode,
        this.props.bucketTitle
      );
    }
  }
  /**
   * Segment Button Click handler.
   * @param {object} event - event object
   * @param {object} oSelectedBtnProps - selected button properties
   */
  onSegmentedButtonClick(event, oSelectedBtnProps) {
    this.setState({ selectedSegmentButton: oSelectedBtnProps.value });
  }
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

  /**
   * Episode thumbnail click handler
   * @param {object} event - event object
   */
  onEpisodeItemClick(premium_type, sPathToContent, event) {
    const sNextPath = getNavigationPathForPremiumContent(
      premium_type,
      this.props.locale,
      sPathToContent
    );
    sNextPath.then(sPath => {
      if (sPath) {
        this.props.fnUpdateResumePagePath(sPathToContent);
        fnNavTo.call(this, sPath);
      }
    });
    //Stop the Link handler to restrict route change
    // event.preventDefault();
    event.stopPropagation();
    return;
  }

  render() {
    const dir = getDirection(this.props.locale);
    const rtl = dir === constants.RTL ? true : false;
    let aSegmentedButtonOptions = [
      {
        label: oResourceBundle.overview,
        value: constants.OVERVIEW,
        className: "overview-btn"
      }
    ];
    //if series add options
    this.props.type === constants.SERIES &&
      aSegmentedButtonOptions.unshift({
        label: oResourceBundle.episodes,
        value: constants.EPISODES,
        className: "episode-btn"
      });
    const selectedContentData = this.props.oBucketVideoInfo[
      this.props.bucketTitle
    ];
    const selectedContentEpisodes =
      selectedContentData && selectedContentData.data.seasons
        ? selectedContentData.data.seasons[0].episodes
        : null;
    return selectedContentData ? (
      <section className="video-info show">
        <div className="dropdown-helper" />
        {
          <Image
            ref="image-backdrop"
            hideFallback={true}
            className="dropdown-image"
            src={selectedContentData.data.imagery.backdrop}
            alt={selectedContentData.data.title}
          />
        }
        <div className="dropdown-top">
          <div className="dropdown-top-left">
            <h1 className="ga-title">
              {selectedContentData.data.translated_title}
            </h1>
            <h1 className="ga-title">{selectedContentData.data.title}</h1>
          </div>
          <div
            className={
              "dropdown-top-right" +
              (this.props.type !== constants.SERIES ? " align-right" : "")
            }
          >
            <SegmentedButton
              onSegmentedButtonClick={this.onSegmentedButtonClick.bind(this)}
              selected={this.state.selectedSegmentButton}
              options={aSegmentedButtonOptions}
            />
          </div>
        </div>
        {this.state.selectedSegmentButton === constants.OVERVIEW ? (
          <VideoOverview
            data={selectedContentData.data}
            type={this.props.type}
            videoId={this.props.videoId}
            target={constants.HOME}
            premium_type={this.props.premium_type}
            // rights_type={this.props.digitalRights}
            onPlayButtonClick={this.props.onPlayButtonClick}
          />
        ) : (
          <div className="dropdown-bottom no-padding" aria-hidden="false">
            {selectedContentEpisodes && (
              <div>
                <Slider
                  rtl={rtl}
                  dots={true}
                  ref={slider => (this.slider = slider)}
                  className="videoinfo-slider"
                  loopAdditionalSlides={0}
                  rebuildOnUpdate={true}
                  shouldSwiperUpdate={false}
                  shouldGrouptoOne={false}
                  bucketTitle={selectedContentData.data.title}
                >
                  {selectedContentEpisodes.map(ele => {
                    //TODO
                    //Hard code VOD type
                    ele.premium_type = this.props.isMENARegion
                      ? "AVOD"
                      : "SVOD";
                    ele.content_type = constants.EPISODE;
                    const sPathToContent = `/${this.props.locale}/${
                      constants.PLAYER
                    }${fnConstructContentURL(ele.content_type, ele)}`;
                    return (
                      <Link
                        className="router-link"
                        to={sPathToContent}
                        key={ele.id}
                        aria-label={ele.title}
                        tabIndex="0"
                        onClick={this.onEpisodeItemClick.bind(
                          this,
                          ele.premium_type,
                          sPathToContent
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
                        />
                      </Link>
                    );
                  })}
                </Slider>
                <div
                  onClick={this.handleLeftClick.bind(this)}
                  className="left-arrow"
                />
                <div
                  onClick={this.handleRightClick.bind(this)}
                  className="right-arrow"
                />
              </div>
            )}
          </div>
        )}
        <div
          className="close"
          role="button"
          tabIndex="0"
          aria-hidden="false"
          onClick={this.props.closeVideoInfo}
        />
      </section>
    ) : null;
  }
}

/**
 * Component - HomeScreen
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loading: state.loading,
    oBucketVideoInfo: state.oBucketVideoInfo,
    sCountryCode: state.sCountryCode,
    isMENARegion: state.isMENARegion
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
    fnFetchBucketSelectedItemContent: (
      sLanguageCode,
      sVedeoId,
      sVideoType,
      sCountry,
      sBucketTitle
    ) => {
      dispatch(
        actionTypes.fnFetchBucketSelectedItemContent(
          sLanguageCode,
          sVedeoId,
          sVideoType,
          sCountry,
          sBucketTitle
        )
      );
    },
    fnResetBucketSelectedItemData: (selecteData, sBucketTitle) => {
      dispatch(
        actionTypes.updateSelectedBucketItemContent(selecteData, sBucketTitle)
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
  )(VideoInfo)
);
