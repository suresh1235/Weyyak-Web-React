import React from "react";
import {Link, Route} from "react-router-dom";
import Slider from "core/components/Swiper";
//import Slider from 'core/components/Slider';
import ImageThumbnail from "app/views/components/ImageThumbnail";
// import CarouselRegisterButton from "app/views/components/CarouselRegisterButton";
import * as CONSTANTS from "app/AppConfig/constants";
import {ADD_TRIAL_BANNER} from "app/AppConfig/features";
import {getDirection} from "app/utility/common";
import fallbackEn from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import fallbackAr from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import fallbackPosterAr from "app/resources/assets/thumbnail/placeholderA_slider_ar.png";
import {fnConstructContentURL} from "app/utility/common";
import oResourceBundle from "app/i18n/";
import HandlerContext from "app/views/Context/HandlerContext";
import "./index.scss";

class ImageCarousel extends React.PureComponent {
  static contextType = HandlerContext;

  render() {
    const fallbackImage = this.props.showfallPosterImage
      ? this.props.locale === "ar"
        ? fallbackPosterAr
        : fallbackPosterAr
      : this.props.locale === "ar"
        ? fallbackAr
        : fallbackEn;
    const dir = getDirection(this.props.locale);
    const rtl = dir === "rtl" ? true : false;
    return (
      <section className="image-carousel">
        {this.props.items && (
          <Route
            render={({history}) => (
              <Slider
                dots={true}
                rtl={rtl}
                autoplaySpeed={CONSTANTS.CAROUSEL_AUTOPLAY_SPEED}
                slidesToScroll={1}
                isCarousel={true}
                isSliding={this.props.isSliding}
                onPlayButtonClick={this.props.onPlayButtonClick.bind(
                  this,
                  history
                )}
              >
                {this.props.items.map((ele, i) => {
                 const digitalRights = (ele.content_type==='movie'&& ele.movies && ele.movies[0])? ele.movies[0].digitalRighttype:((ele.content_type==='series')? ele.seasons[0].digitalRighttype:'');
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
                          isSubscriptionBanner={true}
                          showPlayIcononHover={false}
                          digitalRights={digitalRights}
                          
                        />
                        {
                          // <CarouselRegisterButton className="subscribe-button" />
                        }
                      </div>
                    );
                  } else {
                    return (
                      <Link
                        to={`/${this.props.locale}${fnConstructContentURL(
                          ele.content_type,
                          ele
                        )}`}
                        key={ele.id}
                        aria-label={ele.title}
                        tabIndex="0"
                      >
                        <ImageThumbnail
                          displayPremiumTag={false}
                          premium_type={
                            this.props.isMENARegion ? "AVOD" : "SVOD"
                          }
                          // rights_type={this.props.digitalRights == 3? 3: 1} 
                          premiumText={oResourceBundle.premium}
                          className="carousel-item"
                          id={ele.id}
                          alt={ele.title}
                          type={ele.content_type}
                          fallback={fallbackImage}
                          friendlyUrl={ele.friendly_url}
                          imageSrc={
                            this.props.imageType
                              ? ele.imagery[this.props.imageType]
                              : `${ele.imagery.thumbnail}${
                                  CONSTANTS.IMAGE_DIMENSIONS_CAROUSEL
                                }`
                          }
                          showPlayIcon={
                            ADD_TRIAL_BANNER && i === 0 ? false : true
                          }
                          showPlayIcononHover={
                            ADD_TRIAL_BANNER && i === 0 ? false : true
                          }
                          onPlayButtonClick={this.props.onPlayButtonClick.bind(
                            this,
                            history
                          )}
                          digitalRights={digitalRights}
                        />
                      </Link>
                    );
                  }
                })}
              </Slider>
            )}
          />
        )}
      </section>
    );
  }
}

export default ImageCarousel;
