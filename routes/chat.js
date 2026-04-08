const express = require('express');
const router = express.Router();

// Simulated AI Stylist Response Logic
router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const msgStr = message.toLowerCase();
  let response = "I'm your AI Style Coach. Ask me what to wear for a specific occasion, weather, or how to combine items in your wardrobe!";

  if (msgStr.includes('wedding')) {
    response = "For a wedding, I highly recommend your Evening Dress or the Navy Blazer paired with beige chinos if it's a daytime event. A subtle gold accessory works perfectly!";
  } else if (msgStr.includes('casual') || msgStr.includes('weekend')) {
    response = "A casual day? Go for your Classic White Linen Shirt with Blue Denim Jeans. Finish the look with fresh white sneakers for an effortless vibe.";
  } else if (msgStr.includes('interview') || msgStr.includes('work') || msgStr.includes('business')) {
    response = "For an interview, project confidence with your Navy Blazer over a crisp shirt. Dark trousers or dark jeans align perfectly with a modern smart-casual workplace.";
  } else if (msgStr.includes('cold') || msgStr.includes('winter')) {
    response = "It's chilly! Layering is key. Wear your Black Hoodie under a thicker jacket, paired with rigid denim and boots.";
  } else if (msgStr.includes('hot') || msgStr.includes('summer')) {
    response = "Since it's warm, let's keep it breathable. The Floral Summer Dress or light chinos with a cotton t-shirt will keep you cool and stylish.";
  } else if (msgStr.includes('missing') || msgStr.includes('buy') || msgStr.includes('shop')) {
    response = "Looking at your wardrobe, adding a **Camel Overcoat** would instantly unlock 12 new outfit combinations for the upcoming colder season!";
  } else if (msgStr.includes('help')) {
    response = "Sure! Try asking: 'What should I wear for an interview today?' or 'What goes well with my blue jeans?'";
  }

  // Simulate network/AI delay
  setTimeout(() => {
    res.json({ reply: response });
  }, 800);
});

module.exports = router;
