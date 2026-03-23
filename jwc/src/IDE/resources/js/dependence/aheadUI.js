/* @Author LiuJun */
/* @CreateDateTime 2024-10-08 11:21:20 */


//###########################################################
//###############   FinalComponent-tool-case   ##############
//###########################################################

//生成dom队列
function dp(pageString) {
    let domElement = {}
    pageString = pageString.replaceAll("\n", '').replaceAll("\t", '');
    let content = document.createElement("div")
    content.innerHTML = pageString
    domList(content.childNodes[0], domElement)
    return {
        element: content.childNodes[0],
        children: domElement
    }
}

//生成dom队列
function domList(dom, domElement) {
    initDomFunctions(dom)
    if (dom.getAttribute != null && dom.getAttribute("ref") != "" && dom.getAttribute("ref") != null) {
        domElement[dom.getAttribute("ref")] = dom
    }
    if (dom.childNodes.length > 0) {
        dom.childNodes.forEach((node) => {
            domList(node, domElement)
        })
    }
}

function dc(tag, Class) {
    let element = document.createElement(tag)
    if (Class != null) {
        if (typeof Class == "string") {
            element.classList.add(Class)
        } else {
            Class.forEach((className) => {
                element.classList.add(className)
            })
        }
    }
    initDomFunctions(element)
    return element
}

//初始化Dom的函数
function initDomFunctions(dom) {
    dom["show"] = (display) => {
        if (display == null) {
            dom.style.display = "block"
        } else {
            dom.style.display = display
        }
        return dom
    }
    dom["hide"] = () => {
        dom.style.display = "none"
        return dom
    }
    dom["val"] = (val) => {
        dom.value = val
        return dom
    }
    dom["txt"] = (text) => {
        dom.innerText = text
        return dom
    }
    dom["add"] = (ele) => {
        dom.appendChild(ele)
        return dom
    }

}

// 传入变量判断其是否是数字
// 是：返回整数
// 否：返回false
function toNum(inputContent) {
    // 将输入内容转换成字符串
    inputContent = String(inputContent);

    // 检查输入内容是否为数字
    if (!isNaN(inputContent)) {
        // 如果是数字，返回数字或取整后的数字
        if (inputContent.includes('.')) {
            return Math.floor(parseFloat(inputContent)); // 返回取整后的数字
        } else {
            return parseInt(inputContent); // 返回整数
        }
    } else {
        // 如果不是数字，返回 false
        return false;
    }
}


//#########################################################
//###############   FinalComponent-Loading   ##############
//#########################################################

class Loading extends HTMLElement {
    constructor() {
        super()
        this.refs
        this.parentPosition
        this.visable = false
        this.block = false
        this.init()
    }

    init() {
        this.initElement()
    }

    initElement() {
        this.element = dp(`<div class="a-main">
        <div style="flex:1;"></div>
        <div class="a-icon-block">
            <i class="icon-loader-2-fill"></i>
        </div>
        <div class="a-text">
            <div style="flex:1;"></div>
            <div class="a-font" ref="text"></div>
            <div style="flex:1;"></div>
        </div>
        <div style="flex:1.2;"></div>
    </div>`)
        this.refs = this.element.children
        this.appendChild(this.element.element)
        this.refs.text.innerText = this.getAttribute("label")
        if (this.getAttribute("width") != null && this.getAttribute("height") != null) {
            this.block = true
            this.element.element.style.width = this.getAttribute("width")
            this.element.element.style.height = this.getAttribute("height")
            this.element.element.style.position = "unset "
        }
        if (this.getAttribute("vis") == "true") {
            this.vis = true
        }

    }

    set vis(value) {
        if (!this.block)
            this.parentPosition = this.parentNode.style.position + ''
        if (value) {
            this.style.display = "block"
            if (!this.block) {
                this.parentNode.style.position = "relative"
                this.element.element.style.height = "100%"
                if (this.element.element.clientHeight == 0) {
                    this.element.element.style.height = this.parentNode.clientHeight + "px"
                }
            }

            this.visable = true
        } else {
            if (!this.block)
                this.parentNode.style.position = this.parentPosition
            this.style.display = "none"
            this.visable = false
        }
    }

    get vis() {
        return this.visable
    }
}


//#########################################################
//###############   FinalComponent-Confirm   ##############
//#########################################################

new class Confirm {
    constructor() {
        this.delWindow
        this.ifShow = false
        this.init()
        //添加此组件到文档中
        document["confirm"] = this
    }

    init() {
        this.initElement() //初始化元素组件
        this.initFunctions() //添加方法事件到组件元素中
    }

    initElement() {
        this.element = dp(`<div class="a-component-confirm " >
		<div class="a-text-block">
			<i class="icon-chat-delete-fill"></i>
			<div class="a-text" ref="text">
			</div>
		</div>
		<div class="a-button-block">
			<button class="a-yes" ref="yes">确认</button>
			<button class="a-no" ref="no">取消</button>
		</div>
	</div>`)
        this.refs = this.element.children
        //为组件添加遮罩，用于点击组件外部时隐藏组件
        this.refs.cover = dc("div", "a-confirm-cover")
        document.body.appendChild(this.element.element)
        document.body.appendChild(this.refs.cover)
    }

    initFunctions() {
        document.body.addEventListener("mousedown", (e) => {
            if (!this.ifShow) {
                //组件显示的位置根据鼠标位置进行跟踪
                this.element.element.style.left = (e.x * 1 + 10) + "px"
                this.element.element.style.top = (e.y * 1 + 10) + "px"
            }
        })
        this.refs.cover.onmousedown = (e) => {
            this.ifShow = false
            this.refs.cover.hide()
            this.element.element.hide()
        }
    }


    //外部调用方法
    //text 提示内容
    //yes 外部传入方法在点击确定按钮后运行
    //no 外部传入方法在点击取消按钮后运行
    show(text, yes, no) {
        this.element.element.style.marginLeft = 0
        this.ifShow = true
        this.refs.text.txt(text)
        this.element.element.show("flex")
        this.refs.cover.show()
        //在点击按钮后隐藏组件
        this.refs.yes.onclick = () => {
            this.ifShow = false
            if (yes) yes()
            this.refs.cover.hide()
            this.element.element.hide()
        }
        this.refs.no.onclick = () => {
            this.ifShow = false
            if (no) no()
            this.refs.cover.hide()
            this.element.element.hide()
        }
        //根据窗口大小调整组件所在位置
        let left = (this.element.element.offsetLeft + this.element.element.clientWidth) - window.innerWidth
        if (left > 0)
            this.element.element.style.left = (this.element.element.offsetLeft - left - 15) + "px"

        let top = (this.element.element.offsetTop + this.element.element.clientHeight) - window.innerHeight
        if (top > 0)
            this.element.element.style.top = this.element.element.offsetTop - top - 15 + "px"
    }
}


//##############################################################
//###############   FinalComponent-ContentBlock   ##############
//##############################################################

class ContentBlock extends HTMLElement {
    constructor() {
        super()
        this.height
        this.isOpen = true
        this.isInit = false
    }

    connectedCallback() {
        if (!this.isInit) {
            this.initElement()
            this.isInit = true
        }
    }

    initElement() {
        if (document["a-content-z-index"] == null) document["a-content-z-index"] = 10
        //卡片类型
        let type
        switch (this.getAttribute("type")) {
            case "float":
                this.setAttribute("foldable", "true")
                type = "a-content-block-float"
                break;
            case "clear":
                type = "a-content-block-clear"
                break;
            default:
                type = "a-content-block"
                break;
        }
        //初始化卡片dom
        this.element = dp(`<div class="a-component-content-block">
        <div class="a-title" ref="title">
            <div ref="label"></div>
            <div>
                <i class="icon-arrow-drop-down-fill" ref="arrow"></i>
            </div>
        </div>
        <div class="${type}" ref="content"></div>
        </div>`)
        this.refs = this.element.children
        this.refs.label.innerText = this.getAttribute("label")
        if (this.getAttribute("label") == null) {
            this.refs.title.style.display = "none"
        }
        this.initContent()
        this.appendChild(this.element.element)

        this.classList.forEach(item => {
            this.element.element.classList.add(item)
        })
        let str = ""
        for (var key in this.style) {
            str = str + `${key}:${this.style[key]};`
        }
        this.element.element.style = str
        //卡片可收起
        if (this.getAttribute("foldable") != null) {
            //在元素添加到文档中后立即记录卡片所占高度，用于后续动画效果
            this.height = this.refs.content.clientHeight
            this.refs.arrow.style.display = "block"
            this.refs.label.classList.add("a-pointer")
            this.refs.arrow.classList.add("a-pointer")
            this.refs.content.style.transition = "unset"
            if (this.getAttribute("fold") == "true") this.foldContent()
            //在组件加载完毕后再添加动态效果 这样是为了开始加载的时候可以立即收缩而不是有一个动画
            setTimeout(() => this.refs.content.style.transition = "0.3s padding, 0.3s height", 300);
            this.initFunctions()
        } else this.refs.arrow.style.display = "none"
        if (this.getAttribute("padding") != null) this.refs.content.style.padding = this.getAttribute("padding")
        if (this.getAttribute("vis") == "false") {
            this.vis = false
        }
        if (this.getAttribute("padding") != null) {
            this.refs.content.style.padding = this.getAttribute("padding")

        }
        if (this.getAttribute("width") != null) {
            this.refs.content.style.width = this.getAttribute("width")
        }
        if (this.getAttribute("height") != null) {
            this.refs.content.style.height = this.getAttribute("height")
        }
        Array.from(this.getElementsByTagName("CONTENT-MENU")).forEach(item => {
            if (item.parentNode != this.refs.content) return
            let menu = dc("div", "a-content-menu-button")
            menu.id = item.id + ""
            item.id = null
            menu.innerText = item.innerText
            menu.onclick = item.onclick
            this.refs.title.appendChild(menu)
            item.parentNode.removeChild(item)
        })
    }

    set vis(value) {
        if (!value) {
            this.element.element.style.display = "none"
        } else {
            this.element.element.style.display = "block"
        }
    }

    set fold(value) {
        if (value) this.foldContent()
        else this.openContent()
    }

    initFunctions() {
        this.refs.label.onclick = () => {
            if (this.isOpen) this.foldContent()
            else this.openContent()
        }
        this.refs.arrow.onclick = () => {
            if (this.isOpen) this.foldContent()
            else this.openContent()
        }
    }

    foldContent() {
        this.height = this.refs.content.clientHeight
        this.refs.arrow.classList.remove("icon-arrow-drop-down-fill")
        this.refs.arrow.classList.add("icon-arrow-drop-up-fill")
        this.isOpen = false
        this.refs.content.style.overflow = "hidden"
        this.refs.content.style.height = "0px"
        this.refs.content.style.padding = "0px"
        this.refs.content.style.border = "0px"
    }

    openContent() {
        this.refs.arrow.classList.add("icon-arrow-drop-down-fill")
        this.refs.arrow.classList.remove("icon-arrow-drop-up-fill")
        this.isOpen = true
        this.refs.content.style.overflow = "hidden"
        this.refs.content.style.height = this.height - 30 + "px"
        this.refs.content.style.padding = "15px"
        this.refs.content.style.border = "1px solid #d4d4d4"
        if (this.getAttribute("type") == "float") {
            this.refs.content.style.zIndex = document["a-content-z-index"]++
        }
        this.refs.content.style.height = "auto"
        //在卡片展开后将卡片调整到可以进行自适应
        // setTimeout(() => {
        // 	this.refs.content.style.height = "auto"
        // 	this.height = this.refs.content.clientHeight
        // 	this.refs.content.style.height = this.height - 30 + "px"
        // 	this.refs.content.style.overflow = "unset"
        // }, 310);
    }

    initContent() {
        Array.from(this.childNodes).forEach(item => {
            this.refs.content.appendChild(item)
        })
    }

    set label(label) {
        this.refs.title.style.display = "flex"
        this.setAttribute("label", label)
        this.refs.label.innerText = label
    }
}


//##############################################################
//###############   FinalComponent-DialogEngine   ##############
//##############################################################

class DialogEngine extends HTMLElement {
    constructor() {
        super()
        this.dialog = null
        this.titleElement = null
        this.dialogCover = null
        this.dialogInner = null
        document["DIALOGZINDEX"] = 1001
        this.drag = false
        this.foot = null
        this.init()
    }

    init() {
        this.initElement()
        this.initAttubie()
        this.initFunctions()
    }

    initElement() {
        this.titleElement = dp(`<div class="a-dialog-title">
			<font ref="title"></font>
			<i class="icon-close-fill" ref="close"></i>
		</div>`)
        this.title = this.getAttribute("title")
        this.dialogCover = document.createElement("div")
        this.dialogCover.classList.add("a-dialog-cover")
        this.dialog = document.createElement("div")
        this.dialog.classList.add("a-dialog")
        this.dialogInner = document.createElement("div")
        this.dialogInner.classList.add("scroll")
        this.dialogInner.classList.add("a-dialog-inner")
        if (this.getAttribute("overflow") != null) {
            this.dialogInner.style.overflow = this.getAttribute("overflow")
        }
        Array.from(this.childNodes).forEach(item => {

            this.dialogInner.appendChild(item)
        })
        this.dialog.appendChild(this.titleElement.element)
        this.dialog.appendChild(this.dialogInner)
        if (Array.from(this.dialogInner.getElementsByTagName("a-dialog-foot")).length > 0) {
            this.foot = Array.from(this.dialogInner.getElementsByTagName("a-dialog-foot"))[0]
            if (this.foot.parentNode == this.dialogInner) {
                this.dialog.appendChild(this.foot)
            }
        }
        this.appendChild(this.dialogCover)
        this.appendChild(this.dialog)
        this.appendChild = (child) => this.dialogInner.appendChild(child)
        if (this.getAttribute("width") != null) this.dialog.style.width = this.getAttribute("width")
        if (this.getAttribute("height") != null) this.dialog.style.height = this.getAttribute("height")
        if (this.dialogInner.clientHeight < this.dialogInner.scrollHeight && this.foot) {
            this.foot.style.boxShadow = "0 -2px 2px #dadada"
        }
    }

    initAttubie() {
        this.vis = this.getAttribute("vis") != "true" ? false : true

    }

    set title(value) {
        this.titleElement.children.title.innerText = value
        this.setAttribute("title", "")
    }

    get title() {
        return this.titleElement.children.title.innerText
    }

    set vis(vis) {
        this.setAttribute("vis", vis)
        if (vis) {
            document["DIALOGZINDEX"]++
            this.style.display = "flex"
            this.dialog.classList.add("a-slide-in")
            this.dialogCover.style.display = "flex"
            this["xCount"] = 0
            this["yCount"] = 0
            if (this.getAttribute("dragable") == "true") {
                this.dialog.style.marginLeft = "50%"
                this.dialog.style.top = "50% "
            }
            this.dialogInner.scrollTo(0, 0)
            this.onopen()
            setTimeout(() => {
                this.dialog.classList.remove("a-slide-in")
            }, 300);
        } else {
            this.style.display = "none"
            this.onclose()
        }
    }

    onclose() {
    }

    onopen() {
    }

    get vis() {
        return this.getAttribute("vis") == "true" ? true : false
    }

    clear() {
        this.dialogInner.innerHTML = ""
    }


    initFunctions() {
        this.dialogInner.addEventListener("scroll", (e) => {
            if (this.dialogInner.scrollTop > 0) {
                this.titleElement.element.style.boxShadow = "0 2px 2px #dadada"
            } else {
                this.titleElement.element.style.boxShadow = "unset"
            }
            if (this.foot) {
                if (this.dialogInner.clientHeight + this.dialogInner.scrollTop < this.dialogInner
                    .scrollHeight) {
                    this.foot.style.boxShadow = "0 -2px 2px #dadada"
                } else {
                    this.foot.style.boxShadow = "unset"
                }
            }
        })
        if (this.getAttribute("dragable") == "true") {
            this.titleElement.children.title.style.cursor = "move  "
            this["xCount"] = 0
            this["yCount"] = 0
            this.titleElement.children.title.onmousedown = (e) => {
                this.drag = true
            }
            document.addEventListener('mousemove', (e) => {
                if (this.drag) {
                    this["xCount"] += e.movementX
                    this["yCount"] += e.movementY
                    this.dialog.style.marginLeft = "calc(50% + " + this["xCount"] + "px)"
                    this.dialog.style.top = "calc(50% + " + this["yCount"] + "px)"
                }
            })
            document.addEventListener('mouseup', () => {
                this.drag = false
            })
        }

        this.titleElement.children.close.onclick = () => {
            this.vis = false
        }

        this.dialogCover.onclick = () => {
            this.vis = false
        }
    }
}


//######################################################
//###############   FinalComponent-Form   ##############
//######################################################

//表单的子类，加载顺序必须在FormENgine前
class FormItem extends HTMLElement {
    constructor() {
        super()
        this.refs = null
        this.element = null
        this.requireTemp = false
        this.requireTip = ""
        this.disable = false
        this.init()
    }

    init() {
        this.initElement()
    }

    initElement() {
        let elementString = `<div>
            <div ref="labelBlock">
                <div class="a-form-label" ref="label"></div>
                <div class="a-form-require-temp" ref="require"></div>
            </div>
            <div class="a-form-component">
                <div class="a-component-block" ref="component"></div>
                <div class="a-form-tip-block" ref="tip"></div>
            </div>
        </div>`

        this.element = dp(elementString)
        this.refs = this.element.children
        this.refs.label.innerText = this.getAttribute("label")
        //将表单项中的组件加载到基础元素中
        //默认只加载第一个组件
        this.refs.component.appendChild(this.children[0])
        this.appendChild(this.element.element)

        //表当项为必填
        if (this.getAttribute("require") != null) {
            this.refs.require.classList.remove("a-form-require-temp")
            this.refs.require.classList.add("a-form-require")
            this.refs.require.innerText = "*"
            this.requireTemp = true
            this.requireTip = this.getAttribute("require") == "" ? "请输入完整内容" : this.getAttribute("require")
        }
        //表当项占有的最小宽度
        if (this.getAttribute("minwidth") != null) {
            this.style.minWidth = this.getAttribute("minwidth")
            this.element.element.style.minWidth = this.getAttribute("minwidth")
        }
    }

    // 默认的验证方法
    //验证通过验证返回true 不通过返回false
    verify() {
        //当元素不需要验证时跳过，并返回true
        if (this.requireTemp) {
            //获取表单项的值
            let value = this.refs.component.children[0].value
            //console.log(this.Form)
            let verify = this.verifyFun(value, this.Form.fullValue)
            //验证结果，通过返回true
            if (!verify) {
                this.refs.tip.innerText = this.requireTip
                this.refs.tip.style.textIndent = "10px"
                setTimeout(() => {
                    //显示未通过验证的提示
                    this.refs.tip.style.textIndent = 0
                }, 100);
            } else {
                this.refs.tip.style.textIndent = "-100%"
                this.refs.tip.innerText = ""
            }
            return verify
        } else
            return true
    }

    //验证实体方法
    verifyFun(value, fullValue) {
        let result = true
        //为0的情况不算为空
        if (value + "" == "0") value = "0"
        if (value == null || value == "" || value == {} || value == []) result = false
        if (this.refs.component.children[0].tagName == "A-INPUT-RADIO") {
            let radio = false
            for (var key in value) {
                if (value[key] == true) radio = true
            }
            if (!radio) result = false
        }
        return result
    }

    //获取表单项的名称的宽度值
    get labelWidth() {
        return this.refs.label.clientWidth
    }

    //设定表单项名称的宽度
    set labelWidth(value) {
        this.refs.label.style.width = value
    }

    //获取表单项中组件的值
    get value() {
        return {
            name: this.getAttribute("name"),
            value: this.refs.component.children[0].value
        }
    }

    //设置表单项组件中的值
    set value(value) {
        this.refs.component.children[0].value = value
    }

    set disabled(value) {
        this.disable = value
        this.refs.component.children[0].disabled = value
    }

    get disabled() {
        return this.disable
    }

    clear() {
        this.refs.component.children[0].value = null
    }

    set require(value) {
        value = value == "" ? "请输入完整内容" : value
        if (value == false) {
            this.refs.require.classList.add("a-form-require-temp")
            this.refs.require.classList.remove("a-form-require")
            this.refs.require.innerText = ""
            this.requireTemp = false
        } else {
            this.refs.require.classList.remove("a-form-require-temp")
            this.refs.require.classList.add("a-form-require")
            this.refs.require.innerText = "*"
            this.requireTemp = true
            this.requireTip = value
        }
    }

    //设定表单排版方向，由父类进行调用 横向排版
    row() {
        this.element.element.classList.add("a-form-vhorizontal")
        this.element.element.classList.remove("a-form-vertical")
        this.refs.labelBlock.classList.add("a-form-label-block")
        this.refs.labelBlock.classList.remove("a-label-block-vertical")
    }

    //设定表单排版方向，由父类进行调用 纵向排版
    column() {
        this.element.element.classList.remove("a-form-vhorizontal")
        this.element.element.classList.add("a-form-vertical")
        this.refs.labelBlock.classList.remove("a-form-label-block")
        this.refs.labelBlock.classList.add("a-label-block-vertical")
    }

    //计算表单项在一行中所占位置
    //col为一行中包含的表单项数量
    //当col为空时则不排版，按照组件原始大小进行排列
    col(col) {
        let width
        //一行中的所有表单项的右边距之和为50px
        if (this.getAttribute("line") == null && this.getAttribute("col") == null) {
            this.style.width = "calc(" + 100 / col + "% - " + 50 / col + "px)"
            this.style.marginRight = 50 / col + "px"
        }
        //当表单项的line不为空时，则该表单默认占一行
        //当line不为空且有值时，该表单项所占行大小为line*10%
        if (this.getAttribute("line") != null) {
            if (this.getAttribute("line") == "") width = 10
            else width = this.getAttribute("line") * 1
            this.style.width = "calc(" + width * 10 + "% - " + 50 / col + "px)"
            this.style.marginRight = 50 / col + "px"
        }

        if (this.getAttribute("col") != null) {
            let selfCol = this.getAttribute("col") * 1
            if (selfCol == 1) this.element.element.style.width = "100%"
            else this.element.element.style.width = "calc(" + 100 / selfCol + "% - " + 50 / col + "px)"
        }
    }

    //设定表单的最小宽度
    minWidth(value) {
        if (this.getAttribute("minwidth") == null) {
            this.refs.component.children[0].style.minWidth = value
            this.style.minWidth = "calc(" + value + " + " + this.refs.labelBlock.clientWidth + "px)"
            // this.element.element.style.minWidth = "calc(" + value + " + " + this.refs.label.clientWidth + "px)"
        }
    }

}

//表单组件
class Form extends HTMLElement {
    constructor() {
        super()
        this.componentMap = new Map()
        this.refs = null
        this.element = null
        this.maxLabelWidth = 0
        this.fullValueTemp = null
        this.disable = false
        this.init()
    }

    init() {
        this.initElement()
    }

    set fullValue(value) {
        this.fullValueTemp = value
    }

    get fullValue() {
        if (this.fullValueTemp == null) this.fullValueTemp = {}
        Array.from(this.componentMap).forEach(item => {
            //验证
            this.fullValueTemp[item[1].value.name] = item[1].value.value
        })
        return this.fullValueTemp
    }

    initElement() {
        this.element = dp(`<div class="a-form-block"></div>`)
        this.appendChild(this.element.element)
        //加载子类中的全部FormItem
        Array.from(this.getElementsByTagName("a-form-item")).forEach(item => {
            if (this.componentMap.has(item.getAttribute("name"))) {
                console.error('FinalComponent:A form can not has same name in items')
                return
            }
            //按照name将子类添加到map中
            this.componentMap.set(item.getAttribute("name"), item)
            item.Form = this
            //根据设定加载子表单项的排版，默认横向
            if (this.getAttribute("direction") == "column") item.column()
            else item.row()
            // 将子项添加到表单元素中
            this.element.element.appendChild(item)
            //加载子项在表单中的排版
            if (this.getAttribute("col") != null) item.col(Number(this.getAttribute("col")))
        })
        //当表单的排版模式时横向时，则将所有的label宽度调整一致
        if (this.getAttribute("direction") != "column") {
            //获取表单项在表单中的最大label宽度
            Array.from(this.componentMap).forEach(temp => {
                let item = temp[1]
                if (item.labelWidth > this.maxLabelWidth) this.maxLabelWidth = item.labelWidth
            })
            Array.from(this.componentMap).forEach(temp => {
                let item = temp[1]
                //当表单项有自己的宽度时

                if (this.getAttribute("labelWidth") != null) {
                    item.labelWidth = this.getAttribute("labelWidth")
                } else {
                    item.labelWidth = this.maxLabelWidth + "px"
                }
                //加载子项在排版中的最小宽度
                if (this.getAttribute("minwidth") != null) {
                    item.minWidth(this.getAttribute("minwidth"))
                }
            })
        }
    }

    // 添加自定义验证
    setVerify(value) {
        if (!this.componentMap.has(value.name)) {
            console.error("FormEngine:no such item, name:" + value.name)
            return
        }
        this.componentMap.get(value.name).require = value.require
        this.componentMap.get(value.name).verifyFun = value.verify

    }

    //传入值后自动将值加载进表单中
    set value(value) {
        this.fullValue = value
        for (var key in value) {
            if (this.componentMap.has(key))
                this.componentMap.get(key).value = value[key]
        }
    }

    //提交方法，传入方法后返回表单的值
    submit(fun) {
        let verify = true
        Array.from(this.componentMap).forEach(item => {
            //验证
            if (!item[1].verify()) {
                verify = false
            }
        })
        if (verify) {
            fun(this.fullValue)
        }
    }

    clear() {
        this.fullValue = null
        Array.from(this.componentMap).forEach(item => {
            item[1].clear()
        })
    }

    set disabled(value) {
        this.disable = value
        Array.from(this.componentMap).forEach(item => {
            //验证
            item[1].disabled = value
        })
    }

    get disabled() {
        return this.disable
    }
}


//############################################################
//###############   FinalComponent-HtmlShower   ##############
//############################################################

class HTMLShower extends HTMLElement {
    constructor() {
        super()
        this.codeString = ""
        this.pList = []
        this.init()
    }

    set dark(dark) {
        if (dark == "true") {
            document.body.style.setProperty('--CODEBORDER', ' #dbdbdb')
            document.body.style.setProperty('--CODEBACKGROUNDCOLOR', '#363636')
            document.body.style.setProperty('--CODENOBORDERRIGHT', '#dbdbdb')
            document.body.style.setProperty('--PHOVERBACKGROUNDCOLOR', '#323232')
            document.body.style.setProperty('--NOCOLOR', '#cccccc')
            document.body.style.setProperty('--TAGCOLOR', '#569cd6')
            document.body.style.setProperty('--TAGNAMECOLOR', '#569cd6')
            document.body.style.setProperty('--TAGATTUBITECOLOR', '#9cdcfe')
            document.body.style.setProperty('--TAGEQUALCOLOR', '#fff')
            document.body.style.setProperty('--TAGATTUBITEINNERCOLOR', '#ce9178')
            document.body.style.setProperty('--TAGFONTCOLOR', '#fff')
        } else {
            document.body.style.setProperty('--CODEBORDER', ' #dbdbdb')
            document.body.style.setProperty('--CODEBACKGROUNDCOLOR', '#fff')
            document.body.style.setProperty('--CODENOBORDERRIGHT', '#dbdbdb')
            document.body.style.setProperty('--PHOVERBACKGROUNDCOLOR', '#fafafa')
            document.body.style.setProperty('--NOCOLOR', '#38444b')
            document.body.style.setProperty('--TAGCOLOR', '#2367c7')
            document.body.style.setProperty('--TAGNAMECOLOR', '#2367c7')
            document.body.style.setProperty('--TAGATTUBITECOLOR', '#cb2d01')
            document.body.style.setProperty('--TAGEQUALCOLOR', '#38444b')
            document.body.style.setProperty('--TAGATTUBITEINNERCOLOR', '#248c85')
            document.body.style.setProperty('--TAGFONTCOLOR', '#38444b')
        }
        this.setAttribute("dark", dark)
    }

    get dark() {
        return this.getAttribute("dark")
    }

    init() {
        this.dark = this.getAttribute("dark")
        this.element = dp(`<div class="a-code">
        <div class="a-code-top-tool-bar">
            <div class="a-code-title" ref="title"></div>
            <div class="a-code-tip" ref="tip"></div>
            <i class="icon-file-copy-line" ref="copy"></i>
        </div>
        <div class="a-code-bottom-code">
            <div ref="codeNo" class="a-code-no"></div>
            <div ref="codeContent" class="a-code-content scroll"></div>
        </div>
    </div>`)
        this.refs = this.element.children
        if (this.getAttribute("title") != null) {
            this.refs.title.innerText = this.getAttribute("title")
            this.setAttribute("title", "")
        }
        this.refs.copy.onclick = () => {
            this.copy()
        }
        this.codeString = this.innerHTML + ""
        let innerText = this.innerHTML + ""
        this.innerHTML = ""
        innerText = innerText.replaceAll("&lt;", "<")
        innerText = innerText.replaceAll("&gt;", ">")
        innerText = innerText.replaceAll("\t", "")
        innerText = innerText.replaceAll("\n", "")
        innerText = innerText.replaceAll("</", "\n</")
        innerText = innerText.replaceAll(">", ">\n")
        innerText = innerText.replaceAll(")=>\n", ")=>")
        innerText = innerText.replaceAll("<", "\n<")
        innerText = innerText.replaceAll("\n\n<", "\n<")
        innerText = innerText.replaceAll("  ", "")
        let arrayTemp = innerText.split("\n")
        let array = arrayTemp.filter(item => item !== "");
        if (array.length == 0) return
        this.pList = []
        array.forEach(item => this.pList.push(dc("p").txt(item)))
        this.pList[0].level = 0
        this.pList.forEach((item, index) => {
            if (item.innerText.substring(0, 4) == "<!--") {
                item.annotation = 1
            }
            if (item.innerText.substring(item.innerText.length - 3, item.innerText.length) == "-->") {
                item.annotation = 0
            }
            if (index == 0) return
            if (item.annotation != 0 && this.pList[index - 1].annotation == 1) {
                item.annotation = 1
            }
            if (item.innerText.substring(0, 2) == "</") {
                if (this.pList[index - 1].innerText.substring(0, 2) == "</")
                    item.level = this.pList[index - 1].level - 1
                else if (this.pList[index - 1].innerText.substring(0, 1) == "<" || this.pList[index - 1].innerText.substring(0, 4) == "<!--") {
                    if (this.pList[index - 1].innerText.substring(0, 6) == "<input")
                        item.level = this.pList[index - 1].level - 1
                    else
                        item.level = this.pList[index - 1].level
                } else
                    item.level = this.pList[index - 1].level - 1
            } else if (item.innerText.substring(0, 1) == "<") {
                if (this.pList[index - 1].innerText.substring(0, 2) == "</" || this.pList[index - 1].innerText.substring(0, 4) == "<!--")
                    item.level = this.pList[index - 1].level
                else if (this.pList[index - 1].innerText.substring(0, 1) == "<")
                    item.level = this.pList[index - 1].level + 1
                else
                    item.level = this.pList[index - 1].level
            } else {
                if (this.pList[index - 1].innerText.substring(0, 2) == "</")
                    item.level = this.pList[index - 1].level
                else if (this.pList[index - 1].innerText.substring(0, 1) == "<")
                    item.level = this.pList[index - 1].level + 1
                else
                    item.level = this.pList[index - 1].level
            }
        })
        this.pList.forEach((item) => {
            item.style.textIndent = 10 + 25 * item.level + "px"
            this.formatItemText(item)
        })
        this.drawCode()
    }

    copy() {
        navigator.clipboard.writeText(this.codeString)
            .then(() => {
                if (document.tip != null) {
                    document.tip.tip("已复制")
                } else {
                    this.refs.tip.innerText = "已复制"
                    setTimeout(() => {
                        this.refs.tip.innerText = ""
                    }, 2000);
                }
            })
            .catch(err => {
                document.tip.error('Error copying text to clipboard:', err)
            });
    }

    drawCode() {
        this.appendChild(this.element.element)
        this.pList.forEach((item, index) => {
            this.refs.codeNo.appendChild(dc("div", "a-no").txt(index + 1))
            this.refs.codeContent.appendChild(item)
        })
    }

    formatItemText(item) {
        let text = item.innerText
        item.innerText = ""
        if (item.annotation == 1 || item.annotation == 0) item.appendChild(dc("span", "a-annotation").txt(text))
        else if (text.substring(0, 1) == "<" && text.substring(text.length - 1, text.length) == ">") this.drawTag(item, text)
        else item.appendChild(dc("span", "a-tag-font").txt(text))
    }

    drawTag(item, text) {
        if (text.substring(0, 2) == "</") {
            item.appendChild(dc("span", "a-tag").txt("</"))
            text = text.substring(2, text.length)
            item.appendChild(dc("span", "a-tag-name").txt(text.substring(0, text.length - 1)))
            item.appendChild(dc("span", "a-tag").txt(">"))
        } else if (text.substring(0, 4) == "<!--") {
            item.appendChild(dc("span", "a-annotation").txt(text))
        } else {
            item.appendChild(dc("span", "a-tag").txt("<"))
            text = text.substring(1, text.length)

            let backTag
            if (text.substring(text.length - 2, text.length) == "/>") {
                backTag = dc("span", "a-tag").txt("/>")
                text = text.substring(0, text.length - 2)
            } else {
                backTag = dc("span", "a-tag").txt(">")
                text = text.substring(0, text.length - 1)
            }
            text = text.replaceAll(": ", ":")
            let array = text.split(" ")
            array.forEach((str, index) => {
                if (index == 0) {
                    item.appendChild(dc("span", "a-tag-name").txt(str))
                    return
                }
                if (str.includes("=")) {
                    item.appendChild(dc("span", "a-tag-attubite").txt(" " + str.split("=")[0]))
                    item.appendChild(dc("span", "a-tag-equal").txt("="))
                    item.appendChild(dc("span", "a-tag-attubite-inner").txt(str.substring(str.split("=")[0].length + 1, text.length).replaceAll(":", ": ")))

                } else
                    item.appendChild(dc("span", "a-tag-attubite-inner").txt((" " + str).replaceAll(":", ": ")))
            })
            item.appendChild(backTag)
        }
    }
}


//########################################################
//###############   FinalComponent-Inputs   ##############
//########################################################

//输入框1.0
class Input extends HTMLElement {
    constructor() {
        super()
        this.refs
        this.limitTemp = false
        this.ready = false
    }

    connectedCallback() {
        if (this.ready) return
        this.initElements()
        this.initFunctions()
        this.ready = true
    }

    initElements() {
        this.element = dp(`<div class="a-input-block">
        <input class="a-input" ref="input"/>
        <div class="a-input-limit-text" ref="limit"></div>
    </div>`)
        this.refs = this.element.children
        this.limit = toNum(this.getAttribute("limit"))

        if (this.limit != false)
            this.refs.input.value = this.getAttribute("value") != null ? this.getAttribute("value").substring(0,
                this.limit) : ""
        else
            this.refs.input.value = this.getAttribute("value")

        if (this.getAttribute("width") != null) {
            this.element.element.style.width = this.getAttribute("width")
        }
        this.refs.input.placeholder = this.getAttribute("placeholder") == null ? "" : this.getAttribute(
            "placeholder")
        let align = this.getAttribute("align")
        let textIndent = 0
        if (this.getAttribute("disabled") == "" || this.getAttribute("disabled") == "true") {
            this.disabled = true
        }
        if (align == null || align == "left") {
            align = "left"
            textIndent = 10
        }
        this.element.children.input.style.textAlign = align
        this.element.children.input.style.textIndent = textIndent + "px"
        this.appendChild(this.element.element)
        this.showLimit()

    }

    set limit(value) {
        this.limitTemp = value
        if (this.limitTemp == false)
            this.refs.limit.style.display = "none"
        else {
            this.refs.limit.style.display = "block"
            this.showLimit()
        }
    }

    get limit() {
        return this.limitTemp
    }

    set disabled(value) {
        if (value) {
            this.disable = true
            this.refs.input.disabled = true
            this.refs.input.style.color = "#999999"
        } else {
            this.refs.input.disabled = false
            this.refs.input.style.color = "#666666"
            this.disable = false
        }
    }

    get disabled() {
        return this.disable
    }

    set value(value) {
        this.refs.input.value = value
        this.showLimit()
        this.onchange()
    }

    get value() {
        return this.refs.input.value
    }

    onchange() {
    }

    onkeyup() {
    }

    onkeydown() {
    }

    showLimit() {
        if (!this.limit) return
        this.refs.limit.innerText = this.refs.input.value.length + "/" + this.limit
        this.refs.input.style.width = "calc(100% - " + (this.refs.limit.clientWidth * 1 - 4) + "px)"
        if (this.value.length > this.limit) {
            this.value = this.value.substring(0, this.limit)
        }
    }

    initFunctions() {
        this.refs.input.addEventListener("change", (e) => {
            this.onchange()
        })
        this.refs.input.addEventListener("keydown", (e) => {
            if (typeof this.limit == "number" && this.getAttribute("limit") != null) {
                this.showLimit()
                if (e.keyCode != 39 && e.keyCode != 37 && this.refs.input.value.length >= this.limit && e
                    .keyCode != 8) {
                    e.preventDefault();
                    return
                }
                this.onkeydown()
            }
        })
        this.refs.input.addEventListener("keyup", (e) => {
            if (typeof this.limit == "number" && this.getAttribute("limit") != null) {
                this.showLimit()
            }
            this.onkeyup()
        })
    }
}

// 密码输入框1.0
class InputPassword extends HTMLElement {
    constructor() {
        super()
        this.refs
        this.vis = false
        this.ready = false
    }

    connectedCallback() {
        if (this.ready) return
        this.initElement()
        this.initFunctions()
        this.ready = true
    }

    initFunctions() {
        this.refs.vis.onclick = () => {
            if (this.vis) {
                this.vis = false
                this.refs.input.type = "password"
                this.refs.vis.classList.remove("icon-eye-fill")
                this.refs.vis.classList.add("icon-eye-line")
            } else {
                this.vis = true
                this.refs.input.type = "text"
                this.refs.vis.classList.remove("icon-eye-line")
                this.refs.vis.classList.add("icon-eye-fill")
            }
        }
    }

    initElement() {
        this.element = dp(`<div class="a-input-block">
        <input autocomplete="off" type="password" class="a-input" ref="input"/>
        <div class="a-vis-block a-vis">
            <i class="icon-eye-line a-vis-button" ref="vis"></i>
        </div>
        </div>`)
        this.appendChild(this.element.element)
        this.refs = this.element.children
        if (this.getAttribute("placeholder") != null) this.refs.input.placeholder = this.getAttribute("placeholder")
        if (this.getAttribute("width") != null) {
            this.element.element.style.width = this.getAttribute("width")
        }
        if (this.getAttribute("disabled") == "" || this.getAttribute("disabled") == "true") {
            this.disabled = true
        }
        this.value = this.getAttribute("value")
    }

    set disabled(value) {
        if (value) {
            this.disable = true
            this.refs.input.disabled = true
            this.refs.input.style.color = "#999999"
        } else {
            this.refs.input.disabled = false
            this.refs.input.style.color = "#666666"
            this.disable = false
        }
    }

    get disabled() {
        return this.disable
    }

    set value(value) {
        this.refs.input.value = value
    }

    get value() {
        return this.refs.input.value
    }
}

// 数字输入框1.0
class InputNum extends HTMLElement {
    constructor() {
        super()
        this.isfocus = false
        this.refs
        this.disable = false
        this.max = null
        this.min = null
        this.ready = false
    }

    connectedCallback() {
        if (this.ready) return
        this.initElements()
        this.initFunctions()
        this.ready = true
    }

    initElements() {
        this.element = dp(`<div class="a-num-input-block">
            <div class="a-button a-button-0" ref="button0">0</div>
            <div class="a-button a-button-1" ref="button1">1</div>
            <div class="a-button a-button-2" ref="button2">2</div>
            <div class="a-button a-button-3" ref="button3">3</div>
            <div class="a-button a-button-4" ref="button4">4</div>
                <input ref="input" class="a-num-input">
            <div class="a-button a-button-5" ref="button5">5</div>
            <div class="a-button a-button-6" ref="button6">6</div>
            <div class="a-button a-button-7" ref="button7">7</div>
            <div class="a-button a-button-8" ref="button8">8</div>
        </div>`)
        this.refs = this.element.children
        this.appendChild(this.element.element)
        if (this.getAttribute("value") == null)
            this.setAttribute("value", 0)
        if (this.getAttribute("step") == null)
            this.step = 1
        else
            this.step = this.getAttribute("step") * 1
        let align = this.getAttribute("align")
        let textIndent = 0
        if (align == null || align == "left") {
            align = "left"
            textIndent = 10
        }
        if (this.getAttribute("width") != null) {
            this.element.element.style.width = this.getAttribute("width")
        }
        this.refs.input.style.textAlign = align
        this.refs.input.style.textIndent = textIndent + "px"
        if (this.getAttribute("max") != null)
            this.max = this.getAttribute("max") * 1
        if (this.getAttribute("min") != null)
            this.min = this.getAttribute("min") * 1
        if (this.getAttribute("disabled") == "" || this.getAttribute("disabled") == "true") {
            this.disabled = true
        }

        for (let a = 0; a < 9; a++) {
            this.refs['button' + a].style.textAlign = align
            this.refs['button' + a].style.textIndent = textIndent + "px"
        }
        this.refs.input.value = this.getAttribute("value") * 1
        this.initOptions()
    }

    onchange() {
    }

    set disabled(value) {
        if (value) {
            this.disable = true
            this.refs.input.disabled = true
            this.refs.input.style.color = "#999999"
        } else {
            this.refs.input.disabled = false
            this.refs.input.style.color = "#666666"
            this.disable = false
        }
    }

    get disabled() {
        return this.disable
    }

    get value() {
        return this.refs.input.value * 1
    }

    set value(value) {
        if (isNaN(value)) return
        this.refs.input.value = value * 1
        if (this.min && value < this.min) {
            this.refs.input.value = this.min; // 如果小于最小值，设置为最小值
        }
        if (this.max && value > this.max) {
            this.refs.input.value = this.max; // 如果大于最大值，设置为最大值
        }
        this.initOptions()
    }

    initOptions() {
        for (let a = 0; a < 9; a++) {
            this.refs['button' + a].innerText = this.refs.input.value * 1 + (4 - a) * this.step
            this.refs['button' + a].setAttribute("nowindex", a)
        }
    }

    initFunctions() {
        this.refs.input.addEventListener("wheel", (e) => {
            if (this.isfocus) {
                if (e.deltaY > 0) {
                    if (this.min != null && this.refs.input.value * 1 - this.step * 1 < this.min)
                        return
                    this.refs.input.value = this.refs.input.value * 1 - this.step * 1
                    for (let a = 0; a < 9; a++) {
                        let index = this.refs['button' + a].getAttribute("nowindex") * 1
                        this.refs['button' + a].classList.remove("a-button-" + index)
                        this.refs['button' + a].classList.add("a-button-" + (index - 1 < 0 ? 8 : index - 1))
                        this.refs['button' + a].setAttribute("nowindex", (index - 1 < 0 ? 8 : index - 1))
                        index = this.refs['button' + a].getAttribute("nowindex") * 1
                        this.refs['button' + a].innerText = this.refs.input.value * 1 + (4 - index) * this
                            .step
                    }
                } else if (e.deltaY < 0) {
                    if (this.max != null && this.refs.input.value * 1 + this.step * 1 > this.max)
                        return
                    this.refs.input.value = this.refs.input.value * 1 + this.step * 1
                    for (let a = 0; a < 9; a++) {
                        let index = this.refs['button' + a].getAttribute("nowindex") * 1
                        this.refs['button' + a].classList.remove("a-button-" + index)
                        this.refs['button' + a].classList.add("a-button-" + (index + 1 == 9 ? 0 : index +
                            1))
                        this.refs['button' + a].setAttribute("nowindex", (index + 1 == 9 ? 0 : index + 1))
                        index = this.refs['button' + a].getAttribute("nowindex") * 1
                        this.refs['button' + a].innerText = this.refs.input.value * 1 + (4 - index) * this
                            .step
                    }
                }
                e.preventDefault();
            }
        })

        this.refs.input.addEventListener("keydown", (e) => {
            let code = e.keyCode * 1;
            if (!(code == 39 || code == 37 || code == 8 || (code == 110 || (code >= 96 && code <= 105)) || (
                code == 190 || (code >= 48 && code <= 57))))
                e.preventDefault();

        });

        this.refs.input.addEventListener("keyup", (e) => {
            this.initOptions()
        })

        this.refs.input.addEventListener("input", (e) => {
            const inputValue = parseFloat(this.refs.input.value);
            if (this.min && inputValue < this.min) {
                this.refs.input.value = this.min; // 如果小于最小值，设置为最小值
            }
            if (this.max && inputValue > this.max) {
                this.refs.input.value = this.max; // 如果大于最大值，设置为最大值
            }
        });

        this.refs.input.addEventListener("focus", () => {
            for (let a = 0; a < 9; a++) {
                this.refs['button' + a].style.width = this.refs.input.clientWidth + "px"
                this.refs['button' + a].classList.add("a-button-show")
            }
            this.isfocus = true
        })

        this.refs.input.addEventListener("blur", () => {
            for (let a = 0; a < 9; a++)
                this.refs['button' + a].classList.remove("a-button-show")
            this.isfocus = false
            this.onchange(this.value)
        })
    }
}

// 文本输入框
class InputText extends HTMLElement {
    constructor() {
        super()
        this.refs
        this.limit
        this.ready = false
    }

    connectedCallback() {
        if (this.ready) return
        this.initElements()
        this.initFunctions()
        this.ready = true
    }

    initElements() {
        this.element = dp(`<div class="a-text-input-block">
            <textarea class="a-text-input a-scroll" ref="input"></textarea>
            <div class="a-text-limit-word" ref="limit"></div>
        </div>`)
        this.refs = this.element.children
        this.limit = toNum(this.getAttribute("limit"))

        if (!this.limit)
            this.refs.input.value = this.getAttribute("value") != null ? this.getAttribute("value").substring(0,
                this.limit) : ""
        else
            this.refs.input.value = this.getAttribute("value")

        if (this.getAttribute("height") != null && this.getAttribute("height") != "auto") this.refs.input.style
            .height = "calc(" + this.getAttribute("height") + " - 40px)"
        if (this.getAttribute("placeholder") != null) this.refs.input.placeholder = this.getAttribute("placeholder")
        if (this.getAttribute("width") != null) this.element.element.style.width = this.getAttribute("width")
        if (this.getAttribute("align") != null) this.element.children.input.style.textAlign = this.getAttribute(
            "align")
        if (this.getAttribute("height") == "auto") this.refs.input.style.overflow = "hidden"
        if (this.getAttribute("disabled") == "" || this.getAttribute("disabled") == "true") this.disabled = true

        this.appendChild(this.element.element)
        this.showLimit()
        this.fixHeight()

    }

    set limit(value) {
        this.limitTemp = value
        if (this.limitTemp == false)
            this.refs.limit.style.display = "none"
        else {
            this.refs.limit.style.display = "block"
            this.showLimit()
        }
    }

    get limit() {
        return this.limitTemp
    }

    set disabled(value) {
        if (value) {
            this.disable = true
            this.refs.input.disabled = true
            this.refs.input.style.color = "#999999"
        } else {
            this.refs.input.disabled = false
            this.refs.input.style.color = "#666666"
            this.disable = false
        }
    }

    get disabled() {
        return this.disable
    }

    set value(value) {
        this.refs.input.value = value
        this.showLimit()
        this.fixHeight()
    }

    get value() {
        return this.refs.input.value
    }

    showLimit() {
        if (!this.limit) return
        this.refs.limit.innerText = this.refs.input.value.length + "/" + this.limit
        this.refs.input.style.width = "calc(100% - " + (this.refs.limit.clientWidth * 1 + 21) + "px)"
        if (this.value.length > this.limit) {
            this.value = this.value.substring(0, this.limit)
        }
    }

    //调整高度
    fixHeight() {
        if (this.getAttribute("height") == "auto") {
            this.refs.input.style.height = "auto"
            this.refs.input.scrollTop = 0
            this.refs.input.style.height = this.refs.input.scrollHeight - 40 + "px"
        }
    }

    initFunctions() {
        this.refs.input.addEventListener("keydown", (e) => {
            if (typeof this.limit == "number" && this.getAttribute("limit") != null) {
                this.showLimit()
                this.fixHeight()
                if (e.keyCode != 39 && e.keyCode != 37 && this.refs.input.value.length >= this.limit && e
                    .keyCode != 8)
                    e.preventDefault();
            }
        })
        this.refs.input.addEventListener("keyup", (e) => {
            if (typeof this.limit == "number" && this.getAttribute("limit") != null) {
                this.showLimit()
                this.fixHeight()
            }

        })
    }
}


class InputRadioItem extends HTMLElement {
    constructor() {
        super()
        this.check
        this.disable
        this.ready = false
    }

    connectedCallback() {
        if (this.ready) return
        this.initElement()
        this.initFunctions()
        this.ready = true
    }

    initElement() {
        this.element = dp(`<div class="a-raido-block">
        <div class="a-radio-label" ref="label"></div>
        <div>
            <input ref="input" type="radio" class="radio" >
        </div>
    </div>`)
        this.radioName = this.getAttribute("name")
        this.refs = this.element.children
        this.refs.label.innerText = this.getAttribute("label")
        this.appendChild(this.element.element)
        if (this.getAttribute("checked") == "" || this.getAttribute("checked") == "true") {
            this.checked = true
        }
        if (this.getAttribute("disabled") == "" || this.getAttribute("disabled") == "true") {
            this.disabled = true
        }
    }


    initFunctions() {
        this.refs.label.onclick = () => {
            if (this.disable) return
            this.refs.input.checked = true
        }
    }

    set disabled(value) {
        this.disable = value
        this.refs.input.disabled = value
        if (value) {
            this.refs.label.classList.add("disabled")
        } else {
            this.refs.label.classList.remove("disabled")
        }
    }

    get disabled() {
        return this.disable
    }

    set checked(value) {
        this.check = value
        this.refs.input.checked = value
        if (value) {
            this.refs.label.classList.add("checked")
        } else {
            this.refs.label.classList.remove("checked")
        }
    }

    get checked() {
        return this.check
    }

    set name(value) {
        this.refs.input.name = value
        this.setAttribute("name", value)
    }

    get name() {
        return this.getAttribute("name")
    }
}

class InputRadio extends HTMLElement {
    constructor() {
        super()
        this.disable
        this.radioMap = new Map()
        this.ready = false

    }

    connectedCallback() {
        if (this.ready) return
        this.initElement()
        this.ready = true
    }

    initElement() {
        Array.from(this.getElementsByTagName("A-RADIO")).forEach(item => {
            this.radioMap.set(item.radioName, item)
            item.name = this.getAttribute("name")
            item.onclick = () => {
                if (item.disabled) return
                this.checkRadios(item)
            }
        })

        if (this.getAttribute("disabled") == "" || this.getAttribute("disabled") == "true") {
            this.disabled = true
        }
    }

    set name(value) {
        Array.from(this.getElementsByTagName("A-RADIO")).forEach(item => {
            item.name = value
        })
    }

    //供外部复写
    onchange(e) {
    }

    checkRadios(item) {
        item.checked = true
        Array.from(this.getElementsByTagName("a-radio")).forEach(radio => {
            if (item != radio) {
                radio.checked = false
            }
        })
        this.onchange(this.value)
    }

    get value() {
        let value = {}
        Array.from(this.getElementsByTagName("a-radio")).forEach(radio => {
            value[radio.radioName] = radio.checked
        })
        return value
    }

    set value(value) {
        for (var key in value) {
            this.radioMap.get(key).checked = value[key]
        }
    }

    set disabled(value) {
        this.disable = value
        Array.from(this.getElementsByTagName("a-radio")).forEach(item => {
            item.disabled = value
        })
    }

    get disabled() {
        return this.disable
    }
}

class InputDateTime extends HTMLElement {
    constructor() {
        super()
        this.element
        this.refs
        this.showWindow = false
        this.tempCurrentDate
        this.currentDate = new Date();
        this.onDateCell = null
        this.ready = false
        this.ready = false
    }

    connectedCallback() {
        if (this.ready) return
        this.initElement()
        this.initFunctions()
        this.ready = true
    }

    initElement() {
        this.element = dp(`<div class="datePicker">
                                <div ref="input" class="input">
                                    <input class="inputText" ref="inputText">
                                    <i ref="arrow" class="icon-arrow-up-s-fill"></i>
                                </div>
                                <div class="floatWindow" ref="window">
                                    <div style="display:flex;">
                                        <div class="calendar">
                                            <div class="header">
                                                <button ref="prev">&lt;</button>
                                                <button ref="prevYear">&lt;&lt;</button>
                                                <div ref="monthYear" style="width:100px;"></div>
                                                <button ref="nextYear">&gt;&gt;</button>
                                                <button ref="next">&gt;</button>
                                            </div>
                                            <div class="days">
                                                <div class="day">日</div>
                                                <div class="day">一</div>
                                                <div class="day">二</div>
                                                <div class="day">三</div>
                                                <div class="day">四</div>
                                                <div class="day">五</div>
                                                <div class="day">六</div>
                                            </div>
                                            <div ref="dates" class="dates"></div>
                                        </div>
                                        <div class="timePicker">
                                            <div class="times">
                                                <div>hour</div>
                                                <div>min</div>
                                                <div>sec</div>
                                            </div>
                                            <div class="timesRoll">
                                                <div class="roll">
                                                    <button ref="hourUp"><i class="icon-arrow-up-s-fill"></i> </button>
                                                    <div class="timeRoll">
                                                        <div ref="hour1">1</div>
                                                        <div ref="hour">2</div>
                                                        <div ref="hour2">3</div>
                                                    </div>
                                                    <button ref="hourDown"><i class="icon-arrow-down-s-fill"></i> </button>
                                                </div>
                                                <div class="roll">
                                                    <button ref="minUp"><i class="icon-arrow-up-s-fill"></i> </button>
                                                    <div class="timeRoll">
                                                        <div ref="min1">1</div>
                                                        <div ref="min">2</div>
                                                        <div ref="min2">3</div>
                                                    </div>
                                                    <button ref="minDown"><i class="icon-arrow-down-s-fill"></i></button>
                                                </div>
                                                <div class="roll">
                                                    <button ref="secUp"><i class="icon-arrow-up-s-fill"></i> </button>
                                                    <div class="timeRoll">
                                                        <div ref="sec1">1</div>
                                                        <div ref="sec">2</div>
                                                        <div ref="sec2">3</div>
                                                    </div>
                                                    <button ref="secDown"<i class="icon-arrow-down-s-fill"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="display:flex; border-top: 1px solid #f3f3f3;margin-top:5px;">
                                        <div style="flex:1;"></div>
                                        <button ref="sureButton" class="sureButton">确定</button>    
                                    </div>
                                </div>
                            </div>`)
        this.refs = this.element.children
        if (this.getAttribute("disabled") != null && this.getAttribute("disabled") == "true")
            this.disabled = true
        if (this.getAttribute("placeholder") != null) this.refs.inputText.placeholder = this.getAttribute(
            "placeholder")
        this.appendChild(this.element.element)

    }

    initFunctions() {
        //展示选项窗口
        this.refs.input.onmousedown = (e) => {
            if (this.disable) return
            if (!this.showWindow) document.dispatchEvent(new Event('mousedown'))
            e.cancelBubble = true
            if (this.showWindow) {
                this.foldWindow()
            } else {
                this.openWindow()
            }
        }

        document.addEventListener("mousedown", () => {
            if (this.showWindow) this.foldWindow()
        })

        this.refs.window.addEventListener("mousedown", (e) => {
            e.cancelBubble = true
        })

        this.refs.prev.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        this.refs.next.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        this.refs.prevYear.addEventListener('click', () => {
            this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
            this.renderCalendar();
        });

        this.refs.nextYear.addEventListener('click', () => {
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
            this.renderCalendar();
        });

        this.refs.hourUp.addEventListener('click', () => {
            this.currentDate.setHours(this.currentDate.getHours() + 1);
            this.renderCalendar();
        });
        this.refs.hourDown.addEventListener('click', () => {
            this.currentDate.setHours(this.currentDate.getHours() - 1);
            this.renderCalendar();
        });

        this.refs.minUp.addEventListener('click', () => {
            this.currentDate.setMinutes(this.currentDate.getMinutes() + 1);
            this.renderCalendar();
        });
        this.refs.minDown.addEventListener('click', () => {
            this.currentDate.setMinutes(this.currentDate.getMinutes() - 1);
            this.renderCalendar();
        });
        this.refs.secUp.addEventListener('click', () => {
            this.currentDate.setSeconds(this.currentDate.getSeconds() + 1);
            this.renderCalendar();
        });
        this.refs.secDown.addEventListener('click', () => {
            this.currentDate.setSeconds(this.currentDate.getSeconds() - 1);
            this.renderCalendar();
        });
        this.refs.sureButton.addEventListener('click', () => {
            this.tempCurrentDate = new Date(this.currentDate)
            this.refs.inputText.value = this.value
            this.renderCalendar();
            this.foldWindow()
        });
    }

    //设置disabled
    set disabled(value) {
        this.disable = value
        if (this.disable) {
            this.refs.input.style.color = "#cccccc"
            this.refs.arrow.style.color = "#cccccc"
        } else {
            this.refs.arrow.style.color = "#666666"
            this.refs.input.style.color = "#666666"
        }
    }

    openWindow() {
        this.refs.window.classList.add("a-slide-in")
        this.refs.arrow.classList.remove("icon-arrow-up-s-fill")
        this.refs.arrow.classList.add("icon-arrow-down-s-fill")
        this.showWindow = true
        this.refs.window.style.display = "flex"
        //window状态的选项窗口默认宽度为515px
        //自动根据窗口大小适应显示位置
        if (this.ifWindow) {
            if (window.innerWidth < 515) this.refs.window.style.minWidth = window.innerWidth - 45 + "px"
            else this.refs.window.style.minWidth = "515px"
            let left = ((this.element.element.offsetLeft + this.refs.window.clientWidth) - window.innerWidth)
            this.refs.window.style.marginLeft = (left > 0 ? (-1 * left - 15) : 0) + "px"
        }
        this.tempValue = JSON.stringify(this.value)
        this.renderCalendar()
    }

    foldWindow() {
        this.refs.arrow.classList.add("icon-arrow-up-s-fill")
        this.refs.arrow.classList.remove("icon-arrow-down-s-fill")
        this.showWindow = false
        this.refs.window.style.display = "none"
    }

    renderCalendar() {
        let year = this.currentDate.getFullYear();
        let month = this.currentDate.getMonth();

        this.refs.monthYear.innerHTML = `${year}年 ${month + 1}月`;

        this.refs.dates.innerHTML = '';
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('date');
            this.refs.dates.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateCell = document.createElement('div')
            dateCell.classList.add('date')
            dateCell.innerText = day
            this.refs.dates.appendChild(dateCell)
            if (day == this.currentDate.getDate()) {
                dateCell.style.backgroundColor = " #f3f3f3"
            }
            dateCell.onclick = () => {
                this.currentDate.setDate(day)
                if (this.onDateCell == null) {
                    this.onDateCell = dateCell
                }
                this.onDateCell.style.backgroundColor = " #fff"
                this.onDateCell = dateCell
                this.onDateCell.style.backgroundColor = " #f3f3f3"
                this.currentDate.setDate(day)
                this.renderCalendar()
            }
        }
        let hour = this.currentDate.getHours()
        let min = this.currentDate.getMinutes()
        let sec = this.currentDate.getSeconds()
        this.refs.hour.innerText = hour
        this.refs.hour1.innerText = (hour + 1) == 24 ? 0 : hour + 1
        this.refs.hour2.innerText = (hour - 1) == -1 ? 23 : hour - 1
        this.refs.min.innerText = this.currentDate.getMinutes()
        this.refs.min1.innerText = (min + 1) == 61 ? 1 : min + 1
        this.refs.min2.innerText = (min - 1) == -1 ? 60 : min - 1
        this.refs.sec.innerText = this.currentDate.getSeconds()
        this.refs.sec1.innerText = (sec + 1) == 61 ? 1 : sec + 1
        this.refs.sec2.innerText = (sec - 1) == -1 ? 60 : sec - 1
        this.refs.inputText.value = this.value
    }

    get value() {
        if (this.tempCurrentDate == null)
            return null
        else {
            let year = this.tempCurrentDate.getFullYear()
            let month = (this.tempCurrentDate.getMonth() > 8 ? "" : "0") + (this.tempCurrentDate.getMonth() + 1)
            let day = (this.tempCurrentDate.getDate() > 9 ? "" : "0") + this.tempCurrentDate.getDate()
            let hour = (this.tempCurrentDate.getHours() > 9 ? "" : "0") + this.tempCurrentDate.getHours()
            let min = (this.tempCurrentDate.getMinutes() > 9 ? "" : "0") + this.tempCurrentDate.getMinutes()
            let sec = (this.tempCurrentDate.getSeconds() > 9 ? "" : "0") + this.tempCurrentDate.getSeconds()
            return `${year}-${month}-${day} ${hour}:${min}:${sec}`
        }
    }

    set value(value) {
        if (value != null && value != "") {
            this.tempCurrentDate = new Date(value)
            this.currentDate = new Date(value)
        } else {
            this.tempCurrentDate = new Date()
            this.currentDate = new Date()
        }
        this.renderCalendar()
    }

    get year() {
        return this.tempCurrentDate.getFullYear()
    }

    set year(value) {
        this.tempCurrentDate.setFullYear(value)
        this.renderCalendar()
    }

    get month() {
        return this.tempCurrentDate.getMonth()
    }

    set month(value) {
        this.tempCurrentDate.setMonth(value)
        this.renderCalendar()
    }

    get day() {
        return this.tempCurrentDate.getDate()
    }

    set day(value) {
        this.tempCurrentDate.setDate(value)
        this.renderCalendar()
    }

    get hour() {
        return this.tempCurrentDate.getHours()
    }

    set hour(value) {
        this.tempCurrentDate.setHours(value)
        this.renderCalendar()
    }

    get minute() {
        return this.tempCurrentDate.getMinutes()
    }

    set minute(value) {
        this.tempCurrentDate.setMinutes(value)
        this.renderCalendar()
    }

    get second() {
        return this.tempCurrentDate.getSeconds()
    }

    set second(value) {
        this.tempCurrentDate.setSeconds(value)
        this.renderCalendar()
    }
}

class InputSwitch extends HTMLElement {
    constructor() {
        super()
        this.dot
        this.valueTem
        this.disable
    }

    connectedCallback() {
        this.element = dp(`<div class="checkBlock">
                <div class="inDot" ref="dot"></div>
            </div>`)
        this.label = dc("div", "switchLabel")
        this.refs = this.element.children
        if (this.getAttribute("labelLeft") != null) {
            this.appendChild(this.label)
            this.appendChild(this.element.element)
        } else {
            this.appendChild(this.element.element)
            this.appendChild(this.label)
        }
        this.refs.dot.classList.add("inDot")
        if (this.getAttribute("value") == "false") {
            this.value = false
        } else {
            this.value = true
        }
        if (this.getAttribute("disabled") == "false") {
            this.disabled = false
        } else if (this.getAttribute("disabled") == "true") {
            this.disabled = true
        }
        this.onclick = () => {
            if (this.disabled) return
            this.value = !this.value
        }
    }

    set disabled(value) {

        this.disable = value
        if (value) {
            this.refs.dot.classList.add("disabled")
        } else {
            this.refs.dot.classList.remove("disabled")
        }
    }

    get disabled() {
        return this.disable
    }

    set value(value) {
        this.valueTem = value
        if (value) {
            this.label.innerText = this.getAttribute("true")
            this.refs.dot.style.marginLeft = "20px"
            this.refs.dot.classList.add("dotSelected")
            this.element.element.style.backgroundColor = "#79b5f1"
        } else {
            this.label.innerText = this.getAttribute("false")
            this.refs.dot.style.marginLeft = "1px"
            this.refs.dot.classList.remove("dotSelected")
            this.element.element.style.backgroundColor = "#f3f3f3"
        }
        this.onchange()
    }

    get value() {
        return this.valueTem
    }

    onchange() {
    }
}

class InputIp4 extends HTMLElement {
    constructor() {
        super()
        this.isFocus = false
    }

    connectedCallback() {
        this.initElement()
    }

    initElement() {
        this.element = dp(`<div class="a-input-ip4-block">
                <input type="text" ref='input'>
                <div class="warn" ref='warn'>请输入正确IP</div>
            </div>`)
        this.refs = this.element.children
        this.element = this.element.element
        this.appendChild(this.element)
        if (this.getAttribute("placeholder")) this.refs.input.placeholder = this.getAttribute("placeholder")
        this.refs.input.addEventListener("blur", () => {
            if (this.refs.input.value != "" && !this.isValidIPv4(this.refs.input.value)) {
                this.refs.warn.classList.add("show")
            } else {
                this.refs.warn.classList.remove("show")
            }
        })

    }

    isValidIPv4(ip) {
        // 正则表达式，用于匹配IPv4地址
        var ipv4Pattern =
            /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
        // 测试IP地址是否匹配正则表达式
        return ipv4Pattern.test(ip);
    }
}


class InputIp6 extends HTMLElement {
    constructor() {
        super()
        this.isFocus = false
    }

    connectedCallback() {
        this.initElement()
    }

    initElement() {
        this.element = dp(`<div class="a-input-ip4-block">
                <input type="text" ref='input'>
                <div class="warn" ref='warn'>请输入正确ipv6地址</div>
            </div>`)
        this.refs = this.element.children
        this.element = this.element.element
        this.appendChild(this.element)
        if (this.getAttribute("placeholder")) this.refs.input.placeholder = this.getAttribute("placeholder")
        this.refs.input.addEventListener("blur", () => {
            if (this.refs.input.value != "" && !this.isValidIPv6(this.refs.input.value)) {
                this.refs.warn.classList.add("show")
            } else {
                this.refs.warn.classList.remove("show")
            }
        })

    }

    isValidIPv6(ip) {
        // 正则表达式，用于匹配IPv6地址
        var ipv6Pattern =
            /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|(([0-9a-fA-F]{1,4}:){1,7}|:):([0-9a-fA-F]{1,4}:){1,6}|:|(([0-9a-fA-F]{1,4}:){1,6}|:):([0-9a-fA-F]{1,4}:){1,5}|:|(([0-9a-fA-F]{1,4}:){1,5}|:):([0-9a-fA-F]{1,4}:){1,4}|:|(([0-9a-fA-F]{1,4}:){1,4}|:):([0-9a-fA-F]{1,4}:){1,3}|:|(([0-9a-fA-F]{1,4}:){1,3}|:):([0-9a-fA-F]{1,4}:){1,2}|:|(([0-9a-fA-F]{1,4}:){1,2}|:):[0-9a-fA-F]{1,4}|:|(([0-9a-fA-F]{1,4}:){1,7}|:):)$/;
        // 测试IP地址是否匹配正则表达式
        return ipv6Pattern.test(ip);
    }
}


class InputPort extends HTMLElement {
    static portInfo = [{
        "port": 20,
        "service": "FTP",
        "description": "文件传输协议（数据传输）"
    },
    {
        "port": 21,
        "service": "FTP",
        "description": "文件传输协议（控制）"
    },
    {
        "port": 22,
        "service": "SSH",
        "description": "安全外壳协议，用于安全登录和命令执行"
    },
    {
        "port": 23,
        "service": "Telnet",
        "description": "不加密的文本通信协议，常用于远程登录"
    },
    {
        "port": 25,
        "service": "SMTP",
        "description": "简单邮件传输协议，用于电子邮件的发送"
    },
    {
        "port": 53,
        "service": "DNS",
        "description": "域名系统，用于域名解析"
    },
    {
        "port": 80,
        "service": "HTTP",
        "description": "超文本传输协议，用于网页传输"
    },
    {
        "port": 110,
        "service": "POP3",
        "description": "邮局协议版本3，用于电子邮件接收"
    },
    {
        "port": 143,
        "service": "IMAP",
        "description": "互联网消息访问协议，用于电子邮件接收和管理"
    },
    {
        "port": 443,
        "service": "HTTPS",
        "description": "安全超文本传输协议，用于加密的网页传输"
    },
    {
        "port": 3306,
        "service": "MySQL",
        "description": "MySQL数据库服务默认端口"
    },
    {
        "port": 3389,
        "service": "RDP",
        "description": "远程桌面协议，用于远程桌面连接"
    },
    {
        "port": 5432,
        "service": "PostgreSQL",
        "description": "PostgreSQL数据库服务默认端口"
    },
    {
        "port": 6379,
        "service": "Redis",
        "description": "Redis数据库服务默认端口"
    },
    {
        "port": 8080,
        "service": "HTTP",
        "description": "通常用于测试和开发环境的HTTP端口"
    }
    ]

    constructor() {
        super()
        this.isFocus = false
    }

    connectedCallback() {
        this.initElement()
    }

    initElement() {
        this.element = dp(`<div class="a-input-ip4-block">
                <input type="text" ref='input'>
                <div class="warn" ref='warn'>请输入正确的端口范围</div>
                <div class="suggestionBlock scroll" ref="portSuggestion">
                    
                </div>
            </div>`)
        this.refs = this.element.children
        this.element = this.element.element
        this.appendChild(this.element)
        if (this.getAttribute("placeholder")) this.refs.input.placeholder = this.getAttribute("placeholder")
        this.refs.input.addEventListener("blur", () => {
            this.refs.portSuggestion.classList.remove("showSuggestion")
            if (this.refs.input.value != "" && this.refs.input.value * 1 < 0 || this.refs.input.value * 1 >
                65535 || !Number.isInteger(this.refs.input.value * 1)) {
                this.refs.warn.classList.add("show")
            } else {
                this.refs.warn.classList.remove("show")
            }
        })
        this.refs.input.addEventListener("focus", () => {
            this.refs.portSuggestion.classList.add("showSuggestion")
        })

        InputPort.portInfo.forEach(item => {
            let ele = dp(`<div class="suggestion">
                        <div class="port">${item.port}</div>
                        <div class="description">${item.description}</div>
                    </div>`)
            this.refs.portSuggestion.appendChild(ele.element)
            ele.element.onmousedown = () => {
                this.refs.input.value = item.port
            }
        })

    }
}


class InputMac extends HTMLElement {
    constructor() {
        super()
        this.isFocus = false
    }

    connectedCallback() {
        this.initElement()
    }

    initElement() {
        this.element = dp(`<div class="a-input-ip4-block">
                <input type="text" ref='input'>
                <div class="warn" ref='warn'>请输入正确Mac地址</div>
            </div>`)
        this.refs = this.element.children
        this.element = this.element.element
        this.appendChild(this.element)
        if (this.getAttribute("placeholder")) this.refs.input.placeholder = this.getAttribute("placeholder")
        this.refs.input.addEventListener("blur", () => {
            if (this.refs.input.value != "" && !this.isValidMACAddress(this.refs.input.value)) {
                this.refs.warn.classList.add("show")
            } else {
                this.refs.warn.classList.remove("show")
            }
        })

    }

    isValidMACAddress(mac) {
        // 正则表达式，用于匹配MAC地址
        var macPattern = /^([0-9A-Fa-f]{2}([-:])){5}([0-9A-Fa-f]{2})$/;
        // 测试MAC地址是否匹配正则表达式
        return macPattern.test(mac);
    }
}


//############################################################
//###############   FinalComponent-MenuEngine   ##############
//############################################################

// 菜单页面，作为菜单的子类加载，定义的优先级必须保持再 Menu之上
class MenuPage extends HTMLElement {
    constructor() {
        super()
        this.menuButton = null
        this.parent = null
        this.loadIframe = false
        this.init()
    }

    init() {
        this.style.display = "none"
        this.initMenuButtonElement()
    }

    get name() {
        return this.getAttribute("name")
    }

    initMenuButtonElement() {
        this.menuButton = dp(`<div class="a-menu-page-content">
		<i class="" ref="icon"></i>
		<div class="a-content-name" ref="label"></div>
		</div>`)
        this.menuButton.children.label.innerText = this.getAttribute("label")
        this.menuButton.children.icon.classList.add(this.getAttribute("icon"))
        this.menuButton.element.onclick = () => this.parent.selectPage(this)
    }

    initFrame() {
        if (this.loadIframe) return
        this.innerHTML = ""
        let itemFrame = dc("iframe")
        itemFrame.src = this.getAttribute("src")
        itemFrame.classList.add("a-menu-iframe")
        itemFrame.style.opacity = "0"
        itemFrame.style.transition = "opacity 0.3s"
        let loadingAnimation = dc("div", ["a-menu-iframe", "a-loading-animation"])
        this.appendChild(loadingAnimation)
        this.appendChild(itemFrame)
        itemFrame.onload = () => {
            if (loadingAnimation.parentNode == this)
                this.removeChild(loadingAnimation)
            itemFrame.style.opacity = "1"
        }
        this["iframe"] = itemFrame
        if (this.getAttribute("height") != null) {
            this.style.height = "calc(" + this.getAttribute("height") + " - 4px)"
        }
        this.loadIframe = true
    }
}


class Menu extends HTMLElement {
    constructor() {
        super()
        this.menuPageList = []
        this.menuGroupMap = new Map()
        this.pageMap = new Map()
        this.nowPage = null
        this.isFold = false
        this.init()
    }

    init() {
        this.initPages() //初始化页面
        this.initBaseElement()
        this.drawMenu()
    }

    set onpage(value) {
        this.selectPage(this.pageMap.get(value))
        this.setAttribute("onpage", value)
    }

    selectPage(page, remember) {
        if (page == null) return
        if (this.getAttribute("lazy") != null && page.getAttribute("src") != null) page.initFrame()
        if (this.getAttribute("remember") != null && remember != false) {
            let storage = this.id == null ? this.getAttribute("name") : this.id
            localStorage.setItem("MenuRememberPageName_" + storage, page.name)
        }
        if (this.nowPage == null) {
            page.style.display = "block"
            this.nowPage = page
        } else {
            this.nowPage.menuButton.element.classList.remove("a-menu-select")
            // this.nowPage.menuButton.element.childNodes[1].style.color = "#666666"
            this.nowPage.style.display = "none"
            page.style.display = "block"
            this.nowPage = page
        }
        page.menuButton.element.classList.add("a-menu-select")
        // page.menuButton.element.childNodes[1].style.color = "#6eb6ff"
        if (page.getAttribute("src") != null && page.getAttribute("height") == null)
            page["iframe"].style.height = (this.element.element.clientHeight * 1 - 4) + "px"
        if (typeof page.onselect == "function") page.onselect()
    }

    //添加页面
    push(menu) {
        if (Array.isArray(menu)) {
            menu.forEach(item => {
                this.createMenu(item)
            })
        } else {
            this.createMenu(menu)
        }
        let storage = this.id == null || this.id == "" ? this.getAttribute("name") : this.id
        this.selectPage(this.pageMap.get(localStorage.getItem("MenuRememberPageName_" + storage)))
    }

    createMenu(menu) {
        //菜单没有name
        if (menu.name == null || menu.name == "") {
            menu["name"] = "MenuPage_" + this.pageMap.length
        }
        //初始化页面
        let page = dp(`<a-menu-page group="${menu.group}" src="${menu.src}" name="${menu.name}" label="${menu.label}" icon="${menu.icon}" groupIcon="${menu.groupIcon}"></a-menu-page>`)
        page = page.element
        page.onselect = menu.onselect
        this.element.children.pageContent.appendChild(page)
        this.pageMap.set(menu.name, page)

        page.parent = this
        //没有group
        if (page.getAttribute("group") == null) {
            this.element.children.menuContent.appendChild(page.menuButton.element)
        } else {
            //当group存在
            if (this.menuGroupMap.has(page.getAttribute("group"))) {
                this.appendMenuGroup(this.menuGroupMap.get(page.getAttribute("group")))
                this.menuGroupMap.get(page.getAttribute("group")).element.children.children.appendChild(page
                    .menuButton.element)
                this.menuGroupMap.get(page.getAttribute("group")).element.children.children.style.height = this.menuGroupMap.get(page.getAttribute("group")).element.children.children.children.length * 40 + "px"
            }
            else {
                let menuGroup = {
                    label: page.getAttribute("group"),
                    icon: page.getAttribute("groupIcon"),
                    children: [],
                    draw: false
                }
                this.menuGroupMap.set(page.getAttribute("group"), menuGroup)
                this.appendMenuGroup(menuGroup)
                this.menuGroupMap.get(page.getAttribute("group")).element.children.children.appendChild(page
                    .menuButton.element)
                this.menuGroupMap.get(page.getAttribute("group")).element.children.children.style.height = this.menuGroupMap.get(page.getAttribute("group")).element.children.children.children.length * 40 + "px"
            }
        }
        if (this.nowPage == null) {
            this.selectPage(page, false)
        }
    }
    drawMenu() {
        this.menuPageList.forEach(item => {
            item.parent = this
            if (item.getAttribute("group") == null)
                this.element.children.menuContent.appendChild(item.menuButton.element)
            else {
                this.appendMenuGroup(this.menuGroupMap.get(item.getAttribute("group")))
                this.menuGroupMap.get(item.getAttribute("group")).element.children.children.appendChild(item
                    .menuButton.element)
            }
        });
        Array.from(this.menuGroupMap).forEach(item => {
            item = item[1]
            item.element.children.children.style.height = item.element.children.children.children.length * 40 + "px"
        })

        let storage = this.id == null || this.id == "" ? this.getAttribute("name") : this.id

        for (var a = this.menuPageList.length - 1; a >= 0; a--)
            this.element.children.pageContent.appendChild(this.menuPageList[a])

        if (this.getAttribute("onpage") != null)
            this.selectPage(this.pageMap.get(this.getAttribute("onpage")))
        else if (this.getAttribute("remember") == null)
            this.selectPage(Array.from(this.pageMap)[0][1])
        else if (this.getAttribute("remember") != null && this.pageMap.get(localStorage.getItem("MenuRememberPageName_" + storage)) != null)
            this.selectPage(this.pageMap.get(localStorage.getItem("MenuRememberPageName_" + storage)))
        else {
            if (Array.from(this.pageMap)[0] != null)
                this.selectPage(Array.from(this.pageMap)[0][1])
        }


        if (this.getAttribute("foldable") != null) {
            this.refs.title.style.cursor = "pointer"
            this.refs.title.classList.add("a-menu-title-hover")
            this.refs.floatArrow.style.display = "block"
            this.refs.title.onclick = () => {
                if (this.isFold) this.openMenu()
                else this.foldMenu()
            }
            if (this.getAttribute("fold") != null) this.fold = this.getAttribute("fold") == "true" ? true : this.getAttribute("fold") == false ? false : ""
        }
    }

    initPages() {
        //页面记忆验证
        if (this.getAttribute("remember") != null) {
            if (this.id == null || this.id == "" && this.getAttribute("name") == null) {
                console.error("MenuEngine Component:to rememberPage Menu must has name or id")
                this.setAttribute("remember", null)
            }
        }
        Array.from(this.children).forEach((page, index) => {
            if (page.getAttribute("name") == null)
                page.setAttribute("name", "MenuPage_" + index)
            this.menuPageList.push(page)
            this.pageMap.set(page.getAttribute("name"), page)
            let group = page.getAttribute("group")
            let groupIcon = page.getAttribute("groupicon")
            if (group != null && !this.menuGroupMap.has(group)) {
                let menuGroup = {
                    label: group,
                    icon: groupIcon,
                    children: [],
                    draw: false
                }
                this.menuGroupMap.set(group, menuGroup)
            }
            if (this.getAttribute("lazy") == null && page.getAttribute("src") != null) page.initFrame()
        });

    }

    appendMenuGroup(groupMenu) {
        if (!groupMenu.draw) {
            groupMenu.draw = true
            groupMenu['element'] = dp(`<div>
			<div class="a-group-title" ref="self">
				<i ref="icon"></i>
				<div class="a-title-name" ref="label"></div>
				<i class="icon-arrow-down-s-fill" ref="arrow"></i>
				</div>
				<div class="a-menu-content scroll" ref="children"></div>
			</div>`)
            groupMenu.element.children.label.innerText = groupMenu.label
            if (groupMenu.icon)
                groupMenu.element.children.icon.classList.add(groupMenu.icon)
            groupMenu.element.children.self.onclick = () => {
                if (groupMenu.element.children.children.style.height == "0px") {
                    groupMenu.element.children.children
                        .style.height = groupMenu.element.children.children.children.length * 40 + "px"
                } else {
                    groupMenu.element.children.children.style.height = "0px"
                }
                groupMenu.element.children.children.style.height == "0px" ? groupMenu.element.children.arrow
                    .classList.add("a-menu-rotate") : groupMenu.element.children.arrow.classList.remove(
                        "a-menu-rotate")
            }
            this.element.children.menuContent.appendChild(groupMenu.element.element)
        }
    }

    initBaseElement() {
        this.element = dp(
            `<div class="a-menu">
				<div class="a-menu-block" ref="menuBlock">
					<div class="a-menu-title" ref="title">
						<div style="flex:1;"></div>
						<div class="a-title-name" ref="titleContent">
						</div>
						<i style="display:none;" class="icon-arrow-left-s-fill" ref="floatArrow"></i>
						<div style="flex:1;"></div>
					</div>
					<div class="a-menu-list-content" ref="menuContent">
					</div>
					<div class="a-menu-list-foot" ref=menuFoot>@先锋软件</div>
				</div>
				<div class="a-menu-page-content-block" ref="pageContent">
				</div>
			</div>`
        )
        this.refs = this.element.children
        this.appendChild(this.element.element)
        if (this.getAttribute("foot") != null) {
            this.element.children.menuFoot.innerText = this.getAttribute("foot")
            this.element.children.menuFoot.style.display = 'block'
        }
        if (this.getAttribute("border") != null) this.element.element.style.border = "1px solid #ececec"
        if (this.getAttribute("height") != null) {
            this.element.element.style.height = this.getAttribute("height")
            this.refs.pageContent.style.overflow = "auto"
            setTimeout(() => {
                this.refs.pageContent.style.overflow = "hidden"
            }, 200);
        }

        if (this.getAttribute("title") == null) this.element.children.title.style.display = "none"
        else {
            this.element.children.titleContent.innerText = this.getAttribute("title")
            this.setAttribute("title", "")
        }
    }

    set fold(value) {
        if (value) this.foldMenu()
        else if (!value) this.openMenu()
    }

    openMenu() {
        this.refs.floatArrow.classList.remove("icon-arrow-right-s-fill")
        this.refs.floatArrow.classList.add("icon-arrow-left-s-fill")
        this.isFold = false
        this.refs.menuBlock.style.width = "200px"
        this.refs.titleContent.style.display = "block"
        Array.from(this.menuGroupMap).forEach(item => {
            item = item[1]
            item.element.children.children.style.marginLeft = "15px"
            item.element.children.arrow.style.display = "block"
        })

        this.refs.menuContent.style.overflow = "hidden"
        setTimeout(() => {
            Array.from(this.menuGroupMap).forEach(item => {
                item = item[1]
                item.element.children.label.style.display = "block"
            })
            Array.from(this.pageMap).forEach(item => {
                item = item[1]
                item.menuButton.children.label.style.display = "block"
            })
            this.refs.menuContent.style.overflow = "auto"
        }, 300);
    }
    foldMenu() {
        this.refs.floatArrow.classList.remove("icon-arrow-left-s-fill")
        this.refs.floatArrow.classList.add("icon-arrow-right-s-fill")
        this.isFold = true
        this.refs.menuBlock.style.width = "57px"
        this.refs.titleContent.style.display = "none"
        Array.from(this.menuGroupMap).forEach(item => {
            item = item[1]
            item.element.children.children.style.marginLeft = 0
            item.element.children.label.style.display = "none"
            item.element.children.arrow.style.display = "none"
        })
        Array.from(this.pageMap).forEach(item => {
            item = item[1]
            item.menuButton.children.label.style.display = "none"
        })
    }
}

//############################################################
//###############   FinalComponent-Pagination   ##############
//############################################################

class Pagination extends HTMLElement {
    constructor() {
        super()
        this.refs
        this.pageTem
        this.limitTem
        this.totalTem
        this.buttonNumTem
    }

    connectedCallback() {
        this.initElement()
        this.initAttubie()
        this.initPageElementData()
        this.initRefsFunction()
    }

    getValue() {
        return {
            total: this.totalTem,
            page: this.pageTem,
            limit: this.limitTem
        }
    }

    initElement() {
        let element = dp(`<div class="a-page-info-block">
			<div class="a-page-button-block">
				<button ref="last">上一页</button>
				<div ref="pageBlock">
				</div>
				<button ref="next">下一页</button>
			</div>
			<div class="a-set-block" ref="setting">
				<a-input-num ref="jumpInput" width="40px" style="margin-right:10px;width:unset;" min="1"></a-input-num>
				<button ref="jumpButton">跳转</button>
				<label>每页展示条数</label>
				<select width="75px" style="margin-right:10px;" ref="limitSelect">
				</select>
				<label ref="totalInfo"></label>
			</div>
		</div>`)
        this.appendChild(element.element)
        this.refs = element.children
        this.refs.jumpInput.value = this.pageTem
        if (this.getAttribute("type") == "mini") {
            this.refs.setting.style.display = "none"
        }
        this.initPageLimitArray()
    }

    initPageLimitArray() {
        let array = this.getAttribute("limitArray")
        if (array == null || array == "") {
            array = [10, 20, 50, 100]
        } else {
            try {
                array = JSON.parse(array)
            } catch (e) {
                array = [10, 20, 50, 100]
            }
        }
        this.limitTem = array.includes(this.limitTem) ? this.limitTem : array[0]
        this.refs.limitSelect.innerHTML = ""
        let options = []
        array.forEach(item => {
            this.refs.limitSelect.add(dc("option").txt(item).val(item))
        })
        this.refs.limitSelect.value = array[0]
    }

    initPageElementData() {
        this.refs.pageBlock.innerHTML = ''
        let pageList = this.generatePaginationIndexes()
        pageList.forEach((page, index) => {
            let button = dc("button")
            button.txt(page)
            if (page == this.pageTem)
                button.classList.add("select")
            this.refs.pageBlock.appendChild(button)
            if (pageList[index + 1] != null && pageList[index + 1] - page > 1) {
                let i = dc("i", "icon-more-fill")
                this.refs.pageBlock.appendChild(i)
            }
            button.onclick = () => {
                this.page = page
                this.refs.jumpInput.value = page
            }
        })
    }

    initRefsFunction() {
        this.refs.last.onclick = () => {
            if (this.pageTem == 1) return
            this.pageTem--
            if (this.pageTem >= 1) {
                this.page = this.pageTem
            }
            this.refs.jumpInput.value = this.pageTem

        }
        this.refs.next.onclick = () => {
            let tempPage = this.pageTem + 1
            var temp = Math.ceil(this.totalTem / this.limitTem)
            this.page = tempPage > temp ? temp : tempPage
            this.refs.jumpInput.value = this.pageTem

        }
        this.refs.jumpButton.onclick = () => {
            let tempPage = this.refs.jumpInput.value * 1 < 1 ? 1 : this.refs.jumpInput.value * 1
            var temp = Math.ceil(this.totalTem / this.limitTem)
            this.page = tempPage > temp ? temp : tempPage
            this.refs.jumpInput.value = this.pageTem

        }
        this.refs.limitSelect.onchange = (e) => {
            this.limitTem = this.refs.limitSelect.value * 1
            this.refs.jumpInput.value = 1
            this.page = 1
        }
    }


    initAttubie() {
        var buttoNum = this.getAttribute("buttonNum")
        this.buttonNumTem = (buttoNum == null || buttoNum == "") ? 5 : buttoNum * 1
        var page = this.getAttribute("page")
        this.pageTem = (page == null || page == "") ? 1 : page * 1
        var limit = this.getAttribute("limit")
        this.limitTem = (limit == null || limit == "") ? 10 : limit * 1
        var total = this.getAttribute("total")
        this.totalTem = (total == null || total == "") ? 1 : total * 1
        this.refs.totalInfo.innerText = `总共${this.totalTem}条数据`
        this.initPageElementData()
        this.refs.jumpInput.value = this.pageTem
    }

    set limitArray(array) {
        this.setAttribute("limitArray", array)
        this.initPageLimitArray()
    }

    set total(total) {
        if (this.totalTem == total * 1) return
        this.totalTem = total
        this.initPageElementData()
        if (this.pageTem != 1) this.pageTem = 1
        this.refs.totalInfo.innerText = `总共${this.totalTem}条数据`
    }

    get total() {
        return this.titalTem
    }

    set limit(limit) {
        this.limitTem = limit
        this.initPageElementData()
    }

    get limit() {
        return this.limitTem
    }

    set page(page) {
        if (!Number.isInteger(page)) return
        this.pageTem = page
        this.initPageElementData()
        let e = new Event('change')
        e["total"] = this.totalTem
        e["page"] = this.pageTem
        e["limit"] = this.limitTem
        this.dispatchEvent(e)
    }

    get page() {
        return this.pageTem
    }

    get value() {
        return {
            total: this.totalTem,
            page: this.pageTem,
            limit: this.limitTem
        }
    }

    set buttonNum(buttonNum) {
        this.buttonNumTem = buttonNum
        this.initPageElementData()
    }

    get buttonNum() {
        return this.buttonNumTem
    }

    generatePaginationIndexes() {
        const totalPages = Math.ceil(this.totalTem / this.limitTem);
        this.refs.jumpInput.max = totalPages
        let startPage = Math.max(1, this.pageTem - Math.floor(this.buttonNum / 2));
        let endPage = Math.min(totalPages, startPage + this.buttonNum - 1);
        startPage = Math.max(1, endPage - this.buttonNum + 1);
        const pageIndexes = [];
        for (let i = startPage; i <= endPage; i++)
            pageIndexes.push(i);
        if (pageIndexes[0] > 1) pageIndexes.unshift(1)
        if (pageIndexes[pageIndexes.length - 1] < Math.ceil(this.totalTem / this.limitTem)) pageIndexes.push(Math
            .ceil(
                this.totalTem / this.limitTem))
        return pageIndexes;
    }

}


//##########################################################
//###############   FinalComponent-Selector   ##############
//##########################################################

class SelectorOption extends HTMLElement {
    constructor() {
        super()
        this.valueData = {
            label: null,
            value: null
        }
        this.disable = false
        this.onSelected = false //是否处于选中状态
        this.selected = false
        this.ifWindow = false
        this.ifMutiple = false //是否多选
        this.init()
    }

    init() {
        if (this.ifInit) return
        this.ifInit = true
        this.valueData.label = this.innerText
        this.valueData.value = this.getAttribute("value")
        this.initBaseElement()
        this.initFunction()
        this.onready()
    }

    onready() {
    }

    initBaseElement() {

        this.element = dp(`<div>
        <div class="a-select-block" ref="select">
            <input type="checkbox" ref="input">
        </div>
        <div class="a-option-label" ref="label"></div>
    </div>`)
        this.refs = this.element.children
        this.refs.label.innerText = this.innerText
        this.innerHTML = ""

    }

    initFunction() {
        this.element.element.onclick = () => {
            if (!this.disable) this.refs.input.click()
        }
        this.refs.input.onclick = (e) => {
            e.cancelBubble = true
            // 已选择的选项再次点击后无响应
            if (this.selected && !this.ifMutiple) {
                this.refs.input.checked = true
                return
            }
            if (!this.disable) {
                this.select = this.refs.input.checked
            }
        }
    }

    //根据显示模式修改自身样式
    ifWindowOption(value) {
        this.ifWindow = value
        this.element.element.classList = []
        if (value)
            this.element.element.classList.add("a-option")
        else
            this.element.element.classList.add("a-option-list")

        if (this.onSelected)
            this.element.element.classList.add("a-onselected")
    }

    setDisable(value) {
        if (!this.disable && !this.refs.input.checked)
            this.refs.input.disabled = value
        if (value) this.refs.label.classList.add("a-option-disabled")
        else this.refs.label.classList.remove("a-option-disabled")
    }

    set select(value) {
        if (!this.disable) {
            this.refs.input.checked = value
            this.onSelected = value
            if (value) {
                this.element.element.classList.add("a-onselected")
            } else {
                this.element.element.classList.remove("a-onselected")
            }
            this.refs.input.checked = value
            this.onselect({
                value: this.valueData,
                check: value,
                element: this
            })
        }
    }

    set selectStyle(value) {
        if (value) {
            this.element.element.classList.add("a-onselected")
        } else {
            this.element.element.classList.remove("a-onselected")
        }
    }

    get select() {
        return this.onSelected
    }

    onselect() {
    }

    multiple() {
        this.refs.select.style.display = "block"
        this.ifMutiple = true
    }

    set align(value) {
        this.refs.label.style.textAlign = value
        if (value == "center") {
            this.refs.label.style.textIndent = 0
        }
    }

    set parent(value) {
        this.parentSelector = value
    }

    set value(value) {
        this.valueData.value = value
    }

    get value() {
        return this.valueData
    }

    set label(value) {
        this.valueData.label = value
        if (this.refs) this.refs.label.innerHTML = value
    }

    set disabled(value) {
        value = (value == "true" || value == true) ? true : false
        this.disable = value
        if (this.refs) {
            this.refs.input.disabled = value
            if (value) this.refs.label.classList.add("a-option-disabled")
            else this.refs.label.classList.remove("a-option-disabled")
        }
    }
}

class Selector extends HTMLElement {
    constructor() {
        super()
        this.valueList = []
        this.ifWindow = false //是否以窗口的形式显示选项
        this.showWindow = false
        this.multiple = null
        this.disable = false
        this.tempValue
        this.init()
    }

    init() {
        this.showWindow = false
        this.multiple = null
        this.initBaseElement()
        this.windowOption()
        this.initOption()
        this.initFunction()
        this.showLabelText()
        this.optionChecked()

    }

    // 初始元素
    initBaseElement() {
        this.element = dp(`<div class="a-selector">
    <div class="a-selector-block" ref="input">
        <div class="a-value-block" ref="inputText"></div>
        <i class="icon-arrow-up-s-fill" ref="arrow"></i>
    </div>
    <div ref="window">
       ${this.getAttribute("search") != null ? `<input class="a-search-input" placeholder="请输入搜索内容" ref="searchInput"/>` : ``} 
        <div  ref="optionBlock">
            <div class="a-no-result" ref="emptyResult">未找到结果</div>
        </div>
    </div>
</div>`)
        this.refs = this.element.children
        // 是否可以多选
        if (this.getAttribute("multiple") != null) {
            if (this.getAttribute("multiple") == "") this.multiple = -1
            else this.multiple = Math.floor(this.getAttribute("multiple") * 1)
            if (this.multiple == 1) this.multiple = null
        } else {
            this.multiple = null
        }
        // 是否可用
        if (this.getAttribute("disabled") != null) {
            if (this.getAttribute("disabled") == "") this.disable = true
            else this.disable = false
        }
        if (this.getAttribute("width") != null) {
            this.style.width = this.getAttribute("width")
        }
        if (this.getAttribute("align") == null) {
            this.refs.inputText.style.textAlign = "left"
        } else {
            this.refs.inputText.style.textAlign = this.getAttribute("align")
        }
        this.appendChild(this.element.element)
    }

    //初始化所有选项
    initOption() {
        Array.from(this.getElementsByTagName("a-option")).forEach(item => {
            if (item.ifInit)
                this.initOptionFun(item)
            else
                item.onready = () => this.initOptionFun(item)
        })
    }

    initOptionFun(item) {
        item.parent = this
        if (this.multiple != null) item.multiple()
        this.refs.optionBlock.appendChild(item.element.element)
        this.initOptionFunctions(item)
        item.ifWindowOption(this.ifWindow)
        if (this.getAttribute("align") == null) {
            item.align = "left"
        } else {
            item.align = this.getAttribute("align")
        }
    }

    initOptionFunctions(option) {
        //添加选项选中的监听事件
        option.onselect = (e) => {
            //当为单选时，每次选择都清空选择的值
            if (this.multiple == null) {
                if (this.valueList.length > 0 && this.valueList[0].element == e.element) {
                    e.element.selectStyle = true
                    return
                }
                this.valueList.forEach(value => {
                    value.element.select = false
                    value.element.selectStyle = false
                })
                this.valueList = []
                // 如果传进来的选项为选中项，则不添加到数据列表中
                if (e.check)
                    this.valueList.push(e)
                if (this.showWindow)
                    this.foldWindow()
            } else if (e.check && this.multiple != null) {
                this.valueList.push(e)
                if (this.valueList.length == this.multiple && this.multiple != -1)
                    this.disabledoptionsElement(true)
            } else if (!e.check && this.multiple != null) {
                this.valueList.forEach((item, index) => {
                    if (e.value.value == item.value.value) {
                        this.valueList.splice(index, 1)
                    }
                })
                if (this.multiple != null && this.multiple != -1)
                    this.disabledoptionsElement(false)
            }
            this.showLabelText()
        }
    }

    initFunction() {
        //展示选项窗口
        this.refs.input.onmousedown = (e) => {
            if (this.disable) return
            if (!this.showWindow) document.dispatchEvent(new Event('mousedown'))
            e.cancelBubble = true
            if (this.showWindow) {
                this.foldWindow()
            } else {
                this.openWindow()
            }
        }

        document.addEventListener("mousedown", () => {
            if (this.showWindow) this.foldWindow()
        })

        this.refs.window.addEventListener("mousedown", (e) => {
            e.cancelBubble = true
        })

        if (this.getAttribute("search") != null)
            this.refs.searchInput.addEventListener("keyup", () => this.search(this.refs.searchInput.value))
    }

    //设置option的默认选择状态
    optionChecked() {
        Array.from(this.getElementsByTagName("a-option")).forEach(item => {
            if (item.getAttribute("selected") != null && item.getAttribute("selected") != "false") {
                item.select = true
            }
            if (item.getAttribute("disabled") != null) {
                let value = (item.getAttribute("disabled") == "false") ? false : true
                item.disabled = value
                if (this.disable) {
                    this.refs.inputText.style.color = "#cccccc"
                    this.refs.arrow.style.color = "#cccccc"
                } else {
                    this.refs.arrow.style.color = "#666666"
                    this.refs.inputText.style.color = "#666666"
                }
            }
        })
    }

    //外部触发方法
    onchange(e) {
    }

    //设置disabled
    set disabled(value) {
        this.disable = value
        if (this.disable) {
            this.refs.inputText.style.color = "#cccccc"
            this.refs.arrow.style.color = "#cccccc"
        } else {
            this.refs.arrow.style.color = "#666666"
            this.refs.inputText.style.color = "#666666"
        }
    }

    //设置显示模式 窗口或者列表
    windowOption() {
        this.refs.window.style.minWidth = "unset"
        if (this.getAttribute("window") != null) {
            if (this.getAttribute("window") == "") this.ifWindow = true
            else {
                this.ifWindow = Math.floor(this.getAttribute("window") * 1)
                this.ifWindow = this.getElementsByTagName("a-option").length >= this.ifWindow ? true : false
            }
        }
        this.refs.window.classList = []
        this.refs.optionBlock.classList = []
        if (this.ifWindow) {
            this.refs.window.classList.add("a-option-window")
            this.refs.optionBlock.classList.add("a-option-block")
        } else {
            this.refs.window.classList.add("a-option-window-list")
            this.refs.optionBlock.classList.add("a-option-block-list")
        }

        Array.from(this.getElementsByTagName("a-option")).forEach(item => {
            if (item.ifInit)
                item.ifWindowOption(this.ifWindow)
            else
                item.onready = () => item.ifWindowOption(this.ifWindow)
        })
    }


    //修改选择器中的选项的可用状态
    disabledoptionsElement(value) {
        Array.from(this.getElementsByTagName("a-option")).forEach(item => item.setDisable(value))
    }

    // 展示选择器中的文字
    showLabelText() {
        var text = ""
        this.valueList.forEach(item => text += item.value.label + ",")
        text = text.substring(0, text.length - 1)
        if (text.length == 0) {
            text = this.getAttribute("placeholder")
            this.refs.inputText.style.color = "#999999"
        } else this.refs.inputText.style.color = "#666666"
        this.refs.inputText.innerText = text
    }


    openWindow() {
        this.refs.window.classList.add("a-slide-in")
        this.refs.arrow.classList.remove("icon-arrow-up-s-fill")
        this.refs.arrow.classList.add("icon-arrow-down-s-fill")
        this.showWindow = true
        this.refs.window.style.display = "flex"
        //window状态的选项窗口默认宽度为515px
        //自动根据窗口大小适应显示位置
        if (this.ifWindow) {
            if (window.innerWidth < 515) this.refs.window.style.minWidth = window.innerWidth - 45 + "px"
            else this.refs.window.style.minWidth = "515px"
            let left = ((this.element.element.offsetLeft + this.refs.window.clientWidth) - window.innerWidth)
            this.refs.window.style.marginLeft = (left > 0 ? (-1 * left - 15) : 0) + "px"
        }
        this.tempValue = JSON.stringify(this.value)
    }

    foldWindow() {
        this.refs.arrow.classList.add("icon-arrow-up-s-fill")
        this.refs.arrow.classList.remove("icon-arrow-down-s-fill")
        this.showWindow = false
        this.refs.window.style.display = "none"
        if (this.tempValue != JSON.stringify(this.value))
            this.onchange(this.valueList)

    }

    search(value) {
        let result = 0
        Array.from(this.getElementsByTagName("a-option")).forEach(item => {
            if (!item.value.label.includes(value))
                item.element.element.style.display = "none"
            else {
                result++
                item.element.element.style.display = "flex"
            }
        })
        if (result == 0) this.refs.emptyResult.style.display = "block"
        else this.refs.emptyResult.style.display = "none"
    }


    set window(value) {
        this.refs.window.style.marginLeft = 0
        this.setAttribute("window", value)
        this.windowOption()
    }

    get value() {
        let valueTemp = []
        this.valueList.forEach(item => valueTemp.push(item.value))
        if (this.multiple == null) {
            return valueTemp.length == 1 ? valueTemp[0].value : null
        } else {
            return valueTemp
        }

    }

    get valueString() {
        let valueTemp = ""
        this.valueList.forEach(item => valueTemp += item.value.value + ",")
        return valueTemp.substring(0, valueTemp.length - 1)
    }

    get labelString() {
        let valueTemp = ""
        this.valueList.forEach(item => valueTemp += item.value.label + ",")
        return valueTemp.substring(0, valueTemp.length - 1)
    }

    set value(value) {
        Array.from(this.getElementsByTagName("a-option")).forEach(item => {
            item.select = false
        })
        if (value == null) return
        if (typeof value == "NAN" || typeof value == "string" || typeof value == "number") {
            Array.from(this.getElementsByTagName("a-option")).forEach(item => {
                if (item.value.value == value) {
                    item.select = true
                }
            })
        } else {
            let valueTemp = []
            value.forEach(item => {
                valueTemp.push(item)
            })
            Array.from(this.getElementsByTagName("a-option")).forEach(item => {
                if (valueTemp.indexOf(item.value.value) != -1)
                    item.select = true
            })
        }
    }

    set option(options) {
        if (typeof value == "NAN" || typeof value == "string" || typeof value == "number") {
            return console.error("finalComponent:optionsElement is not a list")
        } else {
            //console.log(options)
            try {
                let optionList = []
                options.forEach(item => {
                    let option = document.createElement('a-option')
                    option.label = item.label
                    option.value = item.value
                    if (option.selected) option.select = true
                    optionList.push(option)
                })
                this.innerHTML = ""
                optionList.forEach(item => this.appendChild(item))
                this.init()
            } catch (error) {
                console.error(error.message)
            }
        }
    }

    //添加选项
    push(value) {
        let option = document.createElement('a-option')
        option.label = value.label
        option.value = value.value
        option.ifWindowOption(this.ifWindow)
        this.initOptionFunctions(option)
        this.appendChild(option)
        this.refs.optionBlock.appendChild(option.element.element)
        if (value.selected) option.select = true
    }

    splice(option) {
        Array.form(this.getElementsByTagName("a-option")).forEach(item => {
            if (item.lable == option.label && item.value == option.value) {
                this.removeChild(item)
                this.refs.optionBlock.removeChild(item.element.element)
            }
        })
    }

    clear() {
        this.innerHTML = ""
        this.init()
    }
}


//###########################################################
//###############   FinalComponent-TabEngine   ##############
//###########################################################

class TabEngine extends HTMLElement {
    constructor() {
        super()
        this.init()
    }

    init() {
        let tabSelector = document.createElement("div")
        tabSelector.classList.add("a-top-tab-bar")
        this["tabSelector"] = tabSelector
        let tabBottom = document.createElement("div")
        tabBottom.classList.add("a-bottom-block")
        tabSelector["selectors"] = []
        let tabContent = []
        for (let b = this.children.length - 1; b >= 0; b--)
            tabContent.push(this.children[b])
        for (let b = tabContent.length - 1; b >= 0; b--) {
            let selector = document.createElement("div")
            selector.classList.add("a-tab")
            tabSelector.selectors.push(selector)
            selector.innerText = tabContent[b].getAttribute("label")
            selector["tabContent"] = tabContent[b]
            selector.onclick = () => {
                if (this.lastSelector != null) {
                    this.lastSelector.classList.remove("a-select")
                    this.lastSelector.tabContent.hide()
                }
                this.lastSelector = selector
                selector.classList.add("a-select")
                selector.tabContent.show()
                if (selector.onselect != null)
                    selector.onselect(tabContent[b].getAttribute("label"))
            }
            initDomFunctions(tabContent[b])
            selector.tabContent.hide()
            tabBottom.appendChild(tabContent[b])
            tabSelector.appendChild(selector)
            selector["content"] = tabContent[b]
        }
        tabSelector.selectors[0].onclick()
        tabSelector.selectors.forEach(item => {
            if (item.content.getAttribute("select") == "true")
                item.onclick()
        })
        this.appendChild(tabSelector)
        this.appendChild(tabBottom)
    }
}


//#####################################################
//###############   FinalComponent-Tip   ##############
//#####################################################

new class Tip {
    constructor() {
        this.tipMain
        this.init()
        document["tip"] = this
    }

    init() {
        this.initStyle()
        this.tipMain = dp(`<div class="a-tip-block"></div>`)
        document.body.appendChild(this.tipMain.element)
    }

    getTipElement(type) {
        return dp(`<div class="a-tip-content a-${type}">
				<div class="a-content" ref="content"></div>
				<div class="a-${type}-bar" ref="bar"></div>
			</div>`)
    }

    tip(text, time) {
        let tip = this.getTipElement("tip")
        tip.children.content.innerText = text
        this.insert(tip, time)
    }

    warn(text, time) {
        let tip = this.getTipElement("warn")
        tip.children.content.innerText = text
        this.insert(tip, time)
    }

    info(text, time) {
        let tip = this.getTipElement("info")
        tip.children.content.innerText = text
        this.insert(tip, time)
    }

    danger(text, time) {
        let tip = this.getTipElement("danger")
        tip.children.content.innerText = text
        this.insert(tip, time)
    }

    success(text, time) {
        let tip = this.getTipElement("success")
        tip.children.content.innerText = text
        this.insert(tip, time)
    }

    insert(tip, time) {
        if (time == null) {
            time = 1500
        }
        this.tipMain.element.insertBefore(tip.element, this.tipMain.element.firstChild)
        tip.element.style.marginTop = -(tip.element.clientHeight + 2) + "px"
        tip.children.bar.style.width = tip.children.content.clientWidth + "px"
        tip.children.bar.style.transition = time + "ms linear width"
        setTimeout(() => {
            tip.element.style.transition = "0.5s margin-top"
        }, 10);
        setTimeout(() => {
            tip.element.style.marginTop = "15px"
            tip.children.bar.style.width = "0px"
        }, 20);

        setTimeout(() => {
            tip.element.classList.add("slideOut")
            setTimeout(() => {
                this.tipMain.element.removeChild(tip.element)
            }, 300)
        }, time + 30);
    }

    initStyle() {
        let style = document.createElement("style")
        style.innerHTML = ``
        document.body.appendChild(style)
    }
}


//#############################################################
//###############   FinalComponent-TitleShower   ##############
//#############################################################

new class TitleShower {
    constructor() {
        this.tip
        document["titleShower"] = this
        this.init()
    }

    init() {
        this.tip = document.createElement("div")
        this.tip.classList.add("a-float-title-shower")
        document.body.appendChild(this.tip)
        this.checkDom(document.body)
        document.body.addEventListener('mousemove', (e) => {
            this.tip.style.left = (e.x * 1 + 10) + "px"
            this.tip.style.top = (e.y * 1 + 10) + "px"
        })
    }

    refresh(dom) {
        if (dom == null) {
            this.checkDom(document.body)
        } else {
            this.checkDom(dom)
        }
    }

    checkDom(dom) {
        this.initDom(dom)
        if (dom.childNodes.length > 0) {
            dom.childNodes.forEach(child => {
                this.initDom(child)
                if (child.childNodes.length > 0) {
                    this.checkDom(child)
                }
            })
        }
    }

    initDom(dom) {
        try {
            if (dom.getAttribute("fTitle") != null && dom.getAttribute("fTitle") != "") {
                dom.title = ""
                dom.onmouseover = () => {
                    this.showTip(dom.getAttribute("fTitle"))
                }
                dom.onmouseout = () => {
                    this.hideTip()
                }
            }
        } catch (e) {
            //TODO handle the exception
        }
    }

    showTip(str) {
        this.tip.innerText = str
        this.tip.style.display = "block"
    }

    hideTip(str) {
        this.tip.style.display = "none"
    }
}


//#################################################################
//###############   FinalComponent-YearMonthPicker   ##############
//#################################################################

class YearMonthPicker extends HTMLElement {
    constructor() {
        super()
        this.refs
        this.initElement()
        this.initElementFunctions()
    }

    get value() {
        return [this.refs.year.value * 1, this.refs.month.value * 1]
    }

    initElement() {
        let year
        let month
        if (this.getAttribute("year") != null && this.getAttribute("year") != "") {
            let year = this.getAttribute("year") * 1
            year < 1 ? (year = 1) : ''
            year > 9999 ? (year = 9999) : ''
        } else {
            year = new Date().getFullYear()
        }
        if (this.getAttribute("month") != null && this.getAttribute("month") != "") {
            let month = this.getAttribute("month") * 1
            month < 1 ? (year = 1) : ''
            month > 12 ? (year = 12) : ''
        } else {
            month = new Date().getMonth() + 1
        }

        let element = dp(`
			<div class="a-year-month-picker">
				${(this.getAttribute("icon") == "false" ? "" : `<i class="icon-calendar-2-fill" style="color: #55aaff;"></i>`)}
				<div class="a-top-block-label">年</div>
				<button ref="lastYear" style="border-radius: 3px 0 0 3px;">
					<i class="icon-arrow-left-s-line"></i>
				</button>
				<input ref="year" value="${year}" type="number" min="1"/>
				<button ref="nextYear" style="margin-right: 15px; border-radius: 0 3px 3px 0;">
					<i class="icon-arrow-right-s-line"></i>
				</button>
				<div class="a-top-block-label">月</div>
				<button ref="lastMonth" style="border-radius: 3px 0 0 3px;">
					<i class="icon-arrow-left-s-line"></i>
				</button>
				<input ref="month" value="${month}" type="number" min="1" max="12"/>
				<button ref="nextMonth" style="border-radius: 0 3px 3px 0;">
					<i class="icon-arrow-right-s-line"></i>
				</button>
			</div>`)
        this.appendChild(element.element)
        this.refs = element.children
    }

    initElementFunctions() {
        this.refs.lastYear.onclick = () => {
            let active = () => {
                this.refs.year.value--
                this.onchange([this.refs.year.value, this.refs.month.value])
            }
            this.refs.year.value - 1 < 1 ? (this.refs.year.value = 1) : active()
        }
        this.refs.year.onchange = () => {
            this.refs.year.value < 1 ? (this.refs.year.value = 1) : this.onchange([this.refs.year.value, this
                .refs.month.value
            ])
            this.refs.year.value > 9999 ? (this.refs.year.value = 9999) : this.onchange([this.refs.year.value,
            this.refs.month.value
            ])
        }
        this.refs.nextYear.onclick = () => {
            let active = () => {
                this.refs.year.value++
                this.onchange([this.refs.year.value, this.refs.month.value])
            }
            this.refs.year.value * 1 + 1 > 9999 ? (this.refs.year.value = 9999) : active()
        }
        this.refs.lastMonth.onclick = () => {
            let active = () => {
                this.refs.month.value--
                this.onchange([this.refs.year.value, this.refs.month.value])
            }
            if (this.refs.month.value - 1 < 1) {
                this.refs.month.value = 12
                this.refs.year.value--
                this.onchange([this.refs.year.value, this.refs.month.value])
            } else active()
        }
        this.refs.month.onchange = () => {
            this.refs.month.value < 1 ? (this.refs.month.value = 1) : this.onchange([this.refs.year.value, this
                .refs.month.value
            ])
            this.refs.month.value > 12 ? (this.refs.month.value = 12) : this.onchange([this.refs.year.value,
            this.refs.month.value
            ])
        }
        this.refs.nextMonth.onclick = () => {
            let active = () => {
                this.refs.month.value++
                this.onchange([this.refs.year.value, this.refs.month.value])
            }
            if (this.refs.month.value * 1 + 1 > 12) {
                this.refs.month.value = 1;
                this.refs.year.value++
                this.onchange([this.refs.year.value, this.refs.month.value])
            } else active()

        }
    }

    onchange(e) {

    }
}


//########################################################
//###############   FinalComponent-Button   ##############
//########################################################

class ButtonEngine extends HTMLElement {
    constructor() {
        super()
        this.refs
        this.element
        this.disableTem = false
        this.loadingTemp = false
        this.init()
    }

    init() {
        this.initElement()
    }

    initElement() {
        this.element = dp(`<div class="a-button-block">
                            <button ref="button" style="display:flex;">
                                <div style="flex: 1;"></div>
                                <div class="a-button-icon-block" ref="iconBlock">
                                    <i ref="icon"></i>
                                </div>
                                <div class="a-button-inner" ref="inner"></div>
                                <div style="flex: 1;"></div>
                            </button>
                        </div>`)

        this.refs = this.element.children
        this.childNodes.forEach(item => {
            this.refs.inner.appendChild(item)
        })
        this.appendChild(this.element.element)
        // 图标
        if (this.getAttribute("icon") != null)
            this.refs.icon.classList.add(this.getAttribute("icon"))
        else this.refs.icon.style.display = "none"
        //宽度
        if (this.getAttribute("width") != null && this.getAttribute("width") != "")
            this.element.element.style.width = this.getAttribute("width")
        //对齐方向
        if (this.getAttribute("float") != null)
            this.style.float = this.getAttribute("float")
        //边距
        if (this.getAttribute("margin") != null)
            this.style.margin = this.getAttribute("margin")
        //右边距
        if (this.getAttribute("margin-right") != null)
            this.style.marginRight = this.getAttribute("margin-right")
        // 左边距
        if (this.getAttribute("margin-left") != null)
            this.style.marginLeft = this.getAttribute("margin-left")
        // 下边距
        if (this.getAttribute("margin-bottom") != null)
            this.style.marginBottom = this.getAttribute("margin-bottom")


        // 上边距
        if (this.getAttribute("margin-top") != null)
            this.style.marginTop = this.getAttribute("margin-top")


        // 按钮样式
        if (this.getAttribute("tip") != null) {
            this.element.element.classList.add("a-tip")
            this.element.element.style.border = " 1px solid #55aaff"
        }

        if (this.getAttribute("success") != null) {
            this.element.element.classList.add("a-success")
            this.element.element.style.border = " 1px solid #4f9959"
        }
        if (this.getAttribute("warn") != null) {
            this.element.element.classList.add("a-warn")
            this.element.element.style.border = " 1px solid #dfab3b"
        }

        if (this.getAttribute("danger") != null) {
            this.element.element.classList.add("a-danger")
            this.element.element.style.border = " 1px solid #ee5d5d"
        }

        // 禁用
        if (this.getAttribute("disabled") == "true") {
            this.disabled = true
        }
    }

    set onclick(value) {
        this.refs.button.onclick = value
    }

    set disabled(value) {
        this.disableTem = value

        this.refs.button.disabled = value
        if (value)
            this.element.element.classList.add("a-button-disabled")
        else
            this.element.element.classList.remove("a-button-disabled")
    }

    set innerText(value) {
        this.refs.inner.innerText = value
    }

    get innerText() {
        return this.refs.inner.innerText
    }

    set loading(value) {
        this.loadingTemp = value ? true : false
        if (this.loadingTemp) {
            this.classList.add("a-button-loading")
        } else {
            this.classList.remove("a-button-loading")
        }
    }

    get loading() {
        return this.loadingTemp
    }
}


//#######################################################
//###############   FinalComponent-Image   ##############
//#######################################################

class AheadImage extends HTMLElement {
    constructor() {
        super()
        this.element
        this.refs
        this.imgWidth
        this.imgHeight
        this.imgSrc = this.getAttribute("src")
        this.init()
    }

    init() {
        this.initElement()
        this.loadClass()

    }

    initElement() {
        this.element = dp(`<div class="a-image-imageBlock" ref="imgBlock">
            <div class="a-image-loading" ref='loading'>
                <div style="flex:1;"></div>
                <i ref="icon" class="icon-loader-2-fill"></i>
                <div style="flex:1;"></div>
            </div>
            <img ref="img">
            <div class="a-image-tag" ref="tag">长图</div>
        </div>`)
        this.refs = this.element.children
        this.appendChild(this.element.element)
        this.src = this.getAttribute("src")
        if (this.getAttribute("poster") != null)
            this.refs.img.src = this.getAttribute("poster")
        this.refs.img.alt = this.getAttribute("alt")
        this.refs.imgBlock.style.padding = 0
        this.refs.imgBlock.style.width = this.getAttribute("width")
        this.refs.imgBlock.style.height = this.getAttribute("height")
        this.refs.icon.style.fontSize = ((this.refs.imgBlock.clientWidth / 10) < 15 ? 15 : (this.refs.imgBlock.clientWidth / 10)) + "px"
        if (this.getAttribute("default") != null && this.getAttribute("default") != "false" || this.getAttribute("default") == null) this.default = true
        if (this.getAttribute("center") != null && this.getAttribute("center") != "false") this.center = true
        this.refs.img.addEventListener('load', () => {
            this.refs.loading.hide()
            this.imgWidth = this.refs.img.clientWidth
            this.imgHeight = this.refs.img.clientHeight
            if (this.getAttribute("cover") != null && this.getAttribute("cover") != "false") this.cover = true
            if (this.getAttribute("row") != null && this.getAttribute("row") != "false") this.row = true
            if (this.getAttribute("column") != null && this.getAttribute("column") != "false") this.column = true
            if (this.refs.img.naturalHeight > this.refs.img.naturalWidth * 2.5) {
                this.refs.tag.show()
                this.refs.tag.innerText = "长图"
            } else if (this.refs.img.naturalWidth > this.refs.img.naturalHeight * 2.5) {
                this.refs.tag.show()
                this.refs.tag.innerText = "宽图"
            }
            this.load()
        })
        if (this.getAttribute("scale") != null) {
            this.scale = this.getAttribute("scale") * 1
        }
        if (this.getAttribute("detail") != null && this.getAttribute("detail") != "false") this.initDetail()
    }

    //图片加载完毕后的回调函数
    load() {
    }

    // 设置img缩放
    set scale(value) {
        this.refs.img.style.scale = value
    }

    // 获取img缩放
    get scale() {
        return this.refs.img.style.scale
    }

    // 清除所有显示形式
    clearType() {
        this.refs.imgBlock.classList.remove("a-image-default")
        this.refs.imgBlock.classList.remove("a-image-cover")
        this.refs.imgBlock.classList.remove("a-image-center")
        this.refs.imgBlock.classList.remove("a-image-row")
        this.refs.imgBlock.classList.remove("a-image-column")
    }

    set width(value) {
        this.refs.imgBlock.style.width = value
    }

    get width() {
        return this.refs.imgBlock.style.width
    }

    set height(value) {
        this.refs.imgBlock.style.height = value
    }

    get height() {
        return this.refs.imgBlock.style.height
    }

    // 设置image路径
    set src(value) {
        this.setAttribute("src", value)
        this.refs.img.src = value
    }

    // 返回image路径
    get src() {
        return this.getAttribute("src")
    }

    // 默认显示，不缩放，左上角
    set default(value) {
        this.clearType()
        if (value)
            this.refs.imgBlock.classList.add("a-image-default")
        else
            this.refs.imgBlock.classList.remove("a-image-default")
        if (this.getAttribute("width") == null)
            this.refs.imgBlock.style.width = this.imgWidth + "px"
        if (this.getAttribute("height") == null)
            this.refs.imgBlock.style.height = this.imgHeight + "px"
    }

    //拉伸显示，全覆盖
    set cover(value) {
        this.clearType()
        if (this.getAttribute("width") == null)
            this.refs.imgBlock.style.width = this.imgWidth + "px"
        if (this.getAttribute("height") == null)
            this.refs.imgBlock.style.height = this.imgHeight + "px"
        if (value)
            this.refs.imgBlock.classList.add("a-image-cover")
        else
            this.refs.imgBlock.classList.remove("a-image-cover")
    }

    //不缩放，居中显示
    set center(value) {
        this.clearType()
        if (value)
            this.refs.imgBlock.classList.add("a-image-center")
        else
            this.refs.imgBlock.classList.remove("a-image-center")

        if (this.getAttribute("width") == null)
            this.refs.imgBlock.style.width = this.imgWidth + "px"
        if (this.getAttribute("height") == null)
            this.refs.imgBlock.style.height = this.imgHeight + "px"
        let max
        if (this.refs.imgBlock.clientWidth != 0) {
            let width = this.refs.imgBlock.clientWidth, height = this.refs.imgBlock.clientHeight
            max = width > height ? width : height
            if (this.refs.img.naturalHeight > this.refs.img.naturalWidth) this.refs.img.style.width = max + "px"
            else this.refs.img.style.height = max + "px"
        } else {
            let resize = setInterval(() => {
                if (this.refs.imgBlock.clientWidth != 0) {
                    clearInterval(resize)
                    let width = this.refs.imgBlock.clientWidth, height = this.refs.imgBlock.clientHeight
                    max = width > height ? width : height

                    if (this.refs.img.naturalHeight > this.refs.img.naturalWidth) this.refs.img.style.width = max + "px"
                    else this.refs.img.style.height = max + "px"
                }
            }, 100);
        }

    }

    // 宽度为百分百居中显示
    set row(value) {
        this.clearType()
        if (value)
            this.refs.imgBlock.classList.add("a-image-row")
        else
            this.refs.imgBlock.classList.remove("a-image-row")
        if (this.getAttribute("width") == null)
            this.refs.imgBlock.style.width = this.imgWidth + "px"
        if (this.getAttribute("height") == null)
            this.refs.imgBlock.style.height = this.imgHeight + "px"
    }

    //高度为百分百居中显示
    set column(value) {
        this.clearType()
        if (value)
            this.refs.imgBlock.classList.add("a-image-column")
        else
            this.refs.imgBlock.classList.remove("a-image-column")
        if (this.getAttribute("width") == null)
            this.refs.imgBlock.style.width = this.imgWidth + "px"
        if (this.getAttribute("height") == null)
            this.refs.imgBlock.style.height = this.imgHeight + "px"
    }

    //加载class
    loadClass() {
        Array.from(this.classList).forEach(item => {
            this.element.element.classList.add(item)
        })
    }

    // 图像是否能点击查看详情
    initDetail() {
        this.element.element.style.cursor = "pointer"
        if (document["a-image-detail"] == null) {
            document['a-image-detail-show'] = false
            let element = dp(`<div class="a-image-detail-main-block">
    <div class="a-image-detail-pre-button a-image-detail-button" ref="pre">
        <div style="flex: 1;"></div>
        <i class="icon-arrow-drop-left-fill"></i>
        <div style="flex: 1;"></div>
    </div>
    <div class="a-image-detail-next-button a-image-detail-button" ref="next">
        <div style="flex: 1;"></div>
        <i class="icon-arrow-drop-right-fill"></i>
        <div style="flex: 1;"></div>
    </div>
    <img ref="detailImg" class="a-image-detail-image" src="./image/normal.jpg" draggable="false" alt="">
     <div class="a-image-top-menu-block"ref="topMenu">
        <button class="button" ref='smaller'>-</button>
        <div ref="scale" class="scal-block"></div>
        <button class="button" ref='bigger'>+</button>
         <button class="button" ref='reset'>
            <i class="icon-restart-line"></i>
         </button>
    </div>
    <div class="a-image-info-block" ref="infoBlock">
        <div>图片名称：<span ref="name"></span></div>
        <div>原始尺寸：<span ref="size"></span></div>
    </div>
    <div class="a-image-bottom-menu-block" ref="bottomMenu"> 
        <div class="a-image-image-small-list" ref="smallImgList"></div>
    </div>
</div>`)
            let showingImg = null
            let scale = 1
            let isShow
            let mouseInImage = false
            document["a-image-detail"] = element
            document.body.appendChild(element.element)
            let detailBlock = element.element
            let refs = element.children
            let listImg = []
            // 计算图片的放大比例
            const detailImageScale = () => {
                scale = refs.detailImg.clientWidth / refs.detailImg.naturalWidth
                refs.scale.innerText = (refs.detailImg.clientWidth / refs.detailImg.naturalWidth * 100).toFixed(0) + "%"
                refs.name.innerText = showingImg.node.getAttribute("alt")
                refs.size.innerText = refs.detailImg.naturalWidth + " x " + refs.detailImg.naturalHeight
            }
            const initImg = () => {
                refs.detailImg.style.left = "50%"
                refs.detailImg.style.top = "100px"
                refs.detailImg.style.width = "75%"
                refs.detailImg.style.height = "unset"
                if (refs.detailImg.clientHeight > refs.detailImg.naturalHeight)
                    refs.detailImg.style.height = refs.detailImg.naturalHeight + "px"
                if (refs.detailImg.clientWidth > refs.detailImg.naturalWidth)
                    refs.detailImg.style.width = refs.detailImg.naturalWidth + "px"
                refs.detailImg.style.width = refs.detailImg.clientWidth + 'px'
                detailImageScale()
            }
            const bottomMenuIndex = (image) => {
                let index = image.index
                refs.smallImgList.style.left = (detailBlock.clientWidth / 2 - index * 160 - 85) + "px"
            }
            document["a-image-detail"].detail = (image) => {
                refs.smallImgList.innerHTML = ""
                isShow = true
                refs.detailImg.src = image.src
                showingImg = { node: image, index: image.index }

                detailBlock.show()

                refs.detailImg.addEventListener("load", () => {
                    initImg()

                })
                loadBottomMenu()
            }

            const imgSelect = () => {
                bottomMenuIndex(showingImg)
                listImg.forEach(item => {
                    if (item.index == showingImg.index) {
                        item.node.width = "150px"
                        item.node.height = "100px"
                        item.img.style.height = "100px"
                        item.img.style.width = "150px"
                        item.img.style.marginTop = "-20px"
                    } else {
                        item.node.width = "130px"
                        item.node.height = "80px"
                        item.img.style.height = "80px"
                        item.img.style.width = "130px"
                        item.img.style.marginTop = "0px"
                    }
                })
                setTimeout(() => {
                    refs.detailImg.src = showingImg.node.src
                }, 300);

            }

            const loadBottomMenu = () => {
                let fix = 0
                Array.from(document.getElementsByTagName("A-IMAGE")).forEach((item, index) => {
                    if (item.getAttribute("detail") == null || item.getAttribute("detail") == "false") {
                        fix++
                        return
                    }
                    let node = item.cloneNode(false)
                    node.refs.imgBlock.onclick = null
                    node['index'] = index - fix
                    node.width = "130px"
                    node.height = "80px"

                    let img = document.createElement("div")
                    img.classList.add("a-menu-detail-image-block")
                    img.style.border = "10px solid rgba(255,255,255,0.3)"
                    img.style.marginLeft = "3px"
                    img.style.marginRight = "3px"
                    img.style.backgroundColor = "#7a7a7a"
                    img.appendChild(node)
                    listImg.push({ img: img, node: node, index: index - fix })
                    refs.smallImgList.appendChild(img)

                })
                imgSelect()
                listImg.forEach(item => {
                    item.node.refs.imgBlock.onmouseup = (e) => {
                        e.cancelBubble = true
                        showingImg = item
                        imgSelect()
                    }
                })
            }

            // 缩放
            //value 缩放的比值，float，百分数
            //focus boolean 是否以鼠标为焦点缩放 focus是 e不能为空
            const scaleImg = (value, focus, e) => {
                let imgX, imgY, xC, yC
                if (focus && e != null && mouseInImage) {
                    imgX = refs.detailImg.offsetLeft - refs.detailImg.clientWidth / 2
                    imgY = refs.detailImg.offsetTop
                    xC = (e.clientX - imgX) / refs.detailImg.clientWidth
                    yC = (e.clientY - imgY) / refs.detailImg.clientHeight
                }

                refs.detailImg.style.width = (scale + value) * refs.detailImg.naturalWidth + "px"
                refs.detailImg.style.height = (scale + value) * refs.detailImg.naturalHeight + "px"
                detailImageScale()
                if (focus && e != null && mouseInImage) {
                    imgX = refs.detailImg.offsetLeft - refs.detailImg.clientWidth / 2
                    imgY = refs.detailImg.offsetTop
                    let xCnew = (e.clientX - imgX) / refs.detailImg.clientWidth
                    let yCnew = (e.clientY - imgY) / refs.detailImg.clientHeight
                    refs.detailImg.style.left = refs.detailImg.offsetLeft + (xCnew - xC) * refs.detailImg.clientWidth + "px"
                    refs.detailImg.style.top = refs.detailImg.offsetTop + (yCnew - yC) * refs.detailImg.clientHeight + "px"
                }
            }


            detailBlock.addEventListener('wheel', (e) => {
                //图片放大
                if (e.deltaY < 0) {
                    scaleImg(0.05, true, e)
                } else {  //图片缩小
                    scaleImg(-0.05, true, e)
                }
                if (isShow) {
                    e.preventDefault();
                }
            })

            detailBlock.onmouseup = () => {
                document['a-image-detail-show'] = false
                detailBlock.hide()
                isShow = false
            }
            refs.smaller.onmouseup = (e) => {
                e.cancelBubble = true
                scaleImg(-0.05, false)
            }
            refs.bigger.onmouseup = (e) => {
                e.cancelBubble = true
                scaleImg(0.05, false)
            }
            refs.reset.onmouseup = (e) => {
                e.cancelBubble = true
                initImg()
            }
            refs.detailImg.addEventListener('mousedown', (e) => {
                e.cancelBubble = true
                refs.pre.hide()
                refs.next.hide()
                refs.topMenu.hide()
                refs.bottomMenu.hide()
                refs.infoBlock.hide()

                refs.detailImg['draging'] = true
            })
            refs.detailImg.addEventListener('mouseup', (e) => {
                refs.pre.show("flex")
                refs.next.show("flex")
                refs.topMenu.show("flex")
                refs.bottomMenu.show()
                refs.infoBlock.show()
                e.cancelBubble = true
                refs.detailImg['draging'] = false
            })


            refs.detailImg.addEventListener("mouseleave", () => {
                mouseInImage = false
                refs.pre.show("flex")
                refs.next.show("flex")
                refs.topMenu.show("flex")
                refs.bottomMenu.show()
                refs.infoBlock.show()
                refs.detailImg['draging'] = false
            })
            refs.detailImg.addEventListener("mouseover", () => {
                mouseInImage = true
            })
            refs.detailImg.addEventListener('mousemove', (e) => {
                if (refs.detailImg['draging']) {
                    refs.detailImg.style.left = refs.detailImg.offsetLeft + e.movementX + "px"
                    refs.detailImg.style.top = refs.detailImg.offsetTop + e.movementY + "px"
                }
            })
            refs.bottomMenu.onmouseup = (e) => {
                e.cancelBubble = true
            }
            refs.pre.onmouseup = (e) => {
                e.cancelBubble = true
                //console.log(showingImg.index - 1 >= 0)
                if (showingImg.index - 1 >= 0) {
                    showingImg = listImg[showingImg.index - 1]
                    imgSelect()
                }
            }
            refs.next.onmouseup = (e) => {
                e.cancelBubble = true
                if (showingImg.index + 1 < listImg.length) {
                    showingImg = listImg[showingImg.index + 1]
                    imgSelect()
                }
            }
            let fix = 0
            Array.from(document.getElementsByTagName("A-IMAGE")).forEach((item, index) => {
                //console.log(item.getAttribute("detail") == null || item.getAttribute("detail") == "false")
                if (item.getAttribute("detail") == null || item.getAttribute("detail") == "false") {
                    fix++
                    return
                }
                item["index"] = index - fix
            })
        }
        this.element.element.onclick = () => {
            document['a-image-detail-show'] = true
            document["a-image-detail"].detail(this)
        }

    }
}


//###########################################################
//###############   FinalComponent-MouseMenu   ##############
//###########################################################

new class MouseMenu { //代理层控制中心
    constructor() {
        this.$el = {}
        this.secondImpl = this.dc("div", "secondLevelImpl") //代理层
        document.body.appendChild(this.secondImpl)
        this.init()
        this.followMouse = true
        this.mouseX = 0
        this.mouseY = 0
        document["mouseMenu"] = this
    }

    init() {
        window.addEventListener("mousemove", (e) => {
            this.mouseX = e.x
            this.mouseY = e.y
            if (this.followMouse) {
                this.secondImpl.style.left = e.x + "px"
                this.secondImpl.style.top = e.y + "px"
            }
        })
        window.addEventListener("mouseup", (e) => {
            this.Vis(false)
        })
    }

    toMouse() {
        this.secondImpl.style.left = this.mouseX + 10 + "px"
        this.secondImpl.style.top = this.mouseY + 10 + "px"

    }

    setPointEvent(work) {
        if (work) {
            this.secondImpl.style.pointerEvents = "all"
        } else {
            this.secondImpl.style.pointerEvents = "none"
        }
    }

    show(show) {
        if (show) {
            this.secondImpl.style.display = "block"
        } else {
            this.secondImpl.style.display = "none"
        }

    }

    Vis(vis) {
        if (vis) {
            this.secondImpl.style.display = "block"
        } else {
            this.secondImpl.style.display = "none"
        }
    }

    Reset() {
        this.secondImpl.style.display = "none"
        this.secondImpl.style.pointerEvents = "none"
        this.secondImpl.innerHTML = ''
    }

    Sleep(sleep) {
        if (sleep) {
            this.secondImpl.style.pointerEvents = "none"
        } else {
            this.secondImpl.style.pointerEvents = "auto"
        }

    }

    dc(tag, Class) {
        let element = document.createElement(tag)
        if (Class != null) {
            if (typeof Class == "string") {
                element.classList.add(Class)
            } else {
                Class.forEach((className) => {
                    element.classList.add(className)
                })
            }
        }
        element["text"] = (text) => {
            element.innerText = text
            return element
        }
        element["add"] = (ele) => {
            element.appendChild(ele)
            return element
        }
        return element
    }

    //初始化整个页面代码，返回页面和dom对象列表
    dp(pageString) {

        pageString = pageString.replace(/\n/g, "").replace(/\t/g, "");
        let content = this.dc("div")
        content.innerHTML = pageString
        this.domList(content)
        return content
    }

    domList(dom) {
        if (dom.id != null && dom.id != "") {
            this.$el[dom.id] = dom
            this.$el[dom.id]["component"] = (url) => {
                this.$el[dom.id].innerHTML = ''
                this.$el[dom.id].appendChild(this.component(url))
            }
        }
        if (dom.childNodes.length > 0) {
            dom.childNodes.forEach((node) => {
                this.domList(node)
            })
        }
    }

    menu(data) {
        this.Injet(this.createMenu(data))
        this.followMouse = false
        this.toMouse()
        this.Vis(true)
    }

    createMenu(menuData, type) {
        this.setPointEvent(true)
        const menu = this.dc("div");
        menu.classList.add("FloatMenu");
        menuData.forEach((item) => {
            const menuItem = this.dc("div");
            menuItem.innerText = `${item.name}`;
            menuItem.classList.add("FloatMenuButton");
            menuItem.classList.add("FloatMenu");
            if (item.child) {
                let rightArrowBlock = this.dc("div")
                rightArrowBlock.classList.add("rightArrowBlock")
                let rightArrow = this.dc("i")
                rightArrow.classList.add("icon-arrow-right-s-line")
                rightArrowBlock.appendChild(rightArrow)
                menuItem.appendChild(rightArrowBlock)
                const subMenu = this.createMenu(item.child, "child");
                menuItem.appendChild(subMenu);
                menuItem.classList.add("FloatFather");
                subMenu.classList.add("FloatChild");
                subMenu.style.display = "none";
                menuItem.addEventListener("mouseenter", () => {
                    subMenu.style.left = menuItem.clientWidth + "px"
                    subMenu.style.display = "block";
                });
                menuItem.addEventListener("mouseleave", () => {
                    subMenu.style.display = "none";
                });
            }
            if (item.fun && typeof item.fun === "function") {
                menuItem.addEventListener("click", () => {
                    item.fun();
                });
            }
            menu.appendChild(menuItem);
        });
        return menu;
    }

    Injet(dom) {
        this.secondImpl.innerHTML = ''
        this.secondImpl.appendChild(dom)
    }
}


//################################################################
//###############   FinalComponent-compent-define   ##############
//################################################################

document.addEventListener("DOMContentLoaded", () => {
    //代码展示组件
    customElements.define("a-html", HTMLShower)
    //内容展示组件
    customElements.define("a-content", ContentBlock)
    //年月选择器
    customElements.define("a-year-month-picker", YearMonthPicker)
    //数字输入框
    customElements.define("a-input-num", InputNum)
    //默认输入框
    customElements.define("a-input", Input)
    //密码输入框
    customElements.define("a-input-password", InputPassword)
    //文本输入框
    customElements.define("a-input-text", InputText)
    //单选框元素，配合a-input-radio使用
    customElements.define("a-radio", InputRadioItem)
    //单选框，配合a-radio使用
    customElements.define("a-input-radio", InputRadio)
    //日期选择器组件
    customElements.define("a-input-date-time", InputDateTime)
    //选择器选项，配合a-select使用
    customElements.define("a-option", SelectorOption)
    //选择器，配合a-option使用
    customElements.define("a-select", Selector)
    //表单项，配合a-form使用
    customElements.define("a-form-item", FormItem)
    //表单，配合a-form-item使用
    customElements.define("a-form", Form)
    //菜单页，配合a-menu使用
    customElements.define("a-menu-page", MenuPage)
    //菜单，配合a-menu-page使用
    customElements.define("a-menu", Menu)
    //翻页组件
    customElements.define("a-pagination", Pagination)
    //tab切换组件
    customElements.define("a-tab", TabEngine)
    //弹窗组件
    customElements.define("a-dialog", DialogEngine)
    //加载提示组件
    customElements.define("a-loading", Loading)
    //按钮组件
    customElements.define("a-button", ButtonEngine)
    //状态切换组件
    customElements.define("a-input-switch", InputSwitch)
    //图片展示组件
    customElements.define("a-image", Image)

})
