const express = require("express");
const {regesterUser, authUser, allUsers} = require("../controlers/userControlers")
const {protect} = require('../middleware/authMiddleware')
const router = express.Router();


router.route('/').post(regesterUser).get(protect,allUsers)
router.post('/login',authUser)
// router.route('/').get(allUsers)

module.exports = router;