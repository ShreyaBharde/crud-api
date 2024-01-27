const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/hospital-appointment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const AppointmentSchema = new mongoose.Schema({
  name: String,
  date: String,
  age: Number,
  city: String,

});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

// Routes
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({'date':1});
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/appointments', async (req, res) => {
  
  try {
    const { name, date, age, city } = req.body;
    const appointment = new Appointment({ name, date, age, city });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date, age, city } = req.body;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.name = name;
    appointment.date = date;
    appointment.age = age;
    appointment.city = city;

    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/appointments/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const appointment = await Appointment.findById(id);
  
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      await appointment.deleteOne(); 
  
      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
