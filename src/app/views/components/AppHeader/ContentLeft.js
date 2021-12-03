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
import { withRouter } from "react-router-dom";
import Button from "core/components/Button/";
import { Link } from "react-router-dom";
import * as features from "app/AppConfig/features";
import searchIcon from "app/resources/assets/header/ic-search.svg";
import arrowIcon from "app/resources/assets/header/search-arrow.svg";
import menuImage from "app/resources/assets/hamburgermenuicon.svg";
import SelectedmenuImage from "app/resources/assets/hamburgermenuSelected.svg";
import oResourceBundle from "app/i18n/";
import HandlerContext from "app/views/Context/HandlerContext";
import { fnConstructContentURL } from "app/utility/common";
import LanguageButton from "app/views/components/LanguageButton/";
import * as common from "app/utility/common";
import * as CONSTANTS from 'app/AppConfig/constants';

import "./index.scss";

class HeaderContentLeft extends React.PureComponent {
    static contextType = HandlerContext;

    constructor(props) {
        super(props);
        this.state = {
            MenuActive: false,
        }
    }
    /**
     * Component Name - HeaderContentLeft
     * Executes when component updated after props or state change
     * @param {object} prevProps - Previous props
     * @param {object} prevState - Previous states
     */

    componentDidMount() {
        common.isUserSubscribed();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.showSearchInput !== this.props.showSearchInput &&
            this.props.showSearchInput
        ) {
            this.refs["search-input"].focus();
        }
        // alert()
        // console.log(this.props)
        if (this.props.show) {
            this.setState({
                MenuActive: true
            })
        }
        else {
            this.setState({
                MenuActive: false
            })
        }
    }


    subcriptionClick = (e) => {
        // window.location.href=`/${this.props.locale}/plans-description`
        this.props.history.push(`/${this.props.locale}/${CONSTANTS.PLANS_DESCRIPTION}`);
    }

    onMenuButtonSelected = (e) => {
        // this.setState({
        //     MenuActive: !this.state.MenuActive
        // })
        this.props.onMenuButtonClick(e)
    }

    /**
     * Component Name - HeaderContentLeft
     * It is Left Part in Header Section that will consist of Menu-Icon,Search.
     * @param { null }
     * @returns { Object }
     */
    render() {
        return (
            <React.Fragment>
                <Button
                    className="menu-icon"
                    icon={this.state.MenuActive ? SelectedmenuImage : menuImage}
                    onClick={(e) => this.onMenuButtonSelected(e)}
                    alt={oResourceBundle.btn_menu}
                />
                {features.ENABLE_SUBSCRIPTION &&
                    !this.props.isUserSubscribed &&
                    common.showSubscription(this.props.history.location.pathname) ? (
                    <Button
                        className="subscribe-btn"
                        onClick={this.context.onSubscribeButtonClick}
                    // onClick={(e)=>this.subcriptionClick(e)}
                    >
                        {oResourceBundle.subscribe}
                    </Button>
                ) : null}

                <LanguageButton
                    locale={this.props.locale}
                    onLanguageButtonCLick={this.props.onLanguageButtonCLick}
                />

                <div style={{ display: "none" }} className="vertical-separator left-separator" />
                <div
                    className={`search-bar ${this.props.showSearchInput ? "expand" : ""} ${this.props.userSearchResponseList.length > 0 ? 'hasResults' : ''}`}
                    tabIndex="0"
                    role="search"
                >
                    <Button
                        className="search-icon left-search-icon"
                        icon={searchIcon}
                        onClick={this.props.onSearchButtonClick}
                        alt={oResourceBundle.search}
                    />
                    <section className="search-form">
                        <input
                            type="text"
                            label={oResourceBundle.search_placeholder}
                            placeholder={oResourceBundle.search_placeholder}
                            maxLength="100"
                            autoComplete="off"
                            className="search-input"
                            onClick={evt => this.context.onSearchInputClicked(evt)}
                            aria-invalid="false"
                            ref="search-input"
                            onChange={
                                features.ENABLE_SEARCH ? this.props.handleSearchInputText : null
                            }
                            onKeyPress={this.props.keyPress}
                            onKeyUp={this.props.keyUp}
                            onKeyDown={this.props.keyDown}
                            value={this.props.userInputText}
                        />
                        <img className="arrow-icon img-fluid" src={arrowIcon} alt="search-arrow" />
                        {this.props.userSearchResponseList.length > 0 && (
                            <div className="select-box-container">
                                <div className="select-box">
                                    <div className="select-box-elements">
                                        {this.props.userSearchResponseList.map((ele, index) => {
                                            return this.props.userSearchResponseList[0].id !== 0 ? (
                                                <Link
                                                    aria-label={ele.title}
                                                    aria-required="true"
                                                    key={ele.id}
                                                    to={`/${this.props.locale}${fnConstructContentURL(
                                                        ele.content_type,
                                                        ele
                                                    )}`}
                                                >
                                                    <div className="select-element">{ele.title}</div>
                                                </Link>
                                            ) : (
                                                <div
                                                    className="select-element nodata"
                                                    key={ele.id}
                                                >
                                                    {ele.title}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        userSearchResponseList: state.userSearchResponseList,
        isUserSubscribed: state.bIsUserSubscribed
    };
};
// export default connect(mapStateToProps)(HeaderContentLeft);

export default withRouter(
    connect(mapStateToProps)(HeaderContentLeft));


