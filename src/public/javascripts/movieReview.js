fetch(`/data/getMovieReviews`)
.then((response) => {
    return response.json()
})
.then((response) => {
    const review_list = response.reviews
    const doc_review_list = document.getElementById("js_reviewlist")
    const body = document.querySelector("body")

    let index = 0

    for (const current of review_list) {
        const doc_writer = document.createElement("p")
        doc_writer.innerHTML = current.user_name
        const doc_review_lock = document.createElement("img")
        if (current.hidden == 1) {
            doc_review_lock.setAttribute("src", "/images/lock.png")
            doc_review_lock.setAttribute("alt", "locked icon")
        }
        doc_review_lock.className = "lock_icon"
        const doc_frominfo = document.createElement("div")
        doc_frominfo.appendChild(doc_writer)
        doc_frominfo.appendChild(doc_review_lock)
        doc_frominfo.className = "review_userinfo"
        
        const doc_text = document.createElement("div")
        doc_text.innerHTML = current.body.replace(/\n/g, "<br>")
        doc_text.className = "review_text"


        const doc_box = document.createElement("div")
        doc_box.appendChild(doc_frominfo)
        doc_box.appendChild(doc_text)
        doc_box.className = "review_box"

        const doc_list = document.createElement("li")
        doc_list.setAttribute("onclick", `overlayOn(${index})`)
        doc_list.appendChild(doc_box)

        doc_review_list.appendChild(doc_list)

        const pop_writer = document.createElement("p")
        pop_writer.innerHTML = `By. ${current.user_name}` 
        const pop_review_lock = document.createElement("img")
        if (current.hidden == 1) {
            pop_review_lock.setAttribute("src", "/images/lock.png")
            pop_review_lock.setAttribute("alt", "locked icon")
        }
        pop_review_lock.className = "lock_icon"
        pop_writer.className = "from"
        const pop_userinfo = document.createElement("div")
        pop_userinfo.appendChild(pop_writer)
        pop_userinfo.appendChild(pop_review_lock)
        pop_userinfo.className = "popup_review_userinfo"

        const pop_header = document.createElement("div")
        pop_header.appendChild(pop_userinfo)
        pop_header.className = "popup_review_header"

        const pop_text = document.createElement("div")
        pop_text.innerHTML = current.body.replace(/\n/g, "<br>")
        pop_text.className = "review_textarea"

        const pop_body = document.createElement("div")
        pop_body.appendChild(pop_text)
        pop_body.className = "popup_review_body"

        const pop_button = document.createElement("div")
        pop_button.innerHTML = "닫기"
        pop_button.setAttribute("onclick", `overlayOff(${index})`)
        pop_button.className = "popup_button"

        const pop_footer = document.createElement("div")
        pop_footer.appendChild(pop_button)
        pop_footer.className = "popup_review_footer"

        const pop_box = document.createElement("div")
        pop_box.appendChild(pop_header)
        pop_box.appendChild(pop_body)
        pop_box.appendChild(pop_footer)
        pop_box.className = "popup_box popup_review"

        const pop_overlay = document.createElement("div")
        pop_overlay.appendChild(pop_box)
        pop_overlay.setAttribute("style", "opacity: 0; display: none;")
        pop_overlay.className = "overlay"

        body.appendChild(pop_overlay)

        index += 1

    }
})
.catch((error) => {
console.log(error)
})

const writeMovieReview = () => {
    const input_name = document.querySelector(".review_name")
    const name = input_name.value

    const textarea = document.querySelector("textarea")
    const text = textarea.value

    const hidden_list = document.getElementsByName("hidden")
    let hidden = 0
    console.log(hidden_list)
    hidden_list.forEach(input => {
        if (input.checked == true) {
            hidden = input.value
        }
    })

    let data = {}
    if (name && text) {
        data = {
            "user_name" : name,
            "body" : text,
            "hidden" : hidden
        }
    }

    fetch("/data/writeMovieReview", {
        method : 'POST',
        body : JSON.stringify(data),
        headers : {
            'Content-Type' : 'application/json'
        }
    }).then((response) => {
        return response.json()
    }).then((response) => {
        if (response.success == true) {
            location.reload()
        } else {
            if (!name) {
                alert("닉네임을 입력해 주세요")
            } else if (!text) {
                alert("내용을 입력해 주세요")
            }
        }
    }).catch((error) => {
        console.log(error)
    })
}