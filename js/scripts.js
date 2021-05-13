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
 * Search functionality for search input
 */
function searchForEmployee() {
    // written with assistance from https://www.w3schools.com/howto/howto_js_filter_lists.asp 
    const input = document.getElementById('search-input');
    const filter = input.value.toUpperCase();
    const employeeCard = document.querySelectorAll('.card');
    for (let i = 0; i < employeeCard.length; i++) {
        const name = employeeCard[i].querySelector('#name').textContent;
        if (name.toUpperCase().indexOf(filter) > -1) {
        employeeCard[i].style.display = '';
        } else {
        employeeCard[i].style.display = 'none';
        }
    }
}

/**
 * Function to create employee card 
 * @param {json} data
 */
function generateCard(data) {
    employees = data.results;
    console.log(employees);
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
 * @param {element} index 
 */
function modalDisplay(index) {
    const employee = employees[index];
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.dataset.index = index;
    modalContainer.insertAdjacentHTML('beforeend',  
        `<div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.location.city}</p>
                <hr>
                <p class="modal-text">${reformatPhone(employee.cell)}</p>
                <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state} ${employee.location.postcode}</p>
                <p class="modal-text">Birthday: ${reformatBirthday(employee.dob.date)}</p>
            </div>
         </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>`);
    body.appendChild(modalContainer);
}

/**
 * Helper functions
 */

// remove modal from DOM
function removeModal(index) {
    const modal = document.querySelector('.modal-container');
    if (index === modal.getAttribute('data-index')) {
        modal.remove();
    }
}

// reformat cell phone number
function reformatPhone(number) {
    const numberArray = number.split('');
    const areaCode = numberArray.slice(1,4).join('');
    const firstThree = numberArray.slice(6,9).join('');
    const lastFour = numberArray.slice(10,14).join('');
    return `(${areaCode}) ${firstThree}-${lastFour}`;
}

// reformat birthday
function reformatBirthday(date) {
    const birthday = new Date(date);
    const day = birthday.getDate();
    const month = parseInt(birthday.getMonth()) + 1;
    const year = birthday.getFullYear();
    return `${month}/${day}/${year}`;
}

/**
 * Fetch API to fetch employee data
 */
 fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(response => response.json())
    .then(data => {
        generateCard(data);
    } )
    .catch((error) => {
        gallery.insertAdjacentHTML('beforeend', `Uh oh, something went wrong!`)
        console.error('Error:', error);
    });

/**
 * AddEventListeners
 */

// Display modal by clicking on employee card
gallery.addEventListener('click', e => {
    modalDisplay(e.target.closest('.card').getAttribute('data-index'));
});

// Close modal window
document.addEventListener('click', e => {
    const strongX = document.querySelector('strong');
    const closeButton = document.querySelector('#modal-close-btn');
    const strongIndex = strongX.parentNode.parentNode.parentNode.getAttribute('data-index');
    const closeButtonIndex = closeButton.parentNode.parentNode.getAttribute('data-index');
    if (e.target === strongX || e.target === closeButton) {
        removeModal(strongIndex || closeButtonIndex);
    }
});

// listen for search input
document.addEventListener('input', e => {
    if (e.target === document.getElementById('search-input')) {
        searchForEmployee();
    }
});

// click "next" or "prev" to view another employee in the modal 
document.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-next')) {
        const dataIndex = e.target.parentNode.parentNode.getAttribute('data-index');
        if (dataIndex >=0 && dataIndex < 11) {
            removeModal(dataIndex);
            modalDisplay(parseInt(dataIndex) + 1);
        } 
    } else if (e.target === document.getElementById('modal-prev')) {
        const dataIndex = e.target.parentNode.parentNode.getAttribute('data-index');
        if (dataIndex > 0 && dataIndex <= 11) {
            removeModal(dataIndex);
            modalDisplay(parseInt(dataIndex) -1);
        } 
    }
});



