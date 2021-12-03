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
import * as actionTypes from "app/store/action/";
import Spinner from "core/components/Spinner";
import { connect } from "react-redux";
import * as CONSTANTS from "../../../AppConfig/constants";
import * as common from "app/utility/common";
import Button from "../../../../core/components/Button/";
import oResourceBundle from "app/i18n/";
import {sendEvents} from "core/GoogleAnalytics/";
import withTracker from "core/GoogleAnalytics/";
import errorIcon from "app/resources/assets/error.svg";
import goodIcon from "app/resources/assets/good.svg";
import UserInput from "../../components/UserInput";
import { toast } from "core/components/Toaster/";
import "./index.scss";

class ForgotPassword extends BaseContainer {
  /**
   * Represents ForgotPassword.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      errorText: ""
    };
  }
  /**
   * Component Name - ForgotPassword
   *  Handle the Return to Login Button that to redirect to Login Component.
   *  @param { null }
   */
  handleReturnToLoginButton() {
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.LOGIN}`);
  }

  /**
   * Component Name - ForgotPassword
   * Form Inputs Changes, Updating the State.
   */
  handleFormInputs() {
    if (this.state.bEmailValid || this.state.bMobileValid) {
    }
  }

  inputStateChanged(newState) {
    this.setState(newState, this.handleFormInputs);
  }

  /**
   * Component Name - ForgotPassword
   *  Handle the Send Button for Forgot Password.
   *  @param { null }
   */
  handleSendButton(eve) {
    if (this.state.bMobileValid) {
      const data = {
        phonenumber: common.getRawNumber(this.state.input),
        requestType: CONSTANTS.OTP_REQUEST_TYPE_FORGOT_PASSWORD
      };
      const newUser = {
        phoneNumber: common.getRawNumber(this.state.input),
        requestType: CONSTANTS.OTP_REQUEST_TYPE_FORGOT_PASSWORD
      };
      this.props.fnSaveNewUserDetails(newUser);
      this.props.sendOTPCode(
        data,
        this.resendSuccess.bind(this),
        this.resendError.bind(this)
      );
      sendEvents(
        CONSTANTS.FORGET_PASSWORD_CATEGORY,
        CONSTANTS.FORGET_PASSWORD_ACTION,
        CONSTANTS.LABEL_MOBILE
      );
    } else if (this.state.bEmailValid) {
      this.props.fnForgotPasswordCall(
        this.state.input,
        this.props.locale,
        this.fnSuccessForgotPassword.bind(
          this,
          `/${this.props.locale}/${CONSTANTS.FORGOT_PASSWORD_SUCCESS}`
        ),
        this.fnFailForgotPassword.bind(this)
      );
      sendEvents(
        CONSTANTS.FORGET_PASSWORD_CATEGORY,
        CONSTANTS.FORGET_PASSWORD_ACTION,
        CONSTANTS.LABEL_EMAIL
      );
    }
  }

  resendSuccess() {
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.FORGOT_PASSWORD_MOBILE_OTP}`
    );
  }

  resendError(error) {
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.invalid &&
      error.response.data.invalid.phoneNumber &&
      error.response.data.invalid.phoneNumber.code
    ) {
      if (CONSTANTS.FORGOT_PASSWORD_PHONE_UNREGISTERED === error.response.data.invalid.phoneNumber.code) {
        common.showToast(
          CONSTANTS.REGISTER_ERROR_TOAST_ID,
          oResourceBundle.error_phone_number_unregistered,
          toast.POSITION.BOTTOM_CENTER
        );
        return;
      } else if (CONSTANTS.PHONE_UNVERIFIED === error.response.data.invalid.phoneNumber.code) {
        common.showToast(
          CONSTANTS.REGISTER_ERROR_TOAST_ID,
          oResourceBundle.phone_number_unverified,
          toast.POSITION.BOTTOM_CENTER
        );
        return;
      }
    }
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }
  /**
   * Component Name - ForgotPassword
   *  For Successful executing the forgot password API to backend and redirect to next page.
   * @param { null }
   */
  fnSuccessForgotPassword(sPath) {
    common.fnNavTo.call(this, sPath);
  }
  /**
   * Component Name - ForgotPassword
   *  On Failure of forgot password API to backend and through the inline error.
   * @param { null }
   */
  fnFailForgotPassword(error) {
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.invalid &&
      error.response.data.invalid.email &&
      error.response.data.invalid.email.code
    ) {
      if (CONSTANTS.FORGOT_PASSWORD_EMAIL_UNREGISTERED === error.response.data.invalid.email.code) {
        common.showToast(
          CONSTANTS.REGISTER_ERROR_TOAST_ID,
          oResourceBundle.error_user_email_unregistered,
          toast.POSITION.BOTTOM_CENTER
        );
        return;
      } else if (CONSTANTS.FORGOT_PASSWORD_EMAIL_UNREGISTERED === error.response.data.invalid.email.code) {
        common.showToast(
          CONSTANTS.REGISTER_ERROR_TOAST_ID,
          oResourceBundle.error_user_email_unregistered,
          toast.POSITION.BOTTOM_CENTER
        );
        return;
      }
    }
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  enterKeyOnInput(e) {
    this.handleSendButton(e);
  }
  /**
   * Component Name - ForgotPassword
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        {this.props.loading && <Spinner />}
        <div className="forgot-password">
          <div className="forgot-password-container">
            <div className="forgot-password-title">
              <p>{oResourceBundle.forgot_password}</p>
            </div>
            <div className="description">
              <p>{oResourceBundle.enter_email}</p>
            </div>
            <div className="form-forgot-password" name="formForgotPassword">
              <div className="email-input">
                {/*<Input
                  tabIndex={"1"}
                  type="email"
                  placeholder={oResourceBundle.forgot_password_input_placeholder}
                  onChange={this.handleFormInputs.bind(this)}
                  value={this.state.email}
                /> */}
                {!(this.state.bEmailValid || this.state.bMobileValid) ? (
                  <img alt="fail" src={errorIcon} />
                ) : (
                  <img alt="success" src={goodIcon} />
                )}
              </div>
            </div>
            <UserInput
              countryCode={this.props.countryCode}
              dontValidatePhoneNumber={true}
              inputStateChanged={this.inputStateChanged.bind(this)}
              hidePasswordField={true}
              enterKeyOnInput={this.enterKeyOnInput.bind(this)}
            />
            <div className="forgot-password-buttons">
              <Button
                className="send-button forgot-button highlight"
                onClick={() => this.handleSendButton()}
                disabled={!(this.state.bEmailValid || this.state.bMobileValid)}
              >
                {oResourceBundle.send}
              </Button>
              <Button
                className="return-button forgot-button"
                onClick={() => this.handleReturnToLoginButton()}
              >
                {oResourceBundle.return_to_login}
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fnForgotPasswordCall: (
      oUserEmailDetail,
      locale,
      fnSuccessForgotPassword,
      fnFailForgotPassword
    ) => {
      dispatch(
        actionTypes.fnForgotPasswordCall(
          oUserEmailDetail,
          locale,
          fnSuccessForgotPassword,
          fnFailForgotPassword
        )
      );
    },
    sendOTPCode: (data, sendSuccess, sendError) => {
      dispatch(actionTypes.sendOTPCode(data, sendSuccess, sendError));
    },
    fnSaveNewUserDetails: newUserDetails => {
      dispatch(actionTypes.fnSaveNewUserDetails(newUserDetails));
    },
  };
};
/**
 * Component - ForgotPassword
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    countryCode: state.sCountryCode,
    loading: state.loading
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ForgotPassword)
);
