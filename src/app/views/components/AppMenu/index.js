/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import React, { Component } from "react";
import oResourceBundle from "app/i18n/";
import { withRouter } from "react-router-dom";
import Menu from "core/components/Menu";
import * as actionTypes from "app/store/action/";
import * as common from "app/utility/common";
import * as constants from "app/AppConfig/constants";
import { ENABLE_APP_MENU } from "app/AppConfig/features";
import UserMenu from "app/views/components/UserMenu/";
import Overlay from "core/components/Overlay";
import MenuItem from "core/components/MenuItem";
import Button from "core/components/Button/";
import userIcon from "app/resources/assets/header/ic-user.svg";
import settingsIcon from "app/resources/assets/header/settings.svg";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import downArrowOrange from "app/resources/assets/login/ic-user-darrow-orange.png";
import HandlerContext from "app/views/Context/HandlerContext";

import "./index.scss";

class AppMenu extends Component {
  constructor(props) {
    super(props);
    this.appMenu = React.createRef();
  }
  static contextType = HandlerContext;

  componentDidUpdate() {
    try {
      setTimeout(() => {
        (this.appMenu && this.appMenu.current ) && this.appMenu.current.scrollTo(0, 0);
      }, 10);
    } catch (e) {
      console.log(e);
    }
  }

  onMenuItemClick(oEvent) {
    //Comment this to activate menu item click
    if (!ENABLE_APP_MENU) {
      oEvent.preventDefault();
    }
  }

  /**
   * Component Name - AppMenu
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
        this.props.history.push(
          `/${this.props.locale}/${constants.MY_ACCOUNT}/${constants.ACCOUNT_DETAILS}`
        );
        this.context.onAppBodyClicked();
        break;
      }
      case "activity": {
        this.props.history.push(
          `/${this.props.locale}/${constants.MY_ACTIVITY}/`
        );
        this.context.onAppBodyClicked();
        break;
      }
      case "mysubscription": {
        this.props.history.push(
          `/${this.props.locale}/${constants.MY_SUBSCRIPTION}/`
        );
        this.context.onAppBodyClicked();
        break;
      }
      case "logout": {
        common.deleteCookie(constants.COOKIE_USER_OBJECT);
        common.deleteCookie(constants.COOKIE_USER_TOKEN);
        this.props.fnForLogOut();
        //this.props.history.push(`/${this.props.locale}`);
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Component Name - AppMenu
   * It is a render method of Menu Component, that will render the menu in Application.
   * @param {null}
   * @returns { Object }
   */
  render() {
    const touchClassName = isMobile !== undefined && isMobile ? "is-touch" : "";
    let userLogInStatus = null;
    try {
      userLogInStatus = common.getCookie(constants.COOKIE_USER_OBJECT) !== null
        ? JSON.parse(common.getCookie(constants.COOKIE_USER_OBJECT))
        : null;
    } catch (ex) {
      common.deleteCookie(constants.COOKIE_USER_OBJECT)
    }
    return (
      <React.Fragment>
        <Overlay show={this.props.show} onClick={this.props.closeButtonClick} />
        <Menu
          className={["app-menu", touchClassName].join(" ")}
          show={this.props.show}
          closeButtonClick={this.props.closeButtonClick}
          showCloseBtn={this.props.showCloseBtn}
          ref={this.appMenu}
        >
          <div className="app-menu-item-container">
            <div className="menu-items">
              <div className="menu-sign-in">
                <Button
                  className="user-icon"
                  icon={userIcon}
                  onClick={this.props.onSignInClick}
                />
                {(this.props.loginDetails !== null &&
                  this.props.loginDetails.bSuccessful) ||
                userLogInStatus !== null ? (
                  <React.Fragment>
                    <UserMenu
                    onSignInClick={this.props.onSignInClick}
                    showUserMenuDropDown={this.props.showUserMenuDropDown}
                    downArrowIcon={downArrowOrange}
                    className="user-menu-container"
                    handleUserMenuDropDown={(index, eve) =>
                      this.handleUserMenuDropDown(index, eve)
                    }
                  />
                    <Button
                      className="settings-btn"
                      icon={settingsIcon}
                      onClick={()=>common.fnNavTo.call(this, "/" + this.props.locale + "/settings")}
                    />
                  </React.Fragment>

                ) : (
                  <React.Fragment>
                    <Button
                      className="sign-in-btn"
                      onClick={this.props.onSignInClick}
                    >
                      {oResourceBundle.sign_in_or_register}
                    </Button>
                    <Button
                      className="settings-btn sign-in"
                      icon={settingsIcon}
                      onClick={()=>common.fnNavTo.call(this, "/" + this.props.locale + "/settings")}
                    />
                  </React.Fragment>
                )}
              </div>
              {this.props.menuitems.map(item => (
                <Link
                  key={item.id}
                  to={`${item.friendly_url}`}
                  tabIndex={this.props.show ? "0" : "-1"}
                >
                  <MenuItem
                    text={item.title}
                    id={item.id}
                    show={this.props.show}
                    friendly_url={item.friendly_url}
                    seo_description={item.seo_description}
                    type={item.type}
                    onClick={this.onMenuItemClick.bind(this)}
                    aria-label={item.title}
                  />
                </Link>
              ))}
            </div>
            <div className="static-menu">
              {this.props.staticMenuItems.map((item, index) =>
                index === 0 ? (
                  <Link
                    key={item.id}
                    to={`/${this.props.locale}/static/${item.friendly_url}`}
                    tabIndex={this.props.show ? "0" : "-1"}
                  >
                    <MenuItem
                      text={
                        item.title +
                        `<strong class="z5-menu-text">&nbsp;${
                          oResourceBundle.weyyak
                        }</strong>`
                      }
                      showHTMLText={true}
                      id={item.id}
                      friendly_url={item.friendly_url}
                      plain_text={item.plain_text}
                      subtitle={item.subtitle}
                      title={item.title}
                      htmlText={item.text}
                      onClick={this.onMenuItemClick.bind(this)}
                      aria-label={item.title}
                    />
                  </Link>
                ) : (
                  <Link
                    key={item.id}
                    to={`/${this.props.locale}/static/${item.friendly_url}`}
                    tabIndex={this.props.show ? "0" : "-1"}
                  >
                    <MenuItem
                      text={item.title}
                      showHTMLText={true}
                      id={item.id}
                      friendly_url={item.friendly_url}
                      plain_text={item.plain_text}
                      subtitle={item.subtitle}
                      title={item.title}
                      htmlText={item.text}
                      onClick={this.onMenuItemClick.bind(this)}
                      aria-label={item.title}
                    />
                  </Link>
                )
              )}
            </div>
          </div>
        </Menu>
      </React.Fragment>
    );
  }
}

/**
 * Component Name - AppMenu
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loginDetails: state.loginDetails
  };
};
/**
 * Component Name - AppMenu
 * method that maps state to props.
 * @constructor
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  //dispatch action to redux store
  return {
    fnForLogOut: () => {
      dispatch(actionTypes.fnForLogOut());
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppMenu)
);
