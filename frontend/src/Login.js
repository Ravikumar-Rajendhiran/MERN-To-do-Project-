import { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState("");

  //state for upload image
  const [image, setImage] = useState(null);
  const [info, setInfo] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const navigate = useNavigate();
  const apiUrl = 'http://localhost:8001';

  // Image input change handler
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Combined Submit: upload + login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      let uploadedImageUrl = '';

      //Upload image (if selected)
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadRes = await axios.post('http://localhost:5000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedImageUrl = uploadRes.data.url;
        setImageUrl(uploadedImageUrl);
        setInfo(uploadRes.data.info);
        localStorage.setItem("uploadedImage", uploadedImageUrl);
        console.log("Image uploaded:", uploadedImageUrl);
      }

      //Send login request
      const loginRes = await fetch(apiUrl + "/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, image: uploadedImageUrl }), // include image URL in body
      });

      if (!loginRes.ok) throw new Error("Login failed");

      const data = await loginRes.json();

      // Save user info and token
      localStorage.setItem("user", JSON.stringify(data.user || { name, email }));
      localStorage.setItem("token", data.token);
      if (uploadedImageUrl) localStorage.setItem("uploadedImage", uploadedImageUrl);

      setUser([...user, { name, email, password }]);
      setName("");
      setEmail("");
      setPassword("");

      console.log("User logged in successfully:", data);
      navigate("/todos");
    } catch (err) {
      console.error("Error:", err);
      setMessage("Something went wrong. Try again.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="container login">
      <div className="row">
        <form className="form-group my-3" onSubmit={handleSubmit}>
          <h2 className="text-center">Login</h2>

          <label>Name</label>
          <input
            className="form-control mb-2"
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Enter Your Name"
          />

          <label>Email</label>
          <input
            className="form-control mb-2"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="Enter Your Email"
          />

          <label>Password</label>
          <input
            className="form-control mb-2"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Enter Your Password"
          />

          <p>Upload Image</p>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <p className="text-danger">{message}</p>
          <p>{info}</p>

          {imageUrl && (
            <div>
              <h3>Uploaded Image Preview:</h3>
              <img src={imageUrl} alt="Uploaded" style={{ width: '300px', marginTop: '10px' }} />
            </div>
          )}

          <button className="btn btn-success my-3 w-100" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
