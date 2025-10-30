import React, { useEffect, useState } from "react";
import axios from "axios";

const LANGUAGES = ["en", "fr", "ar", "es", "ja", "zh"]; // supported language codes

const initialForm = {
  slug: "",
  image: "",
  published: true,
  author: "",
  translations: {
    en: { title: "", content: "" },
    fr: { title: "", content: "" },
    ar: { title: "", content: "" },
    es: { title: "", content: "" },
    ja: { title: "", content: "" },
    zh: { title: "", content: "" },
  },
};

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editBlogId, setEditBlogId] = useState(null);
  const [selectedLang, setSelectedLang] = useState("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [oldImage, setOldImage] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs`
    );
    setBlogs(res.data.blogs);
    setLoading(false);
  };

  // Open modal for Add/Edit blog
  const openBlogModal = (blog) => {
    if (blog) {
      // Editing existing blog
      setEditBlogId(blog._id);
      setForm({
        slug: blog.slug,
        image: blog.image,
        published: blog.published,
        author: blog.author,
        translations: {
          ...initialForm.translations,
          ...blog.translations,
        },
      });
      setOldImage(blog.image || null); // store old image for deletion
    } else {
      // Creating new blog
      setEditBlogId(null);
      setForm(initialForm);
      setOldImage(null);
    }
    setSelectedFile(null);
    setModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["title", "content"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [selectedLang]: {
            ...prev.translations[selectedLang],
            [name]: value,
          },
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle image selection (for preview only)
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setForm((prev) => ({ ...prev, image: URL.createObjectURL(file) })); // preview
    }
  };

  // Save blog (create/update)
  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("authToken");

    let imageUrl = form.image;

    try {
      // If a new image is selected
      if (selectedFile) {
        // Delete old image from Cloudinary if it exists
        if (oldImage && oldImage.startsWith("http")) {
          await fetch(`/api/upload?imagePath=${encodeURIComponent(oldImage)}`, {
            method: "DELETE",
          });
        }

        // Upload new image to Cloudinary
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl; // Cloudinary secure_url
      }

      const payload = { ...form, image: imageUrl };

      // If editing, update existing blog
      if (editBlogId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${editBlogId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // If creating, create new blog
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Reset form and refresh blogs
      setModalOpen(false);
      setForm(initialForm);
      setEditBlogId(null);
      setSelectedFile(null);
      setOldImage(null);
      fetchBlogs();
    } catch (e) {
      alert("Failed to save blog. Please try again.");
    }
    setSaving(false);
  };

  // Delete blog and its image
  const handleDelete = async () => {
    if (!window.confirm("Delete this blog?")) return;
    const token = localStorage.getItem("authToken");

    try {
      // Delete blog entry from backend
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${editBlogId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Delete image from Cloudinary if exists
      if (oldImage && oldImage.startsWith("http")) {
        await fetch(`/api/upload?imagePath=${encodeURIComponent(oldImage)}`, {
          method: "DELETE",
        });
      }

      // Reset form and refresh
      setModalOpen(false);
      setForm(initialForm);
      setEditBlogId(null);
      setSelectedFile(null);
      setOldImage(null);
      fetchBlogs();
    } catch (e) {
      alert("Failed to delete blog. Please try again.");
    }
  };

  return (
    <div>
      <h2>Blogs</h2>
      <button
        className="admin-save-btn"
        style={{ marginTop: 10, marginBottom: 18 }}
        onClick={() => openBlogModal(null)}
      >
        Add Blog
      </button>

      {/* Blog Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <button
              onClick={() => setModalOpen(false)}
              className="modal-close"
            >
              ×
            </button>
            <h4>{editBlogId ? "Edit Blog" : "Add Blog"}</h4>

            <label>Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} />

            <label>Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageSelect} />

            {/* Image Preview */}
            {form.image && (
              <div style={{ marginTop: 8 }}>
                <strong>Preview:</strong>
                <br />
                <img
                  src={form.image}
                  alt="Preview"
                  style={{ maxWidth: "200px", marginTop: 5 }}
                />
              </div>
            )}

            <label>
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
              />
              Published
            </label>

            <label>Author</label>
            <input name="author" value={form.author} onChange={handleChange} />

            <label>Language</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            <label>Title ({selectedLang})</label>
            <input
              name="title"
              value={form.translations[selectedLang]?.title || ""}
              onChange={handleChange}
            />

            <label>Content ({selectedLang})</label>
            <textarea
              name="content"
              value={form.translations[selectedLang]?.content || ""}
              onChange={handleChange}
              rows={5}
            />

            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editBlogId ? "Update" : "Create"}
              </button>
              {editBlogId && (
                <button onClick={handleDelete} className="delete-btn">
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Blog List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Published</th>
              <th>Date</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => (
              <tr
                key={b._id}
                onClick={() => openBlogModal(b)}
                style={{ cursor: "pointer" }}
              >
                <td>{b.slug}</td>
                <td>{b.published ? "Yes" : "No"}</td>
                <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                <td>{b.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
