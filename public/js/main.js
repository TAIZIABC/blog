//注册方法
$("#register").on("click",function(){
	var userData = {};
	userData.userName = $("#userName").val();
	userData.userPwd  = $("#passward").val();
	userData.userPhone = $("#tel").val();
	userData.sex = $("input[name='sex']").val();
	userData.userAdress =$("#province2").val() + $("#city2").val()+$("#district2").val();
	$.ajax({
		url: "/api/register",
		type: "post",
		data: userData,
		success:function(result){
			$("#errMsg").html(result.msg);
			if(result.status==0){
				setTimeout(function(){
					$('#resModel').modal('hide');
					$('#loginModal').modal('show');
				},1000)
			}
		},
		error:function(err){
			console.log(err);
		}
	})
});


//登入方法
$("#login").on("click",function(){
	var userData = {};
	userData.userName = $("#log_name").val();
	userData.userPwd  = $("#log_passward").val();
	
	$.ajax({
		type:"post",
		url:"/api/login",
		data:userData,
		success: function(result){
			$("#login_msg").html(result.msg);
			if(result.status==0){
				setTimeout(function(){
					location.href="/admin";
				},1000)
			}
		},
		error: function(err){
			console.log(err)
		}
	});
	
})

//修改图片函数
$("#modify").on("click", function() {
	if($("#picture").val() != '') {
		var formData = new FormData();
		formData.append('file', $('#picture')[0].files[0]);
		$.ajax({
			type: "post",
			url: "/api/img_upload",
			data: formData,
			cache: false,
			processData: false,
			contentType: false,
			success: function(data) {
				if(data.status == 7) {
					$("#head-img").modal("hide");
					alert("修改成功，刷新页面后生效！");
				} else {
					alert(data.msg);
				}
			},
			error: function(err) {
				console.log(err);
			}
		})
	}
});
//判断用户是否登入
$("#livMsg").on("click",function(){
	if($("#authorId").val()==""){
		alert("请登入后留言。");
		$("#livMsg").attr("data-target","");
	}
})
//提交留言方法
$("#liuYan").on("click",function(){
	if($("#authorId").val()==""){
		alert("请登入后留言！");
		$("#msgModel").modal("hide");
		return ;
	}
	if($("#msgValue").val()!=''){
		console.log($("#msgValue").val());
		$.ajax({
			url: "/user/liuyan",
			type: "post",
			data: {
				"msgValue": $("#msgValue").val(),
				"receiveId"  : $("#userId").val()
			},
			success: function(data){
				if(data.status==0){
					$("#msgModel").modal("hide");
					$("#msgValue").val("");
				}
				alert(data.msg)
			},
			error: function(err){
				console.log("留言失败，请稍后重试！");
			}
		})
	}else{
		alert("请输入内容！");
	}
});
//回复信息方法
$("button.reply").on("click",function(){
	$("#replyModel").modal("show");
})
$("#reply").on("click",function(){
	if($("#msgValue").val()!=''){
		$.ajax({
			url: "/user/liuyan",
			type: "post",
			data:{
				msgValue: $("#msgValue").val(),
				receiveId: $("#receiveId").val()
				
			},
			success: function(data){
				if(data.status==0){
					$("#replyModel").modal("hide");
					$("#msgValue").val("");
				}
				alert("回复成功！");
			},
			error: function(){
				console.log("回复失败，请稍后重试！");
			}
		})
	}else{
		alert("请输入内容！");
	}
});
//修改密码方法
$("#modifyPwd").on("click",function(){
	var oldPwd = $("#oldPassward").val();
	var newPwd = $("#newPassward").val();
	var newAgainPwd =  $("#newPasswardAgain").val();
	if(oldPwd==''){
		alert("旧密码不能为空！");
		return ;
	}else if(newPwd==''){
		alert("新密码不能为空！");
		return ;
	}else if(newAgainPwd==''){
		alert("确认新密码不能为空！");
		return ;
	}else if(newAgainPwd!=newPwd){
		alert("两次新密码输入不一致！");
		return ;
	}else{
		$.ajax({
			url: "/admin/modifyPwd",
			type: "post",
			data: {
				oldPwd: oldPwd,
				newPwd: newPwd,
				newAgainPwd: newAgainPwd
			},
			success: function(data){
				if(data.status==0){
					alert(data.msg);
				}
			},
			error: function(err){
				console.log(err);
			}
		})
	}
});
//修改个人信息接口
$("#modifyInfo").on("click",function(){
	var userData = {};
	userData.userName = $("#userName").val();
	userData.sex  = $('input:radio[name="sex"]:checked').val();
	userData.userPhone = $("#userPhone").val();
	userData.gxqm = $("#gxqm").val();
	userData.userAdress =$("#province2").val() + $("#city2").val()+$("#district2").val();
	if(userData.userName ==''){
		alert("用户名不能为空！");
		return ;
	}else if(userData.userPhone==''){
		alert("手机号码不能为空！");
		return ;
	}else if(userData.gxqm==''){
		alert("个性签名不能为空！");
		return ;
	}else{
		$.ajax({
			url: "/admin/modifyInfo",
			type: "post",
			data: userData,
			success: function(data){
				if(data.status==0){
					alert(data.msg);
				}
			},
			error: function(err){
				console.log(err);
			}
		})
	}
});

//删除消息方法
function delMsg(msgId){
	if(confirm("你确定要删除该条消息吗？")){
		$.ajax({
			url: "/user/delmsg",
			type: "post",
			data: {
				msgId: msgId
			},
			success: function(data){
				if(data.status==0){
					alert("删除成功!");
					location.reload();
				}else{
					alert("删除失败，请稍后重试！");
				}
			},
			error: function(err){
				console.log(err);
			}
		})
	}
};
//删除作品方法
function delWork(id){
	if(confirm("你确定要删除该作品吗？")){
		$.ajax({
			url: '/admin/delWork',
			type: 'post',
			data:{
				workId: id
			},
			success: function(data){
				if(data.status==0){
					alert('删除成功！');
					location.reload();
				}
			},
			error: function(err){
				alert("删除失败，请稍后重试！");
			}
		})
	}
};
//删除收藏作品方法
function delLikeWork(workId,userId){
	if(confirm("你确定要取消收藏该作品吗？")){
		$.ajax({
			url: '/admin/delLikeWork',
			type: 'post',
			data:{
				workId: workId,
				userId: userId
			},
			success: function(data){
				if(data.status==0){
					location.reload();
				}
			},
			error: function(err){
				alert("取消关注失败，请稍后重试！");
			}
		})
	}
};

//作品详情页面js代码
//收藏作品方法
$(".comment-item-list").find(".reply-btn").on("click", function() {
		$(".comment-item-list").find(".reply-box").hide();
		$(".comment-item-list").find(".reply-box textarea").eq(index).removeClass("reply-input");
		var index = $(".comment-item-list").find(".reply-btn").index(this);
		$(".comment-item-list").find(".reply-box").eq(index).toggle();
		$(".comment-item-list").find(".reply-box textarea").eq(index).addClass("reply-input");
});
$("#collect").on("click",function(){
	if($("#userId").val()==""){
		alert("请登入后收藏！");
		return ;
	}
	var worksId = $("#worksId").val();
	$.ajax({
		url: "/user/collect",
		type: "post",
		data: {
			worksId: worksId
		},
		success: function(data){
			$(".post-like-btn").addClass("isCollect");
			alert(data.msg);
		},
		error: function(err){
			alert("收藏失败，请稍后重试！");
		}
	})
});
//提交评论方法	
$("#comment").on("click",function(){
	var content = $(".comment-input").val();
	var worksId = $("#worksId").val();
	if($("#userId").val()==""){
		alert("请登入后评论！");
		return ;
	}else if(content==""){
		alert("评论内容不能为空！");
		return ;
	}
	$.ajax({
		url: "/user/comment",
		type: "post",
		data: {
			content: content,
			worksId: worksId
		},
		success: function(data){
			if(data.status==0){
				alert("评论成功！");
				location.reload();
			}
		},
		error: function(err){
			console.log(err);
		}
	})
});
//评论点赞方法
function zan(commentId){
	var num =parseInt($("#"+commentId).text());
	$.ajax({
		url: "/user/zan",
		type: "post",
		data: {
			commentId: commentId
		},
		success: function(data){
			if(data.status==0){
				$("#"+commentId).html(++num);
			}else{
				alert("点赞失败，请稍后重试！");
			}
		},
		error: function(err){
			alert("点赞失败，请稍后重试！");
		}
	})
};
//评论回复方法
function reply(commentId){
	if($("#userId").val()==""){
	alert("请登入后评论！");
	return ;
}
$.ajax({
	url: "/user/reply",
	type: "post",
	data: {
		commentId: commentId,
		content: $(".reply-input").val()
		},
		success: function(data){
			location.reload();
		},
		error: function(err){
			console.log(err);
		}
	})
}
