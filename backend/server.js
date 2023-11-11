const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 6001; // Change this to a different port number
const mysql = require('mysql2');
app.use(bodyParser.json());

// Check MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'clinic_reservation',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Endpoint for user sign-in
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: ' Dear user : Username and password are required !' });
  }

  // Query to check if the user exists
  const userQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(userQuery, [username], (userErr, userResults) => {
    if (userErr) {
      console.error('Error executing MySQL query:', userErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if a user with the provided username exists
    if (userResults.length === 0) {
      return res.status(401).json({ error: 'You are not registered , please sign up first :)' });
    }

    // User exists, now compare hashed passwords
    const storedPassword = userResults[0].password;

    if (password === storedPassword) {
      const userType = userResults[0].userType;
      return res.status(200).json({ message: 'Sign-in successful :)' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials , please try again :(' });
    }
  });
});



app.post('/signup', (req, res) => {
  const { username, password, userType } = req.body;

  // Check if username, password, and userType are provided
  if (!username || !password || !userType) {
    return res.status(400).json({ error: 'Username, password, userType are required' });
  }

  // Query to check if the username already exists
  const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUsernameQuery, [username], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error executing MySQL query:', checkErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if a user with the provided username already exists
    if (checkResults.length > 0) {
      return res.status(409).json({ error: 'Username already exists!' });
    }

    // Username is unique, proceed to insert the new user
    const insertUserQuery = 'INSERT INTO users (username, password, userType) VALUES (?, ?, ?)';
    db.query(insertUserQuery, [username, password, userType], (insertErr, results) => {
      if (insertErr) {
        console.error('Error executing MySQL query:', insertErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Extract the inserted id from the results
      const insertedUserId = results.insertId;

      // If the user is a doctor, update the corresponding doctorID in the doctors table
      if (userType === 'doctor') {
        const updateDoctorIdQuery = 'INSERT INTO doctors (user_id) VALUES (?)';
        db.query(updateDoctorIdQuery, [insertedUserId], (updateErr) => {
          if (updateErr) {
            console.error('Error executing MySQL query:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(201).json({ message: `Welcome Dear DR, Your user id is: ${insertedUserId}` });
        });
      } else if (userType === 'patient') {
        const updatePatientIdQuery = 'INSERT INTO patients (user_id) VALUES (?)';
        db.query(updatePatientIdQuery, [insertedUserId], (updateErr) => {
          if (updateErr) {
            console.error('Error executing MySQL query:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(201).json({ message: `Welcome Dear Patient, Your user id is: ${insertedUserId}` });
        });
      } else {
        return res.status(201).json({ message:`Welcome Dear DR, Your user id is: ${insertedUserId}` });
      }
    });
  });
});





// Endpoint for a doctor to set their schedule
app.post('/dr-schedule', (req, res) => {
  const { doctorID, SlotDay, SlotTime, patientID } = req.body;

  // Check if doctorID, SlotDay, SlotTime, and patientID are provided
  if (!doctorID || !SlotDay || !SlotTime || !patientID) {
    return res.status(400).json({ error: 'doctorID, SlotDay, SlotTime, and patientID are required' });
  }

  // Check if the slot is available (not already booked)
  const checkAvailabilityQuery = 'SELECT * FROM dr_schedule WHERE doctorID = ? AND SlotDay = ? AND SlotTime = ? AND patientID IS NULL';
  db.query(checkAvailabilityQuery, [doctorID, SlotDay, SlotTime], (availabilityErr, availabilityResults) => {
    if (availabilityErr) {
      console.error('Error executing MySQL query:', availabilityErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if the slot is available
    if (availabilityResults.length === 0) {
      return res.status(409).json({ error: 'Slot is already booked or unavailable' });
    }

    // Slot is available, proceed to set the appointment for the patient
    const setAppointmentQuery = 'UPDATE dr_schedule SET patientID = ? WHERE doctorID = ? AND SlotDay = ? AND SlotTime = ?';
    db.query(setAppointmentQuery, [patientID, doctorID, SlotDay, SlotTime], (updateErr, updateResults) => {
      if (updateErr) {
        console.error('Error executing MySQL query:', updateErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(201).json({ message: 'Appointment scheduled successfully :)' });
    });
  });
});

  

  // Endpoint for patients to select a doctor
app.post('/select-doctor', (req, res) => {
  const { patientName, selectedDrID } = req.body;

  if (!patientName || !selectedDoctorID) {
    return res.status(400).json({ error: 'Patient name and selected doctor ID are required' });
  }

  const query = 'INSERT INTO patients (patientName, selectedDrID) VALUES (?, ?)';
  db.query(query, [patientName, selectedDrID], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(201).json({ message: 'Patient selected doctor successfully' });
  });
});








// Endpoint to get a list of doctors
app.get('/doctors', (req, res) => {
  db.query('SELECT * FROM doctors', (err, results) => {
    if (err) {
      console.error('Error getting doctors:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json(results);
  });
});



// Endpoint to get available slots for a specific doctor
app.get('/doctors/:drID/slots', (req, res) => {
  const doctorID = req.params.doctorID;

  db.query(
    'SELECT * FROM dr_schedule WHERE doctorID = ? AND booked = false',
    [doctorID],
    (err, results) => {
      if (err) {
        console.error('Error getting available slots:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json(results);
    }
  );
});


// Endpoint for patients to choose a slot
app.post('/appointments', (req, res) => {
  const { patientName, doctorID, SlotDay, SlotTime} = req.body;

  // Insert the appointment into the appointments table
  db.query(
    'INSERT INTO appointments (patientName, doctorID, SlotDay, SlotTime) VALUES (?, ?, ?, ?)',
    [patientName, doctorID, SlotDay, SlotTime],
    (err, results) => {
      if (err) {
        console.error('Error creating appointment:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Update the corresponding slot in the doctor_schedule table
      db.query(
        'UPDATE dr_schedule SET booked = true WHERE doctorID = ? AND slotDay = ? AND slotTime = ?',
        [doctorID, SlotDay, SlotTime],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating doctor schedule:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(201).json({ message: 'Appointment created successfully' });
        }
      );
    }
  );
});

// Endpoint to update a patient's appointment
app.put('/appointments/:apptID', (req, res) => {
  const appID = req.params.appID;
  const { doctorID, SlotDay, SlotTime } = req.body;

  // Update the appointment in the appointments table
  db.query(
    'UPDATE appointments SET doctorID = ?, slotDay = ?, slotTime = ? WHERE appID = ?',
    [doctorID, SlotDay, SlotTime, appID],
    (err, results) => {
      if (err) {
        console.error('Error updating appointment:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Update the corresponding slot in the doctor_schedule table
      db.query(
        'UPDATE dr_schedule SET booked = false WHERE doctorID = ? AND slotDay = ? AND slotTime = ?',
        [doctorID, SlotDay, SlotTime],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating doctor schedule:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(200).json({ message: 'Appointment updated successfully' });
        }
      );
    }
  );
});



// Endpoint to update a patient's appointment
app.put('/appointments/:appID', (req, res) => {
  const appID = req.params.appID;
  const { patientID, doctorID, SlotDay, SlotTime } = req.body;

  // Update the appointment in the appointments table
  db.query(
    'UPDATE appointments SET patientID = ?, doctorID = ?, SlotDay = ?, SlotTime = ? WHERE appID = ?',
    [patientID, doctorID, SlotDay, SlotTime, appID],
    (err, results) => {
      if (err) {
        console.error('Error updating appointment:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Update the corresponding slot in the dr_schedule table
      db.query(
        'UPDATE dr_schedule SET booked = false WHERE doctorID = ? AND slotDay = ? AND slotTime = ?',
        [doctorID, SlotDay, SlotTime],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating doctor schedule:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(200).json({ message: 'Appointment updated successfully' });
        }
      );
    }
  );
});




app.delete('/appointments/:appID', (req, res) => {
  const appID = req.params.appID;

  // Check if appID is provided
  if (!appID) {
    return res.status(400).json({ error: 'Appointment ID is required' });
  }

  // Check if the appointment exists
  db.query('SELECT * FROM appointments WHERE appID = ?', [appID], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking appointment:', checkErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if the appointment exists
    if (checkResults.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if the appointment is already canceled
    if (checkResults[0].canceled) {
      return res.status(409).json({ error: 'Appointment is already canceled' });
    }

    // Delete the appointment from the appointments table
    db.query('UPDATE appointments SET canceled = true WHERE appID = ?', [appID], (err, results) => {
      if (err) {
        console.error('Error canceling appointment:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Retrieve the details of the canceled appointment if needed
      const canceledAppointment = results.affectedRows === 1 ? { appID } : null;

      // Update the corresponding slot in the dr_schedule table
      db.query(
        'UPDATE dr_schedule SET booked = false WHERE doctorID = ?',
        [appID],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating doctor schedule:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(200).json({
            message: 'Appointment canceled successfully',
            canceledAppointment,
          });
        }
      );
    });
  });
});




// Endpoint to get all reservations for a patient
app.get('/patients/:patientID', (req, res) => {
  const patientID = req.params.patientID;

  db.query(
    'SELECT a.* FROM appointments a JOIN patients p ON a.patientID = p.patientID WHERE p.patientID = ?',
    [patientID],
    (err, results) => {
      if (err) {
        console.error('Error getting patient reservations:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      console.log('Results:', results);
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'No reservations found for the specified patientID' });
      }
  
      return res.status(200).json(results);
    }
  );
  });  



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});