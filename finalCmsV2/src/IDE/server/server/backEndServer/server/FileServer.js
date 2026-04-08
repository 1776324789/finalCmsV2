import multer from 'multer'
import path from 'path'
import fs from 'fs'

const FileServer = (app) => {
    const BaseUrl = process.cwd();
    // 上传目录
    const uploadPath = path.join(BaseUrl, 'Front', 'ROOT', 'upload')

    // 存储配置
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const datePath = path.join(uploadPath, `${year}-${month}-${day}`);

            if (!fs.existsSync(datePath)) {
                fs.mkdirSync(datePath, { recursive: true })
            }

            cb(null, datePath)
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname) || '.jpg'
            const filename = Date.now() + '-' + Math.random().toString(36).slice(2) + ext
            cb(null, filename)
        }
    })

    const upload = multer({ storage })

    /**
     * 上传接口（支持单图 / 双图）
     * file = 原图（必传）
     * cover = 压缩图（可选）
     */
    app.tokenFileUpload(
        '/upload/image',
        upload.fields([
            { name: 'file', maxCount: 1 },
            { name: 'cover', maxCount: 1 }
        ]),
        async (req, res, user) => {
            try {
                const file = req.files?.file?.[0]
                const cover = req.files?.cover?.[0]

                // ❗ file 必须有
                if (!file) {
                    return res.json({
                        code: 400,
                        message: 'file 文件缺失'
                    })
                }
                // ✅ 修复文件名乱码
                const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')
                // 日期路径
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                const datePath = `${year}-${month}-${day}`;

                const baseUrl = 'http://localhost:20829/upload/'

                // 基础返回
                const result = {
                    url: baseUrl + datePath + '/' + file.filename,
                    filename: originalName
                }

                // 如果有 cover，就加上
                if (cover) {
                    result.cover = baseUrl + datePath + '/' + cover.filename
                }

                res.json({
                    code: 200,
                    data: result
                })

            } catch (e) {
                console.log(e)
                res.json({
                    code: 500,
                    message: '上传失败'
                })
            }
        }
    )

    // fileServer.js（新增）
    app.tokenFileUpload(
        '/upload/file',
        upload.single('file'), // ✅ 只接收一个文件
        async (req, res, user) => {
            try {
                const file = req.file

                if (!file) {
                    return res.json({
                        code: 400,
                        message: 'file 文件缺失'
                    })
                }

                // ✅ 修复文件名乱码
                const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')

                const today = new Date()
                const year = today.getFullYear()
                const month = String(today.getMonth() + 1).padStart(2, '0')
                const day = String(today.getDate()).padStart(2, '0')
                const datePath = `${year}-${month}-${day}`

                const baseUrl = 'http://localhost:20829/upload/'

                res.json({
                    code: 200,
                    data: {
                        url: baseUrl + datePath + '/' + file.filename,
                        filename: originalName, // ✅ 用修复后的
                        size: file.size,
                        type: file.mimetype
                    }
                })

            } catch (e) {
                console.log(e)
                res.json({
                    code: 500,
                    message: '上传失败'
                })
            }
        }
    )
}

export default FileServer