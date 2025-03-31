    import { useState, useEffect } from "react";
    import "./AddStaff.css"; // Reuse the same CSS
    import Axios from "axios";
    import LoadingIcon from '../Icon/loading.png';
    import EditIcon from '../Icon/edit.png';
    import DeleteIcon from '../Icon/delete.png';
    import AddIcon from '../Icon/add-staff.png';
    import "./CustomerManagement.css";

    const CustomerManagement = () => {
        const [name, setName] = useState("");
        const [customerData, setCustomerData] = useState([]);
        const [phone_number, setPhone] = useState("");
        const [points, setPoint] =useState("");
        const [total_spent, setTotalSpent] =useState("");
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedCustomer, setSelectedCustomer] = useState(null);
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        useEffect(() => {
            fetchCustomers();
        }, []);

        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const response = await Axios.get('http://localhost:5000/customers', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setCustomerData(response.data);
            } catch (error) {
                console.log('Error in fetching customers:', error);
                setError('Failed to fetch customers');
            } finally {
                setLoading(false);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            const customerData = {
                name,
                phone_number,
                points,
                total_spent
            };
            const endpoint = selectedCustomer ? 
                `http://localhost:5000/customers/${selectedCustomer.id}` : 
                'http://localhost:5000/customers';
            const method = selectedCustomer ? 'put' : 'post';

            try {
                console.log(customerData,"this is customer data");
                await Axios[method](endpoint, customerData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                alert(selectedCustomer ? 'Customer Updated Successfully' : 'Customer Added Successfully');
                resetForm();
                fetchCustomers();
            } catch (error) {
                setError(error.response?.data?.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        const resetForm = () => {
            setName("");
            setPhone("");
            setSelectedCustomer(null);
            setIsModalOpen(false);
            setError("");
        };

        const handleAddNew = () => {
            resetForm();
            setIsModalOpen(true);
        };

        const handleEdit = (customer) => {
            setSelectedCustomer(customer);
            setName(customer.name);
            setPhone(customer.phone_number);
            setPoint(customer.points);
            setTotalSpent(customer.total_spent);    
            setIsModalOpen(true);
        };

        const handleDelete = async (id) => {
            if (!window.confirm('Are you sure you want to delete this customer?')) return;
            setLoading(true);
            try {
                await Axios.delete(`http://localhost:5000/customers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                fetchCustomers();
                alert('Customer deleted successfully');
            } catch (error) {
                setError('Error deleting customer');
            } finally {
                setLoading(false);
            }
        };

        if (loading) return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <img src={LoadingIcon} alt="Loading" />
                </div>
            </div>
        );

        return (
            <div className="customer-management">
                <div className="customer-list-header">
                    <h2>Customer List</h2>
                    <button onClick={handleAddNew} className="add-customer-btn">
                        <img src={AddIcon} alt="Add New Customer" />
                    </button>
                </div>
                <div className="customer-list">
                    <div className="customer-grid">
                        <div className={isAdmin?"customer-header":"staff-customer-header"}>
                            <span>Name</span>
                            <span>Phone Number</span>
                            <span>Total Points</span>
                            <span>Total Spent</span>
                            <span>Actions</span>
                        </div>
                        {customerData.map(customer => (
                            <div key={customer.id} className={isAdmin?"customer-row":"staff-customer-row"}>
                                <span>{customer.name}</span>
                                
                                <span>{customer.phone_number}</span>
                                <span>{customer.points}</span>
                                <span>${customer.total_spent}</span>
            {isAdmin && <> <div className="customer-actions">
                                    <img
                                        src={EditIcon}
                                        alt="Edit"
                                        onClick={() => handleEdit(customer)}
                                        className="action-icon"
                                    />
                                    <img
                                        src={DeleteIcon}
                                        alt="Delete"
                                        onClick={() => handleDelete(customer.id)}
                                        className="action-icon"
                                    />
                                </div>
                                </>
                            }
                            </div>
                            
                        ))}
                    </div>
                </div>
            
                {/* Modal remains the same as it uses shared styles */}
                {isModalOpen && (
                    <div className="modal-overlay" onClick={resetForm}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <button className="close-btn" onClick={resetForm}>&times;</button>
                            <h2>{selectedCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
                            {error && <div className="error-message">{error}</div>}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="a-input-group">
                                    <input
                                        type="text"
                                        className="a-form-input"
                                        placeholder=" "
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <span className="a-floating-label">Name</span>
                                </div>
                                <div className="a-input-group">
                                    <input
                                        type="tel"
                                        className="a-form-input"
                                        placeholder=" "
                                        value={phone_number}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                    <span className="a-floating-label">Phone Number</span>
                                </div>
                               
                                {selectedCustomer && <> <div className="a-input-group">
                                    <input
                                        type="number"
                                        className="a-form-input"
                                        placeholder=" "
                                        value={points}
                                        onChange={(e) => setPoint(e.target.value)}
                                        required
                                    />
                                    <span className="a-floating-label">Total Points</span>
                                </div>
                             
                                <div className="a-input-group">
                                    <input
                                        type="number"
                                        className="a-form-input"
                                        placeholder=" "
                                        value={total_spent}
                                        onChange={(e) => setTotalSpent(e.target.value)}
                                        required
                                    />
                                    <span className="a-floating-label">Total Spent</span>
                                   
                                </div> </>}
                                <div className="modal-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {selectedCustomer ? 'Update Customer' : 'Add Customer'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    export default CustomerManagement;