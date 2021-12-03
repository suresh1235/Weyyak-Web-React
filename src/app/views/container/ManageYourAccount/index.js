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
import "./index.scss";
import { connect } from "react-redux";
import * as constants from "../../../AppConfig/constants";
import ToggleButton from "core/components/ToggleButton";
import moment from "moment";
import oResourceBundle from "app/i18n/";
import { userSubscriptionPlan, getCookie } from "app/utility/common";

class ManageYourAccount extends React.Component {
  /**
   * Represents ManageYourAccount.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      planDetails: []
    };
  }

  async componentDidMount() {
    const oUserToken = getServerCookie(constants.COOKIE_USER_TOKEN)
      ? JSON.parse(getServerCookie(constants.COOKIE_USER_TOKEN))
      : null;
    if (!oUserToken) {
      this.props.history.push(`/${this.props.locale}/${constants.LOGIN}`);
    }
    const planDetails = await userSubscriptionPlan();
    this.setState({
      planDetails
    });
  }

  /**
   * Component Name - ManageYourAccount
   * Switch toggle
   * @param { null }
   * @returns {undefined}
   */
  handleToggle() {}

  /**
   * Component Name - MobileVerificationSuccess
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return Array.isArray(this.state.planDetails) &&
      this.state.planDetails.length > 0 &&
      !this.props.loading ? (
      <div className="manage-account-conatiner ">
        <div className="subscription-title">
          {oResourceBundle.my_subscription_title}
        </div>
        <div className="toggle-switch">
          <ToggleButton
            checked={this.state.planDetails[0].state === "Active"}
            onChange={this.handleToggle.bind(this)}
            disabled={true}
          />
        </div>

        <div className="plan-name plan-item">
          <div>{oResourceBundle.my_subscription_row_plan_name + ": "}</div>
          <div>{this.state.planDetails[0].subscription_plan.title}</div>
        </div>
        <div className="plan-start-date plan-item">
          <div>{oResourceBundle.my_subscription_row_start_date + ": "}</div>
          <div>
            {moment(this.state.planDetails[0].subscription_start).format(
              "DD/MM/YYYY"
            )}
          </div>
        </div>
        <div className="plan-end-date plan-item">
          <div>{oResourceBundle.expiry_date + ": "}</div>
          <div>
            {moment(this.state.planDetails[0].subscription_end).format(
              "DD/MM/YYYY"
            )}
          </div>
        </div>
        <div className="plan-price plan-item">
          <div>{oResourceBundle.my_subscription_row_price + ": "}</div>
          <div>
            {this.state.planDetails[0].subscription_plan.price +
              this.state.planDetails[0].subscription_plan.currency}
          </div>
        </div>
      </div>
    ) : !this.props.loading ? (
      <div className="no-active-plan">{"No active plan is available"}</div>
    ) : null;
  }
}

/**
 * Component - MobileVerificationSuccess
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loading: state.loading
  };
};

export default connect(mapStateToProps)(ManageYourAccount);
