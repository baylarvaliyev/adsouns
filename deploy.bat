@echo off
set GIT=C:\Users\Baylar\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\mingw64\bin\git.exe
set REPO=C:\Users\Baylar\Documents\GitHub\adsouns
del /f /q %REPO%\fix_links.py 2>nul
%GIT% -C %REPO% add -A
%GIT% -C %REPO% status --short
%GIT% -C %REPO% commit -m "Fix-calc: root EN pages use / not /en/, no AZ links in EN nav"
%GIT% -C %REPO% push
%GIT% -C %REPO% log --oneline -4
echo DONE
