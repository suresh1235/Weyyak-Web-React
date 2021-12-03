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
import { getUserLocale } from "get-user-locale";
import {
  fnSubscriptionEntitlement,
  fnUpdateUserSubscription,
  fnUpdateResumePagePath
} from "app/store/action/";
import * as actionTypes from "app/store/action/actions";
import { store } from "app/App";
import { toast } from "core/components/Toaster/";
import { isMobile } from "react-device-detect";
import trialBannerInsideArLandscape from "app/resources/assets/thumbnail/subscription-banner-inside-ar-landscape.jpg";
//import trialBannerInsideArSquare from "app/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg";
//import trialBannerInsideEnLandscape from "app/resources/assets/thumbnail/subscription-banner-inside-en-landscape.jpg";
import trialBannerInsideEnSquare from "app/resources/assets/thumbnail/subscription-banner-inside-en-square.jpg";
//import trialBannerOutsideArLandscape from "app/resources/assets/thumbnail/subscription-banner-outside-ar-landscape.jpg";
//import trialBannerOutsideArSquare from "app/resources/assets/thumbnail/subscription-banner-outside-ar-square.jpg";
//import trialBannerOutsideEnLandscape from "app/resources/assets/thumbnail/subscription-banner-outside-en-landscape.jpg";
//import trialBannerOutsideEnSquare from "app/resources/assets/thumbnail/subscription-banner-outside-en-square.jpg";
//import { PLANS_DESCRIPTION } from "../Routes/RouteNames";
import safrawsefra from "app/resources/assets/thumbnail/Safra-W-SefraPoster.png"
import saframobile from "app/resources/assets/thumbnail/saframobile.png"

import axios from "axios";

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const { getName } = require("country-list");
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
  let bannerType ='subscription';
  if (isMENARegion) {
    if (locale === "en") {
      switch (imageType) {
        case CONSTANTS.TRIAL_BANNER_LANDSCAPE:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-inside-en-landscape.jpg';//trialBannerInsideEnLandscape;
          break;
        case CONSTANTS.TRIAL_BANNER_SQUARE:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-inside-en-square.jpg';//trialBannerInsideEnSquare;
          break;
          case CONSTANTS.CONTEST_BANNER_LANDSCAPE:
            bannerType = 'contest';
            imageUrl = saframobile;
           // imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/Safra-W-SefraPoster.png';//trialBannerInsideArLandscape;
            break;
        case CONSTANTS.CONTEST_BANNER_SQUARE:
             bannerType = 'contest';
             imageUrl = safrawsefra;
            //imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/Safra-W-SefraPoster.png';//trialBannerInsideArLandscape;
            break;
        default:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-inside-en-square.jpg';//trialBannerInsideEnSquare;
      }
    } else {
      switch (imageType) {
        case CONSTANTS.TRIAL_BANNER_LANDSCAPE:
          // imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg';//trialBannerInsideArLandscape;
          imageUrl = trialBannerInsideArLandscape
          break;
        case CONSTANTS.TRIAL_BANNER_SQUARE:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg';///trialBannerInsideArSquare;
          break;
          case CONSTANTS.CONTEST_BANNER_LANDSCAPE:
            bannerType = 'contest';
            imageUrl = saframobile;
             //imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/Safra-W-SefraPoster.png';//trialBannerInsideArLandscape;
            break;
          case CONSTANTS.CONTEST_BANNER_SQUARE:
            bannerType = 'contest';
            imageUrl = safrawsefra;
            //imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg';///trialBannerInsideArSquare;
            //imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/Safra-W-SefraPoster.png';//trialBannerInsideArLandscape;
            break;
        default:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg';//trialBannerInsideArSquare;
      }
    }
  } else {
    if (locale === "en") {
      switch (imageType) {
        case CONSTANTS.TRIAL_BANNER_LANDSCAPE:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-outside-en-landscape.jpg';//trialBannerOutsideEnLandscape;
          break;
        case CONSTANTS.TRIAL_BANNER_SQUARE:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-outside-en-square.jpg';//trialBannerOutsideEnSquare;
          break;
          case CONSTANTS.CONTEST_BANNER_LANDSCAPE:
            bannerType = 'contest';
            imageUrl = saframobile;
             //imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/Safra-W-SefraPoster.png';//trialBannerInsideArLandscape;
            break;
          case CONSTANTS.CONTEST_BANNER_SQUARE:
            bannerType = 'contest';
            imageUrl = safrawsefra;
            //imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg';///trialBannerInsideArSquare;
            //imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/Safra-W-SefraPoster.png';//trialBannerInsideArLandscape;
            break;
        default:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-outside-en-square.jpg';//trialBannerOutsideEnSquare;
      }
    } else {
      switch (imageType) {
        case CONSTANTS.TRIAL_BANNER_LANDSCAPE:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-outside-ar-landscape.jpg';//trialBannerOutsideArLandscape;
          break;
        case CONSTANTS.TRIAL_BANNER_SQUARE:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-outside-ar-square.jpg';//trialBannerOutsideArSquare;
          break;
          case CONSTANTS.CONTEST_BANNER_LANDSCAPE:
            bannerType = 'contest';
            imageUrl = saframobile;
             //imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/Safra-W-SefraPoster.png';//trialBannerInsideArLandscape;
            break;
          case CONSTANTS.CONTEST_BANNER_SQUARE:
            bannerType = 'contest';
            imageUrl = safrawsefra;
            //imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-inside-ar-square.jpg';///trialBannerInsideArSquare;
            //imageUrl =CONSTANTS.DEFAULT_IMAGE_STATIC_PATH+'/resources/assets/thumbnail/Safra-W-SefraPoster.png';//trialBannerInsideArLandscape;
            break;
        default:
          imageUrl = CONSTANTS.DEFAULT_IMAGE_STATIC_PATH + '/resources/assets/thumbnail/subscription-banner-outside-ar-square.jpg';//trialBannerOutsideArSquare;
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
  if(bannerType=='contest') {
    trialBanner.content_type =CONSTANTS.CONTEST_BANNER_CONTENT_TYPE;
    trialBanner.title = CONSTANTS.CONTEST_BANNER_CONTENT_TYPE;
    trialBanner.id = CONSTANTS.CONTEST_BANNER_CONTENT_TYPE;
  }
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
  return CountryCodes.findCountry({ dial: countryDialCode });
}

export function getCountryFromCode(countryCode) {
  return CountryCodes.findCountry({ a2: countryCode });
}

export function getCountryFromFullName(countryName) {
  return CountryCodes.findCountry({ name: countryName });
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
    } catch (e) { }
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
    getServerCookie(CONSTANTS.COOKIE_USER_OBJECT) !== null
      ? JSON.parse(getServerCookie(CONSTANTS.COOKIE_USER_OBJECT))
      : null;
  // let userDetails =null
  // getServerCookie(CONSTANTS.COOKIE_USER_OBJECT).then(function(user){
  //     userDetails = user;
  // })
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

//--------GDPR- Google Ads------------------
export function isGoogleAdsEnable() {
  // console.log("-----------googleAds----------")
  // let GDPR_DATA = null

  // var name = 'GDPR_Cookies' + "=";
  // var ca = document.cookie.split(";");

  // for (var i = 0; i < ca.length; i++) {
  //   var c = ca[i];
  //   while (c.charAt(0) === " ") {
  //     c = c.substring(1);
  //   }
  //   if (c.indexOf(name) === 0) {
  //     // console.log(decodeURIComponent(c.substring(name.length, c.length)));
  //     GDPR_DATA = JSON.parse(decodeURIComponent(c.substring(name.length, c.length)));
  //   }
  // }

  let GDPR_DATA = getGDPRCookie('GDPR_Cookies')

  let COMMAND = GDPR_DATA ? GDPR_DATA.googleAds : true

  // console.log("COMMAND", COMMAND)

  return COMMAND
}

export function IsCleverTapEnabled() {

  let GDPR_DATA = getGDPRCookie('GDPR_Cookies')

  let COMMAND = GDPR_DATA ? GDPR_DATA.cleverTap : true

  return COMMAND
}

export function loadBannerAds(container='',slot='',size1=''){
  let size =  CONSTANTS.AD_SIZE;
  let slotID =store.getState().platformConfig.default["1.0"].Ad_Unit_Id?
              store.getState().platformConfig.default["1.0"].Ad_Unit_Id:
              CONSTANTS.AD_SLOTID ;

  let containerID = store.getState().platformConfig.default["1.0"].Ad_Container_Id?
                    store.getState().platformConfig.default["1.0"].Ad_Container_Id:
                    CONSTANTS.AD_CONTAINER_ID_PREFIX;

  if(isMobile) {
    
    size = CONSTANTS.AD_MOBILE_SIZE;
    slotID = store.getState().platformConfig.default["1.0"].Mobile_Ad_Unit_Id ? 
              store.getState().platformConfig.default["1.0"].Mobile_Ad_Unit_Id :
              CONSTANTS.AD_MOBILE_SLOTID;
    containerID = store.getState().platformConfig.default["1.0"].Mobile_Ad_Container_Id?
                  store.getState().platformConfig.default["1.0"].Mobile_Ad_Container_Id:
                  CONSTANTS.AD_MOBILE_CONTAINER_ID_PREFIX;
  }
  containerID=container?container:containerID;
  slotID=slot?slot:slotID;
  size=size1?size1:size;
  //console.log(containerID);
  const { googletag } = window;
  console.log('GAM PARAMS',{container: containerID, slot: slotID, size: size})
  googletag.cmd.push(function() {
   // console.log(googletag.pubads());
   // debugger;
    let GSLOT = googletag.defineSlot(slotID, size, containerID)
    if(GSLOT){
      GSLOT.addService(googletag.pubads())
    }
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
        //if (event.slot.getSlotElementId() == containerID) {
           console.log('GAM - Rendered Banner ADs' + containerID , event)
            var containsAd = !event.isEmpty;   
            console.log(event) ;
       // }
    });
    googletag.pubads().addEventListener('slotRequested', function(event) {
      var slot = event.slot;
      console.log('GAM - Requested Slots', slot.getSlotElementId(), 'has been requested.');
      console.log(slot);
     
    });
    // if(containerID == CONSTANTS.AD_MOBILE_CONTAINER_ID_PREFIX){
      googletag.pubads().addEventListener('slotResponseReceived',
      function(event) {
        
        var slot = event.slot;
       
        console.log('GAM - Ad response for slot', slot.getSlotElementId(),
                    'received.', slot);
                   // console.log(slot);
      }
     );
    // }

    googletag.pubads().refresh([slot]);

    googletag.pubads().addEventListener('slotVisibilityChanged',
    function(event) {
      var slot = event.slot;
      console.group(
          'Visibility of slot', slot.getSlotElementId(), 'changed.');

      // Log details of the event.
      console.log('Visible area:', event.inViewPercentage + '%');
      console.groupEnd();

      // if (slot === targetSlot) {
      //   // Slot specific logic.
      // }
    });
  });

  googletag.cmd.push(function () {
    googletag.display(containerID);
  });
}

export function unloadBannerAds(){
   // destroy all ad slots
   //console.log('Google Banner ADs unLoading')
   const { googletag } = window;
   googletag.cmd.push(function () {
     googletag.destroySlots();
   });
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
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
        return d.charCodeAt(0) - 1632; // Convert Arabic numbers
      })
      .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
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


export function Encrypt(value) {
  var result = "";
  for (var i = 0; i < value.length; i++) {
    if (i < value.length - 1) {
      result += value.charCodeAt(i) + 10;
      result += "-";
    }
    else {
      result += value.charCodeAt(i) + 10;
    }
  }
  return result;
}
export function Decrypt(value) {
  var result = "";
  var array = value.split("-");

  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i] - 10);
  }
  return result;
}



// export function setGDPRCookie(cname, cvalue) {
//   let evalue = Encrypt(cvalue);
//   sessionStorage.setItem(cname, evalue)
// }

// export function getGDPRCookie(cname) {
//   let getcname = sessionStorage.getItem(cname)
//   let GDPRCookie = null

//   if (getcname) {
//     let deccookie = Decrypt(getcname);

//     if (deccookie != undefined) {
//       GDPRCookie = JSON.parse(deccookie)
//     }
//   }

//   return GDPRCookie;
// }

// export function DeleteGDPRCookie(cname) {
//   // sessionStorage.removeItem("key");
//   sessionStorage.clear();
// }


export function setGenerealCookie(cname, cvalue, exptime) {

  let CookieInfo = JSON.stringify(cvalue)
  let evalue = Encrypt(CookieInfo);
  localStorage.setItem(cname, evalue)
}

export function getGeneralCookie(cname) {
  let getcname = localStorage.getItem(cname)
  let GDPRCookie = null

  if (getcname) {
    let deccookie = Decrypt(getcname);

    if (deccookie != undefined) {
      GDPRCookie = JSON.parse(deccookie)
    }
  }

  return GDPRCookie;
}

export function DeleteGeneralCookie(cname) {
  localStorage.removeItem(cname);
}



export function setGDPRCookie(cname, cvalue, exptime) {

  if (cname == 'GDPR_Cookies') {
    let CurrentData = new Date();
    CurrentData.setTime(CurrentData.getTime() + exptime);
    cvalue.expiresTime = CurrentData.getTime();
  }

  let CookieInfo = JSON.stringify(cvalue)
  let evalue = Encrypt(CookieInfo);
  localStorage.setItem(cname, evalue)
}

export function getGDPRCookie(cname) {
  let getcname = localStorage.getItem(cname)
  let GDPRCookie = null

  if (getcname) {
    let deccookie = Decrypt(getcname);

    if (deccookie != undefined) {
      GDPRCookie = JSON.parse(deccookie)
    }
  }

  return GDPRCookie;
}

export function DeleteGDPRCookie(cname) {
  localStorage.removeItem(cname);
}



// export function setCookie(cname, cvalue, exptime) {
//   var d = new Date();
//   d.setTime(d.getTime() + exptime);
//   var expires = "expires=" + d.toUTCString();
//   document.cookie =
//     cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
// }
export function setCookie(cname, cvalue, exptime) {
  var d = new Date();

  if (cname == 'COOKIE_USER_OBJECT' || cname == 'COOKIE_USER_TOKEN') {
    let usercookie = {
      cookiename: cname,
      cookievalue: encodeURIComponent(cvalue)
    };
    let evalue = Encrypt(cvalue);
    localStorage.setItem(cname, evalue)
    axios.post('/cookie', usercookie).then(function (response) {

    }).catch((err) => {
      console.log(err)
    })
  }
  d.setTime(d.getTime() + exptime);
  var expires = "expires=" + d.toUTCString();
  var ua = navigator.userAgent.toLowerCase();
  var userid = getUserId() ? getUserId() : uuidv4();
  if (ua.indexOf('safari') != -1) {
    if (ua.indexOf('chrome') > -1) {
      document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/" + ";";
      // document.cookie = "user" + "=" + encodeURIComponent(userid) + ";" + expires + ";path=/" + ";HttpOnly";


    } else {
      document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/" + ";";

    }
  }

}


export function getServerCookie(cname) {
  var name = cname + "=";
  let getcname = localStorage.getItem(cname)

  if (getcname) {
    let deccookie = Decrypt(getcname);
    return deccookie;
  }
  else {
    return null
  }
  return null;
}

export function getGuestCookie(cname) {
  axios.get("/guestCookie", (req, res) => {

  })
}
export function getCookie(cname) {
  //COOKIE_USER_OBJECT
  //COOKIE_USER_TOKEN
  var name = cname + "=";
  var ca = document.cookie.split(";");

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      // console.log(decodeURIComponent(c.substring(name.length, c.length)));
      return decodeURIComponent(c.substring(name.length, c.length));
    }
  }
  return null;
}
// }

export function deleteCookie(cname) {
  localStorage.removeItem(cname)
  document.cookie = cname + "=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

  let usercookie = {
    cookiename: cname
  };
  if (cname == 'COOKIE_USER_OBJECT' || cname == 'COOKIE_USER_TOKEN') {
    axios.post('/destroyCookie', usercookie).then(function (response) {
    });
  }

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
    ...(oRequest.username && { username: oRequest.username }),
    ...(oRequest.password && { password: oRequest.password }),
    ...(oRequest.accessToken && { token: oRequest.accessToken }),
    ...(oRequest.accessTokenSecret && {
      tokensecret: oRequest.accessTokenSecret
    })
  };

  return requestBodyDetails;
}

export function creatingRequestBodyForAppleSignIn(oRequest, oRequestType) {
  const commonRequestBodyDetails = {
    grant_type: oRequestType,
    deviceId: "web_app",
    deviceName: "web_app",
    devicePlatform: "web_app"
  };
  const requestBodyDetails = {
    ...commonRequestBodyDetails,
    ...(oRequest.user && { username: `${oRequest.user.name.firstName} ${oRequest.user.name.lastName}` }),
    ...(oRequest.user && { email: `${oRequest.user.email}` }),
    ...(oRequest.id_token && { token: oRequest.id_token }),
    ...(oRequest.id_token && { tokensecret: 'applesecret' }),
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
    Alpha2code: oRequest.Alpha2code,
    countryName: oRequest.countryName,
    languageId: oRequest.languageId,
    newsletterEnabled: oRequest.newsletterEnabled,
    privacyPolicy: oRequest.privacyPolicy,
    isAdult: oRequest.isAdult,
    IsRecommend: oRequest.IsRecommend,
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
    firstName: oResponse.firstName,
    lastName: oResponse.lastName,
    email: oResponse.email,
    newslettersEnabled: oResponse.newslettersEnabled,
    phoneNumber: oResponse.phoneNumber,
    countryId: oResponse.countryId,
    countryName: oResponse.countryName,
    languageId: oResponse.languageId,
    languageName: "",
    promotionsEnabled: oResponse.promotionsEnabled,
    privacyPolicy: oResponse.privacyPolicy,
    isAdult: oResponse.isAdult,
    advertising: oResponse.advertising,
    aique: oResponse.aique,
    appFlyer: oResponse.appFlyer,
    facebookAds: oResponse.facebookAds,
    firebase: oResponse.firebase,
    googleAds: oResponse.googleAds,
    googleAnalytics: oResponse.googleAnalytics,
    performance: oResponse.performance

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

export function creatingUserObjectForAppleCookies(oAppleResponse) {
  const _userObj = {
    firstName: oAppleResponse.user != null ? oAppleResponse.user.name.firstName : "",
    email: oAppleResponse.user != null ? oAppleResponse.user.email : ""
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
  const oUserToken = JSON.parse(getServerCookie(CONSTANTS.COOKIE_USER_TOKEN));
  const sAuthToken = oUserToken ? oUserToken.authToken : null;
  return sAuthToken ? true : false;
  // let oUserToken  =null;
  // getServerCookie(CONSTANTS.COOKIE_USER_TOKEN).then(function(token){
  //   oUserToken = token
  // });
  // const sAuthToken = oUserToken ? oUserToken.authToken : null;
  // return sAuthToken ? true : false;
}

export function getUserId() {
  const oUserToken = getServerCookie(CONSTANTS.COOKIE_USER_TOKEN)
    ? JSON.parse(getServerCookie(CONSTANTS.COOKIE_USER_TOKEN))
    : null;

  return oUserToken ? oUserToken.user_id : null;
}

async function getGuestCookies() {
  return await axios.get("/getGuestCookieInfo/uuid").then(function (response) {
    return response;
  }).catch((err) => {
    console.log(err)
  })
}

export function uuidv4() {
  getGuestCookies().then(function (data) {
    if (data) {
      if (data.data && data.data == '1') {

        let uidValue = localStorage.getItem("uuid");
        if (uidValue == undefined || uidValue == null || uidValue == false) {
          uidValue = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
          );
        }

        var now = new Date();
        now.setMonth(now.getMonth() + 12);
        document.cookie = "uuid" + "=" + uidValue + "; Path=/; expires=" + now.toUTCString() + ";";

        let usercookie = {
          cookiename: "uuid",
          cookievalue: uidValue
        };
        axios.post('/guestCookie', usercookie).then(function (response) {


        });
        return uidValue;
      } else {
        return data.data;
      }
    }

  });

}

export function getUid() {
  var udata = "";
  getGuestCookies().then(function (data) {
    if (data) {
      window.udata = data.data;
      localStorage.setItem("wdata", window.udata);
      return data.data;
    }
  });
  var wdata = window.udata;

  return wdata;
}



export function getUserEmail() {
  const oUserToken = getServerCookie(CONSTANTS.COOKIE_USER_OBJECT)
    ? JSON.parse(getServerCookie(CONSTANTS.COOKIE_USER_OBJECT))
    : null;
  return oUserToken ? oUserToken.email : null;
}

export function getUserPhone() {
  const oUserToken = getServerCookie(CONSTANTS.COOKIE_USER_OBJECT)
    ? JSON.parse(getServerCookie(CONSTANTS.COOKIE_USER_OBJECT))
    : null;
  return oUserToken ? oUserToken.phoneNumber : null;
}

export function getUserName() {
  const oUserToken = getServerCookie(CONSTANTS.COOKIE_USER_OBJECT)
    ? JSON.parse(getServerCookie(CONSTANTS.COOKIE_USER_OBJECT))
    : null;
  return oUserToken ? oUserToken.firstName + oUserToken.lastName : null;
}

export async function isUserSubscribed() {
  if (!ENABLE_SUBSCRIPTION) {
    return true;
  }
  // let  oUserToken = null;
  //  getServerCookie(CONSTANTS.COOKIE_USER_TOKEN).then(function(data){
  //     console.log("In response===================>",data)
  //     if(data!=null)
  //       oUserToken= JSON.parse(data);
  //   });
  const oUserToken = getServerCookie(CONSTANTS.COOKIE_USER_TOKEN)
    ? JSON.parse(getServerCookie(CONSTANTS.COOKIE_USER_TOKEN))
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

export async function UserSubscribedType() {
  if (!ENABLE_SUBSCRIPTION) {
    return "Subscribed_User";
  }

  const oUserToken = getServerCookie(CONSTANTS.COOKIE_USER_TOKEN)
    ? JSON.parse(getServerCookie(CONSTANTS.COOKIE_USER_TOKEN))
    : null;

  const sUserName = oUserToken ? oUserToken.user_id : "";
  let TypeOfUser = "Not_a_Subscribed_User";
  if (oUserToken) {
    const oSubscriptionData = await fnCheckUserEntitlement(
      sUserName,
      false,
      "en"
    );

    if(Array.isArray(oSubscriptionData) &&
    oSubscriptionData.length > 0 &&
    oSubscriptionData[0].state === "Active"){

      TypeOfUser = oSubscriptionData[0].subscription_plan.coupon_type ==  "Coupon" ? "Coupon_Subscribed_User" :
       oSubscriptionData[0].subscription_plan.coupon_type == "Voucher" ? "Discounted_Coupon_User" : "Subscribed_User"

    }else{
      TypeOfUser = "Not_a_Subscribed_User";
    }

  }
  return TypeOfUser;
}

export async function userSubscriptionPlan(includeAll, locale) {
  const oUserToken = getServerCookie(CONSTANTS.COOKIE_USER_TOKEN)
    ? JSON.parse(getServerCookie(CONSTANTS.COOKIE_USER_TOKEN))
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
  else if (!loggedIn && premium_type === "SVOD") {
    sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH}`;
  }
  else if (rights_type !== undefined && loggedIn && !isUserEntitled) {
    if (rights_type === 3) {
      sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH}`;
    }
    else if (premium_type == "AVOD" && rights_type === 1 && live_type !== "LiveTV") {
      sPath = sVideoPath
      // sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH_AD}`;
    }
    else if (premium_type == "AVOD" && rights_type === 1 && live_type === "LiveTV") {
      sPath = sVideoPath
      // sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH_AD}`;
    }
    else if (premium_type == "SVOD" && rights_type === 1) {
      sPath = `/${sLocale}/${CONSTANTS.SUBSCRIPTION_TO_WATCH}`;
    }
  } else if ((loggedIn && isUserEntitled)) {
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
    sURL = `/${ele.content_type}/${ele.id}/${ele.title.replace(/ +/g, "-")}-${ele.episode_number ? oResourceBundle.episode + ele.episode_number : ""
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
      ? `${ele[reverseLocale + "title"].replace(/ +/g, "-")}-${ele.episode_number
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
export function isValidFullname(name=""){

  let truncated = name.trim();

  return truncated && name.length>5 && name.length<=60;

}

