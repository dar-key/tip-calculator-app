const tipCalculatorMainContainer = document.getElementById('tip-calculator-app-container').querySelector('.main-container');
const tipButtons = tipCalculatorMainContainer.querySelectorAll('.tip-btn');
const customTipInput = tipCalculatorMainContainer.querySelector('.tip-custom');

let selectedTip = 0;
let oldBackgroundColor;
let oldColor;

function unselectAllButtons() {
    tipButtons.forEach(el => {
        el.style.backgroundColor = oldBackgroundColor;
        el.style.color = oldColor; 
    })
}

tipButtons.forEach(el => {
    const str = el.innerHTML
    const thisTip = Number(str.substring(0, str.length - 1))

    el.addEventListener('click', () => {
        selectedTip = thisTip;
        customTipInput.value = '';
        unselectAllButtons();
        oldBackgroundColor = el.style.backgroundColor;
        oldColor = el.style.color;
        el.style.backgroundColor = 'red';
        el.style.color = 'black';
        console.log('Selected tip: ' + selectedTip);
        updateResults()
    });
});


customTipInput.addEventListener('input', (inputEvent) => {
    customTipInput.value = customTipInput.value.replaceAll('%', '');
    if (!/[0-9.]/.test(inputEvent.data) && customTipInput.value.length < 6) {
        customTipInput.value = customTipInput.value.replaceAll(inputEvent.data, '');
    }

    if (customTipInput.value.length >= 7) {
        customTipInput.value = customTipInput.value.substring(0, customTipInput.value.length - 1);
    }

    if (inputEvent.inputType == 'deleteContentBackward') {
        customTipInput.value = customTipInput.value.substring(0, customTipInput.value.length - 1);
    }

    selectedTip = Number(customTipInput.value);
    unselectAllButtons();
    customTipInput.value += '%';
    console.log(inputEvent);
    console.log(selectedTip);
    updateResults();
});


let billAmount = 0;
let numberOfPeople = 0;

tipCalculatorMainContainer.querySelectorAll('.number-input').forEach(inputEl => {
    const dataType = inputEl.className.split(' ')[0];

    inputEl.addEventListener('input', (inputEvent) => {
        if (!/[0-9.]/.test(inputEvent.data))
            inputEl.value = inputEl.value.replaceAll(inputEvent.data, '');

        if (inputEl.value.length >= 7) {
            inputEl.value = inputEl.value.substring(0, inputEl.value.length - 1);
        }
        
        if (dataType == 'bill-amount-input')
            billAmount = Number(inputEl.value);
        else if (dataType == 'number-of-people-input')
            numberOfPeople = Number(inputEl.value);

        updateResults();
    });
});


const resultsContainer = tipCalculatorMainContainer.querySelector('.tip-results');
const tipAmountPerPersonContainer = resultsContainer.querySelector('.per-person').querySelector('.result');
const totalTipAmountContainer = resultsContainer.querySelector('.total').querySelector('.result');

const resetButton = resultsContainer.querySelector('.reset-btn');
const oldResetButtonBackgroundColor = resetButton.style.backgroundColor;
const oldResetButtonColor = resetButton.style.color;

resetButton.addEventListener('click', () => {
    if (billAmount > 0 && numberOfPeople > 0 && selectedTip > 0) {
        billAmount = 0;
        numberOfPeople = 0;
        selectedTip = 0;
        unselectAllButtons();
        tipCalculatorMainContainer.querySelectorAll('input').forEach(el => {
            el.value = '';    
        })
        updateResults();
    }
})


function updateResults() {
    if (billAmount > 0 && numberOfPeople > 0 && selectedTip > 0) {
        const billAmountPerPerson = billAmount / numberOfPeople;
        const tipAmountPerPerson = billAmountPerPerson * selectedTip;
        tipAmountPerPersonContainer.innerHTML = '$' + String(Math.floor(tipAmountPerPerson) / 100);
        totalTipAmountContainer.innerHTML = '$' + String(Math.round(tipAmountPerPerson + billAmountPerPerson * 100) / 100);
        resetButton.style.backgroundColor = oldResetButtonBackgroundColor;
        resetButton.style.color = oldResetButtonColor;
    }
    else {
        tipAmountPerPersonContainer.innerHTML = '$0';
        totalTipAmountContainer.innerHTML = '$0';
        resetButton.style.backgroundColor = 'hsl(156, 34%, 35%)';
        resetButton.style.color = 'hsl(0, 0%, 63%)';
    }
}

updateResults();
