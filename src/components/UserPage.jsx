import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../client'
import Product from "../components/Product"


function UserPage(){
    const [productList, setProductList] = useState([])
    const navigate = useNavigate()
    const [productFormData, setProductFormData] = useState({
        name: "",
        description: "",
        price: 0, 
    })
    const [addNewProduct, setAddNewProduct] = useState(false) 
    const userId = localStorage.getItem("userId")
    const [refresh, setRefresh] = useState(0)

    function handleRefresh() {
        setRefresh(prev => prev + 1)
    }

    useEffect(() => {
        
        if (userId) {
            client.get('/api/products/', {
                params: { user_id: userId }
            })
            .then(res => {
                setProductList(res.data);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            })
            
        } else {
            console.error("User ID is missing");
        }
        
    }, [refresh]);


    function handleAddNew() {
        setAddNewProduct(prev => !prev)
    }
    
    
    function handleChange(e) {
        const {name, value} = e.target
        
        setProductFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleLogout(e) {
        e.preventDefault();
        client.post("/api/logout/")
            .then(() => localStorage.removeItem("userId"))
            .then(() => navigate("/"))
            .catch(error => console.error("logout error:", error))
    }


      function handleDelete(productId) {
        client.delete(`/api/products/${productId}/`)
            .then(() => setProductList(prev => prev.filter(product => product.id !== productId)))
            .catch(error => console.error("Error deleting product:", error));
    }

    
    function handleRegisterSubmit(e) {
        e.preventDefault()

        const userId = localStorage.getItem("userId")

        if (!userId) {
            console.error("User ID is missing")
            return
        }

        client.post("/api/products/", {
            ...productFormData,
            userId: userId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                handleRefresh()
                handleAddNew();
            })
            .catch(error => console.error("Could not register product:", error));
    }

    const displayProductList = productList.map(product => (
        <Product 
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            onDelete={handleDelete}
            refresh={handleRefresh}
        />
    ))
    
    return (
        <>
            <button 
                className="form-button"
                onClick={handleLogout}
            >logout</button>

            <h1 className="page-title">USER PAGE</h1>

            {addNewProduct && (
                <section>
                    <form className="login-form" onSubmit={handleRegisterSubmit}>

                        <button 
                            className="form-button close-form"
                            onClick={handleAddNew}
                        >X</button>

                        <label htmlFor="name">Product:</label>
                            <input 
                                name="name"
                                type="text"
                                onChange={handleChange}
                                value={productFormData.name}
                            />

                        <label htmlFor="price">Price:</label>
                            <input 
                                name="price"
                                type="number"
                                onChange={handleChange}
                                value={productFormData.price}
                            /> 

                        <label htmlFor="description">Description:</label>
                            <input 
                                name="description"
                                type="text"
                                onChange={handleChange}
                                value={productFormData.description}
                            /> 

                        <button type="submit" className="form-button">Register</button>

                    </form>
                </section>
            )}

            <section className="product-list-container">    
                {!addNewProduct && (
                    displayProductList
                )}
            </section>

            {!addNewProduct && (<section className="product-list-section"> 
                <button 
                    className="form-button"
                    onClick={handleAddNew}
                >Add New</button>
            </section>)}
        </>
    )
}

export default UserPage