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
import Logger from "core/Logger";
import Button from "core/components/Button/";
import Dialog from "core/components/Dialog";
import RatingStar from "core/components/RatingStar";
import { connect } from "react-redux";
import * as constants from "app/AppConfig/constants";
import * as actionTypes from "app/store/action/";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import { isUserLoggedIn, getWatchingDate } from "app/utility/common";
import Spinner from "core/components/Spinner";
import CheckBox from "core/components/Checkbox";
import fallbackEn from "app/resources/assets/thumbnail/placeholder_carousel_ar_250.png";
import fallbackAr from "app/resources/assets/thumbnail/placeholder_carousel_ar_250.png";
import ImageThumbnail from "app/views/components/ImageThumbnail";
import { toast } from "core/components/Toaster/";
import "./index.scss";

class MyActivity extends BaseContainer {
  MODULE_NAME = "MyActivity";

  /**
   * Represents MyActivity.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      screen: constants.WATCHING_SCREEN,
      userWatching: null,
      userRating: null,
      showDialog: false,
      showRatingDialog: false,
      showProblemWatching: false,
      selectedItem: null,
      issueWithVideo: false,
      issueWithSound: false,
      issueWithTranslation: false,
      issueWithCommunication: false,
      rating: 0,
      userComment: "",
      gotResponse:false
    };
    this.itemTitle = "";
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      nextState.prevState &&
      nextState.showProblemWatching !==
        nextState.prevState.showProblemWatching &&
      nextState.showProblemWatching
    ) {
      return {
        issueWithVideo: false,
        issueWithSound: false,
        issueWithTranslation: false,
        issueWithCommunication: false,
        userComment: "",
        prevState: nextState
      };
    }
    // Return null to indicate no change to state.
    return {
      prevState: nextState
    };
  }

  componentDidMount() {
    this.fnScrollToTop();
    if (isUserLoggedIn()) {
      if (this.state.screen === constants.WATCHING_SCREEN) {
        this.props.fnFetchUserWatching(
          this.userWatchingReceived.bind(this),
          this.userWatchingError.bind(this)
        );
        this.props.fnFetchUserRating(
          this.userRatingReceived.bind(this),
          this.userRatingError.bind(this)
        );
      } else {
      }
    } else {
      this.props.history.push(`/${this.props.locale}/${constants.LOGIN}`);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.locale !== prevProps.locale) {
      if (
        !this.state.userWatching ||
        (!this.state.userWatching[this.props.locale] &&
          !this.state.userRating) ||
        !this.state.userRating[this.props.locale]
      ) {
        this.props.fnFetchUserWatching(
          this.userWatchingReceived.bind(this),
          this.userWatchingError.bind(this)
        );
        this.props.fnFetchUserRating(
          this.userRatingReceived.bind(this),
          this.userRatingError.bind(this)
        );
      }
    }
  }

  titleClick(item) {
    const itemTitle = this.getTitle(item);
    const itemId = this.getSeriesOrMovieId(item);
    const itemType = this.getSeriesOrMovie(item);
    const next = `/${this.props.locale}/${itemType}/${itemId}/${itemTitle}`;
    this.props.history.push(next);
  }

  watchingButtonClick() {
    this.setState({
      screen: constants.WATCHING_SCREEN
    });
  }

  ratingButtonClick() {
    this.setState({
      screen: constants.RATING_SCREEN,
      showProblemWatching: false
    });
  }

  userWatchingReceived(data) {
    Logger.log(this.MODULE_NAME, "userWatchingReceived");
    const userWatching = {};
    userWatching[this.props.locale] = data;
    this.setState({ userWatching: userWatching , gotResponse: true});
  }

  userWatchingError() {
    Logger.log(this.MODULE_NAME, "userWatchingError");
  }

  userRatingReceived(data) {
    Logger.log(this.MODULE_NAME, "userRatingReceived");
    const userRating = {};
    userRating[this.props.locale] = data;
    this.setState({ userRating: userRating });
  }

  userRatingError() {
    Logger.log(this.MODULE_NAME, "userRatingError");
  }

  doneButtonClick() {
    this.props.history.push(`/${this.props.locale}`);
  }

  ratingDeleteButtonClicked(item) {
    Logger.log(this.MODULE_NAME, "ratingDeleteButtonClicked");
    this.itemTitle = this.getTitle(item);
    this.itemId = this.getId(item);
    this.itemType = this.getType(item);
    this.setState({
      showDialog: true
    });
  }

  watchingDeleteButtonClicked(item) {
    Logger.log(this.MODULE_NAME, "watchingDeleteButtonClicked");
    this.itemTitle = this.getTitle(item);
    this.itemId = this.getId(item);
    this.itemType = this.getType(item);
    this.setState({
      showDialog: true
    });
  }

  handleDelete() {
    Logger.log(this.MODULE_NAME, "handleDelete");
    if (this.state.screen === constants.WATCHING_SCREEN) {
      this.props.fnDeleteUserWatching(
        this.itemId,
        this.itemType,
        this.deleteSuccess.bind(this),
        this.deleteFail.bind(this)
      );
    } else if (this.state.screen === constants.RATING_SCREEN) {
      this.props.fnDeleteUserRating(
        this.itemId,
        this.itemType,
        this.deleteSuccess.bind(this),
        this.deleteFail.bind(this)
      );
    }
    this.setState({
      showDialog: false
    });
  }

  handleDialogCancel() {
    Logger.log(this.MODULE_NAME, "handleDialogCancel");
    this.setState({
      showDialog: false
    });
  }

  deleteSuccess() {
    Logger.log(this.MODULE_NAME, "deleteSuccess");
    if (this.state.screen === constants.WATCHING_SCREEN) {
      this.props.fnFetchUserWatching(
        this.userWatchingReceived.bind(this),
        this.userWatchingError.bind(this)
      );
    } else if (this.state.screen === constants.RATING_SCREEN) {
      this.props.fnFetchUserRating(
        this.userRatingReceived.bind(this),
        this.userRatingError.bind(this)
      );
    }
  }

  deleteFail() {
    Logger.log(this.MODULE_NAME, "deleteFail");
  }

  onRatingClicked(item) {
    Logger.log(this.MODULE_NAME, "onRatingClicked");
    this.itemTitle = this.getTitle(item);
    this.itemId = this.getId(item);
    this.itemType = this.getType(item);
    this.setState({
      showRatingDialog: true,
      rating: item.rating
    });
  }

  onRatingDialogClosed() {
    Logger.log(this.MODULE_NAME, "onRatingDialogClosed");
    this.setState({
      showRatingDialog: false
    });
  }

  handleRatingChanged() {
    Logger.log(this.MODULE_NAME, "handleRatingChanged");

    this.props.fnChangeRating(
      this.props.locale,
      this.itemId,
      this.itemType,
      this.itemTitle,
      this.state.rating,
      {},
      () => {
        this.setState({ showRatingDialog: false });
        this.props.fnFetchUserRating(
          this.userRatingReceived.bind(this),
          this.userRatingError.bind(this)
        );
      },
      true
    );
  }

  onStarClick(number) {
    Logger.log(this.MODULE_NAME, "onStarClick");
    this.setState({
      rating: number
    });
  }

  getTitle(item) {
    return item.series_title !== undefined && item.series_title !== ""
      ? item.series_title
      : item.title;
  }

  getType(item) {
    return item.content_type;
  }

  getSeriesOrMovie(item) {
    switch (item.content_type) {
      case "movie":
        return item.content_type;
      case "series":
      case "episode":
        return "series";
      default:
        return "movie";
    }
  }

  getId(item) {
    // return item.series_id === undefined ? item.id : item.series_id;
    return item.id;
  }

  getSeriesOrMovieId(item) {
    switch (item.content_type) {
      case "movie":
      case "series":
        return item.id;
      case "episode":
        return item.series_id;
      default:
        return item.id;
    }
  }

  /**
   * Component Name - MyActivity
   *  Checkbox Changes, Updating the State.
   * @param {object} oEvent - Event hanlder
   */
  handleCheckBox(oEvent) {
    this.setState({
      [oEvent.target.name]: oEvent.target.checked
    });
  }
  /**
   * Component Name - MyActivity
   *  Checkbox Changes, Updating the State.
   * @param {object} oEvent - Event hanlder
   */
  handleInputChange(oEvent) {
    this.setState({
      userComment: oEvent.target.value
    });
  }
  /**
   * Component Name - MyActivity
   * on cancel problem watching
   * @param {null}
   */
  onCancelProbWatching() {
    this.setState({ showProblemWatching: false });
  }
  /**
   * Component Name - MyActivity
   * on submit problem watching
   * @param {null}
   */
  onSubmitProbWatching() {
    const {
      userComment,
      selectedItem,
      issueWithVideo,
      issueWithSound,
      issueWithTranslation,
      issueWithCommunication
    } = this.state;
    userComment &&
      this.props.fnSubmitReportIssue(
        userComment,
        selectedItem,
        issueWithVideo,
        issueWithSound,
        issueWithTranslation,
        issueWithCommunication,
        () => {
          //Success
          toast.dismiss();
          toast.success(oResourceBundle.issue_reported, {
            position: toast.POSITION.BOTTOM_CENTER
          });
        },
        () => {
          //Failed
        }
      );
  }
  /**
   * Component Name - MyActivity
   * on Report an issue clicked
   * @param {null}
   */
  onReportAnIssueClicked(oItem) {
    this.setState({ selectedItem: oItem, showProblemWatching: true });
  }
  /**
   * Component Name - MyActivity
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    const screen =
      this.state.screen === constants.WATCHING_SCREEN ? "watching" : "rating";

    const seoTitle = oResourceBundle.website_meta_title;
    const description = oResourceBundle.website_meta_description;
    const oMetaObject = this.fnConstructMetaTags(
      seoTitle,
      window.location.href,
      description
    );
    const oMetaTags = this.fnUpdateMetaTags(oMetaObject);
    return (
      <React.Fragment>
        {oMetaTags}
        <div className={"myactivity-container " + screen}>
          <div className="top-container">
            <div className="button-container">
              <div
                className="watching-button"
                onClick={this.watchingButtonClick.bind(this)}
              >
                <div className="play-icon" />
                <span className="watching-text">
                  {oResourceBundle.watching}
                </span>
              </div>
              <div
                className="rating-button"
                onClick={this.ratingButtonClick.bind(this)}
              >
                <div className="star-icon" />
                <span className="rating-text">{oResourceBundle.rating}</span>
              </div>
            </div>
            {!this.state.showProblemWatching ? (
              <div className="myactivity-heading">
                {oResourceBundle.my_activity}
              </div>
            ) : null}
          </div>
          {this.state.showProblemWatching ? (
            <div className="problem-watching-container">
              <div className="problem-watching">
                <div className="problem-watch-first-row">
                  <div className="problem-watch-checkbox-container">
                    <div className="problem-watch-heading">
                      {oResourceBundle.problems_watching}
                    </div>
                    <p>{oResourceBundle.check_all_that_apply}</p>
                    <CheckBox
                      onChange={this.handleCheckBox.bind(this)}
                      selected={this.state.issueWithVideo}
                      name="issueWithVideo"
                      text={oResourceBundle.issues_with_video_label}
                    />
                    <CheckBox
                      onChange={this.handleCheckBox.bind(this)}
                      selected={this.state.issueWithSound}
                      name="issueWithSound"
                      text={oResourceBundle.issues_with_sound_label}
                    />
                    <CheckBox
                      onChange={this.handleCheckBox.bind(this)}
                      selected={this.state.issueWithTranslation}
                      name="issueWithTranslation"
                      text={oResourceBundle.issues_with_translations_label}
                    />
                    <CheckBox
                      onChange={this.handleCheckBox.bind(this)}
                      selected={this.state.issueWithCommunication}
                      name="issueWithCommunication"
                      text={oResourceBundle.issues_with_communication_label}
                    />
                  </div>
                  <div className="problem-watch-image-container">
                    <ImageThumbnail
                      type={""}
                      fallback={
                        this.props.locale === constants.AR_CODE
                          ? fallbackAr
                          : fallbackEn
                      }
                      className="carousel-item"
                      imageSrc={
                        this.state.selectedItem
                          ? `${this.state.selectedItem.imagery.thumbnail}${
                              constants.IMAGE_DIMENSIONS
                            }`
                          : ""
                      }
                    />
                  </div>
                </div>
                <div />
                <div>
                  <textarea
                    className="comment-textarea"
                    rows="5"
                    cols="50"
                    name="userComments"
                    value={this.state.userComment}
                    onChange={this.handleInputChange.bind(this)}
                  />
                  <div className="error-text">
                    {!this.state.userComment ? (
                      <span>{oResourceBundle.no_description_available}</span>
                    ) : null}
                  </div>
                </div>
                <div className="problem-watch-buttons">
                  <Button
                    className="prob-watch-button margin-button"
                    onClick={this.onSubmitProbWatching.bind(this)}
                    disabled={!this.state.userComment}
                  >
                    {oResourceBundle.submit}
                  </Button>
                  <Button
                    className="prob-watch-button margin-button"
                    onClick={this.onCancelProbWatching.bind(this)}
                  >
                    {oResourceBundle.btn_cancel}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="data-container">
              {this.state.screen === constants.WATCHING_SCREEN ? (
                <div className="watching-details-container">
                  {this.state.userWatching &&
                    this.state.userWatching[this.props.locale] &&
                    this.state.userWatching[this.props.locale].length > 0 && (
                      <div className="watching-details">
                        {this.state.userWatching[this.props.locale].map(
                          item => {
                            const viewed = item.viewedAt;
                            const title = this.getTitle(item);
                            const reportText = oResourceBundle.report_problem;
                            return (
                              <div className="watching-row" key={item.id}>
                                <div className="top-border" />
                                <div className="watching-row-content">
                                  <div className="left-container">
                                    <div className="viewed">
                                      {getWatchingDate(viewed)}
                                    </div>
                                    <div
                                      className="title"
                                      onClick={this.titleClick.bind(this, item)}
                                    >
                                      {" "}
                                      {title}
                                    </div>
                                  </div>
                                  <div className="right-container">
                                    <div
                                      className="report-problem"
                                      onClick={() => {
                                        this.onReportAnIssueClicked(item);
                                      }}
                                    >
                                      {reportText}
                                    </div>
                                    <div
                                      className="cross-icon"
                                      onClick={this.watchingDeleteButtonClicked.bind(
                                        this,
                                        item
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  {this.state.userWatching &&
                    this.state.userWatching[this.props.locale] &&
                    this.state.userWatching[this.props.locale].length === 0 && (
                      <div className="no-content">
                        {oResourceBundle.no_content_watching_list}
                      </div>
                    )}
                </div>
              ) : (
                <div className="rating-details-container">
                  {this.state.userRating &&
                    this.state.userRating[this.props.locale] &&
                    this.state.userRating[this.props.locale].length > 0 && (
                      <div className="rating-details">
                        {this.state.userRating[this.props.locale].map(item => {
                          const viewed = item.ratedAt;
                          const title = item.title;
                          const rating = item.rating;
                          return (
                            <div className="rating-row" key={item.id}>
                              <div className="top-border" />
                              <div className="watching-row-content">
                                <div className="left-container">
                                  <div className="viewed">
                                    {getWatchingDate(viewed)}
                                  </div>
                                  <div
                                    className="title"
                                    onClick={this.titleClick.bind(this, item)}
                                  >
                                    {" "}
                                    {title}
                                  </div>
                                </div>
                                <div className="right-container">
                                  <div
                                    className="rating-container"
                                    onClick={this.onRatingClicked.bind(
                                      this,
                                      item
                                    )}
                                  >
                                    {Array.apply(0, Array(5)).map(function(
                                      x,
                                      i
                                    ) {
                                      return (
                                        <div
                                          key={i}
                                          className={
                                            "icon " +
                                            (i < rating ? "set" : "unset")
                                          }
                                        />
                                      );
                                    })}
                                  </div>
                                  <div
                                    className="cross-icon"
                                    onClick={this.ratingDeleteButtonClicked.bind(
                                      this,
                                      item
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  {this.state.userRating &&
                    this.state.userRating[this.props.locale] &&
                    this.state.userRating[this.props.locale].length === 0 && (
                      <div className="no-content">
                        {oResourceBundle.no_rated_content_latest_activity}
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
          {this.state.showRatingDialog ? (
            <Dialog
              visible={true}
              onDialogClosed={this.onRatingDialogClosed.bind(this)}
              duration={constants.RATING_DIALOG_ANIMATION_DURATION}
              showCloseButton={false}
              closeOnEsc={true}
              width={constants.RATING_DIALOG_WIDTH}
              height={constants.RATING_DIALOG_HEIGHT}
            >
              <div className="rating-dialog-content">
                <div className="dialog-title">{this.itemTitle}</div>
                <div className="rating-container">
                  <RatingStar
                    name="rate"
                    starCount={5}
                    value={this.state.rating}
                    renderStarIcon={() => <span className="star" />}
                    onStarClick={this.onStarClick.bind(this)}
                  />
                </div>
              </div>
              <div className="rating-dialog-actions">
                <Button
                  className="dialog-ok-btn"
                  onClick={this.handleRatingChanged.bind(this)}
                >
                  {oResourceBundle.ok}
                </Button>
              </div>
            </Dialog>
          ) : null}
          {this.state.showDialog ? (
            <Dialog
              visible={true}
              onDialogClosed={this.handleDialogCancel.bind(this)}
              duration={constants.RATING_DIALOG_ANIMATION_DURATION}
              showCloseButton={false}
              closeOnEsc={true}
              width={constants.SIGNOUTALL_DIALOG_WIDTH}
              height={constants.SIGNOUTALL_DIALOG_HEIGHT}
            >
              <div className="dialog-content">
                <div className="content">
                  <div className="dialog-title">
                    {oResourceBundle.my_activity}
                  </div>
                  <div className="dialog-text">
                    {this.state.screen === constants.WATCHING_SCREEN
                      ? oResourceBundle.delete_watch_description.replace(
                          "[MOVIETITLE]",
                          this.itemTitle
                        )
                      : oResourceBundle.delete_rate_description.replace(
                          "[MOVIETITLE]",
                          this.itemTitle
                        )}
                  </div>
                </div>

                <div className="actions">
                  <Button
                    className="dialog-ok-btn"
                    onClick={this.handleDelete.bind(this)}
                  >
                    {oResourceBundle.confirm}
                  </Button>
                  <Button
                    className="dialog-ok-btn"
                    onClick={this.handleDialogCancel.bind(this)}
                  >
                    {oResourceBundle.btn_cancel}
                  </Button>
                </div>
              </div>
            </Dialog>
          ) : null}
          {!this.state.showProblemWatching ? (
            <div
              className="done-button"
              onClick={this.doneButtonClick.bind(this)}
            >
              {oResourceBundle.done}
            </div>
          ) : null}
          <div className="empty-space" />
          {/* {this.props.loading ? <Spinner /> : null} */}
          {!this.state.gotResponse ? <Spinner /> : null}
        </div>
      </React.Fragment>
    );
  }
}

/**
 * method that maps state to props.
 * Component - MyAccount
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    fnFetchUserWatching: (fnSuccess, fnFailed) => {
      dispatch(actionTypes.fnFetchUserWatching(fnSuccess, fnFailed));
    },
    fnFetchUserRating: (fnSuccess, fnFailed) => {
      dispatch(actionTypes.fnFetchUserRating(fnSuccess, fnFailed));
    },
    fnDeleteUserWatching: (id, type, fnSuccess, fnFailed) => {
      dispatch(actionTypes.fnDeleteUserWatching(id, type, fnSuccess, fnFailed));
    },
    fnDeleteUserRating: (id, type, fnSuccess, fnFailed) => {
      dispatch(actionTypes.fnDeleteUserRating(id, type, fnSuccess, fnFailed));
    },
    fnSubmitReportIssue: (
      userComment,
      selectedItem,
      issueWithVideo,
      issueWithSound,
      issueWithTranslation,
      issueWithCommunication,
      fnSuccess,
      fnFailed
    ) => {
      dispatch(
        actionTypes.fnSubmitReportIssue(
          userComment,
          selectedItem,
          issueWithVideo,
          issueWithSound,
          issueWithTranslation,
          issueWithCommunication,
          fnSuccess,
          fnFailed
        )
      );
    },
    fnChangeRating: (
      sLanguageCode,
      sItemId,
      sItemType,
      sTitle,
      sRating,
      sTarget,
      fnSuccess,
      dontFetchDetails
    ) => {
      dispatch(
        actionTypes.fnChangeRating(
          sLanguageCode,
          sItemId,
          sItemType,
          sTitle,
          sRating,
          sTarget,
          fnSuccess,
          dontFetchDetails
        )
      );
    }
  };
};

/**
 * Component - MyAccount
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    oUserAccountDetails: state.oUserAccountDetails,
    loading: state.loading
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyActivity)
);
