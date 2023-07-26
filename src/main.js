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
async function getTopRatedMovies() {
    const { data } = await api('movie/top_rated');
    const movies = data.results;
    const topRatedDiv = document.getElementById('main-conteiner-a');

    movies.forEach(movie => {
        const topRatedIMG = document.createElement('img');
        topRatedIMG.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        })
        topRatedIMG.setAttribute('alt', `${movie.title}`);
        topRatedIMG.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`)
        // inyeccion de etiquetas
        topRatedDiv.appendChild(topRatedIMG);
    });
};
// =====================================================  Trendin PREVIEW ==========<<<
async function getTrendintMovies() {
    const { data } = await api('trending/movie/week');

    // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
    // const data = await res.json();
    // Lo comentado era necesario para trabajar con fetch, con axion se declara el objeto de configuracion arriba, y se usa.

    const movies = data.results;
    const trendingArticle = document.querySelector('.carousel-inner');
    trendingArticle.innerHTML = ' ';
    // linea previa borra el contenido de la etiqueta antes de ejecurar la funcion para no tener contenido repetido.
    movies.forEach(movie => {
        const trendingArticle = document.querySelector('.carousel-inner');
        const trendingDiv = document.createElement('div');
        if (movie == movies[0]) {
            trendingDiv.classList.add('active');
        }
        trendingDiv.classList.add('carousel-item');
        trendingDiv.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        })
        const trendingImg = document.createElement('img');
        trendingImg.classList.add('d-block');
        trendingImg.classList.add('w-100');
        trendingImg.setAttribute('alt', 'movie.title');
        trendingImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`)

        // inyeccion de etiquetas
        trendingDiv.appendChild(trendingImg);
        trendingArticle.appendChild(trendingDiv);
    });
};
// ===================================================== CATEGORIES SHOW==========<<<
async function getCategories() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;
    categories.forEach(genre => {
        const ulGenre = document.querySelector('.dropdown-menu');
        const liGenre = document.createElement('li');
        const genreAncor = document.createElement('a');
        genreAncor.classList.add('dropdown-item');
        genreAncor.innerText = `${genre.name}`;
        const id = genre.id;
        genreAncor.addEventListener('click', () => {
            location.hash = `#search=-category-${genre.name}-${id}`
        })
        // inyeccion de etiquetas
        ulGenre.appendChild(genreAncor);
        ulGenre.appendChild(liGenre);
    });
};

//====================================================== MOVIE DETAIL =========<<<
async function getMovieDetail() {
    const params = location.hash.split('=');
    const id = params.pop()
    const { data } = await api(`movie/${id}`);
    console.log(data)
    movieDetailMAIN.innerHTML = '';
    // limpiamos contenedor para no sumar peliculas//
    const movieDetailFirstDiv = document.createElement('div');
    movieDetailFirstDiv.classList.add('movie-detail-firstDiv');
    movieDetailFirstDiv.classList.add('card');
    const movieDetailIMG = document.createElement('img');
    movieDetailIMG.classList.add('card-img-top');
    movieDetailIMG.setAttribute('src', `https://image.tmdb.org/t/p/w300/${data.poster_path}`);
    movieDetailIMG.setAttribute('alt', `Poster de la pelicual ${data.title}`)
    const movieDetailSecondDiv = document.createElement('div');
    movieDetailSecondDiv.classList.add('card-body');
    const movieTitle = document.createElement('h3');
    movieTitle.innerText = `${data.title}`
    movieTitle.setAttribute('style', 'display:Inline');
    const overageSpan = document.createElement('span');
    overageSpan.setAttribute('style', 'margin-left: 10%')
    overageSpan.innerText = ` ${parseInt(data.vote_average)} ⭐`
    const spanSubTitle = document.createElement('h2');
    spanSubTitle.innerText = `${data.tagline}`
    const movieDescription = document.createElement('p');
    movieDescription.innerText = `${data.overview}`
    // inyeccion de etiquetas
    movieDetailMAIN.appendChild(movieDetailFirstDiv)
    movieDetailFirstDiv.appendChild(movieDetailIMG);
    movieDetailFirstDiv.appendChild(movieDetailSecondDiv);
    movieDetailSecondDiv.appendChild(movieTitle);
    movieDetailSecondDiv.appendChild(overageSpan);
    movieDetailSecondDiv.appendChild(spanSubTitle);
    movieDetailSecondDiv.appendChild(movieDescription);


    // Relationed movies to movieDetail ---> 
    async function getRelationedMovies() {

        relationedMovieH2.innerText = ` Movies Relationed whit your Serch : "${data.title} "`;
        relationedSectionConteiner.appendChild(relationedMovieH2);
        relationedDivPrincipal.innerHTML = ''
        const { data: results } = await api(`movie/${id}/recommendations`)
        const movies = results.results
        console.log(movies);

        movies.forEach((movie) => {
            const relationedMovieArticle = document.createElement('article');
            relationedMovieArticle.classList.add('relationed_movie_contein');
            relationedMovieArticle.addEventListener('click', () => {
                location.hash = `#movie=${movie.id}`
            }) // agrego navegacion por hash al tocar el contenedor de la imagen
            const relationedMovieIMG = document.createElement('img');
            relationedMovieIMG.classList.add('relationed_movie-img');
            relationedMovieIMG.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`)
            const relationedMovieTitle = document.createElement('h4');
            relationedMovieTitle.classList.add('relationed_movie-titleH4');
            relationedMovieTitle.innerText = `${movie.title}`;
            //Inyeccion
            relationedDivPrincipal.appendChild(relationedMovieArticle);
            relationedMovieArticle.appendChild(relationedMovieIMG);
            relationedMovieArticle.appendChild(relationedMovieTitle);


        })


    };
    getRelationedMovies();
}


//====================================================== SEARCH RESULT =========<<<
async function getSearchResults() {
    const query = location.hash;
    serchResultsMAIN.innerHTML = '';
    let serchResultsArray;
    if (query.includes('category')) {
        const { data } = await api('discover/movie')
        const dataArray = data.results;
        const paramArray = query.split('-');
        const genreId = Number(paramArray.pop());
        const serchResults = dataArray.filter((movie) => movie.genre_ids.includes(genreId));
        serchResultsArray = Object.entries(serchResults)
    } else if (query.includes('trends')) {
        const { data } = await api('trending/movie/week');
        const serchResults = data.results;
        serchResultsArray = Object.entries(serchResults)
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
        serchResultsArray = Object.entries(serchResults)
    }
    serchResultsArray.forEach(movie => {
        const divMovie = document.createElement('div');
        divMovie.addEventListener('click', () => {
            location.hash = `#movie=${movie[1].id}`
        })
        const imgMovie = document.createElement('img');
        imgMovie.classList.add('card-img-top');
        imgMovie.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie[1].poster_path}`);
        imgMovie.setAttribute('alt', `Poster de la pelicual ${movie[1].title}`)
        const titleMovie = document.createElement('h5')
        titleMovie.innerText = `${movie[1].title}`
        const btnMovie = document.createElement('button')
        btnMovie.classList.add('btn-primary')
        btnMovie.addEventListener('click', () => {
            location.hash = `#movie=${movie[1].id}`
        });
        // inyeccion de etiquetas
        divMovie.appendChild(imgMovie);
        divMovie.appendChild(titleMovie);
        divMovie.appendChild(btnMovie);
        serchResultsMAIN.appendChild(divMovie);
    });
}

//==i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i==i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=
getTrendintMovies();
getTopRatedMovies();
