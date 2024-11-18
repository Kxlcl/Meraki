import React, { useState } from 'react';
import axios from 'axios';

function BusinessForm() {
    const [formData, setFormData] = useState({
        businessName: '',
        mainImage: null as File | null,
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target;
        if (files) {
            setFormData((prevData) => ({
                ...prevData,
                [id]: files[0], // Handle only the first file
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formDataObj = new FormData();
        formDataObj.append('businessName', formData.businessName);
        if (formData.mainImage) formDataObj.append('mainImage', formData.mainImage);
        formDataObj.append('description', formData.description);

        try {
            const response = await axios.post('http://localhost:5000/api/businesses', formDataObj, {
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
                ></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default BusinessForm;
