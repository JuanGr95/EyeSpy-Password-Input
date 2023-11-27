
const svgContainer = document.getElementById('svgContainer');
const circuloInterno = document.getElementById('circuloInterno');
const circuloExterno = document.getElementById('circuloExterno');
const eyeUp = document.getElementById('up');
const eyeGroup = document.getElementById('eyeGroup');
let stopBlink = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blink() {
    while (!stopBlink) {
        const randomInterval = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
        await sleep(randomInterval);
        eyeUp.style.transform = "scaleY(-1)";
        eyeGroup.setAttribute('mask', 'url(#eye-closed)');
        await sleep(160);
        eyeUp.style.transform = "scaleY(1)";
        if (!stopBlink)
            eyeGroup.setAttribute('mask', 'url(#eye-open)');
    }
}

blink();


const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~,.<>?/;":][}{+_)(*&^%$#@!±=-§';
const charStepTime = 15;
const charStepSize = 10;

async function revealPassword(passwordInput, passwordValue) {
    let index = 1;

    stopBlink = true;
    eyeGroup.setAttribute('mask', 'url(#eye-closed)');
    eyeUp.style.display = 'none';
    passwordInput.type = 'text';

    while (index <= passwordValue.length) {
        const revealedValue = passwordValue.substring(0, index) + '•'.repeat(passwordValue.length - index);

        for (let i = 0; i < charStepSize; i++) {
            await generateChar(index, revealedValue, passwordInput, passwordValue);
        }

        passwordInput.value = revealedValue;
        index++;
    }
}

async function generateChar(index, revealedValue, passwordInput, passwordValue) {
    if (index <= passwordValue.length) {
        let charTemp = chars.charAt(Math.floor(Math.random() * chars.length));
        let valueTemp = index > 0 ? revealedValue.substring(0, index - 1) : '';
        passwordInput.value = valueTemp + charTemp + '•'.repeat(passwordValue.length - index);
    }

    await sleep(charStepTime);
}

function hidePassword(passwordInput) {
    eyeGroup.setAttribute('mask', 'url(#eye-open)');
    eyeUp.style.display = 'block';
    stopBlink = false;
    blink();
    passwordInput.type = 'password';
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordValue = passwordInput.value;

    if (passwordInput.type == 'password' && passwordValue) {
        revealPassword(passwordInput, passwordValue);
    } else if (passwordInput.type == 'text' && passwordValue) {
        hidePassword(passwordInput);
    }
}

window.addEventListener('mousemove', (event) => {
    const rect = svgContainer.getBoundingClientRect();

    const svgViewBox = svgContainer.viewBox.baseVal;

    const mouseX = (event.clientX - rect.left) * (svgViewBox.width / rect.width);
    const mouseY = (event.clientY - rect.top) * (svgViewBox.height / rect.height);

    const circuloExternoX = parseFloat(circuloExterno.getAttribute('cx'));
    const circuloExternoY = parseFloat(circuloExterno.getAttribute('cy'));

    const distanciaX = mouseX - circuloExternoX;
    const distanciaY = mouseY - circuloExternoY;

    const angulo = Math.atan2(distanciaY, distanciaX);

    const radioExterno = parseFloat(circuloExterno.getAttribute('r'));
    const radioInterno = parseFloat(circuloInterno.getAttribute('r'));

    const nuevoX = circuloExternoX + (radioExterno - radioInterno) * Math.cos(angulo);
    const nuevoY = circuloExternoY + (radioExterno - radioInterno) * Math.sin(angulo);

    circuloInterno.setAttribute('cx', nuevoX);
    circuloInterno.setAttribute('cy', nuevoY);

    circuloInterno.setAttribute('transform', `rotate(${angulo * (180 / Math.PI)} ${nuevoX} ${nuevoY})`);
});
