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
import { connect } from "react-redux";
import * as CONSTANTS from "../../../AppConfig/constants";
import { fnNavTo, getCookie } from "app/utility/common";
import Button from "core/components/Button/";
import oResourceBundle from "app/i18n/";
import "./index.scss";

class CouponSuccess extends BaseContainer {
  componentDidMount() {
    if (!this.props.oTransactionReference) {
      fnNavTo.call(this, `/${this.props.locale}/`);
    }
  }

  fnResumeContent() {
    const sResumePagePath =
      getCookie(CONSTANTS.RESUME_PATH_COOKIE_NAME) || this.props.locale;
    fnNavTo.call(this, `${sResumePagePath}`);
  }

  render() {
    // console.log(this.props.oTransactionReference)
    return (
      <div className="coupons-succes-container">
        <div className="transaction-text">
          <span>{this.props.oTransactionReference ? ((this.props.oTransactionReference.coupon_type == "Voucher") ? oResourceBundle.gift_voucher_active : oResourceBundle.promo_code_active) : ""}</span>
          <br />
          <span>
            {this.props.oTransactionReference &&
              oResourceBundle.your_plan_will.replace(
                "{EXPIRY_DATE}",
                moment(this.props.oTransactionReference.expiry_date).format(
                  CONSTANTS.SUBSCRIPTION_PURCHASE_DATE_FORMAT
                )
              )}
          </span>
        </div>
        <div className="actions">
          <Button className="done" onClick={this.fnResumeContent.bind(this)}>
            {oResourceBundle.done}
          </Button>
        </div>
      </div>
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
    oTransactionReference: state.oTransactionReference
  };
};

export default connect(mapStateToProps)(CouponSuccess);
