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
  AD_MOBILE_CONTAINER_ID_PREFIX,
  AD_MOBILE_SLOTID,
  AD_MOBILE_SIZE,
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
  DEFAULT_IMAGE_STATIC_PATH,
  ACTIVE_PLAN_TEXT
} from "app/AppConfig/constants";
import { QA_API, UAT_API, ENABLE_BANNER_ADVERTISEMENT } from "app/AppConfig/features";

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
import { CleverTap_UserEvents } from 'core/CleverTap'
import { Link } from "react-router-dom";
import "./index.scss";
import Slider from "react-slick";
import { store } from "app/App";
import DefaultImage from "../../../resources/assets/playlist/square_placeholder.png"

const BucketItem = React.lazy(() => import("app/views/components/BucketItem"));

const MODULE_NAME = "HomeScreen";
class HomeScreen extends BaseContainer {
  state = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    drawOffscreenImages: false,
    //HomePage:false
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
    this.AdsContainer = '';
    // common.getUid();
  }
  reRender = () => {
    // calling the forceUpdate() method
    this.forceUpdate();
  };

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
   async componentDidMount() {
    Logger.log(MODULE_NAME, "componentDidMount: " + this.bAdSignalDataSent);
   this.loadBannerAds();
    
    //This ensures mount phase service call count
    this.componentLoaded = false;
    this.bAdSignalDataSent = false;
    //Load item when navigating from other pages
    let sCategoryId = this.fnFetchMenuItemId(this.props.match.params.category);
    const oUserToken = JSON.parse(common.getServerCookie(COOKIE_USER_TOKEN));
    // let  oUserToken = null;
    //   common.getServerCookie(COOKIE_USER_TOKEN).then(function(token){
    //     oUserToken=token;
    //   });
    common.getUid();

    this.props.fnFetchMenuItems(this.props.locale);
    this.props.fnGetuserPlaylistData("home");

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

      this.setState({
        sCategoryId
      })


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


    if(common.isUserLoggedIn()){

        let activePlans = [];
    
        const allPlans = await common.userSubscriptionPlan(true, this.props.locale);
    
        for (let plan of allPlans) {
          if (plan.state === ACTIVE_PLAN_TEXT) {
            activePlans.push(plan);
          }
        }

        let subscribedUser = sessionStorage.getItem("subscribedUser") ? true : false
        let notSubscribedUser = sessionStorage.getItem("notSubscribedUser") ? true : false

        let userData = {}
            userData.userId = common.getUserId()

        if(activePlans && activePlans[0] && activePlans[0].recurring_enabled && !subscribedUser){
           CleverTap_UserEvents("ProfileEvent", userData) 
           sessionStorage.setItem("subscribedUser",1)
           sessionStorage.removeItem("notSubscribedUser")
        }else{
          if(activePlans && !activePlans[0]){
            if(!notSubscribedUser){
              CleverTap_UserEvents("ProfileEvent", userData) 
              sessionStorage.setItem("notSubscribedUser",1)
              sessionStorage.removeItem("subscribedUser")
            }
           }
        }
  
    }

  }

  componentWillUnmount() {
    common.unloadBannerAds();

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
      super.setSignalData({}, {}, this.props.locale, this.props.sCountryCode, common.getUserId(), common.uuidv4(), this.props.bPageViewSent);
      setTimeout(() => this.props.fnPageViewSent(), 0);
    }
  }
  loadBannerAds(){
    console.log("home screen only",store.getState().platformConfig.default["1.0"].Home_Ad_Unit_Id)
    if(isMobile){
      common.loadBannerAds();
      this.AdsContainer = AD_CONTAINER_ID_PREFIX;
    }
    else{

      this.AdsContainer =store.getState().platformConfig.default["1.0"].Home_Ad_Container_Id?
                         store.getState().platformConfig.default["1.0"].Home_Ad_Container_Id: 'div-gpt-ad-1638357369884-0' ;

      let slotID = store.getState().platformConfig.default["1.0"].Home_Ad_Unit_Id?
                   store.getState().platformConfig.default["1.0"].Home_Ad_Unit_Id: '/77688724/Weyyak_Banner_Ads_Web';
          
      common.loadBannerAds( this.AdsContainer, slotID ,[728,90])
    }

  }
  /**
   * Component Name - HomeScreen
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    let bContainerID=  this.AdsContainer 
    let BannersLoaded = document.getElementById(bContainerID) && document.getElementById(bContainerID).innerHTML?true:false;
    if(prevProps.location.pathname!=this.props.location.pathname || !BannersLoaded ){
      common.unloadBannerAds();
      this.loadBannerAds();
      this.pageName = this.props.location.pathname;
    }
     
    Logger.log(MODULE_NAME, "componentDidUpdate: " + this.bAdSignalDataSent);
    //let sCategoryId = this.props.match.params.id;
    let sCategoryId = this.fnFetchMenuItemId(this.props.match.params.category);
    let sCountryCode = this.props.match.params.countrycode;
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

    if (this.props.oPageContent) {
      let title = this.props.oPageContent.data ? this.props.oPageContent.data.title : "my playlist"
      common.setGenerealCookie("page_name", title)
    }

  }

  fnAdsContainerLoaded() {
    Logger.log(MODULE_NAME, "fnAdsContainerLoaded: " + this.bAdSignalDataSent);
    if (this.props.oPageContent && !this.bAdSignalDataSent) {
      this.bAdSignalDataSent = true;
      super.setSignalData({}, {}, this.props.locale, this.props.sCountryCode, common.getUserId(), common.uuidv4(), this.props.bPageViewSent);
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

  itemDeleted = (prepItems) => {
    this.props.fnFetchResumableItems(
      prepItems,
      this.props.locale
    )

  }


  fnRenderThumbnailImages(item, DeviceOriented) {
    if (item.imagery[DeviceOriented]) {
      return item.imagery[DeviceOriented]
    } else {
      switch (item.id) {
        case 113:
          return DEFAULT_IMAGE_STATIC_PATH + "/resources/assets/playlist/Ramadan2020.png"
          break;
        case 114:
          return DEFAULT_IMAGE_STATIC_PATH + "/resources/assets/playlist/Programs.png"
          break;
        case 115:
          return DEFAULT_IMAGE_STATIC_PATH + "/resources/assets/playlist/International.png"
          break;
        case 116:
          return DEFAULT_IMAGE_STATIC_PATH + "/resources/assets/playlist/EgyptianSeries.png"
          break;
        case 117:
          return DEFAULT_IMAGE_STATIC_PATH + "/resources/assets/playlist/EgyptianFilmsAndPlays.png"
          break;
        case 118:
          return DEFAULT_IMAGE_STATIC_PATH + "/resources/assets/playlist/SyrianSeries.png"
          break;
        case 119:
          return DEFAULT_IMAGE_STATIC_PATH + "/resources/assets/playlist/Movies.png"
          break;
        case 122:
          return DEFAULT_IMAGE_STATIC_PATH + "/resources/assets/playlist/RoyaTv.png"
          break;
        case 124:
          return DEFAULT_IMAGE_STATIC_PATH + "/resources/assets/playlist/KhilijiSeries.png"
          break;
        default:
          return DefaultImage
          break;
      }
    }
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
    let oUserResumablesObject = this.props.oUserResumablesObject

    let gridItems;
    let oMetaTags, seoTitle, description;
    let GoogleAdsContainer =this.AdsContainer;
    
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
        // this.setState({
        //   HomePage:true
        // });
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

    let FilterData = ""

    if (this.props.aMenuItems) {
      FilterData = this.props.aMenuItems.data.filter((el) => {
        if (el.title == "Home" || el.title == "My Playlist" || el.title == "Premium" || el.title == "الصفحة الرئيسية" || el.title == "قائمتي" || el.title == "الباقة المميزة") {
          return false
        } else {
          return true
        }
      })

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
          <div>
          <h1 className="pageTitle">{this.props.oPageContent.data.title}</h1>
          {/* <h1>{this.props.oPageContent.title}</h1> */}
        <SmartTVBanner
          playListData={oFeaturePlayList.playlists}
          locale={this.props.locale}
          imageType={"mobile_img"}
          showfallPosterImage={true}
        />
        </div>

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
                // <div
                //   id={AD_CONTAINER_ID_PREFIX}
                //   className={isMobile ? AD_CLASS_MOBILE : AD_CLASS_DESKTOP}
                //   ref="bucket-ad-container-common"
                // />
                <div
                   id={GoogleAdsContainer}
                   style={{"text-align": "center", "margin": "20px auto"}}
                   className={isMobile ? AD_CLASS_MOBILE : AD_CLASS_DESKTOP}
 
                    />
              )}
              {/* Side menu Items for Desktop */}
              {(this.fnFetchMenuItemId(this.props.match.params.category) == 62 || (this.props.match.path == "/" || this.props.match.path == "/:languagecode")) && (!isMobile) ?
                <Slider {...settings}>
                  {
                    FilterData && FilterData.map((item) => {
                      return <div className="column1">
                        <Link key={item.id}
                          to={`${item.friendly_url}`}
                          tabIndex={this.props.show ? "0" : "-1"}
                        >
                          <img src={this.fnRenderThumbnailImages(item, "menu-poster-image")} />
                          <div className="lag_rus">{item.title}</div>
                          <div className="lag_eng">{item.title}</div>
                        </Link>
                      </div>
                    })
                  }

                </Slider>
                : ""}
              {/* Side menu Items for mobile */}
              {(this.fnFetchMenuItemId(this.props.match.params.category) == 62 || (this.props.match.path == "/" || this.props.match.path == "/:languagecode")) && (isMobile) ?
                <Slider {...settings}>
                  {
                    FilterData && FilterData.map((item) => {
                      return <div className="column1">
                        <Link key={item.id}
                          to={`${item.friendly_url}`}
                          tabIndex={this.props.show ? "0" : "-1"}
                        >
                          <img src={this.fnRenderThumbnailImages(item, "mobile-menu-poster-image")} />
                          <div className="lag_rus">{item.title}</div>
                          <div className="lag_eng">{item.title}</div>
                        </Link>
                      </div>
                    })
                  }
                </Slider> : ""}
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
                          // <div
                          //   id={AD_CONTAINER_ID_PREFIX}
                          //   className={
                          //     isMobile ? AD_CLASS_MOBILE : AD_CLASS_DESKTOP
                          //   }
                          // />
                          <div
                            id={AD_MOBILE_CONTAINER_ID_PREFIX}
                            style={{"text-align": "center", "margin": "20px auto"}}
                            className={isMobile ? AD_CLASS_MOBILE : AD_CLASS_DESKTOP}
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
                    let itemIndex =  1
                    // let itemIndex = QA_API ? 2 : 1
                    return (
                      <>
                        {/*Continue watching carousel */}
                        {i == itemIndex && aResumableMedias &&
                          (this.props.bIsUserSubscribed ||
                            common.isMENARegion(this.props.sCountryCode)) ? (
                          <Suspense fallback={<div>Loading...</div>}>
                            <div class="Continue_watching">
                              <BucketItem
                                locale={this.props.locale}
                                title={oResourceBundle.continue_watching}
                                items={aResumableMedias}
                                userResumables={oUserResumablesObject}
                                rebuildOnUpdate={true}
                                itemDeleted={this.itemDeleted}
                              />
                            </div>
                          </Suspense>
                        ) : null}
                        {/*Normal carousel */}
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
                      </>
                    );
                  }

                  // }
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
    fnFetchResumableItems: (
      prepItems,
      sLocale
    ) => {
      dispatch(
        actionTypes.fnFetchResumableItems(
          prepItems,
          sLocale
        )
      );
    },
    fnFetchMenuItems: (sLanguageCode) => {
      dispatch(actionTypes.fnFetchMenuItems(sLanguageCode));
    },
    fnPageViewSent: () => {
      dispatch(actionTypes.fnPageViewSent());
    },
    fnGetuserPlaylistData: (page) => {
      dispatch(actionTypes.fnGetUserPlayListData(page));
    },
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomeScreen)
);
