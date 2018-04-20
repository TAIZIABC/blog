const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	"userName": String,
	"userPwd" : String,
	"userPhone": Number,
	"userAdress":String,
	"sex": String,
	"headimgSrc": String,
	"gxqm": String
})

module.exports = mongoose.model("User",userSchema);
