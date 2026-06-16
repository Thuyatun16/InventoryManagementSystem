import React, { useState } from "react";
import axios from "../../../api/axios";
import "../styles/CategoryForm.css";
import { useNotifier } from "../../../context/NotifierContext";

const CategoryForm = ({
  categories,
  onCategoryAdded,
  onCategoryEdited,
  onCategoryDeleted,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { success: showSuccess, error: showError, confirm } = useNotifier();

  // Handle form submission for adding or editing a category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await axios.put(
          `/categories/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "user-id": localStorage.getItem("userId"),
              "is-admin": localStorage.getItem("isAdmin"),
            },
          },
        );
        onCategoryEdited(response.data);
        setSuccess("Category updated successfully");
        showSuccess("Category updated successfully");
      } else {
        const response = await axios.post(
          "/categories",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "user-id": localStorage.getItem("userId"),
              "is-admin": localStorage.getItem("isAdmin"),
            },
          },
        );
        if (response.data && response.data.categoryId) {
          const newCategory = {
            id: response.data.categoryId,
            name: formData.name,
            description: formData.description,
            created_at: new Date().toISOString(),
          };

          onCategoryAdded(newCategory);
          setSuccess("Category created successfully");
          showSuccess("Category created successfully");
        }
      }

      setError("");
      setFormData({ name: "", description: "" });
      setEditingId(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save category";
      setError(message);
      showError(message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Populate form for editing
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setEditingId(category.id);
  };

  // Handle category deletion
  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
      confirmText: "Delete",
    });
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "user-id": localStorage.getItem("userId"),
          "is-admin": localStorage.getItem("isAdmin"),
        },
      });
      onCategoryDeleted(id);
      setSuccess("Category deleted successfully");
      showSuccess("Category deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete category");
      showError("Failed to delete category");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="category-container">
      <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label>Category Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Enter category name"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter category description"
          />
        </div>
        <button type="submit" className="submit-btn">
          {editingId ? "Update Category" : "Add Category"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setFormData({ name: "", description: "" });
              setEditingId(null);
            }}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </form>
      <div className="categories-list">
        <h3>Categories</h3>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <h4>{category.name.trim()}</h4>
              <p>{category.description || "No description"}</p>
              <small>
                Created: {new Date(category.created_at).toLocaleDateString()}
              </small>
              <div className="category-actions">
                <button
                  onClick={() => handleEdit(category)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;

