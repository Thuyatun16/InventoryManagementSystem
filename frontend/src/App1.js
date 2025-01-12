import React, { useState, useEffect } from "react";
import axios from "axios";
import AddItemForm from "./AddItemForm";
import HandleBarcodeScanner from "./HandleBarcodeScanner";

export default function App1() {
  const [formData, setFormData] = useState({ name: "", quantity: "", barcode: "" });
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/read")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleCreateItem = async (newItem) => {
    try {
      await axios.post("http://localhost:5000/create", newItem);
      const updatedItems = await axios.get("http://localhost:5000/read");
      setItems(updatedItems.data);
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  return (
    <div className="inventory-list">
      <h1>Inventory List</h1>
      <AddItemForm
        formData={formData}
        setFormData={setFormData}
        onAddItem={handleCreateItem}
      />
      <HandleBarcodeScanner formData={formData} setFormData={setFormData} />
      {items.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
          <p>{item.quantity}</p>
          <p>{item.barcode}</p>
        </div>
      ))}
    </div>
  );
}
