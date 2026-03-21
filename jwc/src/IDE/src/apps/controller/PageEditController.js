const BaseBackController = require("../BaseBackController")

class PageEditController extends BaseBackController {
    constructor() {
        super()
        this.verifyTOTP = require("../../utils/TOTP")
    }

    initPost() {
        this.post('/getFileList', (req, res) => {
            res.send({ code: 200, message: "success", data: this.traverseDirectory(this.path.join(this.basePath, 'Front', 'template'), this.basePath) });
        });
        this.post('/getFileContent', (req, res) => {
            const filePath = this.path.join(this.basePath, req.body.path);
            const fileContent = this.fs.readFileSync(filePath, 'utf-8');
            res.send({ code: 200, message: "success", data: fileContent });
        });

        this.post("/saveFile", (req, res) => {
            try {
                let result = this.verifyTOTP(req.body.secretKey)

                if (result.code == 401) { res.send({ "code": 400, "message": "密钥错误" }); }
                else if (result.code == 200) {
                    const filePath = this.path.join(this.basePath, req.body.path);
                    this.fs.writeFileSync(filePath, req.body.content, 'utf-8');
                    res.send({ code: 200, message: "success" });
                } else if (result.code == 400) {
                    res.send({ code: 500, message: "系统错误" });
                }
            } catch (error) {
                res.send({ code: 500, message: "系统错误" });
            }

        });
    }
    traverseDirectory(dirPath, basePath) {
        const items = [];
        const files = this.fs.readdirSync(dirPath);

        files.forEach(file => {
            const fullPath = this.path.join(dirPath, file);
            const stat = this.fs.statSync(fullPath);
            const relativePath = this.path.relative(basePath, fullPath);

            if (stat.isDirectory()) {
                // 递归处理子文件夹
                const children = this.traverseDirectory(fullPath, basePath);

                // 只有当子文件夹不为空时才添加到结果中
                if (children.length > 0) {
                    items.push({
                        name: file,
                        type: 'folder',
                        path: relativePath,
                        child: children
                    });
                }
            } else if (stat.isFile()) {
                // 检查文件扩展名
                const ext = this.path.extname(file).toLowerCase();
                // if (['.html', '.css', '.js'].includes(ext)) {
                items.push({
                    name: file,
                    type: 'file',
                    path: relativePath
                });
                // }
            }
        });

        return items;
    }
}

module.exports = new PageEditController()