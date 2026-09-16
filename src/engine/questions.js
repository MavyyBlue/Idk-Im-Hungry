import { restaurants, restaurantById } from '../data/restaurants.js';

const q = (id, stage, dimension, prompt, tag, icon, families) => ({ id, stage, dimension, prompt, tag, icon, ...(families ? { families } : {}) });

// Stage 0 = broad sensory/context, 1 = family/format, 2 = preparation/ingredient,
// 3 = branch-specific detail, 4 = nitty-gritty discriminators.
export const traitQuestions = [
  q('savory',0,'flavor','How does savory sound?','savory','🧂'),
  q('sweet',0,'flavor','How does sweet sound?','sweet','🍯'),
  q('salty',0,'flavor','Something salty?','salty','🧂'),
  q('sweet-salty',0,'flavor','Sweet and salty together?','sweet-salty','🍿'),
  q('hot',0,'temperature','Hot food?','hot','♨️'),
  q('cold',0,'temperature','Cold food?','cold','❄️'),
  q('crunchy',0,'texture','Crunchy?','crunchy','✨'),
  q('soft',0,'texture','Soft and easy?','soft','☁️'),
  q('chewy',1,'texture','Chewy in a good way?','chewy','😋'),
  q('creamy',1,'texture','Creamy?','creamy','🥛'),
  q('light',0,'heaviness','Keep it light?','light','🪶'),
  q('filling',0,'heaviness','Something filling?','filling','🍽️'),
  q('very-filling',1,'heaviness','Like… properly heavy?','very-filling','🫠'),
  q('meal',0,'meal-type','A real meal?','meal','🍽️'),
  q('snack',0,'meal-type','More snack than meal?','snack','🥨'),
  q('dessert',1,'meal-type','Dessert territory?','dessert','🍰'),
  q('breakfast-food',1,'meal-type','Breakfast food?','breakfast-food','🍳'),
  q('handheld',0,'format','Something handheld?','handheld','🤲'),
  q('bowl',1,'format','Something in a bowl?','bowl','🥣'),
  q('plate',1,'format','More of a plate-and-fork thing?','plate','🍽️'),
  q('shareable',2,'format','Something shareable?','shareable','🫶'),
  q('saucy',1,'texture','Saucy?','saucy','🥫'),
  q('quick',0,'effort','Low effort / quick pickup?','quick','⚡'),
  q('sit-down',0,'effort','Would sitting down somewhere be okay?','sit-down','🪑'),
  q('grocery-bakery',1,'effort','Would a grocery bakery run be okay?','grocery-bakery','🛒'),

  q('chicken',1,'family','Chicken?','chicken','🍗'),
  q('burger',1,'family','Burger territory?','burger','🍔'),
  q('mexican',1,'family','Mexican food?','mexican','🌮'),
  q('pizza',1,'family','Pizza?','pizza','🍕'),
  q('pasta',1,'family','Pasta?','pasta','🍝'),
  q('sandwich',1,'family','Sandwich-ish?','sandwich','🥪'),
  q('seafood',1,'family','Seafood?','seafood','🍤'),
  q('asian-style',1,'family','Asian-style food?','asian-style','🍜'),
  q('comfort',1,'family','Comfort-food territory?','comfort','🥣'),
  q('fresh',1,'family','Something fresh?','fresh','🥗'),
  q('frozen-dessert',1,'family','Frozen dessert?','frozen-dessert','🍨'),
  q('cake',1,'family','Cake?','cake','🍰'),
  q('bakery-sweet',1,'family','Bakery sweet?','bakery-sweet','🍪'),
  q('snack-side',1,'family','Side/snack food?','snack-side','🍟'),

  q('fried',2,'preparation','Fried?','fried','🔥'),
  q('grilled',2,'preparation','Grilled?','grilled','♨️'),
  q('crispy',2,'texture','Extra crispy?','crispy','✨'),
  q('spicy',2,'flavor','Spicy?','spicy','🌶️'),
  q('cheesy',2,'ingredient','Cheesy?','cheesy','🧀'),
  q('beef',2,'protein','Beef?','beef','🥩'),
  q('pork',2,'protein','Pork or bacon?','pork','🥓'),
  q('vegetarian',2,'protein','No meat?','vegetarian','🌱'),
  q('potato',2,'ingredient','Potatoes?','potato','🥔'),
  q('bread',2,'format','Something bready?','bread','🍞'),
  q('tortilla',2,'format','Tortilla situation?','tortilla','🌮'),
  q('rice',2,'format','Rice?','rice','🍚'),
  q('noodles',2,'format','Noodles?','noodles','🍜',['asian-style','pasta']),
  q('tomato-sauce',2,'sauce','Tomato/red sauce?','tomato-sauce','🍅',['pizza','pasta']),
  q('cream-sauce',2,'sauce','Creamy white sauce?','cream-sauce','🥛',['pasta','comfort']),
  q('broth',3,'sauce','Brothy/soupy?','broth','🥣',['asian-style','comfort']),

  q('tenders',3,'format','Tenders specifically?','tenders','🍗',['chicken']),
  q('wings',3,'format','Wings?','wings','🍗',['chicken']),
  q('bone-in',4,'format','Bone-in chicken okay?','bone-in','🍗',['chicken']),
  q('bbq',3,'flavor','BBQ flavor?','bbq','🍖',['chicken','pizza']),
  q('gravy',3,'sauce','Gravy?','gravy','🥣',['chicken','breakfast','comfort']),

  q('cheeseburger',3,'format','Cheeseburger specifically?','cheeseburger','🧀',['burger']),
  q('bacon',3,'ingredient','Bacon involved?','bacon','🥓',['burger','breakfast','sandwich','snack-side']),
  q('jalapeno',4,'ingredient','Jalapeños?','jalapeno','🌶️',['burger','mexican']),
  q('mushroom',4,'ingredient','Mushrooms?','mushroom','🍄',['burger']),
  q('onion',4,'ingredient','Onions helping or hurting?','onion','🧅',['burger','snack-side']),
  q('loaded',4,'topping','Loaded with toppings?','loaded','🧀',['burger','snack-side']),

  q('tacos',3,'format','Tacos?','tacos','🌮',['mexican']),
  q('burrito',3,'format','Burrito?','burrito','🌯',['mexican']),
  q('quesadilla',3,'format','Quesadilla?','quesadilla','🫓',['mexican']),
  q('nachos',3,'format','Nachos?','nachos','🧀',['mexican']),
  q('beans',4,'ingredient','Beans sound okay?','beans','🫘',['mexican']),
  q('cilantro',4,'ingredient','Cilantro okay?','cilantro','🌿',['mexican']),

  q('pepperoni',3,'ingredient','Pepperoni?','pepperoni','🍕',['pizza']),
  q('thin-crust',4,'format','Thin crust?','thin-crust','🍕',['pizza']),
  q('thick-crust',4,'format','Thicker crust?','thick-crust','🍕',['pizza']),

  q('eggs',3,'ingredient','Eggs?','eggs','🍳',['breakfast']),
  q('sausage',4,'ingredient','Breakfast sausage?','sausage','🌭',['breakfast']),
  q('ham',4,'ingredient','Ham?','ham','🥓',['breakfast','sandwich']),
  q('syrup',3,'ingredient','Syrup?','syrup','🍯',['breakfast']),
  q('cinnamon',4,'flavor','Cinnamon-y?','cinnamon','🌀',['breakfast','bakery-sweet']),
  q('biscuits-gravy',4,'format','Biscuits and gravy territory?','biscuits-gravy','🥣',['breakfast']),

  q('fried-rice',3,'format','Fried rice?','fried-rice','🍚',['asian-style']),
  q('teriyaki',4,'flavor','Teriyaki-ish?','teriyaki','🥢',['asian-style']),
  q('vegetables',4,'ingredient','Lots of vegetables okay?','vegetables','🥦',['asian-style','fresh']),

  q('shrimp',3,'protein','Shrimp?','shrimp','🍤',['seafood']),
  q('fish',3,'protein','Fish?','fish','🐟',['seafood']),
  q('fried-fish',4,'preparation','Fried fish?','fried-fish','🐟',['seafood']),
  q('grilled-fish',4,'preparation','Grilled fish?','grilled-fish','🐟',['seafood']),

  q('chili',4,'topping','Chili on it?','chili','🌶️',['snack-side']),
  q('fried-cheese',4,'format','Fried cheese situation?','fried-cheese','🧀',['snack-side']),

  q('chocolate',2,'flavor','Chocolate?','chocolate','🍫',['breakfast','frozen-dessert','cake','bakery-sweet']),
  q('vanilla',2,'flavor','Vanilla-ish?','vanilla','🌼',['frozen-dessert','cake']),
  q('fruit',2,'ingredient','Fruit in it?','fruit','🍓',['breakfast','fresh','frozen-dessert','cake']),
  q('strawberry',4,'ingredient','Strawberry specifically?','strawberry','🍓',['frozen-dessert','cake']),
  q('berries',3,'ingredient','Berries?','berries','🫐',['fresh','cake']),
  q('cream',3,'texture','Creamy whipped filling/frosting?','cream','☁️',['cake']),
  q('whipped-frosting',4,'topping','Light whipped frosting?','whipped-frosting','🍰',['cake']),
  q('frosting',3,'topping','Frosting?','frosting','🧁',['cake','bakery-sweet']),
  q('cream-cheese',4,'topping','Cream-cheese kind of rich?','cream-cheese','🍰',['cake']),
  q('layered-cake',4,'format','A layered cake?','layered-cake','🎂',['cake']),
  q('cheesecake',3,'format','Cheesecake?','cheesecake','🍰',['cake']),
  q('very-sweet',4,'flavor','Like, unapologetically sweet?','very-sweet','🍭',['cake','bakery-sweet','frozen-dessert']),
  q('cookies',3,'format','Cookies?','cookies','🍪',['bakery-sweet']),
  q('donut',3,'format','Donut?','donut','🍩',['bakery-sweet']),
  q('brownie',3,'format','Brownie?','brownie','🍫',['bakery-sweet']),
  q('glaze',4,'topping','Glazed?','glaze','🍩',['bakery-sweet']),
  q('hot-fudge',4,'topping','Hot fudge involved?','hot-fudge','🍫',['frozen-dessert'])
];

export function makeDaypartQuestion(hour = new Date().getHours()) {
  const h = Number.isFinite(Number(hour)) ? Number(hour) : 12;
  if (h >= 5 && h < 11) return { id:'time:breakfast', type:'time-context', daypart:'breakfast', dimension:'time', prompt:"It's morning — breakfast-ish?", icon:'🌅' };
  if (h >= 11 && h < 16) return { id:'time:lunch', type:'time-context', daypart:'lunch', dimension:'time', prompt:"It's around lunch time — lunch-ish food?", icon:'☀️' };
  if (h >= 16 && h < 22) return { id:'time:dinner', type:'time-context', daypart:'dinner', dimension:'time', prompt:"It's evening — dinner-ish food?", icon:'🌆' };
  return { id:'time:late', type:'time-context', daypart:'late', dimension:'time', prompt:"It's late — late-night food?", icon:'🌙' };
}

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

export function makeCandidateQuestion(candidate, round=0) {
  return {
    id:`candidate:${round}:${candidate.id}`,
    type:'candidate',
    candidateId:candidate.id,
    dimension:'specific-item',
    prompt:`What about ${candidate.name}?`,
    icon:candidate.emoji || '🍴'
  };
}

export function restaurantQuestionOrder(candidates, askedIds = new Set()) {
  return restaurants
    .map((restaurant) => ({ restaurant, coverage:candidates.filter((candidate) => candidate.restaurants.includes(restaurant.id)).length }))
    .filter(({ restaurant, coverage }) => coverage > 0 && !askedIds.has(`restaurant:${restaurant.id}`))
    .sort((a,b) => b.coverage - a.coverage || a.restaurant.name.localeCompare(b.restaurant.name))
    .map(({ restaurant }) => restaurant.id);
}

function branchEligible(question, candidates) {
  if (!question.families?.length) return true;
  const familyMatches = candidates.filter((candidate) => question.families.includes(candidate.family)).length;
  return familyMatches >= Math.min(2, candidates.length) && familyMatches / Math.max(1, candidates.length) >= 0.25;
}

export function selectTraitQuestion(candidates, askedIds = new Set(), recentDimensions = [], questionCount = 0, fastMode = false, adverseDimensions = {}) {
  const allowedStage = fastMode ? 1 : questionCount < 4 ? 1 : questionCount < 8 ? 2 : questionCount < 13 ? 3 : 4;
  const viable = traitQuestions
    .filter((question) => !askedIds.has(`trait:${question.id}`) && question.stage <= allowedStage)
    .filter((question) => branchEligible(question, candidates))
    .map((question) => {
      const matches = candidates.filter((candidate) => candidate.tags.includes(question.tag)).length;
      const ratio = candidates.length ? matches / candidates.length : 0;
      const split = 1 - Math.abs(ratio - 0.5) * 2;
      const repeatPenalty = recentDimensions.includes(question.dimension) ? 0.58 : 1;
      const adversePenalty = 1 - Math.min(0.76, (adverseDimensions?.[question.dimension] || 0) * 0.72);
      const viability = ratio >= 0.1 && ratio <= 0.9 ? 1 : 0.16;
      const stageTarget = fastMode ? 0 : questionCount < 3 ? 0 : questionCount < 7 ? 1 : questionCount < 11 ? 2 : questionCount < 16 ? 3 : 4;
      const stageFit = 1 - Math.min(0.62, Math.abs(question.stage - stageTarget) * 0.16);
      return { question, score:split * repeatPenalty * adversePenalty * viability * stageFit, ratio };
    })
    .filter(({ ratio }) => ratio > 0 && ratio < 1)
    .sort((a,b) => b.score - a.score || Math.abs(a.ratio - 0.5) - Math.abs(b.ratio - 0.5));

  return viable[0]?.question ?? null;
}

export function selectCustomTagQuestion(candidates, askedIds = new Set(), questionCount = 0) {
  if (questionCount < 7) return null;
  const counts = new Map();
  for (const candidate of candidates) {
    for (const tag of candidate.customTags || []) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  const total = candidates.length;
  const tag = [...counts.entries()]
    .filter(([key, count]) => count > 0 && count < total && !askedIds.has(`trait:custom-${key}`))
    .sort((a,b) => {
      const da = Math.abs(a[1] / total - 0.5);
      const db = Math.abs(b[1] / total - 0.5);
      return da - db || a[0].localeCompare(b[0]);
    })[0]?.[0];
  if (!tag) return null;
  const readable = tag.replace(/-/g, ' ');
  return { id:`custom-${tag}`, type:'trait', stage:4, dimension:'safe-food-keyword', tag, prompt:`Something ${readable}?`, icon:'🔖' };
}
