document.addEventListener('DOMContentLoaded', () => {
    const languageToggle = document.getElementById('languageToggle');
    const languageText = document.getElementById('languageText');
    const projectsContainer = document.getElementById('projects-container');
    
    const textsToChange = document.querySelectorAll("[data-section]");

    let currentLanguage = 'es';

    const loadLanguage = (language) => {
        fetch(`${language}.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                textsToChange.forEach((el) => {
                    const section = el.dataset.section;
                    const value = el.dataset.value;
                    el.innerHTML = data[section][value];
                });

                const projects = data.projects; 
                renderProjects(projects);
            })
            .catch((error) => {
                console.error("Error al cargar el archivo de idioma:", error);
            });
    };

    const renderProjects = (projects) => {
        projectsContainer.innerHTML = '';
        Object.keys(projects).forEach((key) => {
            const project = projects[key];
            projectsContainer.innerHTML += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="project-card h-100 border-0">
                        <div class="position-relative overflow-hidden">
                            <img src="${project.imageUrl}" class="card-img-top" alt="${project.title}" />
                        </div>
                        <div class="card-body p-4 d-flex flex-column">
                            <h4 class="fw-bold mb-2">${project.title}</h4>
                            <p class="text-muted small mb-4">${project.description}</p>
                            <div class="mt-auto">
                                <div class="d-flex flex-wrap mb-3">
                                    ${project.technologies.map(tech => `<span class="technology-tag">${tech}</span>`).join('')}
                                </div>
                                <a href="${project.link}" class="btn btn-primary btn-sm w-100" target="_blank">${project.buttonText}</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    };

    // Form Handling with Formspree and Custom Toast
    const contactForm = document.getElementById('contactForm');
    const toastEl = document.getElementById('contactToast');
    const contactToast = new bootstrap.Toast(toastEl, { delay: 5000 });

    const showToast = (message, type = 'success') => {
        const toastMsg = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');
        
        toastEl.classList.remove('success', 'error');
        toastEl.classList.add(type);
        
        toastIcon.innerHTML = type === 'success' 
            ? '<i class="bi bi-check-circle-fill"></i>' 
            : '<i class="bi bi-exclamation-triangle-fill"></i>';
            
        toastMsg.textContent = message;
        contactToast.show();
    };

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitButton');
            const originalText = submitBtn.innerHTML;
            const formData = new FormData(contactForm);
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showToast(currentLanguage === 'es' 
                        ? '¡Gracias! Tu mensaje ha sido enviado con éxito.' 
                        : 'Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                } else {
                    showToast(currentLanguage === 'es' 
                        ? 'Hubo un problema. Inténtalo de nuevo.' 
                        : 'There was a problem. Please try again.', 'error');
                }
            } catch (error) {
                showToast(currentLanguage === 'es' 
                    ? 'Error de conexión.' 
                    : 'Connection error.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    languageToggle.addEventListener('change', () => {
        currentLanguage = languageToggle.checked ? 'en' : 'es';
        languageText.textContent = currentLanguage.toUpperCase();
        loadLanguage(currentLanguage);
    });

    loadLanguage(currentLanguage);
});
