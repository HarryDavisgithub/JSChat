import { serve } from "https://deno.land/std@0.106.0/http/server.ts";
import {
	acceptWebSocket,
	acceptable,
	isWebSocketCloseEvent,
} from "https://deno.land/std@0.106.0/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

// server setup
const server = serve({ port: 8080 });
console.log("http://localhost:8080/");

let sockets = new Map(); //holds key-value pairs

const broadcastEvent = (obj) => {
	sockets.forEach((ws) => {
		//goes through the map
		ws.send(JSON.stringify(obj)); //to each element in map(each browser), the passed object is sent as a string
	});
};

const chatConnection = async (ws) => {
	const uuid = v4.generate(); //generate uuid
	sockets.set(uuid, ws); //add generated uuid and ws to map
	console.log(sockets);
	for await (const e of ws) {
		//loops over async iterable objects

		if (isWebSocketCloseEvent(e)) {
			//checks to see if browser closed
			sockets.delete(uuid); //removed key-value pair from map

			console.log(sockets);
		}
		if (typeof e === "string") {
			//checks to see if event is a string
			let eventObj = JSON.parse(e.toString()); //if it is, take the string and turn it into a json object
			console.log(eventObj);
			broadcastEvent(eventObj);
		}
	}
};

for await (const req of server) {
	// if (req.url === "/") {
	// 	req.respond({
	// 		status: 200,
	// 	});
	// }

	//accept websocket connection
	if (req.url === "/ws") {
		if (acceptable(req)) {
			//checks to see if valid ws request
			acceptWebSocket({
				//returns promise
				conn: req.conn,
				bufReader: req.r, //to receive information
				bufWriter: req.w, //to send information
				headers: req.headers, //request headers
			}).then(chatConnection); //connection handler
		}
	}
}
