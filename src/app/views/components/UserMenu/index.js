import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import * as common from "app/utility/common";
import * as constants from "../../../AppConfig/constants";
import HandlerContext from "app/views/Context/HandlerContext";

import "./index.scss";

/**
 * Class for rendering a carousel row with header and video info
 */
class UserMenu extends React.PureComponent {
  static contextType = HandlerContext;
  /**
   * Component Name - UserMenu
   * Click event for filter dropdown
   * @param { Object} item Item that has been selected from dropdown.
   */
  userMenuOptionClicked(index, eve) {
    this.props.handleUserMenuDropDown(index, eve);
  }

  /**
   * Component Name - UserMenu
   * renders the UI.
   * @param null
   * @returns {undefined}
   */
  render() {
    const userMenuList =
      this.props.locale === "en"
        ? constants.USER_MENU_DROP_DOWN_VALUE_ENG
        : constants.USER_MENU_DROP_DOWN_VALUE_ARB;
    let userIdentifier = common.getUserIdentifier();

    const openUserMenuClass = this.props.showUserMenuDropDown ? "open" : "";

    return (
      <React.Fragment>
        <div className={"user-menu " + this.props.className || ""}>
          <div className="user-menu-tab" onClick={this.props.onSignInClick}>
            <div className="listing-filters">
              <select-box
                className={openUserMenuClass}
                ref={this.filterSelectBox}
              >
                <div className="select-box-container">
                  <div className="select-box">
                    {/* <Button className={"select-box-down-arrow"} icon={this.props.downArrowIcon} /> */}
                    <div className="select-box-elements">
                      {userMenuList.map((ele, index) => {
                        return (
                          <div
                            key={"filter-desktop-" + ele.key}
                            onClick={this.userMenuOptionClicked.bind(
                              this,
                              index
                            )}
                            className="select-element"
                          >
                            {ele.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </select-box>
            </div>
            <span>{userIdentifier}</span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

/**
 * Component - UserMenu
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    loginDetails: state.loginDetails
  };
};

export default withRouter(connect(mapStateToProps)(UserMenu));
