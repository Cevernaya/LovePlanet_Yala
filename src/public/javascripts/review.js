const popupReviewOn = () => {
    const overlay = document.getElementById('overlayReview');
    overlay.setAttribute("visible", "true");
    overlay.setAttribute("style", "opacity: 1;");
}

const popupReviewOff = () => {
    const overlay = document.getElementById('overlayReview');
    overlay.setAttribute("visible", "false");
    overlay.setAttribute("style", "opacity: 0; display: none;");
}

const unlock = (id, review_cost) => {
    const unlocking = confirm(`잠겨있는 리뷰입니다.\n잠금 해제를 위해서는 ${review_cost} coin 이 필요합니다.\n이 리뷰를 잠금 해제 하시겠습니까?`)
    if (unlocking) {
        fetch(`/data/unlockReview?review_id=${id}`).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.success) {
                location.reload()
            } else {
                alert(`${response.message ? response.message : "Error!"}`)
            }
        })
    }

}

const writeReview = () => {
    const querystring = location.search
    const querys = new URLSearchParams(querystring)
    const to_user_id = querys.get('user_id')

    const rating_list = document.getElementsByName("rating")
    let rating = 0
    rating_list.forEach(rate => {
        if (rate.checked == true) {
            rating = rate.value
        }
    })

    const text = document.querySelector(".real_textarea").value

    let data = {}
    if (rating && text) {
        data = {
            "to_user": to_user_id,
            "rating": rating,
            "body": text
        }
    }

    fetch("/data/writeReview", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json()
    }).then((response) => {
        if (response.success == true) {
            location.reload()
        } else {
            if (!rating) {
                alert("별점을 선택해 주세요")
            } else if (!text) {
                alert("내용을 입력해 주세요")
            }
        }
    }).catch((error) => {
        console.log(error)
    })
}