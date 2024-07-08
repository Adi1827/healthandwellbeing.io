document.getElementById('form__user').addEventListener('submit', verifyUser);

async function verifyUser(event) {
    event.preventDefault(); 

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

        if (response.ok) {
            const token = await response.text(); // Assuming server returns token in response body
            window.location.href = `/landing`; // Redirect to landing page with token
            console.log("Successful login",token);
        } else {
            console.error("Login failed:", response.statusText);
            alert("Incorrect Credentials");
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

async function userLogOut() {
    try{
    const response = await fetch('/logout')
    console.log(response);
    if(response.ok){
        window.location.href = `/login`;
    }
    else{
        console.error("Logout failed:", response.statusText);
    }
    }
    catch(err){
        console.error("Error:", err);
    };
}
