const f = (id, name, emoji, family, subfamily, restaurants, tags) => ({
  id, name, emoji, family, subfamily, restaurants, tags:[family, subfamily, ...tags]
});

const baseFoods = [
  // Chicken — specific enough to act on, broad enough to work across establishments.
  f('classic-chicken-tenders','Classic chicken tenders','🍗','chicken','tenders',['chicken-express','sonic','whataburger'],['savory','salty','hot','crunchy','fried','filling','meal','handheld','quick']),
  f('spicy-chicken-tenders','Spicy chicken tenders','🌶️','chicken','tenders',['chicken-express'],['savory','salty','hot','crunchy','fried','spicy','filling','meal','handheld','quick']),
  f('chicken-tenders-gravy','Chicken tenders with gravy','🍗','chicken','tenders',['chicken-express'],['savory','salty','hot','crunchy','fried','saucy','gravy','filling','meal','comfort']),
  f('crispy-chicken-sandwich','Crispy chicken sandwich','🥪','chicken','sandwich',['chick-fil-a','mcdonalds','burger-king','whataburger'],['savory','salty','hot','crunchy','fried','bread','handheld','filling','meal','quick']),
  f('spicy-chicken-sandwich','Spicy chicken sandwich','🌶️','chicken','sandwich',['chick-fil-a','mcdonalds','burger-king'],['savory','salty','hot','crunchy','fried','spicy','bread','handheld','filling','meal','quick']),
  f('grilled-chicken-sandwich','Grilled chicken sandwich','🥪','chicken','sandwich',['chick-fil-a','whataburger'],['savory','hot','soft','grilled','bread','handheld','light','meal','quick']),
  f('grilled-chicken-plate','Grilled chicken plate','🍗','chicken','plate',['ihop'],['savory','hot','soft','grilled','light','meal','sit-down']),
  f('bone-in-fried-chicken','Bone-in fried chicken','🍗','chicken','fried-chicken',['chicken-express'],['savory','salty','hot','crunchy','fried','bone-in','filling','meal','comfort']),
  f('hot-wings','Hot wings','🌶️','chicken','wings',['hideaway-pizza'],['savory','salty','hot','crunchy','fried','spicy','saucy','handheld','filling','meal']),
  f('bbq-wings','BBQ wings','🍗','chicken','wings',['hideaway-pizza'],['savory','sweet-salty','hot','crunchy','saucy','bbq','handheld','filling','meal']),

  // Burgers / beef.
  f('plain-hamburger','Plain hamburger','🍔','burger','classic',['sonic','mcdonalds','burger-king','whataburger','freddys','braums','lot-a-burger','tjs'],['savory','salty','hot','soft','beef','bread','handheld','filling','meal','quick']),
  f('classic-cheeseburger','Classic cheeseburger','🍔','burger','cheeseburger',['sonic','mcdonalds','burger-king','whataburger','freddys','braums','lot-a-burger','tjs'],['savory','salty','hot','soft','beef','cheesy','bread','handheld','filling','meal','quick']),
  f('double-cheeseburger','Double cheeseburger','🍔','burger','cheeseburger',['sonic','mcdonalds','burger-king','whataburger','freddys','braums'],['savory','salty','hot','soft','beef','cheesy','bread','handheld','very-filling','meal','quick']),
  f('bacon-cheeseburger','Bacon cheeseburger','🥓','burger','cheeseburger',['sonic','whataburger','freddys','braums'],['savory','salty','hot','soft','beef','pork','bacon','cheesy','bread','handheld','very-filling','meal','quick']),
  f('jalapeno-burger','Jalapeño cheeseburger','🌶️','burger','cheeseburger',['whataburger'],['savory','salty','hot','soft','beef','spicy','jalapeno','cheesy','bread','handheld','filling','meal','quick']),
  f('mushroom-swiss-burger','Mushroom Swiss burger','🍄','burger','specialty',['tjs'],['savory','hot','soft','beef','mushroom','cheesy','bread','handheld','filling','meal']),
  f('patty-melt','Patty melt','🥪','burger','melt',['whataburger'],['savory','salty','hot','crispy','beef','cheesy','bread','griddled','handheld','filling','meal','quick']),
  f('chili-cheese-coney','Chili cheese coney','🌭','burger','hot-dog',['sonic'],['savory','salty','hot','soft','beef','chili','cheesy','bread','handheld','filling','meal','quick']),

  // Mexican / tortilla / rice.
  f('crunchy-beef-tacos','Crunchy beef tacos','🌮','mexican','tacos',['abelardos'],['savory','salty','hot','crunchy','beef','tortilla','handheld','filling','meal','quick']),
  f('soft-beef-tacos','Soft beef tacos','🌮','mexican','tacos',['abelardos'],['savory','salty','hot','soft','beef','tortilla','handheld','filling','meal','quick']),
  f('chicken-tacos','Chicken tacos','🌮','mexican','tacos',['abelardos'],['savory','salty','hot','soft','chicken','tortilla','handheld','filling','meal','quick']),
  f('street-style-tacos','Street-style tacos','🌮','mexican','tacos',['abelardos'],['savory','salty','hot','soft','tortilla','onion','cilantro','handheld','filling','meal']),
  f('beef-burrito','Beef burrito','🌯','mexican','burrito',['abelardos'],['savory','salty','hot','soft','beef','tortilla','rice','beans','handheld','very-filling','meal','quick']),
  f('chicken-burrito','Chicken burrito','🌯','mexican','burrito',['abelardos'],['savory','salty','hot','soft','chicken','tortilla','rice','beans','handheld','very-filling','meal','quick']),
  f('bean-cheese-burrito','Bean & cheese burrito','🌯','mexican','burrito',['abelardos'],['savory','salty','hot','soft','vegetarian','beans','cheesy','tortilla','handheld','filling','meal','quick']),
  f('cheese-quesadilla','Cheese quesadilla','🫓','mexican','quesadilla',['abelardos'],['savory','salty','hot','chewy','vegetarian','cheesy','tortilla','handheld','filling','meal','quick']),
  f('chicken-quesadilla','Chicken quesadilla','🫓','mexican','quesadilla',['abelardos'],['savory','salty','hot','chewy','chicken','cheesy','tortilla','handheld','filling','meal','quick']),
  f('loaded-nachos','Loaded nachos','🧀','mexican','nachos',['abelardos'],['savory','salty','hot','crunchy','beef','cheesy','beans','tortilla','saucy','very-filling','snack','meal']),
  f('chips-queso','Chips & queso','🧀','mexican','chips-dip',['abelardos'],['savory','salty','hot','crunchy','vegetarian','cheesy','tortilla','snack','shareable']),
  f('rice-beans-plate','Rice & beans plate','🍚','mexican','plate',['abelardos'],['savory','hot','soft','vegetarian','rice','beans','bowl','filling','meal']),

  // Pizza.
  f('pepperoni-pizza','Pepperoni pizza','🍕','pizza','red-sauce',['hideaway-pizza'],['savory','salty','hot','chewy','pork','pepperoni','cheesy','bread','tomato-sauce','handheld','filling','meal']),
  f('cheese-pizza','Cheese pizza','🍕','pizza','red-sauce',['hideaway-pizza'],['savory','salty','hot','chewy','vegetarian','cheesy','bread','tomato-sauce','handheld','filling','meal']),
  f('sausage-pizza','Sausage pizza','🍕','pizza','red-sauce',['hideaway-pizza'],['savory','salty','hot','chewy','pork','sausage','cheesy','bread','tomato-sauce','handheld','filling','meal']),
  f('supreme-pizza','Supreme pizza','🍕','pizza','loaded',['hideaway-pizza'],['savory','salty','hot','chewy','meat','vegetables','cheesy','bread','tomato-sauce','handheld','very-filling','meal']),
  f('veggie-pizza','Veggie pizza','🍕','pizza','vegetable',['hideaway-pizza'],['savory','hot','chewy','vegetarian','vegetables','cheesy','bread','tomato-sauce','handheld','filling','meal']),
  f('bbq-chicken-pizza','BBQ chicken pizza','🍕','pizza','bbq',['hideaway-pizza'],['savory','sweet-salty','hot','chewy','chicken','bbq','cheesy','bread','handheld','filling','meal']),
  f('thin-crust-pizza','Thin crust pizza','🍕','pizza','thin-crust',['hideaway-pizza'],['savory','salty','hot','crunchy','cheesy','bread','tomato-sauce','handheld','light','meal']),
  f('deep-dish-pizza','Thick crust pizza','🍕','pizza','thick-crust',['hideaway-pizza'],['savory','salty','hot','soft','chewy','cheesy','bread','tomato-sauce','very-filling','meal']),

  // Breakfast.
  f('buttermilk-pancakes','Buttermilk pancakes','🥞','breakfast','pancakes',['ihop','eggberts','midway-cafe','mcdonalds'],['sweet','hot','soft','bread','syrup','vegetarian','filling','breakfast-food','sit-down']),
  f('chocolate-chip-pancakes','Chocolate chip pancakes','🥞','breakfast','pancakes',['ihop'],['sweet','hot','soft','bread','chocolate','syrup','vegetarian','very-sweet','filling','breakfast-food','sit-down']),
  f('fruit-pancakes','Fruit-topped pancakes','🍓','breakfast','pancakes',['ihop'],['sweet','hot','soft','bread','fruit','syrup','vegetarian','filling','breakfast-food','sit-down']),
  f('classic-waffle','Classic waffle','🧇','breakfast','waffles',['ihop','eggberts','midway-cafe'],['sweet','hot','crunchy','bread','syrup','vegetarian','filling','breakfast-food','sit-down']),
  f('french-toast','French toast','🍞','breakfast','french-toast',['ihop','eggberts','midway-cafe'],['sweet','hot','soft','bread','cinnamon','syrup','vegetarian','filling','breakfast-food','sit-down']),
  f('eggs-bacon-toast','Eggs, bacon & toast','🍳','breakfast','eggs',['ihop','eggberts','midway-cafe'],['savory','salty','hot','soft','eggs','pork','bacon','bread','filling','breakfast-food','sit-down']),
  f('biscuits-gravy','Biscuits & gravy','🥣','breakfast','biscuits-gravy',['eggberts','midway-cafe'],['savory','salty','hot','soft','bread','gravy','comfort','very-filling','breakfast-food','sit-down']),
  f('crispy-hash-browns','Crispy hash browns','🥔','breakfast','potatoes',['ihop','eggberts','midway-cafe','mcdonalds'],['savory','salty','hot','crunchy','potato','vegetarian','light','breakfast-food','quick']),
  f('sausage-breakfast-sandwich','Sausage breakfast sandwich','🥪','breakfast','sandwich',['mcdonalds','burger-king','whataburger'],['savory','salty','hot','soft','eggs','pork','sausage','cheesy','bread','handheld','filling','breakfast-food','quick']),
  f('chicken-breakfast-biscuit','Chicken breakfast biscuit','🥪','breakfast','sandwich',['chick-fil-a'],['savory','salty','hot','soft','chicken','fried','bread','handheld','filling','breakfast-food','quick']),
  f('breakfast-burrito','Breakfast burrito','🌯','breakfast','burrito',['sonic','mcdonalds','abelardos'],['savory','salty','hot','soft','eggs','tortilla','cheesy','handheld','filling','breakfast-food','quick']),
  f('breakfast-bowl','Breakfast bowl','🍳','breakfast','bowl',['eggberts'],['savory','salty','hot','soft','eggs','potato','cheesy','bowl','very-filling','breakfast-food','sit-down']),

  // Pasta / comfort / warm bowls.
  f('spaghetti-meat-sauce','Spaghetti with meat sauce','🍝','pasta','red-sauce',[],['savory','hot','soft','beef','pasta','tomato-sauce','saucy','very-filling','meal','fork']),
  f('spaghetti-marinara','Spaghetti marinara','🍝','pasta','red-sauce',[],['savory','hot','soft','vegetarian','pasta','tomato-sauce','saucy','filling','meal','fork']),
  f('chicken-alfredo','Chicken Alfredo','🍝','pasta','cream-sauce',[],['savory','salty','hot','soft','chicken','pasta','cream-sauce','cheesy','saucy','very-filling','meal','fork']),
  f('fettuccine-alfredo','Fettuccine Alfredo','🍝','pasta','cream-sauce',[],['savory','salty','hot','soft','vegetarian','pasta','cream-sauce','cheesy','saucy','very-filling','meal','fork']),
  f('mac-cheese','Mac & cheese','🧀','comfort','mac-cheese',[],['savory','salty','hot','soft','vegetarian','pasta','cheesy','cream-sauce','comfort','filling','meal','fork']),
  f('chili-bowl','Bowl of chili','🥣','comfort','chili',['sonic'],['savory','salty','hot','soft','beef','chili','saucy','bowl','very-filling','meal','spoon']),
  f('mashed-potatoes-gravy','Mashed potatoes & gravy','🥔','comfort','potatoes',['chicken-express'],['savory','salty','hot','soft','potato','gravy','comfort','filling','side','spoon']),
  f('chicken-rice-bowl','Chicken & rice bowl','🍚','comfort','rice-bowl',[],['savory','hot','soft','chicken','rice','bowl','filling','meal','fork']),

  // Sandwiches / fresh.
  f('turkey-sandwich','Turkey sandwich','🥪','sandwich','deli',[],['savory','cold','soft','turkey','bread','handheld','light','meal']),
  f('ham-cheese-sandwich','Ham & cheese sandwich','🥪','sandwich','deli',[],['savory','salty','cold','soft','pork','ham','cheesy','bread','handheld','light','meal']),
  f('blt','BLT','🥓','sandwich','deli',[],['savory','salty','cold','crunchy','pork','bacon','lettuce','tomato','bread','handheld','light','meal']),
  f('grilled-cheese','Grilled cheese','🥪','sandwich','grilled',[],['savory','salty','hot','crispy','vegetarian','cheesy','bread','handheld','comfort','filling','meal']),
  f('club-sandwich','Club sandwich','🥪','sandwich','club',[],['savory','salty','cold','crunchy','turkey','pork','bacon','bread','handheld','filling','meal']),
  f('chicken-caesar-salad','Chicken Caesar salad','🥗','fresh','salad',['chick-fil-a','ihop'],['savory','cold','crunchy','chicken','lettuce','cheesy','fresh','light','meal','fork']),
  f('garden-salad','Garden salad','🥗','fresh','salad',['ihop','hideaway-pizza'],['savory','cold','crunchy','vegetarian','lettuce','vegetables','fresh','light','meal','fork']),
  f('fruit-yogurt-bowl','Fruit & yogurt bowl','🍓','fresh','fruit-bowl',[],['sweet','cold','soft','vegetarian','fruit','berries','dairy','fresh','light','breakfast-food','snack','spoon']),

  // Asian-style comfort choices (generic local/home/delivery possibilities, no API claims).
  f('orange-chicken-rice','Orange chicken with rice','🍊','asian-style','rice-bowl',[],['savory','sweet-salty','hot','crispy','chicken','rice','saucy','bowl','filling','meal','fork']),
  f('teriyaki-chicken-rice','Teriyaki chicken with rice','🍚','asian-style','rice-bowl',[],['savory','sweet-salty','hot','soft','chicken','rice','teriyaki','saucy','bowl','filling','meal','fork']),
  f('beef-fried-rice','Beef fried rice','🍚','asian-style','fried-rice',[],['savory','salty','hot','soft','beef','rice','eggs','bowl','filling','meal','fork']),
  f('chicken-fried-rice','Chicken fried rice','🍚','asian-style','fried-rice',[],['savory','salty','hot','soft','chicken','rice','eggs','bowl','filling','meal','fork']),
  f('lo-mein','Lo mein noodles','🍜','asian-style','noodles',[],['savory','salty','hot','soft','pasta','noodles','saucy','bowl','filling','meal','fork']),
  f('ramen','Ramen','🍜','asian-style','soup-noodles',[],['savory','salty','hot','soft','broth','noodles','saucy','bowl','filling','meal','spoon']),

  // Seafood.
  f('fried-shrimp','Fried shrimp','🍤','seafood','shrimp',[],['savory','salty','hot','crunchy','fried','shrimp','handheld','filling','meal']),
  f('grilled-shrimp','Grilled shrimp','🍤','seafood','shrimp',[],['savory','salty','hot','soft','grilled','shrimp','light','meal','fork']),
  f('fish-sandwich','Fish sandwich','🐟','seafood','fish-sandwich',[],['savory','salty','hot','crunchy','fried','fish','bread','handheld','filling','meal']),
  f('fish-chips','Fish & chips','🐟','seafood','fried-fish',[],['savory','salty','hot','crunchy','fried','fish','potato','very-filling','meal']),
  f('grilled-fish-plate','Grilled fish plate','🐟','seafood','grilled-fish',[],['savory','hot','soft','grilled','fish','light','meal','fork']),

  // Sides / snacky savory.
  f('classic-fries','Classic fries','🍟','snack-side','fries',['sonic','mcdonalds','burger-king','whataburger','freddys','braums','chick-fil-a'],['savory','salty','hot','crunchy','potato','vegetarian','snack','side','quick']),
  f('loaded-fries','Loaded fries','🍟','snack-side','fries',['sonic','freddys'],['savory','salty','hot','crunchy','potato','cheesy','bacon','saucy','filling','snack','side','quick']),
  f('tater-tots','Tater tots','🥔','snack-side','potatoes',['sonic'],['savory','salty','hot','crunchy','potato','vegetarian','snack','side','quick']),
  f('onion-rings','Onion rings','🧅','snack-side','fried-vegetable',['sonic','burger-king','lot-a-burger'],['savory','salty','hot','crunchy','fried','vegetarian','snack','side','quick']),
  f('mozzarella-sticks','Mozzarella sticks','🧀','snack-side','fried-cheese',[],['savory','salty','hot','crunchy','fried','vegetarian','cheesy','handheld','snack','side']),
  f('soft-pretzel','Soft pretzel','🥨','snack-side','bread-snack',[],['savory','salty','hot','soft','vegetarian','bread','handheld','snack']),
  f('popcorn','Buttery popcorn','🍿','snack-side','popcorn',[],['savory','salty','hot','crunchy','vegetarian','buttery','handheld','light','snack']),

  // Frozen desserts.
  f('vanilla-ice-cream','Vanilla ice cream','🍨','frozen-dessert','ice-cream',['braums'],['sweet','cold','soft','vanilla','dairy','creamy','dessert','snack','quick']),
  f('chocolate-ice-cream','Chocolate ice cream','🍫','frozen-dessert','ice-cream',['braums'],['sweet','cold','soft','chocolate','dairy','creamy','dessert','snack','quick']),
  f('strawberry-ice-cream','Strawberry ice cream','🍓','frozen-dessert','ice-cream',['braums'],['sweet','cold','soft','fruit','strawberry','dairy','creamy','dessert','snack','quick']),
  f('hot-fudge-sundae','Hot fudge sundae','🍨','frozen-dessert','sundae',['braums'],['sweet','cold','soft','chocolate','hot-fudge','dairy','creamy','very-sweet','dessert','snack','quick']),
  f('vanilla-milkshake','Vanilla milkshake','🥤','frozen-dessert','milkshake',['braums','freddys','sonic'],['sweet','cold','soft','vanilla','dairy','creamy','drink','dessert','snack','quick']),
  f('chocolate-milkshake','Chocolate milkshake','🥤','frozen-dessert','milkshake',['braums','freddys','sonic'],['sweet','cold','soft','chocolate','dairy','creamy','drink','dessert','snack','quick']),
  f('strawberry-milkshake','Strawberry milkshake','🥤','frozen-dessert','milkshake',['braums','freddys','sonic'],['sweet','cold','soft','fruit','strawberry','dairy','creamy','drink','dessert','snack','quick']),
  f('frozen-custard','Frozen custard','🍦','frozen-dessert','custard',['freddys'],['sweet','cold','soft','vanilla','dairy','rich','creamy','dessert','snack','quick']),

  // Cakes / bakery / sweets — including the user's motivating Walmart example.
  f('walmart-chantilly-berries-cake','Walmart Chantilly & Berries cake','🍰','cake','chantilly',['walmart'],['sweet','cold','soft','vanilla','fruit','berries','cream','whipped-frosting','layered-cake','grocery-bakery','dessert']),
  f('strawberry-shortcake','Strawberry shortcake','🍓','cake','fruit-cake',[],['sweet','cold','soft','vanilla','fruit','strawberry','cream','whipped-frosting','layered-cake','dessert']),
  f('chocolate-layer-cake','Chocolate layer cake','🍫','cake','chocolate-cake',['walmart'],['sweet','soft','chocolate','rich','frosting','layered-cake','grocery-bakery','very-sweet','dessert']),
  f('vanilla-birthday-cake','Vanilla frosted cake','🎂','cake','vanilla-cake',['walmart'],['sweet','soft','vanilla','frosting','layered-cake','grocery-bakery','very-sweet','dessert']),
  f('red-velvet-cake','Red velvet cake','🍰','cake','red-velvet',['walmart'],['sweet','soft','chocolate','cream-cheese','frosting','layered-cake','grocery-bakery','rich','dessert']),
  f('carrot-cake','Carrot cake','🥕','cake','spiced-cake',['walmart'],['sweet','soft','spiced','cream-cheese','frosting','layered-cake','grocery-bakery','rich','dessert']),
  f('plain-cheesecake','Classic cheesecake','🍰','cake','cheesecake',['walmart'],['sweet','cold','soft','cream-cheese','rich','creamy','grocery-bakery','dessert']),
  f('strawberry-cheesecake','Strawberry cheesecake','🍓','cake','cheesecake',['walmart'],['sweet','cold','soft','fruit','strawberry','cream-cheese','rich','creamy','grocery-bakery','dessert']),
  f('chocolate-chip-cookies','Chocolate chip cookies','🍪','bakery-sweet','cookies',['walmart'],['sweet','soft','chewy','chocolate','buttery','grocery-bakery','handheld','dessert','snack']),
  f('fudge-brownie','Fudge brownie','🍫','bakery-sweet','brownie',['walmart'],['sweet','soft','chewy','chocolate','rich','grocery-bakery','handheld','very-sweet','dessert','snack']),
  f('glazed-donut','Glazed donut','🍩','bakery-sweet','donut',['walmart'],['sweet','soft','fried','glaze','grocery-bakery','handheld','dessert','snack']),
  f('chocolate-donut','Chocolate frosted donut','🍩','bakery-sweet','donut',['walmart'],['sweet','soft','fried','chocolate','frosting','grocery-bakery','handheld','dessert','snack'])
];


const slug = (value='') => String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const generatedFoods = [];
const add = (name, emoji, family, subfamily, tags=[], restaurants=[]) => {
  const id = `expanded-${slug(family)}-${slug(name)}`;
  generatedFoods.push(f(id, name, emoji, family, subfamily, restaurants, tags));
};

// V0.5 catalog expansion. These are local archetypes, not claims about live restaurant availability.
// The goal is breadth + specificity: enough realistic leaves for the engine to keep drilling.

// Chicken: preparations, sauces, bowls, wraps, and comfort plates.
[
  ['Honey BBQ chicken tenders','🍯',['tenders','fried','bbq','sweet-salty','crispy','handheld']],
  ['Garlic parmesan chicken tenders','🧄',['tenders','fried','garlic','parmesan','cheesy','crispy','handheld']],
  ['Buffalo chicken tenders','🌶️',['tenders','fried','buffalo','spicy','saucy','crispy','handheld']],
  ['Nashville hot chicken tenders','🌶️',['tenders','fried','spicy','very-spicy','crispy','handheld']],
  ['Lemon pepper chicken tenders','🍋',['tenders','fried','lemon-pepper','crispy','handheld']],
  ['Chicken tender basket with fries','🍗',['tenders','fried','fries','potato','crispy','very-filling','meal']],
  ['Chicken tender basket with mashed potatoes','🍗',['tenders','fried','mashed-potatoes','potato','comfort','very-filling','meal']],
  ['Chicken and waffles','🧇',['fried','waffles','sweet-salty','syrup','very-filling','meal','breakfast-food']],
  ['Buffalo chicken sandwich','🌶️',['sandwich','fried','buffalo','spicy','saucy','bread','handheld','meal']],
  ['BBQ chicken sandwich','🥪',['sandwich','grilled','bbq','sweet-salty','bread','handheld','meal']],
  ['Chicken bacon ranch sandwich','🥓',['sandwich','chicken','bacon','pork','ranch','creamy','bread','handheld','meal']],
  ['Chicken parmesan sandwich','🥪',['sandwich','fried','tomato-sauce','parmesan','cheesy','bread','handheld','meal']],
  ['Chicken ranch wrap','🌯',['wrap','chicken','ranch','creamy','tortilla','handheld','meal']],
  ['Buffalo chicken wrap','🌯',['wrap','chicken','buffalo','spicy','saucy','tortilla','handheld','meal']],
  ['Grilled chicken Caesar wrap','🌯',['wrap','grilled','caesar','lettuce','cheesy','tortilla','handheld','meal']],
  ['Chicken rice bowl','🍚',['rice-bowl','chicken','rice','bowl','filling','meal']],
  ['Spicy chicken rice bowl','🌶️',['rice-bowl','chicken','rice','spicy','bowl','filling','meal']],
  ['Teriyaki chicken rice bowl','🍚',['rice-bowl','chicken','rice','teriyaki','sweet-salty','saucy','bowl','meal']],
  ['Chicken gravy bowl','🥣',['bowl','chicken','gravy','mashed-potatoes','comfort','very-filling','meal']],
  ['Chicken pot pie','🥧',['pot-pie','chicken','pastry','creamy','vegetables','comfort','very-filling','meal']],
  ['Chicken noodle soup','🍲',['soup','chicken','noodles','broth','soft','comfort','light','meal']],
  ['Creamy chicken soup','🥣',['soup','chicken','cream','creamy','soft','comfort','filling','meal']],
  ['Chicken fried steak','🍽️',['fried','gravy','crispy','beef-style','comfort','very-filling','meal']],
].forEach(([n,e,t])=>add(n,e,'chicken',t[0],['savory','hot',...t.slice(1)]));

// Burgers, hot dogs, and beef-forward handhelds.
const burgerToppings = [
  ['Bacon ranch cheeseburger',['bacon','pork','ranch','cheesy']],
  ['BBQ bacon cheeseburger',['bacon','pork','bbq','cheesy','sweet-salty']],
  ['Jalapeño bacon cheeseburger',['bacon','pork','jalapeno','spicy','cheesy']],
  ['Mushroom Swiss cheeseburger',['mushroom','swiss','cheesy']],
  ['Caramelized onion cheeseburger',['onion','cheesy','sweet-salty']],
  ['Chili cheeseburger',['chili','cheesy','saucy']],
  ['Guacamole cheeseburger',['avocado','guacamole','cheesy','creamy']],
  ['Pepper jack burger',['pepper-jack','cheesy','spicy']],
  ['Blue cheese burger',['blue-cheese','cheesy','rich']],
  ['Fried egg burger',['eggs','cheesy','very-filling']],
  ['Double bacon cheeseburger',['double','bacon','pork','cheesy','very-filling']],
  ['Triple cheeseburger',['triple','cheesy','very-filling']],
  ['Slider burgers',['sliders','shareable','handheld']],
  ['Cheeseburger sliders',['sliders','cheesy','shareable','handheld']],
];
burgerToppings.forEach(([n,t])=>add(n,'🍔','burger','cheeseburger',['savory','salty','hot','beef','bread','handheld','meal',...t]));
[
  ['Classic hot dog','🌭',['hot-dog','beef','bread','handheld']],
  ['Chili dog','🌭',['hot-dog','beef','chili','saucy','bread','handheld']],
  ['Chili cheese dog','🌭',['hot-dog','beef','chili','cheesy','saucy','bread','handheld']],
  ['Corn dog','🌭',['corn-dog','fried','beef','crispy','handheld']],
  ['Beef patty melt','🥪',['melt','beef','onion','cheesy','bread','crispy','handheld']],
  ['Philly cheesesteak','🥪',['cheesesteak','beef','onion','peppers','cheesy','bread','handheld']],
  ['Roast beef sandwich','🥪',['sandwich','beef','bread','handheld']],
].forEach(([n,e,t])=>add(n,e,'burger',t[0],['savory','salty','hot','filling','meal',...t.slice(1)]));

// Mexican and Tex-Mex.
const mexProteins = [
  ['ground beef','beef'],['shredded chicken','chicken'],['grilled chicken','chicken'],['steak','beef'],['carnitas','pork'],['beans','vegetarian']
];
for (const [label,protein] of mexProteins) {
  add(`${label} soft tacos`,'🌮','mexican','tacos',['savory','hot','soft',protein,'tortilla','handheld','meal','tacos']);
  add(`${label} crunchy tacos`,'🌮','mexican','tacos',['savory','hot','crunchy',protein,'tortilla','handheld','meal','tacos']);
  add(`${label} burrito`,'🌯','mexican','burrito',['savory','hot','soft',protein,'tortilla','rice','burrito','handheld','very-filling','meal']);
  add(`${label} burrito bowl`,'🍚','mexican','burrito-bowl',['savory','hot',protein,'rice','beans','bowl','very-filling','meal']);
  add(`${label} quesadilla`,'🫓','mexican','quesadilla',['savory','hot',protein,'cheesy','tortilla','handheld','filling','meal']);
}
[
  ['Birria tacos','🌮',['tacos','beef','broth','saucy','tortilla','handheld','meal']],
  ['Fish tacos','🌮',['tacos','fish','seafood','tortilla','handheld','meal']],
  ['Shrimp tacos','🍤',['tacos','shrimp','shellfish','seafood','tortilla','handheld','meal']],
  ['Loaded beef nachos','🧀',['nachos','beef','cheesy','beans','tortilla','crispy','shareable','meal']],
  ['Loaded chicken nachos','🧀',['nachos','chicken','cheesy','beans','tortilla','crispy','shareable','meal']],
  ['Cheese nachos','🧀',['nachos','vegetarian','cheesy','tortilla','crispy','snack']],
  ['Bean tostadas','🌮',['tostada','vegetarian','beans','tortilla','crunchy','meal']],
  ['Chicken enchiladas','🫔',['enchiladas','chicken','cheesy','saucy','tortilla','meal']],
  ['Beef enchiladas','🫔',['enchiladas','beef','cheesy','saucy','tortilla','meal']],
  ['Cheese enchiladas','🫔',['enchiladas','vegetarian','cheesy','saucy','tortilla','meal']],
  ['Tamales','🫔',['tamales','corn','soft','handheld','meal']],
  ['Chips and salsa','🌶️',['chips-dip','vegetarian','tortilla','tomato','spicy','crunchy','snack','shareable']],
  ['Chips and guacamole','🥑',['chips-dip','vegetarian','tortilla','avocado','guacamole','creamy','crunchy','snack','shareable']],
  ['Mexican street corn','🌽',['street-corn','vegetarian','corn','creamy','cheesy','snack','side']],
].forEach(([n,e,t])=>add(n,e,'mexican',t[0],['savory','hot',...t.slice(1)]));

// Pizza: crust + topping combinations.
const pizzaCrusts = [
  ['Thin crust','thin-crust','crunchy'],['Hand-tossed','hand-tossed','chewy'],['Thick crust','thick-crust','soft']
];
const pizzaToppings = [
  ['cheese',['vegetarian','cheesy']],['pepperoni',['pepperoni','pork','cheesy']],['sausage',['sausage','pork','cheesy']],
  ['bacon',['bacon','pork','cheesy']],['mushroom',['mushroom','vegetarian','cheesy']],['veggie',['vegetarian','vegetables','cheesy']],
  ['supreme',['meat','vegetables','loaded','cheesy']],['meat lovers',['beef','pork','meat','loaded','cheesy']],
  ['jalapeño pepperoni',['pepperoni','pork','jalapeno','spicy','cheesy']],['pineapple ham',['ham','pork','pineapple','sweet-salty','cheesy']],
  ['BBQ chicken',['chicken','bbq','sweet-salty','cheesy']],['buffalo chicken',['chicken','buffalo','spicy','saucy','cheesy']]
];
for (const [crust,ctag,texture] of pizzaCrusts) for (const [top,tags] of pizzaToppings) {
  add(`${crust} ${top} pizza`,'🍕','pizza',ctag,['savory','hot',texture,'bread','tomato-sauce','handheld','meal',ctag,...tags]);
}
[
  ['White sauce chicken pizza','🍕',['white-pizza','chicken','cream-sauce','cheesy','bread','meal']],
  ['Margherita pizza','🍕',['margherita','vegetarian','tomato','basil','cheesy','bread','meal']],
  ['Garlic cheese pizza','🧄',['garlic','vegetarian','garlic','cheesy','bread','meal']],
  ['Pizza rolls','🍕',['pizza-rolls','fried','crispy','cheesy','tomato-sauce','handheld','snack']],
  ['Pizza bagels','🥯',['pizza-bagel','bread','cheesy','tomato-sauce','handheld','snack']],
].forEach(([n,e,t])=>add(n,e,'pizza',t[0],['savory','hot',...t.slice(1)]));

// Breakfast and brunch.
const pancakeFlavors = [
  ['Blueberry',['blueberry','berries','fruit']],['Strawberry',['strawberry','berries','fruit']],['Banana',['banana','fruit']],
  ['Chocolate chip',['chocolate','very-sweet']],['Cinnamon',['cinnamon']],['Peanut butter chocolate',['peanut','peanut-butter','chocolate','rich']]
];
pancakeFlavors.forEach(([label,t])=>add(`${label} pancakes`,'🥞','breakfast','pancakes',['sweet','hot','soft','bread','syrup','breakfast-food','meal',...t]));
const waffleFlavors = [
  ['Classic',['syrup']],['Strawberry',['strawberry','berries','fruit','syrup']],['Blueberry',['blueberry','berries','fruit','syrup']],
  ['Chocolate chip',['chocolate','syrup']],['Chicken and',['chicken','fried','sweet-salty','syrup']]
];
waffleFlavors.forEach(([label,t])=>add(label==='Chicken and'?'Chicken and waffles':`${label} waffles`,'🧇','breakfast','waffles',['sweet','hot','crunchy','bread','breakfast-food','meal',...t]));
[
  ['Scrambled eggs and toast','🍳',['eggs','bread','savory','soft','breakfast-food','meal']],
  ['Fried eggs and toast','🍳',['eggs','bread','savory','crispy','breakfast-food','meal']],
  ['Eggs and sausage','🍳',['eggs','sausage','pork','savory','breakfast-food','meal']],
  ['Eggs and ham','🍳',['eggs','ham','pork','savory','breakfast-food','meal']],
  ['Denver omelet','🍳',['eggs','ham','peppers','onion','cheesy','savory','breakfast-food','meal']],
  ['Cheese omelet','🍳',['eggs','cheesy','vegetarian','savory','breakfast-food','meal']],
  ['Veggie omelet','🍳',['eggs','vegetables','vegetarian','savory','breakfast-food','meal']],
  ['Meat lovers omelet','🍳',['eggs','bacon','sausage','ham','pork','cheesy','very-filling','breakfast-food','meal']],
  ['Breakfast tacos','🌮',['eggs','tortilla','cheesy','handheld','savory','breakfast-food','meal']],
  ['Bacon breakfast burrito','🌯',['eggs','bacon','pork','tortilla','cheesy','handheld','savory','breakfast-food','meal']],
  ['Sausage breakfast burrito','🌯',['eggs','sausage','pork','tortilla','cheesy','handheld','savory','breakfast-food','meal']],
  ['Steak breakfast burrito','🌯',['eggs','beef','tortilla','cheesy','handheld','savory','breakfast-food','meal']],
  ['Biscuits with sausage gravy','🥣',['biscuits-gravy','sausage','pork','gravy','bread','comfort','very-filling','breakfast-food','meal']],
  ['Cinnamon roll','🌀',['cinnamon-roll','sweet','cinnamon','frosting','bread','breakfast-food','dessert']],
  ['Breakfast croissant sandwich','🥐',['sandwich','eggs','cheesy','bread','handheld','savory','breakfast-food','meal']],
  ['Bagel with cream cheese','🥯',['bagel','cream-cheese','bread','vegetarian','handheld','breakfast-food','light']],
  ['Peanut butter toast','🍞',['toast','peanut','peanut-butter','bread','handheld','breakfast-food','light']],
  ['Avocado toast','🥑',['toast','avocado','bread','vegetarian','handheld','breakfast-food','light']],
  ['Oatmeal with berries','🥣',['oatmeal','berries','fruit','soft','warm','bowl','breakfast-food','light']],
  ['Oatmeal with peanut butter','🥣',['oatmeal','peanut','peanut-butter','soft','warm','bowl','breakfast-food','filling']],
  ['Yogurt parfait','🍓',['yogurt','dairy','berries','fruit','cold','creamy','breakfast-food','light']],
].forEach(([n,e,t])=>add(n,e,'breakfast',t[0],['hot',...t.slice(1)]));

// Pasta and Italian-style comfort.
const pastaShapes = [['Spaghetti','spaghetti'],['Fettuccine','fettuccine'],['Penne','penne'],['Rotini','rotini']];
const pastaSauces = [
  ['marinara',['tomato-sauce','vegetarian']],['meat sauce',['tomato-sauce','beef']],['Alfredo',['cream-sauce','creamy','cheesy','vegetarian']],
  ['chicken Alfredo',['cream-sauce','creamy','cheesy','chicken']],['pesto',['pesto','basil','vegetarian']],['garlic butter',['garlic','buttery','vegetarian']]
];
for (const [shape,stag] of pastaShapes) for (const [sauce,tags] of pastaSauces) {
  add(`${shape} with ${sauce}`,'🍝','pasta',stag,['savory','hot','soft','pasta','noodles','saucy','fork','filling','meal',...tags]);
}
[
  ['Baked ziti','🍝',['baked-pasta','tomato-sauce','cheesy','very-filling','meal']],
  ['Lasagna','🍝',['lasagna','beef','tomato-sauce','cheesy','very-filling','meal']],
  ['Cheese ravioli','🍝',['ravioli','vegetarian','cheesy','tomato-sauce','filling','meal']],
  ['Meat ravioli','🍝',['ravioli','beef','tomato-sauce','filling','meal']],
  ['Stuffed shells','🍝',['stuffed-shells','vegetarian','cheesy','tomato-sauce','filling','meal']],
  ['Chicken parmesan pasta','🍝',['chicken-parmesan','chicken','fried','tomato-sauce','cheesy','very-filling','meal']],
  ['Shrimp Alfredo pasta','🍤',['alfredo','shrimp','shellfish','seafood','cream-sauce','cheesy','very-filling','meal']],
  ['Garlic shrimp pasta','🍤',['garlic-pasta','shrimp','shellfish','seafood','garlic','buttery','filling','meal']],
].forEach(([n,e,t])=>add(n,e,'pasta',t[0],['savory','hot','soft','pasta','fork',...t.slice(1)]));

// Sandwiches, melts, wraps, and subs.
[
  ['Turkey and Swiss sandwich','🥪',['deli','turkey','swiss','cheesy','bread','cold','handheld','meal']],
  ['Turkey bacon club','🥓',['club','turkey','bacon','pork','bread','cold','handheld','meal']],
  ['Ham and Swiss sandwich','🥪',['deli','ham','pork','swiss','cheesy','bread','cold','handheld','meal']],
  ['Roast beef and cheddar sandwich','🥪',['deli','beef','cheddar','cheesy','bread','handheld','meal']],
  ['Tuna salad sandwich','🥪',['deli','tuna','fish','seafood','creamy','bread','cold','handheld','meal']],
  ['Egg salad sandwich','🥪',['deli','eggs','creamy','bread','cold','handheld','meal']],
  ['Peanut butter and jelly sandwich','🥪',['pbj','peanut','peanut-butter','jelly','sweet','bread','handheld','meal']],
  ['Peanut butter banana sandwich','🥪',['pb-banana','peanut','peanut-butter','banana','sweet','bread','handheld','meal']],
  ['Grilled ham and cheese','🥪',['melt','ham','pork','cheesy','bread','hot','crispy','handheld','meal']],
  ['Tuna melt','🥪',['melt','tuna','fish','seafood','cheesy','bread','hot','crispy','handheld','meal']],
  ['Turkey melt','🥪',['melt','turkey','cheesy','bread','hot','crispy','handheld','meal']],
  ['Chicken salad sandwich','🥪',['deli','chicken','creamy','bread','cold','handheld','meal']],
  ['Italian sub','🥖',['sub','salami','ham','pork','cheesy','bread','cold','handheld','meal']],
  ['Meatball sub','🥖',['sub','beef','tomato-sauce','cheesy','bread','hot','handheld','very-filling','meal']],
  ['Chicken parmesan sub','🥖',['sub','chicken','fried','tomato-sauce','cheesy','bread','hot','handheld','meal']],
  ['Buffalo chicken sub','🥖',['sub','chicken','buffalo','spicy','saucy','bread','hot','handheld','meal']],
  ['Veggie hummus wrap','🌯',['wrap','vegetarian','hummus','vegetables','tortilla','cold','handheld','light','meal']],
  ['Turkey ranch wrap','🌯',['wrap','turkey','ranch','creamy','tortilla','cold','handheld','meal']],
  ['Ham cheddar wrap','🌯',['wrap','ham','pork','cheddar','cheesy','tortilla','cold','handheld','meal']],
  ['BLT wrap','🌯',['wrap','bacon','pork','lettuce','tomato','tortilla','cold','handheld','meal']],
].forEach(([n,e,t])=>add(n,e,'sandwich',t[0],['savory',...t.slice(1)]));

// Asian-style rice, noodle, dumpling, and sushi possibilities.
const bowlProteins = [
  ['chicken','chicken'],['beef','beef'],['tofu','vegetarian'],['shrimp','shrimp']
];
const bowlSauces = [
  ['teriyaki',['teriyaki','sweet-salty']],['spicy garlic',['spicy','garlic']],['sesame',['sesame','nutty']],['sweet chili',['sweet-salty','spicy']]
];
for (const [protein,ptag] of bowlProteins) for (const [sauce,stags] of bowlSauces) {
  const shell = ptag==='shrimp' ? ['shellfish','seafood'] : [];
  add(`${sauce} ${protein} rice bowl`,'🍚','asian-style','rice-bowl',['savory','hot',ptag,...shell,'rice','saucy','bowl','filling','meal',...stags]);
  add(`${sauce} ${protein} noodles`,'🍜','asian-style','noodles',['savory','hot',ptag,...shell,'noodles','saucy','bowl','filling','meal',...stags]);
}
[
  ['Chicken lo mein','🍜',['lo-mein','chicken','noodles','saucy','meal']],
  ['Beef lo mein','🍜',['lo-mein','beef','noodles','saucy','meal']],
  ['Shrimp lo mein','🍤',['lo-mein','shrimp','shellfish','seafood','noodles','saucy','meal']],
  ['Vegetable lo mein','🍜',['lo-mein','vegetarian','vegetables','noodles','saucy','meal']],
  ['Chicken fried rice','🍚',['fried-rice','chicken','rice','eggs','meal']],
  ['Beef fried rice','🍚',['fried-rice','beef','rice','eggs','meal']],
  ['Shrimp fried rice','🍤',['fried-rice','shrimp','shellfish','seafood','rice','eggs','meal']],
  ['Vegetable fried rice','🍚',['fried-rice','vegetarian','vegetables','rice','eggs','meal']],
  ['Pork dumplings','🥟',['dumplings','pork','handheld','snack','meal']],
  ['Chicken dumplings','🥟',['dumplings','chicken','handheld','snack','meal']],
  ['Vegetable dumplings','🥟',['dumplings','vegetarian','handheld','snack','meal']],
  ['Pork egg rolls','🥢',['egg-rolls','pork','fried','crispy','handheld','snack']],
  ['Vegetable egg rolls','🥢',['egg-rolls','vegetarian','fried','crispy','handheld','snack']],
  ['Crab rangoon','🦀',['rangoon','crab','shellfish','seafood','cream-cheese','fried','crispy','handheld','snack']],
  ['Miso soup','🥣',['soup','miso','broth','soft','light','meal']],
  ['Chicken ramen','🍜',['ramen','chicken','broth','noodles','bowl','meal']],
  ['Spicy ramen','🌶️',['ramen','spicy','broth','noodles','bowl','meal']],
  ['Beef ramen','🍜',['ramen','beef','broth','noodles','bowl','meal']],
  ['California roll','🍣',['sushi','crab','shellfish','seafood','rice','cold','handheld','meal']],
  ['Spicy tuna roll','🍣',['sushi','tuna','fish','seafood','spicy','rice','cold','handheld','meal']],
  ['Salmon avocado roll','🍣',['sushi','salmon','fish','seafood','avocado','rice','cold','handheld','meal']],
  ['Shrimp tempura roll','🍤',['sushi','shrimp','shellfish','seafood','fried','crispy','rice','cold','handheld','meal']],
  ['Vegetable sushi roll','🍣',['sushi','vegetarian','vegetables','rice','cold','handheld','light','meal']],
].forEach(([n,e,t])=>add(n,e,'asian-style',t[0],['savory','hot',...t.slice(1)]));

// Seafood and shellfish.
[
  ['Coconut shrimp','🍤',['shrimp','shellfish','fried','crispy','sweet-salty','meal']],
  ['Garlic butter shrimp','🍤',['shrimp','shellfish','garlic','buttery','saucy','meal']],
  ['Shrimp scampi','🍤',['shrimp','shellfish','garlic','buttery','pasta','meal']],
  ['Shrimp basket with fries','🍤',['shrimp','shellfish','fried','crispy','potato','fries','very-filling','meal']],
  ['Crab cakes','🦀',['crab','shellfish','fried','crispy','meal']],
  ['Crab legs','🦀',['crab','shellfish','buttery','meal']],
  ['Lobster tail','🦞',['lobster','shellfish','buttery','rich','meal']],
  ['Lobster roll','🦞',['lobster','shellfish','creamy','bread','handheld','meal']],
  ['Fried scallops','🐚',['scallops','shellfish','fried','crispy','meal']],
  ['Seared scallops','🐚',['scallops','shellfish','soft','rich','meal']],
  ['Fried catfish','🐟',['catfish','fish','fried','crispy','meal']],
  ['Grilled salmon','🐟',['salmon','fish','grilled','light','meal']],
  ['Blackened salmon','🐟',['salmon','fish','spicy','grilled','meal']],
  ['Baked tilapia','🐟',['tilapia','fish','baked','light','meal']],
  ['Fish tacos','🌮',['fish','tortilla','handheld','meal']],
  ['Tuna poke bowl','🍚',['tuna','fish','rice','cold','bowl','fresh','meal']],
  ['Salmon poke bowl','🍚',['salmon','fish','rice','cold','bowl','fresh','meal']],
].forEach(([n,e,t])=>add(n,e,'seafood',t[0],['savory','hot','seafood',...t.slice(1)]));

// Soups, stews, and bowls.
[
  ['Tomato soup','🍅',['tomato-soup','vegetarian','tomato','broth','soft','light']],
  ['Broccoli cheddar soup','🥦',['cheddar-soup','vegetarian','broccoli','cheesy','creamy','filling']],
  ['Potato soup','🥔',['potato-soup','potato','creamy','comfort','filling']],
  ['Loaded potato soup','🥔',['potato-soup','potato','bacon','pork','cheesy','creamy','very-filling']],
  ['French onion soup','🧅',['onion-soup','onion','broth','cheesy','bread','filling']],
  ['Beef stew','🥣',['stew','beef','potato','vegetables','broth','very-filling']],
  ['Chicken tortilla soup','🥣',['tortilla-soup','chicken','tortilla','tomato','broth','spicy','filling']],
  ['Taco soup','🥣',['taco-soup','beef','beans','tomato','broth','spicy','filling']],
  ['Vegetable soup','🥣',['vegetable-soup','vegetarian','vegetables','broth','light']],
  ['Minestrone soup','🥣',['minestrone','vegetarian','vegetables','pasta','tomato','broth','light']],
  ['Clam chowder','🥣',['chowder','clam','shellfish','seafood','creamy','rich','filling']],
  ['Chicken and dumplings','🥣',['dumplings','chicken','gravy','soft','comfort','very-filling']],
].forEach(([n,e,t])=>add(n,e,'comfort',t[0],['savory','hot','bowl','meal',...t.slice(1)]));

// BBQ, steakhouse, and hearty plates.
const bbqMeats = [
  ['pulled pork','pork'],['brisket','beef'],['smoked chicken','chicken'],['sausage','pork']
];
for (const [meat,tag] of bbqMeats) {
  add(`${meat} BBQ sandwich`,'🥪','bbq','sandwich',['savory','hot',tag,'bbq','smoky','saucy','bread','handheld','meal']);
  add(`${meat} BBQ plate`,'🍖','bbq','plate',['savory','hot',tag,'bbq','smoky','saucy','plate','very-filling','meal']);
  add(`${meat} loaded baked potato`,'🥔','bbq','loaded-potato',['savory','hot',tag,'bbq','potato','cheesy','saucy','very-filling','meal']);
}
[
  ['BBQ ribs','🍖',['ribs','pork','bbq','smoky','saucy','very-filling','meal']],
  ['BBQ chicken wings','🍗',['wings','chicken','bbq','smoky','saucy','handheld','meal']],
  ['BBQ nachos','🧀',['nachos','pork','bbq','cheesy','tortilla','crispy','shareable','meal']],
  ['Sirloin steak','🥩',['steak','beef','grilled','very-filling','meal']],
  ['Ribeye steak','🥩',['steak','beef','grilled','rich','very-filling','meal']],
  ['Steak and baked potato','🥩',['steak','beef','grilled','potato','very-filling','meal']],
  ['Steak and mashed potatoes','🥩',['steak','beef','grilled','potato','comfort','very-filling','meal']],
  ['Steak tips with gravy','🥩',['steak-tips','beef','gravy','saucy','very-filling','meal']],
  ['Meatloaf and mashed potatoes','🍽️',['meatloaf','beef','potato','gravy','comfort','very-filling','meal']],
].forEach(([n,e,t])=>add(n,e,t[0]==='steak'||t[0]==='steak-tips'||t[0]==='meatloaf'?'comfort':'bbq',t[0],['savory','hot',...t.slice(1)]));

// Mediterranean and Middle Eastern-style possibilities.
[
  ['Chicken gyro','🥙',['gyro','chicken','pita','tzatziki','creamy','handheld','meal']],
  ['Beef gyro','🥙',['gyro','beef','pita','tzatziki','creamy','handheld','meal']],
  ['Lamb gyro','🥙',['gyro','lamb','pita','tzatziki','creamy','handheld','meal']],
  ['Falafel pita','🥙',['falafel','vegetarian','chickpea','fried','pita','handheld','meal']],
  ['Chicken shawarma wrap','🌯',['shawarma','chicken','tortilla','garlic','handheld','meal']],
  ['Beef shawarma wrap','🌯',['shawarma','beef','tortilla','garlic','handheld','meal']],
  ['Chicken shawarma rice bowl','🍚',['shawarma-bowl','chicken','rice','garlic','bowl','meal']],
  ['Beef shawarma rice bowl','🍚',['shawarma-bowl','beef','rice','garlic','bowl','meal']],
  ['Falafel rice bowl','🍚',['falafel-bowl','vegetarian','chickpea','rice','bowl','meal']],
  ['Hummus and pita','🫓',['hummus','vegetarian','chickpea','pita','creamy','snack','shareable']],
  ['Greek salad','🥗',['greek-salad','vegetarian','fresh','lettuce','feta','olives','cold','light','meal']],
  ['Chicken Greek salad','🥗',['greek-salad','chicken','fresh','lettuce','feta','olives','cold','light','meal']],
  ['Lamb kebab plate','🍢',['kebab','lamb','grilled','rice','plate','meal']],
  ['Chicken kebab plate','🍢',['kebab','chicken','grilled','rice','plate','meal']],
].forEach(([n,e,t])=>add(n,e,'mediterranean',t[0],['savory',...t.slice(1)]));

// Indian-style possibilities.
[
  ['Butter chicken with rice','🍛',['curry','chicken','rice','cream','creamy','saucy','bowl','meal']],
  ['Chicken tikka masala','🍛',['curry','chicken','tomato','cream','spicy','saucy','bowl','meal']],
  ['Chicken curry','🍛',['curry','chicken','spicy','saucy','bowl','meal']],
  ['Beef curry','🍛',['curry','beef','spicy','saucy','bowl','meal']],
  ['Lamb curry','🍛',['curry','lamb','spicy','saucy','bowl','meal']],
  ['Chana masala','🍛',['curry','vegetarian','chickpea','spicy','saucy','bowl','meal']],
  ['Palak paneer','🍛',['paneer','vegetarian','spinach','cheesy','creamy','bowl','meal']],
  ['Paneer tikka masala','🍛',['paneer','vegetarian','tomato','cream','spicy','saucy','bowl','meal']],
  ['Chicken biryani','🍚',['biryani','chicken','rice','spiced','bowl','meal']],
  ['Lamb biryani','🍚',['biryani','lamb','rice','spiced','bowl','meal']],
  ['Vegetable biryani','🍚',['biryani','vegetarian','vegetables','rice','spiced','bowl','meal']],
  ['Garlic naan','🫓',['naan','vegetarian','garlic','bread','handheld','side']],
  ['Butter naan','🫓',['naan','vegetarian','buttery','bread','handheld','side']],
  ['Samosas','🥟',['samosa','vegetarian','potato','fried','crispy','handheld','snack']],
].forEach(([n,e,t])=>add(n,e,'indian-style',t[0],['savory','hot',...t.slice(1)]));

// Salads, bowls, and lighter fresh foods.
[
  ['Cobb salad','🥗',['salad','chicken','bacon','pork','eggs','lettuce','cold','fresh','meal']],
  ['Chef salad','🥗',['salad','ham','turkey','eggs','cheesy','lettuce','cold','fresh','meal']],
  ['Southwest chicken salad','🥗',['salad','chicken','beans','corn','spicy','lettuce','cold','fresh','meal']],
  ['Buffalo chicken salad','🥗',['salad','chicken','buffalo','spicy','lettuce','cold','fresh','meal']],
  ['Taco salad','🥗',['salad','beef','beans','cheesy','tortilla','lettuce','cold','fresh','meal']],
  ['Strawberry chicken salad','🍓',['salad','chicken','strawberry','berries','fruit','lettuce','cold','fresh','meal']],
  ['Caesar salad','🥗',['salad','vegetarian','lettuce','parmesan','cheesy','cold','fresh','light','meal']],
  ['Greek grain bowl','🥗',['grain-bowl','vegetarian','rice','feta','olives','fresh','bowl','meal']],
  ['Chicken grain bowl','🍚',['grain-bowl','chicken','rice','vegetables','fresh','bowl','meal']],
  ['Steak grain bowl','🍚',['grain-bowl','beef','rice','vegetables','fresh','bowl','meal']],
  ['Avocado chicken bowl','🥑',['grain-bowl','chicken','rice','avocado','fresh','bowl','meal']],
].forEach(([n,e,t])=>add(n,e,'fresh',t[0],['savory',...t.slice(1)]));

// Snacks, sides, convenience foods, and grazing options.
[
  ['Cheese fries','🍟',['fries','potato','cheesy','crispy','snack','side']],
  ['Chili cheese fries','🍟',['fries','potato','chili','cheesy','saucy','crispy','snack','meal']],
  ['Garlic parmesan fries','🍟',['fries','potato','garlic','parmesan','cheesy','crispy','snack','side']],
  ['Sweet potato fries','🍠',['fries','sweet-potato','sweet-salty','crispy','snack','side']],
  ['Potato wedges','🥔',['potatoes','potato','crispy','snack','side']],
  ['Loaded tater tots','🥔',['tots','potato','bacon','pork','cheesy','crispy','snack','meal']],
  ['Cheese curds','🧀',['fried-cheese','cheesy','fried','crispy','handheld','snack']],
  ['Jalapeño poppers','🌶️',['poppers','jalapeno','spicy','cream-cheese','fried','crispy','handheld','snack']],
  ['Fried pickles','🥒',['fried-pickles','pickles','fried','crispy','handheld','snack']],
  ['Pretzel bites with cheese','🥨',['pretzel','bread','cheesy','soft','handheld','snack','shareable']],
  ['Nacho cheese pretzel','🥨',['pretzel','bread','cheesy','soft','handheld','snack']],
  ['Peanut butter crackers','🥜',['crackers','peanut','peanut-butter','salty','crunchy','handheld','snack']],
  ['Cheese and crackers','🧀',['crackers','cheesy','salty','crunchy','handheld','snack']],
  ['Trail mix with peanuts','🥜',['trail-mix','peanut','nuts','sweet-salty','crunchy','handheld','snack']],
  ['Popcorn chicken','🍗',['popcorn-chicken','chicken','fried','crispy','handheld','snack']],
  ['Mini corn dogs','🌭',['corn-dog','beef','fried','crispy','handheld','snack']],
  ['Frozen pizza','🍕',['frozen-food','pizza','cheesy','bread','quick','at-home','meal']],
  ['Frozen chicken nuggets','🍗',['frozen-food','chicken','fried','crispy','quick','at-home','meal']],
  ['Microwave mac and cheese','🧀',['microwave','pasta','cheesy','creamy','quick','at-home','meal']],
  ['Instant ramen','🍜',['instant','noodles','broth','quick','at-home','meal']],
  ['Deli rotisserie chicken','🍗',['deli','chicken','savory','quick','grocery','meal']],
].forEach(([n,e,t])=>add(n,e,'snack-side',t[0],['savory','hot',...t.slice(1)]));

// Frozen desserts, shakes, sundaes, and blended sweets.
const iceFlavors = [
  ['Vanilla',['vanilla']],['Chocolate',['chocolate']],['Strawberry',['strawberry','fruit']],['Cookies and cream',['cookies','chocolate']],
  ['Mint chocolate chip',['mint','chocolate']],['Cookie dough',['cookie-dough']],['Butter pecan',['pecan','tree-nut','nuts','buttery']],
  ['Peanut butter cup',['peanut','peanut-butter','chocolate']],['Rocky road',['chocolate','marshmallow','tree-nut','nuts']],['Birthday cake',['cake','frosting','very-sweet']]
];
for (const [flavor,tags] of iceFlavors) {
  add(`${flavor} ice cream`,'🍨','frozen-dessert','ice-cream',['sweet','cold','soft','dairy','creamy','dessert','snack',...tags]);
  add(`${flavor} milkshake`,'🥤','frozen-dessert','milkshake',['sweet','cold','soft','dairy','creamy','drink','dessert','snack',...tags]);
}
[
  ['Banana split','🍌',['sundae','banana','fruit','dairy','chocolate','very-sweet','dessert']],
  ['Brownie sundae','🍨',['sundae','brownie','chocolate','dairy','hot-fudge','very-sweet','dessert']],
  ['Strawberry sundae','🍓',['sundae','strawberry','fruit','dairy','very-sweet','dessert']],
  ['Peanut butter sundae','🥜',['sundae','peanut','peanut-butter','dairy','very-sweet','dessert']],
  ['Chocolate malt','🥤',['malt','chocolate','dairy','drink','dessert']],
  ['Vanilla malt','🥤',['malt','vanilla','dairy','drink','dessert']],
  ['Frozen yogurt with berries','🍓',['frozen-yogurt','dairy','berries','fruit','cold','creamy','dessert']],
].forEach(([n,e,t])=>add(n,e,'frozen-dessert',t[0],['sweet','cold','soft',...t.slice(1)]));

// Cakes, cookies, brownies, pastries, and bakery sweets.
const cakeFlavors = [
  ['Chocolate',['chocolate','rich']],['Vanilla',['vanilla']],['Strawberry',['strawberry','fruit']],['Lemon',['lemon','fruit']],
  ['Red velvet',['chocolate','cream-cheese','rich']],['Carrot',['carrot','spiced','cream-cheese']],['Funfetti',['vanilla','sprinkles','very-sweet']],
  ['Coconut',['coconut']],['German chocolate',['chocolate','coconut','pecan','tree-nut','nuts','rich']]
];
for (const [flavor,tags] of cakeFlavors) {
  add(`${flavor} layer cake`,'🍰','cake','layer-cake',['sweet','soft','layered-cake','frosting','dessert',...tags]);
  add(`${flavor} cupcake`,'🧁','cake','cupcake',['sweet','soft','frosting','handheld','dessert','snack',...tags]);
}
[
  ['Chocolate cheesecake','🍰',['cheesecake','chocolate','cream-cheese','cold','rich','dessert']],
  ['Caramel cheesecake','🍰',['cheesecake','caramel','cream-cheese','cold','rich','dessert']],
  ['Berry cheesecake','🍓',['cheesecake','berries','fruit','cream-cheese','cold','rich','dessert']],
  ['Peanut butter cheesecake','🥜',['cheesecake','peanut','peanut-butter','cream-cheese','cold','rich','dessert']],
  ['Sugar cookies','🍪',['cookies','vanilla','soft','handheld','snack','dessert']],
  ['Peanut butter cookies','🥜',['cookies','peanut','peanut-butter','soft','handheld','snack','dessert']],
  ['Oatmeal raisin cookies','🍪',['cookies','oatmeal','raisin','chewy','handheld','snack','dessert']],
  ['Double chocolate cookies','🍪',['cookies','chocolate','chewy','handheld','snack','dessert']],
  ['Blondies','🍪',['brownie','vanilla','buttery','chewy','handheld','snack','dessert']],
  ['Peanut butter brownies','🥜',['brownie','peanut','peanut-butter','chocolate','rich','handheld','dessert']],
  ['Cinnamon roll with cream cheese frosting','🌀',['cinnamon-roll','cinnamon','cream-cheese','frosting','bread','dessert']],
  ['Apple fritter','🍎',['fritter','apple','fruit','fried','glaze','handheld','dessert']],
  ['Blueberry muffin','🫐',['muffin','blueberry','berries','fruit','bread','handheld','snack']],
  ['Chocolate chip muffin','🧁',['muffin','chocolate','bread','handheld','snack']],
  ['Banana nut muffin','🍌',['muffin','banana','tree-nut','nuts','bread','handheld','snack']],
  ['Apple pie','🥧',['pie','apple','fruit','cinnamon','pastry','dessert']],
  ['Cherry pie','🥧',['pie','cherry','fruit','pastry','dessert']],
  ['Pecan pie','🥧',['pie','pecan','tree-nut','nuts','very-sweet','pastry','dessert']],
  ['Peanut butter pie','🥜',['pie','peanut','peanut-butter','creamy','rich','dessert']],
].forEach(([n,e,t])=>add(n,e,'bakery-sweet',t[0],['sweet','soft',...t.slice(1)]));

// Drinks and liquid-food-adjacent choices can still solve “nothing sounds good.”
[
  ['Fruit smoothie','🥤',['smoothie','fruit','cold','creamy','drink','light','snack']],
  ['Strawberry banana smoothie','🍓',['smoothie','strawberry','banana','fruit','cold','creamy','drink','light','snack']],
  ['Peanut butter banana smoothie','🥜',['smoothie','peanut','peanut-butter','banana','cold','creamy','drink','filling','snack']],
  ['Chocolate protein shake','🥤',['protein-shake','chocolate','dairy','cold','creamy','drink','filling','snack']],
  ['Vanilla protein shake','🥤',['protein-shake','vanilla','dairy','cold','creamy','drink','filling','snack']],
  ['Iced coffee','🧋',['coffee','cold','drink','light']],
  ['Hot chocolate','☕',['hot-chocolate','chocolate','dairy','hot','creamy','drink','sweet']],
].forEach(([n,e,t])=>add(n,e,'drink',t[0],['sweet',...t.slice(1)]));

// Deduplicate defensively if a generated archetype ever overlaps a hand-curated leaf.
const baseIds = new Set(baseFoods.map((food) => food.id));
const baseNames = new Set(baseFoods.map((food) => food.name.trim().toLowerCase()));
const seenGenerated = new Set();
const seenNames = new Set();
const expandedFoods = generatedFoods.filter((food) => {
  const normalizedName = food.name.trim().toLowerCase();
  if (baseIds.has(food.id) || seenGenerated.has(food.id) || baseNames.has(normalizedName) || seenNames.has(normalizedName)) return false;
  seenGenerated.add(food.id);
  seenNames.add(normalizedName);
  return true;
});

export const foods = [...baseFoods, ...expandedFoods];

export const foodById = Object.fromEntries(foods.map((food) => [food.id, food]));
