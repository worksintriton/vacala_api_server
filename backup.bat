


@echo off
setlocal enableextensions enabledelayedexpansion
REM Creating the folder path for backup
SET "folderPath=%C:\backups\mongodb\%"
REM concatanating year,month and date to the folder path. 2018 march 8 would be 20180308
SET "folderName=%date:~-4,4%%date:~-10,2%%date:~7,2%"
SET "backupFolder=%folderPath%%folderName%"
REM Creating Folder. Folder will be created or overwritten if already exists
MKDIR %backupFolder%
REM Backup files to the folder path
cd C:\Program Files\MongoDB\Server\4.2\bin
mongodump --host localhost --port 27017 -d myvacala
ECHO mongodump completed successfully.