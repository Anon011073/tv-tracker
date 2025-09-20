document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('themeToggle');

  fetch('api/preferences.php?action=get')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.body.classList.add(data.preferences.theme + '-mode');
      }
    });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', async () => {
      const isDark = document.body.classList.contains('dark-mode');
      const newTheme = isDark ? 'light' : 'dark';
      document.body.classList.remove(isDark ? 'dark-mode' : 'light-mode');
      document.body.classList.add(newTheme + '-mode');

      const formData = new FormData();
      formData.append('action', 'set');
      formData.append('theme', newTheme);

      await fetch('api/preferences.php', {
        method: 'POST',
        body: formData
      });
    });
  }
});
