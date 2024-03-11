import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    // Fetch orders data
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8081/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);
  const navigate = useNavigate();
  const filteredOrders = orders.filter((order) =>
  order.id.toString().includes(searchTerm)
);

const handleOrderSelect = (order) => {
  setSelectedOrder(order);
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
      navigate("/main");
    }
  }
};

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
    <nav class="navbar navbar-expand bg-body-secondary">
        <div class="container-fluid">
          <a
            className="btn btn-primary btn-sm me-2 rounded-3 shadow ml-5" href="/view"
          >
            Home
          </a>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <nav class="nav">
                <Link to={`/home`} className="nav-link">Admin Home</Link>

                <a class="nav-link" href="/manageItem">Manage Item</a>
                <a class="nav-link" href="/manageCategory">Manage Category </a>
                

                <li class="nav-item ">
                  <Link to={`/category2`} className="nav-link">Category</Link>
                </li>

              </nav>

              {categories && categories.map((category) => (
                <li class="nav-item"><i class="fa-solid fa-gauge"></i>
                  <Link to={`/categories/${category.id}`} className="nav-link">{category.cname}</Link>
                </li>
              ))}
              <nav class="nav">

              </nav>

              <li class="nav-item">
                <a
                  className="btn btn-primary btn me-2"
                  href="/checkout1"
                  onClick={handleCartClick}
                >
                  Cart
                </a>

              </li>
              <li class="nav-item">
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    <div>
      <h1>All Orders</h1>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="search">Search by Order ID:</label>
        <input
          type="text"
          id="search"
          placeholder="Enter Order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Order ID</th>
            <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Total</th>
            <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Taxt</th>
            <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>
        Item IDs
      </th>
            
          </tr>
        </thead>
        <tbody>
        {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{order.id}</td>
              <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{order.total}</td>
              <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{order.tax}</td>
              <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{order.orderTime}</td>
              <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>
          {order.items.map((item) => item.id).join(", ")}
        </td>
              
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrder && (
        <div>
          <h2>Selected Order Details</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Order ID</th>
                <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Total</th>
                <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Tax</th>
                <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr key={selectedOrder.id}>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{selectedOrder.id}</td>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{selectedOrder.total}</td>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{selectedOrder.tax}</td>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{selectedOrder.orderTime}</td>
                
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default Orders;