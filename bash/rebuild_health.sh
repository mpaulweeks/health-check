./bash/kill_server.sh
rm -rf venv_*

git pull

./install/setup_venv_server.sh
./bash/bg_health.sh
