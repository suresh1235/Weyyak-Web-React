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
import BaseContainer from "core/BaseContainer/";
import { isValidEmail } from "app/utility/common";
import { connect } from "react-redux";
import oResourceBundle from "app/i18n/";
import * as actionTypes from "app/store/action/";
import withTracker from "core/GoogleAnalytics/";
import * as constants from "app/AppConfig/constants";
import SelectBox from "core/components/SelectBox";
import Input from "core/components/Input/";
import Spinner from "core/components/Spinner/";
import Button from "core/components/Button/";
import Label from "core/components/Label";
import { toast } from "core/components/Toaster/";

import "./index.scss";

class ContactUs extends BaseContainer {
  /**
   * Represents ContactUs.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      subject: oResourceBundle.contact_us_subject[0].title,
      selectedSubjectIndex: 0,
      filterSelectClass: " ",
      email: "",
      emailErrorText: "",
      emailValidFlag: false,
      content: "",
      contentValidation: oResourceBundle.contact_us_content_empty,
      contentValidFlag: false,
      contactResponseData: "",
      btnEnableState: true,
      mobile: "",
      mobileValidFlag: false,
      mobileErrorText: "",
      subjectItems: oResourceBundle.contact_us_subject
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.locale !== this.props.locale) {
      this.setState({
        subjectItems: oResourceBundle.contact_us_subject,
        subject:
          oResourceBundle.contact_us_subject[this.state.selectedSubjectIndex]
            .title
      });
    }
  }
  /**
   * Component Name - ContactUs
   *  Form Inputs Changes, Updating the State and check for the validations.
   *  @param {object} eve - Event hanlder
   */
  handleContactEmailChange(event) {
    const text = event.target.value;
    if (text.length === 0) {
      this.setState(
        {
          emailErrorText: oResourceBundle.email_empty,
          emailValidFlag: false
        },
        this.fnCheckSubmitButtonState
      );
    } else {
      if (!isValidEmail(text)) {
        this.setState(
          {
            emailErrorText: oResourceBundle.email_invalid,
            emailValidFlag: false
          },
          this.fnCheckSubmitButtonState
        );
      } else {
        this.setState(
          {
            emailErrorText: "",
            emailValidFlag: true
          },
          this.fnCheckSubmitButtonState
        );
      }
    }
    this.setState(
      {
        email: text,
        contactResponseData: ""
      },
      this.fnCheckSubmitButtonState
    );
  }

  fnCheckSubmitButtonState() {
    if (
      this.state.emailValidFlag &&
      this.state.contentValidFlag &&
      this.state.mobileValidFlag
    ) {
      this.setState({
        btnEnableState: false
      });
    } else {
      this.setState({
        btnEnableState: true
      });
    }
  }

  /**
   * Component Name - ContactUs
   *  Form Subject Inputs Changes, Updating the State.
   *  @param {object} eve - Event hanlder
   */
  handleContactMobileChange(e) {
    const { name, value } = e.target;
    const numberRegex = /^\+?[0-9]*$/;
    if (
      !numberRegex.test(value) ||
      value.length < constants.MIN_MOBILE_NUMBER ||
      value.length > constants.MAX_MOBILE_NUMBER
    ) {
      this.setState(
        {
          [name]: value,
          mobileErrorText: oResourceBundle.mobile_invalid,
          mobileValidFlag: false,
          contactResponseData: ""
        },
        this.fnCheckSubmitButtonState
      );
    } else {
      this.setState(
        {
          [name]: value,
          mobileValidFlag: true,
          mobileErrorText: "",
          contactResponseData: ""
        },
        this.fnCheckSubmitButtonState
      );
    }
    this.setState({ mobile: value }, this.fnCheckSubmitButtonState);
  }

  /**
   * Component Name - ContactUs
   *  Form Contect Inputs Changes, Updating the State.
   *  @param {object} eve - Event hanlder
   */
  handleContactContentChange(e) {
    const text = e.target.value;
    if (text.trim() === "") {
      this.setState(
        {
          contentValidation: oResourceBundle.contact_us_content_empty,
          content: text,
          contentValidFlag: false
        },
        this.fnCheckSubmitButtonState
      );
    } else {
      this.setState(
        {
          content: text,
          contentValidFlag: true,
          contentValidation: ""
        },
        this.fnCheckSubmitButtonState
      );
    }
    this.setState(
      {
        content: text,
        contactResponseData: ""
      },
      this.fnCheckSubmitButtonState
    );
  }

  /**
   * Component Name - ContactUs
   *  Form Inputs Changes, Updating the State and check for the validations.
   *  @param {object} eve - Event hanlder
   */
  handleContactSubmit() {
    const device_type = "website";
    const comments = this.state.content.trim();
    const contactUsDetails = {
      email: this.state.email,
      subject: this.state.subject,
      comments: comments,
      mobile_number: this.state.mobile,
      device_type: device_type
    };
    this.props.fnSendContactDetails(
      contactUsDetails,
      response => {
        this.setState({
          contactResponseData: response.data.message,
          btnEnableState: true,
          email: "",
          mobile: "",
          content: "",
          subject: oResourceBundle.contact_us_subject[0].title,
          selectedSubjectIndex: 0,
          referenceId: response.data.reference_id
        });
        toast.dismiss();
        toast.success(
          <div className="contactResponseData">
            <span>{oResourceBundle.contact_us_success_1}</span>
            <br />
            <span>{oResourceBundle.contact_us_success_2}</span>
            <span>{this.state.referenceId}</span>
          </div>,
          {
            position: toast.POSITION.CENTER
          }
        );
      },
      error => {
        this.setState({
          errorOccurred: true
        });
      }
    );
  }

  subjectShowToggle(event) {
    if (this.state.filterSelectClass === "open") {
      this.setState({ filterSelectClass: "closed" });
    } else {
      this.setState({ filterSelectClass: "open" });
    }
    event.stopPropagation();
  }

  showFilterDropdown(show) {
    if (show) {
      this.setState({ filterSelectClass: "open" });
    } else {
      this.setState({ filterSelectClass: "closed" });
    }
  }

  subjectClicked(event, index) {
    this.setState(
      {
        subject: oResourceBundle.contact_us_subject[index].title,
        selectedSubjectIndex: index,
        contactResponseData: ""
      },
      this.fnCheckSubmitButtonState
    );
  }
  /**
   * Component Name - ContactUs
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        <div className="contact-us">
          {this.props.loading && <Spinner />}
          <div className="contact-us-container">
            <div className="contact-us-title-wrapper">
              <div className="contact-us-title">
                {oResourceBundle.contact_us_title}
              </div>
            </div>
            <div className="contact-us-details">
              <Label>{oResourceBundle.email}</Label>
              <div className="contact-us-email">
                <Input
                  name="contact-email"
                  value={this.state.email}
                  onChange={this.handleContactEmailChange.bind(this)}
                />
                <span className="email-error">
                  {this.state.emailErrorText ? this.state.emailErrorText : ""}
                </span>
              </div>
              <Label>{oResourceBundle.subject}</Label>
              <div className="contact-us-subject">
                <SelectBox
                  className={this.state.filterSelectClass}
                  items={this.state.subjectItems}
                  selected={this.state.subject}
                  showToggle={this.subjectShowToggle.bind(this)}
                  onChange={this.subjectClicked.bind(this)}
                  title={this.state.subjectItems[0].title}
                  hideTitleOnExpand={true}
                />
              </div>
              <Label>{oResourceBundle.mobile}</Label>
              <div className="contact-us-mobile">
                <Input
                  name="mobile"
                  value={this.state.mobile}
                  onChange={this.handleContactMobileChange.bind(this)}
                />
                <span className="mobile-error">
                  {this.state.mobileErrorText ? this.state.mobileErrorText : ""}
                </span>
              </div>
              <Label>{oResourceBundle.description}</Label>
              <div className="contact-us-content">
                <textarea
                  placeholder={oResourceBundle.contact_us_comments}
                  className="comment-textarea"
                  rows="5"
                  cols="50"
                  name="content"
                  value={this.state.content}
                  onChange={this.handleContactContentChange.bind(this)}
                />
              </div>
              <div className="contact-us-btn">
                <Button
                  className="contact-us-btn"
                  disabled={this.state.btnEnableState ? true : false}
                  onClick={this.handleContactSubmit.bind(this)}
                >
                  {oResourceBundle.submit}
                </Button>
              </div>
            </div>
            {this.state.errorOccurred && (
              <div className="contactResponseData">
                {oResourceBundle.something_went_wrong}
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

/**
 * method that maps state to props.
 * Component - ContactUs
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    fnSendContactDetails: (contactUsDetails, fnSuccess, fnError) => {
      dispatch(
        actionTypes.fnSendContactDetails(contactUsDetails, fnSuccess, fnError)
      );
    }
  };
};
/**
 * Component - ContactUs
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loading: state.loading
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ContactUs)
);
