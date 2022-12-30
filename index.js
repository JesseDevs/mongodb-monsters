import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

async function connection() {
	await mongoose.connect("mongodb+srv://Jessedevs:ThisPassword622@practice.htfphyy.mongodb.net/nintentdo-app");
}

connection().catch(err => console.log(err));

const ninSchema = new mongoose.Schema({
	name: String,
	color: String,
	active: Boolean
});
const Character = mongoose.model('Character', ninSchema);

app.listen(1111);
app.get('/', function (req, res) {
	res.send(`<h1> HOME </h1>
		<a href='/list'> List </a>
		<a href='/create'> Create </a>
		`)
})

app.get('/list', async function (req, res) {
	const characters = await Character.find();

	var list = `<h1> All Characters </h1>

	<a href='/list'> List </a>
	<a href='/create'> Create </a>
	<ul>`;
	characters.forEach(char => {
		list += `<li>
		<p> <strong>${char.name}</strong> - ${char.color}</p>

		<a href='/delete/${char.id}'> Delete </a>
		<a href='/update/${char.id}'> Update </a>
		</li>`
	});
	list += `</ul>`

	res.send(list)
})

app.get('/create', function (req, res) {

	const form = `

	<form action="/save-character" method="post">
	<field>
	<label for="name">Name:</label>
	<input type="text" id="name" name="name">
	</field>

	<field>
	<label for="color">Color:</label>
	<input type="text" id="color" name="color">
	</field>

	<input type="submit" value="Save Character">
	</form>`

	res.send(form);

})

app.post('/save-character', (req, res) => {
	const character = new Character({
		name: req.body.name,
		color: req.body.color,
		active: false
	})

	character.save();
	res.send(`

		<h1> ${character.name} </h1>
		<em> Their color is ${character.color} </em>
		<p> Character Added! </p>

		<a href='/list'> List </a>
		<a href='/create'> Create </a>

		`)

});

app.get('/delete/:id', async function (req, res) {

	await Character.findByIdAndDelete(req.params.id);
	res.redirect('/list')
})

app.get('/update/:id', async function (req, res) {
	const char = await Character.findById(req.params.id);

	const updateForm = `

	<form action="/update-character/${req.params.id}" method="post">
	<field>
	<label for="newName">Name:</label>
	<input type="text" placeholder="${char.name}" id="name" name="newName">
	</field>

	<field>
	<label for="newColor">Color:</label>
	<input type="text" placeholder="${char.color}" id="color" name="newColor">
	</field>

	<input type="submit" value="Update Character">
	</form>`

	res.send(updateForm);

})


app.post('/update-character/:id', async function (req, res) {
	let char = await Character.findById(req.params.id);
	console.log(char);
	if (req.body.newName != '') {
		char.name = req.body.newName;
	}
	if (req.body.newColor != '') {
		char.color = req.body.newColor;
	}

	char.save();
	res.send(`

		<h1> ${char.name} </h1>
		<em> Their color is ${char.color} </em>
		<p> Character Updated! </p>

		<a href='/list'> List </a>
		<a href='/create'> Create </a>

		`)
});
