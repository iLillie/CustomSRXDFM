class ConnectedPlayer implements IPlayer {
  id: string;
  name: string;
  isAlive: boolean;
  lastRecievedScore: number;
  playerIndex: number;
  isConnected: boolean;
}