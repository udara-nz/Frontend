import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";


const SingleItemUser = () => {
  const [items, setItems] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const params = useParams();

  const [item, setItem] = useState(null);

  useEffect(() => {
    getItemByIds();
  }, [])

  const getItemByIds = () => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8081/item/${params.id}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setItem(data);
      })
      .catch((error) => {
        console.log(error);
      });
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



  return (
    <>
      <div>

        {showSuccessMessage && (
          <div className="alert alert-success" role="alert">
            Successfully Added to Cart!
          </div>
        )}

      </div>
      <nav class="navbar navbar-expand bg-body-secondary">
        <div class="container-fluid">
          <a
            className="btn btn-primary btn-sm me-2 rounded-3 shadow ml-5" href="/viewUser"
          >
            User Home
          </a>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <nav class="nav">

                <li class="nav-item ">
                  <Link to={`/category1`} className="nav-link">Category</Link>
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
      {item &&
        <div className={`rounded-2 shadow p-5 mb-3 ml-5 bg-body-tertiary rounded ${item.qty > 0 ? 'text-success' : 'text-danger'
          }`}>
          <h1>{item.name}</h1>
          <div>{item.price} LKR</div>
          <div>Stock: {item.qty}</div>

          <p>{item.qty > 0 ? "In Stock" : "Out of Stock"}</p>

        </div>

      }
      <div>
        <button
          type="button"
          className="btn btn-primary btn-sm me-2"
          onClick={() => handleAddToCart(item)}
        >
          Add to Cart
        </button>

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



    </>
  )
}

export default SingleItemUser;