import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ManageCategory = () => {
    const [items, setItems] = useState(null);
    const [categories, setCategories] = useState(null);
    const [cname, setCname] = useState("");
    const [name, setName] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showUpdateMessage, setShowUpdateMessage] = useState(false);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);

    useEffect(() => {
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
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8081/categories", {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            setCategories(response.data);
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            }
        }
    };

    const handleCname = (event) => {
        setCname(event.target.value);
    }

    const handleUpdateCategory = async (categoryId, updatedName) => {
        const token = localStorage.getItem("token");
        const data = {
            cname: updatedName,
        };

        try {
            const response = await axios.put(
                `http://localhost:8081/categories/${categoryId}`,
                data,
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }
            );

            const updatedCategories = categories.map((category) =>
                category.id === categoryId ? response.data : category
            );

            setCategories(updatedCategories);
            // Show update success message
            setShowUpdateMessage(true);

            // Automatically hide the update success message after 3 seconds
            setTimeout(() => {
                setShowUpdateMessage(false);
            }, 3000);

            // Refresh the list of items after updating the category
            getItems();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(`http://localhost:8081/categories/${categoryId}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            const updatedCategories = categories.filter(
                (category) => category.id !== categoryId
            );

            setCategories(updatedCategories);
            setShowDeleteMessage(true);

            // Automatically hide the delete success message after 3 seconds
            setTimeout(() => {
                setShowDeleteMessage(false);
            }, 3000);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSubmit1 = (event) => {
        const categoryExists = categories.some(category => category.cname === cname);

        if (categoryExists) {
            // Display an alert or take appropriate action to notify the user
            alert("Category with the same name already exists.");
            return;
        }

        event.preventDefault();
        setShowSuccessMessage(true);

        // Automatically hide the success message after 3 seconds
        setTimeout(() => {
            setShowSuccessMessage(false);

        }, 1000);

        const data = {
            "cname": cname,
        }

        const token = localStorage.getItem("token"); // Assuming you store the token in localStorage

        fetch("http://localhost:8081/categories", {
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
                setCategories([...categories, data]);
                setName('');
                console.log(categories);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const handleCartClick = () => {
        // Navigate to the checkout page with selected items
        navigate('/checkout1', { state: { selectedItems } });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/adminlogin");
    }

    return (
        <>
            <div>
                {showSuccessMessage && (
                    <div className="alert alert-success" role="alert">
                        Successfully Added!
                    </div>
                )}

                {showUpdateMessage && (
                    <div className="alert alert-success" role="alert">
                        Successfully Updated!
                    </div>
                )}

                {showDeleteMessage && (
                    <div className="alert alert-success" role="alert">
                        Successfully Deleted!
                    </div>
                )}
            </div>
            <nav class="navbar navbar-expand bg-body-secondary">
                <div class="container-fluid">
                    <a
                        className="btn btn-primary btn-sm me-2 rounded-3 shadow ml-5" href="/home"
                    >
                        Admin Home
                    </a>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <nav class="nav">

                                <li class="nav-item ">

                                    <a class="nav-link" href="/orders">Manage Orders</a>
                                </li>
                                <li class="nav-item ">
                                    <Link to={`/manageItem`} className="nav-link">Manage Item</Link>
                                </li>
                                <li class="nav-item ">
                                    <Link to={`/category2`} className="nav-link">Category</Link>
                                </li>



                            </nav>
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
                <h3><center>Manage Category</center></h3>
            </div>
            <div class="bg-body-tertiary">
                <div className="submit">
                    <h3>Add New Category</h3>

                    <form onSubmit={handleSubmit1}>
                        <div>
                            <label>Category Name</label>
                            <input
                                type="text"
                                required
                                className="form-control"
                                onChange={handleCname}
                                placeholder="Insert Category Name"
                                value={cname}
                            />
                        </div>
                        <button className="btn btn-primary" type="submit">
                            Save Category
                        </button>
                    </form>
                </div>
            </div>


            {/* Display Categories */}
            <div class="bg-body-tertiary">
                <div className="categoryA">
                    <h2>Update Category</h2>
                    <ul>
                        {categories &&
                            categories.map((category) => (
                                <li key={category.id}>
                                    <span>{category.cname}</span>
                                    <div class="align-self-center mx-auto">
                                        <button className="btn btn-primary btn me-2"
                                            onClick={() => {
                                                const updatedName = prompt("Enter the updated category name:");
                                                if (updatedName !== null) {
                                                    handleUpdateCategory(category.id, updatedName);
                                                }
                                            }}
                                        >
                                            Update
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => handleDeleteCategory(category.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
            <div class="p-3 mb-2 bg-warning text-dark">

            </div>
        </>
    );
};

export default ManageCategory;