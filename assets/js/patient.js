const TABS = ["All", "Male", "Female", "Bigender", "Polygender", "Non-binary", "Other"];
let currentTab = "All";

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

const getData = async () => {
        try {
            // /api/patients?page=1&limit=10
            showSkeletonLoading();
            const response = await axios.get(BASE_URL + `/api/patients?page=${currentPage}&limit=${pageLimit}status=${genderTab} : ''`);
            const patients = response.data.data; // data, meta
            data = patients;
            renderData();
            totalRecords = response.data.meta.totalRecords; 
            totalPages = Math.ceil(response.data.meta.totalRecords / pageLimit);
            const pagesToRender = Math.ceil(totalRecords / pageLimit);
            if (start === 1) {
                end = 5;
            } else {
                console.log("pagesToRender", pagesToRender);
                // end = pagesToRender > 5 ? 5 : pagesToRender;
            }
            renderPages(buttonToDisable('previous'));
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
};


// this will change as per data
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

// this won't be change
const init = () => {
    renderColumns();

    // showSkeletonLoading();

    renderTabs();
    renderToggleButtons();

    getData();
}

init();