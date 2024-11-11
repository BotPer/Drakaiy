document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (message) {
            addMessage("user", message);
            userInput.value = "";

            try {
                const response = await fetch(`/api/chat?model=gpt-3.5-turbo&message=${encodeURIComponent(message)}`);
                const data = await response.json();

                if (data.response) {
                    addMessage("ai", data.response);
                } else {
                    addMessage("ai", "Désolé, je n'ai pas pu traiter votre demande.");
                }
            } catch (error) {
                console.error("Erreur:", error);
                addMessage("ai", "Une erreur s'est produite. Réessayez plus tard.");
            }
        }
    });

    function addMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll vers le bas
    }
});
