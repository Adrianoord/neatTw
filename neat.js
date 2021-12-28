const { Network, methods, config } = require('neataptic');

config.warnings = false;

const Methods = methods;

const training = [
    {input:[0.200604647397995, 0.49814799427986145, 0.4719482660293579], output:[1.67]},
    {input: [0.2549862861633301, 0.6642754077911377, 0.04761633276939392], output: [1.67]},
    {input: [0.2542112469673157, 0.6945976614952087, 0.06963199377059937], output: [1.67]},
    {input: [0.15939033031463623, 0.38596493005752563, 0.6700443625450134], output: [1.63]}
]

const neat = new Network(3, 1);

async function initEvolution() {
    const result = await neat.evolve(training, {
        mutation: methods.mutation.ALL,
        equal: true,
        provenance:2,
        popsize: 500,
        elitism: 0.1,
        log: 10,
        error: 0.0000000001,
        iterations: 10000,
        mutationRate: 0.9,
        network: neat
    });

    console.log(neat.activate());
}

initEvolution()