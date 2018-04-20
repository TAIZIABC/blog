

$("#register").on("click",function(){
	var userData = {};
	userData.userName = $("#userName").val();
	userData.userPwd  = $("#passward").val();
	userData.userPhone = $("#tel").val();
	userData.sex = $("input[name='sex']").val();
	userData.userAdress =$("#province2").val() + $("#city2").val()+$("#district2").val();
	console.log(userData);
	
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
