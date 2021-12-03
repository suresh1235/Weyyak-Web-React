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
import * as CONSTANTS from "../../../AppConfig/constants";
import {fnNavTo, getCookie} from "app/utility/common";
import Spinner from "core/components/Spinner";
import {sendEvents} from "core/GoogleAnalytics/";
import Button from "core/components/Button/";
import oResourceBundle from "app/i18n/";
import url from "url";
import "./index.scss";

class AdyenGateway extends BaseContainer {
  componentDidMount() {
    if (this.props.match.params.status) {
      const url_parts = url.parse(this.props.location.search, true);
      const query = url_parts.query;
      //if pay is present then verify the payload
      if (query.payload) {
        this.props.fnVerifyPaymentResult(
          query.payload,
          oResponse => {
            //Success
            this.fnCheckResultCode(oResponse);
          },
          oError => {
            //Failed
            this.fnCheckResultCode(oError);
          }
        );
      } else if (!this.props.oTransactionReference) {
        fnNavTo.call(this, `/${this.props.locale}`);
      }
    } else {
      fnNavTo.call(this, `/${this.props.locale}`);
    }

    if (
      this.props.oTransactionReference &&
      this.props.oTransactionReference.resultCode === "Authorised"
    ) {
      sendEvents(
        CONSTANTS.SUBSCRIPTION_PAYMENT_COMPLETED_CATEGORY,
        CONSTANTS.SUBSCRIPTION_PAYMENT_COMPLETED_ACTION,
        CONSTANTS.PAYMENT_OPERATOR_ADYEN
      );
    } else {
      sendEvents(
        CONSTANTS.SUBSCRIPTION_PAYMENT_FAILED_CATEGORY,
        CONSTANTS.SUBSCRIPTION_PAYMENT_FAILED_ACTION,
        CONSTANTS.PAYMENT_OPERATOR_ADYEN
      );
    }
  }

  componentDidUpdate(prevProps, prevSate) {}

  fnCheckResultCode(oResponse) {
    this.props.fnUpdateTransactionReference(oResponse);
    //TODO this segment is check transaction status
    switch (oResponse.resultCode) {
      case "AuthenticationFinished":
        break;
      case "Authorised":
        break;
      case "ChallengeShopper":
        break;
      case "IdentifyShopper":
        break;
      case "Refused":
        break;
      case "RedirectShopper":
        break;
      case "Received":
        break;
      case "Cancelled":
        break;
      case "Pending":
        break;
      case "Error":
        break;
      default:
    }
  }

  fnResumeContent() {
    if (
      this.props.oTransactionReference &&
      this.props.oTransactionReference.resultCode === "Authorised"
    ) {
      const sResumePagePath = getCookie(CONSTANTS.RESUME_PATH_COOKIE_NAME);
      //deleteCookie(CONSTANTS.RESUME_PATH_COOKIE_NAME);
      fnNavTo.call(this, `${sResumePagePath}`);
    } else {
      fnNavTo.call(this, "");
    }
  }
  fnRetryBtnClick(sPath) {
    const oSelectedPlanCookie = getCookie(
      CONSTANTS.PAYMENT_SELECTED_PLAN_COOKIE
    );
    const oPaymentUserDetailsCookie = getCookie(
      CONSTANTS.PAYMENT_USER_DETAIL_COOKIE
    );
    let oSelectedPlan = null;
    let oPaymentUserDetails = null;
    if (oSelectedPlanCookie && oPaymentUserDetailsCookie) {
      try {
        oSelectedPlan = JSON.parse(oSelectedPlanCookie);
        oPaymentUserDetails = JSON.parse(oPaymentUserDetailsCookie);
        this.props.fnUpdateSelectedPlan(oSelectedPlan);
        this.props.fnUpdatePaymentUserDetails(oPaymentUserDetails);
      } catch (e) {
        console.log(e);
      }
    }

    fnNavTo.call(this, sPath);
  }

  render() {
    const isSuccessful = this.props.oTransactionReference
      ? this.props.oTransactionReference.resultCode
      : "";

    const sPath =
      this.props.oTransactionReference &&
      this.props.oTransactionReference.error_code !==
        CONSTANTS.PAYMENT_SUCCESS_CODE &&
      this.props.oTransactionReference.error_code !==
        CONSTANTS.PAYMENT_PARTIAL_SUCCESS_CODE
        ? `/${this.props.locale}/${CONSTANTS.CHECKOUT}`
        : `/${this.props.locale}`;
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
          {
            // <div className="transaction-messgae">
            // {isSuccessful === "Authorised"
            //   ? oResourceBundle.payment_success_description
            //   : oResourceBundle.payment_failed_description}
            //   </div>
          }
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
              CONSTANTS.PAYMENT_VERIFY_ERROR
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
 * Component - AdyenGateway
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
 * Component - AdyenGateway
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
)(AdyenGateway);
