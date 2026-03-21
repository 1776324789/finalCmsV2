let premissionData //权限数据
loadPremission()

document.getElementById('dialog').onclose = (e) => {
    document.getElementById('form').clear()
}
document.getElementById('submit').onclick = () => {
    document.getElementById('form').submit((e) => {
        updatePremission(e)
    })
}

function updatePremission(value) {
    //console.log(value)
    fetch(BaseUrl + '/updatePremission', {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }, body: JSON.stringify(value)
    }).then(response => response.json()).then(res => {
        //console.log(res)
        if (res.code == 200) {
            document.tip.success("已保存", 2000)
            document.getElementById('dialog').vis = false
            loadPremission()
        } else if (res.code == 203) {
            //token无效或过期
            window.parent.userTokenOverDue()
        }
    }).catch(error => {
        document.tip.danger("上传失败：" + error, 2500)
    });
}

// 加载权限数据
function loadPremission() {
    fetch(BaseUrl + '/getPremissionList', {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem("userToken")
        }
    }).then(response => response.json()).then(res => {
        //console.log(res)
        if (res.code == 200) {
            premissionData = res.data
            loadPrimissionList()
        } else if (res.code == 203) {
            //token无效或过期
            window.parent.userTokenOverDue()
        }
    }).catch(error => {
        document.tip.danger("上传失败：" + error, 2500)
    });
}

function loadPrimissionList() {
    document.getElementById('table').innerHTML = ''
    if (premissionData.length == 0) {
        let empty = dp(`<div id="empty" style="width: 100%;line-height: 40px;text-align: center;font-size: 14px;color: #999999;">
            没有发布功能</div>`)
        document.getElementById('table').appendChild(empty.element)
    } else
        premissionData.forEach((item, index) => {
            let element = dp(`<div class="lineBlock">
            <div class="line">
                <div class="listArrow" ref="openChild">
                ${index + 1}
                </div>
                <div class="listName">${item.label}</div>
                <div class="groupBlock">${item.group == null ? "--" : item.group}</div>
                <div class="desBlock">${item.description == null ? "--" : item.description}</div>
                <div class="urlBlock">${item.src == null ? "--" : item.src}</div>
                <div class="state ${!item.able ? "warn" : "success"}">${item.able ? "启用" : "停用"}</div>
                <div class="button" ref="edit">
                    编辑
                </div>
                <div class="button del" ref="del">
                    删除
                </div>
            </div>
        </div>`)
            document.getElementById('table').appendChild(element.element)
            element.children.edit.onclick = () => {
                document.getElementById('form').value = item
                document.getElementById('dialog').vis = true
            }
            element.children.del.onclick = () => {
                document.confirm.show("确定删除功能：" + item.label + "?", () => {
                    fetch(BaseUrl + '/delPremission', {
                        method: 'POST',
                        headers: {
                            'authorization': localStorage.getItem("userToken"),
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({ name: item.name })
                    }).then(response => response.json()).then(res => {
                        //console.log(res)
                        if (res.code == 200) {
                            document.tip.success("已删除", 2000)
                            loadPremission()
                        } else if (res.code == 203) {
                            //token无效或过期
                            window.parent.userTokenOverDue()
                        }
                    }).catch(error => {
                        document.tip.danger("操作失败失败：" + error, 2500)
                    });
                }, () => { })
            }
        })
}