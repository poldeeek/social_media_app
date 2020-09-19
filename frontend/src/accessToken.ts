let accessToken: String = "";

export const setAccessToken = (newAccessToken: String) => {
  accessToken = newAccessToken;
};

export const getAccessToken = () => {
  return accessToken;
};
