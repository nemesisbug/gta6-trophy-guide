// The roadmap to the platinum: seven stages in the order to play them,
// built from the official trophy descriptions. Each step names the
// trophies it earns, by id, so the page can show live progress per stage.

// Single-moment trophies: hidden trophies tied to one story moment each.
// No published guide has confirmed whether any of them can be missed,
// so the Missables page lists them as a watch list, not as confirmed
// missables. Each note says plainly what is and is not known.
export const SINGLE_MOMENT_TROPHIES = [
  { id: 37, note: 'Leave VCIA in an aircraft outside a mission. The exact trigger is not yet confirmed in a published guide.' },
  { id: 38, note: 'Involves the Rhino tank. The exact trigger is not yet confirmed in a published guide.' },
  { id: 44, note: 'Have a cocktail on Ocean Beach. The exact bar or spot is not yet confirmed in a published guide.' },
  { id: 45, note: 'Drive a vehicle out of a showroom through the glass. The exact showroom is not yet confirmed in a published guide.' },
  { id: 46, note: 'Play bowling at the Kolt & Associates alley. The alley location is named in the description.' },
  { id: 47, note: 'Tied to a story moment with your partner. The exact trigger is not yet confirmed in a published guide.' },
  { id: 48, note: 'Counts choices across the whole game (500 on PSN). Not a single moment — it builds up as you play.' },
  { id: 49, note: 'Hints at succeeding on a second attempt. The exact trigger is not yet confirmed in a published guide.' },
  { id: 50, note: 'Tied to witnessing something strange in the world. The exact trigger is not yet confirmed in a published guide.' },
  { id: 51, note: 'A melee drive-by: knock someone down with a melee attack from a moving vehicle. Repeatable in free roam.' },
];

export const ROADMAP_STAGES = [
  {
    title: 'Before you start',
    goal: 'Set up so nothing can be lost: saves, spoilers, and the one missable.',
    steps: [
      { text: 'Turn on spoiler-free mode above if you want hidden trophies masked until you earn them.', trophyIds: [] },
      { text: 'Play on manual saves. Keep a save before every big story mission — there is no mission replay for the Chapter 1 meditation spot.', trophyIds: [] },
      { text: 'Do not use cheats. Cheats disable trophies and stop you saving, and the codes only unlock after the story anyway.', trophyIds: [] },
      { text: 'Know the one missable now: Positive Mental Attitude. The first meditation spot is Lucia’s balcony in Chapter 1.', trophyIds: [28] },
    ],
  },
  {
    title: 'Play the story',
    goal: 'Chapters 1 to 4 and the final mission. This is where most trophies land on their own.',
    steps: [
      { text: 'In Chapter 1, meditate on Lucia’s balcony before the chapter ends. This is the only missable in the game.', trophyIds: [28] },
      { text: 'Finish the opening mission Gone Fishing, then complete Chapters 1, 2, 3 and 4 in order.', trophyIds: [2, 3, 4, 5, 6] },
      { text: 'Play the named story missions as they come: Breakfast Run, The Cartel Heist, Child’s Play, Headliners, VCIA Takedown, Operation Savage Glory.', trophyIds: [8, 9, 10, 11, 12, 13] },
      { text: 'Complete the final mission to close the story.', trophyIds: [7] },
      { text: 'As you play, make choices when the game offers them — they count toward Actions Speak Louder (500 on PSN).', trophyIds: [48] },
    ],
  },
  {
    title: 'Side characters & strangers',
    goal: 'Finish every side strand. Each named character has a final-mission trophy.',
    steps: [
      { text: 'Complete the final mission for Andy, Kenton, Billy, Randy and Tyrone.', trophyIds: [22, 23, 24, 26, 27] },
      { text: 'Hunt the unique animal for Bret.', trophyIds: [29] },
      { text: 'Complete 8 mission strands for strangers across Leonida in total.', trophyIds: [25] },
      { text: 'Try the single-moment trophies as their story beats come up: the VCIA departure, the Rhino, the Ocean Beach cocktail, the showroom smash, bowling, and the melee drive-by.', trophyIds: [37, 38, 44, 45, 46, 51] },
    ],
  },
  {
    title: 'Activities',
    goal: 'The skill-based set: ranges, races, fishing, arcade, bowling, stunts and challenges.',
    steps: [
      { text: 'Try each type of activity once (9 types on PSN) — this also starts most of the trophies below.', trophyIds: [16] },
      { text: 'Gold all 42 Shooting Range challenges.', trophyIds: [17] },
      { text: 'Win a Top Fun Drone Race at all 14 locations, and win 20 different races.', trophyIds: [18, 19] },
      { text: 'Beat Cal in a fishing challenge, complete an arcade game, and play bowling at the Kolt & Associates alley.', trophyIds: [20, 21, 46] },
      { text: 'Complete 250 stunts and 50 challenges — both build up while you do everything else.', trophyIds: [15, 32] },
    ],
  },
  {
    title: 'Collectibles & exploration',
    goal: 'The long tail: meditation spots, cards, WAiNK, vehicles and the whole map.',
    steps: [
      { text: 'Meditate at all 18 spots across Leonida (the first was Lucia’s balcony in Chapter 1).', trophyIds: [28] },
      { text: 'Complete 3 collectible card sets.', trophyIds: [30] },
      { text: 'WAiNK It at 100 locations and discover 100 vehicles.', trophyIds: [31, 35] },
      { text: 'Explore all 52 areas of Leonida.', trophyIds: [42] },
    ],
  },
  {
    title: 'Robberies & money',
    goal: 'The criminal economy: vaults, trucks, gangs, laundering and property.',
    steps: [
      { text: 'Rob 5 bank vaults and escape, rob an armored truck and escape, and rob a jewelry store without being detected.', trophyIds: [40, 41, 39] },
      { text: 'Rob an illegal operation belonging to each of the 9 gangs.', trophyIds: [43] },
      { text: 'With your partner: lose a 4-star wanted level together, and rob 3 shops back-to-back without losing the wanted level.', trophyIds: [33, 34] },
      { text: 'Take down 5 enemies in a single use of Combat Focus.', trophyIds: [36] },
      { text: 'Launder $250,000 of Marked Bills through your contacts, spend $100,000 across all shops, buy all 8 garage properties, and register 10 vehicles to the Scooter Bros app.', trophyIds: [52, 53, 54, 55] },
    ],
  },
  {
    title: 'Cleanup & 100%',
    goal: 'The last two golds, then the platinum.',
    steps: [
      { text: 'Check the in-game completion stats and mop up anything left: story, side strands, collectibles, activities and exploration.', trophyIds: [] },
      { text: 'Attain 100% Completion — the hardest trophy on most guides’ lists.', trophyIds: [14] },
      { text: 'Earn the other 54 trophies and the platinum, Vice Got a Price!, pops on its own.', trophyIds: [1] },
    ],
  },
];
