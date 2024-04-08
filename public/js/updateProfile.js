document.getElementById('updateProfileForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    fetch('/api/members/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile: ' + data.message);
        }
    })
    .catch(error => console.error('Error updating profile:', error));
});
