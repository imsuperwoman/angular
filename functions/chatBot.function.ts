export function hideChatBot() {
  var chatbot = document.getElementsByClassName('padai-widget');
  chatbot[0].setAttribute('hidden', 'hidden');
}


export function showChatBot(chatbotInd: any) {
  if (chatbotInd == 'Y') {
    var chatbot = document.getElementsByClassName('padai-widget');
    chatbot[0].removeAttribute('hidden');
  }
}