function login_call() {
    document.getElementById("log_in").style.visibility = "visible";
    document.getElementById("image").setAttribute("class", "image slide_right");
    document.getElementById("sign_in").style.visibility = "hidden";
}
function sign_in_call() {
    document.getElementById("log_in").style.visibility = "hidden";
    document.getElementById("image").setAttribute("class", "image slide_left");
    document.getElementById("sign_in").style.visibility = "visible";
}

const firebaseConfig = {
    apiKey: "AIzaSyApl5-gq5HsM0WX6vqso2po2fIoLr6q108",
    authDomain: "servesphere-463e1.firebaseapp.com",
    projectId: "servesphere-463e1",
    storageBucket: "servesphere-463e1.firebasestorage.app",
    messagingSenderId: "362741020270",
    appId: "1:362741020270:web:3189fa648b73043d84587f"
  };
firebase.initializeApp(firebaseConfig);

const signInBtn = document.getElementById('sign_in_btn');
const loginBtn = document.getElementById('login_btn');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput_log = document.getElementById("login_password");
const passwordInput = document.getElementById("signin_password");
const togglePassword = document.getElementById('togglePassword');
const togglePassword_log = document.getElementById('togglePassword_log');
const googleButton = document.getElementById('google-sign-in'); // If you have an ID for the Google button
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Create account
signInBtn.addEventListener('click', () => {
     
    const email = emailInput.value;
    const password = passwordInput.value;

    if (email && password) {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Account created, you can save additional info in the database
                const user = userCredential.user;
                sessionStorage.setItem('username', `${email}`);
                window.location.href = 'index.html'; 
                alert('Account created successfully!');
                 
            })
            .catch((error) => {
                console.error('Error creating account: ', error.message);
                alert("Something went wrong! please try Again");
            });
    } else {
        alert('Please fill in all fields.');
    }
});

// Log in
loginBtn.addEventListener('click', () => {
    const email = document.getElementById("login_email").value;
    const password =  document.getElementById("login_password").value;
   
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            sessionStorage.setItem('username', email);
            window.location.replace = "index.html";
            alert('Logged in successfully!');
            
        })
        .catch((error) => {
            const res=error.message;
           
            alert('INVALID_LOGIN_CREDENTIALS');
        });
});

// Google Sign-In
if (googleButton) {
    googleButton.addEventListener('click', () => {
        auth.signInWithPopup(googleProvider)
            .then((result) => {
                const user = result.user;
                sessionStorage.setItem('username', user.displayName);
                alert('Google Sign-In successful!');
                window.location.replace = 'index.html'; // Redirect to dashboard
            })
            .catch((error) => {
                console.error('Error during Google Sign-In: ', error.message);
            });
    });
}

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.src = type === 'password' ? 'hide.jpg' : 'view.jpg'; // Change image source based on visibility
});

togglePassword_log.addEventListener('click', () => {
    const type = passwordInput_log.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput_log.setAttribute('type', type);
    togglePassword_log.src = type === 'password' ? 'hide.jpg' : 'view.jpg'; // Change image source based on visibility
});
// Forgot Password
document.getElementById('forgot-password').addEventListener('click', () => {
    const email = prompt("Please enter your email address for password reset:");

    if (email) {
        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert('Password reset email sent! Check your inbox.');
            })
            .catch((error) => {
                console.error('Error sending password reset email:', error.message);
                alert('Error: ' + error.message);
            });
    } else {
        alert('Email is required.');
    }
});
// //sign out
// document.getElementById('userSection').addEventListener('click', (event) => {
//     if (event.target.id === 'signOutBtn') {
//         auth.signOut().then(() => {
//             sessionStorage.removeItem('userName'); // Clear user name from session storage
//             alert('Signed out successfully!');
//             window.location.reload(); // Reload the page to update the navbar
//         }).catch((error) => {
//             console.error('Error signing out: ', error.message);
//             alert('Error: ' + error.message);
//         });
//     }
// });