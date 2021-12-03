import React, { Component } from "react";
import PropTypes from "prop-types";
import ScrollMenu from "react-horizontal-scrolling-menu";
import Button from 'core/components/Button';
import downArrow from 'app/assets/thumbnail/ic-down-arrow.png';
import "./index.scss";

const Arrow = ({ text, className }) => {
  return <div className={className}>
    <Button className="arrow-btn" icon={downArrow} />
  </div>;
};
Arrow.propTypes = {
  className: PropTypes.string
};

export const ArrowLeft = Arrow({ className: "arrow-prev" });
export const ArrowRight = Arrow({ className: "arrow-next" });

class HorizontalList extends Component {
  onUpdate = ({ translate }) => {
  };

  onSelect = key => {
  };

  componentDidUpdate(prevProps, prevState) {
  }

  setSelected = ev => {
  };

  render() {
    const menu = this.props.children;
    return (
      <ScrollMenu
        menuClass={this.props.className}
        ref={el => (this.menu = el)}
        data={menu}
        arrowLeft={ArrowLeft}
        arrowRight={ArrowRight}
        hideArrows={this.props.hideArrows}
        hideSingleArrow={this.props.hideSingleArrow}
        transition={+this.props.transition}
        onUpdate={this.props.onUpdate}
        onSelect={this.props.onSelect}
        selected={this.props.selected}
        translate={this.props.translate}
        alignCenter={this.props.alignCenter}
        dragging={this.props.dragging}
        clickWhenDrag={this.props.clickWhenDrag}
        wheel={this.props.wheel}
      />
    );
  }
}

export default HorizontalList;
