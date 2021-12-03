const fetch = require('node-fetch');


let FetchWeyyakContent = (req, res, CONTENT_URL, PAGE_NAME) => {

  fetch(CONTENT_URL)
    .then(response => response.json())
    .then(result => {

      let seo_keywords = ""
      if (PAGE_NAME == "EpisodeDetailsPage") {
        seo_keywords = result.data && result.data.tags ? result.data.tags.toString() : result.data.seo_title
      }

      let playerPageData = {
        language: req.params.lang ? req.params.lang : 'ar',
        contentType: req.params.type,
        url: req.url,
        seo_keywords,
        contentData: result,
      }

      if (result && result.error) {
        res.render(`pages/Error`);
      } else {
        res.render(`pages/${PAGE_NAME}`, playerPageData);
      }

    })
}


exports.getGeoLocationAndbaseURL = async (req, res, next) => {

    let Domine_Host = req.headers.host 
    let baseUrl = "https://api.wyk.z5.com"  
    
    if(Domine_Host.includes("localhost") || Domine_Host.includes("webqa.weyyak.com") ||  Domine_Host.includes("qa-weyyak1")){
      baseUrl =  "https://apiqa.wyk.z5.com"
    }else if(Domine_Host.includes("webuat.weyyak.com")  ||  Domine_Host.includes("uat-weyyak1")){
      baseUrl =   "https://uat-api.weyyak.z5.com"
    }

  await fetch("https://geo.weyyak1.z5.com/")
    .then(response => response.text())
    .then(result => {
      req.body = { country: result, baseUrl }
      next()
    }).catch((err) => {
      console.log("-ERROR--->", err)
    })
}

exports.episodeDetailsController = (req, res) => {

  const LANG = req.params.lang;
  const ID = req.params.id;
  const COUNTRY = req.body.country;
  const CONTENT_TYPE = req.params.type;
  const url = req.url

  let CONTENT_URL = `${req.body.baseUrl}/v1/${LANG}/${CONTENT_TYPE}/${ID}?cascade=2&country=${COUNTRY}`

  FetchWeyyakContent(req, res, CONTENT_URL, "EpisodeDetailsPage")

}

exports.HomePageController = (req, res) => {

  const LANG = req.params.lang ? req.params.lang : 'ar';
  const COUNTRY = req.body.country;
  const CONTENT_TYPE = req.params.type;
  const url = req.url

  let CONTENT_URL = ` ${req.body.baseUrl}/v1/${LANG}/menu/62?cascade=2&country=${COUNTRY}`

  FetchWeyyakContent(req, res, CONTENT_URL, "HomePage")

}

exports.menuListingPageController = (req, res) => {

  const LANG = req.params.lang;
  const ID = req.params.id;
  const COUNTRY = req.body.country;
  const CONTENT_TYPE = req.params.type;
  const url = req.url

  let CONTENT_URL = `${req.body.baseUrl}/v1/${LANG}/menu/117?cascade=2&country=${COUNTRY}`


  FetchWeyyakContent(req, res, CONTENT_URL, "menuSeriesListPage")
  
}


exports.TopNav_ListController = (req, res) => {

    const LANG = req.params.lang;
    const COUNTRY =  req.body.country;
    const CONTENT_TYPE = req.params.type;
    const url = req.url
    
    let CONTENT_URL = `${req.body.baseUrl}/v1/${LANG}/contents/contentType?Country=${COUNTRY}&OrderBy=desc&pageNo=1&RowCountPerPage=50&IsPaging=0&contentType=${CONTENT_TYPE}`

  // FetchWeyyakContent(req,res,CONTENT_URL,"ContentListPage")

  fetch(CONTENT_URL)
    .then(response => response.json())
    .then(result => {

      let playerPageData = {
        language: req.params.lang,
        contentType: "movie",
        url: req.url,
        contentData: result,
      }

      if (result && result.error) {
        res.render(`pages/Error`);
      } else {
        res.render(`pages/ContentListPage`, playerPageData);
      }

    })
  }
  
  exports.ContentDetailsController =  (req, res) => {

    const LANG = req.params.lang;
    const ID = req.params.id;
    const url = req.url
    const COUNTRY = req.body.country;
    const CONTENT_TYPE = req.params.type;
    let isSeries = CONTENT_TYPE == "series" ? true : false
  
  
    let CONTENT_URL = CONTENT_TYPE == "movie" ? 
    `${req.body.baseUrl}/v1/${LANG}/contents/moviedetails?Country=${COUNTRY}&contentkey=${ID}` : 
    `${req.body.baseUrl}/v1/${LANG}/series?contentkey=${ID}&cascade=3&country=${COUNTRY}`

  fetch(CONTENT_URL)
    .then(response => response.json())
    .then(result => {

      let main_genre = 'drama';
      if (result.data && result.data.genres[0] != undefined) {
        main_genre = encodeURI(result.data.genres[0]);
      }

      let EpisodeURLsData = []

      if (result.error) {
        res.render(`pages/Error`);
      }

      if (isSeries) {

        let EpisodeList = result.data.seasons && result.data.seasons[0] && result.data.seasons[0].episodes

        EpisodeList && EpisodeList.map((item) => {

          let EP_URL = `/${LANG}/player/episode/${item.id}/${item.title.replace(/ +/g, "-")}-${item.episode_number ? "Episode" + item.episode_number : ""}`

          EpisodeURLsData.push(EP_URL)
        })

      }


      let RELATED_CONTENT_URL = `${req.body.baseUrl}/v1/${LANG}/related?id=${ID}&q=${main_genre}&type=${CONTENT_TYPE}&country=${COUNTRY}&size=100`

      // get related content

      fetch(RELATED_CONTENT_URL)
        .then(response => response.json())
        .then(relatedData => {

          let seo_keywords = !result.error ? `${result.data.seo_title},${result.data.translated_title},${result.data.genres.toString()},${result.data.cast.toString()}` : ''

          if (result.data && result.data.tags) {
            seo_keywords = result.data.tags.toString()
          }

          let videoPageData = {
            language: LANG,
            url,
            seo_keywords,
            contentData: result,
            isSeries,
            EpisodeURLsData,
            relatedData: relatedData.data
          }


          if (relatedData && relatedData.error) {
            res.render(`pages/Error`);
          } else {
            res.render('pages/contentDetailsPage', videoPageData);
          }


        })
    })

}




exports.StaticPagesController = function (req, res) {

  let static_data = null

  if (req.params.lang == "en") {
    static_data = require('../src/app/i18n/properties/en.json')
  } else {
    static_data = require('../src/app/i18n/properties/ar.json')
  }


  let metaData = {
    title: "weyyak - ssr",
    description: "sample description",
    keywords: "Weyyak, Ramadan, Arabic Movies, Ramadan 2019, Syrian series, Indian Weyyak, Arabic Series, Egyptian Series, Egyptain Movies and Plays, Weyyak In French,  مسلسلات سورية و عربية, مسلسلات مصرية, أفلام و مسرحيات مصرية, مسلسلات هندية و عالمية, مسلسلات هندية و عالمية, وياك بالفرنسي"
  }

  let propsData = ""

  if (req.params.pagename == 'about-en' || req.params.pagename == 'about-ar') {
    metaData.title = "About Us"
    propsData = {
      metaData,
      pageTitle: static_data.about,
      pageContent: static_data.about_content
    }
  } else if (req.params.pagename == 'privacy-en' || req.params.pagename == 'privacy-ar') {
    metaData.title = "Privacy policy"
    propsData = {
      metaData,
      pageTitle: static_data.privacy_policy,
      pageContent: static_data.privacy_content
    }
  } else if (req.params.pagename == 'term-en' || req.params.pagename == 'term-ar') {
    metaData.title = "Terms of use"
    propsData = {
      metaData,
      pageTitle: static_data.terms,
      pageContent: static_data.terms_content
    }
  }

  res.render('pages/staticPage', propsData);

}


exports.AdyenPaymentsController = async function (req, res) {

  res.render('pages/adyenpayment');

}