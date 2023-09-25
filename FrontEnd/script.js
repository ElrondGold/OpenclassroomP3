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
        filteredProjects = allProjectsData;
    } else {
        filteredProjects = allProjectsData.filter(project => project.category.name === selectedCategory);
    }

    removeGallery();
    addProjects(filteredProjects);
}

function getCategoryLabel(category) {
    return category.name;
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
            allCategories = categories;
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
                    updateProjectsByCategory(selectedCategory);
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
        allProjectsData = projectsData;
        addFilterButtons();
        updateProjectsByCategory('all');
        fetchProjects()
    });

function checkLoggedIn() {
    const isLoggedIn = localStorage.getItem('token') !== null;
    const loginLink = document.querySelector('#loginLink');

    if (isLoggedIn) {
        loginLink.textContent = 'logout';
        loginLink.href = '#';
        loginLink.id = 'logoutLink';
        loginLink.addEventListener('click', handleLogout);
    } else {

        loginLink.textContent = 'login';
        loginLink.href = 'login.html';
        loginLink.removeEventListener('click', handleLogout);
    }
}


function handleLogout(event) {
    event.preventDefault();


    localStorage.removeItem('token');

    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', checkLoggedIn);

document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('token') !== null;
    const ribbon = document.getElementById('ribbon');
    const editModeButton = document.getElementById('editModeButton');
    const logoutLink = document.getElementById('logoutLink');
    const editButtonsContainer = document.querySelectorAll('.editButtons');
    const filterButtonsContainer = document.querySelector('.filter-buttons');
    const goToStep1Button = document.getElementById('goToStep1');
    const goToStep2Button = document.getElementById('goToStep2');
    const modalContentStep1 = document.querySelector('.modal-content.step-1');
    const modalContentStep2 = document.querySelector('.modal-content.step-2');

    const goToStep2 = () => {
        modalContentStep1.style.display = 'none';
        modalContentStep2.style.display = 'block';
    };

    const goToStep1 = () => {
        modalContentStep2.style.display = 'none';
        modalContentStep1.style.display = 'block';
    };

    goToStep2Button.addEventListener('click', goToStep2);
    goToStep1Button.addEventListener('click', goToStep1);

    if (isLoggedIn) {
        ribbon.style.display = 'flex';
        editButtonsContainer.forEach(button => {
            button.style.display = 'flex';
        });

        if (filterButtonsContainer) {
            filterButtonsContainer.style.display = 'none';
        }
    } else {
        ribbon.style.display = 'none';
        editButtonsContainer.forEach(button => {
            button.style.display = 'none';
        });

        if (filterButtonsContainer) {
            filterButtonsContainer.style.display = 'flex';
        }
    }

    editModeButton.addEventListener('click', () => {
    });

    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();

        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

});


let modal = null;

const openModal = function (target) {
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const closeModal = function () {
    if (modal === null) return;
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

const handleModalOpen = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    openModal(target);

    const modalProjectsContainer = document.querySelector('.modal-projects');
    modalProjectsContainer.innerHTML = '';

    editProjectsToModal(allProjectsData);
};


function initializeModal() {
    document.querySelectorAll('.modifier-button').forEach(a => {
        a.addEventListener('click', handleModalOpen);
    });

    window.addEventListener('keydown', function (e) {
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal();
        }
    });
    editProjectsToModal(allProjectsData);
}

document.addEventListener('DOMContentLoaded', initializeModal);

function editProjectsToModal(projectsData) {
    const modalProjectsContainer = document.querySelector('.modal-projects');
    modalProjectsContainer.innerHTML = '';

    projectsData.forEach(project => {
        const projectFigure = document.createElement('figure');
        const projectImage = document.createElement('img');
        const projectCaption = document.createElement('figcaption');
        const deleteIcon = document.createElement('i');

        projectImage.src = project.imageUrl;
        projectImage.alt = project.title;

        deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon');

        deleteIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            const projectFigure = deleteIcon.closest('figure');
            const projectImage = projectFigure.querySelector('img');
            const projectTitle = projectImage.alt;

            const projectIndex = allProjectsData.findIndex(project => project.title === projectTitle);
            if (projectIndex !== -1) {
                const projectId = allProjectsData[projectIndex].id;
                deleteProjectFromAPI(projectId)
                    .then(() => {
                        allProjectsData.splice(projectIndex, 1);
                        saveProjectsToLocalStorage();
                        updateProjectsByCategory('all');
                        editProjectsToModal(allProjectsData);
                    })
                    .catch(error => {
                        console.error('Erreur lors de la suppression du projet : ', error);
                    });
            }
        });

        projectFigure.appendChild(projectImage);
        projectFigure.appendChild(deleteIcon);
        projectFigure.appendChild(projectCaption);
        modalProjectsContainer.appendChild(projectFigure);
    });
}




function saveProjectsToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(allProjectsData));
}



function deleteProjectFromAPI(projectId) {
    const urlAPI = `http://localhost:5678/api/works/${projectId}`;

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token not found. Cannot delete project.');
        return Promise.reject('Token not found');
    }

    return fetch(urlAPI, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}


function addImage() {

    const photoImage = document.getElementById('photoImage');
    const previewImage = document.getElementById('previewImage');

    photoImage.addEventListener('change', (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const objectURL = URL.createObjectURL(selectedFile);
            previewImage.src = objectURL;
            previewImage.style.display = 'block';
        } else {
            previewImage.src = '';
            previewImage.style.display = 'none';
        }
    });
}

addImage();

function addNewProject() {
    const photoImage = document.getElementById('photoImage');
    const photoTitle = document.getElementById('photoTitle');
    const photoCategory = document.getElementById('photoCategory');
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("image", photoImage.files[0]);
        formData.append("title", photoTitle.value);
        formData.append("category", photoCategory.value);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found. Cannot add a new project.');
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formData,
                redirect: 'follow'
            };

            if (photoTitle.value.trim() === '') {
                alert("Veuillez entrer un titre pour le projet.");
                return;
            }

            const response = await fetch("http://localhost:5678/api/works", requestOptions);

            if (response.ok) {
                const newProjectData = await response.json();
                allProjectsData.push(newProjectData);
                addProjects([newProjectData]);
                closeModal();

                photoImage.value = '';
                photoTitle.value = '';
                photoCategory.value = '0';

                console.log('Nouveau projet ajouté avec succès !');
            } else {
                console.error('Erreur lors de l\'ajout du projet.');
            }
        } catch (error) {
            console.error('Une erreur s\'est produite : ', error);
        }
    }, true);
}


addNewProject();

function addImage() {
    const photoImage = document.getElementById('photoImage');
    const previewImage = document.getElementById('previewImage');
    const label = document.querySelector('.add_photo label');
    const icon = document.querySelector('.add_photo i');
    const p = document.querySelector('.add_photo p');

    photoImage.addEventListener('change', (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const objectURL = URL.createObjectURL(selectedFile);
            previewImage.src = objectURL;
            previewImage.style.display = 'block';
            label.style.display = 'none';
            icon.style.display = 'none';
            p.style.display = 'none';
        } else {
            previewImage.src = '';
            previewImage.style.display = 'none';
            label.style.display = 'block';
            icon.style.display = 'block';
            p.style.display = 'block';
        }
    });
}

addImage();
