function deleteEquipment(equipmentId) {
  event.preventDefault(); // Prevent default form submission behavior
  const form = document.getElementById(`equipmentDeleteForm-${equipmentId}`);
  const actionUrl = `/api/equipment/delete/${equipmentId}`;

  fetch(actionUrl, {
      method: 'DELETE'
  }).then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error('Something went wrong on API server!');
      }
  }).then(response => {
      console.log('Success:', response);
      alert('Equipment deleted!');
      form.style.display = 'none';
  }).catch(error => {
      console.error('Error:', error);
      //alert('Failed to delete equipment');
  });
}


function updateEquipmentStatus(equipmentId, formId) {
  event.preventDefault(); // Prevent default form submission behavior
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const jsonData = {
      type: formData.get('type'),
      status: formData.get('status')
  };

  fetch(`/api/equipment/update/${equipmentId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
  }).then(response => {
      if (response.ok) {
          return response.json(); // Process the response if you need to use it
      } else {
          throw new Error('Something went wrong on API server!');
      }
  }).then(response => {
      console.log('Success:', response);
      alert('Equipment status updated!');
  }).catch(error => {
      console.error('Error:', error);
      alert('Failed to update equipment status');
  });
}

function createNewEquipment() {
  // Get the values from the form
  const type = document.getElementById('equipmentType').value;
  const status = document.getElementById('equipmentStatus').value;

  // Construct the JSON payload
  const jsonData = {
      type: type,
      status: status
  };

  // Send the data using fetch
  fetch('/api/equipment/add', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
  }).then(response => {
      if (response.ok) {
          return response.json(); // or process text if the response is not JSON
      }
      throw new Error('Network response was not ok.');
  }).then(data => {
      console.log('Success:', data);
      alert('Equipment added successfully!');
      // Optionally reset the form or update the UI
      document.getElementById('equipmentType').value = '';
      document.getElementById('equipmentStatus').value = 'operational'; // Reset to default
  }).catch((error) => {
      console.error('Error:', error);
      alert('Error adding equipment');
  });
}

// Event listener for updating equipment status
document.getElementById('equipmentList').addEventListener('submit', function(event) {
event.preventDefault();
const formElement = event.target;
const equipmentId = formElement.dataset.equipmentId;
if (formElement.classList.contains('equipmentForm')) {
    updateEquipmentStatus(equipmentId, formElement);
}
});

// Event listener for adding new equipment
document.getElementById('createFitnessClassForm').addEventListener('submit', function(event) {
event.preventDefault();
const formElement = event.target;
createNewEquipment(formElement);
});
