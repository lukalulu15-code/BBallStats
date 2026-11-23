# BBallStats

BBallStats is a web application for basketball coaches and players. Coaches use it to manage their team, track matches live, and record player statistics. Players use it to follow their own performance.

The app has two user roles:

- **Coach (trener)**: manages the club's roster, creates and runs matches live, records box-score statistics and shot locations, runs shooting training sessions, and writes reports for players.
- **Player (igrac)**: views their own profile, per-match and season-average statistics, shooting charts, and the reports written by their coach.

> The UI and parts of the codebase use Serbian naming (e.g. `utakmica` = match, `igrac` = player, `trener` = coach, `sut` = shot).

## Features

- **Authentication**: coaches register themselves and create login accounts for their players. Includes JWT-based sessions, per-resource authorization on the backend, and password reset by email.
- **Roster management**: add, edit and remove players (jersey number, position, height, date of birth, photo).
- **Match scheduling**: create matches with competition, opponent and date. Matches are grouped by season (July 1 – June 30).
- **Live match tracking**:
  - game clock and quarter control
  - live score for both teams
  - substitutions and starting lineups
  - play-by-play event log
  - full box score per player: points, 2PT/3PT/FT made and missed, offensive and defensive rebounds, assists, steals, turnovers, blocks, fouls, fouls drawn, plus/minus, efficiency index and minutes played
  - opponent players tracked as well
- **Shooting charts**: shots are recorded with their court location (x/y), both in matches and in training sessions, and displayed as made/missed charts and zone-based percentages.
- **Training sessions**: coaches run shooting training sessions for individual players and record every attempt.
- **Statistics and season averages**: per-player and team averages, filtered by season, with charts (Chart.js).
- **Reports**: coaches write text reports for their players. Players see them on their page, with read/unread status.

## Tech stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Frontend | Angular 20 (standalone components), TypeScript, Chart.js, RxJS   |
| Backend  | Node.js, Express 5, TypeScript                                   |
| Database | MongoDB with Mongoose                                            |
| Auth     | JSON Web Tokens (`jsonwebtoken`), password hashing with `bcryptjs` |
| Email    | Nodemailer (Gmail) for password reset                            |

## Project structure

```
BBallStats/
├── backend/                 # Express REST API
│   └── src/
│       ├── controllers/     # request handlers
│       ├── middleware/      # JWT auth middleware
│       ├── models/          # Mongoose schemas
│       ├── routers/         # API routes
│       ├── utils/           # token helpers
│       └── server.ts        # entry point (port 4000)
└── frontend/                # Angular application
    └── src/app/
        ├── guards/          # route guard (auth)
        ├── interceptors/    # attaches JWT to HTTP requests
        ├── models/          # TypeScript models
        ├── services/        # HTTP services
        └── <pages>/         # one folder per page/component
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on `mongodb://localhost:27017`
- Angular CLI (optional): `npm install -g @angular/cli`

### 1. Clone the repository

```bash
git clone https://github.com/lukalulu15-code/BBallStats.git
cd BBallStats
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
JWT_SECRET=your_jwt_secret
EMAIL=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:4200
```

- `JWT_SECRET`: any long random string, used to sign tokens.
- `EMAIL` / `EMAIL_PASSWORD`: a Gmail account and an [App Password](https://support.google.com/accounts/answer/185833). These are used to send password reset emails.
- `FRONTEND_URL`: the address of the frontend, used to build the reset link.

Build and start the server:

```bash
npm run build
npm start
```

The API runs on `http://localhost:4000` and connects to the `BBallStats` database. The backend has no watch mode, so run `npm run build` again and restart the server after you change backend code.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200` in your browser.

### 4. Default profile picture (optional)

Users who register without a photo get a default profile picture, which is stored in the database. To set it, send a base64-encoded image once:

```bash
curl -X POST http://localhost:4000/defaultSlika/addDefaultSlika \
  -H "Content-Type: application/json" \
  -d '{"slika": "data:image/png;base64,..."}'
```

## Usage

1. Register as a **coach** and log in.
2. Add players to your roster. You set a username and password for each player, and they use these to log in.
3. Create a match, choose the starting lineup and start it to track it live.
4. After the match, review the box score, play-by-play and shooting chart.
5. Players log in to see their statistics, shooting charts and your reports.

## Author

Luka ([@lukalulu15-code](https://github.com/lukalulu15-code))
