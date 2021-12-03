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
import {connect} from "react-redux";
import Spinner from "core/components/Spinner";
import withTracker from "core/GoogleAnalytics/";
import * as CONSTANTS from "../../../AppConfig/constants";
import * as actionTypes from "app/store/action/";
import Input from "../../../../core/components/Input/";
import Button from "../../../../core/components/Button/";
import errorIcon from "app/resources/assets/error.svg";
import goodIcon from "app/resources/assets/good.svg";
import {sendEvents} from "core/GoogleAnalytics/";
import oResourceBundle from "app/i18n/";
import {
  isUserLoggedIn,
  fnNavTo,
  fnCheckValidPassword
} from "app/utility/common";
import {toast} from "core/components/Toaster/";
import Dialog from "core/components/Dialog";

import "./index.scss";

class ChangePassword extends BaseContainer {
  /**
   * Represents ChangePassword.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      oldpass: "",
      newpass: "",
      newpassconfirm: "",
      error: {
        oldpass: " ",
        newpass: " ",
        newpassconfirm: " "
      },
      bEnableChangeBtn: false,
      showResponseDialog: false,
      showResponseDialogMessage: ""
    };
  }
  /**
   * Component Name - ChangePassword
   * Executes when component mounted to DOM.
   */
  componentDidMount() {
    this.fnScrollToTop();
    if (!isUserLoggedIn()) {
      fnNavTo.call(this, `/${this.props.locale}/${CONSTANTS.LOGIN}`);
    }
  }
  /**
   * Component Name - ChangePassword
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate() {
    if (this.props.loginDetails && !this.props.loginDetails["bSuccessful"]) {
      fnNavTo.call(this, `/${this.props.locale}/${CONSTANTS.LOGIN}`);
    }
  }
  fnCheckValidPassword() {}
  /**
   * Component Name - ChangePassword
   * Form Inputs Changes, Updating the State.
   * @param {object} oEvent - Event hanlder
   */
  handleFormInputs(oEvent) {
    const {name, value} = oEvent.target;
    this.setState(
      {
        [name]: value,
        error: {
          ...this.state.error,
          [name]:
            name === "newpass"
              ? fnCheckValidPassword(value) && value !== this.state.oldpass
                ? ""
                : "error"
              : fnCheckValidPassword(value)
                ? ""
                : "error"
        }
      },
      () => {
        if (fnCheckValidPassword(this.state.oldpass)) {
          this.setState(prevState => ({
            error: {...this.state.error, oldpass: ""}
          }));
        } else {
          this.setState(prevState => ({
            error: {
              ...this.state.error,
              oldpass:
                this.state.oldpass.length >= 6
                  ? oResourceBundle.password_alphanumeric
                  : oResourceBundle.password_length_error
            }
          }));
        }
        if (
          fnCheckValidPassword(this.state.oldpass) &&
          fnCheckValidPassword(this.state.newpass) &&
          fnCheckValidPassword(this.state.newpassconfirm) &&
          this.state.newpass === this.state.newpassconfirm &&
          this.state.newpass !== this.state.oldpass
        ) {
          if (this.state.newpass !== this.state.newpassconfirm) {
            this.setState({
              bEnableChangeBtn: true,
              error: {
                ...this.state.error,
                newpassconfirm:
                  this.state.newpassconfirm.length >= 6
                    ? oResourceBundle.password_alphanumeric
                    : oResourceBundle.password_length_error
              }
            });
          } else {
            this.setState({
              bEnableChangeBtn: true,
              error: {...this.state.error, newpassconfirm: "", newpass: ""}
            });
          }
        } else {
          this.setState(prevState => ({
            bEnableChangeBtn: false,
            error: {
              ...this.state.error,
              newpassconfirm: !(
                prevState.newpass !== "" &&
                prevState.newpassconfirm === prevState.newpass
              )
                ? prevState.newpass.length >= 6
                  ? oResourceBundle.password_alphanumeric
                  : oResourceBundle.password_length_error
                : ""
            }
          }));
        }
      }
    );
  }

  /**
   * Component Name - ChangePassword
   * Form Inputs Changes, Updating the State.
   * @param {object} state
   * @param {function} fnSuccess
   * @param {function} fnFailed
   */
  handleChangePassword() {
    this.setState({bEnableChangeBtn: false});
    if (
      this.props.oUserAccountDetails.registrationSource ===
      CONSTANTS.REGISTRATION_SOURCE_EMAIL
    ) {
      sendEvents(
        CONSTANTS.CHANGE_PASSWORD_CATEGORY,
        CONSTANTS.CHANGE_PASSWORD_ACTION,
        CONSTANTS.LABEL_EMAIL
      );
    } else if (
      this.props.oUserAccountDetails.registrationSource ===
      CONSTANTS.REGISTRATION_SOURCE_MOBILE
    ) {
      sendEvents(
        CONSTANTS.CHANGE_PASSWORD_CATEGORY,
        CONSTANTS.CHANGE_PASSWORD_ACTION,
        CONSTANTS.LABEL_MOBILE
      );
    }

    this.props.fnChangePassword(
      this.state,
      () => {
        //Success
        this.setState({
          showResponseDialog: true,
          showResponseDialogMessage: oResourceBundle.password_change_success
        });
      },
      e => {
        if (e && e.response && e.response.data && e.response.data.code) {
          toast.success(oResourceBundle.password_incorrect, {
            position: toast.POSITION.BOTTOM_CENTER
          });
          this.setState({
            bEnableChangeBtn: false,
            error: {...this.state.error, oldpass: "Text"}
          });
        } else {
          toast.success(oResourceBundle.something_went_wrong, {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      }
    );
  }

  /**
   * Component Name - ChangePassword
   * Form Inputs Changes, Updating the State.
   * @param {null}
   */
  hideResponseDialog() {
    this.setState({showResponseDialog: false});
  }

  /**
   * Component Name - ChangePassword
   * on Success dialog ok button press
   * @param {null}
   */
  onResponseDialogOkClicked() {
    this.setState({showResponseDialog: false}, () => {
      this.props.fnForLogOut();
      fnNavTo.call(this, `/${this.props.locale}/`);
      fnNavTo.call(this, `/${this.props.locale}/${CONSTANTS.LOGIN}`);
    });
  }

  /**
   * Component Name - ChangePassword
   * Key press on search input.
   * @param {object} oEvent - Event hanlder
   * @returns {undefined}
   */
  onPasswordInputkeyPress(oEvent) {
    if (
      oEvent.keyCode === CONSTANTS.ENTER_KEYCODE &&
      this.state.bEnableChangeBtn
    ) {
      this.handleChangePassword();
    }
  }
  /**
   * Component Name - ChangePassword
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        <div className="change-pass-container">
          <div className="change-pass">
            <div className="overlay-title">
              <span>{oResourceBundle.change_password}</span>
            </div>
            <div className="insert-password">
              <span>{oResourceBundle.insert_password_message}</span>
            </div>
            <div className="change-pass-form">
              <div
                className="forgot-pass"
                onClick={() =>
                  fnNavTo.call(
                    this,
                    `/${this.props.locale}/${CONSTANTS.FORGOT_PASSWORD}`
                  )
                }
              >
                <span>{oResourceBundle.forgot_password}</span>
              </div>
              <div className="label">{oResourceBundle.old_password}</div>
              <div className="change-pass-field">
                <Input
                  id="oldpass"
                  autoComplete="off"
                  type="password"
                  name="oldpass"
                  className="old-pass"
                  onChange={this.handleFormInputs.bind(this)}
                  value={this.state.oldpass}
                  onKeyDown={this.onPasswordInputkeyPress.bind(this)}
                />
                {this.state.error["oldpass"].length > 0 ? (
                  <img alt="error" src={errorIcon} />
                ) : (
                  <img alt="good" src={goodIcon} />
                )}
              </div>
              <div className="label">{oResourceBundle.new_password}</div>
              <div className="change-pass-field new">
                <Input
                  id="newpass"
                  autoComplete="off"
                  type="password"
                  name="newpass"
                  className="new-pass"
                  onChange={this.handleFormInputs.bind(this)}
                  value={this.state.newpass}
                  onKeyDown={this.onPasswordInputkeyPress.bind(this)}
                />
                {this.state.error["newpass"].length > 0 ? (
                  <img alt="error" src={errorIcon} />
                ) : (
                  <img alt="good" src={goodIcon} />
                )}
              </div>
              <div className="newpass-error">
                {this.state.oldpass.length > 0 &&
                this.state.oldpass === this.state.newpass
                  ? oResourceBundle.use_new_password
                  : ""}
              </div>
              <div className="label">
                {oResourceBundle.confirm_password_placeholder}
              </div>
              <div className="change-pass-field">
                <Input
                  id="newpassconfirm"
                  autoComplete="off"
                  type="password"
                  name="newpassconfirm"
                  className="new-pass-confirm"
                  onChange={this.handleFormInputs.bind(this)}
                  value={this.state.newpassconfirm}
                  onKeyDown={this.onPasswordInputkeyPress.bind(this)}
                />
                {this.state.error["newpassconfirm"].length > 0 ? (
                  <img alt="error" src={errorIcon} />
                ) : (
                  <img alt="good" src={goodIcon} />
                )}
              </div>
              <div className="confirm-password">
                <p>{oResourceBundle.confirm_password_message} </p>
              </div>
              <div className="change-pass-buttons">
                <Button
                  className="btn-change-pass"
                  disabled={!this.state.bEnableChangeBtn}
                  onClick={this.handleChangePassword.bind(this)}
                >
                  {oResourceBundle.confirm}
                </Button>
                <Button
                  className="btn-cancel"
                  onClick={() => this.props.history.goBack()}
                >
                  {oResourceBundle.btn_cancel}
                </Button>
              </div>
            </div>
          </div>
          {this.state.showResponseDialog ? (
            <Dialog
              visible={true}
              onDialogClosed={this.hideResponseDialog.bind(this)}
              duration={CONSTANTS.RATING_DIALOG_ANIMATION_DURATION}
              showCloseButton={false}
              closeOnEsc={true}
              width={CONSTANTS.SIGNOUTALL_DIALOG_WIDTH}
              height={CONSTANTS.SIGNOUTALL_DIALOG_HEIGHT}
            >
              <div className="signout-dialog-content">
                <div className="content">
                  <div className="dialog-title">
                    {oResourceBundle.my_account}
                  </div>
                  <div className="dialog-text">
                    {this.state.showResponseDialogMessage}
                  </div>
                </div>

                <div className="actions">
                  <Button
                    className="dialog-ok-btn"
                    onClick={this.onResponseDialogOkClicked.bind(this)}
                  >
                    {oResourceBundle.ok}
                  </Button>
                </div>
              </div>
            </Dialog>
          ) : null}
        </div>
        {this.props.loading && <Spinner />}
      </React.Fragment>
    );
  }
}

/**
 * method that maps state to props.
 * Component - ChangePassword
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  return {
    fnChangePassword: (oCurrentPassState, fnSuccess, fnFailed) => {
      dispatch(
        actionTypes.fnChangePassword(oCurrentPassState, fnSuccess, fnFailed)
      );
    },
    fnForLogOut: () => {
      dispatch(actionTypes.fnForLogOut());
    }
  };
};

/**
 * Component - ChangePassword
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    loading: state.loading,
    locale: state.locale,
    loginDetails: state.loginDetails,
    oUserAccountDetails: state.oUserAccountDetails
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChangePassword)
);
