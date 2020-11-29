var mongoose = require('mongoose');
// var data = [ { item: 'get milk' }, { item: 'get eggs' }, { item: 'walk dog' } ];

// const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://test:test@todo.waot9.mongodb.net/first-project?retryWrites=true&w=majority';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect((err) => {
// 	const collection = client.db('first-project').collection('todos');
// 	// perform actions on the collection object
// 	client.close();
// });

// Connect to the database
mongoose
	.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
	.catch((error) => handleError(error));

// create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
	item: String,
});
//                      collection , schema
var Todo = mongoose.model('todos', todoSchema);

/* save item to mongoDB every time i render 

var itemOne = Todo({ item: 'buy flowers' }).save((err) => {
	if (err) throw err;
	console.log('item saved');
});

*/

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
module.exports = function(app) {
	app.get('/todo', (req, res) => {
		// get data from mongoDB and pass it to the view
		// at find == {} => get all collection ,, {item:'buy stuff'} => get specific data
		Todo.find({}, (err, data) => {
			if (err) throw err;
			//      component,  data passed to component
			res.render('todo', { todos: data });
		});
	});

	app.post('/todo', urlencodedParser, (req, res) => {
		// get data from view and add it to mongodb
		var newTodo = Todo(req.body).save((err, data) => {
			if (err) throw err;
			res.json(data);
		});
	});

	app.delete('/todo/:item', (req, res) => {
		// delete the requested item from mongodb
		Todo.find({ item: req.params.item.replace(/\-/g, ' ') }).deleteOne((err, data) => {
			if (err) throw err;
			res.json(data);
		});
	});
};
