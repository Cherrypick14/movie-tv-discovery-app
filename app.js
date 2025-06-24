// Fetch popular movies on page load
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    let debounceTimeout;

    // Load popular movies when the page loads
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

    // Fetch and display popular movies
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

    // Search function
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

    // Display results function
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
