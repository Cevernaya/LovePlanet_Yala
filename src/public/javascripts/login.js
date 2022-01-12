const login = () => {
    const input = document.getElementById("input")
    const code = input.value

    fetch(`/data/login?invitation_code=${code}`).then((response) => {
        return response.json()
    }).then((response) => {
        if (response.success == true) {
            location.replace("/userShow")
        } else {
            alert("error")
        }
    }).catch((error) => {
        console.log(error)
    })
}