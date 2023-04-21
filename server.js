const path = require('path');
// const grpc = require('@grpc/grpc-js');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');
const client = require("./client")

const packageDefinitionReci = protoLoader.loadSync(path.join(__dirname, 'notes.proto'));

const recipesProto = grpc.loadPackageDefinition(packageDefinitionReci);

const recipesStub = new recipesProto.NoteService('127.0.0.1:50051', grpc.credentials.createInsecure());


const app = express();
app.use(express.json());

const restPort = 4000;
let orders = [];


// app.post('/insert-notes', (req, res) => {

//     let orderId = Object.keys(orders).length + 1;
//     let notes = {
//         id: orderId,
//         title: req.body.title,
//         content: req.body.content,
//     };
//     orders.push(notes)
//     console.log(orders)
//     res.send(orders);
// });


app.post('/insert-notes', (req, res) => {
    const note = req.body;
  
    recipesStub.insert(note, (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error saving note.');
        return;
      }
  
      res.send(response);
    });
  });

app.get('/all-notes',(req, res) => {
    
    recipesStub.List({}, (error, response) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error retrieving notes.');
          return;
        }
    
        res.send(response.notes);
    });
});


app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
  
    const noteRequest = {
      id: id
    };
  
    recipesStub.list(noteRequest, (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error retrieving note.');
        return;
      }
  
      const note = response.notes.find(note => note.id === id);
      if (!note) {
        res.status(404).send('Note not found.');
        return;
      }
  
      res.send(note);
    });
});

app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
  
    const noteRequestId = {
      id: id
    };
  
    recipesStub.delete(noteRequestId, (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error deleting note.');
        return;
      }
  
      const deletedNote = response;
      res.send(deletedNote);
    });
});



app.delete('/notes', (req, res) => {
    recipesStub.deleteAll({}, (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error deleting all notes.');
        return;
      }
  
      res.send('All notes deleted successfully.');
    });
});




app.listen(restPort, () => {
    console.log(`RESTful API is listening on port ${restPort}`)
});