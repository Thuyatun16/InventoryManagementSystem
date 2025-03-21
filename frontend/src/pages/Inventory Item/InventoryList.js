import React, { useState, useEffect } from 'react';
import AddItemForm from './AddItemForm';
import axios from 'axios';
import loadingIcon from '../../Icon/loading.png';
import saveIcon from '../../Icon/saveIcon.png';


import './InventoryList.css';

function InventoryList() {
  const [items, setItems] = useState([]);
  const[loading,setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', quantity: '', barcode: '', price: '', sellPrice: ''});
  const [error, setError] = useState('');


  const fetchData = () => {
    axios.get('http://localhost:5000/read')
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching data: ' + error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = async (newItem) => {
    try {
      await axios.post('http://localhost:5000/create', newItem);
      console.log(newItem);
      const updatedItems = await axios.get('http://localhost:5000/read');
      setItems(updatedItems.data);
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Error adding item: ' + error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      const updatedItems = await axios.get('http://localhost:5000/read');
      setItems(updatedItems.data);
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Error deleting item: ' + error.message);
    }
  };

  const handleEditItem = (id) => {
    const itemToEdit = items.find((item) => item.id === id);
    setIsEditing(id);
    setFormData(itemToEdit);
  };

  const handleSaveItem = async (id) => {
    if (formData.name.trim() === '') {
      setError('Item name cannot be empty');
      return;
    }

    const updatedItem = { ...formData };

    try {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? updatedItem : item))
      );

      await axios.put(`http://localhost:5000/update/${id}`, updatedItem);

      setFormData({ name: '', quantity: '', barcode: '' ,price: '', sellPrice: ''});
      setIsEditing(null);
      setError('');
    } catch (error) {
      console.error('Error updating item:', error);
      setError('Error updating item: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.value.trim() !== '') {
      setError('');
    }
  };
  if (loading) return <div className='loading-container'><div className='loading-spinner'><img src={loadingIcon} alt='loadingIcon'/></div></div>;
  return (
    <div className="inventory-list">
      <AddItemForm
        formData={formData}
        setFormData={setFormData}
        onAddItem={handleAddItem}
      />


      <h1>Inventory List</h1>

      <ul>

        <li className="inventory-item">
          <div className="inventory-item-details">
            <span>Name</span>
            <span>Quantity</span>
            <span>Barcode</span>
            <span>Price</span>
            <span>Sell Price</span>
          </div>
          
        </li>
        {items.map((item) => (
          <li key={item.id || item.name} className="inventory-item" >
            {isEditing === item.id ? (
              <div className="edit-mode-container">
                <div className="inventory-input">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Item name"
                      className="inventory-item-input"
                      autoFocus
                    />
                    <span className="input-label">Name</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Quantity"
                      className="inventory-item-input"
                      min="0"
                    />
                    <span className="input-label">Quantity</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Price"
                      className="inventory-item-input"
                      min="0"
                    />
                    <span className="input-label">Price</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      name="sellPrice"
                      value={formData.sellPrice}
                      onChange={handleChange}
                      placeholder="Sell Price"
                      className="inventory-item-input"
                      min="0"
                    />
                    <span className="input-label">Sell Price</span>
                  </div>
                </div>
                <div className="inventory-item-buttons">
                  <img src={saveIcon} alt="Save-Icon" 
                    onClick={() => handleSaveItem(item.id)} 
                    className='save-icon'
                    title="Save"
                  />
                    
                </div>
                {error && <p className="error-message">{error}</p>}
              </div>
            ) : (
              <>
                <div className="inventory-item-details" onClick={() => handleEditItem(item.id)} style={item.quantity < 3 ? { color: 'red' } : {}}>
                  <span className="inventory-item-name">{item.name}</span>
                  <span className="inventory-item-quantity" >{item.quantity}</span>
                  <span className="inventory-item-barcode">{item.barcode}</span>
                  <span className="inventory-item-price">${item.price}</span>
                  <span className="inventory-item-sellPrice">${item.sellPrice}</span>
                </div>
                <div className="inventory-item-buttons">
                  <button 
                    onClick={() => handleEditItem(item.id)} 
                    className="inventory-item-button edit"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)} 
                    className="inventory-item-button delete"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InventoryList;
