# Polymaker

## Install and run

$ npm install
- Installs dependecies

$ npm start
- Starts the app on `localhost:1234`
- Remember to start the `polymakerBackend` see https://github.com/Quball/polymakerBackend

## TODO
- Write tests
- Handle errors from api
- Create error feedback to the user
- Add intersection feature
- Verify valid geoJson before storing to db

## BUGS
- Creating a union of polygons draws a duplicate of the new polygon on the map but only stores one new object in db
