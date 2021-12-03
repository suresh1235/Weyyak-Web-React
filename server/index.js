const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
var cookieParser = require('cookie-parser');
const { request } = require('http');
const requestObj = require('request');
const { htmlToText } = require('html-to-text');
const fetch = require('node-fetch');
const app = express();
const compression = require('compression');
const { HomePageController, StaticPagesController, ContentDetailsController
  , episodeDetailsController,TopNav_ListController,
  menuListingPageController, getGeoLocationAndbaseURL, AdyenPaymentsController } = require("../seo_controllers/contentdetails")
// const router = require("./seo_routes")

app.set('view engine', 'ejs');

const weyyakservers = ['www.weyyak.z5.com', 'weyyak.z5.com', 'www.weyyak.com', 'wayyak.com', 'www.wayyak.com', 'weyyak.net', 'www.weyyak.net',
  'z5wayyak.com', 'www.z5wayyak.com', 'z5wayyak.net', 'www.z5wayyak.net', 'z5weyyak.com', 'www.z5weyyak.com', 'z5weyyak.net', 'www.z5weyyak.net',
  'weyyak.ae', 'www.weyyak.ae'];
let isBot = false;

app.all('*', function (req, res, next) {
  /*Code snippet to redirect all the other domains to the weyyak.com*/
  var host = req.hostname;
  if (weyyakservers.includes(host)) {
    return res.redirect(301, 'https://weyyak.com' + req.originalUrl);
  }
  setBotStatus(req);
  next();
});

// SiteMaps
app.all('/sitemap/*', function (req, res) {
  requestObj('http://weyyakbotnode.s3.ap-south-1.amazonaws.com' + req.originalUrl).pipe(res);
});

app.post("/v1/pushPackages/C9REGPB46C.web.com.weyyak", (request, response) => {
  // return the push package
  response.set('Content-Type', "application/zip");
  response.download(__dirname + "/pushPackage.zip", "pushPackage.zip");

})

app.post("/v1/log", (request, response) => {
  // print the logs to the console  
  console.log(request.body.logs);
  console.log(request.body);
  response.sendStatus(200);

})

app.post("/v1/devices/*/registrations/C9REGPB46C.web.com.weyyak", (request, response) => {
  // capture requests to register or deregister the token
  response.sendStatus(200);
})


app.get("/.well-known/apple-app-site-association", (req, res) => {
  res.set('Content-Type', 'application/json');
    res.send({
      "applinks": {
        "apps": [],
        "details": [{
          "appID": "C9REGPB46C.com.tvaa.z5weyyak",
          "paths": ["*"]
        }]
      }
    });
});
app.get("/apple-app-site-association", (req, res) => {
  res.set('Content-Type', 'application/json');
    res.send({
      "applinks": {
        "apps": [],
        "details": [{
          "appID": "C9REGPB46C.com.tvaa.z5weyyak",
          "paths": ["*"]
        }]
      }
    });
});


app.get('/', function (req, res, next) {
  if (isBot) {
    return res.redirect(301, req.protocol + '://' + req.headers.host + '/ar');
  }
  next();
})


app.use(compression());
app.use(express.static(path.join(__dirname, '../build'), { maxAge: 2592000000 }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.get('/ping', function (req, res) {
  return res.send('pong');
});
app.post("/cookie", (req, res) => {
  const options = {
    secure: false,
    httpOnly: true,
    //domain: "..com",
    maxAge: 365 * 24 * 60 * 60 * 1000
  }
  //console.log(req.body)
  return res
    .cookie(req.body.cookiename, req.body.cookievalue, options)
    .status(200)
    .send("cookie sent")
})
app.get("/getCookie/:cookiename", (req, res) => {
  console.log(req.params.cookiename)
  if (req.cookies && (req.cookies.COOKIE_USER_TOKEN || req.cookies.COOKIE_USER_OBJECT) || req.cookies.uuid) {
    //console.log(req.cookies.COOKIE_USER_OBJECT)
    if (req.params.cookiename == 'COOKIE_USER_TOKEN')
      res.send(decodeURIComponent(req.cookies.COOKIE_USER_TOKEN));
    else if (req.params.cookiename == 'COOKIE_USER_OBJECT') {
      let uobj = decodeURIComponent(req.cookies.COOKIE_USER_OBJECT);
      res.send(uobj);
    }
    else {
      res.send(decodeURIComponent(req.cookies.uuid))
    }
  }
  else
    res.send(null);
});
app.post("/destroyCookie", (req, res) => {
  const options = {
    secure: false,
    httpOnly: true,
    //domain: "..com",
    maxAge: 0
  }
  //console.log(req.body)
  return res
    .cookie(req.body.cookiename, req.body.cookievalue, options)
    .status(200)
    .send("cookie desstroyed")
})
app.post("/guestCookie", (req, res) => {
  const options = {
    secure: false,
    httpOnly: true,
    //domain: "..com",
    maxAge: 365 * 24 * 60 * 60 * 1000
  }
  //console.log(req.body)
  return res
    .cookie(req.body.cookiename, req.body.cookievalue, options)
    .status(200)
    .send("guestcookie set..")
})
app.get("/getGuestCookieInfo/:cookiename", (req, res) => {


  if (req.cookies[req.params.cookiename]) {
    res.send(req.cookies[req.params.cookiename]);
  }
  else {
    res.send('1');
  }

});


app.post("/:lang/apple-token", (req, res) => {
  console.log('Got body:', req.body);
  let lang = req.params.lang
  let data = JSON.stringify(req.body, null, 4)
  var string = encodeURIComponent(data);
  res.redirect(`/${lang}/apple-token/token=${string}`);

  // res.send(JSON.stringify(req.body, null, 4));
});

app.post("/:lang/android-apple-token", (req, res) => {
  let lang = req.params.lang
  let data = JSON.stringify(req.body, null, 4)
  var string = encodeURIComponent(data);
  res.redirect(`/${lang}/android-apple-token/token=${string}`);
});



app.get('*', function (req, res, next) {

  if (isBot) {
    next();
  } else {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  }

  //  if(bot){
  //     res.sendFile(path.join(__dirname, '../build', 'index.html'));
  //    }
  //    else{
  //     next()
  //    }  
});


app.get('/', getGeoLocationAndbaseURL, HomePageController);    //HOME PAGE
app.get('/:lang', getGeoLocationAndbaseURL, HomePageController);    //HOME PAGE

app.get('/:lang/adyenpayment', AdyenPaymentsController); // ADYEN Payments

app.get('/:lang/:seriesName', getGeoLocationAndbaseURL, menuListingPageController); // Series list

app.get("/:lang/contents/:type", getGeoLocationAndbaseURL, TopNav_ListController);  // HOME Page top navigation items

app.get('/:lang/static/:pagename', StaticPagesController); // Static pages

app.get("/:lang/:type/:id/:name", getGeoLocationAndbaseURL, ContentDetailsController); // Video Details page

app.get("/:lang/player/:type/:id/:name", getGeoLocationAndbaseURL, episodeDetailsController);  // EPisode Details Page

setBotStatus = (req) => {
  let userAgent = req.headers['user-agent'].toLowerCase();
  if (req.query.isBot || userAgent.startsWith('facebookexternalhit/1.1') ||
    userAgent === 'facebot' || userAgent.startsWith('twitterbot') ||
    userAgent.includes('light') || userAgent.includes('googlebot') || userAgent.includes('bot')) {
    isBot = true
  } else {
    isBot = false
  }
}


// app.get('*', function (req, res) {
// res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });
app.listen(process.env.PORT || 3001);