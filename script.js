
const svgContainer = document.getElementById('svgContainer');
const circuloInterno = document.getElementById('circuloInterno');
const circuloExterno = document.getElementById('circuloExterno');
const eyeUp = document.getElementById('up');
const eyeGroup = document.getElementById('eyeGroup');
var randomInterval = Math.floor(Math.random() * 15000);
let stopBlink = false;

function blink() {

    function animateBlink() {
        const randomInterval = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;

        setTimeout(() => {
            if (!stopBlink) {
                eyeUp.style.transform = "scaleY(-1)";
                eyeGroup.setAttribute('mask', 'url(#eye-closed)');

                setTimeout(() => {
                    if (!stopBlink) {
                        eyeUp.style.transform = "scaleY(1)";
                        eyeGroup.setAttribute('mask', 'url(#eye-open)');
                        animateBlink();
                    }
                }, 160);
            }
        }, randomInterval);
    }
    animateBlink();
}

blink();

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordValue = passwordInput.value;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~,.<>?/;":][}{+_)(*&^%$#@!±=-§';

    if (passwordInput.type == 'password' && passwordInput.value) {
        let index = 0;

        stopBlink = true;
        eyeGroup.setAttribute('mask', 'url(#eye-closed)');
        eyeUp.style.display = 'none';

        const intervalId = setInterval(() => {
            const revealedValue = passwordValue.substring(0, index) + '•'.repeat(passwordValue.length - index);

            function generateChar() {
                if (index < passwordValue.length) {
                    let charTemp = chars.charAt(Math.floor(Math.random() * chars.length));
                    let valueTemp = index > 0 ? revealedValue.substring(0, index - 1) : '';
                    passwordInput.value = valueTemp + charTemp + '•'.repeat(passwordValue.length - index);
                }
            }

            generateChar();

            const intervalCl = setInterval(generateChar, 10);

            setTimeout(() => {
                clearInterval(intervalCl);
            }, 100);

            index++;

            passwordInput.value = revealedValue;

            if (index > passwordValue.length) {
                clearInterval(intervalId);
            } else {
                passwordInput.type = 'text';
            }
        }, 120);

    } else if (passwordInput.type == 'text' && passwordInput.value) {
        eyeGroup.setAttribute('mask', 'url(#eye-open)');
        eyeUp.style.display = 'block';
        stopBlink = false;
        blink();
        passwordInput.type = 'password';
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
