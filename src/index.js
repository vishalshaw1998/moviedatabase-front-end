import React, { useState, useContext, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const ListMovie = React.createContext();

function Heading() {
    return <h1 className="text-center">Welcome to Movie Database</h1>;
}
function SideResults() {
    const { movie } = useContext(ListMovie);
    return (
        <div>
            {movie.map((item) => {
                return (
                    <div key={item._id} className="card mt-4">
                        <div className="card-body">
                            <h3 className="card-title">{item.title}</h3>
                            <p className="card-text font-italic">
                                {item.storyline}
                            </p>
                            <p className="card-text font-weight-bold">
                                Release: {item.year}
                            </p>
                            <p className="card-text font-weight-bold">
                                Run Time: {item.duration}
                            </p>
                            <p className="card-text font-weight-bold">
                                Imdb Rating: {item.imdbRating}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function FormForSearchByName() {
    const { movieFn } = useContext(ListMovie);
    const movieName = useRef();
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let movieToFind = `"${String(movieName.current.value)}"`;
            const res = await fetch(
                `https://fierce-shore-49516.herokuapp.com/getSingleMovie?movieName=${movieToFind}`
            );
            const data = await res.json();
            movieFn(data);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="mt-3">
            <form onSubmit={handleSubmit}>
                <div className="text-center">
                    <span style={{ marginRight: "25px" }}>
                        <label htmlFor="movieName">Name Of Movie</label>
                    </span>
                    <input
                        ref={movieName}
                        id="movieName"
                        type="text"
                        required
                    />
                    <br />
                    <br />
                    <button className="btn btn-primary">
                        Search For Movie Details By Name
                    </button>
                </div>
            </form>
        </div>
    );
}

function FormForAddMovie() {
    const { movieFn } = useContext(ListMovie);
    const title = useRef();
    const year = useRef();
    const duration = useRef();
    const storyLine = useRef();
    const imdb = useRef();
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch(
                "https://fierce-shore-49516.herokuapp.com/addMovie",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: title.current.value,
                        year: year.current.value,
                        duration: duration.current.value,
                        imdbRating: imdb.current.value,
                        storyline: storyLine.current.value,
                    }),
                }
            );
            const data = await res.json();
            movieFn(data.insertedData);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="text-center">
                    <span style={{ marginRight: "25px" }}>
                        <label htmlFor="">Title</label>
                    </span>
                    <input ref={title} type="text" required />
                </div>
                <div className="text-center">
                    <span style={{ marginRight: "25px" }}>
                        <label htmlFor="">Year</label>
                    </span>
                    <input ref={year} type="text" required />
                </div>
                <div className="text-center" style={{ marginRight: "37px" }}>
                    <span style={{ paddingRight: "30px" }}>
                        <label htmlFor="">Duration</label>
                    </span>
                    <input ref={duration} type="text" required />
                </div>
                <div className="text-center" style={{ marginRight: "37px" }}>
                    <span style={{ paddingRight: "30px" }}>
                        <label htmlFor="">StoryLine</label>
                    </span>
                    <input ref={storyLine} type="text" required />
                </div>
                <div className="text-center" style={{ marginRight: "60px" }}>
                    <span style={{ paddingRight: "30px" }}>
                        <label htmlFor="">IMDB Rating</label>
                    </span>
                    <input ref={imdb} type="text" required />
                </div>
                <br />
                <div className="text-center">
                    <button className="btn btn-primary" type="submit">
                        Add Movie
                    </button>
                </div>
            </form>
        </div>
    );
}

function Forms() {
    return (
        <div>
            <div className="text-center mt-5">
                Search The details of Movie by Name
            </div>
            <FormForSearchByName />
            <br />
            <br />
            <div className="text-center mb-4">
                Below Is The Form to Add to the database
            </div>
            <FormForAddMovie />
        </div>
    );
}
function App() {
    const [movie, setMovie] = useState([]);
    useEffect(() => {
        async function getMovie() {
            try {
                const res = await fetch(
                    "https://fierce-shore-49516.herokuapp.com/getAllMovie"
                );
                const data = await res.json();
                setMovie(data);
            } catch (error) {
                console.log(error);
            }
        }
        getMovie();
    }, []);
    return (
        <div className="container">
            <ListMovie.Provider value={{ movie: movie, movieFn: setMovie }}>
                <Heading />
                <div className="row">
                    <div className="col-6">
                        <Forms />
                    </div>
                    <div className="col-6">
                        <SideResults />
                    </div>
                </div>
            </ListMovie.Provider>
        </div>
    );
}
ReactDOM.render(<App />, document.getElementById("root"));
