const errorBox = document.getElementById("errorBox");


console.log("Base url", BASE_URL);

const hideErrorBox = () => {
    errorBox.style.display = "none";
}

hideErrorBox();

const submitLogin = async () => {
  hideErrorBox();
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;
  try {
    // const response = await axios.post(BASE_URL + "/api/auth/login", {
    //   email: userEmail,
    //   password: userPassword,
    // });

    const response = await axios.post(BASE_URL + "/api/auth/login", {
        email,
        password,
    });

    const token = response.data.token;
    const user = response.data.user;
    const authObj = {
        token,
        user,
    };
    console.log(authObj);

    localStorage.setItem('authUser', JSON.stringify(authObj));

    window.location.href = '/index.html'
  } catch (error) {
    const msg = error.response.data.message;
    errorBox.style.display = "block";
    document.getElementById('error-msg').innerHTML = msg;
    console.log("error", msg);
  }
};
