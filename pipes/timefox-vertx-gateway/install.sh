#!/bin/bash

function create_user(){
	groupadd -r $1
	useradd --home-dir /home/$1 -m -s /bin/bash -g $1 -p $2 $1
}

# omit parameter check, no time
userName=$1
passWord=$2
fileName=$3
dirName=${fileName%.tar.gz}
create_user $userName $passWord

# must be quiet to allow single output in 'echo' (no -v flag)
tar -xf $fileName 
mv $dirName /opt/$dirName
chown $userName:$userName /opt/$dirName -R

cat <<EOF > /etc/environment
TIMEFOX_HOME=/opt/$dirName
EOF

source /etc/environment

# Make PATH available in Bash
cat <<EOF > /home/$userName/.bashrc
#!/bin/bash
export PATH="$PATH:$TIMEFOX_HOME/bin"
EOF

# use output for entry in /etc/environment etc..
echo "/opt/$dirName"

exit 0
