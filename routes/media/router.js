var express = require("express");
const passport = require('passport');
var router = express.Router();
const { upload_single, upload_multiple, get_file_detail,delete_single,get_list } = require("./controller");
const {
    passportVerifyTokenAdmin,
  } = require('../../middlewares/passportAdmin');
  
  passport.use('jwtAdmin', passportVerifyTokenAdmin);
// Upload File
router.post("/upload-single",passport.authenticate('jwtAdmin', { session: false }), upload_single);
router.post("/upload-multiple",passport.authenticate('jwtAdmin', { session: false }), upload_multiple);
router.delete("/:id",passport.authenticate('jwtAdmin', { session: false }), delete_single);
// get File
router.get("/:id", get_file_detail);
router.get("/", get_list);

module.exports = router;
