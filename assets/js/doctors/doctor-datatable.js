const TABS = ["All", "Male", "Female", "Bigender", "Polygender", "Non-binary", "Other"];
let currentTab = "All";
let addBtnText = "Add Doctor";
const closeBtn = document.getElementById('closeBtn');
const errorBox = document.getElementById('error');

let columns = [
    { label: 'First Name', key: 'firstname', sortable: true, isHidden: false },
    { label: 'Last Name', key: 'lastname', sortable: true, isHidden: false  },
    { label: 'Email', key: 'email', sortable: true, isHidden: false },
    { label: 'PMC', key: 'PMC', sortable: true, isHidden: false },
    { label: 'Qualification', key: 'qualification', sortable: true, isHidden: false },
    { label: 'Phone Number', key: 'phonenumber', sortable: false, isHidden: false  },
    { label: 'Gender', key: 'gender', sortable: false, isHidden: false },
    { label: 'Action', key: 'action', sortable: false, isHidden: false },
];

const getData = async () => {
        try {
            showSkeletonLoading();
            const response = await getApiData();
            data = response.data.data; // data, meta, this line will change.
            renderData();
            adjustPages(response);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
};

const getApiData = async () => {
    try {
        const dateFilter = useDateFilter();
        const response = await axios.get(BASE_URL + `/api/doctors?page=${currentPage}&limit=${pageLimit}&status=${genderTab}&search=${filter.search}&dateFilter=${dateFilter}`);
        return response;
    } catch (error) {
        return error.response;
    }
}

// this will change as per data
const renderData = () => {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = "";

    data.forEach((element, index) => {
       tableBody.innerHTML += `
        <tr>
            <td data-attr="firstname"> <span>${element.firstname}</span>  </td>
            <td data-attr="lastname"> <span>${element.lastname}</span>   </td>
            <td data-attr="email"> <span>${element.email}</span>  </td>
            <td data-attr="pmc"> <span>${element.PMC}</span>  </td>
            <td data-attr="qualification"> <span>${element.qualification}</span>  </td>
            <td data-attr="phonenumber"> <span> ${element.phonenumber}</span>  </td>
            <td data-attr="gender"> <span>${element.gender}</span> </td>

            ${ columns[ columns.length - 1].key === 'action' ? ` <td class="">
                <div class="dropdown">
                    <i class="fa fa-ellipsis-h cursor-pointer" aria-hidden="true" data-toggle="dropdown"
                    aria-expanded="false" data-toggle="tooltip" data-placement="top" title="Action"></i>
                    <div class="dropdown-menu">
                    <a class="dropdown-item" href="/pages/hospital/DoctorsProfile.html?id=${element._id}">Details</a>
                    </div>
                </div>
            </td>` : '' }

        </tr>
       `
    });

    adjustColumns();
};

const handleClickAddButton = () => {
    // this function will be called when clicked on the add button
    console.log("Clicked add button");
    const addBtn = document.getElementById('add-btn');
    addBtn.setAttribute('data-toggle', 'modal');
    addBtn.setAttribute('data-target', '#add-new-user-modal');
};

const clearAddForm = () => {
    document.getElementById('doctorfirstname').value = '';
    document.getElementById('doctorlastname').value = '';
    document.getElementById('doctoremail').value = '';
    document.getElementById('doctorpassword').value = '';
    document.getElementById('doctorpmc').value = '';
    document.getElementById('doctorqualification').value = '';
    document.getElementById('doctornumber').value = '';
    document.getElementById('doctorgender').value = '';
};

const handleSubmit = async () => {
    const firstname = document.getElementById('doctorfirstname').value;
    const lastname = document.getElementById('doctorlastname').value;
    const email = document.getElementById('doctoremail').value;
    const password = document.getElementById('doctorpassword').value;
    const PMC = document.getElementById('doctorpmc').value;
    const qualification = document.getElementById('doctorqualification').value;
    const phonenumber = document.getElementById('doctornumber').value;
    const gender = document.getElementById('doctorgender').value;

    if (firstname === '' || lastname === '' || email === ''  || password === ''  || qualification === '' || PMC === '' || phonenumber === '' || gender === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill all the fields',
            icon: 'error',
            confirmButtonText: 'Ok'
          });    
        return;
    }
    
   try {
        const response = await axios.post(BASE_URL + `/api/doctors`, {
            firstname,
            lastname,
            email,
            PMC,
            qualification,
            password,
            phonenumber,
            gender
        });
        if (response.status === 201 || response.status === 200) {
            clearAddForm();
            closeBtn.click();
            getData();
        }
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          });   
    }

    // if resp.status === 200 close the modal and call the function getData();
}

const checkForAdmin = async () => {
    // grab the authUser from locatstorage and check if it's an admin then show the table otherwise logout the user
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    if (authUser && authUser.user && authUser.user.isAdmin) {
        document.getElementById('data-table-container').style.display = 'block';
    } else {
        localStorage.removeItem('authUser');
        window.location.href = '/pages/hospital/login.html';
    }
 }

// this won't be change
const init = () => {
    checkForAdmin();
    renderColumns();

    // showSkeletonLoading();

    renderTabs();
    renderToggleButtons();

    getData();
};

init();