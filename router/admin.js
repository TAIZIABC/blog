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
//		console.log(workMsg);
		res.render("index",{worksMsg:workMsg});
	})
});

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
//管理员收藏作品接口
router.get("/like_works",function(req,res){
	Works.find({
		likeUserId: req.cookies.userId
	}).sort( { $natural: -1 } ).limit(10).then(function(doc){
		if(doc){
			res.render("like_works",{worksInfo:doc,userInfo:{"userName":req.cookies.userName,"headimgSrc":req.cookies.headimgSrc}})
		}else{
			console.log("none");
		}
	})
});
//管理员作品数据接口
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
})


//注销
router.get("/logout",function(req,res){
	res.cookie("userId",'',{
		path: '/',
		maxAge: -1
	});
	return res.redirect("/");
	
});
module.exports = router;