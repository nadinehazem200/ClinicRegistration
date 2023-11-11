const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const consumer = new Consumer(client, [{ topic: 'clinic_reservation' }], {
  autoCommit: false,
});

consumer.on('message', (message) => {
  const payload = JSON.parse(message.value);
  console.log('Received message:', payload);
  // Perform actions based on the received message
});

consumer.on('error', (err) => {
  console.error('Error connecting to Kafka:', err);
});
