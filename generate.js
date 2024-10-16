// Listen for messages from the main thread.
// If the message command is "generate", call `generatePrimes()`
addEventListener("message", (message) => {
    if (message.data.command === "generate") {
      generatePrimes(message.data.quota);
    }
  });
  
  // Generate primes (very inefficiently)
  function generatePrimes(quota) {
    function isPrime(n) {
      for (let c = 2; c <= Math.sqrt(n); ++c) {
        if (n % c === 0) {
          return false;
        }
      }
      return true;
    }
  
    const primes = [];
    const maximum = 1000000;
    let primesChunk = [];
  
    while (primes.length < quota) {
      const candidate = Math.floor(Math.random() * (maximum + 1));
      if (isPrime(candidate)) {
        primes.push(candidate);
      }
    }
  
    // When we have finished, send a message to the main thread,
    // including the number of primes we generated.
    // Sending all the prime number data in chunks prevents memory errors trying to send it all at once
  
    let counter = 1;
    let chunkHasUnpostedData = false;
    for(let i = 0; i < primes.length; i++){
        
        primesChunk.push(primes[i])
        chunkHasUnpostedData = true;
        if(counter === 1000){
            postMessage(primesChunk);
            primesChunk = [];
            counter = 0;
            chunkHasUnpostedData = false;
        }
        counter++;
    }
    if(chunkHasUnpostedData){
        postMessage(primesChunk)
    }
    
  }
  