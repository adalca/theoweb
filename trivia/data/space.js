(function () {
  "use strict";
  const NASA = "https://science.nasa.gov/";
  const facts = [
    ["Mercury", "This is the closest planet to the Sun.", ["Venus", "Earth", "Mars", "Jupiter"], "Mercury circles the Sun faster than any other planet."],
    ["Venus", "This is the hottest planet, even though Mercury is closer to the Sun.", ["Mercury", "Mars", "Jupiter", "Neptune"], "Venus's thick carbon-dioxide atmosphere traps enormous amounts of heat."],
    ["Earth", "This planet has liquid oceans and is our home.", ["Mars", "Venus", "Saturn", "Uranus"], "Earth is the only world known to support life."],
    ["Mars", "Iron minerals give this planet its rusty red color.", ["Neptune", "Venus", "Saturn", "Mercury"], "Mars is often called the Red Planet because iron in its rocks has rusted."],
    ["Jupiter", "This is the largest planet in our solar system.", ["Saturn", "Neptune", "Earth", "Mars"], "More than 1,300 Earths could fit inside Jupiter by volume."],
    ["Saturn", "This giant planet is famous for bright rings made mostly of ice and rock.", ["Mars", "Venus", "Mercury", "Earth"], "All four giant planets have rings, but Saturn's are the most visible."],
    ["Uranus", "This planet spins tipped almost completely onto its side.", ["Earth", "Mars", "Jupiter", "Mercury"], "Uranus may have been knocked sideways by a giant collision long ago."],
    ["Neptune", "This is the farthest major planet from the Sun.", ["Uranus", "Saturn", "Jupiter", "Mars"], "Neptune takes about 165 Earth years to orbit the Sun."],
    ["The Sun", "This star supplies almost all the light and heat used by life on Earth.", ["The Moon", "Mars", "Polaris", "Venus"], "The Sun is a medium-sized star at the center of our solar system."],
    ["The Moon", "This world orbits Earth about once every 27 days.", ["The Sun", "Mars", "Titan", "Venus"], "The Moon is Earth's only natural satellite."],
    ["Gravity", "This force pulls a launched rocket back toward Earth.", ["Magnetism", "Sound", "Sunlight", "Friction"], "A rocket needs enough upward thrust to overcome gravity."],
    ["Thrust", "This pushing force from a rocket's engines sends it upward.", ["Shadow", "Orbit", "Crater", "Gravity"], "Hot, fast exhaust shoots backward and produces forward thrust."],
    ["Fuel and oxidizer", "A rocket carries these together so its engine can burn even where there is no air.", ["Coal and water", "Sand and wind", "Wood and oxygen from space", "Only batteries"], "Rocket propellant includes fuel plus an oxidizer that supplies oxygen for burning."],
    ["To become lighter", "A multistage rocket drops an empty stage mainly for this reason.", ["To make more smoke", "To turn around", "To land sooner", "To become louder"], "Dropping empty tanks means later engines have less mass to push."],
    ["A launchpad", "Rockets usually begin their flights from this specially prepared place.", ["A runway", "A harbor", "A train station", "A cave"], "Launchpads support, fuel, and safely release rockets."],
    ["A spacesuit", "An astronaut wears this to get oxygen and protection outside a spacecraft.", ["A raincoat", "A parachute only", "A wetsuit", "A winter scarf"], "A spacesuit acts like a tiny personal spacecraft around the astronaut."],
    ["The International Space Station", "Astronauts from many countries have lived and worked aboard this orbiting laboratory.", ["Hubble Telescope", "Voyager 1", "Apollo 11", "James Webb Telescope"], "The ISS circles Earth roughly every 90 minutes."],
    ["Apollo 11", "This mission first landed people on the Moon in 1969.", ["Voyager 1", "Artemis I", "Gemini 4", "Skylab"], "Neil Armstrong and Buzz Aldrin walked on the Moon during Apollo 11."],
    ["Neil Armstrong", "This astronaut became the first person to step onto the Moon.", ["Yuri Gagarin", "Sally Ride", "Mae Jemison", "John Glenn"], "Neil Armstrong stepped onto the lunar surface on July 20, 1969."],
    ["Yuri Gagarin", "This cosmonaut became the first person to travel into space.", ["Neil Armstrong", "John Glenn", "Chris Hadfield", "Buzz Aldrin"], "Yuri Gagarin orbited Earth once aboard Vostok 1 in 1961."],
    ["Sally Ride", "This astronaut became the first American woman in space.", ["Valentina Tereshkova", "Mae Jemison", "Eileen Collins", "Katherine Johnson"], "Sally Ride flew aboard space shuttle Challenger in 1983."],
    ["Mae Jemison", "This astronaut became the first Black woman to travel in space.", ["Sally Ride", "Christina Koch", "Peggy Whitson", "Eileen Collins"], "Mae Jemison flew aboard space shuttle Endeavour in 1992."],
    ["A satellite", "This object travels in an orbit around a planet or another body.", ["A crater", "A volcano", "A runway", "A spacesuit"], "Moons are natural satellites; people also build artificial satellites."],
    ["An orbit", "This is the curved path one object follows around another in space.", ["A launchpad", "A crater", "A galaxy", "An asteroid belt"], "An orbit happens when forward motion and gravity balance."],
    ["A comet", "This icy object can grow a glowing coma and tails when it nears the Sun.", ["A planet", "A galaxy", "A spacesuit", "A launch tower"], "Sunlight warms a comet and releases gas and dust that form tails."],
    ["An asteroid", "This rocky or metallic object is smaller than a planet and orbits the Sun.", ["A star", "A moon phase", "A nebula", "A spacesuit"], "Many asteroids orbit between Mars and Jupiter."],
    ["A meteor", "This is the streak of light made when a space rock heats up in Earth's atmosphere.", ["A moon", "A planet", "A satellite dish", "A sunspot"], "People often call a meteor a shooting star, although it is not a star."],
    ["A meteorite", "This is a piece of space rock that survives the atmosphere and reaches the ground.", ["A comet tail", "A moonbeam", "A cloud", "A satellite signal"], "A meteoroid becomes a meteor in the sky and a meteorite if it lands."],
    ["The Milky Way", "Our solar system is inside this galaxy.", ["Andromeda", "Orion Nebula", "Large Magellanic Cloud", "Sombrero Galaxy"], "The Milky Way is a barred spiral galaxy containing billions of stars."],
    ["A galaxy", "This is an enormous collection of stars, gas, dust, and dark matter held together by gravity.", ["A planet", "A crater", "A spacesuit", "A launchpad"], "Galaxies can contain millions, billions, or even trillions of stars."],
    ["A light-year", "Astronomers use this unit to measure very large distances, not time.", ["A kilogram", "A degree", "A liter", "A minute"], "A light-year is the distance light travels in one year."],
    ["A black hole", "Gravity is so strong around this object that beyond a boundary even light cannot escape.", ["A comet", "A moon", "A nebula", "An asteroid"], "The no-return boundary around a black hole is called the event horizon."],
    ["A nebula", "This giant cloud of gas and dust in space can be a place where stars form.", ["A crater", "An eclipse", "A rocket stage", "A moon phase"], "Some nebulae are stellar nurseries where new stars are born."],
    ["A solar eclipse", "This happens when the Moon passes between Earth and the Sun.", ["A lunar eclipse", "A meteor shower", "An aurora", "A solstice"], "During a solar eclipse, the Moon's shadow falls on part of Earth."],
    ["A lunar eclipse", "This happens when Earth passes between the Sun and the Moon.", ["A solar eclipse", "A comet", "A moon landing", "A rocket launch"], "During a lunar eclipse, Earth's shadow darkens the Moon."],
    ["The James Webb Space Telescope", "This large observatory studies the universe mainly in infrared light from far beyond Earth's atmosphere.", ["International Space Station", "Voyager 2", "Apollo 11", "Curiosity rover"], "Webb observes early galaxies, stars, planets, and atmospheres from a point beyond the Moon." ]
  ].map(([answer, clue, distractors, explanation]) => ({ answer, clue, distractors, explanation, subject: answer, kind: "space", sourceLabel: "NASA Science", sourceUrl: NASA }));
  window.TRIVIA_BUILDER.expandClues("space", 143, facts);
}());
