#git pull
#sleep 1
#pidof node | xargs kill
#npm update
pkill node
export NODE_ENV=production;
nohup node app.js &
#forever start -a -l forever.log -o out.log -e err.log app.js
