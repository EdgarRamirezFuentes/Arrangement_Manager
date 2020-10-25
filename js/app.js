// Fields of the form
const petInput = document.getElementById("pet");
const ownerInput = document.getElementById("owner");
const phoneInput = document.getElementById("phone");
const dateInput = document.getElementById("date");
const hourInput = document.getElementById("hour");
const symptomsInput = document.getElementById("symptoms");

// UI
const form = document.getElementById("new-arrangement");
const arrangementContainer = document.getElementById("arrangements");

// Arrangement data object
const arrangement = {
    id : 0,
    pet : '',
    owner : '',
    phone : '',
    date : '',
    hour : '',
    symptoms : ''
}

// Listen to any change in the fields of the form
function eventListener() {
    petInput.addEventListener('change', arrangementData);
    ownerInput.addEventListener('change', arrangementData);
    phoneInput.addEventListener('change', arrangementData);
    dateInput.addEventListener('change', arrangementData);
    hourInput.addEventListener('change', arrangementData);
    symptomsInput.addEventListener('change', arrangementData);
    form.addEventListener('submit', addNewArrangement);
}

function resetArrangementData() {
    arrangement.id = 0;
    arrangement.pet = '';
    arrangement.owner = '';
    arrangement.phone = '';
    arrangement.date = '';
    arrangement.hour = '';
    arrangement.symptoms = '';
}

// Fill the arrangement object with the info written
function arrangementData(e) {
    arrangement[e.target.name] = e.target.value;
}

class ArrangementsList {

    constructor() {
        let storedArrangements = JSON.parse(localStorage.getItem('arrangements'));
        this.arrangements = [];
        if(storedArrangements != null) {
            storedArrangements.forEach(arrangement => {
                this.arrangements.push(arrangement);
            });
        }
    }

    addNewArrangement(arrangement) {
        this.arrangements.push(arrangement);
        this.updateArrangementList(this.arrangements);
        ui.printMessage("Arrangement scheduled successfully", "success");
        console.log(this.arrangements);
    }

    updateArrangementList(arrangementList) {
        localStorage.setItem('arrangements', JSON.stringify(arrangementList));
    }

    deleteArrangement(idArragement) {

    }
}

class UI {

    printMessage(message, type) {

        // Create the container of the message
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('text-center', 'alert', 'd-block', 'col-12');

        (type == 'error') ? messageContainer.classList.add('alert-danger') : messageContainer.classList.add('alert-success');
        messageContainer.textContent = message;

        // Insert the container above the form
        document.getElementById('content').insertBefore(messageContainer, document.getElementsByClassName('add-arrangement')[0]);

        // Disappear the message after 5 seconds

        setTimeout( () => {
            messageContainer.remove();
        }, 5000);

    }

    printArrangementList(arrangementList) {
        arrangementContainer.innerHTML = "";
        if(arrangementList.length == 0) {
            const uniqueArrangementContainer = document.createElement('div');
            arrangementContainer.classList.add('arrangement', 'p-3');

            const message = document.createElement('p');
            message.classList.add('card-title', 'font-weight-bold');
            message.textContent = 'There are no pending arrangements.';

            arrangementContainer.appendChild(message);

            arrangementContainer.appendChild(uniqueArrangementContainer);
        }
        arrangementList.forEach(arrangement => {

            const {id, pet, owner, phone, date, hour, symptoms} = arrangement;
            const uniqueArrangementContainer = document.createElement('div');
            arrangementContainer.classList.add('arrangement', 'p-3');
            arrangementContainer.dataset.id = id;

            const petParagraph = document.createElement('h2');
            petParagraph.classList.add('card-title', 'font-weight-bold');
            petParagraph.textContent = pet;

            arrangementContainer.appendChild(petParagraph);

            arrangementContainer.appendChild(uniqueArrangementContainer);
        });
    }
}

function addNewArrangement(e) {

    e.preventDefault();
    const {pet, owner, phone, date, hour, symptoms} = arrangement;

    //  Validate data
    if( (pet == '') || (owner == '') || (phone == '') || (date == '') || (hour == '') || (symptoms == '')) {
        ui.printMessage('Each field of the form is required in order to schedule an arrangement', 'error');
        return;
    }

    // Creates an unique ID and schedule the new arrangement
    arrangement.id = Date.now();
    arrangementsList.addNewArrangement({...arrangement});
    resetArrangementData();
    form.reset();
    ui.printArrangementList(arrangementsList.arrangements);
}

const ui = new UI();
const arrangementsList = new ArrangementsList();
eventListener();
localStorage.clear();
ui.printArrangementList(arrangementsList.arrangements);