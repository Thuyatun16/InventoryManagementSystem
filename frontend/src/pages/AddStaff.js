import { useState, useEffect } from "react";
import "./AddStaff.css";
import Axios from "axios";
import LoadingIcon from '../Icon/loading.png';
import EditIcon from '../Icon/edit.png';
import DeleteIcon from '../Icon/delete.png';
import AddIcon from '../Icon/add-staff.png'; // Assume you have an add icon

const AddStaff = () => {
    const [user, setUser] = useState("");
    const [userData, setUserData] = useState([]);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhone] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await Axios.get('http://localhost:5000/staff', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin'),
                }
            });
            setUserData(response.data);
        } catch (error) {
            console.log('Error in fetching staff:', error);
            setError('Failed to fetch staff');
        } finally {
            setLoading(false);
        }
    };

    const register = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (selectedStaff && password && !confirmPassword) {
            setError("Please confirm the new password");
            return;
        }
        setLoading(true);
        setError("");
        const staffData = {
            username: user,
            email: email,
            phone_number: phone_number,
            ...(selectedStaff ? (password ? { password } : {}) : { password }),
        };
        const endpoint = selectedStaff ? `http://localhost:5000/staff/${selectedStaff.id}` : 'http://localhost:5000/register';
        const method = selectedStaff ? 'put' : 'post';

        try {
            const response = await Axios[method](endpoint, staffData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin'),
                }
            });
            console.log(response.data);
            alert(selectedStaff ? 'Staff Updated Successfully' : 'Staff Register Successful');
            setUser("");
            setEmail("");
            setPassword("");
            setPhone("");
            setConfirmPassword("");
            setSelectedStaff(null);
            setIsModalOpen(false);
            fetchStaff();
        } catch (error) {
            if (error.response?.status === 409) {
                setError("Username already exists.");
            } else if (error.response?.status === 400) {
                setError("Bad request.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setSelectedStaff(null);
        setUser("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        setIsModalOpen(true);
    };

    const handleEdit = (staff) => {
        setSelectedStaff(staff);
        setUser(staff.username);
        setEmail(staff.email);
        setPhone(staff.phone_number);
        setPassword("");
        setConfirmPassword("");
        setError("");
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;
        setLoading(true);
        try {
            await Axios.delete(`http://localhost:5000/staff/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'user-id': localStorage.getItem('userId'),
                    'is-admin': localStorage.getItem('isAdmin'),
                }
            });
            fetchStaff();
            alert('Staff deleted successfully');
        } catch (error) {
            console.error('Error deleting staff:', error);
            setError('Error deleting staff member');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStaff(null);
        setUser("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setError("");
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner">
                <img src={LoadingIcon} alt="Loading" />
            </div>
        </div>
    );

    return (
        <div className="staff-management">
            <div className="staff-list-header">
                <h2>Staff List</h2>
                <button onClick={handleAddNew} className="add-staff-btn" aria-label="Add New Staff">
                    <img src={AddIcon} alt="Add New Staff" />
                </button>
            </div>
            <div className="staff-list">
                <div className="staff-grid">
                    <div className="staff-header">
                        <span>Username</span>
                        <span>Email</span>
                        <span>Phone_Number</span>
                        <span>Actions</span>
                    </div>
                    {userData.map(staff => (
                        <div key={staff.id} className="staff-row">
                            <span>{staff.username}</span>
                            <span>{staff.email}</span>
                            <span>{staff.phone_number}</span>
                            <div className="staff-actions">
                                <img
                                    src={EditIcon}
                                    alt=""
                                    onClick={() => handleEdit(staff)}
                                    className="action-icon"
                                    aria-label={`Edit ${staff.username}`}
                                />
                                <img
                                    src={DeleteIcon}
                                    alt=""
                                    onClick={() => handleDelete(staff.id)}
                                    className="action-icon"
                                    aria-label={`Delete ${staff.username}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeModal} aria-label="Close">&times;</button>
                        <h2>{selectedStaff ? 'Edit Staff' : 'Add New Staff'}</h2>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={register} className="space-y-6">
                            <div className="a-input-group">
                                <input
                                    type="text"
                                    className="a-form-input"
                                    placeholder=" "
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    required
                                    aria-label="Username"
                                />
                                <span className="a-floating-label">Username</span>
                            </div>
                            <div className="a-input-group">
                                <input
                                    type="email"
                                    className="a-form-input"
                                    placeholder=" "
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    aria-label="Email"
                                />
                                <span className="a-floating-label">Email</span>
                            </div>
                            <div className="a-input-group">
                                <input
                                    type="phone_number"
                                    className="a-form-input"
                                    placeholder=" "
                                    value={phone_number}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    aria-label="Phone_Number"
                                />
                                <span className="a-floating-label">Phone_Number</span>
                            </div>
                            {!selectedStaff ? (
                                <>
                                    <div className="a-input-group">
                                        <input
                                            type="password"
                                            className="a-form-input"
                                            placeholder=" "
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            aria-label="Password"
                                        />
                                        <span className="a-floating-label">Password</span>
                                    </div>
                                    <div className="a-input-group">
                                        <input
                                            type="password"
                                            className="a-form-input"
                                            placeholder=" "
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            aria-label="Confirm Password"
                                        />
                                        <span className="a-floating-label">Confirm Password</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="a-input-group">
                                        <input
                                            type="password"
                                            className="a-form-input"
                                            placeholder=" "
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            aria-label="New Password"
                                        />
                                        <span className="a-floating-label">New Password (optional)</span>
                                    </div>
                                    <div className="a-input-group">
                                        <input
                                            type="password"
                                            className="a-form-input"
                                            placeholder=" "
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            aria-label="Confirm New Password"
                                        />
                                        <span className="a-floating-label">Confirm New Password</span>
                                    </div>
                                </>
                            )}
                            <div className="modal-actions">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {selectedStaff ? 'Update Staff' : 'Add New Staff'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
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

export default AddStaff;