function timer(id, deadline) {

    function getTimeRemaining(endtime) {
        
        const t = Date.parse(endtime) - Date.parse(new Date()), 
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60) % 24)),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);

        if (t >= 0) {
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        } else {
            return {
                'total': 0,
                'days': 0,
                'hours': 0,
                'minutes': 0,
                'seconds': 0
            };
        }
        
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const  timer = document.querySelector(selector),
               days = timer.querySelector('#days'),
               hours = timer.querySelector('#hours'),
               minutes = timer.querySelector('#minutes'),
               seconds = timer.querySelector('#seconds'),
               timeInterval = setInterval(updateClock, 1000),
               textDays = document.querySelector('#text__days'),
               textHours = document.querySelector('#text__hours'),
               textMinutes = document.querySelector('#text__minutes'),
               textSeconds = document.querySelector('#text__seconds');
        
        updateClock(); 
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }

            function daysCounter(number) {
                let result = ((((number % 100) >= 11 && number <= 19) || (number = number % 10) >= 5 || number == 0) ? 
                textDays.innerHTML = ('????????') : (number == 1 ? textDays.innerHTML = ('????????') 
                : textDays.innerHTML = ('??????')));
            }
            function hoursCounter(number) {
                let result = ((((number % 100) >= 11 && number <= 19) || (number = number % 10) >= 5 || number == 0) ? 
                textHours.innerHTML = ('??????????') : (number == 1 ? textHours.innerHTML = ('??????') 
                : textHours.innerHTML = ('????????')));
            }
    
            function minutesCounter(number) {
                let result = ((((number % 100) >= 11 && number <= 19) || (number = number % 10) >= 5 || number == 0) ? 
                textMinutes.innerHTML = ('??????????') : (number == 1 ? textMinutes.innerHTML = ('????????????') 
                : textMinutes.innerHTML = ('????????????')));
            }
    
            function secondsCounter(number) {
                let result = ((((number % 100) >= 11 && number <= 19) || (number = number % 10) >= 5 || number == 0) ? 
                textSeconds.innerHTML = ('????????????') : (number == 1 ? textSeconds.innerHTML = ('??????????????') 
                : textSeconds.innerHTML = ('??????????????')));
            }
            
            daysCounter(t.days);
            hoursCounter(t.hours);
            minutesCounter(t.minutes);
            secondsCounter(t.seconds);
        }

        
    }

    setClock(id, deadline);
}

export default timer;