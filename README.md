# Secret Santa Game Generator

This project includes a frontend (built with Vite and React) and a backend (built with Node.js and Express) to process Secret Santa game based on uploaded CSV files. Users can upload an employee list and last year’s Secret Santa results, and the application will generate and allow download of the new Secret Santa Game Result for the current year.

<br>

## Features

<ul>
  <li><b>Frontend:</b> User interface for uploading CSV files and downloading the generated Secret Santa Game Result Excel Sheet</li>
  <li><b>Backend:</b> Handles file uploads, processes employee and previous Secret Santa data, and generates new in CSV format.</li>
  <li><b>CSV Download:</b> Provides a link to download the generated CSV.</li>
</ul>

<br>

## Technologies Used
For both used <b>TypeScript</b> 
<b>Frontend</b>
<ul>
  <li><b>Vite</b> - Development build tool for frontend</li>
  <li><b>React</b> - Library for building user interfaces</li>
</ul>

<b>Backend</b>
<ul>
  <li><b>Node.js</b> - Server-side runtime</li>
  <li><b>Express.js</b> - Web framework</li>
  <li><b>Multer</b> - Middleware for file uploads</li>
  <li><b>CSV-Writer</b> - Utility for writing CSV files</li>
  <li><b>CORS</b> - Middleware to allow cross-origin requests</li>
</ul>

<br>

## Getting Started

<b>Prerequisites</b>
<ul>
  <li>Node.js (v14 or higher)</li>
  <li>npm (comes with Node.js) or you can use pnpm </li>
</ul>

<br>

## Installation

<ol>
  <li><b>Clone the repository:</b><br>
    <code>git clone https://github.com/SadamWebDeveloper/Secret-Sanata.git</code>
  </li>
  <br>
  <li><b>Install dependencies for frontend:</b><br>
    <code>cd frontend</code><br>
    <code>npm install</code><br>
    <code>npm run dev</code>
  </li>
  <br>
  <li><b>Install dependencies for backend:</b><br>
    <code>cd backend</code><br>
    <code>npm install</code><br>
    <code>npm run dev</code>
  </li>
</ol>

<br>

<b>Access the application:</b><br>
<ul>
  <li>Frontend: Open your browser and go to <code>http://localhost:5173</code></li>
  <li>Backend: Server running on <code>http://localhost:3000</code></li>
</ul>

<br>

## Project Structure

<pre>
secretsanta/
├── frontend/              # Frontend files built with Vite
│   ├── src/               # React application source files
│   ├── public/            # Public assets
│   └── index.html         # Main HTML file
├── backend/               # Backend server files
│   ├── routes/            # API route files
│   ├── parsers/           # Functions to parse CSV files
│   ├── services/          # Secret Santa assignment logic
│   ├── output/            # Directory for generated CSV files
│   └── app.js             # Main application file
└── README.md
</pre>

## Note 
use standard csv format utf-8 

https://github.com/mholt/PapaParse/issues/407
