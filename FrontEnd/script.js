let allProjectsData = [];
let allCategories = [];

function removeGallery() {
    const remGallery = document.querySelector(".gallery");
    if (remGallery) {
        remGallery.remove();
    }
}

function fetchProjects() {
    const urlAPI = 'http://localhost:5678/api/works';

    return fetch(urlAPI)
        .then(response => response.json())
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données de l\'API : ', error);
        });
}

function addProjects(projectsData) {
    const gallerySection = document.getElementById('portfolio');
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');

    projectsData.forEach(element => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = element.imageUrl;
        img.alt = element.title;
        figcaption.textContent = element.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });

    gallerySection.appendChild(gallery);
}

function updateProjectsByCategory(selectedCategory) {
    let filteredProjects = [];
    if (selectedCategory === 'all') {
        filteredProjects = allProjectsData; // Afficher tous les projets si la catégorie est "all"
    } else {
        filteredProjects = allProjectsData.filter(project => project.category.name === selectedCategory); // Filtrer les projets par catégorie
    }

    removeGallery();
    addProjects(filteredProjects);
}

function getCategoryLabel(category) {
    return category.name; // Utiliser le nom de la catégorie directement depuis l'objet de catégorie
}

function fetchCategories() {
    const urlAPI = 'http://localhost:5678/api/categories';

    return fetch(urlAPI)
        .then(response => response.json())
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des catégories depuis l\'API : ', error);
        });
}

function addFilterButtons() {
    fetchCategories()
        .then(categories => {
            allCategories = categories; // Stocker les catégories récupérées dans la variable globale
            const filterButtonsContainer = document.createElement('div');
            filterButtonsContainer.classList.add('filter-buttons');

            const allButton = document.createElement('a');
            allButton.href = '#';
            allButton.classList.add('filter-button');
            allButton.textContent = 'Tous';
            allButton.addEventListener('click', () => {
                updateProjectsByCategory('all');
            });
            filterButtonsContainer.appendChild(allButton);

            allCategories.forEach(category => {
                const button = document.createElement('a');
                button.href = '#';
                button.classList.add('filter-button');
                button.textContent = getCategoryLabel(category);
                button.setAttribute('data-category', category.name);

                button.addEventListener('click', () => {
                    const selectedCategory = button.getAttribute('data-category');
                    updateProjectsByCategory(selectedCategory); // Filtrer les projets en fonction de la catégorie sélectionnée
                });

                filterButtonsContainer.appendChild(button);
            });

            const portfolioSection = document.getElementById('portfolio');
            const gallery = portfolioSection.querySelector('.gallery');
            portfolioSection.insertBefore(filterButtonsContainer, gallery);
        });
}

fetchProjects()
    .then(projectsData => {
        allProjectsData = projectsData; // Stocker les projets récupérés dans la variable globale
        addFilterButtons();
        updateProjectsByCategory('all'); // Afficher tous les projets initialement
    });