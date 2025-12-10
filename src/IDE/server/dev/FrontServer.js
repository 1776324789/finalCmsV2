const { log } = require("console");
const watch = require("../../utils/chokidar");
class FrontExpress {
    constructor() {
        this.fs = require("fs")
        this.path = require("path")
        this.port = 20829
        this.webDirs
        this.socketIo = require('socket.io');
        this.express = require('express');
        this.http = require('http');
        this.app = this.express();
        this.server = this.http.createServer(this.app);
        this.io = this.socketIo(this.server);
        this.init()
    }

    init() {
        //初始化网站列表
        this.webDirs = this.fs.readdirSync(this.path.join("Front"))
        this.initDistFiles()
        this.initServer()
        this.initDirListener()
    }

    //同步所有template文件至dist文件
    initDistFiles() {
        this.webDirs.forEach(dir => {
            this.readDirFiles(this.path.join("Front", dir, "template"), ["component"]).forEach(file => {
                this.cpFileToDist(dir, file)
            })
        })
    }

    //将文件从template转译到dist
    cpFileToDist(webDir, file) {
        if (file.endsWith(".html")) {
            this.compileHtmlFile(webDir, file)
        } else {
            this.copyFileWithDir(file, file.replace("template", "dist"));
        }
    }


    //复制文件
    copyFileWithDir(src, dest) {
        const fs = this.fs;
        const path = this.path;

        // 目标目录
        const dir = path.dirname(dest);

        // 如果目录不存在，递归创建
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // 获取文件大小
        const stat = fs.statSync(src);
        const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB 阈值，可修改

        // ------------------------
        // 小文件：直接复制（最快）
        // ------------------------
        if (stat.size < FILE_SIZE_LIMIT) {
            fs.copyFileSync(src, dest);
            return;
        }

        // ------------------------
        // 大文件：使用流复制
        // ------------------------
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(src);
            const writeStream = fs.createWriteStream(dest);

            readStream.on("error", reject);
            writeStream.on("error", reject);

            writeStream.on("close", () => {
                resolve();
            });

            readStream.pipe(writeStream);
        });
    }
    //编译前端文件
    compileHtmlFile(webDir, filePath) {
        let fileContent = this.fs.readFileSync(filePath, "utf-8")
        fileContent = this.extractHtmlComponents(webDir, fileContent)
        fileContent = this.extractHtmlScript(webDir, fileContent)
        this.fs.writeFileSync(filePath.replace("template", "dist"), fileContent, { flag: 'w' })
    }

    extractHtmlScript(webDir, fileContent) {
        fileContent += `\n<script src="cmsScripts/FinalCms.js?web=${webDir}"></script>`
        return fileContent
    }

    /**
     * 提取并替换组件
     */
    extractHtmlComponents(webDir, fileContent) {

        const regex = /<cms-component(?:\s+data="([^"]+)")?\s*>(.*?)<\/cms-component>/gs;
        const components = [];
        let match;

        while ((match = regex.exec(fileContent)) !== null) {
            components.push({
                componentName: match[2].trim(),
                dataId: match[1] || null,
                replaceString: match[0]
            });
        }

        components.forEach(item => {
            const componentPath = this.path.join("Front", webDir, 'template', "component", item.componentName + ".html");

            if (this.fs.existsSync(componentPath)) {
                let componentString = this.fs.readFileSync(componentPath, 'utf-8');
                // componentString = this.extractScriptsAndContent(componentString, item.componentName);

                if (item.dataId !== null) {
                    componentString = componentString.toString().replace("<cms-component>", `<cms-component data="${item.dataId}">`);
                }

                fileContent = fileContent.replaceAll(item.replaceString, componentString);
            } else {
                //发送消息，未找到相关组件  item.componentName
                this.io.emit('log-error', "未找到相关组件(cms-component)" + item.componentName);
            }
        });
        return fileContent
    }

    //重复component编译方法（未实装）
    /**
     * 传入组件原始 HTML + JS，返回已封装的组件实例代码
     * @param {string} htmlBlock <cms-component>...</cms-component>
     * @param {string} scriptBlock <script>...</script>
     * @param {number} instanceIndex 当前组件索引
     */
    compileCmsComponent(htmlBlock, scriptBlock, instanceIndex) {
        const instanceId = `cms_${instanceIndex}`;

        // 1. 抽取 html 与 script 内容
        const htmlContent = htmlBlock
            .replace(/<\/?cms-component>/g, '')
            .trim();

        const scriptContent = scriptBlock
            .replace(/<\/?script>/g, '')
            .trim();

        // 2. 给 html 中所有 id="xxx" 添加后缀
        const htmlWithScopedIds = htmlContent.replace(
            /\bid\s*=\s*["']([^"']+)["']/g,
            (m, id) => `id="${id}_${instanceId}"`
        );

        // 3. 替换脚本中 document.getElementById("xxx")
        //    匹配所有 `"原始id"` 并替换为 `"原始id_cms_x"`
        const scriptScoped = scriptContent.replace(
            /getElementById\s*\(\s*["']([^"']+)["']\s*\)/g,
            (m, id) => `getElementById("${id}_${instanceId}")`
        );

        // 4. script 封装为独立作用域
        const wrappedScript = `
<script>
(function(){
${scriptScoped}
})();
</script>`.trim();

        // 5. 替换 cms-component 为普通 div，附带 instance 标记
        const finalHtml = `
<div data-cms-instance="${instanceId}">
${htmlWithScopedIds}
</div>
${wrappedScript}
`.trim();

        return finalHtml;
    }



    //输出文件夹中的所有文件
    readDirFiles(dirPath, excludeDirs = []) {
        let result = [];
        const walk = (currentPath) => {
            const items = this.fs.readdirSync(currentPath);
            items.forEach(item => {
                const fullPath = this.path.join(currentPath, item);
                const stat = this.fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    // 过滤指定目录
                    if (excludeDirs.includes(item)) return;
                    walk(fullPath);
                } else {
                    result.push(fullPath); // 只有文件才加入结果
                }
            });
        }

        walk(dirPath);
        return result;
    }

    //初始化所有网站的文件监听
    initDirListener() {
        this.webDirs.forEach(dir => {
            watch(this.path.join("Front", dir, "template"), {
                onAdd: file => {
                    //console.log(file);
                },
                onDelete: file => {
                    //console.log(file);
                },
                onChange: file => {
                    if (this.path.join(file).startsWith(this.path.join("Front", dir, "template", "component")))
                        this.updateComponent(dir)
                    else
                        this.cpFileToDist(dir, file)
                    this.io.emit("file-changed")
                }
            })
        })
    }

    //更新网站所有组件引用
    updateComponent(webDir) {
        this.readDirFiles(this.path.join("Front", webDir, "template"), ["component"]).filter(item => item.endsWith(".html")).forEach(file => {
            this.compileHtmlFile(webDir, file)
        })
    }

    //初始化服务
    initServer() {
        // 首页（必须在正则路由前面）
        this.app.get("/", (req, res) => {
            const filePath = this.path.resolve("Front/ROOT/dist/index.html");
            res.type(".html");
            res.sendFile(filePath);
        });

        // 匹配除 "/" 以外所有路径
        this.app.get(/^\/.+/, (req, res) => {
            let filePath = this.initUrl(req.path);
            console.log(filePath);

            let ext = this.path.extname(filePath).toLowerCase();
            res.type(ext);

            if (ext != ".html") {
                if (this.fs.existsSync(filePath))
                    res.sendFile(this.path.resolve(filePath));
                else {
                    res.status(404)
                    res.end()
                }
            } else {
                res.send(this.getHtmlFile(filePath));
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
        let htmlContent = this.fs.readFileSync(filePath, 'utf8');
        htmlContent += `
<script>
${this.fs.readFileSync(this.path.join("IDE", "utils", 'socket.io.js'))}
</script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        var socket = io();

        socket.on('connect', function () {
            console.log('Successfully connected to server');
        });

        socket.on('file-changed', function () {
            window.location.reload();
        });

        socket.on('log-error', function (e) {
            console.error(e)
        });

        socket.on('disconnect', function () {
            console.log('Disconnected from server');
        });
    });
</script>`
        return htmlContent;
    }
}
module.exports = new FrontExpress()