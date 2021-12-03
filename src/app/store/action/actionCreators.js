/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */
import {store} from "app/App";
import * as appURLs from "app/AppConfig/urlConfig";
import * as actionTypes from "./actions";
import * as CONSTANTS from "app/AppConfig/constants";
import {ENABLE_CONTACT_US} from "app/AppConfig/features";
import * as common from "../../utility/common";
import {COUNTRIES} from "../mock";
import axios from "axios";
import {createAxiosInstance} from "app/axios/zee5-axios";
import aStaticMenuEn from "app/i18n/StaticMenu/static-menu-en.json";
import aStaticMenuAr from "app/i18n/StaticMenu/static-menu-ar.json";
import oResourceBundle from "app/i18n/";
import Logger from "core/Logger";
const MODULE_NAME = "actionCreators";

let zeeAxios = null;
let zeeAxiosUM = null;
export const startLoader = () => {
  return {type: actionTypes.START_LOADER};
};

export const stopLoader = () => {
  return {type: actionTypes.STOP_LOADER};
};

export const startVideoInfoLoader = () => {
  return {type: actionTypes.START_VIDEO_INFO_LOADER};
};

export const stopVideoInfoLoader = () => {
  return {type: actionTypes.STOP_VIDEO_INFO_LOADER};
};

export const changeDirection = sCurrentLocale => {
  return {type: actionTypes.CHANGE_DIRECTION, payload: sCurrentLocale};
};

export const setVolume = volume => {
  return {type: actionTypes.START_LOADER};
};

export const fnPageViewSent = () => {
  return {type: actionTypes.PAGEVIEW_SENT};
};

export const fnUpdatePlayerScreenState = playerScreenVisible => {
  return {
    type: actionTypes.UPDATE_PLAYER_SCREEN_STATE,
    payload: {playerScreenVisible}
  };
};

export const fnUpdateVideoPlaybackState = videoPlaybackState => {
  return {
    type: actionTypes.UPDATE_VIDEO_PLAYBACK_STATE,
    payload: {videoPlaybackState}
  };
};

export const fnUpdatePlayerQuality = qualityLevels => {
  return {
    type: actionTypes.UPDATE_VIDEO_QUALITY_LEVELS,
    payload: {qualityLevels}
  };
};

/**
 * Component Name - Action creators
 * method to fetch pplatform dependent configs.
 * @param null
 * @return {fuunction} - thunk function to operate asynchronous code
 */
export const fnFetchPlatformConfig = (
  sLanguageCode,
  sCountry,
  fnSuccess,
  fnFailure
) => {
  return dispatch => {
    dispatch(startLoader());
    axios
      .get(appURLs.PLATFORM_CONFIG)
      .then(response => {
        if (response.status === CONSTANTS.STATUS_OK && response.data.default) {
          const oDefaultUrls = response.data.default["1.0"];
          // response.data.default["1.0"].Ad_Tag_Url_EN =
          //   "https://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/7229/n7729.testsite/Weyyak&ciu_szs=320x50,320x100,728x90,970x90,970x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&cust_params=platform%3Dweb&lang%3Den&description_url=https://weyyak.z5.com&ad_rule=1&correlator=&cmsid=2499579&vid=VIDEO_ID";
          // response.data.default["1.0"].Ad_Tag_Url_AR =
          //   "https://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/7229/n7729.testsite/Weyyak&ciu_szs=320x50,320x100,728x90,970x90,970x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&cust_params=platform%3Dweb&lang%3Dar&description_url=https://weyyak.z5.com&ad_rule=1&correlator=&cmsid=2499579&vid=VIDEO_ID";

          response.data.default["1.0"].Ad_Tag_Url_EN =
            "https://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/7229/Weyyak&ciu_szs=320x50,320x100,728x90,970x90,970x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&cust_params=platform%3Dweb&lang%3Den&description_url=https://weyyak.z5.com&ad_rule=1&correlator=&cmsid=2499579&vid=VIDEO_ID";
          response.data.default["1.0"].Ad_Tag_Url_AR =
            "https://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/7229/Weyyak&ciu_szs=320x50,320x100,728x90,970x90,970x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&cust_params=platform%3Dweb&lang%3Dar&description_url=https://weyyak.z5.com&ad_rule=1&correlator=&cmsid=2499579&vid=VIDEO_ID";
          // response.data.default["1.0"].Ad_Tag_Url_EN = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/7229/n7729.testsite/Weyyak&ciu_szs=320x50,320x100,728x90,970x90,970x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&cust_params=platform%3Dweb&lang%3Den&description_url=https://weyyak.z5.com&ad_rule=1&correlator=&cmsid=2499579&vid=VIDEO_ID";
          // response.data.default["1.0"].Ad_Tag_Url_AR = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/7229/n7729.testsite/Weyyak&ciu_szs=320x50,320x100,728x90,970x90,970x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&cust_params=platform%3Dweb&lang%3Dar&description_url=https://weyyak.z5.com&ad_rule=1&correlator=&cmsid=2499579&vid=VIDEO_ID";
          //Update zeeAxios based on platform config
          zeeAxios = createAxiosInstance(oDefaultUrls && oDefaultUrls["CMS"]);
          zeeAxiosUM = createAxiosInstance(oDefaultUrls && oDefaultUrls["UM"]);
          let geoLoctionURL = oDefaultUrls && oDefaultUrls["Geolocation"];

          const userTokenString = common.getCookie(CONSTANTS.COOKIE_USER_TOKEN);
          const payloadSavedUserTokenString = common.getCookie(
            CONSTANTS.COOKIE_PAYLOAD_SAVED_USER_TOKEN
          );
          const payloadString = common.getCookie(
            CONSTANTS.COOKIE_VERIFY_PAYMENT_PAYLOAD
          );
          const userToken =
            userTokenString && userTokenString !== null
              ? JSON.parse(userTokenString)
              : null;
          const payloadSavedUserToken =
            payloadSavedUserTokenString && payloadSavedUserTokenString !== null
              ? JSON.parse(payloadSavedUserTokenString)
              : null;

          let timeout;

          if (
            payloadString &&
            payloadSavedUserToken &&
            userToken &&
            payloadSavedUserToken.user_id === userToken.user_id
          ) {
            Logger.log(MODULE_NAME, "Found verify payload. Firing API again");
            const payload = JSON.parse(payloadString);
            dispatch(startLoader());
            dispatch(
              fnVerifyPaymentResult(
                payload,
                () => {
                  clearTimeout(timeout);
                  Logger.log(MODULE_NAME, "Verify API successful");
                  common.deleteCookie(CONSTANTS.COOKIE_VERIFY_PAYMENT_PAYLOAD);
                  common.deleteCookie(
                    CONSTANTS.COOKIE_PAYLOAD_SAVED_USER_TOKEN
                  );
                  configUpdate(
                    dispatch,
                    geoLoctionURL,
                    sCountry,
                    sLanguageCode,
                    response,
                    fnSuccess
                  );
                },
                () => {
                  clearTimeout(timeout);
                  Logger.log(MODULE_NAME, "Verify API unsuccessful");
                  common.deleteCookie(CONSTANTS.COOKIE_VERIFY_PAYMENT_PAYLOAD);
                  common.deleteCookie(
                    CONSTANTS.COOKIE_PAYLOAD_SAVED_USER_TOKEN
                  );
                  configUpdate(
                    dispatch,
                    geoLoctionURL,
                    sCountry,
                    sLanguageCode,
                    response,
                    fnSuccess
                  );
                }
              )
            );
            timeout = setTimeout(() => {
              configUpdate(
                dispatch,
                geoLoctionURL,
                sCountry,
                sLanguageCode,
                response,
                fnSuccess
              );
            }, CONSTANTS.HOME_PAGE_VERIFY_TIMEOUT);
          } else {
            configUpdate(
              dispatch,
              geoLoctionURL,
              sCountry,
              sLanguageCode,
              response,
              fnSuccess
            );
          }
        } else {
          dispatch(stopLoader());
          if (typeof fnFailure === "function") {
            fnFailure();
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        console.log(error);
        if (typeof fnFailure === "function") {
          fnFailure();
        }
      });
  };
};

/**
 * Component Name - Action creators
 * Helper function to finish up after config API returns
 * @param null
 * @return {fuunction} -
 */
function configUpdate(
  dispatch,
  geoLoctionURL,
  sCountry,
  sLanguageCode,
  response,
  fnSuccess
) {
   dispatch(stopLoader());
  if (geoLoctionURL) {
    dispatch(fnFetchGeoLocation(geoLoctionURL, sCountry));
   
  }
  //Set platform config and language code
  dispatch(updatePlatformConfig(response.data, sLanguageCode));

  if (typeof fnSuccess === "function") {
    fnSuccess();
  }
}

/**
 * Component Name - Action creators
 * method to fetch country list.
 * @param null
 * @return {fuunction} - thunk function to operate asynchronous code
 */
export const fnFetchCountryList = sLanguageCode => {
  return dispatch => {
    const aEnglishCountryList = COUNTRIES.en.reduce((aList, ele) => {
      aList.push({
        text: ele.name,
        title: ele.name,
        key: ele.code
      });
      return aList;
    }, []);
    dispatch(updateEnglishCountryList(aEnglishCountryList));
    if ("ar" === sLanguageCode) {
      const aCountryList = COUNTRIES.ar.reduce((aList, ele) => {
        aList.push({
          text: ele.name,
          title: ele.name,
          key: ele.code
        });
        return aList;
      }, []);
      dispatch(updateCountryList(aCountryList));
    } else {
      dispatch(updateCountryList(aEnglishCountryList));
    }

    // if (zeeAxios) {
    //   if ("en" !== sLanguageCode) {
    //     zeeAxios
    //       .get(appURLs.COUNTRY_LIST.replace("{LANGUAGE_CODE}", "en"))
    //       .then(response => {
    //         if (
    //           response.status === CONSTANTS.STATUS_OK &&
    //           Array.isArray(response.data)
    //         ) {
    //           // const aUpdatedCountryList = response.data.reduce((aList, ele) => {
    //           //   aList.push({
    //           //     text: ele.name,
    //           //     title: ele.name,
    //           //     key: ele.code
    //           //   });
    //           //   return aList;
    //           // }, []);
    //           dispatch(updateEnglishCountryList(response.data));
    //         } else {
    //           // dispatch(updateEnglishCountryList(aUpdatedCountryList));
    //         }
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   }
    //   zeeAxios
    //     .get(appURLs.COUNTRY_LIST.replace("{LANGUAGE_CODE}", sLanguageCode))
    //     .then(response => {
    //       if (
    //         response.status === CONSTANTS.STATUS_OK &&
    //         Array.isArray(response.data)
    //       ) {
    //       //   const aUpdatedCountryList = response.data.reduce((aList, ele) => {
    //       //     aList.push({
    //       //       text: ele.name,
    //       //       title: ele.name,
    //       //       key: ele.code
    //       //     });
    //       //     return aList;
    //       //   }, []);
    //         dispatch(updateCountryList(response.data));
    //         if ("en" === sLanguageCode) {
    //           dispatch(updateEnglishCountryList(response.data));
    //         }
    //       } else {
    //         dispatch(updateCountryList([]));
    //       }
    //       dispatch(stopLoader());
    //     })
    //     .catch(error => {
    //       dispatch(stopLoader());
    //       console.log(error);
    //     });
    // } else {
    //   dispatch(stopLoader());
    // }
  };
};

/**
 * Component Name - Action creators
 * method that update country list
 * @param {string} sCountryCode - coountry list.
 * @return {dispatch} - dispatch object
 */
const updateCountryList = aCountryList => {
  return {type: actionTypes.UPDATE_COUNTRY_LIST, payload: aCountryList};
};

const updateEnglishCountryList = aCountryList => {
  return {
    type: actionTypes.UPDATE_ENGLISH_COUNTRY_LIST,
    payload: aCountryList
  };
};

/**
 * Component Name - Action creators
 * method to fetch geolocation.
 * @param null
 * @return {fuunction} - thunk function to operate asynchronous code
 */
const fnFetchGeoLocation = (sUrl, sQueryParamCountry) => {
  return dispatch => {
    // sQueryParamCountry = "AE";
    if (sQueryParamCountry) {
      dispatch(updateGeoLocation(sQueryParamCountry));
      return;
    }
    axios
      .get(sUrl)
      .then(response => {
        if (response.status === CONSTANTS.STATUS_OK) {
          localStorage.setItem("country", response.data);
          dispatch(updateGeoLocation(response.data));
          dispatch({
           'type': 'sCodeUpdate',
           'payload':response.data
        })
                                }
        dispatch(stopLoader());
      })
      .catch(error => {
        dispatch(stopLoader());
        console.log(error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that update geo location
 * @param {string} sCountryCode - coountry code.
 * @return {dispatch} - dispatch object
 */
const updateGeoLocation = sCountryCode => {
  if (!sCountryCode) {
    sCountryCode = "";
  }
  const isMENARegion = common.isMENARegion(sCountryCode);
  return {
    type: actionTypes.UPDATE_COUNTRY_CODE,
    payload: {sCountryCode, isMENARegion}
  };
};

/**
 * Component Name - Action creators
 * method that update platform config.
 * @param {object} oPlatformConfig - plaform config object.
 * @return {dispatch} - dispatch object
 */
const updatePlatformConfig = (oPlatformConfig, sLanguageCode) => {
  return {
    type: actionTypes.UPDATE_PLATFORM_CONFIG,
    payload: {oPlatformConfig, sLanguageCode}
  };
};

/**
 * Component Name - Action creators
 * method to fetch menu items
 * @param {string} sLanguageCode - Current language code.
 * @return {fuunction} - thunk function to operate asynchronous code
 */
export const fnFetchMenuItems = sLanguageCode => {
  return dispatch => {
    const menuPromise = zeeAxios.get(
      appURLs.MENU.replace("{LANGUAGE_CODE}", sLanguageCode)
    );
    //const staticMenuPromise = zeeAxios.get(appURLs.STATIC_MENU.replace("{LANGUAGE_CODE}", sLanguageCode), { responseType: 'arraybuffer' });
    Promise.all([menuPromise])
      .then(response => {
        const aStaticMenu =
          sLanguageCode === CONSTANTS.AR_CODE ? aStaticMenuAr : aStaticMenuEn;
        if (!ENABLE_CONTACT_US) {
          aStaticMenu.pop();
        }
        const oMenuItems = {
          aMenuItems: response[0].data,
          aStaticMenuItems: aStaticMenu
        };
        dispatch(updateMenuItems(oMenuItems));
      })
      .catch(error => {
        dispatch(stopLoader());
        Logger.error(MODULE_NAME, error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that update menu items.
 * @param {object} oMenuItems - Menu items object.
 * @return {dispatch} - dispatch object
 */
const updateMenuItems = oMenuItems => {
  return {type: actionTypes.UPDATE_MENU_ITEMS, payload: oMenuItems};
};

/**
 * Component Name - Action creators
 * method to fetch page content for a category
 * @param {string} sCategoryId - Category Id.
 * @return {fuunction} - thunk function to operate asynchronous code
 */
export const fnFetchPageContent = (
  sLanguageCode,
  sCategoryId,  
  fnMyPlayListLoginFailure,
  apiFailure
) => {
  return (dispatch, getState) => {
        //Get app state
    // const dCountry = getState().sCode
    const oAppState = getState();
    const oFirstMenuItem = oAppState.aMenuItems && oAppState.aMenuItems.data[0];
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    const aPromises = [];
    // let dCountry = "AE";
    const dCountry = getState().sCode;
    // console.log(dCountry)
    // if(dCountry == null || dCountry == ""){
    //   console.log(dCountry+"hefuedh")
    //    dCountry = "AE";
    // }
    // const responseData=(async () => {
    //   const response = await axios.get('https://geo.weyyak.com')
    //  const  value=response.data;
    //   return value;
    // })()
    //Check wheather selected menu item is playlist or not
    if (sCategoryId === CONSTANTS.MY_PLAYLIST_MENU_ID) {
      dispatch(fnFetchMyPlayList(fnMyPlayListLoginFailure));
    } else {
      const oPageDeailPromise = zeeAxios.get(
        appURLs.CATEGORY_CONTENT.replace(
          "{LANGUAGE_CODE}",
          sLanguageCode
        ).replace("{CATEGORY_ID}", sCategoryId)
        .replace("{COUNTRY}",dCountry)
      );
      aPromises.push(oPageDeailPromise);
      //if home is selected and user is logged in and selected item is home
      if (oFirstMenuItem.id === sCategoryId && sAuthToken) {
        const params = {
          headers: {
            Authorization: "Bearer " + sAuthToken
          }
        };
        const oResumablePromise = zeeAxiosUM.get(appURLs.RESUMABLE, params);
        aPromises.push(oResumablePromise);
      }
      dispatch(startLoader());
      Promise.all(aPromises)
        .then(response => {
         //if the item selected is Grid items
          if (
            response[0].data.data.type === "VOD" &&
            response[0].data.data.playlists[0]
          ) {
            //Sort the playlist items based on recent date
            response[0].data.data.playlists[0].content.sort(function(a, b) {
              return new Date(b.insertedAt) - new Date(a.insertedAt);
            });
          }
          dispatch(updatePageContent(response[0].data));

          //if response is having resumable coontent
          if (response[1]) {
            const aUserResumables = response[1].data.data;
            const aQueryURLItems = [];
            const oUserResumablesObject = aUserResumables.reduce(
              (oUserResumablesObject, ele) => {
                oUserResumablesObject[ele.content.id] = ele;
                aQueryURLItems.push(
                  `${ele.content.id}.${ele.content.contentType}`
                );
                return oUserResumablesObject;
              },
              {}
            );
            //Resumable media details
            const oResumableMediaObjects = zeeAxios.get(
              appURLs.RESUMABLE_ITEMS.replace(
                "{LANGUAGE_CODE}",
                sLanguageCode
              ).replace("{QUERY_ITEMS}", aQueryURLItems.join(","))
            );
            oResumableMediaObjects
              .then(response => {
                response.status === CONSTANTS.STATUS_OK &&
                  dispatch(
                    updateResumableContent({
                      oUserResumablesObject,
                      aResumableMedias: response.data.data
                    })
                  );
              })
              .catch(err => {
                dispatch(stopLoader());
                Logger.error(MODULE_NAME, err);
              });
          } else {
            dispatch(
              updateResumableContent({
                oUserResumablesObject: null,
                aResumableMedias: null
              })
            );
          }
        })
        .catch(error => {
          dispatch(stopLoader());
          Logger.error(MODULE_NAME, error);
          apiFailure();
        });
    }
  };
};

export const fnFetchPlanContent = (planid,offset,count
) => {
  return (dispatch, getState) => {
      
    //Get app state
    const dCountry = getState().sCode;
    const oAppState = getState();
    const oFirstMenuItem = oAppState.aMenuItems && oAppState.aMenuItems.data[0];
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    const aPromises = [];

    //Check wheather selected menu item is playlist or not
    // if (sCategoryId === CONSTANTS.MY_PLAYLIST_MENU_ID) {
    //   dispatch(fnFetchMyPlayList(fnMyPlayListLoginFailure));
    // } else {
      // const oPageDeailPromise = zeeAxios.get(
      //   appURLs.CATEGORY_CONTENT.replace(
      //     "{LANGUAGE_CODE}",

      //     sLanguageCode
      //   ).replace("{CATEGORY_ID}", sCategoryId)
      // );
    //  aPromises.push(oPageDeailPromise);
      //if home is selected and user is logged in and selected item is home
      if (sAuthToken) {
        const params = {
          headers: {
            Authorization: "Bearer " + sAuthToken
          }
        };
        const oResumablePromisePlan = zeeAxios.get(appURLs.VIDEO_RESUMABLE
          .replace("{COUNTRY}",dCountry)
          );//+'offset='+offset+'&limit='+count+'&plan='+planid, params
        aPromises.push(oResumablePromisePlan);
        
      // console.log("======"+JSON.stringify(oResumablePromisePlan));
      }
      dispatch(startLoader());
      Promise.all(aPromises)
        .then(response => {
          dispatch(updatePlanContent(response[0])); 
          //if response is having resumable coontent
          if (response) {
            const aUserResumables = response.data;
            const aQueryURLItems = [];
            const oUserResumablesObject = aUserResumables.reduce(
              (oUserResumablesObject, ele) => {
                oUserResumablesObject[ele.content.id] = ele;
                aQueryURLItems.push(
                  `${ele.content.id}.${ele.content.contentType}`
                );
                return oUserResumablesObject;
              },
              {}
            );
            //Resumable media details
            // const oResumableMediaObjects = zeeAxios.get(
            //   appURLs.RESUMABLE_ITEMS.replace(
            //     "{LANGUAGE_CODE}",
            //     sLanguageCode
            //   ).replace("{QUERY_ITEMS}", aQueryURLItems.join(","))
            // );
            // oResumableMediaObjects
            //   .then(response => {
            //     response.status === CONSTANTS.STATUS_OK &&
            //       dispatch(
            //         updateResumableContent({
            //           oUserResumablesObject,
            //           aResumableMedias: response.data
            //         })
            //       );
            //   })
            //   .catch(err => {                
            //     dispatch(stopLoader());
            //     Logger.error(MODULE_NAME, err);
            //   });
          } else {            
            dispatch(
              updateResumableContent({
                oUserResumablesObject: null,
                aResumableMedias: null
              })
            );
          }
        })
        .catch(error => {
          dispatch(stopLoader());
          Logger.error(MODULE_NAME, error);
         // apiFailure();
        });
    //}
  };
};

export const fnFetchMyPlayList = fnMyPlayListLoginFailure => {
  return (dispatch, getState) => {
    dispatch(startLoader());
    const sLocal = getState().locale;
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    if (sAuthToken) {
      const params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };
      const oMyPlayListData = zeeAxiosUM.get(appURLs.MY_PLAYLIST, params);
      oMyPlayListData
        .then(response => {
          if (
            response.status === CONSTANTS.STATUS_OK &&
            response.data.data.length > 0
          ) {
            var myPlayListUrl = `${appURLs.CONTENT_DETAILS.replace(
              "{LANGUAGE_CODE}",
              sLocal
            )}${response.data.data[0].content.id}.${
              response.data.data[0].content.contentType
            }`;
            response.data.data.slice(1).forEach(item => {
              let itemId = item.content.id;
              let type = item.content.contentType;
              myPlayListUrl = myPlayListUrl + `,${itemId}.${type}`;
            });
            const oMyPlayListDataDetails = zeeAxios.get(myPlayListUrl);
            oMyPlayListDataDetails.then(res => {
              dispatch(stopLoader());
              if (res && res.data && res.data.data) {
                const aUserPlayLists = res.data.data;
                dispatch(updateUserPlayListContent(aUserPlayLists));
              } else {
                dispatch(updateUserPlayListContent([]));
              }
            });
          } else {
            dispatch(stopLoader());
            dispatch(updateUserPlayListContent([]));
          }
        })
        .catch(error => {
          Logger.error(MODULE_NAME, error);
          dispatch(stopLoader());
        });
    } else if (typeof fnMyPlayListLoginFailure === "function") {
      fnMyPlayListLoginFailure();
      dispatch(stopLoader());
    }
  };
};

/**
 * Component Name - Action creators
 * method that update page content.
 * @param {object} oPageContent - page content object.
 * @return {dispatch} - dispatch object
 */
const updatePageContent = oPageContent => {
  return {type: actionTypes.UPDATE_PAGE_CONTENT, payload: oPageContent};
};

const updatePlanContent = oPlanContent => {  
  return {type: actionTypes.DISPLAY_PLAN_CONTENT, payload: oPlanContent};

}

/**
 * Component Name - Action creators
 * method that update playlist data.
 * @param {object} aUserPlayList - page content object.
 * @return {dispatch} - dispatch object
 */
const updateUserPlayListContent = aUserPlayList => {
  return {
    type: actionTypes.UPDATE_USER_PLAYLIST_PAGE_CONTENT,
    payload: aUserPlayList
  };
};

/**
 * Component Name - Action creators
 * method that update page content.
 * @param {object} oResumableContent - resumable content object.
 * @return {dispatch} - dispatch object
 */
const updateResumableContent = oResumableContent => {
  return {
    type: actionTypes.UPDATE_RESUMABLE_CONTENT,
    payload: oResumableContent
  };
};
/**
 * Component Name - Action creators
 * method to fetch video content for selected video item in bucket
 * @param {string} sLanguageCode - selected language code.
 * @param {string} sVideoId - video Id.
 * @param {string} sVideoType - video type.
 * @return {fuunction} - thunk function to operate asynchronous code
 */
export const fnFetchBucketSelectedItemContent = (
  sLanguageCode,
  sVideoId,
  sVideoType,
  sCountry,
  sBucketTitle,
  fnSuccess
) => {
  return dispatch => {
    dispatch(startVideoInfoLoader());
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };
    }

    const oBackDropPromise = zeeAxios.get(
      appURLs.BACKDROP_VIDEO_CONTENT.replace("{LANGUAGE_CODE}", sLanguageCode)
        .replace("{TYPE}", sVideoType)
        .replace("{ID}", sVideoId)
        .replace("{COUNTRY}", sCountry)
        .replace("{CASCADE_NO}", sVideoType === "series" ? "3" : "2")
    );
    const oVideoRatingPromise = zeeAxiosUM.get(
      appURLs.VIDEO_RATING_CONTENT.replace("{TYPE}", sVideoType).replace(
        "{ID}",
        sVideoId
      ),
      params
    );
    fnUpdateUserPlayListData(dispatch);
    Promise.all([oBackDropPromise, oVideoRatingPromise])
      .then(response => {
        //This is used to get first episode number for image play button click
        if (typeof fnSuccess === "function" && sBucketTitle === "") {
          fnSuccess(response[0].data.data.seasons[0].episodes[0]);
        }
        response[0].data.data.averageRating =
          response[1].data.data.content.averageRating;
        response[1].data.data.userData &&
          response[1].data.data.userData.rating &&
          (response[0].data.data.averageRating =
            response[1].data.data.userData.rating);
        response[0].data.data.ar_title = response[1].data.data.content.title;
        dispatch(
          updateSelectedBucketItemContent(response[0].data, sBucketTitle)
        );
      })
      .catch(error => {
        dispatch(stopVideoInfoLoader());
        Logger.error(MODULE_NAME, error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that update the video info content for bucket selected video.
 * @param {object} oPageContent - page content object.
 * @return {dispatch} - dispatch object
 */
export const updateSelectedBucketItemContent = (
  oVideoContent,
  sBucketTitle
) => {
  return {
    type: actionTypes.UPDATE_BUCKET_ITEM_VIDEO_INFO,
    payload: {oVideoContent, sBucketTitle}
  };
};

/**
 * Component Name - Action creators
 * method that update the video detail loader to true
 * @param null
 * @return {dispatch} - dispatch object
 */
export const startVideoDetailLoader = () => {
  return {type: actionTypes.START_VIDEO_DETAIL_LOADER};
};
/**
 * Component Name - Action creators
 * method that update the video detail loader to false
 * @param null
 * @return {dispatch} - dispatch object
 */
export const stopVideoDetailLoader = () => {
  return {type: actionTypes.STOP_VIDEO_DETAIL_LOADER};
};

/**
 * Component Name - Action creators
 * method to fetch video content for selected video item in video details page
 * @param {string} sLanguageCode - selected language code.
 * @param {string} sVideoId - video Id.
 * @param {string} sVideoType - video type.
 * @param {string} sCountry - cuontry code.
 * @return {fuunction} - thunk function to operate asynchronous code
 */
export const fnFetchSelectedVideoItemContent = (
  sLanguageCode,
  sVideoId,
  sVideoType,
  sCountry,
  fnSuccess
) => {
  return dispatch => {
    dispatch(startVideoDetailLoader());
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };
    }
    //Video details
    const aPromises = [];
    const oVideoContentPromise = zeeAxios.get(      
        // appURLs.BACKDROP_VIDEO_CONTENT.replace("{LANGUAGE_CODE}", sLanguageCode)
        //   .replace("{TYPE}", sVideoType)
        //   .replace("{ID}", sVideoId)
        //   .replace("{COUNTRY}", sCountry)
        //   .replace("{CASCADE_NO}", sVideoType === "series" ? "3" : "2")
        (sVideoType !== 'series')?
        (sLanguageCode+'/contents/moviedetails?Country='+sCountry+'&contentkey='+sVideoId )
        : (appURLs.BACKDROP_VIDEO_CONTENT.replace("{LANGUAGE_CODE}", sLanguageCode)
           .replace("{TYPE}", sVideoType)
           .replace("{ID}", sVideoId)
           .replace("{COUNTRY}", sCountry)
           .replace("{CASCADE_NO}", sVideoType === "series" ? "3" : "2"))
      
    );
    //Video rating
    const oVideoRatingPromise = zeeAxiosUM.get(
      appURLs.VIDEO_RATING_CONTENT.replace("{TYPE}", sVideoType).replace(
        "{ID}",
        sVideoId
      ),
      params
    );
    aPromises.push(oVideoContentPromise);
    aPromises.push(oVideoRatingPromise);
    //playlist

    if (sAuthToken) {
      const oUserPlayListPromise = zeeAxiosUM.get(
        appURLs.PROFILE_PLAYLIST,
        params
      );
      aPromises.push(oUserPlayListPromise);
    }

    Promise.all(aPromises)
      .then(response => {
        if (response[1].status === CONSTANTS.STATUS_OK) {
          response[0].data.data.averageRating =
            response[1].data.data.content.averageRating;
          response[0].data.data.ar_title = response[1].data.data.content.title;
          response[1].data.data.userData &&
            response[1].data.data.userData.rating &&
            (response[0].data.data.averageRating =
              response[1].data.data.userData.rating);
        } else {
          response[0].data.data.averageRating = null;
          response[0].data.data.ar_title = "";
        }

        //Fetch related video contents
        const dCode = store.getState().sCode;
        const sQuery =
          response[0].data.data.genres && response[0].data.data.genres[0]==undefined?"drama":(response[0].data.data.genres && response[0].data.data.genres[0]);
        fnFetchRelatedVideoContent(
          sLanguageCode,
          sVideoId,
          sVideoType,
          sQuery,
          dCode,
          aRelatedVideoContent => {
            if (typeof fnSuccess === "function") fnSuccess();
            dispatch(
              updateSelectedVideoItemContent({
                oVideoContent: response[0].data,
                aRelatedVideos: aRelatedVideoContent[0].data.data,
                aRelatedVideosWithType: aRelatedVideoContent[1]
                  ? aRelatedVideoContent[1].data.data
                  : null,
                aUserPlayList:
                  response[2] && response[2].data ? response[2].data.data : []
              })
            );
          }
        );
      })
      .catch(error => {
        dispatch(stopVideoDetailLoader());
        Logger.error(MODULE_NAME, error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that update the video detail content for detail page.
 * @param {object} oVideoContent - video deail and related video content
 * @return {dispatch} - dispatch object
 */
export const updateSelectedVideoItemContent = oVideoContent => {
  return {
    type: actionTypes.UPDATE_VIDEO_ITEM_VIDEO_CONTENT,
    payload: oVideoContent
  };
};

/**
 * Component Name - Action creators
 * method that fetches the related video contents
 * @param {String} sLanguageCode - Language code
 * @param {String} sVideoId - video ID
 * @param {String} sVideoType - video type
 * @param {String} sQuery - query string
 * @param {function} fnSuccess - success callback
 * @param {function} fnError - failure callback
 * @return {undefined}
 */
const fnFetchRelatedVideoContent = (
  sLanguageCode,
  sVideoId,
  sVideoType,
  sQuery,
  dCode,
  fnSuccess,
  fnError
) => {
  let aRelatedPromises = [];
  const aRelatedVideosPromise = zeeAxios.get(
    appURLs.RELATED_VIDEOS.replace("{LANGUAGE_CODE}", sLanguageCode)
      .replace("{QUERY}", sQuery)
      .replace("{ID}", sVideoId)
      .replace("{COUNTRY}", dCode)
  );
  aRelatedPromises.push(aRelatedVideosPromise);
  if (sVideoType === CONSTANTS.MOVIE) {
    const aTypeRelatedVideosPromise = zeeAxios.get(
      appURLs.RELATED_VIDEOS_WITH_TYPE.replace("{LANGUAGE_CODE}", sLanguageCode)
        .replace("{QUERY}", sQuery)
        .replace("{ID}", sVideoId)
        .replace("{TYPE}", sVideoType)
        .replace("{COUNTRY}",dCode)
               
    );
    aRelatedPromises.push(aTypeRelatedVideosPromise);
  }

  //Fetch related video contents
  Promise.all(aRelatedPromises)
    .then(response => {
      typeof fnSuccess === "function" && fnSuccess(response);
    })
    .catch(error => {
      typeof fnError === "function" && fnError(error);
    });
};

/**
 * Component Name - Action creators
 * method that fetches the episodes of series
 * @param {String} sLanguageCode - Language code
 * @param {String} sVideoId - video ID
 * @param {String} sVideoType - video type
 * @param {String} aGenre - query string
 * @return {undefined}
 */
export const fnFetchSeriesEpisodes = (
  sLanguageCode,
  sSeriesId,
  country,
  fnSuccess
) => {
  return dispatch => {
    const aRelatedVideosPromise = zeeAxios.get(
      appURLs.SERIES_DETAILS.replace("{LANGUAGE_CODE}", sLanguageCode)
        .replace("{SERIES_ID}", encodeURIComponent(sSeriesId))
        .replace("{COUNTRY}", country)
    );
    aRelatedVideosPromise
      .then(response => {
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.seasons &&
          response.data.data.seasons.length > 0
        ) {
          dispatch(updateRelatedVideos(response.data.data.seasons[0].episodes));
          if (typeof fnSuccess === "function") {
            fnSuccess(response.data.data);
          }
        }
      })
      .catch(error => {
        console.log(error);
        //dispatch();
      });
  };
};

/**
 * Component Name - Action creators
 * method that fetches the related video contents
 * @param {String} sLanguageCode - Language code
 * @param {String} sVideoId - video ID
 * @param {String} sVideoType - video type
 * @param {String} aGenre - query string
 * @return {undefined}
 */
export const fnFetchRelatedVideos = (
  sLanguageCode,
  sVideoId,
  sVideoType,
  aGenre
) => {
  return (dispatch,getState) => {
    const dCountry = getState().sCode;
    let aAllRelatedVideosPromise = [];
    aGenre.forEach(genre => {      
      const aRelatedVideosPromise = zeeAxios.get(
        appURLs.RELATED_VIDEOS_WITH_TYPE.replace(
          "{LANGUAGE_CODE}",
          sLanguageCode
        )
          .replace("{QUERY}", encodeURIComponent(genre))
          .replace("{ID}", sVideoId)
          .replace("{TYPE}", sVideoType)
          .replace("{COUNTRY}", dCountry)
      );
      aAllRelatedVideosPromise.push(aRelatedVideosPromise);
    });
    Promise.all(aAllRelatedVideosPromise)
      .then(response => {
        let relatedVideos = [];
        if (response[0] && response[0].data && response[0].data.data) {
          relatedVideos = response[0].data.data;
        }
        if (response[1] && response[1].data && response[1].data.data) {
          relatedVideos = relatedVideos.concat(response[1].data.data);
        }
        dispatch(updateRelatedVideos(relatedVideos));
      })
      .catch(() => {
        dispatch();
      });
  };
};

/**
 * Component Name - Action creators
 * method that update the related videos for selected video.
 * @param {object} oPageContent - related videos object.
 * @return {dispatch} - dispatch object
 */
const updateRelatedVideos = relatedVideos => {
  return {
    type: actionTypes.UPDATE_RELATED_VIDEOS,
    payload: {relatedVideos}
  };
};

/**
 * Component Name - Action creators
 * method to fetch video url details for selected video
 * @param {string} sLanguageCode - selected language code.
 * @param {string} sVideoId - video Id.
 * @param {string} sVideoType - video type.
 * @return {function} - function to operate asynchronous code
 */
export const fnFetchVideoUrlDetails = (
  sLanguageCode,
  sVideoId,
  sVideoType,
  sCountry,
  fnSuccess
) => {
  return (dispatch, getState) => {
    dispatch(startLoader());

    // const oVideoInfo = zeeAxios.get(
    //   appURLs.BACKDROP_VIDEO_CONTENT.replace("{LANGUAGE_CODE}", sLanguageCode)
    //     .replace("{TYPE}", sVideoType)
    //     .replace("{ID}", sVideoId)
    //     .replace("{COUNTRY}", sCountry)
    //     .replace("{CASCADE_NO}", sVideoType === "series" ? "3" : "2")
    // );
    const oVideoInfo = zeeAxios.get((sVideoType=='episode')?
              ( appURLs.BACKDROP_VIDEO_CONTENT_EPISODE.replace("{LANGUAGE_CODE}", sLanguageCode)
              .replace("{TYPE}", sVideoType)
              .replace("{ID}", sVideoId)
              .replace("{COUNTRY}", sCountry)
              .replace("{CASCADE_NO}", sVideoType === "series" ? "3" : "2")):(sVideoType !== 'series')?
              (sLanguageCode+'/contents/moviedetails?Country='+sCountry+'&contentkey='+sVideoId )
              : (appURLs.BACKDROP_VIDEO_CONTENT.replace("{LANGUAGE_CODE}", sLanguageCode)
                 .replace("{TYPE}", sVideoType)
                 .replace("{ID}", sVideoId)
                 .replace("{COUNTRY}", sCountry)
                 .replace("{CASCADE_NO}", sVideoType === "series" ? "3" : "2")))

    const state = getState();

    if (
      state.platformConfig &&
      state.platformConfig.default &&
      state.platformConfig.default["1.0"] &&
      state.platformConfig.default["1.0"].videoapi
    ) {
      const url = state.platformConfig.default["1.0"].videoapi;
      oVideoInfo
        .then(infoResponse => {
          if (infoResponse && infoResponse.data && infoResponse.data.data) {
            const videoInfoPromise = zeeAxios.get(
              url + infoResponse.data.data.video_id
            );
            videoInfoPromise
              .then(response => {
                fnSuccess({videoInfo: infoResponse, urlInfo: response.data});
                dispatch(
                  updateVideoUrlContent({
                    videoInfo: infoResponse,
                    urlInfo: response.data
                  })
                );
              })
              .catch(error => {
                dispatch(stopLoader());
                Logger.error(MODULE_NAME, error);
              });
          } else {
            dispatch(stopLoader());
          }
        })
        .catch(error => {
          dispatch(stopLoader());
          Logger.error(MODULE_NAME, error);
        });
    }
  };
};

/**
 * Component Name - Action creators
 * method to fetch video url details for selected video
 * @return {function} - function to operate asynchronous code
 */
export const fnResetVideoUrlDetails = () => {
  return dispatch => {
    dispatch(updateVideoUrlContent(null));
  };
};

/**
 * Component Name - Action creators
 * method that update the video content for selected video.
 * @param {object} oPageContent - page content object.
 * @return {dispatch} - dispatch object
 */
const updateVideoUrlContent = videoInfo => {
  return {
    type: actionTypes.UPDATE_ITEM_VIDEO_INFO,
    payload: {videoInfo}
  };
};

/**
 * Component Name - Action creators
 * method to fetch video url details for selected video
 * @param {Object} oCredentials - Credentials TO Backend.
 * @return {fuunction} - function to operate asynchronous code
 */
export const fnSendLoginCredentials = (oCredentials, fnSuccess, fnError) => {
  return dispatch => {
    const requestBodyDetails = common.creatingRequestBodySignIn(
      oCredentials,
      CONSTANTS.GRANT_TYPE_PASSWORD
    );
    const encodedUrl = common.SerializePostCall(requestBodyDetails);
    const oLoginServiceCall = zeeAxiosUM.post(appURLs.LOGIN_TOKEN, encodedUrl, {
      headers: {"Content-Type": "application/x-www-form-urlencoded"}
    });
    oLoginServiceCall
      .then(loginResponse => {
        if (loginResponse.status === CONSTANTS.STATUS_OK) {
          const userDetails = zeeAxiosUM.get(appURLs.USER_DETAILS, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `bearer ${loginResponse.data.access_token}`
            }
          });
          userDetails.then(userDetails => {
            loginResponse.bSuccessful =
              loginResponse.status === CONSTANTS.STATUS_OK;
            loginResponse.userDetails = userDetails.data.data;
            dispatch(updateLoginCredentials(loginResponse));
            if (
              typeof fnSuccess === "function" &&
              loginResponse.status === CONSTANTS.STATUS_OK
            ) {
              const _userObj = common.creatingUserObjectForCookies(
                userDetails.data.data
              );
              const _userToken = common.creatingUserTokenForCookies(
                loginResponse.data
              );
              common.saveUserDetails(_userObj, _userToken);
              dispatch(stopLoader());
              fnSuccess(loginResponse);
            }
          });
        } else {
          dispatch(stopLoader());
          if (typeof fnError === "function") {
            fnError(loginResponse);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
        Logger.error(MODULE_NAME, "Error", error);
      });
  };
};

/**
 * Component Name - Action creators
 * method to fetch video url details for selected video
 * @param {Object} oCredentials - Credentials TO Backend.
 * @return {fuunction} - function to operate asynchronous code
 */
export const fnVerifyEmail = (data, fnSuccess, fnError) => {
  return dispatch => {
    const serviceCall = zeeAxiosUM.post(appURLs.VERIFY_EMAIL, data, {
      headers: {"Content-Type": "application/json"}
    });
    dispatch(startLoader());
    serviceCall
      .then(response => {
        if (response.status === CONSTANTS.STATUS_OK) {
          fnSuccess(response);
        } else {
          dispatch(stopLoader());
          if (typeof fnError === "function") {
            fnError(response);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        Logger.error(MODULE_NAME, "Error", error);
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * method to fetch video url details for selected video
 * @param {Object} oCredentials - Credentials TO Backend.
 * @return {fuunction} - function to operate asynchronous code
 */
export const resendVerificationEmail = (data, fnSuccess, fnError) => {
  return dispatch => {
    const serviceCall = zeeAxiosUM.post(
      appURLs.RESEND_VERIFICATION_EMAIL,
      data,
      {
        headers: {"Content-Type": "application/json"}
      }
    );
    dispatch(startLoader());
    serviceCall
      .then(response => {
        dispatch(stopLoader());
        if (response.status === CONSTANTS.STATUS_OK) {
          fnSuccess(response);
        } else {
          dispatch(stopLoader());
          if (typeof fnError === "function") {
            fnError(response);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        Logger.error(MODULE_NAME, "Error", error);
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * method to fetch video url details for selected video
 * @param {Object} oCredentials - Credentials TO Backend.
 * @return {fuunction} - function to operate asynchronous code
 */
export const updatePasswordOTP = (data, fnSuccess, fnError) => {
  return dispatch => {
    const serviceCall = zeeAxiosUM.post(appURLs.UPDATE_PASSWORD_OTP, data, {
      headers: {"Content-Type": "application/json"}
    });
    dispatch(startLoader());
    serviceCall
      .then(response => {
        dispatch(stopLoader());
        if (response.status === CONSTANTS.STATUS_OK) {
          fnSuccess(response);
        } else {
          dispatch(stopLoader());
          if (typeof fnError === "function") {
            fnError(response);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        Logger.error(MODULE_NAME, "Error", error);
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * method to fetch video url details for selected video
 * @param {Object} oCredentials - Credentials TO Backend.
 * @return {fuunction} - function to operate asynchronous code
 */
export const sendOTPCode = (data, fnSuccess, fnError) => {
  return dispatch => {
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    const serviceCall = zeeAxiosUM.post(appURLs.SEND_OTP_CODE, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sAuthToken
      }
    });
    dispatch(startLoader());
    serviceCall
      .then(response => {
        dispatch(stopLoader());
        if (response.status === CONSTANTS.STATUS_OK) {
          fnSuccess(response);
        } else {
          dispatch(stopLoader());
          if (typeof fnError === "function") {
            fnError(response);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        Logger.error(MODULE_NAME, "Error", error);
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * method that update the login content for the User.
 * @param {object} loginResponse - loginResponse object.
 * @return {dispatch} - dispatch object
 */
const updateLoginCredentials = oResponse => {
  return {
    type: actionTypes.UPDATE_LOGIN_INFO,
    payload: oResponse
  };
};

/**
 * Component Name - Action creators
 * method that update the log out details of the user.
 * @return {dispatch} - dispatch object
 */
export const fnSaveNewUserDetails = oNewUserDetails => {
  return {
    type: actionTypes.SAVE_NEW_USER_INFO,
    payload: oNewUserDetails
  };
};

/**
 * Component Name - Action creators
 * method that update the log out details of the user.
 * method to fetch twitter oauth token
 * @return {function} - function to operate asynchronous code
 */
export const fnGetTwitterToken = langCode => {
  return dispatch => {
    dispatch(startLoader());
    // en version is added in twitter developer
    // LANGUAGE_CODE
    const oLoginServiceCall = zeeAxios.get(
      appURLs.TWITTER_OAUTH_TOKEN.replace("{CALLBACK}", window.location.href)
        .replace("{LANGUAGE_CODE}", langCode)
        .replace("login", "twitter-token")
        .replace("sign-up", "twitter-token")
    );
    oLoginServiceCall
      .then(oResponse => {
        dispatch(stopLoader());
        dispatch(updateTwitterOauth(oResponse.data.data));
      })
      .catch(error => {
        Logger.error(MODULE_NAME, "Error", error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that resets twitter token
 * @return {function} - function to operate asynchronous code
 */
export const resetTwitterToken = () => {
  return dispatch => {
    dispatch(updateTwitterOauth(null));
  };
};

/**
 * Component Name - Action creators
 * method that update the twitter oauth
 * @param {object} loginResponse - loginResponse object.
 * @return {dispatch} - dispatch object
 */
const updateTwitterOauth = oResponse => {
  return {
    type: actionTypes.GET_TWITTER_TOKEN,
    payload: oResponse
  };
};

/**
 * Component Name - Action creators
 * method to fetch twitter oauth token
 * @return {function} - function to operate asynchronous code
 */
export const fnGetTwitterAccessToken = (token, verifier, languageCode) => {
  return dispatch => {
    const oLoginServiceCall = zeeAxios.get(
      appURLs.TWITTER_ACCESS_TOKEN.replace("{TOKEN}", token)
        .replace("{VERIFIER}", verifier)
        .replace("{LANGUAGE_CODE}", languageCode)
    );
    oLoginServiceCall
      .then(oResponse => {
        dispatch(updateTwitterAccess(oResponse.data.data));
      })
      .catch(error => {
        Logger.error(MODULE_NAME, "Error", error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that update the log out details of the user.
 * @return {dispatch} - dispatch object
 */
export const fnForLogOut = () => {
  common.deleteCookie(CONSTANTS.COOKIE_USER_OBJECT);
  common.deleteCookie(CONSTANTS.COOKIE_USER_TOKEN);
  fnUpdateUserSubscription(false);
  return {
    type: actionTypes.UPDATE_LOG_OUT_INFO,
    payload: {}
  };
};

/**
 * Component Name - Action creators
 * method that update the twitter oauth
 * @param {object} loginResponse - loginResponse object.
 * @return {dispatch} - dispatch object
 */
const updateTwitterAccess = oResponse => {
  return {
    type: actionTypes.GET_TWITTER_ACCESS_TOKEN,
    payload: oResponse
  };
};

/**
 * Component Name - Action creators
 * method to fetch video url details for selected video
 * @param {Object} oCredentials - Credentials TO Backend.
 * @return {fuunction} - function to operate asynchronous code
 */
export const fnSendNewUserDetails = (
  oCreateAcctUserData,
  fnCreateAcctSuccessful,
  fnCreateAcctError
) => {
  return dispatch => {
    dispatch(startLoader());
    const requestBodyDetails = common.creatingRequestBodySignUp(
      oCreateAcctUserData
    );
    let url = "";
    if (requestBodyDetails.email) {
      url = appURLs.REGISTER_EMAIL;
    } else if (requestBodyDetails.phonenumber) {
      url = appURLs.REGISTER_MOBILE;
    }
    const oCreateAcctNewUser = zeeAxiosUM.post(url, requestBodyDetails, {
      headers: {"Content-Type": "application/json"}
    });
    oCreateAcctNewUser
      .then(userCreatedResponse => {
        dispatch(stopLoader());
        if (
          typeof fnCreateAcctSuccessful === "function" &&
          userCreatedResponse.status === CONSTANTS.STATUS_OK
        ) {
          fnCreateAcctSuccessful();
        } else {
          if (typeof fnCreateAcctError === "function") {
            fnCreateAcctError(userCreatedResponse);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnCreateAcctError === "function") {
          fnCreateAcctError(error);
        }
      });
  };
};
/**
 * Component Name - Action creators
 * method to fetch video url details for selected video
 * @param {Object} oUserEmailDetail - User Email TO Backend.
 * @return {function} - function to operate asynchronous code
 */
export const fnForgotPasswordCall = (
  oUserEmailDetail,
  sLocale,
  fnSuccessForgotPassword,
  fnFailForgotPassword
) => {
  return dispatch => {
    dispatch(startLoader());
    let oForgotPasswordUserEmailDetails = {email: oUserEmailDetail};
    const oForgotPasswordUser = zeeAxiosUM.put(
      appURLs.FORGOT_PASSWORD,
      oForgotPasswordUserEmailDetails,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": sLocale
        }
      }
    );

    oForgotPasswordUser
      .then(oForgotPasswordUserResponse => {
        dispatch(stopLoader());
        if (
          oForgotPasswordUserResponse.status === CONSTANTS.STATUS_ACCEPTED &&
          typeof fnSuccessForgotPassword === "function"
        ) {
          dispatch(
            fnForgotPasswordUserDetails(oForgotPasswordUserEmailDetails)
          );
          fnSuccessForgotPassword();
        } else {
          typeof fnFailForgotPassword === "function" &&
            fnFailForgotPassword(oForgotPasswordUserResponse);
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        console.log(error);
        typeof fnFailForgotPassword === "function" &&
          fnFailForgotPassword(error);
      });
  };
};

export const fnForgotPasswordUserDetails = oForgotPasswordUserEmailDetails => {
  return {
    type: actionTypes.GET_FORGOT_PASSWORD_USER_DETAILS,
    payload: oForgotPasswordUserEmailDetails
  };
};

export const setLoginToHome = redirect => {
  return {
    type: actionTypes.LOGIN_TO_HOME,
    payload: redirect
  };
};

/**
 * Component Name - Action creators
 * method to reset password
 * @param {Object} oUserEmailDetail - User Email TO Backend.
 * @return {function} - function to operate asynchronous code
 */
export const fnResetPassword = (
  oUserEmailDetail,
  fnSuccessForgotPassword,
  fnFailForgotPassword
) => {
  return dispatch => {
    dispatch(startLoader());
    let resetPasswordData = {
      email: oUserEmailDetail.email,
      resetPasswordToken: oUserEmailDetail.resetPasswordToken,
      password: oUserEmailDetail.password
    };
    const oForgotPasswordUser = zeeAxiosUM.post(
      appURLs.RESET_PASSWORD,
      resetPasswordData,
      {headers: {"Content-Type": "application/json"}}
    );
    oForgotPasswordUser
      .then(oForgotPasswordUserResponse => {
        dispatch(stopLoader());
        if (
          oForgotPasswordUserResponse.status === CONSTANTS.STATUS_OK &&
          typeof fnSuccessForgotPassword === "function"
        ) {
          fnSuccessForgotPassword();
        } else {
          typeof fnFailForgotPassword === "function" &&
            fnFailForgotPassword(oForgotPasswordUserResponse);
        }
      })
      .catch(error => {
        console.log(error);
        dispatch(stopLoader());
        typeof fnFailForgotPassword === "function" &&
          fnFailForgotPassword(error);
      });
  };
};

/**
 * Component Name - Action creators
 * method to fetch User Details using Auth Token of Facebook.
 * @param {Object} oFacebookLoginResponse - Response From Facebook.
 * @return {function} - function to operate asynchronous code
 */
export const fnSendSocialLoginResponse = (
  oFacebookLoginResponse,
  grantType,
  fnSuccess,
  fnError
) => {
  return dispatch => {
    const requestBodyDetails = common.creatingRequestBodySignIn(
      oFacebookLoginResponse,
      grantType
    );
    const encodedUrl = common.SerializePostCall(requestBodyDetails);
    const oFacebookSWeyyakerviceCall = zeeAxiosUM.post(
      appURLs.LOGIN_FACEBOOK_USER,
      encodedUrl,
      {headers: {"Content-Type": "application/x-www-form-urlencoded"}}
    );
    oFacebookSWeyyakerviceCall.then(weyyakResponse => {
      const _userObj = common.creatingUserObjectForFacebookCookies(
        oFacebookLoginResponse
      );
      const _userToken = common.creatingUserTokenForCookies(
        weyyakResponse.data
      );
      common.saveUserDetails(_userObj, _userToken);
      oFacebookLoginResponse.bSuccessful = true;
      oFacebookLoginResponse.userDetails = {
        firstName: oFacebookLoginResponse.name,
        email: oFacebookLoginResponse.email
      };
      if (grantType === CONSTANTS.GRANT_TYPE_TWITTER) {
        const userDetails = zeeAxiosUM.get(appURLs.USER_DETAILS, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `bearer ${_userToken.authToken}`
          }
        });

        userDetails
          .then(userDetails => {
            const _userObj = common.creatingUserObjectForCookies(
              userDetails.data.data
            );
            common.setCookie(
              CONSTANTS.COOKIE_USER_OBJECT,
              JSON.stringify(_userObj),
              CONSTANTS.INFINITE_COOKIE_TIME
            );
            if (fnSuccess) {
              fnSuccess();
            }
          })
          .catch(() => {
            if (fnError) {
              fnError();
            }
          });
      } else {
        dispatch(fnSendSocialTokenResponse(oFacebookLoginResponse));
        fnSuccess();
      }
    });
  };
};

/**
 * Component Name - Action creators
 * method that will handle the Facebook response for the User.
 * @param {object} oFbResponse - Facebook Response object.
 * @return {dispatch} - dispatch object
 */
const fnSendSocialTokenResponse = oFbResponse => {
  return {
    type: actionTypes.UPDATE_FACEBOOK_LOGIN_INFO,
    payload: oFbResponse
  };
};

/**
 * Component Name - Action creators
 * method to add item to playlist
 * @param {String} sLanguageCode - Language Code.
 * @param {String} sItemId - Item id.
 * @param {String} sItemType - Item type.
 * @return {fuunction} - function to operate asynchronous code
 */
export const fnAddItemToPlayList = (
  sLanguageCode,
  sItemId,
  sItemType,
  sTitle,
  sTarget,
  fnAnUtherisedHanlder,
  fnSuccess,
  fnFailure
) => {
  return dispatch => {
    const data = {
      id: sItemId,
      title: sTitle,
      contentType: sItemType,
      genres: []
    };
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };
    }

    const oRemoveItemPromise = zeeAxiosUM.post(
      appURLs.ADD_TO_PLAYLIST,
      data,
      params
    );
    oRemoveItemPromise
      .then(response => {
        if (
          !response.status &&
          response.response.status === CONSTANTS.STATUS_UNAUTHORISED
        ) {
          typeof fnAnUtherisedHanlder === "function" && fnAnUtherisedHanlder();
        } else {
          //upate user playlist daata
          if (
            response &&
            ((response.response && response.response.status === 200) ||
              response.status === 200)
          ) {
            fnUpdateUserPlayListData(
              dispatch,
              sLanguageCode,
              () => {
                typeof fnSuccess === "function" && fnSuccess();
              },
              () => {
                typeof fnSuccess === "function" && fnSuccess();
              }
            );
          } else {
            typeof fnFailure === "function" && fnFailure();
          }
        }
      })
      .catch(error => {
        dispatch(stopVideoDetailLoader());
        Logger.error(MODULE_NAME, error);
        typeof fnFailure === "function" && fnFailure();
      });
  };
};

/**
 * Component Name - Action creators
 * method to remove item from playlist
 * @param {String} sLanguageCode - Language Code.
 * @param {String} sItemId - Item id.
 * @param {String} sItemType - Item type.
 * @return {fuunction} - function to operate asynchronous code
 */
export const fnRemoveItemFromPlayList = (
  sLanguageCode,
  sItemId,
  sItemType,
  sTarget,
  fnAnUtherisedHanlder,
  fnSuccess,
  fnFailure
) => {
  return dispatch => {
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };
    }
    const oRemoveItemPromise = zeeAxiosUM.delete(
      appURLs.REMOVE_FROM_PLAYLIST.replace("{ID}", sItemId).replace(
        "{TYPE}",
        sItemType
      ),
      params
    );
    oRemoveItemPromise
      .then(response => {
        if (
          !response.status &&
          response.response.status === CONSTANTS.STATUS_UNAUTHORISED
        ) {
          typeof fnAnUtherisedHanlder === "function" && fnAnUtherisedHanlder();
        } else {
          //upate user playlist data
          if (
            response &&
            ((response.response && response.response.status === 200) ||
              response.status === 200)
          ) {
            fnUpdateUserPlayListData(
              dispatch,
              sLanguageCode,
              () => {
                typeof fnSuccess === "function" && fnSuccess();
              },
              () => {
                typeof fnSuccess === "function" && fnSuccess();
              }
            );
          } else {
            typeof fnFailure === "function" && fnFailure();
          }
        }
      })
      .catch(error => {
        dispatch(stopVideoDetailLoader());
        Logger.error(MODULE_NAME, error);
        typeof fnFailure === "function" && fnFailure();
      });
  };
};

/**
 * Component Name - Action creators
 * method to update playlist data
 * @param {String} sLanguageCode - Language Code.
 * @return {undefined}
 */
export const fnUpdateUserPlayListData = (
  dispatch,
  sLanguageCode,
  fnSuccess,
  fnError
) => {
  const oUserToken = JSON.parse(common.getCookie(CONSTANTS.COOKIE_USER_TOKEN));
  const sAuthToken = oUserToken ? oUserToken.authToken : null;
  let params = {};
  if (sAuthToken) {
    params = {
      headers: {
        Authorization: "Bearer " + sAuthToken
      }
    };

    const oUserPlayListPromise = zeeAxiosUM.get(
      appURLs.PROFILE_PLAYLIST,
      params
    );
    oUserPlayListPromise
      .then(response => {
        dispatch(fnUpdateUserPlayList(response.data ? response.data.data : []));
        if (fnSuccess && typeof fnSuccess === "function") {
          fnSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch(stopVideoDetailLoader());
        if (fnError && typeof fnError === "function") {
          fnError();
        }
        Logger.error(MODULE_NAME, error);
      });
  }
};

/**
 * Component Name - Action creators
 * method to update playlist data
 * @param {String} sLanguageCode - Language Code.
 * @return {undefined}
 */
export const fnGetUserPlayListData = () => {
  return dispatch => {
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };

      const oUserPlayListPromise = zeeAxiosUM.get(
        appURLs.PROFILE_PLAYLIST,
        params
      );
      oUserPlayListPromise
        .then(response => {
          dispatch(
            fnUpdateUserPlayList(response.data ? response.data.data : [])
          );
        })
        .catch(error => {
          Logger.error(MODULE_NAME, error);
        });
    }
  };
};

/**
 * Component Name - Action creators
 * method that update the video content for selected video.
 * @param {object} oPageContent - page content object.
 * @return {dispatch} - dispatch object
 */
const fnUpdateUserPlayList = aUserPlayList => {
  return {
    type: actionTypes.UPDATE_USER_PLAYLIST,
    payload: aUserPlayList
  };
};

/**
 * Component Name - Action creators
 * method that returns new access token.
 * @param {null}
 * @return {Promise} - Promise that returns access token
 */
export const fetchAccessToken = sRefreshToken => {
  //Promise to fetch new access token
  return dispatch => {
    return new Promise((resolve, reject) => {
      const bodyLoginCredentials = {
        grant_type: "refresh_token",
        refresh_token: sRefreshToken
      };
      var encodedUrl = common.SerializePostCall(bodyLoginCredentials);
      const oNewAccessTokenPromise = zeeAxiosUM.post(
        appURLs.LOGIN_TOKEN,
        encodedUrl,
        {
          headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }
      );
      oNewAccessTokenPromise
        .then(loginResponse => {
          if (loginResponse.status === CONSTANTS.STATUS_OK) {
            const {
              data: {access_token, refresh_token, user_id}
            } = loginResponse;
            const _userToken = common.creatingUserTokenForCookies({
              access_token,
              refresh_token,
              user_id
            });
            // const _remberMe = JSON.parse(
            //   common.getCookie(CONSTANTS.COOKIE_REMEMBER_ME)
            // );
            // let cookiesTimeOut = _remberMe.isRememberMe
            //   ? CONSTANTS.COOKIES_TIMEOUT_REMEMBER
            //   : CONSTANTS.COOKIES_TIMEOUT_NOT_REMEMBER;
            const cookiesTimeOut = CONSTANTS.INFINITE_COOKIE_TIME;
            Logger.log(MODULE_NAME, "userid: " + _userToken.user_id);
            common.setCookie(
              CONSTANTS.COOKIE_USER_TOKEN,
              JSON.stringify(_userToken),
              cookiesTimeOut
            );
            resolve(access_token);
          } else {
            reject(loginResponse);
          }
        })
        .catch(error => {
          Logger.error(MODULE_NAME, error);
          reject(error);
        });
    });
  };
};

/**
 * Component Name - Action creators
 * method to change user rating for a item
 * @param {String} sLanguageCode - Language Code.
 * @param {String} sItemId - Item id.
 * @param {String} sItemType - Item type.
 * @param {String} sTitle - Item title.
 * @param {String} sRating - selected rating.
 * @return {function} - dispatch function for async reuquests
 */
export const fnChangeRating = (
  sLanguageCode,
  sItemId,
  sItemType,
  sTitle,
  sRating,
  sTarget,
  fnSuccess,
  dontFetchDetails
) => {
  return dispatch => {
    //dispatch(startVideoDetailLoader());
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };
    }
    const data = {
      content: {
        id: sItemId,
        title: sTitle,
        contentType: sItemType,
        duration: null,
        genres: []
      },
      rating: sRating
    };
    //Change rating promise
    const oChangeRatingPromise = zeeAxiosUM.post(
      appURLs.CHANGE_RATING,
      data,
      params
    );
    oChangeRatingPromise
      .then(oResponse => {
        //Get video rating details updated
        const {status} = oResponse;
        if (dontFetchDetails) {
          typeof fnSuccess === "function" && fnSuccess();
          return;
        }
        if (status === CONSTANTS.STATUS_OK) {
          //success callback
          typeof fnSuccess === "function" && fnSuccess();
          //Average rating promise
          const oVideoRatingPromise = zeeAxiosUM.get(
            appURLs.VIDEO_RATING_CONTENT.replace("{TYPE}", sItemType).replace(
              "{ID}",
              sItemId
            )
          );
          oVideoRatingPromise
            .then(oRatingResponse => {
              oRatingResponse.data &&
                dispatch(
                  fnUpdateAverageRatingList(
                    oRatingResponse.data.data.content.averageRating,
                    sRating
                  )
                );
            })
            .catch(oRatingError => {
              Logger.error(MODULE_NAME, oRatingError);
              dispatch(stopVideoDetailLoader());
            });
        } else {
          //failure message
          dispatch(stopVideoDetailLoader());
        }
      })
      .catch(error => {
        dispatch(stopVideoDetailLoader());
        Logger.error(MODULE_NAME, error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that update video rating
 * @param {object} oPageContent - page content object.
 * @return {dispatch} - dispatch object
 */
const fnUpdateAverageRatingList = (iAverageRating, iUserRating) => {
  return {
    type: actionTypes.UPDATE_ITEM_RATING,
    payload: {iAverageRating, iUserRating}
  };
};

/**
 * Component Name - Action creators
 * method that returns new access token.
 * @param {userInputText } - text enter by the user in Search Box
 * @return {Promise} - Promise that returns access token
 */
export const fnSearchUserInput = (
  sLocale,
  oSearchTerm,
  bUpdateSearchInput,
  fnUserSearchResponseListError,
  fnSuccess
) => {
  return (dispatch,getState) => {
    //dispatch(startLoader());
    const dCountry = getState().sCode;
    // const oAppState = getState();
    let searchUserList = "";
    if (oSearchTerm.bSearchTerm) {
      searchUserList = `${appURLs.SEARCH_ITEM
        .replace("{LANGUAGE_CODE}",sLocale)
        .replace("{COUNTRY}",dCountry)}${oSearchTerm.userInputText}`;
    } else {
      const scategoryUrl =
        oSearchTerm.category === CONSTANTS.CAST
          ? appURLs.SEARCH_ITEM_BY_CAST
          : appURLs.SEARCH_ITEM_BY_GENRE;
      searchUserList = `${scategoryUrl
        .replace("{LANGUAGE_CODE}", sLocale)
        .replace("{COUNTRY}",dCountry)
        .replace("{CATEGORY}", oSearchTerm.category)}${oSearchTerm.name}`;
    }
    const oUserSearchListData = zeeAxios.get(searchUserList, {
      headers: {"Content-Type": "application/x-www-form-urlencoded"}
    });
    oUserSearchListData
      .then(userSearchResponseList => {
        if (
          typeof fnUserSearchResponseListError === "function" &&
          userSearchResponseList.status !== CONSTANTS.STATUS_OK
        ) {
          fnUserSearchResponseListError(userSearchResponseList);
        } else {
          typeof fnSuccess === "function" && fnSuccess(oSearchTerm);
        }
        if (userSearchResponseList.data.data.length > 0) {
          dispatch(
            fnUserSearchResponseList(
              userSearchResponseList.data.data,
              bUpdateSearchInput
            )
          );
        } else {
          userSearchResponseList.data.data.push({
            id: 0,
            title: oResourceBundle.search_error_no_results
          });
          dispatch(
            fnUserSearchResponseList(
              userSearchResponseList.data.data,
              bUpdateSearchInput
            )
          );
        }
        //dispatch(stopLoader());
      })
      .catch(error => {
        //dispatch(stopLoader());
        Logger.error(MODULE_NAME, error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that update video rating
 * @param {object} userSearchResponseList - User Search Response object.
 * @return {dispatch} - dispatch object
 */
const fnUserSearchResponseList = (
  userSearchResponseList,
  bUpdateSearchInput
) => {
  return {
    type: actionTypes.USER_SEARCH_RESPONSE,
    payload: {userSearchResponseList, bUpdateSearchInput}
  };
};
/**
 * Component Name - Action creators
 * method that update video rating
 * @param {null}
 * @return {dispatch} - dispatch object
 */
export const fnClearUserSearchData = () => {
  return {
    type: actionTypes.CLEAR_USER_SEARCH_RESPONSE,
    payload: []
  };
};

/**
 * Component Name - Action creators
 * method to fetch user rated content
 * @param {null}
 */
export const fnFetchUserRating = (fnSuccess, fnFailed) => {
  return (dispatch, getState) => {
    dispatch(startLoader());
    const sLocal = getState().locale;
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    const ratedDetails = [];
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };

      const oUserwatchedContent = zeeAxiosUM.get(appURLs.USER_RATED, params);
      oUserwatchedContent
        .then(oResponse => {
          dispatch(startLoader());
          if (oResponse.status === CONSTANTS.STATUS_OK && oResponse.data) {
            if (oResponse.data.data.length === 0) {
              if (typeof fnSuccess === "function") fnSuccess(ratedDetails);
              dispatch(stopLoader());
              return;
            }
            var userRatedUrl = `${appURLs.CONTENT_DETAILS.replace(
              "{LANGUAGE_CODE}",
              sLocal
            )}${oResponse.data.data[0].content.id}.${
              oResponse.data.data[0].content.contentType
            }`;
            oResponse.data.data.slice(1).forEach(item => {
              let itemId = item.content.id;
              let type = item.content.contentType;
              userRatedUrl = userRatedUrl + `,${itemId}.${type}`;
            });

            const userRatedDetails = zeeAxios.get(userRatedUrl);
            userRatedDetails
              .then(res => {
                dispatch(stopLoader());
                if (res.data && res.data.data) {
                  res.data.data.forEach((item, i) => {
                    item.rating = oResponse.data.data[i].userData.rating;
                    item.ratedAt = oResponse.data.data[i].userData.ratedAt;
                    ratedDetails.push(item);
                  });
                  if (typeof fnSuccess === "function") fnSuccess(ratedDetails);
                } else {
                  if (typeof fnFailed === "function") fnFailed(res);
                }
              })
              .catch(error => {
                if (typeof fnFailed === "function") fnFailed(error);
                dispatch(stopLoader());
              });
          } else {
            if (typeof fnFailed === "function") fnFailed(oResponse);
          }
        })
        .catch(error => {
          if (typeof fnFailed === "function") fnFailed(error);
          dispatch(stopLoader());
        });
    }
  };
};

/**
 * Component Name - Action creators
 * method to delete user rated content
 * @param {null}
 */
export const fnDeleteUserRating = (id, type, fnSuccess, fnFailed) => {
  return (dispatch, getState) => {
    dispatch(startLoader());
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };

      const url = appURLs.USER_RATED + "/" + id + "," + type;
      const oUserwatchedContent = zeeAxiosUM.delete(url, params);
      oUserwatchedContent
        .then(oResponse => {
          if (oResponse.status === 200) {
            if (typeof fnSuccess === "function") fnSuccess(oResponse);
          } else {
            if (typeof fnSuccess === "function") fnFailed(oResponse);
          }
          dispatch(stopLoader());
        })
        .catch(error => {
          if (typeof fnFailed === "function") fnFailed(error);
          dispatch(stopLoader());
        });
    }
  };
};

/**
 * Component Name - Action creators
 * method to fetch user watched content
 * @param {null}
 */
export const fnFetchUserWatching = (fnSuccess, fnFailed) => {
  return (dispatch, getState) => {
    dispatch(startLoader());
    const sLocal = getState().locale;
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    const watchedDetails = [];
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };

      const oUserwatchedContent = zeeAxiosUM.get(appURLs.USER_WATCHING, params);
      oUserwatchedContent
        .then(oResponse => {
          dispatch(startLoader());
          if (oResponse.status === CONSTANTS.STATUS_OK && oResponse.data) {
            if (oResponse.data.data.length === 0) {
              if (typeof fnSuccess === "function") fnSuccess(watchedDetails);
              dispatch(stopLoader());
              return;
            }
            var userWatchedUrl = `${appURLs.CONTENT_DETAILS.replace(
              "{LANGUAGE_CODE}",
              sLocal
            )}${oResponse.data.data[0].content.id}.${
              oResponse.data.data[0].content.contentType
            }`;
            oResponse.data.data.slice(1).forEach(item => {
              let itemId = item.content.id;
              let type = item.content.contentType;
              userWatchedUrl = userWatchedUrl + `,${itemId}.${type}`;
            });

            const userWatchedDetailsDetails = zeeAxios.get(userWatchedUrl);
            userWatchedDetailsDetails
              .then(res => {
                if (res.data && res.data.data) {
                  if (res.data.data.length > 0) {
                    res.data.data.forEach((item, i) => {
                      item.viewedAt =
                        oResponse.data.data[i].userData.viewActivity.viewedAt;
                      watchedDetails.push(item);
                    });
                  }
                  if (typeof fnSuccess === "function") {
                    fnSuccess(watchedDetails);
                  }
                  dispatch(stopLoader());
                } else {
                  if (typeof fnFailed === "function") fnFailed(res);
                }
              })
              .catch(error => {
                if (typeof fnFailed === "function") fnFailed(error);
                dispatch(stopLoader());
              });
          } else {
            if (typeof fnFailed === "function") fnFailed(oResponse);
          }
        })
        .catch(error => {
          if (typeof fnFailed === "function") fnFailed(error);
          dispatch(stopLoader());
        });
    }
  };
};

/**
 * Component Name - Action creators
 * method to delete user watched content
 * @param {null}
 */
export const fnDeleteUserWatching = (id, type, fnSuccess, fnFailed) => {
  return (dispatch, getState) => {
    dispatch(startLoader());
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };
      const url = appURLs.USER_WATCHING + "/" + id + "," + type;
      const oUserwatchedContent = zeeAxiosUM.delete(url, params);
      oUserwatchedContent
        .then(oResponse => {
          dispatch(stopLoader());
          if (oResponse.status === 200) {
            if (typeof fnSuccess === "function") fnSuccess(oResponse);
          } else {
            if (typeof fnFailed === "function") fnFailed(oResponse);
            dispatch(stopLoader());
          }
        })
        .catch(error => {
          if (typeof fnFailed === "function") fnFailed(error);
          dispatch(stopLoader());
        });
    }
  };
};

/**
 * Component Name - Action creators
 * method to add user watched content
 * @param {null}
 */
export const fnAddUserWatching = (
  id,
  title,
  contentType,
  duration,
  genres,
  lastWatchPosition,
  watchSessionId
) => {
  return (dispatch, getState) => {
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    var data = {
      content: {
        id: id,
        title: title || "No title",
        contentType: contentType,
        duration: duration,
        genres: genres
      },
      lastWatchPosition: lastWatchPosition,
      watchSessionId: watchSessionId
    };
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };

      const oUserwatchedContent = zeeAxiosUM.post(
        appURLs.USER_WATCHING,
        data,
        params
      );
      oUserwatchedContent.then(oResponse => {}).catch(error => {});
    }
  };
};

/**
 * Component Name - Action creators
 * method to add user watched content
 * @param {null}
 */
export const fnSubmitReportIssue = (
  userComment,
  selectedItem,
  issueWithVideo,
  issueWithSound,
  issueWithTranslation,
  issueWithCommunication,
  fnSuccess,
  fnFailed
) => {
  return dispatch => {
    dispatch(startLoader());
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };
      const oData = {
        description: userComment,
        isWithCommunication: issueWithCommunication,
        isWithSound: issueWithSound,
        isWithTranslation: issueWithTranslation,
        isWithVideo: issueWithVideo
      };

      const oUserReportPromise = zeeAxiosUM.post(
        appURLs.WATCH_REPORT_ITEM.replace(
          "{ITEM_QUERY}",
          `${selectedItem.id},${selectedItem.content_type}`
        ),
        oData,
        params
      );
      oUserReportPromise
        .then(oResponse => {
          dispatch(stopLoader());
          if (oResponse.status === CONSTANTS.STATUS_OK) {
            if (typeof fnSuccess === "function") fnSuccess(oResponse);
          } else {
            if (typeof fnFailed === "function") fnFailed(oResponse);
            dispatch(stopLoader());
          }
        })
        .catch(error => {
          if (typeof fnFailed === "function") fnFailed(error);
          dispatch(stopLoader());
        });
    }
  };
};

/**
 * Component Name - Action creators
 * method to fetch user details
 * @param {null}
 */
export const fnFetchUserDetails = (fnSuccess, fnFailed, bShouldDispatch) => {
  return dispatch => {
    dispatch(startLoader());
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };

      const oUseerDetailsPromise = zeeAxiosUM.get(appURLs.USER_DETAILS, params);
      oUseerDetailsPromise
        .then(oResponse => {
          if (oResponse.status === CONSTANTS.STATUS_OK) {
            const _userObj = common.creatingUserObjectForCookies(
              oResponse.data.data
            );
            common.setCookie(
              CONSTANTS.COOKIE_USER_OBJECT,
              JSON.stringify(_userObj),
              CONSTANTS.INFINITE_COOKIE_TIME
            );
            if (typeof fnSuccess === "function") fnSuccess(oResponse.data.data);
            if (bShouldDispatch) {
              dispatch(stopLoader());
              dispatch(fnUpdateUserDetails(oResponse.data.data));
            }
          } else {
            if (typeof fnFailed === "function") fnFailed(oResponse);
          }
        })
        .catch(error => {
          if (typeof fnFailed === "function") fnFailed(error);
          dispatch(stopLoader());
          Logger.error(MODULE_NAME, error);
        });
    }
  };
};

/**
 * Component Name - Action creators
 * method that update video rating
 * @param {object} oUserDetails - user details object
 * @return {dispatch} - dispatch object
 */
const fnUpdateUserDetails = oUserDetails => {
  return {
    type: actionTypes.UPDATE_USER_DETAILS,
    payload: oUserDetails
  };
};

/**
 * Component Name - Action creators
 * method to fetch user details
 * @param {null}
 */
export const fnHandleUpdateAccount = (
  oCurrentAccountState,
  fnSuccess,
  fnFailed
) => {
  return dispatch => {
    dispatch(startLoader());
    const {
      fname,
      lname,
      email,
      newsletter,
      promotions,
      country,
      selectedCountryCode,
      language,
      selectedLanguageCode,
      newsletter1,
      newsletter2,
      newsletter3
    } = oCurrentAccountState;
    //Get user details
    dispatch(
      fnFetchUserDetails(
        oUserResponse => {
          const data = {
            countryId: selectedCountryCode,
            countryName: country,
            email: email,
            firstName: fname,
            languageId: selectedLanguageCode,
            languageName: language,
            lastName: lname,
            newslettersEnabled: newsletter,
            promotionsEnabled: promotions,
            privacyPolicy: newsletter1,
            isAdult:newsletter2,
            isRecommend:newsletter3          };
          const oUserToken = JSON.parse(
            common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
          );
          const sAuthToken = oUserToken ? oUserToken.authToken : null;
          let params = {};
          if (sAuthToken) {
            params = {
              headers: {
                Authorization: "Bearer " + sAuthToken
              }
            };

            const oUseerDetailsPromise = zeeAxiosUM.post(
              appURLs.USER_DETAILS,
              data,
              params
            );
            oUseerDetailsPromise
              .then(oResponse => {
                dispatch(stopLoader());
                if (oResponse.status === CONSTANTS.STATUS_OK) {
                  common.saveUserDetails(data);

                  if (typeof fnSuccess === "function") fnSuccess();
                  dispatch(fnFetchUserDetails(null, null, true));
                } else {
                  if (typeof fnFailed === "function") fnFailed();
                }
              })
              .catch(error => {
                if (typeof fnFailed === "function") fnFailed();
                dispatch(stopLoader());
                Logger.error(MODULE_NAME, error);
              });
          }
        },
        oUserFailedResponse => {
          dispatch(stopLoader());
          Logger.error(MODULE_NAME, oUserFailedResponse);
        }
      )
    );
  };
};

/**
 * Component Name - Action creators
 * method to signout from all device
 * @param {function} fnSuccess
 * @param {function} fnSuccess
 */
export const fnSignOutFromAllDevices = (fnSuccess, fnFailed) => {
  return dispatch => {
    dispatch(startLoader());
    dispatch(
      fnFetchLoggedInDevices(
        aLoggedInDevices => {
          aLoggedInDevices.length === 0 && dispatch(stopLoader());
          const aDeviceIds = aLoggedInDevices.map(oDevice => oDevice.id);
          dispatch(
            fnLogOutFromDevice(aDeviceIds, () => {
              if (typeof fnSuccess === "function") fnSuccess();
            })
          );
        },
        () => {
          //Device list failed to fetch
          if (typeof fnFailed === "function") fnFailed();
          dispatch(stopLoader());
        }
      ),
      false
    );
  };
};

/**
 * Component Name - Action creators
 * method to signout from device
 * @param {function} fnSuccess
 * @param {function} fnFailed
 */
export const fnLogOutFromDevice = (aDeviceId, fnSuccess, fnFailed) => {
  return dispatch => {
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };
      const aPromises = [];
      if (Array.isArray(aDeviceId)) {
        aDeviceId.forEach(id => {
          aPromises.push(
            zeeAxiosUM.delete(
              appURLs.LOGGED_IN_DEVICES.replace("{DEVICE_ID}", id),
              params
            )
          );
        });
      } else {
        aPromises.push(
          zeeAxiosUM.delete(
            appURLs.LOGGED_IN_DEVICES.replace("{DEVICE_ID}", aDeviceId),
            params
          )
        );
      }

      Promise.all(aPromises)
        .then(oResponse => {
          if (oResponse[0].status === CONSTANTS.STATUS_OK) {
            if (typeof fnSuccess === "function") fnSuccess(oResponse);
          } else {
            if (typeof fnFailed === "function") fnFailed(oResponse);
          }
          dispatch(stopLoader());
        })
        .catch(error => {
          if (typeof fnFailed === "function") fnFailed(error);
          dispatch(stopLoader());
          Logger.error(MODULE_NAME, error);
        });
    }
  };
};

/**
 * Component Name - Action creators
 * method to fetch all devices
 * @param {function} fnSuccess
 * @param {function} fnFailed
 * @param {boolean} bShouldDispatch - Should dispatch to reducer
 */
export const fnFetchLoggedInDevices = (
  fnSuccess,
  fnFailed,
  bShouldDispatch
) => {
  return dispatch => {
    dispatch(startLoader());
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };

      const oDeviceListPromise = zeeAxios.get(
        appURLs.LOGGED_IN_DEVICES.replace("{DEVICE_ID}", ""),
        params
      );
      oDeviceListPromise
        .then(oResponse => {
          if (oResponse.status === CONSTANTS.STATUS_OK) {
            if (typeof fnSuccess === "function") fnSuccess(oResponse.data.data);
            if (bShouldDispatch) {
              dispatch(fnUpdateLoggedInDevices(oResponse.data.data));
              dispatch(stopLoader());
            }
          } else {
            if (typeof fnFailed === "function") fnFailed(oResponse);
          }
        })
        .catch(error => {
          if (typeof fnFailed === "function") fnFailed(error);
          dispatch(stopLoader());
          Logger.error(MODULE_NAME, error);
        });
    } else {
      dispatch(stopLoader());
      if (typeof fnFailed === "function") fnFailed();
    }
  };
};

/**
 * Component Name - Action creators
 * method that update video rating
 * @param {object} oUserDetails - user details object
 * @return {dispatch} - dispatch object
 */
const fnUpdateLoggedInDevices = aLoggedInDevices => {
  return {
    type: actionTypes.UPDATE_LOGGED_IN_DEVICES,
    payload: aLoggedInDevices
  };
};

/**
 * Component Name - Action creators
 * method to add pairing code
 * @param {function} fnSuccess
 * @param {function} fnFailed
 */
export const fnAddPairingCode = (sPairingCode, fnSuccess, fnFailed) => {
  return dispatch => {
    //fetch all login devices
    dispatch(startLoader());
    dispatch(
      fnFetchLoggedInDevices(
        aLoggedInDevicesResponse => {
          //Success
          //Can not devices more than 5
          if (
            aLoggedInDevicesResponse &&
            aLoggedInDevicesResponse.length >= 5
          ) {
            if (typeof fnFailed === "function")
              fnFailed({data: {description: oResourceBundle.device_limit}});
            dispatch(stopLoader());
          } else {
            //Add code for log in
            dispatch(
              fnLogInToDevice(
                sPairingCode,
                oPairingSuccess => {
                  //Success
                  if (typeof fnFailed === "function")
                    fnSuccess(oPairingSuccess);
                },
                oPairingError => {
                  //Failed
                  if (typeof fnFailed === "function") fnFailed(oPairingError);
                }
              )
            );
          }
        },
        oLoggedInDevicesError => {
          if (typeof fnFailed === "function") fnFailed(oLoggedInDevicesError);
          dispatch(stopLoader());
          Logger.error(MODULE_NAME, oLoggedInDevicesError);
        }
      )
    );
  };
};

/**
 * Component Name - Action creators
 * Login using the pairing code
 * @param {function} fnSuccess
 * @param {function} fnFailed
 */
const fnLogInToDevice = (sPairingCode, fnSuccess, fnFailed) => {
  return dispatch => {
    dispatch(startLoader());
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    let params = {};
    if (sAuthToken) {
      params = {
        headers: {
          Authorization: "Bearer " + sAuthToken
        }
      };
      const data = {
        user_code: sPairingCode
      };

      const oAddPaingCodePromise = zeeAxiosUM.post(
        appURLs.ADD_PAIRING_CODE,
        data,
        params
      );
      oAddPaingCodePromise
        .then(oResponse => {
          const {status} = oResponse;
          if (status === CONSTANTS.STATUS_OK) {
            //success callback
            typeof fnSuccess === "function" && fnSuccess(oResponse);
          } else {
            //failure message
            dispatch(stopLoader());
            typeof fnFailed === "function" && fnFailed(oResponse.response);
          }
        })
        .catch(error => {
          dispatch(stopLoader());
          typeof fnFailed === "function" && fnFailed(error);
          Logger.error(MODULE_NAME, error);
        });
    } else {
      //User logged out
      dispatch(stopLoader());
      typeof fnFailed === "function" &&
        fnFailed({description: oResourceBundle.session_expired});
    }
  };
};

/**
 * Component Name - Action creators
 * method to fetch user details
 * @param {null}
 */
export const fnChangePassword = (oCurrentAccountState, fnSuccess, fnFailed) => {
  return dispatch => {
    dispatch(startLoader());
    const {newpass, oldpass} = oCurrentAccountState;
    //Get user details
    dispatch(
      fnFetchUserDetails(
        oUserResponse => {
          //First check password is valid or not
          Logger.log(
            MODULE_NAME,
            common.getCookie(CONSTANTS.COOKIE_REMEMBER_ME)
          );
          // const rememberMe = common.getCookie(CONSTANTS.COOKIE_REMEMBER_ME)
          //   ? JSON.parse(common.getCookie(CONSTANTS.COOKIE_REMEMBER_ME))
          //       .isRemeberMe
          //   : false;
          // const oCredentials = {
          //   email: sUserRegisteredMail,
          //   password: oldpass,
          //   rememberMe
          // };
          // dispatch(
          //   fnSendLoginCredentials(
          //     oCredentials,
          //     oLogInResponse => {
          const data = {password: newpass, oldpassword: oldpass};
          const oUserToken = JSON.parse(
            common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
          );
          const sAuthToken = oUserToken ? oUserToken.authToken : null;
          let params = {};
          if (sAuthToken) {
            params = {
              headers: {
                Authorization: "Bearer " + sAuthToken
              }
            };

            const oChangePasswordPromise = zeeAxiosUM.post(
              appURLs.CHANGE_PASSWORD,
              data,
              params
            );
            oChangePasswordPromise
              .then(oResponse => {
                dispatch(stopLoader());
                if (oResponse.status === CONSTANTS.STATUS_OK) {
                  if (typeof fnSuccess === "function") fnSuccess(oResponse);
                } else {
                  if (typeof fnFailed === "function") fnFailed(oResponse);
                }
              })
              .catch(error => {
                if (typeof fnFailed === "function") fnFailed(error);
                dispatch(stopLoader());
                Logger.error(MODULE_NAME, error);
              });
          }
          // },
          // oLogInResponseFailed => {
          //   dispatch(stopLoader());
          //   if (typeof fnFailed === "function")
          //     fnFailed(oLogInResponseFailed.response.data);
          // }
          //   )
          // );
        },
        oUserFailedResponse => {
          dispatch(stopLoader());
          Logger.error(MODULE_NAME, oUserFailedResponse);
        }
      )
    );
  };
};

/**
 * Component Name - Action creators
 * Initiate the payment session
 * @param {function} fnSuccess
 * @param {function} fnFailed
 */
export const fnInitiatePaymentSession = (oPayload, fnSuccess, fnFailed) => {
  return dispatch => {
    dispatch(startLoader());
    const param = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    const oCreateSessionPromise = axios.post(
      appURLs.CREATE_PAYMENT_SESSION,
      oPayload,
      param
    );
    oCreateSessionPromise
      .then(oResponse => {
        if (oResponse.data && oResponse.data.paymentSession) {
          dispatch(fnUpdatePaymentSession(oResponse.data));
          typeof fnSuccess === "function" && fnSuccess(oResponse);
        } else {
          typeof fnFailed === "function" && fnFailed(oResponse);
        }
        dispatch(stopLoader());
      })
      .catch(error => {
        dispatch(stopLoader());
        typeof fnFailed === "function" && fnFailed(error);
        Logger.error(MODULE_NAME, error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that update create payment session
 * @param {object} oSession - user details object
 * @return {dispatch} - dispatch object
 */
const fnUpdatePaymentSession = oSession => {
  return {
    type: actionTypes.UPDATE_PAYMENT_SESSION,
    payload: oSession
  };
};

/**
 * Component Name - Action creators
 * Initiate the payment session
 * @param {string} payload
 */
export const fnVerifyPaymentResult = (payload, fnSuccess, fnFailed) => {
  return (dispatch, getState) => {
    dispatch(startLoader());
    const sLocal = getState().locale;
    const sOrderID = window.localStorage.getItem(
      CONSTANTS.PAYMENT_ORDER_ID_LOCAL_STORAGE
    );
    const param = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    const oData = {
      payload: payload,
      order_id: sOrderID,
      additional_info: {
        user_language: sLocal,
        platform: CONSTANTS.PAYMENT_PLATFORM,
        payment_mode: CONSTANTS.PAYMENT_PLATFORM
      }
    };
    const oCreateSessionPromise = axios.post(
      appURLs.VERIFY_PAYMENT_RESULT,
      oData,
      param
    );

    Logger.log(MODULE_NAME, "fnVerifyPaymentResult fired");
    oCreateSessionPromise
      .then(oResponse => {
        Logger.log(MODULE_NAME, "fnVerifyPaymentResult success");
        if (oResponse.data && oResponse.data.status !== 422) {
          typeof fnSuccess === "function" && fnSuccess(oResponse.data);
        } else {
          typeof fnFailed === "function" && fnFailed(oResponse.data);
        }
        dispatch(stopLoader());
      })
      .catch(error => {
        dispatch(stopLoader());
        typeof fnFailed === "function" && fnFailed(error);
        Logger.error(MODULE_NAME, error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that update successful transaction details
 * @param {object} oTransactionDetails - user details object
 * @return {dispatch} - dispatch object
 */
export const fnUpdateTransactionReference = oTransactionDetails => {
  return {
    type: actionTypes.UPDATE_TRNSACTION_REFERENCE,
    payload: oTransactionDetails
  };
};

/**
 * Component Name - Action creators
 * method that update resume page for subscribe
 * @param {string} sResumePagePath - user details object
 * @return {dispatch} - dispatch object
 */
export const fnUpdateResumePagePath = sResumePagePath => {
  return {
    type: actionTypes.UPDATE_RESUME_PAGE,
    payload: sResumePagePath
  };
};

/**
 * Component Name - Action creators
 * Check user entitlement
 * @param {string} sUserName
 */
export const fnSubscriptionEntitlement = (
  sUserId,
  bIncludeAll,
  locale,
  fnSuccess,
  fnFailed
) => {
  return dispatch => {
    dispatch(startLoader());
    const oCheckSubscriptionEntitlementPromise = axios.get(
      appURLs.SUBSCRIPTION_ENTITLEMENT.replace("{USERID}", sUserId)
        .replace("{IS_INCLUDE_ALL}", bIncludeAll)
        .replace("{LANGUAGE_CODE}", locale)
    );
    oCheckSubscriptionEntitlementPromise
      .then(oResponse => {
        if (oResponse.status === CONSTANTS.STATUS_OK) {
          typeof fnSuccess === "function" && fnSuccess(oResponse.data);
        } else {
          typeof fnFailed === "function" && fnFailed(oResponse.data);
        }
        dispatch(stopLoader());
      })
      .catch(error => {
        dispatch(stopLoader());
        typeof fnFailed === "function" && fnFailed(error);
        Logger.error(MODULE_NAME, error);
      });
  };
};

/**
 * Component Name - Action creators
 * Cancel subscription
 * @param {string} orderId
 */
export const adyenCancelSubscription = (
  orderId,
  locale,
  fnSuccess, 
  fnFailed
  ) => {
  return dispatch => {
    dispatch(startLoader());
    const cancelSubscriptionPromise = axios.get(
      appURLs.ADYEN_CANCEL_SUBSCRIPTION.replace("{ORDER_ID}", orderId).replace(
        "{LANGUAGE_CODE}",
        locale
      )
    );
    cancelSubscriptionPromise
      .then(oResponse => {
        if (
          oResponse.status === CONSTANTS.STATUS_OK &&
          !oResponse.data.error_code
        ) {
          typeof fnSuccess === "function" && fnSuccess(oResponse.data);
        } else {
          typeof fnFailed === "function" && fnFailed(oResponse.data);
        }
        dispatch(stopLoader());
      })
      .catch(error => {
        dispatch(stopLoader());
        typeof fnFailed === "function" && fnFailed(error);
        Logger.error(MODULE_NAME, error);
      });
  };
};

/**
 * Component Name - Action creators
 * Get all subscription plans
 * @param {string} sCountryCode
 * @param {string} sLocale
 */
export const fnSubscriptionPlans = (
  sCountryCode,
  sLocale,
  fnSuccess,
  fnFailed
) => {
  return dispatch => {
    dispatch(startLoader());
    const oCheckSubscriptionPlansPromise = axios.get(
      appURLs.SUBSCRIPTION_PLANS.replace(
        "{COUNTRY_CODE}",
        sCountryCode
      ).replace("{LANGUAGE_CODE}", sLocale)
    );
    
    oCheckSubscriptionPlansPromise
      .then(oResponse => {
        // let arr = Object.entries(oResponse);
        // console.log(arr.length);
        // console.log(arr);
        if (oResponse.status === CONSTANTS.STATUS_OK) {
          dispatch(fnUpdateSubscriptionPlan(oResponse.data));
          typeof fnSuccess === "function" && fnSuccess(oResponse.data);
        } else {
          
          typeof fnFailed === "function" && fnFailed(oResponse.data);
        }
        dispatch(stopLoader());
      })
      .catch(error => {
      
        dispatch(stopLoader());
        typeof fnFailed === "function" && fnFailed(error);
        Logger.error(MODULE_NAME, error);
      });
  };
};

/**
 * Component Name - Action creators
 * method that update plans
 * @param {Array} aSubscriptionPlans - Subscription plans
 * @return {dispatch} - dispatch object
 */
export const fnUpdateSubscriptionPlan = aSubscriptionPlans => {
  return {
    type: actionTypes.UPDATE_SUBSCRIPTON_PLANS,
    payload: aSubscriptionPlans
  };
 
};

/**
 * Component Name - Action creators
 * method that update plans
 * @param {Array} aSubscriptionPlans - Subscription plans
 * @return {dispatch} - dispatch object
 */
export const fnUpdateUserSubscription = isSubscribed => {
  return {
    type: actionTypes.UPDATE_USER_SUBSCRIPTON,
    payload: isSubscribed
  };
};

/**
 * Component Name - Action creators
 * method that update the selected plan
 * @param {Object} oSelectedPlan - Subscription plans
 * @return {dispatch} - dispatch object
 */
export const fnUpdateSelectedPlan = oSelectedPlan => {
  common.setCookie(
    CONSTANTS.PAYMENT_SELECTED_PLAN_COOKIE,
    JSON.stringify(oSelectedPlan),
    CONSTANTS.COOKIES_TIMEOUT_REMEMBER
  );
  return {
    type: actionTypes.UPDATE_SELECTED_PLAN,
    payload: oSelectedPlan
  };
};

/**
 * Component Name - Action creators
 * method that update user details for paymeny
 * @param {object} oUserPaymentDetails - user details object
 * @return {dispatch} - dispatch object
 */
export const fnUpdatePaymentUserDetails = oUserPaymentDetails => {
  common.setCookie(
    CONSTANTS.PAYMENT_USER_DETAIL_COOKIE,
    JSON.stringify(oUserPaymentDetails),
    CONSTANTS.COOKIES_TIMEOUT_REMEMBER
  );
  return {
    type: actionTypes.UPDATE_USER_PAYMENT_DETAILS,
    payload: oUserPaymentDetails
  };
};

/**
 * Component Name - Action creators
 * method that update user details for paymeny
 * @param {object} contactUsDetails -Contact details object
 * @return {dispatch} - dispatch object
 */
export const fnSendContactDetails = (contactUsDetails, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const oContactDetailsData = zeeAxiosUM.post(
      appURLs.SEND_CONTACT_DETAILS,
      contactUsDetails,
      {headers: {"Content-Type": "application/json"}}
    );
    oContactDetailsData
      .then(response => {
        if (
          response.data.code === CONSTANTS.STATUS_OK &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response);
        } else {
          fnError(response);
        }
        dispatch(stopLoader());
      })
      .catch(error => {
        fnError(error);
        dispatch(stopLoader());
      });
  };
};

/**
 * Component Name - Action creators
 * method that verifies OTP
 * @return {dispatch} - dispatch object
 */
export const verifyOTPCode = (
  data,
  fnOTPVerificationSuccessful,
  fnOTPVerificationError
) => {
  return dispatch => {
    dispatch(startLoader());
    const otpVerificationDetails = zeeAxiosUM.post(appURLs.VERIFY_OTP, data, {
      headers: {"Content-Type": "application/json"}
    });
    otpVerificationDetails
      .then(response => {
        dispatch(stopLoader());
        if (
          response.status === CONSTANTS.STATUS_OK &&
          typeof fnOTPVerificationSuccessful === "function"
        ) {
          fnOTPVerificationSuccessful(response);
        } else {
          fnOTPVerificationError(response);
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnOTPVerificationError === "function") {
          fnOTPVerificationError(error);
        }
      });
  };
};
/**
 * Component Name - Action creators
 * method that update user phone number
 * @return {dispatch} - dispatch object
 */
export const updatePhoneNumber = (data, updateSuccess, updateFail) => {
  return dispatch => {
    dispatch(startLoader());
    const oUserToken = JSON.parse(
      common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
    );
    const sAuthToken = oUserToken ? oUserToken.authToken : null;
    const updateAPI = zeeAxiosUM.post(appURLs.UPDATE_PHONE_NUMBER, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sAuthToken
      }
    });
    updateAPI
      .then(response => {
        dispatch(stopLoader());
        if (
          response &&
          response.response &&
          response.response.status === CONSTANTS.STATUS_OK &&
          typeof updateSuccess === "function"
        ) {
          updateSuccess(response.response.data);
        } else if (response && response.status === CONSTANTS.STATUS_OK) {
          let data = response;
          if (response && response.data) {
            data = response.data;
          }
          updateSuccess(data);
        } else {
          updateFail(response);
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof updateFail === "function") {
          updateFail(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * method that gets country phone codes
 * @return {dispatch} - dispatch object
 */
export const getCountryPhoneCodes = (sLanguageCode, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.COUNTRY_PHONE_CODES.replace(
      "{LANGUAGE_CODE}",
      sLanguageCode
    );
    // const url = "http://localhost:3000/test/" + sLanguageCode + "/countryCodes";
    const countryCodeAPI = zeeAxiosUM.get(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    countryCodeAPI
      .then(response => {
        dispatch(fnUpdateCountryPhoneCodes(sLanguageCode, response.data));
        dispatch(stopLoader());
        if (
          response &&
          response.response &&
          response.response.status === CONSTANTS.STATUS_OK &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.response.data);
        } else {
          let data = response;
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * method that update user details for paymeny
 * @param {object} oUserPaymentDetails - user details object
 * @return {dispatch} - dispatch object
 */
export const fnUpdateCountryPhoneCodes = (sLanguageCode, oCountryDetails) => {
  const data = {};
  data[sLanguageCode] = oCountryDetails;
  return {
    type: actionTypes.UPDATE_COUNTRY_PHONE_CODE,
    payload: data
  };
};

/**
 * Component Name - Action creators
 * method that gets country phone codes
 * @return {dispatch} - dispatch object
 */
export const etisalatPrepareSession = (data, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.ETISALAT_PREPARE;
    const prepareAPI = zeeAxiosUM.post(url, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    prepareAPI
      .then(response => {
        dispatch(fnUpdateEtisalatSession(response.data));
        dispatch(stopLoader());
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_code &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.data);
        } else {
          let data = response;
          if (response && response.data) {
            data = response.data;
          }
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * method that update user details for paymeny
 * @param {object} oUserPaymentDetails - user details object
 * @return {dispatch} - dispatch object
 */
export const fnUpdateEtisalatSession = details => {
  return {
    type: actionTypes.UPDATE_ETISALAT_SESSION,
    payload: details
  };
};

/**
 * Component Name - Action creators
 * @return {dispatch} - dispatch object
 */
export const etisalatResendOTP = (data, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.ETISALAT_RESEND_OTP;
    const prepareAPI = zeeAxiosUM.post(url, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    prepareAPI
      .then(response => {
        dispatch(stopLoader());
        if (response && response.data && response.data.error_code) {
          if (typeof fnError === "function") {
            fnError(response.data);
          }
          return;
        }
        if (typeof fnSuccess === "function") {
          fnSuccess(response);
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * @return {dispatch} - dispatch object
 */
export const etisalatVerify = (data, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.ETISALAT_VERIFY;
    const prepareAPI = zeeAxiosUM.post(url, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    prepareAPI
      .then(response => {
        dispatch(stopLoader());
        common.isUserSubscribed();
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_code &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.data);
        } else {
          let data = response;
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * @return {dispatch} - dispatch object
 */
export const etisalatCancelSubscription = (
  orderId,
  locale,
  fnSuccess, 
  fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.ETISALAT_CANCEL_SUBSCRIPTION.replace(
      "{ORDER_ID}",
      orderId
    ).replace("{LANGUAGE_CODE}",locale);
    const prepareAPI = zeeAxiosUM.get(url);
    prepareAPI
      .then(response => {
        dispatch(stopLoader());
        common.isUserSubscribed();
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_code &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.data);
        } else {
          let data = response;
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * @return {dispatch} - dispatch object
 */
export const couponsVerification = (
  couponCode,
  userId,
  countryCode,
  language,
  fnSuccess,
  fnError
) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.COUPONS_VERIFICATION.replace(
      "{COUPON_CODE}",
      couponCode
    )
      .replace("{USER_ID}", userId)
      .replace("{COUNTRY_CODE}", countryCode)
      .replace("{LANGUAGE_CODE}", language);
    const couponAPI = zeeAxiosUM.get(url);
    couponAPI
      .then(response => {
        dispatch(stopLoader());
        common.isUserSubscribed();
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          response.data.code === CONSTANTS.STATUS_OK &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.data);
        } else {
          let data = response;
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * @return {dispatch} - dispatch object
 */
export const couponsRedemption = (data, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.COUPONS_REDEMPTION;
    const couponAPI = zeeAxiosUM.post(url, data);
    couponAPI
      .then(response => {
        dispatch(stopLoader());
        common.isUserSubscribed();
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_code &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.data);
        } else {
          let data = response;
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * method that gets country phone codes
 * @return {dispatch} - dispatch object
 */
export const tpayPrepareSession = (data, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.TPAY_PREPARE;
    const prepareAPI = zeeAxiosUM.post(url, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    prepareAPI
      .then(response => {
        dispatch(fnUpdateTpaySession(response.data));
        dispatch(stopLoader());
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_msg &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.data);
        } else {
          let data = response;
         
          if (response && response.data) {
            data = response.data;
          }
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);

          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          console.log(error)
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * method that update user details for paymeny
 * @param {object} oUserPaymentDetails - user details object
 * @return {dispatch} - dispatch object
 */
export const fnUpdateTpaySession = details => {
  return {
    type: actionTypes.UPDATE_TPAY_SESSION,
    payload: details
  };
};

/**
 * Component Name - Action creators
 * @return {dispatch} - dispatch object
 */
export const tpayResendOTP = (data, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.TPAY_RESEND_OTP;
    const prepareAPI = zeeAxiosUM.post(url, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    prepareAPI
      .then(response => {
        dispatch(stopLoader());
        if (response && response.data && response.data.error_code) {
          if (typeof fnError === "function") {
            fnError(response.data);
          }
          return;
        }
        if (typeof fnSuccess === "function") {
          fnSuccess(response);
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * @return {dispatch} - dispatch object
 */
export const tpayVerify = (data, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.TPAY_VERIFY;
    const prepareAPI = zeeAxiosUM.post(url, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    prepareAPI
      .then(response => {
        
        dispatch(stopLoader());
        common.isUserSubscribed();
        
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_code &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.data);

        } else {
          let data = response;
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

/**
 * Component Name - Action creators
 * @return {dispatch} - dispatch object
 */
export const tpayCancelSubscription = (orderId, locale, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.TPAY_CANCEL_SUBSCRIPTION.replace(
      "{ORDER_ID}",
      orderId
    ).replace("{LANGUAGE_CODE}", locale);
    const cancelAPI = zeeAxiosUM.get(url);
    cancelAPI
      .then(response => {
        dispatch(stopLoader());
        common.isUserSubscribed();
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_code &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.data);
        } else {
          let data = response;
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};

//infoMedia
export const infoPrepareSession = (data, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.INFOMEDIA_PREPARE;
    const prepareAPI = zeeAxiosUM.post(url, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    prepareAPI
      .then(response => {
        dispatch(fnUpdateInfoSession(response.data));
        dispatch(stopLoader());
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_msg &&
          typeof fnSuccess === "function"
        ) {

          fnSuccess(response.data);
        } else {
          let data = response;
         
          if (response && response.data) {
            data = response.data;
          }
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);

          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          console.log(error)
          fnError(error);
        }
      });
  };
};


export const fnUpdateInfoSession = details => {
  return {
    type: actionTypes.UPDATE_INFO_SESSION,
    payload: details
  };
};

export const infoCancelSubscription = (orderId, locale, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.TPAY_CANCEL_SUBSCRIPTION.replace(
      "{ORDER_ID}",
      orderId
    ).replace("{LANGUAGE_CODE}", locale);
    const cancelAPI = zeeAxiosUM.get(url);
    cancelAPI
      .then(response => {
        dispatch(stopLoader());
        common.isUserSubscribed();
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_code &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.data);
        } else {
          let data = response;
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            console.log(data,"sub")
            fnError(data);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};
//TELUS
export const telusPrepareSession = (data, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.TELUS_PREPARE;
    const prepareAPI = zeeAxiosUM.post(url, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    prepareAPI
      .then(response => {
        dispatch(fnUpdateTelusSession(response.data));
        dispatch(stopLoader());
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_msg &&
          typeof fnSuccess === "function"
        ) {

          fnSuccess(response.data);
        } else {
          let data = response;
         
          if (response && response.data) {
            data = response.data;
          }
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            fnError(data);

          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          console.log(error)
          fnError(error);
        }
      });
  };
};


export const fnUpdateTelusSession = details => {
  return {
    type: actionTypes.UPDATE_TELUS_SESSION,
    payload: details
  };
};

export const TelusCancelSubscription = (orderId, locale, fnSuccess, fnError) => {
  return dispatch => {
    dispatch(startLoader());
    const url = appURLs.TPAY_CANCEL_SUBSCRIPTION.replace(
      "{ORDER_ID}",
      orderId
    ).replace("{LANGUAGE_CODE}", locale);
    const cancelAPI = zeeAxiosUM.get(url);
    cancelAPI
      .then(response => {
        dispatch(stopLoader());
        common.isUserSubscribed();
        if (
          response &&
          response.status === CONSTANTS.STATUS_OK &&
          !response.data.error_code &&
          typeof fnSuccess === "function"
        ) {
          fnSuccess(response.data);
        } else {
          let data = response;
          if (response && response.response && response.response.data) {
            data = response.response.data;
          }
          if (typeof fnError === "function") {
            console.log(data,"sub")
            fnError(data);
          }
        }
      })
      .catch(error => {
        dispatch(stopLoader());
        if (typeof fnError === "function") {
          fnError(error);
        }
      });
  };
};


