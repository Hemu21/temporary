import React, { useState } from 'react';
import UserForm from './components/UserForm';
import UserData from './components/UserData';
import { getUserData, updateUser } from './api/user';
import BeatLoader from "react-spinners/BeatLoader"
const App = () => {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(false)
  function getCurrentDateTime() {
    const now = new Date();
    const date = now.getDate(); 
    const month = now.getMonth() + 1; 
    const year = now.getFullYear(); 
  
    const hours = now.getHours(); 
    const minutes = now.getMinutes(); 
    const seconds = now.getSeconds(); 
  
    const formattedDate = `${date.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
    return `${formattedDate} ${formattedTime}`;
  }
  const handleGetData = async (username) => {
    const data = await getUserData(username,setLoading);
    setUser(data);
  };

  const handleUpdate = async () => {
    const date = getCurrentDateTime()
    await updateUser(user.username,date,setLoading);
    await handleGetData(user.username)
  };

  return (
    <div>
      <UserForm onSubmit={handleGetData} />
      {loading && <div className='flex justify-center mt-16'><BeatLoader size={25} /></div>}
      {user && !loading && <UserData user={user} onUpdate={handleUpdate} />}
    </div>
  );
};

export default App;
