const fetch = require('node-fetch'); // Assurez-vous d'avoir importé fetch

class DarkAI {
  constructor() {
    this.url = "https://replicate.com/api/models";
    this.headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
  }

  async fetchResponse(model = "gpt-3.5-turbo", chat, options) { // Ajout du modèle par défaut ici
    const prompt = chat.map(msg => msg.text).join("\n");

    const data = {
      stream: true,
      input: {
        prompt: prompt,
        max_tokens: model.includes("meta-llama-3") ? 512 : null, // respected by meta-llama-3
        max_new_tokens: model.includes("mixtral") ? 1024 : null, // respected by mixtral-8x7b
        temperature: options.temperature,
      },
    };

    try {
      const response = await fetch(`${this.url}/${model}/predictions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();
      const streamUrl = responseJson.urls.stream;

      const streamResponse = await fetch(streamUrl, {
        method: 'GET',
        headers: { "Accept": "text/event-stream", "Content-Type": "application/json" },
      });

      const reader = streamResponse.body;
      let curr_event = "";
      let result = "";

      for await (let chunk of reader) {
        let str = chunk.toString();
        let lines = str.split("\n");
        let is_only_line = true;

        for (let line of lines) {
          if (line.startsWith("event: ")) {
            curr_event = line.substring(7);
            if (curr_event === "done") return result;
          } else if (line.startsWith("data: ") && curr_event === "output") {
            let data = line.substring(6);
            if (data.length === 0) data = "\n";
            if (!is_only_line) data = "\n" + data;
            is_only_line = false;
            result += data;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching Replicate response:', error);
      return "Error fetching Replicate response: " + error.message;
    }
  }
}

module.exports = DarkAI;
