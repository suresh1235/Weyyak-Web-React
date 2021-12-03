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
import {isUserSubscribed, fnNavTo} from "app/utility/common";
import Button from "core/components/Button/";
import {connect} from "react-redux";
import oResourceBundle from "app/i18n/";
import backIcon from "app/resources/assets/subscribe/back.svg";
import HandlerContext from "app/views/Context/HandlerContext";
import "./index.scss";

class SubsribeToWatch extends BaseContainer {
  static contextType = HandlerContext;
  componentDidMount() {
    if (this.props.sResumePagePath) {
      isUserSubscribed().then(isUserSubscribed => {
        if (this.isUserSubscribed) {
          fnNavTo.call(this, `/${this.props.locale}`, true);
        }
      });
    } else {
      fnNavTo.call(this, `/${this.props.locale}`, true);
    }

    this.fnScrollToTop();
  }

  componentDidUpdate(prevProps, prevSate) {}
  onSubscriptionBackClick() {
    this.props.history.goBack();
  }
  render() {
    return (
      <div className="subscribe-to-watch-container">
        <div className="subscribe-back">
          <Button
            className="back-button"
            icon={backIcon}
            onClick={this.onSubscriptionBackClick.bind(this)}
          />
          <span className="back-text">{oResourceBundle.back}</span>
        </div>
        <div className="subscribe-to-watch-container-text">
          <div className="subscribe-title">
            {oResourceBundle.to_watch_this_content}
          </div>
          <Button
            className="subscribe-btn"
            onClick={this.context.onSubscribeButtonClick1}
          >
            {oResourceBundle.please_subscribe2}
          </Button>
        </div>
      </div>
    );
  }
}

/**
 * Component - AdyenGateway
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loading: state.loading,
    sResumePagePath: state.sResumePagePath
  };
};

/**
 * method that maps state to props.
 * Component - AdyenGateway
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  //dispatch action to redux store
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubsribeToWatch);
