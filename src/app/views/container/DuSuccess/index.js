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
import moment from "moment";
import BaseContainer from "core/BaseContainer/";
import {connect} from "react-redux";
import * as CONSTANTS from "../../../AppConfig/constants";
import {fnNavTo, getCookie} from "app/utility/common";
import { useLocation} from "react-router-dom";
import Button from "core/components/Button/";
import oResourceBundle from "app/i18n/";

class DuSuccess extends BaseContainer {
  componentDidMount() {
      if (!this.props.oTpaySession) {
        fnNavTo.call(this, `/${this.props.locale}/`);
        }
        document.getElementById('ltiLaunchForm').submit(); 
      }


  fnResumeContent() {
    const sResumePagePath =
      getCookie(CONSTANTS.RESUME_PATH_COOKIE_NAME) || this.props.locale;
    fnNavTo.call(this, `${sResumePagePath}`);

  }


  render() {
    return (
      <form method= "POST"  id = "ltiLaunchForm" style={{display: "none"}} action= "https://live.tpay.me/op/42403/sub/new" >
        <input type ="text" name="customerAccountNumber" value={this.props.oTpaySession?this.props.oTpaySession.customerAccountNumber:""} />
        <input type ="text" name="msisdn" value={this.props.oTpaySession?this.props.oTpaySession.msisdn:""} />
        <input type ="text" name="operatorCode" value={this.props.oTpaySession?this.props.oTpaySession.operatorCode:""} />
        <input type ="text" name="subscriptionPlanId" value={this.props.oTpaySession?this.props.oTpaySession.subscriptionPlanId:""} />
        <input type ="text" name="initialPaymentproductId" value={this.props.oTpaySession?this.props.oTpaySession.initialPaymentproductId:""} />
        <input type ="text" name="initialPaymentDate" value={this.props.oTpaySession?this.props.oTpaySession.initialPaymentDate:""} />
        <input type ="text" name="executeInitialPaymentNow" value={this.props.oTpaySession?this.props.oTpaySession.executeInitialPaymentNow:""} />
        <input type ="text" name="recurringPaymentproductId" value={this.props.oTpaySession?this.props.oTpaySession.recurringPaymentproductId:""} />
        <input type ="text" name="productCatalogName" value={this.props.oTpaySession?this.props.oTpaySession.productCatalogName:""} />
        <input type ="text" name="executeRecurringPaymentNow" value={this.props.oTpaySession?this.props.oTpaySession.executeRecurringPaymentNow:""} />
        <input type ="text" name="contractStartDate" value={this.props.oTpaySession?this.props.oTpaySession.contractStartDate:""} />
        <input type ="text" name="contractEndDate" value={this.props.oTpaySession?this.props.oTpaySession.contractEndDate:""} />
        <input type ="text" name="autoRenewContract" value={this.props.oTpaySession?this.props.oTpaySession.autoRenewContract:""} />
        <input type ="text" name="language" value={this.props.oTpaySession?this.props.oTpaySession.language:""} />
        <input type ="text" name="signature" value={this.props.oTpaySession?this.props.oTpaySession.signature:""} /> 
        <input type ="text" name="redirectUrl" value={this.props.oTpaySession?this.props.oTpaySession.redirectUrl:""} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

/**
 * Component - CouponSuccess
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    oSelectedPlan: state.oSelectedPlan,
    oTpaySession: state.oTpaySession,
    loading: state.loading,
    oTransactionReference: state.oTransactionReference
  };
};

export default connect(mapStateToProps)(DuSuccess);
