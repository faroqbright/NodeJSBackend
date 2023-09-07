var express = require("express");
var router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(process.env.DATABASE_URI);
// Generate Access Token

const validateAccessToken = async (data) => {
  try {
    const token = await client
      .db(process.env.DATA_BASE)
      .collection("secrets")
      .findOne({
        secret: data,
      });
    if (token === null) {
      return false;
    } else {
      return true;
    }
    // return the token
  } catch (e) {
    console.log(e);
  }
};

module.exports = validateAccessToken;
