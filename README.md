# Cabinet-Generator
An app that we are making for our Software Engineering class at Wayne State University.
This will be a browser-based web app made with a React frontend and a Django backend

**Intended Functionality**
- Users will input 3 walls of a room that they want cabinets in
- Users will also input any obstructions in that room (windows, sinks, outlets, etc)
- App will then generate a cabinet layout based on the room dimensions
- App will allow users to export a PDF of the cabinet layout that carpenters could use

**Stretch Goals**
- Find a way to make money off this app
- Allow users to edit the cabinet layout

## Running The Code
To use this repo, you need to start the backend on your local machine (port 8000)

You can either start the frontend on your local machine (any port except for 8000). Or you can run it from our [live link on GitHub pages]([url](https://wsu-software-engineering-group-12.github.io/Cabinet-Generator/)).

_NOTE: Even if you use the GitHub pages live link, you still have to run the backend locally_

### Starting the backend
**Repo Structure**
`Cabinet-Generator (Root)`
` - backend`
` - frontend`

- Navigate to the backend folder and run the following command: `cd backend`
- Start the Python virtual environment: On Mac `source venv/bin/activate`. Tk add Windows guide
- Run the server: From the backend folder, run the command `python manage.py runserver`

### Starting the frontend
- Navigate to the root folder
- Navigate to the frontend folder: `cd frontend`
- Install yarn dependencies: `yarn`
- Run development mode: `yarn dev`
- Click on the link that comes up in the terminal after running this command
- NOTE: Frontend will not work properly if the backend isn't also included
