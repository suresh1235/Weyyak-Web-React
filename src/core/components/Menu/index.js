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

const menu = React.memo(
  React.forwardRef((props, ref) => (
    <section
      ref={ref}
      className={
        "sidemenu" +
        (props.className ? " " + props.className : "") +
        (props.show ? " show" : "")
      }
    >
      {props.showCloseBtn ? (
        <span className="closebtn" onClick={() => props.closeButtonClick()}>
          ×
        </span>
      ) : null}
      {props.children}
    </section>
  ))
);

export default menu;
