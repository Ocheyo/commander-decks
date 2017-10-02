const prepCardName = (cardName) => cardName.toLowerCase().replace(' ', '-').replace(/[^\w-]/, '');

const buildURL = (cardName) => `http://tappedout.net/mtg-card/${prepCardName(cardName)}/`;

const buildCardAnchor = (cardName) => {
	let link = buildURL(cardName);
	let anchor = document.createElement('a');
	anchor.href = link;
    anchor.innerText = cardName;
	return anchor;
}

const buildDeckList = (deckList) => {
  let sortedByType = {}
  decklist.forEach(card => {
  	if (sortedByType[card.type]) {
  		sortedByType[card.type].push(card.name);
  	} else {
  		sortedByType[card.type] = [card.name];
  	}
  });
  for (type in sortedByType) {
  	let div = document.getElementById(type);
    sortedByType[type].forEach(cardName => {
      let listItem = document.createElement('li');
      listItem.innerText = buildCardAnchor(cardName);
      div.append(listItem);
    });
  }
}

const buildDeckPage = (deckID) => {
  // NEED TO OPEN JSON
  let deckObj = fetch(new Request(`${deckID}.JSON`)).then(function(response) { return response.json(); });
  //JSON.parse(`${deckID}.JSON`);
  console.log(deckObj);
  document.getElementsByTagName('title').innerText = deckObj.deckName;
  
  let deckName = document.createElement('h1');
  deckName.innerText = deckObj.deckName;
  document.getElementById('deck-name').append(deckName);
  
  let deckDesc = document.createElement('p');
  deckDesc.innerText = deckObj.deckDesc;
  document.getElementById('deck-desc').append(deckDesc);
  
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

document.onload(buildDeckPage(getURLParameter('deckID')));

