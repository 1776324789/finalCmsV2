function ajaxRequest(url, method, data, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					callback(null, xhr.responseText);
				} else {
					callback(new Error('请求失败: ' + xhr.status));
				}
			}
		};
		xhr.open(method, url, true);
		xhr.setRequestHeader('Content-Type', 'application/json'); // 根据需要设置请求头

		// 设置 withCredentials 为 true 以支持跨域请求发送凭证
		xhr.withCredentials = true;

		xhr.send(JSON.stringify(data)); // 根据需要发送数据
	}

	var apiUrl = 'https://template.jxuspt.com/admission/search'; // API URL
	function search() {
		var stuId = document.getElementById("stuId").value;
		var stuIdNo = document.getElementById("stuIdNo").value;
		var loading = document.getElementById("loading")
		var result = document.getElementById("result")
		var empty = document.getElementById("empty")
		if (stuId == "") {
			message("请输入学号");
			return
		}
		if (stuIdNo == "") {
			message("请输入身份证号");
			return
		}
		empty.style.display = "none"
		result.style.display = "none"
		loading.style.display = "block"
		var requestData = {
			stuId: stuId,
			stuIdNo: stuIdNo
		}; // 请求数据

		ajaxRequest(apiUrl, 'POST', requestData, function (error, response) {
			if (error) {
				loading.style.display = "none"
				empty.innerText = "程序内部异常，请稍后再试"
			} else {
				response = JSON.parse(response)
				console.log(response)
				if (response.data == null) {
					loading.style.display = "none"
					empty.innerText = "未查询到数据"
					empty.style.display = "block"
				} else {
					loading.style.display = "none"
					result.style.display = "block"
					data = response.data
					document.getElementById("name").innerText = data.stuName
					document.getElementById("id").innerText = data.stuId
					document.getElementById("idNo").innerText = data.stuIdNo
					document.getElementById("score").innerText = data.stuScore
					document.getElementById("status").innerText = data.admissionStatus == 0 ? "录取" : "未录取"
					document.getElementById("college").innerText = data.admissionCollege
					document.getElementById("batch").innerText = data.admissionBatch
					document.getElementById("major").innerText = data.admissionMajor
					document.getElementById("type").innerText = data.admissionType
					document.getElementById("postNo").innerText = data.acceptanceLetterPostId
				}

				// 在这里处理返回的数据
			}
		});
	}

	function message(str) {
		document.getElementById("message").innerText = str;
		setTimeout(() => {
			document.getElementById("message").innerText = "";
		}, 2500)
	}
	// 示例用法