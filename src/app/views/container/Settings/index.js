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
import { connect } from "react-redux";
import { ENABLE_SUBSCRIPTION } from "app/AppConfig/features";
import * as constants from "../../../AppConfig/constants";
import * as actionTypes from "app/store/action/";
import * as common from "app/utility/common";
import withTracker from "core/GoogleAnalytics/";
import { isUserLoggedIn, isUserSubscribed } from "app/utility/common";
import Spinner from "core/components/Spinner";
import oResourceBundle from "app/i18n/";
import "./index.scss";

class Settings extends BaseContainer {
  getSettingsItem(sTitle, sDescription, clickHandler) {
    return (
      <div
        className="setting-item"
        onClick={() => typeof clickHandler === "function" && clickHandler()}
      >
        <div className="setting-item-title">{sTitle}</div>
        <div className="setting-item-desc">{sDescription}</div>
        <div className="arrow" />
      </div>
    );
  }

  /**
   * Component Name - Settings
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    let userIdentifier = common.getUserIdentifier();

    return (
      <div className="settings-container">
        <div className="settings">
          <div className="title">{oResourceBundle.settings}</div>
          {isUserLoggedIn()
            ? this.getSettingsItem(oResourceBundle.my_account, userIdentifier, () =>
              common.fnNavTo.call(
                this,
                `/${this.props.locale}/${constants.MY_ACCOUNT}`
              )
            )
            : null}
          {ENABLE_SUBSCRIPTION && isUserLoggedIn()
            ? this.getSettingsItem(
              oResourceBundle.my_subscripton,
              oResourceBundle.manage_your_plans,
              () =>
                common.fnNavTo.call(
                  this,
                  `/${this.props.locale}/${constants.MY_SUBSCRIPTION}/`
                )
            )
            : null}
          {isUserLoggedIn()
            ? this.getSettingsItem(
              oResourceBundle.devices,
              oResourceBundle.manage_your_devices,
              () => 
                common.fnNavTo.call(
                  this,
                  `/${this.props.locale}/${constants.DEVICE_MANAGEMENT}/`
                ) 
            )
            : null}
          {isUserLoggedIn()
            ? this.getSettingsItem(
              oResourceBundle.my_activity,
              oResourceBundle.my_activity,
              () =>
                common.fnNavTo.call(
                  this,
                  `/${this.props.locale}/${constants.MY_ACTIVITY}`
                )
            )
            : null}
          {isUserLoggedIn()
            ? this.getSettingsItem(
              oResourceBundle.Cookies,
              oResourceBundle.ManageYourCookies,
              () =>
                common.getGDPRCookie('cookies_accepted') ? common.fnNavTo.call(
                  this,
                  `/${this.props.locale}/${constants.MANAGE_COOKIES}`
                ) : ""
            )
            : null}
          {this.getSettingsItem(
            oResourceBundle.privacy,
            oResourceBundle.read_all_about_our_privacy_policy,
            () =>
              common.fnNavTo.call(
                this,
                `/${this.props.locale}/${constants.PRIVACY_POLICY}${this.props.locale
                }`
              )
          )}
          {this.getSettingsItem(
            oResourceBundle.terms_of_use,
            oResourceBundle.read_all_about_our_terms_of_use,
            () =>
              common.fnNavTo.call(
                this,
                `/${this.props.locale}/${constants.TERMS_OF_USE}${this.props.locale
                }`
              )
          )}
          {isUserLoggedIn()
            ? this.getSettingsItem(
              oResourceBundle.sign_out,
              oResourceBundle.sign_out_of_your_account,
              () => {
                common.deleteCookie(constants.COOKIE_USER_OBJECT);
                common.deleteCookie(constants.COOKIE_USER_TOKEN);
                common.DeleteGDPRCookie('GDPR_Cookies');
                common.DeleteGDPRCookie('cookies_accepted');
                localStorage.removeItem("Ramadan")
                sessionStorage.removeItem("subscribedUser")
                sessionStorage.removeItem("notSubscribedUser")
                this.props.fnForLogOut();
                common.fnNavTo.call(this, `/${this.props.locale}`, true);
              }
            )
            : null}
        </div>
        {/* {this.props.loading ? <Spinner /> : null} */}
      </div>
    );
  }
}

/**
 * method that maps state to props.
 * Component - Settings
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    fnForLogOut: () => {
      dispatch(actionTypes.fnForLogOut());
    }
  };
};

/**
 * Component - Settings
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    oUserAccountDetails: state.oUserAccountDetails,
    loading: state.loading,
    isUserSubscribed: state.bIsUserSubscribed
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Settings)
);
