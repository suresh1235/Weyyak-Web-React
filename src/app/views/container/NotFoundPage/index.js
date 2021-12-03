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
import { Link } from 'react-router-dom';
import PageNotFound from 'app/resources/assets/404.png';
import withTracker from 'core/GoogleAnalytics/';
import './index.scss';
import BaseContainer from 'core/BaseContainer/';

/**
* Component Name - NotFounfPage
* functionl component that renders Not found page
* @param null
* @returns {Component}
*/

class NotFound extends BaseContainer {
  render() {
    return (
      <div>
        <img src={PageNotFound} className="not-found" alt="" />
        <center><Link to="/">Return to Home Page</Link></center>
      </div>
    );
  }
}
export default withTracker(NotFound);