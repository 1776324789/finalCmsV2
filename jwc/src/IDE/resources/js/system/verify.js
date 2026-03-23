function verifyToken() {
    fetch(BaseUrl + '/verifyUserToken', {
        method: 'POST',
        body: JSON.stringify({token: localStorage.getItem("userToken")}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => {
            if (data.code == 404) {
                if (!isOut) {
                    isOut = true
                    document.tip.warn("请先登录再进行访问", 2500)
                    setTimeout(() => {
                        localStorage.clear()
                        window.location.href = "./login.html"
                    }, 2500);
                }
            } else if (data.code == 401) {
                if (!isOut) {
                    isOut = true
                    document.tip.warn("长时间未操作，请重新登录", 2500)
                    setTimeout(() => {
                        localStorage.clear()
                        window.location.href = "./login.html"
                    }, 2500);
                }
            }
        })
        .catch(error => {
            //console.log(error)
        });
}

verifyToken()