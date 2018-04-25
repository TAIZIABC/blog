const express = require("express");
const url = require("url");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require("../models/user");
const Works = require("../models/works");
const News  = require("../models/news");
const Comment = require("../models/comment");
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
//作品详情接口
router.get("/works",function(req,res){
	var worksId = url.parse(req.url,true).query.worksId;
	Works.findOne({
		_id: worksId
	}).then(function(worksInfo){
		var worksInfo = worksInfo;
		Comment.find({
			worksId: worksId
		},function(err,doc){
			if(err){
				console.log(err);
			}else{
				res.render("works-message",{worksInfo:worksInfo,userID:req.cookies.userId,commentInfo:doc,userName:req.cookies.userName});
			}
		}).sort({$natural: -1});				
	})
});
//收藏作品接口
router.post("/collect",function(req,res){
	var worksId = req.body.worksId;
	var userId = req.cookies.userId;
	Works.update({
		_id: worksId
	},{
		 $addToSet : { likeUserId : userId}
	}).then(function(doc){
		if(doc.ok){
			res.json({status:0,msg:"收藏成功！"});
		}else{
			res.json({status:1,msg:"收藏失败！"});
		}
	})
})
//提交评论接口
router.post("/comment",function(req,res){
	var content = req.body.content;
	var worksId = req.body.worksId;
	var userId = req.cookies.userId;
	var userName = req.cookies.userName;
	var userHeadImg = req.cookies.headimgSrc;
	var comment = new Comment({
		userId: userId,
		worksId: worksId,
		userName: userName,
		userHeadImg: userHeadImg,
		content: content,
		replyList: [],
		time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
		zan: 0
	});
	comment.save(function(err,doc){
		if(err){
			console.log(err)
		}else{
			res.json({status:0,msg:"评论成功！"});
		}
	});
})
//评论点赞接口
router.post("/zan",function(req,res){
	var commentId = req.body.commentId;
	Comment.update({
		_id: commentId
	},{
		$inc: {zan:1}
	},function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.json({status: 0,msg:"ok"});
		}
	})
});
//评论回复接口
router.post("/reply",function(req,res){
	var commentId = req.body.commentId;
	var content = req.body.content;
	Comment.update({
		_id: commentId
	},{
		$push:{replyList: content}
	},function(err,doc){
		if(err){
			console.log(err);
		}else{
			res.json({status:0,msg:"回复成功！"});
		}
	})
})

module.exports = router;