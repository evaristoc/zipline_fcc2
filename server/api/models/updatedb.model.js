'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UpdatedbSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Updatedb', UpdatedbSchema);