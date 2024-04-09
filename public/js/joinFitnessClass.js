document.getElementById('joinFitnessClassForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(this);
  const classId = formData.get('classId');
  const email = formData.get('email');
  const password = formData.get('password');

  fetch('/api/members/join-class', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ classId, email, password })
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
