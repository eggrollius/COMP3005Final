document.getElementById('bookTrainingSessionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
  
    const formData = new FormData(this);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      trainerId: formData.get('trainerId'),
      sessionDate: formData.get('sessionDate'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime')
    };
  
    fetch('/api/members/book-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Session booked successfully!');
        } else {
            alert('Failed to book session: ' + data.error);
        }
    })
    .catch(error => console.error('Error booking session:', error));
  });
  