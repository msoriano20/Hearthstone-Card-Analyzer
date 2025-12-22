const SUPABASE_URL = 'https://guseczisjjocqqcxqgiv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1c2VjemlzampvY3FxY3hxZ2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjUxNjcsImV4cCI6MjA4MTkwMTE2N30.Qq5hWSGeFfnuiFqndDfkZI8H3sobicv5v_ZpUglzcwo'


const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


async function loadFavorites() {
  const { data, error } = await supabaseClient
    .from("favorites")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const list = document.getElementById("favorites");
  list.innerHTML = ""; // Clear previous list

  data.forEach(card => {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = card.image;
    img.width = 150;

    const name = document.createElement("p");
    name.textContent = card.name;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑 Remove";
    deleteBtn.onclick = async () => {
      const { error } = await supabaseClient
        .from("favorites")
        .delete()
        .eq('card_id', card.card_id);

      if (error) {
        console.error("Delete error:", error);
        alert("Failed to remove card.");
      } else {
        alert(`${card.name} removed from favorites.`);
        loadFavorites(); // Refresh the list
      }
    };

    li.appendChild(img);
    li.appendChild(name);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// Load favorites on page load
document.addEventListener("DOMContentLoaded", loadFavorites);
