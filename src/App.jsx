import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";
import Filters from "./components/Filters";
import Banner from "./components/Banner";

const API_KEY = "3cd475fb";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("Avengers");
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
  });

  const fetchMovies = async (query, filters = {}) => {
    let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`;
    if (filters.year) url += `&y=${filters.year}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.Search) {
      setMovies(data.Search);
    } else {
      setMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies("Avengers");
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchMovies(searchTerm, newFilters);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-neutral-900 relative overflow-hidden">
        {/* Toast Notifications */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: "linear-gradient(90deg, #1a1a1a, #2d0f0f)",
              color: "#fff",
              border: "1px solid #ff3b00",
              boxShadow: "0 0 15px rgba(255, 60, 0, 0.4)",
            },
            success: {
              icon: "🩸",
              style: {
                border: "1px solid #ff4d00",
                boxShadow: "0 0 20px rgba(255, 80, 0, 0.5)",
              },
            },
            error: {
              icon: "💀",
              style: {
                border: "1px solid #a10000",
                boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
              },
            },
          }}
        />

        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <div className="relative z-10 flex-1">
                <div className="relative">
                  <Banner />
                  <div className="absolute top-50 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-lg">
                    <SearchBar
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      onSearch={() => fetchMovies(searchTerm, filters)}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Filters filters={filters} onFilterChange={handleFilterChange} />
                  <MovieList movies={movies} />
                </div>
              </div>
            }
          />

          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
