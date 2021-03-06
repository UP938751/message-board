const el = {};

/* Remove all contents from a given element */
function removeContentFrom(element) {
  element.textContent = '';
}

/* Add an array of messages to the DOM */
function showMessages(messages, where) {
  for (const message of messages) {
    const li = document.createElement('li');
    li.textContent = message.msg;
    li.dataset.id = message.id;
    // adds an "(edit)" link to each message.
    const edit = document.createElement('a');
    edit.textContent = 'edit me';
    edit.href = `/message#${message.id}`;
    li.append(' (', edit, ')');

    where.append(li);
    li.addEventListener('mouseenter', showDetail);
  }
}

async function showDetail(e) {
  const response = await fetch('messages/' + e.target.dataset.id);
  if (response.ok) {
    const detail = await response.json();
    const p = document.createElement('p');
    p.textContent = `Message received on server at ${detail.time}`;
    removeContentFrom(el.detail);
    el.detail.append(p);
  }
}

async function loadMessages() {
  const response = await fetch('messages');
  let messages;
  if (response.ok) {
    messages = await response.json();
  } else {
    messages = [{ msg: 'failed to load messages :-(' }];
  }
  removeContentFrom(el.messagelist);
  showMessages(messages, el.messagelist);
}

/* add a message if enter pressed */
function checkKeys(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
}

/** Use fetch to post a JSON message to the server */
async function sendMessage() {
  const payload = { msg: el.message.value };
  console.log('Payload', payload);

  const response = await fetch('messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    el.message.value = '';
    const updatedMessages = await response.json(); // ?
    removeContentFrom(el.messagelist); // ?
    showMessages(updatedMessages, el.messagelist);
  } else {
    console.log('failed to send message', response);
  }
}

function prepareHandles(){
  el.messagelist = document.querySelector('#messagelist');
  el.message = document.querySelector('#message');
  el.send = document.querySelector('#send');
  el.detail = document.querySelector('#detail');
}


 function addEventListeners() {
  el.send.addEventListener('click', sendMessage);
  el.message.addEventListener('keyup', checkKeys);
  
}

function init() {
  prepareHandles()
  addEventListeners()
  loadMessages()
}

window.addEventListener('load', init);