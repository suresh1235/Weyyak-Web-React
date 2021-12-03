/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import React from "react";
import BaseContainer from "core/BaseContainer/";
import {connect} from "react-redux";
import withTracker from "core/GoogleAnalytics/";
import * as CONSTANTS from "app/AppConfig/constants";
import oResourceBundle from "app/i18n/";
import Button from "core/components/Button";
import "./index.scss";

class PlansDescription extends BaseContainer {
  onSubscribeButtonClick() {
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.PLANS}`);
  }
  render() {
    return (
      <div className="plans-description-container">
        <div className="try-for-free">{oResourceBundle.explore_and_enjoy}</div>
        <div className="time-indicator">
          <div className="seven-days-free">
            {oResourceBundle.seven_days_free}
          </div>
          <div className="thirty-seven-days-free">
            {oResourceBundle.thirty_seven_days}
          </div>
          <div className="circle-indicator1 circle" />
          <div className="line1 line" />
          <div className="circle-indicator2 circle" />
          <div className="line2 line" />
          <div className="circle-indicator3 circle" />
        </div>
        <Button
          className="subscribe-now-button"
          onClick={this.onSubscribeButtonClick.bind(this)}
        >
          {oResourceBundle.subscribe_now}
        </Button>
        <div className="icons-list">
          <div className="no-ads container">
            <div className="icon" />
            <div className="text">{oResourceBundle.no_ads}</div>
          </div>
          <div className="smart-tv container">
            <div className="icon" />
            <div className="text">{oResourceBundle.smart_tv}</div>
          </div>
          {/* <div className="downloads container">
            <div className="icon" />
            <div className="text">{oResourceBundle.downloads}</div>
          </div> */}
          <div className="exclusive-content container">
            <div className="icon" />
            <div className="text">{oResourceBundle.exclusive_content}</div>
          </div>
          <div className="hd-content container">
            <div className="icon" />
            <div className="text">{oResourceBundle.hd_content}</div>
          </div>
        </div>
        <div className="subscrition-image-1" />

        {
          // <div>
          //   <div className="subscription-desc2">
          //     {oResourceBundle.subscription_desc2}
          //   </div>
          //   <div className="subscription-bottom">
          //     <div className="subscription-bottom-left">
          //       <div className="download-and-watch">
          //         {oResourceBundle.download_and_watch}
          //       </div>
          //       <div className="subscription-desc3">
          //         {oResourceBundle.subscription_desc3}
          //       </div>
          //     </div>
          //     <div className="subscrition-image-2" />
          //   </div>
          //   <Button
          //     className="subscribe-now-button"
          //     onClick={this.onSubscribeButtonClick.bind(this)}
          //   >
          //     {oResourceBundle.subscribe_now}
          //   </Button>
          // </div>
        }
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    locale: state.locale
  };
};
export default withTracker(connect(mapStateToProps)(PlansDescription));
