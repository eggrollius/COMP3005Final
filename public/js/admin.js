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

    fetch(`/api/classes/update/${classId}`, {
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
    fetch(`/api/classes/delete/${classId}`, {
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
