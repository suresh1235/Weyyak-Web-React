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
import {withRouter} from "react-router-dom";
import Header from "core/components/Header/";
import HeaderContentLeft from "app/views/components/AppHeader/ContentLeft";
import HeaderContentMiddle from "app/views/components/AppHeader/ContentMiddle";
import HeaderContentRight from "app/views/components/AppHeader/ContentRight";

class AppHeader extends React.Component {
  /**
   * Component Name - AppHeader
   * It is a render method of Header Component in which we will render HeaderContentLeft, HeaderContentRight and HeaderContentRight.   *
   * @param { null }
   * @returns { Object }
   */
  render() {
    return (
      <Header
        contentLeft={
          this.props.geoBlock ? null : (
            <HeaderContentLeft
              locale={this.props.locale}
              showSearchInput={this.props.showSearchInput}
              onMenuButtonClick={this.props.onMenuButtonClick}
              onSearchButtonClick={this.props.onSearchButtonClick}
              handleSearchInputText={this.props.handleSearchInputText}
              keyPress={this.props.keyPress}
              keyUp={this.props.keyUp}
              keyDown={this.props.keyDown}
              userInputText={this.props.userInputText}
            />
          )
        }
        contentMiddle={
          <HeaderContentMiddle onLogoClick={this.props.onLogoClick} />
        }
        contentRight={
          this.props.geoBlock ? null : (
            <HeaderContentRight
              locale={this.props.locale}
              showSearchButton={this.props.showSearchButton}
              showSubscriptionButton={this.props.showSubscriptionButton}
              showSearchInput={this.props.showSearchInput}
              onLanguageButtonCLick={this.props.onLanguageButtonClickHandler}
              onSearchButtonClick={this.props.onSearchButtonClick}
              onSignInClick={this.props.onSignInClick}
              showUserMenuDropDown={this.props.showUserMenuDropDown}
              handleSearchInputText={this.props.handleSearchInputText}
              keyPress={this.props.keyPress}
              keyUp={this.props.keyUp}
              keyDown={this.props.keyDown}
              userInputText={this.props.userInputText}
            />
          )
        }
      />
    );
  }
}
export default withRouter(AppHeader);
