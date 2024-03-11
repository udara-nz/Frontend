import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Item = () => {
  const [items, setItems] = useState(null);
  const [categories, setCategories] = useState(null);

  const [categoryId, setCategoryId] = useState("");

  // Add the loading state and setter
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemCategory, setSelectedItemCategory] = useState(null);


  const [updateItemId, setUpdateItemId] = useState(null);
  const [updateItemName, setUpdateItemName] = useState("");
  const [updateItemPrice, setUpdateItemPrice] = useState("");
  const [updateItemQty, setUpdateItemQty] = useState("");
  const [updateItemCategoryId, setUpdateItemCategoryId] = useState("");
  const [updateItemCategoryName, setUpdateItemCategoryName] = useState("");

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);


  useEffect(() => {
    getItems();
    getCategories();
  }, []);



  const navigate = useNavigate();



  const getItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8081/items");
      setItems(response.data);
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
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



  const handleUpdate = async (itemId, itemName, itemPrice, itemQty, itemCategoryId) => {
    setUpdateItemId(itemId);
    setUpdateItemName(itemName);
    setUpdateItemPrice(itemPrice);
    setUpdateItemQty(itemQty);

    // Retrieve and set the current category information
    try {
      const response = await axios.get(`http://localhost:8081/categories/by-item/${itemId}`);
      const currentCategory = response.data;
      setUpdateItemCategoryId(currentCategory.id);
      setUpdateItemCategoryName(currentCategory.cname);
    } catch (error) {
      console.error("Error getting category by item:", error);
      // Handle the error appropriately (e.g., show a default category or a placeholder)
      setUpdateItemCategoryId("");
      setUpdateItemCategoryName("Unknown Category");
    }

    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      setIsLoading(true);

      // Include only the allowed fields in the data object
      const data = {
        name: updateItemName,
        price: updateItemPrice,
        qty: parseInt(updateItemQty, 10),
      };

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:8081/items/${updateItemId}`,
        data,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Updated item data:", response.data);

      if (response.status === 200) {
        setShowUpdateModal(false);
        setUpdateItemName("");
        setUpdateItemPrice("");
        setUpdateItemQty("");

        // Wait for the state to update before calling getItems
        await new Promise((resolve) => setTimeout(resolve, 0));
        await getItems();
        setShowUpdateMessage(true);

        // Automatically hide the update success message after 3 seconds
        setTimeout(() => {
          setShowUpdateMessage(false);
        }, 3000);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8081/items/${itemId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      getItems();
      setShowDeleteMessage(true);

      // Automatically hide the delete success message after 3 seconds
      setTimeout(() => {
        setShowDeleteMessage(false);
      }, 3000);
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
                  <Link to={`/manageCategory`} className="nav-link">Manage Category</Link>
                </li>
                <li class="nav-item ">
                  <Link to={`/category2`} className="nav-link">Category</Link>
                </li>



              </nav>
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
        <div className="row">
          {/* Left Side - Display Items */}
          <div className="col-md-6">
            <h1><center>Manage Item</center></h1>
          </div>
        </div>

        {/* Display Items */}
        <div class="bg-body-tertiary">
          <div className="row">
            {/* Left Side - Display Items */}
            <div className="d-flex flex-wrap">
              {items &&
                items.map((item) => (
                  <div className="mar">
                    <div className="rounded-2 shadow p-5 mb-3 ml-5 bg-body-tertiary rounded" key={item.id}>
                      <div>
                        Item Id : {item.id}
                      </div>
                      <Link to={`/items/${item.id}`}>
                        {item.name} Rs. {item.price}
                      </Link>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary btn-sm me-2"
                        onClick={() =>
                          handleUpdate(
                            item.id,
                            item.name,
                            item.price,
                            item.qty,
                            item.categoryId  // Ensure this is the correct argument
                          )
                        }
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        class="btn btn-dark btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>

                      <p>{item.qty > 0 ? "In Stock" : "Out of Stock"}</p>

                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="col-md-6">

            {/* Update Modal */}

            {showUpdateModal && (
              <div class="col-md-6">
                <h2>Update Item</h2>
                <form onSubmit={handleUpdateSubmit}>
                  <div>
                    <label>Item Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      onChange={(e) => setUpdateItemName(e.target.value)}
                      value={updateItemName}
                    />
                  </div>
                  <div>
                    <label>Item Price</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      onChange={(e) => setUpdateItemPrice(e.target.value)}
                      value={updateItemPrice}
                    />
                  </div>
                  <div>
                    <label>Item Quantity</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      onChange={(e) => setUpdateItemQty(e.target.value)}
                      value={updateItemQty}
                    />
                  </div>

                  <button className="btn btn-primary" type="submit">
                    Update
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <div class="p-3 mb-2 bg-warning text-dark">

      </div>
    </>
  );
};

export default Item;