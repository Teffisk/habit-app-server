require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = require('../models');

// find all of a user's habits
router.get('/:userid', (req, res) => {
    db.Habit.find({ user: req.params.userid })
    .then(habits => {
        res.send(habits)
    })
    .catch(err => {
        console.log('error habits/dashoboard GET Route', err)
    })
})

// Creating a new habit
router.post('/:userid', (req, res) => {
    db.Habit.create({
        name: req.body.name,
        timesPerDay: req.body.timesPerDay,
        description: req.body.description,
        days: [],
        user: req.body.user
    })
    .then(habit => {
        res.status(200).send(habit)
    })
    .catch(err => {
        res.status(404).send('Error made in POST habit route')
        console.log('error in /habit/POST Route', err)
    })
})

// Edit a habit
router.put('/:userid', (req, res) => {
    db.Habit.findOneAndUpdate({ 
        id: req.params.userid }, 
        req.body, { new: true })
    .then(habit => {
        res.send(habit)
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send({message: 'Server Error'})
    });
})

// Let a user enter daily completions
router.put('/:userid/completions', (req, res) => {
    db.Habit.findOneAndUpdate(
        { id: req.params.habit.id }, 
         { $push: { days: req.date, completions: req.completions, notes: req.notes }, 
    })
    .then(habit => {
        res.send(habit)
    })
    .catch(err =>{
		console.log(err);
		res.status(500).send({message: 'Server Error'})
    });
});
    
router.delete('/:userid', (req, res) => {
    db.Habits.findOneAndDelete({ name: req.body.habit.id, user: req.params.userid })
    .then(() => {
        res.status(204).send({ messgae: 'successful Deletion' })
    })
    .catch(err =>{
            console.log(err);
            res.status(500).send({message: 'Server Error'})
        });
    });


module.exports = router;