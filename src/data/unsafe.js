const normalize = (value='') => String(value)
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const UNSAFE_KEYWORD_GROUPS = [
  {
    label:'Common allergens',
    tags:[
      ['shellfish','Shellfish'],['fish','Fish'],['peanut','Peanuts'],['peanut-butter','Peanut butter'],
      ['tree-nut','Tree nuts'],['dairy','Dairy'],['egg','Eggs'],['gluten','Gluten / wheat']
    ]
  },
  {
    label:'Proteins',
    tags:[
      ['chicken','Chicken'],['beef','Beef'],['pork','Pork'],['turkey','Turkey'],['lamb','Lamb'],['shrimp','Shrimp']
    ]
  },
  {
    label:'Ingredients',
    tags:[
      ['mushroom','Mushrooms'],['onion','Onion'],['cilantro','Cilantro'],['tomato','Tomato'],
      ['avocado','Avocado'],['beans','Beans'],['cheese','Cheese'],['cream-cheese','Cream cheese']
    ]
  },
  {
    label:'Other dealbreakers',
    tags:[
      ['spicy','Spicy'],['jalapeno','Jalapeño'],['coconut','Coconut'],['banana','Banana'],['berries','Berries']
    ]
  }
];

const ALIASES = {
  'shellfish':['shellfish','shrimp','crab','lobster','scallops','scallop','clam','oyster','mussel'],
  'fish':['fish','salmon','tuna','catfish','tilapia'],
  'peanut':['peanut','peanuts','peanut-butter'],
  'peanut-butter':['peanut','peanuts','peanut-butter'],
  'tree-nut':['tree-nut','tree-nuts','nuts','pecan','walnut','almond','cashew','pistachio'],
  'dairy':['dairy','cheese','cheesy','cream','creamy','cream-cheese','cheddar','swiss','parmesan','feta','yogurt'],
  'egg':['egg','eggs'],
  'gluten':['gluten','wheat','bread','pasta','noodles','tortilla','pastry','crackers','pretzel','bagel','biscuit','biscuits','naan','pita','bun','waffles','pancakes'],
  'cheese':['cheese','cheesy','cheddar','swiss','parmesan','feta','cream-cheese'],
  'shrimp':['shrimp','shellfish'],
  'spicy':['spicy','very-spicy','jalapeno','buffalo','hot'],
  'tomato':['tomato','tomato-sauce','marinara'],
  'berries':['berries','strawberry','blueberry']
};

export function normalizeUnsafeKeyword(value='') {
  return normalize(value);
}

export function unsafeAliases(keyword='') {
  const clean = normalize(keyword);
  return new Set((ALIASES[clean] || [clean]).map(normalize).filter(Boolean));
}

function candidateTerms(candidate) {
  const terms = new Set([
    normalize(candidate?.family), normalize(candidate?.subfamily),
    ...(candidate?.tags || []).map(normalize)
  ].filter(Boolean));
  const name = normalize(candidate?.name || '');
  if (name) {
    terms.add(name);
    for (const part of name.split('-')) if (part) terms.add(part);
  }
  return terms;
}

export function candidateMatchesUnsafe(candidate, keywords=[]) {
  if (!candidate || !keywords?.length) return false;
  const terms = candidateTerms(candidate);
  return keywords.some((keyword) => {
    const aliases = unsafeAliases(keyword);
    for (const alias of aliases) {
      if (terms.has(alias)) return true;
      // Multi-word custom keywords should also match normalized candidate names.
      const normalizedName = normalize(candidate.name || '');
      if (alias.length > 2 && normalizedName.includes(alias)) return true;
    }
    return false;
  });
}
