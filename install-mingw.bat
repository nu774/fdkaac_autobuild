@echo off
cscript //E:jscript install-mingw.js %*
pushd bin
if not exist cc.exe fsutil hardlink create cc.exe gcc.exe
if not exist mingw32-cc.exe fsutil hardlink create mingw32-cc.exe mingw32-gcc.exe
popd bin
