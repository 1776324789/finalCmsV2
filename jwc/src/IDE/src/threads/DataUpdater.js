// data 文件夹监听
// data/template 文件夹编译至 data/dist文件夹
class DataUpdater {
    constructor() {
        this.path = require('path');
        this.fs = require("fs");//文件读取
        this.chokidar = require('chokidar');//文件监听
        this.baseUrl = process.cwd();
        const os = require('os');
        this.dataTemplatePath = this.path.join(this.baseUrl, "data", "template")
        this.dataDistPath = this.path.join(this.baseUrl, "data", "dist")
        this.platform = os.platform();
        this.log = require("../utils/LogController")
        this.setting = require("../../setting")
        this.init()
    }

    init() {
        // 创建文件夹监听,监听前台文件
        this.dataWatcher = this.chokidar.watch(this.dataTemplatePath, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true
        });
        this.initWatcher()
    }

    // 初始化文件监听
    initWatcher() {
        this.dataWatcher.on('add', filePath => {
            setTimeout(() => {
                this.compileDataFile(filePath)
            }, 2000);
        }).on('change', filePath => {
            setTimeout(() => {
                this.compileDataFile(filePath)
            }, 2000);
        }).on('unlink', path => {
            this.removeFileFromDataDist(path)
        });
    }

    // filePath： 接收一个后台template文件夹中的文件，删除对应的后台dist中的文件
    removeFileFromDataDist(filePath) {
        filePath = filePath.replace(this.dataTemplatePath, this.dataDistPath)
        try {
            this.fs.unlinkSync(filePath)
            this.log.info("remove file:" + filePath)
        } catch (error) {
            this.log.error(error.message)
        }
    }

    // 将后台template中的文件编译至dist文件夹
    compileDataFile(filePath) {
        let fileName = filePath.replace(this.dataTemplatePath, "")
        try {
            let distFilePath = this.path.join(this.dataDistPath, fileName)
            // 当文件不存在，则写入
            if (!this.fs.existsSync(this.path.join(this.dataDistPath, fileName))) {
                let newFile = this.fs.readFileSync(filePath)
                // 如果目标文件所在的文件夹不存在，则创建文件夹
                const folderPath = this.path.dirname(distFilePath);
                if (!this.fs.existsSync(folderPath)) {
                    this.log.info("add folder:" + folderPath)
                    this.fs.mkdirSync(folderPath, {recursive: true});
                }
                this.log.info("add file:" + distFilePath)
                // 将文件内容写入目标文件
                this.fs.writeFileSync(distFilePath, newFile, {flag: 'w'});
            } else {
                let distFileStat = this.fs.statSync(this.path.join(this.dataDistPath, fileName))
                let templateFileStat = this.fs.statSync(filePath)
                if (distFileStat.size != templateFileStat.size) {
                    let newFile = this.fs.readFileSync(filePath)
                    // 如果目标文件所在的文件夹不存在，则创建文件夹
                    const folderPath = this.path.dirname(distFilePath);
                    if (!this.fs.existsSync(folderPath)) {
                        this.log.info("add folder:" + folderPath)
                        this.fs.mkdirSync(folderPath, {recursive: true});
                    }
                    this.log.info("update file:" + distFilePath)
                    // 将文件内容写入目标文件
                    this.fs.writeFileSync(distFilePath, newFile, {flag: 'w'});
                }
            }
        } catch (error) {
            // 处理错误，例如输出错误信息
            this.log.error(error.message);
        }
    }
}


const dataUpdater = new DataUpdater()
module.exports = dataUpdater
