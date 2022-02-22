import React from "react";
let ws = new WebSocket("ws://localhost:8080/ws"); //creates connection to server

export default class Chat extends React.Component {
	constructor() {
		super();
		this.state = {
			enableMessageInput: false,
			name: "",
			message: "",
			messages: "",
			data: [],
		};
	}

	componentDidMount() {
		ws.addEventListener("message", this.addMessage); //adds event listener to incoming message from the server
	}

	componentWillUnmount() {
		ws.removeEventListener("message", this.addMessage);
	}

	handleNameSubmit = (e) => {
		e.preventDefault();
		this.setState({ enableMessageInput: true });
	};

	handleMessageSubmit = (e) => {
		e.preventDefault();
		this.setState({ message: "" });
		ws.send(JSON.stringify({ name: this.state.name, message: this.state.message })); //sends input to server
	};

	addMessage = ({ data }) => {
		const stateData = this.state.data;
		stateData.push(data);
		console.log(stateData);
		this.setState({ data: stateData });
	};

	getChats = () => {
		return this.state.data.map((data, key) => {
			console.log(data);
			const { name, message } = JSON.parse(data);
			return (
				<li key={key}>
					<div className="name">{name}</div>
					<div className="message">{message}</div>
				</li>
			);
		});
	};

	render() {
		return (
			<div className="container">
				<h1>RPS Chat</h1>
				{!this.state.enableMessageInput ? (
					<form onSubmit={this.handleNameSubmit}>
						<input
							type="text"
							value={this.state.name}
							onChange={(e) => this.setState({ name: e.target.value })}
							placeholder="Choose a name"
						/>
						<input type="submit" value="Submit"></input>
					</form>
				) : (
					<div>
						{this.getChats()}
						<form onSubmit={this.handleMessageSubmit}>
							<input
								type="text"
								value={this.state.message}
								onChange={(e) => this.setState({ message: e.target.value })}
								placeholder="Enter a chat"
								required
							/>
							<input type="submit" value="Submit"></input>
						</form>
					</div>
				)}
			</div>
		);
	}
}
