let ws
let myId
let localStream = null
let peers = {}

let userListCallback = () => { }

export function onUserList(cb) {
    userListCallback = cb
}

export function connectSocket(id) {

    if (!id) {
        alert("请输入用户ID")
        return
    }

    myId = id

    ws = new WebSocket("ws://server.friendnest.cn/ws/")

    ws.onopen = () => {

        console.log("WebSocket connected")

        ws.send(JSON.stringify({
            type: "login",
            id: myId
        }))
    }

    ws.onmessage = async (msg) => {

        const data = JSON.parse(msg.data)

        switch (data.type) {

            case "users":
                userListCallback(data.users)

                for (const uid of data.users) {

                    if (uid !== myId && !peers[uid] && localStream) {
                        await createPeer(uid)
                    }
                }

                break

            case "offer":
                await handleOffer(data)
                break

            case "answer":
                await handleAnswer(data)
                break

            case "candidate":
                await handleCandidate(data)
                break
        }
    }

    ws.onclose = () => {
        console.log("socket closed")
    }
}

export async function startVoice() {

    localStream = await navigator.mediaDevices.getUserMedia({
        audio: true
    })

    console.log("麦克风开启")
}

export function muteVoice() {

    if (!localStream) return

    localStream.getTracks().forEach(track => {
        track.enabled = false
    })
}

async function createPeer(targetId) {

    const pc = new RTCPeerConnection()

    peers[targetId] = pc

    localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream)
    })

    pc.onicecandidate = (event) => {

        if (event.candidate) {

            ws.send(JSON.stringify({
                type: "candidate",
                to: targetId,
                candidate: event.candidate
            }))
        }
    }

    pc.ontrack = (event) => {

        console.log("收到音频来自:", targetId)

        const audio = document.createElement("audio")
        audio.srcObject = event.streams[0]
        audio.autoplay = true
        audio.dataset.user = targetId

        document.body.appendChild(audio)
    }

    const offer = await pc.createOffer()

    await pc.setLocalDescription(offer)

    ws.send(JSON.stringify({
        type: "offer",
        to: targetId,
        sdp: offer
    }))
}

async function handleOffer(data) {

    const pc = new RTCPeerConnection()

    peers[data.from] = pc

    if (localStream) {
        localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream)
        })
    }

    pc.onicecandidate = (event) => {

        if (event.candidate) {

            ws.send(JSON.stringify({
                type: "candidate",
                to: data.from,
                candidate: event.candidate
            }))
        }
    }

    const audioContext = new AudioContext()

    pc.ontrack = (event) => {

        console.log("收到音频来自:", data.from)

        const stream = event.streams[0]

        const source = audioContext.createMediaStreamSource(stream)

        // 创建空间节点
        const panner = audioContext.createPanner()

        panner.panningModel = "HRTF"
        panner.distanceModel = "inverse"

        panner.refDistance = 1
        panner.maxDistance = 10000
        panner.rolloffFactor = 1

        // 默认在左侧
        panner.positionX.setValueAtTime(-1, audioContext.currentTime)
        panner.positionY.setValueAtTime(0, audioContext.currentTime)
        panner.positionZ.setValueAtTime(0, audioContext.currentTime)

        source.connect(panner)
        panner.connect(audioContext.destination)
    }

    await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))

    const answer = await pc.createAnswer()

    await pc.setLocalDescription(answer)

    ws.send(JSON.stringify({
        type: "answer",
        to: data.from,
        sdp: answer
    }))
}
 
async function handleAnswer(data) {

    const pc = peers[data.from]

    if (!pc) return

    await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
}

async function handleCandidate(data) {

    const pc = peers[data.from]

    if (!pc) return

    await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
}