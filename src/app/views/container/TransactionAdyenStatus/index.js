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
import * as CONSTANTS from "../../../AppConfig/constants";
import { fnNavTo, getCookie, userSubscriptionPlan, getUserId } from "app/utility/common";
import Spinner from "core/components/Spinner";
import { sendEvents } from "core/GoogleAnalytics/";
import Button from "core/components/Button/";
import oResourceBundle from "app/i18n/";
import { CleverTap_CustomEvents,CleverTap_UserEvents } from 'core/CleverTap'
import "./index.scss";

class NewTransacationStatus extends BaseContainer {

    state = {
        payment_status: "",
        payment_message: "",
        order_id: ""
    }

    async componentDidMount() {

        CleverTap_CustomEvents("subscription_thankyou_page", {
            "country": this.props.countryCode ? this.props.countryCode : localStorage.getItem('country'),
        })

        let subinfo = JSON.parse(localStorage.getItem("subinfo"))
        if (subinfo) {
            if (subinfo.status) {
                this.setState({
                    payment_status: subinfo.status,
                    payment_message: subinfo.message,
                    order_id: subinfo.order_id
                });
            } else if (subinfo.error_code) {
                this.setState({
                    payment_status: "failed",
                    order_id: subinfo.order_id
                })
            } else {
                fnNavTo.call(this, `/${this.props.locale}`);
            }


            const allPlans = await userSubscriptionPlan(true, this.props.locale);

            let activePlans = [];

            for (let plan of allPlans) {
                if (plan.state === CONSTANTS.ACTIVE_PLAN_TEXT) {
                    activePlans.push(plan);
                }
            }


            const oSelectedPlanCookie = getCookie(CONSTANTS.PAYMENT_SELECTED_PLAN_COOKIE);


            if (
                subinfo.status && subinfo.status == 200
            ) {
                sendEvents(
                    // subinfo.no_of_free_trial_days == 0 ? CONSTANTS.SUBSCRIPTION_PAYMENT_COMPLETED_CATEGORY : CONSTANTS.SUBSCRIPTION_PAYMENT_COMPLETED_TRIAL_CATEGORY,
                    activePlans && activePlans[0].subscription_plan.no_of_free_trial_days == 0 ? CONSTANTS.SUBSCRIPTION_PAYMENT_COMPLETED_CATEGORY : CONSTANTS.SUBSCRIPTION_PAYMENT_COMPLETED_TRIAL_CATEGORY,
                    CONSTANTS.SUBSCRIPTION_PAYMENT_COMPLETED_ACTION,
                    CONSTANTS.PAYMENT_OPERATOR_ADYEN
                );

                if (activePlans) {
                    //CleverTap Events
                    CleverTap_CustomEvents("subscription_success", {
                        "payment mode": activePlans[0].payment_provider,
                        "pack_type": activePlans[0].subscription_plan.title,
                        "subscription_start_date": activePlans[0].subscription_start,
                        "subscription_expiry_date": activePlans[0].subscription_end,
                        "subscription_country": this.props.countryCode ? this.props.countryCode : localStorage.getItem('country'),
                    })

                    let userData = {}
                    userData.userId = getUserId()
                    userData.subType = activePlans[0].subscription_plan.coupon_type  == "Voucher" ? "Discounted_Coupon_User" : "Subscribed_User"
                  CleverTap_UserEvents("ProfileEvent", userData)
                }

            } else {
                sendEvents(
                    CONSTANTS.SUBSCRIPTION_PAYMENT_FAILED_CATEGORY,
                    CONSTANTS.SUBSCRIPTION_PAYMENT_FAILED_ACTION,
                    CONSTANTS.PAYMENT_OPERATOR_ADYEN
                );


                if (oSelectedPlanCookie) {
                    let oSelectedPlan = JSON.parse(oSelectedPlanCookie);

                    //CleverTap Events
                    CleverTap_CustomEvents("subscription_failure", {
                        "payment mode": oSelectedPlan ? oSelectedPlan.payment_providers[0].name : "",
                        "pack_type": oSelectedPlan ? oSelectedPlan.title : "",
                        // "subscription_start_date": activePlans[0].subscription_start,
                        // "subscription_expiry_date": activePlans[0].subscription_end,
                        "subscription_country": this.props.countryCode ? this.props.countryCode : localStorage.getItem('country'),
                    })
                }

            }


        } else {
            fnNavTo.call(this, `/${this.props.locale}`);
        }


    }

    componentWillUnmount() {
        localStorage.removeItem("subinfo");
    }

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
            this.state.payment_status === 200
        ) {
            const sResumePagePath = getCookie(CONSTANTS.RESUME_PATH_COOKIE_NAME);
            //deleteCookie(CONSTANTS.RESUME_PATH_COOKIE_NAME);
            fnNavTo.call(this, `${sResumePagePath}`);
        } else {
            fnNavTo.call(this, "");
        }

        localStorage.removeItem("subinfo");
        localStorage.removeItem("payload");
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
        const isSuccessful = this.state.payment_status
            ? this.state.payment_status
            : "";

        const sPath =
            this.state.payment_status != 200
                ? `/${this.props.locale}/${CONSTANTS.CHECKOUT}`
                : `/${this.props.locale}`;

        return isSuccessful ? (
            <div className="transaction-details">
                <div className="transaction-text">
                    <div className="transaction-status-text">
                        {isSuccessful == 200
                            ? oResourceBundle.payment_success
                            : oResourceBundle.payment_failed}
                    </div>
                    {isSuccessful ? (
                        <div className="transaction-refrence">
                            {oResourceBundle.order_no}
                            {this.state.order_id}
                        </div>
                    ) : null}
                </div>
                <div className="actions">
                    {isSuccessful == 200 ? (
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
                            {oResourceBundle.try_again}
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
        countryCode: state.sCountryCode,
        loading: state.loading,
        oTransactionReference: state.oTransactionReference,
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
)(NewTransacationStatus);
