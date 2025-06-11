import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);
document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      updateProfile(userCredential.user, { displayName: name });
      alert('Signup successful!');
      window.location.href = 'dashboard.html';
    })
    .catch(error => alert(error.message));
});
