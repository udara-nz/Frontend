import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";

const OrderDetails = ({ orderItems, total, tax }) => {
  return (
    <div>
      <h2>Order Details</h2>
      <table className="table table-stripped">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
        <thead>
          <tr>
            <th colSpan={2}>Total</th>
            <th>{total}</th>
          </tr>
          <tr>
            <th colSpan={2}>Tax</th>
            <th>{tax}</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const [items, setItems] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [categories, setCategories] = useState(null);
  const [printOrder, setPrintOrder] = useState(false);
  const [selectedItem, setSelectedItems] = useState([]);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handlePrint = () => {
    // Open the print dialog when the user clicks the print button
    window.print();
  };

  const getItems = async () => {
    const response = await axios.get('http://localhost:8081/items');
    setItems(response.data);
  }

  const createOrder = async () => {
    const itemIds = orderItems.map(obj => obj.id);
    const data = {
      items: itemIds
    }

    console.log("Request data:", data);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:8081/orders", data, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      console.log("Response:", response);

      if (response.status === 201) {

        setPrintOrder(true);
        // Update item quantities after placing the order
        await updateItemQuantities(orderItems);

        setOrderItems([]);
        setTotal(0);
        setTax(0);

        setSelectedItems([]);

        setShowSuccessMessage(true);

        // Automatically hide the success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);




      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      console.error("Detailed Axios Error:", error);
    }
  }
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

  const updateItemQuantities = async (items) => {
    const token = localStorage.getItem("token");

    try {
      // Loop through each item in the order and decrement its quantity
      for (const item of items) {
        await axios.patch(
          `http://localhost:8081/items/${item.id}`,
          {
            "qty": item.qty - 1,

          },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
      }
    } catch (error) {
      console.error("Error updating item quantities:", error);
    }
  };

  const removeItemFromOrder = (itemId) => {
    const updatedOrderItems = orderItems.filter(item => item.id !== itemId);
    setOrderItems(updatedOrderItems);

    // Update total and tax when removing an item
    const removedItem = orderItems.find(item => item.id === itemId);
    if (removedItem) {
      setTotal(prevTotal => prevTotal - removedItem.price);
    }
  };

  useEffect(() => {
    // Check if order is placed and print action needs to be triggered
    if (printOrder) {
      handlePrint();
      setPrintOrder(false); // Reset the print flag
    }
  }, [printOrder]);

  useEffect(() => {
    getItems();
    getCategories();
  }, []);

  useEffect(() => {
    setTax((total / 100) * 15);
  }, [total]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <div>
        {showSuccessMessage && (
          <div className="alert alert-success" role="alert">
            Successfully Placed Order!
          </div>
        )}

      </div>
      <nav class="navbar navbar-expand bg-body-tertiary">
        <div class="container-fluid">
          <a
            className="btn btn-primary btn-sm me-2 rounded-3 shadow ml-5" href="/viewUser"
          >
            User Home
          </a>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <nav class="nav">
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





              </nav>




              <li class="nav-item">

                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
              </li>

            </ul>


          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <h1>Checking Out</h1>
        <div className="row">
          <div className="col-md-6">
            <h2>Products</h2>

            {selectedItems && selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <div className="product-box px-2 py-2" key={item.id}>
                  {item.name} - {item.price}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setOrderItems([...orderItems, item]);
                      setTotal(prevTotal => prevTotal + item.price);
                    }}
                  >
                    Add to Order
                  </button>
                </div>
              ))
            ) : (
              <p>No items selected.</p>
            )}
          </div>
          <div className="col-md-6">
            <h2>Order</h2>

            <table className="table table-stripped">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItems && orderItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <button className="btn btn-secondary" onClick={() => removeItemFromOrder(item.id)}>Remove</button>
                  </tr>

                ))}

              </tbody>
              <thead>
                <tr>
                  <th colSpan={2}>
                    Total
                  </th>
                  <th>
                    {total}
                  </th>
                </tr>
                <tr>
                  <th colSpan={2}>
                    Tax
                  </th>
                  <th>
                    {tax}
                  </th>
                </tr>
              </thead>
            </table>

            <button className="btn btn-secondary" onClick={createOrder}>
              Place Order
            </button>
            <button className="btn btn-secondary" onClick={() => setPrintOrder(true)}>
              Print Order
            </button>
          </div>
          <div className="print-section">
            {/* Print this section when the user clicks the print button */}
            <OrderDetails orderItems={orderItems} total={total} tax={tax} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;