(function () {
  const PD = "https://creativecommons.org/publicdomain/mark/1.0/";
  const photo = (slug, file, artist, license, licenseUrl, alt) => ({
    src: `../assets/images/trucks/${slug}.webp`,
    alt,
    artist,
    license,
    licenseUrl,
    page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replace(/%20/g, "_")}`
  });

  window.TRUCK_IMAGES = {
    "excavator": photo("excavator", "Excavator Postiguet Beach 2.jpg", "kallerna", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "A yellow excavator digging on a beach"),
    "bulldozer": photo("bulldozer", "CatD9T.jpg", "Shaun Greiner", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "A huge yellow bulldozer with a wide front blade"),
    "dump-truck": photo("dump-truck", "Freightliner M2 106 6x4 2014 (14240376744).jpg", "order_242", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "A white dump truck with its bed raised"),
    "front-end-loader": photo("front-end-loader", "Front end loader 2.jpg", "Wikideas1", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/", "A yellow front-end loader carrying a full bucket"),
    "backhoe": photo("backhoe", "Backhoe loader Cat420E left.jpg", "Shaun Greiner", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "A yellow backhoe loader seen from the side"),
    "skid-steer-loader": photo("skid-steer-loader", "Bobcat S650 skid steer loader (15084521732).jpg", "Bob Adams", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "A compact white skid-steer loader at work"),
    "cement-mixer": photo("cement-mixer", "Concrete mixer.jpg", "LordReco", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "A concrete mixer truck with a huge white turning drum driving through a busy city"),
    "concrete-pump-truck": photo("concrete-pump-truck", "Concrete boom pump.jpg", "Wikideas1", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/", "A concrete pump truck with its long boom unfolded"),
    "mobile-crane": photo("mobile-crane", "20100225-Liebherr LTM 1200-5.jpg", "K. Krallis", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0", "A large yellow mobile crane lifting with its boom"),
    "asphalt-paver": photo("asphalt-paver", "AF-asphalt-laying-machine.jpg", "Unknown photographer", "Public domain", PD, "An asphalt paver laying a fresh road surface"),
    "fire-engine": photo("fire-engine", "Dublin Fire Brigade Pump Ladder D32.jpg", "William Murphy", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "A bright red fire engine parked on a city street"),
    "ladder-truck": photo("ladder-truck", "Ferrara fire engine ladder truck (extended) downtown St. Johnsbury VT April 2019.jpg", "Artaxerxes", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "A red ladder truck with its long ladder raised into the sky"),
    "ambulance": photo("ambulance", "Stockholm, ambulans, 2014, 21.jpg", "AleWi", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "A yellow and green ambulance on a city street"),
    "police-car": photo("police-car", "Washington DC Metropolitan Police Department Dodge Charger No. 1605.jpg", "Raymond Wambsgans", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "A marked police patrol car parked outdoors"),
    "heavy-rescue-truck": photo("heavy-rescue-truck", "Sunnyvale Rescue Vehicle 42.jpg", "Yngvadottir", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "A large red and white heavy rescue truck"),
    "airport-crash-tender": photo("airport-crash-tender", "MAN Ziegler FLF 60-1 airport crash tender stuttgart airport 2.jpg", "Julian Herzog", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0", "A giant red airport fire truck with six wheels"),
    "garbage-truck": photo("garbage-truck", "LA-City-Sanitation-trash-truck-1.jpg", "Bdonjc", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "A blue city garbage truck driving on a neighborhood street"),
    "street-sweeper": photo("street-sweeper", "Street sweeper in Minneapolis neighborhood University.jpg", "Fibonacci Blue", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "A street sweeper using its brushes beside the curb"),
    "snowplow": photo("snowplow", "TowPLow front view2.JPG", "SnowKing1", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0", "A large orange highway snowplow with two blades"),
    "tow-truck": photo("tow-truck", "Bois d'Arc Bash 2016 43 (parade).jpg", "Michael Barera", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "A shiny heavy tow truck at a parade"),
    "bucket-truck": photo("bucket-truck", "Replacing an advertising poster in London using an articulated platform 02.JPG", "Philafrenzy", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "A bucket truck lifting workers high above a London street"),
    "school-bus": photo("school-bus", "IC CE school bus (shortened chassis).jpg", "Atomic Taco", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "A bright yellow school bus seen from the front and side"),
    "semi-truck": photo("semi-truck", "Peterbilt 359 Classic (1977) pic2.JPG", "Alf van Beem", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/", "A polished classic blue semi-truck with a long trailer"),
    "tanker-truck": photo("tanker-truck", "Cape Cod Oil truck.jpg", "Connor Williams", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "A red tanker truck carrying a shiny metal tank"),
    "car-carrier": photo("car-carrier", "Car carrier trailer 2.webp", "Wikideas1", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/", "A two-level car carrier loaded with cars"),
    "flatbed-truck": photo("flatbed-truck", "Tire Transport Truck (46038169192).jpg", "Chris Hunkeler", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "A flatbed truck carrying enormous mining tires"),
    "logging-truck": photo("logging-truck", "Logging truck.webp", "Wikideas1", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/", "A logging truck carrying a full load of tree trunks"),
    "mining-haul-truck": photo("mining-haul-truck", "Liebherr t282 1.jpg", "René Engel", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "A gigantic yellow mining haul truck beside much smaller vehicles"),
    "farm-tractor": photo("farm-tractor", "Ford 8N.jpg", "Mulad", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "A classic red and gray farm tractor in a field"),
    "combine-harvester": photo("combine-harvester", "Corn combine harvest with grain cart-4.jpg", "Wikideas1", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/", "A combine harvester gathering corn beside a tractor"),
    "forklift": photo("forklift", "Container loading with forklift at warehouse in Thailand.jpg", "Goterrestrial", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0", "A forklift moving a load beside a shipping container"),
    "feller-buncher": photo("feller-buncher", "Feller buncher-4.jpg", "Wikideas1", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/", "A tracked feller buncher working among tall trees"),
    "monster-truck": photo("monster-truck", "Superman monster truck.jpg", "thomascrenshaw", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "A colorful monster truck jumping high in an arena"),
    "ice-cream-truck": photo("ice-cream-truck", "Hollywood Cone Ice Cream Truck 1.jpg", "Joekelsey", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0", "A colorful ice cream truck shaped like a giant cone"),
    "aircraft-deicer": photo("aircraft-deicer", "Deicing Open Skies (16494528206).jpg", "U.S. Air Force", "Public domain", PD, "An aircraft deicing truck spraying a large airplane"),
    "crawler-transporter": photo("crawler-transporter", "Crawler-Transporter.jpg", "NASA", "Public domain", PD, "NASA's enormous crawler-transporter beside cars and people that look tiny")
  };

  if (window.TRUCKS) window.TRUCKS.forEach((item) => { item.image = window.TRUCK_IMAGES[item.slug]; });
})();
