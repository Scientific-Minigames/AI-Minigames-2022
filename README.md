# AI-Minigames-2022

## Introduction

One of the workshops in [Rasta Summer School 2022](https://summerschool.rastaiha.ir/) was named Artificial Intelligence and its content was mostly about evolutionary algorithms, In particular, genetic algorithms. Students learned about the core concepts of a genetic algorithm. Concepts like population, natural selection, mutation, crossover and fitness.



The following games are implemented with the help of a library called [P5JS](https://p5js.org/) and are intended to help students get intuition about the concepts of genetic algorithms.



## Password Game

### [manual](https://editor.p5js.org/AlieNiT/full/DTFXjG_6a)

This one is a pretty simple game in which the player has to guess a password. After every 7 trials, the player gets a score for each guess. The score is the number of letters which are exactly correct (For example, if the password is "apple", "aleppe" gets score of 2 because of a_p__ which is present in the guess).

### [brute force](https://editor.p5js.org/AlieNiT/full/kp9pk5kXg)

In this section, students watched a brute force algorithm trying all 10 letter long possible passwords and realized the approach wouldn't work simply because the size of the set of all possible passwords is exponentially large.



### [genetic](https://editor.p5js.org/AlieNiT/full/Vjdu-kasI)

Lastly, students come up with a genetic algorithm to solve this problem more efficiently. This game is the implementation of their algorithm.

The only difference is the fact that after every 200 trials we get a score(and not 7), and the password is now 26 letters long (which is much harder).





## N Queens

In this part, students are faced with the famous [8 queens puzzle](https://en.wikipedia.org/wiki/Eight_queens_puzzle).

### [manual](https://editor.p5js.org/AlieNiT/full/LClT4XouM)

Students first tried the original problem in the link above.

###[brute force](https://editor.p5js.org/AlieNiT/full/IUsd3uHc6)

Just like the first game, students could see a brute force algorithm in action. This algorithm is also very slow for large(>4) sizes of the chessboard.

### [genetic](https://editor.p5js.org/AlieNiT/full/2Imp6rVk7)

In the end, students came up with a genetic algorithm to solve this problem.



## TSP

The last problem students had to solve was [Travelling-Salesman Problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem). TSP is a NP-hard problem in computer science. This time, students also tried the problem themselves and then came up with a genetic algorithm to solve it.

### [manual](https://editor.p5js.org/AlieNiT/full/ZOuVmvZDU)



### [genetic](https://editor.p5js.org/AlieNiT/full/2Imp6rVk7)



### [inversion mutation](https://editor.p5js.org/AlieNiT/full/FWN2X7Byz)

A notable difference in the implementation of the genetic algorithm for TSP was the mutation algorithm. In this game, students had to apply a new type of mutation called [inversion](https://en.wikipedia.org/wiki/Mutation_(genetic_algorithm)#Inversion) in order to eliminate crosses in the TSP path.



### [Iran TSP](https://editor.p5js.org/AlieNiT/full/A-PUhNZ2a)

This game is TSP in action. Students should help a tourist visit all capitals of Iran in an efficient way.
