'use strict';

var _ = require('lodash');
var $ = require('cheerio');
var request = require('request');
var ENV_UA = require('../../config/local.env').ENV_UA;
var Ziplines = require('../models/ziplines.model').Ziplines;
var Tags = require('../models/ziplines.model').Tags;

//http://stackoverflow.com/questions/17121846/node-js-how-to-send-headers-with-form-data-using-request-module
//http://stackoverflow.com/questions/20967006/how-to-create-a-sleep-delay-in-nodejs-that-is-blocking
//http://www.smashingmagazine.com/2015/04/web-scraping-with-nodejs/
//https://scotch.io/tutorials/scraping-the-web-with-node-js
//http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
//http://stackoverflow.com/questions/28261780/nodejs-async-callback-not-succeeding
//implement a scraper node async
exports.index = function(req, res){
    console.log('inside index...');
    //var pagenum = 1;
    var allpendata = [];
    var ii = [];
    var limit =30;
    for (var i = 0; i < limit; i++){ii.push(i+1);};
    ii.forEach(function(pagenum) {
        setTimeout(function(){
            var options = {
                headers: {'User-Agent': ENV_UA},
                uri:"http://codepen.io/search/pens/?limit=all&page="+String(pagenum)+"&q=freecodecamp",
                method: 'GET'
            };
            request(options, (function(pagenum){
                console.log(pagenum);
                return function(error, response, html){
                    if (error) {
                        console.log("error loading search page ",pagenum);
                        return;
                    }
                    if (response.statusCode == 500){
                        console.log("500 error");
                        return 500;
                    };
                    if (!error){
                        //console.log(html);
                        var parsedHTMLfrontpage = $.load(html);
                        var links = [];
                        parsedHTMLfrontpage("a.single-stat.views").map(function(i, link){
                            var parsedlink = $(link);
                            var href = parsedlink.attr('href');
                            links.push(href);
                        });
                        console.log(links);
                        var indstats = [];
                        links.forEach(function(link){
                            link = link.replace('full', 'details');
                            var options_links ={
                                headers: {'User-Agent': ENV_UA},
                                uri: link,
                                method: 'GET'
                            };
                            request(options_links, function(error, res_ind, html_ind){
                                if (error) {
                                    console.log('error downloading this link ', options_link);
                                }
                                if (!error) {
                                    var parsedHTMLindpage = $.load(html_ind);
                                    var owner = parsedHTMLindpage("a.pen-owner-link").attr('href');
                                    var title = parsedHTMLindpage("#details-title").text();
                                    var dates = []
                                    parsedHTMLindpage("time").map(function(i, date){
                                        var parseddate = $(date);
                                        dates.push(parseddate.attr('datetime'))
                                    });
                                    var tags = [];
                                    parsedHTMLindpage("ol.tag-grid li").map(function(i, tag){
                                        var parsedtag = $(tag);
                                        var words = /\w+/g.exec(parsedtag.text())[0];
                                        tags.push(words);                                
                                    })
                                    var stats = [];
                                    parsedHTMLindpage("#pen-stat-numbers li").map(function(i, stats_html){
                                        var parsedstats_html = $(stats_html);
                                        stats.push(parsedstats_html.children("strong").text())  
                                    })
                                    //console.log(owner, title, dates, tags, stats);
                                    allpendata.push({owner:owner, title:title, dates:dates, tags:tags, stats:stats});
                                    
                        //////////// getting rid of the tag collection            
                                    //var tagsid = [];
                                    //tags.forEach(function(tg){
                                    //    Tags.findByName(tg, function(err, iftag){
                                    //        if (err) throw err;
                                    //        console.log('inside the tag creation ', tg, iftag);
                                    //        console.log(iftag.length);
                                    //        //console.log('iftag is empty list with object (document!) type');
                                    //        // OJO: create throws a DOCUMENT; my method findByName throws an OBJECT as LIST of DOCUMENTS!!
                                    //        if (iftag.length == 0) {
                                    //            Tags.create({tag:tg}, function(err, ntg){
                                    //                console.log('creating tag ', ntg);
                                    //                tagsid.push(ntg._id);
                                    //            })
                                    //        }else{
                                    //            console.log('using existing tag ', iftag);
                                    //            tagsid.push(iftag[0]._id);
                                    //        }
                                    //    })
                                    //});
                                    
                                    var zip = {
                                        owner:link.split("/")[3],
                                        title:title,
                                        uri:link,
                                        //tags: tagsid, //<--- getting rid of the tag collection...
                                        tags: tags,
                                        created:new Date(dates[0]),
                                        modified:new Date(dates[1]),
                                        views:Number(stats[0]),
                                        comments:Number(stats[1]),
                                        hearts:Number(stats[2])
                                      };
                                    
                                    //console.log(zip);
                                    
                                    Ziplines.findByUri(zip.uri, function(err, pen){
                                        if (err) throw err;
                                        if (pen.length == 0) {
                                            Ziplines.create(zip, function(err, nwpen){
                                                if (err) {
                                                    console.log("error trying to create pen ", nwpen);
                                                }
                                            });
                                        }else{
                                            var zip_up = {
                                                title:title,
                                                //tags: tagsid, //<--- getting rid of the tag collection...
                                                tags: tags,
                                                modified:new Date(dates[1]),
                                                views:Number(stats[0]),
                                                comments:Number(stats[1]),
                                                hearts:Number(stats[2])
                                              };
                                            Ziplines.update({uri:zip.uri}, zip_up, function(err, uppen){
                                                if (err) {
                                                    console.log("error trying to update pen ", uppen, " page number ", pagenum);
                                                }
                                            })
                                        }
                                    });
                                 }
                            });
                        });
                    };  
                }
            })(pagenum));
            //pagenum++;
        },10000); //<--- timeout...
    });
    return res.status(201).json(allpendata);
}



//// Get list of zipliness
//exports.index = function(req, res) {
//  Ziplines.find(function (err, zipliness) {
//    if(err) { return handleError(res, err); }
//    return res.status(200).json(zipliness);
//  });
//};

// Get a single ziplines
exports.show = function(req, res) {
  Ziplines.findById(req.params.id, function (err, ziplines) {
    if(err) { return handleError(res, err); }
    if(!ziplines) { return res.status(404).send('Not Found'); }
    return res.json(ziplines);
  });
};


// Creates a new ziplines in the DB.
exports.create = function(req, res) {
  Ziplines.create(req.body, function(err, ziplines) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(ziplines);
  });
};

// Updates an existing ziplines in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Ziplines.findById(req.params.id, function (err, ziplines) {
    if (err) { return handleError(res, err); }
    if(!ziplines) { return res.status(404).send('Not Found'); }
    var updated = _.merge(ziplines, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(ziplines);
    });
  });
};

// Deletes a ziplines from the DB.
exports.destroy = function(req, res) {
  Ziplines.findById(req.params.id, function (err, ziplines) {
    if(err) { return handleError(res, err); }
    if(!ziplines) { return res.status(404).send('Not Found'); }
    ziplines.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};


//'use strict';
//
//var _ = require('lodash');
//var $ = require('cheerio');
//var request = require('request');
//var ENV_UA = require('../../config/local.env').ENV_UA;
//var Ziplines = require('../models/ziplines.model');
//
////http://stackoverflow.com/questions/17121846/node-js-how-to-send-headers-with-form-data-using-request-module
//
//
//exports.index = function(req, res){
//    console.log('inside index...');
//    var pagenum = 1;
//    var allpendata = [];
//    while (pagenum < 2) {
//        var options = {
//            headers: {'User-Agent': ENV_UA},
//            uri:"http://codepen.io/search/pens/?limit=all&page="+String(pagenum)+"&q=freecodecamp",
//            method: 'GET'
//        }
//        
//        request(options, function(error, response, html){
//            if (!error){
//                //console.log(html);
//                var parsedHTMLfrontpage = $.load(html);
//                var links = []
//                parsedHTMLfrontpage("a.single-stat.views").map(function(i, link){
//                    var parsedlink = $(link);
//                    var href = parsedlink.attr('href');
//                    links.push(href);
//                });
//                console.log(links);
//                var indstats = [];
//                links.forEach(function(link){
//                    //var link = links[0];
//                    var options_links ={
//                        headers: {'User-Agent': ENV_UA},
//                        uri: link,
//                        method: 'GET'
//                    };
//                    request(options_links, function(error, res_ind, html_ind){
//                        if (!error) {
//                            var parsedHTMLindpage = $.load(html_ind);
//                            var owner = parsedHTMLindpage("a.pen-owner-link").attr('href');
//                            var title = parsedHTMLindpage("#details-title").text();
//                            var dates = []
//                            parsedHTMLindpage("time").map(function(i, date){
//                                var parseddate = $(date);
//                                dates.push(parseddate.attr('datetime'))
//                            });
//                            var tags = [];
//                            parsedHTMLindpage("ol.tag-grid li").map(function(i, tag){
//                                var parsedtag = $(tag);
//                                var words = /\w+/g.exec(parsedtag.text())[0];
//                                tags.push(words);                                
//                            })
//                            var stats = [];
//                            parsedHTMLindpage("#pen-stat-numbers li").map(function(i, stats_html){
//                                var parsedstats_html = $(stats_html);
//                                stats.push(parsedstats_html.children("strong").text())  
//                            })
//                            console.log(owner, title, dates, tags, stats);
//                            allpendata.push({owner:owner, title:title, dates:dates, tags:tags, stats:stats});
//                            
//                            var zip = {
//                                owner: owner,
//                                ziplines: {
//                                  title:title,
//                                  url:link,
//                                  created:new Date(dates[0]),
//                                  modified:new Date(dates[1]),
//                                  tags:tags,
//                                  views:Number(stats[0]),
//                                  comments:Number(stats[1]),
//                                  hearts:Number(stats[2])
//                                  }
//                              };
//                            Ziplines.create(zip, function(err, ziplines) {
//                                if(err) { return handleError(res, err); }
//                                ziplines.owner = zip.owner;
//                                ziplines.ziplines.push(zip.ziplines);
//                                console.log(ziplines);
//                                //return res.status(201).json(ziplines);
//                            });
//                        }
//                    });
//                });
//            };  
//        })
//        pagenum++;
//    };
//    return res.status(201).json(allpendata);
//}
//
//
//
////// Get list of zipliness
////exports.index = function(req, res) {
////  Ziplines.find(function (err, zipliness) {
////    if(err) { return handleError(res, err); }
////    return res.status(200).json(zipliness);
////  });
////};
//
//// Get a single ziplines
//exports.show = function(req, res) {
//  Ziplines.findById(req.params.id, function (err, ziplines) {
//    if(err) { return handleError(res, err); }
//    if(!ziplines) { return res.status(404).send('Not Found'); }
//    return res.json(ziplines);
//  });
//};
//
//
//// Creates a new ziplines in the DB.
//exports.create = function(req, res) {
//  Ziplines.create(req.body, function(err, ziplines) {
//    if(err) { return handleError(res, err); }
//    return res.status(201).json(ziplines);
//  });
//};
//
//// Updates an existing ziplines in the DB.
//exports.update = function(req, res) {
//  if(req.body._id) { delete req.body._id; }
//  Ziplines.findById(req.params.id, function (err, ziplines) {
//    if (err) { return handleError(res, err); }
//    if(!ziplines) { return res.status(404).send('Not Found'); }
//    var updated = _.merge(ziplines, req.body);
//    updated.save(function (err) {
//      if (err) { return handleError(res, err); }
//      return res.status(200).json(ziplines);
//    });
//  });
//};
//
//// Deletes a ziplines from the DB.
//exports.destroy = function(req, res) {
//  Ziplines.findById(req.params.id, function (err, ziplines) {
//    if(err) { return handleError(res, err); }
//    if(!ziplines) { return res.status(404).send('Not Found'); }
//    ziplines.remove(function(err) {
//      if(err) { return handleError(res, err); }
//      return res.status(204).send('No Content');
//    });
//  });
//};