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
import {connect} from "react-redux";
import {toast} from "core/components/Toaster/";
import * as common from "app/utility/common";
import * as CONSTANTS from "../../../AppConfig/constants";
import Button from "../../../../core/components/Button/";
import Input from "../../../../core/components/Input/";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import errorIcon from "app/resources/assets/error.svg";
import goodIcon from "app/resources/assets/good.svg";
import "./index.scss";

class ForgotPasswordMobile extends BaseContainer {
  /**
   * Represents ForgotPasswordMobile.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      mobileErrorText: "",
      bMobileValid: false
    };
  }
  /**
   * Component Name - ForgotPasswordMobile
   *  Handle the Return to Login Button that to redirect to Login Component.
   *  @param { null }
   */
  handleReturnToLoginButton() {
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.LOGIN}`);
  }

  /**
   * Component Name - ForgotPasswordMobile
   *  Form Inputs Changes, Updating the State.
   * @param {object} eve - Event hanlder
   */
  handleFormInputs(eve) {
    const {value} = eve.target;
    const numberRegex = /^\+?[0-9]*$/;
    if (
      !numberRegex.test(value) ||
      value.length < CONSTANTS.MIN_MOBILE_NUMBER ||
      value.length > CONSTANTS.MAX_MOBILE_NUMBER
    ) {
      this.setState({
        mobile: value,
        mobileErrorText: oResourceBundle.mobile_invalid,
        bMobileValid: false
      });
    } else {
      this.setState({
        bMobileValid: true,
        mobileErrorText: ""
      });
    }
    this.setState({mobile: value});
  }

  /**
   * Component Name - ForgotPasswordMobile
   *  Handle the Send Button for Forgot Password.
   *  @param { null }
   */
  onChangePassword(eve) {
    //Making the API Call.
    this.props.fnForgotPasswordCall(
      this.state.mobile,
      this.props.locale,
      this.fnSuccessForgotPassword.bind(this),
      this.fnFailForgotPassword.bind(this)
    );
  }
  /**
   * Component Name - ForgotPasswordMobile
   *  For Successful executing the forgot password API to backend and redirect to next page.
   * @param { null }
   */
  fnSuccessForgotPassword() {
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.password_change_success,
      toast.POSITION.BOTTOM_CENTER
    );
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.FORGOT_PASSWORD_MOBILE_OTP}`
    );
  }
  /**
   * Component Name - ForgotPasswordMobile
   *  On Failure of forgot password API to backend and through the inline error.
   * @param { null }
   */
  fnFailForgotPassword(error) {
    //Fail
  }

  /**
   * Component Name - ForgotPasswordMobile
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        <div className="forgot-password-mobile">
          <div className="forgot-password-container">
            <div className="forgot-password-title">
              <p>{oResourceBundle.forgot_password}</p>
            </div>
            <div className="description">
              <p>{oResourceBundle.enter_mobile}</p>
            </div>
            <form className="form-forgot-password" name="formForgotPassword">
              <div className="email-input">
                <Input
                  tabIndex={"1"}
                  type="text"
                  placeholder={oResourceBundle.mobile_number}
                  onChange={this.handleFormInputs.bind(this)}
                  value={this.state.mobile}
                />
                {!this.state.bMobileValid ? (
                  <img alt="fail" src={errorIcon} />
                ) : (
                  <img alt="success" src={goodIcon} />
                )}
              </div>
            </form>
            <div className="forgot-password-buttons">
              <Button
                className="send-button forgot-button highlight"
                onClick={() => this.onChangePassword()}
                disabled={!this.state.bMobileValid}
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
    }
  };
};
/**
 * Component - ForgotPasswordMobile
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ForgotPasswordMobile)
);
