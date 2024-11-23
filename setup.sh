#!/bin/bash

# Define os caminhos necessários
APP_PATH="$HOME/.local/share/gaming_hub/"
STEAM_PATH="$HOME/.local/share/Steam/steamapps/"

# Cria a pasta gaming_hub se não existir
if [ ! -d "$APP_PATH" ]; then
    mkdir -p "$APP_PATH"
    echo "Pasta criada: $APP_PATH"
else
    echo "A pasta já existe: $APP_PATH"
fi

# Cria ou reseta o arquivo game_data.json
GAME_DATA_FILE="$APP_PATH/game_data.json"
echo "{}" > "$GAME_DATA_FILE"
echo "Arquivo criado: $GAME_DATA_FILE"

# Define o caminho do arquivo .env no diretório atual
ENV_FILE="./.env"

# Conteúdo a ser adicionado ao arquivo .env
ENV_CONTENT=$(cat <<EOF
APP_PATH="$APP_PATH"
STEAM="$STEAM_PATH"
EPIC="com.epicgames.launcher://apps/"
UPLAY="uplay://launch/"
ORIGIN="origin://launchgame/"
STANDALONE="STANDALONE"
EOF
)

# Cria ou atualiza o arquivo .env
if [ ! -f "$ENV_FILE" ]; then
    echo "$ENV_CONTENT" > "$ENV_FILE"
    echo "Arquivo .env criado e atualizado."
else
    # Atualiza ou adiciona as variáveis no arquivo existente
    echo "Atualizando o arquivo .env..."
    sed -i "/^APP_PATH=/d" "$ENV_FILE"
    sed -i "/^STEAM=/d" "$ENV_FILE"
    sed -i "/^EPIC=/d" "$ENV_FILE"
    sed -i "/^UPLAY=/d" "$ENV_FILE"
    sed -i "/^ORIGIN=/d" "$ENV_FILE"
    sed -i "/^STANDALONE=/d" "$ENV_FILE"
    echo "$ENV_CONTENT" >> "$ENV_FILE"
    echo "Arquivo .env atualizado."
fi

echo "Script concluído."
