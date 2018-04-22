const express = require("express");
const url = require("url");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require("../models/user");
const Works = require("../models/works");
const News  = require("../models/news");
const moment = require("moment");
var router = express.Router();

router.use(cookieParser());
router.use(bodyParser.urlencoded({extended:false}));
router.get("/",function(req,res,next){
	res.send("user");
	next();
})
//用户信息接口
router.get("/user_info",function(req,res,next){
	var userId = url.parse(req.url,true).query.userId;
//	如果作者是本人,则跳转到个人中心页面
	if(userId === req.cookies.userId){
		return res.redirect("/admin/personal_center");
	}
	User.findOne({
		_id: userId
	},function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.render("user_info",{userInfo:doc,userID:req.cookies.userId});
		}
	})
});
//用户作品接口
router.get("/user_works",function(req,res){
	var userId = url.parse(req.url,true).query;
	Works.find({
		userId: userId.userId
	}).limit(10).then(function(doc){
		res.render("user_works",{worksInfo:doc,userID:req.cookies.userId});
	})
});
//用户留言接口
router.post("/liuyan",function(req,res){
	var content = req.body.msgValue;
	var receiveId = req.body.receiveId;
	var postId = req.cookies.userId;
	var postName = req.cookies.userName;
	var news = new News({
		postId: postId,
		postName: postName,
		receiveId: receiveId,
		title: "留言消息",
		content: content,
		time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
		isRead: false
	});
	news.save(function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.json({status:0,msg: '留言成功！'});
		}
	})
	
})



module.exports = router;