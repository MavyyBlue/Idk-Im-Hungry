const f = (id, name, emoji, family, subfamily, restaurants, tags) => ({
  id, name, emoji, family, subfamily, restaurants, tags:[family, subfamily, ...tags]
});

export const foods = [
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

export const foodById = Object.fromEntries(foods.map((food) => [food.id, food]));
