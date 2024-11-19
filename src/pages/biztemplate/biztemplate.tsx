import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Business {
  _id: string;
  businessName: string;
  description: string;
  mainImage?: string;
}

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get 'id' from the URL params
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch data from the backend using the business ID from the URL params
    axios.get(`http://localhost:5001/api/businesses/${id}`)
      .then((response) => {
        setBusiness(response.data); // Store the fetched business data
      })
      .catch((error) => {
        setError('Error fetching business details');
        console.error(error);
      });
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!business) return <div>Loading...</div>; // Show loading message until data is fetched

  return (
    <div>
      <h1>{business.businessName}</h1>
      <p>{business.description}</p>
      {business.mainImage && <img src={`http://localhost:5001/${business.mainImage}`} alt={business.businessName} />}
    </div>
  );
};

export default BusinessDetail;
