const WRAPPER = document.getElementById("game_wrapper")
const CANVAS = document.createElement("canvas")
const CTX = CANVAS.getContext('2d')

CANVAS.width = Math.min(WRAPPER.clientWidth, WRAPPER.clientHeight)
CANVAS.height = Math.min(WRAPPER.clientWidth, WRAPPER.clientHeight)
WRAPPER.appendChild(CANVAS)


// UTILS

const smultVec = (point, scalar) => [scalar*point[0], scalar*point[1]]
const normVec = (point) => Math.sqrt(point[0]**2 + point[1]**2)
const addVec = (point1, point2) => [point1[0]+point2[0], point1[1]+point2[1]]
const subVec = (point1, point2) => [point1[0]-point2[0], point1[1]-point2[1]]
const distBetween = (point1, point2) => {
    const dist = [point1[0]-point2[0], point1[1]-point2[1]]
    return normVec(dist)
}
const circleHit = (circle1, circle2) => {
    const centerDist = distBetween([circle1.x, circle1.y], [circle2.x, circle2.y])
    return circle1.r + circle2.r >= centerDist
}

const formatString = (num, digit) => {
    return num.toLocaleString(undefined, {maximumFractionDigits: digit, minimumFractionDigits: digit})
}

const updateNowCoin = (diff=0) => {

    fetch("/data/addLoveCoin", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ "diffLovecoin": diff })
    })
        .then(res => res.json())
        .then(res => {
            if(res.success) {
            CTX.fillText(`${this.timer}`, 10, 190)
                document.getElementById("now_lovecoin").innerText = `${formatString(res.nowLovecoin, 5)} LC`
                NOWCOIN = res.nowLovecoin
            }
        })
}
updateNowCoin()

const getRank = () => {
    fetch("/data/rankDodge")
        .then(res => res.json())
        .then(res => {
            console.log(res)
            const rankContainer = document.getElementById("dodge_rank")
            rankContainer.innerHTML = ""
            res.ranks.map(rank => {
                const rankElem = document.createElement("li")
                rankElem.innerText = `${rank.nickname}: ${rank.score}`
                rankContainer.appendChild(rankElem)
            })
        })
}

const sendRank = (score, name) => {
    fetch("/data/rankDodgeAdd", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ score, name })
    }).then(() => getRank())
}
getRank()


// INPUTS

const keyInputs = {
    ArrowUp: false,
    ArrowRight: false,
    ArrowBottom: false,
    ArrowLeft: false,
    Space: false
}

window.onkeydown = (e) => {
    switch(e.code) {
        case "ArrowUp": {
            keyInputs.ArrowUp = true
            break;
        }
        case "ArrowRight": {
            keyInputs.ArrowRight = true
            break;
        }
        case "ArrowDown": {
            keyInputs.ArrowBottom = true
            break;
        }
        case "ArrowLeft": {
            keyInputs.ArrowLeft = true
            break;
        }
        case "Space": {
            keyInputs.Space = true
            break;
        }
    }
}

window.onkeyup = (e) => {
    switch(e.code) {
        case "ArrowUp": {
            keyInputs.ArrowUp = false
            break;
        }
        case "ArrowRight": {
            keyInputs.ArrowRight = false
            break;
        }
        case "ArrowDown": {
            keyInputs.ArrowBottom = false
            break;
        }
        case "ArrowLeft": {
            keyInputs.ArrowLeft = false
            break;
        }
        case "Space": {
            keyInputs.Space = false
            break;
        }
    }
}


// GAMEPLAYS

const FPS = 144

const GAME_STATE = {}
const gameStates = ["INIT", "GAMING", "OVER"]
gameStates.forEach(state => GAME_STATE[state] = state)

const COLORS = {
    PLAYER_BORDER: "rgb(255, 50, 50)",
    PLAYER_FILL: "rgb(255, 50, 50)",
    WORLD_BORDER: "rgb(255, 150, 150)",
    BULLET_BORDER: "rgb(0, 0, 255)",
    BULLET_FILL: "rgb(200, 200, 100)",
}


// GAME

class Game {
    constructor() {
        this.center = [CANVAS.width/2, CANVAS.height/2]
        this.radius = 150
        this.bullets = []
        this.bulletGenerators = []
        this.bulletInterval = 200
        this.bulletIntervalDecay = 0.5
        this.bulletIntervalMin = 50
        this.bulletTimer = this.bulletInterval
        this.state = GAME_STATE.INIT
        this.score = 0

    }

    setPlayer(player) {
        this.player = player
    }

    startGame() {
        this.state = GAME_STATE.GAMING
        this.score = 0
        this.player.x = this.center[0]
        this.player.y = this.center[1]
        this.bullets = []
        this.bulletGenerators = []

        const genNum = 24
        const genInterval = 3000
        for(let i=0; i<genNum; i++) {
            const genFarthy = GAME.radius * 1.1
            const genDisplace = [genFarthy * Math.cos(2 * Math.PI * i / genNum), genFarthy * Math.sin(2 * Math.PI * i / genNum)]
            const genPos = addVec(GAME.center, genDisplace)
            GAME.bulletGenerators.push(new BulletGenerator(genPos[0], genPos[1], 3, 200, genInterval, 500 + genInterval * i/genNum))
        }
    }

    endGame() {
        this.state = GAME_STATE.OVER
        setTimeout(() => {
            const name = prompt(`점수: ${this.score/100}\n랭킹 등록할 이름을 입력하세요.`) || '익명의 고수'
            sendRank(this.score/100, name)
            updateNowCoin(this.score/100)
        }, 1000/FPS * 3)

        Object.keys(keyInputs).map(key => keyInputs[key] = false)
    }

    update() {
        if(keyInputs.Space) {
            this.startGame()
        }

        if(this.state != GAME_STATE.GAMING) {
            return
        }
        const dt = 1/FPS

        for(let i=0; i<this.bullets.length; i++) {
            this.bullets[i].update(dt)
            if(this.bullets[i].lifeByMs < 0) {
                this.bullets.splice(i, 1)
                i--
            }
        }
        
        if(this.bulletTimer < 0) {
            const nowGen = this.bulletGenerators[Math.floor(this.bulletGenerators.length * Math.random())]
            nowGen.generate()
            this.bulletTimer = this.bulletInterval
            this.bulletInterval = Math.max(this.bulletInterval - this.bulletIntervalDecay, this.bulletIntervalMin)
        }
        else this.bulletTimer -= dt * 1000

        if(this.player) this.player.update(dt)
        
        if(this.state == GAME_STATE.GAMING) this.score++

    }

    render() {
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)

        this.bullets.forEach(bullet => bullet.render())
        if(this.player) this.player.render()

        CTX.beginPath()
        CTX.strokeStyle = COLORS.WORLD_BORDER
        CTX.arc(this.center[0], this.center[1], this.radius, 0, 2*Math.PI)
        CTX.stroke()
        CTX.closePath()

        CTX.textAlign = "left"
        CTX.textBaseline = "top"
        CTX.font = "bold 48px solid"
        CTX.fillStyle = "rgba(255, 150, 150, 1)"
        CTX.fillText(`Mining: ${this.score/100}`, 20, 20)

        if(this.state == GAME_STATE.INIT) {
            CTX.textAlign = "center"
            CTX.textBaseline = "top"
            CTX.font = "bold 20px solid"
            CTX.fillStyle = "rgba(100, 100, 100, 0.7)"
            CTX.fillText("Press Space to Start", CANVAS.width/2, CANVAS.height/2+40)
        }

        if(this.state == GAME_STATE.OVER) {
            CTX.textAlign = "center"
            CTX.textBaseline = "top"
            CTX.font = "bold 20px solid"
            CTX.fillStyle = "rgba(100, 100, 100, 0.7)"
            CTX.fillText("Press Space to Restart", CANVAS.width/2, CANVAS.height/2+40)
        }
    }
}
const GAME = new Game()


// PLAYER

class Player {
    constructor() {
        this.x = CANVAS.width/2
        this.y = CANVAS.height/2
        this.r = 2

        this.speed = 200
    }

    update(dt) {
        const moveDirection = [0, 0]
        if(keyInputs.ArrowUp) moveDirection[1] -= 1
        if(keyInputs.ArrowRight) moveDirection[0] += 1
        if(keyInputs.ArrowBottom) moveDirection[1] += 1
        if(keyInputs.ArrowLeft) moveDirection[0] -= 1

        const nd = (normVec(moveDirection) == 0) ? [0, 0] : smultVec(moveDirection, 1/normVec(moveDirection))
        const dp = smultVec(nd, this.speed * dt)

        const afterPosition = addVec([this.x, this.y], dp)
        const afterFarthy = distBetween(GAME.center, afterPosition)
        if(afterFarthy <= GAME.radius) {
            this.x = afterPosition[0]
            this.y = afterPosition[1]
        }

        //collision check
        let hit = false
        GAME.bullets.forEach(bullet => hit |= circleHit(this, bullet))
        
        if(hit) GAME.endGame()

    }

    render() {
        CTX.beginPath()
        CTX.strokeStyle = COLORS.PLAYER_BORDER
        CTX.fillStyle = COLORS.PLAYER_FILL
        CTX.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        CTX.fill()
        CTX.stroke()
        CTX.closePath()
    }
}

GAME.setPlayer(new Player())


// BULLETS

class Bullet {
    constructor(x, y, r, speed, dirVec, lifeByMs) {
        this.x = x
        this.y = y
        this.r = r
        this.speed = speed
        this.dirVec = dirVec
        this.lifeByMs = lifeByMs
    }

    update(dt) {
        const ndv = smultVec(this.dirVec, 1/normVec(this.dirVec))
        this.x += ndv[0] * this.speed * dt
        this.y += ndv[1] * this.speed * dt
        this.lifeByMs -= dt * 1000
    }

    render() {
        CTX.beginPath()
        CTX.strokeStyle = COLORS.BULLET_BORDER
        CTX.fillStyle = COLORS.BULLET_FILL
        CTX.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        CTX.fill()
        CTX.stroke()
        CTX.closePath()
    }
}

class BulletGenerator {
    constructor(x, y, r, speed, interval, initialWait) {
        this.x = x
        this.y = y
        this.r = r
        this.speed = speed
        this.interval = interval
        this.initialWait = initialWait

        this.timeLeft = this.initialWait
    }

    generate() {
        const diff = subVec([GAME.player.x, GAME.player.y], [this.x, this.y])
        const ndiff = smultVec(diff, 1/normVec(diff))

        GAME.bullets.push(new Bullet(this.x, this.y, this.r, this.speed, ndiff, 5000))
    }

    update(dt) {
        if(this.timeLeft < 0) {
            this.timeLeft = this.interval
        }
        else {
            this.timeLeft -= dt * 1000
        }
    }

    render() {

    }
}




if(1) {
    setInterval(() => {
        GAME.render()
        GAME.update()
    }, 1000/FPS)
}