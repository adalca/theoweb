(function () {
  "use strict";
  const OFFICIAL = "https://www.alexmilway.com/book-series/hotel-flamingo/";
  const facts = [
    ["Anna Dupont", "Who inherits the run-down Hotel Flamingo?", ["Lemmy", "T. Bear", "Madame Le Pig", "Ronald Ruffian"], "Anna decides to bring the once-grand hotel back to life."],
    ["A bear", "What kind of animal is T. Bear?", ["A lemur", "A pig", "A giraffe", "A mouse"], "T. Bear is the hotel's loyal doorman."],
    ["A lemur", "What kind of animal is Lemmy, the receptionist?", ["A lion", "A penguin", "A sheepdog", "A pigeon"], "Lemmy helps Anna welcome and look after guests."],
    ["The doorman", "What is T. Bear's main job at Hotel Flamingo?", ["The chef", "The lift operator", "The gardener", "The hotel inspector"], "T. Bear greets arrivals at the door and helps wherever he can."],
    ["The receptionist", "What is Lemmy's main hotel job?", ["The chef", "The plumber", "The band leader", "The rival owner"], "Lemmy works at the front desk and helps guests."],
    ["A giraffe", "What kind of animal is Stella, the hotel's handywoman?", ["A flamingo", "A lion", "A warthog", "A rabbit"], "Stella Giraffe uses her height and practical skills to repair the hotel."],
    ["The chef", "What job does Madame Le Pig do?", ["The doorman", "The detective", "The inspector", "The singer"], "Madame Le Pig runs the kitchen with great skill and a fiery temper."],
    ["A mouse", "What kind of animal is Squeak, the lift operator?", ["A bear", "A penguin", "A chameleon", "A zebra"], "Small Squeak operates the hotel's lift."],
    ["The Glitz", "What is the name of Ronald Ruffian's rival hotel?", ["The Sunshine", "The Royal Nest", "The Pink Palace", "The Grand Giraffe"], "The fancy Glitz stands across Animal Boulevard from Hotel Flamingo."],
    ["A lion", "What kind of animal is rival hotel owner Ronald Ruffian?", ["A bear", "A lemur", "A giraffe", "A flamingo"], "Ronald Ruffian owns the Glitz and dislikes Hotel Flamingo's success."],
    ["Flamingos", "Which birds help put on a spectacular show for Hotel Flamingo's grand reopening?", ["Penguins", "Owls", "Parrots", "Pigeons"], "Ms. Fragranti and her flamingos bring music, color, and excitement."],
    ["Mr. Roachford", "Who arrives to inspect Hotel Flamingo in the first book?", ["King Penguin", "Mac Macaw", "Alfonso Fastbeak", "Mr. Ruffian"], "The inspection becomes a crucial test for Anna and her new team."],
    ["Animal Boulevard", "On what street are Hotel Flamingo and the Glitz located?", ["Penguin Parade", "Jungle Road", "Sunshine Street", "Carnival Avenue"], "Animal Boulevard is home to many animal businesses and hotels."],
    ["King and Queen Penguin", "Which royal guests choose Hotel Flamingo during Holiday Heatwave?", ["King and Queen Lion", "Prince and Princess Parrot", "Duke and Duchess Dog", "Lord and Lady Llama"], "The penguin royals need special care during extremely hot weather."],
    ["A heatwave", "What makes caring for penguin guests especially difficult in the second story?", ["A snowstorm", "A flood", "An earthquake", "A sandstorm"], "The blazing heat causes an ice shortage and makes the hotel hard to cool."],
    ["Mr. Camou", "Which colorful guest is secretly helping Ronald Ruffian in Holiday Heatwave?", ["Mrs. Bamba", "Ms. Rathbone", "Mr. Kunkworth", "Wilbur"], "Mr. Camou is a chameleon who can hide by blending into his surroundings."],
    ["A chameleon", "What kind of animal is Mr. Camou?", ["A rat", "A zebra", "A meerkat", "A warthog"], "His color-changing camouflage helps him hide while causing trouble."],
    ["The air conditioning", "What hotel system is sabotaged during Holiday Heatwave?", ["The lift", "The front door", "The kitchen clock", "The fountain"], "Cut wires make it difficult to keep every kind of guest comfortable."],
    ["A surprise birthday party", "What does King Penguin plan for Queen Penguin?", ["A treasure hunt", "A soccer match", "A boat race", "A cooking lesson"], "The hotel prepares a special terrace celebration for the queen."],
    ["The penguin chicks", "Who enjoys sliding on the accidentally bubbly red carpet?", ["The warthogs", "The flamingo quartet", "The zebra parents", "The meerkats"], "The royal chicks turn an embarrassing cleaning mistake into fun."],
    ["Ronnie Rathbone", "Which rat guest is wrongly suspected before the real saboteur is found?", ["Stella Giraffe", "Ms. Fragranti", "Mrs. Bamba", "Madame Le Pig"], "Anna learns not to judge someone too quickly from appearances."],
    ["Carnival", "What big autumn celebration is at the center of Carnival Caper?", ["A space launch", "A royal wedding", "A winter race", "A cooking contest"], "Animal Boulevard's businesses build floats for the annual procession."],
    ["The Glitz", "Which hotel has won the carnival display prize year after year?", ["Hotel Flamingo", "The Bear's Den", "The Parrot Palace", "The Cozy Cave"], "Anna hopes Hotel Flamingo can finally beat its polished rival."],
    ["Heavy rain and wind", "What weather threatens the carnival procession?", ["A heatwave", "Deep snow", "Thick fog", "A drought"], "The rainy season arrives early with high winds and torrential rain."],
    ["The Nocturnal Animals", "What is the name of the famous band secretly staying at the hotel?", ["The Flamingo Four", "The Jungle Jammers", "The Penguin Players", "The Roaring Lions"], "The band's nighttime habits make secrecy and sleep difficult."],
    ["At night", "When does the band called the Nocturnal Animals naturally want to rehearse?", ["At breakfast", "At noon", "At sunrise", "Only in winter"], "Nocturnal animals are active at night, which is awkward in a hotel full of sleeping guests."],
    ["Wilbur", "Which homeless sheepdog needs a place to stay and a fresh start?", ["Mac Macaw", "Mr. Camou", "Alfonso Fastbeak", "Peston Crumbletart"], "Anna believes Wilbur deserves kindness and a chance to help."],
    ["Skunks", "What kind of animals are Mr. and Mrs. Kunkworth?", ["Parrots", "Penguins", "Warthogs", "Otters"], "The Kunkworths are anxious guests who have their own special needs."],
    ["Mac Macaw", "Which confident parrot visits in Carnival Caper?", ["Wilbur", "T. Bear", "Squeak", "Mr. Camou"], "Mac Macaw is much less nervous than the Kunkworths."],
    ["A cooking contest", "What idea does Anna use to attract guests in Fabulous Feast?", ["A rocket show", "A soccer cup", "A dinosaur dig", "A truck parade"], "The Battle of the Chefs turns the hotel into a live food event."],
    ["Battle of the Chefs", "What is the name of the big food competition in Fabulous Feast?", ["Carnival Caper", "Royal Ice Race", "Animal Cup", "Boulevard Bake-Off"], "Three talented chefs compete while guests enjoy a feast."],
    ["Madame Le Pig", "Who represents Hotel Flamingo in the cooking competition?", ["Lemmy", "T. Bear", "Anna", "Stella"], "The team's own chef must find confidence when cooking takes center stage."],
    ["Peston Crumbletart", "Which chef comes from the Fat Cat restaurant?", ["Laurence Toot-Toot", "Madame Le Pig", "Ronald Ruffian", "Alfonso Fastbeak"], "Peston Crumbletart is one of Madame Le Pig's contest rivals."],
    ["Laurence Toot-Toot", "Which chef represents the Glitz in the cooking contest?", ["Peston Crumbletart", "Madame Le Pig", "Lemmy", "Mac Macaw"], "Laurence Toot-Toot cooks for Hotel Flamingo's grand rival."],
    ["A stunt pigeon", "What kind of animal is record-chasing Alfonso Fastbeak?", ["A chef pig", "A hotel bear", "A singing owl", "A dancing flamingo"], "Alfonso crashes onto the hotel roof while practicing a stunt."],
    ["An octopus", "What kind of animal is flamboyant guest Simon Suckerlot?", ["A giraffe", "A lion", "A mouse", "A sheepdog"], "An octopus guest brings eight arms' worth of changing needs." ]
  ];
  const openings = [
    (q) => q,
    (q) => `Hotel Flamingo memory test: ${q}`,
    (q) => `Think about the first four Hotel Flamingo stories. ${q}`,
    (q) => `Which choice completes this story fact? ${q}`
  ];
  const raw = [];
  facts.forEach(([answer, question, distractors, explanation]) => openings.forEach((opening) => raw.push({ question: opening(question), answer, distractors, explanation, sourceLabel: "Alex Milway: Hotel Flamingo series", sourceUrl: OFFICIAL })));
  window.TRIVIA_BUILDER.addTopic("stories", 142, raw);
}());
