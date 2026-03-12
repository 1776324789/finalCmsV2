const WebSocket = require("ws")

function setupPlaybackSync(port) {

  const wss = new WebSocket.Server({ port })

  let clients = {}
  let allConnections = []

  console.log("WebSocket server started:", port)

  wss.on("connection", (ws) => {

    allConnections.push(ws)
    console.log("新连接建立，当前连接数:", allConnections.length)

    ws.on("message", (msg) => {

      const data = JSON.parse(msg)

      switch (data.type) {

        case "login":

          ws.userId = data.id
          clients[data.id] = ws

          console.log("用户登录:", data.id)

          broadcastUsers()

          break

        case "offer":
        case "answer":
        case "candidate":

          const target = clients[data.to]

          if (target) {

            target.send(JSON.stringify({
              type: data.type,
              from: ws.userId,
              sdp: data.sdp,
              candidate: data.candidate
            }))
          }

          break

        case "play":
        case "pause":
        case "seek":

          console.log("同步播放状态:", data.type, "时间:", data.currentTime)
          
          allConnections.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: data.type,
                currentTime: data.currentTime,
                from: ws.userId
              }))
            }
          })

          break
      }
    })

    ws.on("close", () => {

      allConnections = allConnections.filter(conn => conn !== ws)
      console.log("连接关闭，当前连接数:", allConnections.length)

      if (ws.userId) {

        console.log("用户离开:", ws.userId)

        delete clients[ws.userId]

        broadcastUsers()
      }
    })
  })

  function broadcastUsers() {

    const list = Object.keys(clients)

    Object.values(clients).forEach(ws => {

      ws.send(JSON.stringify({
        type: "users",
        users: list
      }))
    })
  }
}

module.exports = {
  setupPlaybackSync
}