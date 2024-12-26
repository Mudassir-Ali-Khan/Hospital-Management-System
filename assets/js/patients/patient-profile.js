const cancelAppointment = async (appointmentId) => {
  try {
    const response = await axios.patch(BASE_URL + `/api/appointments/status`, {
      appointmentId: appointmentId,
      status: 'cancelled'
    });
    if (response.status === 201 || response.status === 200) {
      Swal.fire({
        title: "Appointment Cancelled",
        text: "Appointment has been cancelled successfully",
        icon: "success",
        confirmButtonText: "Ok",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.response.data.message,
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
}

const getPatientDetails = async () => {
  const searchParams = new URLSearchParams(window.location.search);

  const patientId = searchParams.get("id");
  if (patientId) {
    try {
      const loading = document.getElementById("loading");
      const userProfileImage = document.querySelector(".profile-user-img");
      loading.style.display = "block";
      const userProfile = document.getElementById("user-profile");
      userProfile.style.display = "none";
      const response = await axios.get(BASE_URL + `/api/patients/${patientId}`);
      const patientData = response.data.patient;
      const userName = document.getElementById("user-name");
      const userEmail = document.getElementById("user-email");
      const userGender = document.getElementById("user-gender");
      const userPhone = document.getElementById("user-phone");
      userName.innerHTML = `${patientData.firstname} ${patientData.lastname}`;
      userEmail.innerHTML = patientData.email;
      userGender.innerHTML = patientData.gender;
      userPhone.innerHTML = patientData.phonenumber;

      if (patientData.gender.toLowerCase() === "male") {
        userProfileImage.setAttribute("src", "../../dist/img/avatar5.png");
      } else if (patientData.gender.toLowerCase() === "female") {
        userProfileImage.setAttribute("src", "../../dist/img/avatar2.png");
      } else {
        userProfileImage.setAttribute(
          "src",
          "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
        );
      }

      userProfile.style.display = "block";
      loading.style.display = "none";

      const firstNameUpdate = document.getElementById("firstNameUpdate");
      const lastNameUpdate = document.getElementById("lastNameUpdate");
      const emailUpdate = document.getElementById("emailUpdate");
      const phoneNumberUpdate = document.getElementById("phoneNumberUpdate");
      const genderUpdate = document.getElementById("genderUpdate");
      const isActiveUpdate = document.getElementById("isactiveField");
      firstNameUpdate.value = patientData.firstname;
      lastNameUpdate.value = patientData.lastname;
      emailUpdate.value = patientData.email;
      phoneNumberUpdate.value = patientData.phonenumber;
      genderUpdate.value = patientData.gender;
      isActiveUpdate.checked = patientData.isActive;

      // setting the appointment tab content
      const appointmentsBox = document.getElementById('appointmets-items');
      const patientAppointments = response.data.appointments;
      patientAppointments.forEach((appointment) => {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString("en-US", options);
        const appointmentTime = appointment.appointmentTime;
        const appointmentBadgeColor = appointment.appointmentStatus === 'pending' ? 'warning' : appointment.appointmentStatus === 'completed' ? 'success' : 'danger';
        const showButtons = appointment.appointmentStatus === 'pending'; // true, false
        
        appointmentsBox.innerHTML += `
            <div class="timeline timeline-inverse">
                            <div class="time-label">
                              <span class="bg-danger">
                                ${appointmentDate}
                              </span>
                            </div>
                            <div>
                              <i class="fas fa-calendar bg-primary"></i>
      
                              <div class="timeline-item">
                                <span class="time"><i class="far fa-clock"></i> ${appointmentTime}</span>
      
                                <h3 class="timeline-header"><a href="#">Appointment</a> has been booked</h3>
      
                                <div class="timeline-body">
                                  <div class="d-flex justify-content-between">
                                    <p>Appointment has been booked for ${appointmentDate} at ${appointmentTime}</p>
                                    <h5> <span class="badge badge-${appointmentBadgeColor}"> ${appointment.appointmentStatus.toUpperCase()} </span> </h5>
                                  </div>
                                  <b>Doctor Information:</b> <br>
                                  <hr class="border border-secondary">
                                  <b>Doctor Name:</b> ${appointment.doctor.firstname} ${appointment.doctor.lastname} <br>
                                  <b>Doctor Email:</b> ${appointment.doctor.email} <br>
                                  <br>
                                  <b>Amount Submitted:</b> ${appointment.fees} PKR<br>
                                  
                                </div>
                              ${showButtons ? `<div class="timeline-footer">
                                  <button class="btn btn-primary btn-sm">Update</button>
                                  <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${appointment._id}')">Cancel</button>
                                </div>` : ''}
                              </div>
                            </div>
                            <div>
                              <i class="far fa-clock bg-gray"></i>
                            </div>
                          </div>
                          
        `;
      })
    } catch (error) {
      console.log(error);
    }
  } else {
    window.location.href = "/pages/hospital/Patients.html";
  }
};

const patientUpdate = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const patientId = searchParams.get("id");
  if (patientId) {
    try {
      const firstname = document.getElementById("firstNameUpdate").value;
      const lastname = document.getElementById("lastNameUpdate").value;
      const email = document.getElementById("emailUpdate").value;
      const phonenumber = document.getElementById("phoneNumberUpdate").value;
      const gender = document.getElementById("genderUpdate").value;
      const isActive = document.getElementById("isactiveField").checked;
      const response = await axios.patch(
        BASE_URL + `/api/patients/${patientId}`,
        {
          firstname,
          lastname,
          email,
          phonenumber,
          gender,
          isActive,
        }
      );
      if (response.status === 201 || response.status === 200) {
        //  getData();
         Swal.fire({
            title: "Patient updated",
            text: "Patient updated successfully",
            icon: "success",
            confirmButtonText: "Ok",
          });

          setTimeout(() => {
            window.location.href = "/pages/hospital/Patients.html";
          }, 1000);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }
};

getPatientDetails();
