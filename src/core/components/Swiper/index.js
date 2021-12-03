import React from "react";
import ReactSwiper from "react-id-swiper";
import SwipeReact from "swipe-react";
import Logger from "core/Logger";
import * as CONSTANTS from "../../BaseContainer/constants";
import {
  NEXT_ACTION,
  PREVIOUS_ACTION,
  CAROUSEL_CATEGORY
} from "app/AppConfig/constants";
import { sendEvents } from "core/GoogleAnalytics/";
import "./index.scss";

class Swiper extends React.Component {
  MODULE_NAME = "Swiper";
  ENABLE_LOGS = false;

  constructor(props) {
    super(props);
    this.swiper = null;
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.update = true;
    if (props.enableSwipeScroll === true) {
      if (this.ENABLE_LOGS) {
        Logger.log(this.MODULE_NAME, "enabled swipe");
      }
      SwipeReact.config({
        left: this.onSwipedLeft.bind(this),
        right: this.onSwipedRight.bind(this)
      });
    }
  }

  componentDidMount() {
    // Hack to enable click on duplicate slides of swiper
    if (this.ENABLE_LOGS) {
      Logger.log(this.MODULE_NAME,"componentDidMount");
    }
    this.addButtonEvents();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    window.addEventListener(
      "orientationchange",
      this.updateWindowOrientation.bind(this)
    );
  }

  updateWindowOrientation() {
    setTimeout(() => {
      this.fnUpdateSwiperDimensions();
    }, 0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.ENABLE_LOGS) {
      Logger.log(this.MODULE_NAME, "componentDidUpdate");
    }
    if (this.props.children.length !== prevProps.children.length) {
      this.addButtonEvents();
    } else {
      for (let i = 0; i < this.props.children.length; i++) {
        if (
          prevProps.children[i] &&
          this.props.children[i] &&
          this.props.children[i].key !== prevProps.children[i].key
        ) {
          this.addButtonEvents();
          break;
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.ENABLE_LOGS) {
      Logger.log(this.MODULE_NAME, "componentWillUnmount");
    }
    window.removeEventListener("resize", this.updateWindowDimensions);
    window.removeEventListener(
      "orientationchange",
      this.updateWindowOrientation
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.ENABLE_LOGS) {
      Logger.log(this.MODULE_NAME, "shouldComponentUpdate: " + this.update);
    }
    return this.update;
  }

  reset() {
    this.update = true;
  }

  addButtonEvents() {
    if (this.ENABLE_LOGS) {
      Logger.log(this.MODULE_NAME, "addButtonEvents");
    }
    if (this.props.onPlayButtonClick) {
      if (this.props.enablePlayButtonClick) {
        // Hack to enable component update when next content starts
        const playIcons = this.swiper.el.querySelectorAll(
          ".swiper-slide .play-button"
        );
        if (this.ENABLE_LOGS) {
          Logger.log(
            this.MODULE_NAME,
            "adding click to .swiper-slide .play-button"
          );
        }
        for (let i = 0; i < playIcons.length; i++) {
          playIcons[i].addEventListener("click", e => {
            Logger.log(this.MODULE_NAME, "setting this.update = true");
            this.reset();
            this.props.onPlayButtonClick(e);
          });
        }
      } else {
        let playIcons = this.swiper.el.querySelectorAll(
          ".swiper-slide-duplicate .play-button"
        );
        if (this.ENABLE_LOGS) {
          Logger.log(
            this.MODULE_NAME,
            "adding click to .swiper-slide-duplicate .play-button"
          );
        }
        for (let i = 0; i < playIcons.length; i++) {
          playIcons[i].addEventListener("click", this.props.onPlayButtonClick);
        }
      }
    }
    if (this.props.onDownArrowClick) {
      const downIcons = this.swiper.el.querySelectorAll(
        ".swiper-slide-duplicate .down-arrow"
      );
      for (let i = 0; i < downIcons.length; i++) {
        downIcons[i].addEventListener("click", this.props.onDownArrowClick);
      }
    }
  }

  fnUpdateSwiperDimensions() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      swiperHeight:
        this.swiper && this.swiper.el ? this.swiper.el.clientHeight : 0
    });

    if (this.props.isCarousel) {
      // Fixes bug where autoplay was stopped when window was resized
      if (this.swiper.autoplay) {
        this.swiper.autoplay.stop();
        this.swiper.update();
        this.swiper.autoplay.start();
      }
    }
  }

  updateWindowDimensions() {
    if (!this.isMobile()) {
      this.fnUpdateSwiperDimensions();
    }
  }

  isMobile() {
    //initiate as false
    let isMobile = false;
    // device detection
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        navigator.userAgent.substr(0, 4)
      )
    ) {
      isMobile = true;
    }
    return isMobile;
  }

  slideNext() {
    if (this.swiper) {
      this.swiper.slideNext();
    }
    //Send analytics event
    sendEvents(CAROUSEL_CATEGORY, NEXT_ACTION, this.props.bucketTitle || "");
  }

  slidePrev() {
    if (this.swiper) {
      this.swiper.slidePrev();
    }
    //Send analytics event
    sendEvents(
      CAROUSEL_CATEGORY,
      PREVIOUS_ACTION,
      this.props.bucketTitle || ""
    );
  }

  onSwipedLeft() {
    if (this.ENABLE_LOGS) {
      Logger.log(this.MODULE_NAME, "onSwipedLeft");
    }
    if (this.swiper && this.props.enableSwipeScroll === true && this.swiper.destroyed !== true) {
      if (this.props.rtl) {
        this.swiper.slidePrev();
        this.handlePrev();
      } else {
        this.swiper.slideNext();
        this.handleNext();
      }
    }
  }

  onSwipedRight() {
    if (this.ENABLE_LOGS) {
      Logger.log(this.MODULE_NAME, "onSwipedRight");
    }
    if (this.swiper && this.props.enableSwipeScroll === true && this.swiper.destroyed !== true) {
      if (this.props.rtl) {
        this.swiper.slideNext();
        this.handleNext();
      } else {
        this.swiper.slidePrev();
        this.handlePrev();
      }
    }
  }

  handleNext(e) {
    if (this.props.updateSelective) {
      this.update = false;
    }
    typeof this.props.onNextButtonClick === "function" &&
      this.props.onNextButtonClick();
    //Send analytics event
    sendEvents(CAROUSEL_CATEGORY, NEXT_ACTION, this.props.bucketTitle || "");
  }

  handlePrev(e) {
    if (this.props.updateSelective) {
      this.update = false;
    }
    typeof this.props.onPreviousButtonClick === "function" &&
      this.props.onPreviousButtonClick();
    //Send analytics event
    sendEvents(
      CAROUSEL_CATEGORY,
      PREVIOUS_ACTION,
      this.props.bucketTitle || ""
    );
  }

  render() {
    let classNameNext, classNamePrev;
    let slidesPerView, slidesToScroll;

    if (this.state.windowWidth > 4999) {
      classNameNext =
        this.props.children.length > 8 || this.props.forceEnableArrows
          ? ".swiper-button-next"
          : ".hidden";
      classNamePrev =
        this.props.children.length > 8 || this.props.forceEnableArrows
          ? ".swiper-button-prev"
          : ".hidden";
      slidesPerView =
        this.props.expand && this.props.children.length < 7
          ? this.props.children.length
          : 7;
      slidesToScroll = 7;
    } else if (this.state.windowWidth > 1599) {
      classNameNext =
        this.props.children.length > 7 || this.props.forceEnableArrows
          ? ".swiper-button-next"
          : ".hidden";
      classNamePrev =
        this.props.children.length > 7 || this.props.forceEnableArrows
          ? ".swiper-button-prev"
          : ".hidden";
      slidesPerView =
        this.props.expand && this.props.children.length < 7
          ? this.props.children.length
          : 7;
      slidesToScroll = 7;
    } else if (this.state.windowWidth > 1279)
     {
      classNameNext =
        this.props.children.length > 5 || this.props.forceEnableArrows
          ? ".swiper-button-next"
          : ".hidden";
      classNamePrev =
        this.props.children.length > 5 || this.props.forceEnableArrows
          ? ".swiper-button-prev"
          : ".hidden";
      slidesPerView =
        this.props.expand && this.props.children.length < 6
          ? this.props.children.length
          : 6;
      slidesToScroll = 6;
    } else if (this.state.windowWidth > 959) {
      classNameNext =
        this.props.children.length > 5 || this.props.forceEnableArrows
          ? ".swiper-button-next"
          : ".hidden";
      classNamePrev =
        this.props.children.length > 5 || this.props.forceEnableArrows
          ? ".swiper-button-prev"
          : ".hidden";
      slidesPerView =
        this.props.expand && this.props.children.length < 5
          ? this.props.children.length
          : 5;
      slidesToScroll = 5;
    } else if (this.state.windowWidth > 744) {
      classNameNext =
        this.props.children.length > 4 || this.props.forceEnableArrows
          ? ".swiper-button-next"
          : ".hidden";
      classNamePrev =
        this.props.children.length > 4 || this.props.forceEnableArrows
          ? ".swiper-button-prev"
          : ".hidden";
      slidesPerView =
        this.props.expand && this.props.children.length < 4
          ? this.props.children.length
          : 4;
      slidesToScroll = 4;
    } else if (this.state.windowWidth > 499) {
      slidesPerView =
        this.props.expand && this.props.children.length < 3
          ? this.props.children.length
          : 3;
      slidesToScroll = 1;
    } else if (this.state.windowWidth > 299) {
      slidesPerView = 2;
      slidesToScroll = 1;
    } else {
      slidesPerView = 1;
      slidesToScroll = 1;
    }
    if (this.props.slidesPerView) {
      slidesPerView = this.props.slidesPerView;
    }
    if (this.props.slidesToScroll) {
      slidesToScroll = this.props.slidesToScroll;
    }
    let params = {
      rebuildOnUpdate:
        this.props.rebuildOnUpdate !== undefined &&
        this.props.rebuildOnUpdate === false
          ? this.props.rebuildOnUpdate
          : true,
      shouldSwiperUpdate:
        this.props.shouldSwiperUpdate !== undefined
          ? this.props.shouldSwiperUpdate
          : false,
      loop: true,
      lazy: true,
      speed:
        this.props.speed !== undefined
          ? this.props.speed
          : CONSTANTS.SWIPER_DEFAULT_ANIMATION_SPEED,
      touchEventsTarget: "wrapper",
      navigation: {
        nextEl: classNameNext,
        prevEl: classNamePrev
      },
      threshold: 10,
      allowTouchMove:
        this.props.allowTouchMove !== undefined
          ? this.props.allowTouchMove
          : true,
      draggable: true,
      renderPrevButton: () => (
        <div onClick={this.handlePrev} className={classNamePrev.slice(1)} />
      ),
      renderNextButton: () => (
        <div onClick={this.handleNext} className={classNameNext.slice(1)} />
      )
    };
    if (!this.props.isCarousel) {
      const shouldGrouptoOne = this.props.shouldGrouptoOne;

      // const loopedSlides
      params.breakpoints = {
        4999: {
          slidesPerView: slidesPerView ? slidesPerView : 7,
          slidesPerGroup:
            shouldGrouptoOne !== undefined && shouldGrouptoOne === false
              ? 7
              : 1,
          spaceBetween: 5,
          loopAdditionalSlides:
            this.props.loopAdditionalSlides !== undefined
              ? this.props.loopAdditionalSlides
              : 1,
          loop: this.props.children.length > slidesPerView ? true : false,
          rtl: this.props.rtl
        },
        1599: {
          slidesPerView: slidesPerView ? slidesPerView : 6,
          slidesPerGroup:
            shouldGrouptoOne !== undefined && shouldGrouptoOne === false
              ? 6
              : 1,
          spaceBetween: 4,
          loopAdditionalSlides:
            this.props.loopAdditionalSlides !== undefined
              ? this.props.loopAdditionalSlides
              : 1,
          loop: this.props.children.length > slidesPerView ? true : false,
          rtl: this.props.rtl
        },
        1279: {
          slidesPerView: slidesPerView ? slidesPerView : 5,
          slidesPerGroup:
            shouldGrouptoOne !== undefined && shouldGrouptoOne === false
              ? 5
              : 1,
          spaceBetween: 5,
          loopAdditionalSlides:
            this.props.loopAdditionalSlides !== undefined
              ? this.props.loopAdditionalSlides
              : 1,
          loop: this.props.children.length > slidesPerView ? true : false,
          rtl: this.props.rtl
        },
        959: {
          slidesPerView: slidesPerView ? slidesPerView : 4,
          slidesPerGroup: 1,
          spaceBetween: 5,
          loopAdditionalSlides:
            this.props.loopAdditionalSlides !== undefined
              ? this.props.loopAdditionalSlides
              : 1,
          loop: this.props.children.length > slidesPerView ? true : false,
          rtl: this.props.rtl
        },
        744: {
          slidesPerView: slidesPerView ? slidesPerView : 3,
          slidesPerGroup: 1,
          spaceBetween: 5,
          loopAdditionalSlides:
            this.props.loopAdditionalSlides !== undefined
              ? this.props.loopAdditionalSlides
              : 1,
          loop: this.props.children.length > slidesPerView ? true : false,
          rtl: this.props.rtl
        },
        499: {
          slidesPerView: slidesPerView ? slidesPerView : 2,
          slidesPerGroup: 1,
          spaceBetween: 5,
          loopAdditionalSlides: this.props.loopAdditionalSlides
            ? this.props.loopAdditionalSlides
            : 1,
          loop: this.props.children.length > slidesPerView ? true : false,
          rtl: this.props.rtl
        },
        299: {
          slidesPerView: slidesPerView ? slidesPerView : 1,
          slidesPerGroup: 1,
          loop: this.props.children.length > slidesPerView ? true : false,
          rtl: this.props.rtl
        }
      };
    } else {
      params = {
        //rtl: this.props.rtl,
        rebuildOnUpdate:
          this.props.rebuildOnUpdate !== undefined &&
          this.props.rebuildOnUpdate === false
            ? this.props.rebuildOnUpdate
            : true,
        breakpoints: {
          5000: {
            slidesPerView: 1,
            slidesPerGroup: slidesToScroll,
            spaceBetween: 0,
            loopAdditionalSlides: this.props.loopAdditionalSlides
              ? slidesPerView
              : 2,
            loop: this.props.children.length > 1 ? true : false,
            rtl: this.props.rtl
          }
        }
      };
      if (this.props.children.length > 1) {
        params.autoplay = {
          delay: this.props.autoplaySpeed,
          disableOnInteraction: false
        };
        params.speed = this.props.autoplaySpeed;
      }
      if (this.props.rtl) {
        params.rtl = this.props.rtl;
      }
    }

    if (this.props.dots) {
      params.pagination = {
        el: this.props.bannerDotsBoolean
          ? ".swiper-pagination.customized-swiper-pagination"
          : ".pagination-dots",
        clickable: true
      };
    }

    // let repeatNum = 1
    // //experiment on duplicating array elements

    // if (this.props.duplicateSlides && classNameNext !== '.hidden') {
    // 	const numberOfChildren = this.props.children.length
    // 	repeatNum = Math.ceil(30 / numberOfChildren)
    // 	if (slidesPerView <= 2) {
    // 		repeatNum = 2
    // 	}
    // }

    return (
      <div className="swiper-touch-container" {...SwipeReact.events}>
        <ReactSwiper
          className="swiper-wrapper"
          {...params}
          ref={node => {
            if (node) this.swiper = node.swiper;
          }}
        >
          {this.props.children}
          {/* {children} */}
        </ReactSwiper>
      </div>
    );
  }
}

export function getSlidesPerView(windowWidth) {
  if (windowWidth > 4999) {
    return 7;
  } else if (windowWidth > 1599) {
    return 6;
  } else if (windowWidth > 1279) {
    return 5;
  } else if (windowWidth > 959) {
    return 4;
  } else if (windowWidth > 744) {
    return 3;
  } else if (windowWidth > 499) {
    return 2;
  } else if (windowWidth > 299) {
    return 1;
  }
}

export default Swiper;
