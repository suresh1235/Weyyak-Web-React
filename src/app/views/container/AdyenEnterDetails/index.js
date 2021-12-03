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
import * as actionTypes from "app/store/action/";
import * as common from "app/utility/common";
import { connect } from "react-redux";
import * as CONSTANTS from "../../../AppConfig/constants";
import Button from "../../../../core/components/Button/";
import Label from "core/components/Label/";
import Input from "core/components/Input/";
import oResourceBundle from "app/i18n/";
import HandlerContext from "app/views/Context/HandlerContext";
import {sendEvents} from "core/GoogleAnalytics/";
import Spinner from "core/components/Spinner";
import { toast } from "core/components/Toaster/";
import "./index.scss";

class AdyenEnterDetails extends BaseContainer {
  static contextType = HandlerContext;
  state = {
    mobile: "",
    email: "",
    bEmailValid: false,
    bMobileValid: false,
    bEnablePayBtn: false,
    errorMessage: {
      mobile: "",
      email: ""
    }
  };
  componentDidMount() {
    if (!this.props.oSelectedPlan) {
      common.fnNavTo.call(this, `/${this.props.locale}/`);
    }

    const oUserObject = common.getCookie(CONSTANTS.COOKIE_USER_OBJECT)
      ? JSON.parse(common.getCookie(CONSTANTS.COOKIE_USER_OBJECT))
      : null;

    if (oUserObject.email) {
      this.setState({
        email: oUserObject.email,
        bEmailValid: true
      });
    }
    if (oUserObject.phoneNumber) {
      this.setState({
        mobile: oUserObject.phoneNumber,
        bMobileValid: true
      });
    }

    this.fnScrollToTop();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.email !== prevState.email) {
      this.checkEmailValidity(this.state.email);
    }
    if (this.state.mobile !== prevState.mobile) {
      this.checkMobileValidity(this.state.mobile);
    }
    if (
      this.props.locale !== prevProps.locale ||
      this.props.match.params.langcode !== prevProps.match.params.langcode
    ) {
      let emailError = "";
      let mobileError = "";
      if (!this.state.bEmailValid) {
        emailError = oResourceBundle.email_invalid;
      }
      if (!this.state.bMobileValid) {
        mobileError = oResourceBundle.mobile_invalid;
      }
      this.setState({
        errorMessage: {
          email: emailError,
          mobile: mobileError
        }
      });
    }
  }

  onSubscriptionBackClick() {
    this.props.history.goBack();
  }
  /**
   * Component Name - AdyenEnterDetails
   * Key press on search input.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onInputkeyPress(oEvent) {
    if (
      oEvent.keyCode === CONSTANTS.ENTER_KEYCODE &&
      this.state.bEnablePayBtn
    ) {
      this.handleNextBtnClicked();
    }
  }

  /**
   * Component Name - MyAccount
   * Form Inputs Changes, Updating the State.,
   * @param {object} eve - Event hanlder
   */
  handlePhoneOnChange(eve) {
    const { value } = eve.target;
    const regex = /\D/g;
    let phone = value.replace(regex, "");
    if (value.indexOf("+") === 0) {
      phone = "+" + phone;
    }
    this.checkMobileValidity(phone);
  }

  checkMobileValidity(phone) {
    if (common.isValidPhone(phone, this.props.countryCode)) {
      this.setState(
        {
          mobile: phone,
          bMobileValid: true,
          errorMessage: {
            email: this.state.errorMessage.email,
            mobile: ""
          }
        },
        this.fnSetUpdateButtonEnabled
      );
    } else {
      this.setState(
        {
          mobile: phone,
          errorMessage: {
            email: this.state.errorMessage.email,
            mobile: oResourceBundle.mobile_invalid
          },
          bMobileValid: false
        },
        this.fnSetUpdateButtonEnabled
      );
    }
  }
  /**
   * Component Name - MyAccount
   * Form Inputs Changes, Updating the State and check for the validations.
   * @param {object} eve - Event hanlder
   */
  handleEmailOnChange(event) {
    const email = event.target.value;
    this.checkEmailValidity(email);
  }

  checkEmailValidity(email) {
    if (email.length === 0) {
      this.setState({
        email: email,
        bEmailValid: false,
        errorMessage: {
          email: oResourceBundle.email_empty,
          mobile: this.state.errorMessage.mobile
        }
      }, this.fnSetUpdateButtonEnabled);
    } else {
      if (!common.isValidEmail(email)) {
        this.setState({
          email: email,
          bEmailValid: false,
          errorMessage: {
            email: oResourceBundle.email_invalid,
            mobile: this.state.errorMessage.mobile
          }
        }, this.fnSetUpdateButtonEnabled);
      } else {
        this.setState({
          email: email,
          bEmailValid: true,
          errorMessage: { email: "", mobile: this.state.errorMessage.mobile }
        }, this.fnSetUpdateButtonEnabled);
      }
    }
  }

  /**
   * Component Name - MyAccount
   * Update button button enable/ disable
   * @param {null}
   */
  fnSetUpdateButtonEnabled = () => {
    if (this.state.bMobileValid && this.state.bEmailValid) {
      this.setState({ bEnablePayBtn: true });
    } else {
      this.setState({ bEnablePayBtn: false });
    }
  };

  /**
   * Component Name - MyAccount
   * Pay button click handler
   * @param {null}
   */
  handleNextBtnClicked() {

    const { mobile, email } = this.state;
    this.props.fnUpdatePaymentUserDetails({ mobile, email });
    // common.fnNavTo.call(this, `/${this.props.locale}/${CONSTANTS.CHECKOUT}`);
    //Set payload for create payment session
    const oUserToken = common.getCookie(CONSTANTS.COOKIE_USER_TOKEN)
      ? JSON.parse(common.getCookie(CONSTANTS.COOKIE_USER_TOKEN))
      : null;
    const shopperLocale = this.props.locale === "en" ? "en_US" : "en_US";
    const language = this.props.locale === "en" ? "EN" : "AR";
    const oPayload = {
      sdkVersion: "1.9.9",
      channel: "Web",
      reference: this.props.oSelectedPlan.id,
      countryCode: this.props.oSelectedPlan.country,
      shopperLocale: shopperLocale,
      origin: window.location.origin,
      returnUrl: window.location.origin + "/en/transactionstatus/completed",
      email: email,
      mobile: mobile,
      language: language,
      subscription_plan_id: this.props.oSelectedPlan.id,
      user_id: oUserToken ? oUserToken.user_id : "",
      paymentmode: "Adyen"
    };

    this.setState({ loading: true });
    this.props.fnInitiatePaymentSession(
      oPayload, 
      oPaymentSession => {
        //Success
        this.setState({ loading: false });
        common.fnNavTo.call(
          this,
          `/${this.props.locale}/${CONSTANTS.CHECKOUT}`
        );
      },
      oError => {
        //Fail
        this.setState({ loading: false });
        common.showToast(
          CONSTANTS.GENERIC_TOAST_ID,
          oResourceBundle.payment_system_error,
          toast.POSITION.BOTTOM_CENTER
        );
        // common.showToast(
        //   CONSTANTS.ERROR_CODE_INAPP_ACTIVE,
        //   oResourceBundle.inapp_error,
        //   toast.POSITION.BOTTOM_CENTER
        // );
        console.log(oError);
      }
    );

    sendEvents(
      CONSTANTS.SUBSCRIPTION_PLAN_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PROCEED_ACTION,
      this.props.oSelectedPlan.title
    );
  }

  render() {
    return this.props.oSelectedPlan ? (
      <div className="select-plan-container">
        <div>
          <div className="select-container-text">
            {oResourceBundle.select_plan}
          </div>
          <div className="plan-selection">
            <div className="selected radio-div" />
            <div>{this.props.oSelectedPlan.title}</div>
            &nbsp;
            {"-"}
            &nbsp;
            <div>
              {this.props.oSelectedPlan.billing_frequency}{" "}
              {this.props.oSelectedPlan.billing_frequency > 1
                ? oResourceBundle.days
                : oResourceBundle.day}{` `}
              &nbsp;
            </div>
            <div>
             {this.props.oSelectedPlan.currency == "GBP" ? <span>&#163;</span> : this.props.oSelectedPlan.currency}
             {this.props.oSelectedPlan.price}
              
            </div>
          </div>

          <div className="plan-selection-big">
            <div className="select-container-billing">
              <div className="select-container-billing-info">
                {oResourceBundle.billing_information}
              </div>
              <div className="row">
                <div className="left-column">
                  <Label>{oResourceBundle.email}</Label>
                  <div className="inner-column">
                    <Input
                      type="text"
                      name="email"
                      autoComplete="off"
                      className="email"
                      value={this.state.email}
                      onKeyDown={this.onInputkeyPress.bind(this)}
                      onChange={this.handleEmailOnChange.bind(this)}
                    />
                    <span className="error-text">
                      {this.state.errorMessage.email}
                    </span>
                  </div>
                </div>
                <div className="right-column">
                  <Label>{oResourceBundle.mobile_number}</Label>
                  <div className="inner-column">
                    <Input
                      type="text"
                      name="mobile"
                      autoComplete="off"
                      className="mobile"
                      value={this.state.mobile}
                      onKeyDown={this.onInputkeyPress.bind(this)}
                      onChange={this.handlePhoneOnChange.bind(this)}
                    />
                    {/* <span className="error-text">
                      {this.state.errorMessage.mobile}
                    </span> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="adyen-enter-detailss">
              <div className="adyen">
                <span className="radio selected" />
                <span>{oResourceBundle.pay_by_credit_card}</span>
              </div>
            </div>
          </div>

          <div className="pay-option">
            <Button
              className="pay-btn"
              onClick={this.handleNextBtnClicked.bind(this)}
              // disabled={this.state.bEnablePayBtn ? false : true}
            >
              {oResourceBundle.next}
            </Button>
          </div>
        </div>
        {this.state.loading ? <Spinner /> : null}
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
    countryCode: state.sCountryCode,
    oSelectedPlan: state.oSelectedPlan
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
    fnInitiatePaymentSession: (oPayLoad, fnSuccess, fnFailed) => {
      dispatch(
        actionTypes.fnInitiatePaymentSession(oPayLoad, fnSuccess, fnFailed)
      );
    },
    fnUpdatePaymentUserDetails: oPaymentUserDetails => {
      dispatch(actionTypes.fnUpdatePaymentUserDetails(oPaymentUserDetails));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdyenEnterDetails);
