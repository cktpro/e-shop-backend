const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name không được bỏ trống"],
      maxLength: [50, "First name không được vượt quá 50 ký tự"],
    },
    lastName: {
        type: String,
        required: [true, "Last name không được bỏ trống"],
        maxLength: [50, "Last name không được vượt quá 50 ký tự"],
      },
      phoneNumber: {
        type: String,
        maxLength: [50, "Phone number không được vượt quá 50 ký tự"],
      },
      address: {
        type: String,
        required: [true, "Address không được bỏ trống"],
        maxLength: [500, "Address không được vượt quá 500 ký tự"],
        unique:[true,"Address không được trùng"]
      },
      email: {
        type: String,
        required: [true, "Email không được bỏ trống"],
        maxLength: [50, "Email không được vượt quá 50 ký tự"],
        unique:[true,"Email không được trùng"]
      },
      password: {
        type: String,
        required: [true, "Password không được bỏ trống"],
        min: [3, "Password quá ngắn"],
      },
      birthday: {
        type: Date,
      },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
employeeSchema.pre("save",async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await  bcrypt.hash(this.password, salt);
    this.password=hash;
    next();
  } catch (error) {
    next(error);
  }
});
employeeSchema.pre("findOneAndUpdate",async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.getUpdate().password, salt);
    this.getUpdate().password=hash;
    next();
  } catch (error) {
    next(error);
  }
});
employeeSchema.methods.isValidPass = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(false);
  }
};
employeeSchema.virtual('fullName').get(function () {
    return this.firstName+" "+this.lastName;
  });
  employeeSchema.virtual('Age').get(function () {
    return new Date().getFullYear() - this.birthday.getFullYear();
  });
  // Virtual with Populate
  
  // Config
  employeeSchema.set('toJSON', { virtuals: true });
  employeeSchema.set('toObject', { virtuals: true });
  //
  employeeSchema.plugin(mongooseLeanVirtuals);
const Employee = model("employees", employeeSchema);
module.exports = Employee;