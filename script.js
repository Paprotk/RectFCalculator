let area = [];
let size = [0, 0];
let inputDisplay = document.getElementById('input-display');
let modal = document.getElementById('custom-input-modal');
let initialAreaModal = document.getElementById('initial-area-modal');
let modalInput = document.getElementById('modal-input');
let initialAreaInputField = document.getElementById('initial-area-input');
let areaInputField = document.getElementById('area-input');

function showAlert(message) {
    const alertModal = document.getElementById('alert-modal');
    const alertMessage = document.getElementById('alert-message');

    // Przygotowanie tekstu z podziałem na linie
    const maxLineLength = 40;
    let formattedMessage = '';
    let currentLine = '';

    const words = message.split(' ');

    words.forEach(word => {
        if (currentLine.length + word.length + 1 > maxLineLength) {
            formattedMessage += currentLine + '<br>';
            currentLine = word;
        } else {
            currentLine = currentLine ? `${currentLine} ${word}` : word;
        }
    });

    if (currentLine) {
        formattedMessage += currentLine;
    }

    // Ustaw wiadomość w oknie alertu
    alertMessage.innerHTML = formattedMessage;

    // Pokaż modal z fade-in
    alertModal.classList.remove('hide'); // Usuń klasę ukrywającą
    alertModal.classList.add('show');   // Dodaj klasę pokazującą

    alertModal.style.display = 'flex';  // Wyświetl modal

    // Obsłuż przycisk "OK"
    document.getElementById('alert-ok-btn').onclick = () => {
        // Rozpocznij animację fade-out
        alertModal.classList.remove('show'); 
        alertModal.classList.add('hide');

        // Poczekaj na zakończenie animacji fade-out i ukryj modal
        setTimeout(() => {
            alertModal.style.display = 'none'; // Ukryj modal
        }, 300); // Czas dopasowany do CSS (0.3s)
    };
}


function initializeArea() {
    const initializeArea= document.getElementById('initial-area-modal');
    initializeArea.classList.remove('hide'); // Usuń klasę ukrywającą
    initializeArea.classList.add('show');   // Dodaj klasę pokazującą

    initializeArea.style.display = 'flex';  // Wyświetl modal
    
    // Restrict input to numbers, commas, and spaces for the initial area modal
    initialAreaInputField.addEventListener('input', function(event) {
        initialAreaInputField.value = initialAreaInputField.value.replace(/[^0-9,]/g, ''); // Allow only numbers, commas, and spaces
    });

    document.getElementById('modal-initial-submit-btn').onclick = () => {
        let areaInput = initialAreaInputField.value;

        if (!areaInput) {
            showAlert("Input cannot be empty.");
            return;
        }

        try {
            area = areaInput.split(',').map(Number);

            if (area.length !== 4) throw new Error("You must provide exactly 4 numbers.");
            if (area[2] <= area[0] || area[3] <= area[1]) {
                throw new Error("x2 must be greater than x1, and y2 must be greater than y1.");
            }

            size = [area[2] - area[0], area[3] - area[1]];
            updateUI();
            // Rozpocznij animację fade-out
            initializeArea.classList.remove('show'); 
            initializeArea.classList.add('hide');

            // Poczekaj na zakończenie animacji fade-out i ukryj modal
            setTimeout(() => {
            initializeArea.style.display = 'none'; // Ukryj modal
            }, 300); // Czas dopasowany do CSS (0.3s)
            initialAreaInputField.value = '';
        

        } catch (error) {
            showAlert("Invalid input: " + error.message);
        }
    };

    document.getElementById('modal-initial-close-btn').onclick = () => {
        initialAreaModal.style.display = 'none';
        initialAreaInputField.value = ''; // Reset the input after canceling
    };
}

function updateUI() {
    areaInputField.value = area.join(',');
    document.getElementById('size-label').textContent = `Size: ${size[0]}x${size[1]}`;
}

function appendInputDisplay(text) {
    const newElement = document.createElement('div');
    newElement.textContent = text;
    inputDisplay.appendChild(newElement);
}

function openModal(message, callback) {
    modal.classList.remove('hide'); // Usuń klasę ukrywającą
    modal.classList.add('show');   // Dodaj klasę pokazującą
    modal.style.display = 'flex';
    modalInput.value = ''; // Clear the input field when the modal opens
    document.querySelector('.modal-content h3').textContent = message; // Set the dynamic message

    // Restrict the input to numbers only (no letters)
    modalInput.addEventListener('input', function(event) {
        modalInput.value = modalInput.value.replace(/[^0-9x,]/g, ''); // Allow only numbers, commas, spaces, and 'x'
    });

    document.getElementById('modal-submit-btn').onclick = () => {
        // Check if input is empty or doesn't contain any numbers
        if (!modalInput.value || !/\d/.test(modalInput.value)) {
            showAlert('Input cannot be empty.');
            return; // Stop the submission if the validation fails
        }
        
        callback(modalInput.value);
        modal.style.display = 'none';
        modalInput.value = ''; // Reset the input after submission
    };

    document.getElementById('modal-close-btn').onclick = () => {
	    // Rozpocznij animację fade-out
            modal.classList.remove('show'); 
            modal.classList.add('hide');

            // Poczekaj na zakończenie animacji fade-out i ukryj modal
            setTimeout(() => {
            modal.style.display = 'none'; // Ukryj modal
            }, 300); // Czas dopasowany do CSS (0.3s)
        modalInput.value = ''; // Reset the input after canceling
    };
}

function changeSize() {
    openModal("New size (width x height):", (inputValue) => {
        // Regular expression to match the format "number x number"
        let regex = /^(\d+)\s*x\s*(\d+)$/;
        let match = inputValue.trim().match(regex); // Trim and match against the pattern

        if (!match) {
            showAlert("Invalid format. Please use the format: number x number (e.g., 12 x 34).");
            return; // Keep the modal open if the format is invalid
        }

        // Extract the width and height from the match
        let width = Number(match[1]);
        let height = Number(match[2]);

        // Validate that width and height are positive numbers
        if (width <= 0 || height <= 0) {
            showAlert("Width and height must be positive numbers.");
            return; // Keep the modal open if the values are invalid
        }

        // If all validations pass, update the area and size
        area[2] = area[0] + width;
        area[3] = area[1] + height;
        size = [width, height];
        updateUI();
        appendInputDisplay(`Changed size to: ${width} x ${height}`);
        modal.style.display = 'none';
    });

    // Make sure the modal input retains the value the user entered if validation fails
    modalInput.addEventListener('input', function(event) {
        modalInput.value = modalInput.value.replace(/[^0-9x, ]/g, ''); // Allow only numbers, commas, spaces, and 'x'
    });

    // Disable the modal submit button until the input is valid (extra protection)
    document.getElementById('modal-submit-btn').onclick = () => {
        let inputValue = modalInput.value.trim();
        let regex = /^(\d+)\s*x\s*(\d+)$/;
        let match = inputValue.match(regex);

        if (!match) {
            showAlert("Invalid format. Please use the format: number x number (e.g., 12 x 34).");
            return; // Keep the modal open if the format is invalid
        }

        let width = Number(match[1]);
        let height = Number(match[2]);

        if (width <= 0 || height <= 0) {
            showAlert("Width and height must be positive numbers.");
            return;
        }

        // Proceed with updating the area and closing the modal
        area[2] = area[0] + width;
        area[3] = area[1] + height;
        size = [width, height];
        updateUI();
        appendInputDisplay(`Changed size to: ${width} x ${height}`);
        modal.style.display = 'none'; // Close the modal only after valid input
    };
}

function moveArea(direction) {
    openModal(`Move ${direction} by:`, (shiftValue) => {
        let shift = parseInt(shiftValue, 10) || 0;
        if (direction === 'up') {
            area[1] -= shift;
            area[3] -= shift;
        } else if (direction === 'down') {
            area[1] += shift;
            area[3] += shift;
        } else if (direction === 'left') {
            area[0] -= shift;
            area[2] -= shift;
        } else if (direction === 'right') {
            area[0] += shift;
            area[2] += shift;
        }
        updateUI();
        appendInputDisplay(`Moved ${direction} by: ${shift}`);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeArea();
    updateUI();

    document.getElementById('change-size-btn').addEventListener('click', changeSize);
    document.getElementById('up-btn').addEventListener('click', () => moveArea('up'));
    document.getElementById('down-btn').addEventListener('click', () => moveArea('down'));
    document.getElementById('left-btn').addEventListener('click', () => moveArea('left'));
    document.getElementById('right-btn').addEventListener('click', () => moveArea('right'));
});
