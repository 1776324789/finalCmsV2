class Dot {
    constructor() {
        this.isMove = false
        this.deep = Math.random()
        this.x = document.body.clientWidth * Math.random()
        this.y = document.body.clientHeight * Math.random()
        this.init()
    }

    init() {
        this.element2 = document.createElement("div")
        this.element2.style.backgroundColor = "#407BFF"
        this.element2.style.boxShadow = " 0 0 10px #407BFF"
        this.element2.classList.add("dot")
        this.element2.style.left = this.x + "px"
        this.element2.style.top = this.y + "px"
        this.element2.style.width = this.deep * 200 + "px"
        this.element2.style.height = this.deep * 200 + "px"
        this.element2.style.filter = `blur(${10 - (this.deep * 10)}px)`
        let op = Math.random() * 0.9
        this.element2.style.opacity = op
        document.body.appendChild(this.element2)
        this.move()
    }

    move() {
        if (this.isMove) {
            let tr = `unset`
            this.element2.style.transition = tr
        } else {
            let widTime = Math.random()
            let tr = `${Math.random()}s opacity, ${widTime}s width, ${widTime}s height, ${Math.random()}s left, ${Math.random()}s top`
            this.element2.style.transition = tr
            this.xChange(500 * Math.random() * (Math.random() > 0.5 ? 1 : -1))
            this.yChange(500 * Math.random() * (Math.random() > 0.5 ? 1 : -1))
            this.element2.style.opacity = Math.random()
            this.deep = Math.random()
            this.element2.style.width = this.deep * 200 + "px"
            this.element2.style.height = this.deep * 200 + "px"
            this.element2.style.filter = `blur(${this.deep * 10}px)`
        }

        setTimeout(() => {
            this.move()
        }, Math.random() * 10000);
    }

    xChange(value) {
        value = value * this.deep
        this.x += value
        this.element2.style.left = this.x + "px"
    }

    reset() {
        let tr = `unset`
        this.element2.style.transition = tr
        this.element2.style.left = this.x + "px"
        this.element2.style.top = this.y + "px"
        this.isMove = false
    }

    yChange(value) {
        value = value * this.deep / 4
        this.y += value
        this.element2.style.top = this.y + "px"
    }
}

let dotList = []
for (var a = 0; a < 50; a++) {
    dotList.push(new Dot())
}
// document.addEventListener("mousemove", (e) => {
//     for (var a = 0; a < dotList.length; a++) {
//         dotList[a].isMove = true
//         dotList[a].xChange(-e.movementX / 2)
//         dotList[a].yChange(-e.movementY)
//     }
// })
//
// document.addEventListener("mouseout", (e) => {
//     for (var a = 0; a < dotList.length; a++) {
//         dotList[a].reset()
//     }
// })