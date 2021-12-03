import React from "react";
import Switch from "react-switch";
import "./index.scss";

class ToggleButton extends React.Component {
  render() {
    return (
      <label htmlFor="icon-switch">
        <Switch
          offColor={this.props.offColor || "#000"}
          onColor={this.props.onColor || "#000"}
          offHandleColor={this.props.offHandleColor || "#2c2c2c"}
          onHandleColor={this.props.onHandleColor || "#39ff00"}
          handleDiameter={this.props.handleDiameter || 10}
          checked={this.props.checked}
          onChange={this.props.onChange}
          disabled={this.props.disabled}
          uncheckedIcon={<div> </div>}
          checkedIcon={<div />}
          width={this.props.width || 28}
          height={this.props.height || 56}
          className="toggle-button"
          id="icon-switch"
        />
      </label>
    );
  }
}

export default ToggleButton;
