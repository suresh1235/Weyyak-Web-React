import * as CONSTANTS from 'app/AppConfig/constants';
import Button from 'core/components/Button';
import ImageCarousel from 'app/views/components/ImageCarousel';
import YearImage from '../../../../app/resources/assets/plans/year_image.svg';
import React, { Suspense } from "react";
import BaseContainer from "core/BaseContainer/";
import { connect } from "react-redux";
import * as actionTypes from "app/store/action/";
import { isMobile } from "react-device-detect";

import {
	NUMBER_OF_BUCKETS_PER_AD,
	AD_CONTAINER_ID_PREFIX,
	AD_CLASS_MOBILE,
	AD_CLASS_DESKTOP,
	LOGIN,
	LAZY_LOAD_DELAY_BUCKET,
	COOKIE_USER_TOKEN,
	HOME_BUCKETS_TO_LOAD

} from "app/AppConfig/constants";
import { ENABLE_BANNER_ADVERTISEMENT } from "app/AppConfig/features";

// import Slider, { getSlidesPerView } from "core/components/Swiper";
import * as common from "app/utility/common";
import oResourceBundle from "app/i18n/";
import withTracker from "core/GoogleAnalytics/";
import "./index.scss";

const BucketItem = React.lazy(() => import("app/views/components/BucketItem"));

const MODULE_NAME = "Premium";


// import langCheck
class PlansDescription extends BaseContainer {

	state = {
		isInOffer: false,
		OfferTitle: "",
		durationTitle_1: "",
		durationTitle_2: "",
		windowWidth: window.innerWidth,
		windowHeight: window.innerHeight,
		drawOffscreenImages: false
	};

	//   componentDidMount(){
	//       this.props.fnFetchCouponData(
	//         this.props.locale,
	//         common.getUserId(),
	//         this.fnSuccues.bind(this)
	//       );
	//   }


	shouldComponentUpdate(nextProps, nextState) {
		if (this.state.windowWidth !== nextState.windowWidth) {
			this.bShoulRebuild = true;
		} else {
			this.bShoulRebuild = false;
		}
		return true;
	}

	componentWillMount() {

		this.componentLoaded = false;
		this.bAdSignalDataSent = false;
		// let sCategoryId =CONSTANTS.PREMIUM_ID 
		let sCategoryId = localStorage.getItem("PremiumID")
		const oUserToken = JSON.parse(common.getServerCookie(COOKIE_USER_TOKEN));
		common.getUid();
		if (sCategoryId) {

			var data = this.props.fnFetchPageContent(
				this.props.locale,
				sCategoryId,
				this.fnMyPlayListLoginFailure.bind(this),
				this.apiFailure.bind(this)
			);
			//   alert(data)
		}

		this.props.fnFetchCouponData(
			this.props.locale,
			common.getUserId(),
			this.fnSuccues.bind(this),
			this.fnStatusFailed.bind(this)
		);


		this.lazyLoadTimer = setTimeout(
			() =>
				this.setState({
					drawOffscreenImages: true
				}),
			LAZY_LOAD_DELAY_BUCKET
		);

	}


	componentDidUpdate(prevProps, prevState) {
		// console.log(prevProps)
		if (
			prevProps.locale !== this.props.locale &&
			this.props.oPageContent
		) {
			let sCategoryId = CONSTANTS.PREMIUM_ID;
			// this.context.onOverlayClick();
			this.props.fnFetchPageContent(
				this.props.locale,
				sCategoryId,
				this.fnMyPlayListLoginFailure.bind(this),
				this.apiFailure.bind(this)
			);
			this.bAdSignalDataSent = false;

			this.props.fnFetchCouponData(
				this.props.locale,
				common.getUserId(),
				this.fnSuccues.bind(this),
				this.fnStatusFailed.bind(this)
			);
		}

	}



	// componentDidMount() {
	// 	// alert()
	// 	this.componentLoaded = false;
	// 	this.bAdSignalDataSent = false;
	// 	let sCategoryId =125 
	// 	const oUserToken = JSON.parse(common.getServerCookie(COOKIE_USER_TOKEN));
	// 	common.getUid();
	// 	if(sCategoryId)
	// 	{
	// 		this.props.fnFetchPageContent(
	// 			this.props.locale,
	// 			sCategoryId,
	// 			this.fnMyPlayListLoginFailure.bind(this),
	// 			this.apiFailure.bind(this)
	// 		  );
	// 	}

	// 	this.lazyLoadTimer = setTimeout(
	// 		() =>
	// 		  this.setState({
	// 			drawOffscreenImages: true
	// 		  }),
	// 		LAZY_LOAD_DELAY_BUCKET
	// 	  );

	//   }

	fnSuccues(data) {
		this.setState({
			isInOffer: true,
			OfferTitle: data.offer_message,
			durationTitle_1: data.duration_start_message,
			durationTitle_2: data.duration_end_message
		})
	}

	fnStatusFailed() {
		this.setState({
			isInOffer: false,
		})
	}

	fnMyPlayListLoginFailure() {
		this.props.history.push(`/${this.props.locale}/${LOGIN}`);
	}

	apiFailure() {
		this.setState({ errorOccured: true });
	}


	fnFetchMenuItemId(sCategory) {
		let sCategoryId = null;
		if (this.props.aMenuItems && sCategory) {
			const oMenuItem = this.props.aMenuItems.data.filter(ele => {
				if (ele.friendly_url.indexOf(sCategory) !== -1) {
					return true;
				}
				return false;
			});
			sCategoryId = oMenuItem[0] ? oMenuItem[0].id : null;
		}

		return sCategoryId;
	}

	fnAdsContainerLoaded() {
		// Logger.log(MODULE_NAME, "fnAdsContainerLoaded: " + this.bAdSignalDataSent);
		if (this.props.oPageContent && !this.bAdSignalDataSent) {
			this.bAdSignalDataSent = true;
			super.setSignalData({}, {}, this.props.locale, this.props.sCountryCode, common.getUserId(), common.uuidv4(), this.props.bPageViewSent);
			this.props.fnPageViewSent();
		}
	}

	onSubscribeButtonClick() {
		this.props.history.push(`/${this.props.locale}/${CONSTANTS.PLANS}`);
	}

	onPlayButtonClick(history, event, oSelectedBtnProps) {
		console.log('Play back button Click');
	}
	render() {
		let aUserMyPlayListData = null;
		let aPlayListData = null;
		let gridItems
		let oFeaturePlayList
		let imageData, griddata
		if (this.props.oPageContent) {
			// alert(this.props.oPageContent)
			console.log(this.props.oPageContent, 2000)
			// alert((this.props.oPageContent.data.featured) )
			if (this.props.oPageContent.data) {
				if (this.props.oPageContent.data.featured && this.props.oPageContent.data.playlists) {
					imageData = this.props.oPageContent.data.featured.playlists[0].content
					griddata = this.props.oPageContent.data.playlists[0].content
					aPlayListData = this.props.oPageContent.data.playlists
					oFeaturePlayList = this.props.oPageContent.data.featured

				}
				else {

					imageData = []
					griddata = []
					aPlayListData = []
					oFeaturePlayList = []
				}

			}
			else {
				imageData = []
				griddata = []
				aPlayListData = []
				oFeaturePlayList = []
				// alert(null)


			}


		}
		else {
			imageData = []
			griddata = []
			aPlayListData = []
			oFeaturePlayList = []

		}

		// if (this.props.oPageContent) {
		// 	aUserMyPlayListData = this.props.oPageContent.userPlayList;
		// 	aPlayListData = !aUserMyPlayListData
		// 	  ? this.props.oPageContent.data.playlists
		// 	  : //This array for playlist
		// 		[
		// 		  {
		// 			content: aUserMyPlayListData,
		// 			id: this.ALL_ID,
		// 			title: oResourceBundle.all
		// 		  }
		// 		];
		// 	oFeaturePlayList = !aUserMyPlayListData
		// 	  ? this.props.oPageContent.data.featured
		// 	  : {};


		// }


		return (
			<div className="new-description-plan-data">
				{
					this.state.isInOffer ?

						<div className="plans-bg">
							<div className="plans-description-container">
								<div className="try-for-free">
									{this.state.OfferTitle}
								</div>
								<div className="promocode">
									{oResourceBundle.ramadan_Coupon}
								</div>

								<div className="time-indicator">
									<div className="seven-days-free">{this.state.durationTitle_1}</div>
									<div className="thirty-seven-days-free">{this.state.durationTitle_2}</div>
									<div className="circle-indicator1 circle" />
									<div className="line1 line" />
									<div className="circle-indicator2 circle" />
									<div className="line2 line" />
									<div className="circle-indicator3 circle" />
								</div>
								<Button className="subscribe-now-button" onClick={this.onSubscribeButtonClick.bind(this)}>
									{oResourceBundle.subscribe_now}
								</Button>
								<div className="icons-list">
									<div className="no-ads container">
										<div className="icon" />
										<div className="text">{oResourceBundle.no_ads}</div>
									</div>
									<div className="smart-tv container">
										<div className="icon" />
										<div className="text">{oResourceBundle.smart_tv}</div>
									</div>
									<div className="exclusive-content container">
										<div className="icon" />
										<div className="text">{oResourceBundle.exclusive_content}</div>
									</div>
									<div className="hd-content container">
										<div className="icon" />
										<div className="text">{oResourceBundle.hd_content}</div>
									</div>
								</div>
								<div className="weyyak-premium">
									<div className="left">
										{oResourceBundle.weyyak_premium}
									</div>

									<div className="year-image">
										<img src={YearImage} alt="year-image" />
									</div>
								</div>

								<div className="subscribeslider">
									<div className="banner-label">
										<p>{oResourceBundle.premium_text}</p>
									</div>
									<ImageCarousel
										// history={this.props.history}
										isMENARegion={this.props.isMENARegion}
										locale={this.props.locale}
										items={imageData}
										imageType={isMobile ? "featured_img" : "mobile_img"}
										onPlayButtonClick={this.onPlayButtonClick.bind(this)}
									/>

								</div>

								{/* {ENABLE_BANNER_ADVERTISEMENT && (
								<div
									id={AD_CONTAINER_ID_PREFIX}
									className={isMobile ? AD_CLASS_MOBILE : AD_CLASS_DESKTOP}
									ref="bucket-ad-container"
								/>
							)} */}
							</div>




							{aPlayListData.map((ele, i) => {
								return (
									<Suspense fallback={<div>Loading...</div>}>
										{/* <div className="weyyak-premium">
											<div className="left" style={{ margin:" 0px 0px 39px 0px"}}>
												{ele.title}
											</div>
										</div> */}
										<BucketItem
											key={ele.id}
											locale={this.props.locale}
											title={ele.title}
											items={ele.content}
											rebuildOnUpdate={true}
											delayImage={
												i >= HOME_BUCKETS_TO_LOAD &&
												!this.state.drawOffscreenImages
											}
										/></Suspense>
								)

							})}

						</div>
						:

						<div className="plans-bg">
							<div className="plans-description-container">
								<div className="try-for-free">
									<div dangerouslySetInnerHTML={{ __html: oResourceBundle.explore_and_enjoy }}></div>
								</div>

								<div className="time-indicator">
									<div className="seven-days-free">{oResourceBundle.seven_days_free}</div>
									<div className="thirty-seven-days-free">{oResourceBundle.thirty_seven_days}</div>
									<div className="circle-indicator1 circle" />
									<div className="line1 line" />
									<div className="circle-indicator2 circle" />
									<div className="line2 line" />
									<div className="circle-indicator3 circle" />
								</div>
								<Button className="subscribe-now-button" onClick={this.onSubscribeButtonClick.bind(this)}>
									{oResourceBundle.subscribe_now}
								</Button>
								<div className="icons-list">
									<div className="no-ads container">
										<div className="icon" />
										<div className="text">{oResourceBundle.no_ads}</div>
									</div>
									<div className="smart-tv container">
										<div className="icon" />
										<div className="text">{oResourceBundle.smart_tv}</div>
									</div>
									<div className="exclusive-content container">
										<div className="icon" />
										<div className="text">{oResourceBundle.exclusive_content}</div>
									</div>
									<div className="hd-content container">
										<div className="icon" />
										<div className="text">{oResourceBundle.hd_content}</div>
									</div>

								</div>
								<div className="weyyak-premium">
									{/* <h1>abcd</h1> */}
								</div>

								<div className="subscribeslider">
									<div className="banner-label">
										<p>{oResourceBundle.premium_text}</p>
									</div>
									<ImageCarousel
										isMENARegion={this.props.isMENARegion}
										locale={this.props.locale}
										items={imageData}
										imageType={isMobile ? "featured_img" : "mobile_img"}
										onPlayButtonClick={this.onPlayButtonClick.bind(this)}
									/>
								</div>


								{/* {ENABLE_BANNER_ADVERTISEMENT && (
									<div
										id={AD_CONTAINER_ID_PREFIX}
										className={isMobile ? AD_CLASS_MOBILE : AD_CLASS_DESKTOP}
										ref="bucket-ad-container"
									/>
								)} */}

							</div>
							

							{aPlayListData.map((ele, i) => {
									return (
										<Suspense fallback={<div>Loading...</div>}>
											<BucketItem
												key={ele.id}
												locale={this.props.locale}
												title={ele.title}
												items={ele.content}
												rebuildOnUpdate={true}
												delayImage={
													i >= HOME_BUCKETS_TO_LOAD &&
													!this.state.drawOffscreenImages
												}
											/></Suspense>
									)

								})}
						</div>



				}

				{/* </div> */}

			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		locale: state.locale,
		oPageContent: state.oPageContent,
		aMenuItems: state.aMenuItems,
	};
};
// export default withTracker(connect(mapStateToProps)(PlansDescription));

const mapDispatchToProps = dispatch => {
	//dispatch action to redux store
	return {
		fnFetchPageContent: (
			sLocale,
			sCategoryId,
			sCountryCode,
			fnMyPlayListLoginFailure,
			apiFailure
		) => {
			dispatch(
				actionTypes.fnFetchPageContent(
					sLocale,
					sCategoryId,
					sCountryCode,
					fnMyPlayListLoginFailure,
					apiFailure
				)
			);
		},
		fnFetchCouponData: (sLocale, user_id, fnSuccues, fnStatusFailed) => {
			dispatch(
				actionTypes.fnFetchCouponData(
					sLocale,
					user_id,
					fnSuccues,
					fnStatusFailed
				)
			);
		},
		fnPageViewSent: () => {
			dispatch(actionTypes.fnPageViewSent());
		}
	};
};

export default withTracker(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(PlansDescription)
);