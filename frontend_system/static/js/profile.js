$(document).ready(function() {
    $('#profileForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        var token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'You must be logged in to submit the profile.',
                confirmButtonText: 'OK'
            });
            return;
        }

        var formData = {
            first_name: $('#firstName').val(),
            last_name: $('#lastName').val(),
            email: $('#email').val(),
            phone_number: $('#phoneNumber').val(),
            province: $('#province').val(),  // Convert to integer
            race: $('#race').val(),          // Convert to integer
            gender: $('#gender').val(),      // Convert to integer (if required)
            title: $('#title').val(),
            street_address: $('#streetAddress').val(),
            postal_code: $('#postalCode').val(),
            town: $('#town').val(),
            date_of_birth: $('#dateOfBirth').val(),
            id_number: $('#idNumber').val(),
        };

        // Remove any empty fields from formData
        Object.keys(formData).forEach(key => {
            if (formData[key] === "") {
                delete formData[key];
            }
        });

        $.ajax({
            url: "http://dmh.localhost:8001/auth/create_user_profile/",
            type: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            headers: {
                "Authorization": "Token " + token
            },
            success: function(response) {
                if (response.status === 'Success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.message,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        $('#profileForm')[0].reset();  // Reset the form
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
                let errorMessage = 'An unexpected error occurred. Please try again.';
                if (xhr.responseJSON) {
                    if (xhr.responseJSON.error) {
                        errorMessage = xhr.responseJSON.error;
                    }
                    // If email, phone_number, or id_number already exists
                    if (xhr.responseJSON.email) {
                        errorMessage = 'Email already exists.';
                    } else if (xhr.responseJSON.phone_number) {
                        errorMessage = 'Phone number already exists.';
                    } else if (xhr.responseJSON.id_number) {
                        errorMessage = 'ID number already exists.';
                    }
                }
                console.error('Error details:', xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonText: 'OK'
                });
            }
        });
    });
});