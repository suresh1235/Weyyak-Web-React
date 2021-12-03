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
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { connect } from "react-redux";
import * as CONSTANTS from "../../../AppConfig/constants";
import * as actionTypes from "app/store/action/";
import * as common from "app/utility/common";
import Button from "../../../../core/components/Button/";
import Spinner from "core/components/Spinner";
import oResourceBundle from "app/i18n/";
import facebookIcon from "app/resources/assets/login/facebook_icon.svg";
import twitterIcon from "app/resources/assets/login/twitter_icon.svg";
import appleIcon from "app/resources/assets/login/apple-logo.svg";
import Logger from "core/Logger";
import { toast } from "core/components/Toaster/";
import { sendEvents } from "core/GoogleAnalytics/";
import Checkbox from "../../../../core/components/Checkbox/";
import ReactHtmlParser from 'react-html-parser';
import "./index.scss";
import AppleLogin from 'react-apple-login'
import { CleverTap_UserEvents, CleverTap_CustomEvents } from 'core/CleverTap'

const MODULE_NAME = "SocialLogin";

class SocialLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkboxChanged: false,
      checkboxChanged1: true,
      checkboxChanged2: true,
      checkboxChanged3: true,
      checkboxChanged4: false,
      newsletter: false,
    };
  }


  componentDidMount() { }

  componentDidUpdate() { }

  handleCheck(oEvent) {
    this.setState({
      checkboxChanged1: oEvent.target.checked,
    });
  }

  handleCheck1(oEvent) {
    this.setState({
      checkboxChanged2: oEvent.target.checked,
    });
  }

  handleCheck2(oEvent) {
    this.setState({
      checkboxChanged3: oEvent.target.checked,
    });
  }

  handleCheck3(oEvent) {
    this.setState({
      checkboxChanged: oEvent.target.checked,
    });
  }


  /**
   * Component Name - SocialLogin
   *  Response from the Facebook and redirect to Home Screen.
   * @param {object} eve - Event hanlder
   */
  responseFacebook(fbResponse) {
    Logger.log(MODULE_NAME, 'responseFacebook');
    var oCreateAcctUserData = {
      privacyPolicy: this.state.checkboxChanged1,
      isAdult: this.state.checkboxChanged2,
      isRecommend: this.state.checkboxChanged3,
      newslettersEnabled: this.state.checkboxChanged
    };
    localStorage.setItem('oCreateAcctUserData', JSON.stringify(oCreateAcctUserData));
    var oCreateAcctUserData = localStorage.getItem('oCreateAcctUserData');
    // console.log('oCreateAcctUserData', JSON.parse(oCreateAcctUserData))
    var oCreateAcctUserData = JSON.parse(oCreateAcctUserData)
    this.props.fnUpdateUserDetails(
      oCreateAcctUserData
    );

    sendEvents(
      CONSTANTS.LOGIN_CATEGORY,
      CONSTANTS.LOGIN_ACTION,
      CONSTANTS.FACEBOOK_LOGIN_ACTION
    );
    if (fbResponse.accessToken !== undefined) {
      this.props.fnSendSocialLoginResponse(
        fbResponse,
        CONSTANTS.GRANT_TYPE_FACEBOOK,
        () => {
          this.props.fnFetchUserDetails((loginResponse) => {

            this.props.fnupdateGDPRCookieData(loginResponse)
            let userData = loginResponse.userDetails
            userData.userId = common.getUserId()
            CleverTap_UserEvents("LoginEvent", userData)
          }, null, true);

          // common.redirectAfterLogin.call(this);
          sendEvents(CONSTANTS.LOGIN_CATEGORY, CONSTANTS.FACEBOOK_LOGIN_ACTION);
        },

        this.fnFacebookError.bind(this)
      );
      this.props.fnUpdateUserDetails(
        oCreateAcctUserData
      );
    }
  }

  responseFromApple(AppleResponse) {

    // let AppleResponse = {
    //   "code": "adrfvdet",
    //   "user": {
    //     "email": "raju@gmail.com",
    //     "name": {
    //       "firstName": "ramu",
    //       "lastName": "m"
    //     }
    //   }
    // }
    // console.log(AppleResponse)

    Logger.log(MODULE_NAME, 'responseApple');
    var oCreateAcctUserData = {
      privacyPolicy: this.state.checkboxChanged1,
      isAdult: this.state.checkboxChanged2,
      isRecommend: this.state.checkboxChanged3,
      newslettersEnabled: this.state.checkboxChanged
    };
    localStorage.setItem('oCreateAcctUserData', JSON.stringify(oCreateAcctUserData));
    var oCreateAcctUserData = localStorage.getItem('oCreateAcctUserData');
    // console.log('oCreateAcctUserData', JSON.parse(oCreateAcctUserData))
    var oCreateAcctUserData = JSON.parse(oCreateAcctUserData)
    this.props.fnUpdateUserDetails(
      oCreateAcctUserData
    );

    sendEvents(
      CONSTANTS.LOGIN_CATEGORY,
      CONSTANTS.LOGIN_ACTION,
      CONSTANTS.APPLE_LOGIN_ACTION
    );
    if (AppleResponse.code !== undefined) {
      this.props.fnSendAppleLoginResponse(
        AppleResponse,
        CONSTANTS.GRANT_TYPE_APPLE,
        () => {

          // this.props.fnFetchUserDetails((loginResponse) => {
          //   this.props.fnupdateGDPRCookieData(loginResponse)
          //   // console.log("fnFetchUserDetails---->", loginResponse)
          // }, null, true);

          common.redirectAfterLogin.call(this);
          sendEvents(CONSTANTS.LOGIN_CATEGORY, CONSTANTS.APPLE_LOGIN_ACTION);
        },

        this.fnAppleError.bind(this)
      );
      this.props.fnUpdateUserDetails(
        oCreateAcctUserData
      );
    }
  }


  fnAppleError() {
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  fnFacebookError() {
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  handleFacebookSocial(eve) {
    var msg = " ";
    var oCreateAcctUserData = {
      privacyPolicy: this.state.checkboxChanged1,
      isAdult: this.state.checkboxChanged2,
      isRecommend: this.state.checkboxChanged3,
      newslettersEnabled: this.state.checkboxChanged
    };
    if (!this.state.checkboxChanged1 || (!this.state.checkboxChanged2) || (!this.state.checkboxChanged3)) {
      msg = oResourceBundle.terms_error
      common.showToast(
        CONSTANTS.GENERIC_TOAST_ID,
        msg,
        toast.POSITION.BOTTOM_CENTER
      );
    }
    if (this.state.checkboxChanged && this.state.checkboxChanged2 && this.state.checkboxChanged3) {
      localStorage.setItem('oCreateAcctUserData', JSON.stringify(oCreateAcctUserData));
      var oCreateAcctUserData = localStorage.getItem('oCreateAcctUserData');
      // console.log('oCreateAcctUserData', JSON.parse(oCreateAcctUserData))
      var oCreateAcctUserData = JSON.parse(oCreateAcctUserData)
      this.props.fnUpdateUserDetails(
        oCreateAcctUserData
        // this.registerTwitterSuccess.bind(this, oCreateAcctUserData),
        // this.registerTwitterError.bind(this)
      );
      sendEvents(
        CONSTANTS.LOGIN_CATEGORY,
        CONSTANTS.LOGIN_ACTION,
        CONSTANTS.FACEBOOK_LOGIN_ACTION
      );

      var pathArray = window.location.href.split('/');
      var path = pathArray[pathArray.length - 1];

      CleverTap_CustomEvents("signin_initiated", {
        "method": "social_fb",
      })
    }
  }


  handleAppleSocial(eve) {
    var msg = " ";
    var oCreateAcctUserData = {
      privacyPolicy: this.state.checkboxChanged1,
      isAdult: this.state.checkboxChanged2,
      isRecommend: this.state.checkboxChanged3,
      newslettersEnabled: this.state.checkboxChanged
    };
    if (!this.state.checkboxChanged1 || (!this.state.checkboxChanged2) || (!this.state.checkboxChanged3)) {
      msg = oResourceBundle.terms_error
      common.showToast(
        CONSTANTS.GENERIC_TOAST_ID,
        msg,
        toast.POSITION.BOTTOM_CENTER
      );
    }
    if (this.state.checkboxChanged && this.state.checkboxChanged2 && this.state.checkboxChanged3) {
      localStorage.setItem('oCreateAcctUserData', JSON.stringify(oCreateAcctUserData));
      var oCreateAcctUserData = localStorage.getItem('oCreateAcctUserData');
      // console.log('oCreateAcctUserData', JSON.parse(oCreateAcctUserData))
      var oCreateAcctUserData = JSON.parse(oCreateAcctUserData)
      this.props.fnUpdateUserDetails(
        oCreateAcctUserData
        // this.registerTwitterSuccess.bind(this, oCreateAcctUserData),
        // this.registerTwitterError.bind(this)
      );
      sendEvents(
        CONSTANTS.LOGIN_CATEGORY,
        CONSTANTS.LOGIN_ACTION,
        CONSTANTS.APPLE_LOGIN_ACTION
      );
    }
  }



  /**
   * Component Name - SocialLogin
   *  Handle the Twitter Social Button for Login in the Application.
   *   @param {object} eve - Event handler
   */
  handleTwitterSocialButton(eve) {
    var pathArray = window.location.href.split('/');
    var path = pathArray[pathArray.length - 1];
    var msg = " "
    var oCreateAcctUserData = {
      privacyPolicy: this.state.checkboxChanged1,
      isAdult: this.state.checkboxChanged2,
      IsRecommend: this.state.checkboxChanged3,
      newslettersEnabled: this.state.checkboxChanged
    };
    localStorage.setItem('oCreateAcctUserData', JSON.stringify(oCreateAcctUserData));
    var oCreateAcctUserData = localStorage.getItem('oCreateAcctUserData');
    // console.log('oCreateAcctUserData', JSON.parse(oCreateAcctUserData))
    var oCreateAcctUserData = JSON.parse(oCreateAcctUserData)
    this.props.fnUpdateUserDetails(
      oCreateAcctUserData
    );
    // this.props.fnSaveNewUserDetails(oCreateAcctUserData2);

    if (!this.state.checkboxChanged1 || (!this.state.checkboxChanged2) || (!this.state.checkboxChanged3)) {
      msg = oResourceBundle.terms_error
      common.showToast(
        CONSTANTS.GENERIC_TOAST_ID,
        msg,
        toast.POSITION.BOTTOM_CENTER
      );
    }

    if (this.state.checkboxChanged1 && this.state.checkboxChanged2 && this.state.checkboxChanged3) {
      sendEvents(
        CONSTANTS.LOGIN_CATEGORY,
        CONSTANTS.LOGIN_ACTION,
        CONSTANTS.TWITTER_LOGIN_ACTION
      );
      // this.props.fnSaveNewUserDetails(oCreateAcctUserData2);


      this.props.fnGetTwitterToken(this.props.locale);
    }
  }


  handleTwitterSocialButtonLogin(eve) {
    sendEvents(
      CONSTANTS.LOGIN_CATEGORY,
      CONSTANTS.LOGIN_ACTION,
      CONSTANTS.TWITTER_LOGIN_ACTION
    );

    this.props.fnGetTwitterToken(this.props.locale);

  }

  /**
   * Component Name - SocialLogin
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    var pathArray = window.location.href.split('/');
    var path = pathArray[pathArray.length - 1];

    let Domine_Host = window.location.host 
    let baseUrl = Domine_Host 
    
    if(Domine_Host.includes("localhost") || Domine_Host.includes("webqa.weyyak.com")){
      baseUrl =  "webqa.weyyak.com"
    }

    return (
      <div className="social-login-container">
        {this.props.loading && <Spinner />}
        {(this.state.checkboxChanged1 && this.state.checkboxChanged2 && this.state.checkboxChanged3) ?
          (<FacebookLogin
            appId={CONSTANTS.FACEBOOK_ID}
            autoLoad={false}
            isMobile={true}
            disableMobileRedirect={true}
            version="8.0"
            fields="name,email,picture"
            callback={this.responseFacebook.bind(this)}
            render={renderProps => (
              <Button
                id="facebook_button"
                className="login-facebook"
                onClick={renderProps.onClick}
                tabIndex="0"
              >
                <div className="button-container">
                  <img
                    className="facebook-icon"
                    alt={oResourceBundle.log_in_facebook}
                    src={facebookIcon}
                  />
                  <div className="social-login-text">
                    {oResourceBundle.log_in_facebook}
                  </div>
                </div>
              </Button>
            )}
          />) :
          (<FacebookLogin
            appId={CONSTANTS.FACEBOOK_ID}
            autoLoad={false}
            isMobile={true}
            disableMobileRedirect={true}
            version="8.0"
            fields="name,email,picture"
            callback={this.responseFacebook.bind(this)}
            render={renderProps => (
              <Button
                id="facebook_button"
                className="login-facebook"
                onClick={eve => this.handleFacebookSocial(eve)}
                tabIndex="0"
              >
                <div className="button-container">
                  <img
                    className="facebook-icon"
                    alt={oResourceBundle.log_in_facebook}
                    src={facebookIcon}
                  />
                  <div className="social-login-text">
                    {oResourceBundle.log_in_facebook}
                  </div>
                </div>
              </Button>
            )}
          />)}
        <Button
          id="twitter_button"
          className="login-twitter"
          onClick={eve => this.handleTwitterSocialButton(eve)}
          tabIndex="0"
        >
          <div className="button-container">
            <img
              className="twitter-icon"
              alt={oResourceBundle.log_in_twitter}
              src={twitterIcon}
            />
            <div className="social-login-text">
              {oResourceBundle.log_in_twitter}
            </div>
          </div>
        </Button>
        <br></br>
        {(this.state.checkboxChanged1 && this.state.checkboxChanged2 && this.state.checkboxChanged3) ?
          <AppleLogin
            clientId={"com.weyyak.serviceid"}
            redirectURI={`https://${baseUrl}/${this.props.locale}/apple-token`}
            responseType={"code id_token"}
            scope='name email'
            // state='state'
            responseMode={"form_post"}
            // onClick={() => this.responseFromApple()}
            callback={this.responseFromApple.bind(this)}
            render={renderProps => (
              <Button
                id="apple_button"
                className="login-apple"
                onClick={renderProps.onClick}
                tabIndex="0"
              >
                <div className="button-container">
                  <img
                    className="apple-icon"
                    alt={oResourceBundle.log_in_apple}
                    src={appleIcon}
                  />
                  <div className="apple-login-text" >
                    {
                      path == 'login' ? oResourceBundle.continue_apple : oResourceBundle.log_in_apple
                    }
                  </div>
                </div>
              </Button>
            )}
          // designProp={
          //   {
          //     height: 55,
          //     width: 375,
          //     color: "white",
          //     border: false,
          //     type: "sign-in",
          //     border_radius: 15,
          //     scale: 1,
          //     locale: "en_US",
          //   }
          // }
          /> :
          <AppleLogin
            clientId={"com.weyyak.serviceid"}
            redirectURI={`https://${baseUrl}/${this.props.locale}/apple-token`}
            responseType={"code id_token"}
            scope='name email'
            responseMode={"form_post"}
            // callback={this.responseFromApple.bind(this)}
            render={renderProps => (
              <Button
                id="apple_button"
                className="login-apple"
                onClick={eve => this.handleAppleSocial(eve)}
                tabIndex="0"
              >
                <div className="button-container">
                  <img
                    className="apple-icon"
                    alt={oResourceBundle.log_in_apple}
                    src={appleIcon}
                  />
                  <div className="apple-login-text" >
                    {
                      path == 'login' ? oResourceBundle.continue_apple : oResourceBundle.log_in_apple
                    }
                  </div>
                </div>
              </Button>
            )}
          />
        }
        <div>
          <div className="subscribe-checkbox-wrapper-social custome-row">

            <div className="checkbox">
              <Checkbox
                text={ReactHtmlParser(oResourceBundle.subscribe_to_newsletter1)}
                onChange={this.handleCheck.bind(this)}
                customBackground={true}
                selected={this.state.checkboxChanged1}
                name="subscription-checkbox5"
              />
              <Checkbox
                text={oResourceBundle.subscribe_to_newsletter2}
                onChange={this.handleCheck1.bind(this)}
                customBackground={true}
                selected={this.state.checkboxChanged2}
                name="subscription-checkbox6"
              />
              <Checkbox
                text={oResourceBundle.subscribe_to_newsletter3}
                onChange={this.handleCheck2.bind(this)}
                customBackground={true}
                selected={this.state.checkboxChanged3}
                name="subscription-checkbox7"
              />
              <Checkbox
                text={oResourceBundle.subscribe_to_newsletter}
                onChange={this.handleCheck3.bind(this)}
                customBackground={true}
                selected={this.state.checkboxChanged}
                name="subscription-checkbox8"
              />
            </div>
          </div>
        </div>

      </div>
    );
  }
}

/**
 * method that maps state to props.
 * Component - SocialLogin
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    fnSendNewUserDetails: (
      oCreateAcctUserData,
      fnCreateAcctSuccessful,
      fnCreateAcctError
    ) => {
      dispatch(
        actionTypes.fnSendNewUserDetails(
          oCreateAcctUserData,
          fnCreateAcctSuccessful.bind(this),
          fnCreateAcctError.bind(this)
        )
      );
    },
    fnSaveNewUserDetails: newUserDetails => {
      dispatch(actionTypes.fnSaveNewUserDetails(newUserDetails));
    },
    fnUpdateUserDetails: oUserDetails => {
      dispatch(actionTypes.fnUpdateUserDetails(oUserDetails))
    },
    fnSendSocialLoginResponse: (fbResponse, grantType, fnFacebookSuccess, fnFacebookError) => {
      dispatch(
        actionTypes.fnSendSocialLoginResponse(
          fbResponse,
          grantType,
          fnFacebookSuccess,
          fnFacebookError
        )
      );
    },
    fnupdateGDPRCookieData: newUserDetails => {
      dispatch(actionTypes.fnupdateGDPRCookieData(newUserDetails));
    },
    fnFetchUserDetails: (fnSuccess, fnFailed, bShouldDispatch) => {
      dispatch(
        actionTypes.fnFetchUserDetails(fnSuccess, fnFailed, bShouldDispatch)
      );
    },
    handleUpdateAccount: (currentStateValues, fnSuccess, fnFailed) => {
      dispatch(
        actionTypes.fnHandleUpdateAccount(
          currentStateValues,
          fnSuccess,
          fnFailed
        )
      );
    },
    fnGetTwitterToken: langCode => {
      dispatch(actionTypes.fnGetTwitterToken(langCode));
    },
    stopLoader: () => {
      dispatch(actionTypes.stopLoader());
    }
  };
};

/**
 * Component - SocialLogin
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loading: state.loading
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SocialLogin);
