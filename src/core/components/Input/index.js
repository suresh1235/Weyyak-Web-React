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
import "./index.scss";

/**
 * Represents Input.
 */
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    return (
      <input
        ref={this.ref}
        autoComplete={this.props.autoComplete || "on"}
        value={this.props.value || ""}
        type={this.props.type || "text"}
        id={this.props.id || Math.floor(Math.random() * 1000) + ""}
        tabIndex={this.props.tabIndex !== undefined ? this.props.tabIndex : 0}
        name={this.props.name}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        maxLength={this.props.maxLength}
        placeholder={this.props.placeholder || ""}
        required={this.props.required || false}
        disabled={this.props.disabled || false}
        onChange={evt => this.props.onChange && this.props.onChange(evt)}
        className={
          "input " + (this.props.className ? this.props.className : "")
        }
        style={this.props.style ? this.props.style : {}}
        onKeyDown={this.props.onKeyDown ? this.props.onKeyDown : () => {}}
        onKeyUp={this.props.onKeyUp ? this.props.onKeyUp : () => {}}
      />
    );
  }
}
export default Input;
