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

let updateMode = false;

// Arrangement data object
const arrangement = {
    id : '',
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
    arrangement.id = '';
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
        this.updateArrangementList();
    }

    updateArrangementList() {
        localStorage.setItem('arrangements', JSON.stringify(this.arrangements));
    }

    deleteArrangement(idArragement) {
        this.arrangements = this.arrangements.filter(arrangement => arrangement.id !== idArragement);
        this.updateArrangementList();
        ui.printMessage('Arrangement deleted successfully', 'success');
        ui.printArrangementList(this.arrangements);
    }

    updateArrangementData(arrangement) {
        console.log(arrangement);
        this.arrangements = this.arrangements.map(arrangementMap => arrangementMap.id === arrangement.id ? arrangement : arrangementMap);
        this.updateArrangementList();
    }

}

class UI {

    printMessage(message, type) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('text-center', 'alert', 'd-block', 'col-12');

        (type == 'error') ? messageContainer.classList.add('alert-danger') : messageContainer.classList.add('alert-success');
        messageContainer.textContent = message;

        // Insert the container above the form
        document.getElementById('content').insertBefore(messageContainer, document.getElementsByClassName('add-arrangement')[0]);

        // Disappear the message after 5 seconds

        setTimeout( () => {
            messageContainer.remove();
        }, 3500);
    }

    printArrangementList(arrangementList) {
        this.cleanHTML();
        if(arrangementList.length == 0) {
            const uniqueArrangementContainer = document.createElement('div');
            arrangementContainer.classList.add('arrangement', 'p-3');
            const message = document.createElement('p');
            message.classList.add('card-title', 'font-weight-bold');
            message.textContent = 'There are no pending arrangements.';
            arrangementContainer.appendChild(message);
            arrangementContainer.appendChild(uniqueArrangementContainer);
            return;
        }

        arrangementList.forEach(arrangement => {
            const {id, pet, owner, phone, date, hour, symptoms} = arrangement;
            const uniqueArrangementContainer = document.createElement('div');
            uniqueArrangementContainer.classList.add('border', 'border-dark', 'rounded', 'mb-3', 'p-1', 'bg-light');
            arrangementContainer.classList.add('arrangement', 'p-3');
            arrangementContainer.dataset.id = id;

            const petParagraph = document.createElement('p');
            petParagraph.innerHTML = `
                <span class="font-weight-bolder">Pet: </span> ${pet}
            `;

            const idParagraph = document.createElement('p');
            idParagraph.innerHTML = `
                <span class="font-weight-bolder">ID: </span> ${id}
            `;

            const ownerParagraph = document.createElement('p');
            ownerParagraph.innerHTML = `
                <span class="font-weight-bolder">Owner: </span> ${owner}
            `;

            const phoneParagraph = document.createElement('p');
            phoneParagraph.innerHTML = `
                <span class="font-weight-bolder">Phone: </span> ${phone}
            `;

            const dateParagraph = document.createElement('p');
            dateParagraph.innerHTML = `
                <span class="font-weight-bolder">Date: </span> ${date}
            `;

            const hourParagraph = document.createElement('p');
            hourParagraph.innerHTML = `
                <span class="font-weight-bolder">Hour: </span> ${hour}
            `;

            const symptomsParagraph = document.createElement('p');
            symptomsParagraph.innerHTML = `
                <span class="font-weight-bolder">Symptoms: </span> <br>${symptoms}
            `;
            
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-danger', 'mr-2');
            deleteButton.innerHTML = 'Delete <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>';
            deleteButton.onclick  = () => arrangementsList.deleteArrangement(id.toString());
            
            
            const updateButton = document.createElement('button');
            updateButton.classList.add('btn', 'btn-warning', 'mr-2');
            updateButton.innerHTML = 'Update <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>';          
            updateButton.onclick  = () => fillArrangementData(arrangement);

            uniqueArrangementContainer.appendChild(idParagraph);
            uniqueArrangementContainer.appendChild(petParagraph);
            uniqueArrangementContainer.appendChild(ownerParagraph);
            uniqueArrangementContainer.appendChild(phoneParagraph);
            uniqueArrangementContainer.appendChild(dateParagraph);
            uniqueArrangementContainer.appendChild(hourParagraph);
            uniqueArrangementContainer.appendChild(symptomsParagraph);
            uniqueArrangementContainer.appendChild(deleteButton);
            uniqueArrangementContainer.appendChild(updateButton);

            arrangementContainer.appendChild(uniqueArrangementContainer);
        });
    }

    cleanHTML() {
        while(arrangementContainer.firstChild) {
            arrangementContainer.removeChild(arrangementContainer.firstChild);
        }
    }
}


function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function addNewArrangement(e) {

    e.preventDefault();
    const {pet, owner, phone, date, hour, symptoms} = arrangement;

    //  Validate data
    if( (pet == '') || (owner == '') || (phone == '') || (date == '') || (hour == '') || (symptoms == '')) {
        ui.printMessage('Each field of the form is required in order to schedule an arrangement', 'error');
        return;
    }

    if( Date.parse(date) <= Date.now() ) {
        ui.printMessage('Choose a valid date for your arrangement', 'error');
        return;
    }


    // Creates an unique ID and schedule the new arrangement
    if(!updateMode) {
        arrangement.id = Date.now().toString();
        arrangementsList.addNewArrangement({...arrangement});
        resetArrangementData();
        form.reset();
        ui.printArrangementList(arrangementsList.arrangements);
        ui.printMessage("Arrangement scheduled successfully", "success");
    }else {
        arrangementsList.updateArrangementData({...arrangement});
        resetArrangementData();
        form.reset();
        ui.printArrangementList(arrangementsList.arrangements);
        ui.printMessage("Arrangement updated successfully", "success");
        form.querySelector('button[type="submit"]').textContent = 'Schedule arrangement';
        updateMode = false;
    }
}

function fillArrangementData (updateArrangement) {

    const {id, pet, owner, phone, date, hour, symptoms} = updateArrangement;
    updateMode = true;

    // Set the values of the arrangement in the form
    petInput.value = pet;
    ownerInput.value = owner;
    phoneInput.value = phone;
    dateInput.value = date;
    hourInput.value = hour;
    symptomsInput.value = symptoms;

    // Fill the object with the data
    arrangement.id = id;
    arrangement.pet = pet;
    arrangement.phone = phone;
    arrangement.date = date;
    arrangement.hour = hour;
    arrangement.symptoms = symptoms;
    arrangement.owner = owner;


    form.querySelector('button[type="submit"]').textContent = 'Save changes';
}



const ui = new UI();
const arrangementsList = new ArrangementsList();
eventListener();
ui.printArrangementList(arrangementsList.arrangements);