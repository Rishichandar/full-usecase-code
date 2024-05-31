import api from "./axiosConfig";

export const forgotUser = async (data) => {
  try {
    const response = await api.post("/user/forgot", data);
    console.log(response);
    if (response.data.status === "Success") {
      SetLocalStorageToken(response.data?.Response?.token);
    }
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

// !  for Regester Email
export const regEmailSender = async (email, password) => {
  try {
    const response = await api.post("/user/reg", {
      Email: email,
      Password: password,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    // return error.response.data;
    return error;
  }
};

export const fetchSingleData = async (data) => {
  try {
    const response = await api.get(`/singleData?email=${data}`);
    return response.data;
  } catch (error) {
    console.log(error);
    // return error.response.data;
    return [];
  }
};
export const fetchAllData = async (data) => {
  try {
    const response = await api.get("/alldatas");
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const loginUser = async (data) => {
  try {
    const response = await api.post("/user/login", data);
    console.log(response.data);
    if (response.data.Status === "Success") {
      SetLocalStorageToken(response.data?.Response?.Token);
      console.log(response);
    }
    // window.alert(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};
export const SetLocalStorageToken = (token) => {
  // console.log(token);
  token && localStorage.setItem("Token", token);
};

export const ResetPassword = async (data) => {
  try {
    console.log(data);
    const response = await api.put("user/reset", data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const CheckToken = async () => {
  try {
    const response = await api.get("/user/auth");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginUserReset = async (data) => {
  try {
    const response = await api.post("user/reset", data);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getActivities = async (email, filter) => {
  let filters = filter.map((x) => `'${x}'`).join(",");
  try {
    const response = await api.get(
      `/GetActivity?Email=${email}&Filter=${filters}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
