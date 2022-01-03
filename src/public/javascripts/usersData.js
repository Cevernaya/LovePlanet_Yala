fetch("/data/sessionUserData")
.then((response) => {
    return response.json()
})
.then((response) => {
    const user = response.sessionUser[0]
    const ul = document.getElementById("users_list")
    const first = document.getElementById("first_user")

    const doc_name = document.createElement("p")
    doc_name.innerHTML = user.name
    const doc_rank = document.createElement("img")
    doc_rank.setAttribute("src", `/images/grades/grade${user.rank}.png`)
    doc_rank.setAttribute("alt", "rank of user")
    doc_rank.className = "user_grade_image"
    const doc_moreinfo = document.createElement("p")
    doc_moreinfo.innerHTML = `${user.age} / ${user.address}`
    doc_moreinfo.className = "user_moreinfo"
    const doc_info = document.createElement("div")
    doc_info.appendChild(doc_name)
    doc_info.appendChild(doc_rank)
    doc_info.appendChild(doc_moreinfo)
    doc_info.className = "user_info"

    const doc_text = document.createElement("div")
    doc_text.className = "user_text"

    const doc_box = document.createElement("div")
    doc_box.appendChild(doc_info)
    doc_box.appendChild(doc_text)
    doc_box.className = "user_box"

    const doc_img = document.createElement("img")
    doc_img.setAttribute("src", `images/user/${user.profile_image}`)
    doc_img.setAttribute("alt", "profile image of user")
    doc_img.className = "user_image"

    const doc_li = document.createElement("li")
    doc_li.setAttribute("onclick", "location.href='/userShow'")
    doc_li.appendChild(doc_img)
    doc_li.appendChild(doc_box)

    ul.insertBefore(doc_li, first)

})
.catch((error) => {
    console.log(error)
})