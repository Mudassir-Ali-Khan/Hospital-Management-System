const showSkeletonLoading = () => {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = "";

    for (let i = 0; i < 12; i++) {
        tableBody.innerHTML += `
        <tr>
          ${columns.filter(column => !column.isHidden).map(column => `<td> <h6 class="skeleton-loading">${column.key}</h6>  </td>`)}
        </tr>
       `.replaceAll(',','')
    }
}