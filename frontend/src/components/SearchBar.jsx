import React from "react";
import "./SearchBar.css";

function SearchBar({ search, setSearch }) {

  return (

    <form
      className="search-box"
      onSubmit={(e) => e.preventDefault()}
    >

      <input
        type="text"
        placeholder="Search for groceries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button type="submit">
        🔍
      </button>

    </form>

  );

}

export default SearchBar;