import React from "react";
import BaseContainer from "core/BaseContainer/";
import { connect } from "react-redux";
import * as actionTypes from "app/store/action/";
// import plansIcon1 from "app/resources/assets/thumbnail/thumbnail_plan_icon1.png";
// import plansIcon2 from "app/resources/assets/thumbnail/thumbnail_plan_icon2.png";
// import plansIcon3 from "app/resources/assets/thumbnail/thumbnail_plan_icon3.png";
import svod1 from "app/resources/assets/thumbnail/svod_1.png";
import svod2 from "app/resources/assets/thumbnail/svod_2.png";
import svod3 from "app/resources/assets/thumbnail/svod_3.png";
import {  BrowserRouter as Router, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'


const imgCls = {
    "border":"1px solid #ddd",
    "borderRadius": "4px",
    "padding": "5px",
    "width": "150px"
  };
  const disply_inline = {
      "display":"inline-block",
      "position":"relative"
  }
  const thumb_icons = {
    "position":"absolute",
    "top":"9px",
    "left":"9px"
  }

class DisplayPlanList extends BaseContainer{
 
   
    render(){
        let dataImages = (this.props.dataImages.data);   
        let language=this.props.locale;
        if( typeof(dataImages === 'object'))
        {
            return (<div>
                {
                    Object.keys(dataImages).map(function(key, index) {
                        return (dataImages[key].content_type==='series' && dataImages[key].seasons.length>0?(
                            <div style ={disply_inline}>
                              <Link to={{
                                pathname:`/${language}/${dataImages[key].content_type}/${dataImages[key].id}/${dataImages[key].friendly_url}`}}>
                                <img  style ={imgCls} className="has-fallback" src={dataImages[key].imagery.thumbnail} alt=""/>
                                </Link>
                                <div style ={thumb_icons}>
                                  {/* {dataImages[key].seasons[0].digitalRighttype === 1 ? <img src={svod1} alt="plan1"/>: ((dataImages[key].seasons[0].digitalRightType===2)? <img src={svod2} alt="plan2"/> : <img src={svod3} alt="plan3"/>)}
                                              */}
                                    {/* {dataImages[key].seasons[0].digitalRighttype === 3 ? <img src={svod3} alt="plan3"/> : ""} */}
                     </div>

                            </div>
                        ):((dataImages[key].content_type==='movie')?
                            (<div style ={disply_inline}> 
                              <Link to={{
                                pathname:`/${language}/${dataImages[key].content_type}/${dataImages[key].id}/${dataImages[key].friendly_url}`}}>
                                <img  style ={imgCls} className="has-fallback" src={dataImages[key].imagery.thumbnail} alt=""/>
                              </Link>

                              {/* <a href={`${dataImages[key].content_type}/${dataImages[key].id}/${dataImages[key].friendly_url}`}>
                                <img  style ={imgCls} className="has-fallback" src={dataImages[key].imagery.thumbnail} alt=""/>
                                </a>                                   */}
                                <div style ={thumb_icons}>
                                  {/* {dataImages[key].movies.digitalRighttype === 1 ? <img src={svod1} alt="plan1"/>: ((dataImages[key].movies.digitalRighttype===2)? <img src={svod2} alt="plan2"/> : <img src={svod3} alt="plan3"/>)}            */}
                                </div>  
                            </div>) : null
                        ))
                    
                      })
                }
            </div>)
        }
        else {
            return(<div></div>)
        }
             
        }
}


/**
 * Component - HomeScreen
 * method that maps state to props.
 * @param {Object} state - state from redux store.
 * @return {Object} - state mapped to props
 */
const mapStateToProps = state => {
  
    return {
      oPlanContent: state.oPlanContent,
      aMenuItems: state.aMenuItems,
      locale: state.locale,
      loading: state.loading,
      videoInfoLoading: state.videoInfoLoading,
      oUserResumablesObject: state.oUserResumablesObject,
      aResumableMedias: state.aResumableMedias,
      totalRecords:state.totalRecords,
      loginDetails: state.loginDetails,
      bIsUserSubscribed: state.bIsUserSubscribed,
      sCountryCode: state.sCountryCode,
      bPageViewSent: state.bPageViewSent
    };
  };
  
  /**
   * method that maps state to props.
   * Component - HomeScreen
   * @param {Object} dispatch - dispatcher from store.
   * @return {Object} - dispatchers mapped to props
   */
  const mapDispatchToProps = dispatch => {
    //dispatch action to redux store
    var urlParams = window.location.href;  
    let planInfo =urlParams.split("=");   
    let planId =planInfo[1];
    return {
      fnFetchPlanContent: (
        sLocale,
        sCategoryId,
        fnMyPlayListLoginFailure,
        apiFailure
      ) => {
        dispatch(
          actionTypes.fnFetchPlanContent(planId,0,1000
          )
        );
      },
      fnPageViewSent: () => {
        dispatch(actionTypes.fnPageViewSent());
      }
    };
  };
  
  export default withRouter(connect(
      mapStateToProps,
      mapDispatchToProps
    )(DisplayPlanList)
  );  
