function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email.trim() === '' || password.trim() === '') {
        alert('Veuillez saisir votre e-mail et votre mot de passe.');
        return;
    }

    const loginData = {
        email: email,
        password: password
    };

    authenticateUser(loginData);
}

function authenticateUser(loginData) {
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Identifiants incorrects');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            redirectToHomePage();
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la connexion : ', error);
            alert('Identifiants incorrects. Veuillez réessayer.');
        });
}

function redirectToHomePage() {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', loginUser);
});
