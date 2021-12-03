import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { connect } from "react-redux";

class Recaptcha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  
  RecaptchaonChange = (value) => {
    let Verified = value ? true :false 
    this.props.isVerified(Verified)
  }


  render() {
    let Domine_Host = window.location.host 
    let lang = this.props.locale == "en" ? "en" : "ar"
    let siteKey = "6LfQ0wgdAAAAAOrlullRNOMT2Y2LY3PkP5QanO3g"

    if(Domine_Host.includes("localhost")){
      siteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // TestKey provided by Google
    }else if (Domine_Host.includes("webqa.weyyak.com")){
      siteKey = "6Le90wgdAAAAAPB4Hc8tjGzskE3YWRzE22T51JQL"
    }else if (Domine_Host.includes("webuat.weyyak.com")){
      siteKey = "6Lc81AgdAAAAAArfSvIyatQkDEg4paJzfc6WTtg7"
    }

    return (
      <div className="Recaptcha">
        <ReCAPTCHA
          sitekey={siteKey}
          hl={lang}
          onChange={this.RecaptchaonChange}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    locale: state.locale,
  };
};

export default  connect(mapStateToProps, null)(Recaptcha)

