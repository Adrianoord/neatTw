const serial = require('serialport');
const express = require('express');
const app = express();

const commands = {
    READ_DATA: [2, 1, 1, 115, 115, 3],
    READ_BYTES: [2, 1, 2, 114, 1, 112, 3],
    ON: [2, 1, 3, 112, 111, 110, 110, 115, 3],
    OFF: [2, 1, 4, 112, 111, 102, 102, 26, 3],
    NO_TAG: [2, 0, 1, 78, 79, 3],
}

let port;
let reading;

function writeCommand(command) {
    try {
        if (port) {
            port.write(Buffer.from(command));
        }
    } catch (error) {
        console.log('Error Tica Identification', error);
    }
}

function startReading() {
    reading = setInterval(() => {
        console.log("LENDO")
        port.write(Buffer.from(commands.READ_BYTES));
    }, 10);
}

function stopReading() {
    clearInterval(reading);
}

app.listen(8686,()=>{
    console.log('iniciado')
    port = new serial("/dev/ttyUSB0", {
        baudRate: 9600,
        stopBits: 1, parity: 'none', dataBits: 8,
        autoOpen: false,
    });
    
    port.on('open', (err) => {
        console.log('Leitora Tica conectada.');
        startReading();
        writeCommand(commands.ON);
        writeCommand(commands.ON);
        writeCommand(commands.ON);
    });
    
    port.on('error', ()=>{
        console.log('ERRO')
    });
    
    port.on('data', data=>{
        console.log("ALO")
        stopReading();
    });

    port.open();

});