var url = require("url");
const http = require("http");
const exec = require("child_process").exec;
const API_KEY =
  "AQE9hmfuXNWTK0Qc+iSKl2EdqfCeWp9MBJ1HXWtC43a/m3RbjM5lFdVNDzpoGvX8HlxyJ0EMQUXtA2hGgyLGHBDBXVsNvuR83LVYjEgiTGAH-Rvzqf6rf9nIEUU0P+slzL5jkKPmxVnD6CaOLY1x3mZ0=-XysJx5IC93TKzpyv";
const MERCHANT_ACCOUNT = "ZeeEntertainmentEnterprisesLimitedCOM";

const server = http.createServer(async (request, response) => {
  let responseData = {
    data: null
  };

  response.writeHead(200, {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  });
  switch (request.method) {
    case "GET":
      // Handle get info...
      if (request.url.indexOf("/paymentSession") !== -1) {
        responseData.data = await fnCreatePaymentSession(request);
        response.end(JSON.stringify(responseData));
      }
      break;
    case "POST":
      let body = "";
      request.on("data", function(data) {
        body += data;
      });
      request.on("end", async function() {
        try {
          var post = JSON.parse(body);
          if (request.url.indexOf("/payments/result") !== -1) {
            responseData.data = await fnVerifyPaymentResult(post.payload);
            response.end(JSON.stringify(responseData));
          }
          return;
        } catch (err) {
          fnHandleError(err, response);
          return;
        }
      });
      break;
    default:
      response.end();
  }
});
server.listen(3001);

//Create payment session
function fnCreatePaymentSession(request) {
  function fnFetchCurlData() {
    const sCurlUrl = `curl -H "Content-Type: application/json" -H "X-API-Key: ${API_KEY}" -X POST -d '{
       "merchantAccount": "${MERCHANT_ACCOUNT}",
       "sdkVersion": "1.9.5",
       "channel": "Web",
       "amount": {
          "currency": "INR",
          "value": 17408
       },
       "reference": ${Math.floor(Math.random() * 1000000 + 1) + ""},
       "countryCode": "IN",
       "shopperLocale": "EN",
       "origin": "http://localhost:3000",
       "returnUrl": "http://localhost:3000/en/transactionstatus/completed"
    }' https://checkout-test.adyen.com/v41/paymentSession`;
    return new Promise((resolve, reject) => {
      exec(sCurlUrl, (error, stdout, stderr) => {
        if (error) {
          console.log("Error occured - " + error + "\n");
        }
        resolve(JSON.parse(stdout));
      });
    }).catch(error => {
      console.log("Error occured - " + error + "\n");
      resolve(null);
    });
  }
  const oSession = fnFetchCurlData();

  return oSession;
}

//Verify payment result
function fnVerifyPaymentResult(sPayload) {
  /* const url_parts = url.parse(request.url, true);
  const query = url_parts.query;
  const sPayload = query.payload; */
  function fnFetchCurlData() {
    const sCurlUrl = `curl \
    -H "Content-Type: application/json" \
    -H "X-API-Key: ${API_KEY}" \
    -X POST \
    -d '{ "payload": "${sPayload}" }' \
    https://checkout-test.adyen.com/v41/payments/result`;
    return new Promise((resolve, reject) => {
      exec(sCurlUrl, (error, stdout, stderr) => {
        if (error) {
          console.log("Error occured - " + error + "\n");
        }
        resolve(JSON.parse(stdout));
      });
    }).catch(error => {
      console.log("Error occured - " + error + "\n");
      resolve(null);
    });
  }

  const oResult = fnFetchCurlData();
  return oResult;
}

function fnHandleError(err, response) {
  response.writeHead(500, { "Content-Type": "text/plain" });
  response.write("Bad Post Data.  Is your data a proper JSON?\n");
  response.end();
  return;
}
