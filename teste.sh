counter=0
while true; do
    printf $counter
    counter=$((counter+1))
    if [ "$counter" -gt "9" ]; then
        break
    fi
    sleep 1
done