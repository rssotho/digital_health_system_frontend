$(document).ready(function() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Get form data
        var formData = {
            password: $('#password').val()
        };
        var emailOrPhone = $('#identifier').val().trim();

        if (emailOrPhone.includes('@')) {
            formData.email = emailOrPhone;
        } else {
            formData.phone_number = emailOrPhone;
        }
        
        // Get CSRF token
        var csrftoken = $('[name=csrfmiddlewaretoken]').val();
        
        // Make AJAX request to the backend
        $.ajax({
            url: "http://dmh.localhost:8001/auth/login/",  // Backend URL
            type: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json",
            headers: {
                "X-CSRFToken": csrftoken
            },
            success: function(response) {
                if (response.status === 'Success') {
                    // Store token or handle login success
                    localStorage.setItem('token', response.token);
                    
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: response.message,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // Redirect to another page
                        window.location.href = '/auth/home/'; // Use a default if not provided

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

