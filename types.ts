
export enum Status {
  INITIAL = 'INITIAL',
  CHECKING = 'CHECKING',
  UP = 'UP',
  DOWN = 'DOWN',
}

export interface HistoryEntry {
  status: Status.UP | Status.DOWN;
  timestamp: Date;
}
