# Nightscout GraphQL Server

Very basic toy project that intends to connect to a Nightscout data store, and then expose the store's entries with a graphql API. Not supported, not affiliated with the Nightscout project.

## JS version
Make sure to add a `.env` in `js/src/` containing the key `MDB_CONNECTION_STRING`. You can also add `SERVER_PORT` if you want to run on a specific port.

No build or other tasks atm, this project is just for the sake of providing a sample gql endpoint for a different project.

## Ruby version
Nothing yet!

## TODO
* JS
    * tests
    * add a hard limit on number of entries to fetch at once, make this a single day's worth (5 * 60 * 24)
    * consider some affordances on the endpoint for some calculated values, mean value, std deviation, etc
    * prepare for integration with frontend
    * redocument this work into a trello card on a new board to use on the day
