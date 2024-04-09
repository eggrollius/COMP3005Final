document.getElementById('searchMemberForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission
  const memberName = this.memberName.value; // Get the member name from the input

  fetch(`/api/members/search?name=${encodeURIComponent(memberName)}`, {
      method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
      if (data.success && data.members.length) {
          const resultsContainer = document.getElementById('memberResults');
          resultsContainer.innerHTML = data.members.map(member =>
              `<div>
                  <h4>${member.name}</h4>
                  <p>Email: ${member.email}</p>
                  <p>Date of Birth: ${member.dob}</p>
                  <p>Fitness Goals: ${member.fitness_goals}</p>
                  <p>Health Metrics: ${member.health_metrics}</p>
              </div>`
          ).join('');
      } else {
          document.getElementById('memberResults').innerHTML = 'No members found.';
      }
  })
  .catch(error => console.error('Error fetching member data:', error));
});
