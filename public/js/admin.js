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
})
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
})
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
})
