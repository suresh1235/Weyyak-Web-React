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

class MobileDuSuccess extends BaseContainer {
  componentDidMount() {
      if (!this.props.oTpaySession) {
        fnNavTo.call(this, `/${this.props.locale}/`);
        }
        document.getElementById('ltiLaunchForm1').submit(); 
      }



  fnResumeContent() {
    const sResumePagePath =
      getCookie(CONSTANTS.RESUME_PATH_COOKIE_NAME) || this.props.locale;
    fnNavTo.call(this, `${sResumePagePath}`);

  }


  render() {
    const params = new URLSearchParams(this.props.location.search);
    console.log(params.get("contractStartDate"),"params")
    
    return (
      <form method= "POST"  id = "ltiLaunchForm1" style={{display: "none"}} action= "https://live.tpay.me/op/42403/sub/new" >
        <input type ="text" name="customerAccountNumber" value={params.get("customerAccountNumber")} />
        <input type ="text" name="msisdn" value={params.get("msisdn")} />
        <input type ="text" name="operatorCode" value={params.get("operatorCode")} />
        <input type ="text" name="subscriptionPlanId" value={params.get("subscriptionPlanId")} />
        <input type ="text" name="initialPaymentproductId" value={params.get("initialPaymentproductId")} />
        <input type ="text" name="initialPaymentDate" value={params.get("initialPaymentDate")} />
        <input type ="text" name="executeInitialPaymentNow" value={params.get("executeInitialPaymentNow")} />
        <input type ="text" name="recurringPaymentproductId" value={params.get("recurringPaymentproductId")} />
        <input type ="text" name="productCatalogName" value={params.get("productCatalogName")} />
        <input type ="text" name="executeRecurringPaymentNow" value={params.get("executeRecurringPaymentNow")} />
        <input type ="text" name="contractStartDate" value={params.get("contractStartDate")} />
        <input type ="text" name="contractEndDate" value={params.get("contractEndDate")} />
        <input type ="text" name="autoRenewContract" value={params.get("autoRenewContract")} />
        <input type ="text" name="language" value={params.get("language")} />
        <input type ="text" name="signature" value={params.get("signature")} /> 
        <input type ="text" name="redirectUrl" value={params.get("redirectUrl")} />
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

export default connect(mapStateToProps)(MobileDuSuccess);
