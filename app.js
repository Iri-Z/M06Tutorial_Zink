const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');
const { render } = require('ejs');

//express app
const app = express();

//connect to database

const dbURI = 'mongodb+srv://netninja:password1234@nodetutorial.mchtda8.mongodb.net/nodeTutorial?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => app.listen(3000))
.catch((err) => console.log(err));

//register view engine 
app.set('view engine', 'ejs');

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//mongoose and mongo sandbox routes
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'new blog',
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     });

//     blog.save()
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// });

// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// });

// app.get('/single-blog', (req, res) => {
//     Blog.findById('63365d4ed0e891248a52cdb3')
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// });

app.use((req, res, next ) => {
    console.log('new request made:');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    next();

});

app.get('/', (req, res) => {
    // const blogs = [
    //     {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    //     {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    //     {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    // ];
    // res.render('index', { title: "Home", blogs /*: blogs */});

    res.redirect('/blogs');

});

app.use((req, res, next ) => {
    console.log('in the next middleware');
    next();
});

app.get('/about', (req, res) => {
    res.render('about', { title: "About"});

});

//blog routes

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1})
    .then((result) => {
        res.render('index', { title: 'All Blogs', blogs: result});
    })
    .catch((err) => {
        console.log(err)
    });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: "Create a New Blog"});
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then((result) => {
        res.render('details', {blog: result, title: 'Blog Details'});
    })
    .catch((err) => {
        console.log(err);
    })

});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
    .then((result) => {
        res.redirect('/blogs')

    })
    .catch((err) => {
        console.log(err);
    });

});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
    .then((result) => {
        res.json({ redirect: '/blogs' });
    })
    .catch((err) => {
        console.log(err);
    });
});

//404 page 
app.use((req, res) => {
    res.status(404).render('404', { title: "404"});

});
 