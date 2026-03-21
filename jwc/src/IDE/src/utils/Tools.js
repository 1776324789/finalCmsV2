const formatDate = (timeStr, format) => {
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

module.exports = { formatDate }