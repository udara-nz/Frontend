import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Product = () => {

    const [items, setItems] = useState(null);
    const [categories, setCategories] = useState(null);
    const [cname, setCname] = useState("");

    const [name, setName] = useState(null);
    const [price, setPrice] = useState(null);
    const [qty, setQty] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [showUpdateMessage, setShowUpdateMessage] = useState(false);

    useEffect(() => {
        getItems();
        getCategories();
    }, [])

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

    }

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        await getItems();

        // Check if an item with the same name and category already exists
        const isDuplicate = items.some(item => item.name === name);

        if (isDuplicate) {
            alert('Item with the same name and category already exists. Please choose a different name or category.');
            return;
        }

        const data = {
            "name": name,
            "price": price,
            "qty": qty,
            "categoryId": categoryId
        }

        const token = localStorage.getItem("token");

        try {
            const response = await axios.post("http://localhost:8081/items", data, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            setShowUpdateMessage(true);

            // Automatically hide the update success message after 3 seconds
            setTimeout(() => {
                setShowUpdateMessage(false);
            }, 3000);
            // Now, update the items state with the new item
            setItems([...items, response.data]);

            setName("");
            setPrice("");
            setQty(0);
            setCategoryId(null);
            console.log(items);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/adminlogin");
    };

    const handleCartClick = () => {
        // Navigate to the checkout page with selected items
        navigate('/checkout1', { state: { selectedItems } });
    };



    return (
        <>
            <div>
                {showUpdateMessage && (
                    <div className="alert alert-success" role="alert">
                        Successfully Added!
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
                                    <Link to={`/manageItem`} className="nav-link">Manage Item</Link>
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
                                    href="/items"

                                >
                                    Add Items
                                </a>
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
                <h3><center>Add Item</center></h3>
            </div>
            <form class="bg-body-tertiary" onSubmit={handleSubmit}>
                <div>
                    <label>Product Name</label>
                    <input type="text" required className="form-control" onChange={handleName} placeholder="Item Name" value={name} />
                </div>
                <div>
                    <label>Product Price</label>
                    <input type="text" required className="form-control" onChange={handlePrice} placeholder="Item Price" value={price} />
                </div>
                <div>
                    <label>Product Qty</label>
                    <input type="text" required className="form-control" onChange={handleQty} placeholder="Item Quantity" value={qty} />
                </div>
                <div>
                    <label>Category</label>
                    <select required className="form-control" onChange={handleCategory}>
                        <option>Please Select</option>

                        {categories && categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.cname}</option>
                        ))}

                    </select>
                </div>

                <button className="btn btn-primary" type="submit">Save Product</button>
            </form>
        </>

    )
}

export default Product;