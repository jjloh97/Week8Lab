const mongoose = require('mongoose');

const Actor = require('../models/actor');
const Movie = require('../models/movie');

module.exports = {

    getAll: function (req, res) {
        Actor.find({}).populate("movies").exec(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        });
    },

    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();

        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },

    getOne: function (req, res) {
        Actor.findOne({_id: req.params.id})
            .populate('movies') //.populate replaces each ID in the array ‘movies’ with its document.
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },


    updateOne: function (req, res) {
        Actor.findOneAndUpdate({_id: req.params.id}, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            res.json(actor);
        });
    },


    deleteOne: function (req, res) {
        Actor.findOneAndRemove({
            _id: req.params.id
        }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },


    addMovie: function (req, res) {
        Actor.findOne({
            _id: req.params.id
        }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            Movie.findOne({
                _id: req.body.id
            }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);

                    res.json(actor);
                });
            })
        });
    },

    //Task 2: Delete Actor and ALL its movies
    deleteMovieActor: function (req, res) {
        Actor.findOne({_id: req.params.id},function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                //check each of the element in the movie array
                actor.movies.forEach(element => {
                Movie.deleteMany({_id: element}, function (err) {
                    if (err) return res.status(400).json(err);
                    })
                    //delete all of the movies within the array
                });
            });
            
        //remove the particular actor 
        Actor.findOneAndRemove({_id: req.params.id}, function (err,actor) {
            if (err) return res.status(400).json(err);
            res.json({msg:"Successfully deleted"});
        });  
    }, 

    //Task 3: Remove a movie from the list of actors
    removeMovie: function (req,res){
        let actorId = req.params.actorId;
        let movieId = req.params.movieId;
        
        Actor.findOne({_id: actorId }, function(err, actor){
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            
            Movie.findOne({_id: movieId }, function(err, movie){
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                
                //removing movie from the actor 
                actor.movies.pop(movie._id);
                actor.save(function(err){
                    if (err) return res.status(500).json(err);
                    res.json({msg:"Succesfully deleted"});
                    });
            });
        });           
    },
 
    //Extra Task: Increment Age 
    incrementAge: function (req,res){
    
    //if statement checks for actor bYear > 50 
    test = {"bYear":{$lte:1969}};
    
    Actor.updateMany(test,{$inc : {'bYear': 4}}).exec(function (err,actor){
        if (err) return res.status(400).json(err);
        if (!actor) return res.status(404).json();
        res.json(actor);
        })

}
};