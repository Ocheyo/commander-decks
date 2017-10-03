const buildLinkList = (myDecks) => {
	let baseURL = "decks/deck.html?deckID=";
	let list = document.getElementById('menu');
	myDecks.decks.forEach(deck => {
		let anchor = document.createElement('a');
		anchor.href = baseURL + deck.link;
		anchor.innerText = deck.name;
		let listItem = document.createElement('li');
		listItem.append(anchor);
		list.append(listItem);
	});
}

fetch(new Request('https://gist.githubusercontent.com/Ocheyo/4d448cb940aa14dc99c7e92f66e075b1/raw/eeda0fe991d15f119749da115b9175c045243f7e/myDecks.JSON'))
  .then(function(response) { 
    response.json().then(function(result) { buildLinkList(result); });
});