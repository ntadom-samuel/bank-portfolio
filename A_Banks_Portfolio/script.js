'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////IMPLEMENTING SMOOTH SCROLLING
btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect(); //The getBoundingclientRect method retrieves coordinates of the element attached to it-- in this case, section 1. Note: The 'y' property is equal to the height of the view port.
  // console.log(s1coords);
  // // console.log(e.target.getBoundingClientRect()); //It retrieves the cordinates of the element calling the event listener
  // // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); //window.pageXOffset & window.pageYOffset retrieve the current X and Y coordinates of the scroll on the page
  // ////getting the height and width of the current viewport of a webpage
  // console.log(
  //   'height',
  //   document.documentElement.clientHeight,
  //   'width',
  //   document.documentElement.clientWidth
  // );
  // //Making scrolling smooth
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset, //s1coords.top returns the coordinates of the distance between the top of the viewport and the section. To get an approprate coordinate, you have to add the window.pageYOffset
  //   behavior: 'smooth',
  // });

  //New way
  section1.scrollIntoView({ behavior: 'smooth' }); //This method will cause the veiwport to scroll to the position of the element that is calling it on the webpage.
});

////////////////////////////////////////////////////////////////
// Page Navigation
// 1. The old method:
//It is inefficient because it replicates the below event multiple times
//Note: nodelists can use the forEach method when you convert them to arrays
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 2. The new method: Event delegation
//It uses the principle of bubling and capturing
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////BUILDING TAB COMPONENT
//Event delegation in practice
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //When the tab container is clicked, the 'e.target.closest('.operations__tab')' returns null because no element matches.
  //THis causes an error when the code gets to 'clicked.classList.add('operations__tab--active')'. To prevent this error do this.
  if (!clicked) return; //--this is called a guard clause

  // console.log(clicked);
  //Activate tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////////////////CREATING A STICKY NAVIGATION
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //This adds a margin to the selected element. It is used to increase or decrease the height of an element
});

headerObserver.observe(header);

////////////////////////////////////////////////////MENU FADE ANIMATON
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      // if (el !== link) el.style.opacity = opacity;
      if (el !== link) el.style.opacity = this;
    });
    // logo.style.opacity = opacity;
    logo.style.opacity = this;
  }
};

//////////////////////////////////////////////////ADDING ARGUMENTS TO EVENTLISTENER'S CALLBACK FUNCTIONS
// nav.addEventListener('mouseover', function (e) {}); //mouseover is similar to mouseenter, but the difference is that mouseenter does not bubble
// //For events like mouseover and mouseenter to work effectively, they need opposite events to counter them.
// //The opposite of mousenter is mouseleave, and the opposite of mouseover is mouseout
// nav.addEventListener('mouseout', function (e) {});

//Ways of passing in arguments to an event handler's callback function
//Solution 1-- using the callback function to call a function
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });
//Solution 2-- using the bind method(the 'this' keyword)
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//////////////////////////////////////////////////REVEALING SECTIONS ON SCROLL-199
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  // Note: On the running of your code, the intersectObserver's function is called once before intersection. This is why we need the code above to account for that error
  entry.target.classList.remove('section--hidden'); //Note: in an intersectObserver's section, 'entires.target' is used to get the object of the present element BEING OBSERVED
  observer.unobserve(entry.target); //this is used to stop the element from being observed when leaving its percentage limit
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//////////////////////////////////////////////////////LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]'); // this is used to select images with a specific data attribute

const loadImg = function (entires, observer) {
  const [entry] = entires;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    //this ensures that the blur filter is not removed until the new image is loaded
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////////////////////////////BUILDING SLIDE COMPONENT PART 1: touchscreen buttons
const slider = function () {
  //Selected Elements
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  let curSlide = 0;
  const maxSlide = slides.length - 1; //Note: nodelists can use the '.length' property
  const dotContainer = document.querySelector('.dots');
  const creatDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide= "${i}"></button>`
      );
    });
  };

  //Functions
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add(`dots__dot--active`);
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    ); //Note: the visible slide will have a translate value of 0%
  };

  const nextSlide = function () {
    if (curSlide === maxSlide) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const innit = function () {
    creatDots();
    activateDot(curSlide);
    goToSlide(curSlide);
  };

  innit();

  ////Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  ////////////////////////////////////////////////////////////BUILDING SLIDE COMPONENT PART 2: keyboard buttons and dots

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log(e.target.dataset);
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

//////////////////////////////////////////////////////////////////LECTURES
//////////////////////////////////////////////////////////////////

// //WORKING  WITH THE DOCUMENT NODE
// //Selecting the entire HTML document
// console.log(document.documentElement);

// //Selecting document head and body
// console.log(document.head);
// console.log(document.body);

// // //SELECTING ELEMENTS
// // //Query selector is used to select elements by class '.name' or ID '#name'
// const header = document.querySelector('.header');
// // const allSections = document.querySelectorAll('.section'); //returns a nodelist
// // console.log(allSections);

// // document.getElementById('section--1'); //retrieves elements by id name alone. e.g: 'name'
// const allButtons = document.getElementsByTagName('button'); //uses id name to select all elements with a particular name
// // //it returns an 'htmlcollection' which is just a nodelist that automatically updates as a document is edited. It must first be converted to an array to use array methods on it
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn')); //it does what the getElementsByTagName does, but uses class names to select elements; instead of id names

// // //CREATING AND INSERTING ELEMENTS
// // //1. '.insertAdjacentHTML' --- check bankist

// // //2. Programmatically creating & inserting elements
// // //creating
// const message = document.createElement('div'); //this is used to create an element object
// // //Note: this element is not yet part of the DOM
// message.classList.add('cookie-message'); //this is used to add a class to a DOM element
// message.innerHTML = `We use cookies for improved functionality <button class = "btn btn--close-cookie"  > Got It! </button>`; //this is used to add html code inside an element

// // //inserting
// header.prepend(message); //The prepend method is used to insert elements into the DOM. It adds a new element as the first child of its parent element; in this case, the header element
// header.append(message); //The append method adds the new element as the last child of its parent element
// // //Note: a particular element cannot be appeneded and prepended at the same time.
// // //For you to be able to apend and prepend an element simultanrously, you must first duplicate that element
// header.append(message.cloneNode(true)); // this-- .cloneNode() --is used to duplicate elements. Setting the inner parameter to 'true' duplicates the innerhtml of the element too.

// // // header.before(message); // adds the message element before the header element
// header.after(message); // adds the message element after the header element

// // //DELETING ELEMENTS
// // //.remove()
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove()
//     //Below was the old way of removing elements
//     message.parentElement.removeChild(message);
//   });

// // //STYLES
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// // //When we create an element with JS and set its styles manually, its styles will be computed as inline styles.
// // //Note: we can use the style property to retrieve the values of our element styles that we set manually, but we cant use them to retrieve styles set in our stylesheet or automatically.
// console.log(message.style.height); //nothing is returned because the height's value was set automatically
// console.log(message.style.backgroundColor);

// // //To get the style of an element that was set in a style sheet or automatically, do this
// console.log(getComputedStyle(message)); //this will return an object containing all the styles of an element that were set in the the stylesheet or automatically.
//////selecting and a particular style
// console.log(getComputedStyle(message).height); //returns a string containing the value of the message height

// // //Application: using the computed style property to increase the height of an element
// message.style.height =
// Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

//Re-study this
// // //Changing custom css styles(:root)
// // //custom styles are stored in 'document.documentElement'
// // document.documentElement.style.setProperty('--color-primary', 'orangered');

// // //ATTRIBUTES
// // //Attributes are the parts of an html element like 'class', 'alt', and 'src'.
// const logo = document.querySelector('.nav__logo');

// // //Selecting standard attributes.
// // //Standard attributes are the default attributes of an element. e.g one of the img element's standard attribute is 'alt'
// console.log(logo.src);
// console.log(logo.alt);
// console.log(logo.className); //Note: 'className', instead of 'class', is used to retrieve the value of the class attribute in an element

// // //Selecting non-standard attributes: attributes that are manually set
// console.log(logo.designer); //error
// console.log(logo.getAttribute('designer'));

// // //Editing standard attributes
// logo.alt = 'Beautiful Sis'; //This expression will return the new value of logo.alt
// console.log(logo.alt);

////Programmatically Creating Attributes
// logo.setAttribute('company', 'Bankist'); //(attribute name, attribute value)
//You retrieve programatically created attributes the same way you retreive non-standard attributes
// console.log(logo.company); //error
// console.log(logo.getAttribute('company'));

// // //Absolute vs Relative URL
// console.log(logo.src); // this returns the absolute url of src
// console.log(logo.getAttribute('src')); // this returns the relative url of src

//////The same applys for links
// const link = document.querySelector('.nav__link');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// DATA ATTRIBUTES
//It is a special element attributes. It usually takes the format: 'data-fisrtname-secondname.'
//It is stored in the 'dataset' object-property of its particular element.
// console.log(link.dataset);
//How to access an element's data attribute's value
//If an element, X, has a data attribute named, 'data-fisrtname-secondname,' to access its value, do this: 'X.dataset.firstnameSecondname'.
// console.log(link.dataset.versionNumber);

//CLASSES
//Adding classes to an element
// logo.classList.add('c', 'd', 'e'); //adding multiple classes
// console.log(logo.classList);

// //Removing classes from an element
// logo.classList.remove('c');
// console.log(logo.classList);

// //Toggling classes: adding a class if it's not in an element, and removing it if it is.
// logo.classList.toggle('c');
// console.log(logo.classList);
// logo.classList.toggle('c');
// console.log(logo.classList);

// //Checking if an element contains a class
// console.log(logo.classList.contains('c'));

// //////////////////////////////////////EVENTS AND EVENT HANDLERS
//Adding and Removing Event handlers:
//1. With event listeners
// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   //this function deletes the h1 event handler when it is called
//   alert('addEventListener: Great! you are reading the heading');

//   //deleting event handlers
//   h1.removeEventListener('mouseenter', alertH1);
// };
// h1.addEventListener('mouseenter', alertH1);

//2. with the 'onmouseenter' property.
//The 'onmouseenter' property will react when the 'mouseenter' event happens the 'h1' element; immediately after that, it will delete the event listener. Basically, the code below does what the code above does.
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! you are reading the heading');
// };

//3. With the 'onclick' attribute within an element's HTML
// check for 'onclick' inside an h1 element's tag in the index.html document. This operation does not delete the event listener after the action is carried out.

// ////////////////////////////////////////EVENT PROPAGATION
// //Watch 190 and 191 again
// //rgb(255, 255, 255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav-link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor; //the this keyword in an event handler points to the element using the event listener
//   console.log('LINK', e.target, e.currentTarget); //e.target points to the element where the click happened
//   console.log(e.currentTarget === this); //e.currentTarget points to the element experiencing the effects of a click event

//   //Stopping propagation
//   e.stopPropagation();
// });
// document.querySelector('.nav-links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor;
//   console.log('CONTAINER', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor;
//   console.log('NAV', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });

////////////////////////////////////////////////// DOM TRAVERSING: navigationg the document
// const h1 = document.querySelector('h1');
// //Going downwards: accessing h1 child nodes and elements
// console.log(h1.querySelectorAll('.highlight')); //when you use an element as a queryselector or querySelectorAll holder, e.g h1, the querySelector will be able to extract all the children elements of its holder, with the same class or ID as its arugment, at any depth
// console.log(h1.childNodes); //.childNodes property is used to extract all the first level inner nodes-- text, elements, e.t.c --of an element. The code returns a nodelist containing the first-level children nodes of the h1 element.
// console.log(h1.children); //.children extracts only the first level children elements of an element(only elements). The code returns an HTMLCollection containing h1's first level elements
// console.log(h1.firstElementChild); //this code returns the first first-level child element of the h1 element
// console.log(h1.lastElementChild); //this code returns the last first-level child element of the h1 element
// h1.firstElementChild.style.backgroundColor = 'yellow'; //editing selected elements
// h1.lastElementChild.style.color = 'orangered';

// //Going upwards: accessing h1 parent nodes and elements
// console.log(h1.parentNode); //returns the immediate/first-level parent nodes of h1
// console.log(h1.parentElement); //returns the immediate parent elements of h1

// console.log(h1.closest('.header')); //.closest works just like the querySelector method, it returns the closest element with a class name equal to the name specified in closest method's parenthesis, but instead of retrieving a child element, it retrieves the closest parent element, no matter how high up that parent element is.
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)'; //when an element uses the .closest method with an identification that applies to itself, the element returns itself

// //Going sideways
// console.log(h1.previousElementSibling); //returns the element sibling immediately before h1
// console.log(h1.nextElementSibling); //returns the sibling element immediately after h1

// console.log(h1.previousSibling); //returns the node sibling immediately before h1
// console.log(h1.nextElementSibling); //returns the node sibling immediately after h1

// console.log(h1.parentElement.children); //this retrieves all the siblings of h1, including itself, as an HTMLcollection
// [...h1.parentElement.children].forEach(function (el) {
//   if (el != h1) el.style.transform = 'scale(0.5)'; //note: you can compare element objects
// });

///////////////////////////////////////////////////////CREATING A STICKY NAVIGATION
//OLD WAY
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//NEW WAY: The intersection observer API
//The intersection observer API is used to create informative objects when an element you select interacts with a part of your viewport, based on some specific parameters.

//Those parameters are 'root' and 'threshold', and to set them you must use an object.
// c21`fdf

////////////////////////////////////////////////////////LIFECYCLE DOM EVENTS
//DOMContentLoaded
//It is used to listen for when all the html and javascript code on a page are loaded and the DOM tree is built. It does not wait until images are loaded images
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built', e);
// });

// ////load
// //It is used to listen for when all parts of a file are loaded in a webpage, including its images
// window.addEventListener('load', function (e) {
//   console.log('page fully loaded', e);
// });

//beforeunload
//It is used to listen for when a web page is just about to close
//It is used in scenaries where a webpage user is asked if he wants to exit page
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
