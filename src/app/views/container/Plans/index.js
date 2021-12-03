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
import oResourceBundle from "app/i18n/";
import Spinner from "core/components/Spinner";
import Input from "core/components/Input";
import Button from "core/components/Button";
import * as actionTypes from "app/store/action/";
import * as CONSTANTS from "app/AppConfig/constants";
import { ENABLE_COUPONS, ENABLE_TPAY } from "app/AppConfig/features";
import { sendEvents } from "core/GoogleAnalytics/";
import { CleverTap_CustomEvents, CleverTap_UserEvents} from 'core/CleverTap'
import * as common from "app/utility/common";
import { toast } from "core/components/Toaster/";
import "./index.scss";
import { isMobile } from "react-device-detect";
import RightTick from "../../../resources/assets/yes.png"
import ReactHtmlParser from 'react-html-parser';


// import plansIcon1 from "app/resources/assets/thumbnail/thumbnail_plan_icon1.png";
// import plansIcon2 from "app/resources/assets/thumbnail/thumbnail_plan_icon2.png";
// import plansIcon3 from "app/resources/assets/thumbnail/thumbnail_plan_icon3.png";
import svod1 from "app/resources/assets/thumbnail/svod_1.png";
import svod2 from "app/resources/assets/thumbnail/svod_2.png";
import svod3 from "app/resources/assets/thumbnail/svod_3.png";


class Plans extends BaseContainer {
  state = {
    showAdyen: true,
    showEtisalat: false,
    showZain: false,
    showTpay: -1,
    showInfo1: false,
    showinfo2: false,
    showinfo3: false,
    showinfo4: false,
    showTelus: false,
    showCoupons: false,
    promoCode: "",
    couponError: true,
    showPayments: true,
    packageId: null,
    isExplore: false,
    arrowStatus: false,
    confirmation_message: "",
    EncodedPromoCode: "",
    discount: "",
    couponCodeApplied: false
  };

  componentDidMount() {

    CleverTap_CustomEvents("subscription_page_visited")

    let couponCode = localStorage.getItem('Ramadan')
    let country = localStorage.getItem('country')

    if (couponCode) {

      this.setState({
        promoCode: couponCode,
        couponError: false
      })

      this.props.couponsVerification(
        couponCode,
        common.getUserId(),
        country,
        this.props.locale,
        this.couponVerifySuccess.bind(this),
        this.couponVerifyFailure.bind(this)
      );

    }

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
      // this.props.fnSubscriptionPlans(
      //   this.props.sCountryCode,
      //   this.props.locale,
      //   oReponse => {
      //     //Success
      //     if (oReponse.code === 404) {
      //       toast.success(oResourceBundle.payment_system_error, {
      //         position: toast.POSITION.BOTTOM_CENTER
      //       });
      //     }
      //   },
      //   oError => {
      //     common.showToast(
      //       CONSTANTS.MY_SUBSCRIPTION_TOAST_ID,
      //       oResourceBundle.payment_system_error,
      //       toast.POSITION.BOTTOM_CENTER
      //     );
      //   }
      // );
      if (this.state.EncodedPromoCode) {
        this.applyPromo()
      }
      else {
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
          },
          this.state.EncodedPromoCode,
          common.getUserId()
        );

      }
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

  toggleShowZain() {
    this.setState({
      showAdyen: false,
      showZain: !this.state.showZain,
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

  toggleShowInfo1() {
    this.setState({
      showAdyen: false,
      showEtisalat: false,
      showTpay: -1,
      showInfo1: !this.state.showInfo1,
      showInfo2: false,
      showInfo3: false,
      showInfo4: false,
      showCoupons: false

    });
  }
  toggleShowInfo2() {
    this.setState({
      showAdyen: false,
      showEtisalat: false,
      showTpay: -1,
      showinfo1: false,
      showInfo2: !this.state.showInfo2,
      showInfo3: false,
      showInfo4: false,
      showCoupons: false

    });
  }
  toggleShowInfo3() {
    this.setState({
      showAdyen: false,
      showEtisalat: false,
      showTpay: -1,
      showInfo3: !this.state.showInfo3,
      showInfo1: false,
      showInfo2: false,
      showInfo4: false,
      showCoupons: false

    });
  }
  toggleShowInfo4() {
    this.setState({
      showAdyen: false,
      showEtisalat: false,
      showTpay: -1,
      showInfo4: !this.state.showInfo4,
      showInfo1: false,
      showInfo2: false,
      showInfo3: false,
      showCoupons: false

    });
  }

  toggleShowTelus() {
    this.setState({
      showAdyen: false,
      showEtisalat: false,
      showTpay: -1,
      showInfo4: false,
      showInfo1: false,
      showInfo2: false,
      showInfo3: false,
      showTelus: !this.state.showTelus,
      showCoupons: false

    });
  }


  toggleShowPlans = (value) => {
    this.setState({
      showPayments: !this.state.showPayments,
      packageId: value.packageId,
      arrowStatus: !this.state.arrowStatus
    })


  }
  // this.setState({
  //   // showAdyen: !this.state.showAdyen,
  //   // showEtisalat: !this.state.showEtisalat,
  //   showTpay: this.state.showTpay === i ? -1 : i
  // });s


  ShowvideoList = (id) => {
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
      couponCodeApplied: false,
      promoCode: value,
      couponError:
        value.length < CONSTANTS.COUPON_MINIMUM_LENGTH ||
        value.length > CONSTANTS.COUPON_MAXIMUM_LENGTH
    });
    if (value == "") {
      // this.applyPromo()
      this.setState({
        EncodedPromoCode: "",
        confirmation_message: ""
      })

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
        },
      );
    }
  }

  applyPromo() {
    if (!this.state.couponError) {
      let EncodedPromoCode = encodeURIComponent(this.state.promoCode)
      this.props.couponsVerification(
        EncodedPromoCode,
        common.getUserId(),
        this.props.sCountryCode,
        this.props.locale,
        this.couponVerifySuccess.bind(this),
        this.couponVerifyFailure.bind(this)
      );
    }
  }

  couponVerifySuccess(response) {
    this.setState({
      couponCodeApplied: true
    })

    if (response.response.coupon_type_id === 3) {
      var discount = response.response.plan_details[0].discount
      let EncodedPromoCode = encodeURIComponent(this.state.promoCode)
      let confirmationmessage = oResourceBundle.discount_coupons_confirmation_message
      confirmationmessage.replace("weyyak40", EncodedPromoCode)
      confirmationmessage.replace("50", discount)
      this.setState({ confirmation_message: response.discount_coupon_message, EncodedPromoCode: EncodedPromoCode, discount: discount })
      // console.log('in')
      // console.log(discount)
      this.fnScrollToTop();
      common.isUserSubscribed().then(isUserSubscribed => {
        if (isUserSubscribed) {
          common.fnNavTo.call(this, `/${this.props.locale}`, true);
        } else if (this.props.sCountryCode !== "") {

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
            },
            EncodedPromoCode,
            common.getUserId()
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
    else {
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
    // try {
    //   this.props.fnUpdateSelectedPlan(response.response.plan_details[0]);
    //   const data = {
    //     channel: CONSTANTS.PAYMENT_PLATFORM,
    //     countryCode: this.props.sCountryCode,
    //     email: common.getUserEmail(),
    //     mobile: common.getUserPhone(),
    //     subscription_plan_id: response.response.plan_details[0].id,
    //     user_id: common.getUserId(),
    //     user_name: common.getUserName(),
    //     paymentmode:
    //       response.response.plan_details[0].payment_providers[0].name,
    //     coupon_code: this.state.promoCode,
    //     language: this.props.locale
    //   };
    //   this.props.couponsRedemption(
    //     data,
    //     this.couponRedemptionSuccess.bind(this),
    //     this.couponRedemptionFailure.bind(this)
    //   );
    // } catch (ex) {
    //   common.showToast(
    //     CONSTANTS.MY_SUBSCRIPTION_TOAST_ID,
    //     oResourceBundle.something_went_wrong,
    //     toast.POSITION.BOTTOM_CENTER
    //   );
    // }
  }

  couponVerifyFailure(response) {

    this.setState({
      confirmation_message: "",
      EncodedPromoCode: ""
    })

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

    let text = oResourceBundle.something_went_wrong;
    try {
      switch (response.code || response.error_code) {
        case CONSTANTS.INVALID_COUPON:
          text = response.message;
          // text = oResourceBundle.coupon_invalid;
          break;
        case CONSTANTS.COUPON_LIMIT_EXCEEDED:
          text = response.message;
          // text = oResourceBundle.coupon_limit_exceeded;
          break;
        case CONSTANTS.INVALID_DISCOUNT_COUPON:
          text = response.error_msg;
          // text = oResourceBundle.coupon_limit_exceeded;
          break;
        case CONSTANTS.COUPON_EXPIRED:
          text = response.message;
          // text = oResourceBundle.coupon_expired;
          break;
        case CONSTANTS.COUPON_USED:
          text = response.message;
          // text = oResourceBundle.coupon_already_used;
          break;
        case CONSTANTS.VOUCHER_NEW_SUBSCRIBER:
          text = response.message;
          // text = oResourceBundle.voucher_new_subscribers;
          break;
        case CONSTANTS.VOUCHER_EXISTING_USER:
          text = response.message;
          // text = oResourceBundle.voucher_existing_subscribers;
          break;
        case CONSTANTS.VOUCHER_INVALID_COUNTRY:
          text = response.message;
          // text = oResourceBundle.voucher_available_country;
          break;
        case CONSTANTS.VOUCHER_INVALID_PLATFORM:
          text = response.message;
          // text = oResourceBundle.voucher_platform;
          break;
        case CONSTANTS.ERROR_CODE_INAPP_ACTIVE:
          text = oResourceBundle.inapp_error;
          break;
        default:
          text = response.message;
      }
    } catch (ex) { }
    common.showToast(
      CONSTANTS.MY_SUBSCRIPTION_TOAST_ID,
      text,
      toast.POSITION.BOTTOM_CENTER
    );

    CleverTap_CustomEvents("couponcode_redeem", {
      "redemption status": false
    })

  }

  couponRedemptionSuccess(obj) {

    CleverTap_CustomEvents("couponcode_redeem", {
      "redemption status": true
    })

    let userData = {}
    userData.userId = common.getUserId()
    userData.subType = "Coupon_Subscribed_User"
    CleverTap_UserEvents("ProfileEvent", userData)

    this.props.fnUpdateTransactionReference(obj);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.COUPONS_SUCCESS}`
    );
  }

  couponRedemptionFailure() {

    CleverTap_CustomEvents("couponcode_redeem", {
      "redemption status": false
    })

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

    CleverTap_CustomEvents("subscription_pack_chosen", {
      "pack_type": `ADYEN-${selectedPlan.title}`
    })
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

    CleverTap_CustomEvents("subscription_pack_chosen", {
      "pack_type": `Etisalat-${selectedPlan.title}`
    })
  }

  onZainPlanClick(selectedPlan) {
    selectedPlan.is_MW_Zain = true;
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
      CONSTANTS.PAYMENT_OPERATOR_MW_ZAIN
    );

    CleverTap_CustomEvents("subscription_pack_chosen", {
      "pack_type": `Zain-${selectedPlan.title}`
    })
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

    CleverTap_CustomEvents("subscription_pack_chosen", {
      "pack_type": `Tpay-${selectedPlan.title}`
    })
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

    CleverTap_CustomEvents("subscription_pack_chosen", {
      "pack_type": `onInfo-${selectedPlan.title}`
    })
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

    CleverTap_CustomEvents("subscription_pack_chosen", {
      "pack_type": `Telus-${selectedPlan.title}`
    })
  }

  /**
   * Component Name - MyAccount
   * Pay button click handler
   * @param {null}
   */
  handlePayBtnClicked(selectedPlan) {
    if (this.state.EncodedPromoCode) {
      selectedPlan.discount_coupon = this.state.EncodedPromoCode
    }
    this.props.startLoader();
    this.props.fnUpdateSelectedPlan(selectedPlan);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.PAYMENT_OPERATOR}`
    );
  }


  getPlanRow(plans, clickListener, paymentType) {

    return (
      <div className="plans">
        {plans &&
          plans.map((ele, i) => {
            return ele.code !== 404 ? (
              <React.Fragment key={ele.id}>
                {/* {JSON.stringify(ele)}  */}
                {/* {paymentType} */}
                {ele.payment_providers.map((ele1, j) => {
                  return ele1.slug == paymentType ? (
                    <div
                      className="plan-row"
                      onClick={clickListener.bind(this, ele)}
                    >
                      <div className="radio-div" />
                      <div className="plan-name pound_english">
                        {/* {ele.title} {oResourceBundle.colon}
                        {ele.payment_providers[0].name == "Adyen" && ele.billing_frequency == 365 ?
                          <s>{ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ?
                            <span>&#x24;</span> : ele.currency}{" "}{(ele.price * 2).toFixed(2)}</s> : ""}{" "}
                        {ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ? <span>&#x24;</span> : ele.currency}{" "} {ele.price} */}
                        {ele.title} {oResourceBundle.colon}

                        {ele.payment_providers[0].name == "Adyen" && this.state.EncodedPromoCode && ele.discout_price != 0 ?
                          <s>{ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ?
                            <span>&#x24;</span> : ele.currency}{" "}{(ele.price)}</s> : ""}{" "}
                        {ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ? <span>&#x24;</span> : ele.currency}{" "} {ele.final_price}

                      </div>
                      <div className="plan-name pound_arabic">
                        {/* {ele.title} {oResourceBundle.colon}
                        {ele.payment_providers[0].name == "Adyen" && ele.billing_frequency == 365 ?
                          <s>{(ele.price * 2).toFixed(2)}{ele.currency == "GBP" ?
                            <span>&#163;</span> : ele.currency == "CAD" ?
                              <span>&#x24;</span> : ele.currency}</s> : ""}{" "}
                        {ele.price}
                        {ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ? <span>&#x24;</span> : ele.currency}{" "} */}
                        {ele.title} {oResourceBundle.colon}
                        {ele.payment_providers[0].name == "Adyen" && this.state.EncodedPromoCode && ele.discout_price != 0 ?
                          <s>{ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ?
                            <span>&#x24;</span> : ele.currency}{" "}{(ele.price)}</s> : ""}{" "}
                        {ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ? <span>&#x24;</span> : ele.currency}{" "} {ele.final_price}

                      </div>

                      <div className="trial_period">
                        {oResourceBundle.trial_period} {ele.no_of_free_trial_days}{" "}
                        {ele.no_of_free_trial_days > 1
                          ? oResourceBundle.days
                          : oResourceBundle.day}
                      </div>
                      {i !== 0 && <div className="plans-separator" />}
                    </div>

                  ) : ('')
                })}

              </React.Fragment>
            ) : null;
          })}
      </div>
    );
  }

  getAdyentPlanRow(plans, clickListener, paymentType) {
    plans.sort(function (a, b) { return b.billing_frequency - a.billing_frequency })
    return (
      <div className="plans">
        {plans &&
          plans.map((ele, i) => {
            return ele.code !== 404 ? (
              <React.Fragment key={ele.id}>
                {/* {JSON.stringify(ele)}  */}
                {/* {paymentType} */}
                {ele.payment_providers.map((ele1, j) => {
                  return ele1.slug == paymentType ? (
                    <div
                      className={ele.billing_frequency == 365 ? "plan-row-yearly" : "plan-row"}
                      onClick={clickListener.bind(this, ele)}
                    > {
                        ele.billing_frequency == 365 ?
                          <div className={ele.billing_frequency == 365 && this.state.EncodedPromoCode ? "radio-div-selected" : "radio-div "}>&#10004;</div>
                          :
                          <div className={ele.billing_frequency == 365 && this.state.EncodedPromoCode ? "radio-div-selected" : "radio-div "}></div>
                      }
                      <div className="plan-name pound_english">
                        {ele.title} {oResourceBundle.colon}
                        {ele.title == "Yearly Plan" ? "" : ele.payment_providers[0].name == "Adyen" && this.state.EncodedPromoCode && ele.discout_price != 0 ?
                          <s>{ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ?
                            <span>&#x24;</span> : ele.currency}{" "}{(ele.price)}</s> : ""}{" "}
                        {/* {ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ? <span>&#x24;</span> : ele.currency}{" "} {ele.final_price}  */}
                        {/* isMobile ? ReactHtmlParser("&#36;") : */}
                        {ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ? <span>&#x24;</span> : (isMobile && ele.billing_frequency == 365) ? "" : ele.currency}{" "} {(isMobile && ele.billing_frequency == 365) ? "" : ele.title == "Yearly Plan" ? ele.price : ele.final_price}

                      </div>
                      <div className="plan-name pound_arabic">
                        {ele.title} {oResourceBundle.colon}
                        {ele.title == "الباقة السنوية" ? "" : ele.payment_providers[0].name == "Adyen" && this.state.EncodedPromoCode && ele.discout_price != 0 ?
                          <s>{ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ?
                            <span>&#x24;</span> : ele.currency}{" "}{(ele.price)}</s> : ""}{" "}
                        {ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ? <span>&#x24;</span> : (isMobile && ele.billing_frequency == 365) ? "" : ele.currency}{" "} {(isMobile && ele.billing_frequency == 365) ? "" : ele.title == "الباقة السنوية" ? ele.price : ele.final_price}

                      </div>

                      {
                        ele.billing_frequency !== 365 ? ele.no_of_free_trial_days ? <div className="trial_period">
                          {oResourceBundle.trial_period} {ele.no_of_free_trial_days}{" "}
                          {ele.no_of_free_trial_days > 1
                            ? oResourceBundle.days
                            : oResourceBundle.day}
                        </div> : " " :
                          <div className="plan-ribbon">
                            {ele.payment_providers[0].name == "Adyen" && this.state.EncodedPromoCode && ele.discout_price != 0 ?
                              <>{ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ?
                                <span>&#x24;</span> : ele.currency}{" "} <s>{(ele.price)}</s></> : ""}{ele.discout_price == 0 ? " " : " - "}
                            {ele.currency == "GBP" ? <span>&#163;</span> : ele.currency == "CAD" ? <span>&#x24;</span> : ele.discout_price == 0 ? ele.currency : ""}{" "} <b className="price">{ele.final_price}</b>
                          </div>
                      }

                      {/* {i !== 0 && <div className="plans-separator" />} */}
                    </div>

                  ) : ('')
                })}

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
    let mw_zain = []

    if (
      this.props.aSubscriptionPlans &&
      this.props.aSubscriptionPlans.length > 0
    ) {
      for (let packages of this.props.aSubscriptionPlans) {
        for (let plans of packages.plans) {
          for (let paymentProvider of plans.payment_providers) {
            if (paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_ADYEN) {
              adyenPlans.push(plans);
            } else if (
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_MW_ZAIN) {
              mw_zain.push(plans)
            } else if (
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_ETISALAT
              && this.props.sCountryCode === CONSTANTS.ETISALAT_COUNTRY_CODE
            ) {
              etisalatPlans.push(plans);
            }
            else if (
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_INFO &&
              this.props.sCountryCode === CONSTANTS.INFO_COUNTRY_CODE
            ) {
              infoPlan1.push(plans);
            }
            else if (
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_O2 &&
              this.props.sCountryCode === CONSTANTS.INFO_COUNTRY_CODE
            ) {
              infoPlan2.push(plans);

            }
            else if (
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_THREE &&
              this.props.sCountryCode === CONSTANTS.INFO_COUNTRY_CODE
            ) {
              infoPlan3.push(plans);
            }
            else if (
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_INFO_VODAFONE &&
              this.props.sCountryCode === CONSTANTS.INFO_COUNTRY_CODE
            ) {
              infoPlan4.push(plans);
            }
            else if (
              paymentProvider.name === CONSTANTS.PAYMENT_OPERATOR_TELUS &&
              this.props.sCountryCode === CONSTANTS.TELUS_COUNTRY_CODE
            ) {
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
                  <div >
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
                    <div class="confirm-msg">{this.state.confirmation_message ? this.state.confirmation_message : ""}</div>
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
          {this.props.aSubscriptionPlans.map((item, i) => {
            return (
              <ul className={this.props.locale === 'ar' ? "svod_ul svod_ul_ar " : "svod_ul"}>
                <div>
                  <li>
                    <div className="li_flex">
                      <div className="left_svod">
                        <span className="svod_text">{item.package_name}</span><br />
                        <span className="marT15">{item.package_description}</span>
                      </div>
                      <div className="right_svod">
                        <span className="displblock_ar">{oResourceBundle.starting_from}</span>
                        <span className="price_arebic" >{item.basic_price}</span>

                        <span className="for_english">{item.currency}</span>
                        <span className="for_arabic">{item.currency}</span>
                        <div className="explore_btn">
                          <button onClick={() => this.ShowvideoList({ packageId: item.package_id })}>{oResourceBundle.explore}</button>
                        </div>
                      </div>
                    </div>
                    <div></div>
                    <button onClick={() => this.toggleShowPlans({ packageId: item.package_id })} className="arrow_down1" >
                      <div className={(this.state.arrowStatus) ? "arrow_top" : "arrow_down"} id={"arrows" + item.package_id}></div>
                    </button>
                    {/* (this.state.showTpay === i ? " open" : "") */}
                    {/* {this.state.showPayments && this.state.packageId === item.package_id && (<div className="cards-container"> */}
                    {this.state.showPayments && (<div className="cards-container">
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
                            <div>
                              <div className="arrow" />
                              <div className="image1" />
                              <div className="image2" />
                            </div>
                          </div>
                          {/* {this.state.showAdyen && ### && this.state.couponCodeApplied
                            this.getAdyentPlanRow(item.plans, this.onAdyenPlanClick, 'adyen')} */}
                          {/* {this.state.showAdyen && this.state.promoCode && (this.state.confirmation_message || this.state.couponCodeApplied) ?
                            this.getAdyentPlanRow(item.plans, this.onAdyenPlanClick, 'adyen')
                            : this.state.showAdyen ? this.getPlanRow(item.plans, this.onAdyenPlanClick, 'adyen') : ""} */}

                          {this.state.showAdyen &&
                            this.getPlanRow(item.plans, this.onAdyenPlanClick, 'adyen')}
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
                            this.getPlanRow(infoPlan1, this.onInfoPlanClick, "ee")}
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
                            this.getPlanRow(infoPlan2, this.onInfoPlanClick, "o2")}
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
                            this.getPlanRow(infoPlan3, this.onInfoPlanClick, "three")}
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
                            this.getPlanRow(item.plans, this.onEtisalatPlanClick, 'etisalat')}
                        </div>
                      ) : ''}
                      {mw_zain.length > 0 ? (
                        <div className="zain-container">
                          <div
                            className={
                              "plans-header" + (this.state.showZain ? " open" : "")
                            }
                            onClick={this.toggleShowZain.bind(this)}
                          >
                            <div className="image1" />
                            <div className="arrow" />
                          </div>
                          {this.state.showZain &&
                            this.getPlanRow(item.plans, this.onZainPlanClick, 'mw_zain')}
                        </div>
                      ) : ''}

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

                              {this.state.showTpay === i ? (this.getPlanRow(ele.plans, this.onTpayPlanClick, ele.plans[0].payment_providers[0].slug)) : ''}
                            </div>
                          );
                        })}
                    </div>)}

                  </li>
                </div>

              </ul>
            )
          })}
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
    fnSubscriptionPlans: (sCountryCode, sLocale, fnSuccess, fnFailed, couponCode, user_id) => {
      dispatch(
        actionTypes.fnSubscriptionPlans(
          sCountryCode,
          sLocale,
          fnSuccess,
          fnFailed,
          couponCode,
          user_id
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
