import React, { useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import "./index.css";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
      );
      setBooks(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = books.slice(indexOfFirst, indexOfLast);
  const totalPages =
    books.length > 0 ? Math.ceil(books.length / booksPerPage) : 1;

  return (
    <div>
      <h1>📚 Book Search Engine</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Cari judul, deskripsi, atau penulis..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Cari</button>
      </form>

      {loading && <p className="loading">🔍 Sedang mencari...</p>}

      <div className="g-container">
        {currentBooks.map((book, i) => (
          <BookCard key={book.judul + i} book={book} />
        ))}
      </div>

      {books.length > 0 && (
        <div className="pagination with-label">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅️
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ➡️
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
