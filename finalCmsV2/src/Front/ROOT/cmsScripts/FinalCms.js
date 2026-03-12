//@Author LiuJun
const url = new URL(document.currentScript.src);
const params = Object.fromEntries(url.searchParams.entries());


const BaseCmsURL = window.location.origin + "/" + params.web
console.log(BaseCmsURL);

const local = true //是否将加载的list数据存放在localStorage
const CacheMap = new Map() //缓存数据
const SearchContent = {}

/**
 * Quill富文本编辑器的基本工具栏选项
 */
const baseToolBarOptions = [
    // 字号下拉菜单
    [{ 'size': ['small', false, 'large', 'huge'] }],
    // 加粗、斜体、下划线、删除线按钮
    ['bold', 'italic', 'underline', 'strike'],
    // 对齐方式下拉菜单
    [{ 'align': [] }],
    // 块引用、代码块按钮
    ['blockquote', 'code-block'],
    // 标题下拉菜单
    [{ 'header': 1 }, { 'header': 2 }],
    // 列表类型下拉菜单
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    // 颜色和背景颜色下拉菜单
    [{ 'color': [] }, { 'background': [] }],
    // 链接、图片、视频、公式按钮
    ['link', 'image', 'formula'],
];

function run() {
    loadBaseStyle()
    loadBaseData()
}

function loadBaseStyle() {
    // 初始化组件的样式
    let baseStyle = `
                node-content,
                cms-component,
                cms-list,
                cms-node,
                list-list,
                list-node,
                cms-slider,
                cms-search-result,
                slider-prev,
                slider-next,
                slider-bar-button,
                list-submit,
                submit-text,
                submit-button,
                node-file,
                list-pagination {
                    display:block;
                }
                node-prev,
                node-next,
                node-cover,
                node-date,
                submit-code,
                list-node{
                    display:inline;
                }
                list-pagination .a-page-info-block {
                    display: flex;
                    flex-wrap: wrap;
                }
                
                node-content table{
                    font-size:14px;
                    padding:0px;
                    color:#666;
                    border-spacing:0;
                    border-right:1px solid #f5f5f5;
                    border-bottom:1px solid #f5f5f5;
                }
                
                node-content th,td{
                    text-align:center;
                    padding-left:5px;
                    padding-right:5px;
                    margin:0;
                    border-left:1px solid #f5f5f5;
                    border-top:1px solid #f5f5f5;
                }
                
                node-content th{
                    background-color:#efefef;
                }
                
                list-pagination .a-page-info-block input {
                    height: 26px;
                    text-indent: 10px;
                    border-radius: 3px;
                    border: 1px solid #d0d0d0;
                    width: 50px;
                    margin-right: 10px;
                }

                list-pagination .a-page-info-block select {
                    height: 30px;
                    border-radius: 3px;
                    border: 1px solid #d0d0d0;
                    width: 50px;
                    margin-right: 10px;
                }

                list-pagination .a-page-info-block button {
                    color: #555555;
                    cursor: pointer;
                    height: 30px;
                    border-radius: 3px;
                    background-color: #fff;
                    border: 1px solid #d0d0d0;
                    padding-left: 10px;
                    padding-right: 10px;
                    margin-right: 10px;
                }

                list-pagination .a-page-info-block button:hover {
                    color: #555555;
                    background-color: #f4f4f4;
                }

                list-pagination .a-page-info-block .select {
                    background-color: #407BFF;
                    color: #fff;
                    border: 1px solid #407BFF;
                }

                list-pagination .a-page-info-block .select:hover {
                    background-color: #407BFF;
                    color: #fff;
                    border: 1px solid #407BFF;
                    opacity: 0.75;
                }

                list-pagination .a-page-info-block i {
                    color: #999999;
                    margin-left: -5px;
                    margin-right: 5px;
                }

                list-pagination .a-page-info-block label {
                    margin-right: 10px;
                    font-size: 14px;
                    line-height: 30px;
                    color: #666666;
                }

                list-pagination .a-page-info-block .a-page-button-block {
                    display: flex;
                }

                list-pagination .a-page-info-block .a-set-block {
                    display: flex;
                }

                cms-slider {
                    overflow: hidden;
                    position: relative;
                }

                cms-slider:hover .sliderButton{
                    opacity: 1;
                }

                cms-slider:hover .sliderBottomSelectButton{
                    opacity: 1;
                }

                cms-slider .sliderPrevButton {  
                    --svgFontSize:25px;
                    position: absolute;
                    left: 2.5%;
                    top: 50%;
                }

                cms-slider .sliderNextButton {
                    --svgFontSize:25px;
                    right: 2.5%;
                    top: 50%;
                    position: absolute;
                }

                cms-slider .sliderButton {
                    z-index: 2;
                    border-radius: 3px;
                    cursor: pointer;
                    position: relative;
                    width: 100%;
                    height: 100%;
                    opacity: 0.2;
                    transition: 0.2s opacity;
                    background-color: rgba(0, 0, 0, 0.25);
                    transform: translate(0%, -50%);
                }

                cms-slider .sliderButton svg{
                    width:var(--svgFontSize);
                    height:var(--svgFontSize);
                }

                cms-slider .sliderButton:hover {
                    opacity: 0.75;
                }

                cms-slider .sliderButtonIcon {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                cms-slider .sliderBottomSelectButtonBlock {
                    z-index: 2;
                    padding-left: 10px;
                    padding-right: 10px;
                    display: flex;
                    position: absolute;
                    background-color: rgba(0, 0, 0, 0.25);
                    left: 50%;
                    bottom: 5%;
                    border-radius: 10px;
                    transform: translateX(-50%);
                }

                cms-slider .sliderBottomSelectButtonBlock:hover .sliderBottomSelectButton {
                    width: 20px;
                    height: 20px;
                    margin-left: 7px;
                    margin-right: 7px;
                }

                cms-slider .sliderBottomSelectButton {
                    opacity: 0.2;
                    transition: 0.2s opacity;
                    transition: 0.2s width, 0.2s height, 0.2s margin-left, 0.2s margin-right;
                    cursor: pointer;
                    margin-top: 3px;
                    margin-bottom: 3px;
                    margin-left: 5px;
                    margin-right: 5px;
                    background-color: #fff;
                    width: 15px;
                    height: 15px;
                    border-radius: 10px;
                }

                cms-slider .sliderBottomSelectButton:hover {
                    box-shadow: 0 0 5px #ffffff;
                }

                cms-slider .sliderImgMainBlock {
                    z-index: 0;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    left: 0;
                    top: 0;
                }

                cms-slider .sliderImgBlock {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                }

                cms-slider .sliderImgBlock .img {
                    position: absolute;
                    z-index: 1;
                    padding: 0;
                    margin: 0;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                cms-slider .sliderImgBlockBg {
                    filter: blur(20px);
                    z-index: 0;
                    width: 150%;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                cms-slider .coverBlock {
                    transition: 0.3s left;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }

                cms-slider .imgSelect {
                    box-shadow: 0 0 5px rgb(200, 200, 200);
                    background-color: rgb(134, 134, 134) !important;
                    animation: sliderAnimationImgSelected 0.25s ease forwards;
                    width: 13px;
                    height: 13px;
                    border: 1px solid rgb(160, 160, 160);
                }

                @keyframes sliderAnimationImgSelected {
                    0% {
                        margin-top: 0;
                        margin-bottom: 0;
                    }

                    50% {
                        margin-top: -3px;
                        margin-bottom: 3px;
                    }

                    100% {
                        margin-top: 0;
                        margin-bottom: 0;
                    }
                }
                
                .a-tip-block {
                    z-index: 1000000;
                    position: fixed;
                    top: 0px;
                    left: 50%;
                    translate: -50% 0;
                }

                .a-tip-block .a-tip-content {
                    margin-top: 15px;
                    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.15);
                    border-radius: 1px;
                }

                .a-tip-block .a-content {
                    font-size: 14px;
                    max-width: 300px;
                    word-break: break-all;
                    padding: 10px 15px 6px 15px;
                }


                .a-tip-block .a-tip {
                    background-color: #71bfff;
                    color: #fff;
                    border: 1px solid #66abe4;
                }

                .a-tip-block .a-tip-bar {
                    height: 4px;
                    background-color: #66abe4;
                }

                .a-tip-block .a-info {
                    color: #555555;
                    background-color: #e6e6e6;
                    border: 1px solid #a3a3a3;
                }

                .a-tip-block .a-info-bar {
                    height: 4px;
                    background-color: #a3a3a3;
                }

                .a-tip-block .a-success {
                    color: #ffffff;
                    background-color: #68ca75;
                    border: 1px solid #4f9959;
                }

                .a-tip-block .a-success-bar {
                    height: 4px;
                    background-color: #4f9959;
                }

                .a-tip-block .a-warn {
                    color: #ffffff;
                    background-color: #dfab3b;
                    border: 1px solid #ad852f;
                }

                .a-tip-block .a-warn-bar {
                    height: 4px;
                    background-color: #ad852f;
                }

                .a-tip-block .a-danger {
                    color: #ffffff;
                    background-color: #ee5d5d;
                    border: 1px solid #b34646;
                }

                .a-tip-block .a-danger-bar {
                    height: 4px;
                    background-color: #b34646;
                }


                @keyframes slideOut {
                    0% {
                        transform: translateY(0px);
                        opacity: 1;
                    }

                    100% {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                }

                .slideOut {
                    animation: slideOut 0.25s ease forwards;
                }   
                    
                .a-float-title-shower {
                    border-radius: 3px;
                    display: none;
                    position: fixed;
                    padding: 10px;
                    padding-bottom: 5px;
                    padding-top: 5px;
                    background-color: #fff;
                    font-size: 12px;
                    color: #333333;
                    z-index: 100000;
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15);
                    border: 1px solid #d1d1d1;
                }
                `
    //加载基础样式
    let style = document.createElement("style")
    style.innerText = baseStyle
    document.body.appendChild(style)
}

function loadSearchContentData() {
    for (var key in SearchContent) {
        delete SearchContent[key]
    }

    fetch(BaseCmsURL + `/data/searchContent.json?` + Date.now())
        .then(response => response.json())
        .then(data => {
            for (var key in data) {
                SearchContent[key] = data[key]
            }
            localStorage.setItem("SEARCHCONTENTDATA", JSON.stringify(SearchContent))
        }).catch(error => {
            console.error(error)
        });
}

function loadBaseData() {
    // 提前从localstorage中加载数据
    if (local) {
        const checkModify = () => {
            try {
                fetch(BaseCmsURL + `/ModifyDate.json?` + Date.now())
                    .then(response => response.json())
                    .then(data => {
                        //未记录缓存时间则直接清空缓存
                        if (localStorage.getItem("CACHEDATE") == null) {
                            localStorage.clear()
                            localStorage.setItem("CACHEDATE", Date.now())
                        } else {
                            let date = localStorage.getItem("CACHEDATE") * 1
                            //缓存时间早于上次修改时间，清空缓存
                            if (date < data.date) {
                                localStorage.clear()
                            } else {
                                //同步缓存时间
                                localStorage.setItem("CACHEDATE", Date.now())
                                if (localStorage.getItem("CACHEDATA") != null) {
                                    if (localStorage.getItem("CACHEDATA")) {
                                        let listData = JSON.parse(localStorage.getItem("CACHEDATA"))
                                        listData.forEach(item => {
                                            CacheMap.set(item.id, item.data)
                                        })
                                    }
                                    if (localStorage.getItem("SEARCHCONTENTDATA")) {
                                        let data = JSON.parse(localStorage.getItem("SEARCHCONTENTDATA"))
                                        for (var key in data) { SearchContent[key] = data[key] }
                                    }
                                }
                            }
                        }
                        loadCustomElements()
                    })
            } catch (error) {
                console.error("cms error:can't load ModifyDate.json , skip verify data , load Cms elements")
                loadCustomElements()
            }

        }
        checkModify()
    } else {
        loadCustomElements()
    }
}

//加载节点数据
function loadNodeData(id, fun) {
    loadData(id, "node", fun)
}

//加载列表数据
function loadListData(id, fun) {
    loadData(id, "list", fun)
}

//加载数据实体
function loadData(id, type, fun) {
    if (CacheMap.has(id)) {
        fun(CacheMap.get(id))
    } else {

        fetch(BaseCmsURL + `/data/${type}/${id}.json?` + Date.now())
            .then(response => response.json())
            .then(data => {
                CacheMap.set(id, data)
                if (local) {
                    let listData = []
                    if (localStorage.getItem("CACHEDATA") != null) {
                        listData = JSON.parse(localStorage.getItem("CACHEDATA"))
                    }
                    listData.push({
                        dataId: data.id,
                        data: data
                    })
                    localStorage.setItem("CACHEDATA", JSON.stringify(listData))
                }
                fun(data)
            }).catch(error => {
                console.error(error)
            });
    }
}


//生命周期
const lifeCycle = new class LifeCycle {
    constructor() {
        this.registerNode = new Set()
        this.lifeCycle = null
    }

    // 所有需要加载的组件在加载前需在此方法注册
    register(node) {
        this.registerNode.add(node)
    }

    //所有需要加载的组件在加载完成后需在此方法注销
    signOut(node) {
        setTimeout(() => {
            if (this.registerNode.has(node)) {
                this.registerNode.delete(node)
            }
            if (this.registerNode.size == 0) {
                this.done()
            }
        }, 100);
    }

    // 在所有组件加载完毕后加载此方法
    done() {
        const cmsEvent = new Event('cms');
        document.dispatchEvent(cmsEvent);
    }
}

// 加载localstorage至CacheMap
if (local) {
    let localstorageListData = localStorage.getItem("CACHEDATA")
    if (localstorageListData != null) {
        const cacheData = JSON.parse(localstorageListData)
        cacheData.forEach(item => {
            CacheMap.set(item.dataId, item.data)
        })
    }
}

function toPage(url) {
    window.location.href = url
}

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

//创建基础dom元素
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
    element["txt"] = (text) => {
        element.innerText = text
        return element
    }
    element["add"] = (ele) => {
        element.appendChild(ele)
        return element
    }
    element["show"] = (display) => {
        if (display == null) {
            element.style.display = "block"
        } else {
            element.style.display = display
        }
    }
    element["hide"] = () => {
        element.style.display = "none"
    }
    element["val"] = (val) => {
        element.value = val
        return element
    }
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
    }
    dom["hide"] = () => {
        dom.style.display = "none"
    }
    dom["val"] = (val) => {
        dom.value = val
    }
    dom["txt"] = (text) => {
        dom.innerText = text
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
        this.tip.style.zIndex = this.getMaxZIndex() + 1
        this.tip.innerText = str
        this.tip.style.display = "block"

    }
    getMaxZIndex() {
        let maxZIndex = 0; // 初始化最大zIndex为0
        const elements = document.querySelectorAll('*'); // 选择页面中的所有元素

        elements.forEach((element) => {
            const zIndex = window.getComputedStyle(element).zIndex; // 获取元素的z-index样式

            if (!isNaN(zIndex)) { // 检查z-index是否为有效数字
                maxZIndex = Math.max(maxZIndex, parseInt(zIndex, 10)); // 更新最大zIndex
            }
        });

        return maxZIndex;
    }
    hideTip(str) {
        this.tip.style.display = "none"
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


class CmsElement extends HTMLElement {
    constructor() {
        super()
        this.dataIdTemp
    }

    set dataId(value) {
        this.dataIdTemp = value
        this.dataIdChange()
        this.loadAttributeTags()
    }

    dataIdChange() { }

    initDataId() {
        let dataId = null
        //dataId的优先级，this.getAttribute("data") > parentNode(cms-component).dataId > window.location.url.dataId > this.getAttribute("dev")
        dataId = this.getAttribute("dev")
        // 获取地址栏中的参数
        const urlParams = new URLSearchParams(window.location.search);
        const urlDataId = urlParams.get('dataId');
        if (urlDataId != null) {
            dataId = urlDataId
        }
        let cmsComponentId = this.getCmsComponentId(this.parentNode)
        if (cmsComponentId != null) {
            dataId = cmsComponentId
        }
        if (this.getAttribute("data") != null) {
            dataId = this.getAttribute("data")
        }
        if (dataId)
            this.dataId = dataId
    }


    getCmsComponentId(parent) {
        if (parent.tagName == "BODY" || parent.tagName == "CMS-LIST") return null
        if (parent.tagName != "CMS-COMPONENT") {
            return this.getCmsComponentId(parent.parentNode)
        } else if (parent.tagName == "CMS-COMPONENT") {
            return parent.getAttribute("data")
        }
    }

    // 当前页面的dataId和组件保持一致时触发绑定的方法
    loadAttributeTags() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlDataId = urlParams.get('dataId');
        this.loadFocusClass(this, urlDataId)
    }

    //加载子标签中的focus:class
    //加载范围：cms-list 、 cms-node
    loadFocusClass(dom, urlDataId) {
        if (dom.tagName == "CMS-LIST" && dom != this) {
            return
        } else if (["LIST-PARENT", "LIST-LIST"].includes(dom.tagName)) {
            if (dom.getAttribute && dom.getAttribute("focus:class") != null && this.dataId == urlDataId) {
                dom.classList.add(dom.getAttribute("focus:class"))
            }
            return
        } else {
            if (dom.getAttribute && dom.getAttribute("focus:class") != null && this.dataId == urlDataId) {
                dom.classList.add(dom.getAttribute("focus:class"))
            }
            Array.from(dom.childNodes).forEach(item => {
                this.loadFocusClass(item, urlDataId)
            })
        }
    }

    get dataId() {
        return this.dataIdTemp
    }
}

//cms组件元素
class CmsComponent extends CmsElement {
    constructor() {
        super()
        this.init()
    }

    init() {
        let url = this.getAttribute("url")
        if (url != null) {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(data => {
                    this.innerHTML = data
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        }
        if (this.getAttribute("data")) this.dataId = this.getAttribute("data")
    }
}


//cms-list list-node 中的翻页元素，需放置在最外层
class NodePagination extends CmsElement {
    constructor() {
        super()
        this.refs
        this.pageTem
        this.limitTem
        this.totalTem
        this.buttonNumTem
        this.init = false
    }

    connectedCallback() {
        if (this.init) return
        this.init = true
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
				<input ref="jumpInput" style="margin-right:10px;width:unset;width:40px;" min="1">
				<button ref="jumpButton">跳转</button>
			</div>
		</div>`)
        this.appendChild(element.element)
        this.refs = element.children
        this.refs.jumpInput.value = this.pageTem
        if (this.getAttribute("type") == "mini") {
            this.refs.setting.style.display = "none"
        }
    }

    initPageElementData() {
        this.refs.pageBlock.innerHTML = ''
        let pageList = this.generatePaginationIndexes()
        pageList.forEach((page, index) => {
            let button = dc("button")
            button.txt(page)
            if (page == this.pageTem) button.classList.add("select")
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
        this.refs.jumpInput.value = this.pageTem
    }

    initRefsFunction() {
        this.refs.last.onclick = () => {
            if (this.page == 1) return
            this.page = this.pageTem - 1
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

    }

    onchange(e) {
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
    }

    get total() {
        return this.totalTem
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
        this.onchange({
            total: this.totalTem,
            page: this.pageTem,
            limit: this.limitTem
        })
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
        for (let i = startPage; i <= endPage; i++) pageIndexes.push(i);
        if (pageIndexes[0] > 1) pageIndexes.unshift(1)
        if (pageIndexes[pageIndexes.length - 1] < Math.ceil(this.totalTem / this.limitTem)) pageIndexes.push(Math
            .ceil(this.totalTem / this.limitTem))
        return pageIndexes;
    }
}

//list-封面，可以直接当作img使用
class ListCover extends CmsElement {
    constructor() {
        super()
        this.srcTemp
        this.img
    }

    set src(value) {
        this.srcTemp = value
        let url = value.substring(0, 4) == "http" ? value : BaseCmsURL + value
        if (localStorage.getItem(url) != null) {
            this.img.src = localStorage.getItem(url)
        } else {
            this.img.src = url
            this.img.onload = (e) => {
                this.loadImgToLocalStorage(this.img)
            }
        }
    }

    get src() {
        return this.srcTemp
    }

    dataIdChange() {
        if (!this.img) {
            this.img = document.createElement("img")
            this.classList.forEach(item => {
                this.img.classList.add(item)
            })
            this.img.style = this.getAttribute("style")
            this.parentNode.insertBefore(this.img, this)
            this.parentNode.removeChild(this)
            this.img['CMS_COVER'] = true
            this.img["dataId"] = (dataId) => {
                this.dataId = dataId
            }
        }
        loadListData(this.dataId, (data) => {
            this.src = data.cover
        })
    }

    async loadImgToLocalStorage(imgElement) {
        try {
            const response = await fetch(imgElement.src);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const fileSizeInBytes = blob.size;
            if (fileSizeInBytes < 1024 * 20) {
                const canvas = document.createElement('canvas');
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
                const base64String = canvas.toDataURL('image/png'); // 默认输出为 png 格式，可以根据需要修改
                localStorage.setItem(imgElement.src, base64String)
            }
        } catch (error) {
            console.error('Error fetching the image:', error);
        }
    }
}



//list-封面，可以直接当作img使用
class ListName extends CmsElement {
    constructor() {
        super()
        this.dataTemp
    }

    set data(value) {
        this.dataTemp = value
        if (this.getAttribute("en") != null) {
            this.innerText = value.enName
        } else {
            this.innerText = value.name
        }
    }

    get data() {
        return this.dataTemp
    }
}

class ListParent extends CmsElement {
    constructor() {
        super()
    }
}

class ListTemplate extends CmsElement {
    constructor() {
        super()
    }
}

class ListList extends CmsElement {
    constructor() {
        super()
    }
}

class ListNode extends CmsElement {
    constructor() {
        super()
        this.dataIdTemp
        this.dataTemp
        this.childTemp = []
        this.pagination = null
    }

    set data(value) {
        console.log(value);

        this.dataTemp = value
    }

    get data() {
        return this.dataTemp
    }

    set dataId(value) {
        this.dataIdTemp = value
        this.loadNodes()
    }

    get dataId() {
        return this.dataIdTemp
    }

    loadNodes() {
        let pagination = null
        Array.from(this.getElementsByTagName("LIST-PAGINATION")).forEach(item => {
            if (pagination != null) return
            this.pagination = item
            pagination = item
            pagination.dataId = this.dataId
            //向上遍历，将翻页组件的最大父组件提取出来
            this.pagination = this.getPaginationParent(this.pagination)
            this.removeChild(this.pagination)
        })
        if (!this.initChildTemp) {
            this.initChildTemp = true
            Array.from(this.childNodes).forEach(item => {
                this.childTemp.push(item)
            })
            this.childTemp.forEach(item => {
                this.removeChild(item)
            })
        }

        let ids = JSON.parse(JSON.stringify(this.data.nodeId))
        ids = ids.filter(id => {
            return id.publish
        })
        if (this.getAttribute("order") != null || this.getAttribute("top") != null) {
            // 根据日期正向排序
            if (this.getAttribute("order") == "desc" || this.getAttribute("order") == "") {
                for (let a = 0; a < ids.length; a++) {
                    for (let b = 0; b < ids.length; b++) {
                        if (this.convertToMillis(ids[a].date) > this.convertToMillis(ids[b].date)) {
                            let temp = ids[a]
                            ids[a] = ids[b]
                            ids[b] = temp
                        }
                    }
                }
            } else if (this.getAttribute("order") == "asc") { // 根据日期反向排序
                for (let a = 0; a < ids.length; a++) {
                    for (let b = 0; b < ids.length; b++) {
                        if (this.convertToMillis(ids[a].date) < this.convertToMillis(ids[b].date)) {
                            let temp = ids[a]
                            ids[a] = ids[b]
                            ids[b] = temp
                        }
                    }
                }
            }
            if (this.getAttribute("top") != null) {
                let top = []
                for (let a = ids.length - 1; a >= 0; a--) {
                    if (ids[a].top) {
                        top.push(ids[a])
                        ids.splice(a, 1)
                    }
                }
                top.forEach(item => {
                    ids.unshift(item)
                })
            }
        }
        let page
        let limit

        if (pagination == null) {
            page = this.getAttribute("page") * 1
        } else if (pagination != null && this.getAttribute("newpage") != null) {
            const urlParams = new URLSearchParams(window.location.search);
            page = urlParams.get('page') * 1;
        } else {
            page = pagination.page
        }
        if (page == null || page == "") page = 1
        limit = this.getAttribute("limit") * 1

        if (page > Math.ceil(ids.length / limit)) {
            page = Math.ceil(ids.length / limit)
        }
        let start, end
        if (page != null && limit != null && page != 0 && limit != 0) {
            start = (page - 1) * limit
            end = page * limit
        } else {
            start = 0
            end = ids.length
        }

        this.innerHTML = ""
        for (let a = start; a < end; a++) {
            if (ids[a] == null) break
            let cmsNodeElement = document.createElement("cms-node")
            this.childTemp.forEach(item => {
                cmsNodeElement.appendChild(item.cloneNode(true))
            })
            if (this.getAttribute("top") != null) cmsNodeElement.setAttribute("top", true)
            cmsNodeElement.setAttribute("data", ids[a].id)
            this.appendChild(cmsNodeElement)
        }
        if (pagination != null) {
            this.appendChild(this.pagination)
            // 初始化翻页组件，只运行一次
            if (!this.initPagination) {
                this.initPagination = true
                pagination.page = page
                pagination.limit = limit
                pagination.total = ids.length
                pagination.onchange = (e) => {
                    if (this.getAttribute("newpage") != null) {
                        if (this.data.template != null && this.data.template != "") toPage("/" + this.data
                            .template + ".html?dataId=" + this.data.id + "&page=" + e.page)
                    } else {
                        this.setAttribute("page", e.page)
                        this.loadNodes()
                    }
                }
            }
        }
    }

    convertToMillis(dateString) {
        return new Date(dateString).getTime();
    }

    getPaginationParent(pagination) {
        if (pagination.parentNode.tagName == "LIST-NODE") {
            return pagination
        } else {
            return this.getPaginationParent(pagination.parentNode)
        }
    }
}

class SliderPrev extends CmsElement {
    constructor() {
        super()
        console.log(this.tagName);

    }
}
class SliderNext extends CmsElement {
    constructor() {
        super()
    }
}
// cms-list 样式
class CmsList extends CmsElement {
    constructor() {
        super()
        this.ifIndexing = false //数据是否正在排序
        this.ifIndex = false //数据是否已经进行过排序
        lifeCycle.register(this)
    }

    // 在元素被加载到文档中后加载
    connectedCallback() {
        this.initDataId()
        if (this.dataId != null && this.dataId != "") {
            loadListData(this.dataId, (data) => {
                this.data = data
                if (this.getAttribute("pagetitle") != null) {
                    document.title = data.name
                }
                this.loadElement()
            })
        }
    }



    //加载子元素
    loadElement() {
        this.loadName()
        this.loadNodeSize()
        this.loadNote()
        this.loadCover()
        this.loadListList()
        this.loadListNode()
        this.loadListTemplate()
        this.loadListParent()
        this.loadListSubmit()
        // 确认父类，当父类为list-parent或者list-list时，则将自身children移动到父类中
        this.confirmParent()
        lifeCycle.signOut(this)
    }
    loadNodeSize() {
        Array.from(this.children).forEach(item => {
            this.verifyListNodeSize(item)
        })
    }
    verifyListNodeSize(node) {
        if (node.tagName == "CMS-LIST" || node.tagName == "LIST-LIST" || node.tagName == "LIST-PARENT") return
        if (node.tagName == "LIST-NODE-SIZE") {
            node.data = this.data
            node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyListNodeSize(item)
        })
    }


    // 加载元素中的所有title标签
    loadCover() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeCover(item)
        })
    }

    verifyNodeCover(node) {
        if (node.tagName == "LIST-LIST") return
        if (node.tagName == "LIST-COVER" || node.CMS_COVER == true) {
            if (node.CMS_COVER) {
                node.dataId(this.dataId)
            } else
                node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeCover(item)
        })
    }

    //确认父元素 当父元素为list-list时，则将cms-list标签移除
    confirmParent() {
        if (this.getAttribute("remove") == "true") {
            Array.from(this.childNodes).forEach(item => {
                this.parentNode.insertBefore(item, this)
            })
            if (this.parentNode != null) {
                this.parentNode.removeChild(this)
            }
        }
    }

    loadListParent() {
        Array.from(this.children).forEach(item => {
            this.verifyListParent(item)
        })
    }

    verifyListParent(node) {
        if (node.tagName == "CMS-LIST" || node.tagName == "LIST-LIST") return
        if (node.tagName == "LIST-PARENT") {
            node.dataId = this.dataId
            this.initListParent(node)
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyListParent(item)
        })
    }

    initListParent(node) {
        let parentNode = document.createElement("cms-list")
        parentNode.setAttribute("remove", "true")
        parentNode.setAttribute("data", this.data.parentId)
        let childTemp = []
        Array.from(node.childNodes).forEach(item => {
            childTemp.push(item)
        })
        Array.from(node.childNodes).forEach(item => {
            node.removeChild(item)
        })
        childTemp.forEach(item => {
            parentNode.appendChild(item)
        })
        node.appendChild(parentNode)
    }


    loadListTemplate() {
        Array.from(this.children).forEach(item => {
            this.verifyListTemplate(item)
        })
    }

    verifyListTemplate(node) {
        if (node.tagName == "CMS-LIST" || node.tagName == "LIST-LIST" || node.tagName == "LIST-PARENT") return
        if (node.tagName == "LIST-TEMPLATE") {
            node.dataId = this.dataId
            this.initListTemplate(node)
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyListTemplate(item)
        })
    }

    initListTemplate(node) {
        node.onclick = () => {
            let url = this.data.template
            if (url != null && url != "") {
                if (node.getAttribute("newpage") != null) {
                    if ((url + "").substring(0, 4) == "http") {
                        window.open(url, '_blank');
                    } else {
                        window.open("/" + url + ".html?dataId=" + this.data.id, '_blank');
                    }
                } else {
                    if ((url + "").substring(0, 4) == "http") {
                        toPage(url)
                    } else {
                        toPage("/" + url + ".html?dataId=" + this.data.id)
                    }

                }
            }
        }
    }

    loadListNode() {
        Array.from(this.children).forEach(item => {
            this.verifyListNode(item)
        })
    }

    verifyListNode(node) {
        if (node.tagName == "CMS-LIST" || node.tagName == "LIST-LIST" || node.tagName == "LIST-PARENT") return
        if (node.tagName == "LIST-NODE") {
            node.data = this.data
            node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyListNode(item)
        })
    }


    loadListList() {
        Array.from(this.children).forEach(item => {
            this.verifyListList(item)
        })
    }

    verifyListList(node) {
        if (node.tagName == "CMS-LIST" || node.tagName == "LIST-PARENT") return
        if (node.tagName == "LIST-LIST") {
            node.dataId = this.dataId
            this.initListList(node)
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyListList(item)
        })
    }

    initListList(node) {
        // 当需要进行排序显示列表时需要先将列表进行排序后再加载
        if (node.getAttribute("index") != null) { //数据并未进行排序
            if (!this.ifIndexing) {
                this.indexListData()
                this.addEventListener("_indexevent", () => {
                    this.loadListListElementIndex(node)
                })
            } else if (this.ifIndex) { //数据正在进行排序
                this.addEventListener("_indexevent", () => {
                    this.loadListListElementIndex(node)
                })
            } else { //数据已排序
                this.loadListListElementIndex(node)
            }
        } else {
            this.loadListListElement(node)
        }
    }

    //将数据进行排序
    indexListData() {
        this.ifIndexing = true
        this.loadListDataToLoadIndex(0)
    }

    loadListDataToLoadIndex(index) {
        this.loadListData((data) => {
            this.data.list.push(data)
            index++
            if (index == this.data.listId.length) {
                this.loadListDataDone()
            } else {
                this.loadListDataToLoadIndex(index)
            }
        }, this.data.listId[index])
    }

    //数据加载完毕
    //对数据进行排序
    loadListDataDone() {
        for (let a = 0; a < this.data.list.length; a++) {
            for (let b = 0; b < this.data.list.length; b++) {
                if (this.data.list[a].index < this.data.list[b].index) {
                    let temp = this.data.list[a]
                    this.data.list[a] = this.data.list[b]
                    this.data.list[b] = temp
                }
            }
        }

        let _indexEvent = new CustomEvent('_indexevent', {
            bubbles: false, // 事件是否冒泡
            composed: false, // 事件是否可以穿透Shadow DOM
        });

        // 触发加载list事件
        this.dispatchEvent(_indexEvent);
    }

    loadListListElementIndex(node) {
        let childTemp = []
        Array.from(node.childNodes).forEach(item => {
            childTemp.push(item)
        })
        childTemp.forEach(item => {
            node.removeChild(item)
        })
        let page = node.getAttribute("page") * 1
        let limit = node.getAttribute("limit") * 1
        let start, end
        if (page != null && limit != null && page != 0 && limit != 0) {
            start = (page - 1) * limit
            end = page = limit
        } else {
            start = 0
            end = this.data.listId.length
        }

        for (let a = start; a < end; a++) {
            if (this.data.list[a] == null) break
            let cmsListEmlement = document.createElement("cms-list")
            childTemp.forEach(item => {
                cmsListEmlement.appendChild(item.cloneNode(true))
            })
            cmsListEmlement.setAttribute("data", this.data.list[a].id)
            node.appendChild(cmsListEmlement)
        }
    }

    loadListListElement(node) {
        let childTemp = []
        Array.from(node.childNodes).forEach(item => {
            childTemp.push(item)
        })
        childTemp.forEach(item => {
            node.removeChild(item)
        })
        let page = node.getAttribute("page") * 1
        let limit = node.getAttribute("limit") * 1
        let start, end
        if (page != null && limit != null && page != 0 && limit != 0) {
            start = (page - 1) * limit
            end = page = limit
        } else {
            start = 0
            end = this.data.listId.length
        }

        for (let a = start; a < end; a++) {
            if (this.data.listId[a] == null) break
            let cmsListEmlement = document.createElement("cms-list")
            cmsListEmlement.setAttribute("remove", "true")
            childTemp.forEach(item => {
                cmsListEmlement.appendChild(item.cloneNode(true))
            })
            cmsListEmlement.setAttribute("data", this.data.listId[a])
            node.appendChild(cmsListEmlement)
        }
    }

    // 加载元素中的所有name标签
    loadName() {
        Array.from(this.children).forEach(item => {
            this.verifyListName(item)
        })
    }

    verifyListName(node) {
        if (node.tagName == "CMS-LIST" || node.tagName == "LIST-LIST" || node.tagName == "LIST-PARENT") return
        if (node.tagName == "LIST-NAME") {
            node.data = this.data
            node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyListName(item)
        })
    }

    // 加载元素中的所有提交表单
    loadListSubmit() {
        Array.from(this.children).forEach(item => {
            this.verifyListSubmit(item)
        })
    }

    verifyListSubmit(node) {
        if (node.tagName == "CMS-LIST" || node.tagName == "LIST-LIST" || node.tagName == "LIST-PARENT") return
        if (node.tagName == "LIST-SUBMIT") {
            node.data = this.data
            node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyListSubmit(item)
        })
    }
    // 加载元素中的所有name标签
    loadNote() {
        Array.from(this.children).forEach(item => {
            this.verifyListNote(item)
        })
    }

    verifyListNote(node) {
        if (node.tagName == "CMS-LIST" || node.tagName == "LIST-LIST" || node.tagName == "LIST-PARENT") return
        if (node.tagName == "LIST-NOTE") {
            node.innerText = this.data.note
            node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyListNote(item)
        })
    }
}

class ListNote extends CmsElement {

}

class ListsNodeSize extends CmsElement {
    constructor() {
        super()
    }

    set data(value) {
        this.dataTemp = value
        this.innerText = value.nodeId.length
    }

    get data() {
        return this.dataTemp
    }
}
//node-封面，可以直接当作img使用
class NodeCover extends CmsElement {
    constructor() {
        super()
        this.srcTemp
        this.img = null
    }

    set src(value) {
        this.srcTemp = value
        let url = value.substring(0, 4) == "http" ? value : BaseCmsURL + value
        if (localStorage.getItem(url) != null) {
            this.img.src = localStorage.getItem(url)
        } else {
            if (this.img) {
                if (this.getAttribute("quality")) {
                    url = url.replace("imgQuality_1", "imgQuality_" + this.getAttribute("quality"))
                }
                this.img.src = url

                this.img.onload = (e) => {
                    this.loadImgToLocalStorage(this.img)
                }
            } else {
                this.connectedCallback()
                this.src = value
            }
        }
    }

    get src() {
        return this.srcTemp
    }

    dataIdChange() {
        if (!this.img) {
            this.img = document.createElement("img")
            this.classList.forEach(item => {
                this.img.classList.add(item)
            })
            this.img.style = this.getAttribute("style")
            this.parentNode.insertBefore(this.img, this)
            this.parentNode.removeChild(this)
            this.img['CMS_COVER'] = true
            this.img["dataId"] = (dataId) => {
                this.dataId = dataId
            }
        }
        loadNodeData(this.dataId, (data) => {
            this.src = data.cover
        })
    }

    async loadImgToLocalStorage(imgElement) {
        try {
            const response = await fetch(imgElement.src);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const fileSizeInBytes = blob.size;
            if (fileSizeInBytes < 1024 * 20) {
                const canvas = document.createElement('canvas');
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
                const base64String = canvas.toDataURL('image/png'); // 默认输出为 png 格式，可以根据需要修改
                localStorage.setItem(imgElement.src, base64String)
            }
        } catch (error) {
            console.error('Error fetching the image:', error);
        }
    }
}


//node-日期
class NodeDate extends CmsElement {
    constructor() {
        super()
    }

    dataIdChange() {
        loadNodeData(this.dataId, (data) => {
            if (this.getAttribute("format"))
                this.innerText = this.formatTime(data.date, this.getAttribute("format"))
            else
                this.innerText = data.date
        })
    }

    formatTime(timeStr, format) {
        const date = new Date(timeStr)
        let year = date.getFullYear() > 9 ? date.getFullYear() : "0" + date.getFullYear()
        let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
        let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
        let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
        let minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
        let second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()
        format = format.replaceAll("YYYY", year)
        format = format.replaceAll("YY", (year + "").substring(2, 4))
        format = format.replaceAll("yyyy", year)
        format = format.replaceAll("yy", (year + "").substring(2, 4))
        format = format.replaceAll("MM", month)
        format = format.replaceAll("DD", day)
        format = format.replaceAll("dd", day)
        format = format.replaceAll("HH", hour)
        format = format.replaceAll("hh", hour)
        format = format.replaceAll("mm", minute)
        format = format.replaceAll("SS", second)
        format = format.replaceAll("ss", second)
        return format;
    }
}

//node-内容 异步加载
class NodeContent extends CmsElement {
    constructor() {
        super()
        this.dataId
    }

    dataIdChange() {
        this.loadContent()
    }

    loadContent() {
        fetch(BaseCmsURL + `/data/content/${this.dataId}.json?` + Date.now())
            .then(response => response.json())
            .then(data => {
                this.innerHTML = data.content
                Array.from(this.getElementsByTagName("IMG")).forEach(item => {
                    if (item.getAttribute("src").substring(0, 4) != "http") {
                        item.src = BaseCmsURL + item.getAttribute("src")
                    }
                })
                this.initAttribute()
            }).catch(error => {
                console.error(error)
            });
    }

    initAttribute() {
        let emptyLine = 0
        Array.from(this.children).forEach(item => {
            let innerText = item.innerText
            innerText = innerText.replaceAll(" ", '')
            if (innerText === "" || innerText == "\n") {
                item["cmsIsEmptyLine"] = true
                emptyLine++
            } else {
                item["cmsIsEmptyLine"] = false
            }
        })
        if (emptyLine == Array.from(this.children).length && this.getAttribute("empty") != null && this.getAttribute("empty") != "") {
            this.innerText = this.getAttribute("empty")
            return
        }

        if (this.getAttribute("line") != null && this.getAttribute("line") != "") {
            let line = this.getAttribute("line") * 1
            if (isNaN(line)) return
            this.style = this.getAttribute("style") + `display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: ${line};overflow: hidden;`
            let showLine = []
            Array.from(this.children).forEach((item, index) => {
                if (this.getAttribute("line:medium") == "false") {
                    if (index < line) {
                        let imgs = item.getElementsByTagName('IMG');
                        if (!imgs) return
                        Array.from(imgs).forEach(img => {
                            let imgStr = document.createElement("span")
                            imgStr.innerText = "【图片】"
                            img.parentNode.insertBefore(imgStr, img)
                            img.parentNode.removeChild(img)
                        })
                        let videos = item.getElementsByTagName('VIDEO');
                        if (!videos) return
                        Array.from(videos).forEach(videos => {
                            let videosStr = document.createElement("span")
                            videosStr.innerText = "【视频】"
                            videos.parentNode.insertBefore(videosStr, videos)
                            videos.parentNode.removeChild(videos)
                        })
                        item.style.display = "block"
                        showLine.push(item)
                    } else {
                        item.parentNode.removeChild(item)
                    }
                } else {
                    if (index < line) {
                        showLine.push(item)
                        item.style.display = "block"
                    } else {
                        item.parentNode.removeChild(item)
                    }
                }
            })
            let innerText = ""
            showLine.forEach(item => {
                innerText = innerText + item.innerText
            })
            this.innerText = innerText
        }
    }
}

//node-外链
class NodeLink extends CmsElement {
    constructor() {
        super()
        this.linkTem
        this.init()
    }

    set link(value) {
        this.linkTem = value
    }

    get link() {
        return this.linkTem
    }

    init() {
        this.onclick = () => {
            if (this.link != null && this.link != "" && this.getAttribute("newpage") == null) {
                toPage(this.link)
            } else if (this.link != null && this.link != "" && this.getAttribute("newpage") != null) {
                window.open(this.link)
            }
        }
    }
}

//node-文件下载
class NodeFile extends CmsElement {
    constructor() {
        super()
        this.data
    }


    connectedCallback() {
        if (this.getAttribute("name") == 'title') {
            this.innerText = this.data.title
        } else {
            this.innerText = this.data.fileName
        }
        this.onclick = () => {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = this.data.fileName;
            a.href = this.data.file.substring(0, 4) == "http" ? this.data.file : BaseCmsURL + this.data.file;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}


class NodePrev extends CmsElement {
    constructor() {
        super()
        this.nowIdTem
        this.listIdTem
        this.listData
    }

    init() {
        if (this.listId == null) return
        loadListData(this.listId, (data) => {
            this.listData = data
            this.loadButton()
        })
    }

    loadButton() {
        let index = 0
        this.listData.nodeId.forEach((item, i) => {
            if (item.id == this.nowId) {
                index = i
                return
            }
        })
        index++
        if (index == this.listData.nodeId.length) {
            this.innerText = '没有了'
        } else {
            loadNodeData(this.listData.nodeId[index].id, (data) => {
                this.innerText = data.title
            })
            this.onclick = () => {
                toPage("/" + this.listData.nodeTemplate + ".html?dataId=" + this.listData.nodeId[index].id)
            }

        }

    }

    set nowId(value) {
        this.nowIdTem = value
        this.init()
    }

    get nowId() {
        return this.nowIdTem
    }

    set listId(value) {
        this.listIdTem = value
    }

    get listId() {
        return this.listIdTem
    }
}

class NodeParent extends CmsElement {
}

class NodeNext extends CmsElement {
    constructor() {
        super()
        this.nowIdTem
        this.listIdTem
        this.listData
    }

    init() {
        if (this.listId == null) return
        loadListData(this.listId, (data) => {
            this.listData = data
            this.loadButton()
        })
    }

    loadButton() {
        let index = 0
        this.listData.nodeId.forEach((item, i) => {
            if (item.id == this.nowId) {
                index = i
                return
            }
        })


        index--
        if (index < 0) {
            this.innerText = '没有了'
        } else {
            loadNodeData(this.listData.nodeId[index].id, (data) => {
                this.innerText = data.title
            })

            this.onclick = () => {
                toPage("/" + this.listData.nodeTemplate + ".html?dataId=" + this.listData.nodeId[index].id)
            }

        }
    }

    set nowId(value) {
        this.nowIdTem = value
        this.init()
    }

    get nowId() {
        return this.nowIdTem
    }

    set listId(value) {
        this.listIdTem = value
    }

    get listId() {
        return this.listIdTem
    }
}

//cms-node基础组件
class CmsNode extends CmsElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.initDataId()
    }

    dataIdChange() {
        if (this.dataId != null && this.dataId != "") {
            loadNodeData(this.dataId, (data) => {
                this.data = data
                if (this.getAttribute("pagetitle") != null) {
                    document.title = data.title
                }
                this.loadElement()
            })
        }
    }

    loadElement() {
        this.loadTitle()
        this.loadDate()
        this.loadNote()
        if (this.getAttribute("top") != null) this.loadTop()
        this.loadClicks()
        this.loadCover()
        this.loadTemplate()
        this.loadContent()
        this.loadLink()
        this.loadFile()
        this.loadParent()
        this.loadPrev() //加载跳转上一篇文章
        this.loadNext()
        // 确认父类，当父类为List-node时，则将自身children移动到父类中
        this.confirmParent(this.parentNode)
    }

    loadNext() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeNext(item)
        })
    }

    verifyNodeNext(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-NEXT") {
            node.dataId = this.dataId
            node.listId = this.data.parentId
            node.nowId = this.data.id
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeNext(item)
        })
    }

    loadPrev() {
        Array.from(this.children).forEach(item => {
            this.verifyNodePrev(item)
        })
    }

    verifyNodePrev(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-PREV") {
            node.dataId = this.dataId
            node.listId = this.data.parentId
            node.nowId = this.data.id
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodePrev(item)
        })
    }


    loadParent() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeParent(item)
        })
    }

    verifyNodeParent(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-PARENT") {
            node.dataId = this.dataId
            this.initNodeParent(node)
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeParent(item)
        })
    }

    initNodeParent(node) {
        let parentNode = document.createElement("cms-list")
        parentNode.setAttribute("remove", "true")
        parentNode.setAttribute("data", this.data.parentId)
        let childTemp = []
        Array.from(node.childNodes).forEach(item => {
            childTemp.push(item)
        })
        Array.from(node.childNodes).forEach(item => {
            node.removeChild(item)
        })
        childTemp.forEach(item => {
            parentNode.appendChild(item)
        })
        node.appendChild(parentNode)
    }

    // 加载元素中的所有title标签
    loadFile() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeFile(item)
        })
    }

    verifyNodeFile(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-FILE") {
            node.data = this.data
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeFile(item)
        })
    }

    // 加载元素中的所有title标签
    loadLink() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeLink(item)
        })
    }

    verifyNodeLink(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-LINK") {
            node.dataId = this.dataId
            node.link = this.data.link
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeLink(item)
        })
    }

    loadContent() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeContent(item)
        })
    }

    verifyNodeContent(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-CONTENT") {
            node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeContent(item)
        })
    }


    // 加载元素中的所有title标签
    loadTemplate() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeTemplate(item)
        })
    }

    verifyNodeTemplate(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-TEMPLATE") {
            node.dataId = this.dataId
            node.onclick = () => {
                let location = CacheMap.get(this.data.parentId).nodeTemplate
                if (location != null && location != "") toPage("/" + location + ".html?dataId=" + this.data.id)
            }
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeTemplate(item)
        })
    }


    confirmParent(parent) {
        if (parent == null || parent.tagName == "BODY") return
        if (parent.tagName == "LIST-NODE") {
            Array.from(this.children).forEach(item => {
                this.parentNode.insertBefore(item, this)
            })
            this.parentNode.removeChild(this)
        } else {
            this.confirmParent(parent.parentNode)
        }
    }

    // 加载元素中的所有title标签
    loadCover() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeCover(item)
        })
    }

    verifyNodeCover(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-COVER" || node.CMS_COVER) {
            if (node.CMS_COVER) {
                node.dataId(this.dataId)
            } else
                node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeCover(item)
        })
    }

    // 加载元素中的所有title标签
    loadClicks() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeClicks(item)
        })
    }

    verifyNodeClicks(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-CLICKS") {
            node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeClicks(item)
        })
    }

    // 加载元素中的所有title标签
    loadTop() {

        Array.from(this.children).forEach(item => {
            this.verifyNodeTop(item)
        })
    }

    verifyNodeTop(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-TOP") {
            node.dataId = this.dataId

            node.innerText = this.data.top ? "置顶" : ""
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeTop(item)
        })
    }

    // 加载元素中的所有title标签
    loadNote() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeNote(item)
        })
    }

    verifyNodeNote(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-NOTE") {
            node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeNote(item)
        })
    }


    // 加载元素中的所有title标签
    loadDate() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeDate(item)
        })
    }

    verifyNodeDate(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-DATE") {
            node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeDate(item)
        })
    }


    // 加载元素中的所有title标签
    loadTitle() {
        Array.from(this.children).forEach(item => {
            this.verifyNodeTitle(item)
        })
    }

    verifyNodeTitle(node) {
        if (node.tagName == "CMS-NODE") return
        if (node.tagName == "NODE-TITLE") {
            node.dataId = this.dataId
            return
        }
        Array.from(node.children).forEach(item => {
            this.verifyNodeTitle(item)
        })
    }


}

class NodeTitle extends CmsElement {
    constructor() {
        super()
    }

    connectedCallback() {
        if (this.getAttribute("line") != null && this.getAttribute("line") != "") {
            this.style = this.getAttribute("style") + `display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: ${this.getAttribute("line")};overflow: hidden;`
        }
    }

    dataIdChange() {
        loadNodeData(this.dataId, (data) => {
            this.innerText = data.title
        })
    }
}

class NodeNote extends CmsElement {
    constructor() {
        super()
    }

    connectedCallback() {
        if (this.getAttribute("line") != null && this.getAttribute("line") != "") {
            this.style = this.getAttribute("style") + `display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: ${this.getAttribute("line")};overflow: hidden;`
        }
    }

    dataIdChange() {
        loadNodeData(this.dataId, (data) => {
            this.innerText = data.note
        })
    }
}



class NodeClick extends CmsElement {
    constructor() {
        super()
    }

    dataIdChange() {
        loadNodeData(this.dataId, (data) => {
            this.innerText = data.clicks
        })
    }
}

class CmsSearchResult extends CmsElement {
    constructor() {
        super()
        this.result
        this.total
        this.pagination
    }

    connectedCallback() {
        this.loadSearch()
    }

    loadSearch() {
        let urlParams = new URLSearchParams(window.location.search);
        let searchContent = urlParams.get('search');
        let page = urlParams.get('page')
        if (page == null || page == "") page = 1
        let limit = this.getAttribute("limit")
        if (limit == null || limit == "") limit = 10
        this.result = []

        for (let key in SearchContent) {
            if (SearchContent[key].includes(searchContent)) {
                this.result.push(key)
            }
        }
        this.total = this.result.length
        this.result = this.result.slice((page - 1) * limit, page * limit)
        this.loadResult()
    }

    getPaginationParent(pagination) {
        if (pagination.parentNode.tagName == "CMS-SEARCH-RESULT") {
            return pagination
        } else {
            return this.getPaginationParent(pagination.parentNode)
        }
    }

    loadResult() {
        // Array.from(this.getElementsByTagName("LIST-PAGINATION")).forEach(item => {
        //     item = this.getPaginationParent(item)
        //     item.parentNode.removeChild(item)
        //     this.pagination = item
        // })
        let pagination
        Array.from(this.getElementsByTagName("LIST-PAGINATION")).forEach(item => {
            if (pagination != null) return
            this.pagination = item
            pagination = item
            pagination.dataId = this.dataId
            //向上遍历，将翻页组件的最大父组件提取出来
            this.pagination = this.getPaginationParent(this.pagination)
            this.removeChild(this.pagination)
        })

        let nodeTemp = []
        Array.from(this.childNodes).forEach(item => {
            nodeTemp.push(item)
            this.removeChild(item)
        })
        this.result.forEach(item => {
            let node = document.createElement("cms-node")
            node.setAttribute("data", item)
            nodeTemp.forEach(child => {
                node.appendChild(child.cloneNode(true))
            })
            this.appendChild(node)
        })
        if (this.result.length == 0) {
            let node = document.createElement("span")
            this.appendChild(node)
            node.innerText = this.getAttribute("empty") ? this.getAttribute("empty") : "未搜索到相关内容"
            this.style.textAlign = "center"
        }
        this.appendChild(this.pagination)
        let urlParams = new URLSearchParams(window.location.search);
        let page = urlParams.get('page')
        if (page == null || page == "") page = 1
        let limit = this.getAttribute("limit")
        if (limit == null || limit == "") limit = 10

        this.pagination = Array.from(this.pagination.getElementsByTagName("LIST-PAGINATION"))[0]

        this.pagination.total = this.total
        this.pagination.limit = limit * 1
        this.pagination.page = page * 1

        this.pagination.onchange = (e) => {
            let urlParams = new URLSearchParams(window.location.search);
            let searchContent = urlParams.get('search');
            let url = window.location.href.split("?")[0]
            toPage(`${url}?search=${searchContent}&page=${e.page}`)
        }
    }
}
class SliderBar extends CmsElement {
    constructor() {
        super()
    }
}
class SliderBarButton extends CmsElement {
    constructor() {
        super()
    }
}
class SliderBarButtonIndex extends CmsElement {
    constructor() {
        super()
    }
}
// 轮播图组件
class CmsSlider extends CmsElement {
    constructor() {
        super()
        this.dataId
        this.listData
        this.indexTem = 0
        this.nodeCover = []
        this.page
        this.limit
        this.autoIndex = 0
    }

    //初始化，启动函数
    connectedCallback() {
        if (this.getAttribute("page") == null || this.getAttribute("page") == "") {
            this.page = null
        } else {
            this.page = this.getAttribute("page") * 1
        }
        if (this.getAttribute("limit") == null || this.getAttribute("limit") == "") {
            this.limit = null
        } else {
            this.limit = this.getAttribute("limit") * 1
        }
        this.initDataId()
        if (this.dataId == null) return console.log("slider does not have a datId")
        this.loadBaseBlock()
        this.loadNodeList()

    }

    autoSlide(index) {
        index++
        if (this.getAttribute("auto") != null && this.getAttribute("auto") != "") {
            setTimeout(() => {
                if (index == this.autoIndex + 1) {
                    this.autoIndex = index
                    this.index++
                    this.autoSlide(index)
                }
            }, this.getAttribute("auto"));
        }
    }

    resetAuto() {
        if (this.getAttribute("auto") != null && this.getAttribute("auto") != "") {
            this.autoIndex++
            this.autoSlide(this.autoIndex)
        }
    }

    // 加载列表节点中的所有子节点
    loadNodeList() {
        loadListData(this.dataId, (data) => {
            this.listData = data
            this.loadNode(0)
        })
    }

    //加载子节点并且将节点中的cover添加至nodeCover
    loadNode(index) {
        if (index === this.listData.nodeId.length) {
            this.loadCovers(0)
            this.index = 0
            return
        }
        if (this.limit != null && this.page != null) {
            //如果index小于开始页码或者大于结束页码，则加载下一页
            if (index < (this.page - 1) * this.limit || index >= this.page * this.limit) {
                index++
                this.loadNode(index)
                return
            }
        }
        loadNodeData(this.listData.nodeId[index].id, (data) => {
            this.nodeCover.push(data)
            index++
            this.loadNode(index)
        })
    }

    // 为每个cover创建相应的元素，并且替换原来的nodeCover
    loadCovers(index) {
        if (index == this.nodeCover.length) {
            this.fixPositionImgs()
            window.addEventListener("resize", () => {
                this.fixPositionImgs()
            })
            this.autoSlide(0)
            return
        }

        let item = this.nodeCover[index].cover
        let img = document.createElement("img")
        let imgBg = document.createElement("img")
        let coverBlock = document.createElement("div")
        coverBlock.classList.add("coverBlock")
        let imgBlock = document.createElement("div")
        imgBlock.classList.add("sliderImgBlock")
        imgBlock.appendChild(img)
        imgBlock.appendChild(imgBg)
        let url = item.substring(0, 4) == "http" ? item : BaseCmsURL + item
        if (this.getAttribute("quality")) {
            url = url.replace("imgQuality_1", "imgQuality_" + this.getAttribute("quality"))
        }
        img.src = url
        imgBg.src = url
        img.classList.add("img")
        imgBg.classList.add("sliderImgBlockBg")
        coverBlock.appendChild(imgBlock)
        coverBlock.link = this.nodeCover[index].link
        this.nodeCover[index] = coverBlock
        this.appendImg(coverBlock, img, index)
        index++
        this.loadCovers(index)
        img.onclick = () => {
            if (coverBlock.link) {
                toPage(coverBlock.link)
            }
        }
    }

    set height(value) {
        this.setAttribute("height", value)
        this.style.height = value
    }

    set width(value) {
        this.setAttribute("width", value)
        this.style.width = value
    }

    get height() {
        return this.clientHeight
    }

    get width() {
        return this.clientWidth
    }

    // 加载轮播图的基础框架
    loadBaseBlock() {
        if (this.getAttribute("width")) this.style.width = this.getAttribute("width")
        if (this.getAttribute("height")) this.style.height = this.getAttribute("height")
        let prev = this.findBindElement(document.body, "SLIDER-PREV")

        if (prev.length === 0) {
            this.prevButton = dp(`<div class="sliderPrevButton">
                <div class="sliderButton">
                    <svg t="1720075833515" class="sliderButtonIcon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="26002" >
                        <path
                            d="M461.994667 512l211.2 211.2-60.330667 60.330667L341.333333 512l271.530667-271.530667 60.330667 60.330667z"
                            p-id="26003" fill="#ffffff"></path>
                    </svg>
                </div>
            </div>`).element
            this.prevButton.onclick = () => {
                this.index--
                this.resetAuto()
            }
            this.appendChild(this.prevButton)
        } else {
            prev.forEach(item => {
                item.onclick = () => {
                    this.index--
                    this.resetAuto()
                }
            })
        }

        let next = this.findBindElement(document.body, "SLIDER-NEXT")
        if (next.length === 0) {
            this.nextButton = dp(`<div class="sliderNextButton">
                <div class="sliderButton"> <svg t="1720076228912" class="sliderButtonIcon" viewBox="0 0 1024 1024"
                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26190" >
                        <path
                            d="M562.005333 512l-211.2-211.2 60.330667-60.330667L682.666667 512l-271.530667 271.530667-60.330667-60.330667z"
                            p-id="26191" fill="#ffffff"></path>
                    </svg>
                </div>
            </div>`).element
            this.nextButton.onclick = () => {
                this.index++
                this.resetAuto()
            }
            this.appendChild(this.nextButton)
        } else {
            next.forEach(item => {
                item.onclick = () => {
                    this.index++
                    this.resetAuto()
                }
            })
        }

        let bar = this.findBindElement(document.body, "SLIDER-BAR")
        for (let a = bar.length - 1; a >= 0; a--) {
            if (Array.from(bar[a].getElementsByTagName("SLIDER-BAR-BUTTON")).length === 0) {
                bar.splice(a, 1)
            }
        }

        if (bar.length === 0) {
            this.selectButtonBlock = [dp(`<div class="sliderBottomSelectButtonBlock"></div>`).element]
            this.appendChild(this.selectButtonBlock[0])
        } else {
            this.selectButtonBlock = bar
        }

        this.imgBlock = dp(`<div class="sliderImgMainBlock"></div>`).element
        this.appendChild(this.imgBlock)
    }

    insertSelectButton(index, block) {
        const insertDefaultButton = () => {
            let selectButton = document.createElement("div")
            selectButton.classList.add("sliderBottomSelectButton")
            this.selectButtonBlock[0].appendChild(selectButton)
            block["selectButton"] = selectButton
            selectButton.onclick = () => {
                this.index = index
                this.resetAuto()
            }
            if (index == this.index) selectButton.classList.add("imgSelect")
        }
        this.selectButtonBlock.forEach(item => {
            if (item.tagName === "SLIDER-BAR") {
                let successBarNum = 0
                let button
                if (item.sliderBarButton) {
                    button = item.sliderBarButton.cloneNode(true)
                } else {
                    button = Array.from(item.getElementsByTagName("SLIDER-BAR-BUTTON"))[0]
                    if (button == null) return console.error("slider-bar do not has a slider-bar-button")
                    item["sliderBarButton"] = button
                    item.innerHTML = ""
                    button = button.cloneNode(true)
                }
                item.appendChild(button)
                block["selectButton"] = button
                if (item["buttons"]) {
                    item["buttons"].push(button)
                } else {
                    item["buttons"] = [button]
                }
                button["index"] = index
                button.onclick = () => {
                    this.index = index
                    this.resetAuto()
                }
                Array.from(button.getElementsByTagName("SLIDER-BAR-BUTTON-INDEX")).forEach(indexBtn => {
                    indexBtn.innerText = index
                })
                button.innerText = index + 1
                if (index == this.index && button.getAttribute("slider:on")) button.classList.add(button.getAttribute("slider:on"))
                successBarNum++
                if (successBarNum === 0) {
                    insertDefaultButton()
                }
            } else {
                insertDefaultButton()
            }
        })
    }

    appendImg(block, img, index) {
        this.imgBlock.appendChild(block)
        if (img.naturalHeight > img.naturalWidth) {
            img.style.height = "100%"
        } else {
            img.style.width = "100%"
        }
        this.insertSelectButton(index, block)
    }

    //修正图片在空间中的位置
    fixPositionImgs() {
        this.nodeCover.forEach((item, index) => {
            item.style.transition = "0s left"
            item.style.left = (index - this.index) * this.clientWidth + "px"
            setTimeout(() => {
                if (this.getAttribute("transition")) {
                    item.style.transition = this.getAttribute("transition") + "s left"
                } else {
                    item.style.transition = item.clientWidth / 1000 + "s left"
                }
            }, 300);
        })
        if (this.prevButton) {
            this.prevButton.style.width = (this.clientWidth / 12 > 40 ? 40 : this.clientWidth / 12 < 20 ? 20 : this
                .clientWidth / 12) + "px"
            this.prevButton.style.height = (this.clientHeight / 4 > 75 ? 75 : this.clientHeight / 4 < 40 ? 40 : this
                .clientHeight / 4) + "px"
            this.prevButton.style.setProperty('--svgFontSize', (this.clientWidth / 13 > 40 ?
                40 : this.clientWidth / 13 < 15 ? 15 : this.clientWidth / 13) + "px");
        }
        if (this.nextButton) {
            this.nextButton.style.width = (this.clientWidth / 12 > 40 ? 40 : this.clientWidth / 12 < 20 ? 20 : this
                .clientWidth / 12) + "px"
            this.nextButton.style.height = (this.clientHeight / 4 > 75 ? 75 : this.clientHeight / 4 < 40 ? 40 : this
                .clientHeight / 4) + "px"
            this.nextButton.style.setProperty('--svgFontSize', (this.clientWidth / 13 > 40 ?
                40 : this.clientWidth / 13 < 15 ? 15 : this.clientWidth / 13) + "px");
        }
    }

    // 当前显示的图片，传入图片在数组中的下标切换图片
    set index(value) {
        if (value == -1) value = this.nodeCover.length - 1
        this.sliderBindEvent(value)
        if (value == this.nodeCover.length) value = 0

        this.indexTem = value
        this.nodeCover.forEach((item, index) => {
            if (index == (value % this.nodeCover.length)) {
                item.selectButton.classList.add("imgSelect")
            } else {
                item.selectButton.classList.remove("imgSelect")
            }
            item.style.left = (index - value) * this.clientWidth + "px"
        })
        this.selectButtonBlock.forEach(item => {
            if (item.tagName == "SLIDER-BAR") {
                item.buttons.forEach(button => {
                    if (button.getAttribute("slider:on")) {
                        let onClass = button.getAttribute("slider:on")
                        button.classList.remove(onClass)
                        if (value == button.index)
                            button.classList.add(onClass)
                    }
                })
            }
        })

    }

    sliderBindEvent(index) {
        this.findBindElement(document.body, "CMS-NODE").forEach(item => {
            item.dataId = this.listData.nodeId[index % this.nodeCover.length].id
        })
    }

    get index() {
        return this.indexTem
    }

    findBindElement(dom, tagName, result) {
        if (result == null)
            result = []
        let bindNodeId = this.getAttribute("slider:bind")
        if (bindNodeId) {

            if (!dom.getAttribute) return result
            if (dom.getAttribute("slider:bind") === bindNodeId) {
                if (dom.tagName && dom.tagName === tagName)
                    result.push(dom)
            }
            Array.from(dom.childNodes).forEach(item => {
                this.findBindElement(item, tagName, result)
            })
        }
        return result
    }
}

class SubmitButton extends CmsElement {
    constructor() {
        super()
        this.editor
    }

}

class SubmitTitle extends CmsElement {
    constructor() {
        super()
        this.input
    }

    connectedCallback() {
        this.input = dc("input")
        this.input.classList = this.classList
        this.input.setAttribute("style", this.getAttribute("style"))
        this.classList = []
        this.setAttribute("style", "")
        this.appendChild(this.input)
        this.input.placeholder = this.getAttribute("placeholder")
    }
    set value(value) {
        this.input.value = value
    }
    get value() {
        return this.input.value
    }
}

class SubmitInput extends CmsElement {
    constructor() {
        super()
        this.input
    }

    connectedCallback() {
        this.input = dc("input")
        this.input.classList = this.classList
        this.input.setAttribute("style", this.getAttribute("style"))
        this.classList = []
        this.setAttribute("style", "")
        this.appendChild(this.input)
        this.input.placeholder = this.getAttribute("placeholder")
    }
    set value(value) {
        this.input.value = value
    }
    get value() {
        return this.input.value
    }
}
class SubmitCode extends CmsElement {
    constructor() {
        super()
        this.editor
        this.state
    }
    connectedCallback() {
        this.style.cursor = "pointer"
        this.setAttribute("ftitle", "点击刷新二维码")
        document.titleShower.refresh(this)
    }
    dataIdChange() {
        this.getCode()

        this.onclick = () => {
            this.getCode()
        }
    }
    refresh() {
        this.getCode()
    }

    getCode() {
        fetch(BaseCmsURL + '/getSubmitVerifyCode', {
            method: 'POST',
            body: JSON.stringify({
                submitDataId: this.dataId,
                color: this.getAttribute("color") ? this.getAttribute("color") : null
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json()).then(data => {
            this.insertCode(data)
        }).catch(error => {
            document.tip.danger("未知错误，请稍后再试", 2500)
        })
    }

    insertCode(data) {
        this.state = data.code
        if (data.code === 404) {
            document.tip.warn("该栏目不存在")
        } else if (data.code === 403) {
            document.tip.warn("该栏目未开启投稿")
        } else {
            this.state = 200
            this.innerHTML = data.svg
        }
    }

    getState() {
        return this.state
    }
}

class SubmitText extends CmsElement {
    constructor() {
        super()
        this.editor
    }
    dataIdChange() {
        let editorElement = dc("div")
        editorElement.id = "t_" + Date.now().toString(36)
        if (this.getAttribute("height")) editorElement.style.height = this.getAttribute("height")
        this.appendChild(editorElement)
        this.editor = new Quill('#' + editorElement.id, {
            placeholder: this.getAttribute("placeholder") ? this.getAttribute("placeholder") : "请输入内容",
            modules: {
                toolbar: baseToolBarOptions
            },
            theme: 'snow'
        });
    }
    get value() {
        return this.editor.getSemanticHTML()
    }
    set value(value) {
        this.editor.setText(value)
    }
    get length() {
        return this.editor.getText().length
    }

    get min() {
        let res = 0
        if (this.getAttribute("min")) res = this.getAttribute("min") * 1
        return res
    }

    get max() {
        let res = 5000
        if (this.getAttribute("max")) res = this.getAttribute("max") * 1
        return res
    }
}

class ListSubmit extends CmsElement {
    constructor() {
        super()
        this.titleInput
        this.editor
        this.code
        this.button
        this.input
    }

    connectedCallback() {
        let checkParent = false
        // 检查自己所有的父标签是否含有CMS-LIST这个标签
        let currentElement = this;
        while (currentElement.parentNode) {
            currentElement = currentElement.parentNode;
            if (currentElement.tagName === "CMS-LIST") {
                checkParent = true
                break;
            }
        }
        if (!checkParent) {
            this.initDataId()
        }
    }
    dataIdChange() {
        this.loadSubmitTitle()
        this.loadSubmitText()
        if (this.editor != null)
            this.loadSubmitCode()
        else return
        if (this.code != null)
            this.loadSubmitButton()
        else return
        if (this.button != null)
            this.loadSubmitInput()
        else return
        if (this.input != null)
            this.initSubmitFunctions()
        else return
    }

    initSubmitFunctions() {
        this.button.addEventListener("click", () => {
            if (this.code.getState() === 404) {
                document.tip.warn("该栏目不存在")
            } else if (this.code.getState() === 403) {
                document.tip.warn("该栏目未开启投稿")
            } else if (this.input.value.length < 6) {
                document.tip.warn("请输入完整的验证码")
            } else if (this.titleInput.value.length === 0) {
                document.tip.warn("请输入标题")
            } else if (this.titleInput.value.length > 100) {
                document.tip.warn("标题长度不得大于100")
            } else if (this.editor.length <= this.editor.min) {
                document.tip.warn("投稿长度不得小于：" + this.editor.min)
            } else if (this.editor.length > this.editor.max) {
                document.tip.warn("投稿内容长度不得大于：" + this.editor.max)
            } else {
                fetch(BaseCmsURL + '/submitToList', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: this.titleInput.value,
                        submitDataId: this.dataId,
                        content: this.editor.value,
                        code: this.input.value
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json()).then(data => {
                    if (data.code == 403) {
                        document.tip.warn("该栏目未开启投稿")
                    } else if (data.code == 402) {
                        document.tip.warn("验证码不存在或已过期，请点击二维码刷新", 3500)
                    } else if (data.code == 406) {
                        document.tip.warn("超过当日投稿次数上限")
                    } else if (data.code == 200) {
                        document.tip.success("投稿成功")
                        this.editor.value = ""
                        this.code.refresh()
                        this.input.value = ""
                    } else {
                        document.tip.danger("未知错误，请稍后再试", 2500)
                    }
                }).catch(error => {
                    document.tip.danger("文章内容过大", 2500)
                })

            }
        })
    }

    loadSubmitButton() {
        this.verifySubmitButton(this)
        if (this.button == null) return console.error("cms-submit do not has a submit-button")
    }
    verifySubmitButton(dom) {
        Array.from(dom.children).forEach(item => {
            if (item.tagName == "SUBMIT-BUTTON") {
                item.data = this.data
                item.dataId = this.dataId
                return this.button = item
            }
            if (item.childNodes.length > 0) {
                this.verifySubmitButton(item)
            }
        })
    }
    loadSubmitInput() {
        this.verifySubmitInput(this)
        if (this.input == null) return console.error("cms-submit do not has a submit-input")
    }
    verifySubmitInput(dom) {
        Array.from(dom.children).forEach(item => {
            if (item.tagName == "SUBMIT-INPUT") {
                item.data = this.data
                item.dataId = this.dataId
                return this.input = item
            }
            if (item.childNodes.length > 0) {
                this.verifySubmitInput(item)
            }
        })
    }
    loadSubmitTitle() {
        this.verifySubmitTitle(this)
        if (this.titleInput == null) return console.error("cms-submit do not has a submit-title")
    }
    verifySubmitTitle(dom) {
        Array.from(dom.children).forEach(item => {
            if (item.tagName == "SUBMIT-TITLE") {
                item.data = this.data
                item.dataId = this.dataId
                return this.titleInput = item
            }
            if (item.childNodes.length > 0) {
                this.verifySubmitTitle(item)
            }
        })
    }
    loadSubmitCode() {
        this.verifySumitCode(this)
        if (this.code == null) return console.error("cms-submit do not has a submit-code")
    }
    verifySumitCode(dom) {
        Array.from(dom.children).forEach(item => {
            if (item.tagName == "SUBMIT-CODE") {
                item.data = this.data
                item.dataId = this.dataId
                return this.code = item
            }
            if (item.childNodes.length > 0) {
                this.verifySumitCode(item)
            }
        })
    }
    loadSubmitText() {
        this.verifySubmitText(this)
        if (this.editor == null) return console.error("cms-submit do not has a submit-text")
    }
    verifySubmitText(dom) {
        Array.from(dom.children).forEach(item => {
            if (item.tagName == "SUBMIT-TEXT") {
                item.data = this.data
                item.dataId = this.dataId
                return this.editor = item
            }
            if (item.childNodes.length > 0) {
                this.verifySubmitText(item)
            }
        })
    }
}

function loadCustomElements() {
    customElements.define("cms-component", CmsComponent)
    customElements.define("list-pagination", NodePagination)
    customElements.define("list-cover", ListCover)
    customElements.define("list-name", ListName)
    customElements.define("list-node-size", ListsNodeSize)
    customElements.define("list-parent", ListParent)
    customElements.define("list-template", ListTemplate)
    customElements.define("list-list", ListList)
    customElements.define("list-node", ListNode)
    customElements.define("list-note", ListNote)
    customElements.define("submit-title", SubmitTitle)
    customElements.define("submit-text", SubmitText)
    customElements.define("submit-button", SubmitButton)
    customElements.define("submit-code", SubmitCode)
    customElements.define("submit-input", SubmitInput)
    customElements.define("list-submit", ListSubmit)
    customElements.define("cms-list", CmsList)
    customElements.define("node-cover", NodeCover)
    customElements.define("node-date", NodeDate)
    customElements.define("node-clicks", NodeClick)
    customElements.define("node-content", NodeContent)
    customElements.define("node-link", NodeLink)
    customElements.define("node-title", NodeTitle)
    customElements.define("node-note", NodeNote)
    customElements.define("node-file", NodeFile)
    customElements.define("node-prev", NodePrev)
    customElements.define("node-parent", NodeParent)
    customElements.define("node-next", NodeNext)
    customElements.define("cms-node", CmsNode)
    customElements.define("cms-search-result", CmsSearchResult)
    customElements.define("slider-prev", SliderPrev)
    customElements.define("slider-next", SliderNext)
    customElements.define("slider-bar", SliderBar)
    customElements.define("slider-bar-button", SliderBarButton)
    customElements.define("slider-bar-button-index", SliderBarButtonIndex)
    customElements.define("cms-slider", CmsSlider)
}
run()