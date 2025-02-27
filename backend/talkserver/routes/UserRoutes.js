const { urlencoded } = require("body-parser");
const express = require("express");
const { createUser, userLogin, getUserData, findOnlineDrivers, getUserById, getOtherUsers, sendRequest, acceptRequests, getRequests, getChats, getMessages, sendMessage } = require("../controllers/UserController");
const { getDriverById } = require("../controllers/DriverController");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/createuser',createUser)
router.post('/userlogin',userLogin)
router.post('/getuserdata',getUserData)
router.get('/getonlinedrivers',findOnlineDrivers)
router.get('/userinfo/:id',getUserById)
router.get('/driverinfo/:id',getDriverById)
router.get('/users/:userId',getOtherUsers)
router.post('/sendrequest',sendRequest)
router.get("/getrequests/:userId",getRequests)
router.post("/acceptrequests", acceptRequests)
router.get('/friends/:userId',getChats)
router.get('/getmessages',getMessages)
router.post('/sendmessage',sendMessage)

module.exports = router;
