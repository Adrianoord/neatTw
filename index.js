const fs = require('fs');
const readLine = require('readline');
const neataptic = require('neataptic');
const chai = require('chai');
const assert = chai.assert;

const rl = readLine.createInterface({input:process.stdin, output:process.stdout});

const { Network, methods, config, architect } = neataptic;
const Perseptron = architect.Perceptron

config.warnings = false;

let saved;
let savedBefore;

let tipo = 0;
let novaRede = false;
let errorAntenior = 0;

const train2 = JSON.parse(readFile("teste.json"))

const trainingSet = JSON.parse(readFile("training.json"));
  
async function run(network){
    if(!novaRede && validate()) return true;
    const result = await network.evolve(trainingSet, {
        mutation: methods.mutation.BAS,
        equal: true,
        provenance:2,
        popsize: 200,
        elitism: 5,
        log: 10,
        error: 0.0000000001e-30,
        iterations: 1000,
        mutationRate: 0.9,
        network: network
    });
    if(result.iterations < 2) {
        errorAntenior = result.error;
        saveFile('network.json', network.toJSON());
        console.log('1');
        if(validate()){
            return true;
        };
        saveFile('network.json', savedBefore);
        return false;
    } else {
        savedBefore = network.toJSON();
    }
    errorAntenior = result.error;

    saved = network.toJSON();
    saveFile('network.json', network.toJSON());
    if(validate()) return true;
    return false;
}

function validate() {
    saved = JSON.parse(readFile('network.json'));
    const network2 = Network.fromJSON(saved);
    const trains = tipo == 0? train2:trainingSet
    const param = {
        asserts:0,
        total: trains.length
    }
    for(const train of trains) {
        const result = network2.activate(train.input);
        if(train.output == 0 && result[0] <= 0) {
            param.asserts++;
        }else if(train.output == 1 && result[0] > 0) {
            param.asserts++;
        } else {
            if(tipo == 0){
                const result = trainingSet.filter(item=>{
                    if(item.input.length !== train.input.length) return false
                    for(let i = 0; i < item.input.length;i++) {
                        if(item.input[i] !== train.input[i]) return false
                    }
                    return true
                });
                if(result.length < 1) {
                    console.log("Salvando novo item de treino")
                    trainingSet.push(train);
                    saveFile('training.json', JSON.stringify(trainingSet));
                }
            }
        }
    }
    const scale = 100 / param.total;
    const porc = param.asserts * scale;
    console.log(`Acertos: ${porc}%`)
    if(porc >= 100) return true;
    return false;
}

function saveFile(file, data) {
    fs.writeFileSync(file, typeof data == "string"? data:JSON.stringify(data), 'utf8');
}

function readFile(file) {
    return fs.readFileSync(file, 'utf8')
}

function ajusteArray() {
    for(const train of trainingSet) {
        console.log(train.input.length)
        if(train.input.length > 240){
            train.input.pop()
        }
    }
    saveFile('training.json', trainingSet)
}

function setHiddenLayers(networkItem) {
    const layers = [
        {index:240,squash:"BENT_IDENTITY"},
        {index:241,squash:"ABSOLUTE"},
        {index:242,squash:"BIPOLAR"},
        {index:243,squash:"STEP"},
        {index:244,squash:"BIPOLAR"},
        {index:245,squash:"IDENTITY"},
        {index:246,squash:"RELU"},
        {index:247,squash:"BIPOLAR"},
        {index:248,squash:"BIPOLAR"},
        {index:249,squash:"INVERSE"},
        {index:250,squash:"SINUSOID"},
        {index:251,squash:"BIPOLAR"},
        {index:252,squash:"STEP"}
    ]

    networkItem.nodes.forEach(node=>{
        for(const layer of layers) {
            if(node.index == layer.index) {
                node.squash = layer.squash;
            }
        }
    });

    return networkItem;
}

async function start() {
    rl.question("Tipo de procedimento:", async (type)=>{
        rl.question("Tipo de network:", async (typeNetwork)=>{
            tipo = type;
            if(Number(type) == 0) {
                validate();
            } else {
                do {
                    saved = JSON.parse(readFile('network.json'));
                    if(saved.nodes){
                        novaRede = false;
                        network = Network.fromJSON(saved);
                    } else {
                        novaRede = true;
                        if(Number(typeNetwork) == 0) {
                            network = new Network(237, 1);
                        } else {
                            network = Perseptron(237, 237, 79, 1);
                        }
                    }
                } while(!await run(network))
            }
        });
    });
}

start();
// ajusteArray()