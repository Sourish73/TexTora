import { FaSearch } from "react-icons/fa";

function Search({ searchKey, setSearchKey }) {
  return (
    <div className="user-search-area">
      <input
        type="text"
        className="user-search-text"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        placeholder="Search user"
      />
      <button className="user-search-btn">
        <FaSearch />
      </button>
    </div>
  );
}

export default Search;
