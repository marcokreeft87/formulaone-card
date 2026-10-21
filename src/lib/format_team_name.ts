export const formatTeamName = (name: string, enabled = false): string => enabled ? name.replace(/\s+(f1\s+)?team\s*$/i, '') : name;
