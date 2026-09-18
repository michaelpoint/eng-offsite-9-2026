/* ============================================================
   Santa Cruz Offsite 2026 — afternoon sign-ups
   Vanilla JS. Sign-ups live in a Google Sheet, reached through the
   Apps Script web app in Code.gs. With ENDPOINT empty the page runs
   local-only. See README.md.
   ============================================================ */

/* ---------------- icons (inline, lucide-flavoured) ---------------- */
const S = p =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";

const ICON = {
    sun: S('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    beer: S('<path d="M6.5 4h11l-1.3 15.7a2.2 2.2 0 0 1-2.2 2h-4a2.2 2.2 0 0 1-2.2-2Z"/><path d="M6.9 9.2h10.2"/><path d="M10.6 12.6v5.2M13.4 12.6v5.2"/>'),
    coffee: S('<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"/><path d="M6 2v3M10 2v3M14 2v3"/>'),
    disc: S('<ellipse cx="12" cy="12" rx="9" ry="4.6"/><ellipse cx="12" cy="12" rx="4" ry="1.9"/>'),
    bike: S('<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M12 17.5 8.5 9l3-3 3 4h3"/>'),
    trees: S('<path d="M8 2 4 8h2.5L3.5 13H7l-2 4h10l-2-4h3.5L13.5 8H16L12 2"/><path d="M10 17v5M14 17v5"/>'),
    link: S('<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><path d="M8 12h8"/>'),
    fork: S('<path d="M5 2v6a2.5 2.5 0 0 0 5 0V2"/><path d="M7.5 10v12"/><path d="M17.5 2c-1.6 0-2.5 2.6-2.5 6s.9 4 2.5 4 2.5-.6 2.5-4-.9-6-2.5-6Z"/><path d="M17.5 12v10"/>'),
    check: S('<path d="M20 6 9 17l-5-5"/>'),
    cal: S('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    plus: S('<path d="M12 5v14M5 12h14"/>'),
    swap: S('<path d="M7 4 3 8l4 4"/><path d="M3 8h13a4 4 0 0 1 0 8h-1"/>'),
    wave: S('<path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>'),
    ext: S('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
    car: '<svg class="ico" viewBox="0 0 22 14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M2 10.2V7l2.2-4h9.6L18 7l2 .6v2.6"/><path d="M2 10.2h18"/><circle cx="6.5" cy="10.6" r="1.9"/><circle cx="15.5" cy="10.6" r="1.9"/></svg>'
};

/* ---------------- content, ordered chillest first ---------------- */
const ACTIVITIES = [
    {
        id: "hang", n: 1, theme: "t-pool", icon: "sun", accent: "#06B6D4",
        title: "Hotel Hang & Beach Volleyball",
        tag: "No plan, nowhere to be. Pool, sand, and a volleyball game for whoever wants one.",
        badge: { text: "Volleyball optional", icon: "sun" },
        chill: 4, chillLabel: "horizontal by default",
        tags: ["chill"], cost: 0, drive: "0 min",
        /* the hotel is this pin, so it carries the basecamp ring and sub-label.
           Label runs leftward — anchored right it would spill off the chart. */
        pin: [636, 380], labelDx: -22, labelDy: -34, labelAnchor: "end",
        base: true, sub: "BASECAMP · SEACLIFF INN",
        /* the full title crowds card 2's label on the chart — the pin uses this instead */
        mapLabel: "Hotel Hang & Volleyball",
        notes: [
            "The no-plan option. Hang at the hotel, wander down to the beach. Nobody is going to tell you where to be.",
            "Pool, hot tub, lawn chairs, palm trees, and a bar and kitchen on site. No car, no plan.",
            "We'll rally a group to walk down to the beach to hang and play some casual volleyball. Net and ball are covered. Come play, come heckle, or skip it.",
            "FYI: the ocean is not at your feet at the hotel. Seacliff State Beach is a 15–20 minute walk downhill for actual sand.",
            "That walk goes right past Marianne's Ice Cream. Just thought you should know.",
            "Or skip all of it and have the single most glorious nap you will have all year."
        ],
        links: [
            ["the beach", "https://www.google.com/maps/search/?api=1&query=Seacliff+State+Beach+Aptos"],
            ["marianne's", "https://www.google.com/maps/search/?api=1&query=Marianne's+Ice+Cream+Aptos"]
        ],
        food: {
            lunch: [
                {
                    name: "Sevy's Bar + Kitchen",
                    desc: "The hotel's own kitchen. California plates, full bar.",
                    meta: "on site · never leave the property",
                    url: "https://www.google.com/maps/search/?api=1&query=Sevys+Bar+Kitchen+Seacliff+Inn+Aptos"
                },
                {
                    name: "Taqueria Los Gordos",
                    desc: "Tacos, burritos, aguas frescas. Nobody has ever eaten a taco stressed.",
                    meta: "3 min · open 9 to 7:30",
                    url: "https://www.google.com/maps/search/?api=1&query=Taqueria+Los+Gordos+Aptos"
                },
                {
                    name: "Sno-White Drive-In",
                    desc: "Retro burger and soft-serve stand, landmark sign.",
                    meta: "8 min walk up State Park Dr",
                    url: "https://www.google.com/maps/search/?api=1&query=Sno-White+Drive+In+Aptos"
                }
            ],
            dinner: [
                {
                    name: "Venus Spirits Cocktails & Kitchen",
                    desc: "Wednesday is fish tacos and house margaritas. Oyster happy hour 4 to 5.",
                    meta: "5 min · Rio Del Mar · opens at 4",
                    url: "https://www.google.com/maps/search/?api=1&query=Venus+Spirits+Cocktails+Kitchen+Beachside+Aptos"
                },
                {
                    name: "Sevy's Bar + Kitchen",
                    desc: "Stay exactly where you are. Live music some nights.",
                    meta: "on site · no driving, no plan",
                    url: "https://www.google.com/maps/search/?api=1&query=Sevys+Bar+Kitchen+Seacliff+Inn+Aptos"
                },
                {
                    name: "Sushi Garden",
                    desc: "Rolls, sashimi, teriyaki. Takeout-friendly, so eat by the pool.",
                    meta: "5 min · dinner 5 to 9",
                    url: "https://www.google.com/maps/search/?api=1&query=Sushi+Garden+Aptos+Rancho+Del+Mar"
                }
            ]
        },
        lead: "Lead: Rigo"
    },
    {
        id: "beer", n: 2, theme: "t-beer", icon: "beer", accent: "#D97706",
        title: "Beer Thirty & Cornhole",
        tag: "A slow lunch, a walk on the beach, then a cornhole bracket in a craft beer garden.",
        badge: { text: "Bracket play" },
        chill: 12, chillLabel: "beer in hand",
        tags: ["dine"], cost: 2, drive: "5 min drive",
        pin: [341, 345], labelDx: -108, labelDy: -12,
        notes: [
            "Cornhole bracket, teams drawn at random. Trophy TBD, glory guaranteed.",
            "Does Point have an official cornhole champion? No. Does it need one? Also no. Could it be you? Yes.",
            "Loose lunch first. Eat at the hotel, or walk over to Sno-White, the burger shack with the landmark sign, on the way down to the beach.",
            "Then an hour on the sand at Seacliff before we head over. Sit that out and keep your chair if you'd rather.",
            "Ping pong and darts if brackets aren't your thing, plus a wall of taps and a fridge of bottles. Choice paralysis is part of the experience.",
            "Cider, wine, and non-alcoholic options too. Nothing here requires drinking beer."
        ],
        links: [
            ["beer thirty", "http://www.beerthirtysantacruz.com/"],
            ["map", "https://www.google.com/maps/search/?api=1&query=Beer+Thirty+Bottle+Shop+Pour+House"]
        ],
        food: {
            lunch: [
                {
                    name: "Taqueria Los Gordos",
                    desc: "Counter tacos and burritos. Travels well, and outside food is welcome at the beer garden.",
                    meta: "near the hotel · open 9 to 7:30",
                    url: "https://www.google.com/maps/search/?api=1&query=Taqueria+Los+Gordos+Aptos"
                },
                {
                    name: "Zameen Mediterranean",
                    desc: "Wraps, bowls, salads. Grab it near the hotel on the way over.",
                    meta: "near the hotel · opens at noon",
                    url: "https://www.google.com/maps/search/?api=1&query=Zameen+Mediterranean+Aptos"
                },
                {
                    name: "Sno-White Drive-In",
                    desc: "Retro burger and soft-serve stand under a landmark sign. The walk is half the point.",
                    meta: "8 min walk up State Park Dr",
                    url: "https://www.google.com/maps/search/?api=1&query=Sno-White+Drive+In+Aptos"
                }
            ],
            dinner: [
                {
                    name: "Aptos St. BBQ",
                    desc: "Oak-smoked meats, 37 taps, live blues every night 6 to 8.",
                    meta: "back near the hotel · no more driving after",
                    url: "https://www.google.com/maps/search/?api=1&query=Aptos+St+BBQ+Aptos"
                },
                {
                    name: "Parish Publick House",
                    desc: "Village pub. Burgers, wings, and no trouble seating a big table.",
                    meta: "same block as the BBQ · open till 10",
                    url: "https://www.google.com/maps/search/?api=1&query=Parish+Publick+House+Aptos"
                },
                {
                    name: "Showtime Pizzeria",
                    desc: "Pizza after cornhole is the natural order of things. No reservations, so call a big order ahead.",
                    meta: "2 min from the hotel · till 8pm",
                    url: "https://www.google.com/maps/search/?api=1&query=Showtime+Pizzeria+Aptos"
                }
            ]
        },
        lead: "Lead: Pierce"
    },
    {
        id: "capitola", n: 3, theme: "t-capitola", icon: "coffee", accent: "#FB923C",
        title: "Capitola Village Walk",
        tag: "Coffee, a long wharf, and a village you can cross in ten minutes. No itinerary, by design.",
        badge: { text: "Pastel cottages & beach", icon: "coffee" },
        chill: 22, chillLabel: "flat and easy",
        tags: ["chill", "dine"], cost: 1, drive: "10 min drive",
        pin: [363, 407], labelDx: -118, labelDy: 22,
        cottages: ["#FBCFE8", "#FDE68A", "#A5F3FC", "#FDBA74", "#C7D2FE", "#99F6E4", "#FCA5A5"],
        notes: [
            "Oldest seaside resort town in California, and it looks it. Pastel cottages stacked against the sand.",
            "Coffee at Mr Toots, up the white staircase, balcony over the water.",
            "The wharf runs 855 feet into the bay. Otters, sea lions, mounted scopes. Walk to the end and the village disappears behind you.",
            "High tide is around lunch and drops all afternoon. Small sand at 1, real sand by 4.",
            "More than the beach: shops, the Mercantile arcade, live music at BrewTopia from 2.",
            "Split up, regroup, split up again. There is no plan, that's the plan. Carpool and pick a regroup spot, the lots fill fast."
        ],
        links: [
            ["mr toots", "https://www.google.com/maps/search/?api=1&query=Mr+Toots+Coffeehouse+Capitola"],
            ["walking map", "https://www.google.com/maps/search/?api=1&query=Capitola+Village"]
        ],
        food: {
            lunch: [
                {
                    name: "Gayle's Bakery",
                    desc: "Bakery, deli and rotisserie. Take a number, it's worth it.",
                    meta: "on Bay Ave, right on the way in",
                    url: "https://www.google.com/maps/search/?api=1&query=Gayles+Bakery+Rosticceria+Capitola"
                },
                {
                    name: "Pizza My Heart",
                    desc: "The original 1981 shop, right on the beach.",
                    meta: "in the village · takeout only",
                    url: "https://www.google.com/maps/search/?api=1&query=Pizza+My+Heart+Capitola+Village"
                },
                {
                    name: "Mr Toots Coffeehouse",
                    desc: "Up the white staircase, balcony over the water.",
                    meta: "in the village · 7am to 5pm",
                    url: "https://www.google.com/maps/search/?api=1&query=Mr+Toots+Coffeehouse+Capitola"
                }
            ],
            dinner: [
                {
                    name: "Zelda's on the Beach",
                    desc: "Beachfront since 1978. Chowder, poke, and a deck you can reach the sand from.",
                    meta: "in the village · dinner from 4:30",
                    url: "https://www.google.com/maps/search/?api=1&query=Zeldas+on+the+Beach+Capitola"
                },
                {
                    name: "The Sand Bar",
                    desc: "Deck straight out over the water, two doors down. Fish tacos, chowder, live music most nights.",
                    meta: "in the village · open till 11:30",
                    url: "https://www.google.com/maps/search/?api=1&query=The+Sand+Bar+Capitola"
                },
                {
                    name: "Parish Publick House",
                    desc: "The village pub back in Aptos. Take this one if the group wants to head back and reset before dinner.",
                    meta: "back by the hotel · open till 10",
                    url: "https://www.google.com/maps/search/?api=1&query=Parish+Publick+House+Aptos"
                }
            ]
        },
        lead: "Lead: Kiran"
    },
    {
        id: "disc", n: 4, theme: "t-disc", icon: "disc", accent: "#4D7C0F",
        title: "DeLaveaga Disc Golf",
        tag: "Casual front nine. Nobody knows what they're doing. That is the point.",
        badge: { text: "Hillside course", icon: "disc" },
        chill: 32, chillLabel: "walking uphill",
        tags: ["active"], cost: 1, drive: "20–25 min drive",
        pin: [123, 233], labelDx: 14, labelDy: -10,
        stats: [["Front 9", "Holes played"], ["~1.4 mi", "Moderate hillside"]],
        notes: [
            "One of the most famous courses in the country, and it happens to be twenty minutes away.",
            "No golf carts, so there's a bit of a walk either way. Difference is you get to throw something.",
            "Front 9 only. The full 27 is a grind.",
            "Nobody here is good at this. That is genuinely the best part.",
            "Discs: we'll buy them on Amazon, about $7 a head. Do a quick Venmo and we'll figure it out. Yours to keep, assuming you don't lose it in a ravine.",
            "$2 parking. Bring water and shoes you can walk in."
        ],
        links: [
            ["course info", "https://www.delaveagadiscgolf.com/"],
            ["map", "https://www.google.com/maps/search/?api=1&query=DeLaveaga+Disc+Golf+Course"]
        ],
        food: {
            lunch: [
                {
                    name: "The Grille at DeLaveaga",
                    desc: "At the course. Ocean views, full bar, its own cornhole.",
                    meta: "0 min · food till 3, so eat first",
                    url: "https://www.google.com/maps/search/?api=1&query=The+Grille+at+DeLaveaga+Santa+Cruz"
                },
                {
                    name: "Zameen Mediterranean",
                    desc: "Bowls, wraps and salads. Load up near the hotel before the drive out.",
                    meta: "near the hotel · opens at noon",
                    url: "https://www.google.com/maps/search/?api=1&query=Zameen+Mediterranean+Aptos"
                },
                {
                    name: "Charlie Hong Kong",
                    desc: "Organic noodle and rice bowls since 1998. Light and fast.",
                    meta: "8 min · opens 11am",
                    url: "https://www.google.com/maps/search/?api=1&query=Charlie+Hong+Kong+Santa+Cruz"
                }
            ],
            dinner: [
                {
                    name: "Sante Adairius Portal",
                    desc: "World-class saison brewery, plus Bookies Detroit-style pizza.",
                    meta: "5 min · room for any size group",
                    url: "https://www.google.com/maps/search/?api=1&query=Sante+Adairius+Santa+Cruz+Portal"
                },
                {
                    name: "Hula's Island Grill",
                    desc: "Tiki, downtown. The Tiki Room seats 55, no room fee.",
                    meta: "10 min · till 9pm",
                    url: "https://www.google.com/maps/search/?api=1&query=Hulas+Island+Grill+Santa+Cruz"
                },
                {
                    name: "Laili",
                    desc: "Afghan-Mediterranean kabobs on a walled garden patio.",
                    meta: "10 min · dinner 5 to 8:30",
                    url: "https://www.google.com/maps/search/?api=1&query=Laili+Restaurant+Santa+Cruz"
                }
            ]
        },
        lead: "Lead: Ajit"
    },
    {
        id: "bike", n: 5, theme: "t-bike", icon: "bike", accent: "#0284C7",
        title: "Pacific Coast Bike Cruise",
        tag: "Rentals from Epicenter Cycling, a few blocks from the hotel.",
        badge: { text: "E-bikes available" },
        route: "Coast route · ocean views the whole way",
        chill: 40, chillLabel: "easy pedaling",
        tags: ["active"], cost: 3, drive: "walkable, no drive",
        /* label runs leftward — this pin sits too far right for a right-hand label */
        pin: [716, 330], labelDx: -22, labelDy: -26, labelAnchor: "end",
        notes: [
            "The locals' pick. You cover more ground and see more of the area than anyone else.",
            "Ocean on one side the whole way, and you can stop whenever something looks worth stopping for.",
            "This road on a bike beats this road in a car. It isn't close.",
            "E-bikes available if you'd rather not earn the hills.",
            "Reserve early. Small shop, and a weekday group of eight is a real ask.",
            "Bikes are due back by 6, and dinner starts after that.",
            "Helmets included. Wear something you don't mind sweating in."
        ],
        links: [["bike shop", "https://www.google.com/maps/search/?api=1&query=Epicenter+Cycling+Aptos"]],
        food: {
            lunch: [
                {
                    name: "Zameen Mediterranean",
                    desc: "Wraps and bowls. Light enough to pedal after.",
                    meta: "3 min · opens at noon",
                    url: "https://www.google.com/maps/search/?api=1&query=Zameen+Mediterranean+Aptos"
                },
                {
                    name: "Erik's DeliCafé",
                    desc: "Sandwiches, soups and salads. Been doing this since 1973.",
                    meta: "Rancho Del Mar · quick counter",
                    url: "https://www.google.com/maps/search/?api=1&query=Eriks+DeliCafe+Aptos"
                },
                {
                    name: "Sushi Garden",
                    desc: "Rolls and teriyaki. Nothing on this menu will slow you down.",
                    meta: "5 min · lunch 11:30 to 2:30",
                    url: "https://www.google.com/maps/search/?api=1&query=Sushi+Garden+Aptos+Rancho+Del+Mar"
                }
            ],
            dinner: [
                {
                    name: "Aptos St. BBQ",
                    desc: "Oak-smoked meats, 37 taps, live blues every night 6 to 8.",
                    meta: "30 seconds from where you drop the bikes",
                    url: "https://www.google.com/maps/search/?api=1&query=Aptos+St+BBQ+Aptos"
                },
                {
                    name: "Venus Spirits Cocktails & Kitchen",
                    desc: "Wednesday is fish tacos and house margaritas. Lighter than putting the calories straight back.",
                    meta: "5 min · Rio Del Mar · open till 9",
                    url: "https://www.google.com/maps/search/?api=1&query=Venus+Spirits+Cocktails+Kitchen+Beachside+Aptos"
                },
                {
                    name: "Parish Publick House",
                    desc: "Village pub. Easy for a big table that shows up sweaty.",
                    meta: "next door · open till 10",
                    url: "https://www.google.com/maps/search/?api=1&query=Parish+Publick+House+Aptos"
                }
            ]
        },
        lead: "Lead: Michael"
    },
    {
        id: "hike", n: 6, theme: "t-forest", icon: "trees", accent: "#14532D",
        title: "Forest of Nisene Marks",
        tag: "Redwoods, real trail, ten minutes from the hotel.",
        badge: { text: "[ 3.5 MI · SHADED TRAIL ]" },
        chill: 46, chillLabel: "mild hike",
        tags: ["active"], cost: 0, drive: "10 min drive",
        pin: [677, 84], labelDx: -176, labelDy: -12,
        notes: [
            "Trees: not the data structure, the plant. Some of the biggest on earth, ten minutes from the hotel.",
            "Nothing crazy. Steady pace, nobody racing, stop whenever you feel like it.",
            "No bookings, no rentals, nothing to sign up for. Just show up in decent shoes and bring a water bottle.",
            "Redwoods, ferns, a creek, and about ten degrees cooler than everywhere else.",
            "Parking is $8 a car, cash, into a self-pay envelope with no attendant. So, technically not free — but close enough.",
            "Which trail we actually do is TBD. The park has plenty to pick from, so we'll settle it closer to the day."
        ],
        links: [
            ["park info", "https://www.parks.ca.gov/?page_id=666"],
            ["trails", "https://www.alltrails.com/parks/us/california/the-forest-of-nisene-marks-state-park"],
            ["map", "https://www.google.com/maps/search/?api=1&query=Forest+of+Nisene+Marks+State+Park"]
        ],
        food: {
            lunch: [
                {
                    name: "Soul Salad",
                    desc: "All organic, built to order. Hikers order salad. Those are the rules.",
                    meta: "5 min · 11:30 to 5",
                    url: "https://www.google.com/maps/search/?api=1&query=Soul+Salad+Aptos"
                },
                {
                    name: "Taqueria Los Gordos",
                    desc: "Counter tacos and burritos. Travels well, straight into a backpack.",
                    meta: "3 min · open 9 to 7:30",
                    url: "https://www.google.com/maps/search/?api=1&query=Taqueria+Los+Gordos+Aptos"
                },
                {
                    name: "Zameen Mediterranean",
                    desc: "Bowls, wraps, salads. Quick and actually healthy.",
                    meta: "4 min · opens at noon",
                    url: "https://www.google.com/maps/search/?api=1&query=Zameen+Mediterranean+Aptos"
                }
            ],
            dinner: [
                {
                    name: "Sevy's Bar + Kitchen",
                    desc: "The hotel's own kitchen. Shower, walk downstairs, done.",
                    meta: "on site · no driving at all",
                    url: "https://www.google.com/maps/search/?api=1&query=Sevys+Bar+Kitchen+Seacliff+Inn+Aptos"
                },
                {
                    name: "Aptos St. BBQ",
                    desc: "Oak-smoked meats and live blues. You earned it.",
                    meta: "5 min · music nightly 6 to 8",
                    url: "https://www.google.com/maps/search/?api=1&query=Aptos+St+BBQ+Aptos"
                },
                {
                    name: "Parish Publick House",
                    desc: "Village pub, five minutes from the trailhead.",
                    meta: "5 min · open till 10",
                    url: "https://www.google.com/maps/search/?api=1&query=Parish+Publick+House+Aptos"
                }
            ]
        },
        lead: "Lead: Scott"
    }
];

/* ---------------- Wednesday, top to bottom ----------------
   tbd: true renders the row greyed out with a "to come" marker.
   pick: true is the afternoon row — it mirrors whatever you signed up for. */
const SCHEDULE = [
    {
        when: "12:35", title: "Lunch with your group",
        detail: "Point covers it. Groups mostly eat together and head out from there."
    },
    {
        when: "~1:00 pm", title: "Groups head out",
        detail: "Sort drivers, seats, and who is riding with who before this. Not at 12:37."
    },
    {
        when: "Afternoon", title: "Your pick", pick: true,
        detail: "Whichever of the six you put your name on. Ends when it ends."
    },
    {
        when: "Until 8:00 pm", title: "Dinner with your group",
        detail: "Point covers dinner and drinks with it. Each group sorts its own plan on the way out."
    }
];

/* ---------------- the whole week ----------------
   start/end are 24h local time — the offsite is entirely in America/Los_Angeles.
   kind drives the colour: meal · session · activity · social · logistics.
   open: true  — "onwards", an end time that isn't really an end. The block
                 fades out at the bottom and the time reads "6:00p onwards".
                 It still needs an end; that's what the calendar link uses.
   quiet: true — a background band behind the day (Tuesday's travel window).
                 Exempt from the overlap check, since it is meant to sit under
                 everything else.
   pick: true  — Wednesday afternoon. Mirrors whatever you signed up for and
                 points at the "How the block runs" panel rather than repeating it.
   Blocks otherwise must not overlap — the ribbon has one lane per day, and
   buildRibbon names both culprits in the console if they do. */
const AGENDA = [
    {
        date: "2026-09-29", label: "Tue 29 Sept", sub: "Travel day · arrive whenever",
        blocks: [
            {
                start: "06:00", end: "23:00", title: "Travel", kind: "logistics", quiet: true,
                cal: "Travel to Aptos",
                detail: "People land across the whole day. There is nothing to be on time for."
            },
            {
                start: "18:30", end: "20:30", title: "Dinner and drinks", kind: "meal",
                where: "Sevy's Bar + Kitchen", cal: "Dinner and drinks (at hotel)",
                map: "https://www.google.com/maps/search/?api=1&query=Sevys+Bar+Kitchen+Seacliff+Inn+Aptos",
                detail: "At Sevy's, the hotel's own kitchen. Point covers dinner and drinks."
            },
            {
                start: "20:30", end: "23:00", title: "Hangout", kind: "social", open: true,
                cal: "Hangout - On Your Own",
                detail: "On your own from here. You'll likely find people at the bar or wandering around the hotel."
            }
        ]
    },
    {
        date: "2026-09-30", label: "Wed 30 Sept", sub: "Kickoff, then your afternoon",
        blocks: [
            { start: "08:00", end: "09:30", title: "Breakfast", kind: "meal", where: "Dining Room", cal: "Breakfast (Dining Room)" },
            {
                start: "09:30", end: "10:15", title: "Kickoff", kind: "session",
                cal: "KickOff - Bavyaa / Elissa",
                detail: "Bavyaa and Elissa."
            },
            { start: "10:15", end: "11:15", title: "Breakout sessions", kind: "session", cal: "Breakout Sessions" },
            { start: "11:15", end: "11:30", title: "Break", kind: "logistics" },
            { start: "11:30", end: "12:30", title: "Team building exercise", kind: "session", cal: "Team Building Exercise" },
            {
                start: "12:30", end: "20:00", title: "Lunch + group activity + dinner",
                kind: "activity", pick: true, open: true,
                cal: "Group Activity (Lunch and Dinner with Your Group)",
                detail: "Whichever of the six you put your name on."
            }
        ]
    },
    {
        date: "2026-10-01", label: "Thu 1 Oct", sub: "Hackathon day",
        blocks: [
            { start: "08:00", end: "09:30", title: "Breakfast", kind: "meal", where: "Dining Room" },
            { start: "09:30", end: "10:00", title: "Hackathon team organization", kind: "session", cal: "Hackathon (Finalize Affiliations)" },
            { start: "10:00", end: "12:00", title: "Hackathon", kind: "session" },
            { start: "12:00", end: "12:10", title: "Group picture", kind: "logistics", cal: "Group Picture" },
            { start: "12:10", end: "13:00", title: "Lunch", kind: "meal", where: "On property", cal: "Lunch (at hotel)" },
            { start: "13:00", end: "18:30", title: "Hackathon continues", kind: "session", open: true, cal: "Hackathon Continues" },
            {
                start: "18:30", end: "20:30", title: "Dinner and drinks", kind: "meal",
                where: "Sevy's Bar + Kitchen", cal: "Dinner and drinks (at hotel)",
                map: "https://www.google.com/maps/search/?api=1&query=Sevys+Bar+Kitchen+Seacliff+Inn+Aptos",
                detail: "At Sevy's again. Point covers dinner and drinks."
            },
            {
                start: "22:30", end: "23:30", title: "Late night Mexican", kind: "social", open: true,
                cal: "Late Night Mexican (optional)",
                detail: "Optional."
            }
        ]
    },
    {
        date: "2026-10-02", label: "Fri 2 Oct", sub: "Demos, then wheels up",
        blocks: [
            { start: "08:00", end: "09:30", title: "Breakfast", kind: "meal", where: "Dining Room" },
            {
                start: "09:30", end: "11:30", title: "Hackathon and design presentations", kind: "session",
                cal: "Hackathon / Design Presentations"
            },
            {
                start: "11:30", end: "12:00", title: "Winner announcement", kind: "session",
                cal: "Hackathon Winner Announcement - Bavyaa / Elissa - Final Remarks",
                detail: "Plus final remarks from Bavyaa and Elissa."
            },
            {
                start: "12:00", end: "13:00", title: "Bye bye", kind: "logistics",
                cal: "Bye Bye - Depart, Lunch on Your Own",
                detail: "Checkout, airport runs, and lunch on your own — the end of it."
            }
        ]
    }
];

/* every agenda time is Pacific — pinned explicitly so the calendar links and
   the .ics land correctly for whoever is adding them from another timezone */
const TZ = "America/Los_Angeles";
const BASE = "Seacliff Inn";
const HOTEL = "Seacliff Inn, 7500 Old Dominion Ct, Aptos, CA 95003";

/* change this one string to move the deadline everywhere it appears */
const DEADLINE = "Fri 25 Sept";
/* the Apps Script /exec URL from Code.gs. Empty runs the page
   local-only, which is handy for editing copy offline. */
const ENDPOINT = "https://script.google.com/macros/s/AKfycbw-xIaO2vEHdPlXXRiR0CSQC2tDffqPqKHm3jhF8PU7o94JBs8HOze5RW7gtBXmq0_s/exec";
const ME_KEY = "aptos-offsite-me-v1";

let signups = {};
let openActivity = null;
let lastFocus = null;
let filter = "all";
let me = loadMe();

const hasBackend = !!ENDPOINT;
const $ = id => document.getElementById(id);
const byId = id => ACTIVITIES.find(a => a.id === id);
const esc = s => String(s).replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

/* ---------------- who am I ---------------- */
function loadMe() {
    try { return JSON.parse(localStorage.getItem(ME_KEY) || "null"); }
    catch (e) { return null; }
}
function saveMe(v) {
    try { v ? localStorage.setItem(ME_KEY, JSON.stringify(v)) : localStorage.removeItem(ME_KEY); }
    catch (e) { /* private mode — the page still works, it just forgets you */ }
    me = v;
}
function findByKey(key) {
    if (!key) return null;
    for (const id in signups) {
        const hit = (signups[id] || []).find(p => p.key === key);
        if (hit) return { id, person: hit };
    }
    return null;
}
const myPick = () => findByKey(me && me.key);

/* ---------------- the sheet ---------------- */
async function pull() {
    if (!hasBackend) return;
    try {
        const res = await fetch(ENDPOINT, { cache: "no-store" });
        const data = await res.json();
        if (data && data.ok) signups = data.signups || {};
    } catch (e) { signups = signups || {}; }
}
/* text/plain keeps this a "simple" request. Apps Script has no doOptions,
   so anything that triggers a CORS preflight gets rejected before it runs.
   The reply carries the fresh roster, so a write costs one round trip. */
async function post(body) {
    if (!hasBackend) return true;
    try {
        const res = await fetch(ENDPOINT, {
            method: "POST",
            redirect: "follow",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!data || !data.ok) return false;
        signups = data.signups || {};
        return true;
    } catch (e) { return false; }
}
async function load() {
    await pull();
    render();
    if (!load.booted) { load.booted = true; openFromHash(); }
}

/* ---------------- card markup ---------------- */
/* the activity's own out-of-pocket cost. Food carries no price — Point pays. */
function costHTML(c) {
    if (c === 0) return '<span class="cost">free</span>';
    return '<span class="cost">' + "$".repeat(c) + '<span class="off">' + "$".repeat(3 - c) + "</span></span>";
}
function extrasHTML(a) {
    let html = "";
    if (a.badge) {
        html += '<span class="badge">' + (a.badge.icon ? ICON[a.badge.icon] : "") + esc(a.badge.text) + "</span>";
    }
    if (a.cottages) {
        html += '<div class="cottages" aria-hidden="true">' + a.cottages.map((c, i) =>
            '<i style="background:' + c + ';height:' + (12 + (i % 3) * 5) + 'px"></i>').join("") + "</div>";
    }
    if (a.stats) {
        html += '<div class="stats">' + a.stats.map(s =>
            '<div class="stat"><b>' + esc(s[0]) + "</b><span>" + esc(s[1]) + "</span></div>").join("") + "</div>";
    }
    if (a.route) {
        html += '<div class="route">' + ICON.wave + esc(a.route) + "</div>";
    }
    return html;
}
/* deliberately unthemed — the one element that reads the same on all six cards */
function gaugeHTML(a) {
    return '<div class="gauge">' +
        '<div class="gauge-h"><span>Chill factor</span><b>' + esc(a.chillLabel) + "</b></div>" +
        '<div class="gauge-track" data-home="' + a.chill + '">' +
        '<span class="gauge-tip" aria-hidden="true"></span>' +
        '<span class="gauge-dot" style="left:' + a.chill + '%"></span></div>' +
        '<div class="gauge-ends"><span>poolside lounging</span><span>running a marathon</span></div>' +
        "</div>";
}

/* Easter egg: the dot isn't a real control, but it can be dragged off its mark
   to read the wider scale, then springs back. Nothing is stored. */
const CHILL_LADDER = [
    [0, "cryo-frozen · thaw in 100 years"],
    [8, "medically induced coma"],
    [17, "asleep, phone face down"],
    [26, "poolside lounging"],
    [35, "strolling out for ice cream"],
    [44, "a normal person doing normal things"],
    [53, "hauling coolers uphill"],
    [62, "running a marathon"],
    [71, "free soloing el capitan"],
    [80, "wrestling a grizzly bear"],
    [89, "outrunning that grizzly, in sand"],
    [96, "wingsuiting into a volcano"]
];
function chillRung(pct) {
    let label = CHILL_LADDER[0][1];
    CHILL_LADDER.forEach(r => { if (pct >= r[0]) label = r[1]; });
    return label;
}
function wireChillEgg() {
    $("grid").addEventListener("pointerdown", e => {
        const dot = e.target.closest(".gauge-dot");
        if (!dot) return;
        const track = dot.parentNode;
        const tip = track.querySelector(".gauge-tip");
        e.preventDefault();
        track.classList.add("dragging");
        /* capture so the drag survives leaving the 7px-tall track */
        if (dot.setPointerCapture) dot.setPointerCapture(e.pointerId);

        const move = ev => {
            const r = track.getBoundingClientRect();
            const pct = Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100));
            dot.style.left = pct + "%";
            /* the card clips its overflow, so keep the card away from the edges */
            tip.style.left = Math.max(20, Math.min(80, pct)) + "%";
            tip.textContent = chillRung(pct);
        };
        const drop = () => {
            dot.removeEventListener("pointermove", move);
            track.classList.remove("dragging");
            dot.style.left = track.dataset.home + "%";
        };
        dot.addEventListener("pointermove", move);
        dot.addEventListener("pointerup", drop, { once: true });
        dot.addEventListener("pointercancel", drop, { once: true });
        move(e);
    });
}

/* The food list lives on a second face of the card rather than expanding it.
   The front stays in flow while hidden, so the card never changes height. */
function spotHTML(s) {
    return '<a class="spot" href="' + s.url + '" target="_blank" rel="noopener noreferrer">' +
        "<b>" + esc(s.name) + "</b>" +
        '<span class="what">' + esc(s.desc) + "</span>" +
        '<span class="meta">' + esc(s.meta) + "</span></a>";
}
function mealHTML(label, list) {
    return '<div class="meal"><p class="meal-h">' + label +
        "<i>" + list.length + "</i></p>" +
        '<div class="spots">' + list.map(spotHTML).join("") + "</div></div>";
}
function foodHTML(a) {
    return '<div class="food-top">' +
        "<div><b>Food recommendations</b>" +
        "<span>Nothing is booked. Your group picks.</span></div>" +
        '<button class="unflip" type="button" data-flip="' + a.id + '">Back</button>' +
        "</div>" +
        mealHTML("Lunch", a.food.lunch) +
        mealHTML("Dinner", a.food.dinner);
}

function cardHTML(a) {
    return '<span class="flag">You\'re in</span>' +
        (a.id === "bike" ? '<span class="speedlines" aria-hidden="true"><i></i><i></i><i></i></span>' : "") +
        '<div class="card-head">' +
        '<span class="glyph" aria-hidden="true">' + ICON[a.icon] + "</span>" +
        '<span class="card-num">0' + a.n + "</span>" +
        '<button class="share" type="button" data-share="' + a.id + '" ' +
        'title="Copy a link straight to this one" aria-label="Copy link to ' + esc(a.title) + '">' +
        ICON.link + "</button>" +
        "</div>" +
        "<h2>" + esc(a.title) + "</h2>" +
        '<p class="tagline">' + esc(a.tag) + "</p>" +
        '<div class="faces">' +
        '<div class="face front">' +
        extrasHTML(a) +
        gaugeHTML(a) +
        '<div class="chips">' + costHTML(a.cost) +
        "<span>" + esc(a.drive) + "</span><span>" + esc(a.lead) + "</span></div>" +
        '<ul class="notes">' + a.notes.map(n => "<li>" + esc(n) + "</li>").join("") + "</ul>" +
        (a.links.length
            ? '<div class="links">' + a.links.map(l =>
                '<a href="' + l[1] + '" target="_blank" rel="noopener noreferrer">' + esc(l[0]) + ICON.ext + "</a>"
            ).join("") + "</div>"
            : "") +
        '<div class="flipto-wrap"><button class="flipto" type="button" data-flip="' + a.id + '">' +
        ICON.fork + "Food recommendations</button></div>" +
        "</div>" +
        '<div class="face back" aria-hidden="true">' + foodHTML(a) + "</div>" +
        "</div>" +
        '<div class="card-foot">' +
        '<button class="join" type="button" data-id="' + a.id + '"></button>' +
        '<p class="swap-note"></p>' +
        '<div class="tally"></div>' +
        '<div class="roster"></div>' +
        "</div>";
}

function buildCards() {
    const grid = $("grid");
    ACTIVITIES.forEach(a => {
        const c = document.createElement("article");
        c.className = "card " + a.theme;
        c.id = "card-" + a.id;
        c.dataset.id = a.id;
        c.dataset.tags = a.tags.join(" ");
        c.innerHTML = cardHTML(a);
        c.addEventListener("mouseenter", () => lite(a.id, true));
        c.addEventListener("mouseleave", () => lite(a.id, false));
        grid.appendChild(c);
    });
    grid.addEventListener("click", e => {
        const join = e.target.closest("button.join");
        if (join) { openForm(join.dataset.id); return; }
        const flip = e.target.closest("[data-flip]");
        if (flip) { flipCard(flip.dataset.flip); return; }
        const share = e.target.closest("button.share");
        if (share) copyLink(share.dataset.share);
    });
}

/* visibility:hidden on the outgoing face keeps its links out of the tab order
   while it still holds the card's height open */
function flipCard(id) {
    const card = $("card-" + id);
    const on = !card.classList.contains("flipped");
    card.classList.toggle("flipped", on);
    card.querySelector(".face.front").setAttribute("aria-hidden", String(on));
    card.querySelector(".face.back").setAttribute("aria-hidden", String(!on));
    const btn = card.querySelector(on ? ".unflip" : ".flipto");
    if (btn) btn.focus({ preventScroll: true });
}

/* ---------------- deep links ---------------- */
function cardURL(id) {
    return location.origin + location.pathname + location.search + "#card-" + id;
}
function copyLink(id) {
    const url = cardURL(id);
    const done = () => toast("Link copied. Send it to whoever you're recruiting.");
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, () => legacyCopy(url, done));
    } else {
        legacyCopy(url, done);
    }
}
function legacyCopy(text, done) {
    /* clipboard API needs a secure context, which file:// isn't */
    const box = document.createElement("textarea");
    box.value = text;
    box.setAttribute("readonly", "");
    box.style.cssText = "position:fixed;top:-999px;opacity:0";
    document.body.appendChild(box);
    box.select();
    try { document.execCommand("copy"); done(); }
    catch (e) { toast("Couldn't copy — the link is " + text); }
    document.body.removeChild(box);
}
function spotlight(id, ms) {
    const card = $("card-" + id);
    if (!card) return;
    applyFilter("all");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    lite(id, true);
    clearTimeout(spotlight["_" + id]);
    spotlight["_" + id] = setTimeout(() => lite(id, false), ms || 1600);
}
function openFromHash() {
    const m = (location.hash || "").match(/^#card-([a-z]+)$/i);
    if (m && byId(m[1])) spotlight(m[1], 2400);
}

/* ---------------- roster bits ---------------- */
/* Sign-up notes are deliberately not rendered anywhere. They go to the
   sheet so the leads can read them, and stay off the page. */
function rosterHTML(id) {
    const list = signups[id] || [];
    if (!list.length) return '<span style="opacity:.6">nobody yet — be the first</span>';
    return list.map(p => {
        /* a row hand-edited in the sheet can still arrive without a name */
        let s = '<span class="who">' + esc(p.name || "someone");
        if (p.seats > 0) s += ICON.car + '<span class="seats">+' + p.seats + "</span>";
        return s + "</span>";
    }).join('<span class="sep">·</span>');
}
/* No lead line here — the chips row above already carries it. */
function tallyHTML(id) {
    const list = signups[id] || [];
    const seats = list.reduce((s, p) => s + (p.seats || 0), 0);
    return [
        list.length + (list.length === 1 ? " person" : " people"),
        seats + (seats === 1 ? " seat offered" : " seats offered")
    ].join(" · ");
}

/* ---------------- render ---------------- */
function render() {
    const mine = myPick();
    let total = 0, seats = 0;
    const leadless = [];

    ACTIVITIES.forEach(a => {
        const list = signups[a.id] || [];
        total += list.length;
        seats += list.reduce((s, p) => s + (p.seats || 0), 0);
        if (a.lead === "Lead: open") leadless.push(a.title);

        const card = $("card-" + a.id);
        const isMine = !!mine && mine.id === a.id;
        card.classList.toggle("mine", isMine);
        card.querySelector(".tally").textContent = tallyHTML(a.id);
        card.querySelector(".roster").innerHTML = rosterHTML(a.id);

        const btn = card.querySelector(".join");
        btn.innerHTML = isMine
            ? ICON.check + "You're in — edit or leave"
            : (mine ? ICON.swap + "Move me here" : ICON.plus + "Count me in");

        card.querySelector(".swap-note").textContent =
            mine && !isMine ? "Takes your name off " + byId(mine.id).title + "." : "";
    });

    /* Both of these are minted by their renderers, not by index.html, so they
       are guarded: dropping a pick row from SCHEDULE or AGENDA must not throw
       here and leave the counters, join buttons and roster stale. */
    const pickLine = mine
        ? "You're on " + byId(mine.id).title + ". Ends when it ends."
        : "Whichever of the six you put your name on. Ends when it ends.";
    if ($("schedulePick")) $("schedulePick").textContent = pickLine;
    if ($("agendaPick")) $("agendaPick").textContent = pickLine;

    /* the afternoon's calendar link is built at render time so it carries
       whatever you actually signed up for, not a generic placeholder */
    const picked = $("agenda") && $("agenda").querySelector("li.pick");
    if (picked) {
        const day = AGENDA.filter(d => d.blocks.some(b => b.pick))[0];
        const block = day && day.blocks.filter(b => b.pick)[0];
        const cal = picked.querySelector(".cal");
        if (cal && block) cal.href = gcalURL(day, block);
    }

    $("grid").classList.toggle("picked", !!mine);
    $("pickHint").textContent = mine
        ? "You're down for " + byId(mine.id).title
        : "One pick per person · sign up by " + DEADLINE;

    $("foot").innerHTML =
        total + " signed up · " + seats + " seats offered across all groups<br>" +
        "Sign up by " + DEADLINE + " so bikes can be reserved, discs ordered, and tables sized.<br>" +
        "One option per person. Signing up for another moves your name.<br>" +
        (leadless.length ? "Still needs a lead: " + esc(leadless.join(", ")) + "<br>" : "") +
        "Questions, or want to swap something → ping Ryan.<br>" +
        "Press 1–6 to jump between options.";
}

/* ---------------- filters ---------------- */
function applyFilter(next) {
    filter = next;
    document.querySelectorAll(".pill").forEach(p =>
        p.setAttribute("aria-pressed", String(p.dataset.filter === filter)));
    ACTIVITIES.forEach(a =>
        $("card-" + a.id).classList.toggle("hidden", filter !== "all" && a.tags.indexOf(filter) === -1));
}
function buildFilters() {
    document.querySelectorAll(".pill").forEach(p => {
        const f = p.dataset.filter;
        if (f !== "all") {
            p.querySelector(".n").textContent = ACTIVITIES.filter(a => a.tags.indexOf(f) > -1).length;
        }
        p.addEventListener("click", () => applyFilter(f));
    });
}

/* ---------------- schedule ---------------- */
function buildSchedule() {
    $("schedule").innerHTML = SCHEDULE.map(row =>
        '<li class="' + (row.pick ? "pick" : row.tbd ? "tbd" : "") + '">' +
        '<span class="when">' + esc(row.when) + "</span>" +
        '<div class="track"><b>' + esc(row.title) + (row.tbd ? '<i class="tbd-tag">to come</i>' : "") + "</b>" +
        (row.detail || row.pick
            ? '<span class="what"' + (row.pick ? ' id="schedulePick"' : "") + ">" + esc(row.detail || "") + "</span>"
            : "") +
        (row.pick ? '<a class="jump" href="#grid">Choose yours ↑</a>' : "") +
        "</div></li>"
    ).join("");
}

/* ---------------- the whole week ----------------
   Two layers over one AGENDA array: a proportional ribbon that shows the shape
   of the week, and day panels that carry the words. The ribbon is a CSS grid of
   half-hour rows, so a block is placed with grid-row and never with pixel math —
   change --slot in the CSS and the whole thing rescales. */

/* 15, not 30: Wednesday has a 15-minute break and a 5-minute group picture,
   and a 30-minute row would round both away to nothing */
const SLOT = 15;                                  /* minutes per ribbon row */
const mins = t => +t.slice(0, 2) * 60 + +t.slice(3, 5);
const pad = m => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
const rowOf = (t, from) => Math.round((mins(t) - from) / SLOT) + 1;
/* the 5-minute group picture still has to be drawn, so nothing gets less than a row */
const endRow = (b, from) => Math.max(rowOf(b.end, from), rowOf(b.start, from) + 1);

/* 9:00–9:30a · 10:30a–12:00p · 1:00–5:00p — one meridiem when both ends share it,
   which keeps every range inside the timeline's 104px time column */
function clock(t) {
    const h = +t.slice(0, 2), m = t.slice(3, 5);
    return ((h % 12) || 12) + ":" + m;
}
const ampm = t => (+t.slice(0, 2) < 12 ? "a" : "p");
function timeRange(a, b) {
    return ampm(a) === ampm(b)
        ? clock(a) + "–" + clock(b) + ampm(b)
        : clock(a) + ampm(a) + "–" + clock(b) + ampm(b);
}
/* an open-ended block says so rather than inventing a finish time */
const whenLabel = b => b.open ? clock(b.start) + ampm(b.start) + " onwards" : timeRange(b.start, b.end);

/* the ribbon's window comes from the data, rounded out to the hour, so it
   retracks itself as the agenda gets edited instead of drifting from a constant */
function agendaWindow() {
    let lo = 24 * 60, hi = 0;
    AGENDA.forEach(d => d.blocks.forEach(b => {
        lo = Math.min(lo, mins(b.start));
        hi = Math.max(hi, mins(b.end));
    }));
    return { from: Math.floor(lo / 60) * 60, to: Math.ceil(hi / 60) * 60 };
}

/* one lane per day, so overlapping blocks would stack on top of each other.
   Shout about it in the console rather than rendering something wrong. */
function warnOverlaps() {
    AGENDA.forEach(d => {
        const sorted = d.blocks.filter(b => !b.quiet)
            .sort((x, y) => mins(x.start) - mins(y.start));
        sorted.forEach((b, i) => {
            const next = sorted[i + 1];
            if (next && mins(next.start) < mins(b.end)) {
                console.warn("AGENDA: " + d.label + " — \"" + b.title + "\" overlaps \"" +
                    next.title + "\". Split one around the other; the ribbon has one lane per day.");
            }
        });
    });
}

const blockId = (day, i) => "ag-" + day.date + "-" + i;

function buildRibbon() {
    warnOverlaps();
    const win = agendaWindow();
    const slots = (win.to - win.from) / SLOT;

    const heads = '<span class="rib-ax" aria-hidden="true"></span>' +
        AGENDA.map(d => '<span class="rib-day"><b>' + esc(d.label) + "</b><i>" +
            esc(d.sub || "") + "</i></span>").join("");

    /* hour labels down the axis column, then a background column per day so an
       empty stretch reads as open time rather than as nothing being there */
    let cells = "";
    for (let m = win.from; m < win.to; m += 60) {
        cells += '<span class="rib-hour" style="grid-row:' + rowOf(pad(m), win.from) + '">' +
            ((Math.floor(m / 60) % 12) || 12) + (m < 12 * 60 ? "a" : "p") + "</span>";
    }
    cells += AGENDA.map((d, c) =>
        '<span class="rib-col" style="grid-column:' + (c + 2) + ';grid-row:1/' + (slots + 1) + '"></span>'
    ).join("");

    /* is-tall has room for its times printed inside; is-tiny is too short for
       any text at all and reads as a sliver, which is honest for a 5-minute
       group picture. Quiet bands sit behind everything in the same cells. */
    cells += AGENDA.map((d, c) => d.blocks.map((b, i) => {
        const len = mins(b.end) - mins(b.start);
        const cls = "ab k-" + b.kind +
            (b.quiet ? " is-quiet" : "") + (b.open ? " is-open" : "") +
            (b.pick ? " is-pick" : "") +
            (len >= 60 ? " is-tall" : "") + (len < 30 ? " is-tiny" : "");
        /* the box itself prints the full schedule wording now that it has the
           height and line-clamp to hold it (see .ab b); the tooltip repeats
           it for the sliver-sized blocks that still can't show any text */
        const full = b.cal || b.title;
        return '<a class="' + cls + '" href="#' + blockId(d, i) + '"' +
            ' style="grid-column:' + (c + 2) + ';grid-row:' +
            rowOf(b.start, win.from) + "/" + endRow(b, win.from) + '"' +
            ' title="' + esc(whenLabel(b) + " · " + full) + '">' +
            "<b>" + esc(full) + "</b><i>" + esc(whenLabel(b)) + "</i></a>";
    }).join("")).join("");

    $("ribbon").innerHTML =
        '<div class="rib-days">' + heads + "</div>" +
        '<div class="rib-grid" style="--slots:' + slots + '">' + cells + "</div>";
}

/* The day panels reuse the .tl timeline wholesale — same when/track/dot markup
   as buildSchedule above, plus a place line and a calendar link. */
function buildAgenda() {
    $("agenda").innerHTML = AGENDA.map(d =>
        '<div class="panel"><h3>' + esc(d.label) +
        (d.sub ? ' <span class="day-sub">' + esc(d.sub) + "</span>" : "") + "</h3>" +
        '<ul class="tl">' + d.blocks.map((b, i) =>
            '<li class="' + (b.pick ? "pick" : b.quiet ? "quiet" : "") + '" id="' + blockId(d, i) + '">' +
            '<span class="when">' + esc(whenLabel(b)) + "</span>" +
            '<div class="track">' +
            /* the calendar link rides on the title line rather than under the row.
               the header prints the full schedule wording (`cal`, when a block
               has one) rather than the ribbon's short label, since this panel
               is "the words" — the one place nothing should be shortened */
            '<div class="row-head"><b>' + esc(b.cal || b.title) + "</b>" +
            '<a class="cal" href="' + gcalURL(d, b) + '" target="_blank" rel="noopener noreferrer"' +
            ' aria-label="Add ' + esc(b.cal || b.title) + ' to Google Calendar">' + ICON.cal + "GCal</a></div>" +
            (b.detail || b.pick
                ? '<span class="what"' + (b.pick ? ' id="agendaPick"' : "") + ">" +
                  esc(b.detail || "") + "</span>"
                : "") +
            /* almost everything is at the hotel, so only a different place earns
               a line — where still feeds the calendar location */
            (b.where && b.where !== BASE
                ? '<span class="where">' + (b.map
                    ? '<a href="' + b.map + '" target="_blank" rel="noopener noreferrer">' +
                      esc(b.where) + ICON.ext + "</a>"
                    : esc(b.where)) + "</span>"
                : "") +
            (b.pick ? '<span class="row-acts"><a class="jump" href="#schedule">How the block runs ↑</a></span>' : "") +
            "</div></li>"
        ).join("") + "</ul></div>"
    ).join("");
}

/* ---------------- calendar links ----------------
   Times go out as unzoned local plus an explicit timezone, never hand-rolled
   UTC — same result, no arithmetic, and it stays right if a date ever moves
   across a DST boundary. */

/* the afternoon block becomes your actual activity once you've signed up.
   `cal` is the block's full calendar-export title, matching the source
   schedule verbatim; it falls back to the on-page `title` when the two
   already agree, so calendar events read exactly like the master schedule
   even where the ribbon/day-panel show a shorter label. */
function calTitle(day, b) {
    const mine = b.pick && myPick();
    return mine ? "Offsite: " + byId(mine.id).title : "Offsite: " + (b.cal || b.title);
}
function calDetail(day, b) {
    const mine = b.pick && myPick();
    if (mine) {
        const a = byId(mine.id);
        return a.tag + "\n\n" + a.drive + " · " + a.lead + "\nhttps://michaelpoint.github.io/eng-offsite-9-2026/#card-" + a.id;
    }
    return b.detail || "";
}

/* the day after, for all-day events — an all-day DTEND is exclusive */
function nextDay(date) {
    const d = new Date(date + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
}

function gcalURL(day, b) {
    const d = day.date.replace(/-/g, "");
    const stamp = t => d + "T" + t.replace(":", "") + "00";
    const p = new URLSearchParams({
        action: "TEMPLATE",
        text: calTitle(day, b),
        details: calDetail(day, b),
        location: b.quiet ? "" : b.where ? b.where + ", Aptos, CA" : HOTEL,
        ctz: TZ
    });
    /* a travel window is an all-day event — nobody wants 17 hours blocked out.
       dates carries a literal slash, appended raw so it isn't percent-encoded. */
    const range = b.quiet
        ? d + "/" + nextDay(day.date)
        : stamp(b.start) + "/" + stamp(b.end);
    return "https://calendar.google.com/calendar/render?" + p.toString() + "&dates=" + range;
}

/* ---------------- the whole week as one .ics ----------------
   Generated from AGENDA on click, so there is no second copy of the schedule
   to fall out of date. */
const icsEsc = s => String(s)
    .replace(/\\/g, "\\\\").replace(/[;,]/g, m => "\\" + m).replace(/\r?\n/g, "\\n");

/* RFC 5545 caps a line at 75 octets, continued by a leading space */
function fold(line) {
    const out = [];
    let s = line;
    while (s.length > 74) { out.push(s.slice(0, 74)); s = " " + s.slice(74); }
    out.push(s);
    return out.join("\r\n");
}

/* A bare IANA TZID resolves in every major client, but shipping the VTIMEZONE
   is what stops the "my event is 8 hours off" reports from the overseas folks. */
const VTIMEZONE = [
    "BEGIN:VTIMEZONE", "TZID:America/Los_Angeles",
    "BEGIN:DAYLIGHT", "TZOFFSETFROM:-0800", "TZOFFSETTO:-0700", "TZNAME:PDT",
    "DTSTART:19700308T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU", "END:DAYLIGHT",
    "BEGIN:STANDARD", "TZOFFSETFROM:-0700", "TZOFFSETTO:-0800", "TZNAME:PST",
    "DTSTART:19701101T020000", "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU", "END:STANDARD",
    "END:VTIMEZONE"
];

function icsText() {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const lines = [
        "BEGIN:VCALENDAR", "VERSION:2.0",
        "PRODID:-//Point Engineering//Offsite 2026//EN",
        "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
        "X-WR-CALNAME:Point Offsite 2026"
    ].concat(VTIMEZONE);

    AGENDA.forEach(day => day.blocks.forEach((b, i) => {
        const d = day.date.replace(/-/g, "");
        const local = t => d + "T" + t.replace(":", "") + "00";
        lines.push(
            "BEGIN:VEVENT",
            /* stable uid so a re-download updates the event instead of duplicating it */
            "UID:" + day.date + "-" + i + "@point-offsite-2026",
            "SEQUENCE:0",
            "DTSTAMP:" + stamp,
            b.quiet ? "DTSTART;VALUE=DATE:" + d : "DTSTART;TZID=" + TZ + ":" + local(b.start),
            b.quiet ? "DTEND;VALUE=DATE:" + nextDay(day.date) : "DTEND;TZID=" + TZ + ":" + local(b.end),
            fold("SUMMARY:" + icsEsc(calTitle(day, b))),
            b.quiet ? "" : fold("LOCATION:" + icsEsc(b.where ? b.where + ", Aptos, CA" : HOTEL)),
            fold("DESCRIPTION:" + icsEsc(calDetail(day, b))),
            "STATUS:CONFIRMED",
            "END:VEVENT"
        );
    }));

    lines.push("END:VCALENDAR");
    return lines.filter(Boolean).join("\r\n") + "\r\n";
}

function downloadICS() {
    const blob = new Blob([icsText()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "point-offsite-2026.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Four days of blocks, times pinned to Pacific.");
}

/* ---------------- decide for me ---------------- */
let spinning = false;
function pickForMe() {
    if (spinning || openActivity) return;
    const pool = ACTIVITIES.filter(a => filter === "all" || a.tags.indexOf(filter) > -1);
    const winner = pool[Math.floor(Math.random() * pool.length)];
    const land = () => {
        spinning = false;
        $("card-" + winner.id).scrollIntoView({ behavior: "smooth", block: "center" });
        lite(winner.id, true);
        setTimeout(() => { lite(winner.id, false); openForm(winner.id); }, 850);
    };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches || pool.length < 2) { land(); return; }

    spinning = true;
    $("pickForMe").disabled = true;
    let i = 0;
    const ticks = 11 + Math.floor(Math.random() * 7);
    const spin = setInterval(() => {
        pool.forEach(a => lite(a.id, false));
        lite(pool[i % pool.length].id, true);
        if (++i >= ticks) {
            clearInterval(spin);
            pool.forEach(a => lite(a.id, false));
            $("pickForMe").disabled = false;
            land();
        }
    }, 95);
}

/* ---------------- map pins ---------------- */
function buildPins() {
    const g = $("pins"), NS = "http://www.w3.org/2000/svg";
    ACTIVITIES.forEach(a => {
        const [x, y] = a.pin;
        const grp = document.createElementNS(NS, "g");
        grp.setAttribute("class", "pin");
        grp.setAttribute("style", "color:" + a.accent);
        grp.setAttribute("tabindex", "0");
        grp.setAttribute("role", "link");
        grp.setAttribute("aria-label", a.title);
        grp.id = "pin-" + a.id;
        const anchor = a.labelAnchor ? ' text-anchor="' + a.labelAnchor + '"' : "";
        const lx = x + a.labelDx;
        grp.innerHTML =
            '<circle class="halo" cx="' + x + '" cy="' + y + '" r="22" fill="currentColor"/>' +
            (a.base ? '<circle class="base-ring" cx="' + x + '" cy="' + y + '" r="18" stroke="currentColor"/>' : "") +
            '<circle class="head" cx="' + x + '" cy="' + y + '" r="12" stroke="currentColor"/>' +
            '<text class="num" x="' + x + '" y="' + (y + 4.5) + '">' + a.n + "</text>" +
            '<text class="lbl" x="' + lx + '" y="' + (y + a.labelDy) + '"' + anchor + ">" +
            esc((a.mapLabel || a.title).toUpperCase()) + "</text>" +
            (a.sub
                ? '<text class="sub" x="' + lx + '" y="' + (y + a.labelDy + 14) + '"' + anchor + ">" +
                esc(a.sub) + "</text>"
                : "");
        const go = () => {
            applyFilter("all");
            $("card-" + a.id).scrollIntoView({ behavior: "smooth", block: "center" });
            lite(a.id, true);
            setTimeout(() => lite(a.id, false), 1600);
        };
        grp.addEventListener("click", go);
        grp.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
        });
        grp.addEventListener("mouseenter", () => lite(a.id, true));
        grp.addEventListener("mouseleave", () => lite(a.id, false));
        g.appendChild(grp);
    });
}
function lite(id, on) {
    const p = $("pin-" + id), c = $("card-" + id);
    if (p) p.classList.toggle("lit", on);
    if (c) c.classList.toggle("lit", on);
}

/* ---------------- modal ---------------- */
function nameKey(name) {
    const n = String(name || "").trim();
    return n ? "n:" + n.toLowerCase() : null;
}

function syncModalButtons() {
    const existing = findByKey(nameKey($("fName").value));

    $("btnLeave").classList.toggle("on", !!existing);
    $("btnSave").textContent = existing && existing.id === openActivity ? "Update my details" :
        existing ? "Move me here" : "Sign me up";

    const moving = existing && existing.id !== openActivity;
    $("moving").classList.toggle("on", !!moving);
    if (moving) {
        $("movingText").innerHTML = "You're currently on <b>" + esc(byId(existing.id).title) +
            "</b>. Signing up here moves your name over.";
    }
}

function openForm(actId) {
    const a = byId(actId);
    const mine = myPick();
    openActivity = actId;
    lastFocus = document.activeElement;

    $("modalGlyph").innerHTML = ICON[a.icon];
    $("modalGlyph").setAttribute("style", "background:" + a.accent);
    $("modalTitle").textContent = a.title;
    $("modalSub").textContent = "Option 0" + a.n + " · " + a.drive;
    $("fErr").classList.remove("on");

    const prior = mine ? mine.person : null;
    $("fName").value = (prior && prior.name) || (me && me.name) || "";
    $("fDrive").checked = !!(prior && prior.seats > 0);
    $("fSeats").value = prior && prior.seats > 0 ? prior.seats : 3;
    $("fSeats").disabled = !$("fDrive").checked;
    $("fNote").value = (prior && prior.note) || "";

    syncModalButtons();
    $("scrim").classList.add("on");
    setTimeout(() => $("fName").focus(), 40);
}

function closeForm() {
    $("scrim").classList.remove("on");
    openActivity = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("on"), 3200);
}

async function save() {
    const name = $("fName").value.trim();
    if (!name) {
        $("fErr").textContent = "Add your name so the group knows who's coming.";
        $("fErr").classList.add("on");
        $("fName").focus();
        return;
    }
    const key = nameKey(name);
    const person = {
        key,
        name,
        seats: $("fDrive").checked ? Math.max(0, parseInt($("fSeats").value, 10) || 0) : 0,
        /* kept out of the page on purpose — this lands in the sheet only */
        note: $("fNote").value.trim().slice(0, 220) || null
    };
    const target = openActivity;

    await pull();
    for (const id in signups) signups[id] = (signups[id] || []).filter(p => p.key !== key);
    if (!signups[target]) signups[target] = [];
    signups[target].push(person);
    saveMe({ key, name });

    closeForm();
    render();

    const ok = await post(Object.assign({ action: "save", activity: target }, person));
    if (!ok) { toast("Couldn't save — check your connection and try again."); return; }
    render();
    /* say so out loud when there's no backend, otherwise a stale cached
       copy of this file looks exactly like a successful save */
    toast(hasBackend
        ? "You're on " + byId(target).title + "."
        : "Local preview only — nothing was saved to the sheet.");
    $("card-" + target).scrollIntoView({ behavior: "smooth", block: "center" });
}

async function leave() {
    const name = $("fName").value.trim();
    if (!name) {
        $("fErr").textContent = "Type the name you signed up with so I know which one to remove.";
        $("fErr").classList.add("on");
        return;
    }
    const key = nameKey(name);
    await pull();
    for (const id in signups) signups[id] = (signups[id] || []).filter(p => p.key !== key);
    if (me && me.key === key) saveMe(null);

    closeForm();
    render();
    const ok = await post({ action: "leave", key: key, name: name });
    render();
    if (!ok) { toast("Couldn't reach the sheet — your name may still be on it."); return; }
    toast(hasBackend
        ? "Name removed. Pick another whenever."
        : "Local preview only — nothing was saved to the sheet.");
}

/* ---------------- boot ---------------- */
$("deadlineChip").textContent = DEADLINE;
buildCards();
wireChillEgg();
buildFilters();
buildSchedule();
/* both before load(), because render() runs inside it and writes to #agendaPick */
buildRibbon();
buildAgenda();
buildPins();

$("btnSave").addEventListener("click", save);
$("btnCancel").addEventListener("click", closeForm);
$("btnLeave").addEventListener("click", leave);
$("scrim").addEventListener("click", e => { if (e.target === $("scrim")) closeForm(); });
$("pickForMe").addEventListener("click", pickForMe);
$("btnIcs").addEventListener("click", downloadICS);
addEventListener("hashchange", openFromHash);

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && openActivity) { closeForm(); return; }
    if (openActivity || spinning || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= ACTIVITIES.length) spotlight(ACTIVITIES[n - 1].id, 1500);
});

$("fDrive").addEventListener("change", () => {
    $("fSeats").disabled = !$("fDrive").checked;
    if ($("fDrive").checked) $("fSeats").focus();
});
$("fName").addEventListener("input", syncModalButtons);

const topbar = $("topbar");
addEventListener("scroll", () => topbar.classList.toggle("stuck", scrollY > 8), { passive: true });
addEventListener("focus", () => { if (hasBackend && !openActivity) load(); });

load();
