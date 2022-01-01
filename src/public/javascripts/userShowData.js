const querystring = location.search
const querys = new URLSearchParams(querystring)
const user_id = querys.get('user_id')

fetch("localhost:3000/data/userdata")
.then((response) => {
  const user = response.sessionUser
  const userHeader = document.querySelector(".user_name")
  const user_name = document.createElement("h1")
  user_name.innerHTML = user.name
  userHeader.appendChild(user_name)
  const user_rank = document.createElement("img")
  user_rank.setAttribute("src", "/images/grades/grade02.png")
  user_rank.setAttribute("alt", "rank of user")
  user_rank.className = "user_grade_image"
  userHeader.appendChild(user_rank)

  const userBody = document.querySelector(".user_text")
  userBody.innerHTML = `${user.age}, ${user.address} 거주`
})
.catch((error) => {
  console.log(error)
})
