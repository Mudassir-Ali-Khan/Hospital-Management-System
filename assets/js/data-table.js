document.getElementById('filterByDropdown').addEventListener('click', () => {
    const customDropdown = document.getElementById('custom-dropdown');
    customDropdown.classList.toggle('showDropdown');
});

const toggleFullscreen = () => {
    const table = document.getElementById('dataTable');
    if (!document.fullscreenElement) {
        table.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}