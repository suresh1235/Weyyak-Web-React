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
import ManageCookies from 'app/views/components/ManageCookies';

class ManageYourCookies extends BaseContainer {

    render() {
        return (
            <div className="manage-account">
                <div className="manage-account-conatiner ">
                    <ManageCookies MoreToggle={true} />
                </div>
            </div>
        );
    }
}

export default ManageYourCookies;
