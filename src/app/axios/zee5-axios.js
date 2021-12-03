/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import Axios, { axios } from "core/axios";
import { toast } from "core/components/Toaster/";
import { store } from "app/App";
import oResourceBundle from "app/i18n/";
import * as actionTypes from "app/store/action/";
import * as constants from "app/AppConfig/constants";
import * as common from "app/utility/common";
import { ENABLE_REFRESH_TOKEN } from "app/AppConfig/features";

//denotes token is fetching status
let isAlreadyFetchingAccessToken = false;
//Holds all the async requests
let subscribers = [];

/**
 * Component Name - Axios
 * Once access token fetched send to refire axios
 * @param {String} access_token - function that returns original response
 * @return {undefined}
 */
function onAccessTokenFetched(access_token) {
  subscribers = subscribers.filter(callback => callback(access_token));
}

/**
 * Component Name - Axios
 * Add async call to the subscriber array
 * @param {function} callback - function that returns original response
 * @return {undefined}
 */
function addSubscriber(callback) {
  subscribers.push(callback);
}

/**
 * Component Name - Axios
 * Create the axios instance
 * @param {function} callback - function that returns original response
 * @return {undefined}
 */
export const createAxiosInstance = sBaseURL => {
  const oAxios = new Axios();
  /* oBaseUrl.set_BASE_URL_MISC(oPlatformConfig.default["1.0"]["CMS"]);
  oBaseUrl.set_BASE_URL_VIDEO(oPlatformConfig.default["1.0"]["UM"]); */

  oAxios.createInstance({
    baseURL: sBaseURL ? sBaseURL : ""
  });

  //Define interceptor for request
  oAxios.setRequestInterceptor(
    request => {
      const locale = store.getState().locale;
      locale && (request.headers["Accept-Language"] = locale);
      return request;
    },
    err => {
      return err;
    }
  );

  //Define interceptor for response
  oAxios.setResponseInterceptor(
    response => {
      return response;
    },
    err => {
      if (!window.navigator.onLine) {
        common.showToast(
          constants.GENERIC_TOAST_ID,
          oResourceBundle.no_internet_connection,
          toast.POSITION.BOTTOM_CENTER
        );
      }
      if (!err.response) {
        return err;
      }
      const {
        config,
        response: { status }
      } = err;
      if (status === constants.STATUS_UNAUTHORISED) {
        const originalRequest = config;
        const oUserToken = JSON.parse(
          common.getServerCookie(constants.COOKIE_USER_TOKEN)
        );
        const sRefreshToken = oUserToken && oUserToken.refreshToken;
        //Unutherised access
        if (ENABLE_REFRESH_TOKEN && sRefreshToken) {
          //Refresh Token
          if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            //Dispatch action for refresh token
            store
              .dispatch(actionTypes.fetchAccessToken(sRefreshToken))
              .then(access_token => {
                isAlreadyFetchingAccessToken = false;
                onAccessTokenFetched(access_token);
              })
              .catch(err => {
                console.error(err);
                common.deleteCookie(constants.COOKIE_USER_OBJECT);
                common.deleteCookie(constants.COOKIE_USER_TOKEN);
                store.dispatch(actionTypes.fnForLogOut());
              });
          }

          //Promise set the new access token
          const retryOriginalRequest = new Promise(resolve => {
            addSubscriber(access_token => {
              originalRequest.headers.Authorization = "Bearer " + access_token;
              axios(originalRequest)
                .then(response => {
                  resolve(response);
                })
                .catch(error => {
                  //Return error response to resolve to continue with other resposes
                  resolve(error);
                });
            });
          });
          //return the modified request
          return retryOriginalRequest;
        }
      }
      return err;
    }
  );

  return oAxios.getInstance();
};
