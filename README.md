# Melody MasterMind

Welcome to MelodyMastermind, the ultimate destination for music enthusiasts and trivia buffs alike! Challenge your musical knowledge by guessing songs from various genres and eras. With each correct guess, you earn points and climb the global leaderboard, competing against players from around the world. Whether you're a casual listener or a seasoned music aficionado, MelodyMastermind offers a fun and addictive way to test your skills while discovering new tunes. Join the community today and see if you have what it takes to become the ultimate MelodyMastermind!

# Tech Stack Used

## Frontend

- React
- Sass
- Axios

## Backend

- Node.js
- Express
- MySQL
- Knex


## API

- Spotify API

# Features

1. When visiting the website for the first time, user is asked to create a username to be displayed on the leaderboards.
2. Once username is chosen, user is shown a variety of playlists to choose from.
3. After choosing a playlist the game begins. A song from the playlist starts playing and 4 song titles are shown. Player must choose the corresponding song title for the song currently playing.
4. If the correct title is chosen, the player earns a point and another song is played. The leaderboards update in real time so you can watch yourself climb the ranks as your score increases.
5. If the incorrect title is chosen, the game ends, and the player is provided a choice between choosing another playlist, or playing again. 
6. There is a leaderboard page where you can see the leaderboards for each playlist.
7. On the account page, you can view information such as how many games have been played, your top score, best playlist and more.

# Installation

In order to run this project locally you will need to install the frontend, backend, and database. You will also need to provide a Spotify secret and client from the Spotify developer page.

## Frontend

1. Clone this repository
2. Change directory into this folder using `cd client` in the terminal
3. Install dependencies in the terminal using `npm i`
4. Start the frontend server in the terminal using `npm run dev`

## Database

1. Create a MySQL database and update the .env in the server file to include the port number the database server is running on, database name, username and password.

## Backend

1. Clone this repository
2. Change directory into this folder using `cd server`
3. Install dependencies in the terminal using `npm i`
4. Update the sample .env file with your Spotify client and secret
5. Update the .env file to provide 
6. Create the database table using Knex in the terminal by using `npx knex migrate:latest`
7. Create the seed data in the terminal by using `npx knex seed:run`
8. Start the backend server in the terminal using `npm start`

# Next steps

1. Create real accounts so users can login on different devices
2. Create a new feature where you can add friends, and filter leaderboards to show only your friends
3. Add a new feature where users can add their own playlists
4. Deploy 