const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

// UTILITY //
// LAZYLOADER -> permite solo cargar imagenes de lo que aparezca en el viewport.
const lazyloader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url)
        }
        // console.log(entry.target);
    });
})
// ==============Cargar mas peliculas para infinite Scroll ====<
// async function getPaginationMovies() {
//     const { data } = await api('trending/movie/week', {
//         params: {
//             page: 2
//         }
//     });
//     const serchResults = data.results;
//     serchResultsArray = Object.entries(serchResults);
//     console.log('Search de paginacion');
//     console.log(serchResultsArray)
//     return serchResultsArray
//}  PENDIENTE EN TO DO AL MOMENTO DE REFACTORIZAR PARA SCROLL INFINITO

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
        topRatedIMG.setAttribute('data-img', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

        topRatedIMG.addEventListener('error', () => {
            topRatedIMG.setAttribute('src', 'https://st3.depositphotos.com/1064045/18818/i/1600/depositphotos_188188474-stock-photo-unusual-cinema-concept-3d-illustration.jpg')
        }) // imagen por defecto si no hay en la API, >>>> ACHICAR TAMANO >>TO DO 

        // inyeccion de etiquetas
        topRatedDiv.appendChild(topRatedIMG);
        lazyloader.observe(topRatedIMG)
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
        trendingImg.setAttribute('data-img', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`)

        // inyeccion de etiquetas
        trendingDiv.appendChild(trendingImg);
        trendingArticle.appendChild(trendingDiv);

        lazyloader.observe(trendingImg);
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

    movieDetailIMG.addEventListener('error', () => {
        movieDetailIMG.setAttribute('src', 'https://st3.depositphotos.com/1064045/18818/i/1600/depositphotos_188188474-stock-photo-unusual-cinema-concept-3d-illustration.jpg')
    })

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
            relationedMovieIMG.setAttribute('data-img', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

            relationedMovieIMG.addEventListener('error', () => {
                relationedMovieIMG.setAttribute('src', 'https://st3.depositphotos.com/1064045/18818/i/1600/depositphotos_188188474-stock-photo-unusual-cinema-concept-3d-illustration.jpg')
            })

            const relationedMovieTitle = document.createElement('h4');
            relationedMovieTitle.classList.add('relationed_movie-titleH4');
            relationedMovieTitle.innerText = `${movie.title}`;
            //Inyeccion
            relationedDivPrincipal.appendChild(relationedMovieArticle);
            relationedMovieArticle.appendChild(relationedMovieIMG);
            relationedMovieArticle.appendChild(relationedMovieTitle);

            lazyloader.observe(relationedMovieIMG)
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
        // imgMovie.classList.add('card-img-top'); BORRAR o CAMBIAR PARA CSS
        imgMovie.setAttribute('data-img', `https://image.tmdb.org/t/p/w300/${movie[1].poster_path}`);

        imgMovie.addEventListener('error', () => {
            imgMovie.setAttribute('src', 'https://st3.depositphotos.com/1064045/18818/i/1600/depositphotos_188188474-stock-photo-unusual-cinema-concept-3d-illustration.jpg')
        })

        imgMovie.setAttribute('alt', `Poster de la pelicual ${movie[1].title}`)
        const titleMovie = document.createElement('h5')
        titleMovie.innerText = `${movie[1].title}`
        const btnMovie = document.createElement('button')
        // btnMovie.classList.add('btn-primary') BORRAR o CAMBIAR PARA CSS
        btnMovie.addEventListener('click', () => {
            location.hash = `#movie=${movie[1].id}`
        });
        // inyeccion de etiquetas
        divMovie.appendChild(imgMovie);
        divMovie.appendChild(titleMovie);
        divMovie.appendChild(btnMovie);
        serchResultsMAIN.appendChild(divMovie);


        lazyloader.observe(imgMovie)
    });
}

//==i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i==i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=
getTrendintMovies();
getTopRatedMovies();
