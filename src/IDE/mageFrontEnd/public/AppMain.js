/**
 * TODO 页面启动
 *
 * 检查是否引入LayUI.js,如果引入则初始化相关控件
 * 检查NotInitLayui标记是否不启动LayUI
 * 检查是否为微信环境，载入微信js
 *
 *
 * 注意：
 * 		可以定义一个 var NotInitLayui = true; 禁止启动Layui 但必须在InitHTML被调用前定义
 * 		可以定义一个 var MyLayUIModularList = ['form','laydate','table',.....]; 配置默认LayUI启动的模块 ，但必须在InitHTML被调用前定义
 *
 */

//未启动LayUI
var LayUIInitFlag = false;
//未启动WeiXin
var WeiXinInitFlag = true;

//未开始启动业务
var StartInitFlag = true;

function InitHTML() {

    //检查layui对象是否存在
    if (typeof layui != undefined && typeof layui != "undefined") {
        //如果存在则初始化引入类UI

        //是否不启动类UI
        if (typeof NotInitLayui == undefined || typeof NotInitLayui == "undefined" || !NotInitLayui) {

            //默认引入模块 表单\时间\表格
            var LayUIModularList = null;

            if (typeof MyLayUIModularList != undefined && typeof MyLayUIModularList != "undefined") {
                LayUIModularList = MyLayUIModularList;
            } else {
                LayUIModularList = ['form', 'laydate', 'table'];
            }

            //开始引入
            layui.use(LayUIModularList, function () {

                //标记已启动Layui;
                LayUIInitFlag = true;
                //通知页面初始化业务
                StartInitFunction();

            });

        } else {
            //无需启动
            LayUIInitFlag = true;
        }

    } else {
        //无需启动
        LayUIInitFlag = true;
    }

    //判断是否为微信环境下
    if (navigator.userAgent.toLowerCase().indexOf("micromessenger") != -1) {

        deleteTop();

        //加载微信SDK
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://res.wx.qq.com/open/js/jweixin-1.3.0.js";
        document.getElementsByTagName("head")[0].appendChild(script);

        script.onload = () => {

            //微信已启动
            WeiXinInitFlag = true;
            //通知页面初始化业务
            StartInitFunction();

        };

    } else {
        //无需等待微信启动
        WeiXinInitFlag = true;
    }

    //通知页面初始化业务
    StartInitFunction();
}

/**
 *
 * 通知页面初始化业务
 *
 * 动态加载 LayUI、微信JS等基础JS完成，调用 页面实现的init方法通知页面开始初始化业务
 *
 */

function StartInitFunction() {

    //检查是否所以启动项目都启动了
    if (LayUIInitFlag && WeiXinInitFlag && StartInitFlag) {
        //只允许初始化一次业务方法
        StartInitFlag = false;

        //检查启动方法是否存在
        if ((typeof init == 'function') && init.constructor == Function) {
            //如果存在则启动方法

            //方法启动
            init();
        }

    }

}

//微信环境下去除导航栏
function deleteTop() {
    if (IsWeiXinBrowser()) {
        //清除导航栏
        var myTopList = document.querySelectorAll(".Top");
        for (var i = 0; i < myTopList.length; i++) {
            myTopList[i].setAttribute("style", "display: none;");
        }

        var myhtmlhead = document.querySelectorAll(".Top_Title_Div");
        for (var i = 0; i < myhtmlhead.length; i++) {
            myhtmlhead[i].setAttribute("style", "display: none;");
        }

        var htmlhead2 = document.querySelectorAll(".htmlhead2");
        for (var i = 0; i < htmlhead2.length; i++) {
            htmlhead2[i].setAttribute("style", "display: none;");
        }
    }
}
//----------------------------------自定义工具类--------------------------------//


//------------类型判断工具类-----------//
//TODO 类型判断工具类


/**
 * 1、判断是否为数组
 * @param {Object} parameter 需要判断的对象
 */
function isArray(parameter) {
    return (typeof parameter == 'object') && parameter.constructor == Array;
}

/**
 * 2、判断是否为字符串
 * @param {Object} parameter 需要判断的对象
 */
function isString(parameter) {
    return (typeof parameter == 'string') && parameter.constructor == String;
}

/**
 * 3、判断是否为数值类型
 * @param {Object} parameter 需要判断的对象
 */
function isNumber(parameter) {
    return (typeof parameter == 'number') && parameter.constructor == Number;
}

/**
 * 4、判断是否为日期类型
 * @param {Object} parameter 需要判断的对象
 */
function isDate(parameter) {
    return (typeof parameter == 'object') && parameter.constructor == Date;
}

/**
 * 5、判断是否为函数  isFunction(需要判断的对象)
 * @param {Object} parameter 需要判断的对象
 */
function isFunction(parameter) {
    return (typeof parameter == 'function') && parameter.constructor == Function;
}

/**
 * 6、判断是否为对象 isObject(需要判断的对象)
 * @param {Object} parameter 需要判断的对象
 */
function isObject(parameter) {
    return (typeof parameter == 'object') && parameter.constructor == Object;
}

/**
 * 7、判断对象是否存在 isNotNull(需要判断的对象)
 * @param {Object} parameter 需要判断的对象
 */
function isNotNull(parameter) {
    return (typeof parameter != undefined) && parameter != null;
}

/**
 * 8、判断是否为布尔型 isBoolean(需要判断的对象)
 * @param {Object} parameter 需要判断的对象
 */
function isBoolean(parameter) {
    return (typeof parameter == 'boolean') && parameter.constructor == Boolean;
}

/**
 * 9、判断字符串方法名是否存在 isStrngFunction(需要判断的对象)
 * @param {Object} parameter 需要判断的对象
 */
function isStrngFunction(parameter) {
    return typeof (eval(parameter)) == "function";
}

/**
 * 10、判断是否为DOM对象 isDOM(需要判断的对象)
 * @param {Object} parameter 需要判断的对象
 */
function isDOM(parameter) {
    if (typeof HTMLElement === 'object') {
        return parameter instanceof HTMLElement;
    } else {
        return parameter && typeof parameter === 'object' && parameter.nodeType === 1 && typeof parameter.nodeName === 'string';
    }
}







//-----------------------------------自定义组件---------------------------------//
// TODO 自定义组件




//---------------自定义隐藏组件点击触发事件---------------//

//触发隐藏或显示
function onClickHide(divName) {

    if (isNotNull(divName)) {
        if (!isDOM(divName)) {
            divName = document.getElementById(divName);
        }

        if (myDIV.getAttribute("hide") == "true") {
            onClickHideFalse(divName);
        } else {
            onClickHideTrue(divName);
        }
    }
}

//隐藏DOM
function onClickHideTrue(divName) {

    if (isNotNull(divName)) {
        if (!isDOM(divName)) {
            divName = document.getElementById(divName);
        }

        divName.setAttribute("hide", "true");
    }

}

//显示DOM
function onClickHideFalse(divName) {

    if (isNotNull(divName)) {
        if (!isDOM(divName)) {
            divName = document.getElementById(divName);
        }

        divName.setAttribute("hide", "false");
    }
}



//-----------------------------------消息封装---------------------------------//
/**
 * TODO 消息封装
 *
 * 弹出提示消息封装
 *
 * 1、正确消息
 * 2、讯息消息
 * 3、警告消息
 * 4、错误消息
 * 5、普通消息
 *
 *
 */

/**
 * 1、正确消息
 * @param {Object} value 消息内容
 */
function CorrectMag(value) {
    layer.msg(value, { time: 2000 });
}

/**
 * 2、讯息消息
 * @param {Object} value 消息内容
 */
function MessageMag(value) {
    layer.msg(value, { time: 2000 });
}

/**
 * 3、警告消息
 * @param {Object} value 消息内容
 */
function WarningMag(value) {
    layer.msg(value, { time: 2000 });
}

/**
 * 4、错误消息
 * @param {Object} value 消息内容
 */
function ErrorMag(value) {
    layer.msg(value, { time: 2000 });
}

/**
 * 5、普通消息
 * @param {Object} value 消息内容
 */
function mag(value) {
    layer.msg(value, { time: 2000 });
}


/**
 * 用户打印网页日志
 * @param {Object} group 日志内容
 */
function Log(group) {
}




//-----------------------------------前后交互封装---------------------------------//
/**
 * TODO 前后交互封装
 *
 * 封装前后交互的AJAX方法，方便统一修改
 *
 * 1、ajax
 *
 *
 */


function PostData(url, formData, callback, nocallback, headerData) {

    $.ajax({
        type: 'POST',
        url: url,
        data: formData,
        headers: headerData,
        contentType: false,
        processData: false, //这个很有必要，不然不行
        dataType: "json",
        mimeType: "multipart/form-data",
        success: function (data) {
            //判断是否有返回结果
            if (isNotNull(data)) { //有

                if (data.status == 200) { //如果返回正确
                    //判断是否有正确回调方法
                    if (isNotNull(callback) && isFunction(callback)) { //有
                        //调用正确回调 并接受返回的参数
                        var information = callback(data.data);
                        //判断参数是否存在，并且是否为布尔型的false
                        if (isNotNull(information) && isBoolean(information) && information) {
                            CorrectMag(data.msg);
                        }
                    } else {
                        //提示操作成功
                        CorrectMag("操作成功");
                    }
                } else { //其他返回状态

                    //判断是否有错误回调
                    if (isNotNull(nocallback) && isFunction(nocallback)) { //有
                        //调用错误回调 并接受返回的参数
                        var information = nocallback(data.msg, data);
                        //判断参数是否存在，并且是否为布尔型的false
                        if (!isNotNull(information) || isBoolean(information) && information) { //如果不返回结果 或 返回的结果不是布尔型的false 则提示返回失败
                            //提示返回失败
                            ErrorMag(data.msg);
                        }
                    } else { //没有
                        //提示返回失败
                        ErrorMag(data.msg);
                    }

                }

            } else { //没有

                //判断是否有错误回调
                if (isNotNull(nocallback) && isFunction(nocallback)) { //有
                    //调用错误回调 并接受返回的参数
                    var information = nocallback();
                    //判断参数是否存在，并且是否为布尔型的false
                    if (!isNotNull(information) || isBoolean(information) && information) { //如果不返回结果 或 返回的结果不是布尔型的false 则提示返回失败
                        //提示返回失败
                        ErrorMag("服务器未返回结果");
                    }
                } else { //没有
                    //提示返回失败
                    ErrorMag("服务器未返回结果");
                }

            }

        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {

            //判断是否有错误回调
            if (isNotNull(nocallback) && isFunction(nocallback)) { //有
                //调用错误回调 并接受返回的参数
                var information = nocallback(event);

                //判断参数是否存在，并且是否为布尔型的false
                if (!isNotNull(information) || isBoolean(information) && information) { //如果不返回结果 或 返回的结果不是布尔型的false 则提示返回失败
                    //提示返回失败
                    if (event.status == 404) {

                        ErrorMag("找不到网址");

                    } else if (event.status == 500) {

                        ErrorMag("服务器内部出错");

                    } else {

                        ErrorMag("链接服务器出错");

                    }
                }

            } else { //没有

                //提示返回失败
                if (event.status == 404) {

                    ErrorMag("找不到网址");

                } else if (event.status == 500) {

                    ErrorMag("服务器内部出错");

                } else {

                    ErrorMag("链接服务器出错");

                }
            }
        }
    });
}

function PostData2(url, formData, callback, nocallback) {

    $.ajax({
        type: 'POST',
        url: url,
        data: formData,
        contentType: false,
        processData: false, //这个很有必要，不然不行
        dataType: "json",
        mimeType: "multipart/form-data",
        success: function (data) {
            if (isNotNull(callback)) {
                callback(data);
            }
        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {

            if (isNotNull(nocallback)) {
                nocallback(event, XMLHttpRequest, ajaxOptions, thrownError);
            }

        }
    });

}


//注册拦截器
function RegisterAxiosInterceptor() {

    let req = XMLHttpRequest;
    (function (open, send) {
        XMLHttpRequest.prototype.open = function (method, url, synchro) {
            this._url = url;
            open.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function () {
            try {
                var RequestHeader = GetRequestHeader(GetPostRequestURL(this._url));
                if (RequestHeader != null) {
                    this.setRequestHeader('studentAppToken', encodeURIComponent(RequestHeader));
                }
            } catch (e) { }
            send.apply(this, arguments);
        };
    })(req.prototype.open, XMLHttpRequest.prototype.send);

}

RegisterAxiosInterceptor();

//获取 requestURL
function GetPostRequestURL(url) {

    if (url != null && url.indexOf("http") == 0) {
        return url
    } else {
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPaht = curWwwPath.substring(0, pos);

        return localhostPaht + url;
    }


}

//文件下载
//通过iframe框架形式
//(缺点是无法下载链接文件带游览器可以识别的后缀名的文件 如 www.baidu.com/A.png (png、txt、jpg、pdf、html等后缀))
//用途是下载java控制的文件流，如OA的下载信件、可以兼容多平台
function downloadFileUtil(url, fileName) {
    if (IsIos()) {
        // 如果路径是 http 打头的，这里兼容下旧版的下载方式
        if (url.indexOf("http") == 0) {
            sendJsToIosAction({ method: "DownloadFile", url: url }, null);
        } else {
            var curWwwPath = window.document.location.href;
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            var localhostPaht = curWwwPath.substring(0, pos);
            sendJsToIosAction({ method: "DownloadFile", url: localhostPaht + url }, null);
        }

        return;
    } else if (IsAndorid()) {
        //如果版本大于
        if (getAppVersions() < 35) {
            //检查权限
            if (checkPermission(PermissionList['READ_EXTERNAL_STORAGE'].permissionName) && checkPermission(PermissionList['WRITE_EXTERNAL_STORAGE'].permissionName)) {
                return downloadFileUtilCallback(true, url, fileName);
            }
            //获取权限
            AppPermission([
                { name: "READ_EXTERNAL_STORAGE", msg: "校园通申请读取外部存储权限用户上传文件" },
                { name: "WRITE_EXTERNAL_STORAGE", msg: "校园通申请读取外部存储权限用户下载文件" },
            ], downloadFileUtilCallback, url);
        } else {
            downloadFileUtilCallback(true, url, fileName);
        }
    }
}



function downloadFileUtilCallback(isPer, url, fileName) {
    alert(url)
    if (isPer) {
        try {
            Message.tip("正在下载");
            const a = document.createElement('a');
            a.href = url
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            Message.tip("下载失败");
        }
    } else {
        Message.tip("没有下载权限");
    }

}

//文件下载
//通过a链接下载
//适用于 spring boot addResourceHandlers 映射文件目录文件的下载
function downladFileUtil2(url) {

    if (IsIos()) {
        downloadFileUtil(url);
    } else {

        //如果版本大于
        if (getAppVersions() < 35) {

            //检查权限
            if (checkPermission(PermissionList['READ_EXTERNAL_STORAGE'].permissionName) && checkPermission(PermissionList['WRITE_EXTERNAL_STORAGE'].permissionName)) {
                return downladFileUtil2Callback(true, url);
            }

            //获取权限
            AppPermission([
                { name: "READ_EXTERNAL_STORAGE", msg: "校园通申请读取外部存储权限用户上传文件" },
                { name: "WRITE_EXTERNAL_STORAGE", msg: "校园通申请读取外部存储权限用户下载文件" },
            ], downladFileUtil2Callback, url);

        } else {
            downladFileUtil2Callback(true, url);
        }

    }

}

function downladFileUtil2Callback(isPer, url) {

    if (isPer) {

        if (url.indexOf("studentAppToken") == -1) {
            var RequestHeader = GetRequestHeader(GetPostRequestURL(url));
            if (url.indexOf("?") != -1) {
                url += "&studentAppToken=" + encodeURIComponent(RequestHeader);
            } else {
                url += "?studentAppToken=" + encodeURIComponent(RequestHeader);
            }
        }

        var mySrc = document.getElementById("appMainJSinDownloadFileaUtil2");
        if (isNotNull(mySrc) && mySrc != null) {
            mySrc.style.display = "none";
            mySrc.download = "";
            mySrc.href = url;
            mySrc.click();
        } else {
            var mySrc = document.createElement("a");
            mySrc.id = "appMainJSinDownloadFileaUtil2";
            mySrc.style.display = "none";
            mySrc.download = "";
            mySrc.href = url;
            document.body.appendChild(mySrc);
            mySrc.click();
        }

    } else {
        if (typeof layer != "undefined") {
            mag("没有下载权限");
        } else {
            vueToast("没有下载权限");
        }
    }

}

//文件下载
//安卓原生下载
//适用于 oss下载文件
function AndroidDownloadFiles(url, name, downedCallback) {

    if (!IsAndorid()) {
        if (typeof layer != "undefined") {
            mag("该方法为安卓调用");
        } else {
            vueToast("该方法为安卓调用");
        }
        return;
    }

    if (getAppVersions() < 27) {
        if (typeof layer != "undefined") {
            mag("请升级最新版本下载");
        } else {
            vueToast("请升级最新版本下载");
        }
        return;
    }

    //如果版本大于
    if (getAppVersions() < 35) {

        //检查权限
        if (checkPermission(PermissionList['READ_EXTERNAL_STORAGE'].permissionName) && checkPermission(PermissionList['WRITE_EXTERNAL_STORAGE'].permissionName)) {
            return AndroidDownloadFilesCallback({ "url": url, "name": name }, downedCallback);
        }

        //获取权限
        AppPermission([
            { name: "READ_EXTERNAL_STORAGE", msg: "校园通申请读取外部存储权限用户上传文件" },
            { name: "WRITE_EXTERNAL_STORAGE", msg: "校园通申请读取外部存储权限用户下载文件" },
        ], AndroidDownloadFilesCallback, { "url": url, "name": name }, downedCallback);

    } else {
        AndroidDownloadFilesCallback({ "url": url, "name": name }, downedCallback);
    }

}

function AndroidDownloadFilesCallback(data, downedCallback) {
    AndroidtoJs.AndroidDownloadFile(data.url, 'filename=' + data.name);
    if (downedCallback != null) {
        downedCallback();
    }
}


/**
 * 获取主机路径+项目路径
 * 如： http://localhost:8083/uimcardprj
 */
function getRootPath_web() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}

//-----------------------------------Data处理---------------------------------//
/**
 * TODO Data处理
 *
 * Data处理
 *
 * 1、ajax
 *
 *
 */
function DateFormat(mask, Date) {
    var d = Date;

    var zeroize = function (value, length) {

        if (!length) length = 2;

        value = String(value);

        for (var i = 0, zeros = ''; i < (length - value.length); i++) {

            zeros += '0';

        }

        return zeros + value;

    };

    return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {

        switch ($0) {

            case 'd':
                return d.getDate();

            case 'dd':
                return zeroize(d.getDate());

            case 'ddd':
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];

            case 'dddd':
                return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];

            case 'M':
                return d.getMonth() + 1;

            case 'MM':
                return zeroize(d.getMonth() + 1);

            case 'MMM':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];

            case 'MMMM':
                return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];

            case 'yy':
                return String(d.getFullYear()).substr(2);

            case 'yyyy':
                return d.getFullYear();

            case 'h':
                return d.getHours();

            case 'hh':
                return zeroize(d.getHours());

            case 'H':
                return d.getHours();

            case 'HH':
                return zeroize(d.getHours());

            case 'm':
                return d.getMinutes();

            case 'mm':
                return zeroize(d.getMinutes());

            case 's':
                return d.getSeconds();

            case 'ss':
                return zeroize(d.getSeconds());

            case 'l':
                return zeroize(d.getMilliseconds(), 3);

            case 'L':
                var m = d.getMilliseconds();

                if (m > 99) m = Math.round(m / 10);

                return zeroize(m);

            case 'tt':
                return d.getHours() < 12 ? 'am' : 'pm';

            case 'TT':
                return d.getHours() < 12 ? 'AM' : 'PM';

            case 'Z':
                return d.toUTCString().match(/[A-Z]+$/);

            // Return quoted strings with the surrounding quotes removed

            default:
                return $0.substr(1, $0.length - 2);

        }

    });

};




//------------计算表格条数--------//

//计算表格条数
function getLimit(myFixedHeight) {
    //获取body展示高度
    var ClientHeight = document.body.clientHeight;
    //导航栏加路径固定高度
    var TopHeight = 50;
    //表格外其他元素占用高度
    var FixedHeight = myFixedHeight;
    //表格自己固定占用高度 39表头高度 + 41页脚高度 + 5表格上边距 + 5 表格下边距
    var TableHeight = 39 + 41 + 5 + 5;
    //每行高度
    var trHeight = 39;

    //计算行数
    var Limit = parseInt((ClientHeight - TopHeight - FixedHeight - TableHeight) / trHeight);

    if (isNumber(Limit)) {
        if (Limit > 0) {
            return Limit;
        } else {
            return 15;
        }
    } else {
        return 15;
    }
}




//-----------------------------------Android 交互---------------------------------//
/**
 * TODO Android 交互
 *
 * Android\微信\H5\IOS 与页面的交互
 *
 *
 */

//旧学生管理系统地址
var StudentMagOldURL = "http://47.115.177.118/stuManagement/";

/**
 *
 * 判断当前处于什么设备上
 *
 * 返回
 * 1、游览器网页
 * 2、AndroidApp
 * 3、微信
 * 4、IOS
 *
 */
function isDevice() {

    if (IsAndorid()) {
        return 2; //安卓App环境
    } else if (IsWeiXinBrowser()) {
        return 3 //微信小程序环境
    } else if (IsIos()) {
        return 4; //苹果手机App环境
    } else if (IsFlutterIos()) {
        return 5; //flutter苹果环境
    } else if (IsFlutterAndroid()) {
        return 6; //flutter安卓环境
    } else {
        return 1; //游览器环境
    }
}


//判断是否为微信小程序环境
function IsWeiXinBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    var isWeixin = ua.indexOf("micromessenger") != -1;
    if (isWeixin) {
        return true;
    } else {
        return false;
    }
}

//判断是否为Andoid环境
function IsAndorid() {
    if (typeof AndroidtoJs != undefined && typeof AndroidtoJs != "undefined") {
        return true;
    } else {
        return false;
    }
}


//如果是IOS
function IsIos() {

    var u = navigator.userAgent;
    // 判断是原生webView，而非safari
    return (((u.indexOf('iPhone') > -1) || (u.indexOf('iPad') > -1)) && (u.indexOf('Safari') == -1));
}

/* ios交互逻辑 兼容UIWebView和WKWebView */
function sendJsToIosAction(parm = {}, callback) {
    try {
        callback();
    } catch (e) {
        var payload = { "type": "JSbridge", "arguments": parm };
        return prompt(JSON.stringify(payload));
    }
}

//判断是否为FlutterIos
function IsFlutterIos() {

    if (typeof isFlutterIosFlag != undefined && typeof isFlutterIosFlag != "undefined") {
        return true;
    } else {
        return false;
    }

}

//判断是否为FlutterAndroidApp
function IsFlutterAndroid() {

    if (typeof isFlutterAndroidFlag != undefined && typeof isFlutterAndroidFlag != "undefined") {
        return true;
    } else {
        return false;
    }
}


/**
 *
 * 跳转到被标记的特殊界面
 *
 * 0、关闭所有界面并跳转到登入界面（注意该动作不包含退出，跳转之前需要手动退出）
 * 1、关闭所有界面并跳转到主页
 *
 * @param {Object} ActivityID 数字
 */
function GoToActivity(ActivityID) {

    if (IsAndorid()) {

        AndroidtoJs.GoToActivity(ActivityID);

    } else if (IsWeiXinBrowser()) {

        if (ActivityID == 0) {
            wx.miniProgram.reLaunch({ url: '/pages/Login/Login' });
        } else if (ActivityID == 1) {
            wx.miniProgram.reLaunch({ url: '/pages/Home/Home' });
        }

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "GoToActivity", "tag": ActivityID }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        GoToActivityFlutter.postMessage(ActivityID);
    } else {

        var myURL = "";

        if (ActivityID == 0) {
            myURL = getRootPath_web() + "/Login/Login";
        } else if (ActivityID == 1) {
            myURL = getRootPath_web() + "/Home/Home";
        }

        window.location.href = myURL;

    }
}


/**
 *
 * 跳转到被标记的特殊界面（针对开锁增加版本判断）
 *
 * 3、跳转到开锁界面
 * 4、跳转到开锁界面默认开锁
 *
 * @param {Object} ActivityID 数字
 */
function GoToUnLockActivity(ActivityID) {
    if (IsAndorid()) {

        if (getAppVersions() > 28) {
            AndroidtoJs.GoToActivity(ActivityID);
        } else {
            GoInToActivity('doorLock/openDoor')
        }

    } else if (IsWeiXinBrowser()) {

        if (ActivityID == 0) {
            wx.miniProgram.reLaunch({ url: '/pages/Login/Login' });
        } else if (ActivityID == 1) {
            wx.miniProgram.reLaunch({ url: '/pages/Home/Home' });
        }

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "GoToActivity", "tag": ActivityID }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        GoToActivityFlutter.postMessage(ActivityID);
    } else {

        var myURL = "";

        if (ActivityID == 0) {
            myURL = getRootPath_web() + "/Login/Login";
        } else if (ActivityID == 1) {
            myURL = getRootPath_web() + "/Home/Home";
        }

        window.location.href = myURL;

    }
}



/**
 * 退出该页面
 *
 * 退出当前页面并回到之前的页面
 * tag (null 或 0) 即主动点击返回按钮退出
        (1)  即到新页面，要关闭上一页面
 */
function Activityfinish(tag) {

    if (IsAndorid()) {

        AndroidtoJs.Activityfinish();

    } else if (IsWeiXinBrowser()) {

        wx.miniProgram.navigateBack({ delta: 1 });

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "Activityfinish", "tag": tag }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        ActivityFinishFlutter.postMessage('A');
    } else {
        window.history.go(-1);

    }

}

/**
*  iOS适用
 * 无感关闭上一页面 (注意：返回按钮不要用)
 * iOS必须新页面打开后关闭上一页面，使用下面的方法
 * time 超时时间 毫秒
 */
function ClosePreviousPage(time) {
    //类型保护
    var timeout = parseInt(time);
    if (isNaN(timeout)) {
        timeout = 0;
    }

    if (IsIos()) {
        setTimeout(function () {
            sendJsToIosAction({ "method": "ClosePreviousPage" }, null);
        }, timeout);//延迟 秒

    }
}

/**
 * 视图页面跳转到系统内指定URL
 *
 * 注意：这个跳转的URL只带后半部分，前面IP或域名部分由App填补
 * 		因此这个方法只允许跳转到系统内部的页面
 * 		这个方法也是系统内跳转的主要方法
 *
 * 注意：这个方法只能跳转到项目StudentApp内的页面，旧App的stuManagement页面由toSystemActivity方法跳转
 *
 * @param {Object} URL
 */
function GoInToActivity(URL) {


    if (IsAndorid()) {

        AndroidtoJs.GoInToActivity(URL);

    } else if (IsWeiXinBrowser()) {

        if (URL.indexOf("?") != -1) {

            var myUrl = URL.split('?')[0];
            var myData = URL.split('?')[1].replace(/&/g, '#');
            myData = myData.replace(/=/g, '!');

            wx.miniProgram.navigateTo({ url: '/pages/SystemActivity/SystemActivity?url=' + myUrl + '&data=' + myData });
        } else {
            wx.miniProgram.navigateTo({ url: '/pages/SystemActivity/SystemActivity?url=' + URL });
        }

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "GoInToActivity", "URL": URL }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        GoInToActivityFlutter.postMessage(URL);
    } else {

        window.location.href = getRootPath_web() + "/" + URL;

    }

}

/**
 * 视图页面跳转到 旧学生管理系统页面
 *
 * 注意：这个跳转的URL只带后半部分，前面IP或域名部分由App填补
 * 		因此这个方法只允许跳转到【旧学生管理系统内部】的页面
 * 		这个方法也是系统内跳转的主要方法
 *
 * 注意：这个方法只能跳转到旧App的stuManagement页面
 *
 * @param {Object} URL
 */
function toSystemActivity(URL) {

    if (IsAndorid()) {

        AndroidtoJs.toSystemActivity(URL);

    } else if (IsWeiXinBrowser()) {

        if (URL.indexOf("?") != -1) {

            var myUrl = URL.split('?')[0];
            var myData = URL.split('?')[1].replace(/&/g, '#');
            myData = myData.replace(/=/g, '!');

            wx.miniProgram.navigateTo({ url: '/pages/OldSystemActivity/OldSystemActivity?url=' + myUrl + '&data=' + myData });
        } else {
            wx.miniProgram.navigateTo({ url: '/pages/OldSystemActivity/OldSystemActivity?url=' + URL });
        }

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "toSystemActivity", "URL": URL }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        toSystemActivityFlutter.postMessage(URL);
    } else {

        window.location.href = StudentMagOldURL + URL;

    }

}

/**
 * 自定义跳到内部页面
 *
 *
 **/

function toSystemPublicActivity(url) {

    if (IsAndorid()) {

        AndroidtoJs.toPlayPublicActivity(url);

    } else if (IsWeiXinBrowser()) {

        if (url.indexOf("?") != -1) {

            var myUrl = url.split('?')[0];
            var myData = url.split('?')[1].replace(/&/g, '#');
            myData = myData.replace(/=/g, '!');

            wx.miniProgram.navigateTo({ url: '/pages/PublicActivity/PublicActivity?url=' + myUrl + '&data=' + myData });
        } else {
            wx.miniProgram.navigateTo({ url: '/pages/PublicActivity/PublicActivity?url=' + url });
        }

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "toPlayPublicActivity", "URL": url }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

/**
 * 跳转到系统外部的页面
 *
 * 跳转到非学生系统页面 如学校地图、学校论坛、百度贴吧、新浪 等与学生系统无关的页面
 *
 *
 **/
function toPublicActivity(url) {

    if (IsAndorid()) {

        AndroidtoJs.toPublicActivity(url);

    } else if (IsWeiXinBrowser()) {

        if (url.indexOf("?") != -1) {

            var myUrl = url.split('?')[0];
            var myData = url.split('?')[1].replace(/&/g, '#');
            myData = myData.replace(/=/g, '!');

            wx.miniProgram.navigateTo({ url: '/pages/PublicActivity/PublicActivity?url=' + myUrl + '&data=' + myData });
        } else {
            wx.miniProgram.navigateTo({ url: '/pages/PublicActivity/PublicActivity?url=' + url });
        }

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "toPublicActivity", "URL": url }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        toPublicActivityFlutter.postMessage(url);
    } else {

        window.open(url);

    }

}

/**
 * 跳转到支付保护页面
 *
 * 跳转到系统支付保护页面
 *
 *
 **/
function toPlayPublicActivity(url, payType) {

    if (IsAndorid()) {

        AndroidtoJs.toPlayPublicActivity(url);

    } else if (IsWeiXinBrowser()) {

        if (url.indexOf("?") != -1) {

            var myUrl = url.split('?')[0];
            var myData = url.split('?')[1].replace(/&/g, '#');
            myData = myData.replace(/=/g, '!');

            wx.miniProgram.navigateTo({ url: '/pages/PlayPublicActivity/PlayPublicActivity?url=' + myUrl + '&data=' + myData });
        } else {
            wx.miniProgram.navigateTo({ url: '/pages/PlayPublicActivity/PlayPublicActivity?url=' + url });
        }

    } else if (IsIos()) {
        if (typeof (payType) == "undefined" || payType == null) {
            sendJsToIosAction({ "method": "toPlayPublicActivity", "URL": url }, null);
        } else {
            // h5掉起原生支付，走原生SDK支付流程
            var params = {
                "data": url,
                "payType": payType
            };
            sendJsToIosAction({ "method": "appPayByNativePay", "params": params }, function () {
                try {
                    appPayByNativePayFlutter.postMessage(params);
                } catch (error) {
                    JstoNative.appPayByNativePay(params);
                }
            });
        }
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        toPlayPublicActivityFlutter.postMessage(url);
    } else {
        window.location = url;
    }

}



/**
 * Android 刷新当前页面
 *
 * 效果同游览器的刷新
 *
 **/
function reloadWebView() {

    if (IsAndorid()) {

        AndroidtoJs.reloadWebView();

    } else if (IsWeiXinBrowser()) {

        window.location.reload();

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "reloadWebView" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        reloadWebViewFlutter.postMessage('A');
    } else {

        window.location.reload();

    }

}

/**
 * 用系统游览器打开网页
 */
function toHTML(URL) {

    if (IsAndorid()) {

        AndroidtoJs.toHTMLs(URL);

    } else if (IsWeiXinBrowser()) {

        if (URL.indexOf("?") != -1) {

            var myUrl = URL.split('?')[0];
            var myData = URL.split('?')[1].replace(/&/g, '#');
            myData = myData.replace(/=/g, '!');

            wx.miniProgram.navigateTo({ url: '/pages/PublicActivity/PublicActivity?url=' + myUrl + '&data=' + myData });
        } else {
            wx.miniProgram.navigateTo({ url: '/pages/PublicActivity/PublicActivity?url=' + URL });
        }

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "toHTMLs", "URL": URL }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        toHTMLFlutter.postMessage(URL);
    } else {

        window.open(URL);

    }

}


/**
 * Android 返回界面触发
 **/
function AndroidUpdateHTML() {
    if ((typeof UpdateHTML == 'function') && UpdateHTML.constructor == Function) {
        UpdateHTML();
    }
}


//-----------------------------------Android 同步Cookie---------------------------------//

//同步Cookie
function SyncCookie() {

    if (IsAndorid()) {

        AndroidtoJs.SyncCookie();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "SyncCookie" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        SyncCookieFlutter.postMessage('A');
    } else {

    }

}

//清理登入Cookie
function CleanCookie() {

    if (IsAndorid()) {

        AndroidtoJs.CleanCookie();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

//-----------------------------------Android 定位---------------------------------//
/**
 * TODO Android 定位
 *
 * Android\微信\H5\IOS 调用原生定位模块
 *
 *
 *
 */



//定位方法对象
var JsLocationCallbackObject = {
    OneLocationCallback: null //一次定位的回调函数
    ,
    OneLocation: null //一次定位结果
    ,
    ContinuedLocationCallback: null //连续定位回调
    ,
    ContinuedLocation: null //连续定位结果
    ,
    locSdk: 1 //定位SDK 1百度定位（返回的是百度坐标） 2腾讯定位（返回的是火星坐标）
    ,
    classType: 1 //定位回调对象 1新回调对象 2旧回调对象（旧回调对象只允许旧学生管理系统使用）
};


//设置调用的定位SDK 1百度定位 2腾讯定位
function setJsLocationCallbackObjectLocSdk(locSdk) {

    JsLocationCallbackObject.locSdk = locSdk;

}

//设定获取的回调对象 1新回调对象 2旧回调对象
function setJsLocationCallbackObjectClassType(classType) {
    JsLocationCallbackObject.classType = classType;
}

/**
 * 调用一次定位
 */
function OneLocation(OneLocationCallback) {

    JsLocationCallbackObject.OneLocationCallback = OneLocationCallback;

    if (IsAndorid()) {

        AndroidtoJs.OneLocation(JsLocationCallbackObject.locSdk, JsLocationCallbackObject.classType);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "OneLocation", "locSdk": JsLocationCallbackObject.locSdk, "classType": JsLocationCallbackObject.classType }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        OneLocationFlutter.postMessage(JsLocationCallbackObject.locSdk, JsLocationCallbackObject.classType);
    } else {

    }
}

/**
 * 安卓定位回调的函数
 */
function JsOneLocationCallback(Location) {
    JsLocationCallbackObject.OneLocation = eval('(' + Location + ')');

    if (isNotNull(JsLocationCallbackObject.OneLocationCallback) && isString(JsLocationCallbackObject.OneLocationCallback)) {
        if (typeof (eval(JsLocationCallbackObject.OneLocationCallback)) == "function") {
            eval(JsLocationCallbackObject.OneLocationCallback + "(JsLocationCallbackObject.OneLocation);");
        }
    } else if (isNotNull(JsLocationCallbackObject.OneLocationCallback) && isFunction(JsLocationCallbackObject.OneLocationCallback)) {
        JsLocationCallbackObject.OneLocationCallback(JsLocationCallbackObject.OneLocation);
    }

}

/**
 * 开启连续定位
 */
function OpenContinuedLocation(ContinuedLocationCallback) {

    JsLocationCallbackObject.ContinuedLocationCallback = ContinuedLocationCallback;

    if (IsAndorid()) {

        AndroidtoJs.OpenLocation(JsLocationCallbackObject.locSdk, JsLocationCallbackObject.classType);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "OpenLocation", "locSdk": JsLocationCallbackObject.locSdk, "classType": JsLocationCallbackObject.classType }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        OpenContinuedLocationFlutter.postMessage(JsLocationCallbackObject.locSdk, JsLocationCallbackObject.classType);
    } else {

    }

}

/**
 * 停止连续定位
 */
function StopContinuedLocation() {

    if (IsAndorid()) {

        AndroidtoJs.StopLocation(JsLocationCallbackObject.locSdk);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "StopLocation", "locSdk": JsLocationCallbackObject.locSdk }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        StopContinuedLocationFlutter.postMessage(JsLocationCallbackObject.locSdk);
    } else {

    }
}


/**
 * 安卓连续定位回调的函数
 */
function JsLocationCallback(Location) {
    JsLocationCallbackObject.ContinuedLocation = eval('(' + Location + ')');

    if (isNotNull(JsLocationCallbackObject.ContinuedLocationCallback) && isString(JsLocationCallbackObject.ContinuedLocationCallback)) {
        if (typeof (eval(JsLocationCallbackObject.ContinuedLocationCallback)) == "function") {
            eval(JsLocationCallbackObject.ContinuedLocationCallback + "(JsLocationCallbackObject.ContinuedLocation);");
        }
    } else if (isNotNull(JsLocationCallbackObject.ContinuedLocationCallback) && isFunction(JsLocationCallbackObject.ContinuedLocationCallback)) {
        JsLocationCallbackObject.ContinuedLocationCallback(JsLocationCallbackObject.ContinuedLocation);
    }

}


/**
 * 获取连续定位结果
 */
function GetContinuedLocation() {
    return JsLocationCallbackObject.ContinuedLocation;
}

/**
 * 坐标转换 将腾讯火星坐标 转换为 百度坐标
 */
function gcj02Tobd0911(longitude, latitude) {

    if (IsAndorid()) {

        var str = AndroidtoJs.gcj02Tobd0911(longitude, latitude);
        return eval('(' + str + ')');

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        var str = sendJsToIosAction({ "method": "gcj02Tobd0911", "longitude": longitude, "latitude": latitude }, null);
        return eval('(' + str + ')');
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        gcj02Tobd0911Flutter.postMessage(longitude, latitude);
    } else {

    }

}


//-----------------------------------Android 二维码---------------------------------//
/**
 * TODO Android 二维码
 *
 * Android\微信\H5\IOS 调用设备拍摄二维码并解析
 *
 *
 *
 */


var QRCodeCallbackObject = {
    QrCodeCallback: null
};
/**
 * 调用二维码
 * @param {Object} HuiDiaoHanShu 回调函数的函数名
 * 回调函数必须有一个参数 这个参数为二维码字符串
 */
function getQRCode(QrCodeCallback) {
    QRCodeCallbackObject.QrCodeCallback = QrCodeCallback;

    if (IsAndorid()) {

        AndroidtoJs.ScanQRcode();

    } else if (IsWeiXinBrowser()) {

        var MyQrUrl = "";

        if (typeof QrUrlString != undefined && typeof QrUrlString != "undefined" && QrUrlString != null) {
            MyQrUrl = QrUrlString;
        } else {
            //获取完整地址
            MyQrUrl = window.document.location.href;
        }

        if (MyQrUrl.indexOf("?") != -1) {

            var myUrl = MyQrUrl.split('?')[0];
            var myData = MyQrUrl.split('?')[1].replace(/&/g, '#');
            myData = myData.replace(/=/g, '!');

            wx.miniProgram.redirectTo({ url: '/pages/qrCode/qrCode?url=' + myUrl + '&data=' + myData });
        } else {
            wx.miniProgram.redirectTo({ url: '/pages/qrCode/qrCode?url=' + MyQrUrl });
        }

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "ScanQRcode" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        getQRCodeFlutter.postMessage('A');
    } else {

    }

}


/**
 * 二维码回调
 */
function JsQrCodeCallback(QRcode) {

    if (isNotNull(QRCodeCallbackObject.QrCodeCallback) && isString(QRCodeCallbackObject.QrCodeCallback)) {
        if (typeof (eval(QRCodeCallbackObject.QrCodeCallback)) == "function") {
            eval(QRCodeCallbackObject.QrCodeCallback + "(QRcode);");
        }
    } else if (isNotNull(QRCodeCallbackObject.QrCodeCallback) && isFunction(QRCodeCallbackObject.QrCodeCallback)) {
        QRCodeCallbackObject.QrCodeCallback(QRcode);
    }

}


//-----------------------------------Android 文件下载---------------------------------//
/**
* TODO Android 文件下载
*
* Android\微信\H5\IOS 暂未实现
*
*
*
*/


/**
* 安卓下载文件（暂未实现）
*/
function getFile3(URL, Name) {

    downloadFileUtil(URL);

}


//文件选择器
var JFileChooserObject = {
    FileCallback: null //文件回调方法
    , FileCallbackData: null //回调数据
    , FileUri: null //读取到的文件地址
    , File: null //读取到的文件
    , ReadFileFlag: true //是否是在读取文件（读取文件后置空也会触发一次onchange,忽略掉这次触发）
    , FileType: {
        ALL_TYPE: "ALL_TYPE" //通过文件选择器选择任意文件
        , IMAGE_TYPE: "IMAGE_TYPE" //通过文件选择器选择图片文件
        , CIDEO_TYPE: "CIDEO_TYPE" //通过文件选择器选择视频文件
        , AUDIO_TYPE: "AUDIO_TYPE" //通过文件选择器选择音频文件
        , CAMERA_1_TYPE: "CAMERA_1_TYPE" //通过摄像头拍照
        , CAMERA_1_ZIP_TYPE: "CAMERA_1_ZIP_TYPE" //通过摄像头拍照并压缩图像
        , IMAGEORCAMERA_TYPE: "IMAGEORCAMERA_TYPE" //通过摄像头拍照并压缩图像
        , VIDEOTAPE_TYPE: "VIDEOTAPE_TYPE" //通过摄像头拍照并压缩图像
    }
    , Multiple: false
};


//获取文件选择器对象的类型列表（尽量不要直接调用文件对象，防止改对象名）
function JFileType() {
    return JFileChooserObject.FileType;
}

//设置是否多选
function JFileMultiple() {
    JFileType().Multiple = true;
}

function JFileObject() {
    return JFileChooserObject;
}

/**
* 选择文件
*
* @param {Object} type
* @param {Object} FileCallback //回调方法可以接受3个参数 文件地址、文件、Input
*/
function JFileChooser(type, FileCallback, FileCallbackData, isGetFile) {
    JFileChooserObject.FileCallback = FileCallback;
    JFileChooserObject.FileCallbackData = FileCallbackData;
    JFileChooserObject.isGetFile = isGetFile;

    //Log("IsAndorid:" + IsAndorid);
    if (IsAndorid()) {

        //Log("获取文件类型:" + type);
        if (AndroidJFileChooserObjectType[type] != null) {
            type = AndroidJFileChooserObjectType[type];
        }

        AndroidtoJs.setJFileChooserType(type);

        if (type == "$camera1/*" || type == "$camera1zip/*") {
            //获取权限
            if ((typeof AppPermission == 'function') && AppPermission.constructor == Function) {
                var cameraCallback = function (isPer, myType) {
                    AndroidGetFile(myType);
                }
                AppPermission([
                    { name: "CAMERA", msg: "校园通需要摄像头权限用于拍照" },
                    { name: "READ_EXTERNAL_STORAGE", msg: "校园通需要读取外部存储器用于读取照片" },
                    { name: "WRITE_EXTERNAL_STORAGE", msg: "校园通需要写入外部存储器用于存储照片" },
                ], cameraCallback, type);
                return;
            }
        }

        if (type == "$videotape_real/*") {
            //获取权限
            if ((typeof AppPermission == 'function') && AppPermission.constructor == Function) {
                var cameraCallback = function (isPer, myType) {
                    AndroidGetFile(myType);
                }
                AppPermission([
                    { name: "CAMERA", msg: "校园通需要摄像头权限用于录制人脸信息" },
                    { name: "RECORD_AUDIO", msg: "校园通需要录音用于录制人脸信息" },
                    { name: "READ_EXTERNAL_STORAGE", msg: "校园通需要读取外部存储器用于人脸信息文件" },
                    { name: "WRITE_EXTERNAL_STORAGE", msg: "校园通需要写入外部存储器用于存储人脸信息文件" },
                ], cameraCallback, type);
                return;
            }
        }

        AndroidGetFile(type);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        // iOS如果需要选全部类型文件，type要为空
        if (type == JFileType().ALL_TYPE) type = "";
        AndroidGetFile(type);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        JFileChooserFlutter.postMessage(type);
    } else {
        AndroidGetFile(type);
    }

}



//Android默认配置
var AndroidJFileChooserObjectType = {
    ALL_TYPE: "*/*" //通过文件选择器选择任意文件
    ,
    IMAGE_TYPE: "image/*" //通过文件选择器选择图片文件
    ,
    CIDEO_TYPE: "video/*" //通过文件选择器选择视频文件
    ,
    AUDIO_TYPE: "audio/*" //通过文件选择器选择音频文件
    ,
    CAMERA_1_TYPE: "$camera1/*" //通过摄像头拍照
    ,
    CAMERA_1_ZIP_TYPE: "$camera1zip/*" //通过摄像头拍照并压缩图像
    ,
    IMAGEORCAMERA_TYPE: "$imageorcamera1/*"//选择图片或摄像头
    ,
    VIDEOTAPE_TYPE: "$videotape_real/*"//活体识别录像
}

//安卓环境下选择文件
function AndroidGetFile(type) {

    //如果调用的是预设值
    if (AndroidJFileChooserObjectType[type] != null) {
        type = AndroidJFileChooserObjectType[type];
    }
    Log("A7");
    var FileInput = document.getElementById("appMainGetFileInput");
    if (isNotNull(FileInput) && FileInput != null) {
        FileInput.accept = type;//设置类型
        if (JFileType().Multiple) {//设置是否多选
            FileInput.multiple = true;
        } else {
            FileInput.multiple = false;
        }
        Log("A8");
        FileInput.click();
        JFileObject().Multiple = false;
    } else {
        var FileInput = document.createElement("input");
        FileInput.style.display = "none";
        FileInput.accept = type;
        FileInput.type = "file";
        FileInput.id = "appMainGetFileInput";
        FileInput.onchange = InputGetFile;
        if (JFileType().Multiple) {//设置是否多选
            FileInput.multiple = true;
        } else {
            FileInput.multiple = false;
        }

        document.body.appendChild(FileInput);
        Log("A8");
        FileInput.click();
        JFileObject().FileInput = FileInput;
        JFileObject().Multiple = false;
    }

}



//获取到文件
function InputGetFile() {
    Log("A9");

    var FileInput = document.getElementById("appMainGetFileInput");

    if (FileInput.files.length > 0 && FileInput.value.length > 0) {

        JFileChooserObject.FileUri = FileInput.files[0];

        if (JFileChooserObject.isGetFile != null && JFileChooserObject.isGetFile) {
            //创建读取文件的对象
            var reader = new FileReader();

            //为文件读取成功设置事件
            reader.onload = function (e) {
                JFileChooserObject.File = e.target.result;
                if (isNotNull(JFileChooserObject.FileCallback) && isString(JFileChooserObject.FileCallback)) {
                    if (typeof (eval(JFileChooserObject.FileCallback)) == "function") {
                        eval(JFileChooserObject.FileCallback + "(JFileChooserObject.FileUri,JFileChooserObject.File,JFileChooserObject.FileInput,JFileChooserObject.FileCallbackData);");
                    }
                } else if (isNotNull(JFileChooserObject.FileCallback) && isFunction(JFileChooserObject.FileCallback)) {
                    JFileChooserObject.FileCallback(JFileChooserObject.FileUri, JFileChooserObject.File, JFileChooserObject.FileInput, JFileChooserObject.FileCallbackData);
                }
            }

            //正式读取文件
            reader.readAsDataURL(JFileChooserObject.FileUri);
        } else {

            if (isNotNull(JFileChooserObject.FileCallback) && isString(JFileChooserObject.FileCallback)) {
                if (typeof (eval(JFileChooserObject.FileCallback)) == "function") {
                    eval(JFileChooserObject.FileCallback + "(JFileChooserObject.FileUri,null,JFileChooserObject.FileInput,JFileChooserObject.FileCallbackData);");
                }
            } else if (isNotNull(JFileChooserObject.FileCallback) && isFunction(JFileChooserObject.FileCallback)) {
                JFileChooserObject.FileCallback(JFileChooserObject.FileUri, null, JFileChooserObject.FileInput, JFileChooserObject.FileCallbackData);
            }

        }


    }


}





//-----------------------------------Android 更新App---------------------------------//
/**
 * TODO Android 更新App
 *
 * Android\微信\H5\IOS 暂未实现
 *
 *
 *
 */


/**
 * 获取APP版本号(版本名)
 *
 */

function getVersionName() {

    if (IsAndorid()) {

        return AndroidtoJs.getVersionName();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        var version = sendJsToIosAction({ "method": "getVersionName" }, null);
        return version;
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        getVersionNameFlutter.postMessage('A');
    }

    return "";

}


/**
 * 获取APP版本号(版本编号)
 *
 */

function getAppVersions() {

    if (IsAndorid()) {

        return AndroidtoJs.getVersionCode();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        var code = sendJsToIosAction({ "method": "getVersionCode" }, null);
        return code;
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        getAppVersionsFlutter.postMessage('A');
    }

    return -1;

}



//-----------------------------------Android 剪切板---------------------------------//
/**
 * TODO Android 剪切板
 *
 * Android\微信\H5\IOS 剪切板
 *
 *
 *
 */
function toShearPlate(str) {


    if (IsAndorid()) {

        AndroidtoJs.setShearPlate(str);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        var str = sendJsToIosAction({ "method": "setShearPlate", "param": str }, null);
        return str;
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        toShearPlateFlutter.postMessage(str);
    } else {

    }


}


function GetRequestHeader(url) {


    if (IsAndorid()) {

        return AndroidtoJs.getToken(url);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        var ret = sendJsToIosAction({
            "method": "HookRequestGenTokenV2",
            "url": url,
            "current_url": window.location.href,
        });
        if (ret && ret.length > 0) {
            return ret;
        }
    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}


//-----------------------------------Android 蓝牙---------------------------------//
/**
 * TODO Android 蓝牙
 *
 * Android\微信\H5\IOS 蓝牙
 *
 *
 *
 */

var BlouetoothCallbackObject = null;

/**
 * 是否有蓝牙，并注册蓝牙回调函数
 */
function registerBlouetoothCallback(BlouetoothCallback) {

    BlouetoothCallbackObject = BlouetoothCallback;

    if (IsAndorid()) {

        return true;

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        return true;
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        registerBlouetoothCallbackFlutter.postMessage('A');
    } else {

    }

}

/**
 * 蓝牙回调函数
 */
function JsBlouetoothCallbackFunction(type, Mac, Name, Object) {

    var device = null;
    if (Object != null && Object != "null") {
        device = eval('(' + Object + ')');
    }

    var mag = "";

    if (type == 1) {
        mag = "手机蓝牙已关闭";
    } else if (type == 2) {
        mag = "手机蓝牙正在关闭";
    } else if (type == 3) {
        mag = "手机蓝牙已开启";
    } else if (type == 4) {
        mag = "手机蓝牙正在开启";
    } else if (type == 5) {
        mag = "蓝牙开始搜索";
    } else if (type == 6) {
        mag = "蓝牙搜索完毕";
    } else if (type == 7) {
        mag = "蓝牙搜索到设备 MAC:" + Mac + " Name:" + Name;
    }


    if (isNotNull(BlouetoothCallbackObject) && isString(BlouetoothCallbackObject)) {
        if (typeof (eval(BlouetoothCallbackObject)) == "function") {
            eval(BlouetoothCallbackObject + "(type,Mac,Name,device);");
        }
    } else if (isNotNull(BlouetoothCallbackObject) && isFunction(BlouetoothCallbackObject)) {
        BlouetoothCallbackObject(type, Mac, Name, device);
    }


}


//低功耗蓝牙连接
function JsBlouetoothCallbackBLEConnected(device, status, newState) {
    if (BlouetoothBleConnectCallbackObject != null && BlouetoothBleConnectCallbackObject.BLEConnected != null) {
        if (isNotNull(BlouetoothBleConnectCallbackObject.BLEConnected) && isString(BlouetoothBleConnectCallbackObject.BLEConnected)) {
            if (typeof (eval(BlouetoothBleConnectCallbackObject.BLEConnected)) == "function") {
                eval(BlouetoothBleConnectCallbackObject.BLEConnected + "(device, status, newState);");
            }
        } else if (isNotNull(BlouetoothBleConnectCallbackObject.BLEConnected) && isFunction(BlouetoothBleConnectCallbackObject.BLEConnected)) {
            BlouetoothBleConnectCallbackObject.BLEConnected(device, status, newState);
        }
    }
}

//低功耗蓝牙断开
function JsBlouetoothCallbackBLEDisconnected(device, status, newState) {
    if (BlouetoothBleConnectCallbackObject != null && BlouetoothBleConnectCallbackObject.BLEDisconnected != null) {
        if (isNotNull(BlouetoothBleConnectCallbackObject.BLEDisconnected) && isString(BlouetoothBleConnectCallbackObject.BLEDisconnected)) {
            if (typeof (eval(BlouetoothBleConnectCallbackObject.BLEDisconnected)) == "function") {
                eval(BlouetoothBleConnectCallbackObject.BLEDisconnected + "(device, status, newState);");
            }
        } else if (isNotNull(BlouetoothBleConnectCallbackObject.BLEDisconnected) && isFunction(BlouetoothBleConnectCallbackObject.BLEDisconnected)) {
            BlouetoothBleConnectCallbackObject.BLEDisconnected(device, status, newState);
        }
    }
}

//得到特征值
function JsBlouetoothCallbackELEService(device, uuidList) {
    if (BlouetoothBleConnectCallbackObject != null && BlouetoothBleConnectCallbackObject.GetELEService != null) {
        if (isNotNull(BlouetoothBleConnectCallbackObject.GetELEService) && isString(BlouetoothBleConnectCallbackObject.GetELEService)) {
            if (typeof (eval(BlouetoothBleConnectCallbackObject.GetELEService)) == "function") {
                eval(BlouetoothBleConnectCallbackObject.GetELEService + "(device, uuidList);");
            }
        } else if (isNotNull(BlouetoothBleConnectCallbackObject.GetELEService) && isFunction(BlouetoothBleConnectCallbackObject.GetELEService)) {
            BlouetoothBleConnectCallbackObject.GetELEService(device, uuidList);
        }
    }
}

//读取成功操作回调
function JsBlouetoothCallbackELECharacteristicRead(device, data, status) {
    if (BlouetoothBleConnectCallbackObject != null && BlouetoothBleConnectCallbackObject.onCharacteristicRead != null) {
        if (isNotNull(BlouetoothBleConnectCallbackObject.onCharacteristicRead) && isString(BlouetoothBleConnectCallbackObject.onCharacteristicRead)) {
            if (typeof (eval(BlouetoothBleConnectCallbackObject.onCharacteristicRead)) == "function") {
                eval(BlouetoothBleConnectCallbackObject.onCharacteristicRead + "(device, data, status);");
            }
        } else if (isNotNull(BlouetoothBleConnectCallbackObject.onCharacteristicRead) && isFunction(BlouetoothBleConnectCallbackObject.onCharacteristicRead)) {
            BlouetoothBleConnectCallbackObject.onCharacteristicRead(device, data, status);
        }
    }
}

//写入成功操作回调
function JsBlouetoothCallbackELECharacteristicWrite(device, data, status) {
    if (BlouetoothBleConnectCallbackObject != null && BlouetoothBleConnectCallbackObject.onCharacteristicWrite != null) {
        if (isNotNull(BlouetoothBleConnectCallbackObject.onCharacteristicWrite) && isString(BlouetoothBleConnectCallbackObject.onCharacteristicWrite)) {
            if (typeof (eval(BlouetoothBleConnectCallbackObject.onCharacteristicWrite)) == "function") {
                eval(BlouetoothBleConnectCallbackObject.onCharacteristicWrite + "(device, data, status);");
            }
        } else if (isNotNull(BlouetoothBleConnectCallbackObject.onCharacteristicWrite) && isFunction(BlouetoothBleConnectCallbackObject.onCharacteristicWrite)) {
            BlouetoothBleConnectCallbackObject.onCharacteristicWrite(device, data, status);
        }
    }
}

//写入返回回调
function JsBlouetoothCallbackELECharacteristicChanged(device, data) {
    if (BlouetoothBleConnectCallbackObject != null && BlouetoothBleConnectCallbackObject.onCharacteristicChanged != null) {
        if (isNotNull(BlouetoothBleConnectCallbackObject.onCharacteristicChanged) && isString(BlouetoothBleConnectCallbackObject.onCharacteristicChanged)) {
            if (typeof (eval(BlouetoothBleConnectCallbackObject.onCharacteristicChanged)) == "function") {
                eval(BlouetoothBleConnectCallbackObject.onCharacteristicChanged + "(device, data, status);");
            }
        } else if (isNotNull(BlouetoothBleConnectCallbackObject.onCharacteristicChanged) && isFunction(BlouetoothBleConnectCallbackObject.onCharacteristicChanged)) {
            BlouetoothBleConnectCallbackObject.onCharacteristicChanged(device, data, status);
        }
    }
}

/**
 * 获取蓝牙权限
 */
function getBlouetoothJurisdiction() {


    if (IsAndorid()) {

        AndroidtoJs.getBlouetoothJurisdiction();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "getBlouetoothJurisdiction" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        getBlouetoothJurisdictionFlutter.postMessage('A');
    } else {

    }


}

/**
 * 判断是否有蓝牙权限
 */
function BlouetoothIsJurisdiction() {


    if (IsAndorid()) {

        if (AndroidtoJs.BlouetoothIsJurisdiction() == 1) {
            return true;
        } else {
            return false;
        }

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        var permissions = sendJsToIosAction({ "method": "BlouetoothIsJurisdiction" }, null);
        if (permissions == 1) {
            return true;
        } else {
            return false;
        }
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        BlouetoothIsJurisdictionFlutter.postMessage('A');
    } else {

    }


}

/**
 * 蓝牙是否打开
 */
function BlouetoothIsOpen() {


    if (IsAndorid()) {

        if (AndroidtoJs.BlouetoothIsOpen() == 1) {
            return true;
        } else {
            return false;
        }

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        var open = sendJsToIosAction({ "method": "BlouetoothIsOpen" }, null);
        if (open == 1) {
            return true;
        } else {
            return false;
        }
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        BlouetoothIsOpenFlutter.postMessage('A');
    } else {

    }


}

/**
 * 蓝牙是否可以被发现
 */
function BlouetoothIsShow() {


    if (IsAndorid()) {

        if (AndroidtoJs.BlouetoothIsShow() == 1) {
            return true;
        } else {
            return false;
        }

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        var show = sendJsToIosAction({ "method": "BlouetoothIsShow" }, null);
        if (show == 1) {
            return true;
        } else {
            return false;
        }
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        BlouetoothIsShowFlutter.postMessage('A');
    } else {

    }


}

/**
 * 打开蓝牙
 */
function OpenBlouetooth() {


    if (IsAndorid()) {

        AndroidtoJs.OpenBlouetooth()

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "OpenBlouetooth" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        OpenBlouetoothFlutter.postMessage('A');
    } else {

    }


}

/**
 * 关闭蓝牙
 */
function CloseBlouetooth() {


    if (IsAndorid()) {

        AndroidtoJs.CloseBlouetooth()

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "CloseBlouetooth" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        CloseBlouetoothFlutter.postMessage('A');
    } else {

    }


}

/**
 * 打开蓝牙发现
 */
function OpenBlouetoothToothDisplay() {


    if (IsAndorid()) {

        AndroidtoJs.OpenBloueToothDisplay()

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "OpenBloueToothDisplay" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        OpenBlouetoothToothDisplayFlutter.postMessage('A');
    } else {

    }


}

/**
 * 开始蓝牙扫描
 */
function StartBlouetoothDiscovery() {


    if (IsAndorid()) {

        AndroidtoJs.StartDiscovery()

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "StartDiscovery" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        StartBlouetoothDiscoveryFlutter.postMessage('A');
    } else {

    }


}

/**
 * 停止蓝牙扫描
 */
function StopBlouetoothDiscovery() {


    if (IsAndorid()) {

        AndroidtoJs.StopDiscovery()

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "StopDiscovery" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        StopBlouetoothDiscoveryFlutter.postMessage('A');
    } else {

    }


}


//低功耗蓝牙连接回调函数
var BlouetoothBleConnectCallbackObject = null;

/*

var BleCallback = {
    //低功耗蓝牙连接
    BLEConnected:function(device, status, newState){//device 设备对象 status 旧状态 newState 新状态

    },
    //低功耗蓝牙断开
    BLEDisconnected:function(device, status, newState){//device 设备对象 status 旧状态 newState 新状态

    },
    //得到特征值
    GetELEService:function(device, uuidList){//device 设备对象 uuidList 特征值列表

    },
    //读取成功操作回调
    onCharacteristicRead:function(device, data, status){//device 设备对象 data 读取端口的数据 status 状态码

    },
    //写入成功操作回调
    onCharacteristicWrite:function(device, data, status){//device 设备对象 data 读取端口的数据 status 状态码

    },
    //写入返回回调
    onCharacteristicChanged:function(device, data){//device 设备对象 data 读取端口的数据

    }
};


*/
/**
 * 连接蓝牙
 */
function BlouetoothBleConnectGatt(mac, callback) {

    BlouetoothBleConnectCallbackObject = callback;

    if (IsAndorid()) {
        AndroidtoJs.BleConnectGatt(mac);
    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "BleConnectGatt", "mac": mac }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        BleConnectGatt.postMessage('A');
    } else {

    }

}

/**
 * 读取特征码端口数据
 */
function BlouetoothGetCharacteristicRead(serviceUuid, charactUuid) {
    if (IsAndorid()) {
        AndroidtoJs.GetCharacteristicRead(serviceUuid, charactUuid);
    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "BlouetoothGetCharacteristicRead" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        BleConnectGatt.BlouetoothGetCharacteristicRead(serviceUuid, charactUuid);
    } else {

    }
}

/**
 * 写入特征码端口数据
 */
function BlouetoothSetCharacteristicWrite(serviceUuid, charactUuid, data, time) {
    if (IsAndorid()) {
        AndroidtoJs.SetCharacteristicWrite(serviceUuid, charactUuid, data, time);
    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "BlouetoothSetCharacteristicWrite" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        BleConnectGatt.BlouetoothSetCharacteristicWrite(serviceUuid, charactUuid, data, time);
    } else {

    }
}



//-----------------------------------Android 加密签到---------------------------------//

//开始签到定位
function SigninStartLocation() {

    if (IsAndorid()) {

        AndroidtoJs.startLocation();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

//关闭签到定位
function SigninStopLocation() {

    if (IsAndorid()) {

        AndroidtoJs.stopLocation();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}


//初始化蓝牙
function SigninInitBluetooth() {

    if (IsAndorid()) {

        AndroidtoJs.initBluetooth();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

//开始蓝牙扫描
function SigninStartBluetooth() {

    if (IsAndorid()) {

        AndroidtoJs.startBluetooth();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

//关闭蓝牙扫描 SigninCloseBluetooth
function SigninCloseBluetooth() {

    if (IsAndorid()) {

        AndroidtoJs.closeBluetooth();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

//连接蓝牙门锁
function SigninLockBatteryLevel(LockData, LockMac) {

    if (IsAndorid()) {

        AndroidtoJs.signinLockBatteryLevel(LockData, LockMac);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}



//-----------------------------------Android 本地键值对存储---------------------------------//
/**
 * TODO Android 本地键值对存储
 *
 * Android\微信\H5\IOS 本地键值对存储
 *
 *
 *
 */

/**
 * 判断键值对是否存在
 */
function KeyValueDBIsExist(key) {


    if (IsAndorid()) {

        if (AndroidtoJs.KeyValueDBIsExist(key) == 1) {
            return true;
        } else {
            return false;
        }

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        var isExist = sendJsToIosAction({ "method": "KeyValueDBIsExist", "key": key }, null);
        if (isExist == 1) {
            return true;
        } else {
            return false;
        }
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        KeyValueDBIsExistFlutter.postMessage(key);
    } else {

    }

    return false;
}


/**
 * 添加键值对
 */
function KeyValueDBinsertKeyValue(key, value) {

    if (IsAndorid()) {

        AndroidtoJs.KeyValueDBinsertKeyValue(key, value);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "KeyValueDBinsertKeyValue", "key": key, "value": value }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        KeyValueDBinsertKeyValueFlutter.postMessage(key, value);
    } else {

    }

}


/**
 * 删除键值对
 */
function KeyValueDBdeleteKeyValue(key) {

    if (IsAndorid()) {

        AndroidtoJs.KeyValueDBdeleteKeyValue(key);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "KeyValueDBdeleteKeyValue", "key": key }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        KeyValueDBdeleteKeyValueFlutter.postMessage(key);
    } else {

    }

}


/**
 * 修改键值对
 */
function KeyValueDBupdateKeyValue(key, value) {

    if (IsAndorid()) {

        AndroidtoJs.KeyValueDBupdateKeyValue(key, value);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "KeyValueDBupdateKeyValue", "key": key, "value": value }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        KeyValueDBupdateKeyValueFlutter.postMessage(key, value);
    } else {

    }

}


/**
 * 读取键值对
 */
function KeyValueDBselectKeyValue(key) {

    if (IsAndorid()) {

        return AndroidtoJs.KeyValueDBselectKeyValue(key);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        return sendJsToIosAction({ "method": "KeyValueDBselectKeyValue", "key": key }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        KeyValueDBselectKeyValueFlutter.postMessage(key);
    } else {

    }

    return null;
}






//-----------------------------------Android Push消息推送---------------------------------//
/**
 * TODO Android Push消息推送
 *
 * Android\微信\H5\IOS Push消息推送
 *
 *
 *
 */

var JsPhusTokenCallback = null;

function GetPushToken(PhusTokenCallback) {

    JsPhusTokenCallback = PhusTokenCallback;

    if (IsAndorid()) {

        AndroidtoJs.GetPushToken();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "GetPushToken" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        GetPushTokenFlutter.postMessage('A');
    } else {

    }

}

/**
 * 获取Token回调
 * @param {Object} token 口令内容
 * @param {Object} tokenType 口令类型
 */
function JsGetPhusTokenCallback(token, tokenType) {


    if (isNotNull(JsPhusTokenCallback) && isString(JsPhusTokenCallback)) {
        if (typeof (eval(JsPhusTokenCallback)) == "function") {
            eval(JsPhusTokenCallback + "(token,tokenType);");
        }
    } else if (isNotNull(JsPhusTokenCallback) && isFunction(JsPhusTokenCallback)) {
        JsPhusTokenCallback(token, tokenType);
    }


}

/**
 * 数据加密
 * @param value 要加密的值
 * @returns {*}
 */
function dataEncryption(value) {
    if (IsAndorid()) {
        return AndroidtoJs.dataEncryption(value);
    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    }
    return value;
}



//-----------------------------------Android 设备信息---------------------------------//
/**
 * TODO Android 设备信息
 *
 * Android\微信\H5\IOS 设备信息
 *
 *
 *
 */


/**
 * 获取AndroidSDK
 */

function GetAndroidSDN() {

    if (IsAndorid()) {
        return AndroidtoJs.GetAndroidSDN();
    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        return sendJsToIosAction({ "method": "GetDeviceSDN" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        //调用数据
        GetDeviceSDNFlutter.postMessage();

    }

    return -1;

}

/**
 * 获取设备厂商
 */

function GetManufacturer() {

    if (IsAndorid()) {
        return AndroidtoJs.GetManufacturer();
    } else if (IsIos()) {
        return "Apple";
    } else if (IsWeiXinBrowser()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        GetManufacturerFlutter.postMessage('A');
    }

    return null;

}

/**
 * 获取手机型号
 */

function GetMobileModel() {

    if (IsAndorid()) {
        return AndroidtoJs.GetMobileModel();
    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        return sendJsToIosAction({ "method": "GetMobileModel" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        GetMobileModelFlutter.postMessage('A');
    }

    return null;

}

/**
 * 获取手机设备唯一标识
 */
function GetDeviceId() {
    if (IsAndorid()) {
        return AndroidtoJs.GetMobileDeviceId();
    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        return sendJsToIosAction({ "method": "GetMobileDeviceId" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    }

    return null;
}

/**
 * 通知app原生自动登录
 */
function autoLogin() {
    if (IsAndorid()) {

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        return sendJsToIosAction({ "method": "autoLogin" }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    }

    return null;
}


//初始化百度智能云 人脸识别 sdk
function initBaiduFaceplatform() {
    if (IsAndorid()) {
        AndroidtoJs.initBaiduFaceplatform();
    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }
}


//开始百度智能云人脸识别
function BaiduSdkFaceVerify(token) {
    if (IsAndorid()) {
        AndroidtoJs.faceVerify(token);
    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }
}

//-----------------------------------Android 按键拦截器---------------------------------//
/**
 * TODO Android 按键拦截器
 *
 * Android\微信\H5\IOS 按键拦截器
 *
 *
 *
 */

var OnKeyDownObjec = {
    Callback: null,
    Key: {
        KEYCODE_CALL: 4 //拨号键
        ,
        KEYCODE_ENDCALL: 6 //挂机键
        ,
        KEYCODE_HOME: 3 //主页键
        ,
        KEYCODE_MENU: 82 //菜单键
        ,
        KEYCODE_BACK: 4 //返回键
        ,
        KEYCODE_SEARCH: 84 //搜索键
        ,
        KEYCODE_CAMERA: 27 //拍照键
        ,
        KEYCODE_FOCUS: 80 //拍照对焦键
        ,
        KEYCODE_POWER: 26 //电源键
        ,
        KEYCODE_NOTIFICATION: 83 //通知键
        ,
        KEYCODE_MUTE: 91 //话筒静音键
        ,
        KEYCODE_VOLUME_MUTE: 164 //扬声器静音键
        ,
        KEYCODE_VOLUME_UP: 24 //音量增加键
        ,
        KEYCODE_VOLUME_DOWN: 25 //音量减小键
        //其他按键 https://blog.csdn.net/qq_40441190/article/details/79235178
    }
}

/**
 * 安卓注册OnKeyDown方法
 *
 *
 *
 * str:需要注册的按钮 是逗号分隔的字符串 按钮代码如OnKeyDownObjec.Key 比如注册返回键和电源键4,26
 * Callback：回调方法 回调方法尽量不要处理非常耗时的操作，且注意处理用户瞬间连续按下2次按键的情况
 *
 *
 */

function RegisterKeyDown(value, KeyDownCallback) {

    OnKeyDownObjec.Callback = KeyDownCallback;


    if (IsAndorid()) {

        AndroidtoJs.RegisterKeyDown(value);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        RegisterKeyDownFlutter.postMessage(value);
    } else {

    }

}


/**
 * 用户按下被注册的按钮时
 *
 * 当返回-1时表示拦截此次操作
 * 当返回的数字是 则App会按下对应的按钮 注意
 *
 * @param {Object} keyCode 按键代码
 */
function AndroidOnKey(keyCode) {

    if (isFunction(OnKeyDownObjec.Callback)) {
        return OnKeyDownObjec.Callback(keyCode);
    } else if (isStrngFunction(Callback)) {
        return eval(OnKeyDownObjec.Callback + "(keyCode);");
    }

    return -1;
}


/**
 * 主动点击按钮
 *  需要先注册 RegisterKeyDown 才可以调用
 */
function keyCommand(keyCode) {

    if (IsAndorid()) {

        AndroidtoJs.keyCommand(keyCode);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
    } else if (IsFlutterIos() || IsFlutterAndroid()) {
        keyCommandFlutter.postMessage(keyCode);
    } else {

    }

}


/**
 * 设置窗口颜色
 *
 */
function setWindowsColor(color) {

    if (IsAndorid()) {

        AndroidtoJs.setWindowsColor(color);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {
        sendJsToIosAction({ "method": "setWindowsColor", "color": color }, null);
    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

/**
 * 设置窗口状态栏显示隐藏
 *
 * 0隐藏状态栏 1透明状态栏 2正常状态栏
 *
 */
function setWindowsStatusBar(state) {

    if (IsAndorid()) {

        AndroidtoJs.setWindowsStatusBar(state);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}


//-----------------------------------Android 摇一摇---------------------------------//
/**
* TODO Android 摇一摇
*
* Android\微信\H5\IOS 摇一摇
*
*
*
*/

//开关摇一摇功能
function SwitchShake(isOpen) {

    if (IsAndorid() && getAppVersions() > 28) {

        AndroidtoJs.SwitchShake(isOpen);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

//查询是否开关摇一摇功能
function IsOpenShake() {

    if (IsAndorid() && getAppVersions() > 28) {

        return (AndroidtoJs.IsOpenShake() == 0);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

    return false;
}

//设置摇一摇对应模块
function SetModularStr(modularStr) {

    if (IsAndorid() && getAppVersions() > 28) {

        AndroidtoJs.SetModularStr(modularStr);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

//查询摇一摇对应模块
function GetModularStr() {

    var modularStr = null;


    if (IsAndorid() && getAppVersions() > 28) {

        modularStr = AndroidtoJs.GetModularStr();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

    if (modularStr == null || modularStr == "") {
        //如果未设置则默认门锁管理
        modularStr = '{"id":78,"code":"000801","depth":2,"icon":"openDoor.png","name":"直接开门","orderNum":1,"url":"GoToUnLockActivity(4)","path":"doorLock/openDoor","type":0,"moduleType":2,"device":null,"stateList":null,"dutyList":null,"delFlag":0}';
    }

    return modularStr;

}


//开关手机翻转功能
function SwitchFlip(isOpen) {

    if (IsAndorid() && getAppVersions() > 28) {

        AndroidtoJs.SwitchFlip(isOpen);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

//查询是否开关手机翻转功能
function IsOpenFlip() {

    if (IsAndorid() && getAppVersions() > 28) {

        return (AndroidtoJs.IsOpenFlip() == 0);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

    return false;
}

//设置手机翻转对应模块
function SetFlipModularStr(modularStr) {

    if (IsAndorid() && getAppVersions() > 28) {

        AndroidtoJs.SetFlipModularStr(modularStr);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

//查询手机翻转对应模块
function GetFlipModularStr() {

    var modularStr = null;


    if (IsAndorid() && getAppVersions() > 28) {

        modularStr = AndroidtoJs.GetFlipModularStr();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

    if (modularStr == null || modularStr == "") {
        //如果未设置则默认数字学生证
        modularStr = '{"id":103,"code":"0050001","depth":2,"icon":"capsule.png","name":"数字学生证","orderNum":100,"url":"CardPack/CardInfo","path":"CardPack/CardInfo","type":1,"moduleType":0,"device":null,"stateList":null,"dutyList":null,"delFlag":0}';
    }

    return modularStr;

}

//修改直接进入支付页面url
function inToPlayPublicActivity(url) {

    var domain = window.location.href.split("//")[0] + "//" + window.location.host + ctx;
    if (IsWeiXinBrowser()) {
        toPlayPublicActivity(url);
    } else {
        toPlayPublicActivity(domain + url);
    }

}

//当用户摇一摇时
function JsAccelerometerCallbackShakeCallback() {

    //是否启用摇一摇
    if (IsOpenShake()) {

        var modularStr = GetModularStr();
        var modular = null;
        try {
            modular = eval('(' + modularStr + ')');
        } catch (e) { }
        if (modular == null) {
            modular = { "id": 78, "code": "000801", "depth": 2, "icon": "openDoor.png", "name": "直接开门", "orderNum": 1, "url": "GoToUnLockActivity(4)", "path": "doorLock/openDoor", "type": 0, "moduleType": 2, "device": null, "stateList": null, "dutyList": null, "delFlag": 0 };
        }

        if (modular.type == 0 && modular.url != null) {
            eval(modular.url);
            return true;
        } else if (modular.type == 1 && modular.url != null) {
            eval("GoInToActivity('" + modular.url + "')");
            return true;
        } else if (modular.type == 2 && modular.url != null) {
            eval("toSystemActivity('" + modular.url + "')");
            return true;
        }

    }

}

//手机翻转
function JsAccelerometerCallbackFlipCallback() {

    //是否启用手机翻转
    if (IsOpenFlip()) {

        var modularStr = GetFlipModularStr();
        var modular = null;
        try {
            modular = eval('(' + modularStr + ')');
        } catch (e) { }
        if (modular == null) {
            modular = { "id": 103, "code": "0050001", "depth": 2, "icon": "capsule.png", "name": "数字学生证", "orderNum": 100, "url": "CardPack/CardInfo", "path": "CardPack/CardInfo", "type": 1, "moduleType": 0, "device": null, "stateList": null, "dutyList": null, "delFlag": 0 };
        }

        if (modular.type == 0 && modular.url != null) {
            eval(modular.url);
            return true;
        } else if (modular.type == 1 && modular.url != null) {
            eval("GoInToActivity('" + modular.url + "')");
            return true;
        } else if (modular.type == 2 && modular.url != null) {
            eval("toSystemActivity('" + modular.url + "')");
            return true;
        }

    }

}


//设备打开门锁
function ShakeService_OpenDoor() {
    //获取锁数据
    var formData = new FormData();
    var callback = function (data) {

        userDoorList = data;

        if (userDoorList != null) {
            AppDoUnlock(userDoorList.doorBluetoothKey, userDoorList.doorBluetoothMac, ShakeService_OpenDoor_createPlayer);
        } else {
            mag("所在寝室未绑定门锁或无门锁数据");
        }

        return false;
    }

    var nocallback = function (msg) {
        mag(msg);
        return false;
    }
    PostData(ctx + "doorLock/openDoor/GetStudentDoor", formData, callback, nocallback);
}

//开锁成功回调
function ShakeService_OpenDoor_createPlayer(state, magStr) {
    if (!state) {
        mag("开锁失败");
        return;
    }
    mag("开锁成功");
    var _id = Math.floor(Math.random() * 800 + 100);
    var audio = document.createElement('audio');
    audio.style.display = "none";
    audio.id = _id;
    audio.src = getRootPath_web() + "/audio/lock_open.wav";
    audio.preload = 'auto';
    audio.onended = function () {
        this.remove();
    }
    audio.onerror = function () {
        this.remove();
    }
    document.body.appendChild(audio);
    audio.play();
}



//-----------------------------------Android 活体识别---------------------------------//
/**
 * TODO Android 活体识别
 *
 * Android\微信\H5\IOS 活体识别
 *
 *
 *
 */

var LivingAuthenticationCallback = null;


function LivingAuthentication(verifyToken, callback) {

    LivingAuthenticationCallback = callback;

    if (IsAndorid()) {

        if (AndroidtoJs.LivingAuthentication != null) {
            AndroidtoJs.LivingAuthentication(verifyToken);
        }

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}


//活体识别回调 code -2
function RealPersonProvingLivingAuthenticationCallback(isSuccess, verifyToken, code, msg) {

    if (isFunction(LivingAuthenticationCallback)) {
        return LivingAuthenticationCallback(isSuccess, verifyToken, code, msg);
    } else if (isStrngFunction(Callback)) {
        return eval(LivingAuthenticationCallback + "(isSuccess, verifyToken, code, msg);");
    }

}


function startRealPerson(type, callback) {

    if (IsAndorid()) {

        if (AndroidtoJs.SetRealPersonType != null && type != null && callback != null) {
            Log("A1")
            AndroidtoJs.SetRealPersonType(type);
            Log("A2")
            JFileChooser(JFileType().VIDEOTAPE_TYPE, callback);
        }

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}


//-----------------------------------Android 开启门锁---------------------------------//
/**
 * TODO Android 开启门锁
 *
 * Android\微信\H5\IOS 开启门锁
 *
 *
 *
 */

var AppLockTimeCallback = null;
//校准时间回调
function AppLockTimeCallbackFunction(state, mag) {

    if (isFunction(AppLockTimeCallback)) {
        return AppLockTimeCallback(state, mag);
    } else if (isStrngFunction(AppLockTimeCallback)) {
        return eval(AppLockTimeCallback + "(state , mag);");
    }

}

//校准时间
function AppLockTime(Timestamp, LockData, LockMac, callback) {

    AppLockTimeCallback = callback;

    if (IsAndorid()) {

        if (AndroidtoJs.setLockTime != null) {
            AndroidtoJs.setLockTime(Timestamp, LockData, LockMac);
        }

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

var AppDoUnlockCallback = null;
//开锁成功回调
function AppDoUnlockCallbackFunction(state, mag) {

    if (isFunction(AppDoUnlockCallback)) {
        return AppDoUnlockCallback(state, mag);
    } else if (isStrngFunction(AppDoUnlockCallback)) {
        return eval(AppDoUnlockCallback + "(state , mag);");
    }

}

//开锁
function AppDoUnlock(LockData, LockMac, callback) {

    AppDoUnlockCallback = callback;

    if (IsAndorid()) {

        if (AndroidtoJs.doUnlock != null) {
            AndroidtoJs.doUnlock(LockData, LockMac);
        }

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}


var AppDoLockLockCallback = null;
//闭锁成功回调
function AppDoLockLockCallbackFunction(state, mag) {

    if (isFunction(AppDoLockLockCallback)) {
        return AppDoLockLockCallback(state, mag);
    } else if (isStrngFunction(AppDoLockLockCallback)) {
        return eval(AppDoLockLockCallback + "(state , mag);");
    }
}

//闭锁
function AppDoLockLock(LockData, LockMac, callback) {

    AppDoLockLockCallback = callback;

    if (IsAndorid()) {

        if (AndroidtoJs.doLockLock != null) {
            AndroidtoJs.doLockLock(LockData, LockMac);
        }

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

//锁电量

var AppLockBatteryLevelCallback = null;
//获取锁电量成功回调
function AppLockBatteryLevelCallbackFunction(state, electricQuantity) {

    if (isFunction(AppLockBatteryLevelCallback)) {
        return AppLockBatteryLevelCallback(state, electricQuantity);
    } else if (isStrngFunction(AppLockBatteryLevelCallback)) {
        return eval(AppLockBatteryLevelCallback + "(state , electricQuantity);");
    }
}

function AppLockBatteryLevel(LockData, LockMac, callback) {

    AppLockBatteryLevelCallback = callback;

    if (IsAndorid()) {

        if (AndroidtoJs.getLockBatteryLevel != null) {
            AndroidtoJs.getLockBatteryLevel(LockData, LockMac);
        }

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

}

/**
 * 存储锁相关数据
 * param 	room 房间位置
            doorBluetoothKey 锁key
            doorBluetoothMac 锁mac地址
 *
 */
function nativeSaveLockData(room, doorBluetoothKey, doorBluetoothMac) {
    if (IsAndorid()) {
        if (AndroidtoJs.cacheUserLockInfo != null) {
            AndroidtoJs.cacheUserLockInfo(room, doorBluetoothKey, doorBluetoothMac);
        }
    }
}



//-----------------------------------Android 权限管理---------------------------------//
/**
 * TODO Android 权限管理
 *
 * Android 权限管理
 *
 *
 *
 */

var AppPermissionIncex = 0;
var AppPermissionList = [];
var AppPermissionCallback = null;
var AppPermissionCallbackData = null;

//综合申请权限
function AppPermission(permission, callback, callbackData) {

    if (permission == null || permission.length <= 0 || getAppVersions() < 27) {
        callback(true);
        return;
    }
    //转为数组
    if (!isArray(permission)) {
        permission = [permission];
    }
    //初始化权限序列
    AppPermissionIncex = 0;
    AppPermissionList = permission;
    DontAskAgainAppPermission = false;
    AppPermissionCallback = callback;
    AppPermissionCallbackData = callbackData;

    //开始递归
    AppPermissionPopup();
}

var AppPermissionPopupIndex = 0;
var AppPermissionPopupData = null;

//检查权限并弹出提示
function AppPermissionPopup() {

    //循环结束
    if (AppPermissionIncex >= AppPermissionList.length) {
        AppPermissionEnd();
        return;
    }

    //获取权限对象
    var myPer = AppPermissionList[AppPermissionIncex];
    if (PermissionList[myPer.name] == null) {//无效的权限对象
        AppPermissionPopupSet(false);
        return;
    }

    //构造权限对象
    myPer.permissionName = PermissionList[myPer.name].permissionName;
    myPer.note = PermissionList[myPer.name].note;
    if (myPer.msg == null) {
        myPer.msg = "校园通申请该权限用于业务";
    }
    AppPermissionPopupData = myPer;

    //检测是否需要申请该权限
    if (PermissionList[myPer.name].min != null && GetAndroidSDN() < PermissionList[myPer.name].min) {
        return AppPermissionPopupSet(true);
    }

    //检查是否获得该权限
    if (checkPermission(myPer.permissionName)) {
        AppPermissionPopupSet(true);
        return;
    }


    if (typeof layer != "undefined") {
        //准备弹出层
        var html = '';

        html += '<div style="width: 300px;height: auto;background-color: #FFF;border-radius:8px;padding-top: 10px;">';
        html += '<div style="width: calc(100% - 40px);height: 40px;line-height: 40px;text-align: center;font-size: 18px;font-weight: bold;padding-left: 20px;padding-bottom: 10px;">校园通申请' + myPer.note + '权限</div>';
        html += '<div style="width: calc(100% - 40px);line-height: 25px;text-align: justify;text-indent: 2em;padding-left: 20px;padding-bottom: 10px;">' + myPer.msg + '</div>';
        html += '<div style="width: 100%;line-height: 40px;border-top: 1px solid #cccccc;text-align: center;" onclick="AppPermissionObtain()">确定</div>';
        html += '</div>';

        //示范一个公告层
        layer.open({
            type: 1,
            title: false,//不显示标题栏
            closeBtn: false,
            area: '300px;',
            offset: '150px',
            shade: 0.8,
            shadeClose: false,
            id: 'LAY_layuipro_AppPermissionPopup' + AppPermissionIncex,//设定一个id，防止重复弹出
            btnAlign: 'c',
            moveType: 1, //拖拽模式，0或者1
            content: html,
            success: function (layero, index) {
                AppPermissionPopupIndex = index;
            }
        });

    } else {
        try {
            vant.Dialog({
                title: '校园通申请' + myPer.note + '权限',
                message: myPer.msg,
                showConfirmButton: true,
            }).then(() => {
                AppPermissionObtain();
            }).catch(() => {

            });
        } catch (e) {
            vant.showDialog({
                title: '校园通申请' + myPer.note + '权限',
                message: myPer.msg,
                showConfirmButton: true,
            }).then(() => {
                AppPermissionObtain();
            }).catch(() => {

            });
        }

    }


}

//用户点击确定
function AppPermissionObtain() {
    if (typeof layer != "undefined") {
        //关闭弹出层
        layer.close(AppPermissionPopupIndex);
    }

    //	//检查用户是否不再询问
    //	if(!judgePermission(AppPermissionPopupData.permissionName)){
    //		//不再询问该权限
    //		DontAskAgainAppPermission = true;
    //		AppPermissionPopupSet(false);
    //	}else{
    //
    //	}

    //申请权限
    requestPermission(AppPermissionPopupData.permissionName, AppPermissionPopupSet);
}

//申请权限回调
function AppPermissionPopupSet(isPer) {
    AppPermissionList[AppPermissionIncex].isPer = isPer;
    AppPermissionIncex++;
    AppPermissionPopup();
}

var DontAskAgainAppPermission = false;
var toPermissionAppSetPopupIndex = 0;

//递归结束 清点权限
function AppPermissionEnd() {

    var isAllPer = true;

    for (var i = 0; i < AppPermissionList.length; i++) {
        if (AppPermissionList[i].isPer == false) {
            isAllPer = false;
            break;
        }
    }

    AppPermissionCallback(isAllPer, AppPermissionCallbackData);

    //如果没有全部获得权限并存在不再提示
    if (!isAllPer) {

        var title = "申请权限未成功";
        var content = "存在权限未申请成功，需要前往设置手动授权。";
        if (typeof layer != "undefined") {
            //准备弹出层
            var html = '';

            html += '<div style="width: 300px;height: auto;background-color: #FFF;border-radius:8px;padding-top: 10px;font-size: 0px;">';
            html += '<div style="width: calc(100% - 40px);height: 40px;line-height: 40px;text-align: center;font-size: 20px;font-weight: bold;padding-left: 20px;padding-bottom: 10px;">' + title + '</div>';
            html += '<div style="width: calc(100% - 40px);line-height: 25px;text-align: justify;text-indent: 2em;padding-left: 20px;padding-bottom: 10px;font-size: 16px;">' + content + '</div>';
            html += '<div style="width: calc((100% - 1px) / 2);display: inline-block;line-height: 40px;border-top: 1px solid #cccccc;font-size: 14px;text-align: center;" onclick="toPermissionAppSetPopupClose(false)">取消</div>';
            html += '<div style="width: calc((100% - 1px) / 2);display: inline-block;line-height: 40px;border-top: 1px solid #cccccc;border-left: 1px solid #cccccc;font-size: 14px;text-align: center;" onclick="toPermissionAppSetPopupClose(true)">确定</div>';
            html += '</div>';

            //示范一个公告层
            layer.open({
                type: 1,
                title: false,//不显示标题栏
                closeBtn: false,
                area: '300px;',
                offset: '150px',
                shade: 0.8,
                shadeClose: false,
                id: 'LAY_layuipro_AppPermissionEnd1',//设定一个id，防止重复弹出
                btnAlign: 'c',
                moveType: 1, //拖拽模式，0或者1
                content: html,
                success: function (layero, index) {
                    toPermissionAppSetPopupIndex = index;
                }
            });
        } else {
            try {
                vant.Dialog({
                    title: title,
                    message: content,
                    showConfirmButton: true,
                    showCancelButton: true,
                }).then(() => {
                    toPermissionAppSetPopupClose(true)
                }).catch(() => {
                    toPermissionAppSetPopupClose(false)
                });
            } catch (e) {
                vant.showDialog({
                    title: title,
                    message: content,
                    showConfirmButton: true,
                    showCancelButton: true,
                }).then(() => {
                    toPermissionAppSetPopupClose(true)
                }).catch(() => {
                    toPermissionAppSetPopupClose(false)
                });
            }
        }

    }
}

//关闭跳转到设置
function toPermissionAppSetPopupClose(isTo) {

    if (typeof layer != "undefined") {
        //关闭弹出层
        layer.close(toPermissionAppSetPopupIndex);
    }

    if (isTo) {
        toPermissionAppSet();
    }

}

//权限列表
var PermissionList = {
    "READ_EXTERNAL_STORAGE": { permissionName: "android.permission.READ_EXTERNAL_STORAGE", note: "读取外部存储器" },
    "WRITE_EXTERNAL_STORAGE": { permissionName: "android.permission.WRITE_EXTERNAL_STORAGE", note: "写入外部存储器" },
    "ACCESS_COARSE_LOCATION": { permissionName: "android.permission.ACCESS_COARSE_LOCATION", note: "模糊定位" },
    "ACCESS_FINE_LOCATION": { permissionName: "android.permission.ACCESS_FINE_LOCATION", note: "精确定位" },
    "CAMERA": { permissionName: "android.permission.CAMERA", note: "相机" },
    "RECORD_AUDIO": { permissionName: "android.permission.RECORD_AUDIO", note: "录音" },
    "BLUETOOTH_SCAN": { permissionName: "android.permission.BLUETOOTH_SCAN", note: "蓝牙扫描", min: 31 },
    "BLUETOOTH_ADVERTISE": { permissionName: "android.permission.BLUETOOTH_ADVERTISE", note: "蓝牙广播", min: 31 },
    "BLUETOOTH_CONNECT": { permissionName: "android.permission.BLUETOOTH_CONNECT", note: "蓝牙连接", min: 31 },
    "USE_BIOMETRIC": { permissionName: "android.permission.USE_BIOMETRIC", note: "用户识别", min: 28 },
};



// 判断单个权限
function checkPermission(permission) {

    if (IsAndorid()) {

        if (getAppVersions() < 27) {
            return true;
        }

        return AndroidtoJs.checkPermission(permission);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

    return true;

}

// 判断是否已拒绝过权限
function judgePermission(permission) {

    if (IsAndorid()) {

        if (getAppVersions() < 27) {
            return true;
        }

        return AndroidtoJs.judgePermission(permission);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }

    return true;
}

//跳转到权限设置界面
function toPermissionAppSet() {
    if (IsAndorid()) {

        if (getAppVersions() < 27) {
            return;
        }

        return AndroidtoJs.toPermissionAppSet();

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }
}

//通过基础BaseActivity请求单个权限
function requestPermission(permission, callback) {

    PermissionCallback = callback;

    if (IsAndorid()) {

        if (getAppVersions() < 27) {
            return;
        }

        return AndroidtoJs.requestPermission(permission);

    } else if (IsWeiXinBrowser()) {

    } else if (IsIos()) {

    } else if (IsFlutterIos() || IsFlutterAndroid()) {

    } else {

    }
}

var PermissionCallback = null;

//回调权限
function RequestPermissionCallback(isPermission) {

    if (PermissionCallback != null) {
        PermissionCallback(isPermission);
    }

}


//-----------------------------------Android 用户同意隐私协议---------------------------------//
/**
 * TODO Android 用户同意隐私协议
 *
 *
 *
 *
 */

function userAgreement() {

    if (IsAndorid()) {

        if (typeof AndroidtoJs.userAgreement == undefined || typeof AndroidtoJs.userAgreement == "undefined") {
            return;
        }

        return AndroidtoJs.userAgreement();

    }



}




/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 *
 * return URL参数字符串
 */
var urlEncode = function (param, key, encode) {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
}


/**
 *
 *  layui 图片压缩上传
 */
function photoCompress(file, w, objDiv) {
    var ready = new FileReader();
    /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
    ready.readAsDataURL(file);
    ready.onload = function () {
        var re = this.result;
        canvasDataURL(re, w, objDiv);
    }
};
function canvasDataURL(path, obj, callback) {
    var img = new Image();
    img.src = path;
    img.onload = function () {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
            h = that.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        var quality = 0.3; // 设置图片质量
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        callback(base64);
    }
}
function convertBase64UrlToBlob(urlData) {
    var arr = urlData.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}


/**
 * 通知App打开新页面，并且关闭上一页
 *
 * 已处理了安卓和iOS 上一页的关闭逻辑
 */
function openPageAndOffPre(url) {

    if (IsAndorid()) {
        //安卓关闭当前界面
        Activityfinish(1);
    }

    GoInToActivity(url);

    // iOS必须新页面打开后关闭上一页面，使用下面的方法
    if (IsIos()) {
        ClosePreviousPage();
    }
}

function toPage(url) {

    if (IsAndorid()) {
        //安卓关闭当前界面
        Activityfinish(1);
    }

    if ((url.indexOf("driver") != -1 || url.indexOf("otherTuition") != -1) && (typeof IsWeiXinBrowser == 'function') && IsWeiXinBrowser.constructor == Function && IsWeiXinBrowser()) {
        toPlayPublicActivity(url);
    } else {
        GoInToActivity(url);
    }

    // iOS必须新页面打开后关闭上一页面，使用下面的方法
    if (IsIos()) {
        ClosePreviousPage();
    }
    if (IsFlutterIos() || IsFlutterAndroid()) {
        Activityfinish();
    }
}

function layuiFormat(datetime, fmt) {

    if (parseInt(datetime) == datetime) {
        if (datetime.length == 10) {
            datetime = parseInt(datetime) * 1000;
        } else if (datetime.length == 13) {
            datetime = parseInt(datetime);
        }
    } else {
        if (IsIos()) {
            var re = eval("/-/ig");
            var length = datetime.match(re).length;
            // 只转化yyyy-MM-dd的日期格式
            if (length > 1) {
                datetime = datetime.replace(/\-/g, "/");
            }
        }
    }
    datetime = new Date(datetime);
    var o = {
        "M+": datetime.getMonth() + 1,                 // 月份
        "d+": datetime.getDate(),                    // 日
        "h+": datetime.getHours(),                   // 小时
        "m+": datetime.getMinutes(),                 // 分
        "s+": datetime.getSeconds(),                 // 秒
        "q+": Math.floor((datetime.getMonth() + 3) / 3), // 季度
        "S": datetime.getMilliseconds()             // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function formatUTC(time) {
    var data = time.substr(0, 19); // 截取字符串，取前19个字符，即时间部分
    var newDate;
    if (time.includes('T')) { // 如果时间字符串中包含 'T'，则认为是 UTC 格式
        newDate = new Date(new Date(data.replace(/T/g, ' ').replace(/-/g, '/')).getTime() + 8 * 60 * 60 * 1000); // 将时间字符串转换为 Date 对象，并添加8小时的时间偏移量
    } else {
        newDate = new Date(data.replace(/-/g, '/')); // 如果不是 UTC 格式，则按默认方式转换为 Date 对象
    }
    return newDate;
}

/**
 * 安卓inputFile获取文件类型设置
 */
function setCallReturns(mods, fileType) {
    if (mods > 0 && mods < 5) {
        if (IsAndorid()) {
            if (getAppVersions() >= 20) {
                AndroidtoJs.setCallReturns(mods, fileType);
            }
        } else if (IsIos()) {
            sendJsToIosAction({ "method": "setCallReturns", "param1": mods, "param2": fileType }, null);
        }
    }
}

//------------获取DOM工具类-----------//

function getDOM(dimName) {
    return document.getElementById(dimName);
}


//展示加载框
function showMyLoading() {
    var div = document.createElement("div");
    div.id = "show_loading_main";
    div.style.width = "100%";
    div.style.height = "100%";
    var html = "<div class=\"box\" style=\" width: 100%;height: 100%;position: fixed;top: 0;left: 0;background: rgba(0,0,0,0.3);\">";
    html += "<div id=\"dialog\" style=\"top:45vh;left: 45vw;width: auto;height: auto;position: absolute;margin: auto;\" >";
    html += "<i class=\"layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop\" style=\"font-size: 45px;\"></i>";
    html += "</div></div>";
    div.innerHTML = html;
    document.body.after(div);
}

//移除加载框
function closeLoading() {
    document.getElementById("show_loading_main").remove();
}


/**
 * 生成随机数
 * @param {} minNum 	最小随机数
 * @param {} maxNum 	最大随机数
 * @return {}			随机数
 */
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

/**
 * 通过canvas画布实现压缩，并转化为base64格式的图片
 * @param {File} file : 图片
 * @param {Object} item ：通过item找到当前对象的img标签
 * @param {Function} callback ：回调函数
 */
//function canvasDataURL(file,item,callback) { //压缩转化为base64
function canvasDataURL(file, callback) { //压缩转化为base64
    var reader = new FileReader(); //读取文件的对象
    reader.readAsDataURL(file); //对文件读取，读取完成后会将内容以base64的形式赋值给result属性
    reader.onload = function (e) { //读取完成的钩子
        const img = new Image();
        var quality; // 图像质量
        if (file.size > 1024 * 1024 * 5) {
            quality = 0.1;
        } else {
            quality = 0.25;
        }
        //先创建canvas画布，再获取canvas画布上的2d绘图环境，通过这个2d绘图环境才可使用绘制API
        const canvas = document.createElement('canvas'); //创建canvas画布
        const drawer = canvas.getContext('2d'); //返回一个在画布上绘制2d图的环境对象，该对象上包含有canvas绘制2d图形的API
        img.src = this.result;
        //console.log("FileReader对象：",this);
        //图片预览
        //		var picDom = $(item.item).find("img");
        //		item.attr('src', this.result); //图片链接（base64）
        //图片压缩代码，需要注意的是，img图片渲染是异步的，所以必须在img的onlaod钩子中再进行相应操作
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            if (canvas.width > 1980) {
                canvas.width = img.width * 0.6;
                canvas.height = img.height * 0.6;
            } else if (canvas.width > 1280) {
                canvas.width = img.width * 0.8;
                canvas.height = img.height * 0.8;
            }

            drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
            convertBase64UrlToBlob(canvas.toDataURL(file.type, quality), callback);
        }
    }
}

/**
 * 将base64格式转化为Blob格式
 * @param {string} urlData : urlData格式的数据，通过这个转化为Blob对象
 * @param {Function} callback : 回调函数
 */
function convertBase64UrlToBlob(urlData, callback) { //将base64转化为文件格式
    //console.log("压缩成base64的对象：",urlData);
    const arr = urlData.split(',')
    //console.log("arr",arr);
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1]) //atob方法用于解码base64
    //console.log("将base64进行解码:",bstr);
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    //console.log("Uint8Array:",u8arr);
    callback(new Blob([u8arr], {
        type: mime
    }));
}




//精度浮点加法
function numAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

//精度浮点减法
function numSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//精度浮点乘法
function numMulti(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

//精度浮点除法
function numDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

function vueAppPageInit() {

    if (axios != null && typeof axios != "undefined") {
        axios.defaults.timeout = 15 * 1000;//请求超时时间15秒
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';//设置默认请求头
        // 添加请求拦截器
        axios.interceptors.request.use(async function (config) {
            // 在发送请求之前做些什么
            if (typeof config.addTenEpcToken != "undefined") {
                await getTenEcpToken().then(result => {
                    config.headers['api-token'] = result;
                })
            }
            if (typeof config.addAidManaToken != "undefined") {
                await getAidManaToken().then(result => {
                    config.headers['api-token'] = result;
                })
            }
            if (typeof config.addCertManaToken != "undefined") {
                await getCertManaToken().then(result => {
                    config.headers['api-token'] = result;
                })
            }
            return config;
        }, function (error) {
            vueCloseLoad();
            // 对请求错误做些什么
            return Promise.reject(error);
        });

        // 添加响应拦截器
        axios.interceptors.response.use(function (res) {

            // 对响应数据做点什么
            return res;
        }, function (error) {
            vueCloseLoad();
            vant.Toast("连接服务器失败，请检查你的网络配置");
            // 对响应错误做点什么
            return Promise.reject(error);
        });
    }

    if (typeof initVueHtml != "undefined" && initVueHtml.constructor == Function) {
        initVueHtml();
    }

}

async function getTenEcpToken() {
    if (typeof window.tenEpcToken == "undefined" || window.tenEpcToken == "" || window.tenEpcToken == null
        || window.tenEpcToken == "null" || typeof window.tenEpcExpireTime == "undefined" || window.tenEpcExpireTime == ""
        || window.tenEpcExpireTime == null || window.tenEpcExpireTime == "null"
        || window.tenEpcExpireTime - 300000 < new Date().getTime()) {
        let data;
        await axios.get(ctx + "App/tenEpc/api/getToken").then((res) => {
            if (res.data.status == 200) {
                window.tenEpcToken = res.data.data.token;
                window.tenEpcExpireTime = res.data.data.expireTime;
                data = res.data.data.token;
            } else {
                data = null;
            }
        });
        return data;
    }
    return window.tenEpcToken;
}

async function getAidManaToken() {
    if (typeof window.aidManaToken == "undefined" || window.aidManaToken == "" || window.aidManaToken == null
        || window.aidManaToken == "null" || typeof window.aidManaExpireTime == "undefined" || window.aidManaExpireTime == ""
        || window.aidManaExpireTime == null || window.aidManaExpireTime == "null"
        || window.aidManaExpireTime - 300000 < new Date().getTime()) {
        let data;
        await axios.get(ctx + "App/studentAid/api/getToken").then((res) => {
            if (res.data.status == 200) {
                window.aidManaToken = res.data.data.token;
                window.aidManaExpireTime = res.data.data.expireTime;
                data = res.data.data.token;
            } else {
                data = null;
            }
        });
        return data;
    }
    return window.aidManaToken;
}


async function getCertManaToken() {
    if (typeof window.certManaToken == "undefined" || window.certManaToken == "" || window.certManaToken == null
        || window.certManaToken == "null" || typeof window.certManaExpireTime == "undefined" || window.certManaExpireTime == ""
        || window.certManaExpireTime == null || window.certManaExpireTime == "null"
        || window.certManaExpireTime - 300000 < new Date().getTime()) {
        let data;
        await axios.get(ctx + "App/cert/api/getToken").then((res) => {
            if (res.data.status == 200) {
                window.certManaToken = res.data.data.token;
                window.certManaExpireTime = res.data.data.expireTime;
                data = res.data.data.token;
            } else {
                data = null;
            }
        });
        return data;
    }
    return window.certManaToken;
}

/**
 * 展示加载框
 */
function veuShowLoad(text) {
    if (text == null || text == "" || typeof (text) == "undefined") {
        text = "加载中"
    }

    try {
        vant.Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: text
        });
    } catch (e) {
        vant.showLoadingToast({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: text
        });
    }
}
/**
 * 关闭加载框
 */
function vueCloseLoad() {
    vant.Toast.clear();
}
/**
 * 轻消息提示
 */
function vueToast(text, duration) {

    if (duration == null || typeof (duration) == "undefined") {
        duration = 2500
    }
    try {
        vant.Toast({
            message: text,
            duration: duration
        });
    } catch (e) {
        // vant4 写法
        vant.showToast({
            message: text,
            duration: duration
        });
    }
}

/**
 * 主要消息通知
 */
function veuMainMsg(message) {
    try {
        vant.Notify({ type: 'primary', message: message });
    } catch (e) {
        vant.showNotify({ type: 'primary', message: message });
    }
}
/**
 * 成功消息通知
 */
function vueSuccessMsg(message) {
    try {
        vant.Notify({ type: 'success', message: message });
    } catch (e) {
        vant.showNotify({ type: 'success', message: message });
    }
}
/**
 * 危险消息通知
 */
function vueDangerMsg(message) {
    try {
        vant.Notify({ type: 'danger', message: message });
    } catch (e) {
        vant.showNotify({ type: 'danger', message: message });
    }
}
/**
 * 警告通知消息通知
 */
function vueWarningMsg(message) {
    try {
        vant.Notify({ type: 'warning', message: message });
    } catch (e) {
        vant.showNotify({ type: 'warning', message: message });
    }
}


/**
 * 获取图片文件对象尺寸
 * @param file
 * @returns {Promise<unknown>}
 */
function getImageSize(file) {
    return new Promise((resolve, reject) => {
        // 确保文件是图片
        if (!file || !file.type.startsWith('image/')) {
            reject('请选择图片');
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();

            img.onload = function () {
                // 图片加载完成后返回其宽度和高度
                resolve({
                    width: img.width,
                    height: img.height
                });
            };

            img.onerror = function () {
                reject('图片加载失败');
            };

            img.src = event.target.result; // 将读取的图片数据作为图片源
        };

        reader.onerror = function () {
            reject('文件读取失败');
        };

        reader.readAsDataURL(file); // 读取文件
    });
}


function filterEmojis(input) {

    if (input === null || typeof input == "undefined") {
        return "";
    }

    // 正则表达式过滤所有表情符号
    var input = input.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{3030}\u{1F1E0}-\u{1F1FF}\u{00A9}\u{00AE}\u{2122}\u{1F51E}\u{1F4AA}]/gu, '');

    return input;
}