import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './todo.css';

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const apiUrl = "http://localhost:8000";
  const navigate = useNavigate(); // 

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Load uploaded image from localStorage
  useEffect(() => {
    const url = localStorage.getItem("uploadedImage");
    if (url) {
      setImageUrl(url);
    }
  }, []);

  // Fetch todos when component mounts
  useEffect(() => {
    getItems();
  }, []);

  // handleLogout function
  const handleLogout = () => {
    // Clear auth and user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("uploadedImage");
    sessionStorage.clear();
    setUser(null); // reset local state;
    navigate("/"); // redirect to login or home page
  };

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(() => setError("Failed to fetch todos"));
  };

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      if (!user || !user.name) {
        setError("No user logged in!");
        return;
      }

      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          user: user.name 
        }),
      })
        .then((res) => res.json())
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
          setTitle("");
          setDescription("");
          setMessage("Item Added Successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => setError("Unable to create Todo Item"));
    }
  };


  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => res.ok && res.json())
        .then(() => {
          const updatedTodos = todos.map((item) =>
            item._id === editId
              ? { ...item, title: editTitle, description: editDescription }
              : item
          );
          setTodos(updatedTodos);
          setEditId(-1);
          setMessage("Item Updated Successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => setError("Unable to update Todo Item"));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(apiUrl + "/todos/" + id, { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.filter((item) => item._id !== id);
            setTodos(updatedTodos);
          }
        })
        .catch(() => setError("Unable to delete Todo Item"));
    }
  };

  return (
    <>
      <div className="body container-fluid mt-3">
        <div className="row ms-2">
          <div className="col">
            <nav className="navbar navbar-expand-lg navbar-dark bg-success rounded px-4 py-3 mb-4">
              <div className="container-fluid d-flex justify-content-between align-items-center">
                <h3 className="text-light mb-0">Todo Project with MERN Stack</h3>
                {user ? (
                  <div className="d-flex align-items-center gap-3">
                    {/* Profile Image */}
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: "45px", height: "45px", objectFit: "cover" }}
                      />
                    )}
                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-light">No user logged in</span>
                  </div>
                )}
              </div>
            </nav>
            {/* Add Item Section */}
            <div className="row mt-4">
              <h4 className="mb-3 text-info fw-bold">Add Item</h4>
              {message && <p className="text-success">{message}</p>}

              <div className="form-group d-flex gap-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-control"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                />
                <button className="submit btn btn-info text-light" onClick={handleSubmit}>
                  Submit
                </button>
              </div>

              {error && <p className="text-danger mt-2">{error}</p>}
            </div>

            {/* Task List Section */}
            <div className="row mt-4">
              <h4 className="text-info fw-bold">Tasks</h4>
              <div className="col-md-12">
                {todos.length === 0 ? (
                  <p className="text-muted">No tasks yet. Add one above!</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle">
                      <thead className="table-success">
                        <tr>
                          <th style={{ width: "5%" }}>S.No</th>
                          <th style={{ width: "20%" }}>User Name</th>
                          <th style={{ width: "25%" }}>Work</th>
                          <th style={{ width: "30%" }}>Description</th>
                          <th style={{ width: "20%" }}>Actions</th>

                        </tr>
                      </thead>
                      <tbody>
                        {todos.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{item.user}</td>


                            {/* Editable or Normal Row */}
                            {editId !== item._id ? (
                              <>
                                <td className="fw-bold">{item.title}</td>
                                <td>{item.description}</td>
                              </>
                            ) : (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="form-control"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="form-control"
                                  />
                                </td>
                              </>
                            )}

                            {/* Action Buttons */}
                            <td>
                              {editId !== item._id ? (
                                <div className="d-flex gap-2 justify-content-center">
                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleEdit(item)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(item._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              ) : (
                                <div className="d-flex gap-2 justify-content-center">
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={handleUpdate}
                                  >
                                    Update
                                  </button>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setEditId(-1)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
