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
new class main {
    constructor() {
        this.listData
        this.parentId = null
        this.listMap = new Map()
        this.updateList = null
        this.movingListId = [] //正在进行移动的列表id
        this.init()
    }

    init() {
        // 初始化数据
        this.initData()
        this.initPageElement()
    }

    initPageElement() {
        document.getElementById('searchButton').onclick = () => {
            this.init()
        }
        document.getElementById('page').onchange = (e) => {
            this.initData(e.page, e.limit)
        }

        document.getElementById('addNewList').onclick = () => {
            document.getElementById('uploadImgPathCreate').value = null
            document.getElementById('createNewList').title = "创建列表"
            this.parentId = null
            document.getElementById('createNewList').vis = true
        }
        document.getElementById("tipCreate").onclick = document.getElementById('addNewList').onclick
        document.getElementById('selectButtonCreate').addEventListener('click', function () {
            document.getElementById('imageInputCreate').click()
        })

        document.getElementById('imageInputCreate').onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('coverImgCreate').src = e.target.result;
                }
                reader.readAsDataURL(file);
                const input = document.getElementById('imageInputCreate');
                const formData = new FormData();
                formData.append('image', input.files[0]);

                fetch(BaseUrl + '/upload', {
                    method: 'POST', body: formData, headers: {
                        'authorization': localStorage.getItem("userToken"),
                    }
                }).then(response => response.json())
                    .then(data => {
                        if (data.code == 200) {
                            document.getElementById('uploadImgPathCreate').value = data.filename
                            document.tip.success("已上传", 2500)
                        } else if (data.code == 203) {
                            //token无效或过期
                            window.parent.userTokenOverDue()
                        }
                    })
                    .catch(error => {
                        document.tip.danger("上传失败：" + error, 2500)
                    });
            }
        }
        //取消移动
        document.getElementById("cancelRemoveButton").onclick = () => {
            document.dispatchEvent(new Event("cancelmove"))
            document.getElementById("moveBlock").style.display = "none"
            this.movingListId = []
        }
        //将选中元素调整为最高级
        document.getElementById("moveToParent").onclick = () => {
            try {
                document.tip.tip("正在移动", 2500)
                fetch(BaseUrl + `/moveList`, {
                    method: 'POST', body: JSON.stringify({
                        id: null, moveId: this.movingListId
                    }), headers: {
                        'authorization': localStorage.getItem("userToken"), 'Content-Type': 'application/json'
                    },
                }).then(response => response.json()).then(res => {
                    //console.log(res)
                    if (res.code == 200) {
                        document.tip.success("已移动", 2500)
                        this.initData()
                    } else if (res.code == 203) {
                        //token无效或过期
                        window.parent.userTokenOverDue()
                    } else {
                        //token无效或过期
                        document.tip.error("移动失败，请稍后重试", 2500)
                    }
                }).catch(error => {
                    document.tip.danger(error, 2500)
                })
            } catch (error) {
                //console.log(error)
            }
        }
        document.getElementById('createButton').onclick = () => {
            document.getElementById('createNewListForm').submit((data) => {
                data["parentId"] = this.parentId
                data['cover'] = document.getElementById('uploadImgPathCreate').value
                fetch(BaseUrl + '/createNewList', {
                    method: 'POST', body: JSON.stringify(data), headers: {
                        'authorization': localStorage.getItem("userToken"), 'Content-Type': 'application/json'
                    },
                }).then(response => response.json())
                    .then(data => {
                        if (data.code == 200) {
                            document.tip.success("已添加", 2500)
                            document.getElementById('createNewList').vis = false
                            document.getElementById('createNewListForm').clear()
                            document.getElementById('coverImgCreate').src = ""
                            this.initData()
                        } else if (data.code == 203) {
                            //token无效或过期
                            window.parent.userTokenOverDue()
                        }
                    })
                    .catch(error => {
                        document.tip.danger("上传失败：" + error, 2500)
                    });
            })
        }


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
                    method: 'POST', body: formData, headers: {
                        'authorization': localStorage.getItem("userToken")
                    },
                }).then(response => response.json())
                    .then(data => {
                        if (data.code == 200) {
                            document.getElementById('uploadImgPathEdit').value = data.filename
                            document.tip.success("已上传", 2500)
                        } else if (data.code == 203) {
                            //token无效或过期
                            window.parent.userTokenOverDue()
                        }

                    })
                    .catch(error => {
                        document.tip.danger("上传失败：" + error, 2500)
                    });
            }
        }

        document.getElementById("editList").onclose = () => {
            document.getElementById('imageInputEdit').value = null
        }

        document.getElementById('editButton').onclick = () => {
            document.getElementById('editListForm').submit((data) => {
                data['cover'] = document.getElementById('uploadImgPathEdit').value
                data["nodeId"] = this.updateList["nodeId"]
                data["listId"] = this.updateList["listId"]
                fetch(BaseUrl + '/updateList', {
                    method: 'POST', body: JSON.stringify(data), headers: {
                        'authorization': localStorage.getItem("userToken"), 'Content-Type': 'application/json'
                    },
                }).then(response => response.json())
                    .then(data => {
                        if (data.code == 200) {
                            document.tip.success("已保存", 2500)
                            document.getElementById('editList').vis = false
                            document.getElementById('coverImgEdit').src = ""
                            this.initData()
                            document.getElementById('editListForm').clear()
                        } else if (data.code == 203) {
                            //token无效或过期
                            window.parent.userTokenOverDue()
                        }
                    })
                    .catch(error => {
                        document.tip.danger("上传失败：" + error, 2500)
                    });
            })
        }
    }

    //绘制元素
    initElement() {
        document.getElementById('table').innerHTML = ""

        this.listData.forEach((item, index) => {
            document.getElementById('table').appendChild(this.getElement(item, index))
            document.titleShower.refresh(document.getElementById('table'))
        })
        if (this.movingListId.length > 0) {
            document.dispatchEvent(new Event("move"))
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

    //获取列表元素
    getElement(data, index) {
        let element
        try {
            element = dp(`<div class="lineBlock">
                <div class="line" >
                    <div class="listArrow" ref="openChild">
                        <i class="${(data.listId.length > 0) ? "icon-arrow-drop-up-fill" : "icon-subtract-fill"}" ref="arrow"></i>
                    </div>
                    <div class="listNo">${index + 1}</div>
                    <div class="button" ref="removeToChildButton" style="width: 0px;overflow: hidden;padding-left: 0;padding-right: 0; text-align: center; border-right: 0px solid #efefef;">
                        移动为子列表
                    </div>
                    <div class="button" ref="choseButton" style="width: 0px;overflow: hidden;padding-left: 0;padding-right: 0; text-align: center; border-right: 0px solid #efefef;">
                        选择
                    </div>
                   
                    <div class="listIndex">${data.index == null ? "" : data.index} </div>
                    <div class="listName">${data.name}</div>
                   
                    <div class="listNo" style="padding-left:7px;padding-right:7px;">${this.listType(data.type)}</div>
                    <div class="listChild">${data.list.length}</div>
                    <div class="nodeChild">${data.nodeId.length}</div>
                    <div class="listId">${data.id}</div>
                    
                    <div class="button" ref="addChildList" style="min-width: 65px;">
                        添加子列表
                    </div>
                    <div class="button" ref="node" style="min-width: 25px;">
                        内容
                    </div>
                    <div class="button" ref="edit" style="min-width: 25px;">
                        编辑
                    </div>
                    <div class="button del" ref="del" style="min-width: 25px;">
                        删除
                    </div>
                </div>
                <div class="childBlock" ref="children">
                </div>
            </div>`)
        } catch (error) {
            //console.log(error)
        }

        if (localStorage.getItem("child_" + data.id) == "true" && data.listId.length > 0) {
            element.children.arrow.classList = []
            element.children.arrow.classList.add("icon-arrow-drop-down-fill")
            element.children.children.style.height = "auto"
        }


        element.children.openChild.onclick = () => {
            if (data.listId.length == 0) return
            if (localStorage.getItem("child_" + data.id) == "true") {
                element.children.arrow.classList = []
                element.children.arrow.classList.add("icon-arrow-drop-up-fill")
                element.children.children.style.height = 0
                localStorage.setItem("child_" + data.id, "false")
            } else {
                element.children.arrow.classList = []
                element.children.arrow.classList.add("icon-arrow-drop-down-fill")
                element.children.children.style.height = "auto"
                localStorage.setItem("child_" + data.id, "true")
            }
        }

        document.addEventListener("move", () => {
            element.children.choseButton.style.width = "50px"
            element.children.choseButton.style.paddingLeft = "5px"
            element.children.choseButton.style.paddingRight = "5px"
            element.children.choseButton.style.borderRight = "1px solid #efefef"
            if (this.movingListId.includes(data.id)) {
                element.children.choseButton.innerText = "取消"
            } else {
                element.children.choseButton.innerText = "选择"
            }
            if (this.movingListId.includes(data.id)) {
                element.children.removeToChildButton.style.width = "0px"
                element.children.removeToChildButton.style.paddingLeft = "0px"
                element.children.removeToChildButton.style.paddingRight = "0px"
                element.children.removeToChildButton.style.borderRight = "0px solid #efefef"
                element.element.style.opacity = 0.5
            } else {
                element.children.removeToChildButton.style.width = "85px"
                element.children.removeToChildButton.style.paddingLeft = "5px"
                element.children.removeToChildButton.style.paddingRight = "5px"
                element.children.removeToChildButton.style.borderRight = "1px solid #efefef"
                element.element.style.opacity = 1
            }
        })
        document.addEventListener("cancelmove", () => {
            element.children.removeToChildButton.style.width = "0px"
            element.children.removeToChildButton.style.paddingLeft = "0px"
            element.children.removeToChildButton.style.paddingRight = "0px"
            element.children.removeToChildButton.style.borderRight = "0px solid #efefef"
            element.children.choseButton.style.width = "0px"
            element.children.choseButton.style.paddingLeft = "0px"
            element.children.choseButton.style.paddingRight = "0px"
            element.children.choseButton.style.borderRight = "0px solid #efefef"
            if (this.movingListId.includes(data.id)) {
                element.element.style.opacity = 1
                element.element.style.pointerEvents = 'all'
            }
        })
        element.children.choseButton.onclick = () => {
            if (this.movingListId.includes(data.id)) {
                this.movingListId.splice(this.movingListId.indexOf(data.id), 1)
                document.dispatchEvent(new Event("move"))
                if (this.movingListId.length == 0) {
                    document.dispatchEvent(new Event("cancelmove"))
                    document.getElementById("moveBlock").style.display = "none"
                }
            } else {
                this.movingListId.push(data.id)
                if (localStorage.getItem("child_" + data.id) == "true") element.children.openChild.click()
                document.dispatchEvent(new Event("move"))
                document.getElementById("moveBlock").style.display = "block"
            }
        }
        element.children.removeToChildButton.onclick = () => {
            try {
                document.tip.tip("正在移动", 2500)
                fetch(BaseUrl + `/moveList`, {
                    method: 'POST', body: JSON.stringify({
                        id: data.id, moveId: this.movingListId
                    }), headers: {
                        'authorization': localStorage.getItem("userToken"), 'Content-Type': 'application/json'
                    },
                }).then(response => response.json()).then(res => {
                    //console.log(res)
                    if (res.code == 200) {
                        document.tip.success("已移动", 2500)
                        this.initData()
                    } else if (res.code == 203) {
                        //token无效或过期
                        window.parent.userTokenOverDue()
                    } else {
                        //token无效或过期
                        document.tip.error("移动失败，请稍后重试", 2500)
                    }
                }).catch(error => {
                    document.tip.danger(error, 2500)
                })
            } catch (error) {
                //console.log(error)
            }
        }

        element.children.node.onclick = () => {
            window.location.href = "./node.html?id=" + data.id
        }

        element.children.edit.onclick = () => {
            this.updateList = data
            document.getElementById('editList').title = data.name
            document.getElementById('editList').vis = true
            if (data.submit != true) data.submit = false
            document.getElementById('editListForm').value = data
            if (data.cover) {
                document.getElementById('coverImgEdit').src = FileUrl + data.cover
                document.getElementById('uploadImgPathEdit').value = data.cover
            } else {
                document.getElementById('coverImgEdit').src = ""
                document.getElementById('uploadImgPathEdit').value = null
            }
        }

        element.children.addChildList.onclick = () => {
            document.getElementById('uploadImgPathCreate').value = null
            document.getElementById('createNewList').title = data.name + ": 创建子列表"
            this.parentId = data.id
            document.getElementById('createNewList').vis = true
        }

        data.list.forEach((child, index2) => {
            element.children.children.appendChild(this.getElement(child, index2))
        })

        element.children.del.onclick = () => {
            document.confirm.show("确认删除此列表？", () => {
                try {
                    this.delList(data.id)
                } catch (error) {
                    //console.log(error)
                }
            }, () => {

            })
        }

        element.element.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });

        element.element.onmouseup = (e) => {
            if (e.button == 2) {
                e.cancelBubble = true
                let dirMenus = []
                dirMenus.push({
                    name: "添加子列表", fun: () => {
                        element.children.addChildList.click()
                    }
                })
                dirMenus.push({
                    name: "内容", fun: () => {
                        element.children.node.click()
                    }
                })
                dirMenus.push({
                    name: "编辑", fun: () => {
                        element.children.edit.click()
                    }
                })

                if (this.movingListId.includes(data.id)) {
                    dirMenus.push({
                        name: "取消移动", fun: () => {
                            this.movingListId.splice(this.movingListId.indexOf(data.id), 1)
                            document.dispatchEvent(new Event("move"))
                            if (this.movingListId.length == 0) {
                                document.dispatchEvent(new Event("cancelmove"))
                                document.getElementById("moveBlock").style.display = "none"
                            }
                        }
                    })
                } else {
                    dirMenus.push({
                        name: "移动", fun: () => {
                            this.movingListId.push(data.id)
                            if (localStorage.getItem("child_" + data.id) == "true") element.children.openChild.click()
                            document.dispatchEvent(new Event("move"))
                            document.getElementById("moveBlock").style.display = "block"

                        }
                    })
                }

                dirMenus.push({
                    name: "删除", fun: () => {
                        element.children.del.click()
                    }
                })
                if (data.listId.length > 0) {
                    dirMenus.unshift({
                        name: localStorage.getItem("child_" + data.id) == "true" ? "折叠子列表" : "展开子列表",
                        fun: () => {
                            element.children.openChild.click()
                        }
                    })
                }
                document.mouseMenu.menu(dirMenus)
            }
        }
        element.element.addEventListener("dblclick", (e) => {
            e.cancelBubble = true
            element.children.openChild.click()
        })
        return element.element
    }

    delList(listId) {
        try {
            fetch(BaseUrl + `/removeList`, {
                method: 'POST', body: JSON.stringify({
                    id: listId
                }), headers: {
                    'authorization': localStorage.getItem("userToken"), 'Content-Type': 'application/json'
                },
            }).then(response => response.json()).then(res => {
                console.log(res);

                if (res.code == 200) {
                    this.initData()
                    document.tip.success("已删除", 2500)
                } else if (res.code == 203) {
                    //token无效或过期
                    window.parent.userTokenOverDue()
                }

            }).catch(error => {
                document.tip.danger(error, 2500)
            })
        } catch (error) {
            //console.log(error)
        }
    }

    //获取数据
    initData(page, limit) {
        //console.log(page, limit)
        page = page === undefined ? (document.getElementById("page").page === undefined ? 1 : document.getElementById("page").page) : page
        limit = limit === undefined ? (document.getElementById("page").limit === undefined ? 10 : document.getElementById("page").limit) : limit
        //console.log(page, limit)
        fetch(BaseUrl + `/getListData`, {
            method: 'POST', body: JSON.stringify({
                page: page, limit: limit, name: document.getElementById('listName').value
            }), headers: {
                'authorization': localStorage.getItem("userToken"), 'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(res => {
            let result = []
            if (res.code == 200) {
                document.getElementById('page').total = res.total
                res.data.forEach(item => {
                    result.push(JSON.parse(item))
                })
                if (result.length === 0) {
                    document.getElementById("emptyList").style.display = "block"
                } else {
                    document.getElementById("emptyList").style.display = "none"
                }
                this.formatDataTree(result)
            } else if (res.code == 203) {
                //token无效或过期
                window.parent.userTokenOverDue()
            }
        }).catch(error => {
            //console.log(error)
            document.tip.danger(error, 2500)
        });
    }

    // 将数据格式化为树形结构
    formatDataTree(res) {

        let result = []

        res.forEach(item => {
            this.listMap.set(item.id, item)
            if (item.parentId == null || item.parentId == '') {
                result.push(item)
            }
        })
        res.forEach(item => {
            item.list = []
            if (item.listId == null) item.listId = []
            if (item.nodeId == null) item.nodeId = []
            item.listId.forEach(id => {
                item.list.push(this.listMap.get(id))
            })
        })
        this.listData = result
        this.initElement()
    }
}
