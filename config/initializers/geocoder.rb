# config/initializers/geocoder.rb
Geocoder.configure(

  # geocoding service (see below for supported options):
  :lookup => :google,

  # IP address geocoding service (see below for supported options):
  ip_lookup: :maxmind_local, 

  maxmind_local: {file: File.join(Rails.root, 'GeoLiteCity.dat')},

  # to use an API key:
  # :api_key => "...",

  # geocoding service request timeout, in seconds (default 3):
  :timeout => 2,

  # set default units to kilometers:
  :units => :km,

  # caching (see below for details):
  # :cache => Redis.new,
  # :cache_prefix => "..."

)