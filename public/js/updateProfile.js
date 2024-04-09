function addInput(containerId, placeholder) {
    const container = document.getElementById(containerId);
    const inputGroup = document.createElement('div');
    inputGroup.innerHTML = `
        <input type="text" name="key" placeholder="${placeholder} Key" required>
        <input type="text" name="value" placeholder="${placeholder} Value" required>
        <button type="button" onclick="removeInput(this)">Remove</button>
    `;
    container.appendChild(inputGroup);
}

function addFitnessGoal() {
    addInput('fitnessGoalsContainer', 'Fitness Goal');
}

function addHealthMetric() {
    addInput('healthMetricsContainer', 'Health Metric');
}

function removeInput(button) {
    button.parentNode.remove();
}

document.getElementById('updateProfileForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Prepare the data object including JSON-stringified fitness goals
    const data = {
        email: this.email.value,
        password: this.password.value,
        newEmail: this.newEmail.value || null,
        newPassword: this.newPassword.value || null,
        newDob: this.newDob.value || null,
        newName: this.newName.value || null,
        new_fitness_goals: JSON.stringify(collectKeyValuePairsAsObject('fitnessGoalsContainer')),
        new_health_metrics: JSON.stringify(collectKeyValuePairsAsObject('healthMetricsContainer'))
    };

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

function collectKeyValuePairsAsObject(containerId) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('input[name="key"], input[name="value"]');
    const keyValuePairs = {};
    for (let i = 0; i < inputs.length; i += 2) {
        const key = inputs[i].value.trim();
        const value = inputs[i+1].value.trim();
        if (key && value) {
            keyValuePairs[key] = value;
        }
    }
    return keyValuePairs;
}
