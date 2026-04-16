//@Author LiuJun
/**
 * FinalCms.js - 前端 CMS 系统核心脚本
 * 功能：
 * 1. 初始化 CMS 系统，加载数据
 * 2. 定义自定义元素（cms-list, cms-node 等）
 * 3. 实现数据渲染和分页功能
 * 4. 提供 DOM 操作工具函数
 */
(() => {
    /**
     * 从当前脚本的 src 属性中获取参数
     * @type {URL} 当前脚本的 URL 对象
     */
    const url = new URL(document.currentScript.src);

    /**
     * 解析 URL 中的查询参数
     * @type {Object} 包含所有查询参数的对象
     */
    const params = Object.fromEntries(url.searchParams.entries());

    /**
     * CMS 基础 URL，格式为：当前域名 + "/" + web 参数
     * @type {string} CMS 系统的基础 URL
     */
    const BaseCmsURL = window.location.origin + "/" + params.web

    /**
     * 是否总是从服务器加载数据
     * @type {boolean} 如果 alwaysLoad 参数为 'true'，则总是从服务器加载
     */
    const alwaysLoad = params.alwaysLoad == 'true'

    /**
     * 存储列表数据的数组
     * @type {Array} 存储从服务器或本地存储加载的列表数据
     */
    const listIndex = []

    /**
     * 节点索引映射，用于快速查找节点
     * @type {Object} 以节点 ID 为键，节点数据为值的映射
     */
    const NodeIndexMap = {}

    /**
     * 列表索引映射，用于快速查找列表
     * @type {Object} 以列表 ID 为键，列表数据为值的映射
     */
    const listIndexMap = {}

    // 初始化 CMS 系统
    init()

    /**
     * 初始化函数
     * 1. 初始化基础样式
     * 2. 根据 alwaysLoad 参数决定是否总是从服务器加载数据
     * 3. 否则，检查本地存储中的修改时间，决定是否需要从服务器加载新数据
     */
    function init() {
        // 初始化基础样式
        initBaseStyle()

        // 如果总是加载，则直接从服务器加载数据
        if (alwaysLoad) {
            loadDataFromServer()
            return
        }

        // 否则，先获取修改信息，判断是否需要更新数据
        fetch(BaseCmsURL + '/data/modifyInfo.json?id=' + Math.random())
            .then(res => res.json())
            .then(json => {
                // 如果本地存储中没有修改信息，或服务器数据更新时间较新，则从服务器加载数据
                if (localStorage.getItem('modifyInfo_' + params.web) == null) {
                    localStorage.setItem('modifyInfo_' + params.web, json.updateTime)
                    loadDataFromServer()
                } else {
                    if (json.updateTime > localStorage.getItem('modifyInfo_' + params.web) * 1) {
                        localStorage.setItem('modifyInfo_' + params.web, json.updateTime)
                        loadDataFromServer()
                    } else {
                        // 否则，从本地存储加载数据
                        JSON.parse(localStorage.getItem('CmsListData_' + params.web)).forEach(item => {
                            listIndex.push(item)
                        })
                        formatData()
                    }
                }
            })
    }

    /**
     * 初始化基础样式
     * 创建并添加全局样式，定义 CMS 相关元素的默认样式
     */
    function initBaseStyle() {
        const style = document.createElement('style')
        style.textContent = `
            cms-component, cms-list, list-list, list-node, cms-node {display: block;}
            cms-pagination .a-page-info-block{display:flex;}
            cms-pagination .a-page-info-block .cmsInput {height: 26px;text-align: center;border-radius: 3px;border: 1px solid #d0d0d0;width: 50px;margin-right: 10px;}
            cms-pagination .a-page-info-block select {height: 30px;border-radius: 3px;border: 1px solid #d0d0d0;width: 50px;margin-right: 10px;}
            cms-pagination .a-page-info-block .cmsButton {color: #555555;cursor: pointer;height: 30px;border-radius: 3px;background-color: #fff;border: 1px solid #d0d0d0;padding-left: 10px;padding-right: 10px;margin-right: 10px;}
            cms-pagination .a-page-info-block .cmsButton:hover {color: #555555;background-color: #f4f4f4;}
            cms-pagination .a-page-info-block .select {background-color: #407BFF;color: #fff;border: 1px solid #407BFF;}
            cms-pagination .a-page-info-block .select:hover {background-color: #407BFF;color: #fff;border: 1px solid #407BFF;opacity: 0.75;}
            cms-pagination .a-page-info-block i {color: #999999;margin-right: 5px;}
            cms-pagination .a-page-info-block label {margin-right: 10px;font-size: 14px;line-height: 30px;color: #666666;}
            cms-pagination .a-page-info-block .a-page-button-block {display: flex;}
            cms-pagination .a-page-info-block .a-set-block {display: flex;}
            cms-slider {overflow: hidden;position: relative;}
            cms-slider:hover .sliderButton{opacity: 1;}
            cms-slider:hover .sliderBottomSelectButton{opacity: 1;}
            cms-slider .sliderPrevButton {  --svgFontSize:25px;position: absolute;left: 2.5%;top: 50%;}
            cms-slider .sliderNextButton {--svgFontSize:25px;right: 2.5%;top: 50%;position: absolute;}
            cms-slider .sliderButton {z-index: 2;border-radius: 3px;cursor: pointer;position: relative;width: 100%;height: 100%;opacity: 0.2;transition: 0.2s opacity;background-color: rgba(0, 0, 0, 0.25);transform: translate(0%, -50%);}
            cms-slider .sliderButton svg{width:var(--svgFontSize);height:var(--svgFontSize);}
            cms-slider .sliderButton:hover {opacity: 0.75;}
            cms-slider .sliderButtonIcon {position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);}
            cms-slider .sliderBottomSelectButtonBlock {z-index: 2;padding-left: 10px;padding-right: 10px;display: flex;position: absolute;background-color: rgba(0, 0, 0, 0.25);left: 50%;bottom: 5%;border-radius: 10px;transform: translateX(-50%);}
            cms-slider .sliderBottomSelectButtonBlock:hover .sliderBottomSelectButton {width: 20px;height: 20px;margin-left: 7px;margin-right: 7px;}
            cms-slider .sliderBottomSelectButton {opacity: 0.2;transition: 0.2s opacity;transition: 0.2s width, 0.2s height, 0.2s margin-left, 0.2s margin-right;cursor: pointer;margin-top: 3px;margin-bottom: 3px;margin-left: 5px;margin-right: 5px;background-color: #fff;width: 15px;height: 15px;border-radius: 10px;}
            cms-slider .sliderBottomSelectButton:hover {box-shadow: 0 0 5px #ffffff;}
            cms-slider .sliderImgMainBlock {z-index: 0;width: 100%;height: 100%;position: relative;left: 0;top: 0;}
            cms-slider .sliderImgBlock {position: relative;overflow: hidden;width: 100%;height: 100%;}
            cms-slider .sliderImgBlock .img {position: absolute;z-index: 1;padding: 0;margin: 0;left: 50%;top: 50%;transform: translate(-50%, -50%);}
            cms-slider .sliderImgBlockBg {filter: blur(20px);z-index: 0;width: 150%;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);}
            cms-slider .coverBlock {transition: 0.3s left;position: absolute;width: 100%;height: 100%;}
            cms-slider .imgSelect {box-shadow: 0 0 5px rgb(200, 200, 200);background-color: rgb(134, 134, 134) !important;animation: sliderAnimationImgSelected 0.25s ease forwards;width: 13px;height: 13px;border: 1px solid rgb(160, 160, 160);}
            @keyframes sliderAnimationImgSelected {0% {margin-top: 0;margin-bottom: 0;}50% {margin-top: -3px;margin-bottom: 3px;}100% {margin-top: 0;margin-bottom: 0;}}
            slider-prev{display:block;}
            slider-next{display:block;}
            slider-bar{display:block;}
            slider-bar-button{display:block;}`
        document.head.appendChild(style)
    }

    /**
     * 从服务器加载数据
     * 1. 从服务器获取列表索引数据
     * 2. 将数据存储到本地存储
     * 3. 格式化数据
     */
    function loadDataFromServer() {
        fetch(BaseCmsURL + '/data/list.json')
            .then(res => res.json())
            .then(json => {
                json.forEach(item => {
                    listIndex.push(item)
                })
                // 将数据存储到本地存储，以便下次使用
                localStorage.setItem('CmsListData_' + params.web, JSON.stringify(listIndex))
                formatData()
            })
    }

    /**
     * 格式化数据
     * 1. 递归处理列表数据，构建索引映射
     * 2. 初始化组件
     */
    function formatData() {
        /**
         * 递归格式化列表数据
         * @param {Object} list 列表数据对象
         */
        const format = (list) => {
            // 构建列表索引映射
            listIndexMap[list.id] = list
            // 递归处理子列表
            list.children.forEach(item => {
                format(item)
                item.parent = list
            })
            // 处理节点数据
            if (list.nodes)
                list.nodes.forEach(item => {
                    item["parent"] = list
                    NodeIndexMap[item.id] = item
                })
        }
        // 处理所有列表数据
        listIndex.forEach(list => format(list))
        // 初始化组件
        initComponents()
    }

    /**
     * 生成 DOM 队列
     * @param {string} pageString HTML 字符串
     * @returns {Object} 包含元素和子元素映射的对象
     */
    function dp(pageString) {
        let domElement = {}
        // 去除换行和制表符
        pageString = pageString.replaceAll("\n", '').replaceAll("\t", '');
        let content = document.createElement("div")
        content.innerHTML = pageString
        // 生成 DOM 元素队列
        domList(content.childNodes[0], domElement)
        return {
            element: content.childNodes[0],
            children: domElement
        }
    }

    /**
     * 生成 DOM 队列
     * @param {Node} dom DOM 节点
     * @param {Object} domElement 存储 DOM 元素映射的对象
     */
    function domList(dom, domElement) {
        // 初始化 DOM 元素的函数
        initDomFunctions(dom)
        // 如果元素有 ref 属性，则添加到映射中
        if (dom.getAttribute != null && dom.getAttribute("ref") != "" && dom.getAttribute("ref") != null) {
            domElement[dom.getAttribute("ref")] = dom
        }
        // 递归处理子节点
        if (dom.childNodes.length > 0) {
            dom.childNodes.forEach((node) => {
                domList(node, domElement)
            })
        }
    }

    /**
     * 创建基础 DOM 元素
     * @param {string} tag 标签名
     * @param {string|Array} Class 类名或类名数组
     * @returns {Element} 创建的 DOM 元素
     */
    function dc(tag, Class) {
        let element = document.createElement(tag)
        // 添加类名
        if (Class != null) {
            if (typeof Class == "string") {
                element.classList.add(Class)
            } else {
                Class.forEach((className) => {
                    element.classList.add(className)
                })
            }
        }
        // 添加 txt 方法，设置元素文本内容
        element["txt"] = (text) => {
            element.innerText = text
            return element
        }
        // 添加 add 方法，添加子元素
        element["add"] = (ele) => {
            element.appendChild(ele)
            return element
        }
        // 添加 show 方法，显示元素
        element["show"] = (display) => {
            if (display == null) {
                element.style.display = "block"
            } else {
                element.style.display = display
            }
        }
        // 添加 hide 方法，隐藏元素
        element["hide"] = () => {
            element.style.display = "none"
        }
        // 添加 val 方法，设置元素值
        element["val"] = (val) => {
            element.value = val
            return element
        }
        return element
    }

    /**
     * 初始化 DOM 元素的函数
     * @param {Node} dom DOM 节点
     */
    function initDomFunctions(dom) {
        // 添加 show 方法，显示元素
        dom["show"] = (display) => {
            if (display == null) {
                dom.style.display = "block"
            } else {
                dom.style.display = display
            }
        }
        // 添加 hide 方法，隐藏元素
        dom["hide"] = () => {
            dom.style.display = "none"
        }
        // 添加 val 方法，设置元素值
        dom["val"] = (val) => {
            dom.value = val
        }
        // 添加 txt 方法，设置元素文本内容
        dom["txt"] = (text) => {
            dom.innerText = text
        }
    }

    /**
     * 基础 CMS 元素类
     * 所有 CMS 自定义元素的基类
     */
    class BaseCmsElement extends HTMLElement {
        constructor() {
            super()
            this._data
        }

        /**
         * 加载数据 ID
         * 从 URL 参数或元素属性中获取数据 ID
         * @returns {string|null} 数据 ID
         */
        loadDataId() {
            let dataId = null
            // 从 URL 参数中获取 dataId
            const urlParams = new URLSearchParams(window.location.search);
            const urlDataId = urlParams.get('dataId');
            if (urlDataId != null) {
                dataId = urlDataId
            }

            // 从元素属性中获取 data 属性
            if (this.getAttribute("data") != null) {
                dataId = this.getAttribute("data")
            }
            return dataId
        }

        /**
         * 设置数据
         * @param {Object} val 数据对象
         */
        set data(val) {
            this._data = val
            this._render()
        }

        /**
         * 内部渲染方法
         * 检查数据是否存在，存在则调用 render 方法
         */
        _render() {
            if (this._data == null) return
            this.render()
        }

        /**
         * 获取数据
         * @returns {Object} 数据对象
         */
        get data() {
            return this._data
        }

    }

    /**
     * CMS 列表元素类
     * 用于显示 CMS 列表数据
     */
    class CmsList extends BaseCmsElement {
        constructor() {
            super()
        }

        /**
         * 元素连接到 DOM 时的回调
         * 加载数据并渲染
         */
        connectedCallback() {
            if (listIndexMap[this.loadDataId()])
                this.data = listIndexMap[this.loadDataId()]
        }

        /**
         * 渲染方法
         * 处理列表相关的子元素
         */
        render() {
            // 处理 LIST-NAME 元素
            findScopedElements(this, "LIST-NAME", ["CMS-LIST", "LIST-LIST", "LIST-PARENT"]).forEach(child => {
                child.data = this.data
            })

            findScopedElements(this, "LIST-COVER", ["CMS-LIST", "LIST-LIST", "LIST-PARENT"]).forEach(child => {
                child.data = this.data
            })

            findScopedElements(this, "LIST-TEMPLATE", ["CMS-LIST", "LIST-LIST", "LIST-PARENT"]).forEach(child => {
                child.data = this.data
            })

            // 处理 LIST-INFO 元素
            findScopedElements(this, "LIST-INFO", ["CMS-LIST", "LIST-LIST", "LIST-PARENT"]).forEach(child => {
                child.data = this.data
            })

            // 处理 LIST-LIST 元素
            findScopedElements(this, "LIST-LIST", ["CMS-LIST", "LIST-LIST", "LIST-PARENT"]).forEach(child => {
                if (this.data.children == null) return
                // 克隆元素并设置数据
                this.data.children.forEach(item => {
                    const cloneElement = child.cloneNode(true)
                    child.parentNode.insertBefore(cloneElement, child)
                    cloneElement.data = item
                })
                // 移除原始元素
                child.parentNode.removeChild(child)
            })

            // 处理 LIST-NODE 元素
            findScopedElements(this, "LIST-NODE", ["CMS-LIST", "LIST-LIST", "LIST-NODE", "LIST-PARENT"]).forEach(child => {
                if (this.data.nodes == null) return
                const nodeElement = []
                const targetParentNode = child.parentNode
                // 克隆元素并设置数据
                this.data.nodes.forEach((item, index) => {
                    const cloneElement = child.cloneNode(true)
                    cloneElement.data = item
                    cloneElement.index = index
                    nodeElement.push(cloneElement)
                    cloneElement.sisterNodes = nodeElement
                    cloneElement.targetParentNode = targetParentNode
                })
                let limit = nodeElement.length
                if (child.getAttribute("limit") != null)
                    limit = parseInt(child.getAttribute("limit"))
                // 处理 limit 属性，限制显示数量

                nodeElement.forEach((item, index) => {
                    if (index < limit) {
                        item.targetParentNode.appendChild(item)
                    }
                })
                // 移除原始元素
                child.parentNode.removeChild(child)
            })
            // 处理 LIST-PARENT 元素
            findScopedElements(this, "LIST-PARENT", ["CMS-LIST", "LIST-LIST", "LIST-PARENT"]).forEach(child => {
                child.data = this.data.parent
            })
        }
    }

    /**
     * CMS 分页元素类
     * 用于实现分页功能
     */
    class CmsPagination extends BaseCmsElement {
        constructor() {
            super()
            this.customButton = null //用户自定义按钮样式
        }

        /**
         * 元素连接到 DOM 时的回调
         * 初始化元素、属性和事件
         */
        connectedCallback() {
            this.initElement()
            this.initAttubie()
            this.initPageElementData()
            this.initRefsFunction()
        }

        /**
         * 设置每页显示数量数组
         * @param {Array} array 每页显示数量数组
         */
        set limitArray(array) {
            this.setAttribute("limitArray", array)
            this.initPageLimitArray()
        }

        /**
         * 设置总记录数
         * @param {number} total 总记录数
         */
        set total(total) {
            if (this.totalTem == total * 1) return
            this.totalTem = total
            this.initPageElementData()
        }

        /**
         * 获取总记录数
         * @returns {number} 总记录数
         */
        get total() {
            return this.totalTem
        }

        /**
         * 设置每页显示数量
         * @param {number} limit 每页显示数量
         */
        set limit(limit) {
            this.limitTem = limit
            this.initPageElementData()
        }

        /**
         * 获取每页显示数量
         * @returns {number} 每页显示数量
         */
        get limit() {
            return this.limitTem
        }

        /**
         * 设置当前页码
         * @param {number} page 当前页码
         */
        set page(page) {
            if (!Number.isInteger(page)) return
            this.pageTem = page
            this.initPageElementData()
            this.renderNodes()
        }

        /**
         * 获取当前页码
         * @returns {number} 当前页码
         */
        get page() {
            return this.pageTem
        }

        /**
         * 获取分页信息
         * @returns {Object} 包含 total, page, limit 的对象
         */
        get value() {
            return {
                total: this.totalTem,
                page: this.pageTem,
                limit: this.limitTem
            }
        }

        /**
         * 设置页码按钮数量
         * @param {number} buttonNum 页码按钮数量
         */
        set buttonNum(buttonNum) {
            this.buttonNumTem = buttonNum
            this.initPageElementData()
        }

        /**
         * 获取页码按钮数量
         * @returns {number} 页码按钮数量
         */
        get buttonNum() {
            return this.buttonNumTem
        }

        /**
         * 初始化元素
         * 创建分页控件的 DOM 结构
         */
        initElement() {
            // 创建基础 DOM 结构
            let element = dp(`<div class="a-page-info-block" style="user-select: none;"><div class="a-page-button-block" ref="buttonBlock"></div><div class="a-set-block" ref="setting"></div></div>`)
            let customInput = null
            let jumpButton = null
            let prevButton = null
            let nextButton = null

            // 查找自定义输入框
            Array.from(this.getElementsByTagName("INPUT")).forEach(item => {
                customInput = item
            })

            // 查找自定义按钮
            Array.from(this.getElementsByTagName("BUTTON")).forEach(item => {
                if (item.getAttribute("type") == "jump") {
                    jumpButton = item
                }
                if (item.getAttribute("type") == "prev") {
                    prevButton = item
                }
                if (item.getAttribute("type") == "next") {
                    nextButton = item
                }
                if (item.getAttribute("type") == "page") {
                    this.customButton = item
                    this.removeChild(item)
                }
            })

            // 添加上一页按钮
            if (prevButton != null) {
                element.children.buttonBlock.appendChild(prevButton)
                element.children["last"] = prevButton
            } else {
                const button = dc("button", "cmsButton").txt("上一页")
                element.children.buttonBlock.appendChild(button)
                element.children["last"] = button
            }

            // 添加页码按钮容器
            const pageBlock = dc("div")
            element.children.buttonBlock.appendChild(pageBlock)
            element.children['pageBlock'] = pageBlock

            // 添加下一页按钮
            if (nextButton != null) {
                element.children.buttonBlock.appendChild(nextButton)
                element.children["next"] = nextButton
            } else {
                const button = dc("button", "cmsButton").txt("下一页")
                element.children.buttonBlock.appendChild(button)
                element.children["next"] = button
            }

            // 添加跳转输入框
            if (customInput != null) {
                element.children.setting.appendChild(customInput)
                element.children["jumpInput"] = customInput
            } else {
                const input = dc("input", "cmsInput")
                input.style.width = "40px"
                input.style.marginLeft = "10px"
                input.min = "1"
                element.children.setting.appendChild(input)
                element.children["jumpInput"] = input
            }

            // 添加跳转按钮
            if (jumpButton != null) {
                element.children.setting.appendChild(jumpButton)
                element.children["jumpButton"] = jumpButton
            } else {
                const button = dc("button", "cmsButton").txt("跳转")
                element.children.setting.appendChild(button)
                element.children["jumpButton"] = button
            }

            // 添加到当前元素
            this.appendChild(element.element)
            this.refs = element.children
            this.refs.jumpInput.value = this.pageTem

            // 如果是 mini 类型，隐藏设置部分
            if (this.getAttribute("type") == "mini") {
                this.refs.setting.style.display = "none"
            }
        }

        /**
         * 初始化页码元素数据
         * 生成页码按钮
         */
        initPageElementData() {
            // 清空页码按钮容器
            this.refs.pageBlock.innerHTML = ''
            // 生成页码索引
            let pageList = this.generatePaginationIndexes()

            // 创建页码按钮
            pageList.forEach((page, index) => {
                let button

                // 使用自定义按钮或默认按钮
                if (this.customButton != null) {
                    button = this.customButton.cloneNode(true)
                } else {
                    button = dc("button", "cmsButton")
                }

                button.textContent = page

                // 设置当前页码按钮样式
                if (page == this.pageTem) {
                    if (this.customButton != null) button.classList.add(this.customButton.getAttribute("focus"))
                    else button.classList.add("select")
                }

                this.refs.pageBlock.appendChild(button)

                // 添加省略号
                // if (pageList[index + 1] != null && pageList[index + 1] - page > 1) {
                // let i = dc("i", "icon-more-fill")
                // this.refs.pageBlock.appendChild(i)
                // i.textContent = "..."
                // }

                // 添加点击事件
                button.onclick = () => {
                    this.page = page
                    this.refs.jumpInput.value = page
                }
            })

            // 更新跳转输入框的值
            this.refs.jumpInput.value = this.pageTem
        }

        /**
         * 初始化引用元素的函数
         * 添加事件监听器
         */
        initRefsFunction() {
            // 上一页按钮点击事件
            this.refs.last.onclick = () => {
                if (this.page == 1) return
                this.page = this.pageTem - 1
            }

            // 下一页按钮点击事件
            this.refs.next.onclick = () => {
                let tempPage = this.pageTem + 1
                var temp = Math.ceil(this.totalTem / this.limitTem)
                this.page = tempPage > temp ? temp : tempPage
                this.refs.jumpInput.value = this.pageTem
            }

            // 跳转按钮点击事件
            this.refs.jumpButton.onclick = () => {
                let tempPage = this.refs.jumpInput.value * 1 < 1 ? 1 : this.refs.jumpInput.value * 1
                var temp = Math.ceil(this.totalTem / this.limitTem)
                this.page = tempPage > temp ? temp : tempPage
                this.refs.jumpInput.value = this.pageTem
            }
        }

        /**
         * 初始化属性
         * 从元素属性中获取配置
         */
        initAttubie() {
            // 获取绑定的节点
            const cmsBind = this.getAttribute("cms-bind")
            const listNodes = Array.from(document.getElementsByTagName("LIST-NODE"))

            this.targetNode = listNodes.find(item => item.getAttribute("cms-bind") == cmsBind && item.sisterNodes != null)

            if (this.targetNode == null) return

            // 获取页码按钮数量
            var buttoNum = this.getAttribute("buttonNum")
            this.buttonNumTem = (buttoNum == null || buttoNum == "") ? 5 : buttoNum * 1

            // 获取当前页码
            var page = this.getAttribute("page")
            this.pageTem = (page == null || page == "") ? 1 : page * 1

            // 获取每页显示数量
            var limit = this.targetNode.getAttribute("limit")
            this.limitTem = (limit == null || limit == "") ? 10 : limit * 1

            // 获取总记录数
            var total = this.targetNode.sisterNodes.length
            this.totalTem = (total == null || total == "") ? 1 : total * 1

            // 初始化页码元素数据
            this.initPageElementData()
            this.refs.jumpInput.value = this.pageTem
        }

        /**
         * 渲染节点
         * 根据当前页码和每页显示数量，显示或隐藏节点
         */
        renderNodes() {
            this.targetNode.sisterNodes.forEach((item, index) => {
                if (index >= this.limitTem * (this.pageTem - 1) && index < this.limitTem * this.pageTem)
                    item.targetParentNode.appendChild(item)
                else if (item.parentNode == item.targetParentNode)
                    item.targetParentNode.removeChild(item)
            })
        }

        /**
         * 生成分页索引
         * @returns {Array} 页码索引数组
         */
        generatePaginationIndexes() {
            const totalPages = Math.ceil(this.totalTem / this.limitTem);

            // 设置跳转输入框的最大值
            this.refs.jumpInput.max = totalPages

            // 计算起始和结束页码
            let startPage = Math.max(1, this.pageTem - Math.floor(this.buttonNum / 2));
            let endPage = Math.min(totalPages, startPage + this.buttonNum - 1);

            startPage = Math.max(1, endPage - this.buttonNum + 1);

            const pageIndexes = [];

            // 生成页码索引
            for (let i = startPage; i <= endPage; i++) pageIndexes.push(i);

            // 添加第一页和最后一页
            if (pageIndexes[0] > 1) pageIndexes.unshift(1)
            if (pageIndexes[pageIndexes.length - 1] < Math.ceil(this.totalTem / this.limitTem)) pageIndexes.push(Math
                .ceil(this.totalTem / this.limitTem))

            return pageIndexes;
        }
    }


    /**
     * 列表列表元素类
     * CmsList 的子类
     */
    class ListList extends CmsList { constructor() { super() } }

    /**
     * 列表名称元素类
     * 用于显示列表名称
     */
    class ListName extends BaseCmsElement {
        constructor() {
            super()
        }
        /**
         * 渲染方法
         * 显示列表名称
         */
        render() {
            if (this.data) {
                this.textContent = this.data.name
            }
        }
    }

    /**
     * 列表信息元素类
     * 用于显示列表信息
     */
    class ListInfo extends BaseCmsElement {
        constructor() {
            super()
        }
        /**
         * 渲染方法
         * 显示列表信息
         */
        render() {
            if (this.data) {
                this.textContent = this.data.info
            }
        }
    }

    /**
     * CMS 节点元素类
     * 用于显示 CMS 节点数据
     */
    class CmsNode extends BaseCmsElement {
        constructor() {
            super()
            this.data = null
        }

        /**
         * 元素连接到 DOM 时的回调
         * 加载数据并渲染
         */
        connectedCallback() {
            if (NodeIndexMap[this.loadDataId()])
                this.data = NodeIndexMap[this.loadDataId()]
        }

        /**
         * 渲染方法
         * 处理节点相关的子元素
         */
        render() {
            if (this.data == null) return
            // 处理 NODE-TITLE 元素
            findScopedElements(this, "NODE-TITLE", ["CMS-NODE", "NODE-PARENT"]).forEach(child => {
                child.data = this.data
            })
            // 处理 NODE-INFO 元素
            findScopedElements(this, "NODE-INFO", ["CMS-NODE", "NODE-PARENT"]).forEach(child => {
                child.data = this.data
            })
            // 处理 NODE-DATE 元素
            findScopedElements(this, "NODE-DATE", ["CMS-NODE", "NODE-PARENT"]).forEach(child => {
                child.data = this.data
            })
            // 处理 NODE-TEMPLATE 元素
            findScopedElements(this, "NODE-TEMPLATE", ["CMS-NODE", "NODE-PARENT"]).forEach(child => {
                child.data = this.data
            })
            // 处理 NODE-COVER 元素
            findScopedElements(this, "NODE-COVER", ["CMS-NODE", "NODE-PARENT"]).forEach(child => {
                child.data = this.data
            })
            // 处理 NODE-PARENT 元素
            findScopedElements(this, "NODE-PARENT", ["CMS-NODE", "NODE-PARENT"]).forEach(child => {
                child.data = this.data.parent
            })
            // 处理 NODE-PARENT 元素
            findScopedElements(this, "NODE-CONTENT", ["CMS-NODE", "NODE-PARENT"]).forEach(child => {
                child.data = this.data
            })
        }
    }

    /**
     * 列表节点元素类
     * CmsNode 的子类
     */
    class ListNode extends CmsNode { constructor() { super() } }

    /**
     * 节点日期元素类
     * 用于显示节点日期
     */
    class NodeDate extends BaseCmsElement {
        constructor() {
            super()
        }

        /**
         * 渲染方法
         * 显示格式化后的日期
         */
        render() {
            if (!this.data || !this.data.date) return

            // 获取日期格式，默认为 'YYYY-MM-DD'
            const format = this.getAttribute('format') || 'YYYY-MM-DD'

            // 格式化日期并显示
            this.textContent = this.formatDate(this.data.date, format)
        }

        /**
         * 时间格式化函数
         * @param {string|number} date 日期字符串或时间戳
         * @param {string} format 日期格式
         * @returns {string} 格式化后的日期字符串
         */
        formatDate(date, format) {
            const d = new Date(date)

            // 补零函数
            const pad = (n) => n.toString().padStart(2, '0')

            // 日期格式映射
            const map = {
                YY: d.getFullYear().toString().slice(-2),
                YYYY: d.getFullYear(),
                MM: pad(d.getMonth() + 1),
                DD: pad(d.getDate()),
                HH: pad(d.getHours()),
                mm: pad(d.getMinutes()),
                ss: pad(d.getSeconds())
            }

            // 替换格式字符串
            return format.replace(/YYYY|YY|MM|DD|HH|mm|ss/g, k => map[k])
        }
    }


    /**
     * 节点标题元素类
     * 用于显示节点标题
     */
    class NodeTitle extends BaseCmsElement {
        constructor() {
            super()
            this.data
        }
        /**
         * 渲染方法
         * 显示节点标题
         */
        render() {
            if (this.data) {
                this.textContent = this.data.title
            }
        }
    }
    /**
        * 节点内容元素类
        * 用于显示节点内容
        */
    class NodeContent extends BaseCmsElement {
        constructor() {
            super()
            this.data
        }
        /**
         * 渲染方法
         * 显示节点标题
         */
        render() {

            // 否则，先获取修改信息，判断是否需要更新数据
            fetch(BaseCmsURL + '/data/content/' + this.data.id + ".node")
                .then(res => res.text())
                .then(content => { this.innerHTML = content })
        }
    }
    /**
     * 节点信息元素类
     * 用于显示节点信息
     */
    class NodeInfo extends BaseCmsElement {
        constructor() {
            super()
        }
        /**
         * 渲染方法
         * 显示节点信息
         */
        render() {
            if (this.data) {
                this.textContent = this.data.info
            }
        }
    }

    class NodeParent extends CmsList { constructor() { super() } connectedCallback() { } }

    class ListParent extends CmsList { constructor() { super() } connectedCallback() { } }
    /**
     * 查找作用域内的元素
     * @param {Element} rootEl 根元素
     * @param {string} targetSelector 目标选择器
     * @param {Array} excludeSelectors 排除选择器数组
     * @returns {Array} 符合条件的元素数组
     */
    function findScopedElements(rootEl, targetSelector, excludeSelectors = []) {
        const results = []

        // 查找所有目标元素
        const allTargets = rootEl.querySelectorAll(targetSelector)

        allTargets.forEach(el => {
            let parent = el.parentElement
            let shouldExclude = false

            // 遍历父元素，检查是否需要排除
            while (parent && parent !== rootEl) {

                // 1. 排除指定标签（数组）
                if (excludeSelectors.length > 0) {
                    for (const selector of excludeSelectors) {
                        if (parent.matches(selector)) {
                            shouldExclude = true
                            break
                        }
                    }
                    if (shouldExclude) break
                }

                // 2. 排除“同类型父节点”（比如嵌套 a）
                if (parent.tagName === rootEl.tagName) {
                    shouldExclude = true
                    break
                }

                parent = parent.parentElement
            }

            // 如果不需要排除，添加到结果数组
            if (!shouldExclude) {
                results.push(el)
            }
        })

        return results
    }

    //list-封面，可以直接当作img使用
    class ListCover extends BaseCmsElement {
        constructor() {
            super()
        }
        render() {
            if (this.data.cover) {
                const img = document.createElement("img")
                this.classList.forEach(item => {
                    img.classList.add(item)
                })
                img.style = this.getAttribute("style")
                this.parentNode.insertBefore(img, this)
                this.parentNode.removeChild(this)

                this.setAttribute("alt", this.data.cover.filename)
                if (this.getAttribute("cover") != null) {
                    img.src = this.data.cover.cover
                } else {
                    img.src = this.data.cover.url
                }
            }

        }
    }

    class NodeCover extends ListCover { constructor() { super() } }

    //list-模板
    class ListTemplate extends BaseCmsElement {
        constructor() {
            super()
        }
        render() {
            this.addEventListener("click", this.click.bind(this))
        }
        click(e) {
            window.location.href = `${BaseCmsURL}/${this.data.template}?dataId=${this.data.id}`
        }
    }

    //list-模板
    class NodeTemplate extends ListTemplate {
        constructor() {
            super()
        }

        click(e) {
            window.location.href = `${BaseCmsURL}/${this.data.parent.nodeTemplate}?dataId=${this.data.id}`
        }
    }

    // 轮播图组件
    class CmsSlider extends BaseCmsElement {
        constructor() {
            super()
            this.style.display = "block"
            this.dataId
            this.data
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
            this.dataId = this.getAttribute("data")
            if (this.dataId == null) return console.error("cms slider does not have a datId")
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
            this.data = listIndexMap[this.dataId]
            this.loadNode(0)
        }

        render() { }

        //加载子节点并且将节点中的cover添加至nodeCover
        loadNode(index) {
            if (index === this.data.nodes.length) {
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
            this.nodeCover.push(this.data.nodes[index])
            index++
            this.loadNode(index)
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
                this.prevButton = dp(`<div class="sliderPrevButton"><div class="sliderButton"><svg t="1720075833515" class="sliderButtonIcon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26002" ><path d="M461.994667 512l211.2 211.2-60.330667 60.330667L341.333333 512l271.530667-271.530667 60.330667 60.330667z" p-id="26003" fill="#ffffff"></path></svg></div></div>`).element
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
                this.nextButton = dp(`<div class="sliderNextButton"><div class="sliderButton"> <svg t="1720076228912" class="sliderButtonIcon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26190" ><path d="M562.005333 512l-211.2-211.2 60.330667-60.330667L682.666667 512l-271.530667 271.530667-60.330667-60.330667z" p-id="26191" fill="#ffffff"></path></svg></div></div>`).element
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
                    // button.innerText = index + 1
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
                item.dataId = this.data.nodes[index % this.nodeCover.length].id
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
    /**
     * 初始化组件
     * 定义所有自定义元素
     */
    function initComponents() {
        customElements.define('node-cover', NodeCover)
        customElements.define('node-template', NodeTemplate)
        customElements.define('list-template', ListTemplate)
        customElements.define('list-cover', ListCover)
        customElements.define('node-title', NodeTitle)
        customElements.define('node-content', NodeContent)
        customElements.define('node-info', NodeInfo)
        customElements.define('node-date', NodeDate)
        customElements.define('list-name', ListName)
        customElements.define('list-info', ListInfo)
        customElements.define('list-list', ListList)
        customElements.define('list-node', ListNode)

        customElements.define('node-parent', NodeParent)
        customElements.define('list-parent', ListParent)
        customElements.define('cms-node', CmsNode)
        customElements.define('cms-list', CmsList)
        customElements.define('cms-pagination', CmsPagination)

        customElements.define("cms-slider", CmsSlider)
    }
})()