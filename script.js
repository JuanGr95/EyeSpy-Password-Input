
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~,.<>?/;":][}{+_)(*&^%$#@!±=-§';
const svgContainer = document.querySelector('#svgContainer');
const innerCircle = document.querySelector('#innerCircle');
const exCircle = document.querySelector('#exCircle');
const eyeUp = document.querySelector('#up');
const eyeGroup = document.querySelector('#eyeGroup');
let stopBlink = false;
const charStepTime = 15;
const charStepSize = 10;
const svgViewBox = svgContainer.viewBox.baseVal;
const exRadius = parseFloat(exCircle.getAttribute('r'));
const intRadius = parseFloat(innerCircle.getAttribute('r'));
const radiusDiff = exRadius - intRadius;
const radToDeg = 180 / Math.PI;

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
    if (eyeGroup.getAttribute('mask') == 'url(#eye-open)') {
        const rect = svgContainer.getBoundingClientRect();

        const mouseX = (event.clientX - rect.left) * (svgViewBox.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (svgViewBox.height / rect.height);

        const exCircleX = parseFloat(exCircle.getAttribute('cx'));
        const exCircleY = parseFloat(exCircle.getAttribute('cy'));

        const distanceX = mouseX - exCircleX;
        const distanceY = mouseY - exCircleY;

        const angle = Math.atan2(distanceY, distanceX);

        const newX = exCircleX + radiusDiff * Math.cos(angle);
        const newY = exCircleY + radiusDiff * Math.sin(angle);

        innerCircle.setAttribute('cx', newX);
        innerCircle.setAttribute('cy', newY);

        innerCircle.setAttribute('transform', `rotate(${angle * radToDeg} ${newX} ${newY})`);
    }
});

