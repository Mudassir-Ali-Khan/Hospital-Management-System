const themCheckboxMethod = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.className.includes('dark-mode') ? 'dark' : 'light');
};

const loadTheme = () => {
    const theme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');

    if (theme === 'light') {
        themeToggle.removeAttribute('checked');
        document.body.classList.remove('dark-mode');
    } else {
        themeToggle.setAttribute('checked', 'true');
        document.body.classList.add('dark-mode');
    }
}

loadTheme();