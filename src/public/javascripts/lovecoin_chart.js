const WRAPPER = document.getElementById("game_wrapper")
const CANVAS = document.createElement("canvas")
const CTX = CANVAS.getContext('2d')

CANVAS.width = WRAPPER.clientWidth
CANVAS.height = WRAPPER.clientHeight
WRAPPER.appendChild(CANVAS)


// INPUTS

const INPUTS = {
    bet: false,
    Space: false
}

window.onkeydown = (e) => {
    switch(e.code) {
        case "Space": {
            INPUTS.Space = true
            break;
        }
    }
}


// UTILS

const formatString = (num, digit) => {
    return num.toLocaleString(undefined, {maximumFractionDigits: digit, minimumFractionDigits: digit})
}

const randomGaussian = () => {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
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
    fetch("/data/rankGraph")
        .then(res => res.json())
        .then(res => {
            console.log(res)
            const rankContainer = document.getElementById("graph_rank")
            rankContainer.innerHTML = ""
            res.ranks.map(rank => {
                const rankElem = document.createElement("li")
                rankElem.innerText = `x${formatString(rank.score, 4)}`
                rankContainer.appendChild(rankElem)
            })
        })
}

const sendRank = (score) => {
    fetch("/data/rankGraphAdd", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ score })
    })
        .then(() => getRank())
}
getRank()


// GAMEPLAYS

const FPS = 144

const GAME_STATE = {}
const gameStates = ["INIT", "GAMING", "OVER"]
gameStates.forEach(state => GAME_STATE[state] = state)

const COLORS = {
    
}

const BET = document.getElementById("betting_coin")
let NOWCOIN = 0


// GAME

class Chart {
    constructor(x, y, w, h, pad=5) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.pad = pad
    }

    addData(data) {
        this.data.push(data)
    }

    update() {

    }

    render(state, num) {
        CTX.lineWidth = 1
        CTX.strokeStyle = "rgb(100, 100, 100)"
        CTX.strokeRect(this.x, this.y, this.w, this.h)

        if(state == GAME_STATE.GAMING) {
            const dataSize = 100
            const data = new Array(dataSize)
            for(let i=0; i<data.length; i++) {
                data[i] = (1 + num)**(i/30)
            }
            const maxData = Math.max(...data)
            
            const axis = data.map((_, i) => this.x + this.w * i / data.length)
            const renderData = data.map(d => this.y + this.h - this.h * d/maxData)

            CTX.lineWidth = 3
            CTX.strokeStyle = "rgba(255, 200, 200, 1)"
            CTX.beginPath()
            for(let i=0; i<data.length; i++) {
                i == 0 ? CTX.moveTo(axis[i], renderData[i]) : CTX.lineTo(axis[i], renderData[i])
            }
            CTX.stroke()

        }
    }
}

class Game {
    constructor() {
        this.score = 0
        this.chargedCoin = 0
        this.scoreAddPerSecond = 0.2
        this.stoppedScore = 0

        this.nowMaxScore = 0
        this.timer = 5000
        this.bet = false
        this.stop = false
        

        this.state = GAME_STATE.INIT
        this.chart = new Chart(0, 160, CANVAS.width, CANVAS.height - 160)
    }
    
    update() {
        const dt = 1000/FPS

        if(this.state == GAME_STATE.INIT) {
            this.timer -= dt
            
            if(INPUTS.bet) {
                INPUTS.bet = false

                const tryingBet = parseInt(BET.value)
                if(tryingBet <= NOWCOIN && tryingBet > 0) {
                    this.chargedCoin = tryingBet
                    this.bet = true
                }
            }

            if(this.timer < 0) {
                this.state = GAME_STATE.GAMING

                INPUTS.Space = false
                if(this.bet) {
                    updateNowCoin(-parseInt(BET.value))
                }

                this.nowMaxScore = Math.abs(randomGaussian()) * 1.7 + 0.8
                
            }
        }
        else if(this.state == GAME_STATE.GAMING) {
            this.score += this.scoreAddPerSecond * dt / 1000

            if(this.bet && !this.stop && INPUTS.Space) {
                INPUTS.Space = false

                this.stop = true
                this.stoppedScore = this.score
            }

            if(this.score > this.nowMaxScore) {
                this.state = GAME_STATE.OVER

                if(this.bet && this.stop) {
                    sendRank(this.stoppedScore)
                    updateNowCoin(this.chargedCoin * this.stoppedScore)
                }

                this.timer = 3000
            }
        }
        else if(this.state == GAME_STATE.OVER) {
            this.timer -= dt
            INPUTS.bet = false

            if(this.timer < 0) {
                this.state = GAME_STATE.INIT
                this.score = 0
                this.chargedCoin = 0
                this.stoppedScore = 0
                this.bet = false
                this.stop = false

                this.timer = 5000
            }
        }
        
    }

    render() {
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)

        if(this.state == GAME_STATE.INIT) {
            CTX.fillStyle = "rgba(200, 100, 100, 1)"
            CTX.font = "48px solid"
            CTX.textAlign = "left"
            CTX.textBaseline = "top"
            CTX.fillText(`Next Round Starts in ${Math.ceil(this.timer/10)/100}`, 10, 10)
            CTX.font = "24px solid"
            CTX.fillText(`Now Bet: ${this.chargedCoin}`, 10, 90)

        }
        else if(this.state == GAME_STATE.GAMING) {
            CTX.fillStyle = "rgba(200, 100, 100, 1)"
            CTX.font = "48px solid"
            CTX.textAlign = "left"
            CTX.textBaseline = "top"
            if(this.bet) CTX.fillText(`Press Space to Stop!`, 10, 10)
            else CTX.fillText(`Round in Progress...`, 10, 10)
            CTX.font = "24px solid"
            CTX.fillText(`Now Bet: ${this.chargedCoin}`, 10, 90)
            if(this.stop) CTX.fillText(`Stopped at x${formatString(this.stoppedScore, 2)}`, 200, 90)

            CTX.fillStyle = "rgba(200, 100, 100, 0.7)"
            CTX.font = "100px solid"
            CTX.textAlign = "center"
            CTX.textBaseline = "center"
            CTX.fillText(`x${formatString(this.score, 2)}`, CANVAS.width/2, CANVAS.height/2)
        }
        else if(this.state == GAME_STATE.OVER) {
            CTX.fillStyle = "rgba(200, 100, 100, 1)"
            CTX.font = "48px solid"
            CTX.textAlign = "left"
            CTX.textBaseline = "top"
            CTX.fillText(`Round Finished with x${formatString(this.score, 2)}`, 10, 10)
            CTX.font = "36px solid"
            if(this.bet && this.stop) CTX.fillText(`Your Profit: ${formatString(this.chargedCoin * (this.stoppedScore - 1), 5)}`, 10, 90)
            
        }
        this.chart.render(this.state, this.score)
    }
}
const GAME = new Game()




if(1) {
    setInterval(() => {
        GAME.render()
        GAME.update()
    }, 1000/FPS)
}