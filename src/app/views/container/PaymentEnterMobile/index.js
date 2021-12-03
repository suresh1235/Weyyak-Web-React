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
import ReactHtmlParser from "react-html-parser";
import * as actionTypes from "app/store/action/";
import * as common from "app/utility/common";
import BaseContainer from "core/BaseContainer/";
import * as CONSTANTS from "app/AppConfig/constants";
import { connect } from "react-redux";
import { sendEvents } from "core/GoogleAnalytics/";
import oResourceBundle from "app/i18n/";
import Button from "../../../../core/components/Button/";
import Spinner from "core/components/Spinner";
import Input from "core/components/Input/";
import { toast } from "core/components/Toaster/";
import withTracker from "core/GoogleAnalytics/";
import "./index.scss";
// import { telusPrepareSession } from "../../../store/action";


class PaymentEnterMobile extends BaseContainer {
  /**
   * Represents PaymentEnterMobile.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      failure: false,
      phoneNumber: "",
      phoneCode: "",
      shortCode: "",
      operator:
        props.oSelectedPlan && props.oSelectedPlan.payment_providers[0].name
    };
    if (props.oSelectedPlan && props.oSelectedPlan.isEtisalat) {
      this.state.phoneCode = CONSTANTS.ETISALAT_COUNTRY_PHONE_CODE;
    }
    if (props.oSelectedPlan && props.oSelectedPlan.is_MW_Zain) {
      this.state.phoneCode = CONSTANTS.ZAIN_COUNTRY_PHONE_CODE;
    }
    if (props.oSelectedPlan && props.oSelectedPlan.isInfo) {
      this.state.phoneCode = CONSTANTS.INFO_OPERATOR_PHONE_CODE;
      const code = CONSTANTS.INFO_OPERATOR_SHORT_CODES[props.sCountryCode]
      if (code) {
        const key = Object.keys(code).find(
          ele =>
            ele.toLowerCase() === props.oSelectedPlan.payment_providers[0].name.toLowerCase()
        );
        if (key) {
          this.state.shortCode = code[key];
        }
        else {
          this.state.shortCode = "";
        }
      }

    }
    if (props.oSelectedPlan && props.oSelectedPlan.isTelus) {
      this.state.phoneCode = CONSTANTS.TELUS_PHONE_CODE;
      const code = CONSTANTS.TELUS_OPERATOR_SHORT_CODES[props.sCountryCode]
      if (code) {
        const key = Object.keys(code).find(
          ele =>
            ele.toLowerCase() === props.oSelectedPlan.payment_providers[0].name.toLowerCase()
        );
        if (key) {
          this.state.shortCode = code[key];
        }
        else {
          this.state.shortCode = "";
        }
      }

    }

    if (props.oSelectedPlan && props.oSelectedPlan.isTpay) {
      const country = CONSTANTS.TPAY_OPERATOR_PHONE_CODES[props.sCountryCode];
      const code = CONSTANTS.TPAY_OPERATOR_SHORT_CODES[props.sCountryCode];
      if (country) {
        const key = Object.keys(country).find(
          ele =>
            ele.toLowerCase() ===
            props.oSelectedPlan.payment_providers[0].name.toLowerCase()
        );
        if (key) {
          this.state.phoneCode = country[key];
        } else {
          this.state.phoneCode = "";
        }
      }
      if (code) {
        const key = Object.keys(code).find(
          ele =>
            ele.toLowerCase() === props.oSelectedPlan.payment_providers[0].name.toLowerCase()

        );
        if (key) {
          this.state.shortCode = code[key];
        }
        else {
          this.state.shortCode = "";
        }
      }
    }
    this.oUserObject = {};
    this.oUserToken = {};
  }

  componentDidMount() {
    this.fnScrollToTop();
    if (!this.props.oSelectedPlan) {
      common.fnNavTo.call(this, `/${this.props.locale}/`);
    } else {
      this.oUserObject = common.getServerCookie(CONSTANTS.COOKIE_USER_OBJECT)
        ? JSON.parse(common.getServerCookie(CONSTANTS.COOKIE_USER_OBJECT))
        : null;
      this.oUserToken = common.getServerCookie(CONSTANTS.COOKIE_USER_TOKEN)
        ? JSON.parse(common.getServerCookie(CONSTANTS.COOKIE_USER_TOKEN))
        : null;
      const index = this.oUserObject.phoneNumber.indexOf(
        CONSTANTS.ETISALAT_COUNTRY_PHONE_CODE
      );
      if (index === 0) {
        this.setState({
          phoneNumber: this.oUserObject.phoneNumber.substring(4)
        });
      }
    }
  }

  /**
   * Component Name - PaymentEnterMobile
   * After Successfully Email Verification and to redirect the home page.
   * @param { null }
   * @returns {undefined}
   */
  handleSendButton() {
    if (this.props.oSelectedPlan.isEtisalat) {
      const data = {
        language: this.props.locale === "en" ? "EN" : "AR",
        channel: CONSTANTS.PAYMENT_PLATFORM,
        countryCode: this.props.oSelectedPlan.country,
        shopperLocale: common.getLocale(),
        promo_code: "",
        email: this.oUserObject && this.oUserObject.email,
        mobile: common.extractNumber(
          CONSTANTS.ETISALAT_COUNTRY_PHONE_CODE + this.state.phoneNumber
        ),
        paymentmode: CONSTANTS.PAYMENT_OPERATOR_ETISALAT,
        subscription_plan_id: this.props.oSelectedPlan.id,
        user_id: this.oUserToken ? this.oUserToken.user_id : "",
        user_name:
          (this.oUserObject && this.oUserObject.firstName) ||
          "" + (this.oUserObject && this.oUserObject.lastName) ||
          ""
      };
      this.props.etisalatPrepareSession(
        data,
        this.prepareSuccess.bind(this),
        this.prepareError.bind(this)
      );
    }
    if (this.props.oSelectedPlan.isTpay) {
      const data = {
        language: this.props.locale === "en" ? "en" : "ar",
        channel: CONSTANTS.PAYMENT_PLATFORM,
        countryCode: this.props.oSelectedPlan.country,
        shortCode: this.props.oSelectedPlan.code,
        shopperLocale: common.getLocale(),
        promo_code: "",
        email: this.oUserObject && this.oUserObject.email,
        mobile: common.extractNumber(
          this.state.phoneCode + this.state.phoneNumber
        ),
        paymentmode: this.state.operator,
        subscription_plan_id: this.props.oSelectedPlan.id,
        user_id: this.oUserToken ? this.oUserToken.user_id : "",
        user_name:
          (this.oUserObject && this.oUserObject.firstName) ||
          "" + (this.oUserObject && this.oUserObject.lastName) ||
          ""
      };

      this.props.tpayPrepareSession(
        data,
        this.prepareSuccess.bind(this),
        this.prepareError.bind(this)
      );
    }

    if (this.props.oSelectedPlan.is_MW_Zain) {
      const data = {
        channel: CONSTANTS.PAYMENT_PLATFORM,
        countryCode: this.props.oSelectedPlan.country,
        shopperLocale: common.getLocale(),
        promo_code: "",
        email: this.oUserObject && this.oUserObject.email,
        mobile: common.extractNumber(
          this.state.phoneCode + this.state.phoneNumber
        ),
        paymentmode: this.state.operator,
        subscription_plan_id: this.props.oSelectedPlan.id,
        user_id: this.oUserToken ? this.oUserToken.user_id : "",
        user_name:
          (this.oUserObject && this.oUserObject.firstName) ||
          "" + (this.oUserObject && this.oUserObject.lastName) ||
          "",
        language: this.props.locale === "en" ? "en" : "ar",
        provider_id: this.props.oSelectedPlan.provider_id
      };

      this.props.ZainPrepareSession(
        data,
        this.prepareSuccess.bind(this),
        this.prepareError.bind(this)
      );
    }


    if (this.props.oSelectedPlan.isTelus) {
      const data = {
        language: this.props.locale === "en" ? "en" : "ar",
        channel: CONSTANTS.PAYMENT_PLATFORM,
        countryCode: this.props.oSelectedPlan.country,
        shortCode: this.props.oSelectedPlan.code,
        url: this.props.oSelectedPlan.url,
        shopperLocale: common.getLocale(),
        promo_code: "",
        email: this.oUserObject && this.oUserObject.email,
        mobile: common.extractNumber(
          this.state.phoneCode + this.state.phoneNumber
        ),
        paymentmode: this.state.operator,
        subscription_plan_id: this.props.oSelectedPlan.id,
        user_id: this.oUserToken ? this.oUserToken.user_id : "",
        user_name:
          (this.oUserObject && this.oUserObject.firstName) ||
          "" + (this.oUserObject && this.oUserObject.lastName) ||
          ""
      };

      this.props.telusPrepareSession(
        data,
        this.prepareSuccessInfo.bind(this),
        this.prepareError.bind(this)
      );
    }
    if (this.props.oSelectedPlan.isInfo) {
      const data = {
        channel: CONSTANTS.PAYMENT_PLATFORM,
        countryCode: this.props.oSelectedPlan.country,
        shortCode: this.props.oSelectedPlan.code,
        url: this.props.oSelectedPlan.url,
        shopperLocale: common.getLocale(),
        promo_code: "",
        email: this.oUserObject && this.oUserObject.email,
        mobile: common.extractNumber(
          this.state.phoneCode + this.state.phoneNumber
        ),
        paymentmode: this.state.operator,
        subscription_plan_id: this.props.oSelectedPlan.id,
        user_id: this.oUserToken ? this.oUserToken.user_id : "",
        user_name:
          (this.oUserObject && this.oUserObject.firstName) ||
          "" + (this.oUserObject && this.oUserObject.lastName) ||
          ""
      };

      this.props.infoPrepareSession(
        data,
        this.prepareSuccessInfo.bind(this),
        this.prepareError.bind(this)
      );
    }

    sendEvents(
      CONSTANTS.SUBSCRIPTION_PLAN_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PROCEED_ACTION,
      this.props.oSelectedPlan.title
    );
  }

  prepareSuccessInfo(response) {
    // alert(response.url)
    window.location.href = response.url
  }

  prepareSuccess(response) {
    if (this.props.oSelectedPlan.payment_providers[0].name == "Du") {
      this.props.history.push(
        `/${this.props.locale}/${"du-success"}/`
      );
    }
    else {
      this.props.history.push(
        `/${this.props.locale}/${CONSTANTS.PAYMENT_ENTER_OTP}`
      );
    }
  }

  prepareError(response) {
    let message = oResourceBundle.payment_error;
    let firstDigit = this.state.phoneNumber.substring(0, 1);
    if (firstDigit === 0) {
      message = oResourceBundle.mobile_zero;
    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_TELUS === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_INFO_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;

        // case CONSTANTS.ERROR_CODE_ETISALAT_INVALID_PHONE:
        //   message = oResourceBundle.mobile_invalid;
        //   break;
        // case CONSTANTS.ERROR_CODE_ETISALAT_NOT_ETISALAT_NUMBER:
        //   message = oResourceBundle.not_etisalat_number;
        //   break;
        // case CONSTANTS.ERROR_CODE_ETISALAT_INSUFFICIENT_BALANCE:
        //   message = oResourceBundle.insufficient_balance;
        //   break;
        // case CONSTANTS.ERROR_CODE_ETISALAT_ALREADY_ACTIVE:
        //   message = oResourceBundle.etisalat_user_already_active;
        //   break;
        // case CONSTANTS.ERROR_CODE_ETISALAT_PIN_GENERATION_ERROR:
        //   message = oResourceBundle.etisalat_exceeded_tries;
        //   break;
        default:
          message = oResourceBundle.payment_error;
      }

    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_INFO === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_INFO_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = oResourceBundle.payment_error;
      }

    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_O2 === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_INFO_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = oResourceBundle.payment_error;
      }

    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_THREE === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_INFO_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = oResourceBundle.payment_error;
      }

    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_INFO_VODAFONE === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_INFO_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = oResourceBundle.payment_error;
      }

    }



    if (
      response &&
      response.error_code &&
      this.props.oSelectedPlan.isEtisalat
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_ETISALAT_INVALID_PHONE:
          message = oResourceBundle.mobile_invalid;
          break;
        case CONSTANTS.ERROR_CODE_ETISALAT_NOT_ETISALAT_NUMBER:
          message = oResourceBundle.not_etisalat_number;
          break;
        case CONSTANTS.ERROR_CODE_ETISALAT_INSUFFICIENT_BALANCE:
          message = oResourceBundle.insufficient_balance;
          break;
        case CONSTANTS.ERROR_CODE_ETISALAT_ALREADY_ACTIVE:
          message = oResourceBundle.etisalat_user_already_active;
          break;
        case CONSTANTS.ERROR_CODE_ETISALAT_PIN_GENERATION_ERROR:
          message = oResourceBundle.etisalat_exceeded_tries;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = response.message;
      }
    }

    if (
      response &&
      response.error_code &&
      this.props.oSelectedPlan.is_MW_Zain
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ZAIN_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_ZAIN_WENT_WROUNG:
          message = response.message;
          break;
        default:
          message = response.message;
      }
    }


    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_STC === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          ;
      }
    }
    if (response.error_code === 51) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        switch (response.payment_status_code) {
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
            message = oResourceBundle.already_subscribed;
            break;
          default:
            message = oResourceBundle.payment_error;
        }
      }
      else {
        switch (response.response_code) {
          case CONSTANTS.ERROR_CODE_TPAY_SMS_NOT_SENT:
            message = oResourceBundle.verification_sms_not_sent;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
            message = oResourceBundle.invalid_pin;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED:
            message = response.subscription_verified;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_LIMIT_EXCEEDED:
            message = response.code_limit_exceeded;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED:
            message = response.max_attempt_reached;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
            message = oResourceBundle.inapp_error;
            break;
          default:
            message = response.response_msg;

        }
      }
    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_VODAFONE === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = response.error_msg;;
      }
    }
    if (response.error_code === 51) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        switch (response.payment_status_code) {
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
            message = oResourceBundle.already_subscribed;
            break;
          default:
            message = oResourceBundle.payment_error;
        }
      }
      else {
        switch (response.response_code) {
          case CONSTANTS.ERROR_CODE_TPAY_SMS_NOT_SENT:
            message = oResourceBundle.verification_sms_not_sent;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
            message = oResourceBundle.invalid_pin;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED:
            message = response.subscription_verified;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_LIMIT_EXCEEDED:
            message = response.code_limit_exceeded;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED:
            message = response.max_attempt_reached;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
            message = oResourceBundle.inapp_error;
            break;
          default:
            message = response.response_msg;

        }
      }
    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_TPAY_ETISALAT === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        default:
          message = response.error_msg;
      }
    }
    if (response.error_code === 51) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        switch (response.payment_status_code) {
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
            message = oResourceBundle.already_subscribed;
            break;
          default:
            message = oResourceBundle.payment_error;
        }
      }
      else {
        switch (response.response_code) {
          case CONSTANTS.ERROR_CODE_TPAY_SMS_NOT_SENT:
            message = oResourceBundle.verification_sms_not_sent;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
            message = oResourceBundle.invalid_pin;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED:
            message = response.subscription_verified;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_LIMIT_EXCEEDED:
            message = response.code_limit_exceeded;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED:
            message = response.max_attempt_reached;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
            message = oResourceBundle.inapp_error;
            break;
          default:
            message = response.response_msg;

        }
      }
    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_ORANGE === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = response.error_msg;
      }
    }
    if (response.error_code === 51) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        switch (response.payment_status_code) {
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
            message = oResourceBundle.already_subscribed;
            break;
          default:
            message = oResourceBundle.payment_error;
        }
      }
      else {
        switch (response.response_code) {
          case CONSTANTS.ERROR_CODE_TPAY_SMS_NOT_SENT:
            message = oResourceBundle.verification_sms_not_sent;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
            message = oResourceBundle.invalid_pin;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED:
            message = response.subscription_verified;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_LIMIT_EXCEEDED:
            message = response.code_limit_exceeded;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED:
            message = response.max_attempt_reached;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
            message = oResourceBundle.inapp_error;
            break;
          default:
            message = response.response_msg;

        }
      }
    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_WATNEYA === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = oResourceBundle.payment_error;
      }
    }
    if (response.error_code === 51) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        switch (response.payment_status_code) {
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
            message = oResourceBundle.already_subscribed;
            break;
          default:
            message = oResourceBundle.payment_error;
        }
      }
      else {
        switch (response.response_code) {
          case CONSTANTS.ERROR_CODE_TPAY_SMS_NOT_SENT:
            message = oResourceBundle.verification_sms_not_sent;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
            message = oResourceBundle.invalid_pin;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED:
            message = response.subscription_verified;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_LIMIT_EXCEEDED:
            message = response.code_limit_exceeded;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED:
            message = response.max_attempt_reached;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
            message = oResourceBundle.inapp_error;
            break;
          default:
            message = response.response_msg;

        }
      }
    }
    if (
      response &&
      response.error_code &&
      this.props.oSelectedPlan.payment_providers[0].name == "Du"
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = response.error_msg;
      }
    }
    if (response.error_code === 51) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        switch (response.payment_status_code) {
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
            message = oResourceBundle.already_subscribed;
            break;
          default:
            message = oResourceBundle.payment_error;
        }
      }
      else {
        switch (response.response_code) {
          case CONSTANTS.ERROR_CODE_TPAY_SMS_NOT_SENT:
            message = oResourceBundle.verification_sms_not_sent;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
            message = oResourceBundle.invalid_pin;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED:
            message = response.subscription_verified;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_LIMIT_EXCEEDED:
            message = response.code_limit_exceeded;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED:
            message = response.max_attempt_reached;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
            message = oResourceBundle.inapp_error;
            break;
          default:
            message = response.response_msg;

        }
      }
    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_UMNIAH === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = oResourceBundle.payment_error;
      }
    }
    if (response.error_code === 51) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        switch (response.payment_status_code) {
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
            message = oResourceBundle.already_subscribed;
            break;
          default:
            message = oResourceBundle.payment_error;
        }
      }
      else {
        switch (response.response_code) {
          case CONSTANTS.ERROR_CODE_TPAY_SMS_NOT_SENT:
            message = oResourceBundle.verification_sms_not_sent;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
            message = oResourceBundle.invalid_pin;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED:
            message = response.subscription_verified;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_LIMIT_EXCEEDED:
            message = response.code_limit_exceeded;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED:
            message = response.max_attempt_reached;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
            message = oResourceBundle.inapp_error;
            break;
          default:
            message = response.response_msg;

        }
      }
    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_OOREDOO === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = oResourceBundle.payment_error;
      }
    }
    if (response.error_code === 51) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        switch (response.payment_status_code) {
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
            message = oResourceBundle.already_subscribed;
            break;
          default:
            message = oResourceBundle.payment_error;
        }
      }
      else {
        switch (response.response_code) {
          case CONSTANTS.ERROR_CODE_TPAY_SMS_NOT_SENT:
            message = oResourceBundle.verification_sms_not_sent;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
            message = oResourceBundle.invalid_pin;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED:
            message = response.subscription_verified;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_LIMIT_EXCEEDED:
            message = response.code_limit_exceeded;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED:
            message = response.max_attempt_reached;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
            message = oResourceBundle.inapp_error;
            break;
          default:
            message = response.response_msg;

        }
      }
    }
    if (
      response &&
      response.error_code &&
      CONSTANTS.PAYMENT_OPERATOR_WE === this.state.operator
    ) {
      switch (response.error_code) {
        case CONSTANTS.ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS:
          message = oResourceBundle.etisalat_number_exists;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          message = oResourceBundle.inapp_error;
          break;
        default:
          message = response.error_msg;;
      }
    }
    if (response.error_code === 110) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        message = response.error_msg
      } else {
        message = oResourceBundle.payment_error;
      }
    }
    if (response.error_code === 109) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        message = response.error_msg
      } else {
        message = oResourceBundle.payment_error;
      }
    }
    if (response.error_code === 51) {
      if (response.subscription_status == CONSTANTS.ERROR_CODE_TPAY_ZERO) {
        switch (response.payment_status_code) {
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
            message = oResourceBundle.already_subscribed;
            break;
          default:
            message = oResourceBundle.payment_error;
        }
      }
      else {
        switch (response.response_code) {
          case CONSTANTS.ERROR_CODE_TPAY_SMS_NOT_SENT:
            message = oResourceBundle.verification_sms_not_sent;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_INVALID_PIN:
            message = oResourceBundle.invalid_pin;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED:
            message = response.subscription_verified;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_LIMIT_EXCEEDED:
            message = response.code_limit_exceeded;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED:
            message = response.max_attempt_reached;
            break;
          case CONSTANTS.ERROR_CODE_TPAY_ZERO:
            message = oResourceBundle.wait_two_minutes;
            break;
          case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
            message = oResourceBundle.inapp_error;
            break;
          default:
            message = response.response_msg;

        }
      }
    }


    //     {
    //     switch (response.error_code) {
    //       case CONSTANTS.ERROR_CODE_TPAY_NUMBER_ALREADY_EXISTS:
    //           message = oResourceBundle.etisalat_number_exists;
    //           break;
    //       case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
    //           message = oResourceBundle.already_subscribed;
    //           break;
    //       case CONSTANTS.ERROR_CODE_TPAY_ZERO:
    //           message = oResourceBundle.wait_two_minutes;
    //           break;
    //       case CONSTANTS.ERROR_CODE_TPAY_INVALID_MOBILE:
    //           message = response.error_msg;
    //           break;
    //       default:
    //           message = oResourceBundle.payment_error;
    //     }
    //   }
    // else {
    //   switch(response.payment_status_code) {
    //     case CONSTANTS.ERROR_CODE_TPAY_PAYMENT_STATUS:
    //         message = oResourceBundle.already_subscribed;
    //         break;
    //     case CONSTANTS.ERROR_CODE_TPAY_ZERO:
    //         message = oResourceBundle.wait_two_minutes;
    //         break;
    //     default:
    //         message = oResourceBundle.payment_error;  

    //   }
    // }

    common.showToast(
      CONSTANTS.GENERIC_TOAST_ID,
      message,
      toast.POSITION.BOTTOM_CENTER
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

  phoneNumberChanged(event) {
    const text = common.extractNumber(event.target.value);
    this.setState({
      phoneNumber: text
    });

  }


  /**
   * Component Name - PaymentEnterMobile
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    let title = "";
    let title1 = "";
    let trialText = "";
    let trialText1 = "";
    let trialText2 = "";
    let sendDisabled = true;
    let numberError = "";
    console.log("IRAQ",this.props.sCountryCode)
    let pound = "<span>&#163</span>"
      if (this.state.phoneNumber) {
      if (this.state.phoneNumber.slice(0, 1) == 0) {
        numberError = this.state.phoneNumber.slice(0, 1) == 0 ?
          oResourceBundle.mobile_zero : "";
      }
    }

    if (this.props.oSelectedPlan) {
      const planDuration =
        this.props.oSelectedPlan.billing_frequency == 7 ? oResourceBundle.week : this.props.oSelectedPlan.billing_frequency == 30 ? oResourceBundle.month : oResourceBundle.year;
      // common.getBillingText(
      //   this.props.oSelectedPlan.billing_frequency,
      //   this.props.oSelectedPlan.billing_cycle_type
      // );
      const planPrice =
        (this.props.oSelectedPlan.currency == "GBP" ? '<span > &#163;</span>' : this.props.oSelectedPlan.currency == "CAD" ? '<span>&#x24;</span>' : this.props.oSelectedPlan.currency) +
        " " +
        this.props.oSelectedPlan.price;
      const planPrice1 =
        this.props.oSelectedPlan.price + (this.props.oSelectedPlan.currency == "GBP" ?
          '<span > &#163;</span>' : this.props.oSelectedPlan.currency == "CAD" ?
            '<span>&#x24;</span>' : this.props.oSelectedPlan.currency == "EGP" ?
              oResourceBundle.egyptian_pounds : this.props.oSelectedPlan.currency == "IQD" ?
                oResourceBundle.iqd : this.props.oSelectedPlan.currency);

      const text = this.props.oSelectedPlan.country == "BH" ? oResourceBundle.free_for4 :
        (this.props.oSelectedPlan.country != "EG" ? oResourceBundle.free_for3 : "")
      const text1 = oResourceBundle.vat_included;
      title =
        oResourceBundle.enjoy_weyyak_experience1 +
        (this.state.operator == "WE" ? planPrice1 : planPrice) +
        planDuration;
      title1 =
        oResourceBundle.enjoy_weyyak_experience1 +
        planPrice1 +
        planDuration;
      const trialPeriod =
        this.props.oSelectedPlan.no_of_free_trial_days +
        " " +
        (this.props.oSelectedPlan.no_of_free_trial_days > 1
          ? oResourceBundle.days
          : oResourceBundle.day);
      trialText =
        this.props.oSelectedPlan.isEtisalat ?
          (oResourceBundle.free_for1 +
            trialPeriod +
            oResourceBundle.free_for2 +
            planPrice +
            planDuration +
            text1) : (
            oResourceBundle.free_for1 +
            trialPeriod +
            oResourceBundle.free_for2 +
            (this.state.operator == "WE" ? planPrice1 : planPrice) +
            text +
            planDuration)


      trialText1 =
        this.props.oSelectedPlan.isEtisalat ?
          (oResourceBundle.free_for1 +
            trialPeriod +
            oResourceBundle.free_for2 +
            planPrice1 +
            planDuration +
            text1) :
          (oResourceBundle.free_for1 +
            trialPeriod +
            oResourceBundle.free_for2 +
            planPrice1 +
            text +
            planDuration)


      if (this.props.oSelectedPlan.isEtisalat) {
        sendDisabled =
          this.state.phoneNumber.length !==
          CONSTANTS.ETISALAT_PHONE_CODE_DIGITS;
      } else if (this.props.oSelectedPlan.is_MW_Zain) {
        let num = this.state.phoneCode + this.state.phoneNumber

        if (num.length == 13 && (num.slice(3, 5) == 78 || num.slice(3, 5) == 79)) {
          sendDisabled = false;
        }
      }
      else if (this.props.oSelectedPlan.isInfo) {

        if (this.state.phoneNumber.length >= 7 && this.state.phoneNumber.length <= 13) {
          sendDisabled = false;
        }
      }
      else if (this.props.oSelectedPlan.isTelus) {
        if (this.state.phoneNumber.length >= 7 && this.state.phoneNumber.length <= 13) {
          sendDisabled = false;
        }
      }
      else if (this.props.oSelectedPlan.isTpay) {
        if (this.state.phoneNumber.length >= 7 && this.state.phoneNumber.length <= 13) {
          sendDisabled = false;
        }
      }
    }

    return (
      <React.Fragment>
        {this.props.loading && <Spinner />}
        <div className="enter-mobile-container">
          <div className="margin-collapse" />
          {/* {this.props.oSelectedPlan && this.props.oSelectedPlan.isEtisalat ?
            <div>
              <div className="free_for_et pound_english" dangerouslySetInnerHTML={{ __html: trialText }}></div>
              <div className="free_for_et pound_arabic" dangerouslySetInnerHTML={{ __html: trialText1 }}></div>
            </div> : ""} */}
          <div className="enjoy_weyyak_experience pound_english" dangerouslySetInnerHTML={{ __html: title }}></div>
          <div className="enjoy_weyyak_experience pound_arabic" dangerouslySetInnerHTML={{ __html: title1 }}></div>
          <div className="enter-mobile2">
            {oResourceBundle.enter_mobile_pin}
          </div>
          <div className="input-container">
            <div className="mobile-input-container">
              <Input
                className="country-code"
                type="tel"
                value={common.extractNumber(this.state.phoneCode)}
              />
              <div className="mobile-number">
                <Input
                  className=""
                  type="tel"
                  min="7"
                  max="13"
                  onChange={this.phoneNumberChanged.bind(this)}
                  value={this.state.phoneNumber}
                />
                <p className="error-message">
                  {numberError}
                </p>
              </div>
            </div>
            <Button
              className="send-button"
              disabled={sendDisabled}
              // value="${fn:escapeXml(submit_label)}" 
              onClick={this.handleSendButton.bind(this)}
            >
              {oResourceBundle.subscribe}
            </Button>
          </div>
          {this.props.oSelectedPlan && this.props.oSelectedPlan.isEtisalat ?
            <div>
              <div className="etisalat-container">
                {/* <div className="free-for-en pound_english" dangerouslySetInnerHTML={{ __html: trialText }}></div>
                <div className="free-for-ar pound_arabic" dangerouslySetInnerHTML={{ __html: trialText1 }}></div> */}
              </div>
              <div className="exit-etisalat" onClick={this.handleExitButton.bind(this)}>
                {oResourceBundle.btn_exit}
              </div>
            </div> : ""}
          {this.props.oSelectedPlan && !this.props.oSelectedPlan.isEtisalat ?
            <div className="exit" onClick={this.handleExitButton.bind(this)}>
              {oResourceBundle.btn_exit}
            </div> : ""}
          <div className="conditions-container">
            {this.props.oSelectedPlan && !this.props.oSelectedPlan.isEtisalat ?
            this.props.sCountryCode!='IQ' ?
              <div>
                <div className="free-for pound_english" dangerouslySetInnerHTML={{ __html: trialText }}></div>
                <div className="free-for pound_arabic" dangerouslySetInnerHTML={{ __html: trialText1 }}></div>
              </div> : ""
              : " "}
            <div className="by-clicking">
              {oResourceBundle.by_clicking_subscribe}
            </div>
            <br />
            <div className="by-clicking1">
              {this.props.locale === "ar" && this.props.oSelectedPlan && this.props.oSelectedPlan.is_MW_Zain ? oResourceBundle.ZainText1  : oResourceBundle.clicking_subscribe_condition1}
            </div>
            {
              this.props.oSelectedPlan && this.props.oSelectedPlan.isEtisalat ?
                <div className="by-clicking-etisalat">
                  {this.props.oSelectedPlan &&
                    CONSTANTS.WEEKLY_PLAN_DAYS ===
                    this.props.oSelectedPlan.billing_frequency &&
                    oResourceBundle.clicking_subscribe_condition7_weekly}
                  {this.props.oSelectedPlan &&
                    CONSTANTS.MONTHLY_PLAN_DAYS <=
                    this.props.oSelectedPlan.billing_frequency &&
                    oResourceBundle.clicking_subscribe_condition7_monthly_yearly}
                </div> : ""
            }
            {
              this.props.locale === "ar" && this.props.oSelectedPlan && this.props.oSelectedPlan.is_MW_Zain ?
              <div>
                <div className="by-clicking2">{oResourceBundle.ZainText2}</div>
                <div className="by-clicking2">{oResourceBundle.ZainText3}</div>
              </div> :
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
            }
            <div className="by-clicking3">
              {(this.props.oSelectedPlan && this.props.oSelectedPlan.isTpay) ? (

                (this.props.oSelectedPlan &&
                  CONSTANTS.WEEKLY_PLAN_DAYS ===
                  this.props.oSelectedPlan.billing_frequency &&
                  oResourceBundle.clicking_subscribe_condition3_weekly) ?
                  (oResourceBundle.clicking_subscribe_condition3_weekly + this.state.shortCode + " " +
                    (this.state.operator == "WE" ? oResourceBundle.for_free : "")) :
                  (oResourceBundle.clicking_subscribe_condition3_monthly + this.state.shortCode + " " +
                    (this.state.operator == "WE" ? oResourceBundle.for_free : ""))

              ) : (
                (this.props.oSelectedPlan && this.props.oSelectedPlan.isInfo) ? (
                  (this.props.oSelectedPlan &&
                    CONSTANTS.WEEKLY_PLAN_DAYS ===
                    this.props.oSelectedPlan.billing_frequency &&
                    oResourceBundle.clicking_subscribe_condition5_weekly) ? (oResourceBundle.clicking_subscribe_condition5_weekly + this.state.shortCode) : (oResourceBundle.clicking_subscribe_condition5_monthly + this.state.shortCode)

                ) :
                  (this.props.oSelectedPlan && this.props.oSelectedPlan.isTelus) ? (
                    (this.props.oSelectedPlan &&
                      CONSTANTS.WEEKLY_PLAN_DAYS ===
                      this.props.oSelectedPlan.billing_frequency &&
                      oResourceBundle.clicking_subscribe_condition5_weekly) ? (oResourceBundle.clicking_subscribe_condition5_weekly + this.state.shortCode) : (oResourceBundle.clicking_subscribe_condition5_monthly + this.state.shortCode)
                  ) :
                    (this.props.oSelectedPlan && this.props.oSelectedPlan.is_MW_Zain) ? (
                      this.props.locale === "en"  ? ((this.props.oSelectedPlan &&
                        CONSTANTS.WEEKLY_PLAN_DAYS ===
                        this.props.oSelectedPlan.billing_frequency &&
                        oResourceBundle.clicking_subscribe_condition6_weekly) ? (oResourceBundle.clicking_subscribe_condition6_weekly + this.state.shortCode) : (oResourceBundle.clicking_subscribe_condition6_monthly + this.state.shortCode)) : (oResourceBundle.ZainText4)
                    ) :

                      (
                        ((this.props.oSelectedPlan && CONSTANTS.WEEKLY_PLAN_DAYS ===
                          this.props.oSelectedPlan.billing_frequency)) ? (oResourceBundle.clicking_subscribe_condition4_weekly) : this.props.oSelectedPlan && this.props.oSelectedPlan.billing_frequency == 30 ? (oResourceBundle.clicking_subscribe_condition4_monthly) : (oResourceBundle.clicking_subscribe_condition4_yearly)

                      )

              )}
            </div>
            {
              this.props.locale === "ar" && this.props.oSelectedPlan && this.props.oSelectedPlan.is_MW_Zain ?
              <div>
                <div className="by-subclicking3">{oResourceBundle.ZainText5}</div>
                <div className="by-subclicking3">{oResourceBundle.ZainText6}</div>
              </div> :""
            }
            { this.props.oSelectedPlan && this.props.oSelectedPlan.is_MW_Zain && this.props.locale === "ar" ?
              <div className="by-clicking3">
                {oResourceBundle.ZainText7}<a className="link" href="https://weyyak.com/ar/static/term-ar">انقر هنا</a>
              </div> : ""}
            {this.props.oSelectedPlan && this.props.oSelectedPlan.isEtisalat ?
              <div className="by-clicking3">
                {oResourceBundle.terms_conditions}
                {this.props.locale === "en" ? <a className="link" href="https://weyyak.com/en/static/term-en">click here</a> : <a className="link" href="https://weyyak.com/ar/static/term-ar">انقر هنا</a>}
              </div> : ""}
            <br />
            <div className="by-clicking4">
              {oResourceBundle.clicking_subscribe_condition4}
            </div>
          </div>
        </div>
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
    etisalatPrepareSession: (data, success, failure) => {
      dispatch(actionTypes.etisalatPrepareSession(data, success, failure));
    },
    tpayPrepareSession: (data, success, failure) => {
      dispatch(actionTypes.tpayPrepareSession(data, success, failure));
    },
    infoPrepareSession: (data, success, failure) => {
      dispatch(actionTypes.infoPrepareSession(data, success, failure))
    },
    ZainPrepareSession: (data, success, failure) => {
      dispatch(actionTypes.ZainPrepareSession(data, success, failure));
    },
    telusPrepareSession: (data, success, failure) => {
      dispatch(actionTypes.telusPrepareSession(data, success, failure))
    },
  };
};

/**
 * Component - PaymentEnterMobile
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    newUserDetails: state.newUserDetails,
    loading: state.loading,
    sCountryCode: state.sCountryCode,
    oSelectedPlan: state.oSelectedPlan
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PaymentEnterMobile)
);
