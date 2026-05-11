/* ══════════════════════════════════════
   PARTICLES
══════════════════════════════════════ */
const particleCanvas = document.getElementById('particle-canvas');
const particleContext = particleCanvas ? particleCanvas.getContext('2d') : null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let particleFrameId = null;
let particlePool = [];

function resizeParticleCanvas() {
    if (!particleCanvas || !particleContext) return;
    const ratio = window.devicePixelRatio || 1;
    particleCanvas.width = Math.floor(window.innerWidth * ratio);
    particleCanvas.height = Math.floor(window.innerHeight * ratio);
    particleContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createParticles() {
    if (!particleContext || prefersReducedMotion) return;
    const count = window.innerWidth < 768 ? 14 : 24;
    particlePool = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.9 + 0.7,
        alpha: Math.random() * 0.45 + 0.15,
        hue: Math.random() > 0.5 ? 160 : 190
    }));
}

function renderParticles() {
    if (!particleContext || prefersReducedMotion) return;

    particleContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particlePool.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20) particle.x = window.innerWidth + 20;
        if (particle.x > window.innerWidth + 20) particle.x = -20;
        if (particle.y < -20) particle.y = window.innerHeight + 20;
        if (particle.y > window.innerHeight + 20) particle.y = -20;

        particleContext.beginPath();
        particleContext.fillStyle = `hsla(${particle.hue}, 100%, 72%, ${particle.alpha})`;
        particleContext.shadowBlur = 18;
        particleContext.shadowColor = `hsla(${particle.hue}, 100%, 70%, 0.55)`;
        particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        particleContext.fill();

        for (let j = index + 1; j < particlePool.length; j++) {
            const other = particlePool[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 140) {
                particleContext.beginPath();
                particleContext.strokeStyle = `rgba(52, 211, 153, ${0.08 * (1 - distance / 140)})`;
                particleContext.lineWidth = 1;
                particleContext.moveTo(particle.x, particle.y);
                particleContext.lineTo(other.x, other.y);
                particleContext.stroke();
            }
        }
    });

    particleFrameId = requestAnimationFrame(renderParticles);
}

function startParticles() {
    if (!particleContext || prefersReducedMotion) return;
    resizeParticleCanvas();
    createParticles();
    if (particleFrameId) cancelAnimationFrame(particleFrameId);
    renderParticles();
}

window.addEventListener('resize', () => {
    if (!particleContext || prefersReducedMotion) return;
    resizeParticleCanvas();
    createParticles();
});

startParticles();

/* ══════════════════════════════════════
   NAVIGATION
══════════════════════════════════════ */
const sideButtons = document.querySelectorAll('.side-btn');
const toolSections = document.querySelectorAll('.tool-section');
const sectionOrder = ['home-section', 'cgpa-section', 'attendance-section', 'bunk-section', 'faculty-section', 'todo-subjects-section'];
const drawerOverlay = document.getElementById('drawer-overlay');
const moreOverlay = document.getElementById('more-overlay');
const sidebarWrapper = document.getElementById('sidebar-wrapper');
const hamburgerBtn = document.getElementById('hamburger-btn');
const moreDrawer = document.getElementById('more-drawer');
const moreToggle = document.getElementById('bnav-more');
const floatingActionBtn = document.getElementById('floating-action-btn');
const pageTransition = document.getElementById('page-transition');
const mainContent = document.getElementById('main-content');
const facultySearchInput = document.getElementById('faculty-search');
const facultyList = document.getElementById('faculty-list');
const facultyCount = document.getElementById('faculty-count');
const facultyEmpty = document.getElementById('faculty-empty');

const facultyRawData = `
Dr.T.Yuvaraj - 9944648832
Dr.R.Gaesan - 9444751780
Dr.N. Senthilkumar - 9944634394
Dr.Mary sanitha - 9884186752
Dr.M.S.Surender - 9791876953
Dr.Iyyappan J - 9600251579
Dr.I. Praveen Kumar - 9788169604
Dr.K.Sangeetha - 8838930689
Dr.Senthil Kumar C - 9940580501
Dr.Praveen R - 9962291255
Dr.Usha Rani - 9600071178
Dr.Geetha R - 8129511366
Dr.Priya Rachel - 9566019530
Dr.SHAKILA DEVI - 7339403331
Dr.M Ramalakshmi - 9884241227
Dr.V.Savithri - 9841531472
Dr.Vasudevan - 8056227308
Dr.M.Dinesh Kumar - 9791558517
Dr.B.Raja Bharathi - 9500891008
Dr.P.R.Karthikeyan - 9944218001
Dr.VIJAYAKUMARI P - 8754723181
Dr.K.Vijayalakshmi - 9655662491
Dr.R.Saravana Kumar - 9894951308
Dr.N.P.G Bhavani - 8778068976
Dr.G.Manikandan - 9176276410
Ms.Ashwini.S - 9952993184
Dr.Soundara - 9790953181
Dr.Shanmuga Prabha - 7092072387
Dr.Radhika Bhaskar - 9710321350
Dr.R.Dhanalakshmi - 9884787512
Sr.Sudha - 9994293489
Dr.Rajesh Kumar - 9842148424
Dr.Mahaveerakannan - 9788614129
Mr.Logu - 9042768897
Dr.V.Karthick - 9884142182
Dr.S.A.Kalaiselvan - 9043333903
Dr.A.Gnanasoundari - 8248974652
Dr.P.Muneeshwari - 978860336
Dr.Kesavan - 9444304384
Dr.U.Sakthi - 9444851523
Dr.U.Arul - 9841490831
Dr.Vijaya Basker - 9443033062
Dr.V.Parthipan - 9787366908
Dr.Sheela - 9962107078
Dr.M.Vanitha Lakshmi - 9791098344
Dr.Jesu Jeyarin - 9444053102
Dr.Rajasekar M - 9677034244
Dr.S.Kalaiarasi - 9445462495
Dr.L.Rama Pavarthy - 9840184995
Dr.Manikavelan - 9600040114
Dr.Tamilselvan - 9994095015
Dr.Kanimozhi - 9401730451
Dr.A.Shrivindhya - 9786197926
Dr.Rohith Bhat.C - 9840546333
Dr.Beulah David - 7010695064
Dr.S.Christy - 9884909250
Dr.M.Geetha - 9444387531
Dr.G.Michael - 9940284723
Dr.Somasundaram - 9443467264
Dr.Arumugam S S - 9962223356
Dr.Saravanan.M.S - 8190043400
Dr.Balamangandan - 8220115532
Dr.S.Ramesh - 9629570397
Dr.Gururam - 9841065075
Dr.P.Shyamala Bharathi - 9840703179
Dr.G.R.Suresh - 9600983735
Dr.Jemila Roseline - 9444552840
Dr.K.Anbazhagan - 6374775259
Dr.A.Selvakumar - 8837601800
Dr.A.Mohan - 9894183073
Dr.S.Narendran - 9884831644
Dr.A.Raja - 9884218839
Dr.N.Bharatha Devi - 9965868203
Dr.V.Nagaraju - 9840873669
Dr.S.Mahaboob Basha - 9841951420
Dr.J.Chenni Kumaran - 8825789793
Dr.A.Prabu - 9444841888
Dr.Eswar M - 9885506964
Dr.Gunaseelan - 9943084240
Dr.S.Jehoshan - 9500716590
Dr.B.V.Senthil Kumar - 9566927114
Dr.N.Vijaya - 9787180780
Dr.S.Poornavel - 9944361111
Dr.Muthukumar.P - 9787082715
Dr.M.S.Ravisankar - 7598642107
Dr.M.Ashokkumar - 9578082320
Dr.Shaafi.T - 9176096592
Dr.A.Rama - 9884477403
Dr.Simon Raj F - 9444045417
Dr.S.Manikandan - 9585153771
Dr.Jenila Rani - 9003194033
Dr.Neelam Sanjeev - 7395927651
Dr.Nirmala - 9884420495
Dr.Vaidhegi - 8754170887
Dr.T.S.Lakshmi - 9894733074
Dr.M.Nagaraj - 9789031659
Dr.M.Kalil Rahiman - 9994302469
Dr.Nimel Ross - 9952828610
Dr.R.Manikandan - 9976696620
Dr.Rajmohan - 9894103232
Dr.E.Sivanantham - 9940801817
Dr.Reenarani - 9791802182
Dr.Deepa - 9790909030
Dr.Padmakala - 8695467803
Dr.Jaisharma - 9597005225
Dr.Pradeep Kumar - 9941221988
Dr.G.Anitha - 9952286913
Dr.Charlyn - 9150963017
Dr.N.Nalini - 9941201779
Dr.P.Sriramya - 9176290854
Dr.C.Sherin Shibi - 9962533314
Dr.Rachel N - 9841313799
Dr.S.Magesh Kumar.S - 9789724877
Dr.Dhalapthy Rajasekar - 9445452697
Dr.Palanikumar - 9945522700
Dr.Rashmita Khilar - 9940220629
Dr.Gokul Krishna - 9894751429
Dr.Thinakaran - 9894475486
Dr.V.Deva Priya - 9442112071
Dr.J.Pravin Chander - 9786491044
Dr.Velu - 9380607095
Mr.Sridhar - 7708533460
Dr.M.Gunasekaran - 9486564226
Dr.Jagadeesan - 9865604964
Dr.S.Sobitha Ahila - 9444221394
Dr.C.Mohan - 8056983152
Dr.ANNIE GRACE - 9841540605
Dr.Prabhu - 9003256754
Dr.Terrance - 9944129501
`.trim();

const facultyDirectory = facultyRawData.split(/\n+/).map((line) => {
    const parts = line.split(/\s+-\s+/);
    return {
        name: (parts[0] || '').trim(),
        phone: (parts[1] || '').trim(),
    };
}).filter((entry) => entry.name && entry.phone);



function flashPageTransition() {
    if (!pageTransition || prefersReducedMotion) return;
    pageTransition.classList.add('active');
    window.clearTimeout(flashPageTransition.timeoutId);
    flashPageTransition.timeoutId = window.setTimeout(() => {
        pageTransition.classList.remove('active');
    }, 260);
}

function closeSidebar() {
    if (!sidebarWrapper || !drawerOverlay) return;
    sidebarWrapper.classList.remove('drawer-open');
    drawerOverlay.classList.remove('visible');
    if (hamburgerBtn) hamburgerBtn.classList.remove('open');
}

function openSidebar() {
    if (!sidebarWrapper || !drawerOverlay) return;
    sidebarWrapper.classList.add('drawer-open');
    drawerOverlay.classList.add('visible');
    if (hamburgerBtn) hamburgerBtn.classList.add('open');
}

function toggleSidebar() {
    if (!sidebarWrapper) return;
    if (sidebarWrapper.classList.contains('drawer-open')) closeSidebar();
    else openSidebar();
}

function closeMoreDrawer() {
    if (!moreDrawer || !moreOverlay) return;
    moreDrawer.classList.remove('open');
    moreOverlay.classList.remove('visible');
}

function openMoreDrawer() {
    if (!moreDrawer || !moreOverlay) return;
    moreDrawer.classList.add('open');
    moreOverlay.classList.add('visible');
}

function toggleMoreDrawer() {
    if (!moreDrawer) return;
    if (moreDrawer.classList.contains('open')) closeMoreDrawer();
    else openMoreDrawer();
}

function getActiveSectionIndex() {
    const activeSection = document.querySelector('.tool-section.active-section');
    return Math.max(0, sectionOrder.indexOf(activeSection?.id || 'home-section'));
}

function goToAdjacentSection(direction) {
    const currentIndex = getActiveSectionIndex();
    const nextIndex = Math.min(sectionOrder.length - 1, Math.max(0, currentIndex + direction));
    if (nextIndex === currentIndex) return;
    switchSection(sectionOrder[nextIndex]);
}

function normalizePhoneNumber(phone) {
    return phone.replace(/\D/g, '');
}

function buildWhatsAppLink(phone) {
    const digits = normalizePhoneNumber(phone);
    const recipient = digits.length === 10 ? `91${digits}` : digits;
    return `https://wa.me/${recipient}?text=${encodeURIComponent('Hello Professor')}`;
}

function renderFacultyDirectory(searchTerm = '') {
    try {
        if (!facultyList) return;

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredFaculty = facultyDirectory.filter((faculty) => {
        const nameMatch = faculty.name.toLowerCase().includes(normalizedSearch);
        const phoneMatch = faculty.phone.replace(/\s+/g, '').includes(normalizedSearch);
        return !normalizedSearch || nameMatch || phoneMatch;
    });

    facultyList.innerHTML = filteredFaculty.map((faculty) => {
        const callNumber = normalizePhoneNumber(faculty.phone);
        const whatsAppLink = buildWhatsAppLink(faculty.phone);
        return `
            <article class="faculty-card">
                <div class="faculty-info">
                    <div class="faculty-badge"><i class="fa-solid fa-user-tie"></i></div>
                    <div class="faculty-text">
                        <h3>${faculty.name}</h3>
                        <p>${faculty.phone}</p>
                    </div>
                </div>
                <div class="faculty-actions">
                    <a class="faculty-action call" href="tel:${callNumber}"><i class="fa-solid fa-phone"></i><span>Call</span></a>
                    <a class="faculty-action whatsapp" href="${whatsAppLink}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i><span>WhatsApp</span></a>
                </div>
            </article>
        `;
    }).join('');

    if (facultyCount) {
        facultyCount.textContent = `${filteredFaculty.length} / ${facultyDirectory.length} faculty`;
    }

    if (facultyEmpty) {
        facultyEmpty.classList.toggle('hidden', filteredFaculty.length > 0);
    }
    } catch (err) {
        console.error('Error rendering faculty directory:', err);
        // Show friendly fallback
        if (facultyList) facultyList.innerHTML = '';
        if (facultyEmpty) facultyEmpty.classList.remove('hidden');
        if (facultyCount) facultyCount.textContent = `0 / ${facultyDirectory.length} faculty`;
    }
}

if (facultySearchInput) {
    facultySearchInput.addEventListener('input', (event) => {
        renderFacultyDirectory(event.target.value);
    });
}

renderFacultyDirectory();

function switchSection(sectionId) {
    const targetBtn = document.querySelector(`[data-target="${sectionId}"]`);
    if (!targetBtn) return;
    
    sideButtons.forEach(b => b.classList.remove('active'));
    targetBtn.classList.add('active');
    
    /* Update bottom nav active state */
    const bnavButtons = document.querySelectorAll('.bnav-btn[data-target]');
    bnavButtons.forEach(btn => btn.classList.remove('active'));
    const activeBnavBtn = document.querySelector(`.bnav-btn[data-target="${sectionId}"]`);
    if (activeBnavBtn) {
        activeBnavBtn.classList.add('active');
    }
    
    toolSections.forEach(s => {
        s.classList.remove('active-section');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
    }
    
    localStorage.setItem('activeSection', sectionId);

    flashPageTransition();
    if (window.innerWidth < 769) {
        closeSidebar();
        closeMoreDrawer();
    }

    window.requestAnimationFrame(() => {
        const mainTarget = document.getElementById(sectionId);
        if (mainTarget) {
            mainTarget.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
    });
}

sideButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        switchSection(target);
    });
});

/* Restore previous section on page load */
window.addEventListener('DOMContentLoaded', () => {
    const savedSection = localStorage.getItem('activeSection') || 'home-section';
    switchSection(savedSection);
});

/* Bottom nav buttons */
const bnavButtons = document.querySelectorAll('.bnav-btn[data-target]');
bnavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        switchSection(target);
    });
});

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleSidebar);
}

if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeSidebar);
}

if (moreToggle) {
    moreToggle.addEventListener('click', toggleMoreDrawer);
}

if (moreOverlay) {
    moreOverlay.addEventListener('click', closeMoreDrawer);
}

if (floatingActionBtn) {
    floatingActionBtn.addEventListener('click', () => {
        toggleMoreDrawer();
    });
}

if (moreDrawer) {
    moreDrawer.addEventListener('touchstart', (event) => {
        moreDrawer.dataset.touchStartY = String(event.touches[0].clientY);
    }, { passive: true });

    moreDrawer.addEventListener('touchend', (event) => {
        const startY = parseFloat(moreDrawer.dataset.touchStartY || '0');
        const endY = event.changedTouches[0].clientY;
        if (startY && endY - startY > 60) {
            closeMoreDrawer();
        }
    }, { passive: true });
}

if (mainContent) {
    let touchStartX = 0;
    let touchStartY = 0;

    mainContent.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    mainContent.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) return;
        if (deltaX < 0) goToAdjacentSection(1);
        else goToAdjacentSection(-1);
    }, { passive: true });
}

/* Get Started button */
const getStartedBtn = document.getElementById('get-started-btn');
if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
        const cgpaBtn = document.querySelector('[data-target="cgpa-section"]');
        if (cgpaBtn) cgpaBtn.click();
    });
}

/* ══════════════════════════════════════
   CGPA CALCULATOR
   Grade points: S=10, A=9, B=8, C=7, D=6, E=5
══════════════════════════════════════ */
let gradeChart = null;

function updateGradeChart(grades) {
    const chartCanvas = document.getElementById('grade-distribution-chart');
    if (!chartCanvas) return;
    
    if (gradeChart) {
        gradeChart.destroy();
    }
    
    const ctx = chartCanvas.getContext('2d');
    gradeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['S (10)', 'A (9)', 'B (8)', 'C (7)', 'D (6)', 'E (5)'],
            datasets: [{
                label: 'Subjects',
                data: [grades.s.val, grades.a.val, grades.b.val, grades.c.val, grades.d.val, grades.e.val],
                backgroundColor: ['#10b981', '#3b82f6', '#6366f1', '#f59e0b', '#ea580c', '#ef4444'],
                borderRadius: 8,
                hoverBackgroundColor: ['#059669', '#1d4ed8', '#4f46e5', '#d97706', '#dc2626', '#dc2626']
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true, max: 10 }
            }
        }
    });
}

function updateGradeStats(grades) {
    const gradeValues = Object.values(grades).map(g => g.val);
    const totalSubjects = gradeValues.reduce((a, b) => a + b, 0);
    
    const maxGrades = [
        { grade: 'S', val: grades.s.val, weight: 10 },
        { grade: 'A', val: grades.a.val, weight: 9 },
        { grade: 'B', val: grades.b.val, weight: 8 },
        { grade: 'C', val: grades.c.val, weight: 7 },
        { grade: 'D', val: grades.d.val, weight: 6 },
        { grade: 'E', val: grades.e.val, weight: 5 },
    ];
    
    let highestGrade = '--';
    for (let i = 0; i < maxGrades.length; i++) {
        if (maxGrades[i].val > 0) {
            highestGrade = maxGrades[i].grade;
            break;
        }
    }
    
    const totalPoints = Object.values(grades).reduce((s, g) => s + g.val * g.pts, 0);
    const avgGrade = totalSubjects > 0 ? (totalPoints / totalSubjects).toFixed(2) : '--';
    
    document.getElementById('total-subjects').textContent = totalSubjects;
    document.getElementById('highest-grade').textContent = highestGrade;
    document.getElementById('avg-grade').textContent = avgGrade;
}

document.getElementById('calc-cgpa').addEventListener('click', () => {
    const grades = {
        s: { val: parseInt(document.getElementById('grade-s').value) || 0, pts: 10 },
        a: { val: parseInt(document.getElementById('grade-a').value) || 0, pts: 9 },
        b: { val: parseInt(document.getElementById('grade-b').value) || 0, pts: 8 },
        c: { val: parseInt(document.getElementById('grade-c').value) || 0, pts: 7 },
        d: { val: parseInt(document.getElementById('grade-d').value) || 0, pts: 6 },
        e: { val: parseInt(document.getElementById('grade-e').value) || 0, pts: 5 },
    };

    const totalSubjects = Object.values(grades).reduce((s, g) => s + g.val, 0);
    if (totalSubjects === 0) { alert('Please enter at least one grade.'); return; }

    const totalPoints = Object.values(grades).reduce((s, g) => s + g.val * g.pts, 0);
    const cgpa = (totalPoints / totalSubjects).toFixed(2);

    let desc = '';
    if (cgpa >= 9.5) desc = '🏆 Outstanding – First Class with Distinction!';
    else if (cgpa >= 8.5) desc = '🌟 Excellent – First Class!';
    else if (cgpa >= 7.5) desc = '✅ Very Good – Keep it up!';
    else if (cgpa >= 6.5) desc = '👍 Good – You can do better!';
    else if (cgpa >= 5.5) desc = '⚠️ Average – Time to study harder!';
    else desc = '❌ Below Average – Serious attention needed!';

    document.getElementById('cgpa-result').textContent = cgpa;
    document.getElementById('cgpa-desc').textContent = desc;
    
    const barWidth = (cgpa / 10) * 100;
    document.getElementById('cgpa-bar').style.width = barWidth + '%';

    document.getElementById('cgpa-empty-state').classList.add('hidden');
    const resultState = document.getElementById('cgpa-result-state');
    resultState.classList.remove('hidden');
    
    updateGradeChart(grades);
    updateGradeStats(grades);
    
    // Re-trigger animation
    resultState.style.animation = 'none';
    resultState.offsetHeight;
    resultState.style.animation = '';
});

document.getElementById('reset-cgpa').addEventListener('click', () => {
    ['grade-s','grade-a','grade-b','grade-c','grade-d','grade-e'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('cgpa-empty-state').classList.remove('hidden');
    document.getElementById('cgpa-result-state').classList.add('hidden');
    if (gradeChart) {
        gradeChart.destroy();
        gradeChart = null;
    }
});

/* ══════════════════════════════════════
   ATTENDANCE CALCULATOR
══════════════════════════════════════ */
document.getElementById('calc-attendance').addEventListener('click', () => {
    const total    = parseInt(document.getElementById('total-classes').value);
    const attended = parseInt(document.getElementById('attended-classes').value);
    // Validate inputs (allow attended = 0)
    if (isNaN(total) || isNaN(attended) || total <= 0 || attended < 0 || attended > total) {
        alert('Please enter valid class numbers.');
        return;
    }

    const pct = ((attended / total) * 100).toFixed(2);
    const deficit = Math.max(0, Math.ceil(0.8 * total) - attended);

    let desc = '';
    if (pct >= 80) {
        // Correct formula: find max X such that attended / (total + X) >= 0.8
        // attended >= 0.8 * (total + X)  =>  X <= (attended - 0.8*total) / 0.8
        const raw = (attended - 0.8 * total) / 0.8;
        const canBunk = Math.max(0, Math.floor(raw));
        desc = `✅ You're safe! You can still miss up to ${canBunk} class${canBunk !== 1 ? 'es' : ''}.`;
    } else {
        desc = `⚠️ Below 80%! Attend ${deficit} more class${deficit !== 1 ? 'es' : ''} to recover.`;
    }

    document.getElementById('attendance-result').textContent = pct + '%';
    document.getElementById('att-desc').textContent = desc;
    document.getElementById('att-desc').style.color = pct >= 80 ? '#059669' : '#ea580c';

    document.getElementById('att-empty-state').classList.add('hidden');
    const rs = document.getElementById('att-result-state');
    rs.classList.remove('hidden');
    rs.style.animation = 'none'; rs.offsetHeight; rs.style.animation = '';
});

/* ══════════════════════════════════════
   BUNK CALCULATOR
══════════════════════════════════════ */
document.getElementById('calc-bunk').addEventListener('click', () => {
    const total    = parseInt(document.getElementById('bunk-total').value);
    const attended = parseInt(document.getElementById('bunk-attended').value);

    if (!total || !attended || attended > total) {
        alert('Please enter valid class numbers.');
        return;
    }

    const currentPct = ((attended / total) * 100).toFixed(2);
    const safeBunks = Math.max(0, Math.floor((attended - 0.8 * total) / 0.8));

    document.getElementById('bunk-empty-state').classList.add('hidden');
    const rs = document.getElementById('bunk-result-state');
    rs.classList.remove('hidden');
    rs.style.animation = 'none'; rs.offsetHeight; rs.style.animation = '';

    // Update result card styling based on attendance
    const resultCard = rs.closest('.result-panel');
    if (currentPct >= 80) {
        resultCard.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        resultCard.style.background = 'linear-gradient(160deg, #f0fdf4, #e8f8f5)';
    } else {
        resultCard.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        resultCard.style.background = 'linear-gradient(160deg, #fef2f2, #fff5f5)';
    }

    // Update current attendance display
    const attendanceSpan = document.getElementById('bunk-current-attendance');
    attendanceSpan.textContent = currentPct + '%';
    attendanceSpan.style.color = currentPct >= 80 ? '#10b981' : '#ef4444';

    if (currentPct >= 80) {
        document.getElementById('bunk-title').textContent = 'Safe Bunks Available';
        document.getElementById('bunk-huge').textContent = safeBunks;
        document.getElementById('bunk-huge').style.color = '#10b981';
        
        if (safeBunks > 0) {
            document.getElementById('bunk-desc').textContent = `You can safely skip ${safeBunks} more class${safeBunks !== 1 ? 'es' : ''} while maintaining 80% attendance.`;
            document.getElementById('bunk-desc').style.color = '#059669';
        } else {
            document.getElementById('bunk-desc').textContent = `You're right at 80% attendance. Attend all remaining classes to maintain your standing.`;
            document.getElementById('bunk-desc').style.color = '#f59e0b';
        }
    } else {
        document.getElementById('bunk-title').textContent = 'Below Minimum Attendance';
        document.getElementById('bunk-huge').textContent = '0';
        document.getElementById('bunk-huge').style.color = '#ef4444';
        const neededAttendance = Math.ceil(0.8 * total) - attended;
        document.getElementById('bunk-desc').textContent = `Attend ${neededAttendance} more class${neededAttendance !== 1 ? 'es' : ''} to reach 80% before considering any bunks.`;
        document.getElementById('bunk-desc').style.color = '#dc2626';
    }
});

/* ══════════════════════════════════════
   EXTERNAL LINK BUTTONS — RIPPLE EFFECT
══════════════════════════════════════ */

/* Inject ripple keyframe once */
(function () {
    const s = document.createElement('style');
    s.textContent = `@keyframes rippleAnim { to { transform: scale(2.8); opacity: 0; } }`;
    document.head.appendChild(s);
})();

document.querySelectorAll('.portal-btn, .food-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${e.clientX - rect.left - size / 2}px;
            top: ${e.clientY - rect.top - size / 2}px;
            background: rgba(255, 255, 255, 0.38);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleAnim 0.55s linear forwards;
            pointer-events: none;
            z-index: 5;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

/* ══════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════ */
const htmlElement = document.documentElement;
const themeToggles = [
    document.getElementById('theme-toggle-mobile'),
    document.getElementById('theme-toggle-sidebar'),
    document.getElementById('bnav-theme-toggle')
];
const themeIcons = [
    document.getElementById('theme-icon-mobile'),
    document.getElementById('theme-icon-sidebar')
];

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
    
    if (gradeChart) {
        const colors = getThemeColors();
        gradeChart.options.plugins.legend.labels.color = colors.textColor;
        gradeChart.options.plugins.tooltip.backgroundColor = 'rgba(0,0,0,0.8)';
        gradeChart.update();
    }
}

function updateThemeIcons(theme) {
    themeIcons.forEach(icon => {
        if (icon) {
            icon.classList.remove('fa-moon', 'fa-sun');
            icon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
        }
    });
    
    const themeLabel = document.getElementById('theme-drawer-label');
    if (themeLabel) {
        themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
    
    const togglePill = document.getElementById('theme-pill');
    if (togglePill) {
        togglePill.classList.toggle('on', theme === 'dark');
    }

    if (pageTransition) {
        pageTransition.style.background = theme === 'dark'
            ? 'radial-gradient(circle at center, rgba(16,185,129,0.24), transparent 45%), linear-gradient(135deg, rgba(3,8,20,0.05), rgba(16,185,129,0.14), rgba(59,130,246,0.08))'
            : 'radial-gradient(circle at center, rgba(16,185,129,0.18), transparent 45%), linear-gradient(135deg, rgba(255,255,255,0.18), rgba(16,185,129,0.1), rgba(59,130,246,0.08))';
    }
}

themeToggles.forEach(toggle => {
    if (toggle) {
        toggle.addEventListener('click', toggleTheme);
    }
});

/* ══════════════════════════════════════
   EXPORT (IMAGE / PDF) HELPERS
══════════════════════════════════════ */

function captureNodeAsBlob(node) {
    // Keep legacy function but route through export-friendly capture
    return exportCapture(node).then(canvas => new Promise(resolve => canvas.toBlob(resolve, 'image/png')));
}

/**
 * Create an off-screen clone of `node`, force a solid background (no alpha),
 * capture it with html2canvas and remove the clone. Returns the canvas.
 */
async function exportCapture(node) {
    if (!node) throw new Error('No node provided for exportCapture');

    // Clone node to avoid mutating original
    const clone = node.cloneNode(true);
    const rect = node.getBoundingClientRect();

    // Compute a solid background color from computed style (fallback to white/dark)
    const computed = window.getComputedStyle(node);
    let bg = computed.backgroundColor;
    if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        bg = theme === 'dark' ? '#07111f' : '#ffffff';
    }

    // Apply inline styles to the clone to ensure consistent export rendering
    clone.style.boxSizing = 'border-box';
    clone.style.width = '100%';
    clone.style.height = '100%';
    clone.style.margin = '0';
    clone.style.transition = 'none';
    clone.style.removeProperty = 'transform';

    // Wrap the clone inside a fixed container off-screen so fonts and images render
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-20000px';
    container.style.top = '0';
    container.style.padding = '0';
    container.style.zIndex = '99999';
    container.style.width = rect.width + 'px';
    container.style.height = rect.height + 'px';

    // Prefer capturing the computed background-image (gradient) when present
    const bgImage = computed.backgroundImage;
    if (bgImage && bgImage !== 'none') {
        container.style.backgroundImage = bgImage;
        container.style.backgroundRepeat = computed.backgroundRepeat || 'no-repeat';
        container.style.backgroundSize = computed.backgroundSize || 'cover';
        container.style.backgroundPosition = computed.backgroundPosition || 'center';
        // make clone transparent so container gradient shows through
        clone.style.background = 'transparent';
    } else {
        container.style.background = bg;
        clone.style.background = bg;
    }

    container.appendChild(clone);
    document.body.appendChild(container);

    try {
        const scale = Math.min(2, window.devicePixelRatio || 1);
        // capture the container so the gradient background is included
        const canvas = await html2canvas(container, { useCORS: true, backgroundColor: null, scale });
        return canvas;
    } finally {
        // clean up
        container.remove();
    }
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadNodeImage(selector, filename) {
    const node = document.querySelector(selector);
    if (!node) { alert('Export target not found.'); return; }
    const blob = await captureNodeAsBlob(node);
    if (blob) downloadBlob(blob, filename);
}

async function downloadNodePDF(selector, filename) {
    const node = document.querySelector(selector);
    if (!node) { alert('Export target not found.'); return; }
    const canvas = await exportCapture(node);
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf || window.jspdf || {};
    const PdfConstructor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF ? window.jsPDF : null);
    const pdfLib = PdfConstructor || (typeof jsPDF === 'function' ? jsPDF : null);
    if (!pdfLib) {
        alert('PDF library not available.');
        return;
    }
    const pdf = new pdfLib('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(filename + '.pdf');
}

function makeFilename(base) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${base}_${stamp}`;
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cgpa-download-img')?.addEventListener('click', () => downloadNodeImage('#cgpa-result-state', makeFilename('CGPA_Report') + '.png'));
    document.getElementById('cgpa-download-pdf')?.addEventListener('click', () => downloadNodePDF('#cgpa-result-state', makeFilename('CGPA_Report')));

    document.getElementById('att-download-img')?.addEventListener('click', () => downloadNodeImage('#att-result-state', makeFilename('Attendance_Report') + '.png'));
    document.getElementById('att-download-pdf')?.addEventListener('click', () => downloadNodePDF('#att-result-state', makeFilename('Attendance_Report')));

    document.getElementById('bunk-download-img')?.addEventListener('click', () => downloadNodeImage('#bunk-result-state', makeFilename('Bunk_Report') + '.png'));
    document.getElementById('bunk-download-pdf')?.addEventListener('click', () => downloadNodePDF('#bunk-result-state', makeFilename('Bunk_Report')));
});

initTheme();

/* ══════════════════════════════════════
   TO DO / SUBJECTS UI
══════════════════════════════════════ */
const departments = [
    'AGRI','BT','CSE - CYBER SECURITY','CSE - DATA SCIENCE','IT','AIDS','CIVIL','CSE','ECE','BI','CSBS',
    'CSE - ARTIFICIAL INTELLIGENCE','EEE','MECH','BME','CSE - IOT','CSE - BIOSCIENCE','ENEE','AIML'
];

const deptMeta = {
    'AGRI': { icon: 'fa-wheat-awn', accent: '#16a34a', bg: 'rgba(22,163,74,0.12)', soft: 'rgba(22,163,74,0.18)' },
    'BT': { icon: 'fa-dna', accent: '#0ea5e9', bg: 'rgba(14,165,233,0.12)', soft: 'rgba(14,165,233,0.18)' },
    'CSE - CYBER SECURITY': { icon: 'fa-shield-halved', accent: '#7c3aed', bg: 'rgba(124,58,237,0.12)', soft: 'rgba(124,58,237,0.18)' },
    'CSE - DATA SCIENCE': { icon: 'fa-chart-line', accent: '#2563eb', bg: 'rgba(37,99,235,0.12)', soft: 'rgba(37,99,235,0.18)' },
    'IT': { icon: 'fa-laptop-code', accent: '#0f766e', bg: 'rgba(15,118,110,0.12)', soft: 'rgba(15,118,110,0.18)' },
    'AIDS': { icon: 'fa-heart-pulse', accent: '#db2777', bg: 'rgba(219,39,119,0.12)', soft: 'rgba(219,39,119,0.18)' },
    'CIVIL': { icon: 'fa-building', accent: '#f97316', bg: 'rgba(249,115,22,0.12)', soft: 'rgba(249,115,22,0.18)' },
    'CSE': { icon: 'fa-computer', accent: '#1d4ed8', bg: 'rgba(29,78,216,0.12)', soft: 'rgba(29,78,216,0.18)' },
    'ECE': { icon: 'fa-microchip', accent: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', soft: 'rgba(139,92,246,0.18)' },
    'BI': { icon: 'fa-book-open', accent: '#059669', bg: 'rgba(5,150,105,0.12)', soft: 'rgba(5,150,105,0.18)' },
    'CSBS': { icon: 'fa-briefcase', accent: '#ca8a04', bg: 'rgba(202,138,4,0.12)', soft: 'rgba(202,138,4,0.18)' },
    'CSE - ARTIFICIAL INTELLIGENCE': { icon: 'fa-robot', accent: '#6366f1', bg: 'rgba(99,102,241,0.12)', soft: 'rgba(99,102,241,0.18)' },
    'EEE': { icon: 'fa-bolt', accent: '#f59e0b', bg: 'rgba(245,158,11,0.12)', soft: 'rgba(245,158,11,0.18)' },
    'MECH': { icon: 'fa-gears', accent: '#64748b', bg: 'rgba(100,116,139,0.12)', soft: 'rgba(100,116,139,0.18)' },
    'BME': { icon: 'fa-stethoscope', accent: '#14b8a6', bg: 'rgba(20,184,166,0.12)', soft: 'rgba(20,184,166,0.18)' },
    'CSE - IOT': { icon: 'fa-wifi', accent: '#06b6d4', bg: 'rgba(6,182,212,0.12)', soft: 'rgba(6,182,212,0.18)' },
    'CSE - BIOSCIENCE': { icon: 'fa-dna', accent: '#22c55e', bg: 'rgba(34,197,94,0.12)', soft: 'rgba(34,197,94,0.18)' },
    'ENEE': { icon: 'fa-plug-circle-bolt', accent: '#ef4444', bg: 'rgba(239,68,68,0.12)', soft: 'rgba(239,68,68,0.18)' },
    'AIML': { icon: 'fa-brain', accent: '#ec4899', bg: 'rgba(236,72,153,0.12)', soft: 'rgba(236,72,153,0.18)' }
};

const deptSummaries = {};
departments.forEach(d => {
    deptSummaries[d] = `${d} — Short summary placeholder. Replace with real description.`;
});

const pdfLinks = {
    '2024': {
        'AGRI': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20AGRI.pdf'
        , 'AIDS': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20AIDS.pdf'
        , 'BI': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20BI.pdf'
        , 'BME': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20BME.pdf'
        , 'BT': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20BT.pdf'
        , 'CIVIL': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20CIVIL.pdf'
        , 'CSBS': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20CSBS.pdf'
        , 'CSE - IOT': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20CSE%20-%20IOT.pdf'
        , 'CSE - CYBER SECURITY': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20CSE%20-CYBER%20SECURITY.pdf'
        , 'CSE - ARTIFICIAL INTELLIGENCE': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20CSE-ARTIFICIAL%20INTELLIGENCE.pdf'
        , 'CSE - BIOSCIENCE': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20CSE-BIOSCIENCE.pdf'
        , 'CSE - DATA SCIENCE': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20CSE-DATA%20SCIENCE.pdf'
        , 'ECE': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20ECE.pdf'
        , 'EEE': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20EEE.pdf'
        , 'ENEE': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20ENEE.pdf'
        , 'IT': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20IT.pdf'
        , 'MECH': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024%20MECH.pdf'
        , 'AIML': 'https://kxxflaefgmjeildvstlp.supabase.co/storage/v1/object/public/AGRI/2024-AIML.pdf'
    }
}; // { '2022': { 'CSE': 'https://...' } } — to be filled later

let selectedYear = '2022';

function getDeptLink(year, dept) {
    return (pdfLinks[year] && pdfLinks[year][dept]) || '';
}

function openDeptPdf(year, dept) {
    const link = getDeptLink(year, dept);
    if (!link) return false;
    window.open(link, '_blank', 'noopener,noreferrer');
    return true;
}

function setSelectedDeptCard(year, dept) {
    const cards = document.querySelectorAll('.dept-card');
    cards.forEach((card) => {
        const isActive = card.dataset.year === year && card.dataset.dept === dept;
        card.classList.toggle('selected', isActive);
    });
}

function renderYear(year) {
    const list = document.getElementById('dept-list');
    if (!list) return;
    list.innerHTML = '';
    departments.forEach((dept) => {
        const link = getDeptLink(year, dept);
        const meta = deptMeta[dept] || { icon: 'fa-graduation-cap', accent: '#10b981' };
        const a = document.createElement('article');
        a.className = 'dept-card';
        a.tabIndex = 0;
        a.dataset.year = year;
        a.dataset.dept = dept;
        a.dataset.hasLink = link ? 'true' : 'false';
        a.style.setProperty('--dept-accent', meta.accent);
        a.style.setProperty('--dept-accent-bg', meta.bg || 'rgba(16,185,129,0.12)');
        a.style.setProperty('--dept-accent-soft', meta.soft || 'rgba(16,185,129,0.18)');
        a.style.animationDelay = `${departments.indexOf(dept) * 45}ms`;
        a.innerHTML = `
            <div class="dept-accent-bar"></div>
            <div class="dept-card-icon"><i class="fa-solid ${meta.icon}"></i></div>
            <div class="dept-card-inner">
                <div class="dept-card-topline">
                    <span class="dept-tag">${year}</span>
                    <span class="dept-link-state ${link ? 'live' : 'placeholder'}">${link ? 'PDF ready' : 'Coming soon'}</span>
                </div>
                <div class="dept-name">${dept}</div>
                <div class="dept-summary">${deptSummaries[dept]}</div>
            </div>
            <div class="dept-card-actions">
                <button class="btn small-btn open-dept" data-dept="${dept}" data-year="${year}">${link ? 'Open PDF' : 'Details'}</button>
            </div>
        `;
        a.addEventListener('click', () => {
            setSelectedDeptCard(year, dept);
            if (!openDeptPdf(year, dept)) {
                showDeptDetail(year, dept);
            }
        });
        list.appendChild(a);
    });

    // attach listeners
    list.querySelectorAll('.open-dept').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dept = btn.dataset.dept;
            const yr = btn.dataset.year;
            setSelectedDeptCard(yr, dept);
            if (!openDeptPdf(yr, dept)) {
                showDeptDetail(yr, dept);
            }
        });
    });
}

function showDeptDetail(year, dept) {
    const title = document.getElementById('dept-detail-title');
    const summary = document.getElementById('dept-detail-summary');
    const openPdf = document.getElementById('dept-open-pdf');
    if (title) title.textContent = dept;
    if (summary) summary.textContent = deptSummaries[dept] || '';
    if (openPdf) {
        const link = getDeptLink(year, dept);
        if (link) {
            openPdf.classList.remove('disabled');
            openPdf.href = link;
            openPdf.removeAttribute('aria-disabled');
            openPdf.textContent = 'Open PDF';
        } else {
            openPdf.classList.add('disabled');
            openPdf.href = '#';
            openPdf.setAttribute('aria-disabled', 'true');
            openPdf.textContent = 'Open PDF (placeholder)';
        }
    }
}

// Year buttons
document.querySelectorAll('.year-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const year = btn.dataset.year;
        selectedYear = year;
        document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderYear(year);
    });
});

// Initialize with 2022 selected
window.addEventListener('DOMContentLoaded', () => {
    const defaultBtn = document.querySelector('.year-btn[data-year="2022"]');
    if (defaultBtn) defaultBtn.click();
});