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

const button = React.forwardRef((props, ref) => (
  <button
    ref={ref}
    tabIndex={props.tabIndex !== undefined ? props.tabIndex : "0"}
    onMouseEnter={evt => props.onMouseOver && props.onMouseOver(evt)}
    onMouseLeave={evt => props.onMouseOut && props.onMouseOut(evt)}
    onClick={evt => {
      props.onClick && props.onClick(evt, props);
    }}
    className={"btn " + (props.className ? props.className : "")}
    disabled={props.disabled || ""}
    value={JSON.stringify(props.value)}
    style={{
      ...props.style,
      color: props.disabled ? "rgba(0,0,0,0.38)" : null
    }}
  >
    {props.icon && !props.showIconAfter ? (
      <img
        className="icon"
        src={props.icon}
        alt={props.alt ? props.alt : "icon"}
      />
    ) : null}
    {props.children && <span>{props.children}</span>}
    {props.icon && props.showIconAfter ? (
      <img
        className="icon"
        src={props.icon}
        alt={props.alt ? props.alt : "icon"}
      />
    ) : null}
  </button>
));
export default button;
