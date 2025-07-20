const config = {
  defaultBlockRange: 100000,   // Reduced to 100k blocks (~1 week) to prevent timeouts
  maxBlockRange: 500000,       // Reduced max range
  chunkSize: 10000,            // Size for chunked requests
};

export class BlockRangeCalculator {
  static calculate(latestBlock) {
    return Math.max(0, latestBlock - config.defaultBlockRange);
  }
  
  static getChunkSize() {
    return config.chunkSize;
  }
  
  static calculateChunks(fromBlock, toBlock) {
    const chunks = [];
    for (let start = fromBlock; start < toBlock; start += config.chunkSize) {
      chunks.push({
        fromBlock: start,
        toBlock: Math.min(start + config.chunkSize - 1, toBlock)
      });
    }
    return chunks;
  }
}
