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
import * as CONSTANTS from "../../../AppConfig/constants";
import { fnCheckValidPassword, showToast } from "app/utility/common";
import Button from "../../../../core/components/Button/";
import Input from "../../../../core/components/Input/";
import QueryString from "query-string";
import Spinner from "core/components/Spinner";
import { toast } from "core/components/Toaster/";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import errorIcon from "app/resources/assets/error.svg";
import goodIcon from "app/resources/assets/good.svg";
import "./index.scss";

class EmailResetPassword extends BaseContainer {
  /**
   * Represents EmailResetPassword.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      confirmNewPassword: "",
      error: {
        newPassword: true,
        confirmNewPassword: true
      },
      bEnableChangePasswordBtn: false
    };
  }

  /**
   * Component Name - EmailResetPassword
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
    if (fnCheckValidPassword(this.state.newPassword)) {
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
      fnCheckValidPassword(this.state.newPassword)
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
      fnCheckValidPassword(this.state.newPassword) &&
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
   * Component Name - EmailResetPassword
   *  Handle the Send Button for Forgot Password.
   *  @param { null }
   */
  handleSendButton(eve) {
    const query = QueryString.parse(this.props.location.search);
    let resetPasswordData = {
      email: query.email,
      resetPasswordToken: query.resetPasswordToken,
      password: this.state.newPassword
    };
    this.props.fnResetPassword(
      resetPasswordData,
      this.fnSuccessForgotPassword.bind(this),
      this.fnFailForgotPassword.bind(this)
    );
  }
  /**
   * Component Name - EmailResetPassword
   *  For Successful executing the forgot password API to backend and redirect to next page.
   * @param { null }
   */
  fnSuccessForgotPassword() {
    this.props.setLoginToHome(true);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.RESET_PASSWORD_SUCCESS}`
    );
  }
  /**
   * Component Name - EmailResetPassword
   *  On Failure of forgot password API to backend and through the inline error.
   * @param { null }
   */
  fnFailForgotPassword(error) {
    let errorText = oResourceBundle.something_went_wrong;
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.description
    ) {
      errorText = error.response.data.description;
    }
    showToast(
      CONSTANTS.MY_PLAYLIST_TOAST_ID,
      errorText,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  onKeyDown(e) {
    switch (e.keyCode) {
      case CONSTANTS.ENTER_KEYCODE:
        if (this.state.bEnableChangePasswordBtn) {
          this.handleSendButton(e);
        }
        break;
      default:
    }
  }

  /**
   * Component Name - EmailResetPassword
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        {this.props.loading && <Spinner />}
        <div className="reset-password-email">
          <div className="forgot-password-container">
            <div className="forgot-password-title">
              <p>{oResourceBundle.reset_password}</p>
            </div>

            <form className="form-forgot-password" name="formForgotPassword">
              {/* <div className="password-tips1">
                <div className="password-tips">
                  {"Choose a strong password and don't reuse it for other accounts."}
                </div>
                <div className="password-tips">
                  {"Learn more.Changing your password will sign you out of all your devices, including your phone. You will need to enter your new password on all your devices."}
                </div>
              </div> */}
              <div className="new-password-input">
                <Input
                  tabIndex={"1"}
                  type="password"
                  name="newPassword"
                  value={this.state.newPassword}
                  placeholder={oResourceBundle.new_password}
                  onChange={this.handleFormInputs.bind(this)}
                  onKeyDown={this.onKeyDown.bind(this)}
                />
                {this.state.error.newPassword ? (
                  <img alt="fail" src={errorIcon} />
                ) : (
                  <img alt="success" src={goodIcon} />
                )}
              </div>
              {/* <div className="password-tips1">
                <div className="password-tips">
                  {"Password strength:"}
                </div>
                <div className="password-tips">
                  {"Use at least 8 characters. Don’t use a password from another site, or something too obvious like your pet’s name. Why?"}
                </div>
              </div> */}

              <div className="new-password-input">
                <Input
                  tabIndex={"1"}
                  type="password"
                  name="confirmNewPassword"
                  value={this.state.confirmNewPassword}
                  placeholder={oResourceBundle.confirm_password_placeholder}
                  onChange={this.handleFormInputs.bind(this)}
                  onKeyDown={this.onKeyDown.bind(this)}
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
                className="send-button forgot-button highlight"
                onClick={() => this.handleSendButton()}
                disabled={!this.state.bEnableChangePasswordBtn}
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
    fnResetPassword: (
      oUserEmailDetail,
      fnSuccessForgotPassword,
      fnFailForgotPassword
    ) => {
      dispatch(
        actionTypes.fnResetPassword(
          oUserEmailDetail,
          fnSuccessForgotPassword,
          fnFailForgotPassword
        )
      );
    },
    setLoginToHome: bool => {
      dispatch(actionTypes.setLoginToHome(bool));
    }
  };
};
/**
 * Component - EmailResetPassword
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

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmailResetPassword)
);
