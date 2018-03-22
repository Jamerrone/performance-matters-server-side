(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

{
  var searchInputField = void 0;
  var sliderTimeoutHandler = void 0;
  var alphabeticalFilter = document.getElementById('alphabeticalFilter');
  var leftSliderControl = document.getElementById('left');
  var rightSliderControl = document.getElementById('right');
  var streetsOverview = document.getElementById('streetsOverview');
  var timeline = document.getElementById('timeline');

  var createSearchForm = function createSearchForm() {
    var form = document.createElement('form');
    var input = document.createElement('input');
    var icon = document.createElement('i');
    input.type = 'text';
    input.id = 'search';
    input.placeholder = 'Search by streetname...';
    input.addEventListener('keyup', search);
    searchInputField = input;
    icon.classList.add('fas', 'fa-search');
    form.appendChild(input);
    form.appendChild(icon);
    alphabeticalFilter.appendChild(form);
  };

  var search = function search() {
    var filter = searchInputField.value.toUpperCase();
    var li = streetsOverview.querySelectorAll('li');
    li.forEach(function (li) {
      var a = li.getElementsByTagName('a')[0] || li;
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        li.style.display = '';
      } else {
        li.style.display = 'none';
      }
    });
  };

  var clearSearch = function clearSearch() {
    var li = streetsOverview.querySelectorAll('li');
    searchInputField.value = '';
    li.forEach(function (li) {
      li.style.display = '';
    });
  };

  var scroll = function scroll(val) {
    sliderTimeoutHandler = setInterval(function () {
      timeline.scrollLeft < timeline.scrollWidth ? timeline.scrollLeft += val : clearTimeout(sliderTimeoutHandler);
    }, 0);
  };

  rightSliderControl.addEventListener('mouseover', function () {
    return scroll(1);
  });
  rightSliderControl.addEventListener('mouseleave', function () {
    return clearTimeout(sliderTimeoutHandler);
  });

  leftSliderControl.addEventListener('mouseover', function (e) {
    return scroll(-1);
  });
  leftSliderControl.addEventListener('mouseleave', function (e) {
    return clearTimeout(sliderTimeoutHandler);
  });

  window.addEventListener('hashchange', function () {
    return clearSearch();
  });
  alphabeticalFilter.querySelectorAll('li').forEach(function (li) {
    li.addEventListener('click', function () {
      return clearSearch();
    });
  });

  createSearchForm();
  lazyload();
}

},{}]},{},[1]);
