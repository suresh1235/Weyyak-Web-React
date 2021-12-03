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
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Link} from "react-router-dom";
import * as actionTypes from "app/store/action/";
import * as common from "app/utility/common";
import * as constants from "../../../AppConfig/constants";
import * as features from "app/AppConfig/features";
import Button from "core/components/Button/";
import UserMenu from "app/views/components/UserMenu/";
import LanguageButton from "app/views/components/LanguageButton/";
import searchIcon from "app/resources/assets/header/ic-search.svg";
import userIcon from "app/resources/assets/header/ic-user.svg";
import oResourceBundle from "app/i18n/";
import HandlerContext from "app/views/Context/HandlerContext";
import downArrow from "app/resources/assets/login/ic-user-darrow.png";
import {fnConstructContentURL} from "app/utility/common";
import "./index.scss";

class HeaderContentRight extends React.Component {
  subscribeLoaded = false;
  static contextType = HandlerContext;

  componentDidMount() {
    common.isUserSubscribed();
  }
  /**
   * Component Name - HeaderContentRight
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    let userLogInStatus = null;
    try {
      userLogInStatus =
        common.getCookie(constants.COOKIE_USER_OBJECT) !== null
          ? JSON.parse(common.getCookie(constants.COOKIE_USER_OBJECT))
          : null;
    } catch (ex) {
      common.deleteCookie(constants.COOKIE_USER_OBJECT);
    }
    if (
      prevProps.showSearchInput !== this.props.showSearchInput &&
      this.props.showSearchInput
    ) {
      this.refs["search-input"].focus();
    }

    if (
      this.props.loginDetails !== null &&
      this.props.loginDetails.bSuccessful &&
      userLogInStatus === null
    ) {
      this.props.fnReserLogInDetails();
    }
    if (
      this.props.oTransactionReference !== prevProps.oTransactionReference ||
      this.props.loginDetails !== prevProps.loginDetails
    ) {
      common.isUserSubscribed();
    }

    if (this.props.oTokenDetails && !this.subscribeLoaded) {
      this.subscribeLoaded = true;
      common.isUserSubscribed();
    }
  }
  // /**
  //  * Component Name - HeaderContentRight
  //  * Executes when component mounted to DOM.
  //  * @returns {boolean}
  //  */
  // shouldComponentUpdate() {
  //   try {
  //     const userDetails =
  //       common.getCookie(constants.COOKIE_USER_OBJECT) !== null
  //         ? JSON.parse(common.getCookie(constants.COOKIE_USER_OBJECT))
  //         : null;
  //     if (userDetails !== null && userDetails.firstName !== null) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  //   catch (e) {
  //     common.deleteCookie(constants.COOKIE_USER_OBJECT)
  //   }
  // }
  /**
   * Component Name - HeaderContentRight
   * It will used to handle the drop down value from the user menu.
   * @param { Number, Event } index - Index of the item selected and eve- is event handler.
   * @returns { Object }
   */
  handleUserMenuDropDown(index, eve) {
    const userMenuList =
      this.props.locale === "en"
        ? constants.USER_MENU_DROP_DOWN_VALUE_ENG
        : constants.USER_MENU_DROP_DOWN_VALUE_ARB;
    const userMenuValue = userMenuList.filter(
      (item, itemIndex) => itemIndex === index
    );
    switch (userMenuValue[0].key) {
      case "acct": {
        common.fnNavTo.call(
          this,
          `/${this.props.locale}/${constants.MY_ACCOUNT}/${
            constants.ACCOUNT_DETAILS
          }`
        );
        this.context.onAppBodyClicked();
        break;
      }
      case "activity": {
        common.fnNavTo.call(
          this,
          `/${this.props.locale}/${constants.MY_ACTIVITY}/`
        );
        break;
      }
      case "help": {
        break;
      }
      case "logout": {
        common.deleteCookie(constants.COOKIE_USER_OBJECT);
        common.deleteCookie(constants.COOKIE_USER_TOKEN);
        this.props.fnForLogOut();
        break;
      }
      default: {
        break;
      }
    }
  }
  /**
   * Component Name - HeaderContentRight
   * It is a render emthod that will render the Right Part in Header Section that will consist of Sign-In, User-Icon,Search and Language.
   * @param { null }
   * @returns { Object }
   */
  render() {
    let userLogInStatus = null;
    try {
      userLogInStatus =
        common.getCookie(constants.COOKIE_USER_OBJECT) !== null
          ? JSON.parse(common.getCookie(constants.COOKIE_USER_OBJECT))
          : null;
    } catch (ex) {
      common.deleteCookie(constants.COOKIE_USER_OBJECT);
    }
    return (
      <React.Fragment>
        {/* Hide usermenu as per requirement */}
        {userLogInStatus !== null && false ? (
          <UserMenu
            showUserMenuDropDown={this.props.showUserMenuDropDown}
            downArrowIcon={downArrow}
            onSignInClick={this.props.onSignInClick}
            className="user-menu-container"
            handleUserMenuDropDown={(index, eve) =>
              this.handleUserMenuDropDown(index, eve)
            }
          />
        ) : (
          <Button className="sign-in-btn" onClick={this.props.onSignInClick}>
            {oResourceBundle.sign_in_or_register}
          </Button>
        )}
        <Button
          className="user-icon"
          icon={userIcon}
          onClick={this.props.onSignInClick}
        />
        <Button
          className="search-icon right-search-icon"
          icon={searchIcon}
          onClick={this.props.onSearchButtonClick}
          alt={oResourceBundle.search}
        />
        <section
          className={`mobile-search-form ${
            this.props.showSearchInput ? "expand" : ""
          }`}
        >
          <input
            type="search"
            placeholder={oResourceBundle.search_placeholder}
            maxLength="100"
            autoComplete="off"
            className="search-input"
            aria-label={oResourceBundle.search}
            onClick={evt => this.context.onSearchInputClicked(evt)}
            onChange={
              features.ENABLE_SEARCH ? this.props.handleSearchInputText : null
            }
            onKeyPress={this.props.keyPress}
            onKeyUp={this.props.keyUp}
            onKeyDown={this.props.keyDown}
            value={this.props.userInputText}
            ref="search-input"
          />
          {this.props.userSearchResponseList.length > 0 && (
            <div className="select-box-container">
              <div className="select-box">
                <div className="select-box-elements">
                  {this.props.userSearchResponseList.map((ele, index) => {
                    return this.props.userSearchResponseList[0].id !== 0 ? (
                      <Link
                        key={ele.id}
                        to={`/${this.props.locale}${fnConstructContentURL(
                          ele.content_type,
                          ele
                        )}`}
                        aria-label={ele.title}
                        aria-required="true"
                      >
                        <div className="select-element">{ele.title}</div>
                      </Link>
                    ) : (
                      <div className="select-element nodata" key={ele.id}>
                        {ele.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
        {features.ENABLE_SUBSCRIPTION &&
        !this.props.isUserSubscribed &&
        common.showSubscription(this.props.history.location.pathname) ? (
          <Button
            className="subscribe-btn"
            onClick={this.context.onSubscribeButtonClick}
          >
            {oResourceBundle.subscribe}
          </Button>
        ) : null}
        <div
          className={[
            "vertical-separator",
            "hidden",
            !this.props.isUserSubscribed ? "visible" : ""
          ].join(" ")}
        />
        <LanguageButton
          locale={this.props.locale}
          onLanguageButtonCLick={this.props.onLanguageButtonCLick}
        />
      </React.Fragment>
    );
  }
}

/**.
 * Component - HeaderContentRight
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    fnForLogOut: () => {
      dispatch(actionTypes.fnForLogOut());
    },
    stopLoader: () => {
      dispatch(actionTypes.stopLoader());
    },
    fnReserLogInDetails: () => {
      dispatch({type: actionTypes.UPDATE_LOGIN_INFO, payload: null});
    }
  };
};

/**
 * Component - HeaderContentRight
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loginDetails: state.loginDetails,
    userSearchResponseList: state.userSearchResponseList,
    oTransactionReference: state.oTransactionReference,
    oTokenDetails: state.oTokenDetails,
    isUserSubscribed: state.bIsUserSubscribed
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HeaderContentRight)
);
