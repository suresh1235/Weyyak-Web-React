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
import Button from "../Button";
import downArrow from "app/resources/assets/thumbnail/ic-down-arrow.png";
import downArrowHover from "app/resources/assets/thumbnail/ic-select-arrow-hover.png";
import "./index.scss";

class SelectBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      btnIcon: downArrow
    };
    this.downArrowRef = React.createRef();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.show) {
      if (this.downArrowRef) {
        this.downArrowRef.current.focus();
      }
    }
  }

  handleMouseOverState() {
    this.setState({
      btnIcon: downArrowHover
    });
  }
  handleMouseLeaveState() {
    this.setState({
      btnIcon: downArrow
    });
  }
  fnFocusIntoItem(key) {
    let item;
    const itemIndex = this.props.items.findIndex(ele => {
      return typeof ele.text === "string" &&
        ele.text[0] &&
        ele.text !== this.props.selected
        ? ele.text[0].toLowerCase() === key.toLowerCase()
        : false;
    });
    if (itemIndex > -1) {
      item = this.props.items[itemIndex];
      const itemDOMRef = this.refs[item.text];
      const parentDomRef = itemDOMRef.parentNode;
      parentDomRef.scrollTop = itemDOMRef.offsetTop - 5;
    }
  }
  /**
   * Component Name - SelectBox
   * Key Up.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onSearchInputKeyUp(oEvent) {
    clearTimeout(this.typingTimer);
    if (oEvent.keyCode === 27) {
    } else if (oEvent.keyCode !== 13) {
      this.typingTimer = setTimeout(
        this.fnFocusIntoItem.bind(this, oEvent.key),
        0
      );
    }
  }

  /**
   * Component Name - SelectBox
   * Key Up.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onSearchInputKeyDown(oEvent) {
    clearTimeout(this.typingTimer);
  }

  render() {
    const sHeightClass =
      Array.isArray(this.props.items) && this.props.items.length > 5
        ? "select-box-scroll"
        : "";


    return (
      <select-box class={[this.props.className].join(" ")}>
        <div className="select-box-container">
          {this.props.label ? <label>{this.props.label}</label> : null}
          <div
            className="select-box"
            onClick={this.props.showToggle}
            ref="select-box"
            onBlur={this.props.onBlur}
            onKeyDown={this.onSearchInputKeyDown.bind(this)}
            onKeyUp={this.onSearchInputKeyUp.bind(this)}
          >
            <div
              onMouseOver={this.handleMouseOverState.bind(this)}
              onMouseOut={this.handleMouseLeaveState.bind(this)}
              className={[
                "selected",
                this.props.items && this.props.items.length <= 1
                  ? " single"
                  : ""
              ].join(" ")}
            >
              {this.props.selected}
              <Button
                className={"select-box-down-arrow"}
                ref={this.downArrowRef}
                onMouseOver={this.handleMouseOverState.bind(this)}
                onMouseOut={this.handleMouseLeaveState.bind(this)}
                icon={this.state.btnIcon}
                style={{
                  visibility:
                    this.props.items && this.props.items.length <= 1
                      ? "hidden"
                      : "auto"
                }}
              />
            </div>
            <div className={["select-box-elements", sHeightClass].join(" ")}>
              {this.props.items &&
                this.props.items.map((ele, index) =>
                  (this.props.hideTitleOnExpand &&
                    this.props.title !== ele.title) ||
                  (!this.props.hideTitleOnExpand &&
                    ele.title !== this.props.selected) ? (
                    <div
                      key={ele.title}
                      onClick={oEvent =>
                        this.props.onChange(oEvent, index, ele.key)
                      }
                      className="select-element"
                      ref={ele.title}
                    >
                      {ele.title}
                    </div>
                  ) : null
                )}
            </div>
          </div>
        </div>
      </select-box>
    );
  }
}

export default SelectBox;
