import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Categories = () => {
    const [items, setItems] = useState(null);
    const [categories, setCategories] = useState(null);
    const [cname, setCname] = useState("");
    const [name, setName] = useState(null);

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

    const handleAddCategory = async () => {
        const data = {
            name: cname, // Assuming you have categoryName state
        };

        try {
            const response = await axios.post("http://localhost:8081/categories", data);
            setCategories([...categories, response.data]);
            setCname(""); // Clear the input after adding
            console.log(categories);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleName = (event) => {
        setName(event.target.value);
    }

    const handleCname = (event) => {
        setCname(event.target.value);
    };

    const handleSubmit1 = (event) => {
        event.preventDefault();

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

    return (
        <>
            <form onSubmit={handleSubmit1}>
                <div>
                    <label>Category Name</label>
                    <input type="text" required className="form-control" onChange={handleCname} value={cname} />
                </div>
                <button className="btn btn-primary" type="submit">Save Product</button>
            </form>
        </>
    );
};

export default Categories;