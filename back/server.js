const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
app.use(cors());
const port =3000; // Change this to a different port numbersss
const mysql = require('mysql2');
app.use(bodyParser.json());

// Check MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'clinic_reservation3',
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
      const id =userResults[0].id;
      const role =userResults[0].userType;
      return res.status(200).json({message: 'Sign-in successful :)',id,role});
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
          return res.status(201).json({ message: `Welcome Dear Patient, Your user id is:`,id:insertedUserId });
        });
      } else if (userType === 'patient') {
        const updatePatientIdQuery = 'INSERT INTO patients (user_id) VALUES (?)';
        db.query(updatePatientIdQuery, [insertedUserId], (updateErr) => {
          if (updateErr) {
            console.error('Error executing MySQL query:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          return res.status(201).json({ message: `Welcome Dear Patient, Your user id is:`,id:insertedUserId });
        });
      } else {
        return res.status(201).json({message: 'Welcome Dear DR, Your user id is:',id:insertedUserId});
      }
    });
  });
});






  

// Endpoint for patients to select a doctor
app.post('/select-doctor', (req, res) => {
  const { patientID, doctorID } = req.body;

  // Validate input
  if (!patientID || !doctorID) {
    return res.status(400).json({ error: 'Patient ID and Doctor ID are required' });
  }

  // Check if the doctor exists
  db.query('SELECT * FROM doctors WHERE drID = ?', [doctorID], (doctorErr, doctorResults) => {
    if (doctorErr) {
      console.error('Error checking doctor:', doctorErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (doctorResults.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const selectedDoctor = doctorResults[0];
    console.log(selectedDoctor)

    // Update the patient's selected doctor
    db.query(
      'UPDATE patients SET selDrID = ? WHERE patientID = ?',
      [selectedDoctor.doctorID, patientID],
      (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error updating patient:', updateErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.status(200).json({ message: 'Doctor selected successfully', selectedDoctor });
      }
    );
  });
});



// Endpoint to get a list of appointments from dr_schedule table
app.get('/doctorsappointments', (req, res) => {
  db.query('SELECT appid, slotDay, slotTime FROM dr_schedule', (err, results) => {
    if (err) {
      console.error('Error getting appointments:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json(results);
  });
});



// Endpoint to allow a doctor to set their schedule
app.post('/dr_schedule', (req, res) => {
  const { doctorID, slotDay, slotTime } = req.body;

  // Validate input
  if (!doctorID || !slotDay || !slotTime) {
    return res.status(400).json({ error: 'Doctor ID, slotDay, and slotTime are required' });
  }

  // Check if the slot is already taken
  db.query(
    'SELECT * FROM dr_schedule WHERE doctorID = ? AND slotDay = ? AND slotTime = ?',
    [doctorID, slotDay, slotTime],
    (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking schedule:', checkErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (checkResults.length > 0) {
        // Slot is already taken
        return res.status(409).json({ error: 'Slot is already taken' });
      }

      // Insert the slot into the doctors_schedule table
      db.query(
        'INSERT INTO dr_schedule (doctorID, slotDay, slotTime) VALUES (?, ?, ?)',
        [doctorID, slotDay, slotTime],
        (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Error inserting into schedule:', insertErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(201).json({ message: 'Slot inserted successfully' });
        }
      );
    }
  );
});



//Endpoint to list available slots of drs
app.get('/doctors/:doctorID/available-slots', (req, res) => {
  const doctorID = req.params.doctorID;

  // Check if the doctorID is provided
  if (!doctorID) {
    return res.status(400).json({ error: 'Doctor ID is required' });
  }

  console.log('Doctor ID:', doctorID);

  // Retrieve available slots for the specified doctor
  db.query(
    'SELECT * FROM dr_schedule WHERE doctorID = ? AND appid IS NULL AND SlotDay IS NOT NULL',
    [doctorID],
    (err, results) => {
      if (err) {
        console.error('Error getting available slots:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Log the results for debugging
      console.log('Query Results:', results);

      // Check if there are available slots
      if (results.length === 0) {
        return res.status(404).json({ error: 'No available slots for this doctor' });
      }

      // Extract relevant information and send the response
      const availableSlots = results.map(slot => ({
        SlotDay: slot.SlotDay,
        SlotTime: slot.SlotTime,
      }));

      return res.status(200).json(availableSlots);
    }
  );
});




// End point to create an app
app.post('/appointments', (req, res) => {
  const { patientID, doctorID, SlotDay, SlotTime } = req.body;

  // Check if the patient already has an appointment with the same doctor at the same slot time and day
  db.query(
    'INSERT INTO appointments (patientID, doctorID, SlotDay, SlotTime) ' +
    'SELECT ?, ?, ?, ? ' +
    'FROM DUAL ' +
    'WHERE NOT EXISTS (SELECT * FROM appointments WHERE patientID = ? AND doctorID = ? AND SlotDay = ? AND SlotTime = ?)',
    [patientID, doctorID, SlotDay, SlotTime, patientID, doctorID, SlotDay, SlotTime],
    (err, results) => {
      if (err) {
        console.error('Error creating appointment:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.affectedRows === 0) {
        // The patient already has an appointment at the same slot time and day
        return res.status(400).json({ error: 'Patient already has an appointment at this slot' });
      }

      const appointmentId = results.insertId;

      // Fetch the inserted appointment data
      db.query(
        'SELECT * FROM appointments WHERE appid = ?',
        [appointmentId],
        (fetchErr, fetchResults) => {
          if (fetchErr) {
            console.error('Error fetching appointment data:', fetchErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          if (fetchResults.length === 0) {
            console.error('No data found for the inserted appointment ID:', appointmentId);
            return res.status(500).json({ error: 'Internal Server Error: No data found for the inserted appointment ID' });
          }

          const fetchedAppointment = fetchResults[0];

          // Insert the fetched data into the dr_schedule table
          db.query(
            'INSERT INTO dr_schedule (doctorID, SlotDay, SlotTime, appid , patientID) VALUES (?, ?, ?, ? , ?)',
            [fetchedAppointment.doctorID, fetchedAppointment.SlotDay, fetchedAppointment.SlotTime, fetchedAppointment.appid , fetchedAppointment.patientID],
            (insertErr, insertResults) => {
              if (insertErr) {
                console.error('Error inserting data into dr_schedule table:', insertErr);
                return res.status(500).json({ error: 'Internal Server Error' });
              }

              return res.status(201).json({ message: 'Appointment created successfully', app });
            }
          );
        }
      );
    }
  );
});



// Endpoint to update a patient's appointment
app.put('/appointments/:appID', (req, res) => {
  //const appID = req.params.appID;
  const {appID} =req.params;
  const { patientID, doctorID, SlotDay, SlotTime } = req.body;
  console.log({patientID, doctorID, SlotDay, SlotTime })
  // Update the appointment in the appointments table
  const query = `SELECT * FROM users WHERE id='${patientID}'`
  console.log(query);
  db.query(
    `UPDATE appointments SET patientID = '${patientID}', doctorID = '${doctorID}', SlotDay = '${SlotDay}', SlotTime = '${SlotTime}' WHERE appID = '${appID}'`,
    [patientID, doctorID, SlotDay, SlotTime, appID],
    (err, results) => {
      if (err) {
        console.error('Error updating appointment:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Update the corresponding slot in the dr_schedule table
      db.query(
        'UPDATE dr_schedule SET appID = ? WHERE doctorID = ? AND slotDay = ? AND slotTime = ?',
        [appID, doctorID, SlotDay, SlotTime],
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



//End point to delete an app
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

    // Get the details of the canceled appointment
    const canceledAppointment = checkResults[0];
    db.query(
      'DELETE FROM dr_schedule WHERE appid = ?',
      [appID],
      (deleteErr, deleteResults) => {
        if (deleteErr) {
          console.error('Error deleting from doctor schedule:', deleteErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.status(200).json({
          message: 'Appointment canceled successfully',
          canceledAppointment,
        });
      }
    );

    db.query(
      'DELETE FROM appointments WHERE appID = ?',
      [appID],
      (deleteAppointmentErr, deleteAppointmentResults) => {
        if (deleteAppointmentErr) {
          console.error('Error deleting appointment:', deleteAppointmentErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }       
      }
    );
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