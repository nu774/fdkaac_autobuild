@echo off
setlocal
set PATH=%CD%\bin;%CD%\msys\1.0\bin

if exist fdkaac-master.zip del fdkaac-master.zip
wget --no-check-certificate https://raw.github.com/nu774/fdkaac_autobuild/master/files/AppMakefile -O files/AppMakefile
wget --no-check-certificate https://github.com/nu774/fdkaac/archive/master.zip -O fdkaac-master.zip 
if exist fdkaac-master rd /s /q fdkaac-master
unzip fdkaac-master.zip
copy /B files\AppMakefile fdkaac-master\Makefile
copy /B files\config.h fdkaac-master\config.h
pushd fdkaac-master
make install && popd && rd /s /q fdkaac-master
copy /B bin\fdkaac.exe . && del fdkaac-master.zip

endlocal
