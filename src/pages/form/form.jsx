import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Set the file selected by the user
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    const formData = new FormData();
    formData.append('businessName', businessName);
    formData.append('description', description);
    formData.append('mainImage', file);
  
    try {
      const response = await axios.post('https://your-live-url.com/api/businesses', formData);
      setMessage('Form submitted successfully');
      setError(null);
      console.log(response.data);
    } catch (err) {
      setMessage('');
      setError('Error submitting the form. Please try again.');
      console.error(err.message); // Log full error message for more insight
    }
  };

  return (
    <div>
      <h2>Business Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Main Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Form;
