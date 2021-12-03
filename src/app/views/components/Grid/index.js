import React from "react";
import { Link } from "react-router-dom";
import {
  AD_CONTAINER_ID_PREFIX,
  AD_CLASS_MOBILE,
  AD_CLASS_DESKTOP
} from "app/AppConfig/constants";
import { ENABLE_BANNER_ADVERTISEMENT } from "app/AppConfig/features";
import ImageThumbnail from "app/views/components/ImageThumbnail";
import fallbackEn from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import fallbackAr from "app/resources/assets/thumbnail/placeholder_carousel_ar.png";
import oResourceBundle from "app/i18n/";
import SelectBox from "core/components/SelectBox";
import { isMobile } from "react-device-detect";
import { IMAGE_DIMENSIONS } from "app/AppConfig/constants";
import { fnConstructContentURL } from "app/utility/common";
import "./index.scss";

/**
 * Class to render grid layout
 */
class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.filterSelectBox = React.createRef();
    this.sortSelectBox = React.createRef();
    this.state = {
      filterSelectClass: " ",
      sortSelectClass: " ",
      filterTitle:
        this.props.data && this.props.data.length !== 0
          ? this.props.data[0].title
          : this.props.title,
      gridItems: this.props.gridItems,
      sortTitle: oResourceBundle.recently_added
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.prevProps &&
      nextProps.gridItems !== prevState.prevProps.gridItems
    ) {
      return {
        gridItems: nextProps.gridItems,
        filterTitle: nextProps.title,
        prevProps: nextProps
      };
    }
    // Return null to indicate no change to state.
    return {
      prevProps: nextProps
    };
  }
  /**
   * Component Name - Grid
   * Executes when component mounted to DOM.
   * @param {undefined}
   * @param {undefined}
   */
  componentDidMount() {
    typeof this.props.adsContainerLoaded === "function" &&
      this.props.adsContainerLoaded();
  }
  /**
   * Component Name - Grid
   * Executes when component updated after props or state change
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous states
   */
  componentDidUpdate(prevProps, prevState) {
    //Send signal for ads
    if (
      prevProps.locale !== this.props.locale ||
      prevProps.title !== this.props.title
    ) {
      typeof this.props.adsContainerLoaded === "function" &&
        this.props.adsContainerLoaded();
    }
  }

  /**
   * Controls visibility of filter dropdown
   * @param {boolean} show show/hide  dropdown
   */
  showFilterDropdown(show) {
    if (show) {
      this.setState({ filterSelectClass: "open" });
    } else {
      this.setState({ filterSelectClass: " " });
    }
  }

  /**
   * Toggles visibility of filter dropdown
   * @param {Object} event
   */
  filterShowToggle(event) {
    if (this.props.data && this.props.data.length > 1) {
      if (this.state.filterSelectClass === " ") {
        this.showFilterDropdown(true);
      } else {
        this.showFilterDropdown(false);
      }
    }
    event.stopPropagation();
  }

  /**
   * Click event for filter dropdown
   * @param {Object} event
   * @param {Number} index index of clicked item
   */
  filterClicked(event, index) {
    this.setState({ filterTitle: this.props.data[index].title });
    this.setState({ gridItems: this.props.data[index].content });
    typeof isMobile !== undefined && isMobile && this.filterShowToggle(event);
  }

  /**
   * Controls visibility of sort dropdown
   * @param {boolean} show show/hide  dropdown
   */
  showSortDropdown(show) {
    if (show) {
      this.setState({ sortSelectClass: "open" });
    } else {
      this.setState({ sortSelectClass: " " });
    }
  }

  /**
   * Toggles visibility of sort dropdown
   * @param {Object} event
   */
  sortShowToggle(event) {
    if (this.state.sortSelectClass === " ") {
      this.showSortDropdown(true);
    } else {
      this.showSortDropdown(false);
    }
    event.stopPropagation();
  }

  /**
   * Click event for sort dropdown
   * @param {Object} event
   */
  sortClicked(event) {
    const gridIem = this.state.gridItems;

    if (event.target.innerText === oResourceBundle.oldest) {
      gridIem.sort(function(a, b) {
        return new Date(a.insertedAt) - new Date(b.insertedAt);
      });
    } else {
      gridIem.sort(function(a, b) {
        return new Date(b.insertedAt) - new Date(a.insertedAt);
      });
    }

    window.scroll(0, 1);
    window.scroll(0, 0);
    this.sortShowToggle(event);
    this.setState({ sortTitle: event.target.innerText });
  }

  /**
   * Click event on screen to hide all dropdown
   */
  screenClicked() {
    this.showFilterDropdown(false);
    this.showSortDropdown(false);
  }

  /**
   * Render function overridden from react
   */
  render() {
    const aSortItems = [
      { title: oResourceBundle.oldest },
      { title: oResourceBundle.recently_added }
    ];
    return (
      <section className="gridScreen" onClick={this.screenClicked.bind(this)}>
        {this.props.isSearchPage === true ? null : (
          <h1 className="section-title">{this.props.title}</h1>
        )}

        <div className="listing-filters-mobile">
          <div className="container">
            {this.props.data &&
              this.props.data.map((ele, index) => {
                let className = "filter-item";
                if (ele.title === this.state.filterTitle) {
                  className += " selected";
                } else if (this.props.data.length === 1) {
                  className += " selected";
                }
                return (
                  <div className={className} key={"filter-mobile-" + ele.id}>
                    <span
                      onClick={oEvent => {
                        this.filterClicked(oEvent, index);
                      }}
                      className="select-element"
                    >
                      {ele.title}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="listing-filters">
          <div className="first-select-box">
            {this.props.isSearchPage ? (
              <div className="listing-filters-mobile filter-search">
                <div className="container">
                  {this.props.data &&
                    this.props.data.map((ele, index) => {
                      let className = "filter-item";
                      if (ele.title === this.state.filterTitle) {
                        className += " selected";
                      }
                      return (
                        <div
                          className={className}
                          key={"filter-mobile-" + ele.id}
                        >
                          <span
                            onClick={oEvent => {
                              this.filterClicked(oEvent, index);
                            }}
                            className="select-element"
                          >
                            {ele.title}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <SelectBox
                className={this.state.filterSelectClass}
                items={this.props.data}
                selected={this.state.filterTitle}
                showToggle={this.filterShowToggle.bind(this)}
                onChange={this.filterClicked.bind(this)}
              />
            )}
          </div>
          <SelectBox
            className={this.state.sortSelectClass}
            items={aSortItems}
            label={oResourceBundle.sort_by}
            selected={this.state.sortTitle}
            showToggle={this.sortShowToggle.bind(this)}
            onChange={this.sortClicked.bind(this)}
          />
        </div>
        {ENABLE_BANNER_ADVERTISEMENT && (
          <div
            id={AD_CONTAINER_ID_PREFIX}
            className={isMobile ? AD_CLASS_MOBILE : AD_CLASS_DESKTOP}
            ref="bucket-ad-container"
          />
        )}
        <div className="grid">
          {this.state.gridItems &&
            this.state.gridItems.map(ele => {
              if (ele) {
                return (
                  <Link
                    className="carousel-item"
                    to={`/${this.props.locale}${fnConstructContentURL(
                      ele.content_type,
                      ele
                    )}`}
                    key={ele.id}
                    tabIndex="0"
                  >
                    <ImageThumbnail
                      fallback={
                        this.props.locale === "ar" ? fallbackAr : fallbackEn
                      }
                      imageSrc={`${ele.imagery==null?"":ele.imagery.thumbnail}${IMAGE_DIMENSIONS}`}
                      descriptionText={ele.title}
                      showDescription={false}
                      onImageDescText="56"
                      showOnImageDesc={true}
                      showPlayIcon={false}
                      showPlayIcononHover={false}
                      animateOnHover={true}
                      showDownArrow={false}
                      showDownArrowonHover={false}
                      showRatingIndicator={false}
                      showRatingIndicatorValue={"5"}
                      aria-label={ele.title}
                    />
                  </Link>
                );
              } else {
                return null;
              }
            })}
        </div>
      </section>
    );
  }
}

export default Grid;
