/*
 * test.lb.base.history.js - Unit Tests of lb.base.history module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-05-06
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.history.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window, setTimeout, document */
(function() {
  // Builder of
  // Closure object for Test of lb.base.history

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.string.js */
      endsWith = bezen.string.endsWith,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires bezen.js */
      $ = bezen.$,
      nix = bezen.nix,
      /*requires bezen.dom.js */
      element = bezen.dom.element,
      insertBefore = bezen.dom.insertBefore,
      remove = bezen.dom.remove,
      /*requires goog.events.js */
      events = goog.events,
      /*requires goog.History.js */
      NAVIGATE = goog.History.EventType.NAVIGATE;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','history'),
                                   "lb.base.history namespace was not found");
  }

  function testInitialSetup(){
    // Initialization is done automatically during script loading,
    // so as to happen before the page load event.

    assert.isTrue( object.exists( $('lb.base.history.input') ),
         "assert: input with id 'lb.base.history.input' expected in document");

    if ( $('lb.base.history.iframe') ){
      // Only present in IE, when there is no onhashchange event available
      // check that the iframe src is set to the favicon href
      assert.isTrue(  endsWith( $('lb.base.history.iframe').src,
                                'favicon.ico'),
                  "assert: favicon href expected to be set to 'favicon.ico'");
    }

    var unloadListeners = events.getListeners(window, 'unload', false);
    var found = false;
    var i;
    for (i=0; i<unloadListeners.length && !found; i++){
      if ( unloadListeners[i].listener === lb.base.history.destroy ) {
        found = true;
      }
    }
    assert.isTrue(found,             "destroy() expected as unload listener");
  }

  function replace(element, newElement){
    // replace a DOM element with a new DOM element
    //
    // Parameters:
    //   element - DOM Element, to be removed
    //   newElement - DOM Element, to be inserted at same position

    insertBefore(element,newElement);
    remove(element);
  }

  function testGetFaviconUrl(){
    var ut = lb.base.history.getFaviconUrl;

    var original = $('favicon');
    assert.isTrue( object.exists(original),
                           "assert: favicon link with id 'favicon' expected");

    var link1 = element('link',{rel:'SHORTCUT ICON',href:'favicon-blue.ico'});
    replace(original, link1);
    assert.isTrue(  endsWith(ut(), 'favicon-blue.ico'),
                          "failed to find favicon url for rel SHORTCUT ICON");

    var link2 = element('link',{rel:'shortcut icon',href:'favicon-green.ico'});
    replace(link1, link2);
    assert.isTrue(  endsWith(ut(), 'favicon-green.ico'),
                          "failed to find favicon url for rel shortcut icon");

    var link3 = element('link',{rel:'Shortcut Icon',href:'favicon-red.ico'});
    replace(link2, link3);
    assert.isTrue(  endsWith(ut(), 'favicon-red.ico'),
                          "failed to find favicon url for rel shortcut icon");

    remove(link3);
    assert.equals( ut(), '/favicon.ico',
                              "default favicon expected when none is found");

    // restore the initial favicon (now last in the head)
    var head = document.getElementsByTagName('HEAD')[0];
    head.appendChild(original);
  }

  function testGetHash(){
    var ut = lb.base.history.getHash;

    window.location.hash = '#one';
    assert.equals( ut(), '#one',                    "'#one' expected in hash");

    window.location.hash = '#one/two/three';
    assert.equals( ut(), '#one/two/three',
                                          "'#one/two/three' expected in hash");

    window.location.hash = 'one%20space';
    assert.equals( ut(), '#one space',    "hash value expected to be decoded");

  }

  function testSetHash(){
    var ut = lb.base.history.setHash;

    ut('#simple');
    assert.equals(window.location.hash, '#simple',
                                           "simple hash expected to be set");

    ut('nohashsign');
    assert.equals(window.location.hash, '#nohashsign',
                       "hash without hash sign expected to be set with one");

    ut('a/b/c');
    assert.equals(window.location.hash, '#a/b/c',
                                              "hash path expected to be set");

    ut('one space');
    // window.location.hash is not a reliable check, it gets decoded in FF
    assert.equals( lb.base.history.getHash(), '#one space',
               "hash with space expected to be properly encoded and decoded");

    ut('');
  }

  function testAddListener(test){
    var ut = lb.base.history.addListener;

    // Callback is asynchronous in IE (synchronous in other browsers)
    test.startAsyncTest();

    var capturedHash = [];
    function captureHash(hash){
      bezen.log.info('Captured Hash: '+hash);
      capturedHash.push(hash);
    }

    var capturedHash2 = [];
    function captureHash2(hash){
      bezen.log.info('Captured Hash2: '+hash);
      capturedHash2.push(hash);
    }

    // sequence of hashes for the test
    var hashSequence = ['#zero','#one','#two','#three'];
    var currentStep = 0;
    var checkHash;
    var changeHash = function(){
      bezen.log.info("Set Hash: "+hashSequence[currentStep]);
      lb.base.history.setHash( hashSequence[currentStep] );
      checkHash();
    };

    checkHash = function(){
      // check that current hash has been set
      bezen.log.info('Checking captured hash: '+capturedHash[currentStep]);
      bezen.log.info('Checking captured hash2: '+capturedHash2[currentStep]);

      if ( !object.exists(capturedHash[currentStep]) ){
        // retry the check in 200ms
        setTimeout(checkHash, 200);
        return;
      }

      assert.equals( capturedHash[currentStep], hashSequence[currentStep],
                      "New hash expected to be captured at step "+currentStep);

      assert.equals( capturedHash2[currentStep], hashSequence[currentStep],
   "New hash expected to be captured by second listener at step "+currentStep);

      // go to next step
      currentStep++;
      if ( currentStep < hashSequence.length) {
        changeHash();
      } else {
        test.endAsyncTest();
        lb.base.history.setHash('');
      }
    };

    bezen.log.info("Set Hash: "+hashSequence[currentStep]);
    ut(captureHash);
    ut(captureHash2);
    lb.base.history.setHash( hashSequence[currentStep] );

      // 200ms is greater than the goog.History polling interval (150ms)
    setTimeout(checkHash,200);
  }

  function testRemoveListener(){
    var ut = lb.base.history.removeListener;
    // remove all hash change listeners remaining from previous tests
    events.removeAll(null, NAVIGATE);

    var testCallback = function(){};
    lb.base.history.addListener(testCallback);
    lb.base.history.addListener(testCallback); // and again

    ut(testCallback);
    assert.equals( events.removeAll(null, NAVIGATE), 0,
                                          "no more NAVIGATE events expected");

    var testCallback2 = function(){};
    lb.base.history.addListener(testCallback);
    lb.base.history.addListener(testCallback2);
    lb.base.history.addListener(testCallback);
    ut(testCallback);
    ut(testCallback2);

    assert.equals( events.removeAll(null, NAVIGATE), 0,
                                     "both callbacks expected to be removed");

    ut(testCallback); // must not fail
    ut(nix); // must not fail
  }

  function testDestroy(){
    // This test must run last...
    var ut = lb.base.history.destroy;

    // remove all hash change listeners remaining from previous tests
    events.removeAll(null, NAVIGATE);
    lb.base.history.addListener(nix);

    ut();
    assert.equals( events.removeAll(null, NAVIGATE), 0,
                                    "no more listener expected after destroy");
    assert.equals( lb.base.history.getHash(), null,
                           "null hash expected when history manager is ended");

    lb.base.history.setHash('ignored');
    assert.isFalse( window.location.hash === 'ignored',
                    "setHash() must be ignored when history manager is ended");

    ut(); // must not fail when already destroyed
  }

  var tests = {
    testNamespace: testNamespace,
    testInitialSetup: testInitialSetup,
    testGetFaviconUrl: testGetFaviconUrl,
    testGetHash: testGetHash,
    testSetHash: testSetHash,
    testAddListener: testAddListener,
    testRemoveListener: testRemoveListener,
    testDestroy: testDestroy
  };

  testrunner.define(tests, "lb.base.history");
  return tests;

}());
