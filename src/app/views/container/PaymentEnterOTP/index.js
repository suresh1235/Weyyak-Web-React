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
import * as actionTypes from "app/store/action/";
import * as common from "app/utility/common";
import * as CONSTANTS from "app/AppConfig/constants";
import BaseContainer from "core/BaseContainer/";
import {connect} from "react-redux";
import oResourceBundle from "app/i18n/";
import {sendEvents} from "core/GoogleAnalytics/";
import Button from "../../../../core/components/Button/";
import Spinner from "core/components/Spinner";
import Input from "core/components/Input/";
import {toast} from "core/components/Toaster/";
import withTracker from "core/GoogleAnalytics/";

import "./index.scss";

class PaymentEnterOTP extends BaseContainer {
  /**
   * Represents PaymentEnterOTP.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      failure: false,
      transactionDone: false,
      errorOccured: false,
      otp: "",
      shortCode:this.props.id,
      activateResend: false,
      timerValue: CONSTANTS.RESEND_CODE_TIME,
      timerText: this.formatText(CONSTANTS.RESEND_CODE_TIME),
      operator:
      props.oSelectedPlan && props.oSelectedPlan.payment_providers[0].name
    };
    if (props.oSelectedPlan && props.oSelectedPlan.isTpay) {
      const code = CONSTANTS.TPAY_OPERATOR_SHORT_CODES[props.sCountryCode];

     if(code){
      const key = Object.keys(code).find(
        ele =>
         ele.toLowerCase() === props.oSelectedPlan.payment_providers[0].name.toLowerCase()
      );
      if(key) {
        this.state.shortCode = code[key];
      }
      else {
        this.state.shortCode = "";
      }
    }
    }
    this.oUserObject = {};
    this.oUserToken = {};
    this.resendInterval = -1;
  }
    
  componentDidMount() {
    if (!this.props.oEtisalatSession && !this.props.oTpaySession) {
      common.fnNavTo.call(this, `/${this.props.locale}/`);
    }
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    this.setState({
      timerValue: CONSTANTS.RESEND_CODE_TIME,
      timerText: this.formatText(CONSTANTS.RESEND_CODE_TIME),
      activateResend: false
    });
    this.stopTimer();
    this.resendInterval = setInterval(() => {
      if (this.state.timerValue === 0) {
        this.setState({
          activateResend: true
        });
        this.stopTimer();
        return;
      }
      const value = this.state.timerValue - 1;
      this.setState({
        timerValue: value,
        timerText: this.formatText(value)
      });
    }, CONSTANTS.RESEND_TIMER_UPDATE_INTERVAL);
  }

  stopTimer() {
    clearInterval(this.resendInterval);
  }

  formatText(time) {
    return time > 59
      ? this.getTwoDigits(time / 60) + ":" + this.getTwoDigits(time % 60)
      : "00:" + this.getTwoDigits(time);
  }
  getTwoDigits(text) {
    text = text + "";
    return text.length === 2 ? text : "0" + text;
  }
  /**
   * Component Name - PaymentEnterOTP
   * @param { null }
   * @returns {undefined}
   */
  handleSubscribeButton() {
    sendEvents(
      CONSTANTS.SUBSCRIPTION_BILLING_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PAY_ACTION,
      this.props.oSelectedPlan.title,
      this.props.oSelectedPlan.shortCode
      
    );
    if (this.props.oSelectedPlan.isEtisalat) {
      const data = {
        token: this.props.oEtisalatSession && this.props.oEtisalatSession.token,
        otp: this.state.otp
      };
      this.props.etisalatVerify(
        data,
        this.etisalatVerifySuccess.bind(this),
        this.etisalatVerifyError.bind(this)
      );
    }
    // if (this.props.oSelectedPlan.isInfo){
    //   const data = {
    //     token: this.props.oEtisalatSession && this.props.oEtisalatSession.token,
    //     otp: this.state.otp
    //   };
    //  this.props.
    // }

    if (this.props.oSelectedPlan.isTpay) {
      const data = {
        subscription_contract_id: this.props.oTpaySession
          .subscriptionContractId,
        order_id: this.props.oTpaySession.order_id,
        pin_code: this.state.otp,
        shortCode:this.props.oSelectedPlan.shortCode
      };

     this.props.tpayVerify(
        data,
        this.etisalatVerifySuccess.bind(this),
        this.tpayVerifyError.bind(this)      
      );
    }
  }

  etisalatVerifySuccess() {
    this.setState({
      transactionDone: true
    });
    let paymentOperator = "";
    if (this.props.oSelectedPlan.isEtisalat) {
      paymentOperator = CONSTANTS.PAYMENT_OPERATOR_ETISALAT;
    }
    if (this.props.oSelectedPlan.isTpay) {
      paymentOperator = CONSTANTS.PAYMENT_OPERATOR_TPAY;
    }
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PAYMENT_COMPLETED_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PAYMENT_COMPLETED_ACTION,
      paymentOperator
    );
  }

  etisalatVerifyError(response) {
    let message = oResourceBundle.something_went_wrong;
    let goToNextScreen = false;
    if (response && response.error_code) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_ETISALAT_ALREADY_ACTIVE:
          message = oResourceBundle.etisalat_user_already_active;
          break;
        case CONSTANTS.ERROR_CODE_ETISALAT_INSUFFICIENT_BALANCE:
          message = oResourceBundle.insufficient_balance;
          break;
        case CONSTANTS.ERROR_CODE_ETISALAT_PIN_EXPIRED:
          message = oResourceBundle.code_expired;
          break;
        case CONSTANTS.ERROR_CODE_ETISALAT_INVALID_PIN:
          message = oResourceBundle.otp_does_not_match;
          break;
        case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
          message = oResourceBundle.invalid_pin;
        default:
          goToNextScreen = true;
          message = oResourceBundle.something_went_wrong;
      }
    }
 
    common.showToast(
      CONSTANTS.GENERIC_TOAST_ID,
      message,
      toast.POSITION.BOTTOM_CENTER
    );
    if (goToNextScreen) {
      this.setState({
        transactionDone: true,
        errorOccured: true
      });
    }
    let paymentOperator = "";
    if (this.props.oSelectedPlan.isEtisalat) {
      paymentOperator = CONSTANTS.PAYMENT_OPERATOR_ETISALAT;
    }
    if (this.props.oSelectedPlan.isTpay) {
      paymentOperator = CONSTANTS.PAYMENT_OPERATOR_TPAY;
    }



    sendEvents(
      CONSTANTS.SUBSCRIPTION_PAYMENT_FAILED_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PAYMENT_FAILED_ACTION,
      paymentOperator
    );
  }


  tpayVerifyError(response) {
    let message = oResourceBundle.payment_error;
    let goToNextScreen = false;
    if (response && response.error_code) {
      switch (response.response_code) {
        case CONSTANTS.ERROR_CODE_TPAY_ZERO:
          message = oResourceBundle.wait_two_minutes  
          break;
        case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
          message = oResourceBundle.invalid_pin;
          break;
        case CONSTANTS.ERROR_CODE_TPAY_SMS_NOT_SENT:
          message = oResourceBundle.verification_sms_not_sent;
          break;
        case CONSTANTS.ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED:
          message = oResourceBundle.subscription_verified  
          break;
        case CONSTANTS.ERROR_CODE_TPAY_LIMIT_EXCEEDED:
          message = oResourceBundle.code_limit_exceeded;
          break;
        case CONSTANTS.ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED:
          message = oResourceBundle.max_attempt_reached;
          break;  
        default:
          goToNextScreen = true;
          message = oResourceBundle.payment_error;
      }
   }
   else {
     switch(response.payment_status_code){
      case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
        message = oResourceBundle.already_subscribed;
        break;
      case CONSTANTS.ERROR_CODE_TPAY_ZERO:
        message = oResourceBundle.wait_two_minutes  
        break;
      default:
        goToNextScreen = true;
        message = oResourceBundle.payment_error;
     }
   }


    common.showToast(
        CONSTANTS.GENERIC_TOAST_ID,
        message,
        toast.POSITION.BOTTOM_CENTER
      );
      if (goToNextScreen) {
        this.setState({
          transactionDone: true,
          errorOccured: true
        });
      }
      let paymentOperator = "";
      if (this.props.oSelectedPlan.isEtisalat) {
        paymentOperator = CONSTANTS.PAYMENT_OPERATOR_ETISALAT;
      }
      if (this.props.oSelectedPlan.isTpay) {
        paymentOperator = CONSTANTS.PAYMENT_OPERATOR_TPAY;
      }
    
      sendEvents(
        CONSTANTS.SUBSCRIPTION_PAYMENT_FAILED_CATEGORY,
        CONSTANTS.SUBSCRIPTION_PAYMENT_FAILED_ACTION,
        paymentOperator
      );
    }       

  handleExitButton() {
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.PLANS}`);
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PAYMENT_EXIT_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PAYMENT_EXIT_ACTION,
      "Exit"
    );
  }

  handleResendOTP() {
    if (this.props.oSelectedPlan.isEtisalat) {
      if (this.state.activateResend) {
        this.startTimer();
        const data = {
          token:
            this.props.oEtisalatSession && this.props.oEtisalatSession.token
        };
        this.props.etisalatResendOTP(
          data,
          this.otpSent.bind(this),
          this.otpError.bind(this)
        );
      }
    }
    if (this.props.oSelectedPlan.isTpay) {
      if (this.state.activateResend) {
        this.startTimer();
        const data = {
          subscription_contract_id: this.props.oTpaySession
            .subscriptionContractId
        };
        this.props.tpayResendOTP(
          data,
          this.otpSent.bind(this),
          this.otpError.bind(this)
        );
      }
    }
  }

  otpSent() {
    common.showToast(
      CONSTANTS.GENERIC_TOAST_ID,
      oResourceBundle.otp_sent,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  otpError() {
    common.showToast(
      CONSTANTS.GENERIC_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  codeChanged(event) {
    const text = common.extractNumber(event.target.value);
    this.setState({
      otp: text
    });
  }

  handleDoneButton() {
    if (this.state.errorOccured) {
      this.props.history.push(
        `/${this.props.locale}/${CONSTANTS.PAYMENT_ENTER_MOBILE}`
      );
    } else {
      this.props.history.push(`/${this.props.locale}`);
    }
  }

  /**
   * Component Name - PaymentEnterOTP
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    let title = "sample title";
    let trialText = "sample trial";
    let sendDisabled = true;
    if (this.props.oSelectedPlan) {
      const planDuration =
        this.props.oSelectedPlan.billing_frequency == 7 ? oResourceBundle.week : this.props.oSelectedPlan.billing_frequency == 30 ? oResourceBundle.month: oResourceBundle.year;

        // common.getBillingText(
        //   this.props.oSelectedPlan.billing_frequency,]
        //   this.props.oSelectedPlan.billing_cycle_type
        // );
      const text = 
        this.props.oSelectedPlan.country === "BH"? oResourceBundle.free_for4 : oResourceBundle.free_for3;
      const planPrice =
        this.props.oSelectedPlan.currency +
        " " +
        this.props.oSelectedPlan.price;
      title =
        oResourceBundle.enjoy_weyyak_experience1 +
        planPrice +
        oResourceBundle.enjoy_weyyak_experience2 +
        planDuration;
      const trialPeriod =
        this.props.oSelectedPlan.no_of_free_trial_days +
        " " +
        (this.props.oSelectedPlan.no_of_free_trial_days > 1
          ? oResourceBundle.days
          : oResourceBundle.day);
      trialText =
        oResourceBundle.free_for1 +
        trialPeriod +
        oResourceBundle.free_for2 +
        planPrice +
        text +
        planDuration;
 
      if (this.props.oSelectedPlan.isTpay) {
        if (this.state.otp.length >= 4 && this.state.otp.length <= 12)
          {
             sendDisabled = false;
          }
        }
      if (this.props.oSelectedPlan.isEtisalat) {
        if (this.state.otp.length >= 4 && this.state.otp.length <= 12)
        {
           sendDisabled = false;
        }
      }

    
    }
    return (
      <React.Fragment>
        {this.props.loading && <Spinner />}
        {!this.state.transactionDone && (
          <div className="enter-otp-container">
            <div className="margin-collapse" />
            <div className="enjoy_weyyak_experience">{title}</div>
            <div className="enter-mobile2">{oResourceBundle.enter_sms_pin}</div>
            <div className="input-container">
              <Input
                className="code"
                type="tel"
                placeholder={oResourceBundle.activation_code}
                onChange={this.codeChanged.bind(this)}
                value={this.state.otp}
              />
            </div>
            <div className="resend-code">
              <span
                onClick={this.handleResendOTP.bind(this)}
                className={
                  "resend-text" + (this.state.activateResend ? " active" : "")
                }
              >
                {oResourceBundle.resend_the_code}
              </span>
              <span className="timer">{this.state.timerText}</span>
            </div>
            <Button
              className="subscribe-button"
              disabled={sendDisabled}
              onClick={this.handleSubscribeButton.bind(this)}
            >
              {oResourceBundle.subscribe}
            </Button>
            {
              <div className="exit" onClick={this.handleExitButton.bind(this)}>
                {oResourceBundle.btn_exit}
              </div>
            }
            <div className="conditions-container">
              <div className="free-for">{trialText}</div>
              <div className="by-clicking">
                {oResourceBundle.by_clicking_subscribe}
              </div>
              <br />
              <div className="by-clicking1">
                {oResourceBundle.clicking_subscribe_condition1}
              </div>
              <div className="by-clicking2">
                {this.props.oSelectedPlan &&
                  CONSTANTS.WEEKLY_PLAN_DAYS ===
                    this.props.oSelectedPlan.billing_frequency &&
                  oResourceBundle.clicking_subscribe_condition2_weekly}
                {this.props.oSelectedPlan &&
                  CONSTANTS.MONTHLY_PLAN_DAYS ===
                    this.props.oSelectedPlan.billing_frequency &&
                  oResourceBundle.clicking_subscribe_condition2_monthly}
              </div>
              <div className="by-clicking3">
              {(this.props.oSelectedPlan && this.props.oSelectedPlan.isTpay)?(          
            
              (this.props.oSelectedPlan &&
              CONSTANTS.WEEKLY_PLAN_DAYS ===
                this.props.oSelectedPlan.billing_frequency &&
              oResourceBundle.clicking_subscribe_condition3_weekly)? (oResourceBundle.clicking_subscribe_condition3_weekly + this.state.shortCode):(oResourceBundle.clicking_subscribe_condition3_monthly+ this.state.shortCode)
           
            ):(
              (( this.props.oSelectedPlan && CONSTANTS.WEEKLY_PLAN_DAYS ===
                this.props.oSelectedPlan.billing_frequency))?(oResourceBundle.clicking_subscribe_condition4_weekly):this.props.oSelectedPlan&&this.props.oSelectedPlan.billing_frequency== 30?(oResourceBundle.clicking_subscribe_condition4_monthly):(oResourceBundle.clicking_subscribe_condition4_yearly)

            )}
                
                {/* {this.props.oSelectedPlan &&
                  CONSTANTS.WEEKLY_PLAN_DAYS ===
                    this.props.oSelectedPlan.billing_frequency &&
                  oResourceBundle.clicking_subscribe_condition3_weekly ? (oResourceBundle.clicking_subscribe_condition3_weekly+this.state.shortCode):""}
                {this.props.oSelectedPlan &&
                  CONSTANTS.MONTHLY_PLAN_DAYS ===
                    this.props.oSelectedPlan.billing_frequency &&
                  oResourceBundle.clicking_subscribe_condition3_monthly ? (oResourceBundle.clicking_subscribe_condition3_weekly+this.state.shortCode):""}  */}
              </div>
              <br />
              <div className="by-clicking4">
                {oResourceBundle.clicking_subscribe_condition4}
              </div>
            </div>
          </div>
        )}
        {this.state.transactionDone && (
          <div className="transaction-done-container">
            <div className="message">
              {!this.state.errorOccured ? (
                <div>
                  {oResourceBundle.etisalat_payment_success1}
                  <br />
                  <br />
                  {oResourceBundle.etisalat_payment_success2}
                  <br />
                  <br />
                  {oResourceBundle.etisalat_payment_success3}
                </div>
              ) : (
                <div>{oResourceBundle.payment_failed}</div>
              )}
            </div>
            <Button
              className="button"
              onClick={this.handleDoneButton.bind(this)}
            >
              {!this.state.errorOccured
                ? oResourceBundle.ok
                : oResourceBundle.retry}
            </Button>
          </div>
        )
        //this.state.errorOccured
        }
      </React.Fragment>
    );
  }
}

/**
 * method that maps state to props.
 * Component - SignUp
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    etisalatResendOTP: (data, success, failure) => {
      dispatch(actionTypes.etisalatResendOTP(data, success, failure));
    },
    etisalatVerify: (data, success, failure) => {
      dispatch(actionTypes.etisalatVerify(data, success, failure));
    },
    tpayResendOTP: (data, success, failure) => {
      dispatch(actionTypes.tpayResendOTP(data, success, failure));
    },
    tpayVerify: (data, success, failure) => {
      dispatch(actionTypes.tpayVerify(data, success, failure));
    }
  };
};

/**
 * Component - PaymentEnterOTP
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    oEtisalatSession: state.oEtisalatSession,
    oTpaySession: state.oTpaySession,
    loading: state.loading,
    sCountryCode: state.sCountryCode,
    oSelectedPlan: state.oSelectedPlan
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PaymentEnterOTP)
);
