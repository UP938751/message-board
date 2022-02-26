import express from 'express';

const app = express();

// this will serve the files present in /public
app.use(express.static('public'));

let messages = [
  'these are three default messages',
  'delivered from the server',
  'using a custom route',
];
app.get('/messages', (req, res) => {
  res.json(messages);
});


app.post('/messages', express.json(), (req, res) => {
  messages = [req.body.msg, ...messages.slice(0, 9)];
  res.json(messages);
});

app.listen(8080);