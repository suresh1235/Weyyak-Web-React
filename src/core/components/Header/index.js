
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
import closeIcon from "app/resources/assets/header/close.png";
import starIcon from "app/resources/assets/header/star.png";
import appicon from "app/resources/assets/header/appicon.png";
import './index.scss';
import { isMobile, isAndroid, isIOS } from "react-device-detect";
import {sendEvents} from "core/GoogleAnalytics/";

// import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';

const header = React.memo((props) => {
  let iscloseOpen = true;
  return (
  <header className="header">
  {isMobile?
  iscloseOpen && <div className="install_app" >
     {props.children}
    <div className="closeicon"  id="app_close_" onClick={() => iscloseOpen = !iscloseOpen} ><img src={closeIcon} /></div>
    <div className="alert_logo"><img src={appicon} /></div>
    <div className="alert_content">
      <p className="alert_title en">Weyyak app</p>
      <p className="alert_title ar">تطبيق وياك</p>
      <p className="alert_sbtitle en">Weyyak app</p>
      <p className="alert_sbtitle ar">تطبيق وياك</p>
      <div className="alert_star">
        <img src={starIcon} />
        <img src={starIcon} />
        <img src={starIcon} />
        <img src={starIcon} />
        <img src={starIcon} />
      </div>
      {isIOS?
        <div>
          <p className="get_app en">GET— On the App Store</p>
          <p className="get_app ar">  احصل عليه من App Store</p>
        </div>:
        <div>
         <p className="get_app_play en">Get it on Play Store</p>
         <p className="get_app_play ar"> احصل عليه من Play Store</p>
        </div>}
    </div>
    {isAndroid?
   <div>
    <div className="alert_view eninstall"><a href="https://play.google.com/store/apps/details?id=com.tva.z5" onClick="ga('send','event','App Installations','download-app-bar-clicked','play store', 'Click','Install');">Install</a></div>
    <div className="alert_view arinstall"><a href="https://play.google.com/store/apps/details?id=com.tva.z5" onClick="ga('send','event','App Installations','download-app-bar-clicked','play store', 'Click','Install');">حمّله الآن</a></div>
    </div>:
    <div>
    <div className="alert_view eninstall"><a href="https://apps.apple.com/in/app/z5-weyyak-%D9%88%D9%8A%D8%A7%D9%83/id1226514781" onClick="ga('send','event','App Installations','download-app-bar-clicked','app store','Click','Install');">Install</a></div>
    <div className="alert_view arinstall"><a href="https://apps.apple.com/in/app/z5-weyyak-%D9%88%D9%8A%D8%A7%D9%83/id1226514781" onClick="ga('send','event','App Installations','download-app-bar-clicked','app store','Click','Install');">حمّله الآن</a></div>
    </div>}
  </div>:""}

  <div className="header_bottom">
    <div className="contentLeft">
      {props.contentLeft}
    </div>
    <div className="contentMiddle">
      {props.contentMiddle}
    </div>
    <div className="contentRight">
      {props.contentRight}
    </div>
  </div>
</header>
  )

}

)
export default header;
