import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'

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
        const parts = relative.split(path.sep)
        const siteName = parts.shift()

        if (!siteName) return null

        const relativePath = parts.join(path.sep)

        if (relativePath.startsWith('data') || relativePath.startsWith('CmsComponent')) {
            return null
        }

        return path.join(targetDir, siteName, relativePath)
    }

    function handleHtmlFile(srcPath, targetPath) {
        try {
            let content = fs.readFileSync(srcPath, 'utf-8')
            
            const sitePath = path.dirname(srcPath)
            const siteName = path.basename(sitePath)
            const cmsComponentPath = path.join(sitePath, 'CmsComponent')
            
            content = replaceCmsComponents(content, cmsComponentPath)
            content = addFinalCmsScript(content, siteName)
            
            ensureDir(path.dirname(targetPath))
            fs.writeFileSync(targetPath, content)
            console.log('同步 HTML 文件:', srcPath, '->', targetPath)
        } catch (error) {
            console.error('处理 HTML 文件失败:', error)
        }
    }

    function addFinalCmsScript(content, siteName) {
        const scriptTag = `<script src="cmsScripts/FinalCms.js?web=${siteName}"></script>`
        
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
                    const componentContent = fs.readFileSync(componentFilePath, 'utf-8').trim()
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