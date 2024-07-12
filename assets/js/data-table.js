document.getElementById('filterByDropdown').addEventListener('click', () => {
    const customDropdown = document.getElementById('custom-dropdown');
    customDropdown.classList.toggle('showDropdown');
});

const toggleFullscreen = () => {
    const table = document.getElementById('dataTable');
    const tabledata = document.getElementById('tabledata');
    // tabledata.style.height = '90vh';
    if (!document.fullscreenElement) {
        table.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        // tabledata.style.height = '0px';
        document.exitFullscreen();
    }
}

let density = 'py-3';

const handleDensity = () => {
    switch(density) {
        case 'py-3':
            density = 'py-2';
            break;
        case 'py-2':
            density = 'py-4';
            break;
        case 'py-4':
            density = 'py-5';
            break;
        case 'py-5':
            density = 'py-3';
            break;
    }

    // The code to add density in all "td"
    const tds = document.querySelectorAll('td'); // look td which exists in datatable
    tds.forEach(td => td.classList.remove('py-3', 'py-2', 'py-4', 'py-5'));
    tds.forEach(td => td.classList.add(density));
}