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

const getPatients = () => {
    if (currentTab === 'All') {
        // Call API of patient here using axios, use the proper BASE_URL variable to access the base url of server. ref login.js
    }
}

document.getElementById('table-tab-box').addEventListener('click', (e) => {
    handleTableTabChange(e);
})
