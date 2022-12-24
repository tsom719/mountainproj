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

var mql = mysql.createPool({
  host: settings.mqlhost,
  user: settings.mqlid,
  password: settings.mqlpass,
  port: settings.mqlport,
  database: settings.mqlbase,
});

let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1; // 월
let date = today.getDate(); // 날짜
let hour = today.getHours(); //시간
let min = today.getMinutes(); //분
let sec = today.getSeconds(); //초

let payload = bodyParser.json();
console.log( year +"." +month +"." +date +" " +hour +":" +min +":" +sec +" => " +payload);

app.use("/api", apiRouter);

apiRouter.post("/safeinfo", function (req, res) {
  console.log(req.body);
  let dbchecksafe ="SELECT * FROM mt_safe WHERE name=" + req.body.action.params.gn //지갑 확인
  let info = ''
  function callmql(err, rows, fields) {
    if (err) {
      throw err;
    } else if (!rows.length) {
      info = info + rows[i].name
    }
  }
  mql.query(dbchecksafe, callmql)
  console.log(info)

  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: info,
          },
        },
      ],
    },
  };

  res.status(200).send(responseBody);
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
