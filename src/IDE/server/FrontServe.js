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
        // 默认首页路由
        this.app.get(/(.*)/, (req, res) => {
            let filePath = this.initUrl(req.url)
            if (this.fs.existsSync(filePath)) {
                if (filePath.endsWith(".html")) {
                    res.setHeader('Content-Type', 'text/html');
                    res.send(this.getHtmlFile(filePath));
                } else {
                    res.send(this.fs.readFileSync(filePath));
                }
            } else
                res.sendStatus(404)
        });

        this.server.listen(this.port, () => {
            const url = `http://localhost:${this.port}`;
            console.log(`前端页面已启动，访问当前启动路径的: ${url}`);
        });
    }

    //filePath检查
    initUrl(url) {
        let urlPath = url.split("/").filter(item => item != '')


        //包含网站
        if (this.webDirs.includes(urlPath[0])) {
            urlPath.splice(1, 0, 'dist')
        } else {
            if (this.fs.existsSync(this.path.join('Front', 'ROOT', ...urlPath))) {
                urlPath.unshift("ROOT")
            }
        }
        log(urlPath)
        return this.path.join('Front', ...urlPath)
    }

    //获取html文件
    getHtmlFile(filePath) {
        let data = this.fs.readFileSync(filePath, 'utf8');
        return data;
    }

}
module.exports = new FrontExpress()