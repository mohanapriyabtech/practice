// http.js
export default {
    port: 6000,
    fetch(request) {
      return new Response("Welcome to Bun!");
    },
  };

  console.log("hi")