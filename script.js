import { apikey } from "./config.js";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");

micBtn.onclick = () => {

const recognition = new webkitSpeechRecognition();

recognition.lang = "en-US";

recognition.start();

recognition.onresult = (event) => {

const speechText = event.results[0][0].transcript;

userInput.value = speechText;

};

};

function addMessage(message, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", className);
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    const attachBtn = document.getElementById("attach-btn");

const fileInput = document.getElementById("file-input");

attachBtn.onclick = () => {

fileInput.click();

};

fileInput.onchange = () => {

const file = fileInput.files[0];

if(file){

addMessage("📁 " + file.name, "user-message");

}

};
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message");
    typingDiv.innerHTML = "Aether AI is typing<span class='dots'>...</span>";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

async function getBotReply(userMessage) {

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apikey}`;

    try {

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: userMessage }]
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("API Error:", data);
            return data?.error?.message || "Error fetching response.";
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get that.";

    } catch (error) {

        console.error(error);
        return "Something went wrong!";
    }
}

sendBtn.onclick = async () => {

    const message = userInput.value.trim();

    if (message === "") return;

    addMessage(message, "user-message");

    userInput.value = "";

    const typingDiv = showTyping();

    const botReply = await getBotReply(message);

    typingDiv.remove();

    addMessage(botReply, "bot-message");

    localStorage.setItem("chatHistory", chatBox.innerHTML);
};

userInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        sendBtn.click();
    }
});

window.onload = () => {

   addMessage("Hello, I'm Aether AI 👋", "bot-message");

   addMessage("How can I help you today?", "bot-message");

};