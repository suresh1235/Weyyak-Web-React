import React from "react";
// import ReactPhoneInput from "react-phone-input-2";
import { connect } from "react-redux";
import * as common from "app/utility/common";
import * as actionTypes from "app/store/action/";
import Input from "core/components/Input/";
import oResourceBundle from "app/i18n/";
// import ReactPhoneInput from "react-phone-number-input";
// import oResourceBundle from "app/i18n/";

// import "react-phone-input-2/dist/style.css";
// import "react-phone-number-input/style.css";
import "./index.scss";

/**
 * Class to render grid layout
 */
class PhoneInput extends React.Component {
  constructor(props) {
    super(props);
    this.dropdownContainerRef = React.createRef();
    this.countryCodeRef = React.createRef();
    this.countryListRef = [];
    this.state = {
      phoneNumber: props.initialValue || "",
      dialCode: "",
      selectedCountryIndex: 0,
      showDropdown: false
    };
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClick);
    document.addEventListener("keydown", this.onKeyDown);
    if (
      this.props.countryPhoneCodes === null ||
      !this.props.countryPhoneCodes[this.props.locale]
    ) {
      this.props.getCountryPhoneCodes(this.props.locale);
    } else {
      this.setDefaultDialCode();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.countryPhoneCodes !== prevProps.countryPhoneCodes &&
      this.props.countryPhoneCodes[this.props.locale]
    ) {
      this.setDefaultDialCode();
    }
    if (this.state.showDropdown) {
      if (this.dropdownContainerRef && this.dropdownContainerRef.current) {
        this.dropdownContainerRef.current.focus();
      }
    }

    if (this.props.locale !== prevProps.locale) {
      if (!this.props.countryPhoneCodes[this.props.locale]) {
        this.props.getCountryPhoneCodes(this.props.locale);
      }
    }
    if (this.props.initialValue !== prevProps.initialValue
      && this.props.initialValue.length > 7 &&
      this.props.initialValue.length < 16) {
      this.setState({
        phoneNumber: this.props.initialValue,
      }, this.setDefaultDialCode.bind(this))
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick);
    document.removeEventListener("keydown", this.onKeyDown);
  }

  setDefaultDialCode() {
    let dialCode = ""
    // if (this.state.phoneNumber !== "") {
    //   dialCode = common.getCountryCodeFromNumber(this.state.phoneNumber);
    // } else 
    if(this.state.dialCode!="") {
      dialCode = this.state.dialCode;
    }else {
      const country = common.getCountryFromCode(this.props.countryCode);
      dialCode = "+" + country.dial;
    }
    const index = this.props.countryPhoneCodes &&
      this.props.countryPhoneCodes[this.props.locale]? this.props.countryPhoneCodes[this.props.locale].findIndex(
        ele => ele.code === dialCode
      ) : 0;
    this.setState({
      selectedCountryIndex: index,
      dialCode: dialCode,
      phoneNumber: this.state.phoneNumber.replace(dialCode, "")
    });
  }

  handleClick(e) {
    if (
      this.dropdownContainerRef &&
      this.dropdownContainerRef.current &&
      this.countryCodeRef.current
    ) {
      if (
        this.state.showDropdown &&
        !this.dropdownContainerRef.current.contains(e.target) &&
        !this.countryCodeRef.current.contains(e.target)
      ) {
        this.setState({
          showDropdown: false
        });
      }
    }
  }

  onCountryCodeClicked() {
    this.setState({
      showDropdown: !this.state.showDropdown
    });
  }

  onNumberChange(evt) {
    const value = common.extractNumber(evt.target.value);
    this.setState(
      {
        phoneNumber: value
      },
      this.onPhoneChanged
    );
  }

  onCountryCodeSelected(index) {
    const code = this.props.countryPhoneCodes[this.props.locale][index].code;
    // const country = common.getCountryFromCode(this.props.countryCode);
    // const dialCode = "+" + country.dial;
    const countryIndex = this.props.countryPhoneCodes[
      this.props.locale
    ].findIndex(ele => ele.code === code);
    this.setState(
      {
        showDropdown: false,
        dialCode: code,
        selectedCountryIndex: countryIndex
      },
      this.onPhoneChanged
    );
  }

  onPhoneChanged() {
    if (
      this.props.countryPhoneCodes &&
      this.props.countryPhoneCodes[this.props.locale] &&
      "function" === typeof this.props.onPhoneChanged
    ) {
      this.props.onPhoneChanged(
        this.state.dialCode + this.state.phoneNumber,
        this.props.countryPhoneCodes[this.props.locale][
          this.state.selectedCountryIndex
        ]
      );
    }
  }

  onKeyUp(oEvent) {
    const key = oEvent.key;
    let item;
    const itemIndex = this.props.countryPhoneCodes[this.props.locale].findIndex(
      ele => {
        return typeof ele.text === "string" &&
          ele.text[0] &&
          ele.text !== this.props.selected
          ? ele.text[0].toLowerCase() === key.toLowerCase()
          : false;
      }
    );
    if (itemIndex > -1) {
      item = this.props.countryPhoneCodes[this.props.locale][itemIndex];
      const itemDOMRef = this.countryListRef[item.text];
      const parentDomRef = itemDOMRef.parentNode;
      parentDomRef.scrollTop = itemDOMRef.offsetTop - 5;
    }
  }

  onKeyDown(e) {
    if (typeof this.props.onKeyDown === "function") {
      this.props.onKeyDown(e);
    }
    if (
      this.state.showDropdown &&
      this.props.countryPhoneCodes &&
      this.props.countryPhoneCodes[this.props.locale]
    ) {
      const key = e.key;
      let item;
      const itemIndex = this.props.countryPhoneCodes[
        this.props.locale
      ].findIndex(ele => {
        return typeof ele.name === "string" && ele.name !== this.props.selected
          ? ele.name[0].toLowerCase() === key.toLowerCase()
          : false;
      });
      if (itemIndex > -1) {
        item = this.props.countryPhoneCodes[this.props.locale][itemIndex];
        const itemDOMRef = this.countryListRef[item.name];
        const parentDomRef = itemDOMRef.parentNode;
        parentDomRef.scrollTop = itemDOMRef.offsetTop - 5;
      }
    }
  }

  /**
   * Render function overridden from react
   * this.props.countryPhoneCodes
   */
  render() {
    return (
      <div className="phone-input-container">
        <div className="phone-input">
          <div
            className="country-code-container"
            onClick={this.onCountryCodeClicked.bind(this)}
            ref={this.countryCodeRef}
          >
            <div className="country-code-input">{this.state.dialCode}</div>
            <div className="down-arrow" />
          </div>
          <Input
            className="number-input"
            value={this.state.phoneNumber}
            onChange={this.onNumberChange.bind(this)}
            // placeholder={oResourceBundle.mobile}
            placeholder={this.props.placeholder!=undefined?this.props.placeholder:oResourceBundle.mobile}
            onKeyDown={this.onKeyDown.bind(this)}
          />
        </div>
        {this.state.showDropdown &&
          this.props.countryPhoneCodes &&
          this.props.countryPhoneCodes[this.props.locale] && (
            <ul className="country-dropdown" ref={this.dropdownContainerRef}>
              {this.props.countryPhoneCodes[this.props.locale][
                this.state.selectedCountryIndex
              ] && (
                <li
                  key="first-country"
                  className="country-item"
                  onClick={this.onCountryCodeSelected.bind(
                    this,
                    this.state.selectedCountryIndex
                  )}
                >
                  <div className="country-code">
                    {
                      this.props.countryPhoneCodes[this.props.locale][
                        this.state.selectedCountryIndex
                      ].code
                    }
                  </div>
                  <div className="country-name">
                    {
                      this.props.countryPhoneCodes[this.props.locale][
                        this.state.selectedCountryIndex
                      ].name
                    }
                  </div>
                </li>
              )}
              {this.props.countryPhoneCodes[this.props.locale].map((ele, i) => {
                if (i !== this.state.selectedCountryIndex) {
                  return (
                    <li
                      ref={ref => (this.countryListRef[ele.name] = ref)}
                      key={i}
                      className="country-item"
                      onClick={this.onCountryCodeSelected.bind(this, i)}
                    >
                      <div className="country-code">{ele.code}</div>
                      <div className="country-name">{ele.name}</div>
                    </li>
                  );
                } else {
                  return null
                }
              })}
            </ul>
          )}
      </div>
    );
  }
}

/**
 * method that maps state to props.
 * Component - SignUp
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    getCountryPhoneCodes: langCode => {
      dispatch(actionTypes.getCountryPhoneCodes(langCode));
    }
  };
};

/**
 * Component - SignUp
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loading: state.loading,
    countryCode: state.sCountryCode,
    countryPhoneCodes: state.countryPhoneCodes
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneInput);
