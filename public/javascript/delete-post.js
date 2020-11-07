async function deleteFormHandler(event) {
    event.preventDefault();

    // split the url string into an array based on the / character
    const id = window.location.toString().split('/')[
        // index of last item in the array
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);