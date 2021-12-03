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
import RootContainer from "core/RootConatiner/";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import * as actionTypes from "app/store/action/";
import RoutComponent from "app/Routes/";
import {Link} from "react-router-dom";
import Button from "core/components/Button/";
import * as routeNames from "app/Routes/RouteNames";
import * as CONSTANTS from "app/AppConfig/constants";
import AppHeader from "app/views/components/AppHeader";
import Spinner from "core/components/Spinner";
import AppMenu from "app/views/components/AppMenu";
import AppFooter from "app/views/components/AppFooter";
import {ENABLE_COUNTRY_QUERY_PARAM} from "app/AppConfig/features";
import oResourceBundle from "app/i18n/";
import oResourceBundleError from "app/AppConfig/Error/";
import HandlerContext from "app/views/Context/HandlerContext";
import {getDirection} from "app/utility/common";
import {sendEvents} from "core/GoogleAnalytics/";
import Logger from "core/Logger";
import * as common from "app/utility/common";
import {Toaster} from "core/components/Toaster/";
import url from "url";
import { isMobile, isAndroid, isIOS } from "react-device-detect";

import "./index.scss";

class AppBody extends RootContainer {
  MODULE_NAME = "AppBody";
  bLogoClicked = false;
  /**
   * Represents App Body.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      showSearchInput: false,
      playerScreenVisible: false,
      showUserMenu: false,
      userInputText: "",
      errorOccured: false,
      geoBlock: false
    };
    this.bMenuLoaded = false;
  }

  /**
   * Component Name - AppBody
   * Executes when component mounted to DOM.
   * @param null
   */
  componentDidMount() {
    let sLanguageCode = this.props.match.params.langcode;
    const url_parts = url.parse(this.props.location.search, true);
    const query = url_parts.query;
    
    //if language code is not valid
    if (
      !sLanguageCode ||
      sLanguageCode.length > 2 ||
      (sLanguageCode !== CONSTANTS.AR_CODE &&
        sLanguageCode !== CONSTANTS.EN_CODE)
    ) {
      this.props.history.location.pathname !== CONSTANTS.HOME_PATH &&
        this.props.history.push("/");
      //Set deafult locale
      sLanguageCode = this.props.locale;
    }
    //Get platform configs and update language code based on URL
    oResourceBundle.setLanguage(sLanguageCode);
    oResourceBundleError.setLanguage(sLanguageCode);
    this.props.fnChangeAppLocale(sLanguageCode);
    this.props.fnFetchPlatformConfig(
      sLanguageCode,
      ENABLE_COUNTRY_QUERY_PARAM ? query.country : null,
      this.platformConfigSuccess.bind(this),
      this.platformConfigFailed.bind(this)
    );
    //Idle Time calculation
    this.idleTime = 0;
  }

  platformConfigSuccess() {
    Logger.log(this.MODULE_NAME, "platformConfigSuccess");
    this.setState({
      errorOccured: false
    });
  }

  platformConfigFailed() {
    Logger.log(this.MODULE_NAME, "platformConfigFailed");
    this.setState({
      errorOccured: true
    });
  }
  /**
   * Component Name - AppBody
   * Update cookie with new time
   * @param {null}
   */
  fnUpdateCookie() {
    const oUserObj = common.getCookie(CONSTANTS.COOKIE_USER_OBJECT)
      ? JSON.parse(common.getCookie(CONSTANTS.COOKIE_USER_OBJECT))
      : null;
    const oUserToken = common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
      ? JSON.parse(common.getCookie(CONSTANTS.COOKIE_USER_TOKEN))
      : null;
    const oRememberMe = common.getCookie(CONSTANTS.COOKIE_REMEMBER_ME)
      ? JSON.parse(common.getCookie(CONSTANTS.COOKIE_REMEMBER_ME))
      : null;
    if (oUserObj && oUserToken && oRememberMe && !oRememberMe.isRemeberMe) {
      common.setCookie(
        CONSTANTS.COOKIE_USER_OBJECT,
        JSON.stringify(oUserObj),
        CONSTANTS.COOKIES_TIMEOUT_NOT_REMEMBER
      );
      common.setCookie(
        CONSTANTS.COOKIE_USER_TOKEN,
        JSON.stringify(oUserToken),
        CONSTANTS.COOKIES_TIMEOUT_NOT_REMEMBER
      );
      common.setCookie(
        CONSTANTS.COOKIE_REMEMBER_ME,
        JSON.stringify(oRememberMe),
        CONSTANTS.COOKIES_TIMEOUT_NOT_REMEMBER
      );
    }
  }

  /**
   * Component Name - AppBody
   * invoked right before calling the render method, both on the initial mount and on subsequent updates.
   * @param {object} props - props
   * @param {object} state - states
   */
  static getDerivedStateFromProps(props, state) {
    return null;
  }

  /**
   * Toggles visibility of filter dropdown
   * @param {Object} oEvent
   */
  filterShowToggleUserMenu(oEvent) {
    if (this.state.showUserMenu) {
      this.setState({showUserMenu: false});
    } else {
      //Make it true for activating dropdown menu
      this.setState({showUserMenu: false});
    }
    oEvent.stopPropagation();
  }

  /**
   * Component Name - AppBody
   * Executes when component mounted to DOM.
   * @param {object} nextProps - properties
   * @param {object} nextState - states
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  /**
   * Component Name - AppBody
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    const nextLocale =
      this.props.locale === CONSTANTS.EN_CODE
        ? CONSTANTS.AR_CODE
        : CONSTANTS.EN_CODE;
    //Logo Click constraints
    // if (this.props.history.location.state) {
    //   this.props.history.location.state.bLogoClicked = false;
    // }
    //dispatch menu items fetch only if menu are not loaded
    //And new props locale is changed
    if (
      (this.props.platformConfig &&
        !this.props.aMenuItems &&
        !this.bMenuLoaded) ||
      (this.props.platformConfig && this.props.locale !== prevProps.locale)
    ) {
      this.props.fnFetchMenuItems(this.props.locale);
      this.bMenuLoaded = true;
    }
    //on back change app direction
    if (
      this.props.history.action === "POP" &&
      this.props.match.params.langcode !== prevProps.match.params.langcode
    ) {
      let sLocale = nextLocale;
      if (!this.props.match.params.langcode) sLocale = CONSTANTS.AR_CODE;
      this.props.fnChangeAppDirection(sLocale);
      //Change app language
      oResourceBundle.setLanguage(sLocale);
      oResourceBundleError.setLanguage(sLocale);
    }
    if (this.props.countryCode !== prevProps.countryCode) {
      const geoBlock = common.isGeoBlocked(this.props.countryCode);
      this.setState({
        geoBlock: geoBlock
      });
    }
  }

  /**
   * Component Name - AppBody
   *  Language change handler.
   * @param {object} oEvent - Event hanlder
   */
  onLanguageButtonClickHandler = oEvent => {
    const pathname = this.props.history.location.pathname;
    const aPathnameParams = pathname.split("/");
    let newPathName = "";
    const nextLocale =
      this.props.locale === CONSTANTS.EN_CODE
        ? CONSTANTS.AR_CODE
        : CONSTANTS.EN_CODE;
    if (
      aPathnameParams.indexOf(this.props.locale) > -1 &&
      this.props.match.params.langcode
    ) {
      aPathnameParams[aPathnameParams.indexOf(this.props.locale)] = nextLocale;

      //Check of videocontent page
      if (this.props.match.path === routeNames.VIDEO_CONTENT) {
        //4th index is name
        aPathnameParams[4] = window.sTranslatedTitle;
      } else if (this.props.match.path === routeNames.PLAYER) {
        //5th index is name
        aPathnameParams[5] = window.sTranslatedTitle;
      }
      newPathName = aPathnameParams.join("/");
    } else if (!this.props.match.params.langcode) {
      Logger.log(this.MODULE_NAME, CONSTANTS.HOME_PATH);
      newPathName = CONSTANTS.HOME_PATH + nextLocale;
    }

    //Change app language
    oResourceBundle.setLanguage(nextLocale);
    oResourceBundleError.setLanguage(nextLocale);
    //Set locale to redux store
    this.props.history.push(newPathName);
    this.props.fnChangeAppDirection(nextLocale);

    //Send analytics event
    sendEvents(
      CONSTANTS.CHANGE_LANGUAGE,
      nextLocale === CONSTANTS.AR_CODE
        ? CONSTANTS.AR_ACTION
        : CONSTANTS.EN_ACTION
    );
  };

  /**
   * Component Name - AppBody
   *  Menu Button click handler.
   * @param {object} oEvent - Event hanlder
   */
  onMenuButtonClick = oEvent => {
    this.setState(prevState => ({showMenu: !this.state.showMenu}));
    this.fnHideSearchInput();
    oEvent.stopPropagation();
  };

  /**
   * Component Name - AppBody
   * Search Button click handler.
   * @param {object} oEvent - Event hanlder
   */
  onSearchButtonClick(oEvent) {
    this.setState(prevState => ({
      showSearchInput: !this.state.showSearchInput
    }));
    this.fnCloseMenu();
    oEvent.stopPropagation();
  }
  /**
   * Component Name - AppBody
   * Hide Menu handler
   * @param null
   * @returns {undefined}
   */
  fnCloseMenu() {
    this.setState({showMenu: false});
  }

  /**
   * Component Name - AppBody
   * Hide Search Input
   * @param null
   * @returns {undefined}
   */
  fnHideSearchInput() {
    this.props.fnClearUserSearchData();
    this.setState({showSearchInput: false, userInputText: ""});
  }

  /**
   * Component Name - AppBody
   * Overlay click handler.
   * @param null
   * @returns {undefined}
   */
  onOverlayClick = () => {
    this.setState({
      showMenu: false,
      showSearchInput: false,
      showUserMenu: false
    });
  };

  /**
   * Component Name - AppBody
   * App body click handler.
   * @param null
   * @returns {undefined}
   */
  onAppBodyClicked() {
    this.state.showMenu && this.fnCloseMenu();
    this.state.showSearchInput && this.fnHideSearchInput();
    this.state.showUserMenu && this.setState({showUserMenu: false});
    //Clear search items
    this.props.fnClearSearchItems();
  }

  /**
   * Component Name - AppBody
   * Search input click handler.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onSearchInputClicked(oEvent) {
    oEvent.stopPropagation();
  }

  /**
   * Component Name - AppBody
   * Sign in / Register click handler.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onSignInClick() {
    if (common.isUserLoggedIn()) {
      common.fnNavTo.call(
        this,
        `/${this.props.locale}/${CONSTANTS.MY_ACCOUNT}`
      );
    } else {
      this.setResumePath();
      common.fnNavTo.call(this, `/${this.props.locale}/${CONSTANTS.LOGIN}`);
    }
  }

  setResumePath() {
    const currentPath = this.getCurrentPath();
    const fromPlayer =
      window.location.href.includes(CONSTANTS.SUBSCRIPTION_TO_WATCH_AD) ||
      window.location.href.includes(CONSTANTS.SUBSCRIPTION_TO_WATCH);
    let resumePath;
    if (fromPlayer === true) {
      resumePath = this.props.sResumePagePath;
    } else if (
      !currentPath.includes("login") &&
      !currentPath.includes("sign-up") &&
      !currentPath.includes("plans") &&
      !currentPath.includes("adyen") &&
      !currentPath.includes("transaction") &&
      !currentPath.includes("payment")
    ) {
      resumePath = currentPath;
    } else {
      resumePath = common.getCookie(CONSTANTS.RESUME_PATH_COOKIE_NAME) || "";
    }
    common.setCookie(
      CONSTANTS.RESUME_PATH_COOKIE_NAME,
      resumePath,
      CONSTANTS.COOKIES_TIMEOUT_NOT_REMEMBER
    );
    this.props.fnUpdateResumePagePath(resumePath);
    return resumePath;
  }

  getCurrentPath() {
    const index = window.location.href.indexOf("/" + this.props.locale);
    return window.location.href.substring(index);
  }
  /**
   * Component Name - AppBody
   * Sign in / Register click handler.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onLogoClick = () => {
    if (this.state.geoBlock) {
      return;
    }
    if (
      this.props.history.location.pathname !==
      CONSTANTS.HOME_PATH + this.props.locale
    ) {
      this.bLogoClicked = true;
      this.props.history.push({
        pathname: CONSTANTS.HOME_PATH + this.props.locale
      });
    }
  };
  /**
   * Component Name - AppBody
   * Search input change.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  handleSearchInputText(event) {
    this.setState({
      userInputText: event.target.value
    });
  }
  /**
   * Component Name - AppBody
   * Fetch search items
   * @param {undefined} }
   */
  fnFetchSearchItems() {
    if (this.state.userInputText.length >= 3) {
      this.props.fnSearchUserInput(
        this.props.locale,
        {userInputText: this.state.userInputText, bSearchTerm: true},
        true,
        this.fnUserSearchResponseListError.bind(this),
        oSearchTerm => {
          //Send analytics event
          sendEvents(
            CONSTANTS.SEARCH_CATEGORY,
            oSearchTerm.userInputText,
            this.props.location.pathname
          );
        }
      );
    }
    this.props.fnClearUserSearchData();
  }
  /**
   * Component Name - AppBody
   * Search input service failed
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  fnUserSearchResponseListError(error) {
    console.error("fnUserSearchResponseListError: ", error);
  }
  /**
   * Component Name - AppBody
   * Key press on search input.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onSearchInputkeyPress(oEvent) {
    if (
      oEvent.charCode === CONSTANTS.ENTER_KEYCODE &&
      this.props.userSearchResponseList &&
      oEvent.target.value.length >= 3
    ) {
      const userInputText = oEvent.target.value;
      this.props.fnSearchUserInput(
        this.props.locale,
        {userInputText: userInputText, bSearchTerm: true},
        this.fnUserSearchResponseListError.bind(this),
        oSearchTerm => {
          //Send analytics event
          sendEvents(
            CONSTANTS.SEARCH_CATEGORY,
            oSearchTerm.userInputText,
            this.props.location.pathname
          );
        }
      );
      this.props.history.push(
        `/${this.props.locale}/${CONSTANTS.SEARCH}/${userInputText}/`
      );
    }
  }
  /**
   * Component Name - AppBody
   * Key Up on search input.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onSearchInputKeyUp(oEvent) {
    clearTimeout(this.typingTimer);
    if (oEvent.keyCode === CONSTANTS.ESC_KEYCODE) {
      this.props.fnClearUserSearchData();
    } else if (oEvent.keyCode !== CONSTANTS.ENTER_KEYCODE) {
      this.typingTimer = setTimeout(
        this.fnFetchSearchItems.bind(this),
        CONSTANTS.TYPING_DELAY
      );
    }
  }

  /**
   * Component Name - AppBody
   * Key Up on search input.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onSearchInputKeyDown(oEvent) {
    clearTimeout(this.typingTimer);
  }

  setCookiesPolicyOk() {
    // 2335285800000 comes in 2093
    common.setCookie("cookies_accepted", true, CONSTANTS.INFINITE_COOKIE_TIME);
  }

  /**
   * Component Name - AppBody
   * change logo clicked state
   * @param {Boolean} vValue - value
   * @returns {undefined}
   */
  fnLogoClickedStateChange(bValue) {
    this.bLogoClicked = bValue;
  }
  /**
   * Component Name - AppBody
   * get logo clicked state
   * @param {null}
   * @returns {Boolean}
   */
  fnGetLogoClickedState() {
    return this.bLogoClicked;
  }

  /**
   * Component Name - AppBody
   * Subscribe button click
   * @param {Object} - oEvent
   * @returns {undefined}
   */
  onSubscribeButtonClick = async (oEvent, fromSlider) => {
    let sPath = "";
    const isUserEntitled = await common.isUserSubscribed();
    const resumePath = this.setResumePath();
    if (!common.isUserLoggedIn()) {
      sPath = `/${this.props.locale}/${CONSTANTS.LOGIN}`;
      this.props.fnUpdateResumePagePath(
        `${this.props.locale}/${CONSTANTS.PLANS_DESCRIPTION}`
      );
      common.setCookie(
        CONSTANTS.COOKIE_GO_TO_SUBSCRIBE,
        true,
        CONSTANTS.INFINITE_COOKIE_TIME
      );
    } else if (common.isUserLoggedIn() && !isUserEntitled) {
      //if user is logged in and not subscribed go to plans page
      sPath = `/${this.props.locale}/${CONSTANTS.PLANS_DESCRIPTION}`;
    }
    //Send analytics event
    sendEvents(
      CONSTANTS.SUBSCRIPTION_CLICK_CATEGORY,
      CONSTANTS.SUBSCRIPTION_CLICK_ACTION,
      fromSlider === true ? CONSTANTS.LABEL_MAIN_SLIDER : resumePath
    );

    sPath !== "" && common.fnNavTo.call(this, sPath);
  };


  
  /**
   * Component Name - AppBody
   * Subscribe button click
   * @param {Object} - oEvent
   * @returns {undefined}
   */
  onSubscribeButtonClick1 = async (oEvent, fromSlider) => {
    let sPath = "";
    const isUserEntitled = await common.isUserSubscribed();
    const resumePath = this.setResumePath();
    if (!common.isUserLoggedIn()) {
      sPath = `/${this.props.locale}/${CONSTANTS.LOGIN}`;
      this.props.fnUpdateResumePagePath(
        `${this.props.locale}/${CONSTANTS.PLANS}`
      );
      common.setCookie(
        CONSTANTS.COOKIE_GO_TO_SUBSCRIBE,
        true,
        CONSTANTS.INFINITE_COOKIE_TIME
      );
    } else if (common.isUserLoggedIn() && !isUserEntitled) {
      //if user is logged in and not subscribed go to plans page
      sPath = `/${this.props.locale}/${CONSTANTS.PLANS}`;
    }
    //Send analytics event
    sendEvents(
      CONSTANTS.SUBSCRIPTION_CLICK_CATEGORY,
      CONSTANTS.SUBSCRIPTION_CLICK_ACTION,
      fromSlider === true ? CONSTANTS.LABEL_MAIN_SLIDER : resumePath
    );

    sPath !== "" && common.fnNavTo.call(this, sPath);
  };

  /**
   * Component Name - AppBody
   * renders the UI.
   * @param null
   * @returns {undefined}
   */
  render() {
    const oHandlers = {
      onLanguageButtonClickHandler: this.onLanguageButtonClickHandler.bind(
        this
      ),
      onMenuButtonClick: this.onMenuButtonClick.bind(this),
      onSearchButtonClick: this.onSearchButtonClick.bind(this),
      onOverlayClick: this.onOverlayClick.bind(this),
      onSignInClick: this.onSignInClick.bind(this),
      onLogoClick: this.onLogoClick.bind(this),
      onSearchInputClicked: this.onSearchInputClicked.bind(this),
      filterShowToggleUserMenu: this.filterShowToggleUserMenu.bind(this),
      onAppBodyClicked: this.onAppBodyClicked.bind(this),
      fnLogoClickedStateChange: this.fnLogoClickedStateChange.bind(this),
      fnGetLogoClickedState: this.fnGetLogoClickedState.bind(this),
      onSubscribeButtonClick: this.onSubscribeButtonClick.bind(this),
      onSubscribeButtonClick1: this.onSubscribeButtonClick1.bind(this)
    };
    let footerClassName = "";
    if (this.props.playerScreenVisible) {
      footerClassName += " gone";
    }
    const areCookiesAccepted = common.getCookie("cookies_accepted");

    return (
      <HandlerContext.Provider value={oHandlers}>
        <Toaster rtl={getDirection(this.props.locale) === CONSTANTS.RTL} />
        <div
          className={"app-body " + getDirection(this.props.locale)}
          dir={getDirection(this.props.locale)}
          ref="app-body"
          onClick={this.onAppBodyClicked.bind(this)}
        >
          <AppHeader
            geoBlock={this.state.geoBlock}
            showSearchInput={this.state.showSearchInput}
            showUserMenuDropDown={this.state.showUserMenu}
            locale={this.props.locale}
            onLanguageButtonClickHandler={this.onLanguageButtonClickHandler.bind(
              this
            )}
            onSearchButtonClick={this.onSearchButtonClick.bind(this)}
            onMenuButtonClick={this.onMenuButtonClick.bind(this)}
            onSignInClick={this.onSignInClick.bind(this)}
            onLogoClick={this.onLogoClick.bind(this)}
            handleSearchInputText={this.handleSearchInputText.bind(this)}
            keyUp={this.onSearchInputKeyUp.bind(this)}
            keyDown={this.onSearchInputKeyDown.bind(this)}
            keyPress={this.onSearchInputkeyPress.bind(this)}
            userInputText={this.state.userInputText}
          />

          {this.props.aMenuItems ? (
            <AppMenu
              menuitems={this.props.aMenuItems.data}
              showUserMenuDropDown={this.state.showUserMenu}
              staticMenuItems={this.props.aStaticMenuItems}
              show={this.state.showMenu}
              closeButtonClick={this.onOverlayClick.bind(this)}
              onSignInClick={this.onSignInClick.bind(this)}
              showCloseBtn={false}
            />
          ) : null}
          {this.state.errorOccured && (
            <div className="full-error-message">
              {window.navigator.onLine
                ? <Spinner />
                : oResourceBundle.no_internet_connection}
            </div>
          )}
          {this.props.platformConfig && (
            <div className="page-content">
              {this.state.geoBlock && (
                <section className="geo-blocked">
                  {oResourceBundle.weyyak_unavailable}
                </section>
              )}
              {
                <section
                  className={
                    "home-content" + (this.state.geoBlock ? " gone" : "")
                  }
                >
                  <RoutComponent location={this.props.location} />
                </section>
              }
            </div>
          )}
          {!areCookiesAccepted &&
            !this.state.geoBlock && (
              <div className="cookies-policy-container">
                <div className="cookies-policy">
                  <p className="cookies-text">
                    {oResourceBundle.cookies_1}
                    <br />
                    {oResourceBundle.cookies_2}
                    <Link
                      to={`/${this.props.locale}/static/privacy-${
                        this.props.locale
                      }`}
                      aria-label={oResourceBundle.privacy_policy}
                    >
                      <span>{oResourceBundle.cookies_3}</span>
                    </Link>
                    <br />
                    {oResourceBundle.cookies_4}
                  </p>
                  <Button
                    className="cookies-ok"
                    onClick={this.setCookiesPolicyOk.bind(this)}
                  >
                    {oResourceBundle.ok}
                  </Button>
                </div>
              </div>
            )}
          {this.props.loading && !this.props.platformConfig && <Spinner />}
          <AppFooter className={footerClassName} />
        </div>
      </HandlerContext.Provider>
    );
  }
}

/**
 * Component Name - AppBody
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loading: state.loading,
    platformConfig: state.platformConfig,
    countryCode: state.sCountryCode,
    aMenuItems: state.aMenuItems,
    aStaticMenuItems: state.aStaticMenuItems,
    oPageContent: state.oPageContent,
    playerScreenVisible: state.playerScreenVisible,
    userSearchResponseList: state.userSearchResponseList,
    sResumePagePath: state.sResumePagePath
  };
};

/**
 * Component Name - AppBody
 * method that maps state to props.
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  //dispatch action to redux store
  return {
    //to access use this.props.fnChangeAppDirection();
    /**
     * dispatch method to Redux - used to change language and html layout.
     * @param {string} sCurrentDirection - Current selected locale.
     * @return null
     */
    fnChangeAppDirection: sCurrentLocale => {
      dispatch(actionTypes.changeDirection(sCurrentLocale));
    },
    /**
     * dispatch method to Redux - used to change language .
     * @param {string} sCurrentDirection - Current selected locale.
     * @return null
     */
    fnChangeAppLocale: sCurrentLocale => {
      dispatch(actionTypes.changeDirection(sCurrentLocale));
    },
    /**
     * dispatch method to Redux - used to fetch the platform config Domains.
     * @param null
     * @return null
     */
    fnFetchPlatformConfig: (sLanguageCode, sCountry, fnSuccess, fnFailure) => {
      dispatch(
        actionTypes.fnFetchPlatformConfig(
          sLanguageCode,
          sCountry,
          fnSuccess,
          fnFailure
        )
      );
    },
    /**
     * dispatch method to Redux - used to fetch all the menu items.
     * @param null
     * @return null
     */
    fnFetchMenuItems: sLanguageCode => {
      dispatch(actionTypes.fnFetchMenuItems(sLanguageCode));
    },
    fnClearUserSearchData: () => {
      dispatch(actionTypes.fnClearUserSearchData());
    },
    fnSearchUserInput: (
      sLocale,
      userInputText,
      bUpdateSearchInput,
      fnUserSearchResponseListError,
      fnSearchSuccess
    ) => {
      dispatch(
        actionTypes.fnSearchUserInput(
          sLocale,
          userInputText,
          bUpdateSearchInput,
          fnUserSearchResponseListError,
          fnSearchSuccess
        )
      );
    },
    fnClearSearchItems: () => {
      dispatch({
        type: actionTypes.USER_SEARCH_RESPONSE,
        payload: {userSearchResponseList: [], bUpdateSearchInput: true}
      });
    },
    fnUpdateResumePagePath: sPath => {
      dispatch(actionTypes.fnUpdateResumePagePath(sPath));
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppBody)
);
