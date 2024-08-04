

const TABS = ["All", "Inactive", "Active"];
let currentTab = "All";
let currentPage = 1;
let totalRecords = 1023;
let pageLimit = 10;
let totalPages = Math.ceil(totalRecords / pageLimit);
console.log("Total Pages", totalPages)
let start = 1;
let end = 5;

const getPatients = async () => {
    if (currentTab === 'All') {
        const response = await axios.get(BASE_URL + '/api/patients')
        console.log(response.data);
    }
}

const renderPages = (disableBtn = '') => {
    const pagesDiv = document.getElementById('pages');

    pagesDiv.innerHTML = "";

    pagesDiv.innerHTML = `<li class="page-item">
                       <span class="page-link ${disableBtn === 'previous' ? 'bg-secondary' : 'cursor-pointer'}" ${disableBtn === 'previous' ? 'disabled' : ''} onclick="previousPage()" aria-label="Previous">
                         <span aria-hidden="true">&laquo;</span>
                       </span>
                </li> `;

    for (let i = start; i <= end; i++) {
        pagesDiv.innerHTML += `
             <li class="page-item"><span onclick="changePage(${i})" class="page-link cursor-pointer ${currentPage === i ? 'bg-primary' : ''}"> ${i} </span></li>
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
    pageResult.innerHTML = `Showing ${pageRecord - 9} of ${pageRecord} out of ${totalRecords}`
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

const buttonToDisable = () => {
    if (end === totalPages) {
        return 'next';
    }

    if (end <= 5) {
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

renderPages();

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

document.getElementById('table-tab-box').addEventListener('click', (e) => {
    handleTableTabChange(e);
})
document.getElementById('filter-tab-box').addEventListener('click', (e) => {
    handleFilterTabChange(e);
})
