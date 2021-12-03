import React from "react";
import BaseContainer from "core/BaseContainer/";
import oResourceBundle from "app/i18n/";
import safrawsefra1 from "app/resources/assets/thumbnail/safra-w-sefra-banner.png"
import safrawsefra2 from "app/resources/assets/thumbnail/safra-w-sefra-sticker.png"
import "./index.scss";

class CookingContestThankyou extends BaseContainer {

    constructor(props) {
        super(props);
        
    }

    render() {
    //     const seoTitle = oResourceBundle.website_meta_title;
    // const description = oResourceBundle.website_meta_description;
    //     const oMetaTags = this.fnUpdateMetaTags(oMetaObject);
    //     const oMetaObject = this.fnConstructMetaTags(
    //         seoTitle,
    //         window.location.href,
    //         description
    //       );
       
    
        return (
        <React.Fragment>
            {/* {oMetaTags} */}
               <div class='cooking-main-container contest-thankyou'>
            <div className="cooking-contest-container">
                <div className="cookingcontest-banner">
                    <img src={safrawsefra1} />
                </div>
                <div className="cookiking-contest-banner-sticker">
                    <img src={safrawsefra2} />
                </div>
            </div>
            <div className="thankyou-text">{oResourceBundle.contest_submitted}</div>
            <div className="thankyou-text1">{oResourceBundle.contest_thankyou_text1}</div>
            <div className="thankyou-text1">{oResourceBundle.contest_thankyou_text2}</div>
        </div>
        </React.Fragment>
     )
    }
}
export default CookingContestThankyou;