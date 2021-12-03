import React from 'react';
import Rodal from 'rodal';

// include styles
import 'rodal/lib/rodal.css';
import './index.scss';

class Dialog extends React.Component {
  render() {
    return (
      <div>
        <Rodal {...this.props}
          visible={this.props.visible}
          onClose={this.props.onDialogClosed}>
          {this.props.children}
        </Rodal>
      </div>
    )
  }
}

export default Dialog;


/*
Property	Type	Default	Description
width	number	400	width of dialog
height	number	240	height of dialog
measure	string	px	measure of width and height
onClose	func	/	handler called onClose of modal
onAnimationEnd	func	/	handler called onEnd of animation
visible	bool	false	whether to show dialog
showMask	bool	true	whether to show mask
closeOnEsc	bool	false	whether close dialog when esc pressed
closeMaskOnClick	bool	true	whether close dialog when mask clicked
showCloseButton	bool	true	whether to show close button
animation	string	zoom	animation type
enterAnimation	string	/	enter animation type (higher order than 'animation')
leaveAnimation	string		leave animation type (higher order than 'animation')
duration	number	300	animation duration
className	string	/	className for the container
customStyles	object	/	custom styles
customMaskStyles	object	/	custom mask styles
*/