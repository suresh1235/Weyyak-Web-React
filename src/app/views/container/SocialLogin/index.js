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
import Logger from "core/Logger";
import { toast } from "core/components/Toaster/";
import { sendEvents } from "core/GoogleAnalytics/";

import "./index.scss";

const MODULE_NAME = "SocialLogin";

class SocialLogin extends React.Component {

  componentDidMount() {}

  componentDidUpdate() {}

  /**
   * Component Name - SocialLogin
   *  Response from the Facebook and redirect to Home Screen.
   * @param {object} eve - Event hanlder
   */
  responseFacebook(fbResponse) {
    Logger.log(MODULE_NAME, 'responseFacebook');
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
          common.redirectAfterLogin.call(this);
          sendEvents(CONSTANTS.LOGIN_CATEGORY, CONSTANTS.FACEBOOK_LOGIN_ACTION);
        },
        this.fnFacebookError.bind(this)
      );
    }
  }

  fnFacebookError() {
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  /**
   * Component Name - SocialLogin
   *  Handle the Twitter Social Button for Login in the Application.
   *   @param {object} eve - Event handler
   */
  handleTwitterSocialButton(eve) {
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
    return (
      <div className="social-login-container">
        {this.props.loading && <Spinner />}
        <FacebookLogin
          appId={CONSTANTS.FACEBOOK_ID}
          autoLoad={false}
          isMobile={true}
          disableMobileRedirect={true}
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
        />
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
