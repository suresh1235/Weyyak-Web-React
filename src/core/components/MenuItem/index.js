import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import './index.scss';

const menuItem = React.memo((props) =>
  (
    <div className="menuItem">
      <span onClick={(oEvt) => props.onClick && props.onClick(oEvt)}>{
        props.showHTMLText ? ReactHtmlParser(props.text) : props.text
      }</span>
    </div>
  ));

export default menuItem;