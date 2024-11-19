import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    axios
      .get('/api/businesses')
      .then((response) => {
        setBusinesses(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the businesses!', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Business List</h1>
      <ul>
        {businesses.map((business) => (
          <li key={business._id}>{business.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
