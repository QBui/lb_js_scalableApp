/*
 * Namespace: lb.base.config
 * Configuration Adapter Module for Base Library
 *
 * This is a generic data storage for configuration properties.
 * Options are stored as properties of a private config object.
 * They can be accessed using setOptions() to set one or several options, and
 * getOption() to retrieve a single value.
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
 * 2011-04-21
 */
/*requires lb.base.js */
/*jslint white:false, plusplus:false */
/*global lb, goog */
lb.base.config = (function() {
  // Builder of
  // Closure for lb.base.config module

  // Declare alias

  var /*requires lb.base.object.js */
      has = lb.base.object.has,
      /*requires closure/goog.object.js */
      gObject = goog.object,

  // Private fields

      // object, a hash of configuration properties
      config = {};

  function reset(){
    // Function: reset()
    // Remove all options from configuration.

    config = {};
  }

  function setOptions(options){
    // Function: setOptions(options)
    // Set one or several configuration options.
    //
    // Each new option is added to the configuration, replacing any existing
    // value of the same name. Options previously set are otherwise preserved.
    //
    // In order to avoid clashes in the names of configuration properties,
    // each property should use a prefix corresponding to the implementor of
    // the module which makes use of it. All configuration properties used in
    // modules implemented by Legal-Box will use the prefix 'lb', e.g.
    // 'lbFactory' for the DOM Element Factory.
    //
    // Parameter:
    //   options - object, a set of configuration properties

    gObject.extend(config,options);
  }

  function getOption(name, defaultValue){
    // Function: getOption(name, defaultValue)
    //
    // Parameters:
    //   name - string, name of the configuration property to retrieve
    //   defaultValue - any, optional default value to return in case the
    //                  configuration value is undefined or null.
    //                  The default value itself defaults to null.
    //
    // Returns:
    //   - the default value when the corresponding configuration property is
    //     missing, null or undefined
    //   - the value of the corresponding configuration property otherwise
    defaultValue = has(defaultValue)? defaultValue : null;

    var value = config[name];
    if ( has(value) ){
      return value;
    } else {
      return defaultValue;
    }
  }

  return { // public API
    reset: reset,
    setOptions: setOptions,
    getOption: getOption
  };
}());
