class InfoLine extends HTMLElement {
    constructor() {
        super()
        this.init()
    }
    init() {
        this.element = dp(`<div class="infoLine">
                <div class="label" ref="label"> </div>
                <div class="info" ref="info"></div>
            </div>`)
        this.refs = this.element.children
        this.refs.info.innerHTML = this.innerHTML
        this.refs.label.innerText = this.getAttribute("label")
        if (this.getAttribute("label") == "" || this.getAttribute("label") == null) this.refs.label.hide()
        this.innerHTML = ""
        this.appendChild(this.element.element)
    }
}
customElements.define("info-line", InfoLine)

class InfoWarn extends HTMLElement {
    constructor() {
        super()
        this.init()
    }
    init() {
        this.element = dp(`<div class="infoWarn">
                <div class="info" ref="info"></div>
            </div>`)
        this.refs = this.element.children
        this.refs.info.innerHTML = this.innerHTML
        this.innerHTML = ""
        this.appendChild(this.element.element)
    }
}

customElements.define("info-warn", InfoWarn)