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
import * as actionTypes from "app/store/action/";
import Grid from "app/views/components/Grid";
import { connect } from "react-redux";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import Logger from "core/Logger";
import * as common from "app/utility/common";
import { toast } from "core/components/Toaster/";
import * as CONSTANTS from "app/AppConfig/constants";

import "./index.scss";

class HeaderContent extends BaseContainer {
  MODULE_NAME = "BaseContainer";
  /**
   * Represents UserSearchList.
   * @constructor
   * @param {Object} props - Properties of the object.
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
  * Component Name - UserSearchList
  * Executes when component mounted to DOM.
  */
  componentDidMount() {
    this.fetchSearchData();
  }

  /**
   * Component Name - UserSearchList
   * Fetch search data.
   */
  fetchSearchData() {
    if (this.props.match.params.type) {
      const userInputText = this.props.match.params.type;
      let sCountryCode = localStorage.getItem("country")
      if (!sCountryCode) {
        sCountryCode = "IN"
      }
      // this.props.fnSearchUserInput(
      //   this.props.locale,
      //   { userInputText, bSearchTerm: true },
      //   false
      // );
      this.props.clearHeaderCOntent()
      this.props.fnHeaderMenuContent(
        sCountryCode,
        this.props.locale,
        this.props.match.params.type,
        oReponse => {
          //Success
          if (oReponse.code === 404) {
            common.showToast(
              CONSTANTS.GENERIC_TOAST_ID,
              oResourceBundle.payment_system_error,
              toast.POSITION.BOTTOM_CENTER
            );
          }
        },
        oError => {
          //Failed
          common.showToast(
            CONSTANTS.GENERIC_TOAST_ID,
            oResourceBundle.payment_system_error,
            toast.POSITION.BOTTOM_CENTER
          );
        }
      )
    }
    else {
      const { category, name } = this.props.match.params;
      this.props.fnSearchUserInput(
        this.props.locale,
        { category, name, bSearchTerm: false },
        false
      );
    }
  }

  /**
   * Component Name - UserSearchList
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    let userInputText = this.props.match.params.type;
    // alert(prevProps.match.params.type)

    if (userInputText && prevProps.locale !== this.props.locale) {
      this.fetchSearchData();
    } else if (this.props.match.params.type !== prevProps.match.params.type) {
      this.fetchSearchData();
    }
  }

  fnuserSearchPageResponseError(error) {
    Logger.log(
      this.MODULE_NAME,
      "Error that is coming is ==================>",
      error
    );
  }

  /**
   * Component Name - UserSearchList
   * Construct object with unique content type
   * @param null
   * @returns { undefined }
   */
  fnConstructUniqueContentType(aData) {
    let oUniqueContentValues = null;
    if (aData.length > 0) {
      oUniqueContentValues = aData.reduce((oUniqueContentValues, ele) => {
        ele.content_type = this.props.match.params.type
        const iFilteredItemIndex = oUniqueContentValues.findIndex(
          item => item.id === ele.content_type
        );
        if (iFilteredItemIndex > -1) {
          oUniqueContentValues[iFilteredItemIndex].content.push(ele);
        } else {
          oUniqueContentValues.push({
            id: ele.content_type,
            title:
              ele.content_type === "movie"
                ? oResourceBundle.movies
                : oResourceBundle.series,
            content: [ele]
          });
        }
        return oUniqueContentValues;
      }, []);
      oUniqueContentValues.unshift({
        id: oResourceBundle.all,
        title: oResourceBundle.all,
        content: oUniqueContentValues.reduce((aValues, ele) => {
          return aValues.concat(ele.content);
        }, [])
      });
    }
    return oUniqueContentValues;
  }

  fnAdsContainerLoaded() {
    Logger.log(
      this.MODULE_NAME,
      "fnAdsContainerLoaded: " + this.bAdSignalDataSent
    );
    super.setSignalData({}, {}, this.props.locale, this.props.sCountryCode, this.props.bPageViewSent);
    this.props.fnPageViewSent();
  }

  /**
   * Component Name - UserSearchList
   * It returns jsx to be rendered
   * @param null
   * @returns { undefined }
   */
  render() {
    const aUniquContentTypeValues = this.fnConstructUniqueContentType(
      this.props.aHeaderMenuContent
    );

    return (
      <React.Fragment>
        {this.props.aHeaderMenuContent &&
          this.props.aHeaderMenuContent.length > 0 &&
          this.props.aHeaderMenuContent[0].id !== 0 ? (
          <div className="user-search-container">
            <Grid
              isSearchPage={false}
              iscontent={true}
              title={oResourceBundle.all}
              data={aUniquContentTypeValues}
              gridItems={this.props.aHeaderMenuContent}
              locale={this.props.locale}
              adsContainerLoaded={this.fnAdsContainerLoaded.bind(this)}
            />
          </div>
        ) : null}
        {this.props.aHeaderMenuContent &&
          this.props.aHeaderMenuContent.length > 0 &&
          this.props.aHeaderMenuContent[0].id === 0 ? (
          <div className="no-results">
            {oResourceBundle.search_error_no_results}
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

/**.
 * Component - UserSearchList
 * @param {Object} dispatch - dispatcher from store.
 * @return {Object} - dispatchers mapped to props
 */
const mapDispatchToProps = dispatch => {
  //dispatch action to redux store
  return {
    fnSearchUserInput: (sLocale, oSearchTerm, bUpdateSearchInput) => {
      dispatch(
        actionTypes.fnSearchUserInput(sLocale, oSearchTerm, bUpdateSearchInput)
      );
    },
    clearHeaderCOntent: () => {
      dispatch(actionTypes.clearHeaderCOntent());
    },
    fnHeaderMenuContent: (sCountryCode, sLocale, sContentType, fnSuccess, fnFailed) => {
      dispatch(
        actionTypes.fnHeaderMenuContent(
          sCountryCode,
          sLocale,
          sContentType,
          fnSuccess,
          fnFailed
        )
      );
    },
    fnPageViewSent: () => {
      dispatch(actionTypes.fnPageViewSent());
    }
  };
};

/**
 * Component - UserSearchList
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  return {
    locale: state.locale,
    sCountryCode: state.sCountryCode,
    userSearchPageResponse: state.userSearchPageResponse,
    bPageViewSent: state.bPageViewSent,
    aHeaderMenuContent: state.aHeaderMenuContent
  };
};

export default withTracker(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HeaderContent)
);
