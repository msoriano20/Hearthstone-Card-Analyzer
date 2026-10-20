import { createClient } from 'https://esm.sh/@supabase/supabase-js'
const cardSupabaseUrl = 'https://guseczisjjocqqcxqgiv.supabase.co'
const cardSupabaseKey = 'sb_publishable_G4LmSfzTnbpHoc2wJKGEkA_3E0jJWgy'
const cardSupabase = createClient(cardSupabaseUrl, cardSupabaseKey)

const CLIENT_ID = "29de47bd890d4a0891c357939c78f270";
const CLIENT_SECRET = "VwyFC8fxlKTVCIXth6d7vQdX1xkkwb6a";

async function getAccessToken() {
    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    const response = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
    });

    const data = await response.json();
    return data.access_token;
}


document.addEventListener("DOMContentLoaded", loadExpansions);
document.getElementById("loadBtn").addEventListener("click", loadCards);





async function loadExpansions() {
  const token = await getAccessToken();

  const response = await fetch(
    "https://us.api.blizzard.com/hearthstone/metadata/sets?locale=en_US",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const sets = await response.json();
  //console.log(sets);

  const select = document.getElementById("expansion");

  sets.forEach(set => {
    const option = document.createElement("option");
    option.value = set.slug;
    //console.log(set.slug);      // API-friendly value
    option.textContent = set.name; 
    //console.log(set.name);      // Human-readable
    select.appendChild(option);
  });
}

function getRandomCards(cards, count = 10) {
  const shuffled = [...cards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function loadCards() {
  
    try {
        async function fetchAllCards() {
            let allCards = [];
            let page = 1;
            let pageCount = 1; 

            const token = await getAccessToken();
            const set = document.getElementById("expansion").value;
            console.log("Selected set:", set);

            while (page <= pageCount) {
                const url = `https://us.api.blizzard.com/hearthstone/cards?locale=en_US&set=${set}&page=${page}`;
                const response = await fetch(url, {
                  headers: {
                      "Authorization": `Bearer ${token}`
                  }
                });
                const data = await response.json();

                allCards = allCards.concat(data.cards);

                
                pageCount = data.pageCount;
                page++;
            }

            return allCards;
        }

        const allCards = await fetchAllCards();
        console.log("allCards selected")

        const list = document.getElementById("cards");
        list.innerHTML = "";

        allCards.forEach(card => {
            const li = document.createElement("li");

            const img = document.createElement("img");
            img.src = card.image;
            img.alt = card.name;
            img.width = 150;

            const name = document.createElement("p");
            name.textContent = card.name;
            console.log("Card name:", card.name);

            const favBtn = document.createElement("button");
            favBtn.textContent = "⭐ Add to Favorites";
            favBtn.onclick = () => addToFavorites(card);

            li.appendChild(img);
            li.appendChild(name);
            li.appendChild(favBtn);
            list.appendChild(li);
        }); 
    const carouselContainer = document.getElementById("carousel-slides");
    carouselContainer.innerHTML = ""; // clear previous slides
    const randomCards = getRandomCards(allCards, 10);

    randomCards.forEach(card => {
      const li = document.createElement("li");
      li.className = "glide__slide";

      const img = document.createElement("img");
      img.src = card.image;
      img.alt = card.name;
      img.width = 150;

      const caption = document.createElement("p");
      caption.textContent = card.name;

      li.appendChild(img);
      li.appendChild(caption);
      carouselContainer.appendChild(li);
    });

    // Initialize Glide.js
    new Glide('#card-carousel', {
      type: 'carousel',
      startAt: 0,
      perView: 4,
      gap: 20,
      breakpoints: {
        1024: { perView: 3 },
        768: { perView: 2 },
        480: { perView: 1 }
      }
    }).mount();

  } catch (err) {
    console.error("Error loading cards:", err);
  }
}



async function addToFavorites(card) {
  const { error } = await cardSupabase
    .from("favorites")
    .insert([
      {
        card_id: card.id,
        name: card.name,
        image: card.image,
        set: card.cardSetId
      }
    ]);

  if (error) {
    console.error("Supabase error:", error);
    alert("Failed to add favorite");
  } else {
    alert(`${card.name} added to favorites ⭐`);
  }
}


loadExpansions
window.loadCards = loadCards;
