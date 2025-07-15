const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productService = require('../services/productService');
const getChatReply = require('../llm');
const logger = require('../utils/logger');
const config = require('../config');

// ✅ Predefined filters
const colors = ['beige', 'black', 'blue', 'bronze', 'brown', 'burgundy', 'charcoal',
  'coffee brown', 'copper', 'cream', 'gold', 'green', 'grey', 'grey melange',
  'khaki', 'lavender', 'lime green', 'magenta', 'maroon', 'mauve', 'metallic',
  'multi', 'mustard', 'navy blue', 'nude', 'off white', 'olive', 'orange',
  'peach', 'pink', 'purple', 'red', 'rose', 'rust', 'sea green', 'silver',
  'skin', 'steel', 'tan', 'taupe', 'teal', 'turquoise blue', 'white', 'yellow'];

const types = ['accessory gift set', 'baby dolls', 'backpacks', 'bangle', 'bath robe', 'beauty accessory',
  'belts', 'blazers', 'boxers', 'bra', 'bracelet', 'briefs', 'camisoles', 'capris', 'caps',
  'casual shoes', 'clutches', 'compact', 'deodorant', 'dresses', 'duffel bag', 'dupatta',
  'earrings', 'eye cream', 'eyeshadow', 'face moisturisers', 'face wash and cleanser', 'flats',
  'flip flops', 'formal shoes', 'foundation and primer', 'fragrance gift set', 'free gifts',
  'handbags', 'headband', 'heels', 'highlighter and blush', 'innerwear vests', 'jackets',
  'jeans', 'jewellery set', 'jumpsuit', 'kajal and eyeliner', 'kurta sets', 'kurtas', 'kurtis',
  'laptop bag', 'leggings', 'lip care', 'lip gloss', 'lip liner', 'lipstick', 'lounge pants',
  'messenger bag', 'mobile pouch', 'mufflers', 'nail polish', 'necklace and chains',
  'night suits', 'nightdress', 'patiala', 'pendant', 'perfume and body mist', 'rain jacket',
  'ring', 'robe', 'salwar and dupatta', 'sandals', 'sarees', 'scarves', 'shirts',
  'shoe accessories', 'shoe laces', 'shorts', 'shrug', 'skirts', 'socks', 'sports sandals',
  'sports shoes', 'stockings', 'sunglasses', 'suspenders', 'sweaters', 'sweatshirts',
  'swimwear', 'ties', 'tops', 'track pants', 'tracksuits', 'travel accessory', 'trolley bag',
  'trousers', 'trunk', 'tshirts', 'tunics', 'waistcoat', 'wallets', 'watches', 'water bottle'];

const genders = ['boys', 'girls', 'men', 'unisex', 'women'];
const usages = ['casual', 'ethnic', 'formal', 'smart casual', 'sports', 'travel'];
const seasons = ['fall', 'spring', 'summer', 'winter'];

const allKeywords = [...colors, ...types, ...genders, ...usages, ...seasons];
function formatFilterKeywords(filterObj) {
  for (const key in filterObj) {
    const val = filterObj[key];

    if (typeof val === 'string') {
      const lower = val.toLowerCase();
      filterObj[key] = lower.charAt(0).toUpperCase() + lower.slice(1);
    } else if (Array.isArray(val)) {
      filterObj[key] = val.map(v =>
        typeof v === 'string'
          ? v.toLowerCase().replace(/^\w/, c => c.toUpperCase())
          : v
      );
    }
  }
  return filterObj;
}

router.post('/', async (req, res) => {
  const { message } = req.body;
  const msg = message.trim();
  console.log("📥 Message received:", msg);

  try {
    // Step 1: Ask Gemini if it's casual
    const intentPrompt = `Classify the following user message as either 'casual' or 'product_search'.

Message: "${msg}"
Respond only with one word: casual or product_search.`;

    const intent = (await getChatReply(intentPrompt)).toLowerCase();
    console.log("🤖 Intent classification:", intent);

    // Step 2: If casual, generate a reply
    if (intent.includes("casual")) {
      const casualReply = await getChatReply(`You are a friendly shopping assistant. Reply conversationally to: "${msg}"`);
      return res.json({ text: casualReply });
    }

    // Step 3: If product_search, generate a MongoDB filter query
    const mongoPrompt = `
You are a MongoDB query generator. Based on the following user message, generate a valid MongoDB filter object.
Schema:
- gender: 'boys', 'girls', 'men', 'unisex', 'women'
- season: 'fall', 'spring', 'summer', 'winter'
- baseColour:'beige', 'black', 'blue', 'bronze', 'brown', 'burgundy', 'charcoal',
  'coffee brown', 'copper', 'cream', 'gold', 'green', 'grey', 'grey melange',
  'khaki', 'lavender', 'lime green', 'magenta', 'maroon', 'mauve', 'metallic',
  'multi', 'mustard', 'navy blue', 'nude', 'off white', 'olive', 'orange',
  'peach', 'pink', 'purple', 'red', 'rose', 'rust', 'sea green', 'silver',
  'skin', 'steel', 'tan', 'taupe', 'teal', 'turquoise blue', 'white', 'yellow'
- type
- usage:'casual', 'ethnic', 'formal', 'smart casual', 'sports', 'travel'
- apparel or what?
{
gender
"Men"
masterCategory
"Apparel"
subCategory
"Bottomwear"
articleType
"Jeans"
baseColour
"Blue"
season
"Summer"
link
"http://assets.myntassets.com/v1/images/style/properties/4850873d0c417e…"
usage
"Casual"
productDisplayName
} this is the given example
Respond ONLY with a valid JSON object.
Message: "${msg}"
    `;

    const filterText = await getChatReply(mongoPrompt);
    let mongoFilter = {};

    try {
      const cleanedFilter = filterText.replace(/```json|```/g, '').trim();
      mongoFilter = JSON.parse(cleanedFilter);

      // ✅ Format the values: lowercase then capitalize
      mongoFilter = formatFilterKeywords(mongoFilter);
    } catch (e) {
      console.error("❌ Failed to parse filter:", filterText);
      return res.json({ text: "Sorry, I couldn’t understand your request. Please try again." });
    }

    logger.info("🧾 MongoDB Query:", mongoFilter);

    // Use the product service to find products
    const result = await productService.findProducts(mongoFilter, { limit: config.queryLimit });
    logger.info(`✅ Found ${result.pagination.total} product(s)`);

    // Return only the products array for backward compatibility
    return res.json(result.products);

  } catch (err) {
    logger.error("❌ Error:", err);
    return res.status(500).json({
      text: "Something went wrong. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;