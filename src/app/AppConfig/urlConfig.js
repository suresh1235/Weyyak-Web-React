import { QA_API, UAT_API, STAGE_API, IS_EGYPT, IS_PAYMENT_QA, IS_PAYMENT_STAGE, IS_PAYMENT_PROD } from "app/AppConfig/features";

//Define all the URLs here
let BASE_URL = "https://api.wyk.z5.com";

let
PAYMENT_BASE_URL = "http://paymentapi.weyyak.com";


if (STAGE_API) {
  BASE_URL = "https://apistg.weyyak.z5.com"
}
if (IS_EGYPT) {
  BASE_URL = "https://api.weyyak1.z5.com"
}

if (QA_API) {
  BASE_URL = "https://apiqa.wyk.z5.com";
}

if (UAT_API) {
  BASE_URL = "https://uat-api.weyyak.z5.com";
}
if (IS_PAYMENT_QA) {
  PAYMENT_BASE_URL = "https://zpapi.wyk.z5.com";
}
if (IS_PAYMENT_STAGE) {
  PAYMENT_BASE_URL = "https://paymentapistg.weyyak.z5.com/";
}
if (IS_PAYMENT_PROD) {
  PAYMENT_BASE_URL = "https://zpapi.weyyak.com";
}

let USER_AUTH_BASE_URL = BASE_URL;
// //GEO
// export const GEO_LOCATION = "https://geo.weyyak.com/";
export const PLATFORM_CONFIG = BASE_URL + "/config";
export const STATIC_MENU = "/{LANGUAGE_CODE}/static?device=web";
export const MENU = "/{LANGUAGE_CODE}/menu?device=web";
export const COUNTRY_LIST = "/{LANGUAGE_CODE}/countries";
export const COUNTRY_PHONE_CODES =
  USER_AUTH_BASE_URL + "/countries/{LANGUAGE_CODE}";
export const CATEGORY_CONTENT = "/{LANGUAGE_CODE}/menu/{CATEGORY_ID}?cascade=2&country={COUNTRY}"
// export const BACKDROP_VIDEO_CONTENT =
//   "/{LANGUAGE_CODE}/{TYPE}/{ID}?cascade={CASCADE_NO}&country={COUNTRY}";
// export const BACKDROP_VIDEO_CONTENT =
//   "/{LANGUAGE_CODE}/{TYPE}?Country={COUNTRY}&contentkey={ID}&cascade={CASCADE_NO}"

// export const BACKDROP_VIDEO_CONTENT = "/{LANGUAGE_CODE}/{TYPE}?contentkey={ID}&country={COUNTRY}"
export const BACKDROP_VIDEO_CONTENT =
  "/{LANGUAGE_CODE}/{TYPE}?contentkey={ID}&cascade={CASCADE_NO}&country={COUNTRY}";
export const BACKDROP_VIDEO_CONTENT_EPISODE = "/{LANGUAGE_CODE}/{TYPE}/{ID}?cascade={CASCADE_NO}&country={COUNTRY}";
export const VIDEO_RATING_CONTENT = "/contents/{ID},{TYPE}";
export const THUMBNAIL_IMAGE =
  "https://deliveryc.tvappagency.com/z5/{TYPE}/cache/200x200/{IMAGE_NAME}";
export const THUMBNAIL_IMAGE_CAROUSEL =
  "https://deliveryc.tvappagency.com/z5/{TYPE}/cache/450x450/{IMAGE_NAME}";

//Video Detail
export const RELATED_VIDEOS_WITH_TYPE =
  "/{LANGUAGE_CODE}/related?id={ID}&q={QUERY}&type={TYPE}&size=7&country={COUNTRY}";
  export const RELATED_VIDEO_TRAILERS =
  "/{LANGUAGE_CODE}/contents/contentTrailer?Country={COUNTRY}&contenttype={TYPE}&contentkey={ID}";
// export const RELATED_VIDEOS = "/{LANGAUAGE_CODE}/related/contents?country={COUNTRY}&limit=100&contentkey={ID}";
export const RELATED_VIDEOS =
  "/{LANGUAGE_CODE}/related?id={ID}&q={QUERY}&size=100&country={COUNTRY}";
export const PROFILE_PLAYLIST = "/contents/playlist?limit=100";
export const MY_PLAYLIST = "/contents/playlist?limit=100";
export const CONTENT_DETAILS = "/{LANGUAGE_CODE}/mediaobject/";
export const REMOVE_FROM_PLAYLIST = "/contents/playlist/{ID},{TYPE}";
export const DELETE_FROM_PLAYLIST = "/contents/watching/{ID},{TYPE}";
export const ADD_TO_PLAYLIST = "/contents/playlist";
export const CHANGE_RATING = "/contents/rated";
export const VIDEO_URL_INFO = "https://transcoding.weyyak.ae/get_info/{ID}";
export const SERIES_DETAILS =
  "/{LANGUAGE_CODE}/series/{SERIES_ID}?cascade=3&country={COUNTRY}";
//Login Related
export const LOGIN_TOKEN = USER_AUTH_BASE_URL + "/oauth2/token";
export const VERIFY_EMAIL =
  USER_AUTH_BASE_URL + "/user/registration_confirmation";
export const VERIFY_OTP = USER_AUTH_BASE_URL + "/users/verify_otp";
export const RESEND_VERIFICATION_EMAIL =
  USER_AUTH_BASE_URL + "/users/resend_email";
export const SEND_OTP_CODE = USER_AUTH_BASE_URL + "/users/send_otp";
export const UPDATE_PHONE_NUMBER =
  USER_AUTH_BASE_URL + "/users/self/phone_number";
export const UPDATE_USER_INFO =
  USER_AUTH_BASE_URL + "/users/self";
export const REGISTER_EMAIL = USER_AUTH_BASE_URL + "/users/register_email";
export const REGISTER_MOBILE = USER_AUTH_BASE_URL + "/users/register_sms";
export const LOGIN_FACEBOOK_USER = USER_AUTH_BASE_URL + "/oauth2/token";
export const LOGIN_APPLE_USER = USER_AUTH_BASE_URL + "/oauth2/token";
export const FORGOT_PASSWORD =
  USER_AUTH_BASE_URL + "/user/reset_password_emails";
export const UPDATE_PASSWORD_OTP = USER_AUTH_BASE_URL + "/user/password_otp";
export const RESET_PASSWORD = USER_AUTH_BASE_URL + "/user/password";
export const TWITTER_OAUTH_TOKEN =
  USER_AUTH_BASE_URL + "/{LANGUAGE_CODE}/usertoken?callback={CALLBACK}";
export const TWITTER_ACCESS_TOKEN =
  USER_AUTH_BASE_URL +
  "/{LANGUAGE_CODE}/getAcessToken?oauth_token={TOKEN}&oauth_verifier={VERIFIER}";

//HOME PAGE
export const RESUMABLE = "/contents/resumable?offset=0&limit=1000";
export const RESUMABLE_ITEMS = "/{LANGUAGE_CODE}/mediaobject/{QUERY_ITEMS}";

//EXPLORE
export const VIDEO_RESUMABLE = "/contents/plans?Country={COUNTRY}&0ffset=0&limit=50";
// export const VIDEO_RESUMABLE = "/contents/plans?offset=0&limit=60?country=IN";

//Video list
export const VIDEO_LIST = "/{LANGUAGE_CODE}/seasons/contents?offset=0&limit=60&plan=2";

//Search
export const SEARCH_ITEM = "/{LANGUAGE_CODE}/search?Country={COUNTRY}&q=";
export const SEARCH_ITEM_BY_GENRE = "/{LANGUAGE_CODE}/searchby{CATEGORY}?country={COUNTRY}&q=";
export const SEARCH_ITEM_BY_CAST = "/{LANGUAGE_CODE}/searchby{CATEGORY}?country={COUNTRY}&q=";

//HeaderMenu
export const HEADERMENU_CONTENTS = "/{LANGUAGE_CODE}/contents/contentType?contentType={CONTENT_TYPE}&Country={COUNTRY}&pageNo=1&OrderBy=desc&RowCountPerPage=50&IsPaging=0";
export const HEADERMENU="/{LANGUAGE_CODE}/contenttype?device=web "

//My Activity
export const USER_WATCHING = "/contents/watching";
export const USER_RATED = "/contents/rated";
export const WATCH_REPORT_ITEM = "contents/watching/{ITEM_QUERY}/issues";

//My Account
export const USER_DETAILS = USER_AUTH_BASE_URL + "/v1/users/self";
export const LOGGED_IN_DEVICES = "/devices/{DEVICE_ID}";
export const ADD_PAIRING_CODE = "/oauth2/device/auth";
export const CHANGE_PASSWORD = USER_AUTH_BASE_URL + "/users/self/password";

//Payment adyen
export const CREATE_PAYMENT_SESSION =
  PAYMENT_BASE_URL + "/payment/adyen/paysession";
export const VERIFY_PAYMENT_RESULT = PAYMENT_BASE_URL + "/payment/adyen/verify";
export const SUBSCRIPTION_PLANS =
  PAYMENT_BASE_URL + "/plans/premium-plans?country={COUNTRY_CODE}&platform=website&system=weyyak&language={LANGUAGE_CODE}";

export const SUBSCRIPTION_PLANS_FOR_DISCOUNT =
  PAYMENT_BASE_URL + "/plans/premium-plans?country={COUNTRY_CODE}&platform=website&system=weyyak&language={LANGUAGE_CODE}&user_id={user_id}&coupon_code={COUPON_CODE}";



export const GDPR_PAYMENT_GATEWAYS_LIST = PAYMENT_BASE_URL + "/payment-providers?country={COUNTRY_CODE}&platform=website&system=weyyak&language={LANGUAGE_CODE}"

export const SUBSCRIPTION_ENTITLEMENT =
  PAYMENT_BASE_URL +
  "/orders/orderDetails?user_id={USERID}&include_all={IS_INCLUDE_ALL}&language={LANGUAGE_CODE}";

export const CANCEL_SUBSCRIPTION =
PAYMENT_BASE_URL + "/payment/cancel-subscription/{ORDER_ID}/{LANGUAGE_CODE}";

export const ADYEN_CANCEL_SUBSCRIPTION =
  PAYMENT_BASE_URL + "/index.php?c=AdyenRecrringDisable&m=disable&order_id={ORDER_ID}&language={LANGUAGE_CODE}";

//Payment etisalat
export const ETISALAT_PREPARE = PAYMENT_BASE_URL + "/payment/etisalat/prepare";
export const ETISALAT_RESEND_OTP =
  PAYMENT_BASE_URL + "/payment/etisalat/resend-otp";
export const ETISALAT_VERIFY = PAYMENT_BASE_URL + "/payment/etisalat/callback";
// export const ETISALAT_CANCEL_SUBSCRIPTION =
//   PAYMENT_BASE_URL + "?c=Etisalat&m=deactivateEtisalatPackage";
export const ETISALAT_CANCEL_SUBSCRIPTION =
  PAYMENT_BASE_URL + "/index.php?c=AdyenRecrringDisable&m=disable&order_id={ORDER_ID}";

//coupons
export const COUPONS_VERIFICATION =
  PAYMENT_BASE_URL +
  "/payment/coupon/verification?coupon_code={COUPON_CODE}&user_id={USER_ID}&country={COUNTRY_CODE}&platform=website&language={LANGUAGE_CODE}";
export const COUPONS_REDEMPTION =
  PAYMENT_BASE_URL + "/payment/coupon/redemption";
export const CAMPAIGN_COUPONS = PAYMENT_BASE_URL + "/campaign/discount-campaign?user_id={USER_ID}&language={LANGUAGE_CODE}";

//tpay
export const TPAY_PREPARE = PAYMENT_BASE_URL + "/payment/tpay/prepare";
export const TPAY_VERIFY = PAYMENT_BASE_URL + "/payment/tpay/callback";
export const TPAY_RESEND_OTP = PAYMENT_BASE_URL + "/payment/tpay/resend-otp";
export const TPAY_CANCEL_SUBSCRIPTION =
  PAYMENT_BASE_URL +
  "/index.php?c=AdyenRecrringDisable&m=disable&order_id={ORDER_ID}&language={LANGUAGE_CODE}";
export const SEND_CONTACT_DETAILS = PAYMENT_BASE_URL + "/crm/contactus";
export const INFOMEDIA_PREPARE = PAYMENT_BASE_URL + "/payment/infomedia/prepare";
export const TELUS_PREPARE = PAYMENT_BASE_URL + "/payment/infomedia/prepare";

//Payment Zain 
export const ZAIN_PREPARE = PAYMENT_BASE_URL + "/payment/zain-media-world/prepare";
export const ZAIN_VERIFY_PINCODE = PAYMENT_BASE_URL + "/payment/zain-media-world/verify-pincode";
export const ZAIN_RESEND_OTP = PAYMENT_BASE_URL + "/payment/zain-media-world/resend-otp";

//Cooking contest
export const COOKING_CONTEST = "https://sytz9mbysb.execute-api.ap-south-1.amazonaws.com/weyyak-fo-ms-api-uat/v1/competitionuser"