import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Stores all foods returned from the API
  const [foods, setFoods] = useState([]);

  // Stores what the user types in the search bar
  const [searchInput, setSearchInput] = useState("");

  // Stores the selected data type filter
  const [dataTypeFilter, setDataTypeFilter] = useState("All");

  // Get API key from the .env file
  const apiKey = import.meta.env.VITE_USDA_API_KEY;

  // Fetch data when the page loads
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=food&pageSize=50&api_key=${apiKey}`
        );

        const data = await response.json();
        setFoods(data.foods);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  // Search + Filter
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.description
      .toLowerCase()
      .includes(searchInput.toLowerCase());

    const matchesType =
      dataTypeFilter === "All" || food.dataType === dataTypeFilter;

    return matchesSearch && matchesType;
  });

  // Dashboard Statistics

  // Total branded foods
  const brandedFoods = foods.filter(
    (food) => food.dataType === "Branded"
  ).length;

  // Average search score
  const averageScore =
    foods.length > 0
      ? (
          foods.reduce((sum, food) => sum + food.score, 0) /
          foods.length
        ).toFixed(2)
      : 0;

  return (
    <div className="app">

      {/* Hero Section */}
      <div className="hero">
        <h1>  Nutrition Explorer</h1>
        <p>
          Explore foods from the USDA FoodData Central database. Search for foods,
          compare different food types, and discover interesting nutrition data.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="stats">

        <div className="stat-card">
          <h3> Total Foods</h3>
          <p>{foods.length}</p>
        </div>

        <div className="stat-card">
          <h3>  Branded Foods</h3>
          <p>{brandedFoods}</p>
        </div>

        <div className="stat-card">
          <h3> Average Search Score</h3>
          <p>{averageScore}</p>
        </div>

      </div>

{/* Search + Filter Controls */}
<div className="controls">
  <input
    type="text"
    placeholder="🔍 Search by food name..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
  />

  <div className="filter-group">
    <label htmlFor="foodType">Filter by Food Type</label>

    <select
      id="foodType"
      value={dataTypeFilter}
      onChange={(e) => setDataTypeFilter(e.target.value)}
    >
      <option value="All">All</option>
      <option value="Branded">Branded</option>
      <option value="Survey (FNDDS)">Survey</option>
      <option value="Foundation">Foundation</option>
    </select>
  </div>
</div>
   

      {/* Food Cards */}
      <div className="food-list">
        {filteredFoods.map((food) => (
          <div className="food-row" key={food.fdcId}>
            <h3>{food.description}</h3>

            <p>
              <strong>Type:</strong> {food.dataType}
            </p>

            <p>
              <strong>Brand:</strong> {food.brandOwner || "N/A"}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;