document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to the container that holds all sessions forms
    const sessionsContainer = document.getElementById('trainingSessionsContainer');

    sessionsContainer.addEventListener('click', function(event) {
        // Delegate the click event to the appropriate handler based on the button's action
        if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Update Session') {
            const sessionId = event.target.closest('form').dataset.sessionId;
            updateSession(sessionId);
        } else if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Remove Session') {
            const sessionId = event.target.closest('form').dataset.sessionId;
            removeSession(sessionId);
        }
    });
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(this);
  fetch('/api/members/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert('Logged in successfully');
          sessionStorage.setItem('userEmail', formData.get('email'));
          sessionStorage.setItem('userPassword', formData.get('password'));

          // Populate UI with profile data
          updateProfile(data);
          // Populate UI with training sessions
          updateTrainingSessions(data.data.trainingSessions);

          populateClasses(data.data.class_enrollments);
      } else {
          alert('Login failed: ' + data.message);
      }
  })
  .catch(error => console.error('Error logging in:', error));
});

function updateProfile(data) {
  const profile = data.data.profile;
  const trainingSessions = data.data.trainingSessions;

// Update fitness goals
const goalsContainer = document.getElementById('fitnessGoalsContainer');
goalsContainer.innerHTML = '';  // Clear existing contents

Object.entries(profile.fitness_goals).forEach(([key, value]) => {
    const goalDiv = document.createElement('div');

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.name = 'key';
    keyInput.value = key;
    keyInput.placeholder = 'Fitness Goal Key';
    keyInput.required = true;

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.name = 'value';
    valueInput.value = value;
    valueInput.placeholder = 'Fitness Goal Value';
    valueInput.required = true;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.onclick = function() {
        goalDiv.remove();
    };

    goalDiv.appendChild(keyInput);
    goalDiv.appendChild(valueInput);
    goalDiv.appendChild(removeButton);

    goalsContainer.appendChild(goalDiv);
});


// Update health metrics
const metricsContainer = document.getElementById('healthMetricsContainer');
metricsContainer.innerHTML = '';  // Clear existing contents

Object.entries(profile.health_metrics).forEach(([key, value]) => {
    const metricDiv = document.createElement('div');

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.name = 'key';
    keyInput.value = key;
    keyInput.placeholder = 'Health Metric Key';
    keyInput.required = true;

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.name = 'value';
    valueInput.value = value;
    valueInput.placeholder = 'Health Metric Value';
    valueInput.required = true;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.onclick = function() {
        metricDiv.remove();
    };

    metricDiv.appendChild(keyInput);
    metricDiv.appendChild(valueInput);
    metricDiv.appendChild(removeButton);

    metricsContainer.appendChild(metricDiv);
});


  // Update training sessions
  const sessionsContainer = document.getElementById('trainingSessionsContainer');
  sessionsContainer.innerHTML = '';  // Clear existing contents
  trainingSessions.forEach(session => {
      const div = document.createElement('div');
      div.innerHTML = `
          <p>Session ID: ${session.session_id}</p>
          <p>Trainer ID: ${session.trainer_id}</p>
          <p>Start Time: ${new Date(session.start_time).toLocaleTimeString()}</p>
          <p>End Time: ${new Date(session.end_time).toLocaleTimeString()}</p>
      `;
      sessionsContainer.appendChild(div);
  });
}

function updateTrainingSessions(sessions) {
    const sessionsContainer = document.getElementById('trainingSessionsContainer');
    sessionsContainer.innerHTML = ''; // Clear previous sessions

    sessions.forEach(session => {
        const form = document.createElement('form');
        form.id = `form-${session.session_id}`;
        form.className = 'sessionForm';
        form.innerHTML = `
            <h4>${session.trainer_name}</h4>
            <label for="startTime-${session.session_id}">Start Time:</label>
            <input type="datetime-local" id="startTime-${session.session_id}" name="start_time" value="${formatDateTime(session.start_time)}" required>
            <label for="endTime-${session.session_id}">End Time:</label>
            <input type="datetime-local" id="endTime-${session.session_id}" name="end_time" value="${formatDateTime(session.end_time)}" required>
            <button type="button" onclick="updateSession(${session.session_id})">Update Session</button>
            <button type="button" onclick="removeSession(${session.session_id})">Remove Session</button>
        `;
        sessionsContainer.appendChild(form);
    });
}

// Helper function to format date-time for input fields
function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toISOString().slice(0, 16); // Convert to local datetime format for datetime-local input
}

// Function to update session based on user input
function updateSession(sessionId) {
    console.log(sessionId);
    const form = document.querySelector(`form[id='form-${sessionId}']`);
    const startTime = form.querySelector(`input[name='start_time']`).value;
    const endTime = form.querySelector(`input[name='end_time']`).value;

    fetch(`/api/members/sessions/update/${sessionId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({start_time: startTime, end_time: endTime})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Session updated successfully!');
        } else {
            alert('Failed to update session: ' + data.message);
        }
    })
    .catch(error => console.error('Error updating session:', error));
}

// Function to remove a session
function removeSession(sessionId) {
    fetch(`/api/members/sessions/delete/${sessionId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Session removed successfully!');
            // Optionally refresh the list or remove the form from the DOM
            document.querySelector(`form[id='form-${sessionId}']`).remove();
        } else {
            alert('Failed to remove session: ' + data.message);
        }
    })
    .catch(error => console.error('Error removing session:', error));
}


function populateClasses(classEnrollments) {
    const classesContainer = document.getElementById('fitnessClassContainer');
    classesContainer.innerHTML = ''; // Clear existing entries

    classEnrollments.forEach(enrollment => {
        const div = document.createElement('div');
        div.className = 'class-entry';

        const pName = document.createElement('p');
        pName.textContent = `Class Name: ${enrollment.class_name}`;
        div.appendChild(pName);

        const pTime = document.createElement('p');
        pTime.textContent = `Time: ${new Date(enrollment.schedule).toLocaleString()}`;
        div.appendChild(pTime);

        const button = document.createElement('button');
        button.textContent = 'Remove';
        button.onclick = () => removeClassEnrollment(enrollment.enrollment_id, button);
        div.appendChild(button);

        classesContainer.appendChild(div);
    });
}

// Function to call the API to remove a class enrollment
function removeClassEnrollment(enrollmentId, buttonElement) {
    fetch(`/api/members/classes/remove/${enrollmentId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Class removed successfully!');
            // Remove the class entry from the UI
            buttonElement.parentNode.remove();
        } else {
            alert('Failed to remove class: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error removing class enrollment:', error);
        alert('Error removing class: ' + error.message);
    });
}

