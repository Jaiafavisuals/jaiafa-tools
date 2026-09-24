@echo off
set "DEST=%APPDATA%\Adobe\CEP\extensions\JaiafaTools"
if exist "%DEST%" rmdir /S /Q "%DEST%"
mkdir "%DEST%"
xcopy "%~dp0*" "%DEST%\" /E /I /Y >nul
reg add "HKCU\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
echo Installed Jaiafa Tools to %DEST%
echo Restart Illustrator, then open Window ^> Extensions (Legacy) ^> Jaiafa Tools.
pause
