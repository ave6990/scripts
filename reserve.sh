#! /bin/bash
# author: Aleksandr Ermolaev
# e-mail: ave6990@ya.ru
# version: 2023-07-18

DEPARTMENT=9
ENGINEER=61
YEAR=2023
SCAN_DIRECTORY=/media/sf_Y_DRIVE/СКАНЫ\ РЕЗЕРВНОЕ\ КОПИРОВАНИЕ/2023/Ермолаев

if [ ! -d "./scans" ]
then
    mkdir scans
fi

if [ -d "$SCAN_DIRECTORY" ]
then
    echo "Резервное копирование..."
    cp $DEPARTMENT-$ENGINEER-*-$YEAR.pdf "$SCAN_DIRECTORY"/
else
    echo "ВНИМАНИЕ!!! Папка резервного копирования недоступна!"
    echo "Резервное копирование НЕ выполнено!"
fi

mv $DEPARTMENT-$ENGINEER-*-$YEAR.pdf ./scans/

echo "Выполнено!"
