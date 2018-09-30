var LanguageTranslatorV3 = require("watson-developer-cloud/language-translator/v3");
var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var async = require('async');
var fs = require('fs');
const download = require('image-downloader');
var Algorithmia = require("algorithmia");
var key = "AIzaSyCweXwBZ82TU1ZdOCFoDFYhx9l75vh6E50";
var port = process.env.PORT || 5000;

/*
var server = app.listen(process.env.PORT || 5000, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});*/

app.get("/", function(req, res) {
    res.status(200).send("Welcome to SHADE's RESTFUL Server");
});

app.get("/analysis", (req, res) => {
    res.render('login');
});

app.get("/vr/", function(req, res) {

    var visualRecognition = new VisualRecognitionV3({
        version: '2018-03-19',
        iam_apikey: '7uiDnoxCuHY45jGx8Zjb0lHpJulg1o3mTjfLMEo2BBHM'
    });

    var images_file = fs.createReadStream('./image4.png');

    var params = {
        images_file: images_file
    };

    visualRecognition.detectFaces(params, function(err, response) {
        if (err)
            console.log(err);
        else
            console.log(JSON.stringify(response, null, 2))
    });
});

app.get("/visualrecognition/", function(req, res) {

    var visualRecognition = new VisualRecognitionV3({
        version: '2018-03-19',
        "url": "https://gateway.watsonplatform.net/visual-recognition/api",
        iam_apikey: '11AdaPCD7f9PSt-ZgE0hlSr_57YNReDaUh16QADykjsd'
    });

    /*var images_file = fs.createReadStream('public/assets/images/hello1.png');
    var classifier_ids = ["emotion_991030470"];

    var params = {
      images_file: images_file,
      //url: 'https://scontent-bom1-1.cdninstagram.com/vp/53609e4f7b89627841d0941ad32ded29/5C2BB107/t51.2885-15/e35/38146144_1895271050766701_1294532726749134848_n.png',
      //url: urls[i],
      classifier_ids: classifier_ids
    };

    visualRecognition.classify(params, function(err, response) {
      if (err)
        console.log(err);
      else
        console.log(JSON.stringify(response, null, 2))
    });*/

    var params = {
        name: 'emotion',
        /*human_positive_examples: fs.createReadStream('./Human.zip'),
        nonhuman_positive_examples: fs.createReadStream('./Nonhuman.zip')*/
        /*anger_positive_examples: fs.createReadStream('./Anger.zip'),
        disgust_positive_examples: fs.createReadStream('./Disgust.zip'),
        fear_positive_examples: fs.createReadStream('./Fear.zip'),
        joy_positive_examples: fs.createReadStream('./Joy.zip'),
        sadness_positive_examples: fs.createReadStream('./Sadness.zip')*/
        black_positive_examples: fs.createReadStream('./Black.zip'),
        color_positive_examples: fs.createReadStream('./Color.zip')
    };

    visualRecognition.createClassifier(params,
        function(err, response) {
            if (err)
                console.log(err);
            else
                console.log(JSON.stringify(response, null, 2))
        });
});

app.get("/algo", function(req, res) {
    var input = {
        "image": "https://scontent-bom1-1.cdninstagram.com/vp/12bd5402751e02af9efb14a5704b7a49/5BA16D57/t51.2885-15/e35/40246489_554476401677173_261011095773395057_n.jpg",
        "numResults": 7
    };
    Algorithmia.client("siml1Jh+cMnbP2VyVpnOPDa8dvL1")
        .algo("deeplearning/EmotionRecognitionCNNMBP/1.0.1")
        .pipe(input)
        .then(function(response) {
            console.log(JSON.stringify(response.result));
            console.log(JSON.stringify(response.result.results[0].emotions[0].label));
        });
});

app.get("/personality-insights", function(req, res) {

    var personalityInsights = new PersonalityInsightsV3({
        'version_date': '2017-10-13',
        "url": "https://gateway.watsonplatform.net/personality-insights/api",
        "username": "ac008f35-aa14-406d-80da-c1fdf80e2a4b",
        "password": "BvBJ2TX18n2V"
    });

    personalityInsights.profile({
        'text': 'I am very happy.'
    }, function(error, profile) {
        if (error) {
            console.log(error);
        } else {
            console.log(JSON.stringify(profile, null, 2));
        }
    });
});

app.get("/translate/:t/:s", function(req, res) {
    var languageTranslator = new LanguageTranslatorV3({
        version: "2018-05-01",
        url: "https://gateway.watsonplatform.net/language-translator/api",
        username: "b34e19b7-1885-4c80-abdc-4725437da799",
        password: "Gdq5bnQWtO36"
    });

    var parameters = {
        text: req.params.t,
        source: req.params.s,
        target: "English"
    };

    languageTranslator.translate(parameters, function(error, response) {
        if (error) res.send(error);
        else res.send(JSON.stringify(response, null, 2));
    });
});

app.get("/toneanalyzer", function(req, res) {
    var toneAnalyzer = new ToneAnalyzerV3({
        version_date: "2017-09-21",
        url: "https://gateway.watsonplatform.net/tone-analyzer/api",
        username: "39a782b1-8815-4d0e-92c6-7a255c93b367",
        password: "uVskOH5GxI4C"
    });

    var text =
        "I am feeling sad because india lost the series by 4-1. It was very heart breaking to see most of the players performing very poor." +
        "Virat Kohli's performance was very good";

    var toneParams = {
        tone_input: {
            text: text
        },
        content_type: "application/json"
    };

    toneAnalyzer.tone(toneParams, function(error, toneAnalysis) {
        if (error) res.send(error);
        else res.send(JSON.stringify(toneAnalysis, null, 2));
    });
});

app.get("/nlu", function(req, res) {

    var natural_language_understanding = new NaturalLanguageUnderstandingV1({
        "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
        "username": "b3bb4144-d39b-4f7c-b381-6be4f51becb3",
        "password": "FVzOPvAUPDg0",
        'version': '2018-03-16'
    });

    var parameters = {
        'text': "performance of Virat Kohli was poor.",
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': true,
                'limit': 2
            },
            'keywords': {
                'emotion': true,
                'sentiment': true,
                'limit': 2
            }
        }
    }

    natural_language_understanding.analyze(parameters, function(err, response) {
        if (err)
            console.log('error:', err);
        else
            console.log(JSON.stringify(response, null, 2));
    });

});

app.get("/helloworld", function(req, res) {


    const options = {
        url: 'https://scontent-bom1-1.cdninstagram.com/vp/d3c1361808706f05226c2a872059359d/5C2E4904/t51.2885-15/e35/39242121_464906317360459_6760996642435891200_n.png',
        dest: 'public/assets/images/hello.png' // Save to /path/to/dest/image.png
    }

    //var filename = 'hello.png';
    download.image(options)
        .then(({
            filename, image
        }) => {
            console.log('File saved to', filename)
        })
        .catch((err) => {
            console.error(err)
        })

    res.send("Hello");
});


app.get('/n/food/:location', function(req, res) {
    var type = "food";
    var location = req.params.location;
    //var key=req.params.key;
    var result = "";

    function second() {
        //return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
        return res.status(200).send(result);
    }

    function first(callback) {
        request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + location + '+city+food&language=en&key=' + key, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var o = JSON.parse(body);
                //console.log(body);
                //result="The spots are as follows:  ";
                result = "{ \"Hotels\":[";
                if (o.results.length == 0) {
                    result = "No data available for this location. Please try some other name";
                    callback(second);
                } else {
                    //console.log("Body:"+o);
                    for (var i = 0; i < o.results.length; i++) {
                        /*info=o.results[i].name.concat(',');
                        result=result.concat(info);*/
                        var addr = o.results[i].formatted_address;
                        var n = o.results[i].name;
                        result = result.concat("{");
                        result = result.concat("\"formatted_address\":\"").concat(addr).concat("\",");
                        result = result.concat("\"name\":\"").concat(n).concat("\"");

                        result = result.concat("}");
                        if (i <= o.results.length - 2)
                            result = result.concat(",");
                    }
                    result = result.concat("]}");
                }

                //console.log("response="+result);
                callback(second);
            } else {
                console.log("error..");
                return err;
            }
        });
    }
    first(second);


});


//nearby-nature-------------------------------------------------------------------------------------------
app.get('/n/natural/feature/:location', function(req, res) {
    var type = "natural+feature";
    var location = req.params.location;
    //var key=req.params.key;
    var result = "";

    function second() {
        //return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
        return res.status(200).send(result);
    }

    function first(callback) {
        request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + location + '+city+natural+feature&language=en&key=' + key, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var o = JSON.parse(body);
                //console.log(body);
                //result="The spots are as follows:  ";
                result = "{ \"Natural_Places\":[";
                if (o.results.length == 0) {
                    result = "No data available for this location. Please try some other name";
                    callback(second);
                } else {
                    for (var i = 0; i < o.results.length; i++) {
                        /*info=o.results[i].name.concat(',');
                        result=result.concat(info);*/
                        var addr = o.results[i].formatted_address;
                        var n = o.results[i].name;
                        result = result.concat("{");
                        result = result.concat("\"formatted_address\":\"").concat(addr).concat("\",");
                        result = result.concat("\"name\":\"").concat(n).concat("\"");

                        result = result.concat("}");
                        if (i <= o.results.length - 2)
                            result = result.concat(",");
                    }
                    result = result.concat("]}");
                }

                //console.log("response="+result);
                callback(second);
            } else {
                console.log("error..");
                return err;
            }
        });
    }
    first(second);
});


//nearby-worship--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/n/place/of/worship/:location', function(req, res) {
    var type = "place+of+worship";
    var location = req.params.location;
    //var key=req.params.key;
    var result = "";



    function second() {
        //return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
        return res.status(200).send(result);
    }

    function first(callback) {
        request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + location + '+city+place+of+worship&language=en&key=' + key, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var o = JSON.parse(body);
                //console.log(body);
                //result="The spots are as follows:  ";
                result = "{ \"Temples\":[";
                if (o.results.length == 0) {
                    result = "No data available for this location. Please try some other name";
                    callback(second);
                } else {
                    for (var i = 0; i < o.results.length; i++) {
                        /*info=o.results[i].name.concat(',');
                        result=result.concat(info);*/
                        var addr = o.results[i].formatted_address;
                        var n = o.results[i].name;
                        result = result.concat("{");
                        result = result.concat("\"formatted_address\":\"").concat(addr).concat("\",");
                        result = result.concat("\"name\":\"").concat(n).concat("\"");

                        result = result.concat("}");
                        if (i <= o.results.length - 2)
                            result = result.concat(",");
                    }
                    result = result.concat("]}");
                }

                //console.log("response="+result);
                callback(second);
            } else {
                console.log("error..");
                return err;
            }
        });
    }
    first(second);
});

app.get("/youtube/:search", function(req, ress) {

    var q = req.params.search;
    var result = "";

    function second() {
        ress.status(200).send(JSON.parse(result));
    }

    function first(callback) {
        request("https://www.googleapis.com/youtube/v3/search?key=AIzaSyBiKdkHDQngti6UKucNTxlA85aH2dYqcQo&q=" + q + "&part=snippet,id&order=date&maxResults=20", function(error, res, body) {

            if (!error && res.statusCode == 200) {
                //  console.log("-->"+body);
                var response = JSON.parse(body);
                result = "{ \"videos\":[";
                for (var i = 0; i < response.items.length; i++) {
                    var link = "www.youtube.com/watch?v=" + response.items[i].id.videoId;
                    var title = response.items[i].snippet.title;
                    var description = response.items[i].snippet.description;
                    var preview = "";
                    if (response.items[i].snippet.thumbnails == null || response.items[i].snippet.thumbnails == undefined)
                        continue;


                    preview = response.items[i].snippet.thumbnails.default.url;
                    result = result.concat("{");
                    result = result.concat("\"preview\":\"").concat(preview).concat("\",");
                    result = result.concat("\"link\":\"").concat(link).concat("\",");
                    result = result.concat("\"title\":\"").concat(title.replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\",");
                    result = result.concat("\"description\":\"").concat(description.replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\"");
                    result = result.concat("}");

                    if (i <= response.items.length - 2)
                        result = result.concat(",");

                }
                result = result.concat("]}");
                console.log(result);
                callback(second);

            } else
                console.log(error);
        });
    }
    first(second);


});

app.get("/readProfile/:tid/:mid/:iid", function(req, res) {
    var text = new Array();
    var lang = new Array();
    var time = new Array();
    var blogs = new Array();
    var blogstime = new Array();
    var posts = new Array();
    var url = new Array();
    var modified_tweets = new Array();
    var dup = new Array();
    var names = new Array();
    var scores = new Array();
    var tone_size = new Array();
    var count = 0;
    var count1 = 0;
    var count2 = 0;
    var ts = 0;
    var newtweets = new Array();
    var map = {};
    var firstt = {};
    var order = new Array();
    var ordercount = 0;
    var str = "";
    var parentquality = new Array();
    var childrenquality = new Array();
    var sizequality = new Array();
    var mapquality = {};
    var parentpercentile = new Array();
    var childrenpercentile = new Array();
    var qualitycount = 0;
    var strtweet = "";
    var nlumap = {};
    var vrmap = {};
    var key_text = new Array();
    var key_label = new Array();
    var key_emotion = new Array();
    var entities_text = new Array();
    var entities_label = new Array();
    var entities_emotion = new Array();
    var entities_type = new Array();
    var image_emotion = new Array();
    var image_count = 0;
    var result = "";
    var id = "";
    var vr = new Array();
    var vrindex = 0;
    var z = 0;
    var likes = new Array();

    function eighth() {
        result = result.concat("{");
        result = result.concat("\"twitterid\":\"").concat(req.params.tid).concat("\",");
        result = result.concat("\"mediumid\":\"").concat(req.params.mid).concat("\",");
        result = result.concat("\"instagramid\":\"").concat(req.params.iid).concat("\",");

        //personality insights
        result = result.concat("\"personality_insights\":[");

        var ttt = 0;

        for (var j = 0; j < parentquality.length; j++) {
            result = result.concat("{");
            result = result.concat("\"quality\":\"").concat(parentquality[j]).concat("\",");
            result = result.concat("\"percentile\":\"").concat(parentpercentile[j]).concat("\",");

            result = result.concat("\"children\":[");
            for (var k = 0; k < sizequality[j]; k++) {
                result = result.concat("{");

                result = result.concat("\"quality\":\"").concat(childrenquality[ttt]).concat("\",");
                result = result.concat("\"percentile\":\"").concat(childrenpercentile[ttt++]).concat("\"");

                result = result.concat("}");

                if (k <= sizequality[j] - 2)
                    result = result.concat(",");
            }
            result = result.concat("]");
            result = result.concat("}");

            if (j <= parentquality.length - 2)
                result = result.concat(",");

        }
        result = result.concat("],");



        //NLU insights
        result = result.concat("\"NLU_keywords\":[");


        for (var j = 0; j < key_text.length; j++) {
            result = result.concat("{");

            result = result.concat("\"text\":\"").concat(key_text[j]).concat("\",");
            result = result.concat("\"label\":\"").concat(key_label[j]).concat("\",");
            result = result.concat("\"emotion\":\"").concat(key_emotion[j]).concat("\"");

            result = result.concat("}");

            if (j <= key_text.length - 2)
                result = result.concat(",");

        }
        result = result.concat("],");

        result = result.concat("\"NLU_entities\":[");
        for (var j = 0; j < entities_text.length; j++) {
            result = result.concat("{");

            result = result.concat("\"text\":\"").concat(entities_text[j]).concat("\",");
            result = result.concat("\"label\":\"").concat(entities_label[j]).concat("\",");
            result = result.concat("\"emotion\":\"").concat(entities_emotion[j]).concat("\",");
            result = result.concat("\"type\":\"").concat(entities_type[j]).concat("\"");

            result = result.concat("}");

            if (j <= entities_text.length - 2)
                result = result.concat(",");

        }
        result = result.concat("],");



        //tweets
        var temp_tt = "";
        for (var i = 0; i < (newtweets.length - 1); i++) {
            for (var j = 0; j < (newtweets.length - i - 1); j++) {

                if (order[j] > order[j + 1]) {
                    temp_tt = order[j];
                    order[j] = order[j + 1];
                    order[j + 1] = temp_tt;
                    temp_tt = names[j];
                    names[j] = names[j + 1];
                    names[j + 1] = temp_tt;
                    temp_tt = scores[j];
                    scores[j] = scores[j + 1];
                    scores[j + 1] = temp_tt;
                    temp_tt = tone_size[j];
                    tone_size[j] = tone_size[j + 1];
                    tone_size[j + 1] = temp_tt;

                }

            }


        }

        console.log(order + "\n");
        console.log(tone_size);

        var tttt = 0;
        result = result.concat("\"tweets\":[");
        for (var j = 0; j < newtweets.length; j++) {
            result = result.concat("{");
            result = result.concat("\"text\":\"").concat(newtweets[j].replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\",")
            result = result.concat("\"lang\":\"").concat(lang[j]).concat("\",");
            result = result.concat("\"time\":\"").concat(time[j]).concat("\",");

            //insert tone analyser details for each tweet here
            result = result.concat("\"tone_analyser\":[");

            for (var k = 0; k < tone_size[j]; k++) {
                result = result.concat("{");

                result = result.concat("\"name\":\"").concat(names[tttt]).concat("\",");
                result = result.concat("\"score\":\"").concat(scores[tttt++]).concat("\"");

                result = result.concat("}");

                if (k <= tone_size[j] - 2)
                    result = result.concat(",");
            }
            result = result.concat("]");

            result = result.concat("}");

            if (j <= newtweets.length - 2)
                result = result.concat(",");
        }
        result = result.concat("],");



        //blogs
        result = result.concat("\"blogs\":[");
        for (var j = 0; j < blogs.length; j++) {
            result = result.concat("{");
            result = result.concat("\"text\":\"").concat(blogs[j].replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\",");
            result = result.concat("\"time\":\"").concat(blogstime[j]).concat("\"");

            result = result.concat("}");

            if (j <= blogs.length - 2)
                result = result.concat(",");
        }
        result = result.concat("],");


        //posts
        result = result.concat("\"posts\":[");
        for (var j = 0; j < posts.length; j++) {
            result = result.concat("{");
            result = result.concat("\"text\":\"").concat(posts[j].replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\",");
            result = result.concat("\"url\":\"").concat(url[j]).concat("\",");
            result = result.concat("\"likes\":").concat(likes[j]).concat(",");
            result = result.concat("\"emotion\":\"").concat(vr[j]).concat("\"");

            result = result.concat("}");

            if (j <= posts.length - 2)
                result = result.concat(",");
        }
        result = result.concat("]}");

        //console.log(result.substr(45180,45200));
        //console.log(result.substr(46720,46750));
        request.delete('https://api.mlab.com/api/1/databases/ibm/collections/aggregate/' + id + '?apiKey=WOHHCPMZkpDGw3EfKOIOYCZ7eA25aiLf', function(error, response, body) {
            if (!error && response.statusCode == 200) {

                console.log("deleted...");
                result = JSON.parse(result);
                request.post('https://api.mlab.com/api/1/databases/ibm/collections/aggregate?apiKey=WOHHCPMZkpDGw3EfKOIOYCZ7eA25aiLf', {
                        json: result
                    },
                    function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("----->" + body);
                        } else
                            console.log("-----XXXXX>" + error);
                    }
                );


                //console.log(image_emotion);   
                //console.log("URL Length:" + url.length);  

                res.status(200).send(result);
            }
        });
    }

    function seventh(callback) {
        var local = new Array();
        for (var i = 0; i < url.length; i++)
            local[i] = url[i].concat("99999").concat(vr[i]).concat("999999").concat(i + 1);

        async.each(local, function(apiRequest, cb) {
            apicall(apiRequest, cb);

        }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();

        });

        function apicall(item, cb) {

                var u = item.substr(0, item.indexOf("99999"));
                var h = item.substr(item.indexOf("99999") + 5, item.indexOf("999999"));
                var j = item.substr(item.indexOf("999999") + 6);

                var visualRecognition = new VisualRecognitionV3({
                    version: '2018-03-19',
                    "url": "https://gateway.watsonplatform.net/visual-recognition/api",
                    iam_apikey: '11AdaPCD7f9PSt-ZgE0hlSr_57YNReDaUh16QADykjsd'
                });


                h = h.substr(0, 6);
                console.log("########### To call Watson ? :" + h + "\n");
                var classifier_ids = new Array();
                if (h == "Watson") {

                    console.log("************* Calling Watson API " + j + "\n\n");
                    classifier_ids = ["emotion_1247881308"];
                    var images_file = fs.createReadStream("public/assets/images/hello" + j + ".png");

                    var params = {
                        images_file: images_file,
                        //url: item,
                        classifier_ids: classifier_ids
                    };

                    visualRecognition.classify(params, function(err, response) {
                        if (err)
                            console.log(err);
                        else {
                            console.log("Watson : ----------->" + JSON.stringify(response) + "");
                            console.log("\n" + j + "\n");
                            var t = "";
                            var s = 0;

                            console.log("----------->" + JSON.stringify(response.images[0]) + "\n\n");
                            t = response.images[0].classifiers[0].classes[0].class;
                            s = response.images[0].classifiers[0].classes[0].score;

                            for (var i = 0; i < response.images[0].classifiers[0].classes.length; i++) {
                                if (s < response.images[0].classifiers[0].classes[i].score) {
                                    s = response.images[0].classifiers[0].classes[i].score;
                                    t = response.images[0].classifiers[0].classes[i].class;
                                }
                            }

                            if (t == "black")
                                t = "sad";
                            if (t == "color")
                                t = "joy";
                            console.log("********* " + t + "\n\n");
                            vr[j - 1] = t;
                            cb();
                        }
                    });
                } else {
                    cb();
                }
            } // closing apicall
        function process_arrays() {
            callback(eighth);
        }
    }

    function sixth(callback) {

        var temp = new Array();

        for (var i = 0; i < url.length; i++)
            temp[i] = url[i].concat("99999").concat(i + 1);

        async.each(temp, function(apiRequest, cb) {
            apicall(apiRequest, cb);

        }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();

        });

        function apicall(item, cb) {
            if (z < temp.length) {
                var u = item.substr(0, item.indexOf("99999"));
                var j = item.substr(item.indexOf("99999") + 5);
                z++;

                var input = {
                    "image": u,
                    "numResults": 7
                };

                Algorithmia.client("siml1Jh+cMnbP2VyVpnOPDa8dvL1")
                    .algo("deeplearning/EmotionRecognitionCNNMBP/1.0.1")
                    .pipe(input)
                    .then(function(response) {
                        console.log("Algorithmia: ***************>" + JSON.stringify(response.result));
                        console.log("\n" + j + "\n");

                        if (response.result.results.length == 0)
                            t = "Watson";
                        else {
                            t = response.result.results[0].emotions[0].label;
                            if (t == "Happy")
                                t = "joy";
                            if (t == "Sad")
                                t = "sad";
                            t = t.toLowerCase();
                            console.log("********* " + t + "\n\n");
                        }
                        vr[j - 1] = t;
                        cb();
                    });
            } else
                cb();
        }

        function process_arrays() {
            console.log("=====================>" + vr + "\n\n");
            callback(seventh);
        }
    }

    function sixth_pre(callback) {
        var temp = new Array();

        for (var i = 0; i < url.length; i++)
            temp[i] = url[i].concat("99999").concat(i + 1);

        async.each(temp, function(apiRequest, cb) {
            apicall(apiRequest, cb);

        }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();

        });

        function apicall(item, cb) {
            var u = item.substr(0, item.indexOf("99999"));
            var j = item.substr(item.indexOf("99999") + 5);

            const options = {
                url: u,
                dest: 'public/assets/images/hello' + j + '.png' // Save to /path/to/dest/image.png
            }

            //var filename = 'hello.png';
            download.image(options)
                .then(({
                    filename, image
                }) => {
                    console.log('File saved to', filename);
                    cb();
                })
                .catch((err) => {
                    console.error(err);
                    cb();
                })
        }

        function process_arrays() {
            callback(sixth);
        }
    }

    function fifth(callback) {

        if (nlumap["executed"] == 0) {
            nlumap["executed"] = 1;
            for (var k = 0; k < newtweets.length; k++)
                strtweet += newtweets[k] + " ";

            var natural_language_understanding = new NaturalLanguageUnderstandingV1({
                "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
                "username": "b3bb4144-d39b-4f7c-b381-6be4f51becb3",
                "password": "FVzOPvAUPDg0",
                'version': '2018-03-16'
            });

            var parameters = {
                'text': strtweet,
                'features': {
                    'entities': {
                        'emotion': true,
                        'sentiment': true,
                        'limit': 2
                    },
                    'keywords': {
                        'emotion': true,
                        'sentiment': true,
                        'limit': 2
                    }
                }
            }

            natural_language_understanding.analyze(parameters, function(err, response) {

                for (var j = 0; j < response.keywords.length; j++) {
                    key_text[j] = response.keywords[j].text;
                    key_label[j] = response.keywords[j].sentiment.label;

                    var m = response.keywords[j].emotion.sadness;
                    var feeling = "sadness";

                    if (m < response.keywords[j].emotion.joy) {
                        m = response.keywords[j].emotion.joy;
                        feeling = "joy";
                    }

                    if (m < response.keywords[j].emotion.fear) {
                        m = response.keywords[j].emotion.fear;
                        feeling = "fear";
                    }

                    if (m < response.keywords[j].emotion.disgust) {
                        m = response.keywords[j].emotion.disgust;
                        feeling = "disgust";
                    }

                    if (m < response.keywords[j].emotion.anger) {
                        m = response.keywords[j].emotion.anger;
                        feeling = "anger";
                    }

                    key_emotion[j] = feeling;

                }

                for (var j = 0; j < response.entities.length; j++) {
                    entities_text[j] = response.entities[j].text;
                    entities_label[j] = response.entities[j].sentiment.label;
                    entities_type[j] = response.entities[j].type;

                    if (response.entities[j].sentiment.label == "neutral")
                        entities_emotion[j] = "neutral";
                    else {
                        var m = response.entities[j].emotion.sadness;
                        var feeling = "sadness";

                        if (m < response.keywords[j].emotion.joy) {
                            m = response.keywords[j].emotion.joy;
                            feeling = "joy";
                        }

                        if (m < response.keywords[j].emotion.fear) {
                            m = response.keywords[j].emotion.fear;
                            feeling = "fear";
                        }

                        if (m < response.keywords[j].emotion.disgust) {
                            m = response.keywords[j].emotion.disgust;
                            feeling = "disgust";
                        }

                        if (m < response.keywords[j].emotion.anger) {
                            m = response.keywords[j].emotion.anger;
                            feeling = "anger";
                        }

                        entities_emotion[j] = feeling;
                    }
                }
                callback(sixth_pre);
            });
        } else
            callback(sixth_pre);
    }

    function fourth(callback) {
        if (mapquality["executed"] == 0) {
            mapquality["executed"] = 1;
            for (var k = 0; k < newtweets.length; k++)
                str += newtweets[k] + " ";
            console.log("Length: " + blogs.length + "\n");
            for (var k = 0; k < blogs.length; k++)
                str += blogs[k] + " ";
            console.log("Length: " + posts.length + "\n");
            for (var k = 0; k < posts.length; k++)
                str += posts[k] + " ";

            var personalityInsights = new PersonalityInsightsV3({
                'version_date': '2017-10-13',
                "url": "https://gateway.watsonplatform.net/personality-insights/api",
                "username": "ac008f35-aa14-406d-80da-c1fdf80e2a4b",
                "password": "BvBJ2TX18n2V"
            });

            personalityInsights.profile({
                'text': str
            }, function(error, profile) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(JSON.stringify(profile, null, 2));
                    var o = profile;
                    console.log("personality length:" + o.personality.length + "\n");

                    for (var j = 0; j < o.personality.length; j++) {
                        parentquality[j] = o.personality[j].name;
                        sizequality[j] = o.personality[j].children.length;
                        parentpercentile[j] = o.personality[j].percentile;

                        for (var k = 0; k < o.personality[j].children.length; k++) {
                            childrenquality[qualitycount] = o.personality[j].children[k].name;
                            childrenpercentile[qualitycount++] = o.personality[j].children[k].percentile;
                        }
                    }
                }
                callback(fifth);
            });
        } else
            callback(fifth);
    }

    function third(callback) {
        //res.send(modified_tweets);
        console.log("Length: " + modified_tweets.length + "\n");
        console.log("-----------------------------------------" + "\n");
        for (var m = 0; m < modified_tweets.length; m++)
            console.log(modified_tweets[m] + "\n");
        console.log("-----------------------------------------" + "\n");

        var len = modified_tweets.length;
        for (var x = 0; x < len / 2; x++) {
            newtweets[x] = modified_tweets[x];
            map[newtweets[x]] = x;
        }

        console.log("New Length: " + newtweets.length + "\n");
        async.each(newtweets, function(apiRequest, cb) {
            apicall(apiRequest, cb);

        }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();

        });

        function apicall(item, cb) {
            if (firstt[item] == 0) {
                firstt[item] = 1;
                var toneAnalyzer = new ToneAnalyzerV3({
                    version_date: "2017-09-21",
                    url: "https://gateway.watsonplatform.net/tone-analyzer/api",
                    username: "39a782b1-8815-4d0e-92c6-7a255c93b367",
                    password: "uVskOH5GxI4C"
                });

                var toneParams = {
                    tone_input: {
                        text: item
                    },
                    content_type: "application/json"
                };

                toneAnalyzer.tone(toneParams, function(error, toneAnalysis) {
                    order[ordercount++] = map[item];
                    tone_size[ts++] = toneAnalysis.document_tone.tones.length;

                    console.log("*****************************************" + "\n");
                    console.log(item + "\n");
                    for (var k = 0; k < tone_size[ts - 1]; k++) {
                        names[count1++] = toneAnalysis.document_tone.tones[k].tone_name;
                        scores[count2++] = toneAnalysis.document_tone.tones[k].score;
                        console.log(toneAnalysis.document_tone.tones[k].tone_name + "\n" + toneAnalysis.document_tone.tones[k].score + "\n");
                    }

                    if (toneAnalysis.document_tone.tones.length == 0) {
                        tone_size[ts - 1] = 1;
                        names[count1++] = "Neutral";
                        scores[count2++] = "0.1";
                    }


                    console.log("*****************************************" + "\n");
                    cb();
                });
            } else
                cb();
        }

        function process_arrays() {
            callback(fourth);
        }

    }

    function second(callback) {
        console.log("I am in second" + dup);

        async.each(dup, function(apiRequest, cb) {
            apicall(apiRequest, cb);

        }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();

        });

        function apicall(item, cb) {
            var t = item.substr(0, item.indexOf("99999"));
            var lang = item.substr(item.indexOf("99999") + 5);
            console.log(text + " " + lang + "\n");

            if (lang != "English" && lang != "Undetermined") {
                var languageTranslator = new LanguageTranslatorV3({
                    version: "2018-05-01",
                    url: "https://gateway.watsonplatform.net/language-translator/api",
                    username: "b34e19b7-1885-4c80-abdc-4725437da799",
                    password: "Gdq5bnQWtO36"
                });

                var parameters = {
                    text: t,
                    source: lang,
                    target: "English"
                };

                languageTranslator.translate(parameters, function(error, response) {
                    modified_tweets[count++] = response.translations[0].translation;
                    cb();
                });

            } else {
                modified_tweets[count++] = t;
                cb();
            }



        }

        function process_arrays() {
            for (var x = 0; x < modified_tweets.length / 2; x++) {
                firstt[modified_tweets[x]] = 0;
            }
            callback(third);
        }
    }

    function first(callback) {
        mapquality["executed"] = 0;
        nlumap["executed"] = 0;
        vrmap["executed"] = 0;
        request("https://api.mlab.com/api/1/databases/ibm/collections/aggregate?apiKey=WOHHCPMZkpDGw3EfKOIOYCZ7eA25aiLf", function(error, response, body) {

            if (!error && response.statusCode == 200) {
                var o = JSON.parse(body);
                for (var i = 0; i < o.length; i++) {
                    var temp = o[i];
                    if (temp.twitterid == req.params.tid && temp.mediumid == req.params.mid && temp.instagramid == req.params.iid) {
                        for (var j = 0; j < temp.tweets.length; j++) {
                            text[j] = temp.tweets[j].text;
                            lang[j] = temp.tweets[j].lang;
                            time[j] = temp.tweets[j].time;
                            dup[j] = temp.tweets[j].text + "99999" + temp.tweets[j].lang;
                        }
                        for (var j = 0; j < temp.blogs.length; j++) {
                            blogs[j] = temp.blogs[j].text;
                            blogstime[j] = temp.blogs[j].time;
                        }
                        for (var j = 0; j < temp.posts.length; j++) {
                            posts[j] = temp.posts[j].text;
                            url[j] = temp.posts[j].url;
                            likes[j] = temp.posts[j].likes;
                        }
                        console.log(text);
                        id = temp._id.$oid;
                        break;

                    }
                }
                console.log("***************************** ------------------------------Calling Second &&&&&&&&&&&&&&&&&&&&&&&&&&&");
                callback(second);
            } else
                console.log(error);
        });
    }
    first(second);
});



module.exports = app;
