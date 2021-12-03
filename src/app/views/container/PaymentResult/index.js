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
import {connect} from "react-redux";
import * as actionTypes from "app/store/action/";
import * as constants from "../../../AppConfig/constants";
import {fnNavTo, getCookie} from "app/utility/common";
import Spinner from "core/components/Spinner";
import Button from "core/components/Button/";
import oResourceBundle from "app/i18n/";
import url from "url";
import "./index.scss";

class PaymentResult extends BaseContainer {
  constructor(props) {
    super(props);
    this.state = {
      errorOccurred: false,
      transactionDone: false
    };
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevSate) {}

  fnResumeContent() {
    if (
      this.props.oTransactionReference &&
      this.props.oTransactionReference.resultCode === "Authorised"
    ) {
      const sResumePagePath = getCookie(constants.RESUME_PATH_COOKIE_NAME);
      fnNavTo.call(this, `${sResumePagePath}`);
    } else {
      fnNavTo.call(this, "");
    }
  }

  fnRetryBtnClick(sPath) {
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.PAYMENT_ENTER_MOBILE}`
    );
  }

  render() {
    return this.props.oTransactionReference && !this.props.loading ? (
      <div className="transaction-details">
        <div className="transaction-text">
          <div className="transaction-status-text">
            {isSuccessful === "Authorised"
              ? oResourceBundle.payment_success
              : oResourceBundle.payment_failed}
          </div>
          {isSuccessful ? (
            <div className="transaction-refrence">
              {oResourceBundle.order_no}
              {this.props.oTransactionReference &&
                this.props.oTransactionReference.merchantReference}
            </div>
          ) : null}
        </div>
        <div className="actions">
          {isSuccessful === "Authorised" ? (
            <Button
              className="go-to-home"
              onClick={this.fnResumeContent.bind(this)}
            >
              {oResourceBundle.continue_watching}
            </Button>
          ) : (
            <Button
              className="try-again"
              onClick={this.fnRetryBtnClick.bind(this, sPath)}
            >
              {this.props.oTransactionReference.resultCode ===
              constants.PAYMENT_VERIFY_ERROR
                ? oResourceBundle.ok
                : oResourceBundle.try_again}
            </Button>
          )}
        </div>
      </div>
    ) : (
      <Spinner />
    );
  }
}

/**
 * Component - PaymentResult
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loading: state.loading,
    oTransactionReference: state.oTransactionReference
  };
};

/**
 * method that maps state to props.
 * Component - PaymentResult
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  //dispatch action to redux store
  return {
    fnVerifyPaymentResult: (sPayload, fnSuccess, fnFailed) => {
      dispatch(
        actionTypes.fnVerifyPaymentResult(sPayload, fnSuccess, fnFailed)
      );
    },
    fnUpdateTransactionReference: oTransactionDetails => {
      dispatch(actionTypes.fnUpdateTransactionReference(oTransactionDetails));
    },
    fnUpdateSelectedPlan: oSelectedPlan => {
      dispatch(actionTypes.fnUpdateSelectedPlan(oSelectedPlan));
    },
    fnUpdatePaymentUserDetails: oPaymentUserDetails => {
      dispatch(actionTypes.fnUpdatePaymentUserDetails(oPaymentUserDetails));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentResult);
