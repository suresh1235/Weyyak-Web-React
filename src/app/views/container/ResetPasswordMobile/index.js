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
import { connect } from "react-redux";
import * as common from "app/utility/common";
import * as CONSTANTS from "../../../AppConfig/constants";
import Spinner from "core/components/Spinner";
import Button from "../../../../core/components/Button/";
import Input from "../../../../core/components/Input/";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import errorIcon from "app/resources/assets/error.svg";
import goodIcon from "app/resources/assets/good.svg";
import { toast } from "core/components/Toaster/";
import "./index.scss";

class ResetPasswordMobile extends BaseContainer {
  /**
   * Represents ResetPasswordMobile.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      smsCode: "",
      newPassword: "",
      confirmNewPassword: "",
      error: {
        smsCode: true,
        newPassword: true,
        confirmNewPassword: true
      },
      bEnableChangePasswordBtn: false
    };
  }

  componentDidMount() {
    // if (!this.props.newUserDetails.phoneNumber) {
    //   this.props.history.push(`/${this.props.locale}`);
    // }
  }

  /**
   * Component Name - ResetPasswordMobile
   *  Handle the Return to Login Button that to redirect to Login Component.
   *  @param { null }
   */
  handleReturnToLoginButton() {
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.LOGIN}`);
  }
  /**
   * Component Name - MyAccount
   * Update button button enable/ disable
   * @param {null}
   */
  fnSetUpdateButtonEnabled = () => {
    if (this.state.smsCode) {
      this.setState(prevState => ({
        error: { ...prevState.error, smsCode: false }
      }));
    } else {
      this.setState(prevState => ({
        error: { ...prevState.error, smsCode: true }
      }));
    }

    if (common.fnCheckValidPassword(this.state.newPassword)) {
      this.setState(prevState => ({
        error: { ...prevState.error, newPassword: false }
      }));
    } else {
      this.setState(prevState => ({
        error: { ...prevState.error, newPassword: true }
      }));
    }

    if (
      this.state.confirmNewPassword === this.state.newPassword &&
      common.fnCheckValidPassword(this.state.newPassword)
    ) {
      this.setState(prevState => ({
        error: { ...prevState.error, confirmNewPassword: false }
      }));
    } else {
      this.setState(prevState => ({
        error: { ...prevState.error, confirmNewPassword: true }
      }));
    }

    if (
      this.state.smsCode !== "" &&
      common.fnCheckValidPassword(this.state.newPassword) &&
      this.state.confirmNewPassword === this.state.newPassword
    ) {
      this.setState({ bEnableChangePasswordBtn: true });
    } else {
      this.setState({ bEnableChangePasswordBtn: false });
    }
  };
  /**
   * Component Name - MyAccount
   * Form Inputs Changes, Updating the State.
   * @param {object} eve - Event hanlder
   */
  handleFormInputs(eve) {
    const { name, value } = eve.target;
    this.setState({ [name]: value }, this.fnSetUpdateButtonEnabled);
  }

  /**
   * Component Name - ResetPasswordMobile
   *  Handle the Send Button for Forgot Password.
   *  @param { null }
   */
  handleSendButton(eve) {
    //Making the API Call.
    const data = {
      phoneNumber: this.props.newUserDetails.phoneNumber || "+919045215092",
      otp: this.state.smsCode,
      password: this.state.newPassword
    };
    this.props.updatePasswordOTP(
      data,
      this.fnSuccessForgotPassword.bind(this),
      this.fnFailForgotPassword.bind(this)
    );
  }
  /**
   * Component Name - ResetPasswordMobile
   *  For Successful executing the forgot password API to backend and redirect to next page.
   * @param { null }
   */
  fnSuccessForgotPassword() {
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.LOGIN}`
    );
  }
  /**
   * Component Name - ResetPasswordMobile
   *  On Failure of forgot password API to backend and through the inline error.
   * @param { null }
   */
  fnFailForgotPassword(error) {
    //Fail
    if (error.response && error.response && error.response.data && error.response.data.invalid &&
    error.response.data.invalid.otp && error.response.data.invalid.otp.code) {
      common.showToast(
        CONSTANTS.REGISTER_ERROR_TOAST_ID,
        oResourceBundle.otp_does_not_match,
        toast.POSITION.BOTTOM_CENTER
      );
    } else {
      common.showToast(
        CONSTANTS.REGISTER_ERROR_TOAST_ID,
        oResourceBundle.something_went_wrong,
        toast.POSITION.BOTTOM_CENTER
      );
    }
  }

  resendOTP() {
    const data = {
      phonenumber: this.props.newUserDetails.phoneNumber || "+919045215092",
      requestType: CONSTANTS.OTP_REQUEST_TYPE_FORGOT_PASSWORD
    };
    this.props.sendOTPCode(
      data,
      this.resendSuccess.bind(this),
      this.resendError.bind(this)
    );
  }

  resendSuccess() {
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.otp_sent,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  resendError() {
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  /**
   * Component Name - ResetPasswordMobile
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        {this.props.loading && <Spinner />}
        <div className="reset-password-mobile">
          <div className="forgot-password-container">
            <div className="forgot-password-title">
              <p>{oResourceBundle.reset_password}</p>
            </div>
            <form className="form-forgot-password" name="formForgotPassword">
              <div className="label">{oResourceBundle.sms_code}</div>
              <div className="sms-code-input">
                <Input
                  tabIndex={"1"}
                  type="password"
                  name="smsCode"
                  value={this.state.smsCode}
                  onChange={this.handleFormInputs.bind(this)}
                />
                {this.state.error.smsCode ? (
                  <img alt="fail" src={errorIcon} />
                ) : (
                  <img alt="success" src={goodIcon} />
                )}
              </div>
              <div onClick={this.resendOTP.bind(this)} className="resend-sms-code">
                <p>{oResourceBundle.resend_sms_code}</p>
              </div>
              <div className="label">{oResourceBundle.new_password}</div>
              <div className="new-password-input">
                <Input
                  tabIndex={"1"}
                  type="password"
                  name="newPassword"
                  value={this.state.newPassword}
                  onChange={this.handleFormInputs.bind(this)}
                />
                {this.state.error.newPassword ? (
                  <img alt="fail" src={errorIcon} />
                ) : (
                  <img alt="success" src={goodIcon} />
                )}
              </div>
              <div className="label">{oResourceBundle.confirm_password_placeholder}</div>
              <div className="new-password-input">
                <Input
                  tabIndex={"1"}
                  type="password"
                  name="confirmNewPassword"
                  value={this.state.confirmNewPassword}
                  onChange={this.handleFormInputs.bind(this)}
                />
                {this.state.error.confirmNewPassword ? (
                  <img alt="fail" src={errorIcon} />
                ) : (
                  <img alt="success" src={goodIcon} />
                )}
              </div>
            </form>
            <div className="forgot-password-buttons">
              <Button
                className={"send-button forgot-button" + (this.state.bEnableChangePasswordBtn? " enable": "") }
                onClick={() => this.handleSendButton()}
              >
                {oResourceBundle.change_password}
              </Button>
              <Button
                className="return-button forgot-button"
                onClick={() => this.handleReturnToLoginButton()}
              >
                {oResourceBundle.btn_cancel}
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
    updatePasswordOTP: (
      data,
      fnSuccessForgotPassword,
      fnFailForgotPassword
    ) => {
      dispatch(
        actionTypes.updatePasswordOTP(
          data,
          fnSuccessForgotPassword,
          fnFailForgotPassword
        )
      );
    },
    sendOTPCode: (data, resendSuccess, resendError) => {
      dispatch(actionTypes.sendOTPCode(data, resendSuccess, resendError));
    },
  };
};
/**
 * Component - ResetPasswordMobile
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    loading: state.loading,
    locale: state.locale,
    newUserDetails: state.newUserDetails
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ResetPasswordMobile)
);
