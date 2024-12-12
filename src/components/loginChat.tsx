import { useState } from "react";
import { loginUser } from "@/components/cometchatUser"; // Adjust the path

const LoginForm = ({ onClose }: { onClose: () => void }) => {
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(userId);
      console.log("User logged in successfully");
      onClose(); // Close the modal after successful login
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          className="mb-4 w-full border p-2"
        />
        <button type="submit" className="rounded bg-green-500 p-2 text-white">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
