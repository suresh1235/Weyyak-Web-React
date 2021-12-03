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
import { connect } from "react-redux";
import * as actionTypes from "app/store/action/";
import Spinner from "core/components/Spinner";
import * as common from "app/utility/common";
import oResourceBundle from "app/i18n/";
import * as CONSTANTS from "app/AppConfig/constants";
import { translationObject } from "./translations";
import "./index.scss";

class AdyenGateway extends BaseContainer {
  state = {
    paymentDone: false
  };
  componentDidMount() {
    this.verifyRetryCount = 0;
    if (!this.props.oSelectedPlan || this.props.bIsUserSubscribed) {
      common.fnNavTo.call(this, `/${this.props.locale}`, true);
      return;
    }

    this.fnRenderPaymentUI();
    this.bPaymentUIRendered = true;
    this.fnScrollToTop();
  }

  componentDidUpdate(prevProps, prevSate) {
    if (
      this.props.oPaymentSession &&
      prevProps.oPaymentSession &&
      this.props.oPaymentSession.paymentSession !==
      prevProps.oPaymentSession.paymentSession
    ) {
      this.fnRenderPaymentUI();
      this.bPaymentUIRendered = true;
      this.props.stopLoader();
    } else if (
      this.props.oPaymentSession &&
      this.props.oPaymentSession.paymentSession &&
      !this.bPaymentUIRendered
    ) {
      this.fnRenderPaymentUI();
      this.bPaymentUIRendered = true;
      this.props.stoptLoader();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.verfyTimeout);
  }

  fnRenderPaymentUI() {
    const styleObject = {
      base: {
        color: "#ffffff",
        fontSize: "14px",
        lineHeight: "14px",
        fontSmoothing: "antialiased",
        border: "1px solid #4f4e4e"
      },
      error: {
        color: "red"
      },
      placeholder: {
        color: "#4f4e4e"
      },
      validated: {
        color: "#ffffff"
      }
    };
    // Create a config object for SDK.
    const sdkConfigObj = {
      context: "live", // change this to 'live' when you go live.
      translations: translationObject,
      allowAddedLocales: true,
      allowAVDetection: false,
      paymentMethods: {
        card: {
          enableStoreDetails: true,
          sfStyles: styleObject,
          separateDateInputs: true,
          hasHolderName: true,
          holderNameRequired: true,
          placeholders: {
            encryptedCardNumber: "1111 1111 1111 1111",
            encryptedExpiryDate: "08/18",
            encryptedSecurityCode: "123"
          }
        }
      }
      // consolidateCards: true
    };

    // // Initiate the Checkout form.
    // this.checkout = window.chckt.checkout(
    //   this.props.oPaymentSession.paymentSession,
    //   "#adyen-payment-div",
    //   sdkConfigObj
    // );
    //Handler for payment complete response
    window.chckt.hooks.beforeComplete = this.fnBeforeCompletePaymentHandler.bind(
      this
    );
    //Handlererror
    window.chckt.hooks.handleError = this.handleError.bind(
      this
    );

    window.chckt.hooks.toggleExcessPaymentMethods = function (
      buttonNode /*HTML Node*/,
      excessNodesAreVisible /*Boolean*/
    ) {
      var textField = buttonNode.querySelector(".chckt-more-pm-button__text");
      textField.innerText = excessNodesAreVisible
        ? "Show less"
        : "More payment methods";
      return false;
    };

    //Save order id
    // window.localStorage.setItem(
    //   CONSTANTS.PAYMENT_ORDER_ID_LOCAL_STORAGE,
    //   this.props.oPaymentSession.order_id
    // );
  }

  handleError(e) {
  }

  fnBeforeCompletePaymentHandler(node, paymentData) {
    // 'node' is a reference to the Checkout container HTML node.
    // 'paymentData' is the result of the payment, and contains the 'payload'.
    if (paymentData.payload) {
      this.setState({
        paymentDone: true
      });
      this.props.startLoader();
      if (this.verifyRetryCount === CONSTANTS.MAX_VERIFY_RETRY_COUNT) {
        clearTimeout(this.verfyTimeout);
        const response = {
          resultCode: CONSTANTS.PAYMENT_VERIFY_ERROR
        };
        this.fnCheckResultCode(response);
        return;
      }
      this.verifyRetryCount++;
      this.verfyTimeout = setTimeout(() => {
        this.fnBeforeCompletePaymentHandler(node, paymentData);
      }, CONSTANTS.PAYMENT_PAGE_VERIFY_TIMEOUT);
      this.setCookies(paymentData);
      this.props.fnVerifyPaymentResult(
        paymentData.payload,
        oResponse => {
          this.fnCheckResultCode(oResponse);
          this.deleteCookies();
          clearTimeout(this.verfyTimeout);
          //Success
        },
        oError => {
          this.fnCheckResultCode(oError);
          if (navigator.onLine) {
            this.deleteCookies();
          }
          //Failed
          clearTimeout(this.verfyTimeout);
        }
      );
    }
    return false; // Indicates that you want to replace the default handling.
  }

  setCookies(paymentData) {
    common.setCookie(
      CONSTANTS.COOKIE_VERIFY_PAYMENT_PAYLOAD,
      JSON.stringify(paymentData.payload),
      CONSTANTS.INFINITE_COOKIE_TIME
    );
    common.setCookie(
      CONSTANTS.COOKIE_PAYLOAD_SAVED_USER_TOKEN,
      common.getServerCookie(CONSTANTS.COOKIE_USER_TOKEN),
      CONSTANTS.INFINITE_COOKIE_TIME
    );
  }

  deleteCookies() {
    common.deleteCookie(CONSTANTS.COOKIE_VERIFY_PAYMENT_PAYLOAD);
    common.deleteCookie(CONSTANTS.COOKIE_PAYLOAD_SAVED_USER_TOKEN);
  }

  fnCheckResultCode(oResponse) {
    this.props.stopLoader();
    this.props.fnUpdateTransactionReference(oResponse);
    common.fnNavTo.call(
      this,
      `/${this.props.locale}/${CONSTANTS.TRANSACTION_STATUS}/${CONSTANTS.COMPLETED}`
    );
  }

  render() {
    return this.props.oSelectedPlan ? (
      <div className="checkout-container" dir="ltr">
        <div className="checkout">
          <div className="selected-plan">
            <div className="choose-payment">
              {oResourceBundle.choose_payment_method}
            </div>
            <div className="selected-plan-details">
              <span className="dot" />
              <span className="selected-paln-title">
                <div>{this.props.oSelectedPlan.title}</div>
                &nbsp;
                {"-"}
                &nbsp;
                <div>
                  {this.props.oSelectedPlan.billing_frequency}{" "}
                  {this.props.oSelectedPlan.billing_frequency > 1
                    ? oResourceBundle.days
                    : oResourceBundle.day}
                  &nbsp;
                </div>
                <div>
                  {this.props.oSelectedPlan.currency == "GBP" ? <span>&#163;</span> : this.props.oSelectedPlan.currency}{` `}
                  {this.props.oSelectedPlan.final_price}
                  {/* {this.props.oSelectedPlan.final_price < this.props.oSelectedPlan.price ? this.props.oSelectedPlan.final_price : this.props.oSelectedPlan.price} */}
                </div>
              </span>
            </div>
          </div>
          {/* {!this.props.paymentDone && (
            <div
              id="adyen-payment-div"
              style={{ visibility: this.props.loading ? "hidden" : "visible" }}
            />
          )} */}
          {/* <iframe src="http://localhost:3000/checkout/dropin" height="500px"></iframe> */}
          <iframe src="/en/adyenpayment?isBot=true" height="500px" style={{ "border": 0 }}></iframe>
          <div className="powered-by-adyen">
            {oResourceBundle.powered_by_adyen}
          </div>
          {/* {this.props.loading ? <Spinner /> : null} */}
        </div>
      </div>
    ) : null;
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
    oPaymentSession: state.oPaymentSession,
    oSelectedPlan: state.oSelectedPlan,
    oUserPaymentDetails: state.oUserPaymentDetails,
    bIsUserSubscribed: state.bIsUserSubscribed
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
    startLoader: () => {
      dispatch(actionTypes.startLoader());
    },
    stopLoader: () => {
      dispatch(actionTypes.stopLoader());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdyenGateway);
