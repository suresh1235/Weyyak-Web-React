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
import Button from "../../../../core/components/Button/";
import icon from "../../../resources/assets/login/ic-delete.png";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import "./index.scss";

class About extends BaseContainer {
  /**
   * Component Name - About
   *  Handle the Close Button and to redirect to Home Component.
   * @param { null }
   */
  handleCloseButton() {
    this.props.history.push(`/${this.props.locale}`);
  }

  /**
   * Component Name - About
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        <div className="about-overlay">
          <Button
            className="close-btn"
            icon={icon}
            onClick={() => this.handleCloseButton()}
          />
          <div className="about-overlay-container">
            <div className="static-page">
              <div className="overlay-title">{oResourceBundle.about}</div>
              <div className="static-content">
                {ReactHtmlParser(oResourceBundle.about_content)}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
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
};

export default withTracker(connect(mapStateToProps)(About));
