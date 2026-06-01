#!/bin/bash
# Bloqueia comandos destrutivos
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if echo "$COMMAND" | grep -qE '(rm -rf /|DROP DATABASE|DROP TABLE|TRUNCATE|git push --force|git reset --hard)'; then
  echo '{"decision": "block", "reason": "Comando destrutivo bloqueado por hook de segurança"}'
  exit 2
fi

if echo "$COMMAND" | grep -qE '(cat.*\.env|echo.*SECRET|echo.*PASSWORD)'; then
  echo '{"decision": "block", "reason": "Comando pode expor secrets"}'
  exit 2
fi

echo '{"decision": "allow"}'
