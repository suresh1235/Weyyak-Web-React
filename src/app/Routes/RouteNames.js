/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import * as CONSTANTS from "app/AppConfig/constants";

export const HOME = "/:languagecode";
export const ROOT = "/:langcode";
export const LOGIN = "/:languagecode/login";
export const TWITTER_TOKEN = "/:languagecode/twitter-token";
export const SIGNUP = "/:languagecode/sign-up";
export const FORGOT_PASSWORD = "/:languagecode/" + CONSTANTS.FORGOT_PASSWORD;
export const FORGOT_PASSWORD_SUCCESS = "/:languagecode/forgot-password-email-link";
export const RESET_PASSWORD_SUCCESS = "/:languagecode/" + CONSTANTS.RESET_PASSWORD_SUCCESS;
export const FORGOT_PASSWORD_EMAIL_RESET = "/:languagecode/reset-password";
export const FORGOT_PASSWORD_MOBILE = "/:languagecode/forgot-password-mobile";
export const FORGOT_PASSWORD_MOBILE_OTP = "/:languagecode/" + CONSTANTS.FORGOT_PASSWORD_MOBILE_OTP;
export const EMAIL_VERIFICATION = "/:languagecode/" + CONSTANTS.CONFIRM_EMAIL;
export const MOBILE_VERIFICATION = "/:languagecode/mobile-verification";
export const EMAIL_VERIFICATION_SUCCESSFUL = "/:languagecode/" + CONSTANTS.CONFIRM_EMAIL_CHECK;
export const MOBILE_VERIFICATION_SUCCESSFUL = "/:languagecode/confirm-mobile";
export const EMAIL_VERIFICATION_FAIL = "/:languagecode/email-verification-fail";
export const MOBILE_VERIFICATION_FAIL = "/:languagecode/mobile-verification-fail";
export const NOT_FOUND = "/NotFound";
export const MENU_CONTENT = "/:langcode/:id/:category";
export const STATIC_MENU_CONTENT = "/:langcode/static/:category";
export const API_MENU_CONTENT = "/:langcode/:category";
export const VIDEO_CONTENT = "/:langcode/:type/:id/:name";
export const PLAYER = "/:langcode/" + CONSTANTS.PLAYER + "/:type/:id/:name?";
export const SEARCH = "/:langcode/search/:term/";
export const SEARCH_CAST_GENRE = "/:langcode/search/:category/:name/";
export const MY_ACCOUNT = "/:langcode/my-account";
export const MY_SETTINGS = "/:langcode/settings";
export const MY_ACTIVITY = "/:langcode/my-activity/";
export const MY_ACTIVITY_WATCH_REPORT = "/:langcode/my-activity/watch-report";
export const DEVICE_MANAGEMENT = "/:langcode/myTV";
export const MANAGE_ACCOUNT = "/:langcode/manage-account";
export const CHANGE_PASSWORD = "/:langcode/change-password";
export const ABOUT = "/:langcode/static/about-:langcode";
export const PRIVACY_POLICY = "/:langcode/static/privacy-:langcode";
export const COOKIE_POLICY = "/:langcode/static/cookie-policy-:langcode";
export const TERMS_OF_USE = "/:langcode/static/term-:langcode";
export const CHECKOUT = "/:langcode/checkout";
export const PLANS = "/:langcode/" + CONSTANTS.PLANS;
export const PLANS_DESCRIPTION = "/:langcode/" + CONSTANTS.PLANS_DESCRIPTION;
export const DEVICE_DESCRIPTION = "/:langcode/" + CONSTANTS.DEVICE_DESCRIPTION;
export const TRANSACTION_STATUS = "/:langcode/transactionstatus/:status";
export const PAYMENT_ENTER_MOBILE = "/:langcode/" + CONSTANTS.PAYMENT_ENTER_MOBILE;
export const PAYMENT_ENTER_OTP = "/:langcode/" + CONSTANTS.PAYMENT_ENTER_OTP;
export const PAYMENT_SMS_CODE = "/:langcode/payment-sms-code";
export const SUBSCRIPTION_TO_WATCH = "/:langcode/subscribe-to-watch";
export const SUBSCRIPTION_TO_WATCH_AD =
  "/:langcode/subscribe-to-watch-without-ad";
export const PAYMENT_OPERATOR = "/:langcode/adyen-enter-details";
export const MY_SUBSCRIPTION = "/:langcode/my-subscription";
export const COUPON_SUCCESS = "/:langcode/coupon-success";
export const CONTACT_US = "/:langcode/static/contact-:langcode";
export const VIDEO_LIST_PLANS = "/:langcode/"+ CONSTANTS.LIST+'/plan=:package_id';
export const IMSAKEYEH = "/imsakeyeh";