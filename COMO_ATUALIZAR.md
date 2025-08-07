# 🚀 Como Atualizar o Projeto Home Broker

## Métodos Rápidos de Atualização

### 1. Script Automático (Recomendado)
```bash
# Execute o arquivo update.bat
update.bat
```
- Adiciona todas as mudanças
- Permite você digitar uma mensagem personalizada
- Faz commit e push automaticamente

### 2. Atualização Super Rápida
```bash
# Execute o arquivo quick-update.bat
quick-update.bat
```
- Atualização automática com timestamp
- Ideal para mudanças pequenas

### 3. Comandos Manuais
```bash
# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Sua mensagem aqui"

# Enviar para GitHub
git push
```

## 📋 Checklist Antes de Atualizar

- [ ] Testou as mudanças localmente?
- [ ] Verificou se não há erros no código?
- [ ] Salvou todos os arquivos modificados?

## 🔗 Links Úteis

- **Repositório GitHub**: https://github.com/Daniel-Felix147/Home-Broker-v1
- **Página do Projeto**: [Link do seu projeto]

## 💡 Dicas

1. **Sempre teste localmente** antes de fazer push
2. **Use mensagens descritivas** nos commits
3. **Faça commits frequentes** para não perder trabalho
4. **Verifique o status** com `git status` antes de commitar

## 🆘 Solução de Problemas

### Se der erro de push:
```bash
git pull origin main
git push
```

### Se quiser ver o histórico:
```bash
git log --oneline
```

### Se quiser ver mudanças:
```bash
git diff
```
