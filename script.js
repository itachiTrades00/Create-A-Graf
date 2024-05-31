document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d');
    adjustCanvasForHighDPI(canvas);

    function getRandomOption(selectElement) {
            const options = Array.from(selectElement.options);
            let filteredOptions = options;
            if (selectElement.id === 'eyes') {
                filteredOptions = options.filter(option => option.value !== 'laser.png' && option.value !== 'evil.png');
            }
            const randomIndex = Math.floor(Math.random() * filteredOptions.length);
            return filteredOptions[randomIndex].value;
        }
        
    
    function resetAvatar() {
        const defaults = {
            head: 'main.png',
            smoke: 'none.png',
            face: 'normal.png',
            face: 'none.png',
            hat: 'none.png',
            eyes: 'none.png',
            hands: 'none.png',
            outfit: 'none.png',
            shirts: 'none.png'
        };

        Object.entries(defaults).forEach(([part, defaultValue]) => {
            const selectElement = document.getElementById(part);
            selectElement.value = defaultValue; // Reset the select element to the default value
            onPartChange(part, defaultValue); // Update the avatar part
        });
    }

    document.querySelector('.resetBtn').addEventListener('click', resetAvatar);

    document.querySelector('.randomizeBtn').addEventListener('click', function() {
        [ 'head', 'smoke', 'face', 'hat', 'eyes', 'hands', 'outfit', 'shirts'].forEach(part => {
            const selectElement = document.getElementById(part);
            const randomValue = getRandomOption(selectElement);
            selectElement.value = randomValue; // Update the select element with the random value
            onPartChange(part, randomValue); // Update the avatar part
        });
    });

    const selectedParts = {
        head: 'images/head/main.png',
        shirts: 'images/shirts/none.png',
        face:    'images/face/none.png',
        smoke: 'images/smoke/none.png',
        eyes: 'images/eyes/none.png',
        hat: 'images/hat/none.png',
        hands:  'images/hands/none.png',
        outfit: 'images/outfit/none.png',
    };

    function adjustCanvasForHighDPI(canvas) {
        const dpi = window.devicePixelRatio || 1;
        const style = getComputedStyle(canvas);
        const width = parseInt(style.width) * dpi;
        const height = parseInt(style.height) * dpi;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width / dpi}px`;
        canvas.style.height = `${height / dpi}px`;
        ctx.scale(dpi, dpi);
    }

    function drawPart(partPath) {
        return new Promise(resolve => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Enable CORS
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
                resolve();
            };
            img.src = partPath;
        });
    }

    async function updateAvatar() {
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        for (const part of Object.keys(selectedParts)) {
            await drawPart(selectedParts[part]);
        }
    }

    function onPartChange(part, fileName) {
        selectedParts[part] = 'images/' + part + '/' + fileName;
        updateAvatar();
    }

    ['face', 'head', 'smoke', 'hat', 'eyes', 'hands', 'outfit', 'shirts' ].forEach(part => {
        document.getElementById(part)?.addEventListener('change', function() {
            onPartChange(part, this.value);
        });
    });

    document.querySelector('.downloadBtn').addEventListener('click', function() {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.download = 'GRAF_TO_MOON.png';
            downloadLink.href = url;
            downloadLink.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    });

    updateAvatar(); // Initialize the avatar with default parts
});
