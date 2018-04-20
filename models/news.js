const mongoose = require("mongoose");

//const moment = require("moment");
//mongoose.connect("mongodb://localhost/blog");
var newsSchema = new mongoose.Schema({
	"postId": String,
	"postName": String,
	"receiveId": String,
	"title": String,
	"content": 	String,
	"time": String,
	"isRead": Boolean
})
   module.exports = mongoose.model("news",newsSchema);
 
// var News = mongoose.model("news",newsSchema);
// 
// var news = new News({
// 	postId: "5ad2e47256db620140de896e",
// 	postName: "admin",
// 	receiveId: "5ad21403aaefd912e4c2d341",
// 	title: "咨询详情",
// 	content: "这个是用什么做的，这么买",
// 	time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
// 	isRead: false
// })
// news.save(function(err){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("success");
// 	}
// })
