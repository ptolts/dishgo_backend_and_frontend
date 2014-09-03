#!/bin/bash -l
export PATH=/home/phil/.rvm/gems/ruby-2.1-head/bin:/home/phil/.rvm/gems/ruby-2.1-head@global/bin:/home/phil/.rvm/rubies/ruby-2.1-head/bin:/usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/home/phil/bin:/home/phil/.rvm/bin
cd /dishgo
RAILS_ENV=production rake dish_search
# RAILS_ENV=development rake dish_search
