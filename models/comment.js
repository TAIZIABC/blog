const mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
	worksId: String,
	userId: String,
	userName: String,
	userHeadImg: String,
	content: String,
	replyList: [],
	time: String,
	zan: Number
});

module.exports = mongoose.model("comment",commentSchema);

//var Comment = mongoose.model("comment",commentSchema);
//var com = new Comment({
//	userId: "1233",
//	userName: "taiziabc",
//	userHeadImg: "/public/images/up-touxian/lLSXRR4gJdyWJ2WBfXmatOwK.jpg",
//	content: "好好。。。。。。。。。。。。。",
//	replyList: ['很好',"非常好","绝对很好"],
//	time: "2018-04-24 18:04:45",
//	zan: 22
//});
//com.save(function(err,doc){
//	if(err){
//		console.log(err);
//	}else{
//		console.log(doc);
//	}
//})
