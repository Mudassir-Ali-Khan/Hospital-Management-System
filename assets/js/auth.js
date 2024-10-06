const checkForLogin = () => {
    const authUser = localStorage.getItem('authUser'); // data // null
    if (authUser !== null) {
        if (window.location.pathname.includes('/login.html')) {
            window.location.href = '/index.html';
        }
    } else {
        if (!window.location.pathname.includes('/login.html')) {
            window.location.href = '/pages/hospital/login.html';
        }
    }
}

checkForLogin();

const logout = () => {
    localStorage.removeItem('authUser');
    window.location.href = '/index.html';
}