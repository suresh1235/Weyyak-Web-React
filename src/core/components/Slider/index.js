import React from "react";
import Slider from "react-slick";
import './index.scss';

class SlickSlider extends React.PureComponent {
  render() {
    let settings = { ...this.props };
    if (this.props.isSliding) {
      settings.beforeChange = () => this.props.isSliding(true)
      settings.afterChange = () => this.props.isSliding(false)
    }
    settings.className = 'Horizontal-menu' + (this.props.className ? " " + this.props.className : "");
    if (!this.props.isCarousel) {

      settings.responsive = [
        {
          breakpoint: 5000,
          settings: {
            slidesToShow: 7,
            slidesToScroll: 7,
            infinite: this.props.children.length > 7 ? true : false,
            rtl: this.props.rtl
          }
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 6,
            infinite: this.props.children.length > 6 ? true : false,
            rtl: this.props.rtl
          }
        },
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
            infinite: this.props.children.length > 5 ? true : false,
            rtl: this.props.rtl
          }
        },
        {
          breakpoint: 960,
          settings: {
            draggable: false,
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: this.props.children.length > 4 ? true : false,
            rtl: this.props.rtl
          }
        },
        {
          breakpoint: 768,
          settings: {
            draggable: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: this.props.children.length > 3 ? true : false,
            rtl: this.props.rtl
          }
        },
        {
          breakpoint: 500,
          settings: {
            draggable: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: this.props.children.length > 2 ? true : false,
            rtl: this.props.rtl
          }
        },
        {
          breakpoint: 300,
          settings: {
            draggable: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: this.props.children.length > 1 ? true : false,
            rtl: this.props.rtl
          }
        }
      ]
    }

    return (
      <Slider {...settings} >
        {this.props.children}
      </Slider>
    )
  }
}

export default SlickSlider;
