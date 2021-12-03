
/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import React from 'react';
import oResourceBundle from 'app/i18n/';

import './index.scss';

class QualitySelector extends React.Component {

  MODULE_NAME = 'QualitySelector'

  constructor(props) {
    super(props)
    this.state = {
      currentQualityLevel: props.currentQualityLevel >= 0 ? props.currentQualityLevel.toString() :
        props.qualityLevels.length.toString()
    }
  }

  onChange(event) {
    const index = event.target.getAttribute("value")
    this.setState({
      currentQualityLevel: index
    })
    this.props.onQualityChanged(index)
    event.preventDefault()
    event.stopPropagation()
  }

  render() {
    return (
      <React.Fragment>
        <div className="quality-selector">
          {this.props.qualityLevels &&
            this.props.qualityLevels.map((quality, i) => {
              let qualityText = quality
              if (this.props.appendProgressive) {
                qualityText += "p"
              }
              const checked = this.state.currentQualityLevel === i.toString()
              return <div
                onClick={this.onChange.bind(this)}
                value={i}
                key={quality}
                className="quality-item">
                <span className="quality-value"
                  value={i}>{qualityText}</span>
                {this.props.appendHD &&
                  this.props.hdValue &&
                  quality >= this.props.hdValue &&
                  <span className="hd-text"
                    value={i}>HD</span>
                }
                <div
                  className={"radio-button" + (checked ? " checked" : "")}
                  value={i}></div>
              </div>
            })
          }
          {this.props.addAuto &&
            <div className="quality-item"
              onClick={this.onChange.bind(this)}
              value={this.props.qualityLevels.length}>
              {oResourceBundle.auto}
              <div
                className={"radio-button" + ((this.state.currentQualityLevel === this.props.qualityLevels.length.toString()) ? " checked" : "")}
                value={this.props.qualityLevels.length}></div>
            </div>
          }
        </div >
      </React.Fragment >
    )
  }
}

export default QualitySelector;
