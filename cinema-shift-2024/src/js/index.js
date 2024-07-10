getCinemaToday()
async function getCinemaToday() {
    let response = await fetch('https://shift-backend.onrender.com/cinema/today')
    response = await response.json()
    response = response.films

    const yearCountryGenreInfo = document.getElementsByClassName('year-country-genre')
    const filmName = document.getElementsByClassName('filmName')
    const actors = document.getElementsByClassName('actors')
    const rating = document.getElementsByClassName('rating')

    for (let i = 0; i < response.length; i++) {

        yearCountryGenreInfo[i].innerHTML += `${response[i].releaseDate.slice(-4)}, 
            ${response[i].country.name}, 
            ${response[i].genres[0]}`

        filmName[i].innerHTML += response[i].name

        actors[i].innerHTML += ` ${response[i].actors[0].fullName}, 
            ${response[i].actors[1].fullName}`

        rating[i].innerHTML += `${response[i].ageRating}, 
            кинопоиск: ${response[i].userRatings.kinopoisk}`
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.details-button')

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const id = button.id
            window.clickedButtonId = id
            localStorage.setItem('clickedButtonId', id)
        })
    })
})

function updateNavigationButtons() {
    const navButtons = document.querySelectorAll('.menu-item')
    if (window.innerWidth <= 425) {
        navButtons.forEach(button => {
            const img = button.querySelector('img')
            if (img && button.textContent.trim() !== '') {
                button.dataset.originalText = button.textContent.trim()
                button.innerHTML = ''
                button.appendChild(img)
            }
        })
    } else {
        navButtons.forEach(button => {
            const img = button.querySelector('img')
            if (img && button.dataset.originalText) {
                button.innerHTML = ''
                button.appendChild(img)
                button.append(` ${button.dataset.originalText}`)
                delete button.dataset.originalText
            }
        })
    }
}
updateNavigationButtons()
window.addEventListener('resize', updateNavigationButtons)