const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const supplierSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [100, "name must not exceed 100 characters"],
        required: true,
      },
      email: {
        type: String,
        maxLength: [50, "Email must not exceed 50 characters"],
        required: [true,"Email is required"],
        unique:[true,"Email is unique"]
      },
      phoneNumber: {
        type: String,
        maxLength: [50, "PhoneNumber must not exceed 50 characters"],
        unique:[true,"Phone number thoại is unique"]
      },
      isDeleted: {
        type: Boolean,
        default: false,
        required: true,
      },
      address: {
        type: String,
        maxLength:[500,"Address must not exceed 500 characters"],
        required: true,
      },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );

const Supplier = model('Suppliers', supplierSchema);
module.exports = Supplier;