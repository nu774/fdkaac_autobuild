@echo off
setlocal
set PATH=%CD%\bin;%CD%\msys\1.0\bin

if exist fdk-aac-master.zip del fdk-aac-master.zip
wget --no-check-certificate https://raw.github.com/nu774/fdkaac_autobuild/master/files/LibMakefile -O files/LibMakefile
wget --no-check-certificate https://github.com/mstorsjo/fdk-aac/archive/master.zip -O fdk-aac-master.zip 
if exist fdk-aac-master rd /s /q fdk-aac-master
unzip fdk-aac-master.zip
copy /B files\LibMakefile fdk-aac-master\Makefile
copy /B files\libfdk-aac.version fdk-aac-master\libfdk-aac.version
pushd fdk-aac-master
make install && popd && rd /s /q fdk-aac-master && del fdk-aac-master.zip

endlocal
