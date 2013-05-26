@echo off

rem ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
rem ;; WebReflection YUI Compressor Batch Manager ;;
rem ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

rem ;; Block Execution If Called Directly
if not defined YUI_BUILD_NAME (
    echo.Warning: This file should not be called directly
    pause>nul
    exit
)

rem ;; Set --no-mounge Only If Necessary
if "%YUI_NO_MUNGE%"=="1" (
    if "%YUI_TYPE%"=="js" set YUI_NOMUNGE=--nomunge
    if not "%YUI_TYPE%"=="js" set YUI_NOMUNGE=
)
if not "%YUI_NO_MUNGE%"=="1" set YUI_NOMUNGE=

rem ;; Set A Delimiter Between Files If Type Is js
if "%YUI_TYPE%"=="js" set YUI_DELIM=;

rem ;; Start Script Execution
goto show_summary

:build_minified_version
    rem ;; After The Unique Big File Has Been Created Creates The Single Compressed One
    echo.
    echo   Creating build
    echo.
    java -jar "%YUI_FOLDER%\yuicompressor-%YUI_COMPRESSOR_VERSION%.jar" --charset=UTF-8 --type=%YUI_TYPE% %YUI_NOMUNGE% "%YUI_FOLDER%\full.%YUI_TYPE%" -o "%YUI_FOLDER%\min.%YUI_TYPE%"
    echo  ____________________________________
    echo.
    if "%YUI_DEBUG%"=="1" pause>nul
    goto copy_and_remove

:check_utf8_bom
    rem ;; Checks If There Is The UTF-8 Bom At The Beginning Of The File
    set /p firstLine=<%YUI_FOLDER%\tmp
    if "%firstLine:~0,3%"=="%~1" call:create_utf8bom_free_file
    goto:eof

:copy_and_remove
    rem ;; Merge With An Header The Compressed File. Move Files Into Destination Folder
    echo.
    echo   Copying and removing files
    echo.
    echo./** %YUI_BUILD_NAME% - %DATE% %TIME% */>"%YUI_FOLDER%\%YUI_BUILD_NAME%.min.%YUI_TYPE%"
    TYPE "%YUI_FOLDER%\min.%YUI_TYPE%">>"%YUI_FOLDER%\%YUI_BUILD_NAME%.min.%YUI_TYPE%"
    rem ;; NOTE: If Files Are Not Present This Command May Ask If It Is A File Or A Directory - Please Press F
    rem ;; NOTE: If Files Were Present This Command Forces Overwrites (In Visual Studio Solution Folders As Well)
    xcopy /Y /V /R /Q /Z "%YUI_FOLDER%\%YUI_BUILD_NAME%.min.%YUI_TYPE%" "%YUI_FOLDER_DEST%\%YUI_BUILD_NAME%.min.%YUI_TYPE%"
    xcopy /Y /V /R /Q /Z "%YUI_FOLDER%\full.%YUI_TYPE%" "%YUI_FOLDER_DEST%\%YUI_BUILD_NAME%.debug.%YUI_TYPE%"
    del "%YUI_FOLDER%\min.%YUI_TYPE%"
    del "%YUI_FOLDER%\full.%YUI_TYPE%"
    del "%YUI_FOLDER%\%YUI_BUILD_NAME%.min.%YUI_TYPE%"
    echo  ____________________________________
    echo.
    if "%YUI_DEBUG%"=="1" pause>nul
    goto end_procedure

:create_utf8bom_free_file
    rem ;; Remove UTF-8 BOM From "tmp" File o Avoid Problems During Interpretation
    type %YUI_FOLDER%\tmp>%YUI_FOLDER%\tmp.bom
    for /f "delims=" %%G in (%YUI_FOLDER%\tmp.bom) do (
        if defined i echo.%%G>>%YUI_FOLDER%\tmp
        if not defined i (
            call:remove_utf8_bom "%%G"
            set i=1
        )
    )
    del %YUI_FOLDER%\tmp.bom
    goto:eof

:end_procedure
    rem ;; Hopefully Everything Is OK - It Is Time To Exit
    echo.
    echo   Done
    echo  ____________________________________
    if "%YUI_DEBUG%"=="1" pause>nul
    exit

:remove_utf8_bom
    rem ;; Called From create_utf8bom_free_file Function Create The File Without The BOM In The First line
    set fl=%~1
    echo %fl:~3,-1%%fl:~-1%>"%YUI_FOLDER%\tmp"
    goto:eof

:show_file_list_and_append_content
    rem ;; Performs Checks For Each File In The List
    echo.
    echo   File Analysis
    echo  ------------------------------------
    set /p bom=<%YUI_FOLDER%\bom
    for /f "delims=" %%G in (%YUI_FILE_LIST%) do (
        if defined YUI_FOLDER_SOURCE (
            echo   %%G
            type "%YUI_FOLDER_SOURCE%\%%G">"%YUI_FOLDER%\tmp"
        )
        if not defined YUI_FOLDER_SOURCE (
            echo   %%G [%%~zG]
            type "%%G">"%YUI_FOLDER%\tmp"
        )
        call:check_utf8_bom %bom%
        if "%YUI_DEBUG%"=="1" (
            java -jar "%YUI_FOLDER%\yuicompressor-%YUI_COMPRESSOR_VERSION%.jar" --charset=UTF-8 --type=%YUI_TYPE% %YUI_NOMUNGE% "%YUI_FOLDER%\tmp" -o "%YUI_FOLDER%\tmp.min"
            del "%YUI_FOLDER%\tmp.min"
            if not "%errorlevel%"=="0" (
                echo.Warning: Errors during compression
                pause>nul
                del "%YUI_FOLDER%\tmp"
                exit
            )
        )
        TYPE "%YUI_FOLDER%\tmp">>"%YUI_FOLDER%\full.%YUI_TYPE%"
        del "%YUI_FOLDER%\tmp"
        if defined YUI_DELIM echo.%YUI_DELIM%>>"%YUI_FOLDER%\full.%YUI_TYPE%"
    )
    echo  ____________________________________
    echo.
    if "%YUI_DEBUG%"=="1" pause>nul
    goto build_minified_version

:show_summary
    rem ;; Initial Screen Mit Style License Please Do Not Remove My Credits
    echo  ____________________________________
    echo.
    echo  (C) Andrea Giammarchi @WebReflection
    echo       YUI Batch Build System V 1.0
    echo.
    echo  ------------------------------------
    echo   %YUI_BUILD_NAME%
    echo  ------------------------------------
    echo   Date         %DATE% %TIME%
    echo   Type         %YUI_TYPE%
    echo   Place        %YUI_FOLDER%
    echo   Destination  %YUI_FOLDER_DEST%
    echo   List         %YUI_FILE_LIST%
    if "%YUI_DEBUG%"=="1" (echo   Debug        ON)
    if not "%YUI_DEBUG%"=="1" (echo   Debug        OFF)
    echo  ____________________________________
    echo.
    if "%YUI_DEBUG%"=="1" pause>nul
    goto show_file_list_and_append_content

rem ;; Enjoy Your Compressed File - Thank You YUICompressor