import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import './index.scss';

const menuItem = React.memo((props) =>
  (
    <div className="menuItem">
      {/* <img className="user-icon" src="https://contents-uat.weyyak.z5.com/52a1aca5-037c-4cff-8a0b-48d395ca93fc/mobile-menu"></img> */}
      {/* {console.log(props.img)} */}
     <div>
      {props.img && props.img!="NO"  ?  <img className="user-icon" src={props.img}></img> : props.img=="NO" ? "" :<img className="user-icon" src="https://contents-uat.weyyak.z5.com/52a1aca5-037c-4cff-8a0b-48d395ca93fc/mobile-menu"></img>}</div> 
      <span onClick={(oEvt) => props.onClick && props.onClick(oEvt)}>{
        props.showHTMLText ? ReactHtmlParser(props.text) : props.text
      }</span>
    </div>
  ));

export default menuItem;