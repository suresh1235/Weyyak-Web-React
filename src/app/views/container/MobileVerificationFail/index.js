/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */


import React from 'react';
import BaseContainer from 'core/BaseContainer/';
import './index.scss';
import { connect } from 'react-redux';
import oResourceBundle from 'app/i18n/';
import Button from '../../../../core/components/Button';
import withTracker from 'core/GoogleAnalytics/';

class MobileVerificationFail extends BaseContainer {
  /**
  * Represents MobileVerificationFail.
  * @constructor
  * @param {Object} props - Properties of the object.
  */
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  /**
   * Component Name - MobileVerificationFail
   * After Successfully Email Verification and to redirect the home page.
   * @param { null }
   * @returns {undefined}
 */
  handleDoneButton() {

  }

  /**
   * Component Name - MobileVerificationFail
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        {
          <div className="mobile-verification-container">
            <div className="mobile-verification-content">
              <p>{oResourceBundle.thank_you}</p>
              <div className="mobile-row">{oResourceBundle.user_verification_success}</div>
            </div>
            <div className="btn-container">
              <Button className="btn-resend" onClick={this.handleDoneButton.bind(this)}>{oResourceBundle.done}</Button>
            </div>
          </div>}
      </React.Fragment>
    )
  }
}

/**
 * Component - MobileVerificationFail
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    newUserDetails: state.newUserDetails
  };
}

export default withTracker(connect(mapStateToProps)(MobileVerificationFail));
