const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

// =====================================================  TOP RATED CARROUSEL ==========<<<
// async function getTopRatedMovies() {
//     const { data } = await api('movie/top_rated');
//     const movies = data.results;
//     const topRatedDiv = document.getElementById('main-conteiner-a');

//     movies.forEach(movie => {
//         const topRatedIMG = document.createElement('img');
//         topRatedIMG.addEventListener('click', () => {
//             location.hash = `#movie=${movie.id}`
//         })
//         topRatedIMG.setAttribute('alt', `${movie.title}`);
//         topRatedIMG.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`)
//         // inyeccion de etiquetas
//         topRatedDiv.appendChild(topRatedIMG);
//     });
// };
// =====================================================  Trendin PREVIEW ==========<<<
async function getTrendintMovies() {
    const { data } = await api('trending/movie/week');

    // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
    // const data = await res.json();
    // Lo comentado era necesario para trabajar con fetch, con axion se declara el objeto de configuracion arriba, y se usa.

    const movies = data.results;
    const trendingDiv = document.querySelector('.home__div__silder_trendingPreview');
    trendingDiv.innerHTML = ' ';
    // linea previa borra el contenido de la etiqueta antes de ejecurar la funcion para no tener contenido repetido.
    movies.forEach(movie => {
        trendingDiv.classList.add('home__div__silder_trendingPreview');
        const articleTrendingConteiner = document.createElement('article');
        articleTrendingConteiner.classList.add('home__article__silder_trendingPreview')
        articleTrendingConteiner.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        })
        const trendingImg = document.createElement('img');

        trendingImg.classList.add('.img_slider');
        trendingImg.setAttribute('alt', 'movie.title');
        trendingImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`)

        // inyeccion de etiquetas
        articleTrendingConteiner.appendChild(trendingImg)
        trendingDiv.appendChild(articleTrendingConteiner);
    });
};
// ===================================================== CATEGORIES SHOW==========<<<
async function getCategories() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;
    const ulGenre = document.querySelector('.header__desplegable-options')
    ulGenre.innerHTML = '';
    categories.forEach(genre => {
        const liGenre = document.createElement('li');
        liGenre.classList.add('desplegable__item')
        const genreAncor = document.createElement('a');
        genreAncor.classList.add('desplegable__item_ancor');
        genreAncor.innerText = `${genre.name}`;
        const id = genre.id;
        liGenre.addEventListener('click', () => {
            location.hash = `#search=-category-${genre.name}-${id}`
            categoryMain.innerHTML = '';
            const h3Category = document.createElement('h3');
            h3Category.innerHTML = `Resolt for "${genre.name}"`
            categoryMain.appendChild(h3Category)
        })
        // inyeccion de etiquetas
        ulGenre.appendChild(liGenre);
        liGenre.appendChild(genreAncor);
    });
}; getCategories();

//====================================================== MOVIE DETAIL =========<<<
async function getMovieDetail() {
    const params = location.hash.split('=');
    const id = params.pop()
    const { data } = await api(`movie/${id}`);
    console.log(data)
    movieDetailMAIN.innerHTML = '';
    // limpiamos contenedor para no sumar peliculas//
    const movieDetailFirstDiv = document.createElement('div');
    movieDetailFirstDiv.classList.add('movieDetail__content_selectedMovie');
    const movieDetailIMG = document.createElement('img');
    movieDetailIMG.setAttribute('src', `https://image.tmdb.org/t/p/w300/${data.poster_path}`);
    movieDetailIMG.setAttribute('alt', `Poster de la pelicual ${data.title}`)
    const movieDetailSecondDiv = document.createElement('div');
    movieDetailSecondDiv.classList.add('movieDetail__content_selectedMovie_Info');
    const movieTitle = document.createElement('h2');
    movieTitle.innerText = `${data.title}`
    const movieInfo = document.createElement('h3');
    movieInfo.innerText = `${data.tagline} ${parseInt(data.vote_average)}⭐`
    const movieDescription = document.createElement('p');
    movieDescription.innerText = `${data.overview}`
    // inyeccion de etiquetas
    movieDetailMAIN.appendChild(movieDetailFirstDiv)
    movieDetailFirstDiv.appendChild(movieDetailIMG);
    movieDetailFirstDiv.appendChild(movieDetailSecondDiv);
    movieDetailSecondDiv.appendChild(movieTitle);
    movieDetailSecondDiv.appendChild(movieInfo);
    movieDetailFirstDiv.appendChild(movieDescription);


    // Relationed movies to movieDetail ---> 
    async function getRelationedMovies() {
        relationedSectionConteiner.innerHTML = '';
        relationedDivPrincipal.innerHTML = '';
        const { data } = await api(`movie/${id}/recommendations`)
        const movies = data.results
        console.log(movies);




        movies.forEach((movie) => {
            const relationedMovieArticle = document.createElement('article');
            // relationedMovieArticle.classList.add('relationed_movie_contein');
            relationedMovieArticle.addEventListener('click', () => {
                location.hash = `#movie=${movie.id}`
            }) // agrego navegacion por hash al tocar el contenedor de la imagen
            const relationedMovieIMG = document.createElement('img');;
            relationedMovieIMG.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);
            const relationedMovieTitle = document.createElement('h4');
            relationedMovieTitle.innerText = `${movie.title}`;
            //Inyeccion
            relationedSectionConteiner.appendChild(relationedDivPrincipal)
            relationedDivPrincipal.appendChild(relationedMovieArticle);
            relationedMovieArticle.appendChild(relationedMovieIMG);
            relationedMovieArticle.appendChild(relationedMovieTitle);
        })

        movieDetailMAIN.appendChild(relationedSectionConteiner)

    }; const relationedMovieH2 = document.createElement('h2');
    relationedMovieH2.innerHTML = ` Movie relacionated whit "${data.title} "`;
    movieDetailMAIN.appendChild(relationedMovieH2)
    getRelationedMovies();
}


//====================================================== SEARCH RESULT =========<<<
async function getSearchResults() {
    const query = location.hash;
    const containerPrincipalDiv = document.querySelector('.principal__Div_container')
    containerPrincipalDiv.innerHTML = '';
    let serchResultsArray;
    if (query.includes('category')) {
        const { data } = await api('discover/movie')
        const dataArray = data.results;
        const paramArray = query.split('-');
        const genreId = Number(paramArray.pop());
        const serchResults = dataArray.filter((movie) => movie.genre_ids.includes(genreId));
        serchResultsArray = Object.entries(serchResults);
    } else if (query.includes('trends')) {
        const { data } = await api('trending/movie/week');
        const serchResults = data.results;
        serchResultsArray = Object.entries(serchResults);
    }
    else {
        const keyWordArray = query.split('=');
        const keyWordToSearch = keyWordArray.pop();
        const { data } = await api('search/movie', {
            params: {
                'query': `${keyWordToSearch}`
            }
        }
        )
        const serchResults = data.results;
        console.log('lo que trae es');
        serchResultsArray = Object.entries(serchResults);

    };

    serchResultsArray.forEach(movie => {

        const articleMovie = document.createElement('article');
        articleMovie.classList.add('particular__movie_article');
        articleMovie.addEventListener('click', () => {
            location.hash = `#movie=${movie[1].id}`
        })
        const imgMovie = document.createElement('img');
        imgMovie.classList.add('particular__movie_article');
        imgMovie.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie[1].poster_path}`);
        imgMovie.setAttribute('alt', `Poster de la pelicual ${movie[1].title}`)
        const titleMovie = document.createElement('h5')
        titleMovie.innerText = `${movie[1].title}`

        // inyeccion de etiquetas
        articleMovie.appendChild(imgMovie);
        articleMovie.appendChild(titleMovie);
        containerPrincipalDiv.appendChild(articleMovie);
        containerPrincipalDiv.classList.remove('noImg')
    });
}

//==i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i==i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=
getTrendintMovies();
// getTopRatedMovies();
