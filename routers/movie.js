var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {

    getAll: function (req, res) {
        Movie.find({}).populate("actors").exec(function (err, movies) {
            if (err) return res.status(400).json(err);

            res.json(movies);
        });
    },


    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        });
        
    },


    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },


    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },

    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id}, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },


    //Task 4: removing an actor from the movie list
    removeActor: function (req, res) {
        let actorId = req.params.actorId;
        let movieId = req.params.movieId;

        
        Movie.findOne({_id: movieId }, function(err, movie){
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            //find the actor id and remove it from the movies
            Actor.findOne({_id: actorId }, function(err, actor){
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                
                //removing actor from the movie array
                movie.actors.pop(actor._id);
                movie.save(function(err){
                    if (err) return res.status(500).json(err);
                    res.json({msg:"Succesfully deleted"});
                     });
            });
        });
    },

    //Task 5 Adding actor
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },

//Task 6 get all year between year1>year2.
    getAllYear:function (req, res) {
        let year1 = parseInt(req.params.year1);
        let year2 = parseInt(req.params.year2);
        Movie.where('year').gt(year1).where('year').lt(year2).exec(function (err,data){
            if (err) return res.status(400).json(err);
            res.json(data);

        })
    }
};