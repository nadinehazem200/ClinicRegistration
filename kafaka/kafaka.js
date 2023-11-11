const kafka = require('kafka-node');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(client);

producer.on('ready', () => {
  console.log('Kafka producer is ready');
});

producer.on('error', (err) => {
  console.error('Error connecting to Kafka:', err);
});

app.use(bodyParser.json());

app.post('/reserve', (req, res) => {
  const { doctorId, patientId, operation } = req.body;

  const payload = [
    {
      topic: 'clinic_reservation',
      messages: JSON.stringify({ doctorId, patientId, operation }),
    },
  ];

  producer.send(payload, (err, data) => {
    if (err) {
      console.error('Error sending message to Kafka:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Message sent to Kafka' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
