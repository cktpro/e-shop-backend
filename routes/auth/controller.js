const { Customer, Employee } = require("../../models");
const bcrypt = require("bcryptjs");
const {
  generateToken,
  generateRefreshToken,
} = require("../../helper/jwtHelper");
const JWT = require("jsonwebtoken");
const jwtSetting = require("../../constants/jwtSetting");
module.exports = {
  checkLogin: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const employee = await Employee.findOne({ isDeleted: false, email});
      if (!employee) {
        return res.send(400, {
          mesage: "Đăng nhập thất bại",
        });
      }

      const isCorrectPass = await employee.isValidPass(password);

      if (!isCorrectPass) {
        return res.send(400, {
          mesage: "Đăng nhập thất bại",
        });
      }
      const {
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        birthday,
        updatedAt,
      } = employee;
      const token = generateToken({
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        email:employee.email,
        birthday,
        updatedAt,
      });
      const refreshToken = generateRefreshToken(employee._id);
      return res.send({
        code: 200,
        mesage: "Login thành công",
        // payload:employee
        payload: {
          token: token,
          refreshToken: refreshToken,
        },
      });
    } catch (err) {
      console.log("◀◀◀ err ▶▶▶", err);
      res.send(400, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  checkRefreshToken: async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
      JWT.verify(refreshToken, jwtSetting.SECRET, async (err, data) => {
        if (err) {
          return res.status(401).json({
            code: 400,
            mesage: "refreshToken is invalid",
          });
        } else {
          const { id } = data;
          const customer = await Customer.findOne({
            _id: id,
            isDeleted: false,
          })
            .select("-password")
            .lean();
          if (customer) {
            return res.send({
              code: 200,
              mesage: "Thành công",
              payload: customer,
            });
          }
          return res.status(400).json({
            code: 400,
            mesage: "refreshToken is invalid",
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  basicLogin: async (req, res, next) => {
    try {
      const user = await Customer.findById(req.user._id)
        .select("-password")
        .lean();
      const token = generateToken(user);
      // const refreshToken = generateRefreshToken(user._id);

      res.json({
        token,
        // refreshToken,
      });
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getMe: async (req, res, next) => {
    try {
      return res.send({
        code: 200,
        mesage: "Thành công",
        payload: req.user,
      });
    } catch (err) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
};
