# Load the rails application
require File.expand_path('../application', __FILE__)
ENV["GMAIL_DOMAIN"] = "dishgo.io"
ENV["GMAIL_USERNAME"] = "phil@dishgo.io"
ENV["GMAIL_PASSWORD"] = "eP5isi7bwB"
Foodcloud::Application.initialize!
