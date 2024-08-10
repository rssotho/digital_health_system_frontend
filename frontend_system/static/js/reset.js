$(document).ready(function() {
    $('#resetPasswordForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the JWT token from localStorage
        var token = localStorage.getItem('token');

        // Get form data
        var formData = {
            password: $('#newPassword').val(),
            // confirmPassword: $('#confirmPassword').val()
        };
        var identifier = $('#identifier').val().trim();

        if (identifier.includes('@')) {
            formData.email = identifier;
        } else {
            formData.phone_number = identifier;
        }

        // Get CSRF token
        // var csrftoken = $('[name=csrfmiddlewaretoken]').val();

        // Make AJAX request to the backend
        $.ajax({
            url: "http://dmh.localhost:8001/auth/reset_password/",  // Backend URL
            type: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json",
            headers: {
                // "X-CSRFToken": csrftoken,
                "Authorization": "Token " + token  // Include the token in the Authorization header
            },
            success: function(response) {
                if (response.status === 'Success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Password Reset Successful',
                        text: response.message,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '/auth/login/'; // Redirect to login
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message,
                        confirmButtonText: 'OK'
                    });
                }
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An unexpected error occurred. Please try again.',
                    confirmButtonText: 'OK'
                });
            }
        });
    });
});
