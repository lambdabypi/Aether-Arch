/**
 * Aether-Arch Local Bridge (Bi-directional Relay)
 * Save this as 'bridge.js'
 */
import http from 'http';
import readline from 'readline';

const PORT = 3001;
let requestQueue = [];
let pendingResponses = new Map();

// 1. Create Relay Server
const server = http.createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS') { res.end(); return; }

	// App Polls for requests from Roo
	if (req.url === '/poll' && req.method === 'GET') {
		const nextRequest = requestQueue.shift() || {};
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(nextRequest));
		return;
	}

	// App Sends results back
	if (req.url === '/respond' && req.method === 'POST') {
		let body = '';
		req.on('data', chunk => { body += chunk; });
		req.on('end', () => {
			const { id, result, error } = JSON.parse(body);
			if (pendingResponses.has(id)) {
				pendingResponses.get(id)({ id, result, error });
				pendingResponses.delete(id);
			}
			res.writeHead(200);
			res.end();
		});
		return;
	}

	res.writeHead(404);
	res.end();
});

server.listen(PORT, 'localhost', () => {
	console.error(`Aether-Arch Relay started on http://localhost:${PORT}`);
});

// 2. Interface with Roo Code (STDIN/STDOUT)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on('line', (line) => {
	if (!line) return;
	try {
		const request = JSON.parse(line);
		if (!request.id) return;

		// Add to queue for the Browser App to pick up
		requestQueue.push(request);

		// Wait for App to respond
		pendingResponses.set(request.id, (response) => {
			// Return to Roo Code STDOUT
			process.stdout.write(JSON.stringify(response) + '\n');
		});
	} catch (e) {
		console.error('Bridge Error:', e.message);
	}
});