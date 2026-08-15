(function () {
  "use strict";
  const CHARACTERS = "https://www.bluey.tv/characters/";
  const SEASON_ONE = "https://www.bluey.tv/watch/season-1/";
  const SEASON_TWO = "https://www.bluey.tv/watch/season-2/";
  const SEASON_THREE = "https://www.bluey.tv/watch/season-3/";
  const facts = [
    ["Blue Heeler", "What breed of dog is Bluey?", ["Red Heeler", "Dalmatian", "Border Collie", "Beagle"], "Bluey is a Blue Heeler pup who loves inventing games.", CHARACTERS],
    ["Red Heeler", "What breed of dog is Bingo?", ["Blue Heeler", "Poodle", "Kelpie", "Dachshund"], "Bingo is Bluey's younger Red Heeler sister.", CHARACTERS],
    ["Bandit", "What is the name of Bluey and Bingo's dad?", ["Stripe", "Pat", "Mort", "Rad"], "Bandit is an archaeologist who loves playing games with his girls.", CHARACTERS],
    ["Chilli", "What is the name of Bluey and Bingo's mum?", ["Trixie", "Frisky", "Brandy", "Wendy"], "Chilli loves hockey and is just as ready to play as Bandit.", CHARACTERS],
    ["Muffin", "Which cousin is Socks's older sister?", ["Bingo", "Chloe", "Coco", "Judo"], "Muffin and Socks are the daughters of Uncle Stripe and Aunt Trixie.", CHARACTERS],
    ["Socks", "Which of Bluey's cousins first moves around on all fours like a very young puppy?", ["Muffin", "Bingo", "Chloe", "Indy"], "The family watches Socks grow, walk upright, and learn to talk.", CHARACTERS],
    ["Calypso", "What is the name of Bluey's teacher?", ["Frisky", "Wendy", "Trixie", "Bella"], "Calypso gently guides the games and stories at Bluey's school.", CHARACTERS],
    ["Chloe", "Which Dalmatian is Bluey's best friend?", ["Coco", "Honey", "Indy", "Judo"], "Bluey and Chloe love making up games together.", CHARACTERS],
    ["Rusty", "Which Red Kelpie loves playing Army and cricket?", ["Mackenzie", "Snickers", "Winton", "Jack"], "Rusty often turns his family experiences into imaginative games.", CHARACTERS],
    ["Mackenzie", "Which Border Collie friend moved to Australia from New Zealand?", ["Rusty", "Lucky", "Honey", "Pretzel"], "Mackenzie's family comes from New Zealand.", CHARACTERS],
    ["Snickers", "Which of Bluey's friends is a long little Dachshund?", ["Winton", "Coco", "Lucky", "Jack"], "Snickers sometimes finds his short legs useful—and sometimes tricky.", CHARACTERS],
    ["Coco", "Which pink Poodle plays Shadowlands with Bluey and Snickers?", ["Chloe", "Indy", "Honey", "Judo"], "Coco learns that following the rules can make a game more fun.", CHARACTERS],
    ["Magic Xylophone", "In which episode can Bluey and Bingo freeze Dad in place?", ["Keepy Uppy", "Taxi", "The Weekend", "Markets"], "The magic xylophone freezes whoever is struck by its musical power.", SEASON_ONE],
    ["A balloon", "What must the family keep off the floor in Keepy Uppy?", ["A beach ball", "A feather", "A paper plane", "A bubble"], "Dad makes the balloon game much harder when he joins in.", SEASON_ONE],
    ["A walking leaf insect", "What special creature does Bingo discover during The Weekend?", ["A blue butterfly", "A stick insect", "A frog", "A ladybug"], "Bingo wants Dad to notice the beautiful insect, but he is caught up in the game.", SEASON_ONE],
    ["Capsicums", "What does Bingo collect for the side salad in BBQ?", ["Apples", "Carrots", "Potatoes", "Mushrooms"], "Bingo keeps fetching different-colored capsicums while everyone else relaxes.", SEASON_ONE],
    ["Bob Bilby", "Which kindy puppet comes home with Bingo for the weekend?", ["Unicorse", "Chattermax", "Bartlebee", "Turtleboy"], "The family puts down its screens to give Bob Bilby a memorable visit.", SEASON_ONE],
    ["A stressed businessman", "Who is Bluey's first passenger when she runs a taxi service?", ["A sleepy queen", "A zoo keeper", "A chef", "A doctor"], "Dad plays a businessman who is desperate to reach the airport.", SEASON_ONE],
    ["Janet and Rita", "What granny names do Bluey and Bingo usually use?", ["Gladys and Madge", "Betty and Sue", "Edna and Doris", "Nana and Frisky"], "Bluey plays Janet and Bingo plays Rita in their famous granny game.", SEASON_ONE],
    ["Jean Luc", "Which friend does Bluey meet while camping?", ["Jack", "Rusty", "Lucky", "Winton"], "Bluey and Jean Luc become friends even though they speak different languages.", SEASON_ONE],
    ["The floss", "Which dance does Bluey try to prove that grannies can do?", ["The tango", "The moonwalk", "The waltz", "The twist"], "Bluey teaches Nana the floss to settle the great granny debate.", SEASON_ONE],
    ["Her last chip", "What does Dad eat that leads Bingo to receive three Dance Mode turns?", ["Her ice cream", "Her banana", "Her sausage", "Her cupcake"], "Bingo is promised three chances to make Mum or Dad dance as payback.", SEASON_TWO],
    ["Everything becomes heavy", "What magic power does Bingo's feather have in Featherwand?", ["Everything becomes tiny", "Everyone freezes", "Objects disappear", "People can fly"], "When Bingo says 'heavy,' even ordinary objects become impossible to lift.", SEASON_TWO],
    ["Bingo", "Whose dream takes us through space in Sleepytime?", ["Bluey", "Muffin", "Socks", "Chilli"], "Bingo dreams of planets while trying to stay in her own bed all night.", SEASON_TWO],
    ["Jack", "Which new friend joins Rusty's game in Army?", ["Winton", "Snickers", "Lucky", "Mackenzie"], "Rusty helps Jack discover that he can listen and remember during their game.", SEASON_TWO],
    ["A dream house", "What do Bluey and Bingo imagine building to escape from Mum and Dad?", ["A submarine", "A rocket", "A castle", "A treehouse"], "The children's amazing dream house keeps growing as their escape plan gets bigger.", SEASON_TWO],
    ["The cardboard packaging", "What do Bluey and Bingo transform into a changing world in Flat Pack?", ["A pile of leaves", "A blanket", "Building blocks", "Mud"], "Each piece of flat-pack rubbish becomes part of a new pretend world.", SEASON_TWO],
    ["Mort", "What is the real name of Chilli's dad, Grandad?", ["Bob", "Pat", "Stripe", "Radley"], "Mort loves bushwalking, canoeing, and curried sausages.", CHARACTERS],
    ["Bartlebee", "Which new toy does Bluey introduce to the family in Christmas Swim?", ["Bob Bilby", "Turtleboy", "Chattermax", "Floppy"], "Bluey wants Bartlebee's first Heeler Christmas to go perfectly.", SEASON_TWO],
    ["Rad and Frisky", "Which pair meet while babysitting Bluey and Bingo?", ["Stripe and Trixie", "Pat and Janelle", "Mort and Chris", "Bob and Nana"], "Uncle Rad and Frisky discover they have more in common than expected.", SEASON_TWO],
    ["A cheetah", "What animal does Bingo become after putting on her onesie?", ["A zebra", "A lion", "A penguin", "A gorilla"], "Bingo's cheetah onesie makes her race wildly through the house.", SEASON_THREE],
    ["A video call", "How are Bluey, Bingo, Muffin, and Socks talking in Faceytalk?", ["Walkie-talkies", "A radio show", "Letters", "A school meeting"], "The cousins draw together on a family video call until Muffin refuses to share.", SEASON_THREE],
    ["Edamame beans", "What food must Bluey eat before she can have pavlova?", ["Broccoli", "Peas", "Carrots", "Pumpkin"], "Dad turns the kitchen into a restaurant and uses silly pretend French while serving the edamame.", SEASON_THREE],
    ["Lucky's Dad's rules", "Which rules remove the small prize from every layer in Pass the Parcel?", ["Bluey's rules", "Bingo's rules", "Muffin's rules", "Calypso's rules"], "Pat brings back the older version where only the final parcel holds the big prize.", SEASON_THREE],
    ["Muffin", "Who plays Grouchy Granny and bargains over the scooter in Granny Mobile?", ["Bluey", "Bingo", "Socks", "Nana"], "Muffin's grouchy character proves to be an expert negotiator.", SEASON_THREE],
    ["Rusty", "Which child is almost impossible for the dads to bowl out in Cricket?", ["Jack", "Bluey", "Lucky", "Mackenzie"], "Rusty's love of cricket grows through games with his family and friends.", SEASON_THREE]
  ];
  const openings = [
    (question) => question,
    (question) => `Bluey superfan check: ${question}`,
    (question) => `Think back to the show Bluey. ${question}`,
    (question) => `Which choice completes this Bluey fact? ${question}`
  ];
  const raw = [];
  facts.forEach(([answer, question, distractors, explanation, sourceUrl]) => openings.forEach((opening) => raw.push({
    question: opening(question), answer, distractors, explanation, sourceLabel: "Bluey official website", sourceUrl
  })));
  window.TRIVIA_BUILDER.addTopic("bluey", 143, raw);
}());
