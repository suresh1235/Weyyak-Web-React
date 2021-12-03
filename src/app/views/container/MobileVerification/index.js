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
import { connect } from "react-redux";
import * as actionTypes from "app/store/action/";
import oResourceBundle from "app/i18n/";
import Button from "core/components/Button/";
import * as common from "app/utility/common";
import * as CONSTANTS from "app/AppConfig/constants";
import OTPInput from "../../../../core/components/OTPInput/";
import withTracker from "core/GoogleAnalytics/";
import Spinner from "core/components/Spinner";
import { sendEvents } from "core/GoogleAnalytics/";
import { toast } from "core/components/Toaster/";
import DesktopImage from "app/resources/assets/login/computers.png";
import "./index.scss";

class MobileVerification extends BaseContainer {
  /**
   * Represents MobileVerification.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      otp: ""
    };
    this.numberOfFields = 4;
  }

  componentDidMount() {
    if (!this.props.newUserDetails.phoneNumber) {
      this.props.history.push(`/${this.props.locale}`);
    }
  }
  /**
   * Component Name - MobileVerification
   * For Verifying the Code Enter.
   * @param { null }
   * @returns {undefined}
   */
  handleVerifyCode() {
    const otpCode = this.state.otp;
    const data = {
      phonenumber: this.props.newUserDetails.phoneNumber,
      otp: otpCode
    };
    if (this.props.newUserDetails.myAccountUpdate === true) {
      this.props.updatePhoneNumber(
        data,
        this.verifySuccess.bind(this),
        this.verifyError.bind(this)
      );
    } else {
      this.props.verifyOTPCode(
        data,
        this.verifySuccess.bind(this),
        this.verifyError.bind(this)
      );
    }
  }

  verifySuccess() {
    if (this.props.newUserDetails.myAccountUpdate === true) {
      common.showToast(
        CONSTANTS.REGISTER_ERROR_TOAST_ID,
        oResourceBundle.profile_update_success,
        toast.POSITION.BOTTOM_CENTER
      );
      this.props.history.push(`/${this.props.locale}/${CONSTANTS.MY_ACCOUNT}`);
    } else {
      const data = {
        password: this.props.newUserDetails.password,
        username: common.getRawNumber(this.props.newUserDetails.phoneNumber),
      };
      this.props.fnSendLoginCredentials(
        data,
        () => {
          // TODO thank you page
          sendEvents(
            CONSTANTS.LOGIN_CATEGORY,
            CONSTANTS.OWN_CREDENTIALS_LOGIN_ACTION
          );
          this.props.history.push(`/${this.props.locale}`);
        },
        error => {
          common.showToast(
            CONSTANTS.REGISTER_ERROR_TOAST_ID,
            oResourceBundle.something_went_wrong,
            toast.POSITION.BOTTOM_CENTER
          );
        }
      );
    }
  }

  verifyError(error) {
    try {
      if (error.response.data.invalid.otp.code === CONSTANTS.OTP_INVALID) {
        common.showToast(
          CONSTANTS.REGISTER_ERROR_TOAST_ID,
          oResourceBundle.otp_does_not_match,
          toast.POSITION.BOTTOM_CENTER
        );
        return;
      }
    } catch (ex) {}
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  resendOTP() {
    const data = {
      phonenumber: this.props.newUserDetails.phoneNumber,
      requestType:
        this.props.newUserDetails.requestType || CONSTANTS.OTP_REQUEST_NEW_USER
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
   * Component Name - MobileVerification
   * For cancel the email verification.
   * @param { null }
   * @returns {undefined}
   */
  handleCancel() {}

  otpChanged(newOtp) {
    this.setState({
      otp: newOtp
    });
  }

  /**
   * Component Name - MobileVerification
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        {this.props.loading && <Spinner />}
        <div className="mobile-verification-container">
          <div className="desktop-icon">
            <img className="desktop-icon" alt="computers" src={DesktopImage} />
          </div>
          <div className="mobile-verification-content">
            <p>{oResourceBundle.mobile_confirmation_note}</p>
          </div>
          <div className="mobile-verification-input">
            <OTPInput
              otpChanged={this.otpChanged.bind(this)}
              numberOfFields={this.numberOfFields}
            />
          </div>
          <div className="btn-container">
            <div onClick={this.resendOTP.bind(this)} className="resend-link">
              {oResourceBundle.resend}
            </div>
            <Button
              className="btn-verify"
              disabled={this.state.otp.length !== this.numberOfFields}
              onClick={this.handleVerifyCode.bind(this)}
            >
              {oResourceBundle.mobile_verification_button}
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

/**
 * Component - MobileVerification
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    loading: state.loading,
    locale: state.locale,
    newUserDetails: state.newUserDetails,
    loginToHome: state.loginToHome
  };
};

/**
 * method that maps state to props.
 * Component - MobileVerification
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    verifyOTPCode: (
      data,
      fnOTPVerificationSuccessful,
      fnOTPVerificationError
    ) => {
      dispatch(
        actionTypes.verifyOTPCode(
          data,
          fnOTPVerificationSuccessful,
          fnOTPVerificationError
        )
      );
    },
    fnSendLoginCredentials: (oCredentials, fnSuccess, fnError) => {
      dispatch(
        actionTypes.fnSendLoginCredentials(oCredentials, fnSuccess, fnError)
      );
    },
    sendOTPCode: (data, resendSuccess, resendError) => {
      dispatch(actionTypes.sendOTPCode(data, resendSuccess, resendError));
    },
    updatePhoneNumber: (data, verifySuccess, verifyError) => {
      dispatch(actionTypes.updatePhoneNumber(data, verifySuccess, verifyError));
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
  )(MobileVerification)
);
