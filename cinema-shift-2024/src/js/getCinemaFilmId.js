const clickedButtonId = localStorage.getItem('clickedButtonId')

getCinemaFilmId(clickedButtonId)
getCinemaFilmIdSchedule(clickedButtonId)

async function getCinemaFilmId(clickedButtonId) {
    let response = await fetch(
        `https://shift-backend.onrender.com/cinema/film/${clickedButtonId.replace(/btn/g, '')}`
    )
    response = await response.json()
    response = response.film

    const filmImg = document.getElementById('movie-poster')
    const filmName = document.getElementById('title')
    const originalFilmName = document.getElementById('sub-title')
    const filmRating = document.getElementById('rating')
    const filmDescription = document.getElementById('description')

    filmImg.src = `../static/images/cinema/film_${clickedButtonId.replace(/btn/g, '')}.webp`
    filmName.innerHTML = `${response.name}`
    originalFilmName.innerHTML = `${response.originalName}`
    filmRating.innerHTML = `Рейтинг на кинопоиске: ${response.userRatings.kinopoisk}`
    filmDescription.innerHTML = `${response.description}`
}

async function getCinemaFilmIdSchedule(clickedButtonId) {
    let response = await fetch(
        `https://shift-backend.onrender.com/cinema/film/${clickedButtonId.replace(/btn/g, '')}/schedule`
    )
    response = await response.json()
    response = response.schedules

    const daySchedule = document.getElementsByClassName('day')

    for (let i = 0; i < response.length; i++) {
        daySchedule[i].innerHTML += `${response[i].date.replace(/.07.24/g, '')} июл`
    }

    Array.from(daySchedule).forEach((day) => {
        day.addEventListener('click', function (e) {
            const id = e.target.id.replace(/day/g, '')
            displaySchedule(response[id].seances)
        })
    })
}

function displaySchedule(newData) {
    const tableBody = document.getElementById('schedule-table')
    tableBody.innerHTML = `<table class="schedule-table" id="schedule-table">
        <tr>
            <th>Красный зал</th>
            <th>Зеленый зал</th>
            <th>Синий зал</th>
        </tr>
    </table>`

    let seances = []
    newData.forEach((item) => {
        newObject = { hall: item.hall.name, time: item.time }
        seances.push(newObject)
    })

    for (let i = 0; i < 4; i++) {
        tableBody.innerHTML += `<tr>
            <td class="time" id="red">${seances[i].time}</td>
            <td class="time" id="green">${seances[i + 4].time}</td>
            <td class="time" id="blue">${seances[i + 8].time}</td>
        </tr>`
    }

    const timeSeances = document.getElementsByClassName('time')
    Array.from(timeSeances).forEach((time) => {
        time.addEventListener('click', function (e) {
            const id = e.target.id
            displaySeats(id, time.textContent, newData)
        })
    })
}

function displaySeats(id, timeSeance, newData) {
    const hall = document.getElementById('seats')
    const colorHall = document.getElementById('hall')
    const dateTime = document.getElementById('dateTime')
    hall.innerHTML = ''

    for (let i = 0; i < 12; i++) {
        if (newData[i].time === timeSeance) {
            hallId = i
        }
    }
    if (id == 'red') {
        colorHall.innerHTML = 'Красный'
        dateTime.innerHTML = timeSeance
        for (let i = 0; i < 6; i++) {
            let rowHtml = `<div class="row"><span>${i + 1}</span>`
            for (let j = 0; j < 6; j++) {
                if (newData[hallId].hall.places[i][j].type === 'BLOCKED') {
                    rowHtml += '<span class="seat blocked"></span>'
                } else {
                    rowHtml += `<span class="seat available" id="row${i}seat${j}"></span>`
                }
            }
            rowHtml += `</div>`
            hall.innerHTML += rowHtml
        }
    } else if (id === 'green') {
        console.log(newData)
        colorHall.innerHTML = 'Зеленый'
        dateTime.innerHTML = timeSeance
        for (let i = 0; i < 10; i++) {
            let rowHtml = `<div class="row"><span>${i + 1}</span>`
            for (let j = 0; j < 10; j++) {
                if (newData[hallId].hall.places[i][j].type === 'BLOCKED') {
                    rowHtml += '<span class="seat blocked"></span>'
                } else {
                    rowHtml += `<span class="seat available" id="row${i}seat${j}"></span>`
                }
            }
            rowHtml += `</div>`
            hall.innerHTML += rowHtml
        }
    } else if (id === 'blue') {
        colorHall.innerHTML = 'Синий'
        dateTime.innerHTML = timeSeance
        for (let i = 0; i < 11; i++) {
            let rowHtml = `<div class="row"><span>${i + 1}</span>`
            for (let j = 0; j < 18; j++) {
                if (newData[hallId].hall.places[i][j].type === 'BLOCKED') {
                    rowHtml += '<span class="seat blocked"></span>'
                } else {
                    rowHtml += `<span class="seat available" id="row${i}seat${j}"></span>`
                }
            }
            rowHtml += `</div>`
            hall.innerHTML += rowHtml
        }
    }

    let seats = document.querySelectorAll('.seat')
    let fullTicketPrice = 0
    let selectedSeats = []
    let amount = document.getElementById('allAmount')
    let rowsSeats = document.getElementById('rowsSeats')

    seats.forEach(seat => {
        seat.addEventListener('click', function () {
            let row = Number(this.id.match(/row(\d+)/)[1]) + 1
            let column = Number(this.id.match(/seat(\d+)/)[1]) + 1

            if (seat.classList.contains('selected')) {
                seat.classList.remove('selected')
                fullTicketPrice -= newData[hallId].hall.places[row - 1][column - 1].price
                selectedSeats = selectedSeats.filter(seat => seat !== `${row}-${column}`)
            } else {
                seat.classList.add('selected')
                fullTicketPrice += newData[hallId].hall.places[row - 1][column - 1].price
                selectedSeats.push(`${row}-${column}`)
            }

            amount.innerHTML = `Итоговая сумма: ${fullTicketPrice}Р`
            rowsSeats.innerHTML = `Выбранные места: ${selectedSeats.join(', ')}`
        })
    })
}
