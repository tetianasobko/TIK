function encodeText() {
    const inputText = document.getElementById("inputText").value;
    let encodedText = "";
    for (let i = 0; i < inputText.length; i++) {
        encodedText += encodeChar(inputText.charCodeAt(i));
    }
    document.getElementById("encodedText").innerText = encodedText;
}

function decodeText() {
    const encodedInput = document.getElementById("encodedInput").value;
    let decodedText = "";
    let errorInfo = "";
    for (let i = 0; i < encodedInput.length; i += 11) {
        let { char, error } = decodeChar(encodedInput.substring(i, i + 11));
        decodedText += String.fromCharCode(char);
        if (error !== -1) {
            errorInfo += `Помилковий біт ${error + 1} виправлено. `;
        }
    }
    document.getElementById("decodedText").innerText = decodedText;
    document.getElementById("errorInfo").innerText = errorInfo;
}

function encodeChar(char) {
    const dataBits = char.toString(2).padStart(7, '0');
    let bits = [];

    bits[2] = parseInt(dataBits[0]);
    bits[4] = parseInt(dataBits[1]);
    bits[5] = parseInt(dataBits[2]);
    bits[6] = parseInt(dataBits[3]);
    bits[8] = parseInt(dataBits[4]);
    bits[9] = parseInt(dataBits[5]);
    bits[10] = parseInt(dataBits[6]);

    bits[0] = bits[2] ^ bits[4] ^ bits[6] ^ bits[8] ^ bits[10];
    bits[1] = bits[2] ^ bits[5] ^ bits[6] ^ bits[9] ^ bits[10];
    bits[3] = bits[4] ^ bits[5] ^ bits[6];
    bits[7] = bits[8] ^ bits[9] ^ bits[10];

    return bits.join('');
}

function decodeChar(bits) {
    let bitsArray = bits.split('').map(bit => parseInt(bit));
    let error = 0;

    let p1 = bitsArray[0] ^ bitsArray[2] ^ bitsArray[4] ^ bitsArray[6] ^ bitsArray[8] ^ bitsArray[10];
    let p2 = bitsArray[1] ^ bitsArray[2] ^ bitsArray[5] ^ bitsArray[6] ^ bitsArray[9] ^ bitsArray[10];
    let p3 = bitsArray[3] ^ bitsArray[4] ^ bitsArray[5] ^ bitsArray[6];
    let p4 = bitsArray[7] ^ bitsArray[8] ^ bitsArray[9] ^ bitsArray[10];

    error = p1 * 1 + p2 * 2 + p3 * 4 + p4 * 8;

    if (error !== 0) {
        bitsArray[error - 1] = bitsArray[error - 1] ^ 1;
    }

    let dataBits = [
        bitsArray[2],
        bitsArray[4],
        bitsArray[5],
        bitsArray[6],
        bitsArray[8],
        bitsArray[9],
        bitsArray[10]
    ].join('');

    return { char: parseInt(dataBits, 2), error: error - 1 };
}
