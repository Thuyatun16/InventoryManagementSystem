import React, { useState } from "react";
import HandleBarcodeScanner from "./HandleBarcodeScanner";
import "./AddItemForm.css";

function AddItemForm({ formData, setFormData, onAddItem }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.barcode) {
      alert("Please Fill all the fields");
      return;
    }
    onAddItem(formData);
    setFormData({ name: "", quantity: "", barcode: "", price: "", sellPrice: "" });
  };

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`add-form-trigger ${isOpen ? 'active' : ''}`} onClick={toggleForm}>
        <span>+</span> Add New Item
      </div>
      <div className={`add-form-container ${isOpen ? 'active' : ''}`}>
        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-group">
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
              <input
                type="number"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Click icon to scan barcode"
                required 
              />
              <HandleBarcodeScanner formData={formData} setFormData={setFormData} />
            </div>
          </div>
          <button type="submit" className="submit-button">Add Item</button>
        </form>
      </div>
    </div>
  );
}

export default AddItemForm;
