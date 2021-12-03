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
import {connect} from "react-redux";
import moment from "moment";
import Dialog from "core/components/Dialog";
import * as constants from "../../../AppConfig/constants";
import Button from "core/components/Button/";
import * as actionTypes from "app/store/action/";
import {sendEvents} from "core/GoogleAnalytics/";
import oResourceBundle from "app/i18n/";
import * as CONSTANTS from "app/AppConfig/constants";
import * as common from "app/utility/common";
import BaseContainer from "core/BaseContainer/";
import Spinner from "core/components/Spinner";
import {toast} from "core/components/Toaster/";
import "./index.scss";

const ACTIVE_PLANS_TAB = 1;
const BILLING_TAB = 2;

class ManageYourAccount extends BaseContainer {
  /**
   * Represents ManageYourAccount.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      currentPlans: [],
      current: ACTIVE_PLANS_TAB
    };
    this.activePlans = [];
    this.historyPlans = [];
  }

  componentDidMount() {
    const oUserToken = common.getCookie(constants.COOKIE_USER_TOKEN)
      ? JSON.parse(common.getCookie(constants.COOKIE_USER_TOKEN))
      : null;
    if (!oUserToken) {
      this.props.history.push(`/${this.props.locale}/${constants.LOGIN}`);
    }
    this.getPlans();
  }

  componentDidUpdate(prevProps, prevSate) {
    if (prevProps.locale !== this.props.locale) {
      this.getPlans();
    }
  }

  async getPlans() {
    this.activePlans = [];
    this.historyPlans = [];

    const allPlans = await common.userSubscriptionPlan(true, this.props.locale);

    for (let plan of allPlans) {
      if (plan.state === CONSTANTS.ACTIVE_PLAN_TEXT) {
        this.activePlans.push(plan);
      } else {
        this.historyPlans.push(plan);
      }
    }

    this.setState({
      allPlans: allPlans,
      currentPlans: this.activePlans
    });
  }

  /**
   * Component Name - ManageYourAccount
   * Switch toggle
   * @param { null }
   * @returns {undefined}
   */
  handleToggle() {}

  activePlansClicked() {
    this.setState({
      currentPlans: this.activePlans,
      current: ACTIVE_PLANS_TAB
    });
  }
  billingHistoryClicked() {
    this.setState({
      currentPlans: this.historyPlans,
      current: BILLING_TAB
    });
  }
  addPlansClicked() {
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.PLANS_DESCRIPTION}/`);
  }

  cancelSubscriptionClicked(plan) {
    this.setState({
      showCancelDialog: true,
      selectedPlan: plan
    });
  }

  cancelSubscriptionSuccess() {
    common.showToast(
      CONSTANTS.MY_SUBSCRIPTION_TOAST_ID,
      oResourceBundle.cancel_subscription_success,
      toast.POSITION.BOTTOM_CENTER
    );
    this.getPlans();

    sendEvents(
      CONSTANTS.SUBSCRIPTION_CANCEL_CATEGORY,
      CONSTANTS.SUBSCRIPTION_CANCEL_ACTION,
      this.state.selectedPlan.subscription_plan.title
    );
  }

  cancelSubscriptionFailure() {
    common.showToast(
      CONSTANTS.MY_SUBSCRIPTION_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  handleDialogOK() {
    this.setState({
      showCancelDialog: false
    });
    if (
      CONSTANTS.PAYMENT_OPERATOR_ADYEN ===
      this.state.selectedPlan.payment_provider
    ) {
      this.props.adyenCancelSubscription(
        this.state.selectedPlan.order_id,
        this.props.locale,
        this.cancelSubscriptionSuccess.bind(this),
        this.cancelSubscriptionFailure.bind(this)
      );
    } else if (
      CONSTANTS.PAYMENT_OPERATOR_ETISALAT ===
      this.state.selectedPlan.payment_provider
    ) {
      this.props.etisalatCancelSubscription(
        this.state.selectedPlan.order_id,
        this.props.locale,
        this.cancelSubscriptionSuccess.bind(this),
        this.cancelSubscriptionFailure.bind(this)
      );
    } else if (common.isTpay(this.state.selectedPlan.payment_provider)) {
      this.props.tpayCancelSubscription(
        this.state.selectedPlan.order_id,
        this.props.locale,
        this.cancelSubscriptionSuccess.bind(this),
        this.cancelSubscriptionFailure.bind(this)
      );
    }
  }

  handleDialogNo() {
    this.setState({
      showCancelDialog: false
    });
  }

  onCancelDialogClosed() {}
  onSubscribeButtonClick() {
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.PLANS}`);
  }

  /**
   * Component Name - MobileVerificationSuccess
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <div className="manage-account">
        <div className="manage-account-conatiner ">
          <div className="subscription-title">
            {oResourceBundle.my_subscription_title}
          </div>
          <div className="tab-buttons">
            <Button
              className={
                this.state.current === ACTIVE_PLANS_TAB ? "current" : ""
              }
              onClick={this.activePlansClicked.bind(this)}
            >
              {oResourceBundle.active_plans}
            </Button>
            <Button
              className={this.state.current === BILLING_TAB ? "current" : ""}
              onClick={this.billingHistoryClicked.bind(this)}
            >
              {oResourceBundle.billing_history}
            </Button>
          </div>
          <div className="horizontal-divider" />
          {!this.props.loading &&
            (this.state.currentPlans.length > 0 ? (
              this.state.currentPlans.map((plan, i) => {
                const isPromo = plan.subscription_plan && plan.subscription_plan.promo_code;
                return (
                  <div
                    className={
                      "plans-array" + (plan.recurring_enabled ? " active" : "")
                    }
                    key={i}
                  >
                    <div className="plan-name heading">
                      {plan.subscription_plan.title}
                    </div>
                    {
                      //   <div className="plan-name plan-item">
                      //   <div className="label">{oResourceBundle.plan_name}</div>
                      //   <div className="value">
                      //     {plan.subscription_plan.title}
                      //   </div>
                      // </div>
                    }
                    <div className="trial-period plan-item">
                      <div className="label">
                        {oResourceBundle.trial_period}
                      </div>
                      <div className="value">
                        {plan.free_trial_days} {oResourceBundle.days}
                      </div>
                    </div>
                    <div className="duration plan-item">
                      <div className="label">{oResourceBundle.duration}</div>
                      <div className="value">
                        {moment(plan.subscription_start).format(
                          CONSTANTS.SUBSCRIPTION_DATE_FORMAT
                        )}
                        {" - "}
                        {moment(plan.subscription_end).format(
                          CONSTANTS.SUBSCRIPTION_DATE_FORMAT
                        )}
                      </div>
                    </div>
                    <div className="plan-price plan-item">
                      <div className="label">{oResourceBundle.amount}</div>
                      <div className="value">
                        {plan.subscription_plan.price}{" "}
                        {plan.subscription_plan.currency} {oResourceBundle.for}{" "}
                        {plan.subscription_plan.billing_frequency}{" "}
                        {oResourceBundle.days}
                      </div>
                    </div>
                    <div className="payment-mode plan-item">
                      <div className="label">
                        {oResourceBundle.payment_mode}
                      </div>
                      <div className="value">
                        {isPromo
                          ? oResourceBundle.promo_code+ "("+plan.subscription_plan.promo_code+")"
                          : plan.payment_provider}
                      </div>
                    </div>
                    <div className="pack-country plan-item">
                      <div className="label">
                        {oResourceBundle.pack_country}
                      </div>
                      <div className="value">
                        {plan.subscription_plan.country_name}
                      </div>
                    </div>
                    <div className="purchase-date plan-item">
                      <div className="label">
                        {oResourceBundle.date_of_purchase}
                      </div>
                      <div className="value">
                        {moment(plan.subscription_start).format(
                          CONSTANTS.SUBSCRIPTION_PURCHASE_DATE_FORMAT
                        )}
                      </div>
                    </div>
                    {
                      //   <div className="plan-price plan-item">
                      //   <div className="label">
                      //     {oResourceBundle.auto_renewal}
                      //   </div>
                      //   <div className="value">
                      //     <ToggleButton
                      //       width={this.props.width || 36}
                      //       height={this.props.height || 16}
                      //       offHandleColor={"#2c2c2c"}
                      //       onHandleColor={"#39ff00"}
                      //       handleDiameter={10}
                      //       offColor={"#000"}
                      //       onColor={"#000"}
                      //       checked={plan.recurring_enabled}
                      //       onChange={this.handleToggle.bind(this)}
                      //       disabled={true}
                      //     />
                      //   </div>
                      // </div>
                    }
                    {
                      // <Button
                      //   className="add-plan"
                      //   onClick={this.addPlansClicked.bind(this)}
                      // >
                      //   {oResourceBundle.add_plans}
                      // </Button>
                    }
                    {this.state.showCancelDialog ? (
                      <Dialog
                        visible={true}
                        onDialogClosed={this.onCancelDialogClosed.bind(this)}
                        duration={CONSTANTS.RATING_DIALOG_ANIMATION_DURATION}
                        showCloseButton={false}
                        closeOnEsc={true}
                        width={CONSTANTS.RATING_DIALOG_WIDTH}
                        height={CONSTANTS.SIGNOUTALL_DIALOG_HEIGHT}
                      >
                        <div className="dialog-content">
                          <div className="dialog-title">
                            {oResourceBundle.confirm_cancel_subscription}
                          </div>
                        </div>
                        <div className="actions">
                          <Button
                            className="dialog-ok-btn"
                            onClick={this.handleDialogOK.bind(this)}
                          >
                            {oResourceBundle.yes}
                          </Button>
                          <Button
                            className="dialog-ok-btn"
                            onClick={this.handleDialogNo.bind(this)}
                          >
                            {oResourceBundle.no}
                          </Button>
                        </div>
                      </Dialog>
                    ) : null}
                    {isPromo ? null : this.state.current === ACTIVE_PLANS_TAB &&
                    plan.recurring_enabled === true ? (

                      <div className="cancel-subscription">
                        <span>
                          { oResourceBundle.payment_mode === plan.payment_provider ?"Manage Your Subscription in Settings on Your ios device":<span
                          onClick={this.cancelSubscriptionClicked.bind(
                            this,
                            plan
                          )}
                        >
                          {oResourceBundle.cancel_subscription}
                        </span> }
                        </span>

                     
                      </div>
                    ) : (
                      <div className="cancelled">
                        <span>{oResourceBundle.cancelled}</span>
                      </div>
                    )}
                    <div className="horizontal-divider" />
                  </div>
                );
              })
            ) : (
              <div className="no-active-plan">
                {this.state.current === ACTIVE_PLANS_TAB &&
                  oResourceBundle.no_active_plan}
                {this.state.current === BILLING_TAB &&
                  oResourceBundle.no_billing_history}
                <div>
                <Button
                  className="subscribe-now-button"
                  onClick={this.onSubscribeButtonClick.bind(this)}
                >
                {oResourceBundle.subscribe_now}
               </Button>
               </div>
              </div>
            ))}
        </div>
        {this.props.loading && <Spinner />}
      </div>
    );
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

/**
 * method that maps state to props.
 * Component - AdyenGateway
 * @param {Object} dispatch
 * dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */

const mapDispatchToProps = dispatch => {
  //dispatch action to redux store
  return {
    adyenCancelSubscription: (orderId, locale, fnSuccess, fnFailure) => {
      dispatch(
        actionTypes.adyenCancelSubscription(orderId, locale, fnSuccess, fnFailure)
      );
    },
    etisalatCancelSubscription: (orderId, locale, fnSuccess, fnFailure) => {
      dispatch(
        actionTypes.etisalatCancelSubscription(orderId, locale, fnSuccess, fnFailure)
      );
    },
    tpayCancelSubscription: (orderId,locale, fnSuccess, fnError) => {
      dispatch(
        actionTypes.tpayCancelSubscription(orderId, locale, fnSuccess, fnError)
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageYourAccount);
