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
          modal = document.querySelector('.modal');

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


    modal.addEventListener('click', (event) => {
        if (event.target == modal || event.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes; // массив
            this.parent = document.querySelector(parentSelector);
            this.transfer = 70; //статический курс валют
            this.changeToRub();
        }

        changeToRub() {
            this.price = this.price * this.transfer; // метод для конвертации
        }

        render() {
            const element = document.createElement('div');
            
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}"</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                    </div>
            `;
            this.parent.append(element);
        }
    }
    // const div = new MenuCard();
    // div.render();
    // чтобы использовать метод на месте

    // new MenuCard().render(); // он исчезнет потому что на него не будет ссылок

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json(); // возвращает promise
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
            // data.forEach(({img, altimg, title, descr, price}) => {
            //     new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            // });
    //     });

    // axios 

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });


    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));
    
    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add('menu__item');

    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}"</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> руб/день</div>
    //             </div>
    //         `;

    //         document.querySelector('.menu .container').append(element);
    //     });
    // }

    
    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        success: 'Спасибо! Скоро с вами свяжемся',
        fail: 'Что-то пошло не так',
        loading: 'img/form/spinner.svg'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, { //await дожидается результата
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json(); // возвращает promise
    };
    
    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
  
            const formData = new FormData(form);
            
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.fail);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
             <div class="modal__close" data-close>×</div>
             <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();

        }, 4000);
    }

    // Slider

    const slides = document.querySelectorAll('.offer__slide'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesFiled = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width; // объект со стилями и мы из него вытащили width

    let slideIndex = 1; 
    let offset = 0; // отступ по которому мы ориентируемся

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;

    }

    slidesFiled.style.width = 100 * slides.length + '%';
    slidesFiled.style.display = 'flex';
    slidesFiled.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (slides.length -1)) { // в width содержится '500px'
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        // если нам надо сдвинуть элеменрт влево (используем отрицательные значения!)
        slidesFiled.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length -1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        slidesFiled.style.transform = `translateX(-${offset}px)`;
        
        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });



    // showSlides(slideIndex);
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }

    // function showSlides(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }

    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }
    //     slides.forEach(item => item.style.display = 'none');

    //     slides[slideIndex - 1].style.display = 'block';

    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }
    
    // function plusSlides(n) {
    //     showSlides(slideIndex += n);
    // }

    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // });

    // next.addEventListener('click', () => {
    //     plusSlides(1);
    // });




    

});