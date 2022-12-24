apiRouter.post("/metar", async function (req, res) {
    var wxdata = "hello";
    var arpt = req.body.action.params.airport;
    try {
      await $.ajax({
        type: "GET",
        url: "https://api.checkwx.com/metar/" + arpt,
        headers: { "X-API-Key": "f99eccf151947af59057e4a03f" },
        dataType: "json",
        success: function (data) {
          var obj = data;
          var mm = obj.data;
          wxdata = mm;
        },
      });
    } catch (err) {
      wxdata = "에러발생 | 코드 : metar-err-wx-1";
    }
    console.log(
      `%s.%s.%s %s:%s:%s -> %s`,
      year,
      month,
      date,
      hour,
      min,
      sec,
      wxdata
    );
    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "METAR : " + wxdata,
            },
          },
        ],
      },
    };
    res.status(200).send(responseBody);
  });
  
  apiRouter.post("/taf", async function (req, res) {
    var wxdata = "hello";
    var arpt = req.body.action.params.airport;
    try {
      await $.ajax({
        type: "GET",
        url: "https://api.checkwx.com/taf/" + arpt,
        headers: { "X-API-Key": "f99eccf151947af59057e4a03f" },
        dataType: "json",
        success: function (data) {
          var obj = data;
          var mm = obj.data;
          wxdata = mm;
        },
      });
    } catch (err) {
      wxdata = "에러발생 | 코드 : taf-err-wx-1";
    }
    console.log(
      `%s.%s.%s %s:%s:%s -> %s`,
      year,
      month,
      date,
      hour,
      min,
      sec,
      wxdata
    );
  
    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "TAF : " + wxdata,
            },
          },
        ],
      },
    };
  
    res.status(200).send(responseBody);
  });