var express = require("express");
var router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(process.env.DATABASE_URI);
// Generate Access Token

const updateAccessToken = async (data) => {
  try {
    const Update = await client
      .db(process.env.DATA_BASE)
      .collection("secrets")
      .updateOne(
        { UID: data.user.UID },
        { $set: { secret: data.accessToken, updatedAt: new Date() } }
      );
    return Update;
    // return the token
  } catch (e) {
    console.log(e);
  }
};

module.exports = updateAccessToken;
