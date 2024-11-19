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
  const { id } = useParams<{ id: string }>(); // Ensure 'id' is passed correctly
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Use axios to fetch the business details using the ID
    axios.get(`http://localhost:5001/api/businesses/${id}`)
      .then((response) => {
        setBusiness(response.data);
      })
      .catch((error) => {
        setError('Error fetching business details');
        console.error(error);
      });
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!business) return <div>Loading...</div>;

  return (
    <div>
      <h1>{business.businessName}</h1>
      <p>{business.description}</p>
      {business.mainImage && <img src={`http://localhost:5001/${business.mainImage}`} alt={business.businessName} />}
    </div>
  );
};

export default BusinessDetail;
