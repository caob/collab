import { Room, Client } from "colyseus";
import { State, Path, BRUSH, DEFAULT_BRUSH } from "./State";
import { Player } from "./Player";
import { generateName } from "../utils/name_generator";
// import Drawing from "../db/Drawing";
import * as svr from "../index";

export class DrawingRoom extends Room<State> {
  autoDispose = false;
  lastChatMessages: string[] = [];

  onCreate(options) {
    this.setState(new State());

    this.state.countdown = options.expiration;
    this.setSimulationInterval(() => this.countdown(), 1000);

    this.onMessage("brush", (client, message) => this.drawingAction(client, message));

  }

  onJoin(client: Client, options: any) {
    const player = this.state.createPlayer(client.sessionId);
    player.name = options.nickname || generateName();

    this.lastChatMessages.forEach(chatMsg => this.send(client, 'chat', chatMsg));
  }

  drawingAction(client: Client, message: any) {
    const player: Player = this.state.players[client.sessionId];
    const [command, data] = message;

    // change angle
    if (command === "chat") {
      const chatMsg = `${player.name}: ${data}`;
      this.broadcast('chat', chatMsg);
      this.lastChatMessages.push(chatMsg);

      // prevent history from being 50+ messages long.
      if (this.lastChatMessages.length > 50) {
        this.lastChatMessages.shift();
      }

    } else if (this.state.countdown > 0) {
      if (command === "s") {
        //
        // start new path.
        //
        // store it in the `player` instance temporarily,
        // and assign it to the state.paths once it's complete!
        //
        player.lastPath = new Path();
        player.lastPath.points.push(...data);
        player.lastPath.color = message[2];
        player.lastPath.brush = message[3] || DEFAULT_BRUSH;

      } else if (command === "p") {
        // add point to the path
        player.lastPath.points.push(...data);

      } else if (command === "e") {
        //
        // end the path
        // this is now going to synchronize with all clients
        //
        this.state.paths.push(player.lastPath);
      }
    }
  }

  countdown() {
    if (this.state.countdown > 0) {
      this.state.countdown--;

    } else if (!this.autoDispose) {
      this.autoDispose = true;
      this.resetAutoDisposeTimeout(5);
    }
  }

  onLeave(client: Client) {
    this.state.removePlayer(client.sessionId);
   
    
    if (!this.autoDispose && Object.keys(this.state.players).length === 0) {
      this.autoDispose = true;
      this.resetAutoDisposeTimeout(5); 
      console.log("No quedaron participantes en la sala");
    }
  }

  // new by caob v1.5
  onClose(client: Client) {
    this.state.removePlayer(client.sessionId);
    this.autoDispose = true;
    this.resetAutoDisposeTimeout(5);
  }

  async onDispose() {
    console.log("Liberando la sala... aqui es cuando se graba el resultado");

    if (this.state.paths.length > 0) {
      await svr.conn.model('Drawing').create({
        paths: this.state.paths,
        mode: this.roomName,
        owner: this.roomName.substr(0,2),
        votes: 0,
      });
    }
  }

}
