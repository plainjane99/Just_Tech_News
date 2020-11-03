// handle the sign up submission
// add error handling to the front end by using ES6 feature async/await
// wrap the asynchronous code in async
async function signupFormHandler(event) {
    event.preventDefault();

    // grab the data from the sign-up/log-in form
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // make sure all fields have values before making the post request
    // this is just one step of many that a company can take to act against malformed or malicious requests
    if (username && email && password) {
        // add await before the promise
        // when using await, we can assign the result of the promise to a variable
        // to remove the need for .then chaining
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        // .then no longer required with use of await
        // .then((response) => {console.log(response)})
        console.log(response);

        // add the error handling by using .ok property on the response object
        // check the response status
        if (response.ok) {
            console.log('success');
        } else {
            alert(response.statusText);
        }
    }
}

// handle the login submission
async function loginFormHandler(event) {
    event.preventDefault();
  
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
            email,
            password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
    
        if (response.ok) {
            document.location.replace('/');
        } else {
            alert(response.statusText);
        }
    }
}
 
// listen for the submit event for sign up
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
// listen for the submit event for login
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);