import React, { Component } from "react";
import { connect } from "react-redux";
import * as constants from "app/AppConfig/constants";
import * as common from "app/utility/common";
import * as actionTypes from "app/store/action/";
import "url-search-params-polyfill";
import Spinner from "core/components/Spinner";
import Logger from "core/Logger";
import { CleverTap_UserEvents } from 'core/CleverTap'
import * as CONSTANTS from "../../../AppConfig/constants";
import oResourceBundle from "app/i18n/";
import { toast } from "core/components/Toaster/";

import {
    sendEvents
} from "core/GoogleAnalytics/";



class AppleToken extends Component {
    MODULE_NAME = "AppleToken";

    constructor(props) {
        super(props);
        this.state = {
            twitterAccessToken: null
        };
        this.redirectDone = false;
    }
    componentDidMount() {
        Logger.log(this.MODULE_NAME, "componentDidMount");
        const path = this.props.location.pathname
        let data = path.split("token=");
        let token = data[1];
        let finalResponseApple = JSON.parse(decodeURIComponent(token))
        let AppleResponse = ''

        if (finalResponseApple && finalResponseApple.error == "user_cancelled_authorize") {
            let langdata = data[0].split("/");
            let lang = langdata[1]

            window.location.href = `/${lang}/login`
        } else {

            AppleResponse = {
                code: finalResponseApple.code,
                id_token: finalResponseApple.id_token,
                user: finalResponseApple.user ? JSON.parse(finalResponseApple.user) : null
            }
        }

        // console.log(finalResponseApple);


        sendEvents(
            CONSTANTS.LOGIN_CATEGORY,
            CONSTANTS.LOGIN_ACTION,
            CONSTANTS.APPLE_LOGIN_ACTION
        );
        if (finalResponseApple && finalResponseApple.id_token) {
            this.props.fnSendAppleLoginResponse(
                AppleResponse,
                CONSTANTS.GRANT_TYPE_APPLE,
                () => {

                    this.props.fnFetchUserDetails((loginResponse) => {
                        this.props.fnupdateGDPRCookieData(loginResponse)
                        let userData = loginResponse.userDetails
                        userData.userId = common.getUserId()
                        CleverTap_UserEvents("LoginEvent", userData)
                        // this.updateGDPRCookieData(loginResponse)
                    }, null, true);


                    common.redirectAfterLogin.call(this);
                    sendEvents(CONSTANTS.LOGIN_CATEGORY, CONSTANTS.APPLE_LOGIN_ACTION);
                },

                this.fnAppleError.bind(this)
            );
            // this.props.fnUpdateUserDetails(
            //   oCreateAcctUserData
            // );
        }
    }

    fnAppleError() {
        common.showToast(
            CONSTANTS.REGISTER_ERROR_TOAST_ID,
            oResourceBundle.something_went_wrong,
            toast.POSITION.BOTTOM_CENTER
        );
    }


    async userDataDone() {
        Logger.log(this.MODULE_NAME, "userDataDone");
        if (!this.redirectDone) {
            this.redirectDone = true;
            common.redirectAfterLogin.call(this);
            sendEvents(constants.LOGIN_CATEGORY, constants.TWITTER_LOGIN_ACTION);
        }
    }

    // componentDidUpdate() {
    //     if (this.props.twitterAccessToken) {
    //         const params = new URLSearchParams(this.props.twitterAccessToken);
    //         const response = {
    //             accessToken: params.get("oauth_token"),
    //             accessTokenSecret: params.get("oauth_token_secret"),
    //             name: params.get("screen_name")
    //         };
    //         this.props.fnSendSocialLoginResponse(
    //             response,
    //             constants.GRANT_TYPE_TWITTER,
    //             this.userDataDone.bind(this),
    //             this.userDataDone.bind(this)
    //         );
    //     }
    // }


    // responseFromApple(AppleResponse) {
    //     console.log("------>", AppleResponse)
    // }

    render() {
        return <Spinner />;
        // return <AppleLogin
        //     clientId={"com.weyyak.serviceid"}
        //     redirectURI={"https://webqa.weyyak.com/en/apple-token"}
        //     responseType={"code"}
        //     scope='name email'
        //     responseMode={"query"}
        //     // callback={this.responseFromApple.bind(this)}
        //     designProp={
        //         {
        //             height: 55,
        //             width: 375,
        //             color: "white",
        //             border: false,
        //             type: "sign-in",
        //             border_radius: 15,
        //             scale: 1,
        //             locale: "en_US",
        //         }
        //     }
        // />;
    }
}


const mapStateToProps = state => {
    return {
        twitterAccessToken: state.twitterAccessToken
    };
};


const mapDispatchToProps = dispatch => {
    //dispatch action to redux store
    return {
        fnupdateGDPRCookieData: newUserDetails => {
            dispatch(actionTypes.fnupdateGDPRCookieData(newUserDetails));
        },
        fnFetchUserDetails: (fnSuccess, fnFailed, bShouldDispatch) => {
            dispatch(
                actionTypes.fnFetchUserDetails(fnSuccess, fnFailed, bShouldDispatch)
            );
        },
        fnSendAppleLoginResponse: (AppleResponse, grantType, fnAppleSuccess, fnAppleError) => {
            dispatch(
                actionTypes.fnSendAppleLoginResponse(
                    AppleResponse,
                    grantType,
                    fnAppleSuccess,
                    fnAppleError
                )
            );
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppleToken);
