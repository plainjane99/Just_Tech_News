// define the click handler as an async function, because 
// it will eventually be making an asynchronous PUT request with fetch().

async function upvoteClickHandler(event) {
    event.preventDefault();

    // split the url string into an array based on the / character
    const id = window.location.toString().split('/')[
        // index of last item in the array
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch('/api/posts/upvote', {
        // put because this is an update to a property
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);