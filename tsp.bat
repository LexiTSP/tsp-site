@echo off
setlocal enabledelayedexpansion
title TSP Control Panel

set "TSP_DIR=%~dp0"
set "TSP_PORT=3838"

:menu
cls
echo.
echo ===============================================================
echo   TSP Control Panel
echo   %TSP_DIR%
echo ===============================================================
echo.
echo   STATUS
call :show_status
echo.
echo   ACTIONS
echo     [1]  Start server (production, port %TSP_PORT%, all interfaces)
echo     [2]  Start server (dev mode, hot reload)
echo     [3]  Stop server
echo     [4]  Build site (next build)
echo     [5]  Install / update dependencies (bun install)
echo     [6]  Full check (build + tests + server typecheck)
echo     [7]  Clean .next + reinstall (full rebuild)
echo     [8]  Show network URLs
echo     [9]  Run all package tests (SDK + TrustBadge + servers)
echo     [i]  Probe i18n routes (NO + EN — requires running server)
echo     [s]  Fetch sitemap.xml (verify hreflang emit)
echo     [0]  Exit
echo.
set /p choice="Choose: "

if "%choice%"=="1" goto start_prod
if "%choice%"=="2" goto start_dev
if "%choice%"=="3" goto stop_server
if "%choice%"=="4" goto build
if "%choice%"=="5" goto install
if "%choice%"=="6" goto typecheck
if "%choice%"=="7" goto clean_rebuild
if "%choice%"=="8" goto show_urls
if "%choice%"=="9" goto run_tests
if /i "%choice%"=="i" goto probe_i18n
if /i "%choice%"=="s" goto fetch_sitemap
if "%choice%"=="0" goto end
goto menu

:show_status
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%TSP_PORT% " ^| findstr "LISTENING"') do (
    echo     [RUNNING] Server listening on port %TSP_PORT% ^(PID %%a^)
    goto :eof
)
echo     [STOPPED] No process listening on port %TSP_PORT%
goto :eof

:start_prod
cls
echo Starting TSP production server on 0.0.0.0:%TSP_PORT% ...
echo (Build first if you haven't — option 4)
echo.
echo Press CTRL+C to stop, or close this window.
echo.
cd /d "%TSP_DIR%"
bun run next start -H 0.0.0.0 -p %TSP_PORT%
pause
goto menu

:start_dev
cls
echo Starting TSP dev server on 0.0.0.0:%TSP_PORT% (hot reload) ...
echo.
echo Press CTRL+C to stop, or close this window.
echo.
cd /d "%TSP_DIR%"
bun run next dev -H 0.0.0.0 -p %TSP_PORT%
pause
goto menu

:stop_server
cls
echo Stopping any process listening on port %TSP_PORT% ...
echo.
set "killed=0"
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%TSP_PORT% " ^| findstr "LISTENING"') do (
    echo Killing PID %%a
    taskkill /F /PID %%a >nul 2>&1
    set "killed=1"
)
if "!killed!"=="0" (
    echo No process found on port %TSP_PORT%.
) else (
    echo Done.
)
echo.
pause
goto menu

:build
cls
echo Running: bun run next build
echo.
cd /d "%TSP_DIR%"
bun run next build
echo.
pause
goto menu

:install
cls
echo Running: bun install ^(from workspace root^)
echo.
cd /d "%TSP_DIR%"
bun install
echo.
pause
goto menu

:typecheck
cls
echo Running: bun run check
echo.
cd /d "%TSP_DIR%"
bun run check
if %ERRORLEVEL%==0 echo.
if %ERRORLEVEL%==0 echo Full check passed.
echo.
pause
goto menu

:clean_rebuild
cls
echo Cleaning .next, .turbo, node_modules ...
echo.
cd /d "%TSP_DIR%"
if exist ".next" rmdir /s /q ".next"
if exist ".turbo" rmdir /s /q ".turbo"
if exist "node_modules" rmdir /s /q "node_modules"
echo Reinstalling from workspace root ...
echo.
cd /d "%TSP_DIR%"
bun install
echo.
echo Building ...
cd /d "%TSP_DIR%"
bun run next build
echo.
pause
goto menu

:show_urls
cls
echo Network URLs for TSP server (port %TSP_PORT%):
echo.
echo   Local:    http://localhost:%TSP_PORT%
echo.
echo   LAN IPs:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    if not "!ip!"=="127.0.0.1" if not "!ip:~0,7!"=="169.254" (
        echo     http://!ip!:%TSP_PORT%
    )
)
echo.
pause
goto menu

:run_tests
cls
echo Running all package tests ...
echo.
cd /d "%TSP_DIR%"
call bun run test
echo.
pause
goto menu

:probe_i18n
cls
echo Probing i18n routes on http://localhost:%TSP_PORT% ...
echo (Requires the server to be running — option 1 or 2)
echo.
set "ROUTES=/ /core /risk /oversight /evidence /studio /spec /docs /priser /sammenligning /kontakt /whitepaper /endringer /eu-ai-act /eu-ai-act/article-9 /eu-ai-act/article-12 /eu-ai-act/article-13 /eu-ai-act/article-14 /eu-ai-act/article-15 /eu-ai-act/article-17 /iso-42001"
echo PATH^|NO^|EN
echo --------------------------------------------------------------
for %%R in (%ROUTES%) do (
    for /f %%a in ('curl -s -o nul -w "%%{http_code}" "http://localhost:%TSP_PORT%%%R"') do set "no_code=%%a"
    for /f %%b in ('curl -s -o nul -w "%%{http_code}" "http://localhost:%TSP_PORT%/en%%R"') do set "en_code=%%b"
    echo %%R^|!no_code!^|!en_code!
)
echo.
echo Expect 200 on both columns. Anything else = broken locale-routing.
echo.
pause
goto menu

:fetch_sitemap
cls
echo Fetching sitemap.xml from http://localhost:%TSP_PORT% ...
echo (Requires the server to be running)
echo.
curl -s "http://localhost:%TSP_PORT%/sitemap.xml" | findstr /R "loc hreflang"
echo.
echo Expect every URL to have 3 alternate-tags (no, en, x-default).
echo.
pause
goto menu

:end
endlocal
exit /b 0
