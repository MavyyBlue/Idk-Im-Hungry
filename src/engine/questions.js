import { restaurants, restaurantById } from '../data/restaurants.js';

// stage 0 = broad sensory/effort, 1 = family/format, 2 = preparation/ingredient,
// 3 = branch-specific nitty-gritty. Deep questions are gated so the app does not
// ask about frosting while burgers are still dominating the pool.
export const traitQuestions = [
  { id:'savory', stage:0, dimension:'flavor', prompt:'How does savory sound?', tag:'savory', icon:'🧂' },
  { id:'sweet', stage:0, dimension:'flavor', prompt:'How does sweet sound?', tag:'sweet', icon:'🍯' },
  { id:'sweet-salty', stage:0, dimension:'flavor', prompt:'Sweet and salty together?', tag:'sweet-salty', icon:'🍿' },
  { id:'hot', stage:0, dimension:'temperature', prompt:'Hot food?', tag:'hot', icon:'♨️' },
  { id:'cold', stage:0, dimension:'temperature', prompt:'Cold food?', tag:'cold', icon:'❄️' },
  { id:'crunchy', stage:0, dimension:'texture', prompt:'Crunchy?', tag:'crunchy', icon:'✨' },
  { id:'soft', stage:0, dimension:'texture', prompt:'Soft and easy?', tag:'soft', icon:'☁️' },
  { id:'light', stage:0, dimension:'heaviness', prompt:'Keep it light?', tag:'light', icon:'🪶' },
  { id:'filling', stage:0, dimension:'heaviness', prompt:'Something filling?', tag:'filling', icon:'🍽️' },
  { id:'very-filling', stage:1, dimension:'heaviness', prompt:'Like… properly heavy?', tag:'very-filling', icon:'🫠' },
  { id:'meal', stage:0, dimension:'meal-type', prompt:'A real meal?', tag:'meal', icon:'🍽️' },
  { id:'snack', stage:0, dimension:'meal-type', prompt:'More snack than meal?', tag:'snack', icon:'🥨' },
  { id:'breakfast-food', stage:1, dimension:'meal-type', prompt:'Breakfast food?', tag:'breakfast-food', icon:'🍳' },
  { id:'handheld', stage:0, dimension:'format', prompt:'Something handheld?', tag:'handheld', icon:'🤲' },
  { id:'bowl', stage:1, dimension:'format', prompt:'Something in a bowl?', tag:'bowl', icon:'🥣' },
  { id:'saucy', stage:1, dimension:'texture', prompt:'Saucy?', tag:'saucy', icon:'🥫' },
  { id:'quick', stage:0, dimension:'effort', prompt:'Low effort / quick pickup?', tag:'quick', icon:'⚡' },
  { id:'sit-down', stage:0, dimension:'effort', prompt:'Would sitting down somewhere be okay?', tag:'sit-down', icon:'🪑' },
  { id:'grocery-bakery', stage:1, dimension:'effort', prompt:'Would a grocery bakery run be okay?', tag:'grocery-bakery', icon:'🛒' },

  { id:'chicken', stage:1, dimension:'family', prompt:'Chicken?', tag:'chicken', icon:'🍗' },
  { id:'burger', stage:1, dimension:'family', prompt:'Burger territory?', tag:'burger', icon:'🍔' },
  { id:'mexican', stage:1, dimension:'family', prompt:'Mexican food?', tag:'mexican', icon:'🌮' },
  { id:'pizza', stage:1, dimension:'family', prompt:'Pizza?', tag:'pizza', icon:'🍕' },
  { id:'pasta', stage:1, dimension:'family', prompt:'Pasta?', tag:'pasta', icon:'🍝' },
  { id:'sandwich', stage:1, dimension:'family', prompt:'Sandwich-ish?', tag:'sandwich', icon:'🥪' },
  { id:'seafood', stage:1, dimension:'family', prompt:'Seafood?', tag:'seafood', icon:'🍤' },
  { id:'frozen-dessert', stage:1, dimension:'family', prompt:'Frozen dessert?', tag:'frozen-dessert', icon:'🍨' },
  { id:'cake', stage:1, dimension:'family', prompt:'Cake?', tag:'cake', icon:'🍰' },
  { id:'bakery-sweet', stage:1, dimension:'family', prompt:'Bakery sweet?', tag:'bakery-sweet', icon:'🍪' },

  { id:'fried', stage:2, dimension:'preparation', prompt:'Fried?', tag:'fried', icon:'🔥' },
  { id:'grilled', stage:2, dimension:'preparation', prompt:'Grilled?', tag:'grilled', icon:'♨️' },
  { id:'spicy', stage:2, dimension:'flavor', prompt:'Spicy?', tag:'spicy', icon:'🌶️' },
  { id:'cheesy', stage:2, dimension:'ingredient', prompt:'Cheesy?', tag:'cheesy', icon:'🧀' },
  { id:'beef', stage:2, dimension:'protein', prompt:'Beef?', tag:'beef', icon:'🥩' },
  { id:'pork', stage:2, dimension:'protein', prompt:'Pork or bacon?', tag:'pork', icon:'🥓' },
  { id:'vegetarian', stage:2, dimension:'protein', prompt:'No meat?', tag:'vegetarian', icon:'🌱' },
  { id:'potato', stage:2, dimension:'ingredient', prompt:'Potatoes?', tag:'potato', icon:'🥔' },
  { id:'bread', stage:2, dimension:'format', prompt:'Something bready?', tag:'bread', icon:'🍞' },
  { id:'tortilla', stage:2, dimension:'format', prompt:'Tortilla situation?', tag:'tortilla', icon:'🌮' },
  { id:'rice', stage:2, dimension:'format', prompt:'Rice?', tag:'rice', icon:'🍚' },
  { id:'tomato-sauce', stage:2, dimension:'sauce', prompt:'Tomato/red sauce?', tag:'tomato-sauce', icon:'🍅', families:['pizza','pasta'] },
  { id:'cream-sauce', stage:2, dimension:'sauce', prompt:'Creamy white sauce?', tag:'cream-sauce', icon:'🥛', families:['pasta','comfort'] },
  { id:'bacon', stage:3, dimension:'ingredient', prompt:'Bacon involved?', tag:'bacon', icon:'🥓', families:['burger','breakfast','sandwich','snack-side'] },
  { id:'jalapeno', stage:3, dimension:'ingredient', prompt:'Jalapeños?', tag:'jalapeno', icon:'🌶️', families:['burger','mexican'] },
  { id:'bbq', stage:3, dimension:'flavor', prompt:'BBQ flavor?', tag:'bbq', icon:'🍖', families:['chicken','pizza'] },
  { id:'gravy', stage:3, dimension:'sauce', prompt:'Gravy?', tag:'gravy', icon:'🥣', families:['chicken','breakfast','comfort'] },
  { id:'beans', stage:3, dimension:'ingredient', prompt:'Beans sound okay?', tag:'beans', icon:'🫘', families:['mexican'] },
  { id:'syrup', stage:3, dimension:'ingredient', prompt:'Syrup?', tag:'syrup', icon:'🍯', families:['breakfast'] },
  { id:'chocolate', stage:2, dimension:'flavor', prompt:'Chocolate?', tag:'chocolate', icon:'🍫', families:['breakfast','frozen-dessert','cake','bakery-sweet'] },
  { id:'vanilla', stage:2, dimension:'flavor', prompt:'Vanilla-ish?', tag:'vanilla', icon:'🌼', families:['frozen-dessert','cake'] },
  { id:'fruit', stage:2, dimension:'ingredient', prompt:'Fruit in it?', tag:'fruit', icon:'🍓', families:['breakfast','fresh','frozen-dessert','cake'] },
  { id:'berries', stage:3, dimension:'ingredient', prompt:'Berries?', tag:'berries', icon:'🫐', families:['fresh','cake'] },
  { id:'cream', stage:3, dimension:'texture', prompt:'Creamy whipped filling/frosting?', tag:'cream', icon:'☁️', families:['cake'] },
  { id:'whipped-frosting', stage:3, dimension:'topping', prompt:'Light whipped frosting?', tag:'whipped-frosting', icon:'🍰', families:['cake'] },
  { id:'cream-cheese', stage:3, dimension:'topping', prompt:'Cream-cheese kind of rich?', tag:'cream-cheese', icon:'🍰', families:['cake'] },
  { id:'layered-cake', stage:3, dimension:'format', prompt:'A layered cake?', tag:'layered-cake', icon:'🎂', families:['cake'] },
  { id:'cheesecake', stage:3, dimension:'format', prompt:'Cheesecake?', tag:'cheesecake', icon:'🍰', families:['cake'] },
  { id:'cookies', stage:3, dimension:'format', prompt:'Cookies?', tag:'cookies', icon:'🍪', families:['bakery-sweet'] },
  { id:'donut', stage:3, dimension:'format', prompt:'Donut?', tag:'donut', icon:'🍩', families:['bakery-sweet'] },
  { id:'brownie', stage:3, dimension:'format', prompt:'Brownie?', tag:'brownie', icon:'🍫', families:['bakery-sweet'] }
];

export function makeRestaurantQuestion(restaurantId) {
  const restaurant = restaurantById[restaurantId];
  return {
    id:`restaurant:${restaurantId}`,
    type:'restaurant',
    restaurantId,
    prompt:`Does ${restaurant.name} sound good?`,
    icon:restaurant.kind === 'store' ? '🛒' : '📍'
  };
}

export function makeCandidateQuestion(candidate) {
  return {
    id:`candidate:${candidate.id}`,
    type:'candidate',
    candidateId:candidate.id,
    dimension:'specific-item',
    prompt:`What about ${candidate.name}?`,
    icon:candidate.emoji || '🍴'
  };
}

export function restaurantQuestionOrder(candidates, askedIds = new Set()) {
  return restaurants
    .map((restaurant) => ({
      restaurant,
      coverage:candidates.filter((candidate) => candidate.restaurants.includes(restaurant.id)).length
    }))
    .filter(({ restaurant, coverage }) => coverage > 0 && !askedIds.has(`restaurant:${restaurant.id}`))
    .sort((a,b) => b.coverage - a.coverage || a.restaurant.name.localeCompare(b.restaurant.name))
    .map(({ restaurant }) => restaurant.id);
}

function branchEligible(question, candidates) {
  if (!question.families?.length) return true;
  const familyMatches = candidates.filter((candidate) => question.families.includes(candidate.family)).length;
  return familyMatches >= Math.min(3, candidates.length) && familyMatches / Math.max(1, candidates.length) >= 0.28;
}

export function selectTraitQuestion(candidates, askedIds = new Set(), recentDimensions = [], questionCount = 0, fastMode = false) {
  const allowedStage = fastMode ? 1 : questionCount < 4 ? 1 : questionCount < 8 ? 2 : 3;
  const viable = traitQuestions
    .filter((question) => !askedIds.has(`trait:${question.id}`) && question.stage <= allowedStage)
    .filter((question) => branchEligible(question, candidates))
    .map((question) => {
      const matches = candidates.filter((candidate) => candidate.tags.includes(question.tag)).length;
      const ratio = candidates.length ? matches / candidates.length : 0;
      const split = 1 - Math.abs(ratio - 0.5) * 2;
      const repeatPenalty = recentDimensions.includes(question.dimension) ? 0.68 : 1;
      const viability = ratio >= 0.12 && ratio <= 0.88 ? 1 : 0.18;
      const stageTarget = fastMode ? 0 : questionCount < 3 ? 0 : questionCount < 7 ? 1 : questionCount < 11 ? 2 : 3;
      const stageFit = 1 - Math.min(0.6, Math.abs(question.stage - stageTarget) * 0.17);
      return { question, score:split * repeatPenalty * viability * stageFit, ratio };
    })
    .filter(({ ratio }) => ratio > 0 && ratio < 1)
    .sort((a,b) => b.score - a.score || Math.abs(a.ratio - 0.5) - Math.abs(b.ratio - 0.5));

  return viable[0]?.question ?? null;
}
