function applyTheme() {
  const userId = getActiveUserKey();
  if (!userId) return;
  const settings = getSettings(userId);
  document.body.classList.toggle('dark', Boolean(settings.darkMode));
}

function updateHeaderUser() {
  const user = getCurrentUser();
  const header = document.getElementById('headerUsername');
  if (header && user) {
    header.textContent = user.username;
  }
}

function showMessage(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? 'var(--expense)' : 'var(--income)';
}

function openModal() {
  const modal = document.getElementById('transactionModal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  const modal = document.getElementById('transactionModal');
  const form = document.getElementById('transactionForm');
  const hiddenId = document.getElementById('transactionId');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (form) form.reset();
  if (hiddenId) hiddenId.value = '';
}

function bindSidebarNavigation() {
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const target = button.dataset.target;
      document.querySelectorAll('.view-section').forEach((view) => view.classList.remove('active'));
      document.getElementById(target).classList.add('active');
      if (window.innerWidth <= 760) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  });
}

function bindMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}

function initUI() {
  applyTheme();
  updateHeaderUser();
  bindSidebarNavigation();
  bindMobileMenu();
}
