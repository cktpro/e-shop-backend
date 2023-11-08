const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const addressSchema = new Schema(
  {
    customerId:{type : Schema.Types.ObjectId,ref:"Customer",require:true},
    provinceId: {
      type: String,
      required: [true, "provinceId không được bỏ trống"],
      maxLength: [50, "provinceId không được vượt quá 50 ký tự"],
    },
    provinceName: {
      type: String,
      required:[true,"province name không được bỏ trống"]
    },
    // address: {
    //   type: String,
    //   required: [true, "Address không được bỏ trống 000"],
    //   maxLength: [500, "Address không được vượt quá 500 ký tự"],
    //   unique: [true, "Address không được trùng"],
    // },
    districtId: {
      type: String,
      required: [true, "districtId không được bỏ trống"],
      maxLength: [50, "districtId không được vượt quá 50 ký tự"],
    },
    districtName: {
      type: String,
      required: [true, "districtName không được bỏ trống"],
    },
    wardId: {
    type: String,
    required: [true, "wardId không được bỏ trống"],
    maxLength:[50,"wardId không vượt quá 50 ký tự"]
  },
  wardName: {
    type: String,
    required: [true, "wardId không được bỏ trống"],
  },
  address: {
    type: String,
    required: [true, "address không được bỏ trống"],
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
