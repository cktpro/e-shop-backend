const { Customer, Address } = require("../../models");
const { fuzzySearch } = require("../../helper");
const { isError } = require("util");
module.exports = {
  getList: async (req, res, next) => {
    try {
      const result = await Customer.find({ isDeleted: false })
        .populate("address")
        .select("-password");
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
      });
    }
  },
  search: async (req, res, next) => {
    try {
      const { name, yearOfBirthday, birthday } = req.query;
      const conditionFind = { isDeleted: false };
      if (name) {
        {
          conditionFind.$expr = {
            $or: [
              { firstName: fuzzySearch(name) },
              { lastName: fuzzySearch(name) },
            ],
          };
        }
      }

      const result = await Customer.find(conditionFind);

      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.send({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  getDetail: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Customer.findOne({
        _id: id,
        isDeleted: false,
      }).populate("address");
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 404,
        mesage: "Thất bại",
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  create: async (req, res, next) => {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      birthday,
      isDeleted,
    } = req.body;
    try {
      const newRecord = new Customer({
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        birthday,
        isDeleted,
      });
      const result = await newRecord.save();
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 401,
        mesage: "Thất bại",
      });
    } catch (err) {
      console.log("◀◀◀ err ▶▶▶", err);
      return res.send(400, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },

  createGoogle: async (req, res, next) => {
    try {
      const data = req.body;

      const { email } = data;

      const getEmailExits = await Customer.findOne({ email });

      const errors = [];

      if (getEmailExits) errors.push(" Email already exists");

      if (errors.length > 0) {
        return res.status(400).json({
          message: `Adding customers failed, ${errors}`,
        });
      }

      const newItem = new Customer(data);

      let result = await newItem.save();

      result.password = undefined;

      return res.send(200, {
        statusCode: 200,
        message: "success",
        payload: result,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res
        .status(500)
        .json({ message: "Internal server error", errors: err.message });
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    console.log("◀◀◀ id ▶▶▶", id);
    const {
      firstName,
      lastName,
      phoneNumber,
      // address,
      email,
      // password,
      birthday,
      isDeleted,
    } = req.body;
    try {
      const result = await Customer.findOneAndUpdate(
        { _id: id },
        {
          firstName,
          lastName,
          phoneNumber,
          // address,
          email,
          // password,
          birthday,
          isDeleted,
        },
        { new: true }
      );
      console.log("◀◀◀ result ▶▶▶", result);
      return res.send({
        code: 200,
        mesage: "Thành công",
        payload: result,
      });
    } catch (err) {
      console.log("◀◀◀ err ▶▶▶", err);
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  softDelete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Customer.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công xóa",
        });
      }
      return res.send({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  change_password: async (req, res, next) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    try {
      const user = await Customer.findOne({ _id: id });
      console.log('◀◀◀ user ▶▶▶',user);
      const isCorrectPass = await user.isValidPass(currentPassword);
      if (!isCorrectPass) {
        return res.status(412).json({
          code: 412,
          mesage: "Mật khẩu hiện tại không chính xác",
        });
      }
      const result = await Customer.findOneAndUpdate({ _id: id },{password:newPassword},{new:true});
      return res.send({
        code: 200,
        mesage: "Thành công",
        payload: result,
      });
    } catch (error) {
      console.log("◀◀◀ error ▶▶▶", error);
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }

    // const { id } = req.params;
    // try {
    //   const result = await Address.find({ isDeleted: false });
    //   if (result) {
    //     return res.send({
    //       code: 200,
    //       mesage: "Success",
    //       payload: result,
    //     });
    //   }
    //   return res.send({
    //     code: 404,
    //     mesage: "Not found",
    //   });
    // } catch (err) {
    //   return res.send({
    //     code: 400,
    //     mesage: "Error",
    //     error: err,
    //   });
    // }
  },
  // Address CRUD
  get_address: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Address.find({ isDeleted: false });
      if (result) {
        return res.send({
          code: 200,
          mesage: "Success",
          payload: result,
        });
      }
      return res.send({
        code: 404,
        mesage: "Not found",
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Error",
        error: err,
      });
    }
  },
  create_address: async (req, res, next) => {
    try {
      const {
        customerId,
        provinceId,
        provinceName,
        districtId,
        districtName,
        wardId,
        wardName,
        streetAddress,
      } = req.body;
      const exitUser = await Customer.findOne({
        _id: customerId,
        isDeleted: false,
      });
      if (!exitUser) {
        return res.send({
          code: 400,
          mesage: "Không tìm thấy thông tin người dùng ",
        });
      }
      const newRecord = new Address({
        customerId,
        provinceId,
        provinceName,
        districtId,
        districtName,
        wardId,
        wardName,
        streetAddress,
      });
      const result = await newRecord.save();
      return res.send({
        code: 200,
        mesage: "Thành công",
        payload: result,
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  update_address: async (req, res, next) => {
    const { id } = req.params;
    const {
      provinceId,
      provinceName,
      districtId,
      districtName,
      wardId,
      wardName,
      streetAddress,
      isDeleted,
    } = req.body;
    try {
      const result = await Address.findByIdAndUpdate(
        id,
        {
          provinceId,
          provinceName,
          districtId,
          districtName,
          wardId,
          wardName,
          streetAddress,
          isDeleted,
        },
        { new: true }
      );
      if (!result) {
        return res.send({
          code: 400,
          mesage: "Fail to update",
        });
      }
      return res.send({
        code: 200,
        mesage: "Success update",
        payload: result,
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Error",
        error: err,
      });
    }
  },
  delete_address: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Address.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công xóa",
        });
      }
      return res.send({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
};
