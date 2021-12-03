/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import React from "react";
import BaseContainer from "core/BaseContainer/";
import { connect } from "react-redux";
import Banner from "app/resources/assets/plans/banner.svg";
import oResourceBundle from "app/i18n/";
import Button from "../../../../core/components/Button/";
import Spinner from "core/components/Spinner";
import * as actionTypes from "app/store/action/";
import {
  PAYMENT_OPERATOR,
  SUBSCRIPTION_PLAN_CATEGORY,
  SUBSCRIPTION_PLAN_SELECTED_ACTION,
  SUBSCRIPTION_PROCEED_ACTION
} from "app/AppConfig/constants";
import { sendEvents } from "core/GoogleAnalytics/";
import { isUserSubscribed, fnNavTo } from "app/utility/common";
import { toast } from "core/components/Toaster/";
import "./index.scss";

class Plans extends BaseContainer {
  state = {
    selectedPlanId: ""
  };
  componentDidMount() {
    isUserSubscribed().then(isUserSubscribed => {
      if (isUserSubscribed) {
        fnNavTo.call(this, `/${this.props.locale}`, true);
      } else if (this.props.sCountryCode !== "" && !this.bPlansFetched) {
        this.bPlansFetched = true;
        this.props.fnSubscriptionPlans(
          this.props.sCountryCode,
          this.props.locale,
          (oReponse)=>{
            //Success
            if(oReponse.code === 404){
              toast.success(oResourceBundle.payment_system_error, {
                position: toast.POSITION.BOTTOM_CENTER
              });
            }
          }, (oError) => {
            //Failed
            toast.success(oResourceBundle.payment_system_error, {
              position: toast.POSITION.BOTTOM_CENTER
            });
          }
        );
      }
    });
  }

  componentDidUpdate(prevProps, prevSate) {
    if (this.props.sCountryCode !== "" && !this.bPlansFetched) {
      this.bPlansFetched = true;
      this.props.fnSubscriptionPlans(
        this.props.sCountryCode,
        this.props.locale,
        (oReponse)=>{
          //Success
          if(oReponse.code === 404){
            toast.success(oResourceBundle.payment_system_error, {
              position: toast.POSITION.BOTTOM_CENTER
            });
          }
        }, (oError) => {
          //Failed
          toast.success(oResourceBundle.payment_system_error, {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      );
    } else if (
      this.props.locale !== prevProps.locale ||
      this.props.match.params.langcode !== prevProps.match.params.langcode
    ) {
      this.props.fnSubscriptionPlans(
        this.props.sCountryCode,
        this.props.locale,
        (oReponse)=>{
          //Success
          if(oReponse.code === 404){
            toast.success(oResourceBundle.payment_system_error, {
              position: toast.POSITION.BOTTOM_CENTER
            });
          }
        }, (oError) => {
          //Failed
          toast.success(oResourceBundle.payment_system_error, {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      );
    }
  }

  onPlanClickHandler(selectedPlan) {
    if (selectedPlan.id !== this.state.selectedPlanId) {
      this.setState({
        selectedPlanId: selectedPlan.id
      });
      // Send analytics event
      sendEvents(
        SUBSCRIPTION_PLAN_CATEGORY,
        SUBSCRIPTION_PLAN_SELECTED_ACTION,
        selectedPlan.description
      );
    }
  }

  handleProceedButton() {
    const indexOfSelectedItem = this.props.aSubscriptionPlans.findIndex(ele => {
      return ele.id === this.state.selectedPlanId;
    });
    if (indexOfSelectedItem > -1) {
      const selectedPlan = this.props.aSubscriptionPlans[indexOfSelectedItem];
      this.props.fnUpdateSelectedPlan(selectedPlan);
      // Send analytics event
      sendEvents(
        SUBSCRIPTION_PLAN_CATEGORY,
        SUBSCRIPTION_PROCEED_ACTION,
        selectedPlan.description
      );
    }
    fnNavTo.call(this, `/${this.props.locale}/${PAYMENT_OPERATOR}`);
  }

  render() {
    return (
      <div className="plans-container">
        <div className="plans-container-first" />
        <div className="plans-banner">
          <div className="plans-text">
            <div className="plans-text-heading">
              {oResourceBundle.be_the_first}
            </div>
            <div className="plans-text-subheading">
              <div>{oResourceBundle.watch_all_content}</div>
            </div>
          </div>
          <div className="plans-container-image">
            <img className="plans-image" src={Banner} alt="plans"/>
          </div>
        </div>

        {
          // <div className="plans-info">
          //   <div className="plans-info-box">
          //     <img className="icon-style p5" src={StarIcon} />
          //     <div className="content-color divider">{oResourceBundle.exclusive_content}</div>
          //   </div>
          //   <div className="plans-info-box">
          //     <img className="icon-style" src={LineIcon} />
          //     <div className="content-color divider">{oResourceBundle.no_ads}</div>
          //   </div>
          // </div>
        }
        {
          !this.props.loading && !Array.isArray(this.props.aSubscriptionPlans) ?
          <div className="plans-not-available">
            {/* oResourceBundle.no_plans_available */}
           </div> : 
           <div className="plans-select-heading">
            {oResourceBundle.select_plan}
          </div>
        }
        

        <div className="plans-select-container">
          {Array.isArray(this.props.aSubscriptionPlans) ? (
            this.props.aSubscriptionPlans.map(ele => {
              return ele.code !== 404 ? (
                <React.Fragment key={ele.id}>
                  <div
                    className={[
                      "plan-select",
                      this.state.selectedPlanId === ele.id ? "selected" : ""
                    ].join(" ")}
                    onClick={this.onPlanClickHandler.bind(this, ele)}
                  >
                    <div className="radio-div" />
                    <div>
                      {`${ele.currency} ${ele.price} ${oResourceBundle.for} ${
                        ele.billing_frequency
                      } ${ele.billing_cycle_type}${
                        ele.billing_frequency > 1 ? "S" : ""
                      } - ${ele.title}`}
                    </div>
                  </div>
                </React.Fragment>
              ) : null;
            })
          ) : (
            !this.props.aSubscriptionPlans ? <Spinner /> : null
          )}
        </div>
        <div className="plans-proceed">
          <Button
            className="btn-proceed"
            onClick={() => this.handleProceedButton()}
            disabled={this.state.selectedPlanId ? false : true}
          >
            {oResourceBundle.proceed}
          </Button>
        </div>
      </div>
    );
  }
}

/**

* Component - AdyenGateway
* method that maps state to props.
* @param {Object} state
* state from redux store.
* @return {Object} - state mapped to props
*/

const mapStateToProps = state => {
  return {
    locale: state.locale,
    loading: state.loading,
    sCountryCode: state.sCountryCode,
    aSubscriptionPlans: state.aSubscriptionPlans
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
    fnSubscriptionPlans: (sCountryCode, sLocale, fnSuccess, fnFailed) => {
      dispatch(
        actionTypes.fnSubscriptionPlans(
          sCountryCode,
          sLocale,
          fnSuccess,
          fnFailed
        )
      );
    },
    fnUpdateSelectedPlan: oSelectedPlan => {
      dispatch(actionTypes.fnUpdateSelectedPlan(oSelectedPlan));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plans);
