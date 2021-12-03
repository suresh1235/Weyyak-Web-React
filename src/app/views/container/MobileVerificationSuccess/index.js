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
import { Link } from "react-router-dom";
import BaseContainer from "core/BaseContainer/";
import { connect } from "react-redux";
import oResourceBundle from "app/i18n/";
import Button from "../../../../core/components/Button";
import withTracker from "core/GoogleAnalytics/";
import "./index.scss";

class MobileVerificationSuccess extends BaseContainer {
  /**
   * Represents MobileVerificationSuccess.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Component Name - MobileVerificationSuccess
   * After Successfully Email Verification and to redirect the home page.
   * @param { null }
   * @returns {undefined}
   */
  handleDoneButton() {}

  /**
   * Component Name - MobileVerificationSuccess
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        {
          <div className="mobile-verification-success-container">
            <div className="mobile-verification-content">
              <p>{oResourceBundle.thank_you}</p>
              <div className="mobile-row">
                {oResourceBundle.user_verification_success}
              </div>
            </div>
            <div className="btn-container">
              <Link tabIndex="0" to={`/${this.props.locale}`}>
                <Button
                  className="btn-done"
                  onClick={this.handleDoneButton.bind(this)}
                >
                  {oResourceBundle.done}
                </Button>
              </Link>
            </div>
          </div>
        }
      </React.Fragment>
    );
  }
}

/**
 * Component - MobileVerificationSuccess
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    newUserDetails: state.newUserDetails
  };
};

export default withTracker(connect(mapStateToProps)(MobileVerificationSuccess));
