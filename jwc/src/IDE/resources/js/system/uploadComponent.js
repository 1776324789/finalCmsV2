//生成dom队列
function dp(pageString) {
    let domElement = {}
    pageString = pageString.replaceAll("\n", '').replaceAll("\t", '');
    let content = document.createElement("div")
    content.innerHTML = pageString
    domList(content.childNodes[0], domElement)
    return {
        element: content.childNodes[0],
        children: domElement
    }
}

//生成dom队列
function domList(dom, domElement) {
    initDomFunctions(dom)
    if (dom.getAttribute != null && dom.getAttribute("ref") != "" && dom.getAttribute("ref") != null) {
        domElement[dom.getAttribute("ref")] = dom
    }
    if (dom.childNodes.length > 0) {
        dom.childNodes.forEach((node) => {
            domList(node, domElement)
        })
    }
}

function dc(tag, Class) {
    let element = document.createElement(tag)
    if (Class != null) {
        if (typeof Class == "string") {
            element.classList.add(Class)
        } else {
            Class.forEach((className) => {
                element.classList.add(className)
            })
        }
    }
    initDomFunctions(element)
    return element
}

//初始化Dom的函数
function initDomFunctions(dom) {
    dom["show"] = (display) => {
        if (display == null) {
            dom.style.display = "block"
        } else {
            dom.style.display = display
        }
        return dom
    }
    dom["hide"] = () => {
        dom.style.display = "none"
        return dom
    }
    dom["val"] = (val) => {
        dom.value = val
        return dom
    }
    dom["txt"] = (text) => {
        dom.innerText = text
        return dom
    }
    dom["add"] = (ele) => {
        dom.appendChild(ele)
        return dom
    }

}

// 传入变量判断其是否是数字
// 是：返回整数
// 否：返回false
function toNum(inputContent) {
    // 将输入内容转换成字符串
    inputContent = String(inputContent);

    // 检查输入内容是否为数字
    if (!isNaN(inputContent)) {
        // 如果是数字，返回数字或取整后的数字
        if (inputContent.includes('.')) {
            return Math.floor(parseFloat(inputContent)); // 返回取整后的数字
        } else {
            return parseInt(inputContent); // 返回整数
        }
    } else {
        // 如果不是数字，返回 false
        return false;
    }
}



class AUpload extends HTMLElement {
    constructor() {
        super()
        this.element
        this.refs
        this.fileNum = 0
        this.valueTemp = []
    }

    get value() {

    }

    set value(value) {

    }

    connectedCallback() {
        this.initStyle()
        this.initElement()
    }

    initStyle() {
        let style = dc("style")
        style.innerText = `        a-upload .mainUploadBlock {
            display: flex;
        }

        a-upload .mainUploadBlock .uploadButton {
            background-color: #55aaff;
            color: #fff;
            width: 110px;
            height: 30px;
            border: 0;
            border-radius: 2px;
            margin-top: 10px;
            cursor: pointer;
        }

        a-upload .mainUploadBlock .fileBlock {
            border-radius: 5px;
            overflow: hidden;
            height: 100%;
            width: 100px;
            margin-left: 5px;
            margin-right: 5px;
            position: relative;
            border: 1px solid #efefef;
        }

        a-upload .mainUploadBlock .fileBlock .icon {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 75px;
        }

        a-upload .mainUploadBlock .fileList {
            display: flex;
        }

        a-upload .mainUploadBlock .fileName {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            font-size: 14px !important;
            position: absolute;
            top: calc(100% - 20px);
            left: 50%;
            width: 90px;
            padding-left: 5px;
            padding-right: 5px;
            word-break: break-all;
            transform: translate(-50%, -50%);
            font-size: 75px;
        }

        a-upload .mainUploadBlock .fileType {
            position: absolute;
            top: calc(40% + 10px);
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 14px !important;
            color: #fff;
            font-weight: bold;
            z-index: 10;
        }

        a-upload .mainUploadBlock .uploading .icon {
            color: #55aaff;
        }

        a-upload .mainUploadBlock .uploading .fileName {
            color: #55aaff;
        }

        a-upload .mainUploadBlock .success .icon {
            color: #75d448;
        }

        a-upload .mainUploadBlock .success .fileName {
            color: #75d448;
        }

        a-upload .mainUploadBlock .danger .icon {
            color: #ff5555;
        }

        a-upload .mainUploadBlock .danger .fileName {
            color: #ff5555;
        }

        a-upload .mainUploadBlock .close {
            font-size: 20px;
            position: absolute;
            right: 5px;
            top: 5px;
            cursor: pointer;
            color: #ccc;
        }

        a-upload .mainUploadBlock .close:hover {
            color: #55aaff;
        }

        a-upload .mainUploadBlock .loadingBlock {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.25);
            z-index: 100;
            text-align: center;
        }

        a-upload .mainUploadBlock .loadingIcon {
            font-size: 30px;
            color: #fff;
        }

        a-upload .mainUploadBlock .loadingFont {
            font-size: 14px;
            color: #fff;
            margin-top: 10px;
        }`
        document.body.appendChild(style)
    }
    initElement() {
        let ele = dp(`<div class="mainUploadBlock">
            <div>
                <div
                    style="width: 100px;height: 100px;border: 1px solid #ccc;border-radius: 5px;padding: 5px;overflow: hidden;position: relative;">
                    <div
                        style="width: 100px;height: 100px;pointer-events: none;position: absolute;top: 5px;left: 5px;text-align: center;line-height: 100px;">
                        <span style="font-size: 60px;color: #ccc;" class="icon-add-line"></span>
                        <span
                            style="line-height: 25px;font-size: 12px;color: #ccc;position: absolute;bottom: 0;left: 0;width: 100px;text-align: center;top: 75px;">点击/拖动文件</span>
                    </div>
                    <input style="width: 100px;height: 100px;position: absolute;top: 0;left: 0;opacity: 0;" type="file"
                        ref="fileInput" />
                </div>
                <button ref="uploadButton" class="uploadButton">上传</button>
            </div>
            <div class="fileList" ref="fileList">
               
            </div>
        </div>`)
        this.element = ele.element
        this.refs = ele.children

        if (this.getAttribute("multiple") != null && this.getAttribute("multiple") != "") {
            this.multiple = Number.parseInt(this.getAttribute("multiple"))
            if (isNaN(this.getAttribute("multiple"))) {
                this.multiple = 1
            }
        } else {
            this.multiple = 1
        }
        if (this.multiple == 0) {
            this.disabled = true
        }
        if (this.multiple > 1) {
            this.refs.fileInput.multiple = true
        }
        if (this.getAttribute("auto") == "false") {
            this.refs.uploadButton.style.display = "none"
            this.refs.fileInput.onchange = () => {
                this.uploadFile()
            }
        } else {
            this.refs.uploadButton.onclick = () => {
                this.uploadFile()
            }
        }
        this.appendChild(this.element)

    }

    async uploadFile() {
        const fileInput = this.refs.fileInput;
        const files = fileInput.files;
        if (files.length === 0) return
        if (files.length > this.multiple || this.fileNum + files.length > this.multiple) {
            fileInput.files = null
            return document.tip.warn("超过文件上传数量限制")
        }

        Array.from(files).forEach(file => {
            this.fileNum++
            let fileEle = this.createFile(file)

            this.refs.fileList.appendChild(fileEle.element)

            const reader = new FileReader();

            reader.onload = (e) => {
                const base64 = e.target.result;
                let data = this.splitFile(base64);
                let id = Date.now().toString(36)
                let errorTimes = 0
                const upload = (index) => {
                    data[index].id = id
                    data[index].fileName = file.name
                    data[index]["size"] = data.length
                    fetch(BaseUrl + `/uploadComponent`, {
                        method: 'POST', body: JSON.stringify(data[index]), headers: {
                            'authorization': localStorage.getItem("userToken"), 'Content-Type': 'application/json'
                        },
                    }).then(response => response.json()).then(res => {
                        console.log(res);
                        
                        if (res.code == 200) {
                            fileEle.success(res.data)
                        } else if (res.code == 201) {
                            fileEle.schedule(res.schedule * 100)
                            upload(index + 1)
                        }
                    }).catch(error => {
                        errorTimes++
                        if (errorTimes < 10) {
                            console.log(error);
                            upload(index)
                        } else {
                            fileEle.danger()
                        }
                    })
                }
                upload(0)
            };
            reader.onerror = function (e) {
                console.error("File could not be read! Code " + e.target.error.code);
            };
            reader.readAsDataURL(file); // 读取文件为Base64
        })
    }
    createFile(file) {
        let element = dp(`<div class="fileBlock uploading">
                    <div class="loadingBlock" ref="loadingBlock">
                        <div style="flex: 1;"></div>
                        <span class="icon-loader-3-fill loadingIcon"></span>
                        <span class="loadingFont" ref="schedule"></span>
                        <div style="flex: 1;"></div>
                    </div>
                    <span class="icon-close-circle-line close"></span>
                    <span class="fileType">${file.name.split(".")[file.name.split(".").length - 1]}</span>
                    <span class="icon-file-fill icon"></span>
                    <span class="fileName" ref="fileName">${file.name}</span>
                </div>`)
        element.schedule = (i) => {
            element.children.schedule.innerText = (i * 1).toFixed(2) + "%"
        }
        element.success = (data) => {
            element.element.classList = []
            element.element.classList.add("fileBlock")
            element.element.classList.add("success")
            element.children.loadingBlock.style.display = "none"
            // this.value.push(data)
        }
        element.danger = () => {
            element.element.classList = []
            element.element.classList.add("fileBlock")
            element.element.classList.add("danger")
            element.children.loadingBlock.style.display = "none"
        }
        return element
    }
    //切割字符串
    splitFile(str) {
        let arr = []
        const chunkSize = 102400; // 100KB
        for (let i = 0; i < str.length; i += chunkSize) {
            arr.push({ data: str.slice(i, i + chunkSize), index: i / chunkSize });
        }
        return arr
    }
    initWebSocket() {
        console.log("hello");
        var socket = io();

        socket.on('connect', function () {
            console.log('Successfully connected to server');
        });

        socket.on('disconnect', function () {
            console.log('Disconnected from server');
        });
    }
}
customElements.define("a-upload", AUpload)