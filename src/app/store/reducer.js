/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import * as actionTypes from "./action/actions";

const initialState = { 
  sCode:'',
  locale: "ar",
  loading: true,
  bPageViewSent: false,
  videoInfoLoading: false,
  platformConfig: null,
  aMenuItems: null,
  aStaticMenuItems: null,
  oPageContent: null,
  oBucketVideoInfo: {},
  oVideoDetailContent: null,
  aRelatedVideosWithType: null,
  aUserPlayList: [],
  aRelatedVideos: null,
  videoDetailLoading: true,
  videoInfo: null,
  videoPlaybackState: false,
  playerScreenVisible: false,
  qualityLevels: null,
  relatedVideos: null,
  loginDetails: null,
  oUserResumablesObject: null,
  aResumableMedias: null,
  twitterToken: null,
  twitterAccessToken: null,
  newUserDetails: {},
  forgotPasswordUserDetails: { email: " " },
  userSearchResponseList: [],
  userSearchPageResponse: [],
  oUserAccountDetails: null,
  aLoggedInDevices: [],
  sCountryCode: "",
  isMENARegion: undefined,
  isPremium: undefined,
  bIsUserSubscribed: undefined,
  aCountryList: [],
  aEnglishCountryList: [],
  oPaymentSession: null,
  oEtisalatSession: null,
  oTransactionReference: null,
  sResumePagePath: "",
  aSubscriptionPlans: [],
  oSelectedPlan: null,
  oUserPaymentDetails: null,
  oTokenDetails: null,
  loginToHome: false,
  countryPhoneCodes: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "sCodeUpdate":
      return {
        ...state,
        sCode: action.payload
      };
    case actionTypes.START_LOADER:
      return {
        ...state,
        loading: true
      };
    case actionTypes.STOP_LOADER:
      return {
        ...state,
        loading: false
      };
    case actionTypes.PAGEVIEW_SENT:
      return {
        ...state,
        bPageViewSent: true
      };
    case actionTypes.START_VIDEO_INFO_LOADER:
      return {
        ...state,
        videoInfoLoading: true
      };
    case actionTypes.STOP_VIDEO_INFO_LOADER:
      return {
        ...state,
        videoInfoLoading: false
      };

    case actionTypes.START_VIDEO_DETAIL_LOADER:
      return {
        ...state,
        videoDetailLoading: true,
        loading: true
      };
    case actionTypes.STOP_VIDEO_DETAIL_LOADER:
      return {
        ...state,
        videoDetailLoading: false,
        loading: false
      };
    case actionTypes.CHANGE_DIRECTION:
      return {
        ...state,
        locale: action.payload
      };

    case actionTypes.UPDATE_PLATFORM_CONFIG:
      return {
        ...state,
        platformConfig: action.payload.oPlatformConfig,
        locale: action.payload.sLanguageCode
      };

    case actionTypes.UPDATE_MENU_ITEMS:
      return {
        ...state,
        aMenuItems: action.payload.aMenuItems,
        aStaticMenuItems: action.payload.aStaticMenuItems
      };
    case actionTypes.UPDATE_PAGE_CONTENT:
      return {
        ...state,
        oPageContent: {
          ...action.payload,
          userPlayList: null
        },
        loading: false
      };
    case actionTypes.DISPLAY_PLAN_CONTENT:
    
      
      if(state.oPlanContent){
        state.oPlanContent.data.data.map((item)=>{
          // action.payload.data.data.push(item);
        })
      }
        return {
          ...state,
          oPlanContent: {
            ...action.payload,
          },
          
          loading: false
        };
    case actionTypes.UPDATE_USER_PLAYLIST_PAGE_CONTENT:
      return {
        ...state,
        oPageContent: {
          ...state.oPageContent,
          data: null,
          userPlayList: action.payload
        },
        loading: false
      };

    case actionTypes.UPDATE_RESUMABLE_CONTENT:
      return {
        ...state,
        oUserResumablesObject: action.payload.oUserResumablesObject,
        aResumableMedias: action.payload.aResumableMedias
      };
    case actionTypes.UPDATE_BUCKET_ITEM_VIDEO_INFO:
      return {
        ...state,
        videoInfoLoading: false,
        oBucketVideoInfo: {
          ...state.oBucketVideoInfo,
          [action.payload.sBucketTitle]: action.payload.oVideoContent
        }
      };
    case actionTypes.UPDATE_VIDEO_ITEM_VIDEO_CONTENT:
    return {
        ...state,
        oVideoDetailContent: action.payload.oVideoContent,
        aRelatedVideos: action.payload.aRelatedVideos,
        aRelatedVideosWithType: action.payload.aRelatedVideosWithType,
        aUserPlayList: action.payload.aUserPlayList,
        videoDetailLoading: false,
        loading: false
      };
    case actionTypes.UPDATE_ITEM_VIDEO_INFO:
      return {
        ...state,
        videoInfo: action.payload.videoInfo,
        loading: false
      };
    case actionTypes.UPDATE_VIDEO_PLAYBACK_STATE:
      return {
        ...state,
        videoPlaybackState: action.payload.videoPlaybackState
      };
    case actionTypes.UPDATE_PLAYER_SCREEN_STATE:
      return {
        ...state,
        playerScreenVisible: action.payload.playerScreenVisible
      };
    case actionTypes.UPDATE_VIDEO_QUALITY_LEVELS:
      return {
        ...state,
        qualityLevels: action.payload.qualityLevels
      };
    case actionTypes.UPDATE_RELATED_VIDEOS:
      return {
        ...state,
        relatedVideos: action.payload.relatedVideos
      };
    case actionTypes.UPDATE_LOGIN_INFO:
      return {
        ...state,
        loginDetails: action.payload
      };
    case actionTypes.GET_TWITTER_TOKEN:
      return {
        ...state,
        twitterToken: action.payload
      };
    case actionTypes.GET_TWITTER_ACCESS_TOKEN:
      return {
        ...state,
        twitterAccessToken: action.payload
      };
    case actionTypes.UPDATE_LOG_OUT_INFO:
      return {
        ...state,
        loginDetails: action.payload
      };
    case actionTypes.SAVE_NEW_USER_INFO:
      return {
        ...state,
        newUserDetails: action.payload
      };
    case actionTypes.UPDATE_FACEBOOK_LOGIN_INFO:
      return {
        ...state,
        loginDetails: action.payload
      };
    case actionTypes.UPDATE_USER_PLAYLIST:
      return {
        ...state,
        aUserPlayList: action.payload,
        videoDetailLoading: false,
        loading: false
      };
    case actionTypes.UPDATE_ITEM_RATING:
      const newState = { ...state };
      newState.oVideoDetailContent = { ...state.oVideoDetailContent };
      newState.oVideoDetailContent.data = {
        ...state.oVideoDetailContent.data
      };
      newState.oVideoDetailContent.data.averageRating =
        action.payload.iUserRating;
      //newState.oVideoDetailContent.data.userRating = action.payload.iUserRating;
      return newState;
    case actionTypes.GET_FORGOT_PASSWORD_USER_DETAILS:
      return {
        ...state,
        forgotPasswordUserDetails: action.payload
      };
    case actionTypes.USER_SEARCH_RESPONSE:
      return {
        ...state,
        userSearchResponseList: action.payload.bUpdateSearchInput
          ? action.payload.userSearchResponseList.slice(0, 10)
          : [],
        userSearchPageResponse: !action.payload.bUpdateSearchInput
          ? action.payload.userSearchResponseList
          : state.userSearchPageResponse
      };
    case actionTypes.CLEAR_USER_SEARCH_RESPONSE:
      return {
        ...state,
        userSearchResponseList: action.payload
      };
    case actionTypes.UPDATE_USER_DETAILS:
      return {
        ...state,
        oUserAccountDetails: action.payload
      };
    case actionTypes.UPDATE_LOGGED_IN_DEVICES:
      return {
        ...state,
        aLoggedInDevices: action.payload
      };
    case actionTypes.UPDATE_COUNTRY_CODE:
      return {
        ...state,
        sCountryCode: action.payload.sCountryCode,
        isMENARegion: action.payload.isMENARegion,
        isPremium: action.payload.isPremium
      };
    case actionTypes.UPDATE_COUNTRY_LIST:
      return {
        ...state,
        aCountryList: action.payload
      };
    case actionTypes.UPDATE_ENGLISH_COUNTRY_LIST:
      return {
        ...state,
        aEnglishCountryList: action.payload
      };
    case actionTypes.UPDATE_PAYMENT_SESSION:
      return {
        ...state,
        oPaymentSession: action.payload
      };
    case actionTypes.UPDATE_ETISALAT_SESSION:
      return {
        ...state,
        oEtisalatSession: action.payload
      };
    case actionTypes.UPDATE_TPAY_SESSION:
      return {
        ...state,
        oTpaySession: action.payload
      };

    case actionTypes.UPDATE_INFO_SESSION:
        return {
          ...state,
          oInfoSession: action.payload
        };
    
    case actionTypes.UPDATE_TELUS_SESSION:
        return {
          ...state,
          oTelusSession: action.payload
        };
    case actionTypes.UPDATE_TRNSACTION_REFERENCE:
      return {
        ...state,
        oTransactionReference: action.payload
      };
    case actionTypes.UPDATE_RESUME_PAGE:
      return {
        ...state,
        sResumePagePath: action.payload
      };
    case actionTypes.UPDATE_SUBSCRIPTON_PLANS:
      return {
        ...state,
        aSubscriptionPlans: action.payload
      };
    case actionTypes.UPDATE_USER_SUBSCRIPTON:
      return {
        ...state,
        bIsUserSubscribed: action.payload
      };
    case actionTypes.UPDATE_SELECTED_PLAN:
      return {
        ...state,
        oSelectedPlan: action.payload
      };
    case actionTypes.UPDATE_USER_PAYMENT_DETAILS:
      return {
        ...state,
        oUserPaymentDetails: { ...action.payload }
      };
    case actionTypes.UPDATE_USER_TOKEN:
      return {
        ...state,
        oTokenDetails: { ...action.payload }
      };
    case actionTypes.LOGIN_TO_HOME:
      return {
        ...state,
        loginToHome: { ...action.payload }
      };
    case actionTypes.UPDATE_COUNTRY_PHONE_CODE:
      return {
        ...state,
        countryPhoneCodes: { ...action.payload }
      };
    default:
      return state;
  }
};

export default reducer;
