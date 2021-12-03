/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

//This file is used for google analytics
import { ENABLE_GOOGLE_ANALYTICS } from "../Features/";
import { isUserLoggedIn } from "app/utility/common";
import { store } from "app/App";

//Initialise with tracking id
// export function initializeReactGA(sTrackingId) {
//   ENABLE_GOOGLE_ANALYTICS && ReactGA.initialize(sTrackingId);
// }
//Track events
export function sendEvents(
  sCategory,
  sAction,
  sLabel = null,
  eventValue = null
) {
  if (ENABLE_GOOGLE_ANALYTICS) {
    const locale = store.getState().locale;
    let oEventObject = {
      category: sCategory,
      action: sAction
    };
    let oGTMObject = {
      event: "eventGA",
      eventCategory: sCategory,
      eventAction: sAction,
      loggedIn: isUserLoggedIn(),
      
      language: locale === "ar" ? "arabic" : "english"
    };

    if (sLabel !== undefined) {
      oEventObject.label = sLabel;
      oGTMObject.eventLabel = sLabel;
    }
    if (eventValue !== undefined) {
      oEventObject.value = eventValue;
      oGTMObject.eventValue = eventValue;
    }
    //This is commented to use GTM module instead of GA
    //ReactGA.event(oEventObject);
    //Using GTM to send data
    window.dataLayer.push(oGTMObject);
  }
}

export default function withTracker(WrappedComponent, options = {}) {
  const trackPage = page => {
    // ReactGA.set({
    //   page,
    //   ...options
    // });
    // ReactGA.pageview(page);
  };

  const HOC = class extends WrappedComponent {
    componentDidMount() {
      if (ENABLE_GOOGLE_ANALYTICS) {
        const page = this.props.location.pathname;
        trackPage(page);
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (ENABLE_GOOGLE_ANALYTICS) {
        const currentPage = prevProps.location.pathname;
        const nextPage = this.props.location.pathname;

        if (currentPage !== nextPage) {
          trackPage(nextPage);
        }
      }
    }
  };

  return HOC;
}
