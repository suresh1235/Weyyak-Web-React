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
import {withRouter} from "react-router-dom";
import * as actionTypes from "app/store/action/";
import * as constants from "app/AppConfig/constants";
import * as common from "app/utility/common";
import {Link} from "react-router-dom";
import oResourceBundle from "app/i18n/";
import Dialog from "core/components/Dialog";
import Button from "core/components/Button";
import RatingStar from "core/components/RatingStar";
import shareIcon from "app/resources/assets/common/share.svg";
import shareFacebookIcon from "app/resources/assets/common/share_facebook.svg";
import shareTwitterIcon from "app/resources/assets/common/share_twitter.svg";
import addPlaylistIcon from "app/resources/assets/common/playlist_plus.svg";
import removePlaylistIcon from "app/resources/assets/common/playlist_tick.svg";
import playIcon from "app/resources/assets/thumbnail/ic-play.svg";
import {FacebookShareButton, TwitterShareButton} from "react-share";
import {sendEvents} from "core/GoogleAnalytics/";
import {toast} from "core/components/Toaster/";
import Logger from "core/Logger";
import "./index.scss";

const MODULE_NAME = "BaseContainer";

/**
 * Functional component that renders Video overview
 * @param {Object} props - properties to the component
 * @returns {Component} - Video oberview component
 */

class VideoOverview extends React.PureComponent {
  state = {
    isRatingDialogOpen: false,
    rating: this.props.data.averageRating,
    showShareIcons: false
  };

  componentDidMount() {
    this.playistAPIfired = false;
    // console.log(this.props.data.digitalRighttype);
  }

  /**
   * Component Name - VideoOverview
   * Share button click handler
   * @param null
   * @returns {undefined}
   */
  onShareButtonClick() {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: document.title,
          url: window.location.href
        })
        .then(() => {
          Logger.log(MODULE_NAME, "Successful share");
        })
        .catch(error => {
          Logger.error(MODULE_NAME, "Error sharing" + error);
        });
    } else {
      this.setState(prevState => ({
        showShareIcons: !prevState.showShareIcons
      }));
    }
  }

  /**
   * Component Name - VideoOverview
   * Remove item from user playlist
   * @param null
   * @returns {undefined}
   */
  fnAnUtherisedHanlder() {
    //Go to login screen
    this.props.history.push(`/${this.props.locale}/${constants.LOGIN}`);
  }

  /**
   * Component Name - VideoOverview
   * Remove item from user playlist
   * @param null
   * @returns {undefined}
   */
  async onAddRemovePlaylist() {
    const {type, locale, target} = this.props;
    const {id, title} = this.props.data;
    //check if the item is already in the playlist or not
    const isItemExists = this.props.aUserPlayList.some(
      ele => ele.content.id === id
    );

    const oUserToken = JSON.parse(
      common.getCookie(constants.COOKIE_USER_TOKEN)
    );
    if (oUserToken) {
      const isUserSubscribed = await common.isUserSubscribed();
      if (!common.isMENARegion(this.props.sCountryCode) && !isUserSubscribed) {
        //Save the resume path
        const index = window.location.href.indexOf("/" + this.props.locale);
        const currentPath = window.location.href.substring(index);
        common.setCookie(
          constants.RESUME_PATH_COOKIE_NAME,
          currentPath,
          constants.COOKIES_TIMEOUT_NOT_REMEMBER
        );
        common.fnNavTo.call(this, `/${this.props.locale}/${constants.PLANS_DESCRIPTION}`);
        return;
      } else {
        if (!this.playistAPIfired) {
          this.playistAPIfired = true;
          if (isItemExists) {
            //if true delete from playlist
            this.props.fnRemoveItemFromPlayList(
              locale,
              id,
              type,
              target,
              this.fnAnUtherisedHanlder.bind(this),
              () => {
                this.playistAPIfired = false;
                common.showToast(
                  constants.MY_PLAYLIST_TOAST_ID,
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
          } else {
            //add to playlist
            this.props.fnAddItemToPlayList(
              locale,
              id,
              type,
              title,
              target,
              this.fnAnUtherisedHanlder.bind(this),
              () => {
                //Success adding to the playlist
                //Send analytics event
                let seasonNumber = null;
                if (this.props.data.seasons) {
                  seasonNumber = this.props.data.seasons[0].season_number;
                }
                const {title} = this.props.data;
                //Send analytics event
                sendEvents(
                  constants.ADD_PLAYLIST_CATEGORY,
                  type,
                  `${title} ${
                    seasonNumber
                      ? `  | ${oResourceBundle.season} ${seasonNumber}`
                      : ""
                  }`
                );
                this.playistAPIfired = false;
                common.showToast(
                  constants.MY_PLAYLIST_TOAST_ID,
                  oResourceBundle.added_to_playlist1 +
                    title +
                    oResourceBundle.added_to_playlist2,
                  toast.POSITION.BOTTOM_CENTER
                );
              },
              () => {
                this.playistAPIfired = false;
                common.showToast(
                  constants.MY_PLAYLIST_TOAST_ID,
                  oResourceBundle.something_went_wrong,
                  toast.POSITION.BOTTOM_CENTER
                );
              }
            );
          }
        }
      }
    } else {
      this.playistAPIfired = false;
      const index = window.location.href.indexOf("/" + this.props.locale);
      const currentPath = window.location.href.substring(index);
      common.setCookie(
        constants.RESUME_PATH_COOKIE_NAME,
        currentPath,
        constants.COOKIES_TIMEOUT_NOT_REMEMBER
      );
      this.fnAnUtherisedHanlder();
    }
  }
  /**
   * Component Name - VideoOverview
   * Rating dialog open hanlder
   * @param null
   * @returns {undefined}
   */
  async handleRatingDialogOpen() {
    const oUserToken = JSON.parse(
      common.getCookie(constants.COOKIE_USER_TOKEN)
    );
    const {target} = this.props;
    if (oUserToken) {
      //Check user subscribed or not
      const isUserSubscribed = await common.isUserSubscribed();
      // Check if MENA Region or not
      if (!common.isMENARegion(this.props.sCountryCode) && !isUserSubscribed) {
        //Save the resume path
        const index = window.location.href.indexOf("/" + this.props.locale);
        const currentPath = window.location.href.substring(index);
        common.setCookie(
          constants.RESUME_PATH_COOKIE_NAME,
          currentPath,
          constants.COOKIES_TIMEOUT_NOT_REMEMBER
        );
        common.fnNavTo.call(this, `/${this.props.locale}/${constants.PLANS_DESCRIPTION}`);
        return;
      }
      target !== constants.HOME && this.setState({isRatingDialogOpen: true});
    } else {
      this.fnAnUtherisedHanlder();
    }
  }
  /**
   * Component Name - VideoOverview
   * Rating dialog close hanlder
   * @param null
   * @returns {undefined}
   */
  onRatingDialogClosed() {
    this.setState({isRatingDialogOpen: false});
  }
  /**
   * Component Name - VideoOverview
   * Rating star click event
   * @param {Number} nextValue - star rating value
   * @param {Number} prevValue - star previuos rating value
   * @param {String} name - star rating name
   * @returns {undefined}
   */
  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }
  /**
   * Component Name - VideoOverview
   * Rating star chnaged
   * @param {null}
   * @returns {undefined}
   */
  handleRatingChanged() {
    const {rating} = this.state;
    const {type, locale, target} = this.props;
    const {id, title} = this.props.data;
    this.props.fnChangeRating(locale, id, type, title, rating, target, () => {
      this.setState({isRatingDialogOpen: false});
    });
  }
  /**
   * Component Name - VideoOverview
   * Twitter share button clicked
   * @param {null}
   * @returns {undefined}
   */
  onTwitterShareButtonClick() {
    const {title} = this.props.data;
    let seasonNumber = null;
    if (this.props.data.seasons) {
      seasonNumber = this.props.data.seasons[0].season_number;
    }
    //Send analytics event
    sendEvents(
      constants.SHARE_CATEGORY,
      constants.SHARE_DETAILS_ACTION,
      `${title} ${
        seasonNumber ? `  | ${oResourceBundle.season} ${seasonNumber}` : ""
      }`
    );
  }

  /**
   * Component Name - VideoOverview
   * Twitter share button clicked
   * @param {null}
   * @returns {undefined}
   */
  onFBShareButtonClick() {
    const {title} = this.props.data;
    let seasonNumber = null;
    if (this.props.data.seasons) {
      seasonNumber = this.props.data.seasons[0].season_number;
    }
    //Send analytics event
    sendEvents(
      constants.SHARE_CATEGORY,
      constants.SHARE_DETAILS_ACTION,
      `${title} ${
        seasonNumber ? `  | ${oResourceBundle.season} ${seasonNumber}` : ""
      }`
    );
  }

  /**
   * Component Name - VideoOverview
   * Change state based on props
   * Use it wisely
   * @param {Object} nextProps - properties
   * @param {Object} prevState - state
   * @returns {Object} state
   */
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      nextState.prevProps &&
      nextProps.data.id !== nextState.prevProps.data.id
    ) {
      return {
        rating: Math.round(nextProps.data.averageRating),
        prevProps: nextProps,
        prevState: nextState
      };
    } else if (
      nextState.isRatingDialogOpen === true &&
      nextState.isRatingDialogOpen !== nextState.prevState.isRatingDialogOpen
    ) {
      return {
        rating: Math.round(nextProps.data.averageRating),
        prevProps: nextProps,
        prevState: nextState
      };
    }
    // Return null to indicate no change to state.
    return {
      prevProps: nextProps,
      prevState: nextState
    };
  }
  /**
   * Component Name - VideoOverview
   * renders the UI.
   * @param null
   * @returns {undefined}
   */
  render() {
    const episodeItems = this.props.data.seasons && this.props.data.seasons[0];
    const firstEpisodeItem =
      episodeItems &&
      episodeItems.episodes.length > 0 &&
      episodeItems.episodes[0];
    const firstItemTitle = (firstEpisodeItem
      ? `${firstEpisodeItem.title}-${oResourceBundle.episode}-${
          firstEpisodeItem.episode_number
        }`
      : this.props.data.title
    ).replace(/ +/g, "-");
    return (
      <div className="dropdown-bottom dropdown-overview" aria-hidden="false">
        <div className="dropdown-bottom-left">
          <div className="dropdown-info">
            <div className="title-info">{this.props.data.seasons && this.props.data.seasons[0]?this.props.data.seasons[0].title:this.props.data.title}</div>
            <div className="dropdown-extra-info">
              <div
                className="rating"
                onClick={this.handleRatingDialogOpen.bind(this)}
              >
                <span className="ic-star" />
                <span className="">{this.props.data.averageRating}</span>
              </div>
              <div className="age-rating">{this.props.data.age_rating}</div>
            </div>
            <div className="dropdown-description">
              <p className="">{this.props.data.synopsis}</p>
            </div>
            <div className="dropdown-actors-genres">
              <div className="label" translate="starring">
                {oResourceBundle.starring + ":"}
              </div>

              {this.props.data.cast &&
                this.props.data.cast.map((ele, index) => (
                  <Link
                    to={encodeURI(
                      `/${this.props.locale}/${constants.SEARCH}/${
                        constants.CAST
                      }/${ele}`
                    )}
                    key={Math.random() + ele}
                    className={index === 0 ? "first-item" : ""}
                    aria-label={ele.title}
                  >
                    <div className="cast">
                      {ele +
                        (index < this.props.data.cast.length - 1
                          ? ", "
                          : "")}{" "}
                    </div>
                  </Link>
                ))}
            </div>
            <div className="dropdown-actors-genres">
              <div className="label" translate="genres">
                {oResourceBundle.genres + ":"}
              </div>
              {this.props.data.genres &&
                this.props.data.genres.map((ele, index) => (
                  <Link
                    to={encodeURI(
                      `/${this.props.locale}/${constants.SEARCH}/${
                        constants.GENRE
                      }/${ele}`
                    )}
                    key={Math.random() + ele}
                    className={index === 0 ? "first-item" : ""}
                    aria-label={ele.title}
                  >
                    <div className="genres">
                      {ele +
                        (index < this.props.data.genres.length - 1
                          ? ", "
                          : "")}{" "}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          <div className="actions">
            <Button
              className="playlist-btn"
              icon={
                this.props.aUserPlayList.some(
                  ele => ele.content.id === this.props.data.id
                )
                  ? removePlaylistIcon
                  : addPlaylistIcon
              }
              onClick={this.onAddRemovePlaylist.bind(this)}
            >
              {oResourceBundle.playlist}
            </Button>
            <Button
              className="share-btn"
              icon={shareIcon}
              onClick={this.onShareButtonClick.bind(this)}
            >
              {oResourceBundle.share}
            </Button>
            {this.state.showShareIcons && (
              <div className="expanded-share">
                <FacebookShareButton url={window.location.href}>
                  <Button
                    className="fb-share"
                    icon={shareFacebookIcon}
                    onClick={this.onFBShareButtonClick.bind(this)}
                  >
                    {oResourceBundle.facebook}
                  </Button>
                </FacebookShareButton>
                <TwitterShareButton url={window.location.href}>
                  <Button
                    className="twitter-share"
                    icon={shareTwitterIcon}
                    onClick={this.onTwitterShareButtonClick.bind(this)}
                  >
                    {oResourceBundle.twitter}
                  </Button>
                </TwitterShareButton>
              </div>
            )}
          </div>
        </div>
        {!this.props.hidePlayIcon ? (
          <div className="dropdown-bottom-right">
            <div className="dropdown-bottom-right-overlay" />
            <Button
              className="play-button"
              icon={playIcon}
              value={{
                id: this.props.videoId,
                type: this.props.type,
                friendlyUrl: firstItemTitle,                
                premium_type: this.props.premium_type,
                rights_type:this.props.rights_type
                
              }}
              onClick={
                this.props.onPlayButtonClick
                  ? this.props.onPlayButtonClick
                  : () => {}
              }
            />
          </div>
        ) : null}
        <Dialog
          visible={this.state.isRatingDialogOpen}
          onDialogClosed={this.onRatingDialogClosed.bind(this)}
          duration={constants.RATING_DIALOG_ANIMATION_DURATION}
          showCloseButton={false}
          closeOnEsc={true}
          width={constants.RATING_DIALOG_WIDTH}
          height={constants.RATING_DIALOG_HEIGHT}
        >
          <div className="rating-dialog-content">
            <div className="dialog-title">{this.props.data.title}</div>
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    locale: state.locale,
    aUserPlayList: state.aUserPlayList,
    sCountryCode: state.sCountryCode
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
    fnChangeRating: (
      sLanguageCode,
      sItemId,
      sItemType,
      sTitle,
      sRating,
      sTarget,
      fnSuccess
    ) => {
      dispatch(
        actionTypes.fnChangeRating(
          sLanguageCode,
          sItemId,
          sItemType,
          sTitle,
          sRating,
          sTarget,
          fnSuccess
        )
      );
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VideoOverview)
);
