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

var infoll;

function sfinfo(rq) {
  // 안전정보 확인 func
  let dbchecksafe = `SELECT * FROM mt_safe WHERE name='${rq}'`;
  function callmql(err, rows, fields) {
    if (err) {
      throw err;
    } else if (!rows.length) {
      return;
    } else {
      var info = "";
      for (var i = 0; i < rows.length; i++) {
        info = rows[i].desc;
      }
    }
    infoll = info;
  }
  mql.query(dbchecksafe, callmql);
}

function eminfo(rq) {
  // 응급처치 확인 func
  let dbchecksafe = `SELECT * FROM mt_emer WHERE name='${rq}'`;
  function callmql(err, rows, fields) {
    if (err) {
      throw err;
    } else if (!rows.length) {
      return;
    } else {
      var info = "";
      for (var i = 0; i < rows.length; i++) {
        info = rows[i].desc;
        console.log(rows[i].desc);
      }
    }
    infoll = info;
  }
  mql.query(dbchecksafe, callmql);
}

function hsinfo(rq) {
  // 병원정보 확인 func
  let dbchecksafe = `SELECT * FROM mt_gnhos WHERE dong='${rq}'`;
  function callmql(err, rows, fields) {
    if (err) {
      throw err;
    } else if (!rows.length) {
      return;
    } else {
      var info = "";
      for (var i = 0; i < rows.length; i++) {
        info = info + rows[i].name + " : " + rows[i].depart + "\n";
      }
    }
    infoll = info + "(위급한 상황에는 종합병원 응급실을 방문해주세요)";
  }
  mql.query(dbchecksafe, callmql);
}

function mtinfo(rq) {
  // 산정보 확인 func
  let dbchecksafe = `SELECT * FROM mt_mountain WHERE name='${rq}'`;

  function callmql(err, rows, fields) {
    if (err) {
      throw err;
    } else if (!rows.length) {
      return;
    } else {
      var mtn = "";
      for (var i = 0; i < rows.length; i++) {
        mtn = rows[i].dong;
        let dbchecksafe1 = `SELECT * FROM mt_gnhos WHERE dong='${mtn}'`;
        function callmql1(err, rows, fields) {
          if (err) {
            throw err;
          } else if (!rows.length) {
            var info = "해당하는 병원이 없습니다.\n\n";
          } else {
            var info = "";
            for (var i = 0; i < rows.length; i++) {
              info = info + rows[i].name + " : " + rows[i].depart + "\n";
            }
          }
          infoll = info + "(위급한 상황에는 종합병원 응급실을 방문해주세요)";
        }
        mql.query(dbchecksafe1, callmql1);
      }
    }
    mtname = mtn;
  }
  mql.query(dbchecksafe, callmql);
}

let payload = bodyParser.json();
//console.log( year +"." +month +"." +date +" " +hour +":" +min +":" +sec +" => " +payload);

app.use("/api", apiRouter);

apiRouter.post("/safeinfo", function (req, res) {
  sfinfo(req.body.action.clientExtra.safename);
  setTimeout(() => {
    let responseBody = {
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
    res.status(200).send(responseBody);
  }, 50);
});

apiRouter.post("/eminfo", function (req, res) {
  eminfo(req.body.action.clientExtra.eminfo);
  setTimeout(() => {
    let responseBody = {
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
    res.status(200).send(responseBody);
  }, 50);
});

apiRouter.post("/hsinfo", function (req, res) {
  hsinfo(req.body.action.params.gn);
  setTimeout(() => {
    let responseBody = {
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

    res.status(200).send(responseBody);
  }, 50);
});

apiRouter.post("/mtinfo", function (req, res) {
  mtinfo(req.body.action.params.mtname);
  setTimeout(() => {
    let responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "산이 위치한 지역의 병원입니다.\n\n" + infoll,
            },
          },
        ],
      },
    };
    res.status(200).send(responseBody);
  }, 150);
});

app.listen(3000, function () {
  console.log(
    `Skill Server listening on port 3000. [ dev.codesj.kr:3000 ] \nMade by Seungjae Lee | dev.codesj.kr\n ${
      year + "." + month + "." + date + " " + hour + ":" + min + ":" + sec
    }\n_______________BACK V1.1_______________`
  );
});
