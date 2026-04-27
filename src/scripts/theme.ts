const stored = localStorage.getItem('theme') ?? 'dark';
document.documentElement.setAttribute('data-theme', stored);
