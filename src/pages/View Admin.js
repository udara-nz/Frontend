import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {

  const [items, setItems] = useState(null);
  const [categories, setCategories] = useState(null);
  const [cname, setCname] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);


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
        navigate("/main");
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
                <a class="nav-link" href="/orders">Manage Orders</a>
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

      <div className="row">
        {/* Left Side - Display Items */}

        <div class="bg-body-tertiary">
          <h1><center>Home</center></h1>
        </div>
        <div class="text-center">
          <ul><div class="bg-body-tertiary">
            <div className="admin">
              <div class="d-grid mr gap-5">
                <a class="btn btn-primary" href={`/manageItem`} type="button">Manage Item</a>
                <a class="btn btn-primary" href={`/manageCategory`} type="button">Manage Category</a>
                <a class="btn btn-primary" href={`/orders`} type="button">Manage Orders</a>
                <a class="btn btn-primary" href={`/register`} type="button">User register</a>
              </div>
            </div></div>
          </ul>
        </div>
      </div>

      {/* Display Items */}

      <div className="row">
        {/* Left Side - Display Items */}
        <div className="col-md-6">


        </div>
      </div>

      <div class="p-3 mb-2 bg-warning text-dark">

      </div>
    </>
  )
}
export default Home;