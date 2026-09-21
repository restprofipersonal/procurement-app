# Скрипт для запуска приложения с ngrok туннелем

Write-Host "🚀 Запуск приложения с ngrok..." -ForegroundColor Green
Write-Host ""

# Проверяем, запущен ли уже npm сервер
$npmProcess = Get-Process node -ErrorAction SilentlyContinue
if ($npmProcess) {
    Write-Host "✅ npm сервер уже запущен (PID: $($npmProcess.Id))"
} else {
    Write-Host "⏳ Запускаю npm сервер..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Minimized
    Start-Sleep -Seconds 8
}

Write-Host ""
Write-Host "⏳ Запускаю ngrok туннель на порту 5173..." -ForegroundColor Yellow
Write-Host ""

# Запускаем ngrok
& ".\ngrok.exe" http 5173 --log=stdout

Write-Host ""
Write-Host "⚠️  Скопируйте URL выше и откройте его в браузере на другом устройстве" -ForegroundColor Cyan
Write-Host "💡 Ссылка меняется каждый раз при перезапуске" -ForegroundColor Cyan
Write-Host ""
Write-Host "Нажмите Ctrl+C для остановки"
