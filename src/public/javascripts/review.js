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
    if (rating != 0) {
        data = {
            "to_user" : to_user_id,
            "rating" : rating,
            "body" : text
        }
    }

    fetch("/data/writeReview", {
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
            alert("error")
        }
    }).catch((error) => {
        console.log(error)
    })
}