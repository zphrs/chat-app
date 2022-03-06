# HashTable

### HashTable.ts

- `HashTable<K extends Hashable<K>, V extends Comparable<V>>`
- The primary export of this module is the HashTable class
- The HashTable class is a hash table with a default size of 10
- It is up to the key to implement a hashCode method
- It stores keys in order of insertion of the first item inserted under that key
- It stores the values in a sorted DLList based on the value's compareTo method

### hashCode.ts

- Function which takes in a string and returns a number. Formula is based on the hashCode function in Java. Used internally for HashableString

### Hashable.ts interface

- Interface which all keys must implement

### HashableString.ts

- A class which implements the Hashable.ts interface
- Uses the hashCode.ts function to calculate the hash code
