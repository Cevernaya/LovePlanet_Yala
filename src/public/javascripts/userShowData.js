const querystring = location.search
const querys = new URLSearchParams(querystring)
const user_id = querys.get('user_id')

fetch(`/data/${!user_id ? 'sessionUserData' : 'userData'}?user_id=${user_id}`)
.then((response) => {
    return response.json()
})
.then((response) => {
    const user = response.sessionUser[0]
    const user_header = document.querySelector(".user_name")
    const user_name = document.createElement("h1")
    user_name.innerHTML = user.name
    user_header.appendChild(user_name)
    const user_rank = document.createElement("img")
    user_rank.setAttribute("src", `/images/grades/grade${user.rank}.png`)
    user_rank.setAttribute("alt", "rank of user")
    user_rank.className = "user_grade_image"
    user_header.appendChild(user_rank)

    const user_text = document.querySelector(".user_text")
    user_text.innerHTML = `${user.age}, ${user.address} 거주<br>user."가입일자" 가입.<br>${user.movie_character == 0 ? `${user.lovecoin} coin` : ""}`

    const user_info = document.getElementById("user_info")
    const user_body = document.querySelector(".user_body")

    const user_img = document.createElement("img")
    user_img.setAttribute("src", `/images/user/${user.profile_image}`)
    user_img.setAttribute("alt", "profile image of user")
    user_img.className = "profile_img"
    user_info.insertBefore(user_img, user_body)

    if (user.movie_character == 1) {
        const dashboard_title = document.querySelector(".dashboard_title")
        const write_button = document.createElement("div")
        write_button.innerHTML = "Write"
        write_button.setAttribute("onclick", "popupReviewOn()")
        write_button.className = "write_button"
        dashboard_title.appendChild(write_button)

        const review_toimg = document.getElementById("review_toimg")
        review_toimg.setAttribute("src", `/images/user/${user.profile_image}`)
        const review_torank = document.getElementById("review_torank")
        review_torank.setAttribute("src", `/images/grades/grade${user.rank}.png`)
        const review_to = document.getElementById("review_to")
        review_to.innerHTML = `To. ${user.name}`
        const review_touser = document.createElement("input")
        review_touser.setAttribute("type", "text")
        review_touser.setAttribute("name", "to_user")
        review_touser.setAttribute("value", `${user.user_id}`)
        review_touser.setAttribute("style", "display: none;")
        review_to.appendChild(review_touser)
    
        fetch("/data/sessionUserData")
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            const writer = response.sessionUser[0]
    
            const review_from = document.getElementById("review_from")
            review_from.innerHTML = `From. ${writer.name}`
        })    
    }

    return user.user_id
})
.then((user_id) => {
    fetch(`/data/reviews?to_user=${user_id}`)
    .then((response) => {
        return response.json()
    })
    .then((response) => {
        const review_list = response.reviews
        const doc_review_list = document.getElementById("js_reviewlist")
        const body = document.querySelector("body")

        let index = 1

        for (const current of review_list) {
            const doc_fromname = document.createElement("p")
            doc_fromname.innerHTML = current.fu_name
            const doc_fromrank = document.createElement("img")
            doc_fromrank.setAttribute("src", `/images/grades/grade${current.fu_rank}.png`)
            doc_fromrank.setAttribute("alt", "rank of writer")
            doc_fromrank.className = "user_grade_image"
            const doc_reviewstar = document.createElement("div")
            doc_reviewstar.className = `review_star star${current.review_rating}`
            const doc_frominfo = document.createElement("div")
            doc_frominfo.appendChild(doc_fromname)
            doc_frominfo.appendChild(doc_fromrank)
            doc_frominfo.appendChild(doc_reviewstar)
            doc_frominfo.className = "review_userinfo"
            
            const doc_text = document.createElement("div")
            doc_text.innerHTML = current.review_body.replace(/\n/g, "<br>")
            doc_text.className = "review_text"

            const doc_box = document.createElement("div")
            doc_box.appendChild(doc_frominfo)
            doc_box.appendChild(doc_text)
            doc_box.className = "review_box"

            const doc_writer_img = document.createElement("img")
            doc_writer_img.setAttribute("src", `/images/user/${current.fu_profile_image}`)
            doc_writer_img.setAttribute("alt", "profile image of writer")
            doc_writer_img.className = "user_image"

            const doc_list = document.createElement("li")
            doc_list.setAttribute("onclick", `overlayOn(${index})`)
            doc_list.appendChild(doc_writer_img)
            doc_list.appendChild(doc_box)

            doc_review_list.appendChild(doc_list)

            const pop_funame = document.createElement("p")
            pop_funame.innerHTML = `From. ${current.fu_name}`
            pop_funame.className = "from"
            const pop_furank = document.createElement("img")
            pop_furank.setAttribute("src", `/images/grades/grade${current.fu_rank}.png`)
            pop_furank.setAttribute("alt", "rank of writer")
            pop_furank.setAttribute("style", "height: 50px; width: 50px;")
            pop_furank.className = "user_grade_image"
            const pop_tuname = document.createElement("p")
            pop_tuname.innerHTML = `To. ${current.tu_name}`
            pop_tuname.className = "to"
            const pop_userinfo = document.createElement("div")
            pop_userinfo.appendChild(pop_funame)
            pop_userinfo.appendChild(pop_furank)
            pop_userinfo.appendChild(pop_tuname)
            pop_userinfo.className = "popup_review_userinfo"

            const pop_star = document.createElement("div")
            pop_star.className = `popup_review_star popup_review_star${current.review_rating}`

            const pop_stack = document.createElement("div")
            pop_stack.appendChild(pop_userinfo)
            pop_stack.appendChild(pop_star)
            pop_stack.className = "stack_col"

            const pop_fuimg = document.createElement("img")
            pop_fuimg.setAttribute("src", `/images/user/${current.fu_profile_image}`)
            pop_fuimg.setAttribute("alt", "profile image of writer")
            pop_fuimg.className = "popup_review_userphoto"

            const pop_header = document.createElement("div")
            pop_header.appendChild(pop_fuimg)
            pop_header.appendChild(pop_stack)
            pop_header.className = "popup_review_header"

            const pop_text = document.createElement("div")
            pop_text.innerHTML = `${current.review_body.replace(/\n/g, "<br>")}`
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
})
.catch((error) => {
    console.log(error)
})