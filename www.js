const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const Works = require("./models/works")

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

app.get("/",function(req,res){
	if(req.cookies.userId){
		res.redirect("/admin");
	}else{
		Works.find().sort( { $natural: -1 } ).limit(8).then(function(doc){
			res.render("login_index",{worksMsg: doc});
		})
		
	}
})


//api路由
app.use("/api",require("./router/api"));
//管理员路由
app.use("/admin",require("./router/admin"));
//用户路由
app.use("./user",require("./router/user"));


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
