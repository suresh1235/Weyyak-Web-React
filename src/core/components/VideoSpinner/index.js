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
 * Class to render circular spinner for video buffer
 */
const spinner = React.memo((props) => (
  <React.Fragment>
    <div className="video-spinner">
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle className="length" fill="none" strokeWidth="8" strokeLinecap="round" cx="33" cy="33" r="28"></circle>
      </svg>
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" strokeWidth="8" strokeLinecap="round" cx="33" cy="33" r="28"></circle>
      </svg>
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" strokeWidth="8" strokeLinecap="round" cx="33" cy="33" r="28"></circle>
      </svg>
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" strokeWidth="8" strokeLinecap="round" cx="33" cy="33" r="28"></circle>
      </svg>
    </div>
  </React.Fragment>
));
export default spinner;