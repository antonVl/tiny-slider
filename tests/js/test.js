var resultsDiv = doc.querySelector('.test-results'),
    windowWidth = getWindowWidth(),
    multiplyer = 100;

function addTitle(str) {
  var title = doc.createElement('div');
  title.className = 'title';
  title.textContent = str;
  resultsDiv.appendChild(title);
}

function addTest(str) {
  var test = doc.createElement('div');
  test.className = 'item-running';
  test.textContent = str;
  resultsDiv.appendChild(test);
  return test;
}

function runTest(str, fn) {
  var test = addTest(str);
  test.className = (fn()) ? 'item-success' : 'item-fail';
}

function containsClasses(el, arr) {
  var len = arr.length,
      classes = el.className,
      assertion = true;

  for (var i = 0; i < len; i++) {
    if (classes.indexOf(arr[i]) < 0) { assertion = false; }
  }

  return assertion;
}

function getWindowWidth() {
  return (document.documentElement || document.body.parentNode || document.body).clientWidth;
}

function compare2Nums(a, b) {
  return Math.abs(a - b) < 1;
}

function repeat(fn, times) {
  for (var i = times; i--;) {
    fn();
  }
}

function getAbsIndexAfterControlsClick(count, by, clicks) {
  return (count * multiplyer + by * clicks)%count;
}

// ### base
function testBase () {
  var id = 'base',
      slider = sliders[id],
      info = slider.getInfo();



  // base init <===
  addTitle('base: init');

  runTest('Outer wrapper: classes', function () {
    return containsClasses(info.container.parentNode.parentNode, ['tns-hdx', 'tns-outer']);
  });

  runTest('Inner wrapper: classes', function () {
    return containsClasses(info.container.parentNode, ['tns-inner']);
  });

  runTest('Container: classes', function () {
    return containsClasses(info.container, ['base','tns-slider','tns-carousel','tns-horizontal']);
  });

  runTest('Slides: width, position, count, aria attrs', function () {
    var slideItems = info.slideItems,
        firstVisible = slideItems[info.slideCount * 2],
        lastVisible = slideItems[info.slideCount * 2 + info.items - 1],
        firstVisiblePrev = slideItems[info.slideCount * 2 - 1],
        lastVisibleNext = slideItems[info.slideCount * 2 + info.items];

    return slideItems.length === info.slideCount * 5 &&
            containsClasses(firstVisible, ['tns-item']) &&
            firstVisible.id === id + '-item' + 0 &&
            firstVisible.getAttribute('aria-hidden') === 'false' &&
            !firstVisible.hasAttribute('tabindex') &&
            firstVisiblePrev.id === '' &&
            firstVisiblePrev.getAttribute('aria-hidden') === 'true' &&
            firstVisiblePrev.getAttribute('tabindex') === '-1' &&
            lastVisible.id === id + '-item' + (info.items - 1) &&
            lastVisible.getAttribute('aria-hidden') === 'false' &&
            !lastVisible.hasAttribute('tabindex') &&
            lastVisibleNext.getAttribute('aria-hidden') === 'true' &&
            lastVisibleNext.getAttribute('tabindex') === '-1' &&
            compare2Nums(firstVisible.clientWidth, windowWidth / info.items) &&
            compare2Nums(firstVisible.getBoundingClientRect().left, 0) &&
            compare2Nums(lastVisible.getBoundingClientRect().right, windowWidth) ;
  });

  runTest('Controls: attrs', function () {
    
  });

  runTest('Nav items: data-nav & hidden attrs', function () {
    var navItems = info.navItems,
        nav0 = navItems[0],
        nav1 = navItems[1];
    return nav0.getAttribute('data-nav') === '0' &&
            !nav0.hasAttribute('hidden') &&
            nav1.getAttribute('data-nav') === '1' &&
            nav1.hasAttribute('hidden');
  });

  runTest('Controls: click functions', function () {
    var assertion = true;

    // click prev button
    repeat(function () { info.prevButton.click(); }, 6);
    if (assertion) {
      var absIndex = getAbsIndexAfterControlsClick(info.slideCount, info.slideBy, -6),
          current = info.container.querySelector("[aria-hidden='false']");
      assertion = 
        (sliders[id].getInfo().index)%info.slideCount === absIndex &&
        info.navItems[absIndex].getAttribute('aria-selected') === 'true' &&
        compare2Nums(current.getBoundingClientRect().left, 0) &&
        current.querySelector('a').textContent === absIndex.toString();
    }

    // click next button
    repeat(function () { info.nextButton.click(); }, 11);
    if (assertion) {
      var absIndex = getAbsIndexAfterControlsClick(info.slideCount, info.slideBy, (11 - 6)),
          current = info.container.querySelector("[aria-hidden='false']");
      assertion = 
        (sliders[id].getInfo().index)%info.slideCount === absIndex &&
        info.navItems[absIndex].getAttribute('aria-selected') === 'true' &&
        compare2Nums(current.getBoundingClientRect().left, 0) &&
        current.querySelector('a').textContent === absIndex.toString();
    }

    return assertion;
  });

  runTest('Nav: click functions', function () {
    var assertion = true;
    var visibleNavIndexes = info.visibleNavIndexes;

    // click 2nd visible nav
    info.navItems[visibleNavIndexes[1]].click();
    var current = info.container.querySelector("[aria-hidden='false']");
    assertion = 
      info.navItems[visibleNavIndexes[1]].getAttribute('aria-selected') === 'true' &&
      (sliders[id].getInfo().index)%info.slideCount === visibleNavIndexes[1] &&
      compare2Nums(current.getBoundingClientRect().left, 0) &&
      current.querySelector('a').textContent === visibleNavIndexes[1].toString()
      ;

    // click 3rd visible nav
    info.navItems[visibleNavIndexes[2]].click();
    var current = info.container.querySelector("[aria-hidden='false']");
    assertion = 
      info.navItems[visibleNavIndexes[2]].getAttribute('aria-selected') === 'true' &&
      (sliders[id].getInfo().index)%info.slideCount === visibleNavIndexes[2] &&
      compare2Nums(current.getBoundingClientRect().left, 0) &&
      current.querySelector('a').textContent === visibleNavIndexes[2].toString()
      ;

    // click 1st visible nav
    info.navItems[visibleNavIndexes[0]].click();
    var current = info.container.querySelector("[aria-hidden='false']");
    assertion = 
      info.navItems[visibleNavIndexes[0]].getAttribute('aria-selected') === 'true' &&
      (sliders[id].getInfo().index)%info.slideCount === visibleNavIndexes[0] &&
      compare2Nums(current.getBoundingClientRect().left, 0) &&
      current.querySelector('a').textContent === visibleNavIndexes[0].toString()
      ;

    return assertion;
  });
}


window.onload = function () {
  testBase();
};

// window.onresize = function () {
//   resultsDiv.innerHTML = '';
//   testBase();
// };