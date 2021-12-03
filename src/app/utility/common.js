/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

/* This file contains all the common utility functions */

import * as CONSTANTS from "app/AppConfig/constants";
import {
  FORCE_MENA_REGION,
  ENABLE_SUBSCRIPTION,
  FORCE_ALPHANUMERIC_PASSWORD
} from "app/AppConfig/features";
import oResourceBundle from "app/i18n/";
import {getUserLocale} from "get-user-locale";
import {
  fnSubscriptionEntitlement,
  fnUpdateUserSubscription,
  fnUpdateResumePagePath
} from "app/store/action/";
import * as actionTypes from "app/store/action/actions";
import {store} from "app/App";
import {toast} from "core/components/Toaster/";
import trialBannerInsideArLandscape from "app/resources/assets/thumbnail/subscription-banner-inside-ar-landscape.jpg";
//import trialBannerInsideArSquare from "app/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg";
//import trialBannerInsideEnLandscape from "app/resources/assets/thumbnail/subscription-banner-inside-en-landscape.jpg";
import trialBannerInsideEnSquare from "app/resources/assets/thumbnail/subscription-banner-inside-en-square.jpg";
//import trialBannerOutsideArLandscape from "app/resources/assets/thumbnail/subscription-banner-outside-ar-landscape.jpg";
//import trialBannerOutsideArSquare from "app/resources/assets/thumbnail/subscription-banner-outside-ar-square.jpg";
//import trialBannerOutsideEnLandscape from "app/resources/assets/thumbnail/subscription-banner-outside-en-landscape.jpg";
//import trialBannerOutsideEnSquare from "app/resources/assets/thumbnail/subscription-banner-outside-en-square.jpg";
//import { PLANS_DESCRIPTION } from "../Routes/RouteNames";

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const {getName} = require("country-list");
const CountryCodes = require("country-code-info");

let lastSubscriptionFetch = new Date();
lastSubscriptionFetch.setDate(lastSubscriptionFetch.getDate() - 1);

export function secondsToHms(seconds) {
  seconds = Number(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hDisplay = h > 0 ? h + (h === 1 ? "h " : "h ") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? "min " : "min ") : "";
  const sDisplay = h === 0 && s > 0 ? s + (s === 1 ? "sec" : "sec") : "";
  return hDisplay + mDisplay + sDisplay;
}

export function getLocale() {
  return getUserLocale();
}

export function getBillingText(billingFrequency, billingCycle) {
  switch (billingCycle) {
    case "DAY":
      return billingFrequency > 1 ? oResourceBundle.days : oResourceBundle.day;
    // case "MONTH":
    //   return billingFrequency > 1 ? oResourceBundle.days : oResourceBundle.month;
    //   break;
    default:
      return billingFrequency > 1 ? oResourceBundle.days : oResourceBundle.day;
  }
}

export function getBillingFrequency(billingFrequency) {
  switch (billingFrequency) {
    case CONSTANTS.MONTHLY_PLAN_DAYS:
      return "Monthly";
    case CONSTANTS.WEEKLY_PLAN_DAYS:
      return "Weekly";
    default:
      return "";
  }
}

export function getTrialBannerData(imageType, isMENARegion, locale) {
  let imageUrl;
  if (isMENARegion) {
    if (locale === "en") {
      switch (imageType) {
        case CONSTANTS.TRIAL_BANNER_LANDSCAPE:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-inside-en-landscape.jpg';//trialBannerInsideEnLandscape;
          break;
        case CONSTANTS.TRIAL_BANNER_SQUARE:
          imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-inside-en-square.jpg';//trialBannerInsideEnSquare;
          break;
        default:
          imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-inside-en-square.jpg';//trialBannerInsideEnSquare;
      }
    } else {
      switch (imageType) {
        case CONSTANTS.TRIAL_BANNER_LANDSCAPE:
          // imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg';//trialBannerInsideArLandscape;
          imageUrl = trialBannerInsideArLandscape
          break;
        case CONSTANTS.TRIAL_BANNER_SQUARE:
          imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg';///trialBannerInsideArSquare;
          break;
        default:
          imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg';//trialBannerInsideArSquare;
      }
    }
  } else {
    if (locale === "en") {
      switch (imageType) {
        case CONSTANTS.TRIAL_BANNER_LANDSCAPE:
          imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-outside-en-landscape.jpg';//trialBannerOutsideEnLandscape;
          break;
        case CONSTANTS.TRIAL_BANNER_SQUARE:
          imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-outside-en-square.jpg';//trialBannerOutsideEnSquare;
          break;
        default:
          imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-outside-en-square.jpg';//trialBannerOutsideEnSquare;
      }
    } else {
      switch (imageType) {
        case CONSTANTS.TRIAL_BANNER_LANDSCAPE:
          imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-outside-ar-landscape.jpg';//trialBannerOutsideArLandscape;
          break;
        case CONSTANTS.TRIAL_BANNER_SQUARE:
          imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-outside-ar-square.jpg';//trialBannerOutsideArSquare;
          break;
        default:
          imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-outside-ar-square.jpg';//trialBannerOutsideArSquare;
      }
    }
  }
  const trialBanner = {
    content_type: CONSTANTS.SUBSCRIPTION_BANNER_CONTENT_TYPE,
    title: CONSTANTS.SUBSCRIPTION_BANNER_CONTENT_TYPE,
    id: CONSTANTS.SUBSCRIPTION_BANNER_CONTENT_TYPE,
    thumbnail: imageUrl,
    imagery: {
      thumbnail: imageUrl,
      mobile_img: imageUrl
    }
  };
  return trialBanner;
}

export function isGeoBlocked(countryCode = "") {
  return (
    CONSTANTS.GEO_BLOCK_COUNTRIES.indexOf(countryCode.toUpperCase()) !== -1
  );
}

export function getCountryName(countryCode) {
  return getName(countryCode);
}

export function getCountryFromDial(countryDialCode) {
  return CountryCodes.findCountry({dial: countryDialCode});
}

export function getCountryFromCode(countryCode) {
  return CountryCodes.findCountry({a2: countryCode});
}

export function getCountryFromFullName(countryName) {
  return CountryCodes.findCountry({name: countryName});
}

export function getRawNumber(phoneNumber) {
  const regex = /[ ]|[-]/gi;
  return phoneNumber.replace(regex, "");
}

export function getCountryCodeFromNumber(number) {
  try {
    const phone = phoneUtil.parse(number);
    return "+" + phone.getCountryCode();
  } catch (ex) {
    return "";
  }
}

export async function redirectAfterLogin() {
  if (this.props.loginToHome) {
    this.props.history.push(`/${this.props.locale}`);
  } else {
    const isUserEntitled = await isUserSubscribed();
    let sResumePath = getCookie(CONSTANTS.COOKIE_GO_TO_SUBSCRIBE);
    deleteCookie(CONSTANTS.COOKIE_GO_TO_SUBSCRIBE);
    if (sResumePath) {
      if (isUserEntitled) {
        this.props.history.push(`/${this.props.locale}`);
      } else {
        this.props.history.push(`/${this.props.locale}/${CONSTANTS.PLANS_DESCRIPTION}`);
        return;
      }
    }
    sResumePath = getCookie(CONSTANTS.COOKIE_VIDEO_RESUME_OBJECT);
    try {
      deleteCookie(CONSTANTS.COOKIE_VIDEO_RESUME_OBJECT);
      if (sResumePath) {
        console.log("sResumepath working")
        const videoObject = JSON.parse(sResumePath);
        const sNextPath = getNavigationPathForPremiumContent(
          videoObject.premiumType,
          videoObject.rightsType,
          videoObject.locale,
          videoObject.videoPath,
        );
        sNextPath.then(sPath => {
          if (sPath) {
            fnUpdateResumePagePath(videoObject.videoPath);
            fnNavTo.call(this, sPath);
          }
        });
        return;
      }
    } catch (e) {}
    sResumePath = getCookie(CONSTANTS.RESUME_PATH_COOKIE_NAME);
    deleteCookie(CONSTANTS.RESUME_PATH_COOKIE_NAME);
    if (sResumePath) {
      this.props.history.push(sResumePath);
    } else {
      this.props.history.push(`/${this.props.locale}`);
    }
  }
}

export function getUserIdentifier() {
  const userDetails =
    getCookie(CONSTANTS.COOKIE_USER_OBJECT) !== null
      ? JSON.parse(getCookie(CONSTANTS.COOKIE_USER_OBJECT))
      : null;
  let userIdentifier = "";
  if (userDetails) {
    if (userDetails.firstName) {
      userIdentifier = userDetails.firstName;
      if (userDetails.lastName) {
        userIdentifier += " " + userDetails.lastName;
      }
    } else {
      if (userDetails.email) {
        userIdentifier = userDetails.email;
      } else if (userDetails.phoneNumber) {
        userIdentifier = userDetails.phoneNumber;
      }
    }
  }
  return userIdentifier;
}
export function getAdType(podIndex) {
  switch (podIndex) {
    case -1:
      return CONSTANTS.AD_TYPE_POSTROLL;
    case 0:
      return CONSTANTS.AD_TYPE_PREROLL;
    default:
      return CONSTANTS.AD_TYPE_MIDROLL;
  }
}

export function fnCheckValidPassword(sPassword = "") {
  if (FORCE_ALPHANUMERIC_PASSWORD) {
    return (
      sPassword.length >= CONSTANTS.PASSWORD_VALIDATION_CONTENT_LENGTH &&
      containsAlphabets(sPassword) &&
      containsNumerals(sPassword)
    );
  }
  return sPassword.length >= CONSTANTS.PASSWORD_VALIDATION_CONTENT_LENGTH;
}

export function parseArabic(str) {
  return Number(
    str
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function(d) {
        return d.charCodeAt(0) - 1632; // Convert Arabic numbers
      })
      .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function(d) {
        return d.charCodeAt(0) - 1776; // Convert Persian numbers
      })
  );
}

export function isValidPhone(number, countryCode) {
  try {
    const phone = countryCode
      ? phoneUtil.parse(number, countryCode)
      : phoneUtil.parse(number);
    return number.length > 5 && phoneUtil.isValidNumber(phone);
  } catch (ex) {
    return false;
  }
}

export function isValidEmail(email = "") {
  const regex = CONSTANTS.EMAIL_VALIDATION_REGEX;
  return regex.test(email);
}
export function containsAlphabets(text) {
  const alpha = /[a-z]/i;
  return alpha.test(text);
}

export function containsNumerals(text) {
  const numeric = /\d/;
  return text.match(numeric) !== null;
}

export function extractNumber(text) {
  return text.replace(/\D/g, "");
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getFeaturePlayListType(sType) {
  if (!sType) sType = "";
  let sPlayListType = "";
  if (sType.toLowerCase().indexOf("layout a") > -1) {
    sPlayListType = "A";
  } else if (sType.toLowerCase().indexOf("layout b") > -1) {
    sPlayListType = "B";
  } else if (sType.toLowerCase().indexOf("layout c") > -1) {
    sPlayListType = "C";
  } else {
    sPlayListType = "B";
  }
  return sPlayListType;
}

export function enterFullScreen(element) {
  if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
    return true;
  } else if (element.requestFullscreen) {
    element.requestFullscreen();
    return true;
  } else {
    return false;
  }
}

export function exitFullscreen() {
  if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
    return true;
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
    return true;
  } else {
    return false;
  }
}

export function isIE() {
  return (
    !!navigator.userAgent.match(/Trident/g) ||
    !!navigator.userAgent.match(/MSIE/g)
  );
}

export function getDirection(locale) {
  switch (locale) {
    case "ar":
    case "arc":
    case "dv":
    case "fa":
    case "ha":
    case "he":
    case "khw":
    case "ks":
    case "ku":
    case "ps":
    case "ur":
    case "yi":
      return "rtl";
    default:
      return "ltr";
  }
}

/**
 * Function to help override similar toasts
 */
export function showToast(id, message, position) {
  if (toast.isActive(id)) {
    toast.update(id, {
      render: message,
      toastId: id
    });
  } else {
    toast.success(message, {
      position: position,
      toastId: id
    });
  }
}



export function setCookie(cname, cvalue, exptime) {
  var d = new Date();
  d.setTime(d.getTime() + exptime);
  var expires = "expires=" + d.toUTCString();
  document.cookie =
    cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
}

// export function setCookie(cname, cvalue, exptime) {
//   var d = new Date();
//   d.setTime(d.getTime() + exptime);
//   var expires = "expires=" + d.toUTCString();
//   var ua = navigator.userAgent.toLowerCase(); 
//   if (ua.indexOf('safari') != -1) { 
//     if (ua.indexOf('chrome') > -1) {
//       document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/" ;
//     } else {
//       document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/" + ";HttpOnly" ;
//     }
//   }

// }

export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return decodeURIComponent(c.substring(name.length, c.length));
    }
  }
  return null;
}

export function deleteCookie(cname) {
  document.cookie = cname + "=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function SerializePostCall(oCredentials) {
  var encodedUrl = [];
  for (var key in oCredentials)
    if (oCredentials.hasOwnProperty(key)) {
      encodedUrl.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(oCredentials[key])
      );
    }

  encodedUrl = encodedUrl.join("&");
  return encodedUrl;
}

export function creatingRequestBodySignIn(oRequest, oRequestType) {
  const commonRequestBodyDetails = {
    grant_type: oRequestType,
    deviceId: "web_app",
    deviceName: "web_app",
    devicePlatform: "web_app"
  };
  const requestBodyDetails = {
    ...commonRequestBodyDetails,
    ...(oRequest.username && {username: oRequest.username}),
    ...(oRequest.password && {password: oRequest.password}),
    ...(oRequest.accessToken && {token: oRequest.accessToken}),
    ...(oRequest.accessTokenSecret && {
      tokensecret: oRequest.accessTokenSecret
    })
  };

  return requestBodyDetails;
}

export function saveUserDetails(_userObj, _userToken) {
  const cookiesTimeOut = CONSTANTS.COOKIES_TIMEOUT_REMEMBER;
  _userObj.languageName = "";
  if (_userObj) {
    setCookie(
      CONSTANTS.COOKIE_USER_OBJECT,
      JSON.stringify(_userObj),
      cookiesTimeOut
    );
  }
  if (_userToken) {
    setCookie(
      CONSTANTS.COOKIE_USER_TOKEN,
      JSON.stringify(_userToken),
      cookiesTimeOut
    );
  }
}

export function isTpay(paymentProvider, countryCode) {
  if (
    paymentProvider.toLowerCase() ===
      CONSTANTS.PAYMENT_OPERATOR_ETISALAT.toLowerCase() &&
    (countryCode === CONSTANTS.TPAY_ETISALAT_COUNTRY_CODE) === countryCode
  ) {
    return true;
  }
  return CONSTANTS.PAYMENT_OPERATORS_TPAY.find(
    ele => ele.toLowerCase() === paymentProvider.toLowerCase()
  );
}

export function getWatchingDate(date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getUTCFullYear();
  return month + "/" + day + "/" + (year - 2000);
}

export function creatingRequestBodySignUp(oRequest) {
  const requestBodyDetails = {
    firstName: oRequest.firstName,
    lastName: oRequest.lastName,
    password: oRequest.password,
    countryId: oRequest.countryId,
    languageId: oRequest.languageId,
    newsletterEnabled: oRequest.newsletterEnabled,
    privacyPolicy:oRequest.privacyPolicy,
    isAdult:oRequest.isAdult,
    IsRecommend:oRequest.IsRecommend,
    // newsletter4:oRequest.newsletter4
    // 'promotionsEnabled': oRequest.promotionsEnabled
  };
  if (oRequest.email) {
    requestBodyDetails.email = oRequest.email;
  } else if (oRequest.phoneNumber) {
    requestBodyDetails.phonenumber = oRequest.phoneNumber;
  }
  return requestBodyDetails;
}

export function creatingUserObjectForCookies(oResponse) {
  const _userObj = {
    firstName: oResponse.firstName || "",
    lastName: oResponse.lastName || "",
    email: oResponse.email || "",
    newslettersEnabled: oResponse.newslettersEnabled || "",
    phoneNumber: oResponse.phoneNumber || "",
    countryId: oResponse.countryId || "",
    countryName: oResponse.countryName || "",
    languageId: oResponse.languageId || "",
    languageName: "",
    promotionsEnabled: oResponse.promotionsEnabled || "",
    privacyPolicy: oResponse.privacyPolicy || "",
    isAdult: oResponse.isAdult || "",
    isRecommend: oResponse.IsRecommend || "",
    // newsletter4: oResponse.newsletter4 || ""
  };
  return _userObj;
}

export function creatingUserObjectForFacebookCookies(oFacebookResponse) {
  const _userObj = {
    firstName: oFacebookResponse.name || "",
    email: oFacebookResponse.email || ""
  };
  return _userObj;
}

export function creatingUserTokenForCookies(oResponse) {
  const _userToken = {
    authToken: oResponse.access_token,
    refreshToken: oResponse.refresh_token,
    user_id: oResponse.user_id
  };
  store.dispatch({
    type: actionTypes.UPDATE_USER_TOKEN,
    payload: _userToken
  });
  return _userToken;
}

export function isUserLoggedIn() {
  const oUserToken = JSON.parse(getCookie(CONSTANTS.COOKIE_USER_TOKEN));
  const sAuthToken = oUserToken ? oUserToken.authToken : null;
  return sAuthToken ? true : false;
}

export function getUserId() {
  const oUserToken = getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    ? JSON.parse(getCookie(CONSTANTS.COOKIE_USER_TOKEN))
    : null;
  return oUserToken ? oUserToken.user_id : null;
}

export function getUserEmail() {
  const oUserToken = getCookie(CONSTANTS.COOKIE_USER_OBJECT)
    ? JSON.parse(getCookie(CONSTANTS.COOKIE_USER_OBJECT))
    : null;
  return oUserToken ? oUserToken.email : null;
}

export function getUserPhone() {
  const oUserToken = getCookie(CONSTANTS.COOKIE_USER_OBJECT)
    ? JSON.parse(getCookie(CONSTANTS.COOKIE_USER_OBJECT))
    : null;
  return oUserToken ? oUserToken.phoneNumber : null;
}

export function getUserName() {
  const oUserToken = getCookie(CONSTANTS.COOKIE_USER_OBJECT)
    ? JSON.parse(getCookie(CONSTANTS.COOKIE_USER_OBJECT))
    : null;
  return oUserToken ? oUserToken.firstName + oUserToken.lastName : null;
}

export async function isUserSubscribed() {
  if (!ENABLE_SUBSCRIPTION) {
    return true;
  }
  const oUserToken = getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    ? JSON.parse(getCookie(CONSTANTS.COOKIE_USER_TOKEN))
    : null;

  const sUserName = oUserToken ? oUserToken.user_id : "";
  let isUserEntitled = false;
  if (oUserToken) {
    const oSubscriptionData = await fnCheckUserEntitlement(
      sUserName,
      false,
      "en"
    );
    isUserEntitled =
      Array.isArray(oSubscriptionData) &&
      oSubscriptionData.length > 0 &&
      oSubscriptionData[0].state === "Active"
        ? true
        : false;
  }
  store.dispatch(fnUpdateUserSubscription(isUserEntitled));
  return isUserEntitled;
}

export async function userSubscriptionPlan(includeAll, locale) {
  const oUserToken = getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    ? JSON.parse(getCookie(CONSTANTS.COOKIE_USER_TOKEN))
    : null;

  const sUserName = oUserToken ? oUserToken.user_id : "";
  let userSubscriptionPlan = [];
  if (oUserToken) {
    const oSubscriptionData = await fnCheckUserEntitlement(
      sUserName,
      includeAll,
      locale
    );
    userSubscriptionPlan =
      Array.isArray(oSubscriptionData) && oSubscriptionData.length > 0
        ? oSubscriptionData
        : [];
  }
  return userSubscriptionPlan;
}

function fnCheckUserEntitlement(sUserName, includeAll, locale = "ar") {
  return new Promise((resolve, reject) => {
    store.dispatch(
      fnSubscriptionEntitlement(
        sUserName,
        includeAll === true ? true : false,
        locale,
        oResponse => {
          resolve(oResponse);
        },
        oError => {
          resolve(oError);
        }
      )
    );
  });
}
export function showSubscription(path) {
  if (path.includes(CONSTANTS.PLANS)) {
    return false;
  }
  if (path.includes(CONSTANTS.PAYMENT_ENTER_MOBILE)) {
    return false;
  }
  if (path.includes(CONSTANTS.PAYMENT_ENTER_OTP)) {
    return false;
  }
  if (path.includes("transactionstatus")) {
    return false;
  }
  if (path.includes("checkout")) {
    return false;
  }
  if (path.includes("adyen-enter-details")) {
    return false;
  }
  return true;
}

export async function getNavigationPathForPremiumContent(
  premium_type,
  rights_type,
  sLocale,
  sVideoPath,
  live_type,
) {
  if (!ENABLE_SUBSCRIPTION) {
    return sVideoPath;
  }
  const isMena = store.getState().isMENARegion;
  // const isPrem = store.getState().IsPremium;
  // if (isMena) {
  //   return sVideoPath;
  // }
  let sPath = "";
  const isUserEntitled = await isUserSubscribed();
  const loggedIn = isUserLoggedIn();
  if (!loggedIn && rights_type === 3) {
    sPath = `/${sLocale}/${CONSTANTS.LOGIN}`;
  }
  else if (!loggedIn && premium_type === "SVOD")
  {
    sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH}`;
  } 
  else if (rights_type !== undefined && loggedIn && !isUserEntitled) {
    if (rights_type === 3) {
      sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH}`;
    }     
    else if (premium_type=="AVOD" && rights_type === 1 && live_type !== "LiveTV") {
      sPath = sVideoPath
      // sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH_AD}`;
    }
    else if (premium_type=="AVOD" && rights_type === 1 && live_type === "LiveTV") {
      sPath = sVideoPath
      // sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH_AD}`;
    }
     else if(premium_type=="SVOD" && rights_type === 1){
      sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH}`;
    }
  } else if ((loggedIn && isUserEntitled) ) {
    sPath = sVideoPath;
    // sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH}`;
    }
  else if (!isUserEntitled && rights_type === 1) {
     sPath = sVideoPath

    // sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH_AD}`;
  }
  return sPath;
}

export function fnNavTo(sPathName, bReplace = false) {
  if (this.props.location.pathname !== sPathName) {
    if (bReplace) {
      this.props.history.replace(sPathName);
    } else {
      this.props.history.push(sPathName);
    }
  }
}

export function fnConstructContentURL(type, ele) {
  let sURL = "";
  if (ele && type === CONSTANTS.EPISODE) {
    sURL = `/${ele.content_type}/${ele.id}/${ele.title.replace(/ +/g, "-")}-${
      ele.episode_number ? oResourceBundle.episode + ele.episode_number : ""
    }`;
  } else if (ele) {
    sURL = `/${ele.content_type}/${ele.id}/${ele.title.replace(/ +/g, "-")}`;
  }
  return sURL;
}

export function fnConstructTranslatedTitle(type, ele, locale, reverseLocale) {
  const oResourceBundleContent = oResourceBundle.getContent()[reverseLocale];
  let sURL = "";
  if (ele && type === CONSTANTS.EPISODE) {
    sURL = ele[reverseLocale + "title"]
      ? `${ele[reverseLocale + "title"].replace(/ +/g, "-")}-${
          ele.episode_number
            ? oResourceBundleContent.episode + ele.episode_number
            : ""
        }`
      : "";
  } else if (ele) {
    sURL = ele[reverseLocale + "title"]
      ? `${ele[reverseLocale + "title"].replace(/ +/g, "-")}`
      : "";
  }
  return sURL;
}

export function isMENARegion(sCountryCode = "") {
  if (!ENABLE_SUBSCRIPTION || FORCE_MENA_REGION) {
    return true;
  }
  const aListCountriesMENARegion = [
    "IQ",
    "JO",
    "KW",
    "LB",
    "OM",
    "IL",
    "PS",
    "QA",
    "SA",
    "SY",
    "AE",
    "YE",
    "BH",
    "DZ",
    "EG",
    "LY",
    "MA",
    "SD",
    "SO",
    "DJ",
    "TN"
  ];
  const index = aListCountriesMENARegion.findIndex(
    ele => ele.toLowerCase() === sCountryCode.toLowerCase()
  );

  return index > -1 ? true : false;
}
