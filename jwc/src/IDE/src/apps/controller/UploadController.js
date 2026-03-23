BaseBackController = require("../BaseBackController")
class UploadController extends BaseBackController {
    constructor() {
        super()
        this.socketIo = require('socket.io');
        this.fs = require('fs');
        this.path = require('path');
        this.uploadFileMap = new Map()
    }

    initPost() {
        this.app.post('/uploadComponent', (req, res) => {
            let data = req.body
            console.log(req.body);
            if (this.uploadFileMap.has(data.id)) {
                this.uploadFileMap.get(data.id).data.push(data)
            } else {
                this.uploadFileMap.set(data.id, {
                    id: data.id,
                    randomFileName: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${req.body.fileName.split('.').pop()}`,
                    fileName: req.body.fileName,
                    size: req.body.size,
                    data: [data]
                })
            }
            res.send(this.checkFile(data));
        });
    }

    //检查文件上传进度
    checkFile(data) {
        let file = this.uploadFileMap.get(data.id)
        
        if (file.data.length == file.size) {
            let sortedData = file.data.sort((a, b) => a.index - b.index).map(item => item.data);
            let base64Data = sortedData.join('');
            base64Data = base64Data.split('base64,')[1];
            let buffer = Buffer.from(base64Data, 'base64');

            let filePath = this.path.join(this.dataDistPath, 'upload', 'file', file.randomFileName);
            this.fs.writeFileSync(filePath, buffer);
            this.uploadFileMap.delete(data.id)
            return {
                data: `/data/upload/file/${file.randomFileName}?originName=${file.fileName}`,
                msg: "文件上传完成",
                code: 200
            }
        } else {
            return {
                msg: "文件上传中",
                code: 201,
                schedule: file.data.length / file.size
            }
        }
    }
    //初始化socket
    initSocket() {
        this.io = this.socketIo(this.server);
        // 处理 WebSocket 连接
        this.io.on('connection', (socket) => {
            console.log("A user connected to WebSocket")
            socket.on('disconnect', () => {
                console.log("User disconnected from WebSocket")
            });
        });
    }
}

module.exports = new UploadController()