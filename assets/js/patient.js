

const TABS = ["All", "Inactive", "Active"];
let currentTab = "All";

const handleTableTabChange = (e) => {
    const tabClicked = e.srcElement.innerText;
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


const getPatients = async () => {
    if (currentTab === 'All') {
        const response = await axios.get('http://localhost:5000/api/patients')
        console.log(response.data);
    }
}

document.getElementById('table-tab-box').addEventListener('click', (e) => {
    handleTableTabChange(e);
})
document.getElementById('filter-tab-box').addEventListener('click', (e) => {
    handleFilterTabChange(e);
})
