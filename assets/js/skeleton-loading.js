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