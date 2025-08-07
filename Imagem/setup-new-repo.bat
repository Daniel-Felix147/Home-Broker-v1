@echo off
echo ========================================
echo    CONFIGURADOR DE NOVO REPOSITORIO
echo ========================================
echo.

echo 1. Inicializando Git...
git init

echo.
echo 2. Adicionando todos os arquivos...
git add .

echo.
echo 3. Fazendo commit inicial...
git commit -m "Initial commit"

echo.
echo 4. Configurando branch main...
git branch -M main

echo.
echo 5. Configurando repositorio remoto...
set /p repo_url="Digite a URL do repositorio GitHub: "
git remote add origin %repo_url%

echo.
echo 6. Enviando para o GitHub...
git push -u origin main

echo.
echo 7. Copiando scripts de atualizacao...
copy update.bat . >nul 2>&1
copy quick-update.bat . >nul 2>&1

echo.
echo ========================================
echo    REPOSITORIO CONFIGURADO!
echo ========================================
echo.
echo Para atualizar no futuro, use:
echo - update.bat (com mensagem personalizada)
echo - quick-update.bat (atualizacao rapida)
echo.
pause
