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
import './index.scss';

/**
  * Represents dropdown.
  * @param {Object} props - Properties of the Component.
  */
const dropdown = React.memo((props) => (
  <select
    id={props.id || ' '}
    value={props.value || ' '}
    name={props.type}
    className={'dropdown ' + props.className || ' '}
    style={props.style ? props.style : {}}
    onChange={(eve) => props.handleDropDownValue(eve)}>
    {props.list.map(item => {
      return <option value={item.key} key={item.key || ' '}>{item.text}</option>
    })}
  </select>
));
export default dropdown;