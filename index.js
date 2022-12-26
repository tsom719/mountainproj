const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
const apiRouter = express.Router();
const settings = require("./botsettings.json");
app.use(logger("dev", {}));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1; // 월
let date = today.getDate(); // 날짜
let hour = today.getHours(); //시간
let min = today.getMinutes(); //분
let sec = today.getSeconds(); //초

var mql = mysql.createPool({
  host: settings.mqlhost,
  user: settings.mqlid,
  password: settings.mqlpass,
  port: settings.mqlport,
  database: settings.mqlbase,
});

var infoll

function sfinfo(rq) { // 안전정보 확인 func
  let dbchecksafe = "SELECT * FROM mt_safe WHERE name='" + rq + "'";
  function callmql(err, rows, fields) {
    if (err) {
      throw err;
    } else if (!rows.length) {
      return;
    } else {
      var info = ''
      for (var i = 0; i < rows.length; i++) {
        info = rows[i].desc;
      }
    }
    infoll = info;
  }
  mql.query(dbchecksafe, callmql);
}

function eminfo(rq) { // 응급처치 확인 func
  let dbchecksafe = "SELECT * FROM mt_emer WHERE name='" + rq + "'";
  function callmql(err, rows, fields) {
    if (err) {
      throw err;
    } else if (!rows.length) {
      return;
    } else {
      var info = ''
      for (var i = 0; i < rows.length; i++) {
        info = rows[i].desc;
      }
    }
    infoll = info;
  }
  mql.query(dbchecksafe, callmql);
}

function hsinfo(rq) { // 병원정보 확인 func
  let dbchecksafe = "SELECT * FROM mt_gnhos WHERE dong='" + rq + "'";
  function callmql(err, rows, fields) {
    if (err) {
      throw err;
    } else if (!rows.length) {
      return;
    } else {
      var info = ''
      for (var i = 0; i < rows.length; i++) {
        info = info + rows[i].name + ' : ' + rows[i].depart + '\n'
      }
    }
    infoll = info + '(병원 정보는 정확하지 않을 수 있습니다)'
  }
  mql.query(dbchecksafe, callmql);
}



let payload = bodyParser.json();
console.log( year +"." +month +"." +date +" " +hour +":" +min +":" +sec +" => " +payload);

app.use("/api", apiRouter);

apiRouter.post("/safeinfo", function (req, res) {
    console.log(req.body);
    sfinfo(req.body.action.clientExtra.safename);
    setTimeout(() => {  let responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: infoll,
            },
          },
        ],
      },
    };
    res.status(200).send(responseBody); }, 50);
    
  });

  apiRouter.post("/eminfo", function (req, res) {
    console.log(req.body);
    eminfo(req.body.action.clientExtra.eminfo);
    setTimeout(() => {  let responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: infoll,
            },
          },
        ],
      },
    };
    res.status(200).send(responseBody); }, 50);
    
  });

  apiRouter.post("/hsinfo", function (req, res) {
    console.log(req.body);
    hsinfo(req.body.action.clientExtra.gn);
    setTimeout(() => {  let responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: infoll,
            },
          },
        ],
      },
    };
    res.status(200).send(responseBody); }, 50);
    
  });

apiRouter.post("/showHello", function (req, res) {
  console.log(req.body);

  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleImage: {
            imageUrl:
              "https://t1.daumcdn.net/friends/prod/category/M001_friends_ryan2.jpg",
            altText: "hello I'm Ryan",
          },
        },
      ],
    },
  };

  res.status(200).send(responseBody);
});

app.listen(3000, function () {
  console.log(
    "Skill Server listening on port 3000. [ dev.codesj.kr:3000 ] \nMade by Seungjae Lee | dev.codesj.kr\n_______________BACK V1.1_______________"
  );
});
