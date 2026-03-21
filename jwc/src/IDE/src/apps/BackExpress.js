const RoleController = require("./controller/RoleController");

class BackExpress {
    constructor() {
        this.fs = require("fs");//文件读取
        this.exec = require('child_process').exec;
        this.path = require('path');
        this.express = require('express');
        this.bodyParser = require('body-parser');
        this.http = require('http');
        this.cors = require('cors'); // 引入 cors 中间件
        this.basePath = process.cwd();
        this.socketIo = require('socket.io');
        this.app = this.express();// 后台
        this.server = this.http.createServer(this.app);
        this.port // 后台数据端口
        this.log = require("../utils/LogController")
        this.setting = require("../../setting")
        this.resourcePath = this.path.join(this.basePath, "IDE", "resources")
        this.dataPath = this.path.join(this.basePath, "Front", "dist")
        this.io
        this.BackClient
        this.init()
    }

    // 初始化
    init() {
        this.initConfigration()

        this.startSever()
        this.initController()
        this.BackClient = require("./BackClient")
        this.BackClient.setApp(this.app, this.server)
    }


    // 启动后台服务器
    startSever() {
        this.io = this.socketIo(this.server);

        this.server.listen(this.port, () => {
            this.log.info(`后台数据接口地址：当前启动路径的:http://localhost:${this.port}`);
            console.log(`后台数据接口地址：当前启动路径的:http://localhost:${this.port}`);
            // 调用函数并传入你想要打开的网址
            // this.openInDefaultBrowser(`http://localhost:${this.port}/index.html`);
        });
    }
    openInDefaultBrowser(url) {
        let cmd;

        switch (process.platform) {
            case 'win32':
                cmd = `start ${url}`;
                break;
        }
        if (cmd)
            this.exec(cmd, (err) => {
                if (err) {
                    console.error(`Failed to open ${url}:`, err);
                } else {
                    console.log(`Opened ${url} in the default browser.`);
                }
            });
    }
    // 初始化基础配置
    initConfigration() {
        this.port = this.setting.backControllerPort
        // 创建一个中间件来处理文件修改
        this.app.use((req, res, next) => {
            let filePath
            if (req.path === '/' || req.path === '/login.html') {
                filePath = this.path.join(this.resourcePath, 'login.html');
            } else {
                filePath = this.path.join(this.resourcePath, req.path);
            }
            if (filePath.endsWith('html')) {
                // 是否是html文件
                res.setHeader('Content-Type', 'text/html');
                let result
                if (this.fs.existsSync(filePath)) {
                    result = this.compileHtml(filePath)
                } else {
                    result = this.fs.readFileSync(this.path.join(this.resourcePath, '404.html'))
                }
                res.send(result);
            } else if (req.path.startsWith("/data/")) {
                let result = this.fs.readFileSync(this.path.join(this.dataPath, req.path))
                res.send(result);
            } else {
                this.log.backAccess(req, res)
                next()
            }
        });

        // 静态文件中间件，指定前端文件夹路径
        this.app.use(this.express.static(this.resourcePath));

        // 配置body-parser中间件
        this.app.use(this.bodyParser.json({ limit: this.setting.backExpressRequestSize })); // 限制JSON请求体为20MB

        // 跨域请求
        this.app.use(this.cors());

        // 解析 JSON 格式的请求体
        this.app.use(this.express.json());

        // 解析 URL 编码格式的请求体
        this.app.use(this.express.urlencoded({ extended: true }));
    }

    // 初始化接口
    initController() {
        const LoginController = require("./controller/LoginController")
        LoginController.init({ app: this.app, server: this.server })
        const ListController = require("./controller/ListController")
        ListController.init({ app: this.app, server: this.server })
        const NodeController = require("./controller/NodeController")
        NodeController.init({ app: this.app, server: this.server })
        const StatisticsController = require("./controller/StatisticsController")
        StatisticsController.init({ app: this.app, server: this.server })
        const PremissionController = require("./controller/PremissionController")
        PremissionController.init({ app: this.app, server: this.server })
        const UserController = require("./controller/UserController")
        UserController.init({ app: this.app, server: this.server })
        const RoleController = require("./controller/RoleController")
        RoleController.init({ app: this.app, server: this.server })
        const DatabaseSwitch = require("./controller/DatabaseSwitch")
        DatabaseSwitch.init({ app: this.app, server: this.server })
        const UploadController = require("./controller/UploadController")
        UploadController.init({ app: this.app, server: this.server })
        const PageEditController = require("./controller/PageEditController")
        PageEditController.init({ app: this.app, server: this.server })
    }

    // 返回组合组合html
    // 传入html文件路径
    compileHtml(filePath) {
        this.log.info(`compile file:${filePath}`)
        let fileContent = this.fs.readFileSync(filePath, 'utf8')
        // if (false) {
        if (this.setting.backSocket && (filePath.endsWith("index.html") || filePath.endsWith("login.html"))) {
            // 加载socket文件
            let socket_io_js = this.fs.readFileSync(this.path.join(this.basePath, "IDE", 'src', 'utils', 'socket.io.js'), 'utf8');
            // 为文件添加socketio环境，并链接到服务
            fileContent = fileContent + `
            <script>
            ${socket_io_js}
            </script>
            <script>
            document.addEventListener("DOMContentLoaded", function () {
                var socket = io();

                socket.on('connect', function () {
                    //console.log('Successfully connected to server');
                });

                socket.on('file-changed', function () {
                    //console.log('File changed, reloading page...');
                    window.location.reload();
                });

                socket.on('disconnect', function () {
                    //console.log('Disconnected from server');
                });
            });
            </script>`;
        }
        return fileContent;
    }
}

module.exports = new BackExpress()
