// Directory page JavaScript

// Function to fetch member data from JSON file
async function fetchMembers() {
    try {
        const response = await fetch('./data/members.json');
        if (!response.ok) {
            throw new Error('Failed to fetch member data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching member data:', error);
        return [];
    }
}

// Function to display members in grid or list view
function displayMembers(members, viewMode) {
    const container = document.getElementById('directory-container');
    container.innerHTML = ''; // Clear existing content
    container.className = viewMode; // Set the view mode class

    // Get membership level text based on level number
    function getMembershipLevel(level) {
        switch (level) {
            case 1: return 'Member';
            case 2: return 'Silver Member';
            case 3: return 'Gold Member';
            default: return 'Member';
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // In displayMembers function:
    const highTierMembers = members.filter(member => member.membershipLevel > 1);
    shuffleArray(highTierMembers)
        .slice(0, 3)
        .forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'member-card';

            // Add membership level class for styling 
            memberCard.classList.add(`level-${member.membershipLevel}`);

            if (viewMode === 'grid') {
                // Grid view layout
                memberCard.innerHTML = `
                <div class="member-image">${member.name.charAt(0)}</div>
                <h2>${member.name}</h2>
                <p class="membership-level">${getMembershipLevel(member.membershipLevel)}</p>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank">Website</a></p>
                <p class="description">${member.description}</p>
            `;
            } else {
                // List view layout
                memberCard.innerHTML = `
                <div class="list-content">
                    <div class="list-main">
                        <h2>${member.name}</h2>
                        <p class="membership-level">${getMembershipLevel(member.membershipLevel)}</p>
                    </div>
                    <div class="list-details">
                        <p>${member.address}</p>
                        <p>${member.phone}</p>
                        <p><a href="${member.website}" target="_blank">Website</a></p>
                    </div>
                </div>
            `;
            }

            container.appendChild(memberCard);
        });
}

// Function to initialize the directory page
async function initDirectory() {
    // Get view toggle buttons
    const gridBtn = document.getElementById('grid-btn');
    const listBtn = document.getElementById('list-btn');

    // Fetch member data
    const members = await fetchMembers();

    // Initial display in grid view
    displayMembers(members, 'grid');

    // Add event listeners for view toggle
    gridBtn.addEventListener('click', () => {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        displayMembers(members, 'grid');
    });

    listBtn.addEventListener('click', () => {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        displayMembers(members, 'list');
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initDirectory);