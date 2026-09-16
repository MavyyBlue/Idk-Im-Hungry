export const restaurants = [
  { id: 'sonic', name: 'Sonic', kind:'restaurant', categories: ['burgers', 'chicken', 'snacks', 'dessert', 'drive-thru'] },
  { id: 'mcdonalds', name: "McDonald's", kind:'restaurant', categories: ['burgers', 'chicken', 'breakfast', 'snacks', 'drive-thru'] },
  { id: 'burger-king', name: 'Burger King', kind:'restaurant', categories: ['burgers', 'chicken', 'breakfast', 'drive-thru'] },
  { id: 'ihop', name: 'IHOP', kind:'restaurant', categories: ['breakfast', 'sweet', 'savory', 'sit-down'] },
  { id: 'chick-fil-a', name: 'Chick-fil-A', kind:'restaurant', categories: ['chicken', 'breakfast', 'drive-thru'] },
  { id: 'whataburger', name: 'Whataburger', kind:'restaurant', categories: ['burgers', 'chicken', 'breakfast', 'drive-thru'] },
  { id: 'freddys', name: "Freddy's", kind:'restaurant', categories: ['burgers', 'dessert', 'drive-thru'] },
  { id: 'braums', name: "Braum's", kind:'restaurant', categories: ['burgers', 'dessert', 'breakfast', 'drive-thru'] },
  { id: 'chicken-express', name: 'Chicken Express', kind:'restaurant', categories: ['chicken', 'comfort', 'drive-thru'] },
  { id: 'hideaway-pizza', name: 'Hideaway Pizza', kind:'restaurant', categories: ['pizza', 'savory', 'sit-down'] },
  { id: 'eggberts', name: "Eggbert's", kind:'restaurant', categories: ['breakfast', 'comfort', 'sit-down'] },
  { id: 'midway-cafe', name: 'Midway Cafe', kind:'restaurant', categories: ['breakfast', 'comfort', 'sit-down'] },
  { id: 'lot-a-burger', name: 'Lot-A-Burger', kind:'restaurant', categories: ['burgers', 'local', 'drive-thru'] },
  { id: 'tjs', name: "TJ's", kind:'restaurant', categories: ['burgers', 'local', 'drive-thru'] },
  { id: 'abelardos', name: "Abelardo's Mexican Fresh", kind:'restaurant', categories: ['mexican', 'breakfast', 'drive-thru'] },
  { id: 'walmart', name: 'Walmart Bakery', kind:'store', categories: ['grocery-bakery', 'dessert', 'cake', 'pickup'] }
];

export const restaurantById = Object.fromEntries(restaurants.map((restaurant) => [restaurant.id, restaurant]));
