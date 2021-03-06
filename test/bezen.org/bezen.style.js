/*
 * bezen.style.js - DOM style and CSS class utilities
 *
 * author:    Eric Bréchemier <bezen@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   2010-01-14 "Calvin's Snowball"
 *
 * To Cecile, with Love,
 * you were the first to wait for the conception of this library
 *
 * Tested successfully in
 *   Firefox 2, Firefox 3, Firefox 3.5,
 *   Internet Explorer 6, Internet Explorer 7, Internet Explorer 8,
 *   Chrome 3, Safari 3, Safari 4,
 *   Opera 9.64, Opera 10.10
 */
/*requires bezen.js */
/*requires bezen.string.js */
/*requires bezen.array.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global bezen, document */
bezen.style = (function() {
  // Builder of
  // Closure for DOM style and CSS class utilities
  
  // Define aliases
  var hash = bezen.array.hash,
      trim = bezen.string.trim;
   
  var getClasses = function(node) {
    // return a hash of class names, with the ordered list of class name 
    // in the private property '_'.
    //
    // params:
    //   node - (DOM element) (optional) the element to get classes from.
    //          In case no node is provided, an empty hash will be returned.
    //
    // return: (object)
    //   a hash object with one property set to true for each class name.
    //   The original sequence of class names is preserved in an array set to
    //   the property '_', which is not a valid CSS name.
    //
    if (!node || !node.className) {
      return {_:[]};
    }
     
    var classNames = trim(node.className).split(/\s+/);
    var classes = hash(classNames);
    classes._ = classNames;
    return classes;
  };
  
  var setClasses = function(node,classes) {
    // set the node className with selected classes
    // The intent of this method is to update the classes previously retrieved
    // with getClasses(), after one or several modifications using addClass()
    // and removeClass().
    //
    // params:
    //   node - (DOM element) (!nil) the element to set the classes to
    //   classes - (object) (!nil) a hash object in the format returned by
    //             getClasses, with one property set to true for each class
    //             and the list of class names in the private property '_'
    //
    // Note: The order of classes will be preserved by
    //         setClasses(node, getClasses(node) )
     
    node.className = classes._.join(' ');
  };
   
  var addClass = function(classes,className) {
    // append a class to the end of current classes, unless the class is 
    // already defined to true in the hash. 
    //
    // params:
    //   classes - (object) (!nil) a hash object in the format returned by
    //             getClasses, with one property set to true for each class
    //             and the list of class names in the private property '_'
    //   className - (string) (!nil) a class name
    //
    // return: (object)
    //   the modified hash of class names
    //
    // Note: the order or remaining classes is preserved
    if ( classes[className] ) {
      return classes;
    }
     
    classes[className] = true;
    classes._.push(className);
    return classes;
  };
   
  var removeClass = function(classes,className) {
    // remove a class from current classes
    // 
    // params:
    //   classes - (object) (!nil) a hash object in the format returned by
    //             getClasses, with one property set to true for each class
    //             and the list of class names in the private property '_'
    //   className - (string) (!nil) a class name
    //
    // return: (object)
    //   the updated hash of class names
    // 
    // Notes:
    //   * the order or remaining classes is preserved
    //   * the class name will be completely removed even if present
    //     multiple times at different positions in the list
    if (!classes[className]){
      return classes;
    }
     
    delete classes[className];
    var newList = [];
    var oldList = classes._;
    for (var i=0; i<oldList.length; i++){
      if(oldList[i]!==className){
        newList.push(oldList[i]);
      }
    }
    classes._ = newList;
    return classes;
  };
   
  var showBlock = function(element) {
    // Show an element as block
    //
    // param:
    //   element - (DOM element) (!nil) the element to show
      
    if (element.style) {
      element.style.display = 'block';
    }
  };
    
  var hide = function(element) {
    // Hide element
    //
    // param:
    //   element - (DOM element) (!nil) the element to hide
     
    if (element.style) {
      element.style.display = 'none';
    }
  };
   
  var resetDisplay = function(element) {
    // Reset element display style to default
    //
    // param:
    //   element - (DOM element) (!nil) the element to modify
     
    if (element.style) {
      element.style.display = '';
    }
  };
    
  return { // public API
    getClasses: getClasses,
    setClasses: setClasses,
    addClass: addClass,
    removeClass: removeClass,
    showBlock: showBlock,
    hide: hide,
    resetDisplay: resetDisplay,
     
    _: { // private section, for unit tests
    }
  };
}());
