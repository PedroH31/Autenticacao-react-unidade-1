import React, { useState } from 'react'
import client from '../client'

export default function Product(props) {
    const { id, name, price, description, onDelete, refresh } = props
    const [newProductData, setNewProductData] = useState({
        name: name,
        price: price,
        description: description,
        userId: id
    })
    const [isEditing, setIsEditing] = useState(false)

    function toggleEditing() {
        setIsEditing(prev => !prev)
    }
    
    function handleChange(e) {
        const {name, value} = e.target
        setNewProductData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function submitUpdate(e) {
        e.preventDefault()
        client.put(`/api/products/${id}/`, newProductData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                refresh()
                setIsEditing(false);
            })
            .catch(error => console.error("Could not update product:", error))

    }

    return (
        <>  
            {isEditing && (
                <form className="product-container" onSubmit={submitUpdate}>

                    <div className="input-container">
                        <label htmlFor="name">Product:</label>
                            <input 
                                className="form-input"
                                name="name"
                                type="text"
                                onChange={handleChange}
                                value={newProductData.name}
                            />
                    </div>

                    <div className="input-container">
                        <label htmlFor="price">Price:</label>
                            <input 
                                className="form-input"
                                name="price"    
                                type="number"
                                onChange={handleChange}
                                value={newProductData.price}
                            /> 
                    </div>

                    <div className="input-container">
                        <label htmlFor="description">Description:</label>
                            <input 
                                className="form-input"
                                name="description"
                                type="text"
                                onChange={handleChange}
                                value={newProductData.description}
                            /> 
                                    
                    </div>
                    <button 
                        className="form-button close-form product-button"
                        onClick={toggleEditing}
                    >X</button>
                    <button type="submit" className="form-button product-button">O</button>

                </form>
            )}

            {!isEditing && (
                <ul className="product-container">
                <li className="product">name: {name}</li>
                <li className="product">price: {price}</li>
                <li className="product">description: {description}</li>
                <button 
                    className="form-button icon"
                    onClick={() => onDelete(id)}
                ><i className="fa-solid fa-trash-can"></i></button>
                <button 
                    className="form-button icon"
                    onClick={toggleEditing}
                ><i className="fas fa-edit"></i></button>
                </ul>
            )}
        </>

    )
}