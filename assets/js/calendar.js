document.addEventListener('DOMContentLoaded', () => {
    const customRangeButton = document.getElementById('custom-range-button');
    const dateRangePicker = document.getElementById('date-range-picker');
    const dateStartInput = document.getElementById('date-start');
    const dateEndInput = document.getElementById('date-end');

    // Initialize Flatpickr on the date inputs
    const dateRangeFlatpickr = flatpickr([dateStartInput, dateEndInput], {
      mode: "range",
      dateFormat: "Y-m-d",
      onChange: function(selectedDates) {
        if (selectedDates.length === 2) {
          const [startDate, endDate] = selectedDates;
          dateStartInput.value = startDate.toISOString().split('T')[0];
          dateEndInput.value = endDate.toISOString().split('T')[0];
        }
      },
      disableMobile: true // Optional: Disable mobile mode for better appearance on mobile devices
    });

    customRangeButton.addEventListener('click', () => {
      // Toggle the visibility of the date range picker container
      dateRangePicker.style.display = dateRangePicker.style.display === 'none' ? 'block' : 'none';
    });
  });