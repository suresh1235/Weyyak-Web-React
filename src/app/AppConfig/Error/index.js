/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import oResourceBundleModelError from 'core/localization/index-error.js';
import arError from './properties/error-ar.json';
import enError from './properties/error-en.json';


oResourceBundleModelError.setResourceModels({
  en: enError,
  ar: arError
})
oResourceBundleModelError.setLanguage("ar");

//Export the bundle to the other components
export default oResourceBundleModelError.oResourceBundleError;