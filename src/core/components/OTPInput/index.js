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
import Input from "../Input/";
import * as CONSTANTS from "../../BaseContainer/constants";
import "./index.scss";

/**
 * Represents Input.
 * @param {Object} props - Properties of the Component.
 */
class OTPInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputs = [];
    this.state = {};
    for (let i = 0; i < props.numberOfFields; i++) {
      let myRef = React.createRef();
      this.state["otp" + i] = "";
      this.inputs.push(myRef);
    }
  }

  /**
   * Component Name - MobileVerification
   * For cancel the email verification.
   * @param { null }
   * @returns {undefined}
   */
  handleInput(index, event) {
    this.setState({
      ["otp" + index]: event.target.value
    });
    let otp = "";
    for (let i = 0; i < this.props.numberOfFields; i++) {
      if (i === index) {
        otp += event.target.value;
      } else {
        otp += this.state["otp" + i];
      }
    }
    if (typeof this.props.otpChanged === "function") {
      this.props.otpChanged(otp);
    }
    try {
      if (event.target.value.length === 1) {
        if (index < this.props.numberOfFields - 1) {
          this.inputs[index + 1].current.ref.current.focus();
        }
        if (index === this.props.numberOfFields - 1) {
          this.inputs[index].current.blur();
        }
        this.inputs[index].current.value = "";
      }
    }
    catch (ex) {

    }
    event.preventDefault();
  }

  onKeyDown(index, event) {
    switch (event.keyCode) {
      case CONSTANTS.BACK_KEY:
      case CONSTANTS.DELETE_KEY:
        this.setState({
          ["otp" + index]: ""
        });
        let otp = "";
        for (let i = 0; i < this.props.numberOfFields; i++) {
          if(index == 0){
            otp = ""
          }else if (i == index) {
            otp += event.target.value;
          } else  {
            otp += this.state["otp" + i];
          }
        }
        if (typeof this.props.otpChanged === "function") {
          this.props.otpChanged(otp);
        }
        break;
      default:
    }
  }
  createOTPFields() {
    let fields = [];

    for (let i = 0; i < this.props.numberOfFields; i++) {
      const id = "otp" + i;
      fields.push(
        <div key={id} className="password-hide-wrapper">
          <Input
            type="text"
            id={id}
            name={id}
            autoComplete="off"
            maxLength={1}
            onChange={this.handleInput.bind(this, i)}
            ref={this.inputs[i]}
            onKeyDown={this.onKeyDown.bind(this, i)}
            value={this.state[id]}
          />
          <div
            className={this.state[id].length > 0 ? "password-hide-design" : ""}
          />
        </div>
      );
    }
    return fields;
  }

  /**
   * Component Name - MobileVerification
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return <React.Fragment>{this.createOTPFields()}</React.Fragment>;
  }
}
export default OTPInput;
