/*
 * Namespace: lb.base.array
 * Array Adapter Module for Base Library
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal-Box SAS (c) 2010-2011, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2011-04-20
 */
/*requires lb.base.js */
/*jslint white:false, plusplus:false */
/*global lb, goog */
lb.base.array = (function() {
  // Builder of
  // Closure for lb.base.array module

  // Declare alias
      /*requires closure/goog.array.js */
  var gArray = goog.array;

  function addOne(array, item){
    // Function: addOne(array, item)
    // Add an item to the array, only once (no duplicates allowed).
    //
    // Parameters:
    //   array - array, the array to modify in place
    //   item - any, the new item to insert at end, unless already present

    gArray.insert(array, item);
  }

  function removeOne(array, item){
    // Function: removeOne(array, item])
    // Remove the first occurence of an item from the given array.
    // The identity operator === is used for the comparison.
    //
    // Parameters:
    //   array - array, the array to modify in place
    //   item - any, the item to remove
    //
    // Note:
    // Duplicates are not removed.

    gArray.remove(array,item);
  }

  function removeAll(array){
    // Function: removeAll(array)
    // Remove all items from the array.

    gArray.clear(array);
  }

  function copy(array){
    // Function: copy(array): array
    // Copy an array.
    //
    // Parameter:
    //   array - array, the array to copy
    //
    // Returns:
    //   array, a shallow copy of given array

    return gArray.clone(array);
  }

  function toArray(pseudoArray){
    // Function: toArray(pseudoArray): array
    // Convert a pseudo-array to an array.
    //
    // Parameter:
    //   pseudoArray - object, a pseudo-array such as function arguments
    //
    // Returns:
    //   array, the pseudo-array converted to a new array instance

    return gArray.toArray(pseudoArray);
  }

  return { // public API
    addOne: addOne,
    removeOne: removeOne,
    removeAll: removeAll,
    copy: copy,
    toArray: toArray
  };
}());
