const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name Last name is required"],
      maxLength: [50, "First name must not exceed 50 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        maxLength: [50, "Last name must not exceed 50 characters"],
      },
      phoneNumber: {
        type: String,
        maxLength: [50, "Phone number must not exceed 50 characters"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
        maxLength: [500, "Address must not exceed 500 characters"],
        unique:[true,"Address is unique"]
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        maxLength: [50, "Email must not exceed 50 characters"],
        unique:[true,"Email is unique"]
      },
      password: {
        type: String,
        required: [true, "Password is required"],
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
    if(this?.birthday)
    return new Date().getFullYear() - this.birthday.getFullYear();
  return null
  });
  // Virtual with Populate
  
  // Config
  employeeSchema.set('toJSON', { virtuals: true });
  employeeSchema.set('toObject', { virtuals: true });
  //
  employeeSchema.plugin(mongooseLeanVirtuals);
const Employee = model("employees", employeeSchema);
module.exports = Employee;