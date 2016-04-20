@echo off
cscript //E:jscript install-mingw.js %*
pushd bin
if not exist cc.exe copy /B gcc.exe cc.exe
if not exist mingw32-cc.exe copy /B mingw32-gcc.exe mingw32-cc.exe
popd bin
