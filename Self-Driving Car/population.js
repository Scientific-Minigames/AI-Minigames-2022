class Population {
    constructor(populationSize, mutationAmount, road){
        this.populationSize = populationSize;
        this.mutationAmount = mutationAmount;
        this.road = road;
        this.#initialize();
    }
    calculateFitness() {
        // Calculates fitness of all cars in the population.
        // Should be called after all members of population are damaged.
        // You can use travelledDistance function in car.js.
        // fitness(car) = (travelled distance of car) / max(travelled distance of all cars)
        // This method sets the fitness property of all cars in the population.
        //TODO
        // find max(travelled distance of all cars)
        let maxDistance = 0;
        for(let i=0;i<this.cars.length;i++){
            if(Car.travelledDistance(this.cars[i]) > maxDistance){
                maxDistance = Car.travelledDistance(this.cars[i]);
            }
        }
        for(let i=0;i<this.cars.length;i++){
            this.cars[i].fitness = Car.travelledDistance(this.cars[i]) / maxDistance;
            // console.log(this.cars[i].fitness);
        }
        
    }
    setMatingPool(multiplier=10) {
        // This method sets the mating pool according to the fitness of members of the population.
        this.matingPool =[];
        //TODO
        for(let i=0;i<this.cars.length;i++){
            for(let j=0;j<Math.floor(this.cars[i].fitness * multiplier);j++){
                this.matingPool.push(this.cars[i]);
            }
        }
    }
    
    repopulatie() {
        // This method selects 2 parents from mating pool, then performs crossover (using crossover method in network.js) and then
        // performs mutation (using mutation method in network.js and this.mutationAmount) on the offsprings and adds them too newCars.
        this.calculateFitness();
        this.setMatingPool();
        let newCars = [];
        //TODO
        for(let i=0;i<this.cars.length/2;i++){
            let parent1 = this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
            let parent2 = this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
            let [offspring1,offspring2] = NeuralNetwork.crossover(parent1.brain, parent2.brain);
            // let [offspring1,offspring2] = [structuredClone(parent1.brain),structuredClone(parent2.brain)];
            console.log(offspring1);
            NeuralNetwork.mutate(offspring1);
            NeuralNetwork.mutate(offspring2);

            newCars.push(new Car(this.road.getLaneCenter(1),100,"AI", 4));
            newCars[newCars.length-1].brain = offspring1;
            newCars.push(new Car(this.road.getLaneCenter(1),100,"AI", 4));
            newCars[newCars.length-1].brain = offspring2;

        }
        this.cars = newCars;
    }
    
    #initialize() {
        this.cars=[];
        for(let i=1;i<=this.populationSize;i++){
            this.cars.push(new Car(this.road.getLaneCenter(1),100,"AI", 4));
        }
    }
    populationHasDied() {
        let allDead = true;
        for(let i=0;i<this.populationSize;i++){
            if (!this.cars[i].damaged) {
                allDead = false;
            }
        }
        return allDead;
    }
}