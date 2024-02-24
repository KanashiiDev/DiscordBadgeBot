const { Schema, model } = require("mongoose");

module.exports = model(
  "userdata",
  new Schema({
    USERID: String,
    DISPLAYNAME: String,
    REDIRECT: String,
    CUSTOMBG: String,
    LASTSEEN: String,
    LASTSEENENABLE: String, 
  })
);