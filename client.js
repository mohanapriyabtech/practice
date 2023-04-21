const grpc = require('grpc')
const PROTO_PATH = './notes.proto'
const NoteService = grpc.load(PROTO_PATH).NoteService
const client = new NoteService('127.0.0.1:50051',
    grpc.credentials.createInsecure())
module.exports = client