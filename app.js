require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const PORT = process.env.PORT || 8000;

mongoose.connect('mongodb://localhost:27017/classrooms', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(() => {
	console.log('connected to database');
});

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

app.use('/', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.listen(PORT, function(){
	console.log(`Server is on port ${PORT}`);
});