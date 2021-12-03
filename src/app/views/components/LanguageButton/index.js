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
import Button from 'core/components/Button';
import arLangIcon from 'app/resources/assets/header/ic-ar.svg';
import enLangIcon from 'app/resources/assets/header/ic-en.svg';
import Tooltip from 'core/components/Tooltip';
import { isMobile } from 'react-device-detect';
import oResourceBundle from 'app/i18n/';
import './index.scss';

/**
 * Class to render language switch button
 */
export default class LanguageButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false
    }
  }

  /**
  * Helper function to show tooltip
  * @param {boolean} show
  */
  handleTooltipShow(e) {
    if ((isMobile !== undefined && !isMobile)) {
      !this.state.showTooltip && this.setState({ showTooltip: true });
    }
  }
  /**
  * Helper functio to hide tooltip
  * @param {boolean} show
  */
  handleTooltipHide(e) {
    this.state.showTooltip && this.setState({ showTooltip: false });
  }
  /**
   * Render function to show tooltip
   * @param {null}
   * @return {Object}
   */

  render() {
    //const btnIcon = (this.props.locale === "ar") ? (this.state.showTooltip ? enLangIcon : arLangIcon) : (this.state.showTooltip ? arLangIcon : enLangIcon);
    const btnIcon = (this.props.locale === "ar") ? enLangIcon : arLangIcon;
    return <div className="languagebtn-container">
      <Button
        onMouseOut={(e) => this.handleTooltipHide(e)}
        onMouseOver={(e) => this.handleTooltipShow(e)}
        className="langButton"
        icon={btnIcon}
        alt={oResourceBundle.language}
        onClick={this.props.onLanguageButtonCLick}></Button>
      {this.state.showTooltip ? <Tooltip parent="langButton" > {oResourceBundle.change_language} </Tooltip> : null}
    </div>
  }
}
