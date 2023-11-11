const Kafka = require('node-rdkafka');

const producer = new Kafka.Producer({
  'metadata.broker.list': 'your_kafka_broker_address',
});

producer.connect();

function sendReservationEvent(operation, doctorId, patientId) {
  const message = JSON.stringify({
    doctorId,
    patientId,
    Operation: operation,
  });

  producer.produce('clinic_reservation', -1, Buffer.from(message));
}

// Send ReservationCreated event
sendReservationEvent('ReservationCreated', '111', '222');

// Close Kafka producer after sending messages
producer.flush(5000, () => producer.disconnect());
