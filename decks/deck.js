const comm = document.createElement('h2'), commImg = document.createElement('img');

const prepCardName = (cardName) => cardName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/, '');

const buildURL = (cardName) => `http://tappedout.net/mtg-card/${prepCardName(cardName)}/`;

const buildCommanderImg = (commander) => {
  commImg.src = 'http://gatherer.wizards.com/Handlers/Image.ashx?name=' + commander.name.replace(/ /g, '%20').replace(/'/g, '%27') + '&type=card&.jpg';
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

const pageScrolled = () => (comm.getBoundingClientRect().y <0) ? scrollOff() : scrollOn(); 

const buildDeckPage = (deckObj) => {
  let titleItem =  document.getElementsByTagName('title').item(0);
  titleItem.innerText = deckObj.name;
  
  let deckName = document.createElement('h1');
  deckName.innerText = deckObj.name;
  document.getElementById('deck-name').append(deckName);
  
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

fetch(new Request(getURLParameter('deckID')))
  .then(function(response) { 
    response.json().then(function(result) { buildDeckPage(result); });
});

