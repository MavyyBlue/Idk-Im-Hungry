export const restaurants = [
  { id: 'sonic', name: 'Sonic', categories: ['burgers', 'chicken', 'snacks', 'dessert', 'drive-thru'] },
  { id: 'mcdonalds', name: "McDonald's", categories: ['burgers', 'chicken', 'breakfast', 'snacks', 'drive-thru'] },
  { id: 'burger-king', name: 'Burger King', categories: ['burgers', 'chicken', 'breakfast', 'drive-thru'] },
  { id: 'ihop', name: 'IHOP', categories: ['breakfast', 'sweet', 'savory', 'sit-down'] },
  { id: 'chick-fil-a', name: 'Chick-fil-A', categories: ['chicken', 'breakfast', 'drive-thru'] },
  { id: 'whataburger', name: 'Whataburger', categories: ['burgers', 'chicken', 'breakfast', 'drive-thru'] },
  { id: 'freddys', name: "Freddy's", categories: ['burgers', 'dessert', 'drive-thru'] },
  { id: 'braums', name: "Braum's", categories: ['burgers', 'dessert', 'breakfast', 'drive-thru'] },
  { id: 'chicken-express', name: 'Chicken Express', categories: ['chicken', 'comfort', 'drive-thru'] },
  { id: 'hideaway-pizza', name: 'Hideaway Pizza', categories: ['pizza', 'savory', 'sit-down'] },
  { id: 'eggberts', name: "Eggbert's", categories: ['breakfast', 'comfort', 'sit-down'] },
  { id: 'midway-cafe', name: 'Midway Cafe', categories: ['breakfast', 'comfort', 'sit-down'] },
  { id: 'lot-a-burger', name: 'Lot-A-Burger', categories: ['burgers', 'local', 'drive-thru'] },
  { id: 'tjs', name: "TJ's", categories: ['burgers', 'local', 'drive-thru'] },
  { id: 'abelardos', name: "Abelardo's Mexican Fresh", categories: ['mexican', 'breakfast', 'drive-thru'] }
];

export const restaurantById = Object.fromEntries(restaurants.map((restaurant) => [restaurant.id, restaurant]));
