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
import Spinner from "core/components/Spinner";
import {connect} from "react-redux";
import * as actionTypes from "app/store/action/";
import {Link} from "react-router-dom";
import Button from "core/components/Button/";
import * as common from "app/utility/common";
import * as CONSTANTS from "app/AppConfig/constants";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import SocialLogin from "../SocialLogin";
import UserInput from "../../components/UserInput";
import showPasswordIcon from "app/resources/assets/login/show_password.svg";
import showPasswordCheckedIcon from "app/resources/assets/login/show_password_checked.svg";
import {sendEvents} from "core/GoogleAnalytics/";
import {toast} from "core/components/Toaster/";
import Logger from "core/Logger";

import "./index.scss";

const MODULE_NAME = "Login";

class Login extends BaseContainer {
  /**
   * Represents Login.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    Logger.log(MODULE_NAME, "constructor");
    this.state = {
      input: "",
      password: "",
      inputError: false,
      passwordValid: false,
      bEnableContinueBtn: false,
      remember: false,
      passwordIcon: showPasswordIcon
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    Logger.log(MODULE_NAME, "componentDidMount");
    this.checkAlreadyLoggedIn();
    this.props.stopLoader();
    this.updateWindowDimensions();
    this.fnScrollToTop();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentDidUpdate() {
    Logger.log(MODULE_NAME, "componentDidUpdate");
    this.checkAlreadyLoggedIn();
    if (this.props.twitterToken && this.props.twitterToken.oauth_token) {
      window.open(
        "https://api.twitter.com/oauth/authenticate?oauth_token=" +
          this.props.twitterToken.oauth_token,
        "_self"
      );
    }
  }

  componentWillUnmount() {
    this.setState({
      twitterToken: null
    });
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  /**
   * Updates local window dimensions to change for mobile or desktop view
   */
  updateWindowDimensions() {
    const bThresholdDesktop = window.matchMedia("(min-width: 745px)").matches;
    if (this.state.isDesktop !== bThresholdDesktop) {
      this.setState({isDesktop: bThresholdDesktop});
    }
  }

  fnSetContinueButtonEnabled() {
    if (!this.state.inputError && this.state.passwordValid) {
      this.setState({bEnableContinueBtn: true});
    } else {
      this.setState({bEnableContinueBtn: false});
    }
  }

  /**
   * Component Name - Login
   *  Handle the Close Button and to redirect to Home Component.
   * @param { null }
   */
  handleCloseButton() {
    this.props.history.push(`/${this.props.locale}`);
  }

  /**
   * Component Name - Login
   *  Handle the Create Account Button and redirecting to sign-up component.
   *  @param { null }
   */
  handleCreateAccount() {
    this.props.history.push(`/${this.props.locale}/sign-up`);
  }
  /**
   * Component Name - Login
   *  Handle the Confirm Button after setting the values in Input.
   *  @param { null }
   */
  loginClick(eve) {
    const data = {
      password: this.state.password,
      username: common.getRawNumber(this.state.input)
    };
    this.props.startLoader();

    this.props.fnSendLoginCredentials(
      data,
      () => {
        common.redirectAfterLogin.call(this);
        // sendEvents(
        //   CONSTANTS.LOGIN_CATEGORY,
        //   CONSTANTS.OWN_CREDENTIALS_LOGIN_ACTION
        // );
      },
      error => {
        let errorText = oResourceBundle.invalid_mail_or_password;
        if (this.state.bEmailValid) {
          if (CONSTANTS.STATUS_UNVERIFIED_EMAIL === error.status) {
            const data = {
              email: this.state.input
            };
            this.props.sendVerificationEmail(
              data,
              this.sendMailSuccess.bind(this),
              this.sendMailError.bind(this)
            );
            return;
          } else {
            common.showToast(
              CONSTANTS.REGISTER_ERROR_TOAST_ID,
              errorText,
              toast.POSITION.BOTTOM_CENTER
            );
          }
        } else if (this.state.bMobileValid) {
          if (
            error.response &&
            error.response.data &&
            CONSTANTS.STATUS_UNVERIFIED_MOBILE ===
              error.response.data.description
          ) {
            const data = {
              phoneNumber: common.getRawNumber(this.state.input),
              requestType: CONSTANTS.OTP_REQUEST_NEW_USER
            };
            this.props.sendOTPCode(
              data,
              this.sendOTPSuccess.bind(this),
              this.sendOTPError.bind(this)
            );
            return;
          } else {
            common.showToast(
              CONSTANTS.REGISTER_ERROR_TOAST_ID,
              errorText,
              toast.POSITION.BOTTOM_CENTER
            );
          }
        } else {
          common.showToast(
            CONSTANTS.REGISTER_ERROR_TOAST_ID,
            errorText,
            toast.POSITION.BOTTOM_CENTER
          );
        }
      }
    );
    let label = "";
    if (this.state.bEmailValid) {
      label = CONSTANTS.LABEL_EMAIL;
    } else if (this.state.bMobileValid) {
      label = CONSTANTS.LABEL_MOBILE;
    }
    sendEvents(
      CONSTANTS.LOGIN_CATEGORY,
      CONSTANTS.LOGIN_ACTION,
      label
    );
    eve.preventDefault();
  }

  sendMailSuccess() {
    let oNewUserDetails = {
      emailVerified: false,
      email: this.state.input
    };
    this.props.fnSaveNewUserDetails(oNewUserDetails);
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.CONFIRM_EMAIL}`);
  }

  sendMailError() {
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  sendOTPSuccess() {
    let oNewUserDetails = {
      phoneNumber: common.getRawNumber(this.state.input),
      password: this.state.password,
      requestType: CONSTANTS.OTP_REQUEST_NEW_USER
    };
    this.props.fnSaveNewUserDetails(oNewUserDetails);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.MOBILE_VERIFICATION}`
    );
  }
  sendOTPError() {
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  enterKeyOnInput(e) {
    if (!this.state.inputError && this.state.passwordValid) {
      this.loginClick(e);
    }
  }

  /**
   * Component Name - Login
   *  Checkbox Changes, Updating the State.
   * @param {object} eve - Event hanlder
   */
  handleCheckBox(eve) {
    this.setState({
      [eve.target.name]: eve.target.checked
    });
  }

  /**
   * Update only when previous props are different to current props.
   *
   * @param {Object} nextProps
   * @param {Object} nextState
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.twitterToken === null ||
      this.props.twitterToken !== nextProps.twitterToken
    ) {
      return true;
    }
    return false;
  }

  checkAlreadyLoggedIn() {
    const userDetails = common.getCookie(CONSTANTS.COOKIE_USER_OBJECT);
    if (userDetails) {
      this.props.history.push(`/${this.props.locale}`);
    }
  }

  inputStateChanged(newState) {
    this.setState(newState, this.fnSetContinueButtonEnabled);
  }

  updateCurrentInput(currentInputIsMobile) {
    this.setState({currentInputIsMobile: currentInputIsMobile});
  }

  forgotPasswordClicked() {
    sendEvents(
      CONSTANTS.FORGET_PASSWORD_CATEGORY,
      CONSTANTS.FORGET_PASSWORD_ACTION,
      CONSTANTS.FORGET_PASSWORD_LABEL
    );
  }
  /**
   * Component Name - Login
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    const seoTitle = oResourceBundle.website_meta_title;
    const description = oResourceBundle.website_meta_description;
    const oMetaObject = this.fnConstructMetaTags(
      seoTitle,
      window.location.href,
      description
    );
    const oMetaTags = this.fnUpdateMetaTags(oMetaObject);

    return (
      <React.Fragment>
        {oMetaTags}
        {this.props.loading && <Spinner />}
        <div className="signin-container">
          <div className="login">
            <span className="overlay-title">{`${
              oResourceBundle.sign_in
            }`}</span>
            <div className="login-container">
              <div className="input-container">
                <UserInput
                  dontValidatePhoneNumber={true}
                  countryCode={this.props.countryCode}
                  inputStateChanged={this.inputStateChanged.bind(this)}
                  minimumPasswordLength={
                    CONSTANTS.PASSWORD_VALIDATION_CONTENT_LENGTH
                  }
                  labelInput={oResourceBundle.login_email_placeholder}
                  labelPassword={oResourceBundle.password}
                  showPasswordIcon={showPasswordIcon}
                  showPasswordCheckedIcon={showPasswordCheckedIcon}
                  hidePasswordFiled={false}
                  updateCurrentInput={this.updateCurrentInput.bind(this)}
                  enterKeyOnInput={this.enterKeyOnInput.bind(this)}
                />
                <div className="forgot-password-wrapper">
                  <div className="forgot-password-text">
                    <Link
                      tabIndex="0"
                      className="forgot-password-text"
                      onClick={this.forgotPasswordClicked.bind(this)}
                      to={`/${this.props.locale}/${CONSTANTS.FORGOT_PASSWORD}`}
                    >
                      {oResourceBundle.forgot_password}
                    </Link>
                  </div>
                </div>
                <div className="action-btns">
                  <Button
                    className="btn-confirm"
                    disabled={!this.state.bEnableContinueBtn}
                    onClick={this.loginClick.bind(this)}
                    tabIndex="0"
                  >
                    {oResourceBundle.login_continue_button}
                  </Button>
                </div>
              </div>
              <div className="or-container">
                <div className="or-line" />
                <div className="or-text">{oResourceBundle.or}</div>
                <div className="or-line" />
              </div>
              <SocialLogin />
            </div>
            <div className="redirection-container">
              <div>{oResourceBundle.login_dont_have_account}</div>
              <Link
                key={"redirection"}
                to={`/${this.props.locale}/${CONSTANTS.SIGNUP}`}
              >
                <div className="redirection-name">
                  {oResourceBundle.login_redirection_text_to_register}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

/**
 * Component - Login
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loginDetails: state.loginDetails,
    loading: state.loading,
    twitterToken: state.twitterToken,
    countryCode: state.sCountryCode,
    loginToHome: state.loginToHome,
    resumePagePath: state.sResumePagePath
  };
};

/**
 * method that maps state to props.
 * Component - Login
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  //dispatch action to redux store
  return {
    fnSendLoginCredentials: (oCredentials, fnSuccess, fnError) => {
      dispatch(
        actionTypes.fnSendLoginCredentials(oCredentials, fnSuccess, fnError)
      );
    },
    fnSaveNewUserDetails: newUserDetails => {
      dispatch(actionTypes.fnSaveNewUserDetails(newUserDetails));
    },
    sendOTPCode: (data, sendSuccess, sendError) => {
      dispatch(actionTypes.sendOTPCode(data, sendSuccess, sendError));
    },
    sendVerificationEmail: (data, success, failure) => {
      dispatch(actionTypes.resendVerificationEmail(data, success, failure));
    },
    fnUpdateResumePagePath: sPath => {
      dispatch(actionTypes.fnUpdateResumePagePath(sPath));
    },
    startLoader: () => {
      dispatch(actionTypes.startLoader());
    },
    stopLoader: () => {
      dispatch(actionTypes.stopLoader());
    }
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
