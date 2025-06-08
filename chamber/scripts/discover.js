// discover.js - Load and display discover cards

document.addEventListener('DOMContentLoaded', function() {
    loadDiscoverCards();
    displayVisitorMessage();
});

async function loadDiscoverCards() {
    try {
        const response = await fetch('data/discover.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const attractions = await response.json();
        displayDiscoverCards(attractions);
    } catch (error) {
        console.error('Error loading discover data:', error);
        const container = document.getElementById('discover-cards');
        container.innerHTML = '<p>Sorry, we could not load the attractions data.</p>';
    }
}

function displayDiscoverCards(attractions) {
    const container = document.getElementById('discover-cards');
    container.innerHTML = ''; // Clear existing content

    attractions.forEach(attraction => {
        const card = createDiscoverCard(attraction);
        container.appendChild(card);
    });
}

function createDiscoverCard(attraction) {
    // Create card container
    const card = document.createElement('article');
    card.className = 'discover-card';
    card.setAttribute('data-id', attraction.id);

    // Create title
    const title = document.createElement('h2');
    title.textContent = attraction.name;

    // Create figure with image
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = `images/${attraction.image}`;
    image.alt = attraction.name;
    image.loading = 'lazy';
    image.width = 300;
    image.height = 200;
    figure.appendChild(image);

    // Create address
    const address = document.createElement('address');
    address.textContent = attraction.address;

    // Create description
    const description = document.createElement('p');
    description.textContent = attraction.description;

    // Create learn more button
    const button = document.createElement('button');
    button.textContent = 'Learn More';
    button.className = 'learn-more-btn';
    button.addEventListener('click', () => {
        // You can add functionality here for the learn more button
        alert(`Learn more about ${attraction.name}!`);
    });

    // Assemble card
    card.appendChild(title);
    card.appendChild(figure);
    card.appendChild(address);
    card.appendChild(description);
    card.appendChild(button);

    return card;
}

function displayVisitorMessage() {
    const messageContainer = document.getElementById('visitor-message');
    const lastVisitKey = 'lastVisitDate';
    const currentDate = new Date();
    const lastVisitDate = localStorage.getItem(lastVisitKey);
    
    let message = '';
    
    if (!lastVisitDate) {
        // First visit
        message = "Welcome! Let us know if you have any questions.";
    } else {
        // Calculate days between visits
        const lastDate = new Date(lastVisitDate);
        const timeDifference = currentDate.getTime() - lastDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
        
        if (daysDifference < 1) {
            // Less than a day
            message = "Back so soon! Awesome!";
        } else if (daysDifference === 1) {
            // Exactly 1 day
            message = "You last visited 1 day ago.";
        } else {
            // More than 1 day
            message = `You last visited ${daysDifference} days ago.`;
        }
    }
    
    // Create visitor message element
    const messageElement = document.createElement('div');
    messageElement.className = 'visitor-info';
    messageElement.innerHTML = `
        <h3>Visitor Information</h3>
        <p>${message}</p>
        <button class="close-btn" onclick="closeVisitorMessage()">×</button>
    `;
    
    messageContainer.appendChild(messageElement);
    
    // Store current visit date
    localStorage.setItem(lastVisitKey, currentDate.toISOString());
}

function closeVisitorMessage() {
    const messageContainer = document.getElementById('visitor-message');
    messageContainer.innerHTML = '';
    messageContainer.style.display = 'none';
}