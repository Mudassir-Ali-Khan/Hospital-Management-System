const TABS = ["All", "Male", "Female", "Transgender", "Other"];
let currentTab = "All";
let currentPage = 1;
let totalRecords = 1023;
let pageLimit = 10;
let totalPages = Math.ceil(totalRecords / pageLimit);
let start = 1;
let end = 5;
let sortOrder = '';
let sortColumn = '';

const columns = [
    { label: 'First Name', key: 'firstname', sortable: true, isHidden: false },
    { label: 'Last Name', key: 'lastname', sortable: true, isHidden: false  },
    { label: 'Email', key: 'email', sortable: true, isHidden: false },
    { label: 'Phone Number', key: 'phonenumber', sortable: false, isHidden: false  },
    { label: 'Gender', key: 'gender', sortable: false, isHidden: false },
    { label: 'Action', key: 'action', sortable: false, isHidden: false },
]

// const data = [
    
//     { firstname: 'User', lastname: 'User lstname', email: 'rayyan2@gmail.com', phonenumber: '123123123', gender: 'male' },
//     { firstname: 'Mudassir', lastname: 'Mouazam', email: 'rayyan3@gmail.com', phonenumber: '123123123', gender: 'male' },
//     { firstname: 'John', lastname: 'Doe', email: 'rayyan4@gmail.com', phonenumber: '123123123', gender: 'male' },
//     { firstname: 'Rayyan', lastname: 'Irfan', email: 'rayyan5@gmail.com', phonenumber: '123123123', gender: 'male' },
// ]


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


let filter = {
    startDate: '',
    endDate: '',
    search: '',
}

const getPatients = async () => {
    if (currentTab === 'All') {
        try {
            const response = await axios.get(BASE_URL + '/api/patients');
            const patients = response.data;
            data = patients;
            renderData();
            totalRecords = data.length; 
            totalPages = Math.ceil(totalRecords / pageLimit);
            renderPages(buttonToDisable());
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    }
};



const renderPages = (disableBtn = '') => {
    const pagesDiv = document.getElementById('pages');

    pagesDiv.innerHTML = "";

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

    pagesDiv.innerHTML += `<li class="page-item">
                       <button class="page-link ${disableBtn === 'next' ? 'bg-secondary' : 'cursor-pointer'}" ${disableBtn === 'next' ? 'disabled' : ''} onclick="nextPage()" aria-label="Next">
                         <span aria-hidden="true">&raquo;</span>
                       </button>
                     </li> `;
    updatePageResult();
};

const updatePageResult = () => {
    const pageResult = document.getElementById('page-result');
    const pageRecord = currentPage * 10;
    if (currentPage === totalPages) {
        pageResult.innerHTML = `Showing ${pageRecord - 9} of ${totalRecords} out of ${totalRecords}`;
    } else {
        pageResult.innerHTML = `Showing ${pageRecord - 9} of ${pageRecord} out of ${totalRecords}`;
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
    renderPages(buttonToDisable())
}

const previousPage = () => {
    end = start - 1;
    start = start - 5;
    if (start < 1) {
        start = 1;
    }
    currentPage = end;

    renderPages(buttonToDisable())
}

console.log("start end", start, end);

const buttonToDisable = () => {
    if (end === totalPages) {
        return 'next';
    }

    if (start === 1) {
        return 'previous';
    }
    // TODo ADD condition to disable previous button
    return '';
}

const changePage = (page) => {
    console.log("pagepage", page);
    currentPage = page;
    renderPages(buttonToDisable())


    // if (currentPage < 1) currentPage = 1;
    // if (currentPage > totalPages) currentPage = totalPages;
    // start = (currentPage - 1) * pageLimit + 1;
    // end = start + pageLimit - 1;
    // if (end > totalRecords) end = totalRecords;
    // renderPages();
    // getPatients();
}


const changeSort = (key) => {

    if (columns.find(el => el.key === key).sortable === false) {
        return;
    }
    console.log("Key", key);
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


const renderColumns = () => {
    const tableColumns = document.getElementById('table-columns');
    tableColumns.innerHTML = "";

    // columns.forEach(function (element) {

    // })

    // fa-sort-up
    // fa-sort-down

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

    // columns.forEach((column, index) => {
    //     tableColumns.innerHTML += `
    //         <th onclick="sortTable(${index})">${column.label} ${column.sortable? `<i class="fas fa-sort ${column.key === sortColumn? sortOrder === 'asc'? 'fa-sort-up' : 'fa-sort-down' : ''}"></i>` : ''}</th>
    //     `;
    // });
}

const renderData = () => {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = "";

    data.forEach((element, index) => {
       tableBody.innerHTML += `
        <tr>
            <td> <span>${element.firstname}</span>  </td>
            <td> <span>${element.lastname}</span>   </td>
            <td> <span>${element.email}</span>  </td>
            <td> <span> ${element.phonenumber}</span>  </td>
            <td> <span>${element.gender}</span> </td>

            ${ columns[ columns.length - 1].key === 'action' ? ` <td class="">
                <div class="dropdown">
                    <i class="fa fa-ellipsis-h cursor-pointer" aria-hidden="true" data-toggle="dropdown"
                    aria-expanded="false" data-toggle="tooltip" data-placement="top" title="Action"></i>
                    <div class="dropdown-menu">
                    <a class="dropdown-item" href="#">Edit</a>
                    <a class="dropdown-item" href="#">Details</a>
                    </div>
                </div>
            </td>` : '' }

        </tr>
       `
    })
}

const showSkeletonLoading = () => {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = "";

    for (let i = 0; i < 12; i++) {
        tableBody.innerHTML += `
        <tr>
            <td> <h6 class="skeleton-loading">1</h6>  </td>
            <td> <h6 class="skeleton-loading">123123</h6>  </td>
            <td> <h6 class="skeleton-loading">123123</h6>  </td>
            <td> <h6 class="skeleton-loading">123123</h6>  </td>
            <td> <h6 class="skeleton-loading">123123</h6>  </td>
            <td> <h6 class="skeleton-loading">123123</h6>  </td>
        </tr>
       `
    }
}

renderPages(buttonToDisable('previous'));
renderColumns();

showSkeletonLoading();

setTimeout(() => {
    renderData();
}, 3000)

renderTabs();
renderToggleButtons();


getPatients();

const handleTableTabChange = (e) => {
    const tabClicked = e.srcElement.innerText;
    if (tabClicked === currentTab) {
        return;
    }
    currentTab = tabClicked;
    // console.log("tabClicked", tabClicked);
    const tabIndex = TABS.indexOf(tabClicked); // index, -1;
    // console.log(tabIndex);
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

    getPatients();
};

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
    }

    filter.startDate = startDate;
    filter.endDate = endDate;

    console.log("filter", filter);
};

document.getElementById('table-tab-box').addEventListener('click', (e) => {
    handleTableTabChange(e);
})
document.getElementById('filter-tab-box').addEventListener('click', (e) => {
    handleFilterTabChange(e);
})
