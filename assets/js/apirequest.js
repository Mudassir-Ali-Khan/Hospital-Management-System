const addUser = async () => { 

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
        const response = await axios.post('http://localhost:5000/api/patients', newUser)
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}