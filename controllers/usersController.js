const signin_schema = require("../utils/Schema/User/signin");
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(process.env.DATABASE_URI);
// const bcrypt = require("bcrypt");
const moment = require("moment");
const generateAccessToken = require("../utils/helpers/userAuthentication");
const validateAccessToken = require("../utils/helpers/validateAuth");
const updateAccessToken = require("../utils/helpers/updateToken");
const { ObjectId } = require("mongodb");

module.exports = {
  signIn: async function (req, res, next) {
    try {
      const { error } = signin_schema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errorDetails = error.details.map((err) => {
          return {
            field: err.path[0],
            message: err.message,
          };
        });

        return res.status(400).json({ errors: errorDetails });
      }
      const user = await client
        .db(process.env.DATA_BASE)
        .collection("users")
        .findOne({
          UID: req.body.UID,
          password: req.body.password,
        });
      if (user === null || user.length === 0) {
        res.json({
          message: "Invalid Credentials",
          result: true,
        });
      } else {
        let token = generateAccessToken(user);
        let updataToken = await updateAccessToken({
          user,
          accessToken: token,
        });
        res.json({ user, accessToken: token, result: true });
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
  bookSession: async function (req, res, next) {
    try {
      let validateToken = await validateAccessToken(
        req.header("x-access-token")
      );
      if (validateToken) {
        const Selectedsession = await client
          .db(process.env.DATA_BASE)
          .collection("sessions")
          .findOne({ _id: new ObjectId(req.body.SessionID) });
        if (Selectedsession === null || Selectedsession.length === 0) {
          res.json({
            message: "Session not found!",
            result: true,
          });
        } else if (moment(Selectedsession.date) < moment()) {
          res.json({
            message: "Session is outdated!",
            result: false,
          });
        } else if (Selectedsession.status === "booked") {
          res.json({
            message: "Session is already Booked!",
            result: false,
          });
        } else {
          const sessions = await client
            .db(process.env.DATA_BASE)
            .collection("sessions")
            .updateOne(
              { _id: new ObjectId(req.body.SessionID) },
              {
                $set: {
                  status: "booked",
                  sessionStatus: "pending",
                  BookedBy: req.body.UID,
                  updatedAt: new Date(),
                },
              }
            );

          res.json({
            message: "Your session slot has been booked Successfully!",
            result: true,
          });
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
  bookedSession: async function (req, res, next) {
    try {
      let validateToken = await validateAccessToken(
        req.header("x-access-token")
      );
      if (validateToken) {
        const Bookedsession = await client
          .db(process.env.DATA_BASE)
          .collection("sessions")
          .find({
            status: "booked",
            BookedBy: req.body.UID,
            sessionStatus: "active",
          })
          .toArray();
        if (Bookedsession === null || Bookedsession.length === 0) {
          res.json({
            message: "Sessions not found!",
            result: true,
          });
        } else {
          res.json({
            Bookedsession,
            result: true,
          });
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
  updateSession: async function (req, res, next) {
    try {
      let validateToken = await validateAccessToken(
        req.header("x-access-token")
      );
      if (validateToken) {
        const Selectedsession = await client
          .db(process.env.DATA_BASE)
          .collection("sessions")
          .findOne({ _id: new ObjectId(req.body.SessionID) });
        if (Selectedsession === null || Selectedsession.length === 0) {
          res.json({
            message: "Session not found!",
            result: true,
          });
        } else if (moment(Selectedsession.date) < moment()) {
          res.json({
            message: "Session is outdated!",
            result: false,
          });
        } else if (Selectedsession.status !== "booked") {
          res.json({
            message: "Session is not Booked yet!",
            result: false,
          });
        } else {
          const sessions = await client
            .db(process.env.DATA_BASE)
            .collection("sessions")
            .updateOne(
              { _id: new ObjectId(req.body.SessionID) },
              {
                $set: {
                  sessionStatus: "completed",
                  updatedAt: new Date(),
                },
              }
            );

          res.json({
            message: "Your session slot has been booked Successfully!",
            result: true,
          });
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
