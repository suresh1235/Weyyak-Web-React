//This file is used for google Ads DMP Evnets handling
import { isGoogleAdsEnable } from "app/utility/common";


export function DMPEvents(EventType, EventData, ExData) {

    //Remove "&& false" when ever required...!
    if (isGoogleAdsEnable() && false) {

        // videoplay & VideoLoad
        if (EventType == "VideoLoad" || EventType == "VideoPlay") {
            window.permutive.track(EventType, {
                play_id: EventData.videoInfo.videoInfo.data.data.id.toString(), //this will stay constant for all of the events emitted during the same video play
                video: {
                    duration: EventData.videoInfo.urlInfo.duration, // in seconds
                    name: EventData.videoInfo.videoInfo.data.data.title,
                    video_id: EventData.videoInfo.videoInfo.data.data.video_id,
                    description: EventData.videoInfo.videoInfo.data.data.synopsis,
                    published_at: EventData.videoInfo.videoInfo.data.data.insertedAt
                },
                enriched_data: {
                    season: EventData.videoInfo.videoInfo.data.data.season_number, //season
                    episode: EventData.videoInfo.videoInfo.data.data.episode_number, //episode	episode number
                    showGenre: EventData.videoInfo.videoInfo.data.data.genres,//["<LIST>", "<OF>", "<STRINGS>"],
                    language: EventData.locale, //language of the content
                    // keywords: EventData.videoInfo.videoInfo.data.data.seo_title, //keywords for the page
                    type: EventData.videoInfo.videoInfo.data.data.content_type, //content type (movie, show, program, series)
                }

            })

        }

        if (EventType == "VideoProgress") {
            window.permutive.track(EventType, {
                play_id: EventData.videoInfo.videoInfo.data.data.id.toString(),
                progress: ExData,
                video: {
                    duration: EventData.videoInfo.urlInfo.duration, // in seconds
                    name: EventData.videoInfo.videoInfo.data.data.title,
                    video_id: EventData.videoInfo.videoInfo.data.data.video_id,
                    description: EventData.videoInfo.videoInfo.data.data.synopsis,
                    published_at: EventData.videoInfo.videoInfo.data.data.insertedAt
                },
                enriched_data: {
                    season: EventData.videoInfo.videoInfo.data.data.season_number, //season
                    episode: EventData.videoInfo.videoInfo.data.data.episode_number, //episode	episode number
                    showGenre: EventData.videoInfo.videoInfo.data.data.genres,//["<LIST>", "<OF>", "<STRINGS>"],
                    language: EventData.locale, //language of the content
                    // keywords: EventData.videoInfo.videoInfo.data.data.seo_title, //keywords for the page
                    type: EventData.videoInfo.videoInfo.data.data.content_type, //content type (movie, show, program, series)
                }
            })

        }

        if (EventType == "VideoEvent") {
            window.permutive.track(EventType, {
                play_id: EventData.videoInfo.videoInfo.data.data.id.toString(),
                event: ExData,
                video: {
                    duration: EventData.videoInfo.urlInfo.duration, // in seconds
                    name: EventData.videoInfo.videoInfo.data.data.title,
                    video_id: EventData.videoInfo.videoInfo.data.data.video_id,
                    description: EventData.videoInfo.videoInfo.data.data.synopsis,
                    published_at: EventData.videoInfo.videoInfo.data.data.insertedAt
                },
                enriched_data: {
                    season: EventData.videoInfo.videoInfo.data.data.season_number, //season
                    episode: EventData.videoInfo.videoInfo.data.data.episode_number, //episode	episode number
                    showGenre: EventData.videoInfo.videoInfo.data.data.genres,//["<LIST>", "<OF>", "<STRINGS>"],
                    language: EventData.locale, //language of the content
                    // keywords: EventData.videoInfo.videoInfo.data.data.seo_title, //keywords for the page
                    type: EventData.videoInfo.videoInfo.data.data.content_type, //content type (movie, show, program, series)
                }
            })

        }

    }
}


function fnLineItemId(AdResponse) {

    let lineItemID = ""

    if (AdResponse.adWrapperIds.length > 1) {
        lineItemID = AdResponse.adWrapperIds[1]
    } else if (AdResponse.adWrapperIds.length > 0) {
        lineItemID = AdResponse.adWrapperIds[0]
    } else {
        lineItemID = AdResponse.adId
    }
    return parseInt(lineItemID)
}

function fnCreativeId(AdResponse) {

    let CreativeID = ""

    if (AdResponse.adWrapperCreativeIds.length > 0) {
        CreativeID = AdResponse.adWrapperCreativeIds[0]
    } else {
        CreativeID = AdResponse.creativeId
    }

    return parseInt(CreativeID)
}

export function DmpADEvents(EventType, EventPropsData, EventADsData, ExData) {

//Remove "&& false" when ever required...!
    if (isGoogleAdsEnable() && false) {

        // videoplay & VideoLoad
        if (EventType == "VideoAdPlay" || EventType == "VideoAdClick") {

            window.permutive.track(EventType, {
                play_id: EventPropsData.videoInfo.videoInfo.data.data.id.toString(),
                ad: {
                    ad_id: EventADsData ? EventADsData.adId : '',
                    duration: EventADsData ? EventADsData.duration : '',
                    creative_id: EventADsData ? fnCreativeId(EventADsData) : '',
                    lineitem_id: EventADsData ? fnLineItemId(EventADsData) : '',
                    title: EventADsData ? EventADsData.title : '',
                    video_type: EventADsData ? EventADsData.contentType : ''
                },

                video: {
                    duration: EventPropsData.videoInfo.urlInfo.duration, // in seconds
                    name: EventPropsData.videoInfo.videoInfo.data.data.title,
                    video_id: EventPropsData.videoInfo.videoInfo.data.data.video_id,
                    description: EventPropsData.videoInfo.videoInfo.data.data.synopsis,
                    published_at: EventPropsData.videoInfo.videoInfo.data.data.insertedAt
                },
                enriched_data: {
                    season: EventPropsData.videoInfo.videoInfo.data.data.season_number, //season
                    episode: EventPropsData.videoInfo.videoInfo.data.data.episode_number, //episode	episode number
                    showGenre: EventPropsData.videoInfo.videoInfo.data.data.genres,//["<LIST>", "<OF>", "<STRINGS>"],
                    language: EventPropsData.locale, //language of the content
                    // keywords: EventPropsData.videoInfo.videoInfo.data.data.seo_title, //keywords for the page
                    type: EventPropsData.videoInfo.videoInfo.data.data.content_type, //content type (movie, show, program, series)

                }


            })

        }
        if (EventType == "VideoAdProgress") {

            window.permutive.track(EventType, {
                play_id: EventPropsData.videoInfo.videoInfo.data.data.id.toString(),
                progress: ExData,
                ad: {
                    ad_id: EventADsData ? EventADsData.adId : '',
                    duration: EventADsData ? EventADsData.duration : '',
                    creative_id: EventADsData ? fnCreativeId(EventADsData) : '',
                    lineitem_id: EventADsData ? fnLineItemId(EventADsData) : '',
                    title: EventADsData ? EventADsData.title : '',
                    video_type: EventADsData ? EventADsData.contentType : ''
                },

                video: {
                    duration: EventPropsData.videoInfo.urlInfo.duration, // in seconds
                    name: EventPropsData.videoInfo.videoInfo.data.data.title,
                    video_id: EventPropsData.videoInfo.videoInfo.data.data.video_id,
                    description: EventPropsData.videoInfo.videoInfo.data.data.synopsis,
                    published_at: EventPropsData.videoInfo.videoInfo.data.data.insertedAt
                },
                enriched_data: {
                    season: EventPropsData.videoInfo.videoInfo.data.data.season_number, //season
                    episode: EventPropsData.videoInfo.videoInfo.data.data.episode_number, //episode	episode number
                    showGenre: EventPropsData.videoInfo.videoInfo.data.data.genres,//["<LIST>", "<OF>", "<STRINGS>"],
                    language: EventPropsData.locale, //language of the content
                    // keywords: EventPropsData.videoInfo.videoInfo.data.data.seo_title, //keywords for the page
                    type: EventPropsData.videoInfo.videoInfo.data.data.content_type, //content type (movie, show, program, series)

                }
            })

        }
        if (EventType == "VideoAdEvent") {

            window.permutive.track(EventType, {
                play_id: EventPropsData.videoInfo.videoInfo.data.data.id.toString(),
                event: ExData,
                ad: {
                    ad_id: EventADsData ? EventADsData.adId : '',
                    duration: EventADsData ? EventADsData.duration : '',
                    creative_id: EventADsData ? fnCreativeId(EventADsData) : '',
                    lineitem_id: EventADsData ? fnLineItemId(EventADsData) : '',
                    title: EventADsData ? EventADsData.title : '',
                    video_type: EventADsData ? EventADsData.contentType : ''
                },

                video: {
                    duration: EventPropsData.videoInfo.urlInfo.duration, // in seconds
                    name: EventPropsData.videoInfo.videoInfo.data.data.title,
                    video_id: EventPropsData.videoInfo.videoInfo.data.data.video_id,
                    description: EventPropsData.videoInfo.videoInfo.data.data.synopsis,
                    published_at: EventPropsData.videoInfo.videoInfo.data.data.insertedAt
                },
                enriched_data: {
                    season: EventPropsData.videoInfo.videoInfo.data.data.season_number, //season
                    episode: EventPropsData.videoInfo.videoInfo.data.data.episode_number, //episode	episode number
                    showGenre: EventPropsData.videoInfo.videoInfo.data.data.genres,//["<LIST>", "<OF>", "<STRINGS>"],
                    language: EventPropsData.locale, //language of the content
                    // keywords: EventPropsData.videoInfo.videoInfo.data.data.seo_title, //keywords for the page
                    type: EventPropsData.videoInfo.videoInfo.data.data.content_type, //content type (movie, show, program, series)

                }
            })

        }


    }
}




