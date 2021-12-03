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
import Button from "core/components/Button/";
import oResourceBundle from "app/i18n/";
import backIcon from "app/resources/assets/subscribe/back.svg";
import HandlerContext from "app/views/Context/HandlerContext";
import "./index.scss";

/**
 * Functional component that renders Video overview
 * @param {Object} props - properties to the component
 * @returns {Component} - Video oberview component
 */

class SubscribeWithoutAdComponent extends React.PureComponent {
  static contextType = HandlerContext;
  render() {
    return (
      <div className="subscribe-to-watch-ad-adcontainer">
        <div className="subscribe-back">
          <Button
            className="back-button"
            icon={backIcon}
            onClick={
              this.props.onSubscriptionBackClick
                ? this.props.onSubscriptionBackClick
                : () => {}
            }
          />
          <span className="back-text">{oResourceBundle.back}</span>
        </div>
        <div className="subscribe-to-watch-container-text">
          <div className="subscribe-title">
            {oResourceBundle.to_watch_without_ads}
          </div>
          <div className="subscribe-to-watch-container-buttons">
            <Button
              className="subscribe-btn"
              onClick={this.context.onSubscribeButtonClick}
            >
              {oResourceBundle.subscribe}
            </Button>
            <div className="or-text">{oResourceBundle.or}</div>
            <Button
              className="continue-btn"
              onClick={
                this.props.onContinueBtnClick
                  ? this.props.onContinueBtnClick
                  : () => {}
              }
            >
              {oResourceBundle.continue_with_ads}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default SubscribeWithoutAdComponent;
