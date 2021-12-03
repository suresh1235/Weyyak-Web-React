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
import Image from "core/components/Image";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as CONSTANTS from "app/AppConfig/constants";

// import googleplay from "app/resources/assets/footer/playstore.svg";
// import appstore from "app/resources/assets/footer/apple.svg";

// import facebook from "app/resources/assets/footer/facebook.svg";
// import youtube from "app/resources/assets/footer/youtube.svg";
// import twitter from "app/resources/assets/footer/twitter.svg";
// import instagram from "app/resources/assets/footer/Instagram.svg";
// import linkedin from "app/resources/assets/footer/linkedin.svg";

import oResourceBundle from "app/i18n/";
import "./index.scss";

class AppFooter extends React.Component {
  /**
   * Component Name - AppFooter
   * It is a render method of Footer Component of Website.It will render the footer in the UI.
   * @param { null }
   * @returns { Object }
   */
  render() {
    const className = this.props.className + " app-footer";
    return (
      <React.Fragment>
        <footer className={className}>
          <div className="footer-top">

            <div className="footer-top-left">
              {
                <div className="links">
                  <Link
                    aria-label={oResourceBundle.about}
                    key={"about"}
                    className="router-link"
                    to={`/${this.props.locale}/${CONSTANTS.ABOUT}${
                      this.props.locale
                      }`}
                  >{`${oResourceBundle.about}`}</Link>
                  <Link
                    aria-label={oResourceBundle.privacy_policy}
                    key={"privacy"}
                    className="router-link"
                    to={`/${this.props.locale}/${CONSTANTS.PRIVACY_POLICY}${
                      this.props.locale
                      }`}
                  >{`${oResourceBundle.privacy_policy}`}</Link>
                  <Link
                    aria-label={oResourceBundle.terms}
                    key={"terms"}
                    className="router-link"
                    to={`/${this.props.locale}/${CONSTANTS.TERMS_OF_USE}${
                      this.props.locale
                      }`}
                  >{`${oResourceBundle.terms}`}</Link>
                </div>
              }
            </div>
            <div className="footer-top-right">
              <div className="download-app">
                <span>{oResourceBundle.app_available_on}</span>
                <a
                  href="https://play.google.com/store/apps/details?id=com.tva.z5"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={oResourceBundle.available_google_play}
                >
                  <Image
                    src="https://contents-uat.weyyak.z5.com/resources/assets/footer/playstore.svg"
                    alt={oResourceBundle.available_google_play}
                    hideFallback={true}
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/z5-weyyak-%D9%88%D9%8A%D8%A7%D9%83/id1226514781"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={oResourceBundle.available_app_store}
                >
                  <Image src="https://contents-uat.weyyak.z5.com/resources/assets/footer/apple.svg" alt="ic-appstore" hideFallback={true} />
                </a>
              </div>
              <div className="follow-us">
                <span>{oResourceBundle.follow_us_on}</span>
                <a href="https://www.linkedin.com/company/weyyak">
                  <img src="https://contents-uat.weyyak.z5.com/resources/assets/footer/linkedin.svg" hideFallback={true} />
                </a>
                <a href="https://www.instagram.com/z5weyyak/" target="_blank" rel="noopener noreferrer" aria-label={oResourceBundle.instagram} >
                  <img src="https://contents-uat.weyyak.z5.com/resources/assets/footer/Instagram.svg" alt={oResourceBundle.instagram} hideFallback={true} />
                </a>
                <a href="https://twitter.com/Z5weyyak" target="_blank" rel="noopener noreferrer" aria-label={oResourceBundle.twitter} >
                  <img src="https://contents-uat.weyyak.z5.com/resources/assets/footer/twitter.svg" alt={oResourceBundle.twitter} hideFallback={true} />
                </a>
                <a href="https://www.youtube.com/weyyakcom">
                  <img src="https://contents-uat.weyyak.z5.com/resources/assets/footer/youtube.svg" hideFallback={true} />
                </a>
                <a href="https://www.facebook.com/weyyakcom" target="_blank" rel="noopener noreferrer" aria-label={oResourceBundle.facebook} >
                  <img src="https://contents-uat.weyyak.z5.com/resources/assets/footer/facebook.svg" alt={oResourceBundle.facebook} hideFallback={true} />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{oResourceBundle.copyright}</span>
            {/* <strong className="z5-text"> Z5</strong> */}
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

/**
 * Component - AppFooter
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    aStaticMenuItems: state.aStaticMenuItems,
    locale: state.locale
  };
};

export default connect(mapStateToProps)(AppFooter);
