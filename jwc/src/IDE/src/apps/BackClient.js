
// 后端静态文件代理

class BackClient {
    constructor() {
        this.setting = require("../../setting")//设置

        this.chokidar = require('chokidar');//文件监听
        this.path = require('path');
        this.socketIo = require('socket.io');
        this.baseUrl = process.cwd()
        this.resourcePath = this.path.join(this.baseUrl, "IDE", "resources")
        this.app
        this.server
        this.io
        this.log = require("../utils/LogController")
    }
    setApp(app, server) {
        this.app = app
        this.server = server
        this.init()
    }
    init() {
        this.initConfigration()
        this.initFileWatcher()
    }


    // 初始化配置
    initConfigration() {
        // 创建文件夹监听,监听前台文件
        this.watcher = this.chokidar.watch(this.resourcePath, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true
        });

        if (this.setting.backSocket) {
            this.io = this.socketIo(this.server);
            // 处理 WebSocket 连接
            this.io.on('connection', (socket) => {
                this.log.info("An user connected webSocket")
                socket.on('disconnect', () => {
                    this.log.info("User disconnected webSocket")
                });
            });
        }

    }

    //初始化文件监听
    initFileWatcher() {
        if (this.setting.backSocket) {
            this.watcher.on('add', filePath => {
                this.io.emit('file-changed');
            }).on('change', filePath => {
                this.io.emit('file-changed');
            }).on('unlink', path => {
                this.io.emit('file-changed');
            });
        }
    }

    // filePath： 接收一个后台template文件夹中的文件，删除对应的后台dist中的文件
    removeFileFromBackDist(filePath) {
        try {
            fs.unlinkSync(filePath)
            this.log.info(`remove file:${filePath}`)
        } catch (error) {
            this.log.error(error.message)
        }
    }
}

module.exports = new BackClient()