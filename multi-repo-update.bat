@echo off
echo ========================================
echo    ATUALIZADOR MULTI-REPOSITORIO
echo ========================================
echo.

echo Repositorios configurados:
git remote -v
echo.

echo 1. Adicionando todas as mudancas...
git add .

echo.
echo 2. Verificando status...
git status

echo.
echo 3. Fazendo commit das mudancas...
set /p commit_msg="Digite a mensagem do commit (ou pressione Enter para usar timestamp): "
if "%commit_msg%"=="" (
    set commit_msg=Update: %date% %time%
)
git commit -m "%commit_msg%"

echo.
echo 4. Enviando para o GitHub...
git push

echo.
echo ========================================
echo    ATUALIZACAO CONCLUIDA!
echo ========================================
pause
