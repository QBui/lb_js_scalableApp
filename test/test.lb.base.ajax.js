/*
 * test.lb.base.ajax.js - Unit Tests of lb.base.ajax module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-05-30
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.ajax.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, goog, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.ajax

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.array.js */
      empty = bezen.array.empty,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires goog.net.MockXmlHttp */
      MockXmlHttp = goog.net.MockXmlHttp;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','ajax'),
                                       "lb.base.ajax namespace was not found");
  }

  function setUp(){

    // empty set of MockXmlHttp instances
    empty( MockXmlHttp.lb.all );
  }

  function testSend(){
    var ut = lb.base.ajax.send;

    var url = '/events/';
    var data = {name: 'message', data: [{id:1, title:'Test'}]};
    var responses = [];
    var callback = function(response){
      responses.push(response);
    };
    ut(url, data, callback);

    assert.equals( MockXmlHttp.lb.all.length, 1,
                                              "one instance of XHR expected");
    var xhr = MockXmlHttp.lb.all[0];
    assert.equals( xhr.lb.url, url,          "same url expected in XHR call");
    assert.equals( xhr.lb.method, 'POST',             "POST method expected");
    assert.equals( xhr.lb.async, true,          "asynchronous call expected");
    assert.equals( xhr.lb.headers['Content-Type'],
                   'application/json;charset=utf-8',
                                      "Content Type for JSON/UTF-8 expected");

    // trigger asynchronous response
    xhr.complete();
    assert.objectEquals(responses, [data],      "echo of given data expected");

    var failCallback = function(){
      throw new Error('Test failure in XHR callback');
    };
    ut (url, data, failCallback);
    assert.equals( MockXmlHttp.lb.all.length, 2,
                                              "two instances of XHR expected");
    xhr = MockXmlHttp.lb.all[1];
    // trigger asynchronous response - should not fail
    xhr.complete();
  }

  var tests = {
    testNamespace: testNamespace,
    testSend: testSend
  };

  testrunner.define(tests, "lb.base.ajax");
  return tests;

}());
