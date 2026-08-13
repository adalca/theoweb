(function () {
  "use strict";
  const CIA = "https://www.cia.gov/the-world-factbook/";
  const UN = "https://www.un.org/en/about-us/member-states";
  const facts = [
    ["Turkey", "This country has land in both Europe and Asia.", ["Spain", "Kenya", "Japan", "Peru"], "Turkey stretches across the Bosporus, with territory in southeastern Europe and western Asia."],
    ["Egypt", "Most of this country is in Africa, but its Sinai Peninsula is in Asia.", ["Brazil", "Canada", "Norway", "Chile"], "Egypt is a transcontinental country because the Sinai Peninsula lies in Asia."],
    ["Russia", "This enormous country stretches across eastern Europe and northern Asia.", ["India", "Mexico", "Australia", "Morocco"], "Russia spans two continents and eleven time zones."],
    ["Indonesia", "This Southeast Asian country is made of thousands of islands.", ["Switzerland", "Bolivia", "Mongolia", "Austria"], "Indonesia is a vast archipelago between the Indian and Pacific oceans."],
    ["Japan", "This island country lies east of Korea in the Pacific Ocean.", ["Portugal", "Nepal", "Chad", "Paraguay"], "Japan's four largest islands are Honshu, Hokkaido, Kyushu, and Shikoku."],
    ["Brazil", "This is the largest country in South America.", ["Argentina", "Peru", "Colombia", "Chile"], "Brazil covers nearly half of South America's land area."],
    ["Canada", "This is the largest country in North America by area.", ["Mexico", "United States", "Cuba", "Panama"], "Canada reaches from the Atlantic Ocean to the Pacific and Arctic oceans."],
    ["Australia", "This name belongs to both a country and the continent it occupies.", ["Greenland", "Madagascar", "Iceland", "Japan"], "Australia is a country that occupies the mainland of the Australian continent."],
    ["Kenya", "The equator crosses this East African country.", ["France", "Canada", "New Zealand", "Portugal"], "Kenya sits on the equator and has coast on the Indian Ocean."],
    ["Chile", "This long, narrow country follows the Pacific coast of South America.", ["Uruguay", "Brazil", "Suriname", "Ecuador"], "Chile runs along South America's western edge between the Andes and Pacific."],
    ["Madagascar", "This large island country lies east of mainland Africa.", ["Iceland", "Cuba", "Sri Lanka", "Ireland"], "Madagascar sits in the Indian Ocean across the Mozambique Channel from Africa."],
    ["Iceland", "This volcanic island country lies in the North Atlantic between Greenland and Europe.", ["Nepal", "Laos", "Hungary", "Botswana"], "Iceland was formed by volcanoes along the Mid-Atlantic Ridge."],
    ["Greenland", "This Arctic land is the world's largest island that is not a continent.", ["Borneo", "New Guinea", "Madagascar", "Great Britain"], "Greenland is geographically part of North America and is an autonomous territory within Denmark's kingdom."],
    ["Nepal", "Mount Everest rises on the border of this country and China.", ["Italy", "Egypt", "Ghana", "Argentina"], "Nepal lies in the Himalayas between India and China."],
    ["India", "This large South Asian country has a peninsula pointing into the Indian Ocean.", ["Sweden", "Peru", "Algeria", "Canada"], "India occupies most of the Indian subcontinent in South Asia."],
    ["China", "This East Asian country borders Mongolia, India, and many other countries.", ["Brazil", "Spain", "Nigeria", "Australia"], "China has one of the world's longest land borders and fourteen land neighbors."],
    ["France", "Paris is the capital of this country in Western Europe.", ["Belgium", "Italy", "Spain", "Germany"], "Paris stands on the River Seine in France."],
    ["Mexico", "This North American country lies between the United States and Guatemala.", ["Colombia", "Portugal", "Morocco", "Thailand"], "Mexico connects the United States with Central America."],
    ["Panama", "A famous canal crosses this Central American country and links two oceans.", ["Bolivia", "Finland", "Ethiopia", "Lebanon"], "The Panama Canal connects the Atlantic and Pacific oceans."],
    ["New Zealand", "This country in Oceania has two main islands called North Island and South Island.", ["Japan", "Philippines", "Fiji", "Indonesia"], "New Zealand's two main islands are separated by Cook Strait."],
    ["Morocco", "This country sits in northwestern Africa, close to Spain across the Strait of Gibraltar.", ["Kenya", "Angola", "Mozambique", "Somalia"], "Morocco has coasts on both the Atlantic Ocean and Mediterranean Sea."],
    ["South Africa", "Cape Agulhas, Africa's southernmost point, is in this country.", ["Egypt", "Tunisia", "Senegal", "Eritrea"], "Cape Agulhas is south of the better-known Cape of Good Hope."],
    ["Argentina", "This South American country shares the long Andes border with Chile.", ["Brazil", "Guyana", "Venezuela", "Ecuador"], "The Andes form much of the boundary between Argentina and Chile."],
    ["Peru", "The ancient Inca city of Machu Picchu is in this country.", ["Mexico", "Greece", "India", "Egypt"], "Machu Picchu stands high in the Andes of Peru."],
    ["Bolivia", "This landlocked South American country contains part of Lake Titicaca.", ["Uruguay", "Chile", "Guyana", "Suriname"], "Bolivia shares Lake Titicaca with Peru but has no ocean coast."],
    ["Switzerland", "This landlocked European country is famous for high Alps and borders France, Italy, Germany, Austria, and Liechtenstein.", ["Denmark", "Ireland", "Portugal", "Iceland"], "Switzerland lies in central Europe and has no coastline."],
    ["Mongolia", "This landlocked country lies between Russia and China.", ["Vietnam", "Turkey", "Pakistan", "Nepal"], "Mongolia sits in East and Central Asia between two much larger neighbors."],
    ["Saudi Arabia", "Most of the Arabian Peninsula belongs to this country.", ["Jordan", "Oman", "Qatar", "Lebanon"], "Saudi Arabia occupies most of the Arabian Peninsula."],
    ["Antarctica", "This icy continent has no countries and no permanent native population.", ["Europe", "Asia", "Africa", "South America"], "Antarctica is governed through international agreements rather than divided into countries."],
    ["Pacific Ocean", "This is Earth's largest and deepest ocean.", ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Southern Ocean"], "The Pacific covers more area than all of Earth's land combined."],
    ["Sahara", "This is the world's largest hot desert, covering much of North Africa.", ["Gobi", "Kalahari", "Atacama", "Mojave"], "The Sahara stretches across many countries in northern Africa."],
    ["Amazon River basin", "This huge South American region holds the world's largest tropical rainforest.", ["Siberia", "Sahara", "Alps", "Great Plains"], "The Amazon basin drains a vast area of northern South America."],
    ["Andes", "This mountain chain follows the western side of South America.", ["Alps", "Himalayas", "Rockies", "Urals"], "The Andes form the world's longest continental mountain range."],
    ["Great Barrier Reef", "This enormous coral reef system lies off northeastern Australia.", ["Grand Canyon", "Serengeti", "Gobi Desert", "Alps"], "The Great Barrier Reef runs along the coast of Queensland, Australia."],
    ["Caribbean", "Cuba, Jamaica, and Puerto Rico are islands in this region.", ["Baltic", "Arctic", "Himalayas", "Sahara"], "The Caribbean includes the Caribbean Sea and its many islands."],
    ["Mediterranean Sea", "This sea lies between Europe, Africa, and Asia.", ["Bering Sea", "Coral Sea", "North Sea", "Tasman Sea"], "The Mediterranean is almost enclosed by three continents and connects to the Atlantic." ]
  ].map(([answer, clue, distractors, explanation]) => ({ answer, clue, distractors, explanation, subject: answer, kind: "world", sourceLabel: answer.includes("Ocean") || answer.includes("Sea") ? "CIA World Factbook" : "United Nations and CIA World Factbook", sourceUrl: answer === "Antarctica" ? UN : CIA }));
  window.TRIVIA_BUILDER.expandClues("world", 143, facts);
}());
