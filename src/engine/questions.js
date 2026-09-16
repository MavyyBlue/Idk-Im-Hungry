import { restaurants, restaurantById } from '../data/restaurants.js';

export const traitQuestions = [
  { id:'savory', dimension:'flavor', prompt:'How does savory sound?', tag:'savory', icon:'🧂' },
  { id:'sweet', dimension:'flavor', prompt:'How does sweet sound?', tag:'sweet', icon:'🍯' },
  { id:'salty', dimension:'flavor', prompt:'Something salty?', tag:'salty', icon:'🧂' },
  { id:'hot', dimension:'temperature', prompt:'Hot food?', tag:'hot', icon:'♨️' },
  { id:'cold', dimension:'temperature', prompt:'Cold food?', tag:'cold', icon:'❄️' },
  { id:'crunchy', dimension:'texture', prompt:'Crunchy?', tag:'crunchy', icon:'✨' },
  { id:'soft', dimension:'texture', prompt:'Soft and easy?', tag:'soft', icon:'☁️' },
  { id:'filling', dimension:'heaviness', prompt:'Something filling?', tag:'filling', icon:'🍽️' },
  { id:'light', dimension:'heaviness', prompt:'Keep it light?', tag:'light', icon:'🪶' },
  { id:'meal', dimension:'meal-type', prompt:'A real meal?', tag:'meal', icon:'🍽️' },
  { id:'snack', dimension:'meal-type', prompt:'More snack than meal?', tag:'snack', icon:'🥨' },
  { id:'breakfast', dimension:'meal-type', prompt:'Breakfast food?', tag:'breakfast', icon:'🍳' },
  { id:'chicken', dimension:'protein', prompt:'Chicken?', tag:'chicken', icon:'🍗' },
  { id:'beef', dimension:'protein', prompt:'Beef?', tag:'beef', icon:'🍔' },
  { id:'vegetarian', dimension:'protein', prompt:'No meat?', tag:'vegetarian', icon:'🌱' },
  { id:'potato', dimension:'ingredient', prompt:'Potatoes?', tag:'potato', icon:'🥔' },
  { id:'cheesy', dimension:'ingredient', prompt:'Cheesy?', tag:'cheesy', icon:'🧀' },
  { id:'bread', dimension:'format', prompt:'Something bready?', tag:'bread', icon:'🍞' },
  { id:'tortilla', dimension:'format', prompt:'Tortilla situation?', tag:'tortilla', icon:'🌮' },
  { id:'handheld', dimension:'format', prompt:'Something handheld?', tag:'handheld', icon:'🤲' },
  { id:'quick', dimension:'effort', prompt:'Low effort / quick pickup?', tag:'quick', icon:'⚡' },
  { id:'sit-down', dimension:'effort', prompt:'Would sitting down somewhere be okay?', tag:'sit-down', icon:'🪑' }
];

export function makeRestaurantQuestion(restaurantId) {
  const restaurant = restaurantById[restaurantId];
  return {
    id:`restaurant:${restaurantId}`,
    type:'restaurant',
    restaurantId,
    prompt:`Does ${restaurant.name} sound good?`,
    icon:'📍'
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

export function selectTraitQuestion(candidates, askedIds = new Set(), recentDimensions = []) {
  const viable = traitQuestions
    .filter((question) => !askedIds.has(`trait:${question.id}`))
    .map((question) => {
      const matches = candidates.filter((candidate) => candidate.tags.includes(question.tag)).length;
      const ratio = candidates.length ? matches / candidates.length : 0;
      const split = 1 - Math.abs(ratio - 0.5) * 2;
      const repeatPenalty = recentDimensions.includes(question.dimension) ? 0.7 : 1;
      const viability = ratio >= 0.15 && ratio <= 0.85 ? 1 : 0.25;
      return { question, score:split * repeatPenalty * viability, ratio };
    })
    .sort((a,b) => b.score - a.score || Math.abs(a.ratio - 0.5) - Math.abs(b.ratio - 0.5));

  return viable[0]?.question ?? null;
}
