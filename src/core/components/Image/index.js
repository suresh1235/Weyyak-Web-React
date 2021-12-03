/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import React from "react";
import "./index.scss";

/**
 * Component used to render a <img/> with a fallback
 *
 * @class Image
 *
 * @example
 * <Image src={image_url} alt={alt_text}/>
 */
class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onError = () => {
      if(this.props.imageLoaded) {
        this.props.imageLoaded()
      }
      if (this.props.fallbackSrc) {
        this.setState({
          failed: true
        });
      }
    };
  }

  render() {
    return (
      <React.Fragment>
        {this.state.failed || this.props.delayImage ? (
          <div
            className={
              "carousel-default-image" +
              (this.props.className ? " " + this.props.className : "")
            }
            ref="image"
          >
            <img src={this.props.fallbackSrc} alt={this.props.alt || "image"} />
          </div>
        ) : (
          <div
            className={
              "carousel-image" +
              (this.props.className ? " " + this.props.className : "")
            }
          >
            <img
              className={!this.props.hideFallback ? "has-fallback" : ""}
              src={this.props.src}
              onError={this.onError}
              onLoad={this.props.imageLoaded}
              alt={this.props.alt || "image"}
            />
            {this.props.hideFallback ? null : (
              <img src={this.props.fallbackSrc} alt={this.props.alt || "image"} />
            )}
          </div>
        )}
      </React.Fragment>
    );
  }

  componentWillUnmount() {}
}

export default Image;
