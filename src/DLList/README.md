# DLList

## A basic doubly linked list

### DLList

- The primary export of this module is the DLList class
- The DLList class is a basic doubly linked list
- Comes with an iterator
- Any item added must have an equals method implemented
  - You can implement Equals.ts interface to ensure that your class implements this method

### SortableDLList

- The dllist but it sorts the items when they are added
- Any added item must have a compareTo and an equals method
  - You can implement Comparable.ts interface to ensure that your class implements these methods
- If you want to force a resort, like for instance if you changed the behavior of the compareTo method, you can call sort() which will resort the list in place
- If you want to get a newly sorted dllist you can call the static function sort(DLList) which will return a new SortableDLList

### DLListIterator

- The iterator for the DLList class
- The iterator is a class that can be used to iterate over the items in the list
- It will iterate over the items in the list in the order they are added or their sort order (from least to greatest)
