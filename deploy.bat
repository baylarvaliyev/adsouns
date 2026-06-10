@echo off
set GIT=C:\Users\Baylar\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\mingw64\bin\git.exe
set REPO=C:\Users\Baylar\Documents\GitHub\adsouns

echo === Adding all files ===
%GIT% -C %REPO% add -A

echo === Committing ===
%GIT% -C %REPO% commit -m "Fix: Lenis removed, English blogs x9, blog index EN, touchpad lag fixed"

echo === Pushing ===
%GIT% -C %REPO% push

echo === Done ===
%GIT% -C %REPO% log --oneline -3
