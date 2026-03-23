/* @Author LiuJun */
/* @CreateDateTime 2024-09-12 15:12:49 */




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
        this.appendChild(itemFrame)
        this["iframe"] = itemFrame
        if (this.getAttribute("height") != null)
            this.style.height = "calc(" + this.getAttribute("height") + " - 4px)"
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

    selectPage(page) {
        if (page == null) return
        if (this.getAttribute("lazy") != null && page.getAttribute("src") != null) page.initFrame()
        if (this.getAttribute("remember") != null) {
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
            this.selectPage(page)
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
        this.refs.menuBlock.style.width = "40px"
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

//################################################################
//###############   FinalComponent-compent-define   ##############
//################################################################
//代码展示组件
customElements.define("a-html", HTMLShower)
//菜单页，配合a-menu使用
customElements.define("a-menu-page", MenuPage)
//菜单，配合a-menu-page使用
customElements.define("a-menu", Menu)