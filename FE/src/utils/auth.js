export const saveAuth = ({
  accessToken,
  refreshToken,
  user,
}) => {
  // TOKEN
  localStorage.setItem(
    "accessToken",
    accessToken
  );

  localStorage.setItem(
    "refreshToken",
    refreshToken
  );

  // USER
  localStorage.setItem(
    "id",
    user.id
  );

  localStorage.setItem(
    "name",
    user.name
  );

  localStorage.setItem(
    "role_id",
    String(user.role_id)
  );

  localStorage.setItem(
    "role_name",
    user.role_name
  );

  localStorage.setItem(
    "stage_code",
    user.stage_code
  );

  localStorage.setItem(
    "stage_name",
    user.stage_name
  );
};

export const getToken = () => {
  return localStorage.getItem(
    "accessToken"
  );
};

export const getRefreshToken = () => {
  return localStorage.getItem(
    "refreshToken"
  );
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getRole = () => {
  return parseInt(
    localStorage.getItem("role_id"),
    10
  );
};

export const getUser = () => {
  return {
    id: localStorage.getItem("id"),

    name: localStorage.getItem("name"),

    role_id: parseInt(
      localStorage.getItem("role_id"),
      10
    ),

    role_name:
      localStorage.getItem("role_name"),

    stage_code:
      localStorage.getItem("stage_code"),

    stage_name:
      localStorage.getItem("stage_name"),
  };
};

export const clearAuth = () => {
  localStorage.removeItem(
    "accessToken"
  );

  localStorage.removeItem(
    "refreshToken"
  );

  localStorage.removeItem("id");

  localStorage.removeItem("name");

  localStorage.removeItem(
    "role_id"
  );

  localStorage.removeItem(
    "role_name"
  );

  localStorage.removeItem(
    "stage_code"
  );

  localStorage.removeItem(
    "stage_name"
  );
};

export const logout = () => {
  clearAuth();

  window.location.href = "/";
};