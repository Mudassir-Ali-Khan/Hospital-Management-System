document.getElementById('filterByDropdown').addEventListener('click', () => {
    const customDropdown = document.getElementById('custom-dropdown');
    customDropdown.classList.toggle('showDropdown');
});

document.getElementById('columnsDropdownIcon').addEventListener('click', () => {
    const customDropdown = document.getElementById('custom-dropdown-columns');
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

let density = 'py-2';

const handleDensity = () => {
    switch(density) {
        case 'py-2':
            density = 'py-3';
            break;
        case 'py-3':
            density = 'py-4';
            break;
        case 'py-4':
            density = 'py-5';
            break;
        case 'py-5':
            density = 'py-2';
            break;
    }

    // The code to add density in all "td"
    const tds = document.querySelectorAll('#dataTable td'); // look td which exists in datatable
    tds.forEach(td => td.classList.remove('py-3', 'py-2', 'py-4', 'py-5'));
    tds.forEach(td => td.classList.add(density));
}

// data table variables
let currentPage = 1;
let totalRecords = 0;
let pageLimit = 10;
let totalPages = 1;
let start = 1;
let end = 0;
let sortOrder = '';
let sortColumn = '';
let genderTab = '';
let data = [];

// logics of filters
let filter = {
    startDate: '',
    endDate: '',
    search: '',
}
const FILTERTABS = ["Year to Date", "Month to Date", "Last 90 Days", "Last 60 Days", "Last 30 Days", "Select Custom Range"];
let selectedTab = "Year to Date";

const handleFilterTabChange = (e) => {
    const clickedTab = e.srcElement.innerText;
    selectedTab = clickedTab;
    const tabIndex = FILTERTABS.indexOf(clickedTab);

    const filterTabs = document.getElementsByClassName('filter-table-tab');
    for (let i = 0; i < filterTabs.length; i++) {
        if (i === tabIndex) {
            filterTabs[i].classList.remove('filter-tab-inactive');
            filterTabs[i].classList.add('filter-tab');
        } else {
            filterTabs[i].classList.add('filter-tab-inactive');
            filterTabs[i].classList.remove('filter-tab');
        }
        if (i === tabIndex && FILTERTABS[i] === 'Select Custom Range') {
            console.log("Here");
            const customRangeDiv = document.getElementById('custom-range-div');
            customRangeDiv.classList.add('d-block');
            customRangeDiv.classList.remove('d-none');
        } else {
            const customRangeDiv = document.getElementById('custom-range-div');
            customRangeDiv.classList.add('d-none');
            customRangeDiv.classList.remove('d-block');
        }

    }
};

const setDate = (date, month, hours, minutes, seconds) => {
    let currentDate = new Date();
    currentDate.setDate(date);
    currentDate.setMonth(month);
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(seconds);

    return currentDate;
}

const applyFilter = () => {
    let startDate = '', endDate = '';
    const searchText = document.getElementById('search-filter').value
    filter.search = searchText;

    if (selectedTab === 'Year to Date') {
        startDate = setDate(1, 0,0, 0,0);
        const todayDate = new Date();
        endDate = todayDate;
    } else if (selectedTab === 'Month to Date') {
        const todayDate = new Date();
        startDate = setDate(1, todayDate.getMonth(), 0, 0, 0);
        endDate = todayDate;
    } else if (selectedTab === 'Last 90 Days') {
        const todayDate = new Date();
        let last90Day = todayDate.setDate(todayDate.getDate() - 90);
        let last90DayDate = new Date(last90Day);
        last90DayDate.setHours(0); last90DayDate.setMinutes(0); last90DayDate.setSeconds(0);
        startDate = last90DayDate;
        endDate = new Date();
        // console.log(new Date(new Date().setDate(new Date().getDate() - 90)))
    } else if (selectedTab === 'Last 60 Days') {
        const todayDate = new Date();
        let last60Day = todayDate.setDate(todayDate.getDate() - 60);
        let last60DayDate = new Date(last60Day);
        last60DayDate.setHours(0); last60DayDate.setMinutes(0); last60DayDate.setSeconds(0);
        startDate = last60DayDate;
        endDate = new Date();
        // console.log(new Date(new Date().setDate(new Date().getDate() - 90)))
    } else if (selectedTab === 'Last 30 Days') {
        const todayDate = new Date();
        let last30Day = todayDate.setDate(todayDate.getDate() - 30);
        let last30DayDate = new Date(last30Day);
        last30DayDate.setHours(0); last30DayDate.setMinutes(0); last30DayDate.setSeconds(0);
        startDate = last30DayDate;
        endDate = new Date();
        // console.log(new Date(new Date().setDate(new Date().getDate() - 90)))
    } else if (selectedTab == 'Select Custom Range') {
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        startDate = new Date(startDateInput.innerHTML);
        endDate = new Date(endDateInput.innerHTML);
        if (startDate > endDate) {
            alert('Start date should be less than or equal to end date');
            return;
        }
        // console.log(startDateInput.value, endDateInput.value);
    }

    filter.startDate = startDate;
    filter.endDate = endDate;

    console.log("filter", filter);
};

const renderTabs = () => {
    const tabsBox = document.getElementById('table-tab-box');
    TABS.forEach((tab, index) => {
        if (index === 0) {
            tabsBox.innerHTML += ` <button class="btn btn-primary custom-tab table-tab">${tab}</button>`
        } else {
            tabsBox.innerHTML += `<button class="btn btn-primary custom-tab-inactive table-tab">${tab}</button>`
        }
    })
}

const renderColumns = () => {
    const tableColumns = document.getElementById('table-columns');
    tableColumns.innerHTML = "";

    // column.key === sortColumn , sortOrder == 'asc' ==> fa-sort-up otherwise fa-sort-down ==> if only sortable is true then show fa-sort

    columns.forEach((column, index) => {
      if (column.key !== 'action') {
          tableColumns.innerHTML += `
                <th onclick="changeSort('${column.key}')">${column.label} ${column.sortable ? `<i class="fas fa-sort ${column.key === sortColumn ? sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down' : '' } "></i>` : ''}</th>
            `;
      }
    })

    if (columns[ columns.length - 1].key === 'action' ) {
        tableColumns.innerHTML += `
            <th>Action</th>
        `;
    }
}

const renderPages = (disableBtn = '') => {
    const pagesDiv = document.getElementById('pages');

    pagesDiv.innerHTML = "";


    console.log("disableBtn", disableBtn);

    // previous button
    pagesDiv.innerHTML = `<li class="page-item">
                       <button class="page-link ${disableBtn === 'previous' ? 'bg-secondary' : 'cursor-pointer'}" ${disableBtn === 'previous' ? 'disabled' : ''} onclick="previousPage()" aria-label="Previous">
                         <span aria-hidden="true">&laquo;</span>
                       </button>
                </li> `;

    for (let i = start; i <= end; i++) {
        pagesDiv.innerHTML += `
             <li style="width: 50px;" class="page-item"><span onclick="changePage(${i})" class="page-link cursor-pointer text-center ${currentPage === i ? 'bg-primary' : ''}"> ${i} </span></li>
        `;
    }

    // next button
    pagesDiv.innerHTML += `<li class="page-item">
                       <button class="page-link ${(disableBtn === 'next') ? 'bg-secondary' : 'cursor-pointer'}" ${(disableBtn === 'next') ? 'disabled' : ''} onclick="nextPage()" aria-label="Next">
                         <span aria-hidden="true">&raquo;</span>
                       </button>
                     </li> `;
    updatePageResult();
};

const updatePageResult = () => {
    const pageResult = document.getElementById('page-result');
    const pageRecord = currentPage * pageLimit;
    if (currentPage === totalPages) {
        pageResult.innerHTML = `Showing ${pageRecord - (pageLimit - 1)} of ${totalRecords} out of ${totalRecords}`;
    } else {
        pageResult.innerHTML = `Showing ${pageRecord - (pageLimit - 1)} of ${pageRecord} out of ${totalRecords}`;
    }
}

const nextPage = () => {
    start = end + 1;
    if ((end + 5) > totalPages)  {
        end = totalPages;
    } else {
        end = end + 5;
    }
    currentPage = start;
    renderPages(buttonToDisable());
    getData();
}

const previousPage = () => {
    end = start - 1;
    start = start - 5;
    if (start < 1) {
        start = 1;
    }
    currentPage = end;

    renderPages(buttonToDisable());
    getData();
}

const buttonToDisable = () => {
    if (start === 1) {
        return 'previous';
    }

    if (end === totalPages || end <= 5) {
        return 'next';
    }

    // TODo ADD condition to disable previous button
    return '';
}

const changePage = (page) => {
    console.log("pagepage", page);
    if (page === currentPage) {
        return;
    }
    currentPage = page;
    renderPages(buttonToDisable());
    getData();
}

const changeSort = (key) => {

    if (columns.find(el => el.key === key).sortable === false) {
        return;
    }
    sortColumn = key;
    if (sortOrder === '') {
        sortOrder = 'asc';
    } else {
        if (sortOrder === 'asc') {
            sortOrder = 'desc';
        } else if (sortOrder === 'desc') {
            sortOrder = 'asc';
        }
    }

    data.sort((first, second) => {
        if (sortOrder === 'asc') {
            if (first[key] > second[key]) {
                return 1;
            } else {
                return -1;
            }
        }

        if (sortOrder === 'desc') {
            if (first[key] < second[key]) {
                return 1;
            } else {
                return -1;
            }
        }
    })
    // 1, -1, 0
    renderColumns();
    renderData();
}

const handleTableTabChange = (e) => {
    const tabClicked = e.srcElement.innerText;
    if (tabClicked === currentTab) {
        return;
    }
    currentTab = tabClicked;
    // console.log("tabClicked", tabClicked);
    const tabIndex = TABS.indexOf(tabClicked); // index, -1;
    const tabValue = TABS[tabIndex];

    if (tabValue === "All") {
        genderTab = ""; 
    } else {
        genderTab = tabValue; 
    }
    console.log("Selected genderTab:", genderTab);
    
    const tableTabs = document.getElementsByClassName('table-tab');
    // console.log("tableTabs", tableTabs);

    for (let i = 0; i < tableTabs.length; i++) {
        // console.log("tableTabs", tableTabs[i]);
        if (i === tabIndex) {
            tableTabs[i].classList.remove('custom-tab-inactive');
            tableTabs[i].classList.add('custom-tab');
        } else {
            tableTabs[i].classList.add('custom-tab-inactive');
            tableTabs[i].classList.remove('custom-tab');
        }
    }

    getData();
};

const toggleColumnVisibility = (columnIndex) => {

    columns[columnIndex].isHidden = !columns[columnIndex].isHidden;


    const table = document.getElementById('data-table');
    const rows = table.rows;
    
    for (let i = 0; i < rows.length; i++) {
        const cell = rows[i].cells[columnIndex];
        if (columns[columnIndex].isHidden) {
            cell.style.display = 'none';
        } else {
            cell.style.display = '';
        }
    }
};

const renderToggleButtons = () => {
    const toggleButtonBox = document.getElementById('columns-visibilty-box');

    columns.forEach((column, index) => {
        if (column.key !== 'action') {
            toggleButtonBox.innerHTML += `
                <a class="dropdown-item d-flex align-items-center" href="#">
                            <label class="toggle-button mt-1">
                                <input type="checkbox" class="column-toggle-checkbox" id="toggle-${column.key}" onclick="toggleColumnVisibility('${index}')" checked>
                                <span class="knob"></span>
                            </label>
                            <span class="toggle-text mb-1">${column.label}</span>
              </a> 
            `
        }
    })
}

const hideAllColumns = () => {
    columns.forEach((column, index) => {
        column.isHidden = true;
        const checkBox = document.getElementById(`toggle-${column.key}`);
        checkBox.checked = false;
        
        const table = document.getElementById('data-table');
        const rows = table.rows;

        for (let i = 0; i < rows.length; i++) {
            const cell = rows[i].cells[index];
            cell.style.display = 'none';
        }
    });
};

const showAllColumns = () => {
    columns.forEach((column, index) => {
        column.isHidden = false;
        const checkBox = document.getElementById(`toggle-${column.key}`);
        checkBox.checked = true;

        const table = document.getElementById('data-table');
        const rows = table.rows;

        for (let i = 0; i < rows.length; i++) {
            const cell = rows[i].cells[index];
            cell.style.display = '';
        }
    });
};

const Download = () => {
    // add logic to show only the isHidden = false columns
        const titleKeys = columns.map((column) => column.label).filter((column) => column !== 'Action')
        const refinedData = [];
        refinedData.push(titleKeys);
        data.forEach(item => {
            const itemValues = Object.values(item).map(value => {
                return `"${value}"`;
            });
            refinedData.push(itemValues);  
        });
    
        let csvContent = '';
        refinedData.forEach(row => {
            csvContent += row.join(',') + '\n';
        });
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const objUrl = URL.createObjectURL(blob);
    
        const link = document.createElement("a");
        link.href = objUrl;
        link.download = "data.csv";
        link.click();
    };


document.getElementById('table-tab-box').addEventListener('click', (e) => {
    handleTableTabChange(e);
})


document.getElementById('filter-tab-box').addEventListener('click', (e) => {
    handleFilterTabChange(e);
})