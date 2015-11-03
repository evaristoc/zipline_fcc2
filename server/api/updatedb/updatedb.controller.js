'use strict';

var _ = require('lodash');
var $ = require('cheerio');
var request = require('request');
var ENV_UA = require('../../config/local.env').ENV_UA;
var Ziplines = require('../models/ziplines.model');

//http://stackoverflow.com/questions/17121846/node-js-how-to-send-headers-with-form-data-using-request-module


exports.index = function(req, res){
    console.log('inside index...');
    var pagenum = 1;
    var allpendata = [];
    while (pagenum < 2) {
        var options = {
            headers: {'User-Agent': ENV_UA},
            uri:"http://codepen.io/search/pens/?limit=all&page="+String(pagenum)+"&q=freecodecamp",
            method: 'GET'
        }
        
        request(options, function(error, response, html){
            if (!error){
                //console.log(html);
                var parsedHTMLfrontpage = $.load(html);
                var links = []
                parsedHTMLfrontpage("a.single-stat.views").map(function(i, link){
                    var parsedlink = $(link);
                    var href = parsedlink.attr('href');
                    links.push(href);
                });
                console.log(links);
                var indstats = [];
                links.forEach(function(link){
                    //var link = links[0];
                    var options_links ={
                        headers: {'User-Agent': ENV_UA},
                        uri: link,
                        method: 'GET'
                    };
                    request(options_links, function(error, res_ind, html_ind){
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
                            console.log(owner, title, dates, tags, stats);
                            allpendata.push({owner:owner, title:title, dates:dates, tags:tags, stats:stats});
                            
                            var zip = {
                                owner: owner,
                                ziplines: {
                                  title:title,
                                  url:link,
                                  created:new Date(dates[0]),
                                  modified:new Date(dates[1]),
                                  tags:tags,
                                  views:Number(stats[0]),
                                  comments:Number(stats[1]),
                                  hearts:Number(stats[2])
                                  }
                              };
                            Ziplines.create(zip, function(err, ziplines) {
                                if(err) { return handleError(res, err); }
                                ziplines.owner = zip.owner;
                                ziplines.ziplines.push(zip.ziplines);
                                console.log(ziplines);
                                //return res.status(201).json(ziplines);
                            });
                        }
                    });
                });
            };  
        })
        pagenum++;
    };
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