const express = require('express');
const bodyParser = require('body-parser');

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
app.use('/api', memberRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/member', (req, res) => {
  res.render('member');
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
