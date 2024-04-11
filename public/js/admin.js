document.getElementById('createFitnessClassForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(this);
  const admin_id = formData.get('admin_id');
  const name = formData.get('name');
  const room_id = formData.get('room_id');
  const trainer_id = formData.get('trainer_id');
  const start_time = formData.get('start_time');
  const end_time = formData.get('end_time');
  const capacity = formData.get('capacity');

  fetch('/api/fitnessClass', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, room_id, trainer_id, start_time, end_time, capacity, admin_id })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert('Successfully joined the fitness class!');
          location.reload(); // Optionally reload the page or redirect
      } else {
          alert('Failed to join class: ' + data.message);
      }
  })
  .catch(error => console.error('Error joining class:', error));
});



// Function to update a class based on the form input
function updateClass(classId) {
    const form = document.querySelector(`form[data-class-id='${classId}']`);
    const formData = new FormData(form);
    const classData = Object.fromEntries(formData);

    fetch(`/api/fitnessClass/update/${classId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(classData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Class updated successfully!');
        } else {
            alert('Failed to update class: ' + data.message);
        }
    })
    .catch(error => console.error('Error updating class:', error));
}

// Function to delete a class
function deleteClass(classId) {
    fetch(`/api/fitnessClass/delete/${classId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Class deleted successfully!');
            document.querySelector(`form[data-class-id='${classId}']`).remove();
        } else {
            alert('Failed to delete class: ' + data.message);
        }
    })
    .catch(error => console.error('Error deleting class:', error));
}

function formatDateTime(dateTimeStr) {
    // Create a new Date object using the date-time string
    const date = new Date(dateTimeStr);

    // Adjust the date-time from UTC to the local timezone
    // getTimezoneOffset returns the difference in minutes between UTC and the local time zone,
    // which we convert to milliseconds to adjust the date.
    const userTimezoneOffset = date.getTimezoneOffset() * 60000; // Convert to milliseconds

    // Create a new Date object adjusted for the local time zone
    const localDate = new Date(date.getTime() - userTimezoneOffset);

    // Format the local date to the datetime-local input format (YYYY-MM-DDTHH:MM)
    return localDate.toISOString().slice(0, 16);
}

function submitRoomBookingForm() {
    event.preventDefault();  
    
    const form = document.getElementById('roomBookingForm');
    const formData = new FormData(form);

    // Constructing a JSON object from the form data
    const data = {
        room_id: formData.get('room_id'),
        start_time: formData.get('start_time'),
        end_time: formData.get('end_time'),
        purpose: formData.get('purpose'),
        admin_id: formData.get('admin_id')
    };

    fetch('/api/admin/bookRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify(data)  // Convert the JavaScript object to a JSON string
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Room booked successfully!');
            form.reset();  // Reset the form fields after successful submission
        } else {
            alert('Failed to book room: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error booking room:', error);
        alert('Error booking room: ' + error.message);
    });
}