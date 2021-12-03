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
  HOME_BUCKETS_TO_LOAD,
  COOKIE_USER_TOKEN
} from "app/AppConfig/constants";
import { ENABLE_BANNER_ADVERTISEMENT } from "app/AppConfig/features";
import BucketItemList from "app/views/components/BucketItemList";
import Spinner from "core/components/Spinner";
import HandlerContext from "app/views/Context/HandlerContext";
import Grid from "app/views/components/Grid";
import SmartTVLayout from "app/views/components/SmartTVLayout";
import SmartTVBanner from "app/views/components/SmartTVBanner";
import * as common from "app/utility/common";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import Logger from "core/Logger";
import { isMobile } from "react-device-detect";
import  DisplayPlanList from './DisplayPlanList';


import "./index.scss";
import { stat } from "fs";

const MODULE_NAME = "VideoList";
class VideoList extends BaseContainer {
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
    this.setState({cload:false});
    this.handleScroll = this.handleScroll.bind(this);
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
    const that = this;
   //console.log("mOUNTED"+JSON.stringify(this.props));
   window.addEventListener("scroll", this.handleScroll);
   var urlParams = window.location.href;  
   let planInfo =urlParams.split("=");   
   let planId =planInfo[1];
    this.props.fnFetchPlanContent(planId,0,50);
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
     
   
      
      // this.props.fnFetchPlanContent(
      //   this.props.locale,
      //   sCategoryId,
      //   this.fnMyPlayListLoginFailure.bind(this),
      //   this.apiFailure.bind(this),
      //   planId
      // );
      this.componentLoaded = true;
     
    }
    //var urlParams =  this.props.location.pathname;
    //let planInfo =urlParams.split("=");   
    //let planId =planInfo[1];
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
 
  // static getDerivedStateFromProps(props, state,dispatch) {
  //   window.onscroll = function() {
  //     if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) { 
     
  //      // if(this.props){
  //         // console.log(12);
  //         // const paginationData =this.props.oPlanContent.data.pagination;
  //         // const size = paginationData.size;
  //         // const offset = paginationData.limit;
  //         // console.log(size)    
  //         //     console.log(1);
  //         //     var urlParams = window.location.href;  
  //         //     let planInfo =urlParams.split("=");   
  //         //     let planId =planInfo[1];
  //              console.log(1);
  //           // dispatch(actionTypes.fnFetchPlanContent(1,10,10));
            
    
  //     //}
  //   }else{
  //       console.log('2');
  //     }
  // }; 
  
  // }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    window.removeEventListener(
      "orientationchange",
      this.updateWindowOrientation
    );
    window.removeEventListener("scroll", this.onScroll);
    clearTimeout(this.lazyLoadTimer);
    window.removeEventListener("scroll", this.handleScroll);
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
    const languageCode = this.props.match.params.languagecode;
   
    if (
      this.props.aMenuItems &&
      !this.props.oPageContent &&
      !this.componentLoaded
    ) {
      if (!sCategoryId) {
        sCategoryId = this.props.aMenuItems.data[0].id;
      }
     
    
      this.componentLoaded = true;
    } else if (this.props.loginDetails !== prevProps.loginDetails) {
      if (!sCategoryId) {
        sCategoryId = this.props.aMenuItems.data[0].id;
      }
     
    } else if (
      prevProps.match.params.category !== this.props.match.params.category
    ) {
      if (!sCategoryId) {
        sCategoryId = this.props.aMenuItems.data[0].id;
      }

      this.context.onOverlayClick();
     
      this.bAdSignalDataSent = false;
    } else if (
      prevProps.locale !== this.props.locale &&
      this.props.oPageContent
    ) {
      if (!sCategoryId) sCategoryId = this.props.oPageContent.data.id;
      this.context.onOverlayClick();
    
      this.bAdSignalDataSent = false;
    } else if (
      this.props.aMenuItems &&
      !sCategoryId &&
      languageCode &&
      this.context.fnGetLogoClickedState()
    ) {
      sCategoryId = this.props.aMenuItems.data[0].id;
     
      this.context.fnLogoClickedStateChange(false);
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


  handleScroll() {
    if(this.props.oPlanContent){
    let start = this.props.oPlanContent.data.pagination.offset+this.props.oPlanContent.data.pagination.limit;
    let total = this.props.oPlanContent.data.pagination.size;
    console.log(total);
    const that=this;
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.setState({
        message:'bottom reached'
      });
      console.log('reaced bottom');
      var urlParams = window.location.href;  
      let planInfo =urlParams.split("=");   
      let planId =planInfo[1];
      if(start<total)
        that.props.fnFetchPlanContent(planId,start,50)
    } else {
      this.setState({
        message:'not at bottom'
      });
    }
  }
  }

  /**
   * Component Name - HomeScreen
   * Render method
   */
  render() {
    
    let aPlayListData = null;
    let aUserMyPlayListData = null;
    let oFeaturePlayList = null;
    const aResumableMedias = this.props.aResumableMedias;    
    const dataImages = this.props.oPlanContent;  
    let gridItems;
    let oMetaTags, seoTitle, description;
 

    return (
      <React.Fragment>    
        
      {dataImages? (
        
      <DisplayPlanList dataImages={dataImages.data} pagination = {dataImages.pagination}/>
      ):<div></div>}      
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
  var urlParams = window.location.href;  
  let planInfo =urlParams.split("=");   
  let planId =planInfo[1];
  return {
    fnFetchPlanContent: (planid,start,limit
    ) => {
      dispatch(
        actionTypes.fnFetchPlanContent(planId,start,limit
        )
      );
    },
    fnPageViewSent: () => {
      dispatch(actionTypes.fnPageViewSent());
    }
  };
};

export default 
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VideoList)

