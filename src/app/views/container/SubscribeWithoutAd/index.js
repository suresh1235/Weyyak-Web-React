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
import {fnNavTo, isUserSubscribed} from "app/utility/common";
import SubscribeWithoutAdComponent from "app/views/components/SubscribeWithoutAdComponent/";
import {connect} from "react-redux";
import "./index.scss";

class SubscribeWithoutAd extends BaseContainer {
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
  onContinueBtnClick() {
    if (this.props.sResumePagePath) {
      fnNavTo.call(this, this.props.sResumePagePath);
    }
  }
  render() {
    return (
      <div className="subscribe-to-watch-ad-adcontainer">
        <SubscribeWithoutAdComponent
          onContinueBtnClick={this.onContinueBtnClick.bind(this)}
          onSubscriptionBackClick={this.onSubscriptionBackClick.bind(this)}
        />
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
)(SubscribeWithoutAd);
