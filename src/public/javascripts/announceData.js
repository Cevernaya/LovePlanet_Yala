fetch("/data/notices")
.then((response) => {
    return response.json()
})
.then((response) => {
    const notice_list = response.notices
    const doc_list = document.getElementById("notice_list")

    for (const notice of notice_list) {
        const doc_icon = document.createElement("div")
        doc_icon.className = "announce_icon"
        const doc_title = document.createElement("div")
        doc_title.innerHTML = notice.title
        doc_title.className = "announce_title"
        const doc_header = document.createElement("div")
        doc_header.appendChild(doc_icon)
        doc_header.appendChild(doc_title)
        doc_header.className = "announce_header"
        doc_header.setAttribute("onclick", "toggleBody(this)")

        const doc_body = document.createElement("div")
        doc_body.innerHTML = notice.body
        doc_body.setAttribute("style", "display: none;")
        doc_body.className = "announce_body"

        const doc_li = document.createElement("li")
        doc_li.appendChild(doc_header)
        doc_li.appendChild(doc_body)

        doc_list.appendChild(doc_li)
        
        console.log("hello")

    }

})