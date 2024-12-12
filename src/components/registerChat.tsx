import { useState } from "react";
import { createUser } from "@/components/cometchatUser"; // Adjust the path

const RegisterForm = ({ onClose }: { onClose: () => void }) => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(userId, username);
      console.log("User registered successfully");
      onClose(); // Close the modal after successful registration
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          className="mb-4 w-full border p-2"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="mb-4 w-full border p-2"
        />
        <button type="submit" className="rounded bg-blue-500 p-2 text-white">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
