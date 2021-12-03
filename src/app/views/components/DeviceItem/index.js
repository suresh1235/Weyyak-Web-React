import React from 'react';
import './index.scss';
import Button from 'core/components/Button/';

const episodesItem = React.memo((props) => {
  return (
    <div className="device-item">
      <div className="device-item-name">
        <span>{props.name}</span>
      </div>
      <div className={props.active ? "device-item-status--signout" : "device-item-status--inactive"}>
        <Button className={"sign-out-btn"} onClick={()=>{props.handleSignOut(props.id)}}>{props.actionText}</Button>
        {!props.active ? <span className="status-inactive"></span> : null}
      </div>
    </div>
  );
})

export default episodesItem;