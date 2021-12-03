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
import QueryString from "query-string";
import * as actionTypes from "app/store/action/";
import BaseContainer from "core/BaseContainer/";
import { connect } from "react-redux";
import oResourceBundle from "app/i18n/";
import * as CONSTANTS from "../../../AppConfig/constants";
import { setCookie } from "app/utility/common";
import Button from "../../../../core/components/Button/";
import Spinner from "core/components/Spinner";
import withTracker from "core/GoogleAnalytics/";

import "./index.scss";

class EmailVerificationCheck extends BaseContainer {
  /**
   * Represents EmailVerificationCheck.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      failure: false
    };
  }

  componentDidMount() {
    const query = QueryString.parse(this.props.location.search);
    if (query.confirmationToken && query.dateTimeToken) {
      const data = {
        confirmationToken: decodeURIComponent(query.confirmationToken),
        dateTimeToken: query.dateTimeToken
      };
      this.props.fnVerifyEmail(
        data,
        this.verifySuccess.bind(this),
        this.verifyFailure.bind(this)
      );
    } else {
      this.setState({
        failure: true
      });
    }
  }

  /**
   * Component Name - EmailVerificationCheck
   * After Successfully Email Verification and to redirect the home page.
   * @param { null }
   * @returns {undefined}
   */
  handleDoneButton() {
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.LOGIN}`);
    if (!this.props.isMENARegion) {
      setCookie(
        CONSTANTS.COOKIE_GO_TO_SUBSCRIBE,
        true,
        CONSTANTS.INFINITE_COOKIE_TIME
      );
    }
  }

  handleRegisterButton() {
    this.props.history.push(`/${this.props.locale}/sign-up`);
  }

  verifySuccess() {
    this.setState({
      success: true
    });
  }

  verifyFailure() {
    this.setState({
      failure: true
    });
  }

  /**
   * Component Name - EmailVerificationCheck
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <div className="email-verification-success-container">
            <div className="email-verification-success-content">
              {this.state.success && (
                // <p>{oResourceBundle.thank_you}</p>
                <p>{""}</p>
              )}
              {this.state.failure && <p>{oResourceBundle.link_expired}</p>}
              {this.state.success && (
                <div className="email-row">
                  {oResourceBundle.user_verification_success}
                </div>
              )}
              {this.state.failure && (
                <div className="email-row">
                  {oResourceBundle.link_expired_desc}
                  <br />
                  {oResourceBundle.expired_desc}
                </div>
              )}
            </div>

            <div className="btn-container">
              <Button
                className="btn-done"
                onClick={this.handleDoneButton.bind(this)}
              >
                {this.state.success && oResourceBundle.return_to_login}
                {this.state.failure && oResourceBundle.register}
              </Button>
            </div>
          </div>
        )}
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
    fnVerifyEmail: (query, success, failure) => {
      dispatch(actionTypes.fnVerifyEmail(query, success, failure));
    }
  };
};

/**
 * Component - EmailVerificationCheck
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    newUserDetails: state.newUserDetails,
    loading: state.loading,
    isMENARegion: state.isMENARegion
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmailVerificationCheck)
);
