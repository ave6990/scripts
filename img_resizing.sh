#! /bin/bash

add_zeros() {
    local suf=""

    if [ $# -eq 2 ]
    then
        local num_len=$(( $2 - `expr length "$i"` ))
        
        while [ $num_len -gt 0 ]
        do
            suf="0$suf"
            num_len=$(($num_len - 1))
        done

        echo "$suf$1"
    else
        echo "$1"
    fi
}

if [ -d res ]
then
    echo "Directory already exists..."
else
    mkdir res
    echo "Created the directory ./res"
fi

i=1

for file in $(ls ./*.jpg)
do
    str=$( add_zeros $i 4 )
    echo "$str resizing - $file"
    convert -crop 1080x1640+0+400 $file ./res/$str.jpg
    i=$(( $i + 1 ))
done


