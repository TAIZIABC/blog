const express = require("express");

var router = express.Router();
const User = require("../models/user");
const Works = require("../models/works");
const News = require("../models/news");

//判断用户是否登入
router.get("*",function(req,res,next){
	if(!req.cookies.userId){
		return res.redirect("/");
	}
	next();
});

router.get("/",function(req,res){
	Works.find().sort( { $natural: -1 } ).limit(8).then(function(workMsg){
		res.render("index",{worksMsg:workMsg});
	})
});
//管理员获取个人信息接口
router.get("/personal_center",function(req,res){
	User.findOne({
		_id: req.cookies.userId
	}).then(function(doc){
		if(doc){
			res.render("personal-center",{userInfo:doc});
		}else{
			console.log("database err");
		}
	})	
});
//管理员获取收藏作品接口
router.get("/like_works",function(req,res){
	var userInfo = {"userName":req.cookies.userName,"headimgSrc":req.cookies.headimgSrc,userId:req.cookies.userId}
	Works.find({
		likeUserId: req.cookies.userId
	}).sort( { $natural: -1 } ).limit(10).then(function(doc){
		if(doc){
			res.render("like_works",{worksInfo:doc,userInfo:userInfo})
		}else{
			console.log("none");
		}
	})
});
//管理员获取作品数据接口
router.get("/my_works",function(req,res){
	Works.find({
		userId: req.cookies.userId
	}).sort( { $natural: -1 } ).limit(10).then(function(doc){
		if(doc){
			res.render("my_works",{worksInfo:doc,userInfo:{"userName":req.cookies.userName,"headimgSrc":req.cookies.headimgSrc}});
		}else{
			console.log("none");
		}
	})
});

//管理员获取消息接口
router.get("/news",function(req,res){
	News.find({
		receiveId: req.cookies.userId
	}).sort( { $natural: -1 } ).limit(10).then(function(doc){
		if(doc){
			res.render("news",{newsInfo:doc,userInfo:{"userName":req.cookies.userName,"headimgSrc":req.cookies.headimgSrc}});
		}else{
			console.log("none");
		}
	})
	
});

//发布接口
router.get('/publish',function(req,res){
	res.render("publish");
});
//管理员删除作品接口
router.post("/delWork",function(req,res){
	var workId = req.body.workId;
	Works.remove({
		_id: workId
	},function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.json({status:0,msg:'删除成功！'});
		}
	})
});
//管理员取消关注作品接口
router.post("/delLikeWork",function(req,res){
	var workId = req.body.workId;
	var userId = req.body.userId;
	Works.update({
		_id: workId
	},{
		$pull: {likeUserId: userId}
	},
	function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.json({status:0,msg:'取消收藏成功！'});
		}
	})
});
//管理员修改密码接口
router.post("/modifyPwd",function(req,res){
	var userId = req.cookies.userId;
	var oldPwd = req.body.oldPwd;
	var newPwd = req.body.newPwd;
	User.update({
		_id:userId
	},{
		$set: {userPwd: newPwd}
	},function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.json({status:0,msg:"修改成功！"});
		}
	})
});
//管理员修改个人信息接口
router.post("/modifyInfo",function(req,res){
	var userId = req.cookies.userId;
	var userInfo = req.body;
	User.update({
		_id:userId
	},{
		$set: {userNmae: userInfo.userName,sex: userInfo.sex,userPhone:userInfo.userPhone,userAdress: userInfo.userAdress,gxqm: userInfo.gxqm}
	},function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.json({status:0,msg:"修改成功！"});
		}
	})
});

//注销
router.get("/logout",function(req,res){
	res.cookie("userId",'',{
		path: '/',
		maxAge: -1
	});
	return res.redirect("/");
	
});
module.exports = router;