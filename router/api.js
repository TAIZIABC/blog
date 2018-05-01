const express = require("express");
const moment = require("moment");
var fs = require("fs");
var multiparty = require('multiparty');
var router = express.Router();
var User = require("../models/user");
var Works = require("../models/works");


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
//定义统一的返回数据
var responseData = {};
router.get("/", function(req, res, next) {
	res.send("api");
	next();
})

router.post("/login", function(req, res, next) {
	var userMsg = req.body;
	//	用户名不能为空
	if(userMsg.userName == "") {
		responseData.status = 1;
		responseData.msg = "用户名不能为空！";
		res.json(responseData);
		return;
	}
	//	密码不能为空
	if(userMsg.userPwd == "") {
		responseData.status = 2;
		responseData.msg = "密码不能为空！";
		res.json(responseData);
		return;
	}
	//	判断用户名或密码是否正确
	User.findOne({
		userName: userMsg.userName,
		userPwd: userMsg.userPwd,
	}).then(function(userInfo) {
		if(userInfo) {
			//			设置cookie
			res.cookie("userId", userInfo._id, {
				path: "/",
				maxAge: 1000 * 60 * 60
			})
			res.cookie("userName", userInfo.userName, {
				path: "/",
				maxAge: 1000 * 60 * 60
			})
			res.cookie("headimgSrc", userInfo.headimgSrc, {
				path: "/",
				maxAge: 1000 * 60 * 60
			})
			responseData.status = 0;
			responseData.msg = "登入成功！";
			res.json(responseData);
			return;
		} else {
			responseData.status = 3;
			responseData.msg = "用户名或密码错误！";
			res.json(responseData);
			return;
		}
	})

})
//新用户注册接口
router.post("/register", function(req, res) {
	var userMsg = req.body;
	//	用户名不能为空
	if(userMsg.userName == "") {
		responseData.status = 1;
		responseData.msg = "用户名不能为空！";
		res.json(responseData);
		return;
	}
	//	密码不能为空
	if(userMsg.userPwd == "") {
		responseData.status = 2;
		responseData.msg = "密码不能为空！";
		res.json(responseData);
		return;
	}
	//	手机号码不能为空
	if(userMsg.userPhone == "") {
		responseData.status = 3;
		responseData.msg = "手机号码不能为空！";
		res.json(responseData);
		return;
	}
	//	地址不能为空
	if(userMsg.userAdress == "") {
		responseData.status = 4;
		responseData.msg = "地址不能为空！";
		res.json(responseData);
		return;
	}
	//	判断数据库用户名是否被注册
	User.findOne({
		userName: userMsg.userName
	}).then(function(userInfo) {
		if(userInfo) {
			responseData.status = 5;
			responseData.msg = "用户名已存在！";
			res.json(responseData);
			return;
		}
		//		保存用户信息
		var user = new User({
			userName: userMsg.userName,
			userPwd: userMsg.userPwd,
			userPhone: userMsg.userPhone,
			userAdress: userMsg.userAdress,
			sex: userMsg.sex,
			headimgSrc: "/public/images/touxian/touxian.jpg",
			gxqm: "节能减排，你我同行！"
		});
		return user.save()
	}).then(function(newUserInfo) {
		//	注册成功
		responseData.status = 0;
		responseData.msg = "注册成功！";
		res.json(responseData);
	})
})
//接受上传的文件接口
router.post("/file_upload", function(req, res) {
	var msg = {
		info: '',
		img: ''
	};
	var form = new multiparty.Form({
		uploadDir: './public/uploads'
	});
	//上传完成后处理
	form.parse(req, function(err, fields, files) {
		if(err) {
			console.log('parse error: ' + err);
		} else {
			var inputFile = files.file_data;
			var uploadedPath = inputFile[0].path;
			var worksimgSrc = uploadedPath.replace("public\\uploads\\", "/public/uploads/");
			msg.info = '上传成功';
			msg.img = worksimgSrc;
			res.send(msg);
		}
	});
})
//接受上传的头像的接口
router.post("/img_upload", function(req, res) {
	var form = new multiparty.Form({
		uploadDir: './public/images/up-touxian'
	});
	//上传完成后处理
	form.parse(req, function(err, fields, files) {
		if(err) {
			console.log('parse error: ' + err);
		} else {
			var inputFile = files.file[0];
			var uploadedPath = inputFile.path;
			var worksimgSrc = uploadedPath.replace("public\\images\\up-touxian\\", "/public/images/up-touxian/");
//			删除原来的头像图片
			var oldImgSrc = req.cookies.headimgSrc;
			oldImgSrc = oldImgSrc.replace("/public/images/up-touxian/","public\\images\\up-touxian\\")
			fs.unlink(oldImgSrc,function(err){
				if(err){
					console.log(err);
				}else{
//					console.log("ok");
				}
			})
//			更新用户表头像地址
			User.update({
				_id: req.cookies.userId
			}, {
				$set: {
					headimgSrc: worksimgSrc
				}
			}, function(err, doc) {
				if(err) {
					responseData.msg = '数据库错误';
					responseData.status = 1;
					res.send(responseData);
				} else {
					res.cookie("headimgSrc", worksimgSrc);
					responseData.msg = '上传成功';
					responseData.status = 7;
					res.send(responseData);
				}
			});
//			更新作品表里的作者头像
			Works.update({
				userId: req.cookies.userId
			}, {
				$set: {
					authorHeadImg: worksimgSrc
				}
			}, {
				multi: true
			}, function(err, doc) {
				if(err) {
					console.log(err);
				} else {
					console.log(doc);
				}
			});
		}
	});
})
//发布信息接口
router.post("/publish", function(req, res) {
	var worksMsg = req.body;
	var worksSrc = worksMsg.worksSrc.split("--");
	console.log(worksSrc);
	var works = new Works({
		author: req.cookies.userName,
		userId: req.cookies.userId,
		title: worksMsg.title,
		content: worksMsg.content,
		worksSrc: worksSrc,
		authorHeadImg: req.cookies.headimgSrc,
		likeUserId: [],
		time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
		zan: 0,
		comment: 0
	});
	works.save(function(err, doc) {
		if(err) {
			console.log(err);
		} else {
			responseData.status = 7;
			responseData.msg = "发布成功！";
			res.json(responseData)
		}
	});
})
module.exports = router;