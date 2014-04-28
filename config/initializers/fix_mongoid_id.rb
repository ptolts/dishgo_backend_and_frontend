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
      if host.blank?
        Rails.logger.warn "MONGOID WARNING: host: #{host.to_s} port: #{port.to_s} timeout: #{timeout.to_s}\noptions: #{options.to_s}"
        @host = "10.128.224.88"
      end
      @sock = if !!options[:ssl]
        Socket::SSL.connect(host, port, timeout)
      else
        Socket::TCP.connect(host, port, timeout)
      end
    end
  end
  class Address
    def resolve(node)
      attempt = 1
      begin
        Timeout::timeout(@timeout) do
          Resolv.each_address(host) do |ip|
            if ip =~ Resolv::IPv4::Regex
              @ip = ip
              break
            end
          end
          raise Resolv::ResolvError unless @ip
        end
        @resolved = "#{ip}:#{port}"
      rescue Timeout::Error, Resolv::ResolvError
        Rails.logger.warn("  MOPED:", "Could not resolve IP for: #{original}", "n/a")
        node.down! and false
      rescue SocketError
        if attempt <= 3
          Rails.logger.warn("  MOPED:", "Retrying DNS Resolv for: #{original}, Retry: #{attempt}", "n/a")
          attempt += 1
          retry
        end
        Rails.logger.warn("  MOPED:", "Could not resolve IP for: #{original}", "n/a")
        node.down! and false
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