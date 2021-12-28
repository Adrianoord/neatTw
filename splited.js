const fs = require('fs');

const trainingLoaded = JSON.parse(fs.readFileSync('training.json', 'utf8'));
const testeLoaded = JSON.parse(fs.readFileSync('teste.json', 'utf8'))

console.log(trainingLoaded.length);
console.log(testeLoaded.length);

const newTraining = [];
const newTeste = [];

trainingLoaded.forEach(item=>{
    const newInput = [];
    for(let i=0;i<item.input.length;i++){
        if((i+3)<240){
            newInput.push(item.input[i+3] - item.input[i]);
        }
    }
    console.log(newInput.length);
    item.input = newInput;
    newTraining.push(item);
});

testeLoaded.forEach(item=>{
    const newInput = [];
    for(let i=0;i<item.input.length;i++){
        if((i+3)<240){
            newInput.push(item.input[i+3] - item.input[i]);
        }
    }
    console.log(newInput.length);
    item.input = newInput;
    newTeste.push(item);
});

fs.writeFileSync('teste.json', JSON.stringify(newTeste), 'utf8');
fs.writeFileSync('training.json', JSON.stringify(newTraining), 'utf8');