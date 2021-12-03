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
import * as common from "app/utility/common";
import * as CONSTANTS from "app/AppConfig/constants";
import { connect } from "react-redux";
import oResourceBundle from "app/i18n/";
import Button from "core/components/Button/";
import Spinner from "core/components/Spinner";
import withTracker from "core/GoogleAnalytics/";
import { toast } from "core/components/Toaster/";
import "./index.scss";

class EmailVerification extends BaseContainer {
  /**
   * Represents EmailVerification.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    if (!this.props.newUserDetails.email) {
      this.props.history.push(`/${this.props.locale}`);
    }
  }
  /**
   * Component Name - EmailVerification
   * For resending the verification email.
   * @param { null }
   * @returns {undefined}
   */
  handleResendConfirmation() {
    const data = {
      email: this.props.newUserDetails.email
    };
    this.props.resendVerificationEmail(
      data,
      this.resendSuccess.bind(this),
      this.resendFailure.bind(this)
    );
  }
  /**
   * Component Name - EmailVerification
   * For cancel the email verification.
   * @param { null }
   * @returns {undefined}
   */
  handleReturnToLogin() {
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.LOGIN}`);
  }

  resendSuccess() {
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.email_sent,
      toast.POSITION.BOTTOM_CENTER
    );
  }
  resendFailure() {
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  /**
   * Component Name - EmailVerification
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        {this.props.loading && <Spinner />}
        {!this.props.newUserDetails.emailVerified ? (
          <div className="email-verification-container">
            <div className="email-verification-content">
              <div className="margin-collpse"/>
              <div className="email-row">
                {oResourceBundle.email_confirmation_content}
                {this.props.newUserDetails.email}
                <br />
                {oResourceBundle.email_confirmation_click}
              </div>
              <div className="note">{oResourceBundle.email_confirmation_note}</div>
            </div>
            <div className="btn-container">
              <Button
                className="btn-resend"
                onClick={this.handleResendConfirmation.bind(this)}
              >
                {oResourceBundle.resend}
              </Button>
              <Button
                className="btn-login"
                onClick={this.handleReturnToLogin.bind(this)}
              >
                {oResourceBundle.return_to_login}
              </Button>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

/**
 * method that maps state to props.
 * Component - SignUp
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    resendVerificationEmail: (data, success, failure) => {
      dispatch(actionTypes.resendVerificationEmail(data, success, failure));
    }
  };
};
/**
 * Component - EmailVerification
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    newUserDetails: state.newUserDetails,
    loading: state.loading
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmailVerification)
);
