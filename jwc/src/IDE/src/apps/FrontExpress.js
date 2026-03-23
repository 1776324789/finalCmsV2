class FrontExpress {
    constructor() {
        this.setting = require("../../setting")
        this.fs = require("fs");//文件读取
        this.exec = require('child_process').exec;
        this.chokidar = require('chokidar');//文件监听
        this.express = require('express');
        this.path = require('path');
        this.http = require('http');
        this.socketIo = require('socket.io');
        this.cors = require('cors'); // 引入 cors 中间件

        this.svgCaptcha = require('svg-captcha');//生成验证码
        this.verifyCodeMap = new Map()
        this.formatData = require("../utils/Tools").formatDate

        this.basePath = process.cwd();
        this.templatePath = this.path.join(this.basePath, "Front", 'template');
        this.distPath = this.path.join(this.basePath, "Front", 'dist');
        this.dataTemplatePath = this.path.join(this.basePath, "Front", "template", 'data')

        // 前台
        this.app = this.express();
        this.helmet = require('helmet');
        // 启用所有默认安全头，包括 X-XSS-Protection（兼容老浏览器）
        this.app.use(this.helmet());
        this.server = this.http.createServer(this.app);
        this.io = this.socketIo(this.server);
        this.port //默认运行端口
        // 使用 cors 中间件

        this.log = require("../utils/LogController")
        this.DataExpress = require("./DataExpress")
        // 创建文件夹监听,监听前台文件
        this.watcher = this.chokidar.watch(this.templatePath, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true
        });
        this.init()
    }

    init() {
        this.DataExpress.setApp(this.app)
        this.initDir()
        this.initWatcher()
        this.initConfigration()
    }
    initDir() {
        if (!this.fs.existsSync(this.path.join(this.templatePath, 'component'))) {
            this.fs.mkdirSync(this.path.join(this.templatePath, 'component'));
        }
        if (!this.fs.existsSync(this.path.join(this.templatePath, 'js'))) {
            this.fs.mkdirSync(this.path.join(this.templatePath, 'js'));
        }
        if (!this.fs.existsSync(this.path.join(this.templatePath, 'css'))) {
            this.fs.mkdirSync(this.path.join(this.templatePath, 'css'));
        }
        const copyDir = (path, targetPath) => {
            //加载所有前端脚本至dist
            this.fs.readdirSync(path).forEach(item => {
                //判断是否是文件夹
                if (this.fs.statSync(this.path.join(path, item)).isDirectory()) {
                    copyDir(this.path.join(path, item), this.path.join(targetPath, item))
                } else {
                    //判断是否已经存在该文件，存在则不复制
                    if (this.fs.existsSync(this.path.join(targetPath, item))) {
                        return;
                    }
                    this.fs.copyFileSync(this.path.join(path, item), this.path.join(targetPath, item))
                }
            })
        }

        copyDir(this.path.join(this.basePath, "IDE", "src", 'cmsBaseHTML'), this.templatePath)
    }

    // 初始化文件监听
    initWatcher() {
        this.watcher.on('add', filePath => {
            setTimeout(() => {
                this.compileFile(filePath)
            }, 1000);
            if (this.setting.frontSocket)
                setTimeout(() => {
                    this.io.emit('file-changed');
                }, 1000);
        }).on('change', filePath => {
            setTimeout(() => {
                this.compileFile(filePath)
            }, 1000);
            if (this.setting.frontSocket)
                setTimeout(() => {
                    this.io.emit('file-changed');
                }, 1000);
        }).on('unlink', filePath => {
            setTimeout(() => {
                this.removeFileFromDist(filePath);
            }, 1000);
            if (this.setting.frontSocket)
                setTimeout(() => {
                    this.io.emit('file-changed');
                }, 1000);
        });
    }
    setSecurityHeaders(res) {
        res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'no-referrer');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('X-Download-Options', 'noopen');
        res.setHeader(
            'Content-Security-Policy',this.setting.ContentSecurityPolicy
          
        );
    }
    initConfigration() {
        this.port = this.setting.frontPort;
        this.app.use(this.cors());
        // 应用安全头中间件到所有请求
        this.app.use((req, res, next) => {
            this.setSecurityHeaders(res);
            if (!allowedMethods.includes(req.method)) {
                res.status(405).send(`Method ${req.method} Not Allowed`);
            } else {
                let filePath;
                try {
                    if (req.path === '/' || req.path === '/index.html') {
                        filePath = this.path.join(this.distPath, 'index.html');
                    } else {
                        filePath = this.path.join(this.distPath, req.path);
                    }

                    if (filePath.endsWith('.html')) {
                        res.setHeader('Content-Type', 'text/html');
                        res.send(this.ioFile(filePath));
                    } else {
                        next();
                    }

                    this.log.frontAccess(req, res);
                } catch (e) {
                    if (this.fs.existsSync(this.path.join(this.distPath, '404.html'))) {
                        filePath = this.path.join(this.distPath, '404.html');
                    } else {
                        filePath = this.path.join(this.basePath, 'IDE', 'resources', '404.html');
                    }

                    res.setHeader('Content-Type', 'text/html');
                    res.send(this.ioFile(filePath));
                }
            }
        });

        // 允许的方法
        const allowedMethods = ['GET', 'POST', 'HEAD'];

        // 静态文件中间件
        this.app.use(this.express.static(this.distPath));

        // 解析请求体
        this.app.use(this.express.json());
        this.app.use(this.express.urlencoded({ extended: true }));



        // 默认首页路由
        this.app.get('/', (req, res) => {
            res.sendFile(this.path.join(this.distPath, 'index.html'));
        });

        // 获取验证码接口
        this.app.post("/getSubmitVerifyCode", (req, res) => {
            const clientIp = req.ip || req.connection.remoteAddress;
            let list = this.readList(req.body.submitDataId);

            if (!list) {
                return res.send({ code: 404, message: "no such list" });
            }
            if (!list.submit) {
                return res.send({ code: 403, message: "list is not submitable" });
            }

            const captcha = this.svgCaptcha.create({
                size: 6,
                ignoreChars: '0123456789oOiIl',
                noise: 5,
                color: true,
                background: req.body.color || '#407BFF'
            });

            const codeData = { ip: clientIp, code: captcha.text };
            const codeList = this.verifyCodeMap.get(req.body.submitDataId) || [];

            // 移除旧的验证码
            const updatedCodeList = codeList.filter(item => item.ip !== clientIp);
            updatedCodeList.push(codeData);
            this.verifyCodeMap.set(req.body.submitDataId, updatedCodeList);

            // 设置验证码过期
            setTimeout(() => {
                const current = this.verifyCodeMap.get(req.body.submitDataId) || [];
                this.verifyCodeMap.set(req.body.submitDataId, current.filter(item => item !== codeData));
            }, 120000);

            res.send({ svg: captcha.data });
            this.log.cmsAccess(req, res);
        });

        // 提交内容接口
        this.app.post("/submitToList", (req, res) => {
            const clientIp = req.ip || req.connection.remoteAddress;
            let list = this.readList(req.body.submitDataId);

            if (!list) {
                return res.send({ code: 404, message: "no such list" });
            }
            if (!list.submit) {
                return res.send({ code: 403, message: "list is not submitable" });
            }
            if (!this.checkSubmit(clientIp)) {
                return res.send({ code: 406, message: "submit limit" });
            }

            const { title, content, code, submitDataId } = req.body;
            let verifyCode = false;

            const codeList = this.verifyCodeMap.get(submitDataId) || [];
            this.verifyCodeMap.set(submitDataId, codeList.filter((item) => {
                if (item.ip === clientIp && item.code.toUpperCase() === code.toUpperCase()) {
                    verifyCode = true;
                    return false;
                }
                return true;
            }));

            if (!verifyCode) {
                return res.send({ code: 402, message: "verify code error" });
            }

            const id = "s_" + (Date.now() * (1 + Math.random())).toString(36);
            const now = this.formatData(new Date(), "YYYY-MM-DD HH:mm:ss");

            const data = { id, date: now, top: false, clicks: 0, publish: false };
            list.submitData = list.submitData || [];
            list.submitData.push(data);
            this.writeList(submitDataId, list);

            const submitNode = {
                id,
                clicks: 0,
                title,
                date: now,
                top: false,
                publish: false,
                type: 5,
                parentId: submitDataId
            };
            this.writeNode(id, submitNode);
            this.writeNodeContent(id, { content });

            this.updateSubmitNum(clientIp);
            res.send({ code: 200, message: "submit success" });
        });

        // 全局错误处理
        this.app.use((err, req, res, next) => {
            console.error("Unhandled error:", err.stack);
            res.status(500).send({
                code: 500,
                message: "Internal Server Error",
                details: process.env.NODE_ENV === 'production' ? null : err.message
            });
        });

        // WebSocket 初始化
        if (this.setting.frontSocket) {
            this.io.on('connection', (socket) => {
                this.log.info("A user connected websocket:" + socket.handshake.url);
                socket.on('disconnect', () => {
                    this.log.info("A user disconnected websocket:" + socket.handshake.url);
                });
            });
        }

        // 启动前端服务
        this.server.listen(this.port, () => {
            const url = `http://localhost:${this.port}/index.html`;
            this.log.info(`前端页面已启动，访问当前启动路径的: ${url}`);
            console.log(`前端页面已启动，访问当前启动路径的: ${url}`);
            // this.openInDefaultBrowser(url);
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
    // 检查是否可以提交
    checkSubmit(IP) {
        let result = false
        let submitHistory = this.fs.readFileSync(this.path.join(this.basePath, "IDE", "src", "submitHistory.json"), 'utf8')
        submitHistory = JSON.parse(submitHistory)
        if (submitHistory[this.formatData(new Date(), "YYYY-MM-DD")]) {

            if (submitHistory[this.formatData(new Date(), "YYYY-MM-DD")][IP] && submitHistory[this.formatData(new Date(), "YYYY-MM-DD")][IP] >= this.setting.submitLimit) {
                result = false
            } else {
                submitHistory[this.formatData(new Date(), "YYYY-MM-DD")][IP] = 0
                result = true
            }
        } else {
            submitHistory[this.formatData(new Date(), "YYYY-MM-DD")] = { IP: 0 }
            result = true
        }
        return result
    }

    updateSubmitNum(IP) {
        let submitHistory = this.fs.readFileSync(this.path.join(this.basePath, "IDE", "src", "submitHistory.json"), 'utf8')
        submitHistory = JSON.parse(submitHistory)
        if (submitHistory[this.formatData(new Date(), "YYYY-MM-DD")][IP]) {
            submitHistory[this.formatData(new Date(), "YYYY-MM-DD")][IP]++
        } else {
            submitHistory[this.formatData(new Date(), "YYYY-MM-DD")][IP] = 1
        }
        this.fs.writeFileSync(this.path.join(this.basePath, "IDE", "src", "submitHistory.json"), JSON.stringify(submitHistory))
    }

    // 为文件添加io尾缀
    ioFile(filePath) {
        let data = this.fs.readFileSync(filePath, 'utf8')
        if (this.setting.frontSocket) {
            const modifiedData = data + `
<script src="./data/cmsScripts/socket.io.js"></script>
<script src="./data/cmsScripts/cmsSocketClient.js"></script>
`
            return modifiedData;
        }
        return data
    }


    // filePath： 接收一个template文件夹中的文件，删除对应的dist中的文件
    removeFileFromDist(filePath) {
        filePath = filePath.replace(this.templatePath, this.distPath)
        try {
            if (filePath.endsWith(".html")) {
                if (filePath.includes(this.path.join(this.basePath, "Front", 'template', 'component'))) {
                    let fileName = this.path.basename(filePath)
                    console.log(fileName);
                }
                this.updateHTMLsScript()
            }
            this.fs.unlinkSync(filePath)

            this.log.info("remove file:" + filePath)
        } catch (error) {
            console.log(error);

            this.log.error(error.message)
        }
    }

    //当有组件更新
    updateHTMLsScript() {
        this.fs.readdirSync(this.path.join(this.basePath, "Front", 'template')).forEach(item => {
            let path = this.path.join(this.basePath, "Front", 'template', item)
            if (path.endsWith(".html")) {
                let newFile = this.fs.readFileSync(path, 'utf-8')
                newFile = this.extractComponents(newFile)
                newFile = (!newFile.includes('<link rel="stylesheet" href="./data/cmsScripts/quill.snow.css">')) ? newFile + '\n<link rel="stylesheet" href="./data/cmsScripts/quill.snow.css">' : newFile
                newFile = (!newFile.includes('<script src="./data/cmsScripts/quill.js"></script>')) ? newFile + '\n<script src="./data/cmsScripts/quill.js"></script>' : newFile
                newFile = (!newFile.includes('<script src="./data/cmsScripts/FinalCms.js"></script>')) ? newFile + '\n<script src="./data/cmsScripts/FinalCms.js"></script>' : newFile
                this.fs.writeFileSync(path.replace(this.templatePath, this.distPath), newFile)
            }
        })
    }
    updateHTMLScript(filePath) {
        let newFile = this.fs.readFileSync(filePath, 'utf-8')
        newFile = this.extractComponents(newFile)
        newFile = (!newFile.includes('<link rel="stylesheet" href="./data/cmsScripts/quill.snow.css">')) ? newFile + '\n<link rel="stylesheet" href="./data/cmsScripts/quill.snow.css">' : newFile
        newFile = (!newFile.includes('<script src="./data/cmsScripts/quill.js"></script>')) ? newFile + '\n<script src="./data/cmsScripts/quill.js"></script>' : newFile
        newFile = (!newFile.includes('<script src="./data/cmsScripts/FinalCms.js"></script>')) ? newFile + '\n<script src="./data/cmsScripts/FinalCms.js"></script>' : newFile
        return newFile
    }

    // 将template中的文件编译至dist文件夹
    compileFile(filePath) {
        //当修改的文件不为component
        if (filePath.includes(this.path.join(this.basePath, "Front", 'template', 'component'))) {

            this.updateHTMLsScript()
        } else {
            let fileName = filePath.replace(this.templatePath, "")
            try {

                let newFile
                let distFilePath = this.distPath + fileName;
                distFilePath = this.path.join(distFilePath)
                // 假如文件是html文件则进行处理
                if (distFilePath.endsWith(".html")) {
                    newFile = this.updateHTMLScript(this.path.join(this.templatePath, fileName), 'utf-8')
                } else {
                    newFile = this.fs.readFileSync(this.path.join(this.templatePath, fileName));
                }
                // 如果目标文件所在的文件夹不存在，则创建文件夹
                const folderPath = this.path.dirname(distFilePath);
                if (!this.fs.existsSync(folderPath)) {
                    this.log.info("add folder:" + folderPath)
                    this.fs.mkdirSync(folderPath, { recursive: true });
                }
                this.log.info("update folder:" + distFilePath)
                // 将文件内容写入目标文件
                this.fs.writeFileSync(distFilePath, newFile, { flag: 'w' });
            } catch (error) {
                // 处理错误，例如输出错误信息
                this.log.error(error.message)
            }
        }
    }

    // 将文件中包含的组件替换至相应位置
    extractComponents(fileContent) {
        // 正则表达式来匹配 <cms-component> 标签
        let regex = /<cms-component(?:\s+data="([^"]+)")?\s*>(.*?)<\/cms-component>/gs;
        let match;
        let components = [];

        // 使用正则表达式的 exec 方法来获取匹配结果
        while ((match = regex.exec(fileContent)) !== null) {
            let dataAttribute = match[1] || null;
            let componentContent = match[2].trim();
            let replaceString = match[0];

            components.push({
                componentName: componentContent,
                dataId: dataAttribute,
                replaceString: replaceString
            });
        }

        Array.from(components).forEach(item => {
            if (this.fs.existsSync(this.path.join(this.templatePath, "component", item.componentName + ".html"))) {
                let componentString = this.fs.readFileSync(this.path.join(this.templatePath, "component", item.componentName + ".html"), 'utf-8')
                componentString = this.extractScriptsAndContent(componentString, item.componentName)


                if (item.dataId != null) {
                    componentString = componentString.toString().replace("<cms-component>", `<cms-component data="${item.dataId}">`)
                }
                fileContent = (fileContent + "").replaceAll(item.replaceString, componentString)
            } else {
                this.log.error("no such component:" + item.componentName)
            }
        })
        return fileContent
    }

    //整理component中的js脚本
    extractScriptsAndContent(html, componentName) {

        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
        const scripts = [];

        // 提取所有 script 内容
        let match;
        while ((match = scriptRegex.exec(html)) !== null) {
            scripts.push(match[1].trim());
        }

        // 移除 script 标签
        let content = html.replace(scriptRegex, '').trim();
        let scriptStr = ""
        if (scripts.length > 0) {
            scripts.forEach(item => {
                scriptStr += item + "\n"
            })

            this.fs.writeFileSync(this.path.join(this.distPath, "data", "componentScripts", componentName + ".js"), scriptStr, { flag: 'w' });
            content += `\n<script src="./data/componentScripts/${componentName}.js"></script>`
        }
        return content;
    }
    //传入列表id返回列表对象数据
    readList(id) {
        return JSON.parse(this.fs.readFileSync(this.path.join(this.dataTemplatePath, 'list', `${id}.json`), "utf-8"))
    }

    writeNode(id, data) {
        this.fs.writeFileSync(this.path.join(this.dataTemplatePath, 'node', `${id}.json`), typeof data == "object" ? JSON.stringify(data) : data, { flag: 'w' })
        // return this.antiTemple.setDataFileFingerPrint(this.path.join(this.dataTemplatePath, 'node', `${id}.json`))// 在写入文件的时候将文件的指纹记录到缓存
    }

    writeNodeContent(id, data) {
        this.fs.writeFileSync(this.path.join(this.dataTemplatePath, 'content', `${id}.json`), typeof data == "object" ? JSON.stringify(data) : data, { flag: 'w' })
        // return this.antiTemple.setDataFileFingerPrint(this.path.join(this.dataTemplatePath, 'content', `${id}.json`))// 在写入文件的时候将文件的指纹记录到缓存
    }

    writeList(id, data) {
        this.fs.writeFileSync(this.path.join(this.dataTemplatePath, 'list', `${id}.json`), typeof data == "object" ? JSON.stringify(data) : data, { flag: 'w' })
        // return this.antiTemple.setDataFileFingerPrint(this.path.join(this.dataTemplatePath, 'list', `${id}.json`))// 在写入文件的时候将文件的指纹记录到缓存
    }
}

module.exports = new FrontExpress()