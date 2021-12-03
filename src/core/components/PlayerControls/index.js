/*
 * Copyright (C) 2014-2018 L&T Technology Services, All Rights Reserved.
 *
 * This source code and any compilation or derivative thereof is the
 * proprietary information of L&T and is confidential in nature.
 * Under no circumstances is this software to be exposed to or placed under
 * an Open Source License of any type without the expressed written permission
 * of L&T.
 */

import React, { Component } from "react";
import Logger from "core/Logger";
import { isIOS } from "react-device-detect";

import "./index.scss";

/**
 * Class to render player control
 */
class PlayerControls extends Component {
  MODULE_NAME = "PlayerControls";

  constructor(props) {
    super(props);
    this.startVolumeDrag = false;
    this.startProgressDrag = false;
    this.state = {
      volumeX: 100,
      progressX: 0,
      progressUpdatingByDrag: false,
      volumeUpdatingByDrag: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentTime !== this.props.currentTime) {
      this.setState({
        showSeekedTime: false
      });
    }
  }

  onMouseUp(event) {
    Logger.log(this.MODULE_NAME, "onMouseUp");
    if (this.startProgressDrag) {
      this.setState({
        progressUpdatingByDrag: false,
        seekedCurrentTime: this.state.hoverTime,
        showSeekedTime: true
      });
      this.startProgressDrag = false;
      if (this.props.listener && this.props.listener.progressBarClick) {
        this.props.listener.progressBarClick(event, this.state.progressX);
      }
      if (this.props.setControlsDragging) {
        this.props.setControlsDragging(false);
      }
    }

    if (this.startVolumeDrag) {
      this.startVolumeDrag = false;
      this.setState({
        volumeUpdatingByDrag: false
      });
      if (this.props.listener && this.props.listener.volumeBarClick) {
        this.props.listener.volumeBarClick(event, this.state.volumeX);
      }
      if (this.props.setControlsDragging) {
        this.props.setControlsDragging(false);
      }
    }
  }

  onTouchEnd(event) {
    if (this.startProgressDrag) {
      this.setState({
        progressUpdatingByDrag: false,
        showTimeOnHover: false
      });
      this.startProgressDrag = false;
      if (this.props.listener && this.props.listener.progressBarClick) {
        this.props.listener.progressBarClick(event, this.state.progressX);
      }
      if (this.props.setControlsDragging) {
        this.props.setControlsDragging(false);
      };
    }
  }

  volumeBarMouseDown(event) {
    this.startVolumeDrag = true;
    const volume = event.nativeEvent.offsetX / this.volumeControl.offsetWidth;
    this.setState({
      volumeX: volume * 100,
      volumeUpdatingByDrag: true
    });
    if (this.props.setControlsDragging) {
      this.props.setControlsDragging(true);
    }
  }

  progressBarMouseDown(event) {
    Logger.log(this.MODULE_NAME, "progressBarMouseDown");
    this.startProgressDrag = true;
    const progress =
      event.nativeEvent.offsetX / this.progressControl.offsetWidth;
    this.setState({
      progressX: progress * 100,
      progressUpdatingByDrag: true
    });
    if (this.props.setControlsDragging) {
      this.props.setControlsDragging(true);
    }
  }

  onProgressBarTouchStart(event) {
    Logger.log(this.MODULE_NAME, "onProgressBarTouchStart");
    this.startProgressDrag = true;

    this.setState({
      showTimeOnHover: true
    });

    if (event.touches && event.touches[0]) {
      const progress =
        (event.touches[0].clientX - this.progressControl.offsetLeft) /
        this.progressControl.offsetWidth;
      this.setState({
        progressX: progress * 100,
        progressUpdatingByDrag: true
      });
    }

    if (this.props.setControlsDragging) {
      this.props.setControlsDragging(true);
    }
  }

  onMouseMove(event) {
    if (this.startVolumeDrag) {
      let volume =
        (event.nativeEvent.pageX -
          this.volumeControl.offsetLeft -
          this.playerControl.offsetLeft) /
        this.volumeControl.offsetWidth;
      volume = this.includeInRange(volume, 1, 0);
      this.setState({
        volumeX: volume * 100
      });
    }

    if (this.startProgressDrag) {
      let progress =
        (event.nativeEvent.pageX -
          this.progressControl.offsetLeft -
          this.playerControl.offsetLeft) /
        this.progressControl.offsetWidth;
      progress = this.includeInRange(progress, 1, 0);
      this.setState({
        progressX: progress * 100
      });
    }

    if (this.state.showTimeOnHover) {
      const relativeX = event.clientX - this.progressControl.offsetLeft;
      let hoverTime =
        (relativeX / this.progressControl.offsetWidth) * this.props.duration;
      if (hoverTime > this.props.duration) {
        hoverTime = this.props.duration;
      }
      this.setState({
        hoverTimeX: relativeX,
        hoverTime: hoverTime
      });
    }
  }

  onTouchMove(event) {
    if (this.startProgressDrag) {
      if (event.touches && event.touches[0]) {
        let progress =
          (event.touches[0].clientX -
            this.progressControl.offsetLeft -
            this.playerControl.offsetLeft) /
          this.progressControl.offsetWidth;
        progress = this.includeInRange(progress, 1, 0);
        this.setState({
          progressX: progress * 100
        });
      }
    }

    if (this.state.showTimeOnHover) {
      if (event.touches && event.touches[0]) {
        const relativeX = event.touches[0].clientX - this.progressControl.offsetLeft;
        let hoverTime =
          (relativeX / this.progressControl.offsetWidth) * this.props.duration;
        if (hoverTime > this.props.duration) {
          hoverTime = this.props.duration;
        }
        this.setState({
          hoverTimeX: relativeX,
          hoverTime: hoverTime
        });
      }
    }
  }
  onMouseOver(event) {
    if (this.props.onMouseOver) {
      this.props.onMouseOver(event);
    }
  }

  onMouseOut(event) {
    if (this.props.onMouseOut) {
      this.props.onMouseOut(event);
    }
  }

  includeInRange(value, max, min) {
    if (value > max) {
      value = max;
    } else if (value < min) {
      value = min;
    }
    return value;
  }

  playerClick(event) {
    Logger.log(this.MODULE_NAME, "playerClick: " + event.target.className);
    if (
      event.target.className === "player-controls-container" &&
      this.props.playerClick
    ) {
      this.props.playerClick(event);
    }
  }

  onMouseOverProgressBar(event) {
    Logger.log(
      this.MODULE_NAME,
      "onMouseOverProgressBar: " + event.nativeEvent.pageX
    );
    this.setState({
      showTimeOnHover: true,
      hoverTimeX: event.nativeEvent.pageX
    });
  }

  onMouseOutProgressBar() {
    Logger.log(this.MODULE_NAME, "onMouseOutProgressBar");
    this.setState({
      showTimeOnHover: false
    });
  }

  formatTime(duration, calculateHours) {
    if (typeof duration === "number") {
      let hours = 0;
      if (calculateHours) {
        hours = Math.floor(duration / 60 / 60);
        if (hours !== 0 && hours < 10) {
          hours = "0" + hours;
        }
      }
      let minutes = Math.floor((duration / 60) % 60);
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      let seconds = Math.floor(duration % 60);
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return (calculateHours ? hours + ":" : "") + minutes + ":" + seconds;
    }
    return "00:00";
  }

  render() {
    const playPauseClassName =
      "play-pause-button player-controls-button " +
      (this.props.paused ? "play" : "pause");
    const muteButtonClass =
      "mute-button player-controls-button" + (this.props.muted ? " muted" : "");

    let currentVolume = this.state.volumeUpdatingByDrag
      ? this.state.volumeX
      : this.props.volume;

    let currentTime = this.props.currentTime;
    if (this.state.showTimeOnHover && this.state.showSeekedTime) {
      currentTime = this.state.seekedCurrentTime;
    }

    // if (currentVolume < 8) {
    //   currentVolume = 8;
    // } else if (currentVolume > 98) {
    //   currentVolume = 98;
    // }
    return (
      <div
        className="player-controls-container"
        onClick={this.playerClick.bind(this)}
        onTouchStart={this.props.onTouchStart}
        onTouchEnd={this.onTouchEnd.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
        onTouchMove={this.onTouchMove.bind(this)}
      >
        <div
          className="player-controls"
          onMouseOver={this.onMouseOver.bind(this)}
          onMouseOut={this.onMouseOut.bind(this)}
          ref={playerControl => {
            this.playerControl = playerControl;
          }}
        >
          <div
            className="progress-control-click-overlay"
            ref={progressControl => {
              this.progressControl = progressControl;
            }}
            onMouseDown={this.progressBarMouseDown.bind(this)}
            onMouseOver={this.onMouseOverProgressBar.bind(this)}
            onMouseOut={this.onMouseOutProgressBar.bind(this)}
            onTouchStart={this.onProgressBarTouchStart.bind(this)}
          />
          <div className="progress-control">
            <div
              className="progress-elapsed"
              style={{
                width:
                  (this.state.progressUpdatingByDrag
                    ? this.state.progressX
                    : this.props.progress) + "%"
              }}
            />
            <div
              className="current-progress-indicator"
              style={{
                left:
                  (this.state.progressUpdatingByDrag
                    ? this.state.progressX
                    : this.props.progress) + "%"
              }}
            />
            {this.props.bufferedDuration !== 0 && (
              <div
                className="progress-buffered"
                style={{
                  left: this.props.progress + "%",
                  width: this.state.progressUpdatingByDrag
                    ? 0
                    : this.props.bufferedDuration + "%"
                }}
              />
            )}
            {this.state.showTimeOnHover && (
              <div
                className="hover-time"
                style={{
                  left: this.state.hoverTimeX + "px"
                }}
              >
                {this.formatTime(this.state.hoverTime, this.props.showHours)}
              </div>
            )}
            {this.state.showTimeOnHover && !this.state.progressUpdatingByDrag && (
              <div
                className="current-time"
                style={{
                  left: this.props.progress + "%"
                }}
              >
                {this.formatTime(currentTime, this.props.showHours)}
              </div>
            )}
          </div>
          <div
            className="previous-button player-controls-button"
            onClick={
              this.props.listener ? this.props.listener.previousClick : null
            }
          />
          <div
            className="rewind-button player-controls-button"
            onClick={
              this.props.listener ? this.props.listener.rewindClick : null
            }
          />
          <div
            className={playPauseClassName}
            onClick={
              !isIOS && this.props.listener
                ? this.props.listener.playPauseClick
                : null
            }
            onTouchStart={
              isIOS && this.props.listener
                ? this.props.listener.playPauseClick
                : null
            }
            tabIndex="0"
            aria-label={this.props.paused ? "play" : "pause"}
          />
          <div
            className="forward-button player-controls-button"
            onClick={
              this.props.listener ? this.props.listener.forwardClick : null
            }
            tabIndex="0"
            aria-label="forward"
          />
          <div
            className="next-button player-controls-button"
            onClick={this.props.listener ? this.props.listener.nextClick : null}
            tabIndex="0"
            aria-label="next"
          />
          <div
            className={muteButtonClass}
            onClick={this.props.listener ? this.props.listener.muteClick : null}
            tabIndex="0"
            aria-label="mute"
          />
          <div
            className={
              "volume-control player-controls-button" +
              (this.props.muted ? " muted" : "")
            }
            ref={volumeControl => {
              this.volumeControl = volumeControl;
            }}
            onMouseDown={this.volumeBarMouseDown.bind(this)}
            aria-label="volume control"
          >
            <div className="volume-background" />
            <div
              className="current-volume-level"
              style={{
                width:
                  (this.state.volumeUpdatingByDrag
                    ? this.state.volumeX
                    : this.props.volume) + "%"
              }}
              tabIndex="0"
            />
            <div
              className="current-volume-indicator"
              style={{
                left: currentVolume + "%"
              }}
            />
          </div>
          <div className="duration">
            {(this.formatTime(this.props.duration), this.props.showHours)}
          </div>
        </div>
      </div>
    );
  }
}

export default PlayerControls;
