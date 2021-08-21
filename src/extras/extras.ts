import { readFileSync } from "fs";
// <div class="w3-card-4 card" style="background-color: var(--mm-selection);"
// onclick="window.open('https://www.w3schools.com')">
// <img src="thumbnails/photopea.png">
// <div class="w3-container w3-center">
//   <p><strong>Title</strong></p>
//   <p>Description</p>
// </div>
// </div>
let raw = readFileSync("build/extras/extras.json");
let json = JSON.parse(raw.toString());
let extras = json.extras;

console.log(extras);

let deck = document.getElementById("cardDeck");

for (const e of extras) {
  console.log(e);

  let card = document.createElement("div");
  card.className = "w3-card-4 card";
  card.onclick = () => window.open(`${e.url}`);

  let image = document.createElement("img");
  image.src = e.thumbnail;

  let text = document.createElement("div");
  text.className = "w3-container w3-center";
  text.innerHTML = ` 
     <p><strong>${e.title}</strong></p>
   <p>${e.description}</p> 
  `;

  card.appendChild(image);
  card.appendChild(text);
  deck?.append(card);
}

// console.log(JSON.parse(raw.toString()));
