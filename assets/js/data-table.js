const toggleFullscreen = () => {
    const table = document.getElementById('dataTable');
    const dataTableCustom = table.querySelector('.data-table-custom');
    dataTableCustom.style.height = '93vh';
    const tabledata = document.getElementById('tabledata');
    // tabledata.style.height = '90vh';
    console.log("HER HERE");
    if (!document.fullscreenElement) {
        table.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        console.log("Exit full screen");
        dataTableCustom.style.height = '44rem';
        document.exitFullscreen();
    }
}

document.addEventListener('fullscreenchange', (e) => {
    console.log("document.fullscreenEnabled", document.fullscreenEnabled);
    if (!document.fullscreenElement) {
        const table = document.getElementById('dataTable');
        const dataTableCustom = table.querySelector('.data-table-custom');
        dataTableCustom.style.height = '44rem';
        // if (!document.body.classList.contains('dark-mode')) {
        //     document.getElementById('page-result').classList.remove('text-light');
        //     document.getElementById('page-result').classList.add('text-dark');
        //     }
    } else {
        // if (!document.body.classList.contains('dark-mode')) {
        //     document.getElementById('page-result').classList.add('text-light');
        //     document.getElementById('page-result').classList.remove('text-dark');
        // }
    }
});

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
let selectedTab = "";

const handleFilterTabChange = (e) => {
    const clickedTab = e.srcElement.innerText;
    const filterTabs = document.getElementsByClassName('filter-table-tab');
    selectedTab = clickedTab;
    const tabIndex = FILTERTABS.indexOf(clickedTab);

    for (let i = 0; i < filterTabs.length; i++) {
        if (i === tabIndex) {
            filterTabs[i].classList.remove('filter-tab-inactive');
            filterTabs[i].classList.add('filter-tab');
        } else {
            filterTabs[i].classList.add('filter-tab-inactive');
            filterTabs[i].classList.remove('filter-tab');
        }
        if (i === tabIndex && FILTERTABS[i] === 'Select Custom Range') {
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

    if (selectedTab !== '') {
        filter.startDate = new Date(startDate).toLocaleDateString('en-US');
        filter.endDate = new Date(endDate).toLocaleDateString('en-US');
    }

    console.log("filter", filter);

    currentPage = 1;
    getData();
};

function resetFiltersAndCollapse() {
    const collapseElement = document.getElementById('collapseExample');
    if (collapseElement.classList.contains('show')) {
        const collapse = new bootstrap.Collapse(collapseElement, { toggle: false });
        collapse.hide();
    }

    const dropdownToggle = document.getElementById('filterByDropdown');
    if (dropdownToggle.getAttribute('aria-expanded') === 'true') {
        dropdownToggle.click();
    }

    const filterButtons = document.querySelectorAll('.filter-table-tab');
    filterButtons.forEach(button => {
        button.classList.add('filter-tab-inactive');
    });
}
  

document.addEventListener('DOMContentLoaded', function() {

    function displayButton(text) {
            const button = document.createElement('button');
            button.className = 'btn btn-primary mx-3';
            button.textContent = `+ ${text}`;
            button.id = 'add-btn';
            const parentDiv = document.querySelector('.d-flex.justify-content-end.align-items-center');
            const dropdownDiv = parentDiv.querySelector('.dropdown.show');
            parentDiv.insertBefore(button, dropdownDiv);
            button.addEventListener('click', () => {
                handleClickAddButton();
            })
    }

    displayButton(addBtnText);
});


const removeFilter = () => {
    filter = {
        startDate: '',
        endDate: '',
        search: '',
    }
    const searchText = document.getElementById('search-filter')
    searchText.value = '';
    currentPage = 1;
    const customDropdown = document.getElementById('custom-dropdown');
    customDropdown.classList.toggle('showDropdown');
    const filterTabs = document.getElementsByClassName('filter-table-tab');
    selectedTab = '';
    if (selectedTab == '') {
        for (let i = 0; i < filterTabs.length; i++) {
            filterTabs[i].classList.add('filter-tab-inactive');
            filterTabs[i].classList.remove('filter-tab');
        }
    }
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    startDateInput.innerHTML = '';
    endDateInput.innerHTML = '';
    getData();
}

const useDateFilter = () => {
    let dateFilter = '';
    if (filter.endDate && filter.startDate) {
        const startDate = filter.startDate;
        const endDate = filter.endDate;
        console.log("StartDate", endDate, startDate)
        dateFilter = startDate + ',' + endDate;
    }

    return dateFilter;
}

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

    console.log("here here");

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
                       <button class="page-link ${(disableBtn === 'previous' || disableBtn === 'both') ? 'bg-secondary' : 'cursor-pointer'}" ${(disableBtn === 'previous'  || disableBtn === 'both')? 'disabled' : ''} onclick="previousPage()" aria-label="Previous">
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
                       <button class="page-link ${(disableBtn === 'next' || disableBtn === 'both') ? 'bg-secondary' : 'cursor-pointer'}" ${(disableBtn === 'next' || disableBtn === 'both') ? 'disabled' : ''} onclick="nextPage()" aria-label="Next">
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
    console.log("columns page", columns);
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
    currentPage = 1;
    start = 1;
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

    console.log("Columns 2", columns);
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

const Download = async (method = '') => {
    // add logic to show only the isHidden = false columns
        const titleKeys = columns.filter(column => !column.isHidden).map((column) => column.label).filter((column) => column !== 'Action');
        const columnKeys = columns.filter(column => !column.isHidden).map((column) => column.key).filter((column) => column !== 'action');

        const refinedData = [];
        refinedData.push(titleKeys);
        const tempLimit = pageLimit;
        let tempData = data;
        if (method === 'All') {
            pageLimit = 99999;
            const response = await getApiData();
            pageLimit = tempLimit;
            tempData = response.data.data;
        }
        tempData.forEach(item => {
            const itemValues = Object.entries(item).map(([key, value]) => {
                if (columnKeys.includes(key)) {
                    return `"${value}"`;
                } else {
                    return '';
                }
            }).filter(value => value !== '');
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

const renderErrorBox = (totalRecords) => {
    console.log("Total records: " + totalRecords)
    if (totalRecords === 0) {
        const errorBox = document.getElementById('error-box');
        errorBox.innerHTML = '<p class="text-center mt-5"><em> No Result found</em></p>';
    } else {
        const errorBox = document.getElementById('error-box');
        errorBox.innerHTML = '';
    }
}

const adjustPages = (response) => {
    totalRecords = response.data.meta.totalRecords; 
    totalPages = Math.ceil(response.data.meta.totalRecords / pageLimit);
    console.log("totalPages", totalPages);
    // const pagesToRender = Math.ceil(totalRecords / pageLimit);
    renderErrorBox(totalRecords);
    if (start === 1) {
        if (totalPages>5) {
            end = 5;
        } else {
            end = totalPages;
        }
        if (totalPages === 5) {
            renderPages('both');
            return;
        }
    } else {
        if (totalPages > 5) {
            end = start + ((totalPages - start) >= 5 ? 4 : (totalPages - start));
        } else {
            end = totalPages;
        }
    }
    renderPages();
    if (start === 1 && end < 5) {
        renderPages('both');
        return;
    } 
    if (start === 1) {
        renderPages('previous');
    }
    if (end < 5) {
        renderPages('next');
    }

    if (totalPages === end) {
        renderPages('next');
    }
    
};


const adjustColumns = () => {
    columns.forEach((column, index) => {
        if (column.isHidden) {
            const key = column.key;
            const dataToHide = document.querySelectorAll(`td[data-attr="${key}"]`);

            dataToHide.forEach((data) => {
                data.style.display = 'none';
            });
        }
    });
}

const changeLimit = () => {
    pageLimit = document.getElementById('limit-select').value;
    currentPage = 1;
    start = 1;
    end =5;
    getData();

};


const initTable = () => {
    const dataTableContainer = document.getElementById('data-table-container');
    console.log("datatable", dataTableContainer);
    dataTableContainer.innerHTML = "";
    dataTableContainer.innerHTML = `
     <div id="dataTable">
              <div class="card data-table-custom p-3" id="tabledata">
                <!-- upper div -->
                <div class="d-flex justify-content-between border-bottom">
                  <!-- this is left tab div -->
                  <div id="table-tab-box">
                  </div>

                  <!-- This is right filter div -->
                  <div class="dropdown show">
                    <button class="btn btn-primary" id="filterByDropdown" data-toggle="dropdown" aria-haspopup="true"
                      aria-expanded="false">Filter By <i class="fa fa-arrow-down mx-1" style="font-size: 13px;"
                        aria-hidden="true"></i> </button>
                    <div class="custom-dropdown rounded mt-1" id="custom-dropdown" aria-labelledby="filterByDropdown">
                      <div class="p-3">
                        <h6>Filter By</h6>
                        <div>
                          <input type="text" placeholder="Search" id="search-filter" class="form-control"
                            style="padding-left: 35px;">
                          <i class="fa fa-search search-icon" aria-hidden="true"></i>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                          <span>Date</span>
                          <i class="fa fa-arrow-down cursor-pointer" data-toggle="collapse" href="#collapseExample"
                            role="button" aria-expanded="false" aria-controls="collapseExample"></i>
                        </div>
                        <div class="collapse" id="collapseExample">
                          <div class="d-flex">
                            <div class="filter-buttons" id="filter-tab-box">
                              <!-- <button class="btn btn-primary">Year to Date</button> -->
                              <button class="btn btn-primary filter-tab-inactive filter-table-tab">Year to Date</button>
                              <button class="btn btn-primary filter-tab-inactive filter-table-tab">Month to Date</button>
                              <button class="btn btn-primary filter-tab-inactive filter-table-tab">Last 90 Days</button>
                              <button class="btn btn-primary filter-tab-inactive filter-table-tab">Last 60 Days</button>
                              <button class="btn btn-primary filter-tab-inactive filter-table-tab">Last 30 Days</button>
                              <button id="date-start" class="btn btn-primary filter-tab-inactive filter-table-tab">Select Custom
                                Range</button>
                                <!-- <div id="date-range-picker" style="display: none;">
                                  <input type="text" id="date-start" placeholder="Start Date">
                                  <input type="text" id="date-end" placeholder="End Date">
                                </div> -->
                            </div>
                            <div id="custom-range-div" class="d-none">
                              <p >Start Date: <span id="start-date"></span> </p>
                              <p>End Date: <span id="end-date"></span> </p>
                            </div>
                          </div>
                        </div>
                        <div class="mt-3">
                          <button class="btn btn-block btn-primary" onclick="applyFilter()">Apply</button>
                          <button class="btn btn-block btn-secondary" onclick="resetFiltersAndCollapse(); removeFilter();">Remove All</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Middle div (download, fullscreen, density, column management) -->
                <div class="d-flex justify-content-end align-items-center my-3">
                  <div class="dropdown show">
                  
                    <i class="fa fa-columns cursor-pointer" id="columnsDropdownIcon" aria-hidden="true"
                      data-toggle="tooltip" data-placement="top" title="Hide/Show Column"></i>
                    <div class="custom-dropdown rounded mt-1" id="custom-dropdown-columns"
                      aria-labelledby="columnsDropdownIcon">
                      <div>
                        <div class="d-flex justify-content-between mx-3 mb-2 py-2">
                          <button onclick="hideAllColumns()" class="btn btn-primary" style="font-size: 14px;">HIDE
                            ALL</button>
                          <button onclick="showAllColumns()" class="btn btn-primary" style="font-size: 14px;">SHOW
                            ALL</button>
                        </div>
                      </div>
                      <div id="columns-visibilty-box">
                      </div>
                    </div>
                  </div>
                  <i class="fa fa-align-justify mx-3 cursor-pointer" aria-hidden="true" data-toggle="tooltip"
                    data-placement="top" title="Density" onclick="handleDensity()"></i>
                  <i class="fa fa-arrows-alt cursor-pointer" aria-hidden="true" data-toggle="tooltip"
                    data-placement="top" title="Full Screen" onclick="toggleFullscreen()"></i>
                  <div class="dropdown">
                    <i class="fa fa-download mx-3 bg-primary p-2 rounded cursor-pointer" aria-hidden="true"
                      data-toggle="dropdown" aria-expanded="false" data-toggle="tooltip" data-placement="top"
                      title="Download"></i>
                    <div class="dropdown-menu custom-dropdown-download-menu">
                      <a class="dropdown-item" href="#" onclick="Download()">Current</a>
                      <a class="dropdown-item" href="#" onclick="Download('All')">All</a>
                    </div>
                  </div>
                </div>

                <!-- Main Table -->
                <div class="table-responsive">
                  <table class="table table-striped" id="data-table">
                    <thead class="bg-secondary">
                      <tr id="table-columns">
                      </tr>
                    </thead>
                    <tbody id="table-body">
                    </tbody>

                  </table>
                  </div>
                  <div id="error-box">
                  
                  </div>

              </div>
              <div class="row">
                <div class="col-md-2 ">
                  <p class="text-center" id="page-result"></p>
                </div>
                <div class="col-md-8 d-flex justify-content-center">
                  <nav aria-label="Page navigation example">
                    <ul class="pagination" id="pages">
                    </ul>
                  </nav>
                </div>
                <div class="col-md-2">
                  <div class="d-flex justify-content-end">
                    <select class="form-control form-control-sm" id="limit-select" style="width: 100px;" onchange="changeLimit()">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
    `;
}

initTable();
document.getElementById('filterByDropdown').addEventListener('click', () => {
    const customDropdown = document.getElementById('custom-dropdown');
    customDropdown.classList.toggle('showDropdown');
});

document.getElementById('columnsDropdownIcon').addEventListener('click', () => {
    const customDropdown = document.getElementById('custom-dropdown-columns');
    customDropdown.classList.toggle('showDropdown');
});

document.getElementById('table-tab-box').addEventListener('click', (e) => {
    handleTableTabChange(e);
})


document.getElementById('filter-tab-box').addEventListener('click', (e) => {
    handleFilterTabChange(e);
});