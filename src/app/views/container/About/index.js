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
import BaseContainer from "core/BaseContainer/";
import Button from "../../../../core/components/Button/";
import icon from "../../../resources/assets/login/ic-delete.png";
import imageTop from "../../../resources/assets/about/about-top-image.png";
import imageBottom from "../../../resources/assets/about/about-bottom-image.png";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import "./index.scss"; 

class About extends BaseContainer {
  
  render() {
    return (

      <React.Fragment>
      <div className="about-overlay">
      
        <div className="about-overlay-container">
          <div className="static-page">
            <div className="about-heading"><h1>{oResourceBundle.about}</h1></div>
            <div className="image-top">
         <img src={imageTop} alt="image-top" />
        </div>
        <div className="description">
          {ReactHtmlParser(oResourceBundle.about_content)}
        </div>
        <div className="middle-heading">
          {oResourceBundle.about_weare}
        </div>
        <div className="middle-heading2">
          {oResourceBundle.about_everywhere}
        </div>
        <div className="image-bottom">
           <img src={imageBottom} alt="image-bottom" />
          </div>
          <div className="bottom-text">
          {oResourceBundle.about_bottom_text}
          </div>

          </div>
        </div> 
       
       
      </div>
    </React.Fragment>
    );
  }
}

/**
 * Component - Login
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale
  };
};

export default withTracker(connect(mapStateToProps)(About));
