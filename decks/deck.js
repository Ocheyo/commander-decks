const prepCardName = (cardName) => cardName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/, '');

const buildURL = (cardName) => `http://tappedout.net/mtg-card/${prepCardName(cardName)}/`;

const buildCardAnchor = (cardName) => {
	let link = buildURL(cardName);
	let anchor = document.createElement('a');
	anchor.href = link;
  anchor.innerText = cardName;
	return anchor;
}

const sortByType = (deckList) => {
  let sortedByType = {};
  deckList.forEach(card => {
    if (sortedByType[card.type]) {
      sortedByType[card.type].push(card.name);
    } else {
      sortedByType[card.type] = [card.name];
    }
  });
  return sortedByType;
}

const createCategory = (type) => {
  let listDiv = document.getElementById('deck-list');
  let h3 = document.createElement('h3');
  h3.innerText = type.replace(type[0], type.charAt(0).toUpperCase()) + ':';
  listDiv.append(h3);
  let typeList = document.createElement('ul');
  typeList.id = type;
  listDiv.append(typeList);
}

const buildDeckList = (deckList) => {
  let sortedByType = sortByType(deckList);
  for (type in sortedByType) {
    createCategory(type);
  	let category = document.getElementById(type);
    sortedByType[type].forEach(cardName => {
      let listItem = document.createElement('li');
      listItem.appendChild(buildCardAnchor(cardName));
      category.appendChild(listItem);
    });
  }
}

const buildDeckPage = (deckObj) => {
  let titleItem =  document.getElementsByTagName('title').item(0);
  titleItem.innerText = deckObj.deckName;
  
  let deckName = document.createElement('h1');
  deckName.innerText = deckObj.deckName;
  document.getElementById('deck-name').append(deckName);
  
  let deckDesc = document.createElement('p');
  deckDesc.innerText = deckObj.deckDesc;
  document.getElementById('desc').append(deckDesc);
  
  let comm = document.createElement('h2');
  comm.innerText = 'Commander: ' + deckObj.commander.name;
  document.getElementById('commander').append(comm);

  buildDeckList(deckObj.deckList);
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

fetch(new Request('https://gist.githubusercontent.com/Ocheyo/95f5c9b38df7d9aa698988c62db147c9/raw/4574522e7413a7e7c8c09ef16368505232b721c4/athreos.JSON'))
  .then(function(response) { 
    response.json().then(function(result) { buildDeckPage(result); });
});