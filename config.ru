# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)

if ENV['RAILS_ENV'].to_s.eql?('development')

	require 'rack/rewrite'

	use Rack::Rewrite do
	  rewrite   %r{/app/public(.*)},  	'/app/$1'
	  rewrite   %r{/assets/(.*)},  	'/app/assets/$1'
	  rewrite   %r{/fonts/(.*)},  	'/app/fonts/$1'  
	  rewrite   %r{/public/(.*)},  	'/app/assets/$1'  
	  rewrite   %r{.*\/(.*\.png)},  '/app/$1'  
	end 

	map '/app' do
		run Foodcloud::Application
	end

else
	run Foodcloud::Application
end