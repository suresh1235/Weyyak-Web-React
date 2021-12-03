/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

//This component has dependency with core/components/Button
import React from 'react';
import Button from 'core/components/Button';

class SegmentedButton extends React.Component {
  /**
   * Component Name - SegmentedButton
   * Executes when component mounted to DOM.
   */
  constructor(props) {
    super(props);
    this.fnButtonClickHanlder = this.fnButtonClickHanlder.bind(this);
    this.state = {
      selected: props.selected
    }
  }
  /**
 * Component Name - SegmentedButton
 * hook method to modiy state based on props.
 * @param {object} props - props object 
 * @param {object} state - state object 
 * @returns {null/object} - null means no changes in state
 */
  static getDerivedStateFromProps(props, state) {
    if (props.selected !== state.selected) {
      return { selected: props.selected }
    }
    return null;
  }
  /**
   * Component's own Segment Button Click handler .
   * @param {object} event - event object 
   * @param {object} oSelectedBtnProps - selected button properties 
   */
  fnButtonClickHanlder(event, oSelectedBtnProps) {
    this.setState({ selected: oSelectedBtnProps.value })
  }
  render() {
    return (
      <React.Fragment>
        {this.props.options.map((ele) => {
          return (this.state.selected === ele.value) ?
            <Button key={ele.value} className={"selected" + (ele.className ? " " + ele.className : "")} value={ele.value}
              onClick={this.props.onSegmentedButtonClick ? this.props.onSegmentedButtonClick : this.fnButtonClickHanlder}>
              {ele.label}
            </Button> :
            < Button key={ele.value} className={(ele.className ? " " + ele.className : "")} value={ele.value}
              onClick={this.props.onSegmentedButtonClick ? this.props.onSegmentedButtonClick : this.fnButtonClickHanlder}>
              {ele.label}
            </Button>
        })}
      </React.Fragment>
    );
  }
}

export default SegmentedButton;
