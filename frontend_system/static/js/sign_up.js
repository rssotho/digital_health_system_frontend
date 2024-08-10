$(document).ready(function() {
    $('#signUpForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        var formData = {
            first_name: $('#firstName').val(),
            last_name: $('#lastName').val(),
            email: $('#email').val(),
            phone_number: $('#phoneNumber').val(),
            role: $('#role').val(),
            password: $('#password').val(),
            confirm_password: $('#confirmPassword').val()
        };

        // Get CSRF token
        var csrftoken = $('[name=csrfmiddlewaretoken]').val();

        // Make AJAX request to the backend
        $.ajax({
            url: "http://dmh.localhost:8001/auth/sign_up_user/",  // Backend URL
            type: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json",
            headers: {
                "X-CSRFToken": csrftoken
            },
            success: function(response) {
                if (response.status === 'Success') {
                    // Store token in localStorage
                    localStorage.setItem('token', response.token);

                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.message,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // Redirect to home page or another page
                        window.location.href = '/auth/login/';
                    });
                } else {
                    // Show error message
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message,
                        confirmButtonText: 'OK'
                    });
                }
            },
            error: function(xhr, status, error) {
                // Show error message
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
