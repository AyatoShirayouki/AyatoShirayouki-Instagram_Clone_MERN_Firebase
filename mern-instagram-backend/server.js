import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import dbModel from './dbModel.js';

//app config
const app = express();
const port = process.env.PORT || 8080;

const pusher = new Pusher({
  appId: "1177777",
  key: "dfa3aea494ca090a2641",
  secret: "b1bedff3a3c14a043034",
  cluster: "eu",
  useTLS: true
});

//middlewares
app.use(express.json());
app.use(cors());

// db config
const connection_url = 'mongodb+srv://admin:rexibexi1@cluster0.tdeup.mongodb.net/instaDB?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log("DB is connected!");

    const changeStream = mongoose.connection.collection('posts').watch();

    changeStream.on('change', (change) => {
        console.log('Change Triggered. Change')
        console.log(change)
        console.log('End of change');

        if(change.operationType === 'insert'){
            console.log('triggering Pusher **IMG UPLOAD***');

            const postDetails = change.fullDocument;
            pusher.trigger('posts', 'inserted', {
                user: postDetails.user,
                caption: postDetails.caption,
                image: postDetails.image
            })
        } else{
            console.log('Error triggering pusher')
        }
    });
});

//api routes
app.get('/', (req, res) => res.status(200).send('Server is ON!'));

app.post('/upload', (req, res) => {
    const body = req.body;

    dbModel.create(body, (err, data) => {
        if(err){
            res.status(500).send(err);
        } else{
            res.status(201).send(data);
        }
    });
});

app.get('/sync', (req, res) => {
    dbModel.find((err, data) => {
        if(err){
            res.status(500).send(err);
        } else{
            res.status(200).send(data);
        }
    })
});

// listeners
app.listen(port, () => console.log(`listening on localhost: ${port}`));
