
const API_BASE_URL = 'https://la81umkg80.execute-api.af-south-1.amazonaws.com';
const API_ENDPOINTS = {
    login: `${API_BASE_URL}/login`,
    register: `${API_BASE_URL}/register`,
    forgotPassword: `${API_BASE_URL}/forgot-password`,
    confirmRegistration: `${API_BASE_URL}/confirm-registration`,
    resetPasswordConfirm: `${API_BASE_URL}/reset-password-confirm`
};



function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('active', show);
        if (show) {
            document.body.style.overflow = 'hidden';
        } else if (!document.querySelector('.modal.active, .login-modal.active, .register-modal.active, .forgot-password-modal.active')) {
            document.body.style.overflow = '';
        }
    }
}


function showAlert(containerId, message, type = 'error') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const alertClass = type === 'success' ? 'success' : 'error';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    container.innerHTML = message ? `<div class="register-modal-alert ${alertClass}"><i class="fas ${icon}"></i> <span>${message}</span></div>` : '';
}


function setButtonLoading(button, isLoading) {
    if (!button) return;
    const buttonText = button.querySelector('span');
    const spinner = button.querySelector('.spinner, .login-modal-spinner, .register-modal-spinner, .forgot-password-modal-spinner');

    button.disabled = isLoading;
    if (spinner && buttonText) {
        buttonText.style.display = isLoading ? 'none' : 'block';
        spinner.style.display = isLoading ? 'block' : 'none';
    }
}



window.togglePassword = function(fieldId) {
    const field = document.getElementById(fieldId);
    const eyeIcon = document.getElementById(`${fieldId}-eye`);
    if (field && eyeIcon) {
        const isPassword = field.type === 'password';
        field.type = isPassword ? 'text' : 'password';
        eyeIcon.className = `fas ${isPassword ? 'fa-eye' : 'fa-eye-slash'}`;
    }
};


function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
}


document.addEventListener('DOMContentLoaded', () => {

    const sidebarLoginContainer = document.getElementById('sidebarLogin');

   
    function updateUserStatusUI() {
        if (!sidebarLoginContainer) return;

        const idToken = sessionStorage.getItem('idToken');

        if (idToken) {
            // --- User is LOGGED IN ---
            const userData = decodeJwt(idToken);
            if (userData) {
                const initials = (userData.given_name ? userData.given_name[0] : '') + (userData.family_name ? userData.family_name[0] : '');
                sidebarLoginContainer.innerHTML = `
                    <a href="profile.html" class="sidebar-profile-link">
                        <div class="sidebar-user-profile">
                            <div class="sidebar-avatar">${initials.toUpperCase()}</div>
                            <div class="sidebar-user-info">
                                <span class="sidebar-user-name">${userData.given_name} ${userData.family_name}</span>
                                <span class="sidebar-user-email">${userData.email}</span>
                            </div>
                        </div>
                    </a>
                    <button id="signOutBtn" class="sidebar-btn sidebar-signout-btn">Sign Out</button>
                `;

                document.getElementById('signOutBtn').addEventListener('click', () => {
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('idToken');
                    window.location.href = 'index.html'; 
                });
            }
        } else {
           
            sidebarLoginContainer.innerHTML = `
                <button id="sidebarSignInBtn" class="sidebar-btn sidebar-signin-btn">Sign In / Register</button>
            `;
            document.getElementById('sidebarSignInBtn').addEventListener('click', () => {
                toggleModal('loginModal', true);
            });
        }
    }

  
    updateUserStatusUI();

   
    document.querySelectorAll('.login-modal, .register-modal, .forgot-password-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal && !e.target.closest('.modal-content, .login-modal-container, .register-modal-container, .forgot-password-modal-container')) {
                 toggleModal(modal.id, false);
            }
        });
        const closeButton = modal.querySelector('.login-modal-close, .register-modal-close, .forgot-password-modal-close, .wishlist-close-modal');
        if (closeButton) closeButton.addEventListener('click', () => toggleModal(modal.id, false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active, .login-modal.active, .register-modal.active, .forgot-password-modal.active');
            if (activeModal) toggleModal(activeModal.id, false);
        }
    });

  
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        const loginForm = document.getElementById('loginModalForm');
        loginForm.addEventListener('submit', async (e) => {
             e.preventDefault();
             const email = document.getElementById('loginModalEmail').value;
             const password = document.getElementById('loginModalPassword').value;
             const loginBtn = document.getElementById('loginModalBtn');
             
             showAlert('loginAlertContainer', '');
             setButtonLoading(loginBtn, true);
 
             try {
                 const response = await fetch(API_ENDPOINTS.login, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ email, password })
                 });
                 const data = await response.json();
 
                 if (response.ok) {
                     sessionStorage.setItem('accessToken', data.accessToken);
                     sessionStorage.setItem('idToken', data.idToken);
                     window.location.reload();
                 } else {
                     showAlert('loginAlertContainer', data.message || 'An unknown error occurred.', 'error');
                     setButtonLoading(loginBtn, false);
                 }
             } catch (error) {
                 showAlert('loginAlertContainer', 'Could not connect to the server.', 'error');
                 setButtonLoading(loginBtn, false);
             }
        });

        document.getElementById('loginModalForgotPassword').addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal('loginModal', false);
            toggleModal('forgotPasswordModal', true);
        });
        document.getElementById('loginModalRegisterLink').addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal('loginModal', false);
            toggleModal('registerModal', true);
        });
    }

  
});
