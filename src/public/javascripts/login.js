const login = () => {
    const userName = document.getElementById("name").value
    const userAge = document.getElementById("age").value
    const userAddress = document.getElementById("address").value
    const userCode = document.getElementById("invitation_code").value

    if (!userName.trim() || !userAge || !userAddress || !userCode) {
        const loginWithEmpty = confirm('입력 폼이 모두 채워지지 않았습니다. 첫 로그인인 경우 취소 버튼을 누른 뒤 입력 폼을 채워주세요. 이미 로그인한 적이 있다면 확인을 눌러주세요.')
        if (!loginWithEmpty) return
    }

    fetch(`/data/login?name=${userName}&age=${userAge}&address=${userAddress}&invitation_code=${userCode}`).then((response) => {
        return response.json()
    }).then((response) => {
        if (response.success == true) {
            alert("러브플래닛에 오신 것을 환영합니다!\nMy Page에서 서비스 사용 방법을 확인해주세요.")
            location.replace("/")
        } else {
            alert("초대 코드를 확인해 주세요")
        }
    }).catch((error) => {
        console.log(error)
    })
}

document.getElementById("info_code").getElementsByTagName("button")[0].onkeydown = (e) => {
    console.log(e)
    if (e.key === "Enter") {
        login()
    }
}

const WRAPPER = document.getElementById('logo_section')
const CANVAS = document.getElementById('logo_background')
CANVAS.height = WRAPPER.clientHeight
CANVAS.width = WRAPPER.clientWidth
const CTX = CANVAS.getContext('2d')
const d = 1.5
const [rx, ry] = [-CANVAS.clientWidth * d, CANVAS.clientHeight / 2]
const radius = (d + 1) * CANVAS.clientWidth

let nowRadius = 0

const drawBackground = () => {
    nowRadius += (radius - nowRadius) * 0.1

    const color = "pink"
    CTX.fillStyle = color
    CTX.strokeStyle = color
    CTX.beginPath()
    CTX.arc(rx, ry, nowRadius, 0, 2 * Math.PI)
    CTX.fill()
    CTX.stroke()
}

window.onload = () => {
    new Promise((resolve, reject) => {
        const backgroundAnimater = setInterval(drawBackground, 1000 / 60)
        setTimeout(() => {
            clearInterval(backgroundAnimater)
            resolve()
        }, 1500)
    }).then(() => {
        const logoSection = document.getElementById('logo_section')
        const logoWelcome = logoSection.getElementsByTagName('h2')[0]
        const logoLovePlanet = logoSection.getElementsByTagName('h1')[0]
        const logoDescription = logoSection.getElementsByTagName('h3')[0]
        const loginForm = document.getElementById('info_box')

        setTimeout(() => logoWelcome.setAttribute("style", "opacity: 1"), 0)
        setTimeout(() => logoLovePlanet.setAttribute("style", "opacity: 1"), 250)
        setTimeout(() => logoDescription.setAttribute("style", "opacity: 1"), 600)
        setTimeout(() => loginForm.setAttribute("style", "opacity: 1"), 1500)
    })

}