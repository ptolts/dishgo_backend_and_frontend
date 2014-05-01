# Load the rails application
require File.expand_path('../application', __FILE__)
ENV["GMAIL_DOMAIN"] = "dishgo.io"
ENV["GMAIL_USERNAME"] = "phil@dishgo.io"
ENV["GMAIL_PASSWORD"] = "eP5isi7bwB"

if ENV['RAILS_ENV'].to_s.eql?('development')
	ENV['FB_APP_ID'] = "486274818139008"
	ENV['FB_APP_SECRET'] = "3443ea7df4e23f6dace2a93eb5cc8f50"
else
	ENV['FB_APP_ID'] = "484621004971056"
	ENV['FB_APP_SECRET'] = "418685312c9717fc643646e9943660a4"
end

Foodcloud::Application.initialize!
