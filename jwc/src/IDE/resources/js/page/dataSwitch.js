let ifLoadData = false
let idIndex = 10
let data
let listMap = new Map()
let nodeMap = new Map()
let contentMap = new Map()
let contentIdMap = new Map()
let list = []
let allList = []
let listIdMap = new Map()
const downloadLink = document.getElementById("downloadLink")
const previewDialog = document.getElementById("previewDialog")
const contentBlock = document.getElementById("contentBlock")
const connectToMysqlButton = document.getElementById("connectToMysqlButton")
const connectForm = document.getElementById("connectForm")
const reloadDataButton = document.getElementById("reloadDataButton")
const insertDataButton = document.getElementById("insertDataButton")
const dataToSQL = document.getElementById("dataToSQL")
insertDataButton.onclick = () => {
    document.confirm.show("生成数据将会覆盖掉原有数据，确认操作？", () => {
        insertDataButton.loading = true
        loading(true)
        insertDataButton.innerText = "正在导入，请稍后..."
        fetch(BaseUrl + '/insertData', {
            method: 'POST',
            headers: {
                'authorization': localStorage.getItem("userToken"),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ connectId: localStorage.getItem("MysqlConnectId") })
        }).then(response => response.json()).then(res => {
            insertDataButton.loading = false
            insertDataButton.innerText = "导入数据"
            if (res.code == 200) {
                loading(false)
                document.tip.success("数据导入成功！请在栏目管理中查看。", 4000)
            } else {
                console.log(res);

                document.tip.danger("数据导入失败", 3000)
            }
        }).catch(error => {
            document.tip.danger("数据生成失败：" + error, 2500)
        });
    })
}
// 将数据导出为sql
dataToSQL.onclick = () => {

    dataToSQL.loading = true
    dataToSQL.innerText = "正在生成，请稍后..."
    fetch(BaseUrl + '/dataToSQL', {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem("userToken")
        },
    }).then(response => response.json()).then(res => {
        dataToSQL.loading = false
        dataToSQL.innerText = "将数据导出为SQL"
        if (res.code == 200) {
            downloadLink.href = window.location.origin + "/SQL.sql"
            downloadLink.click()
            document.tip.success("数据导出成功！。", 2500)
        } else {
            document.tip.danger("数据导出失败", 3000)
        }
    }).catch(error => {
       
        document.tip.danger("数据导出失败：" + error, 3000)
    });
}
connectToMysqlButton.onclick = () => {
    connectForm.submit(e => {
        if (localStorage.getItem("MysqlConnectId") != null) e.connectId = localStorage.getItem("MysqlConnectId")
        connectToMysqlButton.loading = true
        fetch(BaseUrl + '/connectMysql', {
            method: 'POST',
            headers: {
                'authorization': localStorage.getItem("userToken"),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(e)
        }).then(response => response.json()).then(res => {
            //console.log(res)
            if (res.code == 200) {
                localStorage.setItem("MysqlConnectId", res.connectId)
                document.tip.success("已连接数据库并获取数据", 4000)
                document.getElementById("connectFormBlock").fold = true
                document.getElementById("connectFormBlock").label = "已连接数据库，请进行下一步操作"
                connectForm.disabled = true
                ifLoadData = true
                data = res.data
                drawDataTree()
                reloadDataButton.disabled = false
                insertDataButton.disabled = false
                connectToMysqlButton.disabled = true
                document.getElementById("dataBlock").fold = false
            } else if (res.code == 401) {
                localStorage.setItem("MysqlConnectId", res.connectId)
                document.tip.warn("已连接数据库,但获取数据失败,请点击重新获取数据", 7000)
                document.getElementById("connectFormBlock").fold = true
                reloadDataButton.disabled = false
                document.getElementById("connectFormBlock").label = "已连接数据库，请进行下一步操作"
                connectForm.disabled = true
                connectToMysqlButton.disabled = true
            } else if (res.code == 400) {
                document.tip.warn("连接数据库失败，请重试", 4000)
            }
            connectToMysqlButton.loading = false
        }).catch(error => {
            connectToMysqlButton.loading = false
            document.tip.danger("连接失败：" + error, 2500)
        });
    })
}

reloadDataButton.onclick = () => {
    reloadDataButton.loading = true
    reloadDataButton.innerText = "正在获取数据..."
    fetch(BaseUrl + '/reloadMysqlData', {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ connectId: localStorage.getItem("MysqlConnectId") })
    }).then(response => response.json()).then(res => {
        reloadDataButton.loading = false
        if (res.code == 200) {
            data = res.data
            reloadDataButton.innerText = "重新获取数据"
            document.tip.success("重新获取数据成功")
            drawDataTree()

        } else if (res.code == 400) {
            document.tip.warn("获取数据失败，请重试", 4000)
        }
    }).catch(error => {
        document.tip.danger("连接失败：" + error, 2500)
    });
}

function drawDataTree() {
    contentBlock.innerHTML = ""
    idIndex = 10
    listMap = new Map()
    nodeMap = new Map()
    contentMap = new Map()
    contentIdMap = new Map()
    list = []
    allList = []
    listIdMap = new Map()
    data.list.forEach(item => {
        if (item.delFlag == 1) return
        let newId = getId("l")
        listIdMap.set(item.id, newId)
        listMap.set(item.id, item)
        item.id = newId
        listMap.set(item.id, item)
        allList.push(item)
        item.nodeId = []
        item.listId = []
        if (item.parentId == "" || item.parentId == null) {
            list.push(item)
        }
    })

    data.list.forEach(item => {
        if (item.parentId != null && item.parentId != "") {
            if (listMap.has(item.parentId)) {
                listMap.get(item.parentId).listId.push(item.id)
                item.parentId = listIdMap.get(item.parentId)
            }
        }
    })

    data.content.forEach(item => {
        contentIdMap.set(item.id, item)
    })

    data.node.forEach(item => {
        let content = contentIdMap.get(item.id)

        item.id = getId("n")
        if (content) {
            content.id = item.id
            contentMap.set(item.id, content)
        }
        nodeMap.set(item.id, item)
        if (item.top === "true" || item.top === true) {
            item.top = {
                "top": true,
                "untop": false
            }
        } else {
            item.top = {
                "top": false,
                "untop": true
            }
        }
        if (item.publish === "true" || item.publish === true) {
            item.publish = {
                "publish": true,
                "unpublish": false
            }
        } else {
            item.publish = {
                "publish": true,
                "unpublish": false
            }
        }
        item.date = formatTime(item.date, "YYYY-MM-DD hh:mm:ss")
        if (listMap.has(item.parentId)) {
            listMap.get(item.parentId).nodeId.push({
                "id": item.id,
                "date": item.date,
                "top": item.top,
                "clicks": item.clicks,
                "publish": item.publish
            })
        }
    })
    // 元素绘制阶段
    list.forEach(item => {
        let element = getListElement(item)
        item.element = element.element
        item.refs = element.children
        contentBlock.appendChild(item.element)

        loadChild(item)
        loadNodeElement(item)
    })
}

function getId(i) {
    idIndex += Math.floor(Math.random() * 100)
    return i + "_" + (Date.now() + idIndex).toString(36)
}

function loadChild(data) {
    data.listId.forEach(item => {
        let child = listMap.get(item)
        let element = getListElement(child)
        child.element = element.element
        child.refs = element.children
        data.refs.childBlock.appendChild(child.element)
        loadChild(child)
        loadNodeElement(child)
    })
}

function getListElement(item) {
    let element = dp(`<div class="listBlock">
                                <div class="listLine">
                                    <i class="icon-arrow-drop-up-fill" ref="icon"></i>
                                    <span class="icon-apps-2-line"></span>
                                    <div class="listLabel">${item.name}</div>
                                    <div class="info">子列表：${item.listId.length}</div>
                                    <div class="info">内容：${item.nodeId.length}</div>
                                    <div style="flex: 1"></div>
                                    <div class="menuButton" ref="detail">详情</div>
                                </div>
                                <div class="childBlock" ref="childBlock">
                                </div>
                            </div>`)
    element.children.icon.onclick = () => {
        if (element.children.childBlock.clientHeight === 0) {
            element.children.childBlock.style.height = "auto"
            element.children.icon.classList.remove("icon-arrow-drop-up-fill")
            element.children.icon.classList.add("icon-arrow-drop-down-fill")
        } else {
            element.children.childBlock.style.height = "0"
            element.children.icon.classList.remove("icon-arrow-drop-down-fill")
            element.children.icon.classList.add("icon-arrow-drop-up-fill")
        }
    }
    element.children.detail.onclick = () => {
        document.getElementById("detailDialog").vis = true
        listDetail(item)
    }
    return element
}

function loadNodeElement(item) {
    item.nodeId.forEach(tem => {
        let node = nodeMap.get(tem.id)
        let element = getNodeElement(node)
        node.element = element.element
        node.refs = element.children
        item.refs.childBlock.append(node.element)
    })
}

function getNodeElement(item) {
    let element = dp(`<div class="listLine">
                        <span class="icon-article-line"></span>
                        <div class="info">${item.title}</div>
                        <div style="flex: 1"></div>
                        <div class="menuButton" ref="preview">预览</div>
                        <div class="menuButton" ref="detail">详情</div>
                    </div>`)
    element.children.preview.onclick = () => {
        previewDialog.vis = true
        previewDialog.clear()
        let content = dc("div")
        content.innerHTML = contentMap.get(item.id).content
        previewDialog.title = nodeMap.get(item.id).title
        previewDialog.appendChild(content)
    }
    return element
}

function listDetail(item) {
    let element = dp(`<div>
        <div style="display: flex">
            <div class="infoBlock">
                <div class="lineLabel">id</div>
                <div class="info">${item.id}</div>
            </div>
            <div class="infoBlock">
                <div class="lineLabel">所属列表</div>
                <div class="info">${listMap.has(item.parentId) ? listMap.get(item.id).name : "无"}</div>
            </div>
        </div>
        <div style="display: flex">
            <div class="infoBlock">
                <div class="lineLabel">列表名称</div>
                <div class="info">${item.name}</div>
            </div>
            <div class="infoBlock">
                <div class="lineLabel">英文名称</div>
                <div class="info">${item.enName}</div>
            </div>
        </div>
        <div style="display: flex">
            <div class="infoBlock">
                <div class="lineLabel">列表页</div>
                <div class="info">${item.template}</div>
            </div>
            <div class="infoBlock">
                <div class="lineLabel">详情页</div>
                <div class="info">${item.nodeTemplate}</div>
            </div>
        </div>
        <div style="display: flex">
            <div class="infoBlock">
                <div class="lineLabel">类型</div>
                <div class="info">${getType(item.type)}</div>
            </div>
            <div class="infoBlock">
                <div class="lineLabel">排序</div>
                <div class="info">${item.index}</div>
            </div>
        </div>
        <div class="infoBlock">
            <div class="lineLabel">封面路径</div>
            <div class="info">${item.cover}</div>
        </div>
        <div class="infoBlock">
            <div class="lineLabel">备注、简介</div>
            <div class="info">${item.note}</div>
        </div>
    </div>`)
    document.getElementById("detailDialog").clear()
    document.getElementById("detailDialog").appendChild(element.element)
}

function getType(type) {
    const Type = { 1: "文章", 2: "图片", 3: "文件", 4: "链接" }
    return Type[type]
}

function formatTime(timeStr, format) {
    const date = new Date(timeStr)
    let year = date.getFullYear() > 9 ? date.getFullYear() : "0" + date.getFullYear()
    let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
    let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
    let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
    let minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
    let second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()
    format = format.replaceAll("YYYY", year)
    format = format.replaceAll("YY", (year + "").substring(2, 4))
    format = format.replaceAll("yyyy", year)
    format = format.replaceAll("yy", (year + "").substring(2, 4))
    format = format.replaceAll("MM", month)
    format = format.replaceAll("DD", day)
    format = format.replaceAll("dd", day)
    format = format.replaceAll("HH", hour)
    format = format.replaceAll("hh", hour)
    format = format.replaceAll("mm", minute)
    format = format.replaceAll("SS", second)
    format = format.replaceAll("ss", second)
    return format;
}