'use strict';

//https://docs.mongodb.org/manual/reference/connection-string/
//https://www.mongodb.com/blog/post/building-your-first-application-mongodb-creating-rest-api-using-mean-stack-part-1
//http://stackoverflow.com/questions/21715590/sort-an-nested-array-in-mongoose
//https://docs.mongodb.org/getting-started/node/query/
//http://mongoosejs.com/docs/2.7.x/docs/methods-statics.html
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagsSchema = new Schema({
  tag: String  
});

TagsSchema.statics.findByName = function findByName(value, cb){
  //return this.model('Tags').find({tag:value}, cb);
  return this.find({tag:value}, cb);
}

module.exports.Tags = mongoose.model('Tags', TagsSchema);


////sketch for a searching algorithm
//TagsSchema.statics.findSimilar = function findSimilar(tg, cb){
//  return this.where('tag', new RegExp(tg, 'ig')).exec(cb);
//}
//var tag = '^abc';
//var re = new RegExp(tag, 'gi');
//re.test(tag, 'abcdedfgte') //true

var ZiplinesSchema = new Schema({
  owner:String,
  uri: {type:String, required: true, unique:true},
  title: String,
  created: {type: Date},
  modified:{type: Date},
  //tags: {type:[], get: getTags, set: setTags},
  //tags: [{type:mongoose.Schema.Types.ObjectId, ref: 'Tags'}],
  tags:[],
  views: Number,
  comments: Number,
  hearts: Number,
  info: String,
  active: Boolean
});

ZiplinesSchema.statics.findByUri = function findByUri(value, cb){
  //return this.model('Ziplines').find({uri:value}, cb);
  return this.find({uri:value}, cb);
}

module.exports.Ziplines = mongoose.model('Ziplines', ZiplinesSchema);





//var ziplineSchema = new Schema({
//  _owner: {type:mongoose.Schema.Types.ObjectId, ref:'Ziplines'},
//  title: String,
//  url: String,
//  created: {type: Date},
//  modified:{type: Date},
//  //tags: {type:[], get: getTags, set: setTags},
//  tags: [],
//  views: Number,
//  comments: Number,
//  hearts: Number,
//  info: String,
//  active: Boolean
//});
//
//var ZiplinesSchema = new Schema({
//  owner: {type: String, required: true},
//  ziplines: [ziplineSchema]
//});
//
//module.exports = mongoose.model('Ziplines', ZiplinesSchema);