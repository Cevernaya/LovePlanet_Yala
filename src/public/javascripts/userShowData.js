const querystring = location.search
const querys = new URLSearchParams(querystring)
const user_id = querys.get('user_id')

const charge = () => {
    alert("담당 관리자(제시카)에게 러브코인을 구걸하시겠습니까?")
    alert("제시카가 당신에게 자비를 베풀 지 고민하고 있습니다...")
    alert("제시카가 당신을 마음에 들어하지 않습니다...")
    alert("하지만 당신이 나락으로 떨어지는 모습을 한 번쯤 더 보고싶어하는 것 같군요!")
    alert("제시카는 당신에게 약간의 자비를 베풀어보기로 결정했습니다.")

    fetch('/data/begBasicIncome')
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            if (response.success) {
                location.reload()
            }
        })
}

const mouseentered = () => {
    document.getElementById("reset_popup").style.display = "block"
}

const mouseleft = () => {
    document.getElementById("reset_popup").style.display = "none"
}

fetch(`/data/${!user_id ? 'sessionUserData' : 'userData'}?user_id=${user_id}`)
    .then((response) => {
        return response.json()
    })
    .then((response) => {
        // user info of user page (profile)
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
        if (user.user_id == 2) {
            // jongsoo has instagram page & SNS analysis
            const user_insta = document.createElement("img")
            user_insta.setAttribute("src", `/images/logos/instagram.png`)
            user_insta.setAttribute("alt", "instagram logo")
            user_insta.setAttribute("onclick", "location.href='/instaShow'")
            user_insta.className = "user_sns"
            const user_analysis = document.createElement("img")
            user_analysis.setAttribute("src", `/images/snsAnalysis.png`)
            user_analysis.setAttribute("alt", "sns analysis")
            user_analysis.setAttribute("onclick", "location.href='/snsAnalysis'")
            user_analysis.className = "user_sns"
            user_header.appendChild(user_insta)
            user_header.appendChild(user_analysis)
        }

        const user_login_year = `${user.first_login}`.slice(0, 4)
        const user_login_month = `${user.first_login}`.slice(5, 7)
        const user_login_date = `${user.first_login}`.slice(8, 10)
        const user_login_text = `${user_login_year}년 ${user_login_month}월 ${user_login_date}일 가입.`
        const user_text = document.querySelector(".user_text")
        user_text.innerHTML = `• ${user.age}, ${user.address} 거주<br>• ${user_login_text}<br>${user.movie_character == 0 ? `• ${user.lovecoin} coin` : ""}`

        const user_info = document.getElementById("user_info")
        const user_body = document.querySelector(".user_body")

        const user_img = document.createElement("img")
        user_img.setAttribute("src", `/images/user/${user.profile_image}`)
        user_img.setAttribute("alt", "profile image of user")
        user_img.className = "profile_img"
        user_info.insertBefore(user_img, user_body)

        if (user.movie_character == 1) {
            // review button & form for movie characters
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
        } else if (user.lovecoin < 100) {
            // free charging button when lovecoin < 100
            const user_reset_coin = document.createElement("div")
            user_reset_coin.className = "reset_coin"
            user_reset_coin.innerText = "충전"
            user_reset_coin.addEventListener("dblclick", charge)
            user_reset_coin.addEventListener("mouseenter", mouseentered)
            user_reset_coin.addEventListener("mouseleave", mouseleft)
            const user_reset_hover = document.createElement("div")
            user_reset_hover.innerHTML = '더블클릭으로 관리자에게 러브코인 구걸하기'
            user_reset_hover.className = "reset_coin_popup"
            user_reset_hover.id = "reset_popup"
            user_body.appendChild(user_reset_hover)
            user_body.appendChild(user_reset_coin)
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

                    // Review list

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
                    doc_list.appendChild(doc_writer_img)
                    doc_list.appendChild(doc_box)
                    if (current.review_locked == 1 && current.admin !== 1) {
                        doc_list.setAttribute("onclick", `unlock(${current.review_id}, ${current.review_cost})`)
                    }
                    else if (current.review_locked == 1 && current.admin == 1) {
                        doc_list.setAttribute("onclick", `alert('서비스 관리자만 접근할 수 있는 리뷰입니다.')`)
                    }
                    else {
                        doc_list.setAttribute("onclick", `overlayOn(${index})`)
                    }

                    doc_review_list.appendChild(doc_list)

                    // Pop-up screen

                    const pop_funame = document.createElement("p")
                    pop_funame.innerHTML = current.fu_name
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

                if (response.alertLowRating) {
                    alert(`별점 3점 이하 후기입니다. 당신의 평판이 개처럼 멸망했습니다. 신속히 관리자 페이지를 찾아 후기와 별점을 조작하세요.`)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    })
    .catch((error) => {
        console.log(error)
    })