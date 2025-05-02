const express = require('express');
const router = express.Router();
const Prediction = require('../models/predictions');

router.get('/', async (req, res) => {
    try {
        const predictionList = await Prediction.find().sort({ predictionDate: -1 });
        res.render('index', { predictions: predictionList });
    } catch (error) {
        console.error('Error fetching predictions:', error.message);
        res.status(500).send('Unable to load predictions at the moment.');
    }
});

// GET: Show form to add a new prediction
router.get('/add', (req, res) => {
    res.render('add-prediction');
});

router.post('/add', async (req, res) => {
    const { user, champion, runnerUp, finalsMVP, darkHorse, confidenceLevel } = req.body;
    if (!user || !champion || !confidenceLevel) {
        return res.status(400).send('User, Champion, and Confidence Level are required.');
    }

    try {
        const predictionData = new Prediction({
            user,
            champion,
            runnerUp,
            finalsMVP,
            darkHorse,
            confidenceLevel
        });

        await predictionData.save();
        res.redirect('/');
    } catch (error) {
        console.error(`Failed to add prediction for ${user}:`, error.message);
        res.status(500).send('Could not save your prediction. Please try again.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const predictionDetails = await Prediction.findById(req.params.id);
        if (!predictionDetails) {
            return res.status(404).send('Prediction not found.');
        }
        res.render('prediction', { predict: predictionDetails });
    } catch (error) {
        console.error('Error loading prediction:', error.message);
        res.status(500).send('Something went wrong while fetching the prediction.');
    }
});

// GET: Show form to edit an existing prediction
router.get('/edit/:id', async (req, res) => {
    try {
        const predictionToEdit = await Prediction.findById(req.params.id);
        if (!predictionToEdit) {
            return res.status(404).send('Prediction not found.');
        }
        res.render('edit-prediction', { prediction: predictionToEdit });
    } catch (error) {
        console.error('Error retrieving prediction for edit:', error.message);
        res.status(500).send('Unable to load edit form.');
    }
});

// POST: Update an existing prediction
router.post('/edit/:id', async (req, res) => {
    const { user, champion, runnerUp, finalsMVP, darkHorse, confidenceLevel } = req.body;

    try {
        const predictionToUpdate = await Prediction.findById(req.params.id);
        if (!predictionToUpdate) {
            return res.status(404).send('Prediction not found.');
        }

        predictionToUpdate.user = user;
        predictionToUpdate.champion = champion;
        predictionToUpdate.runnerUp = runnerUp;
        predictionToUpdate.finalsMVP = finalsMVP;
        predictionToUpdate.darkHorse = darkHorse;
        predictionToUpdate.confidenceLevel = confidenceLevel;

        await predictionToUpdate.save();
        res.redirect(`/${req.params.id}`);
    } catch (error) {
        console.error('Error updating prediction:', error.message);
        res.status(500).send('Update failed. Please try again.');
    }
});

// DELETE: Remove a prediction
router.delete('/:id', async (req, res) => {
    try {
        // Validate the ID format first
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid prediction ID format' });
        }

        const deletedPrediction = await Prediction.findByIdAndDelete(req.params.id);
        
        if (!deletedPrediction) {
            return res.status(404).json({ error: 'Prediction not found' });
        }
        
        res.json({ 
            success: true,
            msg: 'Prediction successfully deleted.',
            deletedId: req.params.id
        });
    } catch (error) {
        console.error('Error deleting prediction:', error.message);
        res.status(500).json({ 
            error: 'Unable to delete the prediction',
            details: error.message
        });
    }
});

module.exports = router;
