@echo off
cscript //E:jscript install-mingw.js %*
pushd bin
if not exist cc.exe copy /B cc.exe gcc.exe
if not exist mingw32-cc.exe copy /B mingw32-cc.exe mingw32-gcc.exe
popd bin
