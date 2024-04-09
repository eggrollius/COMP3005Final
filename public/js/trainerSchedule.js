let loggedInTrainerId; 

document.getElementById('trainerLoginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('/api/trainers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loggedInTrainerId = data.trainerId;  // Store the trainerId globally
            displayAvailability(loggedInTrainerId);
            document.getElementById('availabilitySection').style.display = 'block';
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error logging in trainer:', error));
});

document.getElementById('addAvailabilityForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    formData.append('trainerId', loggedInTrainerId);
    fetch('/api/trainers/add-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Availability added successfully');
            displayAvailability(loggedInTrainerId);
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error adding availability:', error));
});

function displayAvailability(trainerId) {
    fetch(`/api/trainers/availability?trainerId=${trainerId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const availabilityList = document.getElementById('availabilityList');
            availabilityList.innerHTML = data.availabilities.map(av => `
                <div>
                    From: ${av.available_from}, To: ${av.available_to}
                    <button onclick="removeAvailability(${av.availability_id})">Remove</button>
                </div>
            `).join('');
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error fetching availabilities:', error));
}

function removeAvailability(availabilityId) {
    fetch(`/api/trainers/remove-availability?availabilityId=${availabilityId}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Availability removed successfully');
            displayAvailability(loggedInTrainerId);
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error removing availability:', error));
}
