showMoreTRENDINGSbtn.addEventListener('click', () => {
    location.hash = '#search=trends'
});

searchBTN.addEventListener('click', () => {
    location.hash = `#search=${searchImput.value}`
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

function navegeitor() {
    console.log({ location });

    if (location.hash.startsWith('#trends')) {
        trendsPage();
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
    trendsMAIN.classList.remove('invisible')
    serchResultsMAIN.classList.add('invisible');
    homeMAIN.classList.add('invisible');
    movieDetailMAIN.classList.add('invisible');
    relationedSectionConteiner.classList.add('invisible');
    goToHomeBTN.classList.remove('invisible');
};
function searchPage() {
    console.log('Estas en Search')
    serchResultsMAIN.classList.remove('invisible');
    homeMAIN.classList.add('invisible');
    movieDetailMAIN.classList.add('invisible');
    relationedSectionConteiner.classList.add('invisible')
    trendsMAIN.classList.add('invisible');
    goToHomeBTN.classList.remove('invisible');

    getSearchResults();
};
function movieDetail() {
    console.log('Estas en el detalle de tu pelicula');
    homeMAIN.classList.add('invisible');
    serchResultsMAIN.classList.add('invisible');
    movieDetailMAIN.classList.remove('invisible');
    relationedSectionConteiner.classList.remove('invisible')
    trendsMAIN.classList.add('invisible');
    goToHomeBTN.classList.remove('invisible');
    getMovieDetail();
};

function homePage() {
    console.log('estas en el home');
    getCategories();
    homeMAIN.classList.remove('invisible');
    goToHomeBTN.classList.add('invisible');
    serchResultsMAIN.classList.add('invisible');
    movieDetailMAIN.classList.add('invisible');
    relationedSectionConteiner.classList.add('invisible')
    trendsMAIN.classList.add('invisible');
}
