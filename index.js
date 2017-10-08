//https://ocheyo.github.io/commander-decks/

const buildLinkList = (myDecks) => {
	let baseURL = "decks/deck.html?deckID=";
	let list = document.getElementsByClassName('menu');
	myDecks.decks.forEach(deck => {
		let anchor = document.createElement('a');
		anchor.href = baseURL + deck.link;
		anchor.innerText = deck.name;
		anchor.display = "inline";

		let image = document.createElement('img');
		image.src=(deck.img);
		image.display = 'inline';
		image.float = 'left';
		image.alt = deck.img;

		let listItem = document.createElement('li');
		listItem.append(image);
		listItem.append(anchor);
		list[0].append(listItem);
	});
}

fetch(new Request('https://raw.githubusercontent.com/Ocheyo/commander-decks/master/myDecks.JSON'))
  .then(function(response) { 
    response.json().then(function(result) { buildLinkList(result); });
});
