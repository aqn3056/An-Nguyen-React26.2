function SortControls({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <>
      <div className="field-group">
        <label htmlFor="sortBy">Sort by</label>
        <select
          id="sortBy"
          className="field-select"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
        >
          <option value="creationDate">Created</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className="field-group">
        <label htmlFor="sortDirection">Order</label>
        <select
          id="sortDirection"
          className="field-select"
          value={sortDirection}
          onChange={(event) => onSortDirectionChange(event.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </>
  );
}

export default SortControls;
