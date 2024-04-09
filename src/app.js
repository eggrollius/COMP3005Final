const express = require('express');
const bodyParser = require('body-parser');
const Trainer = require('./models/trainer');  
const FitnessClass = require('./models/fitnessClass');  

const app = express();

// Middlewares
app.use(express.json());                            // For parsing application/json
app.use(express.urlencoded({ extended: true }));    // Middleware for parsing forms
app.use(express.static('public'));                  // For serving static files in the 'public' directory

// Set the view engine to ejs
app.set('view engine', 'ejs');
// Set the directory where the templates are stored
app.set('views', './views');

// Routes
const memberRoutes = require('./routes/memberRoutes');  
const trainerRoutes = require('./routes/trainerRoutes');  
app.use('/api/members', memberRoutes);
app.use('/api/trainers', trainerRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/member', async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    const fitnessClasses = await FitnessClass.findAll();

    res.render('member', { trainers, fitnessClasses });  // Pass the trainers data to the EJS template
  } catch (error) {
      console.error('Error fetching trainers:', error);
      res.status(500).send('Error loading page');
  }
});

app.get('/trainer', (req, res) => {
  res.render('trainer');
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

// Listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
