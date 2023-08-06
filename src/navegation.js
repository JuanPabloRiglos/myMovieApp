showMoreTRENDINGSbtn.addEventListener('click', () => {
    location.hash = '#search=trends';

});


searchBTN.addEventListener('click', () => {
    location.hash = `#search=${searchImput.value}`
    location.reload();
    console.log(location.hash)
});

goToHomeBTN.addEventListener('click', () => {
    location.hash = 'home'
})
backBtn.addEventListener('click', () => {
    history.back()
})

window.addEventListener('DOMContentLoaded', navegeitor, false);
window.addEventListener('hashchange', navegeitor, false);
window.addEventListener('scroll', getNewPageApi);

function navegeitor() {
    console.log({ location });

    if (location.hash.includes('trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=') && location.hash.includes('category')) {
        moviesByCategoryPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetail();

    }
    else {
        homePage()
    }
};
navegeitor();

function trendsPage() {
    console.log('Estas en Trends')

    mainTrendsView.classList.remove('invisible')
    goToHomeBTN.classList.remove('invisible');
    containerPrincipalDivTrending.classList.add('principal__Div_container')// esta clase es la que debo usar en CADA DIV de cada Seccion, pero SOLO al momento de mostrar la vista.
    serchResultsMAIN.classList.add('invisible');
    homeMAIN.classList.add('invisible');
    conteinerPrincipalDivFavorites.classList.add('invisible')
    movieDetailMAIN.classList.add('invisible');
    relationedSectionConteiner.classList.add('invisible')
    categoryMain.classList.add('invisible')
    getSearchResults();
};
function searchPage() {
    console.log('Estas en Search')
    goToHomeBTN.classList.remove('invisible');
    categoryMain.classList.add('invisible')
    serchResultsMAIN.classList.remove('invisible');
    containerPrincipalDivSearch.classList.add('principal__Div_container')
    homeMAIN.classList.add('invisible');
    conteinerPrincipalDivFavorites.classList.add('invisible')
    movieDetailMAIN.classList.add('invisible');
    relationedSectionConteiner.classList.add('invisible')
    mainTrendsView.classList.add('invisible');



    getSearchResults();
};
function movieDetail() {

    console.log('Estas en el detalle de tu pelicula');
    homeMAIN.classList.add('invisible');
    conteinerPrincipalDivFavorites.classList.add('invisible')
    serchResultsMAIN.classList.add('invisible');
    movieDetailMAIN.classList.remove('invisible');
    relationedSectionConteiner.classList.remove('invisible');
    relationedDivPrincipal.classList.remove('invisible');
    mainTrendsView.classList.add('invisible');
    goToHomeBTN.classList.remove('invisible');

    getMovieDetail();


};

function moviesByCategoryPage() {
    console.log('Estas en el CategoryResult')
    goToHomeBTN.classList.remove('invisible');
    categoryMain.classList.remove('invisible')
    serchResultsMAIN.classList.remove('invisible');
    containerPrincipalDivCategory.classList.add('principal__Div_container')
    homeMAIN.classList.add('invisible');
    conteinerPrincipalDivFavorites.classList.add('invisible')
    movieDetailMAIN.classList.add('invisible');

    relationedSectionConteiner.classList.add('invisible')
    mainTrendsView.classList.add('invisible');


    getSearchResults();
}

function homePage() {
    console.log('estas en el home');
    homeMAIN.classList.remove('invisible');
    conteinerPrincipalDivFavorites.classList.remove('invisible')
    movieDetailMAIN.classList.add('invisible');
    serchResultsMAIN.classList.add('invisible');
    relationedSectionConteiner.classList.add('invisible')
    categoryMain.classList.add('invisible')
    mainTrendsView.classList.add('invisible');
    goToHomeBTN.classList.add('invisible');

    getTrendintMovies();
    getFavoritesMovies();

}
