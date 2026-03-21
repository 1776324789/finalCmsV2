class LogController {
    constructor() {
        this.path = require('path');
        this.fs = require("fs");//文件读取
        this.baseUrl = process.cwd();
        this.log = (...args) => {
            //console.log(...args)
        }
    }

    info(info) {
        this.appendCatalinaLine(this.getFullNowFormatDate() + " INFO:==>  " + info + "\n")
        this.log(info);
    }

    warn(info) {
        this.appendCatalinaLine(this.getFullNowFormatDate() + " WARN:==>  " + info + "\n")
        this.log(info);

    }

    error(info) {

        this.appendCatalinaLine(this.getFullNowFormatDate() + " ERROR:==> " + info + "\n")
        this.log(info);
    }

    appendCatalinaLine(line) {
        this.fs.appendFile(
            this.path.join(this.baseUrl, 'logs', 'catalina_' + this.getNowFormatDate() + ".log"),
            line,
            { flag: 'a' }, // 'a' 追加模式
            (err) => {
            }
        );
    }

    dataAccess(req, res) {
        let ip = req.ip;
        if (req.headers['x-forwarded-for']) {
            ip = req.headers['x-forwarded-for'].split(',')[0];
        }
        ip = ip.split(":")[ip.split(":").length - 1]
        let line = `${ip} ${this.getFullNowFormatDate()} ${req.method} ${req.path} HTTP:${res.req.httpVersion} ${res.statusCode}\n`
        this.log(line.substring(0, line.length - 1));
        this.fs.appendFile(
            this.path.join(this.baseUrl, 'logs', 'data_access_' + this.getNowFormatDate() + ".log"),
            line,
            { flag: 'a' }, // 'a' 追加模式
            (err) => {

            }
        );
    }

    backAccess(req, res) {
        let ip = req.ip;
        if (req.headers['x-forwarded-for']) {
            ip = req.headers['x-forwarded-for'].split(',')[0];
        }
        ip = ip.split(":")[ip.split(":").length - 1]
        let line = `${ip} ${this.getFullNowFormatDate()} ${req.method} ${req.path} HTTP:${res.req.httpVersion} ${res.statusCode}\n`
        this.log(line.substring(0, line.length - 1));

        this.fs.appendFile(
            this.path.join(this.baseUrl, 'logs', 'backAccess_' + this.getNowFormatDate() + ".log"),
            line,
            { flag: 'a' }, // 'a' 追加模式
            (err) => {

            }
        );
    }
    cmsAccess(req, res) {
        let ip = req.ip;
        if (req.headers['x-forwarded-for']) {
            ip = req.headers['x-forwarded-for'].split(',')[0];
        }
        ip = ip.split(":")[ip.split(":").length - 1]
        let line = `${ip} ${this.getFullNowFormatDate()} ${req.method} ${req.url} HTTP:${res.req.httpVersion} ${res.statusCode} ${JSON.stringify(req.body)}\n`
        this.log(line.substring(0, line.length - 1));

        this.fs.appendFile(
            this.path.join(this.baseUrl, 'logs', 'cmsAccess_' + this.getNowFormatDate() + ".log"),
            line,
            { flag: 'a' }, // 'a' 追加模式
            (err) => {

            }
        );
    }
    frontAccess(req, res) {
        let ip = req.ip;
        if (req.headers['x-forwarded-for']) {
            ip = req.headers['x-forwarded-for'].split(',')[0];
        }
        ip = ip.split(":")[ip.split(":").length - 1]
        let line = `${ip} ${this.getFullNowFormatDate()} ${req.method} ${req.url} HTTP:${res.req.httpVersion} ${res.statusCode}\n`
        this.log(line.substring(0, line.length - 1));

        this.fs.appendFile(
            this.path.join(this.baseUrl, 'logs', 'frontAccess_' + this.getNowFormatDate() + ".log"),
            line,
            { flag: 'a' }, // 'a' 追加模式
            (err) => {

            }
        );
    }
    // 获取当前日期的格式化字符串 YYYY-MM-DD
    getNowFormatDate() {
        let date = new Date()
        return `${date.getFullYear()}-${date.getMonth() >= 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}`
    }
    // 获取当前日期的格式化字符串 YYYY-MM-DD
    getFullNowFormatDate() {
        let date = new Date()
        return `${date.getFullYear()}-${date.getMonth() >= 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()} ${date.getHours() > 9 ? date.getHours() : "0" + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}:${date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()}`
    }
}

module.exports = new LogController()