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