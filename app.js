var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv = require('dotenv');



dotenv.config()

var app = express();




var port = 5000;

console.log(process.env.MONGO_URI)

//db connection with mongoose(mongodb)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//to get the css file from public folder
app.use(express.static(__dirname + '/public'));

//interact with index.ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//mongoose schema
var todoSchema = new mongoose.Schema({
    name: String
});

var Todo = mongoose.model("Todo", todoSchema);


//routes
app.get("/", (req, res) =>{
    // await Todo.find({});

    Todo.find({}).then(function(FoundItems){
    
        res.json(FoundItems)

    
      })
       .catch(function(err){
        console.log(err);
      })
});

//route for adding new task
app.post("/newtodo", (req, res)=>{
    console.log(req)
    var newTask = new Todo({
        name: req.body.task
    });
    //add to db
    Todo.create(newTask).then(function(){
        res.status(201).json({ message: 'added' })
        })

        .catch(function(err){
        console.log(err);
      })
        });

//route to delete a task by id
app.get("/delete/:id", (req, res)=>{
    var taskId = req.params.id;//get the id from the api 
    console.log(req.params.id);
    mongoose.model('Todo').deleteOne({_id: taskId}, (err, result)=>{
        if(err){
            console.log(`Error is deleting the task ${taskId}`);
        }
        else{
            console.log("Task successfully deleted from database");
            res.redirect("/");
        }
    });
});

//route for deleting all tasks
app.post("/deleteAll", (req, res)=>{
    // var myquery = { name: /^O/ };
    mongoose.model('Todo').deleteMany({}, (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(`Deleted all tasks`);
            res.redirect("/");
        }
    });
});

//catch the invalid get requests
app.get("*", (req, res)=>{
    res.send("<h1>Invalid Page</h1>");
});

//listen on port 3000
app.listen(port, (error)=>{
    if(error){
        console.log("Issue in connecting to the server");
    }
    else{
        console.log("Successfully connected to the server");
    }
})