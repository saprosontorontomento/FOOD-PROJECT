window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
 

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }


    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if(target == item) {
                    hideTabContent();
                    showTabContent(i); 
                }
            });
        }

    });

    // Timer

    const deadline = '2021-03-17';

    function getTimeRemaining(endtime) { //функция которая определяет разницу между deadline и нашем временем
        //задача функции получить разницу между данными

        // техническая переменная (разницу в миллисекундах надо превратить в кол-во дней, часов, минут и секунд)
        // мы берём кол-во секунд * 60 и получаем кол-во милсек в одной минуте
        //  дальше * 60 и получаем милсек в 1 часе и * 24 часа, 
        // таким образом мы получаем сколько милсек в 1 сутках
        const t = Date.parse(endtime) - Date.parse(new Date()), 
              days = Math.floor(t / (1000 * 60 * 60 * 24)), // floor - округление до ближайшего целого
              hours = Math.floor((t / (1000 * 60 * 60) % 24)),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);

        if (t >= 0) {
            return { // возвращаем объект из функции
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
                textDays.innerHTML = ('Дней') : (number == 1 ? textDays.innerHTML = ('День') 
                : textDays.innerHTML = ('Дня')));
            }
            function hoursCounter(number) {
                let result = ((((number % 100) >= 11 && number <= 19) || (number = number % 10) >= 5 || number == 0) ? 
                textHours.innerHTML = ('Часов') : (number == 1 ? textHours.innerHTML = ('Час') 
                : textHours.innerHTML = ('Часа')));
            }
    
            function minutesCounter(number) {
                let result = ((((number % 100) >= 11 && number <= 19) || (number = number % 10) >= 5 || number == 0) ? 
                textMinutes.innerHTML = ('Минут') : (number == 1 ? textMinutes.innerHTML = ('Минута') 
                : textMinutes.innerHTML = ('Минуты')));
            }
    
            function secondsCounter(number) {
                let result = ((((number % 100) >= 11 && number <= 19) || (number = number % 10) >= 5 || number == 0) ? 
                textSeconds.innerHTML = ('Секунд') : (number == 1 ? textSeconds.innerHTML = ('Секунда') 
                : textSeconds.innerHTML = ('Секунды')));
            }
            
            daysCounter(t.days);
            hoursCounter(t.hours);
            minutesCounter(t.minutes);
            secondsCounter(t.seconds);
        }

        
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          closeModalBtn = document.querySelector('[data-close]');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }


    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

  

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // const modalTimerId = setTimeout(openModal, 3000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 70; //статический курс валют
            this.changeToRub();
        }

        changeToRub() {
            this.price = this.price * this.transfer; // метод для конвертации
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}"</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div
            `;
            this.parent.append(element);
        }
    }
    // const div = new MenuCard();
    // div.render();
    // чтобы использовать метод на месте

    // new MenuCard().render(); // он исчезнет потому что на него не будет ссылок

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        15,
        '.menu .container'
    ).render();












});