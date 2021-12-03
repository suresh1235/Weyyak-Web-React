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
import Button from '../../../../core/components/Button/';
import icon from '../../../resources/assets/login/ic-delete.png';
import { connect } from 'react-redux';
import oResourceBundle from 'app/i18n/';
import ReactHtmlParser from 'react-html-parser';
import withTracker from 'core/GoogleAnalytics/';

// TODO add a generic base class for twitter and fb login
class Cookie extends BaseContainer {

  componentDidMount() {
    this.fnScrollToTop();
  }

  /**
    * Component Name - Privacy
    *  Handle the Close Button and to redirect to Home Component.
    * @param { null }
    */
  handleCloseButton() {
    this.props.history.push(`/${this.props.locale}`);
  }

  /**
   * Component Name - Privacy
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        <div className="privacy-overlay">
          {/* <Button className="close-btn" icon={icon} onClick={() => this.handleCloseButton()}></Button> */}
          <div className="privacy-overlay-container">
            <div className="static-page">
              <div className="overlay-title">{oResourceBundle.cookie_policy}</div>
              <div className="static-content">{ReactHtmlParser(oResourceBundle.cookie_content)}</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

/**
 * Component - Login
 * method that maps state to props.
* @param {Object} state - state from redux store.
* @return {Object} - state mapped to props
    */
const mapStateToProps = state => {
  return {
    locale: state.locale
  };
}

export default withTracker(connect(mapStateToProps)(Cookie));
