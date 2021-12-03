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
import {Link} from "react-router-dom";
import Slider from "core/components/Swiper";
import ImageThumbnail from "app/views/components/ImageThumbnail";
import * as appURLs from "app/AppConfig/urlConfig";
import HandlerContext from "app/views/Context/HandlerContext";
import * as common from "app/utility/common";
import * as CONSTANTS from "app/AppConfig/constants";
import fallbackEn from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import fallbackAr from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import fallbackPosterAr from "app/resources/assets/thumbnail/placeholderA_slider_ar.png";
import "./index.scss";
/**
 * Component Name - SmartTvBanner
 * This is an functional Component and it is SmartTvBanner Component.
 * @param { Object } props - Properties to the Component.
 * @returns { Object }
 */

class SmartTvBanner extends React.Component {
  constructor(props){
    super(props);
    this.state={items:this.props.playListData[0].content}
  }
  items = [];
  static contextType = HandlerContext;
  componentDidMount() {
    const items = this.props.playListData[0].content;
    // if (ADD_TRIAL_BANNER) {
    //   const trialBanner = getTrialBannerData(CONSTANTS.TRIAL_BANNER_LANDSCAPE);
    //   items.unshift(trialBanner);
    // }
    this.items = items;
    this.setState({items:items});
  }
 

  render() {
    const fallbackImage = this.props.showfallPosterImage 
      ? this.props.locale === "ar"
        ? fallbackPosterAr
        : fallbackPosterAr
      : this.props.locale === "ar"
        ? fallbackAr
        : fallbackEn;
    const dir = common.getDirection(this.props.locale);
    const rtl = dir === "rtl" ? true : false;

    // const dots = this.items.length > 1 ? true : false;
    const dots = true;
    return (
      <React.Fragment>
        <section className="smart-tv-banner">
          <div className="first-row">
        
            <Slider
              rtl={rtl}
              dots={dots}
              isCarousel={true}
              slidesToScroll={1}
              expand={true}
              autoPlay={true}
              autoplaySpeed={CONSTANTS.AUTOPLAYSPEED_BANNER}
              rebuildOnUpdate={true}
              bannerDotsBoolean
            >
              {this.state.items.map((ele, i) => {
                if (
                  ele.content_type ===
                  CONSTANTS.SUBSCRIPTION_BANNER_CONTENT_TYPE
                ) {
                  return (
                    <div
                      className="subscribe-thumbnail"
                      key={i}
                      aria-label={ele.title}
                      tabIndex="0"
                      onClick={event =>
                        this.context.onSubscribeButtonClick(event, true)
                      }
                    >
                      <ImageThumbnail
                        className="carousel-item"
                        fallback={fallbackImage}
                        imageSrc={ele.thumbnail}
                        alt={ele.title}
                        showPlayIcon={false}
                        showPlayIcononHover={false}
                      />
                      {
                        // <CarouselRegisterButton className="subscribe-button" />
                      }
                    </div>
                  );
                } else {
                  const aux = ele.imagery.thumbnail.split("/");
                  const type = aux[aux.length - 2];
                  const lastsegment = aux[aux.length - 1];
                  return (
                    <Link
                      to={`/${this.props.locale}/${ele.content_type}/${
                        ele.id
                      }/${ele.friendly_url}`}
                      key={ele.id}
                      aria-label={ele.title}
                      tabIndex="0"
                    >
                      <ImageThumbnail
                        className="carousel-item"
                        fallback={fallbackImage}
                        alt={ele.title}
                        imageSrc={
                          this.props.imageType
                            ? ele.imagery[this.props.imageType]
                            : appURLs.THUMBNAIL_IMAGE.replace(
                                "{TYPE}",
                                type
                              ).replace("{IMAGE_NAME}", lastsegment)
                        }
                        showPlayIcon={true}
                        showPlayIcononHover={true}
                      />
                    </Link>
                  );
                }
              })}
            </Slider>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
export default SmartTvBanner;
