@echo off
setlocal
set PATH=%CD%\bin;%CD%\msys\1.0\bin

if exist fdk-aac-master.zip del fdk-aac-master.zip
wget --no-check-certificate https://github.com/mstorsjo/fdk-aac/archive/master.zip -O fdk-aac-master.zip 
if exist fdk-aac-master rd /s /q fdk-aac-master
unzip fdk-aac-master.zip
copy /B files\Makefile.lib fdk-aac-master\Makefile
pushd fdk-aac-master
make install && popd && rd /s /q fdk-aac-master && del fdk-aac-master.zip

endlocal
