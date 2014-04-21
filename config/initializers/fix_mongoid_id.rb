module BSON
  class ObjectId   
    def to_json
      self.to_s.to_json
    end
    def as_json(options = {})
      self.to_s.as_json
    end     
  end
end

module Moped
	class Connection
		def connect
			Rails.logger.warn "host: #{host.to_s} port: #{port.to_s} timeout: #{timeout.to_s}\noptions: #{options.to_s}"
			@sock = if !!options[:ssl]
		        Socket::SSL.connect(host, port, timeout)
		    else
		        Socket::TCP.connect(host, port, timeout)
		    end
    	end
    end
end

# module Paperclip
#   class Attachment
#     def hash_key(style_name = default_style)
#       raise ArgumentError, "Unable to generate hash without :hash_secret" unless @options[:hash_secret]
#       # require 'openssl' unless defined?(OpenSSL)
#       # data = interpolate(@options[:hash_data], style_name)
#       # OpenSSL::HMAC.hexdigest(OpenSSL::Digest.const_get(@options[:hash_digest]).new, @options[:hash_secret], data)
#       Digest::SHA1.hexdigest(@options[:hash_secret].to_s + @options[:hash_data].to_s + style_name.to_s)    
#     end
#   end
# end

if ENV['RAILS_ENV'].to_s.eql?('development')
  Rails.logger.warn("Faking Locs.")
  Restaurant.each do |r|
    if r.locs.nil?
      r.locs = [-74.155815,45.458972]
    end
    if r.lat.nil?
      r.lat = 45.458972
      r.lon = -74.155815
    end
    r.save
  end
end