import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Product from "../components/Product"

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

function UserPage(){
    const [productList, setProductList] = useState([])
    const navigate = useNavigate()
    const [productFormData, setProductFormData] = useState({
        name: "",
        description: "",
        price: 0, 
    })
    const [addNewProduct, setAddNewProduct] = useState(false)
    const authToken = localStorage.getItem("authToken")  
    
    useEffect(() => {
        
        client.get('/api/products/', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).then(res => {
            setProductList(res.data)
        }).catch (error => {
                console.error("Error fetching products:", error)
        })
    }, [])

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };
    
    const csrftoken = getCookie("csrftoken")
    

    useEffect(() => {
        console.log(productList)
    }, [productList])


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
        client.post(
          "/api/logout/",
          {withCredentials: true}
        ).then(res => {
          navigate("/")
        });
      }


    async function handleDelete(productId) {
        try {
            const response = await axios.delete(`http://localhost:8000/api/products/delete/${productId}`,{
                email: userEmail
            })

            if (response.status === 200) {
                setProductList(prev => prev.filter(product => product.id !== productId))
                console.log("product deleted successfully.")
            }
        }

        catch (error){
            console.error("error deleting product: ", error)
        }
    }

    
    async function handleRegisterSubmit(e) {
        e.preventDefault()
        
        client.post("/api/products/", productFormData, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            withCredentials: true
        }).then(res => {
            setProductList(prev => [...prev, response.data])
            handleAddNew()
        }).catch (error => {
            console.error("could not register product:", error)
        })
        
    }



    const displayProductList = productList.map(product => (
        <Product 
            id={product.id}
            key={product.id}
            name={product.name}
            price={product.price}
            amount={product.amount}
            onDelete={handleDelete}
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