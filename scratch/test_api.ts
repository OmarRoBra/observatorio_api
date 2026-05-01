import axios from 'axios';

async function test() {
  try {
    const adminToken = ""; // I don't have the admin token, I can't register a user on the live API because it requires authMiddleware + isAdmin!
    console.log("Cannot test directly without token.");
  } catch (e) {
    console.error(e);
  }
}
test();
