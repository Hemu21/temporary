import React, { useState } from "react";

const UserForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username);
  };

  return (
    <div className="w-full pt-3">
      <h1 className="text-2xl text-center mt-4 font-bold">GitHub User Data</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex justify-center m-2">
        <div className="m-3 w-[90%]">
          <input
            type="text"
            className="w-[80%] p-2 border-2 mr-3 border-gray-300 rounded-md"
            placeholder="Enter GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button className="bg-green-400 hover:bg-green-800 w-[80px] h-[39px] rounded-lg" type="submit">Get Data</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
