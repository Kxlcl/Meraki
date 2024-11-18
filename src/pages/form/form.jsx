import React, { useState } from 'react';
import axios from 'axios';

function BusinessForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    mainImage: null, // Store the uploaded file here
    description: '',
  });

  // Handle text input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value, // Update the corresponding field dynamically
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { id, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [id]: files[0], // Save the first file selected
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('businessName', formData.businessName);
      data.append('description', formData.description);
      if (formData.mainImage) {
        data.append('mainImage', formData.mainImage); // Attach file
      }

      const response = await axios.post('http://localhost:5001/api/businesses', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Form submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="businessName">Name of Business:</label>
        <input
          id="businessName"
          type="text"
          value={formData.businessName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="mainImage">Main Image:</label>
        <input id="mainImage" type="file" onChange={handleFileChange} />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default BusinessForm;
