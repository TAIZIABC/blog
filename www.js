const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const Works = require("./models/works")



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






var app = express();
//配置静态资源目录
app.use("/public",express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));
//使用cookieParser
app.use(cookieParser());
//使用bodyParser
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//配置模板引擎
  app.set('views',path.join(__dirname , 'views') );
  app.engine('.html', require('ejs').__express);  
  app.set('view engine', 'html'); 

	
	var page = 0;
	var pageNumber;
app.get("/",function(req,res,next){
	if(req.cookies.userId){
		res.redirect("/admin");
	}else{
			if(req.query.action==='pre'){
				page = page -1;
				page = Math.max(page,0);
			}else if(req.query.action==='next'){
				page = page + 1;
				page = Math.min(page,pageNumber-1);
			}else{
				page = 0;
			}
			Works.find().then(function(doc){
				pageNumber = Math.ceil(doc.length/8);
			});
			Works.find().sort( { $natural: -1 } ).limit(8).skip(page*8).then(function(doc){
				var workInfo = LimitNumber(doc);
				res.render("login_index",{worksMsg: workInfo,page,pageNumber});
			});
	}
})


//api路由
app.use("/api",require("./router/api"));
//管理员路由
app.use("/admin",require("./router/admin"));
//用户路由
app.use("/user",require("./router/user"));


mongoose.connect("mongodb://localhost/blog",function(err){
	if(err){
		console.log(err);
	}else{
		console.log("success");
	}
})







app.listen(4000,function(err){
	if(err){
		console.log(err);
	}else{
		console.log("app is listen 4000")
	}
});
