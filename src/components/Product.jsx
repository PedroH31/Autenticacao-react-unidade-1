import React from 'react'

export default function Product(props) {
    const { id, name, price, amount, onDelete } = props

    return (
        <ul className="product-container">
            <li className="product">name: {name}</li>
            <li className="product">price: {price}</li>
            <li className="product">amount: {amount}</li>
            <button 
                className="form-button icon"
                onClick={() => onDelete(id)}
            ><i className="fa-solid fa-trash-can"></i></button>
            <button 
                className="form-button icon"

            ><i className="fas fa-edit"></i></button>
        </ul>
    )
}