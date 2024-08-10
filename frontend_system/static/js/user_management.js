// Adding a user

$(document).ready(function() {
    $('#addUserForm').on('submit', function(event) {
        event.preventDefault();

        var token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'You must be logged in to add users.',
                confirmButtonText: 'OK'
            });
            return;
        }

        var formData = {
            first_name: $('#firstName').val(),
            last_name: $('#lastName').val(),
            email: $('#email').val() || null,
            phone_number: $('#phoneNumber').val() || null,
            role: $('#role').val()
        };

        $.ajax({
            url: "http://dmh.localhost:8001/auth/add_user/",
            type: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json",
            headers: {
                // "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val(),
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
                        $('#addUserForm')[0].reset();  // Reset the form
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
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                if (xhr.status === 403) {
                    errorMessage = 'You are not authorized to add users.';
                }
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


// Edit User

$(document).ready(function() {
    $('#editUserForm').on('submit', function(event) {
        event.preventDefault();

        var token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'You must be logged in to add users.',
                confirmButtonText: 'OK'
            });
            return;
        }

        var formData = {
            first_name: $('#firstName').val() || null,
            last_name: $('#lastName').val() || null,
            email: $('#email').val() || null,
            phone_number: $('#phoneNumber').val() || null,
            role: $('#role').val() || null,
        };

        $.ajax({
            url: "http://dmh.localhost:8001/auth/edit_user/",
            type: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json",
            headers: {
                // "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val(),
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
                        $('#addUserForm')[0].reset();  // Reset the form
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
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                if (xhr.status === 403) {
                    errorMessage = 'You are not authorized to add users.';
                }
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


// Getting the users

$(document).ready(function() {

    var token = localStorage.getItem('token');
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'You must be logged in to add users.',
            confirmButtonText: 'OK'
        });
        return;
    }

    function createCell(content) {
        let cell = document.createElement('td');
        cell.textContent = content;
        return cell;
    }

    function createButton(text, className, userId) {
        let button = document.createElement('button');
        button.textContent = text;
        button.className = className;

      
        if (userId) {
            button.setAttribute('data-user-id', userId); // Set data-user-id attribute
        }
        return button;
    }

    function loadUsers() {
        $.ajax({
            url: "http://dmh.localhost:8001/auth/view_patient/",
            type: 'GET',
            headers: {
                "Authorization": "Token " + token
            },
            success: function(response) {
                if (response.status === 'Success') {
                    let users = response.users;
                    let userTableBody = document.getElementById('userTableBody');
                    userTableBody.innerHTML = ''; // Clear existing rows

                    users.forEach((user, index) => {
                        let row = document.createElement('tr');
                        row.appendChild(createCell(index + 1));
                        row.appendChild(createCell(user.first_name));
                        row.appendChild(createCell(user.last_name));
                        row.appendChild(createCell(user.email || '-'));
                        row.appendChild(createCell(user.phone_number || '-'));
                        row.appendChild(createCell(user.last_login || '-'));
                        
                        let actionCell = document.createElement('td');
                        let editButton = createButton('Edit', 'btn btn-warning btn-sm ');
                        let deactivateButton = createButton('Deactivate', 'btn btn-danger btn-sm', user.id);
                        let activateButton = createButton('Activate', 'btn btn-success btn-sm ss', user.id);
                        
                        // Attach event listener to Edit button
                        editButton.addEventListener('click', function() {
                            populateEditForm(user);
                            $('#editUserModal').modal('show');
                        });

                        deactivateButton.addEventListener('click', function(){
                            const userId = this.getAttribute('data-user-id'); // Retrieve user ID
                            deactivateUser(userId);
                        });

                        actionCell.appendChild(editButton);
                        actionCell.appendChild(document.createTextNode(' ')); // Space between buttons
                        actionCell.appendChild(activateButton);
                        actionCell.appendChild(document.createTextNode(' '));
                        actionCell.appendChild(deactivateButton);
                        row.appendChild(actionCell);

                        userTableBody.appendChild(row);
                    });
                    

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message,
                    });
                }
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load users.',
                });
            }
        });
    }

    function populateEditForm(user) {
        document.getElementById('editFirstName').value = user.first_name;
        document.getElementById('editLastName').value = user.last_name;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhone').value = user.phone_number;
        document.getElementById('role').value = user.role;
    }

    loadUsers();

            // Handle button clicks for activation and deactivation
            $('#user-table').on('click', '.ss, .activate-btn', function() {
                const userId = $(this).data('user-id'); // Using jQuery
                console.log('Button clicked. User ID:', userId); // Debugging line

                if ($(this).hasClass('deactivate-btn')) {
                    deactivateUser(userId);
                } else if ($(this).hasClass('activate-btn')) {
                    activateUser(userId);
                }
            });
});


// Activate the user
function deactivateUser(userId) {
    console.log('Deactivate user called with userId:', userId);

    if (!userId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid user ID. Cannot deactivate user.',
            confirmButtonText: 'OK'
        });
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'You must be logged in to manage users.',
            confirmButtonText: 'OK'
        });
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "By committing to this action the user will be deactivated from the system!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, deactivate!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `http://dmh.localhost:8001/auth/deactivate_user/${userId}/`,
                type: 'POST',
                headers: {
                    "Authorization": "Token " + token
                },
                success: function (data) {
                    console.log('Deactivation response:', data);
                    if (data.status === 'Success') {
                        Swal.fire(
                            'Deactivated!',
                            'User has been deactivated.',
                            'success'
                        );
                        loadUsers(); // Refresh user list if needed
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message || 'Failed to deactivate user.',
                        });
                    }
                },
                error: function (xhr) {
                    console.log('Error response:', xhr.responseText);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Failed to deactivate user.',
                    });
                }
            });
        }
    });
}
