document.addEventListener('DOMContentLoaded', function () {
	function addScriptPc(src,charset, callback) {
		var newScript = document.createElement('script');
		newScript.src = src;
		if(charset) newScript.charset ='utf-8'
		newScript.onload = callback; // 添加加载完成回调
		document.body.appendChild(newScript);
	}
	if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
		if(1==1){
			var link = document.createElement('link');
					link.href = "https://answer.eol.cn/app/static/css/mobile_floatwindow.css";
					link.rel = 'stylesheet';
					document.head.appendChild(link);
			if(typeof(jQuery)=="undefined" && typeof(Zepto)=="undefined") {
				addScriptPc('https://answer.eol.cn/app/static/scripts/jquery-1.9.1.min.js','', function() {
						// jQuery加载完成后再加载依赖脚本
						addScriptPc("https://answer.eol.cn/school/mobile/schoolfloat1407.js");
				});
			} else {
				// 如果jQuery已存在，直接加载
				addScriptPc("https://answer.eol.cn/school/mobile/schoolfloat1407.js");
			}

			// 判断是否拼接对应参数
			var js_need = document.getElementById("eda_bar_script");
			// js_need.attachShadow({ mode: "open" });
			var arraytemp = new Array();
				arraytemp = js_need.src.split('?');
			if (arraytemp[1]) {
				arraytemp = arraytemp[1].split('=');
				// 确认拼接参数为来源时，存入cookie
				if (arraytemp[0] == 'from' && arraytemp[1]) {
					var exdate = new Date();
						exdate.setDate(parseInt(exdate.getDate()) + parseInt(1));
					document.cookie = 'from='+arraytemp[1]+';expires='+exdate.toGMTString()+';path=/;domain=.eol.cn';
				}
			}
		}
	} else {
		if(1==1){ //挂链展示
			var link = document.createElement('link');
					link.href = 'https://answer.eol.cn/app/static/scripts/pc/css/floatwindow.css';
					link.rel = 'stylesheet';
					document.head.appendChild(link);	
				// 按顺序加载脚本
				if (typeof(jQuery) == "undefined" && typeof(Zepto) == "undefined") {
						addScriptPc('https://answer.eol.cn/app/static/scripts/jquery-1.9.1.min.js', null, function() {
							addScriptPc ('https://answer.eol.cn/app/static/scripts/json2.js')
							addScriptPc ('https://answer.eol.cn/school/pc/schoolfloat1407.js','utf-8')
						});
				} else {
					addScriptPc ('https://answer.eol.cn/app/static/scripts/json2.js')
					addScriptPc ('https://answer.eol.cn/school/pc/schoolfloat1407.js','utf-8')
				}
				

				// 判断是否拼接对应参数
				var js_need = document.getElementById("eda_bar_script");
				var arraytemp = new Array();
					arraytemp = js_need.src.split('?');
				if (arraytemp[1]) {
					arraytemp = arraytemp[1].split('=');
					// 确认拼接参数为来源时，存入cookie
					if (arraytemp[0] == 'from' && arraytemp[1]) {
						var exdate = new Date();
							exdate.setDate(parseInt(exdate.getDate()) + parseInt(1));
						document.cookie = 'from='+arraytemp[1]+';expires='+exdate.toGMTString()+';path=/;domain=.eol.cn';
					}
				}
		}
	}
});