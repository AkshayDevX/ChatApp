const express = require("express");
const { isAuthenticatedUser, veryfyAdmin } = require("../middlewares/auth");
const { getUserProfileLogin, logoutUser, loginUser, registerUser, getAllUsers, sendMessage } = require("../controllers/userController");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/user/me").get(isAuthenticatedUser, getUserProfileLogin);
router.route("/users").get(isAuthenticatedUser, getAllUsers)
router.route("/user/send-message").put(isAuthenticatedUser, sendMessage);


module.exports = router;
