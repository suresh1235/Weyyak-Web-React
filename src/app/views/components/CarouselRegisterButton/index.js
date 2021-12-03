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
import { connect } from "react-redux";
import Button from "core/components/Button";
import oResourceBundle from "app/i18n/";
import { isUserLoggedIn, isMENARegion } from "app/utility/common";
import "./index.scss";

class CarouselRegisterButton extends React.Component {
  state = {
    isUserLoggedIn: isUserLoggedIn()
  };
  /**
   * Component Name - CarouselRegisterButton
   * @param { null }
   * @returns { Object }
   */
  render() {
    const className = this.props.className + " subscribe-register-button";
    return (
      <React.Fragment>
        <div className="carousel-subscribe-button-container">
          <Button className={className} onClick={this.props.onClick}>
            {this.state.isUserLoggedIn ||
            isMENARegion(this.props.sCountryCode)
              ? oResourceBundle.start_your_trial_subscription
              : oResourceBundle.register_or_subscribe}
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

/**
 * Component - CarouselRegisterButton
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    isUserSubscribed: state.bIsUserSubscribed,
    sCountryCode: state.sCountryCode
  };
};

export default connect(mapStateToProps)(CarouselRegisterButton);
