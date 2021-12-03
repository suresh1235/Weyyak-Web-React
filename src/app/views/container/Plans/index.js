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
import {connect} from "react-redux";
import oResourceBundle from "app/i18n/";
import Spinner from "core/components/Spinner";
import Input from "core/components/Input";
import Button from "core/components/Button";
import * as actionTypes from "app/store/action/";
import * as CONSTANTS from "app/AppConfig/constants";
import {ENABLE_COUPONS, ENABLE_TPAY} from "app/AppConfig/features";
import {sendEvents} from "core/GoogleAnalytics/";
import * as common from "app/utility/common";
import {toast} from "core/components/Toaster/";
import "./index.scss";
// import plansIcon1 from "app/resources/assets/thumbnail/thumbnail_plan_icon1.png";
// import plansIcon2 from "app/resources/assets/thumbnail/thumbnail_plan_icon2.png";
// import plansIcon3 from "app/resources/assets/thumbnail/thumbnail_plan_icon3.png";
import svod1 from "app/resources/assets/thumbnail/svod_1.png";
import svod2 from "app/resources/assets/thumbnail/svod_2.png";
import svod3 from "app/resources/assets/thumbnail/svod_3.png";


class Plans extends BaseContainer {
  state = {
    showAdyen: false,
    showEtisalat: false,
    showTpay: -1,
    showInfo1: false,
    showinfo2:false,
    showinfo3:false,
    showinfo4:false,
    showTelus:false,
    showCoupons: false,
    promoCode: "",
    couponError: true,
    showPayments: false,
    packageId: null,
    isExplore:false,
    arrowStatus: false
  };

  componentDidMount() {
    this.fnScrollToTop();
    common.isUserSubscribed().then(isUserSubscribed => {
      if (isUserSubscribed) {
        common.fnNavTo.call(this, `/${this.props.locale}`, true);
      } else if (this.props.sCountryCode !== "" && !this.bPlansFetched) {
        this.bPlansFetched = true;
        this.props.fnSubscriptionPlans(
          this.props.sCountryCode,
          this.props.locale,
          oReponse => {
            //Success
            if (oReponse.code === 404) {
              common.showToast(
                CONSTANTS.GENERIC_TOAST_ID,
                oResourceBundle.payment_system_error,
                toast.POSITION.BOTTOM_CENTER
              );
            }
          },
          oError => {
            //Failed
            common.showToast(
              CONSTANTS.GENERIC_TOAST_ID,
              oResourceBundle.payment_system_error,
              toast.POSITION.BOTTOM_CENTER
            );
          }
        );
      } else if (this.props.sCountryCode === "" || !this.props.sCountryCode) {
        // common.showToast(
        //   CONSTANTS.GENERIC_TOAST_ID,
        //   oResourceBundle.something_went_wrong,
        //   toast.POSITION.BOTTOM_CENTER
        // );
      }
    });
  }

  componentDidUpdate(prevProps, prevSate) {
    if (this.props.sCountryCode !== "" && !this.bPlansFetched) {
      this.bPlansFetched = true;
      this.props.fnSubscriptionPlans(
        this.props.sCountryCode,
        this.props.locale,
        oReponse => {
          //Success
          if (oReponse.code === 404) {
            common.showToast(
              CONSTANTS.GENERIC_TOAST_ID,
              oResourceBundle.payment_system_error,
              toast.POSITION.BOTTOM_CENTER
            );
          }
        },
        oError => {
          //Failed
          common.showToast(
            CONSTANTS.GENERIC_TOAST_ID,
            oResourceBundle.payment_system_error,
            toast.POSITION.BOTTOM_CENTER
          );
        }
      );
    } else if (
      this.props.locale !== prevProps.locale ||
      this.props.match.params.langcode !== prevProps.match.params.langcode
    ) {
      this.props.fnSubscriptionPlans(
        this.props.sCountryCode,
        this.props.locale,
        oReponse => {
          //Success
          if (oReponse.code === 404) {
            toast.success(oResourceBundle.payment_system_error, {
              position: toast.POSITION.BOTTOM_CENTER
            });
          }
        },
        oError => {
          common.showToast(
            CONSTANTS.MY_SUBSCRIPTION_TOAST_ID,
            oResourceBundle.payment_system_error,
            toast.POSITION.BOTTOM_CENTER
          );
        }
      );
    }
  }

  toggleShowAdyen() {
    this.setState({
      showAdyen: !this.state.showAdyen,
      showEtisalat: false,
      showTpay: -1,
      showCoupons: false
    });
  }

  toggleShowEtisalat() {
    this.setState({
      showAdyen: false,
      showEtisalat: !this.state.showEtisalat,
      showTpay: -1,
      showCoupons: false
    });
  }

  toggleShowTpay(i) {
    this.setState({
      showAdyen: false,
      showEtisalat: false,
      showTpay: this.state.showTpay === i ? -1 : i,
      showCoupons: false
    });
  }

  toggleShowInfo1(){
    this.setState({
      showAdyen: false,
      showEtisalat:false,
      showTpay: -1,
      showInfo1: !this.state.showInfo1,
      showInfo2: false,
      showInfo3: false,
      showInfo4: false,
      showCoupons: false 

    });
  }
  toggleShowInfo2(){
    this.setState({
      showAdyen: false,
      showEtisalat:false,
      showTpay: -1,
      showinfo1:false,
      showInfo2: !this.state.showInfo2,
      showInfo3:false,
      showInfo4:false,
      showCoupons: false 

    });
  }
  toggleShowInfo3(){
    this.setState({
      showAdyen: false,
      showEtisalat:false,
      showTpay: -1,
      showInfo3: !this.state.showInfo3,
      showInfo1:false,
      showInfo2:false,
      showInfo4:false,
      showCoupons: false 

    });
  }
  toggleShowInfo4(){
    this.setState({
      showAdyen: false,
      showEtisalat:false,
      showTpay: -1,
      showInfo4: !this.state.showInfo4,
      showInfo1: false,
      showInfo2: false,
      showInfo3: false,
      showCoupons: false 

    });
  }

  toggleShowTelus(){
    this.setState({
      showAdyen: false,
      showEtisalat:false,
      showTpay: -1,
      showInfo4: false,
      showInfo1: false,
      showInfo2: false,
      showInfo3: false,
      showTelus: !this.state.showTelus,
      showCoupons: false 

    });
  }


  toggleShowPlans=(value)=> {
   this.setState({  showPayments:!this.state.showPayments,
    packageId: value.packageId,
    arrowStatus:!this.state.arrowStatus
  })
  

  }
    // this.setState({
    //   // showAdyen: !this.state.showAdyen,
    //   // showEtisalat: !this.state.showEtisalat,
    //   showTpay: this.state.showTpay === i ? -1 : i
    // });s
  

  ShowvideoList=(id)=>{
    this.props.history.push(`/${this.props.locale}/${CONSTANTS.LIST}/plan=${id.packageId}`);
  }
  
  toggleShowCoupons() {
    this.setState({
      showAdyen: false,
      showEtisalat: false,
      showTpay: -1,
      showCoupons: !this.state.showCoupons
    });
  }

  promoCodeChanged(e) {
    const value = e.target.value;
    this.setState({
      promoCode: value,
      couponError:
        value.length < CONSTANTS.COUPON_MINIMUM_LENGTH ||
        value.length > CONSTANTS.COUPON_MAXIMUM_LENGTH
    });
  }

  applyPromo() {
    if (!this.state.couponError) {
      this.props.couponsVerification(
        this.state.promoCode,
        common.getUserId(),
        this.props.sCountryCode,
        this.props.locale,
        this.couponVerifySuccess.bind(this),
        this.couponVerifyFailure.bind(this)
      );
    }
  }

  couponVerifySuccess(response) {
    try {
      this.props.fnUpdateSelectedPlan(response.response.plan_details[0]);
      const data = {
        channel: CONSTANTS.PAYMENT_PLATFORM,
        countryCode: this.props.sCountryCode,
        email: common.getUserEmail(),
        mobile: common.getUserPhone(),
        subscription_plan_id: response.response.plan_details[0].id,
        user_id: common.getUserId(),
        user_name: common.getUserName(),
        paymentmode:
          response.response.plan_details[0].payment_providers[0].name,
        coupon_code: this.state.promoCode,
        language: this.props.locale
      };
      this.props.couponsRedemption(
        data,
        this.couponRedemptionSuccess.bind(this),
        this.couponRedemptionFailure.bind(this)
      );
    } catch (ex) {
      common.showToast(
        CONSTANTS.MY_SUBSCRIPTION_TOAST_ID,
        oResourceBundle.something_went_wrong,
        toast.POSITION.BOTTOM_CENTER
      );
    }
  }

  couponVerifyFailure(response) {
    let text = oResourceBundle.something_went_wrong;
    try {
      switch (response.data.code) {
        case CONSTANTS.INVALID_COUPON:
          text = oResourceBundle.coupon_invalid;
          break;
        case CONSTANTS.COUPON_LIMIT_EXCEEDED:
          text = oResourceBundle.coupon_limit_exceeded;
          break;
        case CONSTANTS.COUPON_EXPIRED:
          text = oResourceBundle.coupon_expired;
          break;
        case CONSTANTS.COUPON_USED:
          text = oResourceBundle.coupon_already_used;
          break;
        default:
          text = oResourceBundle.something_went_wrong;
      }
    } catch (ex) {}
    common.showToast(
      CONSTANTS.MY_SUBSCRIPTION_TOAST_ID,
      text,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  couponRedemptionSuccess(obj) {
    this.props.fnUpdateTransactionReference(obj);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.COUPONS_SUCCESS}`
    );
  }

  couponRedemptionFailure() {
    common.showToast(
      CONSTANTS.MY_SUBSCRIPTION_TOAST_ID,
      oResourceBundle.something_went_wrong,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  onAdyenPlanClick(selectedPlan) {
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PLAN_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PLAN_SELECTED_ACTION,
      selectedPlan.payment_providers[0].name + ", " + selectedPlan.title
    );
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PAYMENT_METHOD_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PAYMENT_METHOD_ACTION,
      CONSTANTS.PAYMENT_OPERATOR_ADYEN
    );
    this.handlePayBtnClicked(selectedPlan);
  }

  onEtisalatPlanClick(selectedPlan) {
    selectedPlan.isEtisalat = true;
    this.props.fnUpdateSelectedPlan(selectedPlan);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.PAYMENT_ENTER_MOBILE}`
    );
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PLAN_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PLAN_SELECTED_ACTION,
      selectedPlan.payment_providers[0].name + ", " + selectedPlan.title
    );
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PAYMENT_METHOD_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PAYMENT_METHOD_ACTION,
      CONSTANTS.PAYMENT_OPERATOR_ETISALAT
    );
  }

  onTpayPlanClick(selectedPlan) {
    selectedPlan.isTpay = true;
    this.props.fnUpdateSelectedPlan(selectedPlan);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.PAYMENT_ENTER_MOBILE}`
    );
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PLAN_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PLAN_SELECTED_ACTION,
      selectedPlan.payment_providers[0].name + ", " + selectedPlan.title
    );
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PAYMENT_METHOD_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PAYMENT_METHOD_ACTION,
      CONSTANTS.PAYMENT_OPERATOR_TPAY
    );
  }

  onInfoPlanClick(selectedPlan) {
    selectedPlan.isInfo = true;
    this.props.fnUpdateSelectedPlan(selectedPlan);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.PAYMENT_ENTER_MOBILE}`
    );
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PLAN_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PLAN_SELECTED_ACTION,
      selectedPlan.payment_providers[0].name + ", " + selectedPlan.title
    );
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PAYMENT_METHOD_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PAYMENT_METHOD_ACTION,
      CONSTANTS.PAYMENT_OPERATOR_INFO
    );
  }
 
 onTelusPlanClick(selectedPlan) {
    selectedPlan.isTelus = true;
    this.props.fnUpdateSelectedPlan(selectedPlan);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.PAYMENT_ENTER_MOBILE}`
    );
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PLAN_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PLAN_SELECTED_ACTION,
      selectedPlan.payment_providers[0].name + ", " + selectedPlan.title
    );
    sendEvents(
      CONSTANTS.SUBSCRIPTION_PAYMENT_METHOD_CATEGORY,
      CONSTANTS.SUBSCRIPTION_PAYMENT_METHOD_ACTION,
      CONSTANTS.PAYMENT_OPERATOR_TELUS
    );
  }

  /**
   * Component Name - MyAccount
   * Pay button click handler
   * @param {null}
   */
  handlePayBtnClicked(selectedPlan) {
    this.props.startLoader();
    this.props.fnUpdateSelectedPlan(selectedPlan);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.PAYMENT_OPERATOR}`
    );
  }
  

  getPlanRow(plans, clickListener,paymentType) {
    
    return (
      <div className="plans">
        {plans &&
          plans.map((ele, i) => {
            return ele.code !== 404 ? (
              <React.Fragment key={ele.id}>  
                  {/* {JSON.stringify(ele)}  */}
                         {/* {paymentType} */}
                {ele.payment_providers.map((ele1,j) => {
                  return ele1.slug  == paymentType?(
                      <div
                      className="plan-row"
                      onClick={clickListener.bind(this, ele)}
                    >
                      <div className="radio-div" />
                      <div className="plan-name pound_english">
                       {ele.title} {oResourceBundle.colon} {ele.currency=="GBP"?<span>&#163;</span>:ele.currency=="CAD"?<span>&#x24;</span>:ele.currency}{" "}
                       {ele.price}
                      </div>
                    <div className="plan-name pound_arabic">
                      {ele.title} {oResourceBundle.colon} {ele.price} {ele.currency=="GBP"?<span>&#163;</span>:ele.currency=="CAD"?<span>&#x24;</span>:ele.currency}{" "}
                    
                    </div>
   
                      <div className="trial_period">
                        {oResourceBundle.trial_period} {ele.no_of_free_trial_days}{" "}
                        {ele.no_of_free_trial_days > 1
                          ? oResourceBundle.days
                          : oResourceBundle.day}
                      </div>
                      {i !== 0 && <div className="plans-separator" />}
                    </div>

                ):('')})}
              
              </React.Fragment>
            ) : null;
          })}
      </div>
    );  
  }

  render() {
    let adyenPlans = [];
    let etisalatPlans = [];
    let tPayPlans = [];
    let infoPlan1 = [];
    let infoPlan2 = [];
    let infoPlan3 = [];
    let infoPlan4 = [];
    let telusPlan = [];

    if (
      this.props.aSubscriptionPlans &&
      this.props.aSubscriptionPlans.length > 0
    )
     {
      for (let packages of this.props.aSubscriptionPlans) {
        for (let plans of packages.plans) {
          for (let paymentProvider of plans.payment_providers) {          
            if (paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_ADYEN) {             
              adyenPlans.push(plans);
            } else if (
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_ETISALAT 
              && this.props.sCountryCode === CONSTANTS.ETISALAT_COUNTRY_CODE
            ) {
              etisalatPlans.push(plans);          
            }
            else if (            
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_INFO &&
              this.props.sCountryCode === CONSTANTS.INFO_COUNTRY_CODE
            )
            {
              infoPlan1.push(plans);            
            }
           else if (            
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_O2 &&
              this.props.sCountryCode === CONSTANTS.INFO_COUNTRY_CODE
            )
            {
              infoPlan2.push(plans);
              
            }
          else if (            
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_THREE &&
              this.props.sCountryCode === CONSTANTS.INFO_COUNTRY_CODE
            )
            {
              infoPlan3.push(plans);
            }
          else if (            
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_INFO_VODAFONE &&
              this.props.sCountryCode === CONSTANTS.INFO_COUNTRY_CODE
            )
            {
              infoPlan4.push(plans);
            }
          else if(
            paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_TELUS &&
            this.props.sCountryCode === CONSTANTS.TELUS_COUNTRY_CODE
          )
          {
            telusPlan.push(plans)
          }
  
          else if (
              common.isTpay(paymentProvider.name, this.props.sCountryCode) &&
              ENABLE_TPAY
            ) {
              let plansData = {};
              const index = tPayPlans.findIndex(
                ele => ele.paymentProvider === paymentProvider.name
              );
              if (index === -1) {
                plansData.paymentProvider = paymentProvider.name;
                plansData.plans = [];
                tPayPlans.push(plansData);
              } else {
                plansData = tPayPlans[index];
              }
              plansData.plans.push(plans);
            }
          
          }
        }
      }
      }

      return (
        <div className="plans-container">
          {this.props.loading && <Spinner />}
          <div className="icons-list">
          <div className="no-ads container">
            <div className="icon" />
            <div className="text">{oResourceBundle.no_ads}</div>
          </div>
          <div className="smart-tv container">
            <div className="icon" />
            <div className="text">{oResourceBundle.smart_tv}</div>
          </div>
          <div className="exclusive-content container">
            <div className="icon" />
            <div className="text">{oResourceBundle.exclusive_content}</div>
          </div>
          <div className="hd-content container">
            <div className="icon" />
            <div className="text">{oResourceBundle.hd_content}</div>
          </div>
        </div>
          <div className="plans_content">
            <div className="plans_title">{oResourceBundle.select_your_plan1}</div>
          <div className="cards-container">
          {ENABLE_COUPONS && (
              <div className="coupon-container">
                <div className="coupon-input-outer-container">
                  <div className="coupon-input-container">
                    <div className="have-promo">{oResourceBundle.have_promo}</div>
                    <Input
                      className="coupon-input"
                      placeholder=""
                      value={this.state.promoCode}
                      onChange={this.promoCodeChanged.bind(this)}
                    />
                    <Button
                      className={
                        "apply-button" +
                        (!this.state.couponError ? " enabled" : "")
                      }
                      onClick={this.applyPromo.bind(this)}
                    >
                      {oResourceBundle.apply}
                    </Button>
                  </div>
                  {false && this.state.couponError ? (
                    this.state.promoCode.length > 0 ? (
                      <div className="coupon-error">
                        {oResourceBundle.coupon_invalid}
                      </div>
                    ) : null
                  ) : null}
                </div>
              </div>
            )}
          </div>
                  {this.props.aSubscriptionPlans.map((item,i)=>{                  
            return(
            <ul className={this.props.locale==='ar'? "svod_ul svod_ul_ar ":"svod_ul"}>           
              <div>
               <li>
                <div className="li_flex">
                  <div className="left_svod">
                  <span className="svod_text">{item.package_name}</span><br/>
                  <span className="marT15">{item.package_description}</span>
                  </div>
                  <div className="right_svod">
                    <span className="displblock_ar">{oResourceBundle.starting_from}</span>
                    <span>{item.basic_price}</span>

                    <span className="for_english">{item.currency}</span>
                    <span className="for_arabic">{item.currency}</span>   

                    <div className="explore_btn">
                      <button onClick={()=>this.ShowvideoList({packageId:item.package_id})}>{oResourceBundle.explore}</button>
                    </div>
                  </div>
                </div>
                <div></div>
                <button onClick={()=>this.toggleShowPlans({packageId:item.package_id})} className="arrow_down1" >
                  <div className={(this.state.arrowStatus)?"arrow_top" :"arrow_down"} id={"arrows"+item.package_id}></div>
                </button>
                {/* (this.state.showTpay === i ? " open" : "") */}
                {this.state.showPayments && this.state.packageId ===  item.package_id && (<div className="cards-container">
                <div className="plans-header brder">
                  {oResourceBundle.select_your_plan}:
                  </div>
            {adyenPlans.length > 0 && (
               
              <div className="adyen-container">
              
                <div
                  className={
                    "plans-header" + (this.state.showAdyen ? " open" : "")
                  }
                  onClick={this.toggleShowAdyen.bind(this)}
                >
                  <div className="text">{oResourceBundle.credit_card}</div>
                  <div className="arrow" />
                  <div className="image1" />
                  <div className="image2" />
                </div>
                {this.state.showAdyen &&
                  this.getPlanRow(item.plans, this.onAdyenPlanClick,'adyen')}
              </div>
            )}
          {infoPlan1.length > 0 && (
            <div className="info-container">
              <div
                className={
                  "plans-header" + (this.state.showInfo1 ? " open" : "")
                }
                onClick={this.toggleShowInfo1.bind(this)}
              >
                <div className="image1" />
                <div className="arrow" />
              </div>
              {this.state.showInfo1 &&
                this.getPlanRow(infoPlan1, this.onInfoPlanClick,"ee")}
            </div>
          )}

          {infoPlan2.length > 0 && (
            <div className="info-container">
              <div
                className={
                  "plans-header" + (this.state.showInfo2 ? " open" : "")
                }
                onClick={this.toggleShowInfo2.bind(this)}
              >
                <div className="image2" />
                <div className="arrow" />
              </div>
              {this.state.showInfo2 &&
                this.getPlanRow(infoPlan2, this.onInfoPlanClick,"o2")}
            </div>
          )}

          {infoPlan3.length > 0 && (
            <div className="info-container">
              <div
                className={
                  "plans-header" + (this.state.showInfo3 ? " open" : "")
                }
                onClick={this.toggleShowInfo3.bind(this)}
              >
                <div className="image3" />
                <div className="arrow" />
              </div>
              {this.state.showInfo3 &&
                this.getPlanRow(infoPlan3, this.onInfoPlanClick,"three")}
            </div>
          )}

          {infoPlan4.length > 0 && (
            <div className="info-container">
              <div
                className={
                  "plans-header" + (this.state.showInfo4 ? " open" : "")
                }
                onClick={this.toggleShowInfo4.bind(this)}
              >
                <div className="image4" />
                <div className="arrow" />
              </div>
              {this.state.showInfo4 &&
                this.getPlanRow(infoPlan4, this.onInfoPlanClick, "info_vodafone")}
            </div>
          )}
          {telusPlan.length > 0 && (
            <div className="telus-container">
              <div
                className={
                  "plans-header" + (this.state.showTelus ? " open" : "")
                }
                onClick={this.toggleShowTelus.bind(this)}
              >
                <div className="image1" />
                <div className="arrow" />
              </div>
              {this.state.showTelus &&
                this.getPlanRow(telusPlan, this.onTelusPlanClick, "telus")}
            </div>
          )}

           {etisalatPlans.length > 0 ? (
              <div className="etisalat-container">
                <div
                  className={
                    "plans-header" + (this.state.showEtisalat ? " open" : "")
                  }
                  onClick={this.toggleShowEtisalat.bind(this)}
                >
                  <div className="image1" />
                  <div className="arrow" />
                </div>
                {this.state.showEtisalat &&
                  this.getPlanRow(item.plans, this.onEtisalatPlanClick,'etisalat')}
              </div>
        ):'' }
             {ENABLE_TPAY &&
              tPayPlans.length > 0 &&
              tPayPlans.map((ele, i) => {
                return (                        
                  <div key={i} className="tpay-container">
                    <div
                      className={
                        "plans-header " +
                        "tpay-" +
                        ele.plans[0].payment_providers[0].name
                          .replace(/ /g, "-") +
                        (this.state.showTpay === i ? " open" : "")
                      }
                      onClick={this.toggleShowTpay.bind(this, i)}
                    >
                      <div className="image1" />
                      <div className="arrow" />
                    </div>
                   
                    {this.state.showTpay === i?(this.getPlanRow(ele.plans, this.onTpayPlanClick, ele.plans[0].payment_providers[0].slug)):''}
                  </div>
                );
              })}   
          </div>) } 
          
              </li>
              </div>
            
            </ul>
            )})}
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
      },
      startLoader: () => {
        dispatch(actionTypes.startLoader());
      },
      stopLoader: () => {
        dispatch(actionTypes.stopLoader());
      },
      fnInitiatePaymentSession: (oPayLoad, fnSuccess, fnFailed) => {
        dispatch(
          actionTypes.fnInitiatePaymentSession(oPayLoad, fnSuccess, fnFailed)
        );
      },
      fnUpdatePaymentUserDetails: oPaymentUserDetails => {
        dispatch(actionTypes.fnUpdatePaymentUserDetails(oPaymentUserDetails));
      },
      couponsRedemption: (data, fnSuccess, fnError) => {
        dispatch(actionTypes.couponsRedemption(data, fnSuccess, fnError));
      },
      fnUpdateTransactionReference: data => {
        dispatch(actionTypes.fnUpdateTransactionReference(data));
      },
      couponsVerification: (
        couponCode,
        userId,
        countryCode,
        language,
        fnSuccess,
        fnError
      ) => {
        dispatch(
          actionTypes.couponsVerification(
            couponCode,
            userId,
            countryCode,
            language,
            fnSuccess,
            fnError
          )
        );
      }
    };
  };

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Plans);
