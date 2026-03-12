//将files文件夹代理到3300端口
const express = require("express")
const path = require("path")

const app = express()

// 要代理的文件夹
const folderPath = path.join(__dirname, "files")

// 映射文件夹
app.use("/", express.static(folderPath))

// 端口
const PORT = 3100

app.listen(PORT, () => {
  console.log(`文件夹已代理到：http://localhost:${PORT}`)
})









const WebSocket = require("ws")
const wss = new WebSocket.Server({ port: 3000 })

const loginUserWsData = new Map()

const movieList = [{
  name: "花束般的恋爱",
  cover: "http://localhost:3100/image/movieCover/image.png"
}]

const wsFunctionMap = {
  login: (user, ws) => {
    if (user == null) return
    if (loginUserWsData.get(user) != null) {
      console.log("同个账户在其他设备登录:" + user);
      loginUserWsData.get(user).send(JSON.stringify({ type: "logout", data: "同个账户在其他设备登录" }))
    }
    loginUserWsData.set(user, ws)
    loginUserWsData.get(user).send(JSON.stringify({ type: "message", data: "login success" }))
    ws["user"] = user
    console.log("user login" + user);
  }
}

wss.on("connection", (ws) => {

  const defaultSystemInfoSync = setInterval(() => {
    const userList = []
    loginUserWsData.forEach((value, key) => {
      userList.push(key)
    })
    ws.send(JSON.stringify({
      type: "systemInfo",
      data: {
        onlineUser: userList,
        movieList: movieList
      }
    }))
  }, 1000);

  ws.on("message", (msg) => {
    const data = JSON.parse(msg)
    wsFunctionMap[data.type](data.data, ws, data)
  })

  ws.on("close", () => {
    console.log("remove user " + ws.user);
    loginUserWsData.delete(ws.user)
    clearInterval(defaultSystemInfoSync)
  })
})
