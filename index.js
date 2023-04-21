const grpc = require('grpc')
const notesProto = grpc.load('notes.proto')
const notes = [
    { id: '1', title: 'Note 1', content: 'Content 1'},
    { id: '2', title: 'Note 2', content: 'Content 2'}
]
const server = new grpc.Server()

const uuidv1 = require('uuid/v1');

server.addService(notesProto.NoteService.service, {

    insert: (call, callback) => {
        let note = call.request
        note.id = uuidv1()
        notes.push(note)
        callback(null, note)
    },
    list: (_, callback) => {
        callback(null, notes)
    },
    delete: (call, callback) => {
        let existingNoteIndex = notes.findIndex((n) => n.id ==call.request.id)
        if (existingNoteIndex != -1) {
            notes.splice(existingNoteIndex, 1)
            callback(null, {})
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            })
        }
      }
        
    
})
server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
console.log('Server running at http://127.0.0.1:50051')
server.start()