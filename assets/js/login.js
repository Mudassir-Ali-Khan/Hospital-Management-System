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


const addPatient = async () => { 
  hideErrorBox();
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const phonenumber = document.getElementById('number').value;
  const gender = document.getElementById('gender').value;

  const newUser = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      phonenumber: phonenumber,
      gender: gender
  };
  try {
      const response = await axios.post(BASE_URL + '/api/patients', newUser)
      console.log(response.data);
      window.location.href = '/pages/hospital/login.html';
  } catch (error) {
    const msg = error.response.data.message;
    errorBox.style.display = "block";
    document.getElementById('error-msg').innerHTML = msg;
    console.log("error", msg);
  }
}