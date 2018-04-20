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