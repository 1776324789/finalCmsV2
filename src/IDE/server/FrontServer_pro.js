const { log } = require("console");

class FrontExpress {
    constructor() {
        this.fs = require("fs")
        this.path = require("path")
        this.port = 20829
        this.webDirs
        this.express = require('express');
        this.http = require('http');
        this.app = this.express();
        this.server = this.http.createServer(this.app);
        this.init()
        this.initServer()
    }

    init() {
        //初始化网站列表
        this.webDirs = this.fs.readdirSync(this.path.join("Front")).filter(item => item != "ROOT")
    }

    initServer() {
        // 首页（必须在正则路由前面）
        this.app.get("/", (req, res) => {
            const filePath = this.path.resolve("Front/ROOT/dist/index.html");
            res.type("html");
            res.sendFile(filePath);
        });

        // 匹配除 "/" 以外所有路径
        this.app.get(/^\/.+/, (req, res) => {
            let filePath = this.initUrl(req.url);
            let ext = this.path.extname(filePath).toLowerCase();
            res.type(ext || 'html');
            if (this.fs.existsSync(filePath))
                res.sendFile(this.path.resolve(filePath));
            else {
                res.status(404)
                res.end()
            }
        });

        this.server.listen(this.port, () => {
            console.log(`前端页面已启动：http://localhost:${this.port}`);
        });
    }

    //filePath检查
    initUrl(url) {

        let urlPath = url.split("/").filter(item => item != "")
        if (this.webDirs.includes(urlPath[urlPath.length - 1])) urlPath.push("index.html")
        if (!urlPath[urlPath.length - 1].includes(".")) urlPath[urlPath.length - 1] += ".html"
        let childWeb = false
        //检测是否为子网站
        if (this.webDirs.includes(urlPath[0])) {
            childWeb = true
        } else {
            urlPath.unshift("ROOT")
        }
        urlPath.splice(1, 0, 'dist') //定位至编译文件夹
        urlPath.unshift("Front") //定位至前端文件夹
        //判空，空html则定位至对应404页面
        if (this.path.join(...urlPath).endsWith(".html") && !this.fs.existsSync(this.path.join(...urlPath))) {
            urlPath = [urlPath[0], urlPath[1], urlPath[2], "404.html"]
        }
        return this.path.join(...urlPath)
    }

    //获取html文件
    getHtmlFile(filePath) {
        let data = this.fs.readFileSync(filePath, 'utf8');
        return data;
    }

}
module.exports = new FrontExpress()