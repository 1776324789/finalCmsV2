import multer from 'multer'
import path from 'path'
import fs from 'fs'

const FileServer = (app, DB) => {
    const BaseUrl = process.cwd();
    // ⚠️ 上传目录（你自己改）
    const uploadPath = path.join(BaseUrl, 'Front', 'upload')

    // 自动创建目录
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
    }

    // 存储配置
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            const filename = Date.now() + '-' + Math.random().toString(36).slice(2) + ext
            cb(null, filename)
        }
    })

    const upload = multer({ storage })

    /**
     * 上传接口
     * file = 原图
     * cover = 压缩图
     */
    app.post(
        '/upload/image',
        upload.fields([
            { name: 'file', maxCount: 1 },
            { name: 'cover', maxCount: 1 }
        ]),
        async (req, res) => {
            try {
                const file = req.files?.file?.[0]
                const cover = req.files?.cover?.[0]

                if (!file || !cover) {
                    return res.json({
                        code: 400,
                        message: '文件缺失'
                    })
                }

                // ⚠️ 这里改成你的访问地址（CDN / 域名）
                const baseUrl = 'http://localhost:20829/'

                res.json({
                    code: 200,
                    data: {
                        url: baseUrl + file.filename,
                        cover: baseUrl + cover.filename
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