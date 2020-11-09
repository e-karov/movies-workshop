import { getAllMovies, getMovieById, createMovie, updateMovie, getMoviesByOwner, buyTicket, deleteMovie } from '../data.js';
import { showError, showInfo } from '../notifications.js';


export default async function catalog() {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs'),
        movie: await this.load('../templates/movies/movie.hbs')
    };

    const search = this.params.search || '';
   try {
       const movies = await getAllMovies(search);
       if (movies.hasOwnProperty('errorData')) {
        const error = Object.assign({}, movies);
           throw error;
       };

       this.app.userData.movies = movies;   

       const context = Object.assign({ origin: encodeURIComponent('#/catalog'), search }, this.app.userData);

        this.partial('../templates/movies/catalog.hbs', context);

    } catch (error) {
       showError(error.message);
       console.error(error);
    };
}

export async function getMyMovies() {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs'),
        ownMovie: await this.load('../templates/movies/ownMovie.hbs')
    };
    
    const userId = this.app.userData.userId;

    try {
        const myMovies = await getMoviesByOwner(userId);
        if (myMovies.hasOwnProperty('errorData')) {
         const error = Object.assign({}, myMovies);
            throw error;
        };

        this.app.userData.movies = myMovies;  
        const context = Object.assign({ origin: encodeURIComponent('#/myMovies') }, this.app.userData );
        this.partial('../templates/movies/usersMovies.hbs', context);
 
     } catch (error) {
        showError(error.message);
        console.error(error);
     }
}

export async function details() {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs'),
        movie: await this.load('../templates/movies/movie.hbs')
    };
    const movieId = this.params.id;
    let movie = this.app.userData.movies.find(m => m.objectId === movieId);

    if (movie === undefined) {

        try {
            movie = await getMovieById(movieId);
            if (movie.hasOwnProperty('errorData')) {
                const err = Object.assign(new Error(), movie);
                throw err;
            };

        } catch (err) {
            showError(err.message);
            console.log(err);
        }
    }
    const context = Object.assign({ movie, origin: encodeURIComponent('#/details/' + movieId) }, this.app.userData);
    this.partial('../templates/movies/details.hbs', context);
}

export async function edit() {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs'),
    };

    const movieId = this.params.id;

    let movie = this.app.userData.movies.find(m => m.objectId === movieId);
    if (movie === undefined) {
        let movie = await getMovieById(movieId);
        if (movie.hasOwnProperty('errorData')) {
            const err = Object.assign(new Error(), movie);
            throw err;
        };
    };

    let context = Object.assign({movie}, this.app.userData);

    this.partial('../templates/movies/edit.hbs', context );
}

export async function editPost() {
    const movieId = this.params.id; 

    const movie = {
        title: this.params.title,
        description: this.params.description,
        imageUrl: this.params.imageUrl,
        genres: this.params.genres,
        tickets: Number(this.params.tickets)
    };

    try {
        if (movie.title.length < 6) {
            throw new Error('Title should be at least 6 characters long');
        };
        if (movie.description.length < 10) {
            throw new Error('Description should be at least 10 characters long.');
        };
        if (!movie.imageUrl.match('(^https:\/\/)|(^http:\/\/)')) {
            throw new Error('Image should start with "http://" or "https://".');
        };
        if (typeof(movie.tickets) !== "number") {
            throw new Error('The available tickets should be a number.');
        };

        if (movie.genres.match(/(.+)  (.+)/gm)) {
            throw new Error('The genres must be separated by a single space.');
        }

        const result = await updateMovie(movieId, movie);

    if (result.hasOwnProperty('errorData')) {
        const error = Object.assign({}, result);
        throw error;
        };

        showInfo('Movie updated successfully.');
        this.redirect('#/myMovies');
        
    } catch (error) {
        showError(error.message);
        console.error(error); 
    }

}

export async function create() {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs'),
    };

  
    this.partial('../templates/movies/create.hbs', this.app.userData);
}

export async function createPost() {
    const title = this.params.title;
    const imageUrl = this.params.imageUrl;
    const description = this.params.description;
    const genres = this.params.genres;
    const tickets = Number(this.params.tickets);

    const newMovie = {
        title,
        description,
        imageUrl,
        genres,
        tickets,
    };
    console.log('Edit post');

    try {
        if (newMovie.title.length < 6) {
            throw new Error('Title should be at least 6 characters long');
        };
        if (newMovie.description.length < 10) {
            throw new Error('Description should be at least 10 characters long.');
        };
        if (!newMovie.imageUrl.match('(^https:\/\/)|(^http:\/\/)')) {
            console.log(newMovie.imageUrl);
            throw new Error('Image should start with "http://" or "https://".');
        };
        if (typeof(newMovie.tickets) !== "number") {
            throw new Error('The available tickets should be a number.');
        };

        if (newMovie.genres.match(/(.+)  (.+)/gm)) {
            throw new Error('The genres must be separated by a single space.');
        }

        const result = await createMovie(newMovie);

    if (result.hasOwnProperty('errorData')) {
        const error = Object.assign({}, result);
        throw error;
        };

        showInfo('Movie created successfully.');
        this.redirect('#/home');
        
    } catch (error) {
        showError(error.message)
    }
}

export async function deleteMovieById() {
    const movieId = this.params.id;

    if (confirm('The movie will be deleted!') == false) {
        return this.redirect('#/myMovies');
    };

    try {
        const result = await deleteMovie(movieId);

        if (result.hasOwnProperty("errorData")) {
            const err = new Error();
            Object.assign(err, result);
            throw err;
        };

        showInfo(`Movie removed successfully!`);

        this.redirect('#/home');
    } catch (err) {
        showError(err.message);
        console.error(err);
    }

}

    export async function buy() {
        const movieId = this.params.id;

        try {

            let movie = this.app.userData.movies.find(m => m.objectId === movieId);
            if (movie === undefined) {
                let movie = await getMovieById(movieId);
                if (movie.hasOwnProperty('errorData')) {
                    const err = Object.assign(new Error(), movie);
                    throw err;
                };
            };

            if (movie.tickets <= 0) {
                showError(`No tickets available for ${movie.title}!`);
                return;
            };
        
            const updatedMovie = await buyTicket(movie);
         
            if (updatedMovie.hasOwnProperty('errorData')) {
                const err = new Error();
                Object.assign(err, updatedMovie);
                throw err;
            };

            showInfo(`Ticket bought for ${movie.title}`);

            const movieIndex = this.app.userData.movies.indexOf(movie);
            this.app.userData.movies.splice(movieIndex, 1, updatedMovie);
      
            this.redirect(this.params.origin);

        } catch (err) {
            console.error(err);
            showError(err.message);
        };
}
    
