const { default: axios } = require('axios');
const getChatReply = require('../llm');

router.post('/', async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase().trim();
  console.log("📥 Message received:", msg);

  const allKeywords = [...colors, ...types, ...genders, ...usages, ...seasons];
  const isClothingQuery = allKeywords.some(keyword => msg.includes(keyword));

  let searchQuery = msg;

  // 🧠 Step 1: If it's not a clear clothing-related query, use Gemini + Qwen
  if (!isClothingQuery) {
    try {
      const geminiText = await getChatReply(msg);
      console.log("🤖 Gemini:", geminiText);

      // Step 2: Pass Gemini response to Qwen to get the actual search query
    const mongoPrompt = `
You are a MongoDB assistant. Based on the user's request, generate a valid MongoDB filter object that can be used with Product.find(). 
Schema:
- gender
- season
- baseColour
- type
- usage

User request: "${geminiText}"
Respond with only the JSON filter object.
`;

const mongoFilterText = await getChatReply(mongoPrompt);

let mongoFilter;
try {
  mongoFilter = JSON.parse(mongoFilterText);
} catch (e) {
  console.error("❌ Failed to parse Gemini Mongo filter:", mongoFilterText);
  mongoFilter = {}; // fallback
}


      searchQuery = qwenResp.data.response.trim();
      console.log("🔍 Qwen-generated query:", searchQuery);
    } catch (err) {
      console.error("❌ Gemini or Qwen error:", err.message);
      return res.status(500).json({ text: "Sorry, I'm having trouble responding right now." });
    }
  }

  // 🧠 Step 3: Generate MongoDB filters
  const msgToMatch = searchQuery.toLowerCase();
  const filter = {};

  const color = colors.find(c => msgToMatch.includes(c));
  const type = types.find(t => msgToMatch.includes(t));
  const gender = genders.find(g => msgToMatch.includes(g));
  const usage = usages.find(u => msgToMatch.includes(u));
  const season = seasons.find(s => msgToMatch.includes(s));

  if (color) filter.baseColour = { $regex: color, $options: 'i' };
  if (type) filter.type = { $regex: type, $options: 'i' };
  if (gender) filter.gender = { $regex: gender, $options: 'i' };
  if (usage) filter.usage = { $regex: usage, $options: 'i' };
  if (season) filter.season = { $regex: season, $options: 'i' };

  console.log("🧾 MongoDB Query:", filter);

  try {
    const products = await Product.find(filter).limit(10);
    console.log(`✅ Found ${products.length} product(s)`);
    res.json(products);
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    res.status(500).send("Database query failed");
  }
});
