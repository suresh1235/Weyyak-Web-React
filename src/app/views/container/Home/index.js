/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */
import React, { Suspense } from "react";
import BaseContainer from "core/BaseContainer/";
//import Image from "core/components/Image";
import { connect } from "react-redux";
import * as actionTypes from "app/store/action/";
import {
  NUMBER_OF_BUCKETS_PER_AD,
  AD_CONTAINER_ID_PREFIX,
  AD_CLASS_MOBILE,
  AD_CLASS_DESKTOP,
  LOGIN,
  HOME_ID,
  MY_PLAYLIST_MENU_ID,
  LAZY_LOAD_DELAY_BUCKET,
  HOME_RAMADAN,
  HOME_EGYPT_SERIES, 
  HOME_EGYPT_MOVIES,
  HOME_SYRIAN,
  HOME_INDIA_AND_INTERNATIONAL_SERIES,
  HOME_INDIA_AND_INTERNATIONAL_MOVIES,
  HOME_SHOWS,
  HOME_BUCKETS_TO_LOAD,
  COOKIE_USER_TOKEN,
  DEFAULT_IMAGE_STATIC_PATH

} from "app/AppConfig/constants";
import { ENABLE_BANNER_ADVERTISEMENT } from "app/AppConfig/features";

import Spinner from "core/components/Spinner";
// import Slider, { getSlidesPerView } from "core/components/Swiper";
import HandlerContext from "app/views/Context/HandlerContext";
import Grid from "app/views/components/Grid";
import SmartTVLayout from "app/views/components/SmartTVLayout";
import SmartTVBanner from "app/views/components/SmartTVBanner";
import * as common from "app/utility/common";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import Logger from "core/Logger";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import "./index.scss";
import Slider from "react-slick";

const BucketItem = React.lazy(() =>import("app/views/components/BucketItem"));

const MODULE_NAME = "HomeScreen";
class HomeScreen extends BaseContainer {
  state = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    drawOffscreenImages: false
  };
  //Context use its handler as Consumer
  static contextType = HandlerContext;
  ALL_ID = "ALL_ID";

  constructor(props) {
    super(props);
    this.lazyLoadTimer = -1;
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateWindowOrientation = this.updateWindowOrientation.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.bAdSignalDataSent = true;
  }

  updateWindowDimensions() {
    if (isMobile !== undefined && !isMobile) {
      this.setState({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });
    }
  }

  updateWindowOrientation() {
    setTimeout(() => {
      this.setState({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });
    }, 0);
  }
  /**
   * Component Name - HomeScreen
   * Should proceed for the component render or not
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.windowWidth !== nextState.windowWidth) {
      this.bShoulRebuild = true;
    } else {
      this.bShoulRebuild = false;
    }
    return true;
  }
  /**
   * Component Name - HomeScreen
   * Executes when component mounted to DOM.
   */
  componentDidMount() {
    Logger.log(MODULE_NAME, "componentDidMount: " + this.bAdSignalDataSent);
    //This ensures mount phase service call count
    this.componentLoaded = false;
    this.bAdSignalDataSent = false;
    //Load item when navigating from other pages
    let sCategoryId = this.fnFetchMenuItemId(this.props.match.params.category);
    const oUserToken = JSON.parse(common.getCookie(COOKIE_USER_TOKEN));

    if (
      (this.props.aMenuItems && oUserToken) ||
      (this.props.aMenuItems &&
        !this.props.oPageContent &&
        !this.componentLoaded) ||
      (this.props.aMenuItems && sCategoryId)
    ) {
      if (!sCategoryId) {
        sCategoryId = this.props.aMenuItems.data[0].id;
      }

      this.props.fnFetchPageContent(
        this.props.locale,
        sCategoryId,
        this.fnMyPlayListLoginFailure.bind(this),
        this.apiFailure.bind(this)
      );
      this.componentLoaded = true;
    }
    this.fnScrollToTop();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    window.addEventListener("orientationchange", this.updateWindowOrientation);

    this.lazyLoadTimer = setTimeout(
      () =>
        this.setState({
          drawOffscreenImages: true
        }),
      LAZY_LOAD_DELAY_BUCKET
    );
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    window.removeEventListener(
      "orientationchange",
      this.updateWindowOrientation
    );
    window.removeEventListener("scroll", this.onScroll);
    clearTimeout(this.lazyLoadTimer);
  }

  apiFailure() {
    this.setState({ errorOccured: true });
  }
  onScroll() {
    Logger.log(MODULE_NAME, "onScroll: " + this.state.drawOffscreenImages);
    if (!this.state.drawOffscreenImages) {
      this.setState({
        drawOffscreenImages: true
      });
    }
    clearTimeout(this.lazyLoadTimer);
    window.removeEventListener("scroll", this.onScroll);
  }

  /**
   * Component Name - HomeScreen
   * Get menu item id
   * @param {String} sCategory - Previous props
   * @return {String} menu item id
   */
  fnFetchMenuItemId(sCategory) {
    let sCategoryId = null;
    if (this.props.aMenuItems && sCategory) {
      const oMenuItem = this.props.aMenuItems.data.filter(ele => {
        if (ele.friendly_url.indexOf(sCategory) !== -1) {
          return true;
        }
        return false;
      });
      sCategoryId = oMenuItem[0] ? oMenuItem[0].id : null;
    }

    return sCategoryId;
  }

  bucketsRendered() {
    
    Logger.log(
      MODULE_NAME,
      "bucketsRendered trigger:" + this.bAdSignalDataSent
    );
    if (!this.bAdSignalDataSent) {
      this.bAdSignalDataSent = true;
      super.setSignalData({}, {}, this.props.locale, this.props.sCountryCode, common.getUserId(), this.props.bPageViewSent);
      setTimeout(() => this.props.fnPageViewSent(), 0);
    }
  }
  /**
   * Component Name - HomeScreen
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    Logger.log(MODULE_NAME, "componentDidUpdate: " + this.bAdSignalDataSent);
    //let sCategoryId = this.props.match.params.id;
    let sCategoryId = this.fnFetchMenuItemId(this.props.match.params.category);
    let sCountryCode =this.props.match.params.countrycode;
    const languageCode = this.props.match.params.languagecode;
    if (
      this.props.aMenuItems &&
      !this.props.oPageContent &&
      !this.componentLoaded
    ) {
      if (!sCategoryId) {
        sCategoryId = this.props.aMenuItems.data[0].id;
      }
      // if(!SCountryCode){
      //   sCountryCode = this.props.aMenuItems.data[0].id;
      // }

      
      this.props.fnFetchPageContent(
        this.props.locale,
        sCategoryId,
        this.fnMyPlayListLoginFailure.bind(this),
        this.apiFailure.bind(this)
      );
      this.componentLoaded = true;
    } else if (this.props.loginDetails !== prevProps.loginDetails) {
      if (!sCategoryId) {
        sCategoryId = this.props.aMenuItems.data[0].id;
      }
      this.props.fnFetchPageContent(
        this.props.locale,
        sCategoryId,
        this.fnMyPlayListLoginFailure.bind(this),
        this.apiFailure.bind(this)
      );
    } else if (
      prevProps.match.params.category !== this.props.match.params.category
    ) {
      if (!sCategoryId) {
        sCategoryId = this.props.aMenuItems.data[0].id;
      }

      this.context.onOverlayClick();
      this.props.fnFetchPageContent(
        this.props.locale,
        sCategoryId,
        this.fnMyPlayListLoginFailure.bind(this),
        this.apiFailure.bind(this)
      );
      this.bAdSignalDataSent = false;
    } else if (
      prevProps.locale !== this.props.locale &&
      this.props.oPageContent
    ) {
      if (!sCategoryId) sCategoryId = this.props.oPageContent.data.id;
      this.context.onOverlayClick();
      this.props.fnFetchPageContent(
        this.props.locale,
        sCategoryId,
        this.fnMyPlayListLoginFailure.bind(this),
        this.apiFailure.bind(this)
      );
      this.bAdSignalDataSent = false;
    } else if (
      this.props.aMenuItems &&
      !sCategoryId &&
      languageCode &&
      this.context.fnGetLogoClickedState()
    ) {
      sCategoryId = this.props.aMenuItems.data[0].id;
      this.props.fnFetchPageContent(
        this.props.locale,
        sCategoryId,
        this.fnMyPlayListLoginFailure.bind(this),
        this.apiFailure.bind(this)
      );
      this.context.fnLogoClickedStateChange(false);
    }
  }

  fnAdsContainerLoaded() {
    Logger.log(MODULE_NAME, "fnAdsContainerLoaded: " + this.bAdSignalDataSent);
    if (this.props.oPageContent && !this.bAdSignalDataSent) {
      this.bAdSignalDataSent = true;
      super.setSignalData({}, {}, this.props.locale,this.props.sCountryCode, common.getUserId(), this.props.bPageViewSent);
      this.props.fnPageViewSent();
    }
  }

  /**
   * Component Name - HomeScreen
   * It will used to handle the log out failure in My Playlist.
   * @param { null }
   * @returns { null }
   */
  fnMyPlayListLoginFailure() {
    this.props.history.push(`/${this.props.locale}/${LOGIN}`);
  }

  /**
   * Component Name - HomeScreen
   * Render method
   */
  render() {
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 1,
      initialSlide: 0,
      arrows: true,
      centerMode: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
            arrows: false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
            infinite: true,
            arrows: false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            arrows: false
          }
        }
      ]
    };

    let aPlayListData = null;
    let aUserMyPlayListData = null;
    let oFeaturePlayList = null;
    const aResumableMedias = this.props.aResumableMedias;
    
    let gridItems;
    let oMetaTags, seoTitle, description;

    if (this.props.oPageContent) {
      aUserMyPlayListData = this.props.oPageContent.userPlayList;
      aPlayListData = !aUserMyPlayListData
        ? this.props.oPageContent.data.playlists
        : //This array for playlist
          [
            {
              content: aUserMyPlayListData,
              id: this.ALL_ID,
              title: oResourceBundle.all
            }
          ];
      oFeaturePlayList = !aUserMyPlayListData
        ? this.props.oPageContent.data.featured
        : {};
      if (this.isGrid()) {
        if (
          aPlayListData &&
          aPlayListData.length > 1 &&
          aPlayListData[0].id !== this.ALL_ID
        ) {
          const all = {};
          all.id = this.ALL_ID;
          all.title = oResourceBundle.all;
          all.content = [];
          all.content = aPlayListData.map(ele => {
            return ele.content;
          });
          all.content = [].concat(...all.content);
          aPlayListData.unshift(all);
          gridItems = aPlayListData[0] ? aPlayListData[0].content : [];
        } else if (aPlayListData) {
          gridItems = aPlayListData[0] ? aPlayListData[0].content : [];
        }
      }
      // if (
      //   this.props.oPageContent.data ||
      //   HOME_ID === this.props.oPageContent.data.id
      // ) {
      //   seoTitle =
      //     common.capitalizeFirstLetter(oResourceBundle.weyyak) +
      //     " - " +
      //     this.props.oPageContent.data.title;
      // } else {
      //   seoTitle = oResourceBundle.website_meta_title;
      // }
      if (
        !this.props.oPageContent.data ||
        HOME_ID === this.props.oPageContent.data.id
      ) {
        seoTitle = oResourceBundle.website_meta_title;
      } else {
        seoTitle =
          common.capitalizeFirstLetter(oResourceBundle.weyyak) +
          " - " +
          this.props.oPageContent.data.title;
      }

      description = oResourceBundle.website_meta_description;
      const oMetaObject = this.fnConstructMetaTags(
        seoTitle,
        window.location.href,
        description
      );
      oMetaTags = this.fnUpdateMetaTags(oMetaObject);
    } else {
      const seoTitle = oResourceBundle.website_meta_title;
      const description = oResourceBundle.website_meta_description;
      const oMetaObject = this.fnConstructMetaTags(
        seoTitle,
        window.location.href,
        description
      );
      oMetaTags = this.fnUpdateMetaTags(oMetaObject);
    }
    return this.props.oPageContent && !this.props.loading ? (
      <React.Fragment>
        {oMetaTags}
        {common.getFeaturePlayListType(
          oFeaturePlayList && oFeaturePlayList.type 
        ) === "A" && (
          <SmartTVLayout
            playListData={oFeaturePlayList.playlists}
            locale={this.props.locale}
          />
        )}
        {common.getFeaturePlayListType(
          oFeaturePlayList && oFeaturePlayList.type
        ) === "C" && (
          <SmartTVBanner
            playListData={oFeaturePlayList.playlists}
            locale={this.props.locale}
            imageType={"mobile_img"}
            showfallPosterImage={true}
          />
        )}
        <section className="bucket-item-container">
          {this.isGrid() ? (
            <React.Fragment>
              <Grid
                key={
                  this.props.oPageContent.data
                    ? this.props.oPageContent.data.id
                    : this.props.match.params.id
                }
                data={aPlayListData}
                gridItems={
                  aUserMyPlayListData ? aUserMyPlayListData : gridItems
                }
                locale={this.props.locale}
                title={
                  this.props.oPageContent &&
                  this.props.oPageContent.data &&
                  this.props.oPageContent.data.title
                    ? this.props.oPageContent.data.title
                    : oResourceBundle.my_playlist
                }
                adsContainerLoaded={this.fnAdsContainerLoaded.bind(this)}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              {ENABLE_BANNER_ADVERTISEMENT && (
                <div
                  id={AD_CONTAINER_ID_PREFIX}
                  className={isMobile ? AD_CLASS_MOBILE : AD_CLASS_DESKTOP}
                  ref="bucket-ad-container-common"
                />
              )}

          {(this.fnFetchMenuItemId(this.props.match.params.category) == 62 || (this.props.match.path == "/" ||this.props.match.path == "/:languagecode")) && (!isMobile)  ?
            <Slider {...settings}>
              <div className="column1">
               <Link key={HOME_EGYPT_SERIES} 
                     to={`/${this.props.locale}/${"egyptian-series"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                  <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/EgyptianSeries.png"} alt="EgyptianSeries"/>
                <div className="lag_rus">مسلسلات مصرية</div>
                <div className="lag_eng">Egyptian Series</div>
               </Link>
              </div>

              {/* <div class="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_MOVIES}
                    to={`/${this.props.locale}/${"khaleeji-series"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/KhilijiSeries.png"} />
                <div className="lag_rus">مسلسلات خليجية</div>
                <div className="lag_eng">Khaleeji Series </div>
               </Link>
              </div> */}
              <div className="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_SERIES} 
                    to={`/${this.props.locale}/${"indian-and-international-series"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/International.png"} />
                <div className="lag_rus">مسلسلات هندية وعالمية </div>
                <div className="lag_eng">Indian and International Series</div>
              </Link>
              </div>  
              <div className="column1">
                <Link key={HOME_EGYPT_SERIES} 
                      to={`/${this.props.locale}/${"egyptain-movies-and-plays"}`}
                      tabIndex={this.props.show ? "0" : "-1"}
                >
                  <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/EgyptianFilmsAndPlays.png"} alt="EgyptianFilmsAndPlays"/>
                <div className="lag_rus">أفلام ومسرحيات مصرية</div>
                <div className="lag_eng">Egyptian Movies and Plays</div>
                </Link>
              </div>
              <div className="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_MOVIES}
                    to={`/${this.props.locale}/${"movies-bollywood-and-international"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/Movies.png"} alt="bollywood"/>
                <div className="lag_rus">أفلام هندية وعالمية</div>
                <div className="lag_eng">Movies Bollywood and International</div>
               </Link>
              </div>  
              <div className="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_MOVIES}
                    to={`/${this.props.locale}/${"shows"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/Programs.png"} alt="programs" />
                <div className="lag_rus">برامج </div>
                <div className="lag_eng">Shows</div>
               </Link>
              </div>  
              <div class="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_MOVIES}
                    to={`/${this.props.locale}/${"roya"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/RoyaTv.png"} />
               </Link>
              </div> 
              <div className="column1">
              <Link key={HOME_RAMADAN} to={`/${this.props.locale}/${"ramadan-2020"}`}>
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/Ramadan2020.png"} />
              </Link>
              </div>
              <div className="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_MOVIES}
                    to={`/${this.props.locale}/${"syrian-and-arabic-series"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/SyrianSeries.png"} alt="SyrianSeries"/>
                <div className="lag_rus">مسلسلات سورية</div>
                <div className="lag_eng">Syrian Series</div>
               </Link>
              </div>
                        
              </Slider>:""}
          {(this.fnFetchMenuItemId(this.props.match.params.category) == 62 || (this.props.match.path == "/" ||this.props.match.path == "/:languagecode")) && (isMobile) ?
            <Slider {...settings}>
              <div className="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_MOVIES}
                    to={`/${this.props.locale}/${"shows"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/Programs.png"} alt="programs" />
                <div className="lag_rus">برامج </div>
                <div className="lag_eng">Shows</div>
               </Link>
              </div> 

              {/* <div class="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_MOVIES}
                    to={`/${this.props.locale}/${"khaleeji-series"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/KhilijiSeries.png"} />
                <div className="lag_rus">مسلسلات خليجية</div>
                <div className="lag_eng">Khaleeji Series </div>
               </Link>
              </div> */}
              <div className="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_MOVIES}
                    to={`/${this.props.locale}/${"movies-bollywood-and-international"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/Movies.png"} alt="bollywood"/>
                <div className="lag_rus">أفلام هندية وعالمية</div>
                <div className="lag_eng">Movies Bollywood and International</div>
               </Link>
              </div> 
              <div className="column1">
                <Link key={HOME_EGYPT_SERIES} 
                      to={`/${this.props.locale}/${"egyptain-movies-and-plays"}`}
                      tabIndex={this.props.show ? "0" : "-1"}
                >
                  <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/EgyptianFilmsAndPlays.png"} alt="EgyptianFilmsAndPlays"/>
                <div className="lag_rus">أفلام ومسرحيات مصرية</div>
                <div className="lag_eng">Egyptian Movies and Plays</div>
                </Link>
              </div>
              <div class="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_MOVIES}
                    to={`/${this.props.locale}/${"roya"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/RoyaTv.png"} />
               </Link>
              </div> 
              <div className="column1">
              <Link key={HOME_RAMADAN} to={`/${this.props.locale}/${"ramadan-2020"}`}>
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/Ramadan2020.png"} />
              </Link>
              </div>
              <div className="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_MOVIES}
                    to={`/${this.props.locale}/${"syrian-and-arabic-series"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/SyrianSeries.png"} alt="SyrianSeries"/>
                <div className="lag_rus">مسلسلات سورية</div>
                <div className="lag_eng">Syrian Series</div>
               </Link>
              </div>  
              <div className="column1">
               <Link key={HOME_EGYPT_SERIES} 
                     to={`/${this.props.locale}/${"egyptian-series"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                  <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/EgyptianSeries.png"} alt="EgyptianSeries"/>
                <div className="lag_rus">مسلسلات مصرية</div>
                <div className="lag_eng">Egyptian Series</div>
               </Link>
              </div>
              <div className="column1">
               <Link key={HOME_INDIA_AND_INTERNATIONAL_SERIES} 
                    to={`/${this.props.locale}/${"indian-and-international-series"}`}
                     tabIndex={this.props.show ? "0" : "-1"}
                >
                <img src={DEFAULT_IMAGE_STATIC_PATH+"/resources/assets/playlist/International.png"} />
                <div className="lag_rus">مسلسلات هندية وعالمية </div>
                <div className="lag_eng">Indian and International Series</div>
              </Link>
              </div>  
                        
              </Slider>:""}
              {aResumableMedias &&
              (this.props.bIsUserSubscribed ||
                common.isMENARegion(this.props.sCountryCode)) ? (
                  <Suspense fallback={<div>Loading...</div>}>
                <BucketItem
                  locale={this.props.locale}
                  title={oResourceBundle.continue_watching}
                  items={aResumableMedias}
                  userResumables={this.props.oUserResumablesObject}
                  rebuildOnUpdate={true}
                /></Suspense>
              ) : null}
              {aPlayListData &&
                aPlayListData.map((ele, i) => {
                  if (i === aPlayListData.length - 1) {
                    this.bucketsRendered();
                  }
                  if (i !== 0 && i % NUMBER_OF_BUCKETS_PER_AD === 0) {
                    return (
                      <div
                        className="bucket-ad-container"
                        key={ele.id}
                        ref="bucket-ad-container"
                      >
                        {ENABLE_BANNER_ADVERTISEMENT && (
                          <div
                            id={AD_CONTAINER_ID_PREFIX}
                            className={
                              isMobile ? AD_CLASS_MOBILE : AD_CLASS_DESKTOP
                            }
                          />
                        )}
                        <Suspense fallback={<div>Loading...</div>}>
                        <BucketItem
                          locale={this.props.locale}
                          title={ele.title}
                          items={ele.content}
                          rebuildOnUpdate={this.bShoulRebuild}
                          delayImage={
                            i >= HOME_BUCKETS_TO_LOAD &&
                            !this.state.drawOffscreenImages
                          }
                        /></Suspense>
                      </div>
                    );
                  } else {
                    return (
                      <Suspense fallback={<div>Loading...</div>}>
                      <BucketItem
                        key={ele.id}
                        locale={this.props.locale}
                        title={ele.title}
                        items={ele.content}
                        rebuildOnUpdate={this.bShoulRebuild}
                        delayImage={
                          i >= HOME_BUCKETS_TO_LOAD &&
                          !this.state.drawOffscreenImages
                        }
                      /></Suspense>
                    );
                  }
                })}
            </React.Fragment>
          )}
        </section>
        {this.props.videoInfoLoading ? <Spinner /> : null}
      </React.Fragment>
    ) : this.state.errorOccured ? (
      <div className="full-error-message">
        {window.navigator.onLine
          ? <Spinner />
          : oResourceBundle.no_internet_connection}
      </div>
    ) : (
      <React.Fragment>
        {oMetaTags}
        <Spinner />
      </React.Fragment>
    );
  }

  /**
   * Component Name - HomeScreen
   * returns if the layout is grid based or carousel based
   * Current assumption is only home screen has carousel layout, and its id is 62
   * @param null
   * @returns {boolean}
   */
  isGrid() {
    const sItemId = this.fnFetchMenuItemId(this.props.match.params.category);
    let isGrid = false;
    if (this.props.oPageContent.data && this.props.oPageContent.data.id) {
      isGrid = this.props.oPageContent.data.type === "VOD" ? true : false;
    } else if (this.props.oPageContent.userPlayList) {
      isGrid = sItemId === MY_PLAYLIST_MENU_ID;
    }
    return isGrid;
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
    oPlanContent: state.oPlanContent,
    oPageContent: state.oPageContent,
    aMenuItems: state.aMenuItems,
    locale: state.locale,
    loading: state.loading,
    videoInfoLoading: state.videoInfoLoading,
    oUserResumablesObject: state.oUserResumablesObject,
    aResumableMedias: state.aResumableMedias,
    loginDetails: state.loginDetails,
    bIsUserSubscribed: state.bIsUserSubscribed,
    sCountryCode: state.sCountryCode,
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
    
    // fnFetchPlanContent: (
    //   sLocale,
    //   sCategoryId,
    //   fnMyPlayListLoginFailure,
    //   apiFailure
    // ) => {
    //   dispatch(
    //     actionTypes.fnFetchPlanContent(planId,0,1000
    //     )
    //   );
    // },

    fnFetchPageContent: (
      sLocale,
      sCategoryId,
      sCountryCode,
      fnMyPlayListLoginFailure,
      apiFailure
    ) => {
      dispatch(
        actionTypes.fnFetchPageContent(
          sLocale,
          sCategoryId,
          sCountryCode,
          fnMyPlayListLoginFailure,
          apiFailure
        )
      );
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
  )(HomeScreen)
);
