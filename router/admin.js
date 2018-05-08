const express = require("express");
var router = express.Router();
const url = require("url");
const User = require("../models/user");
const Works = require("../models/works");
const News = require("../models/news");



//对字数过滤的方法
function LimitNumber(tex){
	var str = tex;
	for(var i=0;i<tex.length;i++){
		if(tex[i].content.length>25){
			str[i].content = tex[i].content.substr(0,25)+'。。。';
		}
	}
	return str;
};

//判断用户是否登入
router.get("*",function(req,res,next){
	if(!req.cookies.userId){
		return res.redirect("/");
	}
	next();
});
//分页变量
var page = 0;
var pageNumber;
const LIMITNUM = 8;
//管理员首页
router.get("/",function(req,res){
//	向分页添加接口
	var url = req.url;
	if(url.indexOf('?')>0){
		if(url.indexOf('action')>0){
			url = '/admin'+ url.substr(0,url.indexOf('action'));
		}else{
			url = '/admin' + url + '&';
		}
	}else{
		url = '/admin'+ url + '?';
	}
//	搜索功能
	var value = req.query.value;
	var rgex = new RegExp(value);
//	分页功能
	if(req.query.action==='pre'){
		page = page -1;
		page = Math.max(page,0);
	}else if(req.query.action==='next'){
		page = page + 1;
		page = Math.min(page,pageNumber-1);
	}else{
		page = 0;
	}
//	获取页数
	Works.find({title:rgex}).count(function(err,doc){
		pageNumber = Math.ceil(doc/8);
	});
	Works.find({title:rgex}).sort( { $natural: -1 } ).limit(LIMITNUM).skip(page*LIMITNUM).then(function(workMsg){
		var msgInfo = LimitNumber(workMsg);
		res.render("index",{worksMsg:msgInfo,page,pageNumber,url});
	});
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
	var userInfo = {"userName":req.cookies.userName,"headimgSrc":req.cookies.headimgSrc,userId:req.cookies.userId};
	if(req.query.action==='pre'){
		page = page -1;
		page = Math.max(page,0);
	}else if(req.query.action==='next'){
		page = page + 1;
		page = Math.min(page,pageNumber-1);
	}else{
		page = 0;
	}
	Works.find({likeUserId: req.cookies.userId}).count(function(err,doc){
		pageNumber = Math.ceil(doc/8);
	});
	Works.find({
		likeUserId: req.cookies.userId
	}).sort( { $natural: -1 } ).limit(LIMITNUM).skip(page*LIMITNUM).then(function(doc){
		if(doc){
			res.render("like_works",{worksInfo:doc,page,pageNumber,userInfo})
		}else{
			console.log("none");
		}
	})
});
//管理员获取作品数据接口
router.get("/my_works",function(req,res){
	if(req.query.action==='pre'){
		page = page -1;
		page = Math.max(page,0);
	}else if(req.query.action==='next'){
		page = page + 1;
		page = Math.min(page,pageNumber-1);
	}else{
		page = 0;
	}
	Works.find({userId: req.cookies.userId}).count(function(err,doc){
		pageNumber = Math.ceil(doc/8);
	});
	Works.find({
		userId: req.cookies.userId
	}).sort( { $natural: -1 } ).limit(LIMITNUM).skip(page*LIMITNUM).then(function(doc){
		if(doc){
			res.render("my_works",{worksInfo:doc,page,pageNumber,userInfo:{"userName":req.cookies.userName,"headimgSrc":req.cookies.headimgSrc}});
		}else{
			console.log("none");
		}
	})
});

//管理员获取消息接口
router.get("/news",function(req,res){
	if(req.query.action==='pre'){
		page = page -1;
		page = Math.max(page,0);
	}else if(req.query.action==='next'){
		page = page + 1;
		page = Math.min(page,pageNumber-1);
	}else{
		page = 0;
	}
	News.find({receiveId: req.cookies.userId}).count(function(err,doc){
		pageNumber = Math.ceil(doc/8);
	});
	News.find({
		receiveId: req.cookies.userId
	}).sort( { $natural: -1 } ).limit(LIMITNUM).skip(page*LIMITNUM).then(function(doc){
		if(doc){
			res.render("news",{newsInfo:doc,page,pageNumber,userInfo:{"userName":req.cookies.userName,"headimgSrc":req.cookies.headimgSrc}});
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