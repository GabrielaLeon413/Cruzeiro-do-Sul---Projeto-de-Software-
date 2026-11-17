const button = document.querySelector("#learn-more");
const message = document.querySelector("#message");

button.addEventListener("click", () => {
  message.textContent =
    "Em breve, esta seção apresentará mais informações sobre o MVP.";
});
