INSTALL
-------

Place these files in some directory (Avoid pathnames containing white spaces or non-ascii characters).
Disk space of 200MB or so is required.

1) Execute install-mingw.bat.
   MinGW and MSYS are installed under current directory.
   Sub directories such as bin, include, lib,... are created.
2) Execute build_libfdk_aac.bat.
3) Execute build_fdkaac.bat.

Finally, you will get fdkaac.exe in the current directory.
You can place it to anyware you want.

If you only need fdkaac.exe and don't need to update it,
you can safely remove other files/directories.
Special uninstallation is not required.

Otherwise, you might want to keep MinGW/MSYS.
In this case, you can skip step 1 on the next time.

If you want to move/rename this directory, you have to execute fstab-fix.bat,
so that will point MinGW/MSYS to the new directory.

If step 1 fails for some reason, you can still manually download 
mingw-get-*-bin.zip from http://sourceforge.net/projects/mingw/files/Installer/mingw-get/, place the donloaded file here, and try running install-mingw.bat again like this:
C:\foo\bar> install-mingw.bat mingw-get-0.6.2-mingw32-beta-20131004-1-bin.zip 
(You have to pass the actual filename of mingw-get-*-bin.zip)
