document.addEventListener('DOMContentLoaded', () => {
    const watchlistDiv = document.getElementById('watchlist');
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    if (watchlist.length === 0) {
        watchlistDiv.innerHTML = '<p>Your watchlist is empty.</p>';
        return;
    }

    watchlistDiv.innerHTML = '';
    watchlist.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('watchlist-movie');
        
         if (movie.watched) {
            movieDiv.classList.add('watched');
        }
    
        const image = document.createElement('img');
        image.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image';

        const title = document.createElement('h3');
        title.textContent = movie.title;

        // Wrap buttons in a div for better layout
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('watchlist-buttons');

        const toggleButton = document.createElement('button');
        toggleButton.textContent = movie.watched ? 'Mark as Unwatched' : 'Mark as Watched';
        toggleButton.addEventListener('click', () => {
            toggleWatched(movie.id);
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeFromWatchlist(movie.id);
        });
       
        buttonsDiv.appendChild(toggleButton);
        buttonsDiv.appendChild(removeButton);

        movieDiv.appendChild(image);
        movieDiv.appendChild(title);
        movieDiv.appendChild(buttonsDiv);
        
        watchlistDiv.appendChild(movieDiv);
    });
});

function toggleWatched(movieId) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.map(movie => {
        if (movie.id === movieId) {
            movie.watched = !movie.watched;
        }
        return movie;
    });
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    location.reload();
}

function removeFromWatchlist(movieId) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(movie => movie.id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    location.reload();
}
