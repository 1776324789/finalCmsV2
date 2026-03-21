const Setting = {
    backControllerPort: 3368,     //后台接口
    frontPort: 3367,              //网站静态资源接口
    ifFront: true,                //前端是否使用端口的形式访问
    ifDynamicData: true,          //前端是否使用端口的形式获取json数据
    backSocket: false,            //后台内容修改后是否打开websocket实时刷新（后台开发模式）
    frontSocket: false,            //前端内容修改后是否打开websocket实时刷新（前端开发模式）
    backExpressRequestSize: '20mb',//后台单次请求最大大小
    dataUpdateTime: 5 * 60 * 1000,        //data文件同步巡检的时间间隔
    clicksSyncTime: 5 * 60 * 1000,         //同步node阅读量的时间间隔，判断依据为node-content的加载次数
    verifyDate: 90 * 60 * 1000,            //token过期时间
    isHelmet: true,                  //是否使用helmet 加强请求安全，但是会使文件跨域失效，开启时需要确定data和front在同一域
    isLimitRequest: true,            //是否添加数据请求限制
    windowMs: 10 * 60 * 1000,       //请求限制时间
    max: 10000,                      //请求限制内一个ip允许请求数量
    md5LimitSize: 5 * 1024 * 1024,   //计算md5的大小限制
    submitLimit: 5,                  //单个IP的投稿次数上限
  ContentSecurityPolicy: "script-src 'self'; style-src 'self' 'unsafe-inline'; 'self' img-src 'self' http://127.0.0.1:3400 http://localhost:3400 https://aheadedu.oss-cn-shenzhen.aliyuncs.com ; data: 'self'  http://127.0.0.1:3400 http://localhost:3400 https://aheadedu.oss-cn-shenzhen.aliyuncs.com ; object-src 'none';",
    secretKey: "V2CJ3V5TCL6FYHB5NBMQUTBWJTSDIGPS6FYZGCQOQG2J3GD7KBSJPZFNNXCVHVR4QKA4TVAO5RLZQCFFDNJ4MJQNL5SPEZGQRI4JTQ7URS64YLZADAVZRUBMF4ZP2COI6GNXMESHK52RUD65WQYV5PRCFFJD6RAQX6ZZPDWET7GEYFCNFMFGMKOGPC5N44AML4OBHE4B2HAQ6BXKODFKYLUZ7JL6BZB7NT5FOY6EFOIGQDLI6AL4YC4X4QPYF6CA"
   }

module.exports = Setting;