import React from "react";
import MetaTags from "react-meta-tags";
import * as constants from "core/BaseContainer/constants";
import Logger from "core/Logger";
const MODULE_NAME = "BaseContainer";

export default class BaseContainer extends React.Component {
  onAppBodyClicked(oEvent) {
    Logger.log(MODULE_NAME, "App body clicked");
  }

  fnScrollToTop() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }

  fnConstructMetaTags(title, url, description, imageURL) {
    const oMetaTagObject = {
      title: null,
      metaProperties: [],
      metaNames: []
    };
    oMetaTagObject.title = title;

    oMetaTagObject.metaProperties = [
      {key: constants.OG_URL, value: url},
      {key: constants.OG_TYPE, value: constants.VIDEO_MOVIE},
      {key: constants.OG_TITLE, value: title},
      {key: constants.OG_DESCRIPTION, value: description},
      {key: constants.OG_IMAGE, value: imageURL}
    ];
    oMetaTagObject.metaNames = [
      {key: constants.DESCRIPTION, value: description},
      {key: constants.TITLE, value: title}
    ];
    if (url) {
      oMetaTagObject.canonical = url.replace("/en/", "/ar/");
    }
    return oMetaTagObject;
  }

  setSignalData(data, type, language, country, userid, uuid, pageviewSent) {
    // window.signal.content.season = null;
    // window.signal.content.series = null;
    // window.signal.content.episode = null;
    // window.signal.user.country = null;
    // window.signal.user.userid = null;
    var uidValue = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );

  
    if(uuid==undefined || uuid==null || uuid==false){
       uuid = localStorage.getItem("uuid");
     
       if(uuid==undefined || uuid==null || uuid==false){
       uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
      localStorage.setItem("uuid",uuid);
       }
    }
    // window.signal.user.uuid = null;
    // if (type === "series") {
    //   window.signal.content.season =
    //     data && data.seasons
    //       ? data.seasons[0]
    //         ? data.seasons[0].id + ""
    //         : null
    //       : null;
    //   window.signal.content.series = data.id + "";
    // }

    // if (type === "episode") {
    //   window.signal.content.season =
    //     data && data.season_id ? data.season_id + "" : null;
    //   window.signal.content.series =
    //     data && data.series_id ? data.series_id + "" : null;
    //   window.signal.content.episode =
    //     data && data.episode_number !== undefined
    //       ? data.episode_number + ""
    //       : null;
    // }

    // window.signal.content.genre = data && data.genres ? data.genres : null;
    // window.signal.content["sub-genre"] =
    //   data && data.sub_genre ? data.sub_genre : null;
    // window.signal.content["content-type"] = type ? type : null;
    // window.signal.content.keywords = data && data.cast ? data.cast : null;
    // window.signal.content.show_name = data && data.title ? data.title : null;
    // window.signal.content.language = language ? language : null;
    // window.signal.user.country = country ? country:null;
    // window.signal.user.userid = userid ? userid:uuid;
    // window.signal.user.uuid = uuid?uuid:null;
    // window.signal.content.country = country ? country : null;
    // window.signal.content.userid = data

    this.triggerEvent(window.document.body, "triggerAds");
    window.dataLayer.push({event: "triggerAds" });
    if (typeof window._em === "function" && pageviewSent) {
      window._em("send", "ajax", "");
    }
    // window.$("body").trigger("triggerAds");
    Logger.log(MODULE_NAME, "triggerAds");
  }

  triggerEvent(el, eventName, options) {
    var event;
    if (window.CustomEvent) {
      event = new CustomEvent(eventName, options);
    } else {
      event = window.document.createEvent("CustomEvent");
      event.initCustomEvent(eventName, true, true, options);
    }
    el.dispatchEvent(event);
  }

  fnUpdateMetaTags(props) {
    return (
      <MetaTags>
        <title>{`${props.title}`}</title>
        {props.metaProperties.map(ele => (
          <meta key={ele.key} property={ele.key} content={ele.value} />
        ))}
        {props.metaNames.map(ele => (
          <meta key={ele.key} name={ele.key} content={ele.value} />
        ))}

        {props.canonical && <link rel="canonical" href={props.canonical} />}
        <meta
          name={constants.APPLE_ITUNES_APP}
          content={constants.APPLE_ITUNES_APP_ID}
        />
        <meta
          name={constants.GOOGLE_PLAY_APP}
          content={constants.GOOGLE_PLAY_APP_ID}
        />
      </MetaTags>
    );
  }

  render() {
    return null;
  }
}
