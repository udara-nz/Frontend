
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const View = () => {

    const [items, setItems] = useState(null);
    const [categories, setCategories] = useState(null);


    const [name, setName] = useState(null);
    const [price, setPrice] = useState(null);
    const [qty, setQty] = useState(0);
    const [categoryId, setCategoryId] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user information from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
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
                navigate("/login");
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

            </div>
            <nav class="navbar navbar-expand bg-body-tertiary">
                <div class="container-fluid">
                    <a class="btn btn-primary btn me-2  " href="/view">Home Page</a>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <a class="btn btn-primary btn me-2  " href="/register">Register</a>
                            <a class="btn btn-primary btn me-2  " href="/login">Login</a>
                            <li class="nav-item ">
                                <Link to={`/category3`} className="nav-link">Category</Link>
                            </li>
                            {categories && categories.map((category) => (
                                <li class="nav-item"><i class="fa-solid fa-gauge"></i>
                                    <Link to={`/categories1/${category.id}`} className="nav-link">{category.cname}</Link>
                                </li>
                            ))}
                            <li class="nav-item">
                                <a class="btn btn-primary btn me-2  " href="/login">Cart</a>

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
                                            <a href="/view"><i class="fa-solid fa-gauge"></i>dashboard</a>
                                        </li>
                                        <li>
                                            <a href="/login"><i class="fa-solid fa-users"></i>Customer Login</a>
                                        </li>
                                        <li>
                                            <a href="/Category3"><i class="fa-solid fa-cart-shopping"></i>Categories</a>
                                        </li>
                                        <li>
                                            <a href="/adminlogin"><i class="fa-solid fa-gear"></i>Administration Login</a>
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
                            <div className="d-flex flex-wrap">

                            </div>
                            <div className="d-flex flex-wrap">
                                {items &&
                                    items.map((item) => (
                                        <div className="mar" key={item.id}>
                                            <div className={`rounded-2 shadow p-5 mb-3 ml-5 bg-body-tertiary rounded ${item.qty > 0 ? 'text-success' : 'text-danger'
                                                }`}>
                                                <Link to={`/item2/${item.id}`} >
                                                    {item.name} Rs. {item.price}
                                                </Link>

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

export default View;