// Local cache to minimize API calls
const pokeCache = {};

const searchBtn = document.getElementById('search-btn');
const inputField = document.getElementById('poke-input');
const displayArea = document.getElementById('display-area');

searchBtn.addEventListener('click', async () => {
    const query = inputField.value.toLowerCase().trim();
    if (!query) return;

    let data;

    // Check cache first
    if (pokeCache[query]) {
        console.log("Loading from cache...");
        data = pokeCache[query];
    } else {
        console.log("Fetching from API...");
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
            if (!response.ok) throw new Error("Pokemon not found");
            data = await response.json();
            
            // Store in cache for next time
            pokeCache[query] = data;
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    renderPokemon(data);
});

function renderPokemon(data) {
    displayArea.style.display = 'block';
    document.getElementById('poke-name').innerText = data.name.toUpperCase();
    document.getElementById('poke-img').src = data.sprites.front_default;
    
    // Set up the Cries (Sound)
    const audioPlayer = document.getElementById('poke-sound');
    audioPlayer.src = data.cries.latest;

    // Populate the 4 dropdowns with moves
    const dropdowns = document.querySelectorAll('.move-select');
    dropdowns.forEach(select => {
        select.innerHTML = ''; // Clear old moves
        data.moves.forEach(moveEntry => {
            const option = document.createElement('option');
            option.value = moveEntry.move.name;
            option.text = moveEntry.move.name;
            select.appendChild(option);
        });
    });
}

// Add to Team logic
document.getElementById('add-team-btn').addEventListener('click', () => {
    const teamContainer = document.getElementById('team-container');
    const name = document.getElementById('poke-name').innerText;
    const imgSrc = document.getElementById('poke-img').src;
    
    // Collect selected moves
    const selectedMoves = Array.from(document.querySelectorAll('.move-select'))
                               .map(select => select.value);

    // Create Team Member Card
    const card = document.createElement('div');
    card.style.border = "2px solid black";
    card.style.padding = "10px";
    card.innerHTML = `
        <h4>${name}</h4>
        <img src="${imgSrc}" width="80">
        <ul>
            ${selectedMoves.map(m => `<li>${m}</li>`).join('')}
        </ul>
    `;
    
    teamContainer.appendChild(card);
});