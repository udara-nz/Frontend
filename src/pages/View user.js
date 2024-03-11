import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Checkout from './Checkout';
import { Alert } from "bootstrap";

const ViewUser = () => {

    const [items, setItems] = useState(null);
    const [categories, setCategories] = useState(null);


    const [name, setName] = useState(null);
    const [price, setPrice] = useState(null);
    const [qty, setQty] = useState(0);
    const [categoryId, setCategoryId] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        // Retrieve user information from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const storedCartItems = localStorage.getItem("cartItems");
        if (storedCartItems) {
            setSelectedItems(JSON.parse(storedCartItems));
        }

        getItems();
        getCategories();
    }, []);


    const navigate = useNavigate();



    const getItems = async () => {
        try {
            const response = await axios.get("http://localhost:8081/items");
            setItems(response.data);
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/main");
            }
        }
    };

    const getCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8081/categories");
            setCategories(response.data);
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            }
        }

    }

    const handleName = (event) => {
        setName(event.target.value);
    }

    const handlePrice = (event) => {
        setPrice(event.target.value);
    }

    const handleQty = (event) => {
        setQty(event.target.value);
    }

    const handleCategory = (event) => {
        setCategoryId(event.target.value);
    }

    const handleAddToCart = (item) => {
        // Check if the item's quantity is greater than 0 before adding to the cart
        if (item.qty > 0) {
            setSelectedItems([...selectedItems, item]);
            setShowSuccessMessage(true);

            // Automatically hide the success message after 3 seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 1000);
        } else {
            // Show an alert or message indicating that the item is out of stock
            alert("This item is out of stock");
        }
    };

    const handleCartClick = () => {
        // Navigate to the checkout page with selected items
        navigate('/checkout', { state: { selectedItems } });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            "name": name,
            "price": price,
            "qty": qty,
            "categoryId": categoryId
        }

        const token = localStorage.getItem("token"); // Assuming you store the token in localStorage

        fetch("http://localhost:8081/items", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '' // Include the token if available
            },
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setItems([...items, data]);
                setName('');
                setPrice('');
                setQty(0);
                setCategoryId('');
                console.log(items);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <>
            <div>

                {showSuccessMessage && (
                    <div className="alert alert-success" role="alert">
                        Successfully Added to Cart!
                    </div>
                )}

            </div>


            <nav class="navbar navbar-expand bg-body-tertiary">
                <div class="container-fluid">
                    <a class="btn btn-primary btn me-2  " href="/view">Home Page</a>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <a class="btn btn-primary btn me-2  " href="/register">Register</a>
                            <nav class="nav">
                                <Link to={`/viewUser`} className="nav-link">User Home</Link>
                                <li class="nav-item ">
                                    <Link to={`/category1`} className="nav-link">Category</Link>
                                </li>
                            </nav>

                            <li class="nav-item">
                                <a
                                    className="btn btn-primary btn me-2"
                                    href="/checkout"
                                    onClick={handleCartClick}
                                >
                                    Cart
                                </a>
                                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
                            </li>


                        </ul>


                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="row">


                    <div className="col-md-3">
                        <div className="col-md-3">
                            {/* ... (dashboard sidebar) */}
                            {user && (
                                <div className="mb-3">
                                    <h6>Welcome, {user.username}!</h6>
                                    {/* Display other user information as needed */}
                                </div>
                            )}
                        </div>
                        <div class="dashboard-wrap rounded-3 shadow p-4 mb-0 bg-body-tertiary rounded">
                            <div class="row">
                                <div class="side-bar">
                                    <ul class="side-bar-menu">
                                        <li>
                                            <a href="/viewUser"><i class="fa-solid fa-gauge"></i>dashboard</a>
                                        </li>

                                        <li>
                                            <a href="/Category1"><i class="fa-solid fa-cart-shopping"></i>Categories</a>
                                        </li>
                                        <li>
                                            <a href="/checkout" onClick={handleCartClick}><i class="fa-solid fa-gear"></i>Cart</a>
                                        </li>
                                        <li>
                                            <a href="/register"><i class="fa-solid fa-gear"></i>User Registration</a>
                                        </li>
                                    </ul>

                                </div>


                            </div>
                        </div>
                    </div>
                    {/* Display Items */}
                    <div className="col-md-6">
                        <div className="mc">
                            <div class="bg-body-tertiary">
                                <div className="upage">
                                    <h1>User Home Page</h1>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap">
                                {items &&
                                    items.map((item) => (
                                        <div className="mar" key={item.id}>
                                            <div className={`rounded-2 shadow p-5 mb-3 ml-5 bg-body-tertiary rounded ${item.qty > 0 ? 'text-success' : 'text-danger'
                                                }`}>
                                                <Link to={`/item/${item.id}`} >
                                                    {item.name} Rs. {item.price}
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm me-2"
                                                    onClick={() => handleAddToCart(item)}
                                                >
                                                    Add to Cart
                                                </button>
                                                <p>{item.qty > 0 ? "In Stock" : "Out of Stock"}</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>

            </div>
            <div class="p-3 mb-2 bg-warning text-dark">

            </div>
        </>
    )
}
export default ViewUser;