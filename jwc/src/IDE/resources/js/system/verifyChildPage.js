function verifyToken() {
    //console.log(localStorage.getItem("userToken"))
    fetch(BaseUrl + '/verifyUserToken', {
        method: 'POST',
        body: JSON.stringify({token: localStorage.getItem("userToken")}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => {
            //console.log(data)
            if (data.code == 404 || data.code == 401) {
                window.parent.userTokenOverDue()
            }
        })
        .catch(error => {
            //console.log(error)
        });
}

function loading(value) {
    window.parent.loading(value)
}

if (window.location.href == window.parent.location.href) {
    window.location.href = "./login.html"
} else {
    verifyToken()
}