import React from "react";

function BookCard({ book }) {
  return (
    <div className="g-result">
      <a href={book.link} target="_blank" rel="noopener noreferrer" className="g-link">
        {book.link}
      </a>
      <h3 className="g-title">
        <a
          href={book.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {book.judul}
        </a>
      </h3>
      <p className="g-snippet">
        {book.deskripsi.slice(0, 180)}...
        <br />
        <span className="g-meta">✍️ {book.author} &nbsp; ⭐ {book.rating}</span>
      </p>
    </div>
  );
}

export default BookCard;
