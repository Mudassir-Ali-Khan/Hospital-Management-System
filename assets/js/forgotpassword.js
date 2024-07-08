const forgotPassword = async () => {
    const email = document.getElementById('emailForPassword').value
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    const changePassword = {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    }
    try {
      const response = await axios.post('http://localhost:5000/api/patients/updatepassword', changePassword)
      console.log(response.data);
      window.location.href = '/pages/hospital/login.html';
  } catch (error) {
    const msg = error.response.data.message;
    // errorBox.style.display = "block";
    document.getElementById('error-msg').innerHTML = msg;
    console.log("error", msg);
  }
  }