class NeuralNetwork {
    constructor(neuronCounts, WBarray = null) {
        this.neuronCounts = neuronCounts;
        this.levels = [];
        if (WBarray == null) {
            for (let i = 0; i < this.neuronCounts.length - 1; i++) {
                this.levels.push(new Level(
                    this.neuronCounts[i], this.neuronCounts[i + 1]
                ));
            }
        }
        else {
            //construct levels of the network, based on serialized WBarray.
            for (let i = 0; i < WBarray.weights.length; i++) {
                this.levels.push(new Level(
                    this.neuronCounts[i], this.neuronCounts[i + 1], WBarray.weights[i], WBarray.biases[i]
                ));
            }

        }
    }
    static serialize(network) {
        // Serializes the weights and biases of the network to an object
        let serialized = {
            weights: [],
            biases: []
        };
        for (let i = 0; i < network.levels.length; i++) {
            serialized.weights.push(network.levels[i].weights);
            serialized.biases.push(network.levels[i].biases);
        }
        return serialized;

    }
    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(
                outputs, network.levels[i], i == network.levels.length - 1);
        }
        return outputs;
    }

    // static mutate(network, amount = 1, mutationRate=0.01) {
    //     network.levels.forEach(level => {
    //         for (let i = 0; i < level.biases.length; i++) {
    //             if (Math.random() < mutationRate)
    //                 level.biases[i] = lerp(
    //                     level.biases[i],
    //                     Math.random() * 0.5 - 0.25,
    //                     amount
    //                 )
    //         }
    //         for (let i = 0; i < level.weights.length; i++) {
    //             for (let j = 0; j < level.weights[i].length; j++) {
    //                 if (Math.random() < mutationRate)
    //                     level.weights[i][j] = lerp(
    //                         level.weights[i][j],
    //                         Math.random() * 0.5 - 0.25,
    //                         amount
    //                     )
    //             }
    //         }
    //     });
    // }
    static mutate(network, mutationRate = 0.04) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                if (Math.random() < mutationRate)
                    level.biases[i] =  Math.random() * 2 - 1;
            }
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    if (Math.random() < mutationRate)
                        level.weights[i][j] =  Math.random() * 2 - 1;
                }
            }
        });
    }

    static crossover(network1, network2) {
        //implementation of crossover. for every weight or bias, randomly choose between network1 or 2. (returns 2 offsprings)
        // You can serialize both networks and then pick weights and biases randomly from them.
        let offspring1, offspring2;

        offspring1 = new NeuralNetwork(network1.neuronCounts);
        offspring2 = new NeuralNetwork(network2.neuronCounts);
        for (let i = 0; i < offspring1.levels.length; i++) {
            for (let j = 0; j < offspring1.levels[i].biases.length; j++) {
                if (Math.random() > 0.5) {
                    offspring1.levels[i].biases[j] = network1.levels[i].biases[j];
                    offspring2.levels[i].biases[j] = network2.levels[i].biases[j];
                } else {
                    offspring1.levels[i].biases[j] = network2.levels[i].biases[j];
                    offspring2.levels[i].biases[j] = network1.levels[i].biases[j];
                }
            }
            for (let j = 0; j < offspring1.levels[i].weights.length; j++) {
                for (let k = 0; k < offspring1.levels[i].weights[j].length; k++) {
                    if (Math.random() > 0.5) {
                        offspring1.levels[i].weights[j][k] = network1.levels[i].weights[j][k];
                        offspring2.levels[i].weights[j][k] = network2.levels[i].weights[j][k];
                    } else {
                        offspring1.levels[i].weights[j][k] = network2.levels[i].weights[j][k];
                        offspring2.levels[i].weights[j][k] = network1.levels[i].weights[j][k];
                    }
                }
            }
        }
        return [offspring1, offspring2];

    }
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, level, last = false) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }
        if (last) {
            let sums = [0, 0];
            for (let i = 0; i < level.outputs.length; i++) {
                let sum = 0
                for (let j = 0; j < level.inputs.length; j++) {
                    sum += level.inputs[j] * level.weights[j][i];
                }

                if (sum > level.biases[i]) {
                    sums[i] = sum - level.biases[i]
                }
            }
            if (sums[0] > sums[1])
                level.outputs = [1, 0];
            if (sums[0] < sums[1])
                level.outputs = [0, 1];
            else level.outputs = [0, 0];
            return level.outputs;
        }
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}