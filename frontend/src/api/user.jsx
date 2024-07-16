import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getUserData = async (username, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.post(`${API_URL}/api/user/get-data`, {
      username,
    });
    setLoading(false);
    return response.data;
  } catch (error) {
    alert("Something went wrong");
    window.location.reload();
  }
  setLoading(false);
};

export const updateUser = async (username, date, setLoading) => {
  setLoading(true)
  try {
    const response = await axios.put(`${API_URL}/api/user/update-now`, {
      username,
      date,
    });
    return response.data;
  } catch (error) {
    alert("Something went wrong");
    window.location.reload();
  }
};

export const getAllPRs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/user/get-all-prs`);
    return response.data.totalMergedPRs
  } catch (error) {
    alert("Something went wrong");
    window.location.reload();
  }
}
