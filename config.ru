# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
require 'rack/rewrite'

use Rack::Rewrite do
  rewrite   %r{/assets/(.*)},  '/app/assets/$1'
  rewrite   %r{/fonts/(.*)},  '/app/fonts/$1'  
  rewrite   %r{/public/(.*)},  '/app/assets/$1'  
end 

map '/app' do
	run Foodcloud::Application
end
