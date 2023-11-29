const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const timeFlashsaleSchema = new Schema(
  {
    expirationTime: {
      type: Date,
      required: true,
    },

    isOpenFlashsale: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const TimeFlashsale = model('timeflashsale', timeFlashsaleSchema);
module.exports = TimeFlashsale;