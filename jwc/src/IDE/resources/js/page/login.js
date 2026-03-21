document.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
        document.getElementById('submit').click()
    }
})
let connectId = Date.now().toString(36)
document.getElementById('svg').onclick = () => {
    getVerifyCode()
}
document.getElementById('tip').onclick = () => {
    getVerifyCode()
}

function getVerifyCode() {
    fetch(BaseUrl + '/getverifyCode', {
        method: 'POST',
        body: JSON.stringify({
            connectId: connectId
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {
        document.getElementById('svg').innerHTML = data.svg
    }).catch(error => {
        document.tip.danger("未知错误，请稍后再试", 2500)
    })
}

getVerifyCode()

document.getElementById('submit').onclick = () => {
    let verifyCode = document.getElementById('verify').value
    if (verifyCode == "" || verifyCode.length < 4) {

        return document.tip.warn("请输入完整验证码", 1000)
    }
    fetch(BaseUrl + '/verifyCode', {
        method: 'POST',
        body: JSON.stringify({
            code: verifyCode,
            connectId: connectId
        }), headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {
        if (data.code == 200) {
            let account = document.getElementById('account').value
            let password = document.getElementById('password').value
            fetch(BaseUrl + '/login', {
                method: 'POST',
                body: JSON.stringify({
                    account: account,
                    password: password
                }), headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
                if (data.code == 400) {
                    document.tip.warn("账号或密码错误", 2500)
                } else if (data.code == 200) {
                    document.tip.success("正在登录", 2500)
                    localStorage.setItem("userToken", data.token)
                    localStorage.setItem("userName", data.userName)
                    window.location.href = "./index.html"
                }
            }).catch(error => {
                document.getElementById('verify').value = ""
                document.tip.danger("未知错误，请稍后再试", 2500)
            });
        } else if (data.code == 404) {
            getVerifyCode()
            document.getElementById('verify').value = ""
            document.tip.warn("验证码已过期，请重新输入新验证码", 2500)
        } else if (data.code == 400) {
            document.getElementById('verify').value = ""
            document.tip.warn("验证码错误，请重新输入", 2500)
        }
    }).catch(error => {
        //console.log(error)
        document.tip.danger("未知错误，请稍后再试", 2500)
    });

}
class Dot {
    constructor() {
        this.isMove = false
        this.deep = Math.random()
        this.x = document.getElementById("fontBlock").clientWidth * Math.random()
        this.y = document.getElementById("fontBlock").clientHeight * Math.random()
        this.baseX = this.x * 1
        this.baseY = this.y * 1
        this.init()
    }

    init() {
        this.element1 = document.createElement("div")
        this.element2 = document.createElement("div")
        this.element1.style.backgroundColor = "#fff"
        this.element1.style.boxShadow = " 0 0 50px #fff"
        this.element2.style.boxShadow = " 0 0 10px #407BFF"
        this.element1.classList.add("dot")
        this.element2.classList.add("dot")
        this.element2.classList.add("baseColor")
        this.element1.style.left = this.x + "px"
        this.element1.style.top = this.y + "px"
        this.element2.style.left = (this.x - document.getElementById('block1').clientWidth) + "px"
        this.element2.style.top = this.y + "px"
        this.element1.style.width = this.deep * 200 + "px"
        this.element1.style.height = this.deep * 200 + "px"
        this.element2.style.width = this.deep * 200 + "px"
        this.element2.style.height = this.deep * 200 + "px"
        this.element1.style.filter = `blur(${10 - (this.deep * 10)}px)`
        this.element2.style.filter = `blur(${10 - (this.deep * 10)}px)`
        let op = Math.random() * 0.9
        this.element1.style.opacity = op
        this.element2.style.opacity = op
        document.getElementById("block1").appendChild(this.element1)
        document.getElementById("block2").appendChild(this.element2)
        this.move()
    }

    move() {
        if (this.isMove) {
            let tr = `unset`
            this.element1.style.transition = tr
            this.element2.style.transition = tr
        } else {
            let widTime = Math.random()
            let tr = `${Math.random()}s opacity, ${widTime}s width, ${widTime}s height, ${Math.random()}s left, ${Math.random()}s top`
            this.element1.style.transition = tr
            this.element2.style.transition = tr
            this.xChange(500 * Math.random() * (Math.random() > 0.5 ? 1 : -1))
            this.yChange(500 * Math.random() * (Math.random() > 0.5 ? 1 : -1))
            this.element1.style.opacity = Math.random()
            this.element2.style.opacity = Math.random()
            this.deep = Math.random()
            this.element1.style.width = this.deep * 200 + "px"
            this.element1.style.height = this.deep * 200 + "px"
            this.element2.style.width = this.deep * 200 + "px"
            this.element2.style.height = this.deep * 200 + "px"
            this.element1.style.filter = `blur(${this.deep * 10}px)`
            this.element2.style.filter = `blur(${this.deep * 10}px)`
        }

        setTimeout(() => {
            this.move()
        }, Math.random() * 10000);
    }

    xChange(value) {
        value = value * this.deep
        this.x += value
        this.element1.style.left = this.x + "px"
        this.element2.style.left = (this.x - document.getElementById('block1').clientWidth) + "px"
    }

    reset() {
        let tr = `unset`
        this.element1.style.transition = tr
        this.element2.style.transition = tr
        this.element1.style.left = this.x + "px"
        this.element2.style.left = this.x + "px"
        this.element1.style.top = this.y + "px"
        this.element2.style.top = this.y + "px"
        this.isMove = false
    }

    yChange(value) {
        value = value * this.deep / 4
        this.y += value
        this.element1.style.top = this.y + "px"
        this.element2.style.top = this.y + "px"
    }
}

let dotList = []
for (var a = 0; a < 50; a++) {
    dotList.push(new Dot())
}
// document.addEventListener("mousemove", (e) => {
//     // document.getElementById('font1').style.left = e.clientX - 200 + "px"
//     // document.getElementById('font1').style.top = e.clientY + "px"
//     // document.getElementById('font2').style.left = e.clientX - (document.getElementById('fontBlock').clientWidth / 2) - 200 + "px"
//     // document.getElementById('font2').style.top = e.clientY + "px"
//     for (var a = 0; a < dotList.length; a++) {
//         dotList[a].isMove = true
//         dotList[a].xChange(-e.movementX / 2)
//         dotList[a].yChange(-e.movementY)
//     }
// })

// document.addEventListener("mouseout", (e) => {
//     // document.getElementById('font1').style.left = "100%"
//     // document.getElementById('font1').style.top = "50%"
//     // document.getElementById('font2').style.left = "unset"
//     // document.getElementById('font2').style.top = "50%"
//     for (var a = 0; a < dotList.length; a++) {
//         dotList[a].reset()
//     }
// })