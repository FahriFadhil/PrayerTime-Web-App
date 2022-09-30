import Utils from "./Utils.js";

let currentCity

const fajrTimeElement = Utils.bind('fajrTime')
const sunriseTimeElement = Utils.bind('sunriseTime')
const dhuhrTimeElement = Utils.bind('dhuhrTime')
const asrTimeElement = Utils.bind('asrTime')
const maghribTimeElement = Utils.bind('maghribTime')
const isyaTimeElement = Utils.bind('isyaTime')
const loadingElement = Utils.bind('loadingIcon')

let fajrTime
let sunriseTime
let dhuhrTime
let asrTime
let maghribTime
let isyaTime

setInterval(() => {
    const date = new Date()

    setTimeDate(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getDay(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    )

    fajrTimeElement.textContent = fajrTime
    sunriseTimeElement.textContent = sunriseTime
    dhuhrTimeElement.textContent = dhuhrTime
    asrTimeElement.textContent = asrTime
    maghribTimeElement.textContent = maghribTime
    isyaTimeElement.textContent = isyaTime

    decideNextEvent(date.getHours() + ':' + date.getMinutes())
    changeCity(currentCity)

}, 1000)



document.addEventListener('DOMContentLoaded', () => {
    loadingElement.style.visibility = 'visible'
    fetch('https://api.myquran.com/v1/sholat/kota/semua').then(res => res.json()).then(data => {
        data.map(city => {
            city.lokasi.includes('KAB.') ? null : Utils.bind('city-list').append(
                Utils.strToHtml(`<option value="${city.lokasi}">`)
            )
        })
        currentCity = Utils.bind('input-city').value

    })
})

Utils.bind('input-city').addEventListener('change', (e) => {
    loadingElement.style.visibility = 'visible'
    if (e.target.value != '') {
        currentCity = Utils.bind('input-city').value

    }
})

//? ===== ===== ===== ===== =====   Functionality   ===== ===== ===== ===== ===== 

function changeCity(cityName, date = new Date) {
    fetch('https://api.myquran.com/v1/sholat/kota/cari/' + cityName).then(res => res.json()).then(data => {
        fetch('https://api.myquran.com/v1/sholat/jadwal/' + data.data[0].id + '/' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()).then(res => res.json()).then(data => {
            fajrTime = data.data.jadwal.subuh
            sunriseTime = data.data.jadwal.terbit
            dhuhrTime = data.data.jadwal.dzuhur
            asrTime = data.data.jadwal.ashar
            maghribTime = data.data.jadwal.maghrib
            isyaTime = data.data.jadwal.isya

            setTimeout(() => {
                loadingElement.style.visibility = 'hidden'
            }, 500)
        })
    })
}

function setTimeDate(year, month, date, day, hour, minute, second) {
    const am = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        ad = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    Utils.bind('hourToday').textContent = hour.toString().padStart(2, 0)
    Utils.bind('minuteToday').textContent = minute.toString().padStart(2, 0)
    Utils.bind('dateNow').textContent = `${ad[day]}, ${date} ${am[month]} ${year}`
}

function decideNextEvent(timeNow) {
    [fajrTimeElement, sunriseTimeElement, dhuhrTimeElement, asrTimeElement, maghribTimeElement, isyaTimeElement]
    .map(el => el.parentElement.classList.remove('next_time'))
    if (Utils.readFormat(timeNow) < Utils.readFormat(fajrTimeElement.textContent)) {
        fajrEvent(timeNow)
    } else if (Utils.readFormat(timeNow) < Utils.readFormat(sunriseTimeElement.textContent)) {
        sunriseEvent(timeNow)
    } else if (Utils.readFormat(timeNow) < Utils.readFormat(dhuhrTimeElement.textContent)) {
        dhuhrEvent(timeNow)
    } else if (Utils.readFormat(timeNow) < Utils.readFormat(asrTimeElement.textContent)) {
        asrEvent(timeNow)
    } else if (Utils.readFormat(timeNow) < Utils.readFormat(maghribTimeElement.textContent)) {
        maghribEvent(timeNow)
    } else if (Utils.readFormat(timeNow) < Utils.readFormat(isyaTimeElement.textContent)) {
        isyaEvent(timeNow)
    } else if (Utils.readFormat(timeNow) > Utils.readFormat(isyaTimeElement.textContent)) {
        complicatedEvent(timeNow)
    }
}

function fajrEvent(timeNow) {
    Utils.bind('nextEvent').innerHTML = 'Next Event : <b>Fajr</b>'
    Utils.bind('estimatedNextEvent').textContent = Utils.makeFormat(Utils.readFormat(fajrTime) - Utils.readFormat(timeNow))
    fajrTimeElement.parentElement.classList.add('next_time')
    if (Utils.readFormat(fajrTime) - Utils.readFormat(timeNow) == 0) {
        Utils.popNotification('Fajr')
    }
}

function sunriseEvent(timeNow) {
    Utils.bind('nextEvent').innerHTML = 'Next Event : <b>Sunrise</b>'
    Utils.bind('estimatedNextEvent').innerHTML = Utils.makeFormat(Utils.readFormat(sunriseTime) - Utils.readFormat(timeNow))
    sunriseTimeElement.parentElement.classList.add('next_time')
    if (Utils.readFormat(sunriseTime) - Utils.readFormat(timeNow) == 0) {
        Utils.popNotification('Sunrise')
    }
}

function dhuhrEvent(timeNow) {
    Utils.bind('nextEvent').innerHTML = 'Next Event : <b>Dhuhr</b>'
    Utils.bind('estimatedNextEvent').innerHTML = Utils.makeFormat(Utils.readFormat(dhuhrTime) - Utils.readFormat(timeNow))
    dhuhrTimeElement.parentElement.classList.add('next_time')
    if (Utils.readFormat(dhuhrTime) - Utils.readFormat(timeNow) == 0) {
        Utils.popNotification('Dhuhr')
    }
}

function asrEvent(timeNow) {
    Utils.bind('nextEvent').innerHTML = 'Next Event : <b>Asr</b>'
    Utils.bind('estimatedNextEvent').innerHTML = Utils.makeFormat(Utils.readFormat(asrTime) - Utils.readFormat(timeNow))
    asrTimeElement.parentElement.classList.add('next_time')
    if (Utils.readFormat(asrTime) - Utils.readFormat(timeNow) == 0) {
        Utils.popNotification('Asr')
    }
}

function maghribEvent(timeNow) {
    Utils.bind('nextEvent').innerHTML = 'Next Event : <b>Maghrib</b>'
    Utils.bind('estimatedNextEvent').innerHTML = Utils.makeFormat(Utils.readFormat(maghribTime) - Utils.readFormat(timeNow))
    maghribTimeElement.parentElement.classList.add('next_time')
    if (Utils.readFormat(maghribTime) - Utils.readFormat(timeNow) == 0) {
        Utils.popNotification('Maghrib')
    }
}

function isyaEvent(timeNow) {
    Utils.bind('nextEvent').innerHTML = 'Next Event : <b>Isya</b>'
    Utils.bind('estimatedNextEvent').innerHTML = Utils.makeFormat(Utils.readFormat(isyaTime) - Utils.readFormat(timeNow))
    isyaTimeElement.parentElement.classList.add('next_time')
    if (Utils.readFormat(isyaTime) - Utils.readFormat(timeNow) == 0) {
        Utils.popNotification('Isya')
    }
}

function complicatedEvent(timeNow) {
    Utils.bind('nextEvent').innerHTML = 'Next Event : <b>Fajr</b>'
    Utils.bind('estimatedNextEvent').innerHTML = '± ' +
    Utils.makeFormat(
        Utils.combineTime(Utils.readFormat('24:00'), Utils.readFormat(fajrTime)) - Utils.readFormat(timeNow) 
    )
    fajrTimeElement.parentElement.classList.add('next_time')
}