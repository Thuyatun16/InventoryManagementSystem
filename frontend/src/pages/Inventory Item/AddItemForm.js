import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryForm from "./CategoryForm";
import "./AddItemForm.css";
import HandleBarcodeScanner from "./HandleBarcodeScanner";

function AddItemForm({ formData, setFormData, onAddItem }) {
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "user-id": localStorage.getItem("userId"),
            "is-admin": localStorage.getItem("isAdmin"),
          },
        });
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Invalid categories data:", response.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Callback to add a new category
  const handleAddCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  // Callback to edit an existing category
  const handleEditCategory = (updatedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  };

  // Callback to delete a category
  const handleDeleteCategory = (id) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.id !== id)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.barcode) {
      alert("Please fill all the fields");
      return;
    }
    onAddItem(formData);
    setFormData({
      name: "",
      quantity: "",
      barcode: "",
      price: "",
      sellPrice: "",
      category_id: "",
    });
    alert ("Item added successfully");
  };

  const toggleItemForm = () => {
    setIsItemFormOpen(!isItemFormOpen);
    if (!isItemFormOpen) setIsCategoryFormOpen(false);
  };

  const toggleCategoryForm = () => {
    setIsCategoryFormOpen(!isCategoryFormOpen);
    if (!isCategoryFormOpen) setIsItemFormOpen(false);
  };

  return (
    <div>
      <div className="buttons-container">
        <div
          className={`add-form-trigger ${isItemFormOpen ? "active" : ""}`}
          onClick={toggleItemForm}
        >
          <span>+</span> Add New Item
        </div>
        <div
          className={`add-form-trigger ${isCategoryFormOpen ? "active" : ""}`}
          onClick={toggleCategoryForm}
        >
          <span>+</span> Add Category
        </div>
      </div>
      <div className={`add-form-container ${isCategoryFormOpen ? "active" : ""}`}>
        <div className="add-form">
          <CategoryForm
            categories={categories}
            onCategoryAdded={handleAddCategory}
            onCategoryEdited={handleEditCategory}
            onCategoryDeleted={handleDeleteCategory}
          />
        </div>
      </div>
      <div className={`add-form-container ${isItemFormOpen ? "active" : ""}`}>
        <div className="add-form">
          <form onSubmit={handleSubmit}>
            <div className="AI-form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                required
                min="0"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
                min="0"
              />
              <input
                type="number"
                name="sellPrice"
                value={formData.sellPrice}
                onChange={handleChange}
                placeholder="Enter sell price"
                required
                min="0"
              />
              <div className="barcode-group">
                <HandleBarcodeScanner
                  formData={formData}
                  setFormData={setFormData}
                  className="add-item-barcode-scanner"
                  mode="icon"
                />
              </div>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-button">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItemForm;