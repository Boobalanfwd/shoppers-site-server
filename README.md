# e-commerce-server

## Description
This is an e-commerce server built with Express.js and Prisma. It provides a RESTful API for managing e-commerce functionalities.

## Project Structure
```
e-commerce-server
├── src
│   ├── app.js
│   ├── controllers
│   │   └── index.js
│   ├── routes
│   │   └── index.js
│   └── prisma
│       └── client.js
├── prisma
│   └── schema.prisma
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd e-commerce-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Update the `DATABASE_URL` in the `.env` file.
   - Run the Prisma migrations:
     ```
     npx prisma migrate dev
     ```

## Usage

To start the server, run:
```
npm start
```

The server will be running on `http://localhost:3000`.

## API Endpoints

- `GET /`: Returns a welcome message.

## License
This project is licensed under the MIT License.