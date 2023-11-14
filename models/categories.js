const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must not exceed 50 characters"],
      unique: [true, "Name is unique"],
    },
    description: {
      type: String,
      maxLength: [500, "Description must not exceed 500 characters"],
    },
    imageId:{type:Schema.Types.ObjectId,ref:"Media",require:true},
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
categorySchema.virtual('image', {
  ref: 'Media',
  localField: 'imageId',
  foreignField: '_id',
  justOne: true,
});
// Virtuals in console.log()
categorySchema.set('toObject', { virtuals: true });
// Virtuals in JSON
categorySchema.set('toJSON', { virtuals: true });

const Category = model("Categories", categorySchema);
module.exports = Category;
