# freestyle-tournaments

Freestyle Tournament Pokémon — Web Project HTML, CSS & JS

Implementations
— Select a winner for each round
— Reset at any moment the tournament
— Show stats by hovering the selected contender

Stretch Implementations
—Save current tournament state
— Winners are saved in a podium
—Save current contenders

Inthis project, a Pokémon tournament was developed. The user has the feature to select a winner for each round and select the winner of the tournament. The user can also press a reset button that erases the tournament information and creates a completely new one. Additionally, the user also has the ability to hover over a Pokémon to view its stats.

All this is achieved thanks to Event Listeners implemented in the JS. An event listener is a procedure in JavaScript that waits for an event to occur. Now to apply this into our project is necessary to use the inbuilt function in JS addEventListener(), which receives two arguments: the type of event, here is where you are specify which event are you waiting to happen (click, mouseover) and the callback function, is the function that gets trigger when the event occurs.


In this example, we can see how we add an event listener to the image to know when a user selected a winner of a round. We can see that the event is trigger when an image is ‘click’ and the function winnerSelected is triggered.

A live example of an event listener working in the project.
Also for good handling purpose removeEventListener() was implemented. This is used to remove the event listener when a winner of a round is already selected and avoid selecting a different winner when one is already established. This way, consistency in the tournament information is maintained.

Speaking about consistency, all the information of this tournament is stored in a database which gives the project persistency. Thanks to the inbuilt function fetch, the tournament is able to send GET, POST and PATCH requests to the Pokémon API to retrieve new information or to the database to handle information of a tournament.


In this example, we can see a fetch used to update the information of a tournament state in the DB with PATCH
For this project we used a JSON Server to host our DB but what exactly is this server?

A JSON Server is a Node Module that you can use to create demo rest json web service in less than a minute. All you need is a JSON file for sample data.


Here, you can see our DB with the information stored. 1567 Lines? That’s a lot!
Now, to be clear, accessing the information of the API we encounter a problem. For this project, we wanted diversity with the contenders instead been the same ones each time a new tournament was started. For this, we randomize a number that will represent an ID (between 0 and the total of Pokémons). Then, we will retrieve the information of that Pokémon and this process will be done for each contender. We noticed that sometimes we received undefined as a result in one of the contenders.


Oh no!
To solve this issue, first we needed to know what was happening. We noticed that fetch wasn’t having enough time to retrieve the information and fulfill the promise. For this, we implemented the keywords Async and Await in our project. Now, the code will be able to wait until the information of a Pokemon is retrieved before trying to search another Pokemon. With this changes we had our contenders ready for the tournament with no undefined stowaways.


Contenders displayed correctly.
It has been a great project to work on, learned and apply a lot of knowledge and will keep seeking for more challenges. See you in the tournament!
