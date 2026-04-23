import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import { load } from 'cheerio'
import prettier from 'prettier'
const WebsiteFileSync = () => {
    const webappsDir = path.join(process.cwd(), 'IDE', 'server', 'webapps')
    const targetDir = path.join(process.cwd(), 'Front')

    function ensureDir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
    }

    function getTargetPath(srcPath) {
        const relative = path.relative(webappsDir, srcPath)
        // chokidar 总是返回使用/的路径，所以用/分割
        const parts = relative.split('\\')
        const siteName = parts.shift()

        if (!siteName) return null

        // 检查第一个目录段是否完全等于排除目录（排除其所有子目录）
        if (parts[0] === 'data' || parts[0] === 'CmsComponent') {
            return null
        }

        const relativePath = parts.join('/')

        return path.join(targetDir, siteName, relativePath)
    }

    async function handleHtmlFile(srcPath, targetPath) {
        try {
            let content = fs.readFileSync(srcPath, 'utf-8')

            const sitePath = path.dirname(srcPath)
            const siteName = path.basename(sitePath)
            const cmsComponentPath = path.join(sitePath, 'CmsComponent')

            content = replaceCmsComponents(content, cmsComponentPath)
            content = addFinalCmsScript(content, siteName)
            content = await formatHtml(content)
            ensureDir(path.dirname(targetPath))
            fs.writeFileSync(targetPath, content)
            console.log('同步 HTML 文件:', srcPath, '->', targetPath)
        } catch (error) {
            console.error('处理 HTML 文件失败:', error)
        }
    }
    async function formatHtml(content) {
        try {
            return await prettier.format(content, {
                parser: 'html',
                printWidth: 100,
                tabWidth: 2,
                useTabs: false,
                htmlWhitespaceSensitivity: 'ignore'
            })
        } catch (err) {
            console.error('HTML 格式化失败')
            return content
        }
    }
    function addFinalCmsScript(content, siteName) {
        const scriptTag = `<script>
            const Cms=document.createElement("script")
            Cms.src=window.location.origin+"/cmsScripts/FinalCms.js?web=${siteName}"
            document.body.appendChild(Cms)
        </script>`

        if (content.includes('</body>')) {
            return content.replace('</body>', `${scriptTag}\n</body>`)
        } else if (content.includes('</html>')) {
            return content.replace('</html>', `${scriptTag}\n</html>`)
        } else {
            return content + '\n' + scriptTag
        }
    }

    function replaceCmsComponents(content, cmsComponentPath) {
        const cmsComponentRegex = /<cms-component[^>]*>([^<]+)<\/cms-component>/g

        return content.replace(cmsComponentRegex, (match, componentName) => {
            const componentFileName = componentName.trim() + '.html'
            const componentFilePath = path.join(cmsComponentPath, componentFileName)

            if (fs.existsSync(componentFilePath)) {
                try {
                    let componentContent = fs.readFileSync(componentFilePath, 'utf-8').trim()
                    //需要特殊处理
                    componentContent = processComponentContent(componentContent)
                    return match.replace(componentName, componentContent)
                } catch (error) {
                    console.error('读取组件文件失败:', componentFilePath, error)
                    return match
                }
            } else {
                console.warn('组件文件不存在:', componentFilePath)
                return match
            }
        })
    }

    function processComponentContent(componentContent) {
        const $ = load(componentContent, {
            decodeEntities: false
        })

        const classMap = {}
        const genHash = () => Math.random().toString(36).slice(2, 8)

        // ==============================
        // 1️⃣ 收集 class + focus:class
        // ==============================
        $('[class], [focus\\:class], [focus\]').each((_, el) => {
            const classList = [
                ...($(el).attr('class') || '').split(/\s+/),
                ...($(el).attr('focus:class') || '').split(/\s+/),
                ...($(el).attr('focus') || '').split(/\s+/)
            ]

            classList.forEach(cls => {
                if (cls && !classMap[cls]) {
                    classMap[cls] = `${cls}-${genHash()}`
                }
            })
        })

        // ==============================
        // 2️⃣ 替换 class
        // ==============================
        $('[class]').each((_, el) => {
            const classList = ($(el).attr('class') || '').split(/\s+/)

            const newClassList = classList.map(cls => classMap[cls] || cls)

            $(el).attr('class', newClassList.join(' '))
        })

        // ==============================
        // 3️⃣ 替换 focus:class（单值）
        // ==============================
        $('[focus\\:class]').each((_, el) => {
            const cls = ($(el).attr('focus:class') || '').trim()

            if (classMap[cls]) {
                $(el).attr('focus:class', classMap[cls])
            }
        })
        // ==============================
        // 3️⃣ 替换 focus:class（单值）
        // ==============================
        $('[focus]').each((_, el) => {
            const cls = ($(el).attr('focus') || '').trim()

            if (classMap[cls]) {
                $(el).attr('focus', classMap[cls])
            }
        })

        // ==============================
        // 4️⃣ 替换 style
        // ==============================
        $('style').each((_, el) => {
            let css = $(el).html()
            if (!css) return

            css = css.replace(/\.([a-zA-Z0-9_-]+)/g, (match, cls) => {
                return classMap[cls] ? `.${classMap[cls]}` : match
            })

            $(el).html(css)
        })

        // ==============================
        // 5️⃣ 输出片段（避免 html/body/head）
        // ==============================
        const headContent = $('head').html() || ''
        const bodyContent = $('body').html() || ''

        return headContent + bodyContent
    }

    function syncFile(srcPath) {
        const targetPath = getTargetPath(srcPath)

        if (!targetPath) return

        ensureDir(path.dirname(targetPath))

        if (path.extname(srcPath) === '.html') {
            handleHtmlFile(srcPath, targetPath)
        } else {
            fs.copyFileSync(srcPath, targetPath)
            console.log('同步文件:', srcPath, '->', targetPath)
        }
    }

    function removeFile(srcPath) {
        const targetPath = getTargetPath(srcPath)

        if (!targetPath) return

        if (fs.existsSync(targetPath)) {
            fs.rmSync(targetPath, { recursive: true, force: true })
            console.log('删除文件:', targetPath)
        }
    }

    function handleFileChange(eventType, filePath) {
        switch (eventType) {
            case 'add':
            case 'change':
                if (filePath.includes('CmsComponent') && path.extname(filePath) === '.html') {
                    updateAllHtmlFiles(filePath)
                } else {
                    syncFile(filePath)
                }
                break
            case 'unlink':
                removeFile(filePath)
                break
        }
    }

    function updateAllHtmlFiles(changedComponentPath) {
        const sitePath = path.dirname(path.dirname(changedComponentPath))
        const siteName = path.basename(sitePath)

        console.log(`Component changed: ${changedComponentPath}, updating all HTML files in ${siteName}`)

        traverseAndUpdateHtml(sitePath)
    }

    function traverseAndUpdateHtml(directory) {
        const files = fs.readdirSync(directory, { withFileTypes: true })

        files.forEach(file => {
            const filePath = path.join(directory, file.name)

            if (file.isDirectory()) {
                if (file.name !== 'data' && file.name !== 'CmsComponent') {
                    traverseAndUpdateHtml(filePath)
                }
            } else if (file.isFile() && path.extname(filePath) === '.html') {
                const targetPath = getTargetPath(filePath)
                if (targetPath) {
                    handleHtmlFile(filePath, targetPath)
                }
            }
        })
    }

    function init() {
        if (!fs.existsSync(webappsDir)) {
            console.log('Webapps directory not found, creating...')
            ensureDir(webappsDir)
        }

        const watcher = chokidar.watch(webappsDir, {
            ignoreInitial: true,
            persistent: true
        })

        watcher
            .on('add', filePath => handleFileChange('add', filePath))
            .on('change', filePath => handleFileChange('change', filePath))
            .on('unlink', filePath => handleFileChange('unlink', filePath))
            .on('addDir', dirPath => {
                const targetPath = getTargetPath(dirPath)
                if (targetPath) {
                    ensureDir(targetPath)
                }
            })
            .on('unlinkDir', dirPath => {
                removeFile(dirPath)
            })

        console.log('Website file sync started, watching:', webappsDir)
    }

    init()
}

export default WebsiteFileSync()