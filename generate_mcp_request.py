import os
import json

def generate_mcp_request():
    files_to_send = []
    for root, _, filenames in os.walk('.'):
        for filename in filenames:
            if filename.endswith(('.ts', '.tsx')):
                filepath = os.path.join(root, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    files_to_send.append({"name": filepath, "content": content})

    # Construct the MCP request for inspect_architecture
    mcp_request = {
        "id": "roo-inspect-arch-123", # A unique ID for this request
        "method": "inspect_architecture",
        "params": {
            "files": files_to_send
        }
    }
    print(json.dumps(mcp_request))

if __name__ == "__main__":
    generate_mcp_request()