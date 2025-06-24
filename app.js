// Fetch popular movies on page load
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    // const trendingDiv = document.getElementById('trending');

    let debounceTimeout;

    fetchTrending();
    fetchPopularMovies();
   

    // Search functionality with debounce
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const query = searchInput.value.trim();
            if (query) {
                searchMovies(query);
            } else {
                // If input is cleared, show popular movies again
                fetchPopularMovies();
            }
        }, 500);
    });

    // Fetch and display trending content in a carousel

    async function fetchTrending() {
    const carouselInner = document.getElementById('carouselInner');
    carouselInner.innerHTML = 'Loading...';

    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`);
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        displayTrendingCarousel(data.results);
    } catch (error) {
        carouselInner.innerHTML = 'Something went wrong. Please try again.';
    }
}

// Display Trending Content in Slider

function displayTrendingCarousel(items) {
    const carouselInner = document.getElementById('carouselInner');
    if (items.length === 0) {
        carouselInner.innerHTML = 'No trending content found.';
        return;
    }

    carouselInner.innerHTML = '';

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('carousel-item');
        itemDiv.style.backgroundImage = item.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`
            : `url(https://via.placeholder.com/800x300?text=No+Image)`;

        const overlay = document.createElement('div');
        overlay.classList.add('carousel-overlay');
        overlay.textContent = item.title || item.name;

        itemDiv.appendChild(overlay);
        carouselInner.appendChild(itemDiv);
    });

    startCarousel();
}

// Auto-slide carousel
let currentSlide = 0;

function startCarousel() {
    const carouselInner = document.getElementById('carouselInner');
    const slides = document.querySelectorAll('.carousel-item');

    if (slides.length === 0) return;

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    }, 4000); // Slide every 4 seconds
}

    // Fetch popular movies
    async function fetchPopularMovies() {
        resultsDiv.innerHTML = 'Loading...';
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
            if (!response.ok) throw new Error('API Error');

            const data = await response.json();
            displayResults(data.results);
        } catch (error) {
            resultsDiv.innerHTML = 'Something went wrong. Please try again.';
        }
    }

    // Search movies
    async function searchMovies(query) {
        resultsDiv.innerHTML = 'Loading...';
        try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('API Error');

            const data = await response.json();
            displayResults(data.results);
        } catch (error) {
            resultsDiv.innerHTML = 'Something went wrong. Please try again.';
        }
    }

    // Display Popular Movies (Grid)
    function displayResults(movies) {
        if (movies.length === 0) {
            resultsDiv.innerHTML = 'No results found.';
            return;
        }

        resultsDiv.innerHTML = '';
        movies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');

            const image = document.createElement('img');
            image.src = movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : 'https://via.placeholder.com/200x300?text=No+Image';

            const title = document.createElement('h3');
            title.textContent = movie.title;

            movieDiv.appendChild(image);
            movieDiv.appendChild(title);
            resultsDiv.appendChild(movieDiv);
        });
    }
});
