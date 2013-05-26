@echo off
rem ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
rem ;; yuibompressor.bat configuration file       ;;
rem ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

rem ;; pause program execution or each main step [1/0]
set YUI_DEBUG=0

rem ;; specify the project type [js/css]
set YUI_TYPE=js

rem ;; your project name. will produce two files
rem ;; projectname.min.[js/css]
rem ;; projectname.debug.[js/css]
rem ;; debug version is a single big file not compressed
set YUI_BUILD_NAME=app

rem ;; where are yuicompressor-ver.jar and bom file
::set YUI_FOLDER=..
set YUI_FOLDER=..\compression

rem ;; a txt file with a list of files to include in the project
rem ;; NOTE: the file order is preserved
rem ;; NOTE: if YUI_FOLDER_SOURCE is not set each file must have an absolute path
::set YUI_FILE_LIST=..\vice-versa\file-list.txt
set YUI_FILE_LIST=yuic-js-fileslist.txt

rem ;; where to put min and debug version of the project
set YUI_FOLDER_DEST=..\..\dist\js

rem ;; where are files specified in the list
rem ;; NOTE: if files in the list have absolute path please remove this variable
rem ;;       writing "rem" instead of "set" as prefix
set YUI_FOLDER_SOURCE=..\..\libs

rem ;; specify if you do not want to munge file (obfuscation)
rem ;; NOTE: YUICompressor is a great tool but sometimes it could have some problem with munge option
set YUI_NO_MUNGE=1

rem ;; yuicompressor jar file version
rem ;; NOTE: this variable is used as yuicompressor-%YUI_COMPRESSOR_VERSION%.jar
rem ;;       please be sure that jar file respects this naming convention
rem ;; EXAMPLE: yuicompressor-2.4.2.jar
set YUI_COMPRESSOR_VERSION=2.4.7

rem ;; at this point is possible to call the yuibompressor file
call yuibompressor.bat

