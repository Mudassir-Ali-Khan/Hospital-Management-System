// const BASE_URL = require('../js/constants');

// const errorBox = document.getElementById("errorBox");

// const hideErrorBox = () => {
//     errorBox.style.display = "none";
// }

// hideErrorBox();

const submitLogin = async () => {
  // hideErrorBox();
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;
  try {
    // const response = await axios.post(BASE_URL + "/api/auth/login", {
    //   email: userEmail,
    //   password: userPassword,
    // });

    const response = await axios.post("http://localhost:5000/api/auth/login", {
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
    // errorBox.style.display = "block";
    document.getElementById('error-msg').innerHTML = msg;
    console.log("error", msg);
  }
};


const addPatient = async () => { 
  // hideErrorBox();
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const phonenumber = document.getElementById('number').value;
  const gender = document.getElementById('gender').value;

  console.log("Form values:", { firstname, lastname, email, password, phonenumber, gender });

  const newUser = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      phonenumber: phonenumber,
      gender: gender
  };
  try {
      const response = await axios.post('http://localhost:5000/api/patients', newUser)
      console.log(response.data);
      window.location.href = '/pages/hospital/login.html';
  } catch (error) {
    const msg = error.response.data.message;
    // errorBox.style.display = "block";
    document.getElementById('error-msg').innerHTML = msg;
    console.log("error", msg);
  }
}

const addDoctor = async () => { 

  const firstname = document.getElementById('doctorfirstname').value;
  const lastname = document.getElementById('doctorlastname').value;
  const email = document.getElementById('doctoremail').value;
  const password = document.getElementById('doctorpassword').value;
  const PMC = document.getElementById('doctorPMC').value;
  const qualification = document.getElementById('doctorqualification').value;
  const phonenumber = document.getElementById('doctornumber').value;
  const gender = document.getElementById('doctorgender').value;


  const newDoctor = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      PMC: PMC,
      qualification: qualification,
      phonenumber: phonenumber,
      gender: gender
  };
  try {
      const response = await axios.post('http://localhost:5000/api/doctors', newDoctor)
      console.log(response.data);
      window.location.href = '/pages/hospital/login.html';
  } catch (error) {
    const msg = error.response.data.message;
    // errorBox.style.display = "block";
    document.getElementById('error-msg').innerHTML = msg;
    console.log("error", msg);
  }
}


const authUser = JSON.parse(localStorage.getItem('authUser'));

const useremail = authUser.user.email; 

document.getElementById('staffSidebar')
const adminView = () => { 
  staffSidebar.style.display = "none";  
}

if (!useremail.includes('@admin.com')) {
  adminView();
}

const adminName = authUser.user.fullname;


if (useremail.includes('admin.com')) {
  document.getElementById('userName').innerHTML = adminName;
}
else {
const userFirstName = authUser.user.firstname;
const userLastName = authUser.user.lastname;

document.getElementById('userName').innerHTML = userFirstName + userLastName;
}