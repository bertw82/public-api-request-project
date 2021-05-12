"use strict";

/**
 * Global variables
 */
 const searchContainer = document.querySelector('.search-container');
 const gallery = document.getElementById('gallery');
 let employees = [];
 const body = document.querySelector('body');

/**
 * Create a search input dynamically with JS
 */ 
const searchForm = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;
searchContainer.insertAdjacentHTML('beforeend', searchForm);

/**
 * Function to create employee card 
 * @param {json} data
 */
function generateCard(data) {
    employees = data.results;
    for (let i = 0; i < 12; i++) {
        const employeeCard = `
            <div class="card" data-index="${[i]}">
                <div class="card-img-container">
                    <img class="card-img" src="${employees[i].picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employees[i].name.first} ${employees[i].name.last}</h3>
                    <p class="card-text">${employees[i].email}</p>
                    <p class="card-text cap">${employees[i].location.city}, ${employees[i].location.state}</p>
                </div>
            </div>
        `;
        gallery.insertAdjacentHTML('beforeend', employeeCard);
    }
}

/**
 * Function to display modal of chosen employee card
 * @param {element} card 
 */
function modalDisplay(card) {
    const index = card.getAttribute('data-index');
    const employee = employees[index];
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.insertAdjacentHTML('beforeend',  
        `<div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.location.city}</p>
                <hr>
                <p class="modal-text">${employee.cell}</p>
                <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state} ${employee.location.postcode}</p>
                <p class="modal-text">Birthday: 10/21/2015</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>`);
    body.appendChild(modalContainer);
}

/**
 * Fetch API to fetch employee data
 */
 fetch('https://randomuser.me/api/?results=12')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        generateCard(data);
    } )
    .catch((error) => {
        gallery.insertAdjacentHTML('beforeend', `Uh oh, something went wrong!`)
        console.error('Error:', error);
    });

/**
 * Display modal by clicking on employee card
 */
gallery.addEventListener('click', e => {
    const employeeCard = e.target.closest('.card');
    console.log(employeeCard);
    modalDisplay(employeeCard);
});

/**
 * Close modal window
 */
body.addEventListener('click', e => {
    const closeBtn = document.querySelector('.modal-close-btn');
    console.log(closeBtn);
    if (e.target !== closeBtn) {
        console.log('what?');
        body.removeChild('.modal-container');
    }
});
