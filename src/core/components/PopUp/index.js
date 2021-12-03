import React from 'react';
import './index.scss';

const popUp = React.memo(React.forwardRef((props, ref) => {
  return props.show ? (
    <React.Fragment>
      <div className="popup-content" ref={ref}
        onMouseEnter={(evt) => props.onMouseOver && props.onMouseOver(evt)}
        onMouseLeave={(evt) => props.onMouseOut && props.onMouseOut(evt)}>
        {props.children}
      </div >
    </React.Fragment>
  ) : null;
}));

export default popUp;