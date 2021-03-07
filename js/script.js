document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const heroes = document.querySelector('.hero-cards'),
        cardTemplate = document.getElementById('hero-card').content,
        heroCard = cardTemplate.querySelector('.hero');

    // const consoleFunc = (data) => {
    //     console.log(data);
    // }

    // запрос на сервер
    const sendRequest = (func) => {
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
                renderCards(data);
                // func(data);
                // console.log(data);
            }

        });
    };
    sendRequest();
    // sendRequest(consoleFunc);

    // рендер карточек на странице
    const renderCards = (dataArray) => {
        dataArray.forEach( item => {
            const {name, realName, species, status, gender, citizenship, birthDay, deathDay, actors, photo, movies} = item;

            const heroCard = getCard();

            heroCard.cardName.textContent = name;

            realName 
            ? heroCard.cardRealName.textContent = realName 
            : heroCard.cardRealName.closest('p').style.display = 'none';

            heroCard.cardSpecies.textContent = species;
            heroCard.cardStatus.textContent = status;
            heroCard.cardGender.textContent = gender;

            citizenship 
            ? heroCard.cardCitizenship.textContent = citizenship 
            : heroCard.cardCitizenship.closest('p').style.display = 'none';

            birthDay 
            ? heroCard.cardBirthday.textContent = birthDay 
            : heroCard.cardBirthday.closest('p').style.display = 'none';

            deathDay 
            ? heroCard.cardDeathday.textContent = deathDay 
            : heroCard.cardDeathday.closest('p').style.display = 'none';

            heroCard.cardActor.textContent = actors;

            heroCard.cardImg.src = photo;
            heroCard.cardImg.alt = `photo: ${name}`;

            if(movies) heroCard.cardMovies.append(addMovies(movies));

            heroes.append(heroCard.card);
        });

        
    }

    // получаю карточку из шаблона
    const getCard = () => {
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
                cardMovies = card.querySelector('.movies-list');

        return { card, cardImg, cardName, cardRealName, cardGender, cardSpecies, cardStatus, cardCitizenship, cardBirthday, cardDeathday, cardActor, cardMovies };
    }

    // создание массива с фильмами для дальнейшего рендера
    const addMovies = (moviesArray) => {
        const moviesList = getCard().cardMovies;

        moviesArray.forEach( item => {
            moviesList.insertAdjacentHTML('afterbegin',
            `<li class="movie">#<span>${item}</span></li>`);
        });

        return moviesList;
    }

});