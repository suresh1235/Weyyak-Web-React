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
import {sendEvents} from "core/GoogleAnalytics/";
import Label from "core/components/Label";
import { isUserLoggedIn, isValidEmail } from "app/utility/common";
import Spinner from "core/components/Spinner";
import PhoneInput from "../../components/PhoneInput/";
import { toast } from "core/components/Toaster/";
import ReactHtmlParser from 'react-html-parser';
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

import "./index.scss";

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
class MyAccount extends BaseContainer {
  /**
   * Represents MyAccount.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      mobile: "",
      newsletter: false,
      newsletter1: false,
      newsletter2: false,
      newsletter3: false,
      newsletter4: false,
      promotions: false,
      playnext: false,
      dialogMessage: {},
      showDialog: false,
      errorMessage: {
        fname: "",
        lname: "",
        email: "",
        password: "",
        mobile: ""
      },
      showCountrySelectBox: false,
      showLanguageSelectBox: false,
      country: "",
      selectedCountryCode: null,
      language: "",
      selectedLanguageCode: "",
      bEnableUpdateBtn: false,
      showErrorDialog: false,
      showErrorDialogMessage: "",
      emailErrorText: "",
      bEmailValid: true,
      bMobileValid: true,
      showMobileVerification: false,
      checkboxChanged1: false,
      checkboxChanged2: false,
      checkboxChanged3: false,
      isAdult:false,
      isRecommend:false,
      privacyPolicy:false,
    };
  }

  componentDidMount() {
    console.log(this.props,"myaccount")
    this.fnScrollToTop();
    if (isUserLoggedIn()) {
      this.props.fnFetchCountryList(this.props.locale);
      this.props.fnFetchUserDetails(null, null, true);
    } else {
      this.props.history.push(`/${this.props.locale}/${CONSTANTS.LOGIN}`);
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
  //Reset all the states if navigating back to the page
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      nextState.prevProps &&
      nextProps.oUserAccountDetails !== nextState.prevProps.oUserAccountDetails
    ) {
      console.log(nextProps)
      return {
        fname: nextProps.oUserAccountDetails.firstName,
        lname: nextProps.oUserAccountDetails.lastName,
        email: nextProps.oUserAccountDetails.email,
        mobile: nextProps.oUserAccountDetails.phoneNumber,
        savedMobile: nextProps.oUserAccountDetails.phoneNumber,
        newsletter: nextProps.oUserAccountDetails.newslettersEnabled,
        promotions: nextProps.oUserAccountDetails.promotionsEnabled,
        country: nextProps.oUserAccountDetails.countryName,
        selectedCountryCode: nextProps.oUserAccountDetails.countryId || "",
        language: nextProps.oUserAccountDetails.languageName,
        selectedLanguageCode: nextProps.oUserAccountDetails.languageId,
        newsletter1: nextProps.oUserAccountDetails.privacyPolicy,
        newsletter3: nextProps.oUserAccountDetails.isAdult,
        newsletter2: nextProps.oUserAccountDetails.isRecommend,
        playnext: false,
        prevProps: nextProps
      };
    }
    // Return null to indicate no change to state.
    return {
      prevProps: nextProps
    };
  }

  /**
   * Component Name - MyAccount
   * Update button button enable/ disable
   * @param {null}
   */
  fnSetUpdateButtonEnabled() {
    if (
      ((this.state.fname && this.state.fname.trim() !== "") ||
      (this.state.lname && this.state.lname.trim() !== "") ||
      this.state.checkboxChanged ||
      this.state.checkboxChanged1 ||
      this.state.checkboxChanged2 ||
      this.state.checkboxChanged3 ||
      this.state.countryChanged ||
      this.state.languageChanged) &&
      // !this.state.showMobileVerification &&
      this.state.newsletter1 &&
      this.state.newsletter2 &&
      this.state.newsletter3
    ) {
      this.setState({ bEnableUpdateBtn: true });
    } else {
      this.setState({ bEnableUpdateBtn: false });
    }
  }

  /**
   * Component Name - MyAccount
   * Form Inputs Changes, Updating the State.
   * @param {object} eve - Event hanlder
   */
  handleFormInputs(eve) {
    const { name, value } = eve.target;
    this.setState({ [name]: value }, this.fnSetUpdateButtonEnabled);
  }
  /**
   * Component Name - MyAccount
   * Form Inputs Changes, Updating the State and check for the validations.
   * @param {object} eve - Event hanlder
   */
  handleEmailOnChange(event) {
    const text = event.target.value;
    if (text.trim() === "") {
      this.setState({
        bEmailValid: true,
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
   * Component Name - MyAccount
   *  Checkbox Changes, Updating the State.
   * @param {object} oEvent - Event hanlder
   */
  handleCheckBox(oEvent) {
    this.setState(
      {
        [oEvent.target.name]: oEvent.target.checked,
        checkboxChanged: true
      },
      this.fnSetUpdateButtonEnabled
    );
  }
  handleCheckBox1(oEvent) {
    this.setState(
      {
        [oEvent.target.name]: oEvent.target.checked,
        checkboxChanged1: true,
        privacyPolicy:true
      },
      this.fnSetUpdateButtonEnabled
    );
  }
  handleCheckBox2(oEvent) {
    this.setState(
      {
        [oEvent.target.name]: oEvent.target.checked,
        checkboxChanged2: true,
        isAdult:true
      },
      this.fnSetUpdateButtonEnabled
    );
  }
  handleCheckBox3(oEvent) {
    this.setState(
      {
        [oEvent.target.name]: oEvent.target.checked,
        checkboxChanged3: true,
        isRecommend:true
      },
      this.fnSetUpdateButtonEnabled
    );
  }
  handleCheckBox4(oEvent) {
    this.setState(
      {
        [oEvent.target.name]: oEvent.target.checked,
        checkboxChanged4: true
      },
      this.fnSetUpdateButtonEnabled
    );
  }

  /**
   * Component Name - MyAccount
   * show country drop down
   * @param {null}
   */
  countryShowToggle(oEvent) {
    this.setState(newState => ({
      showCountrySelectBox: !newState.showCountrySelectBox,
      showLanguageSelectBox: false
    }));
    oEvent.stopPropagation();
  }
  /**
   * Component Name - MyAccount
   * show language drop down
   * @param {null}
   */
  languageShowToggle(oEvent) {
    this.setState(newState => ({
      showLanguageSelectBox: !newState.showLanguageSelectBox,
      showCountrySelectBox: false
    }));
    oEvent.stopPropagation();
  }

  onContainerClick() {
    this.setState({
      showLanguageSelectBox: false,
      showCountrySelectBox: false
    });
  }
  /**
   * Component Name - MyAccount
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
  }
  /**
   * Component Name - MyAccount
   * Language drop down selection change
   * @param {null}
   */
  handleChangeLanguageSelection(oEvent, index, sSelectedCountryKey) {
    this.setState(
      {
        language: oEvent.target.innerText,
        selectedLanguageCode: sSelectedCountryKey,
        languageChanged: true
      },
      this.fnSetUpdateButtonEnabled
    );
  }
  /**
   * Component Name - MyAccount
   * Sign out all button press
   * @param {null}
   */
  showSignOutAllConfirm() {
    this.setState({
      showDialog: true
    });
  }

  /**
   * Component Name - MyAccount
   * Sign out all button press
   * @param {null}
   */
  showSignOutAllCancel() {
    this.setState({
      showDialog: false
    });
  }

  /**
   * Component Name - MyAccount
   * Hide error dialog
   * @param {null}
   */
  hideErrorDialog() {
    this.setState({
      showErrorDialog: false
    });
  }
  /**
   * Component Name - MyAccount
   * Update accout button press
   * @param {null}
   */
  handleUpdateBtnClicked() {
    this.setState({ bEnableUpdateBtn: false });
    this.props.handleUpdateAccount(
      this.state,
      () => {
        //Data updated successfully
        toast.dismiss();
        toast.success(oResourceBundle.profile_update_success, {
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
  }

  /**
   * Component Name - MyAccount
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
   * Component Name - MyAccount
   * Update accout button press
   * @param {null}
   */
  handleChangePassClicked() {
    sendEvents(
      CONSTANTS.CHANGE_PASSWORD_CATEGORY,
      CONSTANTS.CHANGE_PASSWORD_ACTION,
      CONSTANTS.CHANGE_PASSWORD_LABEL
    );
    if (
      this.props.oUserAccountDetails.registrationSource ===
        CONSTANTS.REGISTRATION_SOURCE_EMAIL ||
      this.props.oUserAccountDetails.registrationSource ===
        CONSTANTS.REGISTRATION_SOURCE_MOBILE
    ) {
      this.props.history.push(
        `/${this.props.locale}/${CONSTANTS.CHANGE_PASSWORD}/`
      );
    }
  }
  /**
   * Component Name - MyAccount
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
   * Component Name - MyAccount
   * Update accout button press
   * @param {oEvent}
   */
  onPhoneChanged(text, country) {
    try {
      this.setState({
        mobile: text,
        showMobileVerification: this.state.savedMobile !== text ? true : false
      }, this.fnSetUpdateButtonEnabled.bind(this));
      if (
        text.length > 5 &&
        phoneUtil.isValidNumber(phoneUtil.parse(text, country.countryCode))
      ) {
        this.setState({ bMobileValid: true });
      } else {
        this.setState({ bMobileValid: false });
      }
    } catch (e) {
      this.setState({ bMobileValid: false });
    }
  }

  /**
   * Component Name - MyAccount
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
   * Component Name - MyAccount
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    //const country = CONSTANTS.COUNTRY_LIST_SIGNUP;
    const country = this.props.aCountryList;
    const language = CONSTANTS.LANGUAGE_LIST_SIGNUP;
    const seoTitle = oResourceBundle.website_meta_title;
    const description = oResourceBundle.website_meta_description;
    const oMetaObject = this.fnConstructMetaTags(
      seoTitle,
      window.location.href,
      description
    );
    const oMetaTags = this.fnUpdateMetaTags(oMetaObject);
    let selected;
    if (country.length > 0) {
      selected = this.state.selectedCountryCode
        ? country[
            country.findIndex(ele => ele.key === this.state.selectedCountryCode)
          ].text
        : oResourceBundle.my_account_select_country;
    }

    return (
      <React.Fragment>
        {oMetaTags}
        {this.props.oUserAccountDetails ? (
          <div
            className="myaccount-container"
            onClick={this.onContainerClick.bind(this)}
          >
            <div className="myaccount">
              <div className="overlay-title">
                <span>{oResourceBundle.my_account}</span>
              </div>
              <React.Fragment>
                <section className="form-myaccount" name="formMyAccount">
                  <div className="row">
                    <div className="left-column">
                      <Label>{oResourceBundle.first_name}</Label>
                      <div className="inner-column">
                        <Input
                          type="text"
                          name="fname"
                          autoComplete="off"
                          className="first-name"
                          value={this.state.fname}
                          onKeyDown={this.onPasswordInputkeyPress.bind(this)}
                          onChange={this.handleFormInputs.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="right-column">
                      <Label>{oResourceBundle.last_name}</Label>
                      <div className="inner-column">
                        <Input
                          type="text"
                          name="lname"
                          autoComplete="off"
                          className="last-name"
                          value={this.state.lname}
                          onKeyDown={this.onPasswordInputkeyPress.bind(this)}
                          onChange={this.handleFormInputs.bind(this)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="left-column">
                      <Label>{oResourceBundle.email}</Label>
                      <div className="inner-column">
                        <div className="email-conaitner">
                          <div className="email-input">
                            <Input
                              placeholder={oResourceBundle.email}
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
                              disabled={true}
                            />
                            <span className="error-text">
                              {this.state.emailErrorText}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="contact-us">
                      <Link
                        className="contact-us-link"
                        to={`/${this.props.locale}/static/${
                          oResourceBundle.contact_us_link
                        }`}
                      >
                        {oResourceBundle.contact_us_to_change_email}
                      </Link>
                    </div>
                    <div className="row">
                      <div className="left-column">
                        <Label>{oResourceBundle.mobile}</Label>
                        <div className="inner-column">
                          <div className="mobile-input-container">
                            <div>
                              <Input
                                placeholder={oResourceBundle.mobile}
                                type="text"
                                name="mobile"
                                autoComplete="off"
                                className={"mobile-input"}
                                value={this.state.mobile}
                                onKeyDown={this.onPasswordInputkeyPress.bind(
                                  this
                                )}
                                onChange={this.handleMobileInputChanged.bind(
                                  this
                                )}
                              />
                              {this.props.countryCode && (
                                <form className="form" name="form">
                                  <PhoneInput
                                    defaultCountry={this.props.countryCode.toLowerCase()}
                                    onPhoneChanged={this.onPhoneChanged.bind(
                                      this
                                    )}
                                    initialValue={this.state.mobile}
                                  />
                                </form>
                              )}
                              <span className="error-text">
                                {this.state.errorMessage.mobile}
                              </span>
                            </div>
                            <div
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
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="right-column">
                        <Label>{oResourceBundle.password}</Label>
                        <div className="inner-column">
                          <div className="password-container">
                            <Input
                              type="password"
                              name="password"
                              disabled={true}
                              placeholder={CONSTANTS.PASSWORD_PLACEHOLDER}
                              autoComplete="off"
                              className="sign-up-password"
                              onKeyDown={this.onPasswordInputkeyPress.bind(
                                this
                              )}
                              value={this.state.password}
                              onChange={this.handleFormInputs.bind(this)}
                            />
                            <div
                              role="button"
                              className={
                                "change-password" +
                                (this.props.oUserAccountDetails
                                  .registrationSource ===
                                  CONSTANTS.REGISTRATION_SOURCE_EMAIL ||
                                this.props.oUserAccountDetails
                                  .registrationSource ===
                                  CONSTANTS.REGISTRATION_SOURCE_MOBILE
                                  ? " enabled"
                                  : "")
                              }
                              tabIndex="0"
                              onClick={this.handleChangePassClicked.bind(this)}
                            >
                              {oResourceBundle.change_password}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="left-column">
                        <Label>{oResourceBundle.country}</Label>
                        <div className="inner-column">
                          <SelectBox
                            className={
                              this.state.showCountrySelectBox ? "open" : ""
                            }
                            show={this.state.showCountrySelectBox}
                            items={country}
                            selected={selected}
                            showToggle={this.countryShowToggle.bind(this)}
                            onChange={this.handleChangeCountrySelection.bind(
                              this
                            )}
                          />
                        </div>
                      </div>
                      {
                        <div className="right-column">
                          <Label>{oResourceBundle.language}</Label>
                          <div className="inner-column">
                            {language.findIndex(
                              ele => ele.key === this.state.selectedLanguageCode
                            ) > -1 ? (
                              <SelectBox
                                className={
                                  this.state.showLanguageSelectBox ? "open" : ""
                                }
                                items={language}
                                selected={
                                  language[
                                    language.findIndex(
                                      ele =>
                                        ele.key ===
                                        this.state.selectedLanguageCode
                                    )
                                  ].text
                                }
                                showToggle={this.languageShowToggle.bind(this)}
                                onChange={this.handleChangeLanguageSelection.bind(
                                  this
                                )}
                              />
                            ) : null}
                          </div>
                        </div>
                      }
                    </div>

                    {/* <div className="right-column">
                        <div className="inner-column">
                          <div className="">
                            <DatePicker
                              selected={this.state.dob}
                              onChange={this.handleDateChange.bind(this)}
                              showYearDropdown
                              showMonthDropdown
                              peekNextMonth
                              placeholderText="Date of Birth"
                              dateFormat="dd/MM/yy"
                            /><div
                                role="button"
                                className="change-password"
                                tabIndex="0"
                                onClick={this.handleChangePassClicked.bind(
                                  this
                                )}
                              >
                                {oResourceBundle.change_password}
                              </div>
                          </div>
                        </div>
                      </div> */}
                  </div>
                  {
                    // this.props.oUserAccountDetails &&
                    // (this.props.oUserAccountDetails.registrationSource ===
                    //   CONSTANTS.REGISTRATION_SOURCE_EMAIL ||
                    //   this.props.oUserAccountDetails.registrationSource ===
                    //     CONSTANTS.REGISTRATION_SOURCE_MOBILE) && (
                    //   <div
                    //     role="button"
                    //     className="change-password-link"
                    //     tabIndex="0"
                    //     onClick={this.handleChangePassClicked.bind(this)}
                    //   >
                    //     {oResourceBundle.change_password}
                    //   </div>
                    // )
                  }
                </section>
                {/* <section className="my-account-buttons">
                    <Button
                      className="btn-device-pair"
                      onClick={() =>
                        this.props.history.push(
                          `/${this.props.locale}/${
                            CONSTANTS.DEVICE_MANAGEMENT
                          }/`
                        )
                      }
                    >
                      {oResourceBundle.activate_a_device}
                    </Button>
                    <Button
                      className="btn-sign-out-all"
                      onClick={this.showSignOutAllConfirm.bind(this)}
                    >
                      {oResourceBundle.sign_out_all}
                    </Button>
                  </section> */}
                {this.state.showDialog ? (
                  <Dialog
                    visible={true}
                    onDialogClosed={this.showSignOutAllCancel.bind(this)}
                    duration={CONSTANTS.RATING_DIALOG_ANIMATION_DURATION}
                    showCloseButton={false}
                    closeOnEsc={true}
                    width={CONSTANTS.SIGNOUTALL_DIALOG_WIDTH}
                    height={CONSTANTS.SIGNOUTALL_DIALOG_HEIGHT}
                  >
                    <div className="signout-dialog-content">
                      <div className="content">
                        <div className="dialog-title">
                          {oResourceBundle.my_account}
                        </div>
                        <div className="dialog-text">
                          {oResourceBundle.sign_out_all_confirm_message}
                        </div>
                      </div>

                      <div className="actions">
                        <Button
                          className="dialog-ok-btn"
                          onClick={this.handleSignoutAllClicked.bind(this)}
                        >
                          {oResourceBundle.confirm}
                        </Button>
                        <Button
                          className="dialog-ok-btn"
                          onClick={this.showSignOutAllCancel.bind(this)}
                        >
                          {oResourceBundle.btn_cancel}
                        </Button>
                      </div>
                    </div>
                  </Dialog>
                ) : null}

                {this.state.showErrorDialog ? (
                  <Dialog
                    visible={true}
                    onDialogClosed={this.hideErrorDialog.bind(this)}
                    duration={CONSTANTS.RATING_DIALOG_ANIMATION_DURATION}
                    showCloseButton={false}
                    closeOnEsc={true}
                    width={CONSTANTS.SIGNOUTALL_DIALOG_WIDTH}
                    height={CONSTANTS.SIGNOUTALL_DIALOG_HEIGHT}
                  >
                    <div className="signout-dialog-content">
                      <div className="content">
                        <div className="dialog-title">
                          {oResourceBundle.my_account}
                        </div>
                        <div className="dialog-text">
                          {this.state.showErrorDialogMessage}
                        </div>
                      </div>

                      <div className="actions">
                        <Button
                          className="dialog-ok-btn"
                          onClick={this.hideErrorDialog.bind(this)}
                        >
                          {oResourceBundle.ok}
                        </Button>
                      </div>
                    </div>
                  </Dialog>
                ) : null}

                {/* check box area */}
                <div className="my-account-checkboxes">
                  {/* <CheckBox
                      onChange={this.handleCheckBox.bind(this)}
                      selected={this.state.playnext}
                      name="playnext"
                      text={oResourceBundle.play_next_episode_automatically}
                    /> */}
                  <CheckBox
                    onChange={this.handleCheckBox1.bind(this)}
                    selected={this.state.newsletter1}
                    name="newsletter1"
                    value={this.state.privacyPolicy}
                    text={ReactHtmlParser(oResourceBundle.subscribe_to_newsletter1)}
                  />
                  <CheckBox
                    onChange={this.handleCheckBox2.bind(this)}
                    selected={this.state.newsletter2}
                    name="newsletter2"
                    value ={this.state.isAdult}
                    text={oResourceBundle.subscribe_to_newsletter2}
                  />
                  <CheckBox
                    onChange={this.handleCheckBox3.bind(this)}
                    selected={this.state.newsletter3}
                    value ={this.state.isRecommend}
                    name="newsletter3"
                    text={oResourceBundle.subscribe_to_newsletter3}
                  />
                  <CheckBox
                    onChange={this.handleCheckBox.bind(this)}
                    selected={this.state.newsletter}
                    name="newsletter"
                    text={oResourceBundle.subscribe_to_newsletter}
                  />
                  {/* <CheckBox
                    onChange={this.handleCheckBox4.bind(this)}
                    selected={this.state.newsletter4}
                    value={this.state.newsletter4}
                    name="newsletter4"
                    text={oResourceBundle.subscribe_to_newsletter4}
                  /> */}


                  {/* <CheckBox
                      onChange={this.handleCheckBox.bind(this)}
                      selected={this.state.promotions}
                      name="promotions"
                      text={oResourceBundle.receive_promotions}
                    /> */}
                </div>
                <section className="my-account-action-buttons">
                  <Button
                    className="btn-device-pair"
                    onClick={this.handleUpdateBtnClicked.bind(this)}
                    disabled={!this.state.bEnableUpdateBtn}
                  >
                    {oResourceBundle.update}
                  </Button>
                  {
                    // <Button
                    //   className="btn-cancel"
                    //   onClick={() => this.props.history.goBack()}
                    // >
                    //   {oResourceBundle.btn_cancel}
                    // </Button>
                  }
                </section>
              </React.Fragment>
            </div>
          </div>
        ) : null}
        {this.props.loading ? <Spinner /> : null}
      </React.Fragment>
    );
  }
}

/**
 * method that maps state to props.
 * Component - MyAccount
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
    handleUpdateAccount: (currentStateValues, fnSuccess, fnFailed) => {
      dispatch(
        actionTypes.fnHandleUpdateAccount(
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
 * Component - MyAccount
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
  )(MyAccount)
);
