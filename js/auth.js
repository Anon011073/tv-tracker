// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const messageEl = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            formData.append('action', 'register');

            try {
                const response = await fetch('api/auth.php', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    messageEl.textContent = result.message;
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    messageEl.textContent = `Error: ${result.message}`;
                }
            } catch (error) {
                messageEl.textContent = `An error occurred: ${error.message}`;
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            formData.append('action', 'login');

            try {
                const response = await fetch('api/auth.php', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    messageEl.textContent = result.message;
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    messageEl.textContent = `Error: ${result.message}`;
                }
            } catch (error) {
                messageEl.textContent = `An error occurred: ${error.message}`;
            }
        });
    }
});
