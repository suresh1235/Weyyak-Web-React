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
import {Route, Switch, Redirect} from "react-router-dom";
import * as routeNames from "app/Routes/RouteNames";

import HomePage from "app/views/container/Home/";
import Login from "app/views/container/Login/";
import SignUp from "app/views/container/SignUp/";
import TwitterToken from "app/views/container/Twitter/TwitterToken/";
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
// import NotFoundPage from "app/views/container/NotFoundPage/";
import Player from "app/views/container/Player/";
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
import DeviceDescription from "app/views/container/DeviceDescription";
import TransactionStatus from "app/views/container/TransactionStatus";
import SubscribeToWatch from "app/views/container/SubscribeToWatch";
import SubscribeWithoutAd from "app/views/container/SubscribeWithoutAd";
import AdyenEnterDetails from "app/views/container/AdyenEnterDetails";
import PaymentEnterMobile from "app/views/container/PaymentEnterMobile";
import PaymentEnterOTP from "app/views/container/PaymentEnterOTP";
import MySubscription from "app/views/container/MySubscription";
import CouponSuccess from "app/views/container/CouponSuccess";
import ContactUs from "app/views/container/ContactUs";
import VideoList from "app/views/container/VideoList";


class RoutComponent extends React.PureComponent {
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
        <Route exact path={routeNames.DEVICE_DESCRIPTION} component={DeviceDescription} />
        <Route
          exact
          path={routeNames.CHANGE_PASSWORD}
          component={ChangePassword}
        />
        <Route exact path={routeNames.CHECKOUT} component={AdyenGateway} />
        <Route exact path={routeNames.PLANS} component={Plans} />
        <Route exact path={routeNames.PLANS_DESCRIPTION} component={PlansDescription} />
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
        <Route
          exact
          path={routeNames.TRANSACTION_STATUS}
          component={TransactionStatus}
        />
        <Route exact path={routeNames.MY_SETTINGS} component={Settings} />
        <Route exact path={routeNames.MY_ACCOUNT} component={MyAccount} />
        <Route exact path={routeNames.MY_ACTIVITY} component={MyActivity} />
        <Route exact path={routeNames.LOGIN} component={Login} />
        <Route exact path={routeNames.SIGNUP} component={SignUp} />
        <Route exact path={routeNames.TWITTER_TOKEN} component={TwitterToken} />
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
        <Route exact path={routeNames.VIDEO_CONTENT} component={VideoContent} />
        <Route exact path={routeNames.VIDEO_LIST_PLANS} component={VideoList} />
        <Route exact path={routeNames.HOME} component={HomePage} />
        <Route exact path={routeNames.API_MENU_CONTENT} component={HomePage} />
        {/* <Route exact path={routeNames.IMSAKEYEH}  render={() =>  
              <Redirect to = {"https://indd.adobe.com/view/a1b35d18-8640-4fbe-a453-1ca19e0d74af"} /> }/>
     */}
        <Route path={"*"} component={() => <Redirect to={"/"} />} />
        
      </Switch>
    );
  }
}

export default RoutComponent;
