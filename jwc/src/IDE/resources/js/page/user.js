let userData //权限数据
let editPostUrl = "/addUser"
loadRole()

function loadRole() {
    fetch(BaseUrl + '/getRoleData', {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem("userToken")
        },
    }).then(response => response.json()).then(res => {
        //console.log("==========================================")
        //console.log(res)
        if (res.code == 200) {
            let option = []
            res.data.forEach(item => {
                option.push({
                    label: item.name,
                    value: item.id
                })
            })
            document.getElementById('roleSelector').option = option
            loadUser()
        } else if (res.code == 203) {
            //token无效或过期
            window.parent.userTokenOverDue()
        }
    }).catch(error => {
        document.tip.danger("上传失败：" + error, 2500)
    });
}

document.getElementById('dialog').onclose = (e) => {
    document.getElementById('form').clear()
}
document.getElementById('submit').onclick = () => {
    document.getElementById('form').submit((e) => {
        updateUser(e)
    })
}

function updateUser(value) {
    fetch(BaseUrl + editPostUrl, {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }, body: JSON.stringify(value)
    }).then(response => response.json()).then(res => {
        if (res.code == 200) {
            document.tip.success("已保存", 2000)
            document.getElementById('dialog').vis = false
            loadUser()
        } else if (res.code == 203) {
            //token无效或过期
            window.parent.userTokenOverDue()
        } else if (res.code == 201) {
            document.tip.warn("创建失败：账号重复", 2500)
        }
    }).catch(error => {
        document.tip.danger("上传失败：" + error, 2500)
    });
}

// 加载权限数据
function loadUser() {
    fetch(BaseUrl + '/getUserData', {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem("userToken")
        }
    }).then(response => response.json()).then(res => {
        //console.log(res)
        if (res.code == 200) {
            userData = res.data
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
    if (userData.length == 0) {
        let empty = dp(`<div id="empty" style="width: 100%;line-height: 40px;text-align: center;font-size: 14px;color: #999999;">
            没有创建角色</div>`)
        document.getElementById('table').appendChild(empty.element)
    } else
        userData.forEach((item, index) => {
            let element = dp(`<div class="lineBlock">
            <div class="line">
                <div class="listArrow" ref="openChild">
                ${index + 1}
                </div>
                <div class="listName">${item.account}</div>
                <div class="groupBlock">${item.userName}</div>
                <div class="desBlock">${getRoleString(item.role)}</div>
                <div class="urlBlock">${item.createDate}</div>
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
                editPostUrl = "/updateUser"
                document.getElementById('accountInput').disabled = true
                document.getElementById('form').value = item
                let value = []
                item.role.forEach(item => {
                    value.push(item.id)
                })
                document.getElementById('roleSelector').value = value
                document.getElementById('dialog').vis = true
            }

            element.children.del.onclick = () => {
                document.confirm.show("确定删除功能：" + item.label + "?", () => {
                    fetch(BaseUrl + '/delUser', {
                        method: 'POST',
                        headers: {
                            'authorization': localStorage.getItem("userToken"),
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({ account: item.account })
                    }).then(response => response.json()).then(res => {
                        //console.log(res)
                        if (res.code == 200) {
                            document.tip.success("已删除", 2000)
                            loadUser()
                        } else if (res.code == 203) {
                            //token无效或过期
                            window.parent.userTokenOverDue()
                        }
                    }).catch(error => {
                        document.tip.danger("操作失败失败：" + error, 2500)
                    });
                }, () => {
                })
            }
        })
}

function getRoleString(roles) {
    res = ""
    roles.forEach(item => {
        res += item.name + ","
    })
    return res.substring(0, res.length - 1)
}