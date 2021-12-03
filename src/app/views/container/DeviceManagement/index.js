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
import BaseContainer from 'core/BaseContainer/';
import { connect } from 'react-redux';
import * as constants from '../../../AppConfig/constants';
import * as actionTypes from 'app/store/action/';
import Input from '../../../../core/components/Input/';
import Button from '../../../../core/components/Button/';
import DeviceItem from 'app/views/components/DeviceItem';
import { isUserLoggedIn } from 'app/utility/common';
import Spinner from 'core/components/Spinner';
import oResourceBundle from 'app/i18n/';
import { withRouter } from "react-router-dom";
import './index.scss';

class DeviceManagement extends BaseContainer {
  /**
   * Represents DeviceManagement.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {
      pairingCode: '',
      errorPairingMessage: '',
      bPairingSuccess: false,
      showPairingMessage: false
    }
  }
  /**
   * Component Name - DeviceManagement
   * change state besed props
   * @param {object} nextProps
   * @param {object} nextState
   * @returns { Object } modified state
   */
  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextState.prevProps && nextProps.locale !== nextState.prevProps.locale) {
      return {
        errorPairingMessage: '',
        bPairingSuccess: false,
        showPairingMessage: false,
        prevProps: nextProps
      };
    }
    // Return null to indicate no change to state.
    return {
      prevProps: nextProps
    };
  }
  componentDidMount() {
    this.fnScrollToTop();
    if (isUserLoggedIn()) {
      this.props.fetchLoggedInDevices(null, null, true);
    } else {
      this.props.history.push(`/${this.props.locale}/${constants.LOGIN}`);
    }
  }

  componentDidUpdate() {
    if (this.props.loginDetails && !this.props.loginDetails["bSuccessful"]) {
      this.props.history.push(`/${this.props.locale}/${constants.LOGIN}`);
    }
  }
  /**
   * Component Name - DeviceManagement
   * It returns jsx to be rendered
   * @param {string} sDeviceId
   * @returns { undefined }
   */
  handleSignOutDevice(sDeviceId) {
    this.props.fnLogOutFromDevice(sDeviceId, () => {
      //Device logout succss
      this.props.fetchLoggedInDevices(null, null, true);
    }, () => {
      //Device logout failed
    });
  }
  /**
   * Component Name - DeviceManagement
   * Log out from all devices
   * @param {null}
   * @returns { undefined }
   */
  handleSignOutAllDevice() {
    this.props.fnSignOutFromAllDevices(() => {
      //All Device logout succss
      this.props.fetchLoggedInDevices(null, null, true);
    }, () => {
      //All Device logout failed
    });
  }

  /**
   * Component Name - DeviceManagement
   *  Form Inputs Changes, Updating the State.
   * @param {object} oEvent - Event hanlder
   */
  handleFormInputs(oEvent) {
    this.setState({ [oEvent.target.name]: oEvent.target.value });
  }
  /**
   * Component Name - DeviceManagement
   * Add pairing code handler.
   * @param {object} oEvent - Event hanlder
   */
  hanldeAddPairingCode() {
    this.state.pairingCode.length !== 0 &&
      this.props.fnAddPairingCode(this.state.pairingCode, (oSuccess) => {
        //Add pairing code success
        this.setState({ errorPairingMessage: oResourceBundle.pairing_success, showPairingMessage: true, bPairingSuccess: true });
      }, (oError) => {
        //Add pairing code failed
        if (oError && oError.data && oError.data.description) {
          this.setState({ errorPairingMessage: oError.data.description, showPairingMessage: true, bPairingSuccess: false });
        }
      });
  }
  /**
   * Component Name - DeviceManagement
   * Add pairing code keypress handler
   * @param {object} oEvent - Event hanlder
   */
  onAddPairingInputkeyPress(oEvent) {
    if (oEvent.keyCode === 13) {
      this.hanldeAddPairingCode();
    }
  }
  /**
   * Component Name - DeviceManagement
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    return (
      <React.Fragment>
        <div className="device-container">
          <div className="device">
           {/*  <div className="overlay-title"><span>{oResourceBundle.device_management}</span></div> */}
            <section className="device-info">
              <div className="device-info-title">
              <div className="device-info-instructions">
                <ul>
                  <li><p>{oResourceBundle.pairing_desc_1}</p></li>
                  <li><p>{oResourceBundle.pairing_desc_2}</p></li>
                  <li><p>{oResourceBundle.pairing_desc_3}</p></li>
                </ul>
              </div>
                <span>{oResourceBundle.enter_pairing_code_to_connect}</span>
              </div>
              <div className="device-info-input">
                <div className="row">
                  <div className="inner-column">
                    <Input id="pairingCode" type="text" name="pairingCode" className="pairing-code" placeholder={oResourceBundle.enter_pairing_code}
                      onKeyDown={this.onAddPairingInputkeyPress.bind(this)} value={this.state.pairingCode} onChange={this.handleFormInputs.bind(this)} />
                  </div>
                </div>
              </div>
              {/* <div className="devices-info-image">
                <img alt={"devices icon"} src={devicesIcon} />
              </div> */}
              <div className="device-info-text">
                {/* <p>{oResourceBundle.pairing_desc_1}</p>
                <p>{oResourceBundle.pairing_desc_2}</p>
                <p>{oResourceBundle.pairing_desc_3}</p> */}
                <Button className="btn-add" onClick={this.hanldeAddPairingCode.bind(this)}>{oResourceBundle.verify}</Button>
                {
                  this.state.showPairingMessage ?
                    <div className={["message", (!this.state.bPairingSuccess ? "error" : "")].join(" ")} >{this.state.errorPairingMessage}</div> : null
                }
              </div>
            </section>
            {
              this.props.aLoggedInDevices.length === 0 ?
                <p className="no-devices">{oResourceBundle.no_devices_paired}</p> :
                <section className="device-connected-devices">
                  <div className="devices-title"><span>{oResourceBundle.devices}</span></div>
                  {
                    this.props.aLoggedInDevices.map((deviceItem) =>
                      <DeviceItem handleSignOut={this.handleSignOutDevice.bind(this)} key={deviceItem.id} name={deviceItem.name} actionText={oResourceBundle.sign_out} active={true} id={deviceItem.id} />)
                  }
                  <div className="devices-signout-title">
                    <Button className={"sign-out-all"} onClick={this.handleSignOutAllDevice.bind(this)}>{oResourceBundle.sign_out_all}</Button>
                  </div>
                </section>
            }

          </div>
        </div>
        {this.props.loading ? <Spinner /> : null}
      </React.Fragment >
    )
  }
}

/**
* method that maps state to props.
* Component - DeviceManagement
* @param {Object} dispatch - dispatcher from store.
* @return {Object} - dispatchers mapped to props
            */
const mapDispatchToProps = dispatch => {
  return {
    fetchLoggedInDevices: (fnSuccess, fnFailed, bShouldDispatch) => {
      dispatch(actionTypes.fnFetchLoggedInDevices(fnSuccess, fnFailed, bShouldDispatch));
    },
    fnLogOutFromDevice: (sDeviceId, fnSuccess, fnFailed) => {
      dispatch(actionTypes.fnLogOutFromDevice(sDeviceId, fnSuccess, fnFailed));
    },
    fnSignOutFromAllDevices: (fnSuccess, fnFailed) => {
      dispatch(actionTypes.fnSignOutFromAllDevices(fnSuccess, fnFailed));
    },
    fnAddPairingCode: (sPairingCode, fnSuccess, fnFailed) => {
      dispatch(actionTypes.fnAddPairingCode(sPairingCode, fnSuccess, fnFailed));
    }
  }
}

/**
* Component - DeviceManagement
* method that maps state to props.
* @param {Object} state - state from redux store.
* @return {Object} - state mapped to props
            */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    aLoggedInDevices: state.aLoggedInDevices,
    loading: state.loading,
    loginDetails: state.loginDetails
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeviceManagement));
