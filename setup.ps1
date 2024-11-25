# Define o caminho da pasta gaming_hub no diretório AppData\Local
$gamingHubPath = Join-Path $env:LOCALAPPDATA "gaming_hub/"
$assetsPath = Join-Path $gamingHubPath "assets/images/"

# Converte o caminho para usar barras (/) em vez de barras invertidas (\)
$gamingHubPathUnix = $gamingHubPath -replace '\\', '/'

# Cria a pasta gaming_hub se não existir
if (-not (Test-Path $gamingHubPath)) {
    New-Item -ItemType Directory -Path $gamingHubPath -Force
    New-Item -ItemType Directory -Path $assetsPath -Force
    Write-Host "Pasta criada: $gamingHubPath"
} else {
    Write-Host "A pasta já existe: $gamingHubPath"
}

# Define o caminho do arquivo game_data.json
$gameDataFile = Join-Path $gamingHubPath "game_data.json"

# Cria o arquivo game_data.json vazio (ou limpa se já existir)
Set-Content -Path $gameDataFile -Value "{}" -Force
Write-Host "Arquivo criado: $gameDataFile"

# Define o caminho do arquivo .env no diretório atual
$envFile = Join-Path (Get-Location) ".env"

# Conteúdo a ser adicionado no arquivo .env
$envContent = @"
APP_PATH="$gamingHubPathUnix"
STEAM="C:/Program Files (x86)/Steam/steamapps/"
EPIC="com.epicgames.launcher://apps/"
UPLAY="uplay://launch/"
ORIGIN="origin://launchgame/"
STANDALONE="STANDALONE"
"@

# Adiciona ou atualiza o arquivo .env
if (-not (Test-Path $envFile)) {
    Set-Content -Path $envFile -Value $envContent
    Write-Host "Arquivo .env criado e atualizado."
} 

Write-Host "Script concluído."
