@echo off
set GIT=C:\Users\Baylar\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\mingw64\bin\git.exe
set REPO=C:\Users\Baylar\Documents\GitHub\adsouns

%GIT% -C %REPO% add -A
%GIT% -C %REPO% status --short
%GIT% -C %REPO% commit -m "%1"
%GIT% -C %REPO% push
%GIT% -C %REPO% log --oneline -2
echo DONE
