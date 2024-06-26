const config = {
  defaultBlockRange: 500000,
  maxBlockRange: 1000000,
};

export class BlockRangeCalculator {
  static calculate(latestBlock) {
    return Math.max(0, latestBlock - config.defaultBlockRange);
  }
}
