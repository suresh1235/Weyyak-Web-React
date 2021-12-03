import React, { Component } from 'react';
import oResourceBundle from "app/i18n/";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actionTypes from 'app/store/action/';
import * as common from 'app/utility/common';
import * as CONSTANTS from 'app/AppConfig/constants';
import { toast } from "core/components/Toaster/";
import { Link } from 'react-router-dom';
import Spinner from "core/components/Spinner/";
import { isUserLoggedIn, isUserSubscribed } from "app/utility/common";
import { CleverTap_privacy } from 'core/CleverTap'
import RightTick from "../../../resources/assets/Symbol.png"

class ManageCookies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEssential: false,
            showPerformance: false,
            showAdvertising: false,

            EssentialToggle: true,
            PerformanceToggle: true,
            AdvertisingToggle: true,

            GoogleAnalytics: true,
            Firebase: false,
            AppsFlyer: false,

            Aiqua: false,
            GoogleAds: true,
            FacebookAds: false,
            cleverTap: true,
            GDPR_payment_data: '',
            isDataLoaded: false
        };
    }

    componentDidMount() {

        var pathArray = window.location.href.split('/');
        var path = pathArray[pathArray.length - 1];
        // this.props.startLoader();
        if (path != 'Manage-Cookies') {
            // this.props.stopLoader();
            this.setState({
                isDataLoaded: true
            })
        }


        let Lang = this.props.locale == 'en' ? 'EN' : 'AR'
        // Get Payment Gatway Details for Essentials
        this.props.fnGDPR_PaymentGateWay_Lists(this.props.countryCode, Lang);

        // Get Details for Essentials Performance, Analytics & Advertising
        this.props.fnFetchUserDetails(null, null, true);

        this.setState({
            showEssential: this.props.MoreToggle,
            showPerformance: this.props.MoreToggle,
            showAdvertising: this.props.MoreToggle,
        })
    }

    componentWillReceiveProps(props) {

        var pathArray = window.location.href.split('/');
        var path = pathArray[pathArray.length - 1];

        // let GDPR_DATA = JSON.parse(common.getCookie('GDPR_Cookies'))

        if (props && props.oUserAccountDetails) {
            this.setState({
                isDataLoaded: true
            })
            if (path == 'Manage-Cookies') {
                this.setState({
                    PerformanceToggle: props.oUserAccountDetails ? props.oUserAccountDetails.performance : "",
                    AdvertisingToggle: props.oUserAccountDetails ? props.oUserAccountDetails.advertising : "",

                    GoogleAnalytics: props.oUserAccountDetails ? props.oUserAccountDetails.googleAnalytics : "",
                    Firebase: props.oUserAccountDetails ? props.oUserAccountDetails.firebase : "",
                    AppsFlyer: props.oUserAccountDetails ? props.oUserAccountDetails.appFlyer : "",

                    Aiqua: props.oUserAccountDetails ? props.oUserAccountDetails.aique : "",
                    GoogleAds: props.oUserAccountDetails ? props.oUserAccountDetails.googleAds : "",
                    cleverTap: props.oUserAccountDetails ? props.oUserAccountDetails.cleverTap : "",
                    FacebookAds: props.oUserAccountDetails ? props.oUserAccountDetails.facebookAds : "",
                })
            }
        }



    }


    componentDidUpdate(prevProps) {

        let Lang = this.props.locale == 'en' ? 'EN' : 'AR'

        if (this.props.countryCode !== prevProps.countryCode || this.props.locale !== prevProps.locale) {
            this.props.fnGDPR_PaymentGateWay_Lists(this.props.countryCode, Lang);
        }
    }


    manageEssentialInfo = () => {
        this.setState({
            showEssential: !this.state.showEssential
        });
    };

    managePerformanceAnalyticsInfo = () => {
        this.setState({
            showPerformance: !this.state.showPerformance
        });
    };

    manageAdvertisingInfo = () => {
        this.setState({
            showAdvertising: !this.state.showAdvertising
        });
    };

    handleEssentialToggle = () => {
        this.setState({
            EssentialToggle: !this.state.EssentialToggle
        });
    };
    handlePerformanceToggle = () => {
        this.setState({
            PerformanceToggle: !this.state.PerformanceToggle,
            GoogleAnalytics: !this.state.PerformanceToggle,
            // Firebase: !this.state.PerformanceToggle,
            // AppsFlyer: !this.state.PerformanceToggle
        });
    };
    handleAdvertisingToggle = () => {
        this.setState({
            AdvertisingToggle: !this.state.AdvertisingToggle,
            GoogleAds: !this.state.AdvertisingToggle,
            cleverTap: !this.state.AdvertisingToggle,
            // Aiqua: !this.state.AdvertisingToggle,
            // FacebookAds: !this.state.AdvertisingToggle
        });
    };

    checkAllPerformanceToogle = (GoogleAnalytics) => {
        let PerformanceToogleButton = this.state.PerformanceToggle

        if (GoogleAnalytics) {
            PerformanceToogleButton = true
        } else if (!GoogleAnalytics) {
            PerformanceToogleButton = false
        } else {
            PerformanceToogleButton = this.state.PerformanceToggle
        }

        return PerformanceToogleButton
    }

    checkAllAdvertisingToogle = (GoogleAds, cleverTap) => {
        let AdvertisingToogleButton = this.state.AdvertisingToggle

        if (GoogleAds || cleverTap) {
            AdvertisingToogleButton = true
        } else if (!GoogleAds && !cleverTap) {
            AdvertisingToogleButton = false
        } else {
            AdvertisingToogleButton = this.state.AdvertisingToggle
        }

        return AdvertisingToogleButton
    }

    // checkAllPerformanceToogle = (GoogleAnalytics, Firebase, AppsFlyer) => {
    //     let PerformanceToogleButton = this.state.PerformanceToggle

    //     if (GoogleAnalytics || Firebase || AppsFlyer) {
    //         PerformanceToogleButton = true
    //     } else if (!GoogleAnalytics && !Firebase && !AppsFlyer) {
    //         PerformanceToogleButton = false
    //     } else {
    //         PerformanceToogleButton = this.state.PerformanceToggle
    //     }

    //     return PerformanceToogleButton
    // }

    //------------> Performance & Analytics related Toggle

    handleGoogleAnalyticsToggle = (toogleActive) => {
        // console.log(toogleActive)
        this.setState({
            GoogleAnalytics: !this.state.GoogleAnalytics,
            PerformanceToggle: this.checkAllPerformanceToogle(toogleActive),
        });

    }

    // handleFirebaseToggle = (toogleActive) => {
    //     this.setState({
    //         Firebase: !this.state.Firebase,
    //         PerformanceToggle: this.checkAllPerformanceToogle(this.state.GoogleAnalytics, toogleActive, this.state.AppsFlyer),
    //     });

    // }

    // handleAppsFlyerToggle = (toogleActive) => {
    //     this.setState({
    //         AppsFlyer: !this.state.AppsFlyer,
    //         PerformanceToggle: this.checkAllPerformanceToogle(this.state.GoogleAnalytics, this.state.Firebase, toogleActive)
    //     });
    // }

    //------------> Advertising related Toggle

    // handleAiquaToggle = (toogleActive) => {
    //     this.setState({
    //         Aiqua: !this.state.Aiqua,
    //         AdvertisingToggle: this.checkAllPerformanceToogle(toogleActive, this.state.GoogleAds, this.state.FacebookAds)
    //     });
    // }

    handleGoogleAdsToggle = (toogleActive) => {
        this.setState({
            GoogleAds: !this.state.GoogleAds,
            AdvertisingToggle: this.checkAllAdvertisingToogle(toogleActive, this.state.cleverTap)
            // AdvertisingToggle: this.checkAllPerformanceToogle(this.state.Aiqua, toogleActive, this.state.FacebookAds)
        });
    }

    handleCleverTapToggle = (toogleActive) => {
        // console.log(toogleActive)
        this.setState({
            cleverTap: !this.state.cleverTap,
            AdvertisingToggle: this.checkAllAdvertisingToogle(this.state.GoogleAds, toogleActive),
        });

    }

    // handleFacebookAdsToggle = (toogleActive) => {
    //     this.setState({
    //         FacebookAds: !this.state.FacebookAds,
    //         AdvertisingToggle: this.checkAllPerformanceToogle(this.state.Aiqua, this.state.GoogleAds, toogleActive)
    //     });
    // }

    CookieReturnBack = () => {
        var pathArray = window.location.href.split('/');
        var path = pathArray[pathArray.length - 1];

        if (path == 'Manage-Cookies') {
            this.props.history.push(`/${this.props.locale}/settings`);
            // window.history.back()
        } else {
            this.props.openManageCookiesSettings()
        }
    }

    CookiesPolicyOk = () => {
        var pathArray = window.location.href.split('/');
        var path = pathArray[pathArray.length - 1];

        let userInfo = this.props.oUserAccountDetails ? this.props.oUserAccountDetails : null

        let GDPR_USER_DATA = {
            fname: userInfo ? userInfo.firstName : "",
            lname: userInfo ? userInfo.lastName : "",
            email: userInfo ? userInfo.email : "",
            newsletter: userInfo ? userInfo.newslettersEnabled : "",
            promotions: userInfo ? userInfo.promotionsEnabled : "",
            country: userInfo ? userInfo.countryName : "",
            selectedCountryCode: userInfo ? userInfo.countryId : "",
            language: userInfo ? userInfo.languageName : "",
            selectedLanguageCode: userInfo ? userInfo.languageId : "",
            newsletter1: userInfo ? userInfo.privacyPolicy : "",
            newsletter2: userInfo ? userInfo.isAdult : "",
            newsletter3: userInfo ? userInfo.isRecommend : "",
            firebase: userInfo ? userInfo.firebase : "",
            appFlyer: userInfo ? userInfo.appFlyer : "",
            aique: userInfo ? userInfo.aique : "",
            facebookAds: userInfo ? userInfo.facebookAds : "",


            isGdprAccepted: true,
            performance: this.state.PerformanceToggle,
            advertising: this.state.AdvertisingToggle,

            googleAnalytics: this.state.GoogleAnalytics,
            cleverTap: this.state.cleverTap,
            googleAds: this.state.GoogleAds,

        }

        let data = {
            performance: this.state.PerformanceToggle,
            advertising: this.state.AdvertisingToggle,

            googleAnalytics: this.state.GoogleAnalytics,
            cleverTap: this.state.cleverTap,
            googleAds: this.state.GoogleAds,

            // firebase: this.state.Firebase,
            // appFlyer: this.state.AppsFlyer,
            // aique: this.state.Aiqua,
            // facebookAds: this.state.FacebookAds,
        }

        // console.log(data)

        if (path == 'Manage-Cookies') {

            this.props.handleUpdateAccount(
                GDPR_USER_DATA,
                () => {
                    //Data updated successfully
                    toast.dismiss();
                    toast.success(oResourceBundle.cookie_update_success, {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                },
                oError => {
                    if (oError) {
                        toast.dismiss();
                        toast.success(oError.description, {
                            position: toast.POSITION.BOTTOM_CENTER
                        });
                    } else {
                        toast.dismiss();
                        toast.success(oResourceBundle.something_went_wrong, {
                            position: toast.POSITION.BOTTOM_CENTER
                        });
                    }
                }
            );

            // data.expiresTime = CONSTANTS.INFINITE_COOKIE_TIME

            common.setGDPRCookie('cookies_accepted', "true")
            common.setGDPRCookie('GDPR_Cookies', data, CONSTANTS.INFINITE_COOKIE_TIME);

            // common.setCookie('GDPR_Cookies', JSON.stringify(data), CONSTANTS.INFINITE_COOKIE_TIME);
            // common.setCookie('cookies_accepted', true, CONSTANTS.INFINITE_COOKIE_TIME);

            // Clevertap user Privacy 
            CleverTap_privacy()
            this.props.history.push(`/${this.props.locale}/settings`);
            // window.history.back()
        } else {

            if (isUserLoggedIn()) {
                this.props.handleUpdateAccount(
                    GDPR_USER_DATA,
                    () => {
                        //Data updated successfully
                        toast.dismiss();
                        toast.success(oResourceBundle.cookie_update_success, {
                            position: toast.POSITION.BOTTOM_CENTER
                        });
                    },
                    oError => {
                        this.setState({ bEnableUpdateBtn: true });
                        if (oError) {
                            toast.dismiss();
                            toast.success(oError.description, {
                                position: toast.POSITION.BOTTOM_CENTER
                            });
                        } else {
                            toast.dismiss();
                            toast.success(oResourceBundle.something_went_wrong, {
                                position: toast.POSITION.BOTTOM_CENTER
                            });
                        }
                    }
                );

                // data.expiresTime = CONSTANTS.INFINITE_COOKIE_TIME
                common.setGDPRCookie('cookies_accepted', "true")
                common.setGDPRCookie('GDPR_Cookies', data, CONSTANTS.INFINITE_COOKIE_TIME);

                CleverTap_privacy()

                // common.setCookie('cookies_accepted', true, CONSTANTS.INFINITE_COOKIE_TIME)
                // common.setCookie('GDPR_Cookies', JSON.stringify(data), CONSTANTS.INFINITE_COOKIE_TIME);
            } else {

                // data.expiresTime = CONSTANTS.GDPRCookieExpires
                common.setGDPRCookie('cookies_accepted', "true")
                common.setGDPRCookie('GDPR_Cookies', data, CONSTANTS.GDPRCookieExpires);

                CleverTap_privacy()
                // common.setCookie('cookies_accepted', true, CONSTANTS.GDPRCookieExpires)
                // common.setCookie('GDPR_Cookies', JSON.stringify(data), CONSTANTS.GDPRCookieExpires);
            }



            this.props.openManageCookiesSettings()

            //     this.props.CookiesPolicyOk(data, "MG_COOKIE")

        }
    }


    render() {
        var pathArray = window.location.href.split('/');
        var path = pathArray[pathArray.length - 1];


        // let EssentialData = ['Apple sign in', 'Apple in-app purchase', 'Adyen', 'T-Pay', 'Infomedia', 'Etisalat UAE']

        let EssentialData = this.props.GDPRPaymentGatewaysList && this.props.GDPRPaymentGatewaysList.payment_providers ? this.props.GDPRPaymentGatewaysList.payment_providers : ''

        // console.log(JSON.parse(common.getCookie('GDPR_Cookies')))

        // console.log(JSON.parse(common.getServerCookie('COOKIE_USER_OBJECT')))

        return (
            <div className="latest-cookie-block" style={{ maxHeight: path == 'Manage-Cookies' ? "inherit" : 600 }} >
                {
                    this.state.isDataLoaded ?
                        <section>
                            <p className="mb-5" >
                                <b>{oResourceBundle.GDPR_Manage_Cookies_1}</b>
                            </p>
                            <p>
                                {oResourceBundle.GDPR_Manage_Cookies_2}
                            </p>
                            <p className="cookies-text">
                                {oResourceBundle.GDPR_Manage_Cookies_3} <Link
                                    to={`/${this.props.locale}/static/cookie-policy-${this.props.locale
                                        }`}
                                    aria-label={oResourceBundle.privacy_policy}
                                >
                                    <span>{oResourceBundle.cookie_policy}</span>
                                </Link> {oResourceBundle.GDPR_Manage_Cookies_4}
                            </p>

                            <div className="text-toggle-block">
                                <div className="content-text-block">
                                    <p className="mb-5">
                                        <b>{oResourceBundle.Essential}</b>
                                    </p>
                                    <p>{oResourceBundle.Essential_cookie_1}</p>
                                    <button className="d-flex align-items-center" onClick={this.manageEssentialInfo}>
                                        {this.state.showEssential ? oResourceBundle.Less : oResourceBundle.More}
                                        <div className={this.state.showEssential ? 'ml-5 arrow-up' : 'ml-5 arrow-down'} />
                                    </button>
                                    {/* <p className="d-flex align-items-center">
                    More <div className="ml-5 arrow-down" />
                  </p> */}
                                </div>
                                <div className="toggle-btn">
                                    <div className="toogle-custom-block">
                                        {/* <ToggleSwitch /> */}
                                        <div className="ToggleSwitch active">
                                            <div className="toggle-text">
                                                {oResourceBundle.Always_On}
                                            </div>
                                            <div className={this.state.EssentialToggle ? 'knob active' : 'knob'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.showEssential ? (
                                <div>
                                    <div className="dropdown-data">
                                        <ul>
                                            {/* <li>
                                                <div className="data-item">
                                                    <span>{oResourceBundle.Apple_sign_in}</span>

                                                    <div className="toggle-btn">
                                                        <div className="toogle-custom-block">
                                                            <div>
                                                                <img src={RightTick}></img>
                                                             
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li> */}
                                            {/* <li>
                                                <div className="data-item">
                                                    <span>{oResourceBundle.Apple_in_app_purchase}</span>

                                                    <div className="toggle-btn">
                                                        <div className="toogle-custom-block">
                                                            <div className='ToggleSwitch active'>
                                                                <div
                                                                    className={
                                                                        this.state.EssentialToggle ? 'knob active' : 'knob'
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li> */}
                                            {
                                                EssentialData && EssentialData.map((item) => {
                                                    return <li>
                                                        <div className="data-item">
                                                            <span>{item}</span>

                                                            <div className="toggle-btn">
                                                                <div className="toogle-custom-block">
                                                                    <div>
                                                                        <img src={RightTick}></img>
                                                                    </div>
                                                                    {/* <div className="ToggleSwitch active">

                                                                        <div
                                                                            className={
                                                                                this.state.EssentialToggle ? 'knob active' : 'knob'
                                                                            }
                                                                        />
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                })
                                            }


                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}

                            <div className="text-toggle-block">
                                <div className="content-text-block">
                                    <p className="mb-5">
                                        <b>{oResourceBundle.Performance_Analytics}</b>
                                    </p>
                                    <p>
                                        {oResourceBundle.Performance_Analytics_Cookie_1}
                                    </p>
                                    <button className="d-flex align-items-center" onClick={this.managePerformanceAnalyticsInfo}>
                                        {this.state.showPerformance ? oResourceBundle.Less : oResourceBundle.More}
                                        <div className={this.state.showPerformance ? 'ml-5 arrow-up' : 'ml-5 arrow-down'} />
                                    </button>
                                    {/* <p className="d-flex align-items-center">
                    More <div className="ml-5 arrow-down" />
                  </p> */}

                                </div>
                                <div className="toggle-btn">
                                    <div className="toogle-custom-block">
                                        {/* <ToggleSwitch /> */}
                                        <div onClick={this.handlePerformanceToggle} className={this.state.PerformanceToggle ? 'ToggleSwitch active' : 'ToggleSwitch'}>
                                            <div className="toggle-text">
                                                {this.state.PerformanceToggle ? oResourceBundle.On : oResourceBundle.Off}
                                            </div>
                                            <div className={this.state.PerformanceToggle ? 'knob active' : 'knob'} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {this.state.showPerformance ? (
                                <div>
                                    <div className="dropdown-data">
                                        <ul>
                                            <li>
                                                <div className="data-item">
                                                    <span>{oResourceBundle.Google_Analytics}</span>

                                                    <div className="toggle-btn">
                                                        <div className="toogle-custom-block">
                                                            {/* <ToggleSwitch /> */}
                                                            <div onClick={() => this.handleGoogleAnalyticsToggle(!this.state.GoogleAnalytics)} className={this.state.GoogleAnalytics ? 'ToggleSwitch active' : 'ToggleSwitch'}>
                                                                <div className="toggle-text">
                                                                    {this.state.GoogleAnalytics ? oResourceBundle.On : oResourceBundle.Off}
                                                                </div>
                                                                <div className={this.state.GoogleAnalytics ? 'knob active' : 'knob'} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}

                            <div className="text-toggle-block">
                                <div className="content-text-block">
                                    <p className="mb-5">
                                        <b>{oResourceBundle.Advertising}</b>
                                    </p>
                                    <p>
                                        {oResourceBundle.Advertising_Cookie_1}
                                    </p>
                                    <button className="d-flex align-items-center" onClick={this.manageAdvertisingInfo}>
                                        {this.state.showAdvertising ? oResourceBundle.Less : oResourceBundle.More}
                                        <div className={this.state.showAdvertising ? 'ml-5 arrow-up' : 'ml-5 arrow-down'} />
                                    </button>
                                    {/* <p className="d-flex align-items-center">
                    More <div className="ml-5 arrow-down" />
                  </p> */}

                                </div>
                                <div className="toggle-btn">
                                    <div className="toogle-custom-block">
                                        {/* <ToggleSwitch /> */}
                                        <div onClick={this.handleAdvertisingToggle} className={this.state.AdvertisingToggle ? 'ToggleSwitch active' : 'ToggleSwitch'}>
                                            <div className="toggle-text">
                                                {this.state.AdvertisingToggle ? oResourceBundle.On : oResourceBundle.Off}
                                            </div>
                                            <div className={this.state.AdvertisingToggle ? 'knob active' : 'knob'} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {this.state.showAdvertising ? (
                                <div>
                                    <div className="dropdown-data">
                                        <ul>
                                            {/* <li>
                                        <div className="data-item">
                                            <span>{oResourceBundle.Mobile_Push_Notifications_Aiqua}</span>

                                            <div className="toggle-btn">
                                                <div className="toogle-custom-block">
                                                    <div onClick={() => this.handleAiquaToggle(!this.state.Aiqua)} className={this.state.Aiqua ? 'ToggleSwitch active' : 'ToggleSwitch'}>

                                                        <div
                                                            className={
                                                                this.state.Aiqua ? 'knob active' : 'knob'
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li> */}
                                            <li>
                                                <div className="data-item">
                                                    <span>{oResourceBundle.Google_Ads}</span>

                                                    <div className="toggle-btn">
                                                        <div className="toogle-custom-block">
                                                            <div onClick={() => this.handleGoogleAdsToggle(!this.state.GoogleAds)} className={this.state.GoogleAds ? 'ToggleSwitch active' : 'ToggleSwitch'}>
                                                                <div className="toggle-text">
                                                                    {this.state.GoogleAds ? oResourceBundle.On : oResourceBundle.Off}
                                                                </div>
                                                                <div
                                                                    className={
                                                                        this.state.GoogleAds ? 'knob active' : 'knob'
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="data-item">
                                                    <span>{oResourceBundle.cleverTap}</span>

                                                    <div className="toggle-btn">
                                                        <div className="toogle-custom-block">
                                                            {/* <ToggleSwitch /> */}
                                                            <div onClick={() => this.handleCleverTapToggle(!this.state.cleverTap)} className={this.state.cleverTap ? 'ToggleSwitch active' : 'ToggleSwitch'}>
                                                                <div className="toggle-text">
                                                                    {this.state.cleverTap ? oResourceBundle.On : oResourceBundle.Off}
                                                                </div>
                                                                <div className={this.state.cleverTap ? 'knob active' : 'knob'} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* <li>
                                        <div className="data-item">
                                            <span>{oResourceBundle.Facebook_Ads}</span>

                                            <div className="toggle-btn">
                                                <div className="toogle-custom-block">
                                                    <div onClick={() => this.handleFacebookAdsToggle(!this.state.FacebookAds)} className={this.state.FacebookAds ? 'ToggleSwitch active' : 'ToggleSwitch'}>

                                                        <div
                                                            className={
                                                                this.state.FacebookAds ? 'knob active' : 'knob'
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li> */}

                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}


                            <div className="cookie-btn-group">
                                <button className="new-stroke-btn" onClick={this.CookieReturnBack}>
                                    {' '}
                                    {oResourceBundle.btn_cancel}{' '}
                                </button>
                                <button className="new-orange-btn" style={{ padding: "0px 20px" }} onClick={this.CookiesPolicyOk}>
                                    {' '}
                                    {oResourceBundle.Save_my_settings}{' '}
                                </button>
                            </div>

                        </section> : <Spinner />}

            </div>

        );
    }
}



const mapStateToProps = (state) => {
    return {
        locale: state.locale,
        countryCode: state.sCountryCode,
        GDPRPaymentGatewaysList: state.aGDPRPaymentGatewaysList,
        oUserAccountDetails: state.oUserAccountDetails,
    };
};

/**
 * Component Name - ManageCookies
 * method that maps state to props.
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = (dispatch) => {
    //dispatch action to redux store
    return {
        fnGDPR_PaymentGateWay_Lists: (sCountryCode, sLocale) => {
            dispatch(
                actionTypes.fnGDPR_PaymentGateWay_Lists(
                    sCountryCode,
                    sLocale
                )
            );
        },
        fnFetchUserDetails: (fnSuccess, fnFailed, bShouldDispatch) => {
            dispatch(
                actionTypes.fnFetchUserDetails(fnSuccess, fnFailed, bShouldDispatch)
            );
        },
        handleUpdateAccount: (currentStateValues, fnSuccess, fnFailed) => {
            dispatch(
                actionTypes.fnHandleUpdateAccount(
                    currentStateValues,
                    fnSuccess,
                    fnFailed
                )
            );
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageCookies));
