import SystemController from '../../../DataBase/SystemController.js'
import fs from 'fs'
import path from 'path'
import { formatTimestamp } from '../../../utils/timeUtils.js'

const WebsiteManageServer = (app) => {
    const webappsDir = path.join(process.cwd(), 'IDE', 'server', 'webapps')
    const frontDir = path.join(process.cwd(), 'Front')

    // 获取站点列表
    app.tokenPost("/getWebsiteList", async (req, res, user) => {
        const websiteList = await SystemController.getWebsiteList()
        return res.json({ code: 200, data: websiteList })
    })

    // 创建站点
    app.tokenPost("/createWebsite", async (req, res, user) => {
        const { name, target } = req.body

        if (!name || !target) {
            return res.json({ code: 400, message: "站点名称和标识不能为空" })
        }

        // 检查标识是否已存在
        const DB = await SystemController.getDB()
        const existingWebsite = DB.website.find(w => w.target === target)
        if (existingWebsite) {
            return res.json({ code: 400, message: "站点标识已存在" })
        }

        // 创建站点目录结构
        const webappSiteDir = path.join(webappsDir, target)
        const frontSiteDir = path.join(frontDir, target)

        try {
            // 创建 webapps 下的站点目录
            fs.mkdirSync(webappSiteDir, { recursive: true })
            fs.mkdirSync(path.join(webappSiteDir, 'data'), { recursive: true })
            fs.mkdirSync(path.join(webappSiteDir, 'data', 'content'), { recursive: true })
            fs.mkdirSync(path.join(webappSiteDir, 'CmsComponent'), { recursive: true })

            // 创建 Front 下的站点目录
            fs.mkdirSync(frontSiteDir, { recursive: true })
            fs.mkdirSync(path.join(frontSiteDir, 'css'), { recursive: true })
            fs.mkdirSync(path.join(frontSiteDir, 'js'), { recursive: true })
            fs.mkdirSync(path.join(frontSiteDir, 'data'), { recursive: true })

            // 创建默认的 list.json
            const listJsonPath = path.join(webappSiteDir, 'data', 'list.json')
            fs.writeFileSync(listJsonPath, JSON.stringify([], null, 2))

            // 创建默认的 index.html
            const indexHtmlPath = path.join(webappSiteDir, 'index.html')
            const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
</head>

<body>
    <cms-component>head</cms-component>
    <script src="cmsScripts/FinalCms.js?web=${target}"></script>
</body>

</html>`
            fs.writeFileSync(indexHtmlPath, indexHtmlContent)

            // 创建默认的 head 组件
            const headComponentPath = path.join(webappSiteDir, 'CmsComponent', 'head.html')
            fs.writeFileSync(headComponentPath, `<div>${name} - 头部组件</div>`)

            // 创建 404.html
            const fourZeroFourPath = path.join(webappSiteDir, '404.html')
            const fourZeroFourContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <style>
        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { text-align: center; }
        h1 { font-size: 72px; color: #333; margin-bottom: 20px; }
        p { font-size: 18px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <p>Page not found</p>
    </div>
</body>
</html>`
            fs.writeFileSync(fourZeroFourPath, fourZeroFourContent)

            // 在数据库中添加站点记录
            const newWebsite = {
                id: SystemController.generateWebsiteId(),
                name: name,
                target: target,
                status: true,
                createTime: formatTimestamp(new Date()),
                createBy: user.username,
                updateTime: formatTimestamp(new Date()),
                updateBy: user.username
            }
            DB.website.push(newWebsite)

            const dbPath = path.join(process.cwd(), 'IDE', 'server', 'DataBase', 'systemData.json')
            fs.writeFileSync(dbPath, JSON.stringify(DB, null, 4))

            return res.json({ code: 200, message: "站点创建成功", data: newWebsite })
        } catch (error) {
            console.error('创建站点失败:', error)
            return res.json({ code: 500, message: "创建站点失败：" + error.message })
        }
    })

    // 更新站点
    app.tokenPost("/updateWebsite", async (req, res, user) => {
        const { id, name, target, status,defaultAdmin } = req.body

        if (!id) {
            return res.json({ code: 400, message: "站点 ID 不能为空" })
        }

        const DB = await SystemController.getDB()
        const websiteIndex = DB.website.findIndex(w => w.id === id)

        if (websiteIndex === -1) {
            return res.json({ code: 404, message: "站点不存在" })
        }

        // 如果修改了 target，需要重命名目录
        const oldTarget = DB.website[websiteIndex].target
        if (target && target !== oldTarget) {
            // 检查新标识是否已存在
            const existingWebsite = DB.website.find(w => w.target === target && w.id !== id)
            if (existingWebsite) {
                return res.json({ code: 400, message: "站点标识已存在" })
            }

            // 重命名目录
            const oldWebappDir = path.join(webappsDir, oldTarget)
            const newWebappDir = path.join(webappsDir, target)
            const oldFrontDir = path.join(frontDir, oldTarget)
            const newFrontDir = path.join(frontDir, target)

            if (fs.existsSync(oldWebappDir)) {
                fs.renameSync(oldWebappDir, newWebappDir)
            }
            if (fs.existsSync(oldFrontDir)) {
                fs.renameSync(oldFrontDir, newFrontDir)
            }
        }

        // 更新数据库
        DB.website[websiteIndex].name = name !== undefined ? name : DB.website[websiteIndex].name
        DB.website[websiteIndex].target = target !== undefined ? target : DB.website[websiteIndex].target
        DB.website[websiteIndex].status = status !== undefined ? status : DB.website[websiteIndex].status
        DB.website[websiteIndex].updateTime = formatTimestamp(new Date())
        DB.website[websiteIndex].updateBy = user.username
        DB.website[websiteIndex].defaultAdmin = defaultAdmin !== undefined ? defaultAdmin : DB.website[websiteIndex].defaultAdmin

        const dbPath = path.join(process.cwd(), 'IDE', 'server', 'DataBase', 'systemData.json')
        fs.writeFileSync(dbPath, JSON.stringify(DB, null, 4))

        return res.json({ code: 200, message: "更新成功" })
    })

    // 删除站点
    app.tokenPost("/deleteWebsite", async (req, res, user) => {
        const { id } = req.body

        if (!id) {
            return res.json({ code: 400, message: "站点 ID 不能为空" })
        }

        const DB = await SystemController.getDB()
        const websiteIndex = DB.website.findIndex(w => w.id === id)

        if (websiteIndex === -1) {
            return res.json({ code: 404, message: "站点不存在" })
        }

        const target = DB.website[websiteIndex].target

        // 删除目录
        const webappSiteDir = path.join(webappsDir, target)
        const frontSiteDir = path.join(frontDir, target)

        if (fs.existsSync(webappSiteDir)) {
            fs.rmSync(webappSiteDir, { recursive: true, force: true })
        }
        if (fs.existsSync(frontSiteDir)) {
            fs.rmSync(frontSiteDir, { recursive: true, force: true })
        }

        // 从数据库移除
        DB.website.splice(websiteIndex, 1)

        const dbPath = path.join(process.cwd(), 'IDE', 'server', 'DataBase', 'systemData.json')
        fs.writeFileSync(dbPath, JSON.stringify(DB, null, 4))

        return res.json({ code: 200, message: "删除成功" })
    })

    // 获取站点详情
    app.tokenPost("/getWebsiteDetail", async (req, res, user) => {
        const { id } = req.body

        if (!id) {
            return res.json({ code: 400, message: "站点 ID 不能为空" })
        }

        const DB = await SystemController.getDB()
        const website = DB.website.find(w => w.id === id)

        if (!website) {
            return res.json({ code: 404, message: "站点不存在" })
        }

        return res.json({ code: 200, data: website })
    })
}

export default WebsiteManageServer
