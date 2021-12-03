import oResourceBundle from "app/i18n/";
import { ENABLE_SUBSCRIPTION } from "app/AppConfig/features";

//Define all the constants
// export const BUILD_VERSION_NUMBER = "2.1.8"; // QA ENV
// export const BUILD_VERSION_NUMBER = "2.1.3";  // UAT ENV
export const BUILD_VERSION_NUMBER = "2.5.10";  // PROD ENV
export const MOBILE_VIEW_THRESHOLD = 745;
export const PLAYER_CAROUSEL_MOBILE_THRESHOLD = 600;
export const PLAYER_LANDSCAPE_MIN_WIDTH = 500;
export const INFINITE_COOKIE_TIME = 2335285800000;
export const GDPRCookieExpires = 24 * 60 * 60 * 1000

export const MY_PLAYLIST_TOAST_ID = 1;
export const REGISTER_ERROR_TOAST_ID = 2;
export const GENERIC_TOAST_ID = 100;
export const MY_SUBSCRIPTION_TOAST_ID = 4;

export const HOME_ID = 62;
export const HOME = "home";
export const HOME_PATH = "/";
export const SUBSCRIPTION_BANNER_CONTENT_TYPE = "subscription-banner";
export const FORGOT_PASSWORD = "forgot-password";
export const FORGOT_PASSWORD_SUCCESS = "forgot-password-email-link";
export const FORGOT_PASSWORD_MOBILE = "forgot-password-mobile";
export const FORGOT_PASSWORD_MOBILE_OTP = "reset-password-mobile-otp";
export const RESET_PASSWORD_SUCCESS = "reset-password-success";
export const CONFIRM_EMAIL_CHECK = "confirm-email";
export const CONFIRM_EMAIL = "email-verification";
export const MOBILE_VERIFICATION = "mobile-verification";
export const LOGIN = "login";
export const SIGNUP = "sign-up";
export const SEARCH = "search";
export const ABOUT = "static/about-";
export const PRIVACY_POLICY = "static/privacy-";
export const TERMS_OF_USE = "static/term-";
export const AR_CODE = "ar";
export const EN_CODE = "en";
export const RTL = "rtl";
export const EPISODES = "episodes";
export const EPISODE = "episode";
export const SERIES = "series";
export const MOVIE = "movie";
export const PLAY = "play";
export const PROGRAM = "program";
export const LIVETV = "livetv";
export const OVERVIEW = "overview";
export const PLAYER = "player";
export const TRAILER = "trailer";
export const PLANS = "plans";
export const PLANS_DESCRIPTION = "plans-description";
export const RAMADAN_PLANS = "ramadan-plans";
export const DEVICE_DESCRIPTION = "device-description";
export const LIST = "videolist"
export const CHECKOUT = "checkout";
export const PAYMENT_OPERATOR = "adyen-enter-details";
export const TRANSACTION_STATUS = "transactionstatus";
export const SUBSCRIPTION_TO_WATCH = "subscribe-to-watch";
export const SUBSCRIPTION_TO_WATCH_AD = "subscribe-to-watch-without-ad";
export const PAYMENT_ENTER_MOBILE = "payment-enter-mobile";
export const PAYMENT_ENTER_OTP = "payment-enter-otp";
export const COUPONS_SUCCESS = "coupon-success";

export const COMPLETED = "completed";
export const AUTOPLAYSPEED_BANNER = 2000;
export const LAZY_LOAD_DELAY = 3000;
export const LAZY_LOAD_DELAY_BUCKET = 10000;
export const HOME_BUCKETS_TO_LOAD = 1;
export const PAYMENT_PLATFORM = "Web";
export const PAYMENT_OPERATOR_ADYEN = "Adyen";
export const PAYMENT_OPERATOR_MW_ZAIN = "mw_zain";
export const PAYMENT_OPERATOR_ETISALAT = "Etisalat";
export const PAYMENT_OPERATOR_TPAY_ETISALAT = "Tpay_Etisalat";
export const SUBSCRIPTION_DATE_FORMAT = "DD/MM/YYYY";
export const SUBSCRIPTION_PURCHASE_DATE_FORMAT = "DD MMM, YYYY";
export const SUBSCRIPTION_BILLING_CYCLE_DAY = "DAY";
export const TPAY_OPERATOR_PHONE_CODES = {
  EG: { Orange: "20", Tpay_Vodafone: "20", We: "20", Tpay_Etisalat: "20" },
  AE: { Du: "971" },
  SA: { Zain: "966", STC: "966", Mobily: "966" },
  PS: { Ooredoo: "970", Jawwal: "970" },
  JO: { Zain: "962", Umniah: "962", Orange: "962" },
  QA: { Ooredoo: "974", Tpay_Vodafone: "974" },
  KW: { Viva: "965", Ooredoo: "965", Zain: "965", STC: "965" },
  BH: { Viva: "973", Zain: "973", STC: "973" },
  TN: { Ooredoo: "216", Orange: "216", "Tunisie Telecom": "216" },
  DZ: { Ooredoo: "213" },
  LY: { Libyan: "218" },
  MA: { Meditel: "212", INWI: "212" },
  IQ: { mw_zain: "964" },
  TR: { TurkCell: "90", Avea: "90", Vodafone: "90" }
};


//Player
export const PLAYER_REWIND_DURATION = 10; // In s
export const PLAYER_PROGRESS_UPDATE_INTERVAL = 1000; // In ms
export const PLAYER_CONTROLS_DURATION = 3000; // In ms
export const DEFAULT_VOLUME = 1;
export const PLAYER_QUALITY_P = "p";
export const PLAYER_QUALITY_HD = "HD";
export const PLAYER_QUALITY_HD_MIN_VALUE = 720;
export const UPDATE_WATCHING_INTERVAL = 10000;

//Advertisement
export const NUMBER_OF_BUCKETS_PER_AD = 3;
export const NUMBER_OF_EPISODES_PER_AD = 5;
export const PREROLL_POD_INDEX = 0;
export const POSTROLL_POD_INDEX = -1;
// export const AD_CONTAINER_ID_PREFIX = "Leaderboard";

export const AD_CONTAINER_ID_PREFIX = "div-gpt-ad-1638357256901-0";
export const AD_MOBILE_CONTAINER_ID_PREFIX = 'div-gpt-ad-1638357256901-0';
export const AD_SIZE =  [[728, 90],[320, 50]];
export const AD_MOBILE_SIZE = [320, 50];
export const AD_SLOTID = '/77688724/Weyyak_Banner_Ads';

export const AD_MOBILE_SLOTID = '/77688724/Weyyak_Banner_Ads';

export const AD_CLASS_MOBILE = "google-ad google-ad-small";
export const AD_CLASS_DESKTOP = "google-ad google-ad-big";
// export const VIDEO_AD_URL = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/7229/n7729.testsite/Weyyak&ciu_szs=320x50,320x100,728x90,970x90,970x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&cust_params=platform%3Dweb&language%3Dar&description_url=https://weyyak.com&ad_rule=1&correlator=&cmsid=2499579&vid={VIDEO_ID}"
export const CONFIG_AD_PROPERTY = { en: "Ad_Tag_Url_EN", ar: "Ad_Tag_Url_AR" };

//LOG IN
// eslint-disable-next-line
export const EMAIL_VALIDATION_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const LANGUAGE_ID = { ar: 2, en: 1 };
export const PASSWORD_VALIDATION_ERROR_LOGIN =
  "Password must be at least 8 characters long.";
export const PASSWORD_VALIDATION_CONTENT_LENGTH = 8;
export const FIRST_NAME_VALIDATION_ERROR = "*First name is required";
export const LAST_NAME_VALIDATION_ERROR = "*Last name is required";
export const EMAIL_VALIDATION_ERROR_SIGNUP = "*Email is invalid";
export const EMAIL_VALIDATION_ERROR_FORGOT_PASSWORD = "*Email is invalid";
export const PASSWORD_VALIDATION_ERROR = "*Password is required";
// export const GEO_BLOCK_COUNTRIES = ["US"];
export const GEO_BLOCK_COUNTRIES = [""];
export const COUNTRY_LIST_SIGNUP = [
  { key: 356, title: "India", text: "India" },
  { key: 682, title: "Saudi Arabia", text: "Saudi Arabia" },
  { key: 826, title: "United Kingdom", text: "United Kingdom" },
  {
    key: 840,
    title: "United States of America",
    text: "United States of America"
  }
];

export const LANGUAGE_LIST_SIGNUP = [
  { key: 1, title: "English", text: "English" },
  { key: 2, title: oResourceBundle.arabic, text: oResourceBundle.arabic }
];

export const GRANT_TYPE_PASSWORD = "password";
export const GRANT_TYPE_FACEBOOK = "facebook_token";
export const GRANT_TYPE_APPLE = "apple_token";
export const GRANT_TYPE_TWITTER = "twitter_token";
export const SUCCESS = 0;
export const FAILURE = 1;
export const COOKIES_TIMEOUT_REMEMBER = 10 * 365 * 24 * 60 * 60 * 1000;
export const COOKIES_TIMEOUT_NOT_REMEMBER = 10 * 365 * 24 * 60 * 60 * 1000;
export const USER_MENU_DROP_DOWN_VALUE_ENG = [
  { key: "acct", text: "My Account" },
  { key: "activity", text: "My Activity" },
  ...(ENABLE_SUBSCRIPTION
    ? [{ key: "mysubscription", text: "My Subscription" }]
    : []),
  { key: "logout", text: "Logout" }
];

export const USER_MENU_DROP_DOWN_VALUE_ARB = [
  { key: "acct", text: "حسابي" },
  { key: "activity", text: "نشاطاتي" },
  ...(ENABLE_SUBSCRIPTION ? [{ key: "mysubscription", text: "اشتراكي" }] : []),
  { key: "logout", text: "تسجيل خروج" }
];

export const PASSWORD_TYPE_PASSWORD = "password";
export const PASSWORD_PLACEHOLDER = "********";
export const PASSWORD_TYPE_TEXT = "text";
export const REGISTRATION_SOURCE_EMAIL = 1;
export const REGISTRATION_SOURCE_FACEBOOK = 2;
export const REGISTRATION_SOURCE_TWITTER = 3;
export const REGISTRATION_SOURCE_MOBILE = 4;
export const OTP_REQUEST_NEW_USER = "nm"; // new user
export const OTP_REQUEST_TYPE_FORGOT_PASSWORD = "fp"; // forgot password
export const OTP_REQUEST_UPDATE_PHONE_NUMBER = "up"; // update password
export const MINIMUM_OTP_LENGTH = 4;

//SHARE POPUP
export const SHARE_POPUP_TIMEOUT = 50;
export const RATING_DIALOG_WIDTH = 328;
export const RATING_DIALOG_HEIGHT = 250;
export const RATING_DIALOG_ANIMATION_DURATION = 400;

//STATUS CODES
export const STATUS_UNAUTHORISED = 401;
export const STATUS_OK = 200;
export const STATUS_UNVERIFIED_EMAIL = 201;
export const STATUS_ACCEPTED = 202;

//Dialog Box Sign Up
export const SIGNUP_DIALOG_HEIGHT = 165;
export const SIGNUP_DIALOG_WIDTH = 263;
export const SIGNOUTALL_DIALOG_HEIGHT = 165;
export const SIGNOUTALL_DIALOG_WIDTH = 475;

export const TRIAL_BANNER_SQUARE = 0;
export const TRIAL_BANNER_LANDSCAPE = 1;

//THUMBNAIL PROGRESS BAR COLOR
export const PROGRESS_COLOR = "#ff6d02";
export const PROGRESS_THUMBNAIL_HEIGHT = "5px";

//GOOGLE ANALYTICS
// export const GOOGLE_ANALYTICS_ID = "UA-91693332-6";
export const GOOGLE_ANALYTICS_ID = "UA-91693332-1";


//export const GOOGLE_ANALYTICS_ID = "UA-135372881-1"; //DEV Tracking ID
//GTM ID
export const GTM_ID = "GTM-TLBC44M";
// export const GTM_ID = "GTM-NZXKDDG";
//export const GTM_ID = "GTM-5TW52LZ" //DEV GTM ID

export const CHANGE_LANGUAGE = "change_language";
export const AR_ACTION = "arabic";
export const EN_ACTION = "english";
export const SIGNUP_CATEGORY = "signup";
export const MAIL_ACTION = "mail";
export const MOBILE_ACTION = "mobile";
export const ADD_PLAYLIST_CATEGORY = "add_to_playlist";
export const CAROUSEL_CATEGORY = "carousel_behaviour";
export const EXPAND_ACTION = "expand";
export const CLOSE_ACTION = "expansion_closed";
export const NEXT_ACTION = "next";
export const PREVIOUS_ACTION = "previous";
export const SHARE_CATEGORY = "share";
export const SHARE_DETAILS_ACTION = "shared_from_content_page";
export const SHARE_PLAYER_ACTION = "shared_from_player";

export const VIDEO_CATEGORY = "video-player";
export const VIDEO_COMPLETED_PERCENTAGE = 95;
export const VIDEO_COMPLETED_ACTION = "video-completed";
export const VIDEO_START_EPISODE_ACTION = "video-started-episode";
export const VIDEO_START_MOVIE_ACTION = "video-started-movie";
export const VIDEO_START_LIVETV_ACTION = "video-started-livetv";
export const PLAY_VIDEO_ACTION = "play-button-clicked-";
export const PAUSE_VIDEO_ACTION = "pause-button-clicked-";
export const VIDEO_STOP_ACTION = "stop video";

export const VIDEO_AVOD_CATEGORY = "Video-Player_AVOD";
export const VIDEO_SVOD_CATEGORY = "Video-Player_SVOD";
export const PLAY_EPISODE = "Play_Episode";
export const PAUSE_EPISODE = "Pause_Episode";
export const STOP_EPISODE = "Stop_Episode";
export const PLAY_MOVIE = "Play_Movie";
export const PAUSE_MOVIE = "Pause_Movie";
export const PLAY_LIVETV = "Play_LiveTV";
export const PAUSE_LIVETV = "Pause_LiveTV";
export const STOP_MOVIE = "Stop_Movie";
export const VIDEO_LIVETV_STARTED = "Video_LiveTV_Started";
export const VIDEO_LIVETV_STOPPED = "Video_LiveTV_Stopped";
export const FORWARD = "Forward";
export const BACKWARD = "Backward";
export const NEXT_EPISODE = "Next_Episode";
export const VIDEO_EPISODE_STARTED = "Video_Episode_Started";
export const VIDEO_EPISODE_COMPLETED = "Video_Episode_Completed";
export const VIDEO_MOVIE_STARTED = "Video_Movie_Started";
export const VIDEO_MOVIE_COMPLETED = "Video_Movie_Completed";

export const VIDEO_TRAILERS_CATEGORY = "Trailers";
export const VIDEO_TRAILER_STARTED = "Video_Started";
export const VIDEO_TRAILER_COMPLETED = "Video_Completed";
export const VIDEO_TRAILER_PLAY = "Play";
export const VIDEO_TRAILER_PAUSE = "Pause";
export const VIDEO_TRAILER_STOP = "Stop";

export const CONTINUE_WATCHING_CATEGORY = "Continue_Watching";
export const CONTINUE_WATCH_PLAY_MOVIE = "Play_Movie";
export const CONTINUE_WATCH_PLAY_EPISODE = "Play_Episode";
export const CONTINUE_WATCH_REMOVE_ITEM = "Remove_From_ContinueWatching";
export const CONTINUE_WATCH_ADDITEM = "Add_to_MyPlaylist";
export const CONTINUE_WATCH_REMOVEITEM = "Remove_From_MyPlaylist";

export const PLAYER_CONTROL_CATEGORY = "player-control-bar";
export const BIT_RATE_ACTION = "bit-rate-clicked";
export const FULL_SCREEN_ACTION = "full-screen-selected";
export const RELATED_SELECT_ACTION = "related-selected";

export const VIDEO_ADS_CATEGORY = "video-ads";
export const VIDEO_ADS_ACTION = "served";
export const WATCHED_DURATION_CATEGORY = "video-duration";
export const WATCHED_PERIOD_ACTION = "watched_period";

export const LOGIN_CATEGORY = "Login";
export const LOGIN_ACTION = "login_form";
export const TWITTER_LOGIN_ACTION = "twitter";
export const FACEBOOK_LOGIN_ACTION = "facebook";
export const APPLE_LOGIN_ACTION = "apple";
export const OWN_CREDENTIALS_LOGIN_ACTION = "own credentials";

export const SEARCH_CATEGORY = "search";

export const SUBSCRIPTION_CLICK_CATEGORY = "Subscribe_button";
export const LABEL_MAIN_SLIDER = "Main_Slider";
export const SUBSCRIPTION_CLICK_ACTION = "clicked";
export const SUBSCRIPTION_CLICK_LABEL_MAIN_SLIDER = "Main_Slider";
export const SUBSCRIPTION_PLAN_CATEGORY = "Subscription_Plan";
export const SUBSCRIPTION_PLAN_SELECTED_ACTION = "plan_selected";
export const SUBSCRIPTION_PROCEED_ACTION = "proceed_button_clicked";
export const SUBSCRIPTION_BILLING_CATEGORY = "Subscription_billing";
export const SUBSCRIPTION_BILLING_ACTION = "pay_button_billing";
export const SUBSCRIPTION_PAY_CATEGORY = "Subscription_Paid";
export const SUBSCRIPTION_PAY_ACTION = "pay_button_clicked";
export const ACTIVE_PLAN_TEXT = "Active";

export const SUBSCRIPTION_CANCEL_CATEGORY = "Cancel_Plan";
export const SUBSCRIPTION_CANCEL_CATEGORY_TRIAL = "Cancel_Plan_Trial";
export const SUBSCRIPTION_CANCEL_ACTION = "clicked and confirmed";

export const SUBSCRIPTION_PAYMENT_METHOD_CATEGORY = "Payment_Method";
export const SUBSCRIPTION_PAYMENT_METHOD_ACTION = "payment_method_selected";

export const SUBSCRIPTION_PAYMENT_COMPLETED_CATEGORY = "Payment_Completed";
export const SUBSCRIPTION_PAYMENT_COMPLETED_ACTION = "payment_completed_successfully";

export const SUBSCRIPTION_PAYMENT_COMPLETED_TRIAL_CATEGORY = "Payment_Completed_Trial";
export const SUBSCRIPTION_PAYMENT_COMPLETED_TRIAL_ACTION = "payment_completed_with_trial";


export const SUBSCRIPTION_PAYMENT_FAILED_CATEGORY = "Failed_Payment";
export const SUBSCRIPTION_PAYMENT_FAILED_ACTION = "payment failed";

export const SUBSCRIPTION_PAYMENT_EXIT_CATEGORY = "exit/cancel payment";
export const SUBSCRIPTION_PAYMENT_EXIT_ACTION = "exit button clicked,cancel payment";

export const FORGET_PASSWORD_CATEGORY = "Forget_Password";
export const FORGET_PASSWORD_ACTION = "Button_Clicked";
export const FORGET_PASSWORD_LABEL = "Button_Clicked";

export const CHANGE_PASSWORD_CATEGORY = "Change_Password";
export const CHANGE_PASSWORD_ACTION = "Button_Clicked";
export const CHANGE_PASSWORD_LABEL = "Button_Clicked";

export const REGISTRATION_CATEGORY = "Registration";
export const REGISTRATION_ACTION = "Register_via_form";
export const LABEL_EMAIL = "email";
export const LABEL_MOBILE = "mobile";

//Social Login
export const FACEBOOK_ID = "1391989347539411"; //Customer
// export const FACEBOOK_ID = "290597248278499"; //Nikunj test appmyacc
// export const FACEBOOK_ID = "515909502461241";//meghana's test

//Error Code
export const STATUS_UNVERIFIED_MOBILE = "Verify Mobile..";
export const INVALID_PHONE_NUMBER = "error_phone_number_invalid";
export const EMAIL_ALREADY_EXISTS = "error_user_email_already_exists";
export const PHONE_ALREADY_EXISTS = "error_phone_number_registered"; // Sign up
export const PHONE_REGISTERED = "error_phone_number_unregeistered"; // My account
export const PHONE_UNVERIFIED = "error_phone_number_unverified"; // My account
export const FORGOT_PASSWORD_PHONE_UNREGISTERED =
  "error_phone_number_unregistered";
export const FORGOT_PASSWORD_EMAIL_UNREGISTERED =
  "error_user_email_unregistered";
export const PASSWORD_LENGTH_INVALID = "error_user_password_length_invalid";
export const OTP_INVALID = "error_otp_invalid";

//My PlayList
export const MY_PLAYLIST_MENU_ID = 66;

export const PREMIUM_ID = 127;

//Carousel
export const CAROUSEL_AUTOPLAY_SPEED = 1500;

//Saerch
export const GENRE = "Genre";
export const CAST = "Cast";

//My activity
export const MY_ACTIVITY = "my-activity";
export const MANAGE_COOKIES = "Manage-Cookies";
export const WATCHING_SCREEN = "WATCHING_SCREEN";
export const RATING_SCREEN = "RATING_SCREEN";
export const IMSAKEYEH = "imsakeyeh;"

//My Account
export const MY_ACCOUNT = "my-account";
export const ACCOUNT_DETAILS = "account-details";
export const DEVICE_MANAGEMENT = "myTV";
export const MANAGE_ACCOUNT = "manage-account";
export const CHANGE_PASSWORD = "change-password";
export const MY_ACCOUNT_KEY = "MY_ACCOUNT";
export const MANAGE_YOUR_DEVICE_KEY = "MANAGE_YOUR_DEVICE";
export const MANAGE_YOUR_ACCOUNT_KEY = "MANAGE_YOUR_ACCOUNT";

//Thumbnail Image dimension
export const IMAGE_DIMENSIONS = "?d=200x200";
export const IMAGE_DIMENSIONS_CAROUSEL = "?d=450x450";
export const WATCH_REPORT = "my-activity/watch-report";


//Search Item
export const TYPING_DELAY = 500; //ms
export const ENTER_KEYCODE = 13;
export const ESC_KEYCODE = 27;

//Payment
export const MIN_MOBILE_NUMBER = 7;
export const MAX_MOBILE_NUMBER = 15;
export const MAX_VERIFY_RETRY_COUNT = 2;
export const PAYMENT_PAGE_VERIFY_TIMEOUT = 15000;
export const HOME_PAGE_VERIFY_TIMEOUT = 15000;
export const PAYMENT_VERIFY_ERROR = "PAYMENT_VERIFY_ERROR";
export const PAYMENT_ORDER_ID_LOCAL_STORAGE = "PAYMENT_ORDER_ID_LOCAL_STORAGE";
export const COOKIE_PAYLOAD_SAVED_USER_TOKEN =
  "COOKIE_PAYLOAD_SAVED_USER_TOKEN";
export const COOKIE_USER_OBJECT = "COOKIE_USER_OBJECT";
export const COOKIE_USER_TOKEN = "COOKIE_USER_TOKEN";
export const COOKIE_REMEMBER_ME = "COOKIE_REMEMBER_ME";
export const COOKIE_GO_TO_SUBSCRIBE = "COOKIE_GO_TO_SUBSCRIBE";
export const COOKIE_VIDEO_RESUME_OBJECT = "COOKIE_VIDEO_RESUME_OBJECT";
export const COOKIE_VERIFY_PAYMENT_PAYLOAD = "COOKIE_VERIFY_PAYMENT_PAYLOAD";
export const PAYMENT_API_KEY =
  "AQE9hmfuXNWTK0Qc+iSKl2EdqfCeWp9MBJ1HXWtC43a/m3RbjM5lFdVNDzpoGvX8HlxyJ0EMQUXtA2hGgyLGHBDBXVsNvuR83LVYjEgiTGAH-Rvzqf6rf9nIEUU0P+slzL5jkKPmxVnD6CaOLY1x3mZ0=-XysJx5IC93TKzpyv";
export const PAYMENT_MARCHANT = "ZeeEntertainmentEnterprisesLimitedCOM";

//My Subscription
export const MY_SUBSCRIPTION = "my-subscription";
export const RESUME_PATH_COOKIE_NAME = "RESUME_PATH_COOKIE_NAME";
export const MY_SUBSCRIPTION_TEXT_SEPARATOR = " : ";

//Ad type
export const AD_TYPE_POSTROLL = "postroll";
export const AD_TYPE_PREROLL = "preroll";
export const AD_TYPE_MIDROLL = "midroll";


//Payment failure
export const PAYMENT_FAILURE_CODE = 1022;
export const PAYMENT_SUCCESS_CODE = 1;
export const PAYMENT_PARTIAL_SUCCESS_CODE = 30;
export const PAYMENT_USER_DETAIL_COOKIE = "_paymentUserDetails";
export const PAYMENT_SELECTED_PLAN_COOKIE = "_selectedPlanObj";


//Etisalat
export const ETISALAT_COUNTRY_PHONE_CODE = "+971";
export const ETISALAT_PHONE_CODE_DIGITS = 9;
export const ETISALAT_COUNTRY_CODE = "AE";
export const ERROR_CODE_INAPP_ACTIVE = 1019;
export const ERROR_CODE_ETISALAT_NUMBER_ALREADY_EXISTS = 1101;
export const ERROR_CODE_ETISALAT_SUBSCRIPTION_FAILED = 2001;
export const ERROR_CODE_ETISALAT_INVALID_PHONE = 2011;
export const ERROR_CODE_ETISALAT_PIN_GENERATION_ERROR = 2015;
export const ERROR_CODE_ETISALAT_NOT_ETISALAT_NUMBER = 2017;
export const ERROR_CODE_ETISALAT_INVALID_PIN = 2020;
export const ERROR_CODE_ETISALAT_ALREADY_ACTIVE = 2021;
export const ERROR_CODE_ETISALAT_NETWORK_ERROR = 2022;
export const ERROR_CODE_ETISALAT_INSUFFICIENT_BALANCE = 2023;
export const ERROR_CODE_ETISALAT_PIN_EXPIRED = 2027;
export const RESEND_CODE_TIME = 60; // seconds
export const RESEND_TIMER_UPDATE_INTERVAL = 1000; // milliseconds
export const WEEKLY_PLAN_DAYS = 7;
export const MONTHLY_PLAN_DAYS = 30;


//Coupons
export const COUPON_MINIMUM_LENGTH = 8;
export const COUPON_MAXIMUM_LENGTH = 15;
export const INVALID_COUPON = 1;
export const COUPON_LIMIT_EXCEEDED = 2;
export const COUPON_EXPIRED = 3;
export const COUPON_USED = 4;
export const INVALID_DISCOUNT_COUPON = 12;


//Gift Vouchers
export const VOUCHER_NEW_SUBSCRIBER = 6;
export const VOUCHER_EXISTING_USER = 7;
export const VOUCHER_INVALID_COUNTRY = 8;
export const VOUCHER_INVALID_PLATFORM = 9;

//ZAIN
export const ZAIN_COUNTRY_CODE = "IQ";
export const ZAIN_COUNTRY_PHONE_CODE = "964";
export const ERROR_CODE_ZAIN_INVALID_PIN = 111;
export const ERROR_CODE_ZAIN_PIN_EXPIRED = 112;
export const ERROR_CODE_ZAIN_REQUEST_NEW_PIN = 113;
export const ERROR_CODE_ZAIN_WENT_WROUNG = 114;
export const ERROR_CODE_ZAIN_NUMBER_ALREADY_EXISTS = 1101;


//TPAY
export const TPAY_ETISALAT_COUNTRY_CODE = "EG";
export const PAYMENT_OPERATOR_DU = "DU";
export const PAYMENT_OPERATOR_JAWWAL = "Jawwal";
export const PAYMENT_OPERATOR_MOBILY = "Mobily";
export const PAYMENT_OPERATOR_OOREDOO = "Ooredoo";
export const PAYMENT_OPERATOR_ORANGE = "Orange";
export const PAYMENT_OPERATOR_STC = "STC";
export const PAYMENT_OPERATOR_UMNIAH = "Umniah";
export const PAYMENT_OPERATOR_VIVA = "viva";
export const PAYMENT_OPERATOR_VODAFONE = "Tpay_Vodafone";
export const PAYMENT_OPERATOR_ZAIN = "Zain";
export const PAYMENT_OPERATOR_WATNEYA = "Wataniah";
export const PAYMENT_OPERATOR_TUNISIA_TELECOM = "Tunisie Telecom";
export const PAYMENT_OPERATOR_TUNISIA_LIBYAN = "Libyan";
export const PAYMENT_OPERATOR_TUNISIA_MEDITEL = "Meditel";
export const PAYMENT_OPERATOR_TUNISIA_INWI = "INWI";
export const PAYMENT_OPERATOR_TUNISIA_TURKCELL = "TurkCell";
export const PAYMENT_OPERATOR_TUNISIA_AVEA = "Avea";
export const PAYMENT_OPERATOR_WE = "we";
export const TPAY_PHONE_CODE_DIGITS = 8;
export const TPAY_ACTIVATION_CODE_LIMIT = 12;
export const TPAY_PHONE_CODE_DIGITS_MIN = 7;
export const TPAY_PHONE_CODE_DIGITS_MAX = 13;
export const ERROR_CODE_TPAY_ZERO = 0;
export const ERROR_CODE_TPAY_NUMBER_ALREADY_EXISTS = 1101;
export const ERROR_CODE_TPAY_INVALID_PIN = 302;
export const ERROR_CODE_TPAY_SMS_NOT_SENT = 301;
export const ERROR_CODE_TPAY_SUBSCRIPTION_VERIFIED = 202;
export const ERROR_CODE_TPAY_LIMIT_EXCEEDED = 304;
export const ERROR_CODE_TPAY_PIN_LIMIT_EXCEEDED = 305;
export const ERROR_CODE_TPAY_PAYMENT_STATUS = -1;


export const PAYMENT_OPERATORS_TPAY = [
  PAYMENT_OPERATOR_TPAY_ETISALAT,
  PAYMENT_OPERATOR_DU,
  PAYMENT_OPERATOR_JAWWAL,
  PAYMENT_OPERATOR_MOBILY,
  PAYMENT_OPERATOR_OOREDOO,
  PAYMENT_OPERATOR_ORANGE,
  PAYMENT_OPERATOR_STC,
  PAYMENT_OPERATOR_UMNIAH,
  PAYMENT_OPERATOR_VIVA,
  PAYMENT_OPERATOR_VODAFONE,
  PAYMENT_OPERATOR_ZAIN,
  PAYMENT_OPERATOR_WATNEYA,
  PAYMENT_OPERATOR_TUNISIA_TELECOM,
  PAYMENT_OPERATOR_TUNISIA_LIBYAN,
  PAYMENT_OPERATOR_TUNISIA_MEDITEL,
  PAYMENT_OPERATOR_TUNISIA_INWI,
  PAYMENT_OPERATOR_TUNISIA_TURKCELL,
  PAYMENT_OPERATOR_TUNISIA_AVEA,
  PAYMENT_OPERATOR_WE
];

export const TPAY_OPERATOR_SHORT_CODES = {
  BH: { Viva: "98726", STC: "98726" },
  KW: { Viva: "50471", STC: "50471" },
  QA: { Tpay_Vodafone: "50471", Ooredoo: "50471" },
  BG: { EE: "80206" },
  EG: { Orange: "5030", Tpay_Vodafone: "6699", We: "4041", Tpay_Etisalat: "1722" },
  AE: { Du: "2884" },
  SA: { Zain: "708900", STC: "", Mobily: "" },
  JO: { Zain: "97970", Umniah: "91825", Orange: "99222" },
  KU: { Viva: "", Ooredoo: "", Zain: "" },
  TN: { Ooredoo: "85552", Orange: "85560", "Tunisie Telecom": "" },
  DZ: { Ooredo: "50015" },
  LY: { Libyan: "15632" },
  MA: { Meditel: "", INWI: "" },
  IQ: { Zain: "92413" },
  TR: { TurkCell: "", Avea: "", Vodafone: "" },
  PS: { Wataniah: "7825", Jawwal: "37095", Ooredoo: "7825" },

};

export const PAYMENT_OPERATOR_TPAY = "Tpay";

//info
export const PAYMENT_OPERATOR_INFO = "EE";
export const PAYMENT_OPERATOR_O2 = "o2";
export const PAYMENT_OPERATOR_THREE = "Three";
export const PAYMENT_OPERATOR_INFO_VODAFONE = "info_vodafone"

export const PAYMENT_OPERATORS_INFO = [
  PAYMENT_OPERATOR_INFO,
  PAYMENT_OPERATOR_O2,
  PAYMENT_OPERATOR_THREE,
  PAYMENT_OPERATOR_INFO_VODAFONE,
];

export const INFO_OPERATOR_SHORT_CODES = {
  GB: { EE: "80206", O2: "62442", VF: "62442", THREE: "62442", INFO_VODAFONE: "62442" }
};
export const INFO_OPERATOR_PHONE_CODE = "44";
export const INFO_COUNTRY_CODE = "GB";
export const INFO_PHONE_CODE_DIGITS = 10;
export const ERROR_CODE_INFO_NUMBER_ALREADY_EXISTS = 1101;

//Telus
export const PAYMENT_OPERATOR_TELUS = "TELUS";
export const TELUS_COUNTRY_CODE = "CA";
export const TELUS_PHONE_CODE = "1";
export const TELUS_OPERATOR_SHORT_CODES = { CA: { TELUS: "5415" } };

//static menu ids
export const HOME_RAMADAN = "113";
export const HOME_EGYPT_SERIES = "116";
export const HOME_EGYPT_MOVIES = "117";
export const HOME_SYRIAN = "118"
export const HOME_INDIA_AND_INTERNATIONAL_SERIES = "115";
export const HOME_INDIA_AND_INTERNATIONAL_MOVIES = "119";
export const HOME_SHOWS = "114";

export const DEFAULT_IMAGE_STATIC_PATH = 'https://contents-uat.weyyak.z5.com';

//CookingContest
export const CONTEST_BANNER_SQUARE = 2;
export const CONTEST_BANNER_LANDSCAPE = 3;
export const COOKING_CONTEST="سفرة-و-سفرة"
export const CONTEST_BANNER_CONTENT_TYPE = 'context-banner';
export const COOKING_CONTEST_THANKYOU="thank_you";

