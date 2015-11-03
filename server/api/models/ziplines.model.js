'use strict';

//https://docs.mongodb.org/manual/reference/connection-string/
//https://www.mongodb.com/blog/post/building-your-first-application-mongodb-creating-rest-api-using-mean-stack-part-1
//http://stackoverflow.com/questions/21715590/sort-an-nested-array-in-mongoose
//https://docs.mongodb.org/getting-started/node/query/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ziplineSchema = new Schema({
  _owner: {type:mongoose.Schema.Types.ObjectId, ref:'Ziplines'},
  title: String,
  url: String,
  created: {type: Date},
  modified:{type: Date},
  //tags: {type:[], get: getTags, set: setTags},
  tags: [],
  views: Number,
  comments: Number,
  hearts: Number,
  info: String,
  active: Boolean
});

var ZiplinesSchema = new Schema({
  owner: {type: String, required: true},
  ziplines: [ziplineSchema]
});

module.exports = mongoose.model('Ziplines', ZiplinesSchema);