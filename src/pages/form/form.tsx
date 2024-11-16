import React, { useState } from 'react';

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
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
