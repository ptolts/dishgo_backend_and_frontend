#!/bin/sh
git pull
RAILS_ENV=production rake assets:precompile
sudo service nginx restart
RAILS_ENV=production bin/delayed_job stop
RAILS_ENV=production bin/delayed_job start
tail -f log/production.log