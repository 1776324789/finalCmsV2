function compressedImg(file, scale) {
    scale = 1
    return new Promise((resolve, reject) => {
        // 检查 file 对象类型
        if (!(file instanceof File || file instanceof Blob)) {
            reject(new Error('The provided object is not a File or Blob.'));
            return;
        }

        // 使用 compressorjs 压缩图片
        new Compressor(file, {
            quality: scale,
            success(compressedFile) {
                //console.log('Compressed file:', compressedFile);
                resolve(compressedFile);
            },
            error(err) {
                console.error('Compression error:', err);
                reject(err);
            },
        });
    });
}
const E = window.wangEditor
// Change language
const LANG = location.href.indexOf('lang=en') > 0 ? 'en' : 'zh-CN'
E.i18nChangeLanguage(LANG)

const editorConfig = { MENU_CONF: {} }
editorConfig.placeholder = '请输入内容...'
editorConfig.MENU_CONF['insertVideo'] = {
    onInsertedVideo(videoNode) {
        //console.log('inserted video', videoNode)
    },
}

editorConfig.MENU_CONF['uploadImage'] = {
    server: BaseUrl + '/editor/uploadFile',

    timeout: 5 * 1000, // 5s

    fieldName: 'files',
    meta: { token: 'xxx', a: 100 },
    metaWithUrl: true, // join params to url
    headers: {
        authorization: localStorage.getItem("userToken"),
        Accept: 'text/x-json'
    },

    maxFileSize: 10 * 1024 * 1024, // 10M

    base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
    customInsert(res, insertFn) {                  // JS 语法
        // res 即服务端的返回结果

        // 从 res 中找到 url alt href ，然后插入图片
        insertFn( res.data[0].url, res.data[0].alt,  res.data[0].href)
    },
    onBeforeUpload(file) {
        //console.log('onBeforeUpload', file)

        return file // will upload this file
        // return false // prevent upload
    },
    onProgress(progress) {
        //console.log('onProgress', progress)
    },
    onSuccess(file, res) {
        setTimeout(() => {
            //console.log(editor.getElemsByType('image'))
        }, 1500);
    },
    onFailed(file, res) {
        alert(res.message)
        //console.log('onFailed', file, res)
    },
    onError(file, err, res) {
        alert(err.message)
        console.error('onError', file, err, res)
    },
}
editorConfig.MENU_CONF['uploadVideo'] = {
    server: BaseUrl + '/editor/uploadFile',
    // server: '/api/upload-img-failed', // test failed
    // server: '/api/xxx', // test 404

    timeout: 5 * 1000, // 5s

    fieldName: 'files',
    meta: { token: 'xxx', a: 100 },
    metaWithUrl: true, // join params to url
    headers: {
        authorization: localStorage.getItem("userToken"),
        Accept: 'text/x-json'
    },

    maxFileSize: 10 * 1024 * 1024, // 10M
    customInsert(res, insertFn) {
        //console.log(res)
        // JS 语法
        // res 即服务端的返回结果

        // 从 res 中找到 url poster ，然后插入视频
        insertFn( res.data.url, null)
    },
    onBeforeUpload(file) {
        //console.log('onBeforeUpload', file)
        return file // will upload this file
        // return false // prevent upload
    },
    onProgress(progress) {
        //console.log('onProgress', progress)
    },
    onSuccess(file, res) {
        //console.log('onSuccess', file, res)
    },
    onFailed(file, res) {
        alert(res.message)
        //console.log('onFailed', file, res)
    },
    onError(file, err, res) {
        alert(err.message)
        console.error('onError', file, err, res)
    },
}

const editor = E.createEditor({
    selector: '#editor-text-area',
    config: editorConfig
})

const toolbar = E.createToolbar({
    editor,
    selector: '#editor-toolbar'
})
setTimeout(() => {
    document.getElementsByClassName("w-e-menu-tooltip-v5")[22].style.display = "none"
}, 500)

// 主函数，加载和绘制数据
new class main {
    constructor() {
        this.baseUrl = BaseUrl + ''
        // 获取地址栏中的参数
        this.urlParams = new URLSearchParams(window.location.search);
        // 获取特定参数的值
        this.listId = this.urlParams.get('id');
        this.nodeList = []
        this.listData
        this.create = false
        this.type
        this.init()
    }

    init() {
        this.initBodyElementFunction()
        this.loadList()
        this.loadListData()
    }

    loadListData() {
        fetch(this.baseUrl + `/getListById`, {
            method: 'POST',
            body: JSON.stringify({
                id: this.listId
            }),
            headers: {
                'authorization': localStorage.getItem("userToken"),
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(res => {
            if (res.code == 200) {
                this.listData = res.data
                this.loadSubmits()
            }

        }).catch(error => {
            document.tip.danger(error, 2500)
        });
    }

    loadSubmits() {
        if (this.listData.submit) {
            document.getElementById("mainSubmitBlock").style.display = "block"
            fetch(this.baseUrl + `/getListSubmits`, {
                method: 'POST',
                body: JSON.stringify({
                    id: this.listId
                }),
                headers: {
                    'authorization': localStorage.getItem("userToken"),
                    'Content-Type': 'application/json'
                },
            }).then(response => response.json()).then(res => {

                if (res.code == 200) {
                    this.listData.submitData = res.data
                    this.drawSubmits()
                }

            }).catch(error => {
                document.tip.danger(error, 2500)
            });

        }
    }

    drawSubmits() {
        document.getElementById('submitContent').innerHTML = ""
        if (this.listData.submitData.length == 0) {
            let empty = dp(`<div id="empty" style="width: 100%;line-height: 40px;text-align: center;font-size: 14px;color: #999999;">
            没有投稿内容</div>`)
            document.getElementById('submitContent').appendChild(empty.element)
        } else {
            this.listData.submitData.reverse()
            this.listData.submitData.forEach((item, index) => {
                let element = dp(`<div class="lineBlock">
                    <div class="line" >
                        <div class="listNo">${index + 1}</div>
                        <div class="listName">${item.title}</div>
                        <div class="listNo" style="padding-left:7px;padding-right:7px;">投稿</div>
                        <div class="listClick">${item.clicks}</div>
                        <div class="listDate2">${item.date}</div>
                        <div class="listId">${item.id} <i ftitle="复制序列号" class="icon-file-copy-line copyIcon"></i></div>
                        <div class="button" ref="detail">
                            ${this.type == "1" ? "预览" : this.type == "3" ? "下载" : "详情"}
                        </div>
                        <div style="display:none;"ref="edit"></div>
                        <div  style="display:none;" class="button del" ref="del">
                            删除
                        </div>
                    </div>
                    <div class="childBlock" ref="children">
                    </div>
                </div>`)
                document.getElementById("submitContent").appendChild(element.element)
                this.initElementFunction(element, item)
            })
        }

    }

    initFormDialog() {
        //console.log(this.type)
        if (this.type == "1") {
            document.getElementById('fileBlock').style.display = "none"
        } else if (this.type == "2") {
            document.getElementById('top').style.display = "none"
            document.getElementById('content').vis = false
            document.getElementById('fileBlock').style.display = "none"
        } else if (this.type == "3") {
            document.getElementById('top').style.display = "none"
            document.getElementById('content').vis = false
        } else if (this.type == "4") {
            document.getElementById('top').style.display = "none"
            document.getElementById('content').vis = false
            document.getElementById('fileBlock').style.display = "none"
        }
    }

    listType(type) {
        if (type == "1") {
            return "文章"
        } else if (type == "2") {
            return "图片"
        } else if (type == "3") {
            return "文件"
        } else if (type == "4") {
            return "链接"
        }
    }

    initBodyElementFunction() {
        document.getElementById('selectButtonEdit').addEventListener('click', function () {
            document.getElementById('imageInputEdit').click()
        })

        document.getElementById('imageInputEdit').onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('coverImgEdit').src = e.target.result;
                }
                reader.readAsDataURL(file);
                const input = document.getElementById('imageInputEdit');
                const formData = new FormData();
                let compressedFile = await compressedImg(input.files[0], 0.5)
                formData.append('image', compressedFile);

                fetch(BaseUrl + '/upload', {
                    method: 'POST',
                    headers: {
                        'authorization': localStorage.getItem("userToken")
                    },
                    body: formData
                }).then(response => response.json()).then(res => {
                    if (res.code == 200) {
                        document.getElementById('uploadImgPathEdit').value = res.filename
                        document.tip.success("已上传", 2500)
                    } else if (res.code == 203) {
                        //token无效或过期
                        window.parent.userTokenOverDue()
                    }
                }).catch(error => {
                    document.tip.danger("上传失败：" + error, 2500)
                });
            }
        }

        document.getElementById('createButton').onclick = () => {
            this.create = true
            editor.setHtml(``)
            document.getElementById('nodeForm').clear()
            document.getElementById('nodeEditDialog').vis = true
            document.getElementById('nodeEditDialog').title = "新建内容"
            document.getElementById('coverImgEdit').src = ""
            document.getElementById('uploadImgPathEdit').value = ""
            document.getElementById('uploadFilePath').value = ""
            document.getElementById('fileName').innerHTML = ""
        }
        document.getElementById('selectFileButton').onclick = () => {
            //console.log(document.getElementById('file'))
            document.getElementById('file').click()
        }

        document.getElementById('file').onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                const input = document.getElementById('file');
                const formData = new FormData();
                document.getElementById('fileName').innerText = input.files[0].name
                formData.append('*', input.files[0]);
                fetch(BaseUrl + '/uploadFile', {
                    method: 'POST',
                    headers: {
                        'authorization': localStorage.getItem("userToken")
                    },
                    body: formData
                }).then(response => response.json()).then(res => {
                    console.log(res);
                    
                    if (res.code == 200) {
                        document.getElementById('uploadFilePath').value = res.filename
                        document.tip.success("已上传", 2500)
                    } else if (res.code == 203) {
                        //token无效或过期
                        window.parent.userTokenOverDue()
                    }
                }).catch(error => {
                    console.log(error);
                    
                    document.tip.danger("上传失败：" + error, 2500)
                });
            }
        }
        document.getElementById('page').onchange = (e) => {
            this.loadList(e.page, e.limit)
        }
    }

    loadList(page, limit) {
        if (page == null) page = 1
        if (limit == null) limit = 10
        this.nodeList = []
        fetch(this.baseUrl + `/getContentByListId`, {
            method: 'POST',
            body: JSON.stringify({
                id: this.listId,
                page: page,
                limit: limit
            }),
            headers: {
                'authorization': localStorage.getItem("userToken"),
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(res => {
            if (res.code == 200) {
                mainContentBlock.label = "内容列表：" + res.listData.name
                this.type = res.listData.type
                res.data.forEach(item => {
                    this.nodeList.push(JSON.parse(item))
                })
                document.getElementById('page').total = res.total
                this.drawNodeList()
                this.afterList()
                this.initFormDialog()
            } else if (res.code == 203) {
                //token无效或过期
                window.parent.userTokenOverDue()
            }
        }).catch(error => {
            document.tip.danger(error, 2500)
        });
    }

    // 在所有数据加载后调用
    // 主要用于需要this.type进行id分类的组件
    afterList() {
        document.getElementById('subButton').onclick = () => {
            document.getElementById('nodeForm').submit((e) => {
                console.log(document.getElementById('uploadImgPathEdit').value);
                
                e["cover"] = document.getElementById('uploadImgPathEdit').value

                // 文章
                if (this.type == "1")
                    e["content"] = editor.getHtml()
                e["type"] = this.type
                e["parentId"] = this.listId
                //console.log(this.type)
                if (this.type == "3") {
                    if (document.getElementById('fileName').innerText == "") {
                        document.tip.danger("请上传文件", 2500)
                        return
                    }
                    e["fileName"] = document.getElementById('fileName').innerText
                    e['file'] = document.getElementById('uploadFilePath').value
                }
                fetch(this.baseUrl + `/createNode`, {
                    method: 'POST',
                    body: JSON.stringify(e),
                    headers: {
                        'authorization': localStorage.getItem("userToken"),
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json()).then(res => {
                    //console.log(res)
                    if (res.code == 200) {
                        this.loadList()
                        document.tip.success(this.create ? "已创建" : "已保存", 2500)
                        document.getElementById('nodeEditDialog').vis = false
                    } else if (res.code == 203) {
                        //token无效或过期
                        window.parent.userTokenOverDue()
                    }
                }).catch(error => {
                    document.tip.danger(error, 2500)
                });
            })
        }
        // 创建和编辑窗口打开时的回调
        document.getElementById('nodeEditDialog').onopen = () => {
            if (this.create) document.getElementById("subButton").innerText = "创建"
            else document.getElementById("subButton").innerText = "保存"
        }
    }

    // 绘制所有节点
    drawNodeList() {
        document.getElementById('table').innerHTML = ""
        if (this.nodeList.length == 0) {
            let empty = dp(`<div id="empty" style="width: 100%;line-height: 40px;text-align: center;font-size: 14px;color: #999999;">
            没有发布内容</div>`)
            document.getElementById('table').appendChild(empty.element)
        } else
            for (var a = 0; a < this.nodeList.length; a++) {
                try {
                    let element = dp(`<div class="lineBlock">
            <div class="line" >
                <div class="listNo">${a + 1}</div>
                <div class="listName">${this.nodeList[a].title}</div>
                <div class="listNo" style="padding-left:7px;padding-right:7px;">${this.listType(this.nodeList[a].type)}</div>
                <div class="listClick">${this.nodeList[a].clicks}</div>
                <div class="listDate">${this.nodeList[a].date}</div>
                <div class="listId">${this.nodeList[a].id} <i ftitle="复制序列号" class="icon-file-copy-line copyIcon"></i></div>
                <div class="button" ref="detail">
                    ${this.type == "1" ? "预览" : this.type == "3" ? "下载" : "详情"}
                </div>
                <div class="button" ref="edit">
                    编辑
                </div>
                <div class="button del" ref="del">
                    删除
                </div>
            </div>
            <div class="childBlock" ref="children">
            </div>
        </div>`)
                    document.getElementById('table').appendChild(element.element)
                    this.initElementFunction(element, this.nodeList[a])
                } catch (error) {
                    //console.log(error)
                }
            }

    }

    // 为内容行元素绑定方法
    //element： node元素、 item： node数据
    initElementFunction(element, item) {
        // 查看详情
        // 从后台获取详情内容后展示
        // 内容不随node进行加载需要单独进行加载
        element.children.detail.onclick = () => {
            if (this.type == "1") {
                fetch(this.baseUrl + `/getNodeContent`, {
                    method: 'POST',
                    body: JSON.stringify({
                        id: item.id
                    }),
                    headers: {
                        'authorization': localStorage.getItem("userToken"),
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json()).then(res => {
                    if (res.code == 200) {
                        document.getElementById('detailDialog').title = item.title
                        document.getElementById('detailDialog').vis = true
                        let content = dc("div")
                        content.innerHTML = JSON.parse(res.data).content
                        this.detailFileUrl(content)
                        document.getElementById('detailDialog').clear()
                        document.getElementById('detailDialog').appendChild(content)
                    } else if (res.code == 203) {
                        //token无效或过期
                        window.parent.userTokenOverDue()
                    }
                }).catch(error => {
                    document.tip.danger(error, 2500)
                });
            } else if (this.type == "2") {
                document.getElementById('detailDialog').title = item.title
                document.getElementById('detailDialog').vis = true
                document.getElementById('detailDialog').clear()
                let content = dc("img")
                content.src = FileUrl + item.cover
                content.style.width = "100%"
                document.getElementById('detailDialog').appendChild(content)
            } else if (this.type == "3") {
                this.downloadFile(item.file, item.fileName)
            }

        }
        // 节点编辑按钮
        element.children.edit.onclick = () => {
            this.create = false
            document.getElementById('nodeEditDialog').vis = true
            document.getElementById('nodeEditDialog').title = item.title
            document.getElementById('nodeForm').value = item
            document.getElementById('coverImgEdit').src = FileUrl + item.cover
            document.getElementById('uploadImgPathEdit').value = item.cover
            if (this.type == "1") {
                fetch(this.baseUrl + `/getNodeContent`, {
                    method: 'POST',
                    body: JSON.stringify({
                        id: item.id
                    }),
                    headers: {
                        'authorization': localStorage.getItem("userToken"),
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json()).then(res => {
                    if (res.code == 200) {
                        let content = JSON.parse(res.data).content
                        let articlecontent = document.createElement("div")
                        articlecontent.innerHTML = content
                        this.initEditorFileUrl(articlecontent)
                        editor.setHtml(articlecontent.innerHTML)
                        editor.enable()
                    } else if (res.code == 203) {
                        //token无效或过期
                        window.parent.userTokenOverDue()
                    }
                }).catch(error => {
                    document.tip.danger(error, 2500)
                });
            } else if (this.type == "2") {

            } else if (this.type == "3") {
                document.getElementById('uploadFilePath').value = item.file
                document.getElementById('fileName').innerText = item.fileName
            }
        }
        // 节点编辑按钮
        element.children.del.onclick = () => {
            document.confirm.show("确认删除该内容？", () => {
                fetch(this.baseUrl + `/delNode`, {
                    method: 'POST',
                    body: JSON.stringify({
                        id: item.id
                    }),
                    headers: {
                        'authorization': localStorage.getItem("userToken"),
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json()).then(res => {
                    if (res.code == 200) {
                        this.loadList()
                        document.tip.success(this.create ? "已创建" : "已保存", 2500)
                    } else if (res.code == 203) {
                        //token无效或过期
                        window.parent.userTokenOverDue()
                    }
                }).catch(error => {
                    document.tip.danger(error, 2500)
                });
            }, () => {
                document.tip.danger("未知错误，请稍后再试", 2500)
            })
        }
    }

    detailFileUrl(content) {
        Array.from(content.getElementsByTagName("IMG")).forEach(item => {
            if (item.getAttribute("src").substring(0, 4) != "http" && item.getAttribute("src").substring(0, 4) != "data") {
                item.src = FileUrl + item.getAttribute("src")
            }
        })
    }

    initEditorFileUrl(element) {
        Array.from(element.getElementsByTagName("IMG")).forEach(item => {
            if (item.getAttribute("src").substring(0, 4) != "http") {
                if (item.parentNode.tagName == "SPAN" || item.parentNode.tagName == "STRONG") {
                    item.parentNode.parentNode.insertBefore(item, item.parentNode)
                }
                item.src = FileUrl + item.getAttribute("src")
            }
        })
    }


    downloadFile(url, fileName) {
        //console.log(url)
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                // 创建一个隐藏的a元素
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;

                // 将链接添加到文档中，触发点击事件后移除链接
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // 释放Blob URL
                URL.revokeObjectURL(link.href);
            }).catch(error => {
                document.tip.danger(error, 2500)
            });
    }
}