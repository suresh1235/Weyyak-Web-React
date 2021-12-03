/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import React, {
  Component
} from "react";
import {
  connect
} from "react-redux";
import * as constants from "app/AppConfig/constants";
import * as common from "app/utility/common";
import * as actionTypes from "app/store/action/";
import "url-search-params-polyfill";
import Spinner from "core/components/Spinner";
import Logger from "core/Logger";
import {
  sendEvents
} from "core/GoogleAnalytics/";

class TwitterToken extends Component {
  MODULE_NAME = "TwitterToken";

  constructor(props) {
    super(props);
    this.state = {
      twitterAccessToken: null
    };
    this.redirectDone = false;
  }
  componentDidMount() {
    Logger.log(this.MODULE_NAME, "componentDidMount");
    const params = new URLSearchParams(this.props.location.search);
    const oauthToken = params.get("oauth_token");
    const oauthVerifier = params.get("oauth_verifier");
    if (oauthToken && oauthVerifier) {
      this.props.fnGetTwitterAccessToken(
        oauthToken,
        oauthVerifier,
        this.props.match.params.languagecode
      );
    }
  }

  componentDidUpdate() {
    if (this.props.twitterAccessToken) {
      const params = new URLSearchParams(this.props.twitterAccessToken);
      const response = {
        accessToken: params.get("oauth_token"),
        accessTokenSecret: params.get("oauth_token_secret"),
        name: params.get("screen_name")
      };
      this.props.fnSendSocialLoginResponse(
        response,
        constants.GRANT_TYPE_TWITTER,
        this.userDataDone.bind(this),
        this.userDataDone.bind(this)
      );
    }
  }

  async userDataDone() {
    Logger.log(this.MODULE_NAME, "userDataDone");
    if (!this.redirectDone) {
      this.redirectDone = true;
      common.redirectAfterLogin.call(this);
      sendEvents(constants.LOGIN_CATEGORY, constants.TWITTER_LOGIN_ACTION);
    }
  }

  render() {
    return <Spinner / > ;
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
    twitterAccessToken: state.twitterAccessToken
  };
};

/**
 * method that maps state to props.
 * Component - Login
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  //dispatch action to redux store
  return {
    fnGetTwitterAccessToken: (oauthToken, oauthVerifier, locale) => {
      dispatch(
        actionTypes.fnGetTwitterAccessToken(oauthToken, oauthVerifier, locale)
      );
    },
    fnSendSocialLoginResponse: (fbResponse, grantType, fnFacebookSuccess, fnFacebookError) => {
      dispatch(
        actionTypes.fnSendSocialLoginResponse(
          fbResponse,
          grantType,
          fnFacebookSuccess,
          fnFacebookError
        )
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TwitterToken);
