const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const apiRouter = express.Router();

app.use(logger('dev', {}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

let payload = bodyParser.json()
console.log(payload)

app.use('/api', apiRouter);

apiRouter.post('/yourname', function(req, res) {
  console.log(req.body);
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "선택하신 지명은 " + req.body.action.params.gn + " 입니다"
          }
        }
      ]
    }
  };

  res.status(200).send(responseBody);
});

apiRouter.post('/metar', async function (req, res) {
    var wxdata = "hello";
    var arpt = req.body.action.params.airport;

    await $.ajax({
      type: 'GET',
      url: 'https://api.checkwx.com/metar/' + arpt,
      headers: { 'X-API-Key': 'f99eccf151947af59057e4a03f' },
      dataType: 'json',
      success: function (data) {
        var obj = data;
        var mm = obj.data;
        console.log(mm);
        wxdata = mm;
        console.log(wxdata);
      }
    });
    console.log(wxdata);


    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "METAR : " + wxdata
            }
          }
        ]
      }
    };

    res.status(200).send(responseBody);

  });

  apiRouter.post('/taf', async function (req, res) {
    var wxdata = "hello";
    var arpt = req.body.action.params.airport;

    await $.ajax({
      type: 'GET',
      url: 'https://api.checkwx.com/taf/' + arpt,
      headers: { 'X-API-Key': 'f99eccf151947af59057e4a03f' },
      dataType: 'json',
      success: function (data) {
        var obj = data;
        var mm = obj.data;
        console.log(mm);
        wxdata = mm;
        console.log(wxdata);
      }
    });
    console.log(wxdata);


    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "TAF : " + wxdata
            }
          }
        ]
      }
    };

    res.status(200).send(responseBody);

  });

apiRouter.post('/showHello', function(req, res) {
  console.log(req.body);

  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleImage: {
            imageUrl: "https://t1.daumcdn.net/friends/prod/category/M001_friends_ryan2.jpg",
            altText: "hello I'm Ryan"
          }
        }
      ]
    }
  };

  res.status(200).send(responseBody);
});


app.listen(3000, function() {
  console.log('Example skill server listening on port 3000!');
});