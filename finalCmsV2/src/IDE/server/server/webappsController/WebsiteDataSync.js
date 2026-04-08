import fs from 'fs'
import chokidar from 'chokidar'
import path from 'path'

const WebsiteDataSync = () => {
    const webappsDir = path.join(process.cwd(), 'IDE', 'server', 'webapps')
    const targetDir = path.join(process.cwd(), 'Front')

    function ensureDir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
    }

    /** ✅ 获取目标路径（核心逻辑） */
    function getTargetPath(srcPath) {
        const relative = path.relative(webappsDir, srcPath)

        // 👉 拆分路径：baidu/data/xxx.json
        const parts = relative.split(path.sep)

        const siteName = parts.shift() // 👉 一级目录 = 网站名
        
        // 👉 确保是 data 目录
        if (parts[0] !== 'data') {
            return null
        }
        
        parts.shift() // 移除 data 目录

        // 👉 拼接到目标目录
        const targetBase = path.join(targetDir, siteName)

        return path.join(targetBase, ...parts)
    }

    /** 处理 list.json（你可以自定义逻辑） */
    function handleListJson(srcPath, targetPath) {
        try {
            const content = fs.readFileSync(srcPath, 'utf-8')
            let data = JSON.parse(content)

            // 👉 你的处理逻辑（这里你自己扩展）
            // data.xxx = ...
            data = filterTree(data)
            const newContent = JSON.stringify(data, null, 2)

            ensureDir(path.dirname(targetPath))
            fs.writeFileSync(targetPath, newContent)

        } catch (e) {
            console.error('处理 list.json 失败:', e)
        }
    }


    /**
        * 过滤树结构数据，移除已删除的节点
        * @param {Array} arr 树结构数组
        * @returns {Array} 过滤后的树结构数组
        */
    function filterTree(arr) {
        if (!Array.isArray(arr)) return []

        return arr
            .filter(item => item.delFlag !== 1 && item.publish) // 先过滤当前层，移除已删除的节点
            .map(item => {
                const newItem = { ...item }

                // 递归处理 children（子节点）
                if (Array.isArray(newItem.children)) {
                    newItem.children = filterTree(newItem.children)
                }

                // 处理 nodes（非递归）
                if (Array.isArray(newItem.nodes)) {
                    newItem.nodes = newItem.nodes.filter(n => n.delFlag !== 1 && n.publish)
                }

                return newItem
            })
    }

    /** 同步文件 */
    function syncFile(srcPath) {
        const targetPath = getTargetPath(srcPath)

        if (!targetPath) return

        ensureDir(path.dirname(targetPath))

        if (path.basename(srcPath) === 'list.json') {
            handleListJson(srcPath, targetPath)
        } else {
            fs.copyFileSync(srcPath, targetPath)
        }
        if (path.basename(srcPath).endsWith(".json")) {

            console.log(path.join(path.dirname(srcPath), "modifyInfo.json"));
            const data = {
                "updateTime": Date.now()
            }
            fs.writeFileSync(path.join(path.dirname(srcPath), "modifyInfo.json"), JSON.stringify(data, null, 2))
        }
    }

    /** 删除文件 */
    function removeFile(srcPath) {
        const targetPath = getTargetPath(srcPath)

        if (!targetPath) return

        if (fs.existsSync(targetPath)) {
            fs.rmSync(targetPath, { recursive: true, force: true })
            console.log('删除:', targetPath)
        }
    }

    function init() {
        const watcher = chokidar.watch(webappsDir, {
            ignoreInitial: true,
            persistent: true
        })

        watcher
            .on('add', syncFile)
            .on('change', syncFile)
            .on('unlink', removeFile)
            .on('addDir', dirPath => {
                const targetPath = getTargetPath(dirPath)
                if (targetPath) {
                    ensureDir(targetPath)
                }
            })
            .on('unlinkDir', removeFile)

        console.log('前端文件监听同步已启动:', webappsDir)
    }

    init()
}

export default WebsiteDataSync()