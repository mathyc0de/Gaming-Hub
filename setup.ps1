# Define o caminho da pasta gaming_hub no diretório AppData\Local
$gamingHubPath = Join-Path $env:LOCALAPPDATA "gaming_hub/"

# Converte o caminho para usar barras (/) em vez de barras invertidas (\)
$gamingHubPathUnix = $gamingHubPath -replace '\\', '/'

# Cria a pasta gaming_hub se não existir
if (-not (Test-Path $gamingHubPath)) {
    New-Item -ItemType Directory -Path $gamingHubPath -Force
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
} else {
    # Atualiza ou adiciona as entradas no arquivo existente
    $existingContent = Get-Content -Path $envFile

    # Atualiza ou adiciona cada entrada
    $updatedContent = $existingContent `
        -replace "APP_PATH=.*", "APP_PATH=`"$gamingHubPathUnix`"" `
        -replace "STEAM=.*", 'STEAM="C:/Program Files (x86)/Steam/steamapps/"' `
        -replace "EPIC=.*", 'EPIC="com.epicgames.launcher://apps/"' `
        -replace "UPLAY=.*", 'UPLAY="uplay://launch/"' `
        -replace "ORIGIN=.*", 'ORIGIN="origin://launchgame/"' `
        -replace "STANDALONE=.*", 'STANDALONE="STANDALONE"'

    # Se as variáveis não existirem, adiciona no final do arquivo
    if ($updatedContent -notmatch "APP_PATH=") {
        $updatedContent += "`nAPP_PATH=`"$gamingHubPathUnix`""
    }
    if ($updatedContent -notmatch "STEAM=") {
        $updatedContent += "`nSTEAM=`"C:/Program Files (x86)/Steam/steamapps/`""
    }
    if ($updatedContent -notmatch "EPIC=") {
        $updatedContent += "`nEPIC=`"com.epicgames.launcher://apps/`""
    }
    if ($updatedContent -notmatch "UPLAY=") {
        $updatedContent += "`nUPLAY=`"uplay://launch/`""
    }
    if ($updatedContent -notmatch "ORIGIN=") {
        $updatedContent += "`nORIGIN=`"origin://launchgame/`""
    }
    if ($updatedContent -notmatch "STANDALONE=") {
        $updatedContent += "`nSTANDALONE=`"STANDALONE`""
    }

    # Salva as atualizações no arquivo
    $updatedContent | Set-Content -Path $envFile
    Write-Host "Variáveis atualizadas no arquivo .env."
}

Write-Host "Script concluído."
