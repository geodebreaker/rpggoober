// Function to compress a string and return a Base64 string
async function compress(input) {
  const encoder = new TextEncoder();
  const compressedStream = new CompressionStream('gzip');
  const writer = compressedStream.writable.getWriter();
  
  // Convert string to Uint8Array and compress
  writer.write(encoder.encode(input));
  writer.close();

  const reader = compressedStream.readable.getReader();
  let compressedChunks = [];
  let done = false;

  while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) compressedChunks.push(value);
      done = streamDone;
  }

  // Combine compressed chunks into a single Uint8Array
  const compressed = new Uint8Array(compressedChunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), []));
  
  // Return the compressed data as a Base64 string
  return String.fromCharCode(...compressed);
}

// Function to decompress a Base64 string and return the original string
async function decompress(compressedStr) {
  const compressed = Uint8Array.from(compressedStr, c => c.charCodeAt(0));
  
  const decompressedStream = new DecompressionStream('gzip');
  const writer = decompressedStream.writable.getWriter();
  
  // Write the compressed Uint8Array into the decompression stream
  writer.write(compressed);
  writer.close();

  const reader = decompressedStream.readable.getReader();
  let decompressedChunks = [];
  let done = false;

  while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) decompressedChunks.push(value);
      done = streamDone;
  }

  // Combine decompressed chunks into a single Uint8Array
  const decompressed = new Uint8Array(decompressedChunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), []));
  
  // Convert decompressed Uint8Array back to string
  return new TextDecoder().decode(decompressed);
}

// // Function to compress a string
// function compress(input) {
//   const dictionary = {};
//   let data = (input + "").split("");
//   let out = [];
//   let currChar;
//   let phrase = data[0];
//   let code = 256;
//   for (let i = 1; i < data.length; i++) {
//       currChar = data[i];
//       if (dictionary[phrase + currChar] != null) {
//           phrase += currChar;
//       } else {
//           out.push(phrase.length > 1 ? dictionary[phrase] : phrase.charCodeAt(0));
//           dictionary[phrase + currChar] = code;
//           code++;
//           phrase = currChar;
//       }
//   }
//   out.push(phrase.length > 1 ? dictionary[phrase] : phrase.charCodeAt(0));
//   for (let i = 0; i < out.length; i++) {
//       out[i] = String.fromCharCode(out[i]);
//   }
//   return out.join("");
// }

// // Function to decompress a string
// function decompress(input) {
//   const dictionary = {};
//   let data = (input + "").split("");
//   let currChar = data[0];
//   let oldPhrase = currChar;
//   let out = [currChar];
//   let code = 256;
//   let phrase;
//   for (let i = 1; i < data.length; i++) {
//       let currCode = data[i].charCodeAt(0);
//       if (currCode < 256) {
//           phrase = data[i];
//       } else {
//           phrase = dictionary[currCode] ? dictionary[currCode] : (oldPhrase + currChar);
//       }
//       out.push(phrase);
//       currChar = phrase.charAt(0);
//       dictionary[code] = oldPhrase + currChar;
//       code++;
//       oldPhrase = phrase;
//   }
//   return out.join("");
// }