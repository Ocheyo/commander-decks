const list = document.createElement('nav');

const displayNav = () => list.className = list.className.replace('hidden', 'display');

const hideNav = () => console.log('here'); //list.className = list.className.replace('display', 'hidden');

const buildNavList = (myDecks) => {
	let baseURL = "deck.html?deckID=";
	myDecks.forEach(deck => {
		let anchor = document.createElement('a');
		anchor.href = baseURL + deck.link;
		anchor.innerText = deck.name;
		let listItem = document.createElement('li');
		listItem.append(anchor);
		anchor.className = ''
		if (document.getElementById('deck-name') == deck.name) {
			console.log('this should be active')
			listItem.id = 'active';
		}
		list.append(listItem);
	});
	list.addEventListener('moouseleave', hideNav);
	list.id = 'nav';
	list.className = 'hidden';
}

const createNav = (result) => {
	let header = document.getElementsByTagName('header')[0];
	let button = document.createElement('img');
	button.id = 'nav-button';
	button.src = '../images/button-img.jpg';
	button.addEventListener('click', displayNav);
	buildNavList(result.decks);
	header.append(button);
	header.append(list);
}


fetch(new Request('https://raw.githubusercontent.com/Ocheyo/commander-decks/master/myDecks.JSON'))
  .then(function(response) { 
    response.json().then(function(result) { createNav(result); });
});
