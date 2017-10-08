const comm = document.createElement('h2'), commImg = document.createElement('img'), list = document.createElement('nav');

const prepCardName = (cardName) => cardName.toLowerCase().replace(/( \/ | )/g, '-').replace(/[^\w-]/, '');

const buildURL = (cardName) => `http://tappedout.net/mtg-card/${prepCardName(cardName)}/`;

const buildCommanderImg = (commander) => {
  commImg.src = 'http://gatherer.wizards.com/Handlers/Image.ashx?name=' + commander.name.replace(/\//g, '//').replace(/ /g, '%20').replace(/'/g, '%27') + '&type=card&.jpg';
  commImg.alt = commander.name;
  commImg.className = 'absolute';
  commImg.id = 'commander-image';
  commImg.setAttribute('data-image', commImg.src);
  return commImg;
}

const mouseEnterEvent = (event) => commImg.src = event.target.getAttribute('data-image');

const mouseLeaveEvent = (event) => commImg.src = commImg.getAttribute('data-image');

const buildCardAnchor = (card) => {
	let link = buildURL(card.name);
	let anchor = document.createElement('a');
	anchor.href = link;
  anchor.innerText = (card.qty > 1) ? card.qty + 'x ' + card.name : card.name;
  anchor.target = '_blank';
  anchor.setAttribute('data-image', 'http://gatherer.wizards.com/Handlers/Image.ashx?name=' + card.name.replace(/ /g, '%20').replace(/'/g, '%27') + '&type=card&.jpg');
  anchor.addEventListener('mouseenter', mouseEnterEvent);
  anchor.addEventListener('mouseleave', mouseLeaveEvent);
	return anchor;
}

const sortByType = (deckList) => {
  let sortedByType = {};
  deckList.forEach(card => {
    if (sortedByType[card.category]) {
      sortedByType[card.category].push(card);
    } else {
      sortedByType[card.category] = [card];
    }
  });
  return sortedByType;
}

const createCategory = (category) => {
  let listDiv = document.getElementById('deck-list');
  let h3 = document.createElement('h3');
  h3.innerText = category.replace(category[0], category.charAt(0).toUpperCase()) + ':';
  listDiv.append(h3);
  let typeList = document.createElement('ul');
  typeList.id = category;
  listDiv.append(typeList);
}

const buildDeckList = (deckList) => {
  let sortedByType = sortByType(deckList);
  for (category in sortedByType) {
    createCategory(category);
  	let typeList = document.getElementById(category);
    sortedByType[category].forEach(card => {
      let listItem = document.createElement('li');
      listItem.appendChild(buildCardAnchor(card));
      typeList.appendChild(listItem);
    });
  }
}

const scrollOff = () => commImg.className = 'fixed';

const scrollOn = () => commImg.className = 'absolute';

const pageScrolled = () => {
  (comm.getBoundingClientRect().y <0) ? scrollOff() : scrollOn();
  if (document.getElementById('nav-button').getBoundingClientRect().y <0 && list.className === 'display')  hideNav();
}

const buildDeckPage = (deckObj) => {
  let titleItem =  document.getElementsByTagName('title').item(0);
  titleItem.innerText = deckObj.name;
  
  let deckName = document.createElement('h1');
  deckName.innerText = deckObj.name;
  deckName.id = 'deck-name';
  document.getElementById('deck-name-div').append(deckName);
  
  let deckDesc = document.createElement('p');
  deckDesc.innerText = deckObj.desc;
  document.getElementById('desc').append(deckDesc);
  
  
  let commander = document.getElementById('commander');
  comm.appendChild(buildCardAnchor(deckObj.commander));
  commander.append(comm);

  let listDiv = document.getElementById('deck-list');
  let commImg = buildCommanderImg(deckObj.commander);
  listDiv.append(commImg);

  buildDeckList(deckObj.deckList);

  document.addEventListener('scroll', pageScrolled);
}

const getURLParameter = (sParam) => {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

const displayNav = () => {
  list.className = list.className.replace('hidden', 'display');
  document.getElementById('nav-button').className = 'rotate';
}

const hideNav = () => {
  list.className = list.className.replace('display', 'hidden');
  document.getElementById('nav-button').className = '';
}

const navStatus = (event) => {
  (list.className === 'display') ? hideNav() : displayNav();
}

const bodyClick = (event) => { if (event.target.id !== 'nav-button' && list.className === 'display' ) hideNav(); }

const buildNavList = (myDecks) => {
  let baseURL = "deck.html?deckID=";
  let home = document.createElement('a');
  home.href = 'https://ocheyo.github.io/commander-decks/';
  home.innerText = 'Home';
  let homeItem = document.createElement('li');
  homeItem.append(home);
  list.append(homeItem);
  myDecks.forEach(deck => {
    let anchor = document.createElement('a');
    anchor.href = baseURL + deck.link;
    anchor.innerText = deck.name;
    let listItem = document.createElement('li');
    listItem.append(anchor);
    if (getURLParameter('deckID') === deck.link) {
      listItem.id = 'active';
    }
    list.append(listItem);
  });
  list.id = 'nav';
  list.className = 'hidden';
  document.getElementsByTagName('body')[0].addEventListener('click', bodyClick)
}

const createNav = (result) => {
  let header = document.getElementsByTagName('header')[0];
  let button = document.createElement('img');
  button.id = 'nav-button';
  button.src = '../images/button-img.jpg';
  button.addEventListener('click', navStatus);
  buildNavList(result.decks);
  header.append(button);
  header.append(list);
}


fetch(new Request(getURLParameter('deckID')))
  .then(function(response) { 
    response.json().then(function(result) { buildDeckPage(result); });
});

fetch(new Request('https://raw.githubusercontent.com/Ocheyo/commander-decks/master/myDecks.JSON'))
  .then(function(response) { 
    response.json().then(function(result) { createNav(result); });
});
