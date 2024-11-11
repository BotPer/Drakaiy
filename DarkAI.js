const fetch = require('node-fetch'); // Assurez-vous d'avoir importé fetch

class DarkAI {
  constructor() {
    this.url = "https://doanything.ai/api/chat";
    this.headers = {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      "Origin": "https://doanything.ai",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Accept-Language": "en-US,en;q=0.9"
    };
  }

  async fetchResponse(query) {
    const payload = {
      model: {
        id: "gpt-3.5-turbo-0613",
        name: "GPT-3.5",
        maxLength: 12000,
        tokenLimit: 4000
      },
      messages: [{ role: "user", content: query }],
      prompt: "You are a smart, responsive AI assistant...",
      temperature: 0.7
    };

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      try {
        // Vérifie si la réponse peut être analysée en JSON
        const jsonResponse = JSON.parse(responseText);
        return jsonResponse.text || "No message in JSON response";
      } catch {
        // Si ce n'est pas du JSON, retourne le texte brut
        return responseText;
      }

    } catch (error) {
      console.error('Error fetching AI response:', error);
      return "Error fetching AI response: " + error.message;
    }
  }

  async createAsyncGenerator(model, messages) {
    const message = messages[0].text;
    return await this.fetchResponse(message);
  }
}

module.exports = DarkAI;
