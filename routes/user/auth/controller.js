const { Customer, Employee } = require("../../../models");
const bcrypt = require("bcryptjs");
const {
  generateToken,
  generateRefreshToken,
} = require("../../../helper/jwtHelper");
const JWT = require("jsonwebtoken");
const jwtSetting = require("../../../constants/jwtSetting");
module.exports = {
  login: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await Customer.findOne({ isDeleted: false, email});
      if (!user) {
        return res.send(400, {
          mesage: "Đăng nhập thất bại",
        });
      }

      const isCorrectPass = await user.isValidPass(password);

      if (!isCorrectPass) {
        return res.send(400, {
          mesage: "wrong email or password",
        });
      }
      const {
        _id,
        firstName,
        lastName,
        phoneNumber,
        birthday,
        updatedAt,
      } = user;
      const token = generateToken({
        _id,
        firstName,
        lastName,
        phoneNumber,
        email:user.email,
        birthday,
        updatedAt,
        role:"USER"
      });
      const refreshToken = generateRefreshToken(user._id);
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

  getMe: async (req, res, next) => {
    try {
      const result = await Customer.findOne({ _id: req.user.id, isDeleted: false }).populate('address');
      return res.send({
        code: 200,
        mesage: "Thành công",
        payload: result,
      });
    } catch (err) {
      console.log('◀◀◀ err ▶▶▶',err);
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
};
