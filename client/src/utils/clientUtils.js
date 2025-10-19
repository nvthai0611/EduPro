import Cookies from "js-cookie";

export const client = {
  serverApi: import.meta.env.VITE_SERVER_API_V1,
  token: null,
  setUrl: function (url) {
    this.serverApi = url;
  },
  setToken: function (token) {
    this.token = token;
  },
  init_session: function () {
    const savedToken = Cookies.get("accessToken");
    console.log("savedToken", savedToken);

    if (savedToken) {
      this.setToken(savedToken);
    }
  },
  init_cookie: function () {
    const match = document.cookie.match(/(^|;) ?accessToken=([^;]*)/);
    return match ? match[2] : null;
  },
  send: async function (url, method = "GET", body = null) {
    // url = SERVER_API + url;
    url = `${this.serverApi}${url}`;
    const token = Cookies.get("accessToken"); // lay luon token vi khong muon sua o login
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return { response, data };
  },

  get: function (url) {
    return this.send(url, "GET");
  },

  post: function (url, body) {
    return this.send(url, "POST", body);
  },

  put: function (url, body) {
    return this.send(url, "PUT", body);
  },

  patch: function (url, body) {
    return this.send(url, "PATCH", body);
  },

  delete: function (url) {
    return this.send(url, "DELETE");
  },
};
