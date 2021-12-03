/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import "resize-observer-polyfill/dist/ResizeObserver.global";
import "es6-promise/auto";
import "es6-object-assign/auto";
import includes from "array-includes";
import "es7-object-polyfill";
import "array.prototype.fill";
import React, { Component, Suspense } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "app/store/reducer";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import * as routeNames from "app/Routes/RouteNames";
import AppBody from "app/views/container/AppBody";
import * as constants from "app/AppConfig/constants";
// import { initializeReactGA } from "core/GoogleAnalytics/";
import TagManager from "react-gtm-module";
import ClevertapReact from '../core/CleverTap/index';
import { QA_API, UAT_API } from "app/AppConfig/features";
import Logger from "core/Logger";
import "./App.scss";
import CookingContestThankyou from "app/views/container/CookingContestThankyou";

//Initialise with Tracking ID
// initializeReactGA(constants.GOOGLE_ANALYTICS_ID);

//Initialise GTM
const tagManagerArgs = {
  gtmId: constants.GTM_ID

};

// CleverTap initialization -----------------------

// if (QA_API || UAT_API) {
//   window.clevertap.account.push({ "id": "TEST-79W-6KR-ZR6Z" });
// } else {
//   // window.clevertap.account.push({ "id": "69W-6KR-ZR6Z" });
// }
// ClevertapReact.initialize("TEST-79W-6KR-ZR6Z");

TagManager.initialize(tagManagerArgs);

window.Array.prototype.includes = includes;
const thunkMiddleware = applyMiddleware(thunk);
const store = createStore(reducer, thunkMiddleware);

class App extends Component {
  MODULE_NAME = "App";

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED");
  }
  
  render() {
    Logger.log(this.MODULE_NAME, "version " + constants.BUILD_VERSION_NUMBER);
    console.log('asdfasdf',window.location.pathname);
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path={routeNames.WIN} component={() => <Redirect to={'/ar/'+constants.COOKING_CONTEST} />}/>
              <Route path={routeNames.PLAYER} component={AppBody} />
              <Route path={routeNames.VIDEO_CONTENT} component={AppBody} />
              <Route path={routeNames.ROOT} component={AppBody} />
              <Route path={routeNames.VIDEO_LIST_PLANS} component={AppBody} />
              <Route path={"*"} component={AppBody} />
            </Switch>
          </Suspense>
        </Provider>
      </BrowserRouter>
    );
  }
}

export { store };
export default App;
