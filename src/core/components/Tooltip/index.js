/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */


import React from 'react';
import ReactDOM from 'react-dom'
import './index.scss';
import 'array-from-polyfill';

export default class Tooltip extends React.Component {
  /**
   * Represents Tooltip.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    const span = document.createElement('span');
    span.setAttribute('class', `dynamic-class`);
    const tag = Array.from(document.getElementsByClassName(this.props.parent));
    this.state = {
      node: span,
      parent: tag
    }
  }
  /**
   * Component Name - Tooltip
   * Executes when component mounted to DOM.
   */
  componentDidMount() {
    this.state.parent.map(element => element.appendChild(this.state.node));
  }

  /**
  * Component Name - Tooltip
  * Executes when component will un-mount from DOM.
  */
  componentWillUnmount() {
    this.state.parent.map(element => element.removeChild(this.state.node));
  }

  render() {
    return ReactDOM.createPortal(<>
      <div className={`tooltip-box tooltip-data`}>
        <div className='tooltip-message'>{this.props.children}</div>
      </div>
      }
    </>,
      this.state.node,
    );
  }
}

