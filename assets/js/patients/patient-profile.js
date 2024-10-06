const getPatientDetails = async () => {
    const searchParams = new URLSearchParams(window.location.search);

    const patientId = searchParams.get('id');
    if (patientId) {
        try {
            const loading = document.getElementById('loading');
            const userProfileImage = document.querySelector('.profile-user-img');
            loading.style.display = 'block';
            const userProfile = document.getElementById('user-profile');
            userProfile.style.display = 'none';
            const response = await axios.get(BASE_URL + `/api/patients/${patientId}`);
            const patientData = response.data;
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');
            const userGender = document.getElementById('user-gender');
            const userPhone = document.getElementById('user-phone');

            userName.innerHTML = `${patientData.firstname} ${patientData.lastname}`;
            userEmail.innerHTML = patientData.email;
            userGender.innerHTML = patientData.gender;
            userPhone.innerHTML = patientData.phonenumber;

            if (patientData.gender.toLowerCase() === 'male') {
                userProfileImage.setAttribute('src', '../../dist/img/avatar5.png');
            } else if (patientData.gender.toLowerCase() === 'female') {
                userProfileImage.setAttribute('src', '../../dist/img/avatar2.png');
            } else {
                userProfileImage.setAttribute('src', 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png');
            }

            userProfile.style.display = 'block';
            loading.style.display = 'none';
        } catch (error) {
            console.log(error);
        }
    } else {
        window.location.href = '/pages/hospital/Patients.html';
    }
}

const patientUpdate = async () => {

    const searchParams = new URLSearchParams(window.location.search);
    const patientId = searchParams.get('id');
    if (patientId) {
        try {
            const firstname =document.getElementById('firstNameUpdate').value;
            const lastname = document.getElementById('lastNameUpdate').value;
            const email = document.getElementById('emailUpdate').value;
            const phonenumber = document.getElementById('phoneNumberUpdate').value;
            const gender = document.getElementById('genderUpdate').value;
             const response = await axios.patch(BASE_URL + `/api/patients/${patientId}`, {
                 firstname,
                 lastname,
                 email,
                 phonenumber,
                 gender
             });
             if (response.status === 201 || response.status === 200) {
                 getData();
             }
         } catch (error) {
            console.error("Error updating patient: ", error);
               };   
         }
    }


 

getPatientDetails();