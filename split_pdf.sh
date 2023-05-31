#! /bin/bash
# author: Aleksandr Ermolaev
# version: 2023-05-31

DEPARTMENT=9
ENGINEER=61
YEAR=2023
DENSITY=250
DEPTH=4

source_file=$1
pages_count=`identify -format "%n\n" $source_file | head -1`
let "files_count=$pages_count / $2" 
let "pages_in_out_files=$2"

if [ $# -lt 3 ]
then
    number=1
else
    let "start_number=$3"
fi

if [ $# -lt 4 ]
then
    direction=1
else
    direction=-1
fi

echo "Страниц в исходном документе: $pages_count"
echo "Страниц в протоколе: $pages_in_out_files"
echo "Документов: $files_count"

for ((a=pages_in_out_files-1; a<=pages_count; a=a+pages_in_out_files ))
do
    let "s=$a-$pages_in_out_files+1"
    echo "Обработка страниц $s-$a..."
    convert -density $DENSITY -depth $DEPTH $source_file[$s-$a] $DEPARTMENT-$ENGINEER-$start_number-$YEAR.pdf
    let "start_number=$start_number+$direction"
done

echo "Выполнено!"
