import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.querySelector(".send");
    const inputField = document.querySelector(".input");
    const intro = document.querySelector(".intro");
    const chatContainer = document.querySelector(".container");
    const main = document.querySelector(".main");
    const boxes = document.querySelectorAll(".boxes");

    const API_KEY = "AIzaSyBVb6q69dhBf-ExRVX49EVqdIkokj84Pds";

    const genAI = new GoogleGenerativeAI(API_KEY);

    sendButton.addEventListener("click", async () => {
        await handleUserQuery();
    });

    boxes.forEach(box => {
        box.addEventListener("click", async (e) => {
            let query = e.target.value;
            await handleUserQuery(query);
        });
    });

    inputField.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            await handleUserQuery();
            intro.style.display = "none";
            main.style.display = "none";
        }
    });

    async function handleUserQuery(query) {
        if (!query) {
            query = inputField.innerText.trim();
        }

        if (query === "") {
            alert("Please enter a query.");
            return;
        }

        appendChatMessage('userChat', escapeHTML(query));
        inputField.innerText = ''; // Clear the input field

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const result = await model.generateContent(query);
            const response = await result.response;
            const text = await response.text();

            console.log("Response from AI:", text); // Log the response

            appendChatMessage('AbhiChat', formatResponse(text));

            // Trigger Prism.js highlighting after appending the message
            Prism.highlightAll();
        } catch (error) {
            console.error("Error:", error);
            appendChatMessage('AbhiChat', '<p>Error occurred while fetching the response.</p>');
        }
    }

    function appendChatMessage(className, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';

        if (className === 'userChat') {
            messageElement.innerHTML = `
                <div class="user-message">
                    <img src="Abhijith.jpg" alt="User Photo">
                    <p>${message}</p>
                </div>
            `;
        } else if (className === 'AbhiChat') {
            const botImage = document.createElement("img");
            const botMessage = document.createElement('div');
            botImage.src = "image.png";
            botImage.style.width = "34px";
            botImage.style.height = "34px";
            botImage.style.clipPath = "circle()";

            botMessage.className = 'bot-message';
            botMessage.innerHTML = message;
            messageElement.style.marginBottom = "12px";
            messageElement.appendChild(botImage);
            messageElement.appendChild(botMessage);

            const copyButtons = botMessage.querySelectorAll('.copy-button');
            copyButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const codeText = button.previousElementSibling.textContent;
                    navigator.clipboard.writeText(codeText).then(() => {
                        alert("Code copied to clipboard!");
                    }).catch(err => {
                        console.error("Failed to copy: ", err);
                    });
                });
            });

            // Highlight code blocks
            Prism.highlightAll();
        }

        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
    }

    function formatResponse(text) {
        const segments = text.split(/(```[\s\S]*?```)/g);
        let formattedResponse = '';

        let codeBlockFound = false;

        segments.forEach(segment => {
            if (segment.startsWith("```") && segment.endsWith("```")) {
                // Code block
                const codeContent = segment.slice(3, -3).trim(); // Remove ``` markers and trim whitespace
                if (codeContent) {
                    formattedResponse += `
                        <pre>
                            <code class="language-javascript">${escapeHTML(codeContent)}</code>
                            <i class="fa-regular fa-copy copy-button" title="Copy code"></i>
                        </pre>
                    `;
                    codeBlockFound = true;
                }
            } else if (!codeBlockFound && segment.trim() !== '') {
                // Exclude explanation text if no code block has been found yet
                formattedResponse += `<p>${escapeHTML(segment)}</p>`;
            }
        });

        return formattedResponse;
    }

    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('copy-button')) {
            const codeText = event.target.previousElementSibling.textContent;
            navigator.clipboard.writeText(codeText).then(() => {
                alert("Code copied to clipboard!");
            }).catch(err => {
                console.error("Failed to copy: ", err);
            });
        }
    });
});
