const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

function likedMovieList() {
    const item = JSON.parse(localStorage.getItem('liked-movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    };
    return movies;
};
function likedMovies(movie) {
    const likedMovies = likedMovieList();
    console.log(likedMovies)
    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    };
    localStorage.setItem('liked-movies', JSON.stringify(likedMovies))
};

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
});

// REQUIRE API INFO TO THE NEW PAGE

let page = 1;
async function getNewPageApi() {
    //getSearchResults -> hace una primera iteracion (SIN PARAMETROS) para mostrar resultados, en caso de requerir otra pagina, utiliza esta funcion la que dependiendo el location.hash, le pega a la pagina corresponidente de la api correspondiente y llama una vez mas a la funcion getSearchResults mandandole esta vez un parametro
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const isBotomScroll = (scrollTop + clientHeight) >= (scrollHeight - 15);
    page++;
    if (isBotomScroll && location.hash.includes('trends')) {
        const { data } = await api('trending/movie/week', {
            params: {
                page
            },
        });
        const movies = Object.entries(data.results)
        console.log('nueva pagina');
        console.log(movies)
        getSearchResults(movies);
    } else if (isBotomScroll && location.hash.includes('category')) {
        const { data } = await api('discover/movie', {
            params: {
                page
            },
        });

        const dataArray = data.results;
        const paramArray = location.hash.split('-');
        const genreId = Number(paramArray.pop());
        const serchResults = dataArray.filter((movie) => movie.genre_ids.includes(genreId));
        const movies = Object.entries(serchResults);
        getSearchResults(movies);
    } else if (isBotomScroll && location.hash.startsWith('#search=')) {
        const keyWordArray = location.hash.split('=');
        const keyWordToSearch = keyWordArray.pop();
        const { data } = await api('search/movie', {
            params: {
                query: `${keyWordToSearch}`,
                page,
            }
        }
        )
        const serchResults = data.results;
        movies = Object.entries(serchResults);
        getSearchResults(movies)
    }
};

// INYECCIONES FOT THE VIEWPORT ---->
// =====================================================  Trendin PREVIEW =====================================<<<
async function getTrendintMovies() {
    const { data } = await api('trending/movie/week');

    const movies = data.results;
    const trendingDiv = document.querySelector('.home__div__silder_trendingPreview');
    trendingDiv.innerHTML = ' ';

    // linea previa borra el contenido de la etiqueta antes de ejecurar la funcion para no tener contenido repetido.
    movies.forEach(movie => {
        trendingDiv.classList.add('home__div__silder_trendingPreview');
        const articleTrendingConteiner = document.createElement('article');
        articleTrendingConteiner.classList.add('home__article__silder_trendingPreview')
        const trendingImg = document.createElement('img');
        trendingImg.classList.add('.img_slider');
        trendingImg.setAttribute('alt', 'movie.title');
        trendingImg.setAttribute('data-img', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

        trendingImg.addEventListener('error', () => {
            trendingImg.setAttribute('src', 'https://st3.depositphotos.com/1064045/18818/i/1600/depositphotos_188188474-stock-photo-unusual-cinema-concept-3d-illustration.jpg');
        });// seteo imagen defoult

        trendingImg.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        })


        const favoriteBtn = document.createElement('button');
        favoriteBtn.classList.add('favorite-button-add');
        likedMovieList()[movie.id] && favoriteBtn.classList.add('is-favorite');

        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('is-favorite')
            likedMovies(movie);
            getFavoritesMovies();
        })

        lazyloader.observe(trendingImg);
        // inyeccion de etiquetas
        articleTrendingConteiner.appendChild(favoriteBtn);
        articleTrendingConteiner.appendChild(trendingImg);
        trendingDiv.appendChild(articleTrendingConteiner);
        homeMAIN.appendChild(trendingDiv);

    });


}
// ===================================================== CATEGORIES SHOW =====================================<<<
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

//====================================================== MOVIE DETAIL =========================================<<<
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
    movieDetailIMG.setAttribute('data-img', `https://image.tmdb.org/t/p/w300/${data.poster_path}`);

    movieDetailIMG.addEventListener('error', () => {
        movieDetailIMG.setAttribute('src', 'https://st3.depositphotos.com/1064045/18818/i/1600/depositphotos_188188474-stock-photo-unusual-cinema-concept-3d-illustration.jpg');
        movieDetailIMG.setAttribute('style', 'widht: 100px; heigth: 400px')
    });

    movieDetailIMG.setAttribute('alt', `Poster de la pelicual ${data.title}`);
    const movieDetailSecondDiv = document.createElement('div');
    movieDetailSecondDiv.classList.add('movieDetail__content_selectedMovie_Info');
    const movieTitle = document.createElement('h2');
    movieTitle.innerText = `${data.title}`
    const movieInfo = document.createElement('h3');
    movieInfo.innerText = `${data.tagline} ${parseInt(data.vote_average)}⭐`
    const movieDescription = document.createElement('p');
    movieDescription.innerText = `${data.overview}`

    const favoriteBtn = document.createElement('button');
    favoriteBtn.classList.add('favorite-button-add');
    likedMovieList()[data.id] && favoriteBtn.classList.add('is-favorite');
    favoriteBtn.addEventListener('click', () => {
        favoriteBtn.classList.toggle('is-favorite');
        likedMovies(data)
    })
    // carga en lazy loader
    lazyloader.observe(movieDetailIMG)
    // inyeccion de etiquetas
    movieDetailMAIN.appendChild(movieDetailFirstDiv)
    movieDetailFirstDiv.appendChild(movieDetailIMG);
    movieDetailFirstDiv.appendChild(movieDetailSecondDiv);
    movieDetailFirstDiv.appendChild(favoriteBtn);
    movieDetailSecondDiv.appendChild(movieTitle);
    movieDetailSecondDiv.appendChild(movieInfo);
    movieDetailFirstDiv.appendChild(movieDescription);


    //--------------------- Relationed movies to movieDetail -----------------------------------------> 
    async function getRelationedMovies() {
        relationedSectionConteiner.innerHTML = '';
        relationedDivPrincipal.innerHTML = '';
        const { data } = await api(`movie/${id}/recommendations`)
        const movies = data.results
        console.log(movies);

        movies.forEach((movie) => {
            const relationedMovieArticle = document.createElement('article'); // agrego navegacion por hash al tocar el contenedor de la imagen
            const relationedMovieIMG = document.createElement('img');;
            relationedMovieIMG.setAttribute('data-img', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

            relationedMovieIMG.addEventListener('error', () => {
                relationedMovieIMG.setAttribute('src', 'https://st3.depositphotos.com/1064045/18818/i/1600/depositphotos_188188474-stock-photo-unusual-cinema-concept-3d-illustration.jpg')
                relationedMovieIMG.setAttribute('style', 'widht: 100px; heigth: 400px')
            });
            relationedMovieIMG.addEventListener('click', () => {
                location.hash = `#movie=${movie.id}`
            });
            const relationedMovieTitle = document.createElement('h4');
            relationedMovieTitle.innerText = `${movie.title}`;

            const favoriteBtn = document.createElement('button');
            favoriteBtn.classList.add('favorite-button-add');
            likedMovieList()[movie.id] && favoriteBtn.classList.add('is-favorite');
            favoriteBtn.addEventListener('click', () => {
                favoriteBtn.classList.toggle('is-favorite');
                likedMovies(movie);
            })

            // carga en el lazy loader
            lazyloader.observe(relationedMovieIMG);

            //Inyeccion
            relationedSectionConteiner.appendChild(relationedDivPrincipal)
            relationedDivPrincipal.appendChild(relationedMovieArticle);
            relationedMovieArticle.appendChild(relationedMovieIMG);
            relationedMovieArticle.appendChild(favoriteBtn);
            relationedMovieArticle.appendChild(relationedMovieTitle);
        })

        movieDetailMAIN.appendChild(relationedSectionConteiner)

    }; const relationedMovieH2 = document.createElement('h2');
    relationedMovieH2.innerHTML = ` Movie relacionated whit "${data.title} "`;
    movieDetailMAIN.appendChild(relationedMovieH2);
    getRelationedMovies();
};


//====================================================== SEARCH RESULT ========================================<<<
async function getSearchResults(params) {
    let serchResultsArray;
    const query = location.hash;
    const containerPrincipalDiv = document.querySelector('.principal__Div_container');

    // si vienen parametros, es porque la funcion getNewPageApi esta pidiendo mas peliculas, por eso no borro el contendor princial, para que permanezca lo anterior y dar infinite scroling


    if (query.includes('category') && params == null) {
        const { data } = await api('discover/movie')
        const dataArray = data.results;
        const paramArray = query.split('-');
        const genreId = Number(paramArray.pop());
        const serchResults = dataArray.filter((movie) => (movie.genre_ids).includes(genreId));
        serchResultsArray = Object.entries(serchResults);
        console.log(serchResults);
        containerPrincipalDiv.innerHTML = ''; //limpio el contenedor solo en caso de primera iteracion.
    } else if (query.includes('category')) { // si recibe params, implica una segunda iteracion dentro del if, reenviada por el getPageApi()
        console.log('solo pasaba por aca')
        serchResultsArray = params;
    } else if (query.includes('trends') && params == null) {
        const { data } = await api('trending/movie/week');
        const serchResults = data.results;
        serchResultsArray = Object.entries(serchResults);
        containerPrincipalDiv.innerHTML = ''; //limpio el contenedor solo en caso de primera iteracion.
    } else if (query.includes('trends') && params) { // si recibe params, implica una segunda iteracion dentro del if, reenviada por el getPageApi()
        serchResultsArray = params;
    } else if (!query.includes('trends') && !query.includes('category') && params) { // si recibe params, implica una segunda iteracion dentro del if, reenviada por el getPageApi()
        serchResultsArray = params;
    }
    else {
        containerPrincipalDiv.innerHTML = ''; //limpio el contenedor solo en caso de primera iteracion.
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
        console.log(serchResultsArray)
    };
    serchResultsArray.forEach(movie => {

        const articleMovie = document.createElement('article');
        articleMovie.classList.add('particular__movie_article');
        const imgMovie = document.createElement('img');
        imgMovie.classList.add('particular__movie_article');
        imgMovie.setAttribute('data-img', `https://image.tmdb.org/t/p/w300/${movie[1].poster_path}`);
        // guardo la imagen en una propiedad que creo al efecto - data-img y despues la uso en el lazyloader
        imgMovie.setAttribute('alt', `Poster de la pelicual ${movie[1].title}`)
        imgMovie.addEventListener('error', () => {
            imgMovie.setAttribute('src', 'https://st3.depositphotos.com/1064045/18818/i/1600/depositphotos_188188474-stock-photo-unusual-cinema-concept-3d-illustration.jpg');// pongo una imagen por defecto por si viene rota.
            imgMovie.setAttribute('style', 'widht: 100px; heigth: 400px')
        });
        imgMovie.addEventListener('click', () => {
            location.hash = `#movie=${movie[1].id}`
        })// navegacion al movie detail.
        const titleMovie = document.createElement('h5')
        titleMovie.innerText = `${movie[1].title}`
        const favoriteBtn = document.createElement('button');
        favoriteBtn.classList.add('favorite-button-add');
        likedMovieList()[movie[1].id] && favoriteBtn.classList.add('is-favorite');
        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('is-favorite');
            likedMovies(movie = { ...movie[1] });
        })

        // 
        lazyloader.observe(imgMovie);

        // inyeccion de etiquetas
        articleMovie.appendChild(imgMovie);
        articleMovie.appendChild(imgMovie);
        articleMovie.appendChild(favoriteBtn);
        articleMovie.appendChild(titleMovie);
        containerPrincipalDiv.appendChild(articleMovie);
        containerPrincipalDiv.classList.remove('noImg')

    });

};

function getFavoritesMovies() {
    const movies = Object.values(likedMovieList());
    const conteinerPrincipalDivFavorites = document.querySelector('.favorite_principal__Div_container');
    conteinerPrincipalDivFavorites.innerHTML = '';
    conteinerPrincipalDivFavorites.classList.remove('noImg')
    movies.forEach(movie => {
        const favoritededMovieArticle = document.createElement('article'); // agrego navegacion por hash al tocar el contenedor de la imagen
        const favoritedMovieIMG = document.createElement('img');;
        favoritedMovieIMG.setAttribute('data-img', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);
        favoritedMovieIMG.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        });
        const favoritedMovieTitle = document.createElement('h4');
        favoritedMovieTitle.innerText = `${movie.title}`;

        const favoriteBtn = document.createElement('button');
        if (likedMovieList()[movie.id]) {
            favoriteBtn.classList.add('is-favorite')
        } else {

            favoriteBtn.classList.add('favorite-button-add');
        }
        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('favorite-button-add');
            likedMovies(movie);
            getFavoritesMovies();
        });

        // carga en el lazy loader
        lazyloader.observe(favoritedMovieIMG);

        //Inyeccion

        conteinerPrincipalDivFavorites.appendChild(favoritededMovieArticle);
        favoritededMovieArticle.appendChild(favoritedMovieIMG);
        favoritededMovieArticle.appendChild(favoriteBtn);
        favoritededMovieArticle.appendChild(favoritedMovieTitle);
    });
}

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

//==i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i==i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=i=


