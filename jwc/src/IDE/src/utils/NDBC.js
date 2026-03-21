const mysql = require('mysql2/promise');

class NDBC {
    constructor(data) {
        this.setting = data
        this.connection = null
        this.databaseResult = {};
    }

    //连接
    async connect() {
        try {
            // 创建连接
            this.connection = await mysql.createConnection(this.setting);
            setTimeout(() => {
                this.end()
            }, 10 * 60 * 1000)
            return { code: 200, message: "success" }
        } catch (e) {
            return { code: 400, message: e }
        }
    }

    //关闭连接
    async end() {
        await this.connection.end();
        this.connection = null
    }

    //获取数据
    async getData() {
        try {
            if (this.connection == null) await this.connect()
            // 执行查询
            this.databaseResult.list = await this.connection.query('SELECT * FROM list');
            this.databaseResult.node = await this.connection.query('SELECT * FROM node');
            this.databaseResult.content = await this.connection.query('SELECT * FROM content');
            this.databaseResult.list = this.databaseResult.list[0]
            this.databaseResult.node = this.databaseResult.node[0]
            this.databaseResult.content = this.databaseResult.content[0]
            return { code: 200, data: this.databaseResult, message: "success" }
        } catch (e) {
            return { code: 400, message: e }
        }
    }
}


module.exports = NDBC;
