async function commentFormHandler(event) {
    event.preventDefault();

    // value of the textarea element
    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

    // variable for the id # from the url string
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    // prevent users from submitting empty strings
    if (comment_text) {
        const response = await fetch('/api/comments', {
            // post because we are adding data
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_text
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
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);