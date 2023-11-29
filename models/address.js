const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const addressSchema = new Schema(
  {
    customerId:{type : Schema.Types.ObjectId,ref:"Customer",require:true},
    provinceId: {
      type: String,
      required: [true, "provinceId is requied"],
      maxLength: [50, "provinceId must not exceed 50 characters"],
    },
    provinceName: {
      type: String,
      required:[true,"province name is requied"]
    },
    // address: {
    //   type: String,
    //   required: [true, "Address không được bỏ trống 000"],
    //   maxLength: [500, "Address không được vượt quá 500 ký tự"],
    //   unique: [true, "Address không được trùng"],
    // },
    districtId: {
      type: String,
      required: [true, "districtId is requied"],
      maxLength: [50, "districtId must not exceed 50 characters"],
    },
    districtName: {
      type: String,
      required: [true, "districtName is requied"],
    },
    wardId: {
    type: String,
    required: [true, "wardId is requied"],
    maxLength:[50,"wardId must not exceed 50 characters"]
  },
  wardName: {
    type: String,
    required: [true, "wardId is requied"],
  },
  streetAddress: {
    type: String,
    required: [true, "Street address is requied"],
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

// Virtual with Populate

// Config
addressSchema.set("toJSON", { virtuals: true });
addressSchema.set("toObject", { virtuals: true });
//
addressSchema.plugin(mongooseLeanVirtuals);
const Address = model("address", addressSchema);
module.exports = Address;
