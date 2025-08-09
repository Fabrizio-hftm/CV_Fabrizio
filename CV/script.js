
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

document.addEventListener('DOMContentLoaded', function() {
    renderSkills(skillsData);
    setupSkillFilter();
    setupContactForm();
    animateSkillBars();
});

function renderSkills(skills) {
    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = '';

    skills.forEach((skill, index) => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item';
        skillElement.setAttribute('data-category', skill.category);
        
        skillElement.innerHTML = `
            <div class="skill-category">${getCategoryName(skill.category)}</div>
            <div class="skill-header">
                <div class="skill-name">${skill.name}</div>
                <div class="skill-percentage">${skill.level}%</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" data-level="${skill.level}"></div>
            </div>
        `;
        
        skillsGrid.appendChild(skillElement);
    });
}

function getCategoryName(category) {
    const categoryNames = {
        'technical': 'Technische Fähigkeiten',
        'software': 'Software & Tools',
        'languages': 'Programmiersprachen',
        'personal': 'Persönliche Fähigkeiten',
        'languages-spoken': 'Sprachkenntnisse'
    };
    return categoryNames[category] || category;
}

function setupSkillFilter() {
    const filterDropdown = document.getElementById('skillFilter');
    filterDropdown.addEventListener('change', function() {
        const selectedCategory = this.value;
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            if (selectedCategory === 'all' || item.getAttribute('data-category') === selectedCategory) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        
        setTimeout(() => {
            animateSkillBars();
        }, 100);
    });
}

function animateSkillBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        const level = bar.getAttribute('data-level');
        const parentItem = bar.closest('.skill-item');
        
        if (!parentItem.classList.contains('hidden')) {
            setTimeout(() => {
                bar.style.width = level + '%';
            }, index * 100);
        }
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        alert('Vielen Dank für Ihre Nachricht! Ich werde mich bald bei Ihnen melden.\n\n' +
                'Gesendete Daten:\n' +
                `Name: ${data.name}\n` +
                `E-Mail: ${data.email}\n` +
                `Betreff: ${data.subject}\n` 
            );
    });
}

function toggleMenu() {
  const menu = document.getElementById('dropdownMenu');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

document.addEventListener('click', function(event) {
  const menu = document.getElementById('dropdownMenu');
  const icon = document.querySelector('.burger-icon');
  if (!menu.contains(event.target) && !icon.contains(event.target)) {
    menu.style.display = 'none';
  }
});

document.querySelectorAll('#dropdownMenu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('dropdownMenu').style.display = 'none';
  });
});

function toggleDescription(item) {
  const desc = item.querySelector('.resp-description');
  if (desc.style.display === 'block') {
    desc.style.display = 'none';
  } else {

document.querySelectorAll('.resp-description').forEach(el => {
      el.style.display = 'none';
    });
    desc.style.display = 'block';
    }
}

