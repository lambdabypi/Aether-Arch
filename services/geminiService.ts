
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResults, MCPTool, TargetedRefactor } from "../types";

const ARCH_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallHealthScore: { type: Type.NUMBER },
    debtItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['Complexity', 'Coupling', 'Redundancy', 'Security'] },
          severity: { type: Type.STRING, enum: ['Critical', 'High', 'Medium', 'Low'] },
          description: { type: Type.STRING },
          impact: { type: Type.STRING },
          location: { type: Type.STRING }
        },
        required: ["id", "category", "severity", "description", "impact", "location"]
      }
    },
    refactors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
          codeChanges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                file: { type: Type.STRING },
                before: { type: Type.STRING },
                after: { type: Type.STRING }
              }
            }
          }
        },
        required: ["title", "description", "benefits", "codeChanges"]
      }
    },
    compliance: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          control: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['Pass', 'Fail', 'Warning'] },
          finding: { type: Type.STRING },
          remediation: { type: Type.STRING }
        },
        required: ["control", "status", "finding", "remediation"]
      }
    },
    sandboxLogs: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["overallHealthScore", "debtItems", "refactors", "compliance", "sandboxLogs"]
};

const TARGETED_REFACTOR_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    file: { type: Type.STRING },
    health: { type: Type.NUMBER },
    proposal: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
        codeChanges: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              file: { type: Type.STRING },
              before: { type: Type.STRING },
              after: { type: Type.STRING }
            }
          }
        }
      }
    }
  },
  required: ["file", "health", "proposal"]
};

export const TOOLS: MCPTool[] = [
  {
    name: "inspect_architecture",
    description: "Deep-scans source code to identify architectural debt and health scores.",
    inputSchema: {
      type: "object",
      properties: {
        files: { type: "array", items: { type: "object", properties: { name: { type: "string" }, content: { type: "string" } } } }
      }
    }
  },
  {
    name: "audit_compliance",
    description: "Verifies codebase against SOC2 frameworks and security best practices.",
    inputSchema: {
      type: "object",
      properties: {
        files: { type: "array", items: { type: "object", properties: { name: { type: "string" }, content: { type: "string" } } } }
      }
    }
  },
  {
    name: "targeted_refactor",
    description: "Focuses analysis on a single file to provide instant plugin-like feedback.",
    inputSchema: {
      type: "object",
      properties: {
        fileName: { type: "string" },
        content: { type: "string" }
      }
    }
  }
];

export const executeMCPTool = async (toolName: string, files: { name: string, content: string }[]): Promise<AnalysisResults> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const fileContext = files.map(f => `File: ${f.name}\nContent:\n${f.content}`).join('\n\n');
  
  const prompt = `
    ACTION: Executing MCP Tool: ${toolName}
    CONTEXT:
    ${fileContext}

    REQUIREMENTS:
    - Identify technical debt (complexity, circular dependencies).
    - Propose specific refactors with before/after blocks.
    - Check SOC2 readiness (encryption, least privilege).
    - Provide logs of a simulated sandbox environment run.
    
    Return the result in strictly valid JSON format matching the MCP-ready schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: ARCH_ANALYSIS_SCHEMA,
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  if (!response.text) throw new Error("MCP Tool Execution Failed: Empty result");
  return JSON.parse(response.text.trim()) as AnalysisResults;
};

export const analyzeActiveFile = async (fileName: string, content: string): Promise<TargetedRefactor> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Perform a targeted architectural review of the file: ${fileName}.
    Content:
    ${content}

    Provide a 0-100 health score and one significant refactor proposal that improves its scalability or compliance.
    Return strictly JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: TARGETED_REFACTOR_SCHEMA
    }
  });

  if (!response.text) throw new Error("Targeted analysis failed");
  return JSON.parse(response.text.trim()) as TargetedRefactor;
};
