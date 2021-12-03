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
import PropTypes from "prop-types";
import { isMobile } from "react-device-detect";
import Button from "core/components/Button";
import Image from "core/components/Image";
import Progress from "react-progressbar";
import playIcon from "app/resources/assets/thumbnail/ic-play.svg";
// import PlayItem from "../../../resources/assets/playsvg.svg";
import playsvgHover from "../../../resources/assets/playsvgHover.svg";
// import addItem from "../../../resources/assets/add.svg";
import RemoveContent from "../../../resources/assets/removeItem.svg";
// import RemoveItem from "../../../resources/assets/remove.svg";
import downArrow from "app/resources/assets/thumbnail/ic-down-arrow.png";
import svod1 from "app/resources/assets/thumbnail/svod_1.png";
import svod2 from "app/resources/assets/thumbnail/svod_2.png";
import svod3 from "app/resources/assets/thumbnail/svod_3.png";
import * as constants from "app/AppConfig/constants";
import * as common from "app/utility/common";
import oResourceBundle from "app/i18n/";
// import addHover from "../../../resources/assets/addHover.svg"

import "./index.scss";

/**
 * Class to render thumbnail with overlay, arrow, play button and rating
 */
class ImageThumbnail extends React.PureComponent {

  /**
   * Click event on thumbnail
   * @param {Object} oEvt
   */
  onClick(oEvt) {
    if (this.props.playlistTitle) {
      common.setGenerealCookie("playlist_name", this.props.playlistTitle)
    }

    //Comment this to activate Thumnail click
    // TODO add this to configuration
    //oEvt.preventDefault();
  }
  /**
   * Render function overridden from react
   */
  render() {
    const sSeclectedClass = this.props.selected ? "selected" : "";
    const rights_type = this.props.digitalRights == 3 ? 3 : 1;

    let AddIconStatus = false

    if (this.props.showProgress) {
      let Content_ID = this.props.itemData.content_type == "movie" || this.props.itemData.content_type == "play" ? this.props.itemData.id : this.props.itemData.series_id
      AddIconStatus = this.props.userPlayList.some(ele => ele.content.id === Content_ID)
    }

    let isTrailer = this.props.isTrailer ? this.props.isTrailer : false

    return (
      <div>
        <div
          ref="thumbnail"
          onClick={oEvt => this.onClick(oEvt)}
          className={
            sSeclectedClass +
            " image-thumbnail" +
            (this.props.animateOnHover && !sSeclectedClass
              ? " thumnail-hover"
              : "") +
            (this.props.className ? " " + this.props.className : "") +
            (this.props.showPlayIcononHover && !sSeclectedClass
              ? " play-button-image-hover"
              : "")
          }
        >
          {/* {this.props.digitalRights == 3? ( <img
          className="plan-icon"
          src={svod3}
          alt="plan icon"
        />): ""} */}
          {/* {this.props.digitalRights == 3 ? "SVOD":"AVOD"} */}
          {/* {this.props.subscriptionPlans &&
        <img
          className="plan-icon"
          src={svod1}
          alt="plan icon"
        />
      } */}
          {
            !isTrailer && this.props.showProgress ?
              <Link to={this.props.linkURL} onClick={()=>this.props.onPlayItemClick(this.props.itemData,false)}>
                {/* -- Continue watching -- */}
                <Image
                  className="image-container"
                  src={this.props.imageSrc}
                  fallbackSrc={this.props.fallback}
                  alt={this.props.alt || this.props.title}
                  delayImage={this.props.delayImage}
                  imageLoaded={this.props.imageLoaded}
                />
              </Link>
              :
              !isTrailer ?
                // Normal thumbnail images
                <Image
                  className="image-container"
                  src={this.props.imageSrc}
                  fallbackSrc={this.props.fallback}
                  alt={this.props.alt || this.props.title}
                  delayImage={this.props.delayImage}
                  imageLoaded={this.props.imageLoaded}
                /> : ""
          }

          {/*  Trailer thumbnail images */}
          {
            isTrailer ?
              <div class="trailers-image-container">
                <div className="pos-relative">
                  <img src={this.props.imageSrc} alt={this.props.alt || this.props.title || "image"} />
                  {this.props.showOnImageDesc && this.props.onImageDescText && !isMobile ? (
                    <div className="on-image-desc">
                      <p className="episode">{this.props.onImageDescText}</p>
                      {this.props.showDuration ? (
                        <p className="duration">{this.props.durationValue}</p>
                      ) : null}
                    </div>
                  ) : null}
                  {this.props.showOnImageDesc && this.props.onImageDescText && isMobile ? (
                    <div className="on-image-desc">
                      <p className="episode">{this.props.onImageDescText}</p>
                      {this.props.showDuration ? (
                        <p className="duration">{this.props.durationValue}</p>
                      ) : null}
                    </div>
                  ) : null}

                  <Button
                    // onClick={this.props.onPlayButtonClick}
                    className={
                      "play-button trailor-play-btn" +
                      (this.props.showPlayIcononHover ? " play-button-hover" : "")
                    }
                    icon={playIcon}
                    value={{
                      id: this.props.id,
                      episodeNumber: this.props.episodeNumber,
                      itemTitle: this.props.title,
                      type: this.props.type,
                      friendlyUrl: this.props.friendlyUrl,
                      linkURL: this.props.linkURL,
                      bucketTitle: this.props.bucketTitle,
                      premium_type: this.props.premium_type,
                      rights_type: this.props.digitalRights == 3 ? 3 : 1,

                    }}
                    style={
                      (this.props.showPlayIcon || isMobile) &&
                        !this.props.isSubscriptionBanner
                        ? this.props.showPlayIcononHover && !isMobile
                          ? {}
                          : { display: "inline-block" }
                        : { display: "none" }
                    }
                  />
                </div>

                {this.props.showDescription && this.props.descriptionText ? (
                  <div className="desc-containar">
                    {this.props.descriptionHeading && (
                      <p className="description-heading">
                        {this.props.descriptionHeading}
                      </p>
                    )}
                    <p className="description">{this.props.descriptionText}</p>
                  </div>
                ) : null}


              </div>
              :
              ""

          }


          {!this.props.showProgress && this.props.showRatingIndicator &&
            this.props.showRatingIndicatorValue && !isMobile ? (
            <div className="carousel-bottom-overlay">
              <span className="ic-star" />
              <span>{this.props.showRatingIndicatorValue}</span>
            </div>
          ) : null}
          {!isTrailer && this.props.showOnImageDesc && this.props.onImageDescText && !isMobile ? (
            <div className="on-image-desc">
              <p className="episode">{this.props.onImageDescText}</p>
              {this.props.showDuration ? (
                <p className="duration">{this.props.durationValue}</p>
              ) : null}
            </div>
          ) : null}
          {!isTrailer && this.props.showOnImageDesc && this.props.onImageDescText && isMobile ? (
            <div className="on-image-desc">
              <p className="episode">{this.props.onImageDescText}</p>
              {this.props.showDuration ? (
                <p className="duration">{this.props.durationValue}</p>
              ) : null}
            </div>
          ) : null}
          {/* {this.props.showDownArrow && !isMobile? (
          <Button
            className={"down-arrow overlay-color"}
            icon={downArrow}
            onClick={this.props.onDownArrowClick}
            value={{ id: this.props.id, type: this.props.type }}
          />
        ) : null} */}
          {!isTrailer && this.props.showDescription && this.props.descriptionText ? (
            <div className="desc-containar">
              {this.props.descriptionHeading && (
                <p className="description-heading">
                  {this.props.descriptionHeading}
                </p>
              )}
              <p className="description">{this.props.descriptionText}</p>
            </div>
          ) : null}
          {
            !isTrailer && this.props.showProgress !== true ?
              <Button
                // onClick={this.props.onPlayButtonClick}
                className={
                  "play-button" +
                  (this.props.showPlayIcononHover ? " play-button-hover" : "")
                }
                icon={playIcon}
                value={{
                  id: this.props.id,
                  episodeNumber: this.props.episodeNumber,
                  itemTitle: this.props.title,
                  type: this.props.type,
                  friendlyUrl: this.props.friendlyUrl,
                  linkURL: this.props.linkURL,
                  bucketTitle: this.props.bucketTitle,
                  premium_type: this.props.premium_type,
                  rights_type: this.props.digitalRights == 3 ? 3 : 1,

                }}
                style={
                  (this.props.showPlayIcon || isMobile) &&
                    !this.props.isSubscriptionBanner
                    ? this.props.showPlayIcononHover && !isMobile
                      ? {}
                      : { display: "inline-block" }
                    : { display: "none" }
                }
              /> : ""
          }

          {this.props.premium_type !== undefined &&
            this.props.displayPremiumTag === true ? (
            <div className="premium-text-conatiner">
              <div className="premium-text">{this.props.premiumText}</div>
            </div>
          ) : null}

          {this.props.showProgress === true ?
            <div className="watching_details" style={{cursor:"default"}}>
              <div className="watching_title" style={{cursor:"pointer"}} onClick={()=>this.props.onPlayItemClick(this.props.itemData,this.props.linkURL)}>{this.props.itemData.title}</div>
              {this.props.showProgress === true ? (
                <Progress
                  completed={this.props.progressValuePercent}
                  color={constants.PROGRESS_COLOR}
                  height={constants.PROGRESS_THUMBNAIL_HEIGHT}
                />
              ) : null}
              {

                <p >{this.props.itemData.content_type != "movie" ?
                  (this.props.itemData.content_type != "play" ?
                    `${oResourceBundle.season} ${this.props.itemData.season_number} | ${oResourceBundle.EP} ${this.props.itemData.episode_number}` : "")
                  : ""}</p>

              }

              <div className="watching_actions">
                <div className="d-flex">
                  <div onClick={()=>this.props.onPlayItemClick(this.props.itemData,false)}>
                  <Link to={this.props.linkURL} >
                    <Button
                      className="carousel-bottom-overlay"
                      icon={playsvgHover}
                    >
                    </Button>
                    <Button
                      className="PlayItem-btn"
                    >
                    </Button>
                  </Link>
                    </div>
                 

                  <Button
                    className={AddIconStatus ? "MinusItem-btn" : "addItem-btn"}
                    onClick={() => this.props.onAddRemovePlaylist(this.props.itemData)}
                  >

                  </Button>
                </div>
                <div>
                  <Button
                    className="RemoveItem-btn"
                    // icon={RemoveItem}
                    onClick={() => this.props.onDeletePlayListItem(this.props.itemData, this.props.index)}
                  >
                  </Button>
                </div>
              </div>
            </div>
            : null
          }
        </div>
      </div>
    );
  }
}

ImageThumbnail.propTypes = {
  className: PropTypes.string,
  imageSrc: PropTypes.string,
  descriptionText: PropTypes.string,
  showDescription: PropTypes.bool,
  onImageDescText: PropTypes.string,
  showOnImageDesc: PropTypes.bool,
  showPlayIcon: PropTypes.bool,
  showPlayIcononHover: PropTypes.bool,
  animateOnHover: PropTypes.bool,
  showDownArrow: PropTypes.bool,
  showDownArrowonHover: PropTypes.bool,
  showRatingIndicator: PropTypes.bool,
  showRatingIndicatorValue: PropTypes.string
};

// Same approach for defaultProps too
ImageThumbnail.defaultProps = {
  className: "",
  imageSrc: "",
  descriptionText: "",
  showDescription: false,
  onImageDescText: "",
  showOnImageDesc: false,
  showPlayIcon: false,
  showPlayIcononHover: false,
  animateOnHover: false,
  showDownArrow: false,
  showDownArrowonHover: false,
  showRatingIndicator: true,
  showRatingIndicatorValue: ""
};
export default ImageThumbnail;
