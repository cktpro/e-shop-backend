const { TimeFlashsale } = require('../../models');
const moment = require('moment');

module.exports = {
  create: async (req, res, next) => {
    try {
      let data = req.body;

      await TimeFlashsale.deleteMany()

      const newRecord = new TimeFlashsale(data)

      let result = await newRecord.save();

      return res.send(200, {
        statusCode: 200,
        message: "Add flash sale time success",
        payload: result,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.send(500, {
        statusCode: 500,
        message: "Internal server error",
        error: err.message,
      });
    }
  },

  checkFlashsale: async (req, res, next) => {
    try {
      const result = await TimeFlashsale.findOne()

      if (result) {
        res.send(200, { statusCode: 200, message: "found", payload: result });
      } else {
        res.send(200, { statusCode: 200, message: "not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
