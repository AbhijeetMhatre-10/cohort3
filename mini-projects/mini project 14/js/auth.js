// Authentication flow for login and registration pages.
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();
  const users = getUsers();
  const validCurrentUser = currentUser && users.some((user) => user.id === currentUser.id);
  const currentPage = getCurrentPageName();

  if ((currentPage === 'login.html' || currentPage === 'register.html') && validCurrentUser) {
    window.location.href = 'index.html';
    return;
  }

  if (currentPage === 'index.html' && !validCurrentUser) {
    clearCurrentUser();
    window.location.href = 'login.html';
    return;
  }

  applyTheme();

  const authMessage = document.getElementById('authMessage');
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const logoutButton = document.getElementById('logoutBtn');

  const handleRegister = (event) => {
    event.preventDefault();
    const fullName = document.getElementById('fullName')?.value.trim();
    const username = document.getElementById('username')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;

    if (!fullName || !username || !email || !password || !confirmPassword) {
      showMessage(authMessage, 'All fields are required.', true);
      return;
    }

    if (!validateEmail(email)) {
      showMessage(authMessage, 'Please enter a valid email address.', true);
      return;
    }

    if (!validatePassword(password)) {
      showMessage(authMessage, 'Password must be 8+ chars with uppercase, lowercase, number, and special character.', true);
      return;
    }

    if (password !== confirmPassword) {
      showMessage(authMessage, 'Passwords do not match.', true);
      return;
    }

    const users = getUsers();
    if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      showMessage(authMessage, 'Username already exists.', true);
      return;
    }

    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      showMessage(authMessage, 'Email already exists.', true);
      return;
    }

    const newUser = {
      id: generateId(),
      fullName,
      username,
      email,
      password
    };

    users.push(newUser);
    saveUsers(users);
    saveCurrentUser(newUser);
    window.location.href = 'index.html';
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const identifier = document.getElementById('loginIdentifier')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;

    if (!identifier || !password) {
      showMessage(authMessage, 'Please enter your credentials.', true);
      return;
    }

    const user = getUserByIdentifier(identifier);
    if (!user) {
      showMessage(authMessage, 'User not found.', true);
      return;
    }

    if (user.password !== password) {
      showMessage(authMessage, 'Incorrect password.', true);
      return;
    }

    saveCurrentUser(user);
    window.location.href = 'index.html';
  };

  registerForm?.addEventListener('submit', handleRegister);
  loginForm?.addEventListener('submit', handleLogin);

  logoutButton?.addEventListener('click', () => {
    clearCurrentUser();
    window.location.href = 'login.html';
  });
});
