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
    user_text.innerHTML = `${user.age}, ${user.address} 거주`

    const user_info = document.getElementById("user_info")
    const user_body = document.querySelector(".user_body")
    const user_img = document.createElement("img")
    user_img.setAttribute("src", `/images/user/${user.profile_image}`)
    user_img.setAttribute("alt", "profile image of user")
    user_img.className = "profile_img"
    user_info.insertBefore(user_img, user_body)
    

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

        let index = 0

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
            doc_text.innerHTML = current.review_body
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
            index += 1

            doc_review_list.appendChild(doc_list)

            
        }
    })
    .catch((error) => {
    console.log(error)
    })
})
.catch((error) => {
    console.log(error)
})