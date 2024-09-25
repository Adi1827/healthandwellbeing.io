document.getElementById('form__user').addEventListener('submit', verifyUser);

// Loader functions
function showLoader() {
    document.getElementById('loader').style.display = 'block';
    document.querySelector('.loader-backdrop').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    document.querySelector('.loader-backdrop').style.display = 'none';
}

async function verifyUser(event) {
    event.preventDefault();

    showLoader(); // Show loader when login process starts

    const uname = document.getElementById('username').value;
    const pwd = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${btoa(uname + ":" + pwd)}`
            },
            body: JSON.stringify({ uname, pwd })
        });

        hideLoader(); // Hide the loader once the response is received

        if (response.ok) {
            const token = await response.text(); // Assuming server returns token in response body
            window.location.href = `/landing`; // Redirect to landing page with token
            console.log("Successful login",token);
        } else {
            console.error("Login failed:", response.statusText);
            alert("Incorrect Credentials");
        }
    } catch (err) {
        hideLoader(); // Hide the loader if an error occurs
        console.error("Error:", err);
    }
}