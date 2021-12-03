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
import { Route, Switch, Redirect } from "react-router-dom";
import * as routeNames from "app/Routes/RouteNames";
import oResourceBundle from "app/i18n/";

import HomePage from "app/views/container/Home/";
import Login from "app/views/container/Login/";
import SignUp from "app/views/container/SignUp/";
import TwitterToken from "app/views/container/Twitter/TwitterToken/";
import AppleToken from "app/views/container/AppleLogin/index";
import ForgotPassword from "app/views/container/ForgotPassword/";
import ForgotPasswordSuccess from "app/views/container/ForgotPasswordSuccess/";
import ResetPasswordSuccess from "app/views/container/ResetPasswordSuccess";
import EmailResetPassword from "app/views/container/EmailResetPassword";
import ForgotPasswordMobile from "app/views/container/ForgotPasswordMobile/";
import ResetPasswordMobile from "app/views/container/ResetPasswordMobile";
import EmailVerification from "app/views/container/EmailVerification/";
import EmailVerificationCheck from "app/views/container/EmailVerificationCheck";
import MobileVerification from "app/views/container/MobileVerification/";
import MobileVerificationSuccess from "app/views/container/MobileVerificationSuccess";
import MobileVerificationFail from "app/views/container/MobileVerificationFail";
import VideoContent from "app/views/container/VideoContent/";
import VideoContentPage from "app/views/container/VideoContentNewPage";
// import NotFoundPage from "app/views/container/NotFoundPage/";
import Player from "app/views/container/Player/";
import PlayerTrailer from "app/views/container/PlayerTrailer/";
import UserSearchList from "app/views/container/UserSearchList";
import MyAccount from "app/views/container/MyAccount";
import Settings from "app/views/container/Settings";
import MyActivity from "app/views/container/MyActivity";
import DeviceManagement from "app/views/container/DeviceManagement";
import ChangePassword from "app/views/container/ChangePassword";
import About from "app/views/container/About";
import Terms from "app/views/container/TermsOfUse";
import Privacy from "app/views/container/PrivacyPolicy";
import Cookie from "app/views/container/CookiePolicy";
import AdyenGateway from "app/views/container/AdyenGateway";
import Plans from "app/views/container/Plans";
import PlansDescription from "app/views/container/PlansDescription";
import PlansRamadan from "app/views/container/PlansRamadan";
import DeviceDescription from "app/views/container/DeviceDescription";
import TransactionStatus from "app/views/container/TransactionStatus";
import NewTransacationStatus from "app/views/container/TransactionAdyenStatus";
import SubscribeToWatch from "app/views/container/SubscribeToWatch";
import SubscribeWithoutAd from "app/views/container/SubscribeWithoutAd";
import AdyenEnterDetails from "app/views/container/AdyenEnterDetails";
import PaymentEnterMobile from "app/views/container/PaymentEnterMobile";
import PaymentEnterOTP from "app/views/container/PaymentEnterOTP";
import MySubscription from "app/views/container/MySubscription";
import CouponSuccess from "app/views/container/CouponSuccess";
import DuSuccess from "app/views/container/DuSuccess";
import MobileDuSuccess from "app/views/container/MobileDuSuccess";
import ContactUs from "app/views/container/ContactUs";
import VideoList from "app/views/container/VideoList";
import ManageCookies from 'app/views/container/ManageCookies'
import HeaderContent from "../views/container/HeaderContent";
// import ManageCookies from 'app/views/components/ManageCookies'
import CookingContest from 'app/views/container/CookingContest';
import CookingContestThankyou from "app/views/container/CookingContestThankyou"

class RoutComponent extends React.PureComponent {
  componentDidMount() {
    localStorage.setItem("pageCount", 1)
  }

  componentDidUpdate() {
    let pageCount = parseInt(localStorage.getItem("pageCount"))
    if (pageCount + 1 == 2) {

      let lang = 'ar'

      let url = window.location.pathname

      let pathArray = url.split('/')

      if (pathArray.length > 0) {
        lang = pathArray[1]
      }

      // As resource oResourceBundle is not working in this secenario so we have add statically 
      if (lang == "en") {
        window.clevertap.notifications.push({
          "apnsWebPushId": "C9REGPB46C.web.com.weyyak", //only for safari browser
          "apnsWebPushServiceUrl": "https://weyyak.com/", //only for safari browser
          "titleText": "Would you like to receive push notification from Weyyak?",
          "bodyText": "We promise to only send you relevant content and give you updates on your transactions",
          "okButtonText": "Sign me up!",
          "rejectButtonText": "No thanks",
          "okButtonColor": '#f28046'
        });
      } else {
        window.clevertap.notifications.push({
          "apnsWebPushId": "C9REGPB46C.web.com.weyyak", //only for safari browser
          "apnsWebPushServiceUrl": "https://weyyak.com/", //only for safari browser
          "titleText": "ترغب بالحصول على اشعارات من وياك؟",
          "bodyText": " نتعهد بارسال محتوى ذات صلة بنشاطك ومشاهداتك على وياك",
          "okButtonText": "! أشركني",
          "rejectButtonText": "لا، شكراً",
          "okButtonColor": '#f28046'
        });
      }

    }
    localStorage.setItem("pageCount", pageCount + 1)
  }

  render() {
    return (
      <Switch>
        {/* <Route exact path={routeNames.NOT_FOUND} component={NotFoundPage} /> */}
        <Route exact path={"/"} component={HomePage} />
        <Route exact path={routeNames.SEARCH} component={UserSearchList} />
        <Route exact path={routeNames.ABOUT} component={About} />
        <Route exact path={routeNames.PRIVACY_POLICY} component={Privacy} />
        <Route exact path={routeNames.COOKIE_POLICY} component={Cookie} />
        <Route exact path={routeNames.TERMS_OF_USE} component={Terms} />
        <Route exact path={routeNames.MANAGE_COOKIES} component={ManageCookies} />
        <Route exact path={routeNames.MENUCONTENT} component={HeaderContent} />
        <Route exact path={routeNames.COOKING_CONTEST_THANKYOU} component={CookingContestThankyou} />
        <Route
          exact
          path={routeNames.MY_SUBSCRIPTION}
          component={MySubscription}
        />
        <Route
          exact
          path={routeNames.COUPON_SUCCESS}
          component={CouponSuccess}
        />
        <Route
          exact
          path={routeNames.DU_SUCCESS}
          component={DuSuccess}
        />

        <Route
          exact
          path={routeNames.DU_SUCCESS_MOBILE}
          component={MobileDuSuccess}
        />

        <Route exact path={routeNames.CONTACT_US} component={ContactUs} />
        {/* <Route path={routeNames.IMSAKEYEH}  component={IMSAKEYEH}/> */}
        <Route
          exact
          path={routeNames.SEARCH_CAST_GENRE}
          component={UserSearchList}
        />
        <Route
          exact
          path={routeNames.MY_ACTIVITY_WATCH_REPORT}
          component={MyActivity}
        />
        <Route
          exact
          path={routeNames.STATIC_MENU_CONTENT}
          component={HomePage}
        />
        <Route
          exact
          path={routeNames.DEVICE_MANAGEMENT}
          component={DeviceManagement}
        />
        <Route exact path={routeNames.DEVICE_DESCRIPTION} component={PlansRamadan} />
        {/* <Route exact path={routeNames.DEVICE_DESCRIPTION} component={DeviceDescription} /> */}
        <Route
          exact
          path={routeNames.CHANGE_PASSWORD}
          component={ChangePassword}
        />
        <Route exact path={routeNames.CHECKOUT} component={AdyenGateway} />
        <Route exact path={routeNames.PLANS} component={Plans} />
        <Route exact path={routeNames.PLANS_DESCRIPTION} component={PlansRamadan} />
        <Route exact path={routeNames.RAMADAN_PLANS} component={PlansDescription} />
        <Route
          exact
          path={routeNames.PAYMENT_ENTER_MOBILE}
          component={PaymentEnterMobile}
        />
        <Route
          exact
          path={routeNames.PAYMENT_ENTER_OTP}
          component={PaymentEnterOTP}
        />
        <Route
          exact
          path={routeNames.PAYMENT_OPERATOR}
          component={AdyenEnterDetails}
        />
        <Route
          exact
          path={routeNames.SUBSCRIPTION_TO_WATCH}
          component={SubscribeToWatch}
        />
        <Route
          exact
          path={routeNames.SUBSCRIPTION_TO_WATCH_AD}
          component={SubscribeWithoutAd}
        />
        {/* <Route
          exact
          path={routeNames.TRANSACTION_STATUS}
          component={TransactionStatus}
        /> */}
        <Route
          exact
          path={routeNames.TRANSACTION_STATUS}
          component={NewTransacationStatus}
        />
        <Route exact path={routeNames.MY_SETTINGS} component={Settings} />
        <Route exact path={routeNames.MY_ACCOUNT} component={MyAccount} />
        <Route exact path={routeNames.COOKING_CONTEST} component={CookingContest}/>
        <Route exact path={routeNames.MY_ACTIVITY} component={MyActivity} />
        <Route exact path={routeNames.LOGIN} component={Login} />
        <Route exact path={routeNames.SIGNUP} component={SignUp} />
        <Route exact path={routeNames.TWITTER_TOKEN} component={TwitterToken} />
        <Route exact path={routeNames.APPLE_TOKEN} component={AppleToken} />
        <Route
          exact
          path={routeNames.FORGOT_PASSWORD}
          component={ForgotPassword}
        />
        <Route
          exact
          path={routeNames.FORGOT_PASSWORD_SUCCESS}
          component={ForgotPasswordSuccess}
        />
        <Route
          exact
          path={routeNames.FORGOT_PASSWORD_EMAIL_RESET}
          component={EmailResetPassword}
        />

        <Route
          exact
          path={routeNames.RESET_PASSWORD_SUCCESS}
          component={ResetPasswordSuccess}
        />
        <Route
          exact
          path={routeNames.FORGOT_PASSWORD_MOBILE}
          component={ForgotPasswordMobile}
        />
        <Route
          exact
          path={routeNames.FORGOT_PASSWORD_MOBILE_OTP}
          component={ResetPasswordMobile}
        />

        <Route
          exact
          path={routeNames.EMAIL_VERIFICATION}
          component={EmailVerification}
        />
        <Route
          exact
          path={routeNames.EMAIL_VERIFICATION_SUCCESSFUL}
          component={EmailVerificationCheck}
        />
        <Route
          exact
          path={routeNames.MOBILE_VERIFICATION}
          component={MobileVerification}
        />
        <Route
          exact
          path={routeNames.MOBILE_VERIFICATION_SUCCESSFUL}
          component={MobileVerificationSuccess}
        />
        <Route
          exact
          path={routeNames.MOBILE_VERIFICATION_FAIL}
          component={MobileVerificationFail}
        />
        <Route exact path={routeNames.PLAYER} component={Player} />
        <Route exact path={routeNames.CONTINUE_PLAYER} component={Player} />
        <Route exact path={routeNames.PLAYER_TRAILER} component={PlayerTrailer} />
        <Route exact path={routeNames.VIDEO_CONTENT} component={VideoContentPage} />
        {/* <Route exact path={routeNames.VIDEO_CONTENT} component={VideoContent} /> */}
        <Route exact path={routeNames.VIDEO_LIST_PLANS} component={VideoList} />
        <Route exact path={routeNames.HOME} component={HomePage} />
        <Route exact path={routeNames.API_MENU_CONTENT} component={HomePage} />

        <Route path={"*"} component={() => <Redirect to={"/"} />} />

      </Switch>
    );
  }
}

export default RoutComponent;
