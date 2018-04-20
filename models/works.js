const mongoose = require("mongoose");
//const moment = require("moment");
//mongoose.connect("mongodb://localhost/blog");
var workSchema = new mongoose.Schema({
	"author": String,
	"userId": String,
	"title" :String,
	"content": String,
	"worksSrc": [],
	"authorHeadImg": String,
	"likeUserId":[],
	"time": String,
	"zan": Number,
	"comment": Number
});
module.exports = mongoose.model("Works",workSchema);

//var Works = mongoose.model("Works",workSchema);
//var work  = new Works({
//	"author" : "taizi",
//	"userId": "5ad21403aaefd912e4c2d341",
//	"title": "环保汽车",
//	"content": "最新一代环保汽车，自动驾驶，电动驱动。",
//	"worksSrc": ['/public/images/works/timg.jpg'],
//	"likeUserId": ["5ad21403aaefd912e4c2d341","5ad2e47256db620140de896e","5ad34160a2cc8127d8009477"],
//	"time": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
//	"zan": 5,
//	"comment": 6
//});
//console.log(33333);
//work.save(function(err){
//	if(err){
//		console.log("创建失败！");
//	}else{
//		console.log("success");
//	}
//})
