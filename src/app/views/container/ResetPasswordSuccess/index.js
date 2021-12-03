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
import { connect } from 'react-redux';
import { LOGIN } from "app/AppConfig/constants";
import Button from '../../../../core/components/Button/';
import oResourceBundle from 'app/i18n/';
import withTracker from 'core/GoogleAnalytics/';

import './index.scss';

class ForgotPasswordSuccess extends BaseContainer {
  /**
  * Represents ForgotPasswordSuccess.
  * @constructor
  * @param {Object} props - Properties of the object.
  */
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: ''
    }
  }
  /**
    * Component Name - ForgotPasswordSuccess
    *  Handle the Return to Login Button that to redirect to Login Component.
    *  @param { null }
    */
  handleReturnToLoginButton() {
    this.props.history.push(`/${this.props.locale}/${LOGIN}`);
  }

  /**
   * Component Name - ForgotPasswordSuccess
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        <div className="reset-password-success-container">
          <div className="password-success">
            <div className="rectangle-box"></div>
            <div className="description">
              <p>{oResourceBundle.password_change_success}</p>
            </div>
            <div className="btn-return-to-login">
              <Button className="return-button" onClick={this.handleReturnToLoginButton.bind(this)}>{oResourceBundle.return_to_login}</Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

/**
 * Component - ForgotPasswordSuccess
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    forgotPasswordUserDetails: state.forgotPasswordUserDetails
  };
}


export default withTracker(connect(mapStateToProps)(ForgotPasswordSuccess));
