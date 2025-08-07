@echo off
echo Atualizando projeto...
git add .
git commit -m "Quick update: %date% %time%"
git push
echo Atualizacao concluida!
