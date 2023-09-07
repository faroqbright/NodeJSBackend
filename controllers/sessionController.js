const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(process.env.DATABASE_URI);
// const bcrypt = require("bcrypt");

const validateAccessToken = require("../utils/helpers/validateAuth");

module.exports = {
  sessionList: async function (req, res, next) {
    try {
      let validateToken = await validateAccessToken(
        req.header("x-access-token")
      );
      if (validateToken) {
        const sessions = await client
          .db(process.env.DATA_BASE)
          .collection("sessions")
          .find({ status: req.query.type })
          .toArray();
        if (sessions === null || sessions.length === 0) {
          res.json({
            message: "Session not found!",
            result: true,
          });
        } else {
          res.json({ sessions, result: true });
        }
      } else {
        if (
          req.header("x-access-token") === undefined ||
          req.header("x-access-token").length === 0
        ) {
          res.status(403).json({
            message: "A token is required for authentication.",
            result: false,
          });
        } else {
          res.status(401).json({
            message:
              "Access denied, you are not allowed to access the API with this token.",
            result: false,
          });
        }
      }
    } catch (e) {
      console.log("ERROR is", e);
      res.status(500).json({
        message:
          "There was a problem in retriving the users list, please try again.",
        result: false,
      });
    }
  },
};
