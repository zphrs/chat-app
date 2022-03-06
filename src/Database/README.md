# Database

### Handles:

- saving to a file
  - Default file is .data
- Loading from a file
  - Default file is .data

### File save structure:

- Each new database object is a new folder, nested under its parent. If it doesn't have a parent then it is nested under the dataPath directory
- Each folder contains a data.json file which stores the data object
- every write to the data object is automatically saved asynchronously. You must write to the root object to save the file with `databaseInstance.data = data`
- all data is loaded into memory when the database is created if the file exists
  - A TODO is to only load the data object when the data object is requested for the first time and to manage the memory usage accordingly
