let isOut = false

document.getElementById('userName').innerText = localStorage.getItem("userName")

function userTokenOverDue() {
    if (!isOut) {
        isOut = true
        document.tip.warn("登录状态发生变化，请重新登录", 2500)
        setTimeout(() => {
            localStorage.clear()
            window.location.href = "./login.html"
        }, 2500);
    }
}

let showUserMenu = false
const menuBlock = document.getElementById("menuBlock")
const userInfoBlock = document.getElementById("userInfoBlock")
const cover = document.getElementById("cover")
userInfoBlock.addEventListener("click", () => {
    if (showUserMenu) {
        userInfoBlock.classList.remove("userInfoBlockFocus")
        cover.style.display = "none"
        menuBlock.style.display = "none"
    } else {
        userInfoBlock.classList.add("userInfoBlockFocus")
        cover.style.display = "block"
        menuBlock.style.display = "block"
    }
    showUserMenu = !showUserMenu
})

cover.addEventListener("click", () => {
    userInfoBlock.classList.remove("userInfoBlockFocus")
    menuBlock.style.display = "none"
    cover.style.display = "none"
    showUserMenu = false
})



document.getElementById('logout').onclick = () => {
    document.confirm.show("确认退出登录？", () => {
        fetch(BaseUrl + '/logout', {
            method: 'POST',
            headers: {
                'authorization': localStorage.getItem("userToken"),
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(data => {
            if (data.code == 200) {
                document.tip.success("已退出", 2500)
                setTimeout(() => {
                    localStorage.clear()
                    window.location.href = "./login.html"
                }, 2000);
            }
        }).catch(error => {
            document.tip.danger("未知错误，请稍后再试", 2500)
        });
    })
}

function getUserPremission() {
    fetch(BaseUrl + '/getUserPremission', {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem("userToken")
        },
    }).then(response => response.json()).then(res => {
        if (res.code == 200) {
            res.data.forEach(item => {
                //console.log(item)
                document.getElementById('mainPage').push({
                    group: item.group,
                    label: item.label,
                    src: item.src + ".html",
                    name: item.name,
                    icon: item.icon,
                    groupIcon: item.groupIcon
                })
            })
        }
    }).catch(error => {
        //console.log(error)
        document.tip.danger("未知错误，请稍后再试" + error, 2500)
    });
}

getUserPremission()