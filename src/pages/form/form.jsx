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
    event.preventDefault(); // Prevent the default form submit behavior
    
    // Create FormData to send as multipart/form-data
    const formData = new FormData();
    formData.append('businessName', businessName);
    formData.append('description', description);
    formData.append('mainImage', file); // Attach the image file to the form data
    
    try {
      // Make the POST request using Axios to your backend
      const response = await axios.post('http://localhost:5001/api/businesses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Make sure the server expects this
        },
      });

      // If successful, handle the response
      setMessage('Form submitted successfully');
      setError(null); // Clear any previous errors
      console.log(response.data);
    } catch (err) {
      // Handle errors
      setMessage('');
      setError('Error submitting the form. Please try again.');
      console.error(err.response ? err.response.data : err.message);
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
