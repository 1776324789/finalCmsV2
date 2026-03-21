
const pageEidotr = new class PageEditor {
    constructor() {
        this.editor = null
        // 方法3: 使用 axios.create() 创建实例
        this.axios = axios.create({
            baseURL: BaseUrl,
            headers: {
                'authorization': localStorage.getItem("userToken"),
                'Content-Type': 'application/json'
            }
        });
        this.editorElement = document.getElementById("editor")
        this.dialog = document.getElementById('myDialog');
        this.preview = document.getElementById('preview');
        this.verifyInput = document.getElementById("verifyInput")
        this.verifyButton = document.getElementById("verifyButton")
        this.emptyTip = document.getElementById("emptyTip")
        this.notAllow = document.getElementById("notAllow")
        this.nowFile = null
        this.files = []
        this.init()
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault(); // 阻止默认保存行为
                this.save()
            }
        });
        this.verifyInput.addEventListener("input", () => {
            this.verifyInput.value.length > 6
            this.verifyInput.value = this.verifyInput.value.substring(0, 6)
        })
        this.verifyButton.onclick = () => {
            console.log(this.verifyInput.value);
            this.saveFile()
        }
        this.initEditor()
        this.loadFileTree()
    }

    closeDialog() {
        this.dialog.close();
    }

    openDialog() {
        this.dialog.showModal(); // 打开为模态窗口，带遮罩
    }

    save() {
        if (this.nowFile) {
            if (!Array.from(this.nowFile.element.classList).includes("change")) {
                return
            }
            this.openDialog()
        } else {
            document.tip.warn("未选择文件")
        }
    }

    async saveFile() {
        let res = await this.axios.post('/saveFile', {
            path: this.nowFile.data.path,
            content: this.value,
            secretKey: this.verifyInput.value
        })
        if (res.data.code == 200) {
            this.nowFile.element.classList.remove("change")
            this.closeDialog()
            document.tip.success("保存成功")
        } else if (res.data.code == 400) {
            document.tip.warn("令牌错误")
        } else if (res.data.code == 500) {
            document.tip.danger("系统错误")
        }
        this.verifyInput.value = ""
    }

    async loadFileTree() {
        let res = await this.axios.post('/getFileList')
        if (res.data.code == 200) {
            this.files = res.data.data;
            this.loadFileTreeElement()
        }
    }

    loadFileTreeElement() {
        this.files = this.sortFoldersFirst(this.files)
        this.files.forEach(file => {
            this.insertElement(file, null)
        })
    }

    insertElement(element, parentElement) {
        if (element.type == "folder") {
            const folder = dp(`<div>
                <div class="icon-arrow-drop-right-fill dirBlock" ref="dirName">
                   <span class="dirName">${element.name}</span>
                </div>
                <div class="fileChildBlock" ref="childBlock">
                </div>
            </div>`)
            if (parentElement)
                parentElement.appendChild(folder.element)
            else
                document.getElementById("foldBlock").appendChild(folder.element)
            element.child.forEach(child => {
                this.insertElement(child, folder.children.childBlock)
            })
            folder["data"] = element
            this.initFolderEvent(folder)
        } else {
            const file = dp(`<div class="fileName">${element.name}</div>`)
            if (parentElement)
                parentElement.appendChild(file.element)
            else
                document.getElementById("foldBlock").appendChild(file.element)
            file.element.classList.add(element.name.split(".").pop())

            file["data"] = element
            this.initFileEvent(file)
        }
    }

    initFolderEvent(folder) {
        let open = false
        folder.children.dirName.onclick = () => {
            if (open) {
                open = false
                folder.children.dirName.classList.remove("icon-arrow-drop-down-fill")
                folder.children.dirName.classList.add("icon-arrow-drop-right-fill")
                folder.children.childBlock.style.display = "none"
            } else {
                open = true
                folder.children.dirName.classList.remove("icon-arrow-drop-right-fill")
                folder.children.dirName.classList.add("icon-arrow-drop-down-fill")
                folder.children.childBlock.style.display = "block"
            }
        }
    }

    initFileEvent(file) {
        file.element.onclick = () => {
            if (this.nowFile) {
                this.nowFile.element.classList.remove("select")
            }
            file.element.classList.add("select")
            this.nowFile = file
            if (file.data.name.endsWith(".html") || file.data.name.endsWith(".css") || file.data.name.endsWith(".js") || file.data.name.endsWith(".json"))
                this.loadFileContent(file)
            else if (file.data.name.endsWith(".jpg") || file.data.name.endsWith(".png"))
                this.previewContent(file)
            else {
                this.notAllow.style.display = "block"
                this.emptyTip.style.display = "none"
                this.editorElement.style.display = "none"
                this.preview.style.display = "none"
            }
        }
        // file.element.addEventListener('contextmenu', function (event) {
        //     event.preventDefault();
        // });
        // file.element.onmouseup = (e) => {
        //     if (e.button == 2) {
        //         console.log("hello");
        //         e.cancelBubble = true
        //         let dirMenus = []
        //         dirMenus.push({
        //             name: "删除", fun: () => {

        //             }
        //         })
        //         document.mouseMenu.menu(dirMenus)
        //     }
        // }
    }

    previewContent(file) {
        this.notAllow.style.display = "none"
        this.emptyTip.style.display = "none"
        this.editorElement.style.display = "none"
        this.preview.style.display = "block"
        this.preview.innerHTML = ''; // 清空预览容器
        const img = document.createElement('img');
        img.src = FileUrl + file.data.path.replace("Front\\template", ""); // 设置图片的 src 属性为文件路径
        img.alt = file.data.name; // 设置图片的 alt 属性为文件名
        this.preview.appendChild(img); // 将图片添加到预览容器中
    }

    async loadFileContent(file) {
        if (file.data.content != null) {
            this.notAllow.style.display = "none"
            this.emptyTip.style.display = "none"
            this.editorElement.style.display = "block"
            this.preview.style.display = "none"
            this.editor.layout();
            this.value = file.data.content
            return
        }
        let res = await this.axios.post(BaseUrl + '/getFileContent', { path: file.data.path })
        if (res.data.code == 200) {
            let type
            if (file.data.name.endsWith(".html")) {
                type = "html"
            } else if (file.data.name.endsWith(".css")) {
                type = "css"
            } else if (file.data.name.endsWith(".js")) {
                type = "javascript"
            } else if (file.data.name.endsWith(".json")) {
                type = "json"
            }
            this.changeLanguage(type)
            this.notAllow.style.display = "none"
            this.emptyTip.style.display = "none"
            this.editorElement.style.display = "block"
            this.preview.style.display = "none"
            this.editor.layout();
            this.value = res.data.data
        }
    }

    initEditor() {
        require.config({
            paths: { 'vs': './js/dependence/monaco-editor' }
        });

        require(['vs/editor/editor.main'], () => {
            this.editor = monaco.editor.create(document.getElementById('editor'), {
                value: '',
                language: "",
            });
            this.editor.onDidChangeModelContent(() => {
                if (this.nowFile && this.nowFile.data.content != null && this.nowFile.data.content != this.value) {
                    this.nowFile.data.content = this.value
                    this.nowFile.element.classList.add("change")
                } else if (this.nowFile && this.nowFile.data.content == null) {
                    this.nowFile.data.content = this.value
                }
            });
        });
    }

    changeLanguage(newLang) {
        const model = this.editor.getModel();
        monaco.editor.setModelLanguage(model, newLang);
    }

    // 设置编辑器内容
    set value(value) {
        this.editor.setValue(value);
    }

    // 获取编辑器内容
    get value() {
        return this.editor.getValue();
    }

    sortFoldersFirst(data) {
        if (!Array.isArray(data)) return data;

        // 先分组：文件夹和文件
        const folders = data
            .filter(item => item.type === "folder")
            .map(folder => ({
                ...folder,
                // 递归对子文件夹排序
                child: this.sortFoldersFirst(folder.child || [])
            }));

        const files = data.filter(item => item.type === "file");

        return [...folders, ...files];
    }
}
