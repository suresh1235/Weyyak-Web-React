import React from "react";
import { Link } from "react-router-dom";
import BaseContainer from "core/BaseContainer/";
import { connect } from "react-redux";
import * as CONSTANTS from "../../../AppConfig/constants";
import * as actionTypes from "app/store/action/";
import * as common from "app/utility/common";
import Input from "../../../../core/components/Input/";
import Button from "../../../../core/components/Button/";
import Dialog from "core/components/Dialog";
import oResourceBundle from "app/i18n/";
import CheckBox from "core/components/Checkbox";
import withTracker from "core/GoogleAnalytics/";
import SelectBox from "core/components/SelectBox";
import { isUserLoggedIn, isValidEmail, isValidFullname } from "app/utility/common";
import Spinner from "core/components/Spinner";
import PhoneInput from "../../components/PhoneInput/";
import { toast } from "core/components/Toaster/";
import ReactHtmlParser from 'react-html-parser';
import safrawsefra from "app/resources/assets/thumbnail/Safra-W-SefraPoster.png"
import safrawsefra1 from "app/resources/assets/thumbnail/safra-w-sefra-banner.png"
import safrawsefra2 from "app/resources/assets/thumbnail/safra-w-sefra-sticker.png"
import safrawseframobile from "app/resources/assets/thumbnail/safra-w-sefra-mobile-sticker.png"
import safrawseframobile1 from "app/resources/assets/thumbnail/safra-w-sefra-mobile-banner.png"

import "./index.scss";
import { isMobile } from "react-device-detect";

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
class CookingContest extends BaseContainer {
  /**
   * Represents CookingContest.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      fname: "",
      email: "",
      mobile: "",
      countryCode: "",
      travel_confirmation: false,
      age_confirmation: false,
      travel_confirmed: false,
      age_confirmed: false,
      dialogMessage: {},
      showDialog: false,
      errorMessage: {
        fname: "",
        email: "",
        mobile: ""
      },
      gender: 'male',
      showCountrySelectBox: false,
      showAgeSelectBox: false,
      ageChanged:false,
      showNationalitySelectBox: false,
      country: "",
      selectedCountryCode: null,
      selectedNationalityCode: null,
      selectedAge: null,
      bEnableUpdateBtn: false,
      showErrorDialog: false,
      showErrorDialogMessage: "",
      emailErrorText: "",
      bEmailValid: false,
      bMobileValid: false,
      bFullNameValid: false,
      showMobileVerification: false,
      language: "",
      ageGroup: "",
      };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.fnScrollToTop();
    this.props.fnFetchCountryList(this.props.locale);
    if (isUserLoggedIn()) {
      this.props.fnFetchUserDetails(null, null, true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.loginDetails && !this.props.loginDetails["bSuccessful"]) {
      this.props.history.push(`/${this.props.locale}/${CONSTANTS.LOGIN}`);
    }
    if (this.props.locale !== prevProps.locale) {
      this.props.fnFetchCountryList(this.props.locale)
    }
  }


  /**
   * Component Name - CookingContest
   * Update button button enable/ disable
   * @param {null}
   */
  fnSetUpdateButtonEnabled() {
    if (
      (this.state.fname && this.state.fname.trim() !== "") && this.state.bEmailValid && this.state.gender && this.state.countryChanged &&
      this.state.nationalityChanged && this.state.travel_confirmed && this.state.age_confirmed && this.state.bMobileValid && this.state.ageChanged) {
      this.setState({ bEnableUpdateBtn: true });
    } else {
      this.setState({ bEnableUpdateBtn: false });
    }
  }

  /**
   * Component Name - CookingContest
   * Form Inputs Changes, Updating the State.
   * @param {object} eve - Event hanlder
   */
  handleFormInputs(eve) {
    const { name, value } = eve.target;
    const text = value;
    if (text.trim() === "") {
      this.setState({
        bFullNameValid: true,
        fullnameErrorText: ""
      });
    } else {
      if (!isValidFullname(text)) {
        this.setState({
          bFullNameValid: false,
          fullnameErrorText: oResourceBundle.fname_invalid
        });
      } else {
        this.setState({ bFullNameValid: true, fullnameErrorText: "" });
      }
    }
    this.setState({ [name]: value }, this.fnSetUpdateButtonEnabled);
  }
  /**
   * Component Name - CookingContest
   * Form Inputs Changes, Updating the State and check for the validations.
   * @param {object} eve - Event hanlder
   */
  updateWindowDimensions() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobileView: window.innerWidth < CONSTANTS.MOBILE_VIEW_THRESHOLD
    });
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  handleEmailOnChange(event) {
    const text = event.target.value;
    if (text.trim() === "") {
      this.setState({
        bEmailValid: false,
        emailErrorText: ""
        /* emailErrorText: oResourceBundle.email_empty */
      });
    } else {
      if (!isValidEmail(text)) {
        this.setState({
          bEmailValid: false,
          emailErrorText: oResourceBundle.email_invalid
        });
      } else {
        this.setState({ bEmailValid: true, emailErrorText: "" });
      }
    }
    this.setState({ email: text.trim() }, this.fnSetUpdateButtonEnabled);
  }
  /**
   * Component Name - CookingContest
   *  Checkbox Changes, Updating the State.
   * @param {object} oEvent - Event hanlder
   */
  handleTravelConfirmation(oEvent) {
    this.setState(
      {
        travel_confirmed: oEvent.target.checked
      },
      this.fnSetUpdateButtonEnabled
    );
  }
  handleAgeConfirmed(oEvent) {
    this.setState(
      {
        age_confirmed: oEvent.target.checked,
      },
      this.fnSetUpdateButtonEnabled
    );
  }

  handleGender(oEvent) {
    this.setState(
      {
        gender: oEvent.target.value,
      },
      this.fnSetUpdateButtonEnabled
    );
  }

  /**
   * Component Name - CookingContest
   * show country drop down
   * @param {null}
   */
  countryShowToggle(oEvent) {
    this.setState(newState => ({
      showCountrySelectBox: !newState.showCountrySelectBox,
      showNationalitySelectBox: false
    }));
    oEvent.stopPropagation();
  }

  nationalityShowToggle(oEvent) {
    this.setState(newState => ({
      showNationalitySelectBox: !newState.showNationalitySelectBox,
      showCountrySelectBox: false
    }));
    oEvent.stopPropagation();
  }
  ageShowToggle(oEvent) {
    this.setState(newState => ({
      showAgeSelectBox: !newState.showAgeSelectBox,
      showCountrySelectBox: false,
      showNationalitySelectBox: false
    }));
    oEvent.stopPropagation();
  }

  /**
   * Component Name - CookingContest
   * country drop down selection change
   * @param {null}
   */
  handleChangeCountrySelection(oEvent, index, sSelectedCountryKey) {
    this.setState(
      {
        country: oEvent.target.innerText,
        selectedCountryCode: sSelectedCountryKey,
        countryChanged: true
      },
      this.fnSetUpdateButtonEnabled
    );
    if(isMobile) {
      document.getElementById('country_label').style.display='none';
    }
  }
  /**
   * Component Name - CookingContest
   * Nationality drop down selection change
   * @param {null}
   */
  handleChangeNationalitySelection(oEvent, index, sSelectedCountryKey) {
    this.setState(
      {
        nationality: oEvent.target.innerText,
        selectedNationalityCode: sSelectedCountryKey,
        nationalityChanged: true
      },
      this.fnSetUpdateButtonEnabled
    );
    if(isMobile) {
      document.getElementById('nationality_label').style.display='none';
    }
  }

  /**
 * Component Name - CookingContest
 * AgeGroup drop down selection change
 * @param {null}
 */
  handleChangeAgeSelection(oEvent, index, ageGroup) {
    this.setState(
      {
        ageGroup: oEvent.target.innerText,
        selectedAge: ageGroup,
        ageChanged: true
      },
      this.fnSetUpdateButtonEnabled
    );
  }



  /**
   * Component Name - CookingContest
   * Hide error dialog
   * @param {null}
   */
  hideErrorDialog() {
    this.setState({
      showErrorDialog: false
    });
  }
  resetForm() {
    this.setState({
      fname: "",
      email: "",
      mobile: "",
      countryCode: "",
      travel_confirmation: false,
      age_confirmation: false,
      travel_confirmed: false,
      age_confirmed: false,
      dialogMessage: {},
      showDialog: false,
      errorMessage: {
        fname: "",
        email: "",
        mobile: ""
      },
      gender: 'male',
      showCountrySelectBox: false,
      showAgeSelectBox: false,
      showNationalitySelectBox: false,
      country: "",
      selectedCountryCode: null,
      selectedNationalityCode: null,
      selectedAge: null,
      bEnableUpdateBtn: false,
      showErrorDialog: false,
      showErrorDialogMessage: "",
      emailErrorText: "",
      bEmailValid: false,
      bMobileValid: false,
      showMobileVerification: false,
      language: "",
      ageGroup: ""
    });
  }
  /**
   * Component Name - CookingContest
   * Update accout button press
   * @param {null}
   */
  handleSubmitContest() {
    this.setState({ bEnableUpdateBtn: false });
    this.setState({ language: this.props.locale })
    this.props.fnHandleSubmitContest(
      this.state,
      () => {
        //this.resetForm()
        this.props.history.push(`/${this.props.locale}/${CONSTANTS.COOKING_CONTEST_THANKYOU}`);
        // toast.dismiss();
        // toast.success(oResourceBundle.contest_submitted, {
        //   position: toast.POSITION.BOTTOM_CENTER
        // });
      },
      oError => {
        this.setState({ bEnableUpdateBtn: true });
        if (oError) {
          toast.dismiss();
          toast.success(oResourceBundle[oError.code], {
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
  }

  /**
   * Component Name - CookingContest
   * Update accout button press
   * @param {null}
   */
  handleSignoutAllClicked() {
    this.props.fnSignOutFromAllDevices(
      () => {
        //Device Logout success
      },
      () => {
        //Device Logout failedCHANGE_PASSWORD
      }
    );
    this.setState({ showDialog: false });
  }

  /**
   * Component Name - CookingContest
   * Update accout button press
   * @param {oEvent}
   */
  handleMobileInputChanged(oEvent) {
    const { value } = oEvent.target;
    const numberRegex = /^\+?[0-9]*$/;

    if (!numberRegex.test(value)) {
      return;
    }

    if (value.trim() === "") {
      this.setState({
        errorMessage: {
          ...this.state.errorMessage,
          mobile: ""
        },
        bMobileValid: true
      });
    } else if (
      !numberRegex.test(value) ||
      value.length < CONSTANTS.MIN_MOBILE_NUMBER ||
      value.length > CONSTANTS.MAX_MOBILE_NUMBER
    ) {
      this.setState({
        errorMessage: {
          ...this.state.errorMessage,
          mobile: oResourceBundle.mobile_invalid
        },
        bMobileValid: false
      });
    } else {
      this.setState({
        bMobileValid: true,
        errorMessage: {
          ...this.state.errorMessage,
          mobile: ""
        }
      });
    }
    this.setState({ mobile: value.trim() }, this.fnSetUpdateButtonEnabled);
  }
  /**
   * Component Name - CookingContest
   * Update accout button press
   * @param {oEvent}
   */
  onPhoneChanged(text, country) {
    try {
      // debugger;
      this.setState({
        mobile: text,
        countryCode: country.code,
        showMobileVerification: this.state.savedMobile !== text ? true : false
      }, this.fnSetUpdateButtonEnabled.bind(this));
      if (
        text.length > 5 &&
        phoneUtil.isValidNumber(phoneUtil.parse(text, country.code))
      ) {
        this.setState({
          bMobileValid: true, errorMessage: {
            ...this.state.errorMessage,
            mobile: ""
          }
        });
      } else {
        this.setState({
          bMobileValid: false, errorMessage: {
            ...this.state.errorMessage,
            mobile: oResourceBundle.mobile_invalid
          }
        });
      }
    } catch (e) {
      this.setState({
        bMobileValid: false, errorMessage: {
          ...this.state.errorMessage,
          mobile: oResourceBundle.mobile_invalid
        }
      });
    }
  }

  /**
   * Component Name - CookingContest
   * Key press on search input.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onPasswordInputkeyPress(oEvent) {
    if (
      oEvent.keyCode === CONSTANTS.ENTER_KEYCODE &&
      this.state.bEnableUpdateBtn
    ) {
      this.handleUpdateBtnClicked();
    }
  }

  handleMobileVerification() {
    if (this.state.showMobileVerification) {
      const data = {
        phonenumber: common.getRawNumber(this.state.mobile),
        requestType: CONSTANTS.OTP_REQUEST_UPDATE_PHONE_NUMBER
      };
      this.props.sendOTPCode(
        data,
        this.sendSuccess.bind(this),
        this.sendError.bind(this)
      );
    }
  }

  sendSuccess() {
    let oNewUserDetails = {
      phoneNumber: common.getRawNumber(this.state.mobile),
      myAccountUpdate: true
    };
    this.props.fnSaveNewUserDetails(oNewUserDetails);
    this.props.history.push(
      `/${this.props.locale}/${CONSTANTS.MOBILE_VERIFICATION}`
    );
  }

  sendError(er) {
    let text = oResourceBundle.something_went_wrong;
    try {
      if (
        er.response.data.invalid.phoneNumber.code === CONSTANTS.PHONE_ALREADY_EXISTS
      ) {
        text = oResourceBundle.error_user_phone_already_exists;
      } else if (
        er.response.data.invalid.phoneNumber.code === CONSTANTS.INVALID_PHONE_NUMBER
      ) {
        text = oResourceBundle.mobile_invalid;
      }
    } catch (ex) {
      text = oResourceBundle.something_went_wrong;
    }
    common.showToast(
      CONSTANTS.REGISTER_ERROR_TOAST_ID,
      text,
      toast.POSITION.BOTTOM_CENTER
    );
  }

  /**
   * Component Name - Cooking Contest 
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    //const country = CONSTANTS.COUNTRY_LIST_SIGNUP;
    const country = this.props.aCountryList;
    const seoTitle = oResourceBundle.website_meta_title;
    const description = oResourceBundle.website_meta_description;
    const oMetaObject = this.fnConstructMetaTags(
      seoTitle,
      window.location.href,
      description
    );

    const ageGroup = [{ key: '1', text: '18-24', title: '18-24' }
      , { key: '2', text: '25-34', title: '25-34' }
      , { key: '3', text: '35-44', title: '35-44' }
      , { key: '4', text: '45-54', title: '45-54' }
      , { key: '5', text: '55-64', title: '55-64' }
      , { key: '6', text: '65+', title: '65+' }
    ];
    const oMetaTags = this.fnUpdateMetaTags(oMetaObject);
    const showButton = true;
    let selected, nationalitySelection, selectedAge;
    if (country.length > 0) {
      selected = this.state.selectedCountryCode
        ? country[
          country.findIndex(ele => ele.key === this.state.selectedCountryCode)
        ].text : " ";
        
      nationalitySelection = this.state.selectedNationalityCode ?
       country[country.findIndex(ele => ele.key === this.state.selectedNationalityCode)].text :
       
       "";
    }
    selectedAge = (this.state.ageGroup && this.state.ageGroup != oResourceBundle.contest_age_group) ? this.state.ageGroup : "-";
  let bannerHTML = (<div className="cooking-contest-container">
  <div className="cookingcontest-banner">
    <img src={safrawsefra1} />
  </div>
  <div className="cookiking-contest-banner-sticker">
    <img src={safrawsefra2} />
  </div>
</div>)

    return  (
      <React.Fragment>
        {oMetaTags}
        <div className="cooking-main-container">
        {bannerHTML}
        <div className="cookingcontest-text">
          <div className="cooking-contest-heading">
            <h1>{oResourceBundle.cooking_contest_title}</h1>
            <div className="cookingcontest-txtspacing">
             <div className="hightlighted-text"><span>{oResourceBundle.cooking_contest_subtitle1}</span></div>
              <div className="normal-text"><span>{oResourceBundle.cooking_contest_subtitle2}</span></div>
            </div>
            <div className="cookingcontest-txtspacing">
              <div className="normal-middle-text">{oResourceBundle.cooking_contest_subtitle3}</div>
              <div className="normal-text"><span>{oResourceBundle.cooking_contest_subtitle4}</span></div>
            </div>
            <div className="end-hightlighted-text">{oResourceBundle.cooking_contest_subtitle5}</div>
          </div>
        </div>
        <div className="myaccount-container">
          <div className="myaccount">
            <React.Fragment>
              <section className="form-myaccount" name="formMyAccount">
                <div className="row">
                  <div className="input-label-fname left-column">
                  <span className="input-label">{oResourceBundle.fullname}</span>
                    <div className="inner-column">
                  <Input
                        type="text"
                        name="fname"
                        id="fname"
                        autoComplete="off"
                        className="first-name"
                        value={this.state.fname}
                        onKeyDown={this.onPasswordInputkeyPress.bind(this)}
                        onChange={this.handleFormInputs.bind(this)}
                      />
                     <span className="error-text">
                        {this.state.fullnameErrorText}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="left-column">

                    <div className="inner-column">
                      <div className="email-conaitner">
                        <div className="input-label-mobile email-input">
                        <span className="input-label">{oResourceBundle.mobile}</span>
                         <Input
                            // placeholder={oResourceBundle.mobile}
                            type="text"
                            name="mobile"
                            autoComplete="off"
                            className={"mobile-input"}
                            // value={this.state.mobile}
                            onKeyDown={this.onPasswordInputkeyPress.bind(this)}
                            onChange={this.handleMobileInputChanged.bind(this)}
                          />
                          
                          {this.props.countryCode && (
                            <form className="form" name="form">
                              <PhoneInput
                                defaultCountry={this.props.countryCode.toLowerCase()}
                                onPhoneChanged={this.onPhoneChanged.bind(this)}
                                onKeyDown={this.onPasswordInputkeyPress.bind(this)}
                                placeholder=""
                                // initialValue={this.state.mobile}
                              />
                               {/* <span>{oResourceBundle.mobile}</span> */}
                            </form>
                          )}
                          </div>
                          <span className="error-text">
                            {this.state.errorMessage.mobile}
                          </span>

                        </div>
                      </div>
                    </div>
                  </div>
                
                  <div className="row">
                    <div className="left-column">
                      <div className="inner-column">
                        <div className="mobile-input-container">
                          <div className="input-label-email">
                           
                          <span className="input-label">{oResourceBundle.email}</span>
                            <Input
                              // placeholder={oResourceBundle.email}
                              type="email"
                              name="email"
                              autoComplete="off"
                              className={[
                                "sign-up-email" /* ,
                                  this.state.bEmailValid ? "" : "error" */
                              ].join(" ")}
                              value={this.state.email}
                              onKeyDown={this.onPasswordInputkeyPress.bind(
                                this
                              )}
                              onChange={this.handleEmailOnChange.bind(this)}
                            />
                          
                            <span className="error-text">
                              {this.state.emailErrorText}
                            </span>
                            {/* <Input
                                placeholder={oResourceBundle.mobile}
                                type="text"
                                name="mobile"
                                autoComplete="off"
                                className={"mobile-input"}
                                value={this.state.mobile}
                                onKeyDown={this.onPasswordInputkeyPress.bind(this)}
                                onChange={this.handleMobileInputChanged.bind(this)}
                              />
                              {this.props.countryCode && (
                                <form className="form" name="form">
                                  <PhoneInput
                                    defaultCountry={this.props.countryCode.toLowerCase()}
                                    onPhoneChanged={this.onPhoneChanged.bind(this)}
                                    onKeyDown={this.onPasswordInputkeyPress.bind(this)}
                                    initialValue={this.state.mobile}
                                  />
                                </form>
                              )} */}

                          </div>
                          {/* <div
                              role="button"
                              className={
                                "verify" +
                                (this.state.showMobileVerification
                                  ? " show"
                                  : "")
                              }
                              tabIndex="0"
                              onClick={this.handleMobileVerification.bind(this)}
                            >
                              {oResourceBundle.mobile_verification_button}
                            </div> */}
                        </div>
                      </div>
                    </div>
                   </div>
                  
                  <div className="row">
                    <div className="left-column">
                      <div className="inner-column">
                      <span className="input-label">{oResourceBundle.contest_age_group}</span>
                        <SelectBox
                          className={
                            this.state.showAgeSelectBox ? "open" : ""
                          }
                          show={this.state.showAgeSelectBox}
                          items={ageGroup}
                          selected={selectedAge}
                          showButton={showButton}
                          showToggle={this.ageShowToggle.bind(this)}
                          onChange={this.handleChangeAgeSelection.bind(
                            this
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="custom-radio">
                    <span className="gender-title">{oResourceBundle.gender}</span>
                    <div class="radio">
                      <input id="radio-1" name="gender" type="radio" value='male' checked={this.state.gender == 'male' ? true : false} onClick={this.handleGender.bind(this)} />
                      <label for="radio-1" class="radio-label">{oResourceBundle.male}</label>
                    </div>
                    <div class="radio">
                      <input id="radio-2" name="gender" type="radio" value='female' checked={this.state.gender == 'female' ? true : false} onClick={this.handleGender.bind(this)} />
                      <label for="radio-2" class="radio-label">{oResourceBundle.female}</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="left-column">
                      <div className="inner-column">
                      <span className="input-label" id='country_label'>{oResourceBundle.contest_select_country}</span>
                        <SelectBox
                          className={
                            this.state.showCountrySelectBox ? "open" : ""
                          }
                          show={this.state.showCountrySelectBox}
                          items={country}
                          selected={selected}
                          showButton={showButton}
                          showToggle={this.countryShowToggle.bind(this)}
                          onChange={this.handleChangeCountrySelection.bind(
                            this
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="left-column">
                      <div className="inner-column">
                      <span className="input-label" id='nationality_label'>{oResourceBundle.contest_select_nationality}</span>
                        <SelectBox
                          className={
                            this.state.showNationalitySelectBox ? "open" : ""
                          }
                          show={this.state.showNationalitySelectBox}
                          items={country}
                          selected={nationalitySelection}
                          showButton={showButton}
                          showToggle={this.nationalityShowToggle.bind(this)}
                          onChange={this.handleChangeNationalitySelection.bind(
                            this
                          )}
                        />
                      </div>
                    </div>
                  </div>
                
              </section>
              {/* Consent check box area */}
              <div className="my-account-checkboxes cooking-check-boxes">
                <CheckBox
                  onChange={this.handleAgeConfirmed.bind(this)}
                  selected={this.state.age_confirmed}
                  value={this.state.age_confirmation}
                  name="age_confirmation"
                  text={oResourceBundle.cooking_contest1}
                />
                <CheckBox
                  onChange={this.handleTravelConfirmation.bind(this)}
                  selected={this.state.travel_confirmed}
                  value={this.state.travel_confirmation}
                  name="travel_confirmation"
                  text={oResourceBundle.cooking_contest2}
                />
              </div>
              <section className="my-account-action-buttons">
                <Button
                  className="btn-device-pair"
                  onClick={this.handleSubmitContest.bind(this)}
                  disabled={!this.state.bEnableUpdateBtn}
                >
                  {/* {oResourceBundle.update} */}
                  <span>{oResourceBundle.cooking_submit}</span>
                </Button>
              </section>
            </React.Fragment>
          </div>
        </div>
        {this.props.loading ? <Spinner /> : null}
        </div>
      </React.Fragment>) 
      // <div class='cooking-main-container contest-thankyou'>{bannerHTML}
      // <div className="thankyou-text">{oResourceBundle.contest_submitted}</div>
      // <div className="thankyou-text1">{oResourceBundle.contest_thankyou_text1}</div>
      // <div className="thankyou-text1">{oResourceBundle.contest_thankyou_text2}</div>
      // </div>
      
    


  }
}

/**
 * method that maps state to props.
 * Component - CookingContest
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    fnFetchUserDetails: (fnSuccess, fnFailed, bShouldDispatch) => {
      dispatch(
        actionTypes.fnFetchUserDetails(fnSuccess, fnFailed, bShouldDispatch)
      );
    },
    fnHandleSubmitContest: (currentStateValues, fnSuccess, fnFailed) => {
      dispatch(
        actionTypes.fnHandleSubmitContest(
          currentStateValues,
          fnSuccess,
          fnFailed
        )
      );
    },
    fnSignOutFromAllDevices: (fnSuccess, fnFailed) => {
      dispatch(actionTypes.fnSignOutFromAllDevices(fnSuccess, fnFailed));
    },
    sendOTPCode: (data, sendSuccess, sendError) => {
      dispatch(actionTypes.sendOTPCode(data, sendSuccess, sendError));
    },
    fnSaveNewUserDetails: newUserDetails => {
      dispatch(actionTypes.fnSaveNewUserDetails(newUserDetails));
    },
    fnFetchCountryList: sLanguageCode => {
      dispatch(actionTypes.fnFetchCountryList(sLanguageCode));
    }
  };
};

/**
 * Component - Cooking Contest
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    oUserAccountDetails: state.oUserAccountDetails,
    loading: state.loading,
    loginDetails: state.loginDetails,
    aCountryList: state.aCountryList,
    countryCode: state.sCountryCode
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CookingContest)
);