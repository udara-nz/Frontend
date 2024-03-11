import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Category2 = () => {
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
        navigate("/adminlogin");
    }

    const handleCartClick = () => {
        // Navigate to the checkout page with selected items
        navigate('/checkout1', { state: { selectedItems } });
    };


    return (
        <><nav class="navbar navbar-expand bg-body-tertiary">
            <div class="container-fluid">
                <a
                    className="btn btn-primary btn-sm me-2 rounded-3 shadow ml-5" href="/home"
                >
                    Admin Home
                </a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <nav class="nav">
                            <a class="nav-link" href="/orders">Manage Orders</a>

                            <li class="nav-item ">
                                <Link to={`/manageItem`} className="nav-link">Manage Items</Link>
                            </li>
                            <li class="nav-item ">
                                <Link to={`/manageCategory`} className="nav-link">Manage Category</Link>
                            </li>
                            <li class="nav-item ">
                                <Link to={`/category2`} className="nav-link">Category</Link>
                            </li>
                        </nav>

                        {categories && categories.map((category) => (
                            <li class="nav-item"><i class="fa-solid fa-gauge"></i>
                                <Link to={`/categories/${category.id}`} className="nav-link">{category.cname}</Link>
                            </li>
                        ))}


                        <li class="nav-item">
                            <a
                                className="btn btn-primary btn me-2"
                                href="/checkout1"
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
            <div class="bg-body-tertiary">
                <div className="cat">
                    <h3>Select Categoty</h3>
                </div>
            </div>
            <div className="col-md-6">
                <div className="mc">
                    <div className="d-flex flex-wrap">
                        {categories && categories.map((category) => (
                            <div className="mar">
                                <div className="rounded-2 shadow p-5 mb-3 ml-5 bg-body-tertiary rounded" >
                                    <Link to={`/categories/${category.id}`} className="nav-link">{category.cname}</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div class="p-3 mb-2 bg-warning text-dark">

            </div>
        </>
    );
}

export default Category2;