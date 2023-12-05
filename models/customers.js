const mongoose = require("mongoose");
const { Schema, model } = mongoose;
var bcrypt = require("bcryptjs");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const customerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      maxLength: [50, "First name must not exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name không được bỏ trống"],
      maxLength: [50, "First name must not exceed 50 characters"],
    },
    phoneNumber: {
      type: String,
      maxLength: [50, "Phone number must not exceed 50 characters"],
      unique: [true, "phoneNumber is unique"],
    },
    // address: {
    //   type: String,
    //   required: [true, "Address không được bỏ trống 000"],
    //   maxLength: [500, "Address không được vượt quá 500 ký tự"],
    //   unique: [true, "Address không được trùng"],
    // },
    email: {
      type: String,
      required: [true, "Email is required"],
      maxLength: [50, "Email must not exceed 50 characters"],
      unique: [true, "Email is unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [3, "Password must be greater than 3 characters"],
    },
    birthday: {
      type: Date,
      default:new Date("1990/03/01")
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    isGoogle: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
customerSchema.pre("save",async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await  bcrypt.hash(this.password, salt);
    this.password=hash;
    next();
  } catch (error) {
    next(error);
  }
});
customerSchema.pre("findOneAndUpdate",async function (next) {
  try {
    if(!this.getUpdate().password){next()}
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.getUpdate().password, salt);
    this.getUpdate().password=hash;
    next();
  } catch (error) {
    next(error);
  }
});
customerSchema.methods.isValidPass = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};
customerSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});
customerSchema.virtual("Age").get(function () {
  return new Date().getFullYear() - this.birthday.getFullYear();
});
// Virtual with Populate

customerSchema.virtual('address', {
    ref: 'address',
    localField: '_id',
    foreignField: 'customerId',
    match:{isDeleted:false},
  });
// Config
customerSchema.set("toJSON", { virtuals: true });
customerSchema.set("toObject", { virtuals: true });
//
customerSchema.plugin(mongooseLeanVirtuals);
const Customer = model("customers", customerSchema);
module.exports = Customer;
