const skillsData = [
  { name: 'System & Netzwerk', level: 90, category: 'technical' },
  { name: 'Client-Management', level: 100, category: 'technical' },
  { name: 'Azure Cloud', level: 90, category: 'technical' },
  { name: 'Active Directory', level: 90, category: 'technical' },
  { name: 'Windows Server', level: 85, category: 'technical' },
  { name: 'IT-Monitoring', level: 90, category: 'technical' },
  { name: 'Backup & Archiv', level: 75, category: 'technical' },
  { name: 'WLAN Management', level: 80, category: 'technical' },
  { name: 'Netkey', level: 95, category: 'software' },
  { name: 'Microsoft Office', level: 90, category: 'software' },
  { name: 'PowerShell', level: 80, category: 'languages' },
  { name: 'Python', level: 80, category: 'languages' },
  { name: 'JavaScript', level: 65, category: 'languages' },
  { name: 'HTML/CSS', level: 75, category: 'languages' },
  { name: 'Problemlösung', level: 95, category: 'personal' },
  { name: 'Teamarbeit', level: 90, category: 'personal' },
  { name: 'Teamführung', level: 85, category: 'personal' },
  { name: 'Kommunikation', level: 85, category: 'personal' },
  { name: 'Deutsch', level: 100, category: 'languages-spoken' },
  { name: 'Französisch', level: 80, category: 'languages-spoken' },
  { name: 'Englisch', level: 95, category: 'languages-spoken' },
  { name: 'Italienisch', level: 40, category: 'languages-spoken' }
];

document.addEventListener('DOMContentLoaded', () => {
  renderSkills(skillsData);
  setupSkillFilter();
  setupContactForm();
  setupMenuCloseOnClick();
  setUpSkillsObserver();
});

function renderSkills(skills) {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const frag = document.createDocumentFragment();
  skills.forEach(skill => {
    const el = document.createElement('div');
    el.className = 'skill-item';
    el.setAttribute('data-category', skill.category);
    el.innerHTML = `
      <div class="skill-category">${getCategoryName(skill.category)}</div>
      <div class="skill-header">
        <div class="skill-name">${skill.name}</div>
        <div class="skill-percentage">${skill.level}%</div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="--level:${skill.level}"></div>
      </div>`;
    frag.appendChild(el);
  });
  grid.appendChild(frag);
}

function getCategoryName(category) {
  const names = {
    technical: 'Technische Fähigkeiten',
    software: 'Software & Tools',
    languages: 'Programmiersprachen',
    personal: 'Persönliche Fähigkeiten',
    'languages-spoken': 'Sprachkenntnisse'
  };
  return names[category] || category;
}

function setupSkillFilter() {
  const filter = document.getElementById('skillFilter');
  if (!filter) return;
  filter.addEventListener('change', () => {
    const c = filter.value;
    document.querySelectorAll('.skill-item').forEach(item => {
      item.classList.toggle('hidden', !(c === 'all' || item.dataset.category === c));
    });
  });
}

function setUpSkillsObserver() {
  const observer = new IntersectionObserver(entries => {
    requestAnimationFrame(() => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.progress-fill').forEach(bar => observer.observe(bar));
}

function setupMenuCloseOnClick() {
  document.querySelectorAll('#dropdownMenu a').forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('dropdownMenu');
      if (menu) menu.style.display = 'none';
      const btn = document.querySelector('.burger-icon');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    const menu = document.getElementById('dropdownMenu');
    const icon = document.querySelector('.burger-icon');
    if (!menu || !icon) return;
    if (!menu.contains(e.target) && !icon.contains(e.target)) {
      menu.style.display = 'none';
      icon.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      alert(res.ok
        ? 'Vielen Dank für Ihre Nachricht! Ich melde mich bald.'
        : '⚠️ Fehler beim Senden. Bitte erneut versuchen.');
      if (res.ok) form.reset();
    } catch (err) {
      console.error(err);
      alert('Netzwerkfehler – bitte Verbindung prüfen.');
    }
  });
}


function toggleMenu() {
  const menu = document.getElementById('dropdownMenu');
  const btn = document.querySelector('.burger-icon');
  if (!menu || !btn) return;
  const open = menu.style.display === 'flex';
  menu.style.display = open ? 'none' : 'flex';
  btn.setAttribute('aria-expanded', String(!open));
}
