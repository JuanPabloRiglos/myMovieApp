// los conteiner_principal_Div son llamados desde aqui, pero a la hora de hacerlos visibles en el archivo navegation, les imprimo la clase principa_Div_container a los fines de aplicarle las mismas caracteristicas.

//HEADER

const menuDesplegableUl = document.querySelector('.header__desplegable-options')


// HOME -- TRENDINGS AREA PREVIEW
const homeMAIN = document.querySelector('.main__content__Home');
const showMoreTRENDINGSbtn = document.getElementById('showMore-Trendin-Btn');
const conteinerPrincipalDivFavorites = document.querySelector('.favorite_principal__Div_container')
//TRENDINGS ONLY AREA -
const mainTrendsView = document.querySelector('.main__content__Trending')
const containerPrincipalDivTrending = document.querySelector('.trending_principal__Div_container');

// Category Result Viw

const categoryMain = document.querySelector('.main__content__Categories')
const containerPrincipalDivCategory = document.querySelector('.search_principal__Div_container');




// Movie Details TAGS -> 
const movieDetailMAIN = document.querySelector('.main__content__MovieDetail');
const relationedSectionConteiner = document.querySelector('.movieDetail__content_AreaRelationedMovies')
const relationedDivPrincipal = document.querySelector('.movieDetail__content_relationedMovies');


// SearchArea 
const goToHomeBTN = document.getElementById('go-home-btn');
const backBtn = document.getElementById('back-arrow-btn')
const serchResultsMAIN = document.querySelector('.main__content__SearchResult');
const containerPrincipalDivSearch = document.querySelector('.main__content__SearchResult');
const searchImput = document.getElementById('header__search-imput')//sirve
const searchBTN = document.getElementById('header__search-Btn'); // sirve

