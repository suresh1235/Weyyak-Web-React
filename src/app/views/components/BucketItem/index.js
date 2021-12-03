import React from "react";
import { Link, Route } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actionTypes from "app/store/action/";
import Slider, { getSlidesPerView } from "core/components/Swiper";
import ImageThumbnail from "app/views/components/ImageThumbnail";
import VideoInfo from "app/views/components/VideoInfo";
import * as CONSTANTS from "app/AppConfig/constants";
import { toast } from "core/components/Toaster/";
import * as common from "app/utility/common";
import fallbackEn from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import fallbackAr from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import { ENABLE_SERIES_PLAYBUTTON_TO_PLAYER } from "app/AppConfig/features";
import Logger from "core/Logger";
import { sendEvents } from "core/GoogleAnalytics/";
import oResourceBundle from "app/i18n/";
import PlayItem from "../../../resources/assets/playsvg.svg";
import addItem from "../../../resources/assets/add.svg";
import RemoveItem from "../../../resources/assets/remove.svg";
import Button from "core/components/Button";

import "./index.scss";

/**
 * Class for rendering a carousel row with header and video info
 */
class BucketItem extends React.PureComponent {
  state = {
    showInfo: false,
    selectedVideoId: "",
    selectedVideoType: "",
    isSliding: false,
    windowWidth: window.innerWidth,
    slidesPerView: getSlidesPerView(window.innerWidth),
    digitRigts: '',
    userResumables: null
  };

  itemsLoaded = 0;
  lazyLoadTimer = -1;

  MODULE_NAME = "BucketItem";

  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.setState({
      userResumables: this.props.userResumables
    })

    Logger.log(this.MODULE_NAME, "componentDidMount");
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  /**
   * Component Name - BucketItem
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    // Logger.log(this.MODULE_NAME, "componentDidUpdate");
    //Action on Video info expanded

    this.setState({
      userResumables: this.props.userResumables
    })


    if (
      (this.state.showInfo !== prevState.showInfo && this.state.showInfo) ||
      (this.state.selectedVideoId !== prevState.selectedVideoId &&
        this.state.showInfo)
    ) {
      const oSelectedItem = this.props.items.filter(
        ele => ele.id === this.state.selectedVideoId
      );
      //Send analytics event
      oSelectedItem &&
        sendEvents(
          CONSTANTS.CAROUSEL_CATEGORY,
          CONSTANTS.EXPAND_ACTION,
          `${this.props.title} | ${oSelectedItem[0].title}`,
          1
        );
    } else if (
      this.state.showInfo !== prevState.showInfo &&
      !this.state.showInfo
    ) {
      const oSelectedItem = this.props.items.filter(
        ele => ele.id === this.sSelectedVideoBucketItemId
      );
      //Action on Video info closed
      //Send analytics event
      sendEvents(
        CONSTANTS.CAROUSEL_CATEGORY,
        CONSTANTS.CLOSE_ACTION,
        `${this.props.title} | ${oSelectedItem[0].title}`,
        1
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    clearTimeout(this.lazyLoadTimer);
  }

  updateWindowDimensions() {
    this.setState({
      windowWidth: window.innerWidth
    });
  }

  /**
   * Thumbnail down arrow click handler.
   * @param {Object} event
   * @param {Object} oSelectedBtnProps
   */
  onDownArrowClick(event, oSelectedBtnProps) {
    //Selected Item id
    this.sSelectedVideoBucketItemId = oSelectedBtnProps.value.id;
    // Hack to enable click on duplicate slides of swiper
    if (!oSelectedBtnProps) {
      oSelectedBtnProps = {
        value: JSON.parse(event.target.parentElement.value)
      };
    }
    if (
      oSelectedBtnProps.value.id !== this.state.selectedVideoId &&
      this.state.showInfo
    ) {
    }
    this.setState(state => ({
      showInfo:
        state.showInfo && oSelectedBtnProps.value.id === state.selectedVideoId
          ? false
          : true,
      selectedVideoId:
        oSelectedBtnProps.value.id === state.selectedVideoId
          ? ""
          : oSelectedBtnProps.value.id,
      selectedVideoType: oSelectedBtnProps.value.type
    }));
    //Stop the Link handler to restrict route change
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Thumbnail play button click handler.
   * @param {Object} event
   * @param {Object} oSelectedBtnProps
   */
  onPlayButtonClick(event, oSelectedBtnProps) {
    if (!oSelectedBtnProps) {
      // Hack to enable click on duplicate slides of swiper
      oSelectedBtnProps = {
        value: JSON.parse(event.target.parentElement.value)
      };
    }
    if (oSelectedBtnProps.value.type === CONSTANTS.EPISODE) {
      this.fnNavToSubcriptionPath(
        oSelectedBtnProps,
        oSelectedBtnProps.value.linkURL
      );
      return;
    }
    let next =
      oSelectedBtnProps.value.type === CONSTANTS.SERIES
        ? `/${this.props.locale}/${oSelectedBtnProps.value.type}/${oSelectedBtnProps.value.id
        }/${oSelectedBtnProps.value.friendlyUrl}`
        : `/${this.props.locale}/${CONSTANTS.PLAYER}/${oSelectedBtnProps.value.type
        }/${oSelectedBtnProps.value.id}/${oSelectedBtnProps.value.friendlyUrl
          ? oSelectedBtnProps.value.friendlyUrl
          : ""
        }`;

    // let next = oSelectedBtnProps.value.friendlyUrl;
    if (
      ENABLE_SERIES_PLAYBUTTON_TO_PLAYER &&
      oSelectedBtnProps.value.type === CONSTANTS.SERIES
    ) {
      this.props.fnFetchBucketSelectedItemContent(
        this.props.locale,
        oSelectedBtnProps.value.id,
        oSelectedBtnProps.value.type,
        this.props.sCountryCode,
        "",
        firstEpisode => {
          firstEpisode.content_type = CONSTANTS.EPISODE;
          next = `/${this.props.locale}/${CONSTANTS.PLAYER
            }${common.fnConstructContentURL(CONSTANTS.EPISODE, firstEpisode)}`;
          //this.props.history.push(next);
          this.fnNavToSubcriptionPath(oSelectedBtnProps, next);
        }
      );
    } else {
      //this.props.history.push(next);
      this.fnNavToSubcriptionPath(oSelectedBtnProps, next);
    }

    //Stop the Link handler to restrict route change
    //  event.preventDefault();
    event.stopPropagation();
    return;
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
   * Bucket Item next button success
   * @param null
   * @returns {undefined}
   */
  onNextButtonClick() { }

  /**
   * Bucket Item previous button success
   * @param null
   * @returns {undefined}
   */
  onPreviousButtonClick() { }

  /**
   * close video info handler.
   * @param null
   * @returns {undefined}
   */
  onCloseVideoInfo() {
    this.setState({
      showInfo: false,
      selectedVideoId: "",
      selectedVideoType: ""
    });
  }

  /**
   * indicates if carousel is in movement
   * @param  {boolean} _isSliding
   */
  isSliding(_isSliding) {
    Logger.log(this.MODULE_NAME, "isSliding: " + _isSliding);
    this.setState({ isSliding: _isSliding });
  }

  startLazyLoad() {
    if (this.swiper && this.swiper.swiper.params.loop) {
      this.swiper.swiper.loopCreate();
    }
    this.setState({ mounted: true });
  }

  imageLoaded() {
    this.itemsLoaded++;
    if (
      this.itemsLoaded >= this.state.slidesPerView &&
      this.lazyLoadTimer === -1
    ) {
      this.lazyLoadTimer = setTimeout(
        () => this.startLazyLoad(),
        CONSTANTS.LAZY_LOAD_DELAY
      );
    }
  }

  fnAnUtherisedHanlder() {
    //Go to login screen
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.LOGIN}`);
  }

  onPlayItemClick(ItemData, imageArea) {

    if(imageArea){
      window.location.href = imageArea
    }

    const { id, content_type, title, season_number, episode_number } = ItemData;

    if (content_type == "movie" || content_type == "play") {
      sendEvents(
        CONSTANTS.CONTINUE_WATCHING_CATEGORY,
        CONSTANTS.CONTINUE_WATCH_PLAY_MOVIE,
        title ? title : id
      );
    } else {
      sendEvents(
        CONSTANTS.CONTINUE_WATCHING_CATEGORY,
         CONSTANTS.CONTINUE_WATCH_PLAY_EPISODE,
        `${title ? title : id} | ${oResourceBundle.season} ${season_number} | ${oResourceBundle.episode} ${episode_number}`
      );
    }
  }

  onAddRemovePlaylist = (ItemData) => {

    let { id, series_id, content_type, title, season_number } = ItemData

    let Content_ID = content_type == "movie" || content_type == "play" ? id : series_id
    let AddIconStatus = this.props.userPlayList.some(ele => ele.content.id === Content_ID)


    if (!AddIconStatus) {

      this.props.fnAddItemToPlayList(
        this.props.locale,
        content_type == "episode" ? series_id : id,
        content_type == "episode" ? "series" : content_type,
        title,
        "",
        this.fnAnUtherisedHanlder.bind(this),
        () => {

          sendEvents(
            CONSTANTS.CONTINUE_WATCHING_CATEGORY,
            CONSTANTS.CONTINUE_WATCH_ADDITEM,
            this.fnlabelname(ItemData)
          );

          sendEvents(
            CONSTANTS.ADD_PLAYLIST_CATEGORY,
            content_type == "episode" ? "series" : content_type,
            this.fnlabelname(ItemData)
          );

          common.showToast(
            CONSTANTS.MY_PLAYLIST_TOAST_ID,
            oResourceBundle.added_to_playlist1 +
            title +
            oResourceBundle.added_to_playlist2,
            toast.POSITION.BOTTOM_CENTER
          );
        },
        () => {
          common.showToast(
            CONSTANTS.MY_PLAYLIST_TOAST_ID,
            oResourceBundle.something_went_wrong,
            toast.POSITION.BOTTOM_CENTER
          );
        }
      );
    } else {
      this.props.fnRemoveItemFromPlayList(
        this.props.locale,
        content_type == "episode" ? series_id : id,
        content_type == "episode" ? "series" : content_type,
        "",
        this.fnAnUtherisedHanlder.bind(this),
        () => {
          this.playistAPIfired = false;

          sendEvents(
            CONSTANTS.CONTINUE_WATCHING_CATEGORY,
            CONSTANTS.CONTINUE_WATCH_REMOVEITEM,
            this.fnlabelname(ItemData)
          );

          common.showToast(
            CONSTANTS.MY_PLAYLIST_TOAST_ID,
            oResourceBundle.removed_from_playlist1 +
            title +
            oResourceBundle.removed_from_playlist2,
            toast.POSITION.BOTTOM_CENTER
          );
        },
        () => {
          this.playistAPIfired = false;
          // common.showToast(
          //   constants.MY_PLAYLIST_TOAST_ID,
          //   oResourceBundle.something_went_wrong,
          //   toast.POSITION.BOTTOM_CENTER
          // );
        }
      );
    }

  }
  onDeletePlayListItem = (ItemData, index) => {

    let { id, content_type } = ItemData

    this.props.items.splice(index, 1)

    let userResumables = { ...this.state.userResumables }
    delete userResumables[id];

    this.setState({
      userResumables
    })

    this.props.fnDeleteItemFromContinueWatching(
      this.props.locale,
      id,
      content_type,
      this.fnAnUtherisedHanlder.bind(this),
      () => {
        this.props.itemDeleted(userResumables)

        sendEvents(
          CONSTANTS.CONTINUE_WATCHING_CATEGORY,
          CONSTANTS.CONTINUE_WATCH_REMOVE_ITEM,
          this.fnlabelname(ItemData)
        );

        // delete this.state.userResumables[id];
        // this.setState({
        //   userResumables:this.state.userResumables
        // })
      },
      () => {
        // common.showToast(
        //   constants.MY_PLAYLIST_TOAST_ID,
        //   oResourceBundle.something_went_wrong,
        //   toast.POSITION.BOTTOM_CENTER
        // );
      }
    );
  }

  fnlabelname(itemInfo) {

    const { id, content_type, title, season_number, episode_number } = itemInfo;

    let LableName = ""
    if (content_type == "movie" || content_type == "play") {
      LableName = title ? title : id
    } else {
      LableName = `${title ? title : id} | ${oResourceBundle.season} ${season_number} | ${oResourceBundle.episode} ${episode_number}`
    }
    return LableName
  }


  /**
   * Render function overridden from react
   */
  render() {
    const dir = common.getDirection(this.props.locale);
    const rtl = dir === "rtl" ? true : false;
    const userResumables = this.state.userResumables;

    // const userResumables = this.props.userResumables;
    return (
      <section
        className={this.state.isSliding ? "bucketItem sliding" : "bucketItem"}
      >
        {/* {this.props.match.path && this.props.match.path.includes("plans-description") ?
          <h1 className="bucketItem--header">{" "}</h1>

          : <h1 className="bucketItem--header">{this.props.title}</h1>
        } */}

        <h1 className="bucketItem--header">{this.props.title}</h1>

        <div className="bucket-container">
          <Route
            render={({ history }) => (
              <Slider
                bucketTitle={this.props.title}
                rtl={rtl}
                dots={false}
                isSliding={this.isSliding.bind(this)}
                ref={swiper => (this.swiper = swiper)}
                isCarousel={false}
                slidesToScroll={1}
                rebuildOnUpdate={
                  this.props.rebuildOnUpdate !== undefined &&
                    this.props.rebuildOnUpdate === true
                    ? this.props.rebuildOnUpdate
                    : false
                }
                onDownArrowClick={this.onDownArrowClick.bind(this)}
                onPlayButtonClick={this.onPlayButtonClick.bind(this)}
                onNextButtonClick={this.onNextButtonClick.bind(this)}
                onPreviousButtonClick={this.onPreviousButtonClick.bind(this)}
                items={this.props.items}
              >
                {this.props.items.map((ele, index) => {
                  //const digitalRights = (ele.content_type==='movie')? ele.movies[0].digitalRighttype:ele.seasons[0].digitalRighttype;
                  let digitalRights = 3;
                  // (ele.movies || ele.series)?(digitalRights = (ele.content_type==='movie')?(ele.movies[0]?ele.movies[0].digitalRighttype:1):(ele.content_type==='series'? (ele.seasons[0]?ele.seasons[0].digitalRighttype:''):'')):(digitalRights=1);
                  if (ele && ele.movies && ele.movies[0]) {
                    digitalRights = (ele.movies[0].digitalRighttype)
                  }
                  else if (ele && ele.seasons && ele.seasons[0]) {
                    digitalRights = (ele.seasons[0].digitalRighttype)
                  }
                  else if (ele) {
                    digitalRights = (ele.digitalRighttype)
                  }
                  //(ele.movies? (digitalRights=(ele.movies[0].digitalRighttype)):1)
                  //(ele.series? (digitalRights=(ele.series[0].digitalRighttype)):1)

                  if (ele) {
                    let sLinkPath =
                      userResumables && userResumables[ele.id]
                        ? `/${this.props.locale}/${CONSTANTS.PLAYER
                        }${common.fnConstructContentURL(
                          ele.content_type,
                          ele
                        )}/Continue-watching`
                        : `/${this.props.locale}${common.fnConstructContentURL(
                          ele.content_type,
                          ele
                        )}`;

                    if (userResumables && userResumables[ele.id]) {
                      if (userResumables[ele.id].content.digitalRightsType == 3 && !this.props.isUserSubscribed) {
                        sLinkPath = `/${this.props.locale}/subscribe-to-watch`
                      }
                    }

                    return (
                      <div>
                        {userResumables && userResumables[ele.id] ?
                          <>
                            <ImageThumbnail
                              displayPremiumTag={false}
                              premium_type={
                                this.props.isMENARegion ? "AVOD" : "SVOD"
                              }
                              rights_type={digitalRights}
                              premiumText={oResourceBundle.premium}
                              id={ele.id}
                              type={ele.content_type}
                              imageLoaded={this.imageLoaded.bind(this)}
                              delayImage={
                                (index > this.state.slidesPerView + 1 &&
                                  !this.state.mounted) ||
                                this.props.delayImage
                              }
                              startLazyLoad={this.startLazyLoad.bind(this)}
                              friendlyUrl={ele.title.replace(/ +/g, "-")}
                              linkURL={sLinkPath}
                              selected={this.state.selectedVideoId === ele.id}
                              fallback={
                                this.props.locale === "ar" ? fallbackAr : fallbackEn
                              }
                              className="carousel-item"
                              imageSrc={`${ele.imagery == null ? "" : (ele.content_type == 'movie' || ele.content_type == 'play' ? ele.imagery.banner : ele.imagery.thumbnail)}${CONSTANTS.IMAGE_DIMENSIONS
                                }`}
                              descriptionText={ele.title}
                              showDescription={false}
                              showPlayIcon={true}
                              showPlayIcononHover={true}
                              animateOnHover={true}
                              showDownArrow={
                                userResumables && userResumables[ele.id]
                                  ? false
                                  : true
                              }
                              showDownArrowonHover={true}
                              onDownArrowClick={this.onDownArrowClick.bind(this)}
                              onPlayButtonClick={this.onPlayButtonClick.bind(this)}
                              showRatingIndicator={true}
                              showRatingIndicatorValue={
                                userResumables && userResumables[ele.id]
                                  ? userResumables[ele.id].userData.rating
                                    ? "" + userResumables[ele.id].userData.rating
                                    : ""
                                  : "5"
                              }
                              showProgress={
                                userResumables && userResumables[ele.id]
                                  ? true
                                  : false
                              }
                              progressValuePercent={
                                userResumables && userResumables[ele.id]
                                  ? (userResumables[ele.id].userData.viewActivity
                                    .resumeWatchPosition *
                                    100) /
                                  userResumables[ele.id].content.duration
                                  : 0
                              }
                              digitalRights={digitalRights}
                              itemData={ele}
                              index={index}
                              lang={this.props.locale}
                              userPlayList={this.props.userPlayList}
                              onPlayItemClick={this.onPlayItemClick}
                              onAddRemovePlaylist={this.onAddRemovePlaylist}
                              onDeletePlayListItem={this.onDeletePlayListItem}
                            />
                            {this.setState({ digitRigts: digitalRights })}
                          </> :
                          <Link
                            key={ele.id}
                            className={this.state.isSliding ? "disable-click" : ""}
                            aria-label={ele.title}
                            tabIndex="0"
                            to={sLinkPath}
                            style={{
                              background:
                                "url(" + this.props.locale === "ar"
                                  ? fallbackAr
                                  : fallbackEn + ")"
                            }}
                          >
                            <ImageThumbnail
                              displayPremiumTag={false}
                              premium_type={
                                this.props.isMENARegion ? "AVOD" : "SVOD"
                              }
                              rights_type={digitalRights}
                              premiumText={oResourceBundle.premium}
                              id={ele.id}
                              type={ele.content_type}
                              imageLoaded={this.imageLoaded.bind(this)}
                              delayImage={
                                (index > this.state.slidesPerView + 1 &&
                                  !this.state.mounted) ||
                                this.props.delayImage
                              }
                              startLazyLoad={this.startLazyLoad.bind(this)}
                              friendlyUrl={ele.title.replace(/ +/g, "-")}
                              linkURL={sLinkPath}
                              selected={this.state.selectedVideoId === ele.id}
                              fallback={
                                this.props.locale === "ar" ? fallbackAr : fallbackEn
                              }
                              className="carousel-item"
                              imageSrc={`${ele.imagery == null ? "" : ele.imagery.thumbnail}${CONSTANTS.IMAGE_DIMENSIONS
                                }`}
                              descriptionText={ele.title}
                              showDescription={false}
                              showPlayIcon={true}
                              showPlayIcononHover={true}
                              animateOnHover={true}
                              showDownArrow={
                                userResumables && userResumables[ele.id]
                                  ? false
                                  : true
                              }
                              showDownArrowonHover={true}
                              onDownArrowClick={this.onDownArrowClick.bind(this)}
                              onPlayButtonClick={this.onPlayButtonClick.bind(this)}
                              showRatingIndicator={true}
                              showRatingIndicatorValue={
                                userResumables && userResumables[ele.id]
                                  ? userResumables[ele.id].userData.rating
                                    ? "" + userResumables[ele.id].userData.rating
                                    : ""
                                  : "5"
                              }
                              showProgress={
                                userResumables && userResumables[ele.id]
                                  ? true
                                  : false
                              }
                              progressValuePercent={
                                userResumables && userResumables[ele.id]
                                  ? (userResumables[ele.id].userData.viewActivity
                                    .resumeWatchPosition *
                                    100) /
                                  userResumables[ele.id].content.duration
                                  : 0
                              }
                              digitalRights={digitalRights}
                              itemData={ele}
                              lang={this.props.locale}
                            />

                            {this.setState({ digitRigts: digitalRights })}
                          </Link>
                        }
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </Slider>
            )}
          />
        </div>
        {this.state.showInfo && (
          <VideoInfo
            premium_type={this.props.isMENARegion ? "AVOD" : "SVOD"}
            // rights_type={this.state.digitRigts[0] == 3 ? 3 : 1 }
            closeVideoInfo={this.onCloseVideoInfo.bind(this)}
            bucketTitle={this.props.title}
            locale={this.props.locale}
            videoId={this.state.selectedVideoId}
            type={this.state.selectedVideoType}
            onPlayButtonClick={this.onPlayButtonClick.bind(this)}
          />
        )}
      </section>
    );
  }
}

/**
 * Component - BucketItem
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    sCountryCode: state.sCountryCode,
    isMENARegion: state.isMENARegion,
    userPlayList: state.aMyPlayList,
    isUserSubscribed: state.bIsUserSubscribed
  };
};
/**
 * method that maps state to props.
 * Component - BucketItem
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
    },
    fnAddItemToPlayList: (
      sLanguageCode,
      sItemId,
      sItemType,
      sTitle,
      sTarget,
      fnAnUtherisedHanlder,
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
          fnAnUtherisedHanlder,
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
      fnAnUtherisedHanlder,
      fnSuccess,
      fnFailure
    ) => {
      dispatch(
        actionTypes.fnRemoveItemFromPlayList(
          sLanguageCode,
          sItemId,
          sItemType,
          sTarget,
          fnAnUtherisedHanlder,
          fnSuccess,
          fnFailure
        )
      );
    },
    fnDeleteItemFromContinueWatching: (
      sLanguageCode,
      sItemId,
      sItemType,
      fnAnUtherisedHanlder,
      fnSuccess,
      fnFailure
    ) => {
      dispatch(
        actionTypes.fnDeleteItemFromContinueWatching(
          sLanguageCode,
          sItemId,
          sItemType,
          fnAnUtherisedHanlder,
          fnSuccess,
          fnFailure
        )
      );
    },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BucketItem)
);
