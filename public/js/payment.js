
function deletePayment(id) {
    fetch(`/api/payment/${id}`, {
        method: 'DELETE', // Method for deleting data
        headers: {
            'Content-Type': 'application/json', // Ensure appropriate content type is set
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) { // Check if the server responded with a non-200 status
            throw new Error('Failed to delete payment');
        }
        return response.json(); // Parse JSON response body
    })
    .then(data => {
        if (data.success) {
            alert('Payment deleted successfully');
            // Optionally, remove the payment row from the table or refresh the page
            document.querySelector(`#paymentRow${id}`).remove(); // Assuming rows have IDs like 'paymentRow{id}'
        } else {
            alert('Failed to delete payment: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting payment:', error);
        alert('Error: ' + error.message);
    });
}