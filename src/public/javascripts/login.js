const login = () => {
    const input = document.getElementById("input")
    const code = input.value

    fetch(`/data/login?invitation_code=${code}`).then((response) => {
        return response.json()
    }).then((response) => {
        if (response.success == true) {
            location.replace("/userShow")
        } else {
            alert("초대 코드를 확인해 주세요")
        }
    }).catch((error) => {
        console.log(error)
    })
}

document.getElementById("input").onkeydown = (e) => {
    console.log(e)
    if(e.key === "Enter") {
        login()
    }
}