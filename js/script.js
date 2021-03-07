document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    // получаю блок, в котором будут карточки
    const heroes = document.querySelector('.hero-cards'),
        // получаю шаблон верстки одной карточки
        cardTemplate = document.getElementById('hero-card').content, 
        // получаю из шаблона саму верстку карточки, которую буду клонировать
        heroCard = cardTemplate.querySelector('.hero');

    // создаю пустую коллекцию, которую заполню фильмами
    // именно эта коллекция, потому что она не содержит повторений
    const moviesSet = new Set();

    // запрос на сервер
    const sendRequest = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', './dbHeroes.json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState !== 4){
                return;
            }

            if (xhr.status === 200){
                const data = JSON.parse(xhr.responseText);
                // получила коллекцию всех фильмов без повторений
                showAllMovies(data);

                // вывела список фильмов
                // с помощью spread превратила коллекцию в массив
                render([...moviesSet], 'list');

                // добавила карточки на страницу
                render(data, 'cards');
                
                // функция фильтрации карточек
                filterMovies();

            }

        });
    };
    sendRequest();


    // рендер карточек и списка фильмов на странице
    // вход: массив и флаг, в зависимости от флага рендер либо карточек, либо тегов фильмов
    const render = (dataArray, flag) => {
        // рендер списка фильмов
        if (flag === 'list') {
            // в верстке добавляю в список фильмы
            addMoviesListHTML(dataArray);

        // рендер карточек
        } else if(flag === 'cards') {
        dataArray.forEach( item => {
            const {name, realName, species, status, gender, citizenship, birthDay, deathDay, actors, photo, movies} = item;

            // получаю верстку карточки героя
            const heroCard = getCardHTML();

            heroCard.cardName.textContent = name;

            // если в объекте героя нет этого свойства, то оно не показывается
            realName 
            ? heroCard.cardRealName.textContent = realName 
            : heroCard.cardRealName.closest('p').style.display = 'none';

            heroCard.cardSpecies.textContent = species;
            heroCard.cardStatus.textContent = status;
            heroCard.cardGender.textContent = gender;

            // если в объекте героя нет этого свойства, то оно не показывается
            citizenship 
            ? heroCard.cardCitizenship.textContent = citizenship 
            : heroCard.cardCitizenship.closest('p').style.display = 'none';

            // если в объекте героя нет этого свойства, то оно не показывается
            birthDay 
            ? heroCard.cardBirthday.textContent = birthDay 
            : heroCard.cardBirthday.closest('p').style.display = 'none';

            // если в объекте героя нет этого свойства, то оно не показывается
            deathDay 
            ? heroCard.cardDeathday.textContent = deathDay 
            : heroCard.cardDeathday.closest('p').style.display = 'none';

            heroCard.cardActor.textContent = actors;

            // добавляю путь до фото и описание alt
            heroCard.cardImg.src = photo;
            heroCard.cardImg.alt = `photo: ${name}`;

            // если в объекте есть массив с фильмами, то добавляю его в верстку
            // if(movies) heroCard.cardMovies.append(addMoviesListHTML(movies, 'movie'));
            if(movies) heroCard.cardInfo.insertAdjacentElement('beforeend', addMoviesListHTML(movies, 'movie'));

            // добавляю в блок героев карточку героя
            heroes.append(heroCard.card);
        });
    }

        
    }

    // получаю карточку из шаблона
    // выход: объект с HTML элементом
    const getCardHTML = () => {
        const card = heroCard.cloneNode(true),
                cardImg = card.querySelector('.hero-img'),
                cardName = card.querySelector('.name'),
                cardRealName = card.querySelector('.real-name'),
                cardGender = card.querySelector('.gender'),
                cardSpecies = card.querySelector('.species'),
                cardStatus = card.querySelector('.status'),
                cardCitizenship = card.querySelector('.citizenship'),
                cardBirthday = card.querySelector('.birthday'),
                cardDeathday = card.querySelector('.deathday'),
                cardActor = card.querySelector('.actor'),
                cardInfo = card.querySelector('.hero-movie-info');

        return { card, cardImg, cardName, cardRealName, cardGender, cardSpecies, cardStatus, cardCitizenship, cardBirthday, cardDeathday, cardActor, cardInfo };
    }

    // создание массива со списком фильмов для дальнейшего рендера
    // вход: массив, строка с именем класса
    // выход: массив, заполненный версткой списка
    const addMoviesListHTML = (moviesArray, className) => {
        // если className - movie, то этот список внутри карточки
        if (className === 'movie') {
            // получаю верстку списка фильмов
            const moviesList = document.createElement('ul');
            moviesList.classList.add('movies-list');

            moviesArray.forEach( item => {
                moviesList.insertAdjacentHTML('afterbegin',
                `<li class="${className} movies-tag">#<span>${item}</span></li>`);
            });

            return moviesList;

        // список всех фильмов вверху страницы
        } else {
            const moviesList = document.querySelector('.filter-list');

            moviesArray.forEach( item => {
                moviesList.insertAdjacentHTML('beforeend',
                `<li class="tag movies-tag">#<span>${item}</span></li>`);
            });

            return moviesList;
        }
    }

    // получаю коллекцию Set - список всех фильмов без повторений
    const showAllMovies = array => {
        // перебираюю массив
        array.forEach(item => {
            // если список фильмов существует, то перебираю его
            if(item.movies){
                // перебираю список фильмов и добавляю в коллекцию элемент
                item.movies.forEach( elem => {
                    if (item.movies){
                        moviesSet.add(elem);
                    }
                    
                });
            
            }
        });
    }

    const filterMovies = () => {
        // получила список из ul-списков с фильмами
        const moviesTagsLists = document.querySelectorAll('.movies-list');

            // перебираю список из ul
            moviesTagsLists.forEach( elem => {
                // вешаю на каждый ul-список слушатель клика

                elem.addEventListener('click', (e) => {
                    let target = e.target;

                    // если клик произошел по li с названием фильма, то запускается функция, 
                    // которая скрывает все блоки и показывает только с выбранным фильмом
                    if (target.closest('li').classList.contains('movies-tag')){

                        // удаляю активный класс у списка тегов
                        for (let child of elem.children){
                            child.classList.remove('active');
                        }

                        toggleBlocks(target);
                    } 

                });
            });

    }

    // переключает карточки с героями
    const toggleBlocks = (target) => {

        // получаю все карточки героев
        const heroBlocks = document.querySelectorAll('.hero');

        heroBlocks.forEach( elem => {
            elem.style.display = 'none';
            
            // элемент ul
            // ulElem.textContent - строка
            const ulElem = elem.children[1].children[1];

            //ulElem.textContent.indexOf(target.textContent) возвращает индекс вхождения подстроки в строку (-1 - нет такой подстроки)
            // если список фильмов в карточке существует
            // и подстрока существует, то я показываю этот элемент на странице
            if (ulElem && ulElem.textContent.indexOf(target.textContent) !== -1) {

                animateFilter({
                    duration: 800,
                    timing(timeFraction){
                        return timeFraction;
                    },
                    draw(progress){
                        elem.style.opacity = progress;
                        elem.style.display = 'flex';
                    }
                });

                target.closest('li').classList.add('active');
            }

            // если таргет - кнопка "показать все" (именно у нее есть dataset), 
            // то всем элеменетам добавляется display: flex;
            if (target.dataset.filter === 'all') {
                animateFilter({
                    duration: 800,
                    timing(timeFraction){
                        return timeFraction;
                    },
                    draw(progress){
                        elem.style.opacity = progress;
                        elem.style.display = 'flex';
                    }
                });
            }
        });

    }

    // анимация переключения карточек
    const animateFilter = ({timing, draw, duration}) => {
        let start = performance.now();

        requestAnimationFrame(function animateFilter(time) {
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let progress = timing(timeFraction);

            draw(progress);

            if (timeFraction < 1) {
                requestAnimationFrame(animateFilter);
            }
        });
    }
    

});






