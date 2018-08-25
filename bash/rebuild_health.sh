./bash/kill_server.sh
rm -rf venv_*

git pull

./install/setup_venv.sh
./bg_health.sh
