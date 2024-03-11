import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Category3 = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [items, setItems] = useState(null);
    const [categories, setCategories] = useState(null);
    const [cname, setCname] = useState("");

    const [name, setName] = useState(null);
    const [price, setPrice] = useState(null);
    const [qty, setQty] = useState(0);
    const [categoryId, setCategoryId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getCategories();
        getItems();
    }, [])

    const getCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8081/categories", {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            setCategories(response.data);
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            }
        }
    }


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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    const handleCartClick = () => {
        // Navigate to the checkout page with selected items
        navigate('/checkout', { state: { selectedItems } });
    };


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
                                {categories && categories.map((category) => (
                                    <div className="mar">
                                        <div className="rounded-2 shadow p-5 mb-3 ml-5 bg-body-tertiary rounded" >
                                            <Link to={`/categories1/${category.id}`} className="nav-link">{category.cname}</Link>
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
    );
}

export default Category3;