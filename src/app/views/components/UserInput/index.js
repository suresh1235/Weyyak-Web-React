import React from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as CONSTANTS from "app/AppConfig/constants";
import * as common from "app/utility/common";
import { FORCE_ALPHANUMERIC_PASSWORD } from "app/AppConfig/features";
import Input from "core/components/Input/";
import oResourceBundle from "app/i18n/";
import "./index.scss";

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

/**
 * Class to render grid layout
 */
class UserInput extends React.Component {
  constructor(props) {
    super(props);
    this.minimumPasswordLength = props.minimumPasswordLength || 6;
    this.state = {
      input: "",
      password: "",
      inputError: true,
      bEmailValid: false,
      bMobileValid: false,
      passwordValid: false,
      passwordIcon: props.showPasswordIcon,
      currentInputIsMobile: ""
    };
  }

  /**
   * Component Name - Grid
   * Executes when component mounted to DOM.
   * @param {undefined}
   * @param {undefined}
   */
  componentDidMount() {}
  /**
   * Component Name - Grid
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentInputIsMobile !== this.state.currentInputIsMobile &&
      typeof this.props.updateCurrentInput === "function"
    ) {
      this.props.updateCurrentInput(this.state.currentInputIsMobile);
    }
  }

  /**
   * Component Name - Login
   *  Showing the Input Password to User.
   * @param {null}
   */
  handleShowPasswordIcon(event) {
    let passwordType = event.target.previousElementSibling.type;
    if (passwordType === CONSTANTS.PASSWORD_TYPE_PASSWORD) {
      event.target.previousElementSibling.type = CONSTANTS.PASSWORD_TYPE_TEXT;
      this.setState({
        passwordIcon: this.props.showPasswordCheckedIcon
      });
    } else {
      event.target.previousElementSibling.type =
        CONSTANTS.PASSWORD_TYPE_PASSWORD;
      this.setState({
        passwordIcon: this.props.showPasswordIcon
      });
    }
  }

  /**
   * Component Name - Login
   * Form Inputs Changes, Updating the State and check for the validations.
   * @param {object} eve - Event hanlder
   */
  handleInputOnChange(event) {
    const text = event.target.value;
    this.setState({
      input: text
    });
    const numberReg = /^\+?[0-9]*$/;
    try {
      if (text.length > 0) {
        if (common.isValidEmail(text)) {
          this.setState(
            {
              bEmailValid: true,
              bMobileValid: false,
              inputError: false,
              currentInputIsMobile: false
            },
            this.inputStateChanged
          );
        } else if (common.containsAlphabets(text)) {
          this.setState(
            {
              bEmailValid: false,
              bMobileValid: false,
              inputError: true,
              currentInputIsMobile: false
            },
            this.inputStateChanged
          );
        } else if (
          this.props.dontValidatePhoneNumber ||
          isValidPhoneNumber(text) ||
          (numberReg.test(text.replace(/ /g, "")) &&
            phoneUtil.isValidNumber(
              phoneUtil.parse(text, this.props.countryCode)
            ))
        ) {
          this.setState(
            {
              bMobileValid: true,
              bEmailValid: false,
              inputError: false,
              currentInputIsMobile: true
            },
            this.inputStateChanged
          );
        } else {
          if (numberReg.test(text.replace(/ /g, ""))) {
            this.setState(
              {
                bMobileValid: false,
                bEmailValid: false,
                inputError: true,
                currentInputIsMobile: true
              },
              this.inputStateChanged
            );
          } else {
            this.setState(
              {
                bMobileValid: false,
                bEmailValid: false,
                inputError: true,
                currentInputIsMobile: false
              },
              this.inputStateChanged
            );
          }
        }
      }else{
        this.setState(
          {
            bMobileValid: false,
            bEmailValid: false,
            inputError: false,
            currentInputIsMobile: false
          },
          this.inputStateChanged
        );
      }
    } catch (ex) {
      this.setState(
        {
          bMobileValid: false,
          bEmailValid: false,
          inputError: true,
          currentInputIsMobile: true
        },
        this.inputStateChanged
      );
    }
  }

  inputStateChanged() {
    this.props.inputStateChanged(this.state);
  }

  /**
   * Component Name - Login
   *  Form Inputs Changes, Updating the State and check for the validations.
   *  @param {object} eve - Event hanlder
   */
  handlePasswordOnChange(eve) {
    const password = eve.target.value;
    this.setState({
      password: password
    });

    if (password.length < this.minimumPasswordLength) {
      this.setState(
        {
          passwordValid: false
        },
        this.inputStateChanged
      );
    } else {
      if (FORCE_ALPHANUMERIC_PASSWORD) {
        if (
          common.containsAlphabets(password) &&
          common.containsNumerals(password)
        ) {
          this.setState(
            {
              passwordValid: true
            },
            this.inputStateChanged
          );
        } else {
          this.setState(
            {
              passwordValid: false
            },
            this.inputStateChanged
          );
        }
      } else {
        this.setState(
          {
            passwordValid: true
          },
          this.inputStateChanged
        );
      }
    }
  }

  onKeyDown(e) {
    switch (e.keyCode) {
      case CONSTANTS.ENTER_KEYCODE:
        if (typeof this.props.enterKeyOnInput === "function") {
          this.props.enterKeyOnInput(e);
        }
        break;
      default:
    }
  }

  /**
   * Render function overridden from react
   */
  render() {
    let errorMessage;
    if (this.state.inputError) {
      if (this.state.currentInputIsMobile && this.state.input.trim() !== "") {
        errorMessage = oResourceBundle.mobile_invalid;
      } else if (this.state.input.trim() !== "") {
        errorMessage = oResourceBundle.email_invalid;
      }
    } else {
      errorMessage = "";
    }
    let passwordError;
    if (!this.state.passwordValid && this.state.password.length !== 0) {
      passwordError =
        this.state.password.length >= this.minimumPasswordLength
          ? oResourceBundle.password_alphanumeric
          : oResourceBundle.password_length_error;
    } else {
      passwordError = "";
    }
    return (
      <form className="form" name="form">
        <div className="row">
          {this.props.labelInput && (
            <div className="label">{this.props.labelInput}</div>
          )}
          <Input
            name="email"
            type="text"
            placeholder={this.props.placeholderInput || ""}
            className="email-phone"
            onChange={this.handleInputOnChange.bind(this)}
            value={this.state.input}
            onKeyDown={this.onKeyDown.bind(this)}
          />
          <p className="error-message email-phone-error">{errorMessage}</p>
        </div>
        {this.props.hidePasswordField === true ? null : (
          <div className="row">
            {this.props.labelPassword && (
              <div className="label">{this.props.labelPassword}</div>
            )}
            <Input
              name="password"
              type="password"
              placeholder={this.props.placeholderPassword || ""}
              className="password"
              onChange={this.handlePasswordOnChange.bind(this)}
              value={this.state.password}
              onKeyDown={this.onKeyDown.bind(this)}
            />
            <p className="error-message password-error">{passwordError}</p>
          </div>
        )}
      </form>
    );
  }
}

export default UserInput;
