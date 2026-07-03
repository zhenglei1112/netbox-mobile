export function SearchBar({ placeholder }) {
  return (
    <label className="search-bar">
      <span>搜索</span>
      <input type="search" placeholder={placeholder} />
    </label>
  );
}
