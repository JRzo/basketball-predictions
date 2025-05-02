const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const mongoURL = 'mongodb+srv://juliosoftwaredev:CyberWarrior2209**@basketballbracketdb.qndxxen.mongodb.net/?retryWrites=true&w=majority&appName=BasketballBracketDB';
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {

    console.log('✅ Connected to MongoDB successfully')
})
.catch(err => console.error('❌ MongoDB connection error:', err.message));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


const predictionsRouter = require('./routes/predictions');
app.use('/', predictionsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is live at http://localhost:${PORT}`);
});
