const loadProfile = () => {
    const user = JSON.parse(localStorage.getItem('authUser'));
    let fullName = '';

    if (user.user.isAdmin === true) {
        fullName = user.user.fullname;
    } else {
        fullName = user.user.firstName + ' ' + user.user.lastName;
    }

    const infoDiv = document.getElementsByClassName('info')[0];

    infoDiv.innerHTML = `<a href="#" class="d-block">${fullName}</a>`
}

loadProfile();