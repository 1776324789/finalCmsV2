
/*
    前端组件库
    AheadCMS

*/

try {
    document.body.appendChild(dc("style").txt(`.Loading {
    scale: 1.5;
    line-height:150px;
    color:#fff;
    pointer-events:none;
    z-index: 1000000;
    width: 60px;
    height: 100px;
    position: fixed;
    top: 45%;
    border-radius: 30px;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
    overflow: hidden;
}

.loadingInner {
    width: 120px;
    height: 120px;
    border-radius: 45px;
    background-color: #55aaff;
    left: -30px;
    position: absolute;
    top: 40%;
    transform: translate(-50%, -50%);
    animation: loading 3s linear infinite;
}

@keyframes loading {
    0% {
        top: 40%;
        transform: rotate(0deg);
    }

    50% {
        top: 60%;
        transform: rotate(180deg);
    }

    100% {
        top: 40%;
        transform: rotate(360deg);
    }
}
    
.LoadingFont{
position:absolute;
z-index:100;
font-size:10px;
text-align:center;
width:100%;
}`))
    let LoadingAni = dc("div", 'Loading').add(dc("span", 'LoadingFont').txt("loading")).add(dc("div", "loadingInner"))
    document.body.appendChild(LoadingAni)
    let CmsPageCover = document.createElement("div")
    CmsPageCover.style.backgroundColor = '#fff'
    CmsPageCover.style.position = 'fixed'
    CmsPageCover.style.width = '100vw'
    CmsPageCover.style.height = "100vh"
    CmsPageCover.style.opacity = '1'
    CmsPageCover.style.transition = '0.3s opacity'
    CmsPageCover.style.pointerEvents = 'none'
    CmsPageCover.style.zIndex = '10000'
    CmsPageCover.style.left = '0'
    CmsPageCover.style.top = '0'
    document.body.append(CmsPageCover)

    setTimeout(() => {
        LoadingAni.style.display = "none"
    }, 300);

    document.body.style.scale = 0.98
    document.body.style.borderRadius = "5px"
    document.body.style.boxShadow = "0 0 5px rgba(0,0,0,0.25)"
    document.body.style.overflowY = 'hidden'
    //主路径
    const BaseCmsURL = window.location.origin
    const local = true //是否将加载的list数据存放在localStorage
    const CacheMap = new Map()//缓存数据
    // 提前从localstorage中加载数据
    if (local) {
        function checkDateModify() {
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
                                let listData = JSON.parse(localStorage.getItem("CACHEDATA"))
                                listData.forEach(item => {
                                    CacheMap.set(item.id, item.data)
                                })
                            }
                        }
                    }
                    loadCustomElements()
                }).catch(error => {
                    console.error(error)
                });
        }
        checkDateModify()
    } else {
        loadCustomElements()
    }

    //加载节点数据
    function loadNodeData(id, fun) {
        loadData(id, "node", fun)
    }

    //加载列表数据
    function loadListData(id, fun) {
        loadData(id, "list", fun)
    }
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
                        listData.push({ dataId: data.id, data: data })
                        localStorage.setItem("CACHEDATA", JSON.stringify(listData))
                    }
                    fun(data)
                }).catch(error => {
                    console.error(error)
                });
        }
    }

    // document.body.style.borderRadius = "5px"
    // document.body.style.opacity = "0"
    // document.body.style.position = "fixed"
    // document.body.style.width = '90vw'
    // document.body.style.height = '90vh'
    // document.body.style.left = '5vw'
    // document.body.style.top = '5vh'

    setTimeout(() => {
        document.body.style.transition = "0.3s scale"
    }, 50);


    // 初始化组件的样式
    let baseStyle = `
    
                node-title,
                node-prev,
                node-next,
                node-cover,
                node-date,
                node-content,
                cms-component,
                cms-list,
                cms-node,
                list-list,
                list-name,
                list-cover,
                list-note,
                list-node,
                list-template,
                cms-slider,
                cms-search-result,
                list-pagination{
                    display:block;
                }
                body{
                background-color:#fff;
                }
               html{
                background-color:#eeeeee;
               }

                list-pagination .a-page-info-block {
                    display: flex;
                    flex-wrap: wrap;
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
                    background-color: #55aaff;
                    color: #fff;
                    border: 1px solid #55aaff;
                }

                list-pagination .a-page-info-block .select:hover {
                    background-color: #55aaff;
                    color: #fff;
                    border: 1px solid #55aaff;
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
                    margin-bottom: 10px;
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
                    box-shadow: 0 0 5px #ffffff;
                    background-color: rgb(134, 134, 134) !important;
                    animation: sliderAnimationImgSelected 0.25s ease forwards;
                    width: 13px;
                    height: 13px;
                    border: 1px solid #adadad;
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
                }`
    //加载基础样式
    let style = document.createElement("style")
    style.innerText = baseStyle
    document.body.appendChild(style)
    setTimeout(() => {

        document.body.style.scale = 1
        CmsPageCover.style.opacity = '0'
        setTimeout(() => {
            document.body.style.scale = "unset"
        }, 50);
    }, 50);
    setTimeout(() => {
        document.body.style.boxShadow = "0 0 0px rgba(0,0,0,0.25)"
        document.body.style.overflowY = 'auto'
    }, 700);
    // setTimeout(() => {
    //     document.body.style.left = '0'
    //     document.body.style.top = '0'
    //     document.body.style.opacity = 1
    //     document.body.style.width = '100vw'
    //     document.body.style.height = '100vh'
    // }, 100);
    // setTimeout(() => {
    //     document.body.style.borderRadius = 0
    //     document.body.style.overflowY = 'auto'
    //     document.body.style.position = "unset"
    // }, 1000);

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
        document.body.style.scale = 0.98
        CmsPageCover.style.top = document.body.scrollTop + "px"
        CmsPageCover.style.opacity = '1'
        LoadingAni.style.display = "block"
        LoadingAni.style.top = "calc(45% + " + document.body.scrollTop + "px)"
        document.body.style.borderRadius = "5px"
        document.body.style.boxShadow = "0 0 5px rgba(0,0,0,0.25)"
        document.body.style.overflowY = 'hidden'
        setTimeout(() => {
            window.location.href = url
        }, 300);
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


    class CmsElement extends HTMLElement {
        constructor() {
            super()
            this.dataTemp
        }

        set dataId(value) {
            this.dataTemp = value
            this.dataIdChange()
            this.loadFocus()
        }

        dataIdChange() {

        }

        loadFocus() {
            const urlParams = new URLSearchParams(window.location.search);
            const urlDataId = urlParams.get('dataId');
            if (this.getAttribute("focus:class") && this.dataId == urlDataId) {
                this.getAttribute("focus:class").split(" ").forEach(item => this.classList.add(item))
            }
        }

        get dataId() {
            return this.dataTemp
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
            if (this.getAttribute("data"))
                this.dataId = this.getAttribute("data")
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
            this.init()
        }

        init() {
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

        onchange(e) { }

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
            for (let i = startPage; i <= endPage; i++)
                pageIndexes.push(i);
            if (pageIndexes[0] > 1) pageIndexes.unshift(1)
            if (pageIndexes[pageIndexes.length - 1] < Math.ceil(this.totalTem / this.limitTem)) pageIndexes.push(Math.ceil(
                this.totalTem / this.limitTem))
            return pageIndexes;
        }
    }

    //list-封面，可以直接当作img使用
    class ListCover extends CmsElement {
        constructor() {
            super()
            this.img
        }

        set src(value) {
            this.img = document.createElement("img")
            this.classList.forEach(item => {
                this.img.classList.add(item)
            })

            let str = ""
            for (var key in this.style) {
                str = str + `${key}:${this.style[key]};`
            }
            this.img.style = str
            this.parentNode.insertBefore(this.img, this)
            let url = value.substring(0, 4) == "http" ? value : BaseCmsURL + value
            if (localStorage.getItem(url) != null) {
                this.img.src = localStorage.getItem(url)
            } else {
                this.img.src = url
                this.img.onload = (e) => {
                    loadImgToLocalStorage(this.img)
                }
            }
            this.parentNode.removeChild(this)
        }
    }

    async function loadImgToLocalStorage(imgElement) {
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
                const base64String = canvas.toDataURL('image/png');  // 默认输出为 png 格式，可以根据需要修改
                localStorage.setItem(imgElement.src, base64String)
            }
        } catch (error) {
            console.error('Error fetching the image:', error);
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
            if (this.getAttribute("en") != null) this.innerText = value.enName
            else this.innerText = value.name
        }
        get data() {
            return this.dataTemp
        }
    }

    class ListParent extends CmsElement {
        constructor() { super() }
    }

    class ListTemplate extends CmsElement {
        constructor() { super() }
    }

    class ListList extends CmsElement {
        constructor() { super() }
    }

    class ListNode extends CmsElement {
        constructor() { super() }
    }

    // cms-list 样式
    class CmsList extends CmsElement {
        constructor() {
            super()
            this.ifIndexing = false//数据是否正在排序
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

        initDataId() {
            //dataId的优先级，this.getAttribute("data") > parentNode(cms-component).dataId > window.location.url.dataId > this.getAttribute("dev")
            this.dataId = this.getAttribute("dev")
            // 获取地址栏中的参数
            const urlParams = new URLSearchParams(window.location.search);
            const urlDataId = urlParams.get('dataId');
            if (urlDataId != null) {
                this.dataId = urlDataId
            }
            let cmsComponentId = this.getCmsComponentId(this.parentNode)
            if (cmsComponentId != null) {
                this.dataId = cmsComponentId
            }
            if (this.getAttribute("data") != null) {
                this.dataId = this.getAttribute("data")
            }

        }
        getCmsComponentId(parent) {
            if (parent.tagName == "BODY" || parent.tagName == "CMS-LIST") return null
            if (parent.tagName != "CMS-COMPONENT") {
                return this.getCmsComponentId(parent.parentNode)
            } else if (parent.tagName == "CMS-COMPONENT") {
                return parent.getAttribute("data")
            }
        }

        //加载子元素
        loadElement() {
            this.loadName()
            this.loadNote()
            this.loadCover()
            this.loadListList()
            this.loadListNode()
            this.loadListTemplate()
            this.loadListParent()
            // 确认父类，当父类为List-parent或者list-list时，则将自身children移动到父类中
            this.confirmParent()
            lifeCycle.signOut(this)
        }
        // 加载元素中的所有title标签
        loadCover() {
            Array.from(this.children).forEach(item => {
                this.verifyNodeCover(item)
            })
        }

        verifyNodeCover(node) {
            if (node.tagName == "LIST-LIST") return
            if (node.tagName == "LIST-COVER") {
                node.dataId = this.dataId
                node.src = this.data.cover
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
                        if ((url + "").substring(0, 4) == "http")
                            window.open(url, '_blank');
                        else
                            window.open("/" + url + ".html?dataId=" + this.data.id, '_blank');
                    } else {
                        if ((url + "").substring(0, 4) == "http") {
                            toPage(url)
                        }
                        else {
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
                node.dataId = this.dataId
                this.initListNode(node)
                return
            }
            Array.from(node.children).forEach(item => {
                this.verifyListNode(item)
            })
        }
        getPaginationParent(pagination) {
            if (pagination.parentNode.tagName == "LIST-NODE") return pagination
            else return this.getPaginationParent(pagination.parentNode)
        }
        initListNode(node) {
            let pagination = null
            let childTemp = []
            Array.from(node.getElementsByTagName("LIST-PAGINATION")).forEach(item => {
                pagination = item
                pagination.dataId = this.dataId
                pagination = this.getPaginationParent(pagination)
                pagination.parentNode.removeChild(pagination)
            })

            Array.from(node.childNodes).forEach(item => {
                childTemp.push(item)
            })
            childTemp.forEach(item => {
                node.removeChild(item)
            })
            let ids = JSON.parse(JSON.stringify(this.data.nodeId))
            ids = ids.filter(id => {
                return id.publish.publish
            })
            if (node.getAttribute("order") != null || node.getAttribute("top") != null) {
                // 根据日期正向排序
                if (node.getAttribute("order") == "desc" || node.getAttribute("order") == "") {
                    for (let a = 0; a < ids.length; a++) {
                        for (let b = 0; b < ids.length; b++) {
                            if (this.convertToMillis(ids[a].date) > this.convertToMillis(ids[b].date)) {
                                let temp = ids[a]
                                ids[a] = ids[b]
                                ids[b] = temp
                            }
                        }
                    }
                } else if (node.getAttribute("order") == "asc") {  // 根据日期反向排序
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
                if (node.getAttribute("top") != null) {
                    let top = []
                    for (let a = ids.length - 1; a >= 0; a--) {
                        if (ids[a].top.top) {
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

            if (pagination == null)
                page = node.getAttribute("page") * 1
            else {
                const urlParams = new URLSearchParams(window.location.search);
                page = urlParams.get('page') * 1;
            }
            if (page == null || page == "") page = 1
            limit = node.getAttribute("limit") * 1

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
            for (let a = start; a < end; a++) {
                if (ids[a] == null) break
                let cmsNodeEmlement = document.createElement("cms-node")
                childTemp.forEach(item => {
                    cmsNodeEmlement.appendChild(item.cloneNode(true))
                })
                if (node.getAttribute("top") != null)
                    cmsNodeEmlement.setAttribute("top", true)
                cmsNodeEmlement.setAttribute("data", ids[a].id)
                node.appendChild(cmsNodeEmlement)
            }
            if (pagination != null) {
                node.appendChild(pagination)
                pagination.page = page
                pagination.limit = limit
                pagination.total = ids.length
                pagination.onchange = (e) => {
                    if (this.data.template != null && this.data.template != "")
                        toPage("/" + this.data.template + ".html?dataId=" + this.data.id + "&page=" + e.page)
                }
            }
        }

        convertToMillis(dateString) {
            return new Date(dateString).getTime();
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
            if (node.getAttribute("index") != null) {//数据并未进行排序
                if (!this.ifIndexing) {
                    this.indexListData()
                    this.addEventListener("_indexevent", () => {
                        this.loadListListElementIndex(node)
                    })
                } else if (this.ifIndex) {//数据正在进行排序
                    this.addEventListener("_indexevent", () => {
                        this.loadListListElementIndex(node)
                    })
                } else {//数据已排序
                    this.loadListListElementIndex(node)
                }
            }
            else {
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
                if (index == this.data.listId.length)
                    this.loadListDataDone()
                else
                    this.loadListDataToLoadIndex(index)
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

    //node-封面，可以直接当作img使用
    class NodeCover extends CmsElement {
        constructor() {
            super()
            this.img
        }

        set src(value) {
            this.img = document.createElement("img")
            this.classList.forEach(item => {
                this.img.classList.add(item)
            })

            let str = ""
            for (var key in this.style) {
                str = str + `${key}:${this.style[key]};`
            }
            this.img.style = str
            this.parentNode.insertBefore(this.img, this)
            let url = value.substring(0, 4) == "http" ? value : BaseCmsURL + value
            if (localStorage.getItem(url) != null) {
                this.img.src = localStorage.getItem(url)
            } else {
                this.img.src = url
                this.img.onload = (e) => {
                    loadImgToLocalStorage(this.img)
                }
            }
            this.parentNode.removeChild(this)
        }
    }


    //node-日期
    class NodeDate extends CmsElement {
        constructor() {
            super()
        }

        set date(value) {
            if (this.getAttribute("format") != null) {
                value = this.formatTime(value, this.getAttribute("format"))
            }
            this.innerText = value
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
                }).catch(error => {
                    console.error(error)
                });
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
            this.linkTem
            this.nameTem
            this.init()
        }
        set name(value) {
            this.innerText = value
            this.nameTem = value
        }
        get name() {
            return this.nameTem
        }
        set link(value) {
            this.linkTem = value
        }
        get link() {
            return this.linkTem
        }
        init() {
            this.onclick = () => {
                const a = document.createElement('a');
                a.style.display = 'none';
                a.download = this.name;
                a.href = this.link.substring(0, 4) == "http" ? this.link : BaseCmsURL + this.link;
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

    class NodeParent extends CmsElement { }

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
            this.dataId
        }

        connectedCallback() {
            this.initDataId()
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
            if (this.getAttribute("top") != null)
                this.loadTop()
            this.loadClicks()
            this.loadCover()
            this.loadTemplate()
            this.loadContent()
            this.loadLink()
            this.loadFile()
            this.loadParent()
            this.loadPrev()//加载跳转上一篇文章
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
                node.dataId = this.dataId
                node.link = this.data.file
                node.name = this.data.fileName
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
        // 加载元素中的所有title标签
        loadLink() {
            Array.from(this.children).forEach(item => {
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
                    console.log(location)
                    if (location != null && location != "")
                        toPage("/" + location + ".html?dataId=" + this.data.id)
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
            if (node.tagName == "NODE-COVER") {
                node.dataId = this.dataId
                node.src = this.data.cover
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
                node.innerText = this.data.clicks
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

                node.innerText = this.data.top.top ? "置顶" : ""
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
                node.innerText = this.data.note
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
                node.date = this.data.date
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
                node.innerText = this.data.title
                return
            }
            Array.from(node.children).forEach(item => {
                this.verifyNodeTitle(item)
            })
        }
        initDataId() {
            //dataId的优先级，this.getAttribute("data") > parentNode(cms-component).dataId > window.location.url.dataId > this.getAttribute("dev")
            this.dataId = this.getAttribute("dev")
            // 获取地址栏中的参数
            const urlParams = new URLSearchParams(window.location.search);
            const urlDataId = urlParams.get('dataId');
            if (urlDataId != null) {
                this.dataId = urlDataId
            }
            let cmsComponentId = this.getCmsComponentId(this.parentNode)
            if (cmsComponentId != null) {
                this.dataId = cmsComponentId
            }
            if (this.getAttribute("data") != null) {
                this.dataId = this.getAttribute("data")
            }
        }

        getCmsComponentId(parent) {
            if (parent.tagName == "BODY" || parent.tagName == "CMS-LIST") return null
            if (parent.tagName != "CMS-COMPONENT") {
                return this.getCmsComponentId(parent.parentNode)
            } else if (parent.tagName == "CMS-COMPONENT") {
                return parent.getAttribute("data")
            }
        }


    }



    class CmsSearchResult extends CmsElement {
        constructor() {
            super()
            this.result
            this.total
            this.pagination
            this.init()
        }

        init() {
            this.loadSearch()

        }
        loadSearch() {
            let urlParams = new URLSearchParams(window.location.search);
            let searchContent = urlParams.get('search');
            let page = urlParams.get('page');
            let limit = urlParams.get('limit');
            page == null ? page = 1 : page = page
            limit == null ? limit = 10 : limit = limit
            fetch(`${BaseCmsURL}/search/${searchContent}/${page}/${limit}`).then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.code == 200) {
                        this.result = data.data.result
                        this.total = data.data.total
                        this.loadResult()

                    }
                }).catch(error => {
                    console.log(error)
                });
        }
        getPaginationParent(pagination) {
            if (pagination.parentNode.tagName == "CMS-SEARCH-RESULT") return pagination
            else return this.getPaginationParent(pagination.parentNode)
        }

        loadResult() {
            Array.from(this.getElementsByTagName("LIST-PAGINATION")).forEach(item => {
                item = this.getPaginationParent(item)
                item.parentNode.removeChild(item)
                this.pagination = item
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

            this.appendChild(this.pagination)
            let urlParams = new URLSearchParams(window.location.search);
            let page = urlParams.get('page');
            if (page == null || page == "") page = 1
            let limit = urlParams.get('limit');
            if (limit == null || limit == "") limit = 10

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
            if (this.getAttribute("page") == null || this.getAttribute("page") == "") this.page = null
            else this.page = this.getAttribute("page") * 1
            if (this.getAttribute("limit") == null || this.getAttribute("limit") == "") this.limit = null
            else this.limit = this.getAttribute("limit") * 1
            this.initDataId()
            if (this.dataId == null) return console.log("slider does not hava a datId")
            this.loadBaseBlock()
            this.loadNodeList()

        }


        autoSlide(index) {
            index++
            if (this.getAttribute("auto") != null && this.getAttribute != "") {
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
            if (this.getAttribute("auto") != null && this.getAttribute != "") {
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
            if (index == this.listData.nodeId.length) {
                this.loadCovers(0)
                return
            }
            if (this.limit != null && this.page != null) {
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

            if (this.limit != null && this.page != null) {
                if (index < (this.page - 1) * this.limit || index >= this.page * this.limit) {
                    index++
                    this.loadCovers(index)
                    return
                }
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
            img.src = item.substring(0, 4) == "http" ? item : BaseCmsURL + item
            imgBg.src = item.substring(0, 4) == "http" ? item : BaseCmsURL + item
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

        // 加载轮播图的基础框架
        loadBaseBlock() {
            this.style.width = this.getAttribute("width")
            this.style.height = this.getAttribute("height")
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

            this.nextButton = dp(`<div class="sliderNextButton">
            <div class="sliderButton"> <svg t="1720076228912" class="sliderButtonIcon" viewBox="0 0 1024 1024"
                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26190" >
                    <path
                        d="M562.005333 512l-211.2-211.2 60.330667-60.330667L682.666667 512l-271.530667 271.530667-60.330667-60.330667z"
                        p-id="26191" fill="#ffffff"></path>
                </svg>
            </div>
        </div>`).element
            this.selectButtonBlock = dp(`<div class="sliderBottomSelectButtonBlock"></div>`).element
            this.imgBlock = dp(`<div class="sliderImgMainBlock"></div>`).element
            this.appendChild(this.prevButton)
            this.appendChild(this.nextButton)
            this.appendChild(this.selectButtonBlock)
            this.appendChild(this.imgBlock)
            this.prevButton.onclick = () => {
                this.index--
                this.resetAuto()
            }

            this.nextButton.onclick = () => {
                this.index++
                this.resetAuto()
            }
        }

        appendImg(block, img, index) {
            this.imgBlock.appendChild(block)
            if (img.naturalHeight > img.naturalWidth) {
                img.style.height = "100%"
            } else {
                img.style.width = "100%"
            }
            let selectButton = document.createElement("div")
            selectButton.classList.add("sliderBottomSelectButton")
            this.selectButtonBlock.appendChild(selectButton)
            block["selectButton"] = selectButton
            selectButton.onclick = () => {
                this.index = index
                this.resetAuto()
            }
            if (index == this.index) selectButton.classList.add("imgSelect")
        }

        //修正图片在空间中的位置
        fixPositionImgs() {
            this.nodeCover.forEach((item, index) => {
                item.style.transition = "0s left"
                item.style.left = (index - this.index) * this.clientWidth + "px"
                setTimeout(() => {
                    item.style.transition = "0.3s left"
                }, 300);
            })
            this.prevButton.style.width = (this.clientWidth / 12 > 40 ? 40 : this.clientWidth / 12 < 20 ? 20 : this.clientWidth / 12) + "px"
            this.prevButton.style.height = (this.clientHeight / 4 > 75 ? 75 : this.clientHeight / 4 < 40 ? 40 : this.clientHeight / 4) + "px"
            this.nextButton.style.width = (this.clientWidth / 12 > 40 ? 40 : this.clientWidth / 12 < 20 ? 20 : this.clientWidth / 12) + "px"
            this.nextButton.style.height = (this.clientHeight / 4 > 75 ? 75 : this.clientHeight / 4 < 40 ? 40 : this.clientHeight / 4) + "px"
            document.querySelector('.sliderPrevButton').style.setProperty('--svgFontSize', (this.clientWidth / 13 > 40 ? 40 : this.clientWidth / 13 < 15 ? 15 : this.clientWidth / 13) + "px");
            document.querySelector('.sliderNextButton').style.setProperty('--svgFontSize', (this.clientWidth / 13 > 40 ? 40 : this.clientWidth / 13 < 15 ? 15 : this.clientWidth / 13) + "px");
        }

        // 当前显示的图片，传入图片在数组中的下标切换图片
        set index(value) {
            if (value == this.nodeCover.length) value = 0
            if (value == -1) value = this.nodeCover.length - 1
            this.indexTem = value
            this.nodeCover.forEach((item, index) => {
                if (index == (value % this.nodeCover.length))
                    item.selectButton.classList.add("imgSelect")
                else
                    item.selectButton.classList.remove("imgSelect")
                item.style.left = (index - value) * this.clientWidth + "px"
            })
        }

        get index() {
            return this.indexTem
        }

        // 初始化dataId
        initDataId() {
            //dataId的优先级，this.getAttribute("data") > parentNode(cms-component).dataId > window.location.url.dataId > this.getAttribute("dev")
            this.dataId = this.getAttribute("dev")
            let cmsComponentId = this.getCmsComponentId(this.parentNode)
            if (cmsComponentId != null) {
                this.dataId = cmsComponentId
            }
            if (this.getAttribute("data") != null) {
                this.dataId = this.getAttribute("data")
            }
        }

        // 获取cms-component.dataId
        getCmsComponentId(parent) {
            if (parent.tagName == "BODY" || parent.tagName == "CMS-LIST") return null
            if (parent.tagName != "CMS-COMPONENT") {
                return this.getCmsComponentId(parent.parentNode)
            } else if (parent.tagName == "CMS-COMPONENT") {
                return parent.getAttribute("data")
            }
        }
    }
    function loadCustomElements() {
        customElements.define("cms-component", CmsComponent)
        customElements.define("list-pagination", NodePagination)
        customElements.define("list-cover", ListCover)
        customElements.define("list-name", ListName)
        customElements.define("list-parent", ListParent)
        customElements.define("list-template", ListTemplate)
        customElements.define("list-list", ListList)
        customElements.define("list-node", ListNode)
        customElements.define("cms-list", CmsList)
        customElements.define("list-note", ListNote)
        customElements.define("node-cover", NodeCover)
        customElements.define("node-date", NodeDate)
        customElements.define("node-content", NodeContent)
        customElements.define("node-link", NodeLink)
        customElements.define("node-file", NodeFile)
        customElements.define("node-prev", NodePrev)
        customElements.define("node-parent", NodeParent)
        customElements.define("node-next", NodeNext)
        customElements.define("cms-node", CmsNode)
        customElements.define("cms-search-result", CmsSearchResult)
        customElements.define("cms-slider", CmsSlider)
    }

} catch (error) {
    console.log(error)
}