let visitorData
let vistiDateChart; // 用于存储图表实例
function formData(value) {
    let date = new Date(value)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
function loadvisitorDataChart() {

    for (key in visitorData) {
        document.getElementById('visitorDataSelect').appendChild(dc("option").val(key).txt(key))
    }
    document.getElementById('visitorDataSelect').onchange = (e) => {
        loadvisitorIp(document.getElementById('visitorDataSelect').value)
    }
}

function loadvisitorIp(date) {
    document.getElementById('visitorIpList').innerHTML = ""
    visitorData[date].visitor.forEach((item, index) => {
        let element = dp(`<div class="lineArticle">
                        <div class="lineIndex">${index + 1}</div>
                        <div class="ipLabel" style="color: #407BFF;">${item}</div>
                        <div class="titleLabel" style="display:none;" ref="location"></div>
                    </div>`)
        document.getElementById('visitorIpList').appendChild(element.element)
        // setTimeout(() => {
        //     fetchIp(item, element.children.location)
        // }, 50 * index);

    })
}

const errorTime = new Map()

function fetchIp(ip, element) {
    try {
        fetch('http://121.40.194.57:1522/query?ip=' + ip)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json(); // 将响应解析为 JSON
            })
            .then(data => {
                if (data.code == 400) {
                    element.innerText = "--"
                } else
                    element.innerText = data.data.country + "-" + data.data.prov + "-" + data.data.city
            })
            .catch(error => {
                if (errorTime.has(ip)) {
                    errorTime.set(ip, errorTime.get(ip) + 1)
                } else {
                    errorTime.set(ip, 0)
                }
                if (errorTime.get(ip) < 3) {
                    setTimeout(() => {
                        fetchIp(ip, element)
                    }, 500);
                }

            });
    } catch (error) {

    }

}

// 添加时间选择器的初始化和验证
function initDatePicker() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    // 设置默认值为最近30天
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    startDate.value = thirtyDaysAgo.toISOString().split('T')[0];
    endDate.value = today.toISOString().split('T')[0];

    // 添加日期验证
    startDate.addEventListener('change', function () {
        if (endDate.value && this.value > endDate.value) {
            document.tip.warn("开始日期不能大于结束日期", 2500);
            this.value = endDate.value;
        }
        loadDateClickData();
    });

    endDate.addEventListener('change', function () {
        if (startDate.value && this.value < startDate.value) {
            document.tip.warn("结束日期不能小于开始日期", 2500);
            this.value = startDate.value;
        }
        loadDateClickData();
    });
}

// 修改 loadDateClickData 函数
function loadDateClickData() {
    fetch(BaseUrl + '/getClickDateData', {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem("userToken")
        },
    }).then(response => response.json()).then(res => {
        if (res.code == 200) {
            const vistiDateElement = document.getElementById('vistiDate');
            visitorData = res.data;
            loadvisitorDataChart();

            // 获取选择的日期范围
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(document.getElementById('endDate').value);

            let date = [];
            let data = [];
            let datavisitorNum = [];

            // 计算总计数据
            let totalClicks = 0;
            let totalVisitors = 0;

            // 按日期范围过滤数据
            for (var key in res.data) {
                const currentDate = new Date(key);
                if (currentDate >= startDate && currentDate <= endDate) {
                    date.push(key.substring(5, key.length));
                    data.push(res.data[key].clicks);
                    datavisitorNum.push(res.data[key].visitor.length);

                    // 累加总数
                    totalClicks += res.data[key].clicks;
                    totalVisitors += res.data[key].visitor.length;
                }
            }

            // 更新统计显示
            document.getElementById('totalClicks').textContent = totalClicks;
            document.getElementById('totalVisitors').textContent = totalVisitors;

            // 如果已存在图表实例，先销毁它
            if (vistiDateChart) {
                vistiDateChart.destroy();
            }

            // 创建新的图表
            vistiDateChart = new Chart(vistiDateElement, {
                type: 'line',
                data: {
                    labels: date,
                    datasets: [{
                        label: '日点击量',
                        data: data,
                        borderWidth: 1.5,
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            color: 'rgba(85,170,255,0.75)',
                            font: {
                                weight: 'bold'
                            },
                            formatter: function (value) {
                                return value;
                            }
                        }
                    }, {
                        type: 'line',
                        label: '日访问人数/设备',
                        data: datavisitorNum,
                        borderWidth: 1.5,
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            color: 'rgba(255,0,0,0.75)',
                            font: {
                                weight: 'bold'
                            },
                            formatter: function (value) {
                                return value;
                            }
                        }
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        } else if (res.code == 203) {
            //token无效或过期
            window.parent.userTokenOverDue()
        }
    }).catch(error => {
        document.tip.danger("获取数据失败" + error, 2500)
    });
}

let allClicksData = null;
let listClicksMap = new Map()
let articleNum = 0

function loadListClickData() {
    fetch(BaseUrl + '/getClicksData', {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem("userToken")
        },
    }).then(response => response.json()).then(res => {
        if (res.code == 200) {
            const listClicksElement = document.getElementById('listClicks');
            allClicksData = res.data

            // 计算总点击量和总文章数
            let totalClicks = 0;
            let totalArticles = 0;

            for (var key in allClicksData) {
                articleNum++
                let item = allClicksData[key]
                totalClicks += item.clicks; // 累加点击量

                if (!listClicksMap.has(item.parentId))
                    listClicksMap.set(item.parentId, {
                        clicks: item.clicks,
                        name: item.parentName,
                        articleNum: 1
                    })
                else {
                    listClicksMap.get(item.parentId).clicks += item.clicks
                    listClicksMap.get(item.parentId).articleNum++
                }
            }

            // 更新统计显示
            document.getElementById('totalListClicks').textContent = totalClicks;
            document.getElementById('totalListArticles').textContent = articleNum;

            let listLabel = []
            let listData = []
            let listArticleNum = []
            Array.from(listClicksMap).forEach(item => {
                listLabel.push(item[1].name)
                listData.push(item[1].clicks)
                listArticleNum.push(item[1].articleNum)
            })
            for (let a = 0; a < listData.length; a++) {
                for (let b = 0; b < listData.length; b++) {
                    if (listData[a] > listData[b]) {
                        let temp = listData[a]
                        listData[a] = listData[b]
                        listData[b] = temp
                        temp = listLabel[a]
                        listLabel[a] = listLabel[b]
                        listLabel[b] = temp
                    }
                }
            }
            const listClicksChart = new Chart(listClicksElement, {
                type: 'bar',
                data: {
                    labels: listLabel,
                    datasets: [{
                        type: 'line',
                        label: '栏目点击量',
                        data: listData,
                        borderWidth: 1.5,
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            color: 'rgba(85,170,255,0.75)',
                            font: {
                                weight: 'bold'
                            },
                            formatter: function (value) {
                                return value;
                            }
                        }
                    }, {
                        label: '栏目文章数量',
                        data: listArticleNum,
                        borderWidth: 1.5,
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            color: 'rgba(255,0,0,0.75)',
                            font: {
                                weight: 'bold'
                            },
                            formatter: function (value) {
                                return value;
                            }
                        }
                    }]
                },
                options: {
                    indexAxis: 'y',
                },
                plugins: [ChartDataLabels]
            });
            window.addEventListener('mousemove', () => {
                listClicksChart.resize()
            })
            loadArticleClickData()
        } else if (res.code == 203) {
            //token无效或过期
            window.parent.userTokenOverDue()
        }
    }).catch(error => {
        document.tip.danger("获取数据失败" + error, 2500)
    });
}

const articleClicksList = document.getElementById('articleClicksList')
const listArticleNum = document.getElementById('listArticleNum')
let articleElements = []

function loadArticleClickData() {
    let all = 0
    document.getElementById('articleClicksListContentBlock').label = "文章点击量（" + articleNum + "篇）"
    let index = 1
    for (var key in allClicksData) {
        let item = allClicksData[key]
        let element = dp(`<div class="lineArticle">
                        <div class="lineIndex" ref="index">${index}</div>
                        <div class="lineClicks" style="color:#407BFF;">${item.parentName}</div>
                        <div class="lineTitle">${item.title}</div>
                        <div class="lineClicks">${item.clicks}</div>
                         <div class="lineDate">${item.date}</div>
                    </div>`)
        element.element["title"] = item.title
        element.element["list"] = item.parentName
        element.element['setIndex'] = (value) => {
            element.children.index.innerText = value
        }
        articleElements.push(element.element)
        index++
        articleClicksList.appendChild(element.element)
    }
}

loadDateClickData()
loadListClickData()
document.getElementById('articleSearch').onkeyup = () => {
    let index = 1
    articleElements.forEach(item => {
        if (!item.title.includes(document.getElementById('articleSearch').value) || !item.list.includes(document.getElementById('listSearch').value)) {
            item.hide()
        } else {
            item.show("flex")
            item.setIndex(index)
            index++
        }
    })
}
document.getElementById('listSearch').onkeyup = () => {
    let index = 1
    articleElements.forEach(item => {
        if (!item.title.includes(document.getElementById('articleSearch').value) || !item.list.includes(document.getElementById('listSearch').value)) {
            item.hide()
        } else {
            item.show("flex")
            item.setIndex(index)
            index++
        }
    })
}

// 在页面加载完成后初始化日期选择器
document.addEventListener('DOMContentLoaded', function () {
    initDatePicker();
});