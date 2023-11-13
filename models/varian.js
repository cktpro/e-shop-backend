const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");


const optionSchema = new Schema(
    {
      value: { type: String, required: [true, "value option không được để trống"] },
    },
    {
      versionKey: false,
    }
  );
// Virtuals in console.log()
optionSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
optionSchema.set("toJSON", { virtuals: true });
const varianSchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", require: true },

    name: {
      type: String,
      require: [true, "Name không được để trống"],
      maxLength: [50, "Name không được vượt quá 50 ký tự"],
    },
    valueOption:[optionSchema]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
varianSchema.virtual('product', {
    ref: 'products',
    localField: 'productId',
    foreignField: '_id',
    justOne: true,
  });
  varianSchema.set("toJSON", { virtuals: true });
  varianSchema.set("toObject", { virtuals: true });
//
varianSchema.plugin(mongooseLeanVirtuals);
const Varian= model("varians", varianSchema);
module.exports = Varian;
